const Models = require('../../../../models');
const {
  AllocationConfigSetting,
  UserRole,
  OrganizationalUnit,
  Employee,
  OrganizationalUnitKpi,
  OrganizationalUnitKpiSet,
  EmployeeKpi,
  AllocationUnitResult,
  TaskTemplate,
  AllocationTaskAssigned,
} = Models;
const { connect } = require('../../../../helpers/dbHelper');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const axios = require('axios');

// /**
//  * Get config setting data base company id
//  * @param {*} company_id
//  * @param {*} portal
//  */
const getConfigSettingData = async (company_id, portal) => {
  const companyConfigSetting = await AllocationConfigSetting(connect(DB_CONNECTION, portal)).find({ company: new ObjectId(company_id) });
  return companyConfigSetting;
};

const updateConfigSettingData = async (id, payload, portal) => {
  const result = await AllocationConfigSetting(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const handleStartAllocation = async (portal, kpiData) => {
  try {
    // format listEnterpriseGoal data
    const listEnterpriseGoal = kpiData[0].kpis
      .filter((item) => item.target !== null)
      .map((kpi, index) => {
        return {
          id: index + 1,
          description: kpi.name,
          planed_value: kpi.target,
          unit: kpi.unit,
          success_criteria: kpi.criteria,
        };
      });

    // format listEnterpriseUnit
    const listEnterpriseUnit = await Promise.all(
      kpiData.map(async (item, index) => {
        const organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ _id: item.value });
        const getAllIds = (item) => {
          const { deputyManagers, employees } = item;
          return [...deputyManagers, ...employees];
        };
        const listEmployee = await UserRole(connect(DB_CONNECTION, portal)).find({ roleId: { $in: getAllIds(organizationalUnit[0]) } });

        return {
          id: index + 1,
          _id: item.value,
          unit: item.text,
          num_employee: listEmployee.length,
        };
      })
    );

    // format listResource
    const listRawResult = await Promise.all(
      listEnterpriseUnit.map(async (item) => {
        const organizationalUnit = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ _id: item._id });
        const getAllIds = (item) => {
          const { deputyManagers, employees } = item;
          return [...deputyManagers, ...employees];
        };
        const listUser = await UserRole(connect(DB_CONNECTION, portal))
          .find({ roleId: { $in: getAllIds(organizationalUnit[0]) } })
          .populate([{ path: 'userId' }]);

        const listFullEmployee = await Promise.all(
          listUser.map(async (item) => {
            const email = item.userId.email;
            const employee = await Employee(connect(DB_CONNECTION, portal))
              .findOne({ emailInCompany: email })
              .populate('certificates.certificate')
              .populate('degrees.major');
            return {
              employeeDetail: employee,
              employee_user_id: item.userId._id,
            };
          })
        );

        const results = listFullEmployee.map((employee) => {
          // Calculate mean score for certificates
          const certificateScores = employee.employeeDetail.certificates.map((cert) => cert.certificate?.score);
          const validCertificateScores = certificateScores.filter((score) => typeof score === 'number');
          const meanCertificateScore = validCertificateScores.length
            ? validCertificateScores.reduce((acc, score) => acc + score, 0) / validCertificateScores.length
            : 0;

          // Calculate mean score for majors
          const majorScores = employee.employeeDetail.degrees.map((degree) => degree.major?.score);
          const validMajorScores = majorScores.filter((score) => typeof score === 'number');
          const meanMajorScore = validMajorScores.length ? validMajorScores.reduce((acc, score) => acc + score, 0) / validMajorScores.length : 0;

          return {
            name: employee.employeeDetail.fullName,
            employee_id: employee.employeeDetail._id,
            company_unit_id: item.id,
            company_unit_object_id: item._id,
            score: (meanCertificateScore + meanMajorScore) / 2,
            employee_user_id: employee.employee_user_id,
          };
        });

        return results;
      })
    );

    const listResource = listRawResult
      .flat()
      .sort((a, b) => a.company_unit_id - b.company_unit_id)
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));

    // format listTask
    const listTask = kpiData
      .map((item) => {
        const splitTaskTemplate = item.taskTemplates.flatMap((item) =>
          item.listMappingTask.map((task) => ({
            ...item,
            ...task,
            listMappingTask: undefined, // Remove the original listMappingTask array
            task_id: task._id, // Rename _id to task_id
            _id: item._id, // Ensure the original _id of the item is preserved
          }))
        );

        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0];
        };

        const formattedTask = splitTaskTemplate.map((item) => {
          const metric_detail = listEnterpriseGoal.find((goalItem) => goalItem.description === item.organizationalUnitKpi.name);
          const company_unit_detail = listEnterpriseUnit.find((unitItem) => unitItem._id === item.organizationalUnit);

          return {
            // task_id: 1,
            task_type: item.name,
            task_template_id: item._id,
            description: item.taskName,
            metric_id: metric_detail.id,
            metric_name: item.organizationalUnitKpi.name,
            value: item.target,
            unit: item.unit,
            weight: parseInt(item.taskWeight) / 100,
            start_date: formatDate(item.startDate),
            end_date: formatDate(item.endDate),
            duration: item.durations,
            company_unit_id: company_unit_detail.id,
            affected_factor: item.affected_factor,
          };
        });

        return formattedTask;
      })
      .flat()
      .map((item, index) => ({
        ...item,
        task_id: index + 1,
      }));

    // format listEnvironmentTaskScore
    const listEnvironmentTaskScore = listTask.map((item) => {
      const affected_factor_env = item.affected_factor.find((value) => value.affected_factor_type === 'Environment');
      return {
        task_id: item.task_id,
        mean_score: affected_factor_env.score,
      };
    });

    // format listProductTaskScore
    const listProductTaskScore = listTask.map((item) => {
      const affected_factor_product = item.affected_factor.find((value) => value.affected_factor_type === 'Product');
      return {
        task_id: item.task_id,
        mean_score: affected_factor_product.score,
      };
    });

    // format listGoalUnitWeight
    const listGoalUnitWeight = kpiData
      .map((item) => {
        const unitDetail = listEnterpriseUnit.find((val) => val.unit === item.text);
        return item.kpis.map((kpi) => {
          const kpiDetail = listEnterpriseGoal.find((val) => val.description === kpi.name);
          if (kpiDetail !== undefined)
            return {
              goal_id: kpiDetail.id,
              company_unit_id: unitDetail.id,
              weight: parseInt(kpi.kpiWeight) / 100,
            };
        });
      })
      .flat()
      .filter((item) => item !== undefined)
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));

    // format listTaskTypeExp
    const rawTaskTypeWithUnit = kpiData
      .map((item) => {
        const splitTaskTemplate = item.taskTemplates.flatMap((item) =>
          item.listMappingTask.map((task) => ({
            ...item,
            ...task,
            listMappingTask: undefined, // Remove the original listMappingTask array
            task_id: task._id, // Rename _id to task_id
            _id: item._id, // Ensure the original _id of the item is preserved
          }))
        );

        const formattedTaskTemplate = splitTaskTemplate.map((item) => {
          const company_unit_detail = listEnterpriseUnit.find((unitItem) => unitItem._id === item.organizationalUnit);

          return {
            company_unit_id: company_unit_detail.id,
            task_type: item.name,
          };
        });

        return formattedTaskTemplate;
      })
      .flat();

    const removeDuplicates = (items) => {
      const uniqueItemsMap = new Map();

      items.forEach((item) => {
        if (item) {
          // Ensure the item is not undefined or null
          const key = `${item.company_unit_id}-${item.task_type}`;
          if (!uniqueItemsMap.has(key)) {
            uniqueItemsMap.set(key, item);
          }
        }
      });

      return Array.from(uniqueItemsMap.values());
    };

    const newTaskTypeWithUnit = removeDuplicates(rawTaskTypeWithUnit);

    const listTaskTypeExp = newTaskTypeWithUnit
      .map((item) => {
        return listResource.map((resource) => {
          return {
            ...item,
            resource_id: resource.id,
            experience_points: Math.floor(Math.random() * (100 - 70 + 1)) + 70,
          };
        });
      })
      .flat()
      .map((item, index) => ({
        ...item,
        id: index + 1,
      }));

    const payload = {
      listEnterpriseGoal,
      listEnterpriseUnit,
      listResource,
      listTask,
      listEnvironmentTaskScore,
      listProductTaskScore,
      listGoalUnitWeight,
      listTaskTypeExp,
    };

    return payload
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
};

const handleStartAssignAllocation = async (portal, responseServerOutput, responseInput, userDetail, listUnitKpiWeight) => {
  try {
    const { listEnterpriseUnit, listResource, listEnterpriseGoal } = responseInput;
    const { list_unit_kpi, list_resource_kpi, list_task } = responseServerOutput.content;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

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
          date: new Date(currentYear, currentMonth + 1, 1),
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

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
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
