const Models = require(`../../../../models`);
const { AllocationConfigSetting, UserRole, OrganizationalUnit, Employee } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
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
                    const { managers, deputyManagers, employees } = item;
                    return [...managers, ...deputyManagers, ...employees];
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
                    const { managers, deputyManagers, employees } = item;
                    return [...managers, ...deputyManagers, ...employees];
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
                        return employee;
                    })
                );

                const results = listFullEmployee.map((employee) => {
                    // Calculate mean score for certificates
                    const certificateScores = employee.certificates.map((cert) => cert.certificate?.score);
                    const validCertificateScores = certificateScores.filter((score) => typeof score === 'number');
                    const meanCertificateScore = validCertificateScores.length
                        ? validCertificateScores.reduce((acc, score) => acc + score, 0) / validCertificateScores.length
                        : 0;

                    // Calculate mean score for majors
                    const majorScores = employee.degrees.map((degree) => degree.major?.score);
                    const validMajorScores = majorScores.filter((score) => typeof score === 'number');
                    const meanMajorScore = validMajorScores.length
                        ? validMajorScores.reduce((acc, score) => acc + score, 0) / validMajorScores.length
                        : 0;

                    return {
                        name: employee.fullName,
                        employee_id: employee._id,
                        company_unit_id: item.id,
                        company_unit_object_id: item._id,
                        score: (meanCertificateScore + meanMajorScore) / 2,
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

        const response = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/kpi_allocation/`, payload);

        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
};

module.exports = {
    getConfigSettingData,
    updateConfigSettingData,
    handleStartAllocation,
};
