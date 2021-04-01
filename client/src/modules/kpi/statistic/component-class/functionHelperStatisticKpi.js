export const FunctionHelperStatisticKpi = {
    getArrayListChildTargetOrganizationUnitKpi,
    getArrayListTaskSameOrganizationUnitKpi
}

/** Hàm tiện ích lấy các KPI con có cùng parent */
function getArrayListChildTargetOrganizationUnitKpi(listOrganizationalUnitKpi, listChildTarget) {
    let arrayListChildTargetSameParent;

    if (listOrganizationalUnitKpi && listChildTarget) {
        arrayListChildTargetSameParent = listOrganizationalUnitKpi.map(parent => {

            let index = 0;
            let maxDeg = listChildTarget?.[listChildTarget.length - 1]?.[0]?.deg;

            let listChildTargetSameParent = [];

            while (index <= maxDeg) {

                let listChildTargetSameDeg = listChildTarget.filter(item => item[0].deg === index);

                if (listChildTargetSameDeg) {
                    if (index === 0) {
                        listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                            let organizationalUnit = {
                                organizationalUnit: item?.[0]?.name,
                                deg: item?.[0]?.deg
                            }
                            let kpis = item.filter(kpi => kpi._id === parent.name).map(kpi => {
                                return Object.assign(kpi, organizationalUnit);
                            })

                            return kpis
                        });
                    } else {
                        let parentNameOfUnitKpi = listChildTargetSameParent[index - 1].map(kpi => {
                            if (kpi[0]) {
                                return kpi[0]._id;
                            }
                        })

                        listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                            let organizationalUnit = {
                                organizationalUnitId: item?.[0]?.organizationalUnitId,
                                organizationalUnit: item?.[0]?.name,
                                deg: item?.[0]?.deg
                            }
                            let kpis = item.filter(kpi => {
                                if (kpi.employeeKpi && kpi.employeeKpi[0].parentNameOfUnitKpi[0]) {
                                    return parentNameOfUnitKpi.includes(kpi.employeeKpi[0].parentNameOfUnitKpi[0]);
                                }
                            }).map(kpi => {
                                return Object.assign(kpi, organizationalUnit);
                            })

                            return kpis;
                        });
                    }
                }

                index++;
            };

            return listChildTargetSameParent;
        })
    }

    return arrayListChildTargetSameParent;
}

/** Hàm tiện ích lấy các công việc cùng KPI */
function getArrayListTaskSameOrganizationUnitKpi(listOrganizationalUnitKpi, listTask, listChildTarget) {
    let arrayListTaskSameOrganizationUnitKpi;
    let arrayListChildTargetSameParent = this.getArrayListChildTargetOrganizationUnitKpi(listOrganizationalUnitKpi, listChildTarget);

    if (listOrganizationalUnitKpi && listTask) {
        arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
            let temporaryArrayListTaskSameOrganizationUnitKpi = [];

            if (arrayListChildTargetSameParent !== [] && arrayListChildTargetSameParent && listTask) {
                let listChildTargetSameParent;

                if (arrayListChildTargetSameParent) {
                    listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                        if (item?.[0]?.[0]?.[0]) {
                            return item[0][0][0]._id === parent.name;
                        }
                    });
                }

                if (listChildTargetSameParent.length !== 0) {
                    listChildTargetSameParent = [...listChildTargetSameParent[0]];

                    listChildTargetSameParent.map(deg => {
                        if (deg.length !== 0) {
                            deg.map(unit => {
                                if (unit.length !== 0) {
                                    unit.map(kpi => {
                                        if (kpi.employeeKpi[0].creator.length !== 0) {
                                            kpi.employeeKpi.map(employeeKpi => {
                                                if (listTask) {
                                                    listTask.map(task => {
                                                        let list = task.filter(item => {
                                                            let kpi, length = 0;

                                                            if (item.evaluations) {
                                                                item.evaluations.results.map(item => {
                                                                    kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                                                    length = length + kpi.length;
                                                                });
                                                                return length !== 0 && length !== undefined;
                                                            } else {
                                                                return false
                                                            }
                                                        })

                                                        temporaryArrayListTaskSameOrganizationUnitKpi = temporaryArrayListTaskSameOrganizationUnitKpi.concat(list);
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }

            temporaryArrayListTaskSameOrganizationUnitKpi = Array.from(new Set(temporaryArrayListTaskSameOrganizationUnitKpi));
            temporaryArrayListTaskSameOrganizationUnitKpi.unshift({ name: parent.name });

            return temporaryArrayListTaskSameOrganizationUnitKpi;
        })
    }

    return arrayListTaskSameOrganizationUnitKpi;
}
