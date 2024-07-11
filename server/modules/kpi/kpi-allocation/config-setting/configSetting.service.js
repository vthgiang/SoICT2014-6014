const Models = require(`../../../../models`);
const {
  AllocationConfigSetting,
  OrganizationalUnit,
  OrganizationalUnitKpi,
  OrganizationalUnitKpiSet,
  EmployeeKpi,
  AllocationUnitResult,
  TaskTemplate,
  AllocationTaskAssigned,
} = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const axios = require('axios');
const rabbitMq = require('../../../../rabbitmq/client');
const listRpcQueue = require('../../../../rabbitmq/listRpcQueue');

// /**
//  * Get config setting data base company id
//  * @param {*} company_id
//  * @param {*} portal
//  */
const getConfigSettingData = async (company_id, portal) => {
  const result = await rabbitMq.gRPC('kpiService.getConfigSettingData', JSON.stringify({ company_id, portal }), listRpcQueue.KPI_SERVICE);
  return JSON.parse(result);
};

const updateConfigSettingData = async (id, payload, portal) => {
  const result = await AllocationConfigSetting(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const handleStartAllocation = async (portal, kpiData, numberGeneration, solutionSize) => {
  try {
    const payload = await rabbitMq.gRPC('kpiService.handleStartAllocation', JSON.stringify({ portal, kpiData }), listRpcQueue.KPI_SERVICE);
    const parsePayload = JSON.parse(payload);

    const response = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/kpi_allocation/`, {
      ...parsePayload,
      number_improvisations: numberGeneration,
      number_hms: solutionSize,
    });

    return {
      responseOutput: response.data,
      payload: JSON.parse(payload),
    };
  } catch (error) {
    console.log(error)
    console.error('Error fetching data from API:', error.message);
  }
};

const handleStartAssignAllocation = async (portal, responseServerOutput, responseInput, userDetail, listUnitKpiWeight, stringDate) => {
  try {
    const { listEnterpriseUnit, listResource, listEnterpriseGoal } = responseInput;
    const { list_unit_kpi, list_resource_kpi, list_task } = responseServerOutput.content;
    const [year, month] = stringDate.split('-').map(Number);
    const createdDate = new Date(year, month - 1, 1); // Note: Months are zero-indexed

    const parseDateString = (dateString) => {
      const [day, month, year, time] = dateString.split(/[- :]/);
      const formattedDateString = `${year}-${month}-${day}T${time}:00`;
      return new Date(formattedDateString);
    };

    // create unit KPI
    const enterpriseUnitKpiObject = await Promise.all(
      listEnterpriseUnit.map(async (unit) => {
        const unitResource = listResource.filter((item) => item.company_unit_object_id === unit._id);
        const employeeImportance = unitResource.map((item) => {
          return {
            employee: new ObjectId(item.employee_id),
            importance: 100,
          };
        });
        const unitKpi = listUnitKpiWeight.filter((item) => item.value === unit._id);
        const allocationUnitKpi = list_unit_kpi.filter((item) => item.unit_id === unit.id);

        const kpis = await Promise.all(
          unitKpi[0].kpis.map(async (unitMetric) => {
            const allocationUnitKpiItem = allocationUnitKpi[0].unit_list_metric.filter((item) => item.description === unitMetric.name)[0];
            const unitKpiCreated = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).create({
              name: unitMetric.name,
              parent: unitMetric._id,
              weight: unitMetric.kpiWeight,
              criteria: unitMetric.criteria,
              type: unitMetric.type,
              automaticPoint: 0,
              employeePoint: 0,
              approvedPoint: 0,
              target: allocationUnitKpiItem?.planed_value ? allocationUnitKpiItem.planed_value : null,
              unit: unitMetric.unit,
            });
            return unitKpiCreated._id;
          })
        );

        const unitKpiSetObject = await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).create({
          organizationalUnit: new ObjectId(unit._id),
          creator: new ObjectId(userDetail._id),
          date: createdDate,
          kpis,
          automaticPoint: 0,
          employeePoint: 0,
          approvedPoint: 0,
          status: 1,
          employeeImportances: employeeImportance,
          organizationalUnitImportances: [],
        });

        // Populate the kpis field to get the full KPI objects
        const populatedUnitKpiSetObject = await unitKpiSetObject.populate('kpis').execPopulate();

        return populatedUnitKpiSetObject;
      })
    );

    // create employee kpi and task
    await Promise.all(
      listEnterpriseUnit.map(async (unit) => {
        const unitResource = listResource.filter((item) => item.company_unit_object_id === unit._id);

        // each resource kpi
        const listCurrentUnitResourceKpi = unitResource.map(async (item) => {
          const itemKpi = list_resource_kpi.filter((resource_kpi) => resource_kpi.resource_employee_user_id === item.employee_user_id);
          const unitKpi = enterpriseUnitKpiObject.filter(
            (enterpriseUnitKpi) => enterpriseUnitKpi.organizationalUnit.toString() === item.company_unit_object_id
          );

          const kpis = await Promise.all(
            unitKpi[0].kpis.map(async (unitMetricDetail) => {
              const resourceKpiDetail = itemKpi[0].metric_resource.filter((item) => item.description === unitMetricDetail.name);
              const unitKpiResourceCreated = await EmployeeKpi(connect(DB_CONNECTION, portal)).create({
                name: unitMetricDetail.name,
                parent: unitMetricDetail._id,
                weight: unitMetricDetail.weight,
                criteria: unitMetricDetail.criteria,
                status: 1,
                type: unitMetricDetail.type,
                automaticPoint: 0,
                employeePoint: 0,
                approvedPoint: 0,
                unit: unitMetricDetail.unit,
                target: resourceKpiDetail.length !== 0 ? resourceKpiDetail[0].planed_value : null,
              });
              return unitKpiResourceCreated;
            })
          );

          return {
            assigner: new ObjectId(itemKpi[0].resource_employee_user_id),
            kpis,
          };
        });

        const unitResourceTask = list_task.filter((item) => item.resource_company_unit_object_id === unit._id);

        const organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ _id: unit._id });

        const taskEmployeeIds = await Promise.all(
          unitResourceTask.map(async (item) => {
            const taskTemplate = await TaskTemplate(connect(DB_CONNECTION, portal)).find({
              name: item.task_type,
              organizationalUnit: new ObjectId(item.resource_company_unit_object_id),
            });

            const task_employee = await AllocationTaskAssigned(connect(DB_CONNECTION, portal)).create({
              requestToCloseTask: {
                requestStatus: 0,
                createdAt: parseDateString(item.task_end_date),
              },
              priority: 3,
              isArchived: false,
              responsibleEmployees: [new ObjectId(item.resource_employee_user_id)],
              progress: 0,
              point: -1,
              organizationalUnit: new ObjectId(item.resource_company_unit_object_id),
              collaboratedWithOrganizationalUnits: [],
              name: item.task_description,
              description: '',
              startDate: parseDateString(item.task_start_date),
              endDate: parseDateString(item.task_end_date),
              taskTemplate: new ObjectId(taskTemplate[0]._id),
              level: 1,
              isAutomaticallyCreated: true,
              taskTarget: item.resource_task_weight,
              taskUnit: item.task_unit,
            });
            return task_employee._id;
          })
        );

        await AllocationUnitResult(connect(DB_CONNECTION, portal)).create({
          organizationalUnit: new ObjectId(unit._id),
          // KPI
          kpiEmployee: await Promise.all(listCurrentUnitResourceKpi),
          // task
          taskEmployeeIds: taskEmployeeIds,
          isAssignToEmployee: false,
        });
      })
    );

    // update kpi
    const organizationalUnitFirst = await OrganizationalUnit(connect(DB_CONNECTION, portal))
      .find({ _id: listEnterpriseUnit[0]._id })
      .populate('parent');
    const parentUnitId = organizationalUnitFirst[0].parent._id;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59); // Note: month is zero-indexed, so month is `month - 1`
    const startOfMonthIso = startOfMonth.toISOString();
    const endOfMonthIso = endOfMonth.toISOString();

    await OrganizationalUnitKpiSet(connect(DB_CONNECTION, portal)).findOneAndUpdate(
      { organizationalUnit: parentUnitId, date: { $gte: startOfMonthIso, $lte: endOfMonthIso } },
      { status: 1 }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getConfigSettingData,
  updateConfigSettingData,
  handleStartAllocation,
  handleStartAssignAllocation,
};
