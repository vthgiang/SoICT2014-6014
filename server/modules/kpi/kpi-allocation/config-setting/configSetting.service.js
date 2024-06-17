const Models = require(`../../../../models`);
const { AllocationConfigSetting, UserRole, OrganizationalUnit, Employee, OrganizationalUnitKpi, OrganizationalUnitKpiSet, User } = Models;
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
                    const meanMajorScore = validMajorScores.length
                        ? validMajorScores.reduce((acc, score) => acc + score, 0) / validMajorScores.length
                        : 0;

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

        const response = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/kpi_allocation/`, payload);

        return {
            responseOutput: response.data,
            payload,
        };
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
};

const handleStartAssignAllocation = async (portal, responseServerOutput, responseInput, userDetail, listUnitKpiWeight) => {
    const { listEnterpriseUnit, listResource, listEnterpriseGoal } = responseInput;
    const { list_unit_kpi, list_resource_kpi } = responseServerOutput.content;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

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
                status: 0,
                employeeImportances: employeeImportance,
                organizationalUnitImportances: [],
            });

            return unitKpiSetObject;
        })
    );

    // create employee kpi
    listEnterpriseUnit.forEach(async (unit) => {
        const unitResource = listResource.filter((item) => item.company_unit_object_id === unit._id);
        unitResource.map((item) => {
            const itemKpi = list_resource_kpi.filter((resource_kpi) => resource_kpi.resource_employee_user_id === item.employee_user_id);
            console.log(itemKpi[0]);
            //             const kpis = await Promise.all(
            //     unitKpi[0].kpis.map(async (unitMetric) => {
            //         const allocationUnitKpiItem = allocationUnitKpi[0].unit_list_metric.filter((item) => item.description === unitMetric.name)[0];
            //         const unitKpiCreated = await OrganizationalUnitKpi(connect(DB_CONNECTION, portal)).create({
            //             name: unitMetric.name,
            //             parent: unitMetric._id,
            //             weight: unitMetric.kpiWeight,
            //             criteria: unitMetric.criteria,
            //             type: unitMetric.type,
            //             automaticPoint: 0,
            //             employeePoint: 0,
            //             approvedPoint: 0,
            //             target: allocationUnitKpiItem?.planed_value ? allocationUnitKpiItem.planed_value : null,
            //             unit: unitMetric.unit,
            //         });
            //         return unitKpiCreated._id;
            //     })
            // );
        });
    });
    // console.log('Khởi tạo Employee Kpi');

    // var employee_1KpiArray = []; // employee_1KpiArray[i] là mảng các kpi

    // employee_1KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[0][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 2,
    //         type: 1,
    //         automaticPoint: 80,
    //         employeePoint: 90,
    //         approvedPoint: 83,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[0][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 2,
    //         type: 2,
    //         automaticPoint: 92,
    //         employeePoint: 90,
    //         approvedPoint: 87,
    //     },
    //     {
    //         name: 'Tăng doanh số bán hàng 10 tỷ',
    //         parent: organizationalUnitKpiArray_1[0][2]._id,
    //         weight: 40,
    //         criteria: 'Doanh số bán hàng',
    //         status: 2,
    //         type: 0,
    //         automaticPoint: 80,
    //         employeePoint: 86,
    //         approvedPoint: 75,
    //     },
    //     {
    //         name: 'Tham gia xây dựng kế hoạch bán hàng',
    //         parent: organizationalUnitKpiArray_1[0][2]._id,
    //         weight: 50,
    //         criteria: 'Tham gia xây dựng kế hoạch bán',
    //         status: 2,
    //         type: 0,
    //         automaticPoint: 90,
    //         employeePoint: 90,
    //         approvedPoint: 80,
    //     },
    // ]);

    // employee_1KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[1][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 1,
    //         type: 1,
    //         automaticPoint: 87,
    //         employeePoint: 90,
    //         approvedPoint: 78,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[1][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 1,
    //         type: 2,
    //         automaticPoint: 93,
    //         employeePoint: 93,
    //         approvedPoint: 80,
    //     },
    //     {
    //         name: 'Mở rộng thị trường ở Đài Loan',
    //         parent: organizationalUnitKpiArray_1[1][2]._id,
    //         weight: 40,
    //         criteria: 'Mức độ mở rộng thị trường ở Đài Loan',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 90,
    //         employeePoint: 95,
    //         approvedPoint: 80,
    //     },
    //     {
    //         name: 'Khảo sát thị trường bán hàng ở trong nước',
    //         parent: organizationalUnitKpiArray_1[1][2]._id,
    //         weight: 50,
    //         criteria: 'Các cuộc khảo sát thực hiện được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 95,
    //         employeePoint: 95,
    //         approvedPoint: 95,
    //     },
    // ]);

    // var employee_2KpiArray = []; // employee_2KpiArray[i] là mảng các kpi

    // employee_2KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[0][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 2,
    //         type: 1,
    //         automaticPoint: 77,
    //         employeePoint: 90,
    //         approvedPoint: 83,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[0][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 2,
    //         type: 2,
    //         automaticPoint: 96,
    //         employeePoint: 90,
    //         approvedPoint: 88,
    //     },
    //     {
    //         name: 'Khảo sát các chuỗi bán hàng',
    //         parent: organizationalUnitKpiArray_1[0][3]._id,
    //         weight: 40,
    //         criteria: 'Các cuộc khảo sát chuỗi bán hàng ở Đà Nẵng',
    //         status: 2,
    //         type: 0,
    //         automaticPoint: 75,
    //         employeePoint: 90,
    //         approvedPoint: 78,
    //     },
    //     {
    //         name: 'Tham gia xây dựng kế hoạch bán hàng',
    //         parent: organizationalUnitKpiArray_1[0][3]._id,
    //         weight: 50,
    //         criteria: 'Tham gia xây dựng kế hoạch bán',
    //         status: 2,
    //         type: 0,
    //         automaticPoint: 95,
    //         employeePoint: 90,
    //         approvedPoint: 80,
    //     },
    // ]);

    // employee_2KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[1][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 1,
    //         type: 1,
    //         automaticPoint: 80,
    //         employeePoint: 90,
    //         approvedPoint: 83,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[1][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 1,
    //         type: 2,
    //         automaticPoint: 93,
    //         employeePoint: 93,
    //         approvedPoint: 95,
    //     },
    //     {
    //         name: 'Tiến hành các cuộc khảo sát nguồn nhân lực ở HN',
    //         parent: organizationalUnitKpiArray_1[1][3]._id,
    //         weight: 40,
    //         criteria: 'Các cuộc khảo sát thực hiện được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 70,
    //         employeePoint: 95,
    //         approvedPoint: 70,
    //     },
    //     {
    //         name: 'Tìm kiếm, củng cố nguồn nhân lực ở các vùng',
    //         parent: organizationalUnitKpiArray_1[1][3]._id,
    //         weight: 50,
    //         criteria: 'Nguồn nhân lực củng cố được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 90,
    //         employeePoint: 90,
    //         approvedPoint: 80,
    //     },
    // ]);

    // var employee_3KpiArray = [];

    // employee_3KpiArray[0] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[0][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 1,
    //         type: 1,
    //         automaticPoint: 80,
    //         employeePoint: 90,
    //         approvedPoint: 83,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[0][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 1,
    //         type: 2,
    //         automaticPoint: 93,
    //         employeePoint: 93,
    //         approvedPoint: 95,
    //     },
    //     {
    //         name: 'Tiến hành các cuộc khảo sát nguồn nhân lực ở HCM',
    //         parent: organizationalUnitKpiArray_1[0][2]._id,
    //         weight: 40,
    //         criteria: 'Các cuộc khảo sát thực hiện được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 70,
    //         employeePoint: 95,
    //         approvedPoint: 70,
    //     },
    //     {
    //         name: 'Tìm kiếm, củng cố nguồn nhân lực ở Đà Nẵng',
    //         parent: organizationalUnitKpiArray_1[0][3]._id,
    //         weight: 50,
    //         criteria: 'Nguồn nhân lực củng cố được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 90,
    //         employeePoint: 90,
    //         approvedPoint: 80,
    //     },
    // ]);

    // employee_3KpiArray[1] = await EmployeeKpi(vnistDB).insertMany([
    //     {
    //         name: 'Phê duyệt công việc',
    //         parent: organizationalUnitKpiArray_1[1][0]._id,
    //         weight: 5,
    //         criteria: 'Phê duyệt công việc',
    //         status: 1,
    //         type: 1,
    //         automaticPoint: 80,
    //         employeePoint: 90,
    //         approvedPoint: 83,
    //     },
    //     {
    //         name: 'Tư vấn thực hiện công việc',
    //         parent: organizationalUnitKpiArray_1[1][1]._id,
    //         weight: 5,
    //         criteria: 'Tư vấn thực hiện công việc',
    //         status: 1,
    //         type: 2,
    //         automaticPoint: 93,
    //         employeePoint: 93,
    //         approvedPoint: 95,
    //     },
    //     {
    //         name: 'Tiến hành các cuộc khảo sát nguồn nhân lực ở Cần Thơ',
    //         parent: organizationalUnitKpiArray_1[1][2]._id,
    //         weight: 40,
    //         criteria: 'Các cuộc khảo sát thực hiện được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 70,
    //         employeePoint: 95,
    //         approvedPoint: 70,
    //     },
    //     {
    //         name: 'Tìm kiếm, củng cố nguồn nhân lực ở Bình Thuận',
    //         parent: organizationalUnitKpiArray_1[1][3]._id,
    //         weight: 50,
    //         criteria: 'Nguồn nhân lực củng cố được',
    //         status: 1,
    //         type: 0,
    //         automaticPoint: 90,
    //         employeePoint: 90,
    //         approvedPoint: 80,
    //     },
    // ]);

    // /**
    //  * Gắn các KPI vào tập KPI cá nhân
    //  */
    // for (let i = 0; i < 2; i++) {
    //     // Gắn các kpi vào tập kpi của Vũ Thị Cúc
    //     employeeKpiSet_1[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
    //         employeeKpiSet_1[i],
    //         {
    //             $push: {
    //                 kpis: employee_1KpiArray[i].map((x) => {
    //                     return x._id;
    //                 }),
    //             },
    //         },
    //         { new: true }
    //     );

    //     // Gắn các kpi vào tập kpi của Nguyễn Văn Danh
    //     employeeKpiSet_2[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
    //         employeeKpiSet_2[i],
    //         {
    //             $push: {
    //                 kpis: employee_2KpiArray[i].map((x) => {
    //                     return x._id;
    //                 }),
    //             },
    //         },
    //         { new: true }
    //     );

    //     // Gắn các kpi vào tập kpi của Phạm Đình Phúc
    //     employeeKpiSet_3[i] = await EmployeeKpiSet(vnistDB).findByIdAndUpdate(
    //         employeeKpiSet_3[i],
    //         {
    //             $push: {
    //                 kpis: employee_3KpiArray[i].map((x) => {
    //                     return x._id;
    //                 }),
    //             },
    //         },
    //         { new: true }
    //     );
    //     console.log(employeeKpiSet_3);
    // }

    // create task employee
    // Tạo công việc tương ứng với kpi của employee
    // var task_employee = await Task(vnistDB).insertMany([
    //     // Tháng hiện tại
    //     {
    //         organizationalUnit: organizationalUnit_2,
    //         creator: manager,
    //         name: 'Tiến hành các cuộc nghiên cứu thị trường',
    //         description: 'Đánh giá theo các cuộc nghiên cứu thị trường',
    //         startDate: new Date(currentYear, currentMonth, 1, 12),
    //         endDate: new Date(currentYear, currentMonth, 30, 12),
    //         priority: 2, // Mức độ ưu tiên
    //         isArchived: false,
    //         status: 'finished',
    //         taskTemplate: null,
    //         parent: null,
    //         level: 1,
    //         inactiveEmployees: [],
    //         responsibleEmployees: [employee], // Người thực hiện
    //         accountableEmployees: [employee], // Người phê duyệt
    //         consultedEmployees: [employee], // Người tư vấn
    //         informedEmployees: [deputyManager], // Người quan sát
    //         confirmedByEmployees: [employee].concat([employee]).concat([employee]).includes(manager) ? manager : [],
    //         evaluations: [
    //             {
    //                 // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
    //                 evaluatingMonth: new Date(currentYear, currentMonth, 30),
    //                 date: new Date(currentYear, currentMonth, 30),
    //                 startDate: new Date(currentYear, currentMonth, 2),
    //                 endDate: new Date(currentYear, currentMonth, 30),
    //                 results: [
    //                     {
    //                         // Kết quả thực hiện công việc trong tháng đánh giá nói trên
    //                         employee: employee,
    //                         organizationalUnit: organizationalUnit_2,
    //                         role: 'responsible',
    //                         kpis: [employeeKpiArray[1][2]],
    //                         automaticPoint: 90,
    //                         employeePoint: 70,
    //                         approvedPoint: 80,
    //                         contribution: 50,
    //                         taskImportanceLevel: 7,
    //                     },
    //                     {
    //                         // Kết quả thực hiện công việc trong tháng đánh giá nói trên
    //                         employee: employee,
    //                         organizationalUnit: organizationalUnit_2,
    //                         role: 'accountable',
    //                         kpis: [employeeKpiArray[1][0]],
    //                         automaticPoint: 90,
    //                         employeePoint: 80,
    //                         approvedPoint: 60,
    //                         contribution: 30,
    //                         taskImportanceLevel: 5,
    //                     },
    //                     {
    //                         // Kết quả thực hiện công việc trong tháng đánh giá nói trên
    //                         employee: employee,
    //                         organizationalUnit: organizationalUnit_2,
    //                         role: 'consulted',
    //                         kpis: [employeeKpiArray[1][1]],
    //                         automaticPoint: 90,
    //                         employeePoint: 100,
    //                         approvedPoint: 60,
    //                         contribution: 20,
    //                         taskImportanceLevel: 5,
    //                     },
    //                 ],
    //                 taskInformations: [], // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
    //             },
    //         ],
    //         progress: 60,
    //     },
    // ]);
};

module.exports = {
    getConfigSettingData,
    updateConfigSettingData,
    handleStartAllocation,
    handleStartAssignAllocation,
};
