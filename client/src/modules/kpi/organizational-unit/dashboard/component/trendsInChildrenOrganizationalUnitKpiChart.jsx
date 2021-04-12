import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import { customAxisC3js } from '../../../../../helpers/customAxisC3js';

import c3 from 'c3';
import 'c3/c3.css';

function TrendsInChildrenOrganizationalUnitKpiChart(props) {
    const DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
    const chart = null;

    const [state, setState] = useState({
        currentRole: null,
        dataStatus: DATA_STATUS.QUERYING,
    });

    const refBarChart = React.createRef();

    useEffect(() => {
        props.getCurrentKPIUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
        props.getAllEmployeeKpiInChildrenOrganizationalUnit(localStorage.getItem("currentRole"), props.month, props.organizationalUnitId);
        props.getAllTaskOfChildrenOrganizationalUnit(localStorage.getItem("currentRole"), props.month, props.organizationalUnitId);

        setState( {
            ...state,
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: DATA_STATUS.QUERYING
        })
    },[])

    useEffect(() => {
        if (state.currentRole !== localStorage.getItem("currentRole")) {
            props.getCurrentKPIUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
            props.getAllEmployeeKpiInChildrenOrganizationalUnit(localStorage.getItem("currentRole"), props.month, props.organizationalUnitId);
            props.getAllTaskOfChildrenOrganizationalUnit(localStorage.getItem("currentRole"), props.month, props.organizationalUnitId);

            setState(  {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });
        }

        if (props.organizationalUnitId !== state.organizationalUnitId || props.month !== state.month) {
            props.getCurrentKPIUnit(state.currentRole, props.organizationalUnitId, props.month);
            props.getAllEmployeeKpiInChildrenOrganizationalUnit(state.currentRole, state.month, props.organizationalUnitId);
            props.getAllTaskOfChildrenOrganizationalUnit(state.currentRole, props.month, props.organizationalUnitId)

            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });

        }
    },[])
    useEffect(() => {


        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if(props.createKpiUnit.currentKPI && props.dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit && props.dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                });
            }

        } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            barChart();

            setState({
                ...state,
                dataStatus: DATA_STATUS.FINISHED,
            });
        }

        if (!props.createKpiUnit.currentKPI && state.dataStatus === DATA_STATUS.FINISHED) {
            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
                willUpdate: true
            });
        }
    });

    if (props.organizationalUnitId !== state.organizationalUnitId || props.month !== state.month) {
        setState ({
            ...state,
            organizationalUnitId: props.organizationalUnitId,
            month: props.month
        })
    }

    /** Hàm tiện ích lấy các KPI con có cùng parent */
    const getArrayListChildTargetSameParent = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = props;

        let listOrganizationalUnitKpi, listChildTarget, arrayListChildTargetSameParent;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpisOfChildUnit
        }

        if (listOrganizationalUnitKpi && listChildTarget) {
            arrayListChildTargetSameParent = listOrganizationalUnitKpi.map(parent => {

                let index = 0;
                let maxDeg = listChildTarget?.[listChildTarget?.length - 1]?.[0]?.deg;

                let listChildTargetSameParent = [];

                while (index <= maxDeg) {

                    let listChildTargetSameDeg = listChildTarget.filter(item => item[0].deg === index);

                    if (listChildTargetSameDeg) {
                        if (index === 0) {
                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => { return item.filter(kpi => kpi._id === parent.name) });
                        } else {
                            let parentNameOfUnitKpi = listChildTargetSameParent[index - 1].map(kpi => {
                                if (kpi[0]) {
                                    return kpi[0]._id;
                                }
                            })

                            listChildTargetSameParent[index] = listChildTargetSameDeg.map(item => {
                                return item.filter(kpi => {
                                    if (kpi.employeeKpi && kpi.employeeKpi[0].parentNameOfUnitKpi[0]) {
                                        return parentNameOfUnitKpi.includes(kpi.employeeKpi[0].parentNameOfUnitKpi[0]);
                                    }
                                })
                            });
                        }
                    }

                    index++;
                };

                return listChildTargetSameParent;
            })
        }

        return arrayListChildTargetSameParent;
    };

    /** Hàm tiện ích lấy các công việc cùng KPI */
    const getArrayListTaskSameOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = props;

        let listOrganizationalUnitKpi, listTask, arrayListTaskSameOrganizationUnitKpi;
        let arrayListChildTargetSameParent = getArrayListChildTargetSameParent();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasksOfChildrenOrganizationalUnit;
        }

        if(listOrganizationalUnitKpi && listTask) {
            arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                let temporaryArrayListTaskSameOrganizationUnitKpi = [];

                if (arrayListChildTargetSameParent !== [] && arrayListChildTargetSameParent && listTask) {
                    let listChildTargetSameParent;

                    if (arrayListChildTargetSameParent) {
                        listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                            if (item?.[0]?.[0]?.[0]) {
                                return item[0][0][0]._id === parent?.name;
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
                                                            let list = task.filter(item1 => {
                                                                let kpi, length = 0;

                                                                if (item1.evaluations) {
                                                                    item1.evaluations.results.map(item2 => {
                                                                        kpi = item2.kpis.filter(kpis => kpis === employeeKpi._id);
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
                return temporaryArrayListTaskSameOrganizationUnitKpi;
            })
        }

        return arrayListTaskSameOrganizationUnitKpi;
    };

    const setExecutionTimeData = () => {
        const { createKpiUnit, translate } = props;

        let listOrganizationalUnitKpi, arrayListTaskSameOrganizationUnitKpi;
        let executionTimes = {};
        let now = new Date();
        let currentYear = now.getFullYear();
        let currentMonth = now.getMonth();
        let currentDate = now.getDate();
        let currentTime = new Date(currentYear, currentMonth, currentDate);

        if (createKpiUnit?.currentKPI?.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        arrayListTaskSameOrganizationUnitKpi = getArrayListTaskSameOrganizationUnitKpi();

        if (listOrganizationalUnitKpi && arrayListTaskSameOrganizationUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let key = listOrganizationalUnitKpi?.indexOf(parent);
                let temporary = {};
                let executionTime = 0;

                arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                    let date1 = new Date(x?.evaluations?.date);
                    let date2 = new Date(x?.startDate);
                    if(x.evaluations.date) {
                        executionTime = executionTime + (date1?.getTime() - date2?.getTime())/(3600*24*1000)
                    } else {
                        executionTime = executionTime + (currentTime?.getTime() - date2?.getTime())/(3600*24*1000)
                    }
                })

                if (arrayListTaskSameOrganizationUnitKpi?.length > 0 && listOrganizationalUnitKpi) {
                    executionTime = executionTime/arrayListTaskSameOrganizationUnitKpi?.length;
                }
                temporary[parent?.name] = Math.round(Number(executionTime) * 1000) / 1000;

                executionTimes = Object.assign(executionTimes, temporary);
            })
        }

        executionTimes = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.execution_time') },
            executionTimes
        )

        return executionTimes;
    };

    const setNumberOfTaskData = () => {
        const { createKpiUnit, translate } = props;

        let listOrganizationalUnitKpi;
        let numberOfTasks = {};
        let arrayListTaskSameOrganizationUnitKpi = getArrayListTaskSameOrganizationUnitKpi();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if (listOrganizationalUnitKpi && arrayListTaskSameOrganizationUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let key = listOrganizationalUnitKpi.indexOf(parent);
                let temporary = {};
                let numberOfTask;

                numberOfTask = arrayListTaskSameOrganizationUnitKpi[key].length;
                temporary[parent.name] = numberOfTask;

                numberOfTasks = Object.assign(numberOfTasks, temporary);
            })
        }

        numberOfTasks = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks') },
            numberOfTasks
        )

        return numberOfTasks;
    };

    const setNumberOfParticipantData = () => {
        const { createKpiUnit, translate } = props;

        let listOrganizationalUnitKpi;
        let numberOfParticipants = {};
        let arrayListTaskSameOrganizationUnitKpi = getArrayListTaskSameOrganizationUnitKpi();
        let arrayListChildTargetSameParent = getArrayListChildTargetSameParent();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if (!listOrganizationalUnitKpi && arrayListChildTargetSameParent){
            numberOfParticipants = {}
        } else {
            if (listOrganizationalUnitKpi) {
                listOrganizationalUnitKpi.map(parent => {
                    let key = listOrganizationalUnitKpi.indexOf(parent);
                    let creators1, creators2, numberOfParticipant;
                    let temporary = {};

                    if (arrayListChildTargetSameParent.length !== 0) {

                        arrayListChildTargetSameParent[key].map(deg => {
                            if (deg.length !== 0) {
                                deg.map(unit => {
                                    if (unit.length !== 0) {
                                        unit.forEach(kpi => {
                                            if (kpi.employeeKpi[0].creator.length !== 0) {
                                                creators1 = kpi.employeeKpi.map(employeeKpi => {
                                                    if (employeeKpi.creator[0]) {
                                                        return employeeKpi.creator[0];
                                                    }
                                                });
                                            }
                                        });
                                    }
                                })

                            }
                        })
                    }

                    if (arrayListTaskSameOrganizationUnitKpi) {
                        creators2 = arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                            return x.accountableEmployees.concat(x.consultedEmployees).concat(x.informedEmployees).concat(x.responsibleEmployees);
                        })
                        creators2.forEach(x => creators1 = creators1.concat(x));
                    }

                    creators1 = Array.from(new Set(creators1));
                    numberOfParticipant = creators1.length;
                    temporary[parent.name] = numberOfParticipant;
                    numberOfParticipants = Object.assign(numberOfParticipants, temporary);
                })
            }
        }

        numberOfParticipants = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.participants') },
            numberOfParticipants
        )

        return numberOfParticipants;
    };

    const setNumberOfEmployeeKpiData = () => {
        const { createKpiUnit, translate } = props;

        let listOrganizationalUnitKpi;
        let numberOfEmployeeKpis = {};
        let arrayListChildTargetSameParent = getArrayListChildTargetSameParent();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if (!listOrganizationalUnitKpi) {
            numberOfEmployeeKpis = {}
        } else {
            if (listOrganizationalUnitKpi?.length > 0) {
                listOrganizationalUnitKpi.map(parent => {
                    let numberOfEmployeeKpi = 0, temporary = {};
                    let listChildTargetSameParent;
    
                    if (arrayListChildTargetSameParent) {
                        listChildTargetSameParent = arrayListChildTargetSameParent.filter(item => {
                            if (item?.[0]?.[0]?.[0]) {
                                return item[0][0][0]._id === parent?.name;
                            }
                        })
                    }
    
                    if (listChildTargetSameParent.length !== 0) {
                        listChildTargetSameParent = [...listChildTargetSameParent[0]];
    
                        listChildTargetSameParent.map(deg => {
                            if (deg.length !== 0) {
                                deg.map(unit => {
                                    if (unit.length !== 0) {
                                        unit.forEach(kpi => {
                                            if (kpi.employeeKpi[0].creator.length !== 0) {
                                                numberOfEmployeeKpi = numberOfEmployeeKpi + kpi.employeeKpi.length;
                                            }
                                        });
                                    }
                                })
    
                            }
                        })
                    }
    
                    temporary[parent.name] = numberOfEmployeeKpi;
                    numberOfEmployeeKpis = Object.assign(numberOfEmployeeKpis, temporary);
                })
            }
        }

        numberOfEmployeeKpis = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.amount_employee_kpi') },
            numberOfEmployeeKpis
        )

        return numberOfEmployeeKpis;
    };

    // Thiết lập data trọng số của từng Kpi đơn vị
    const setWeightData = () => {
        const { createKpiUnit, translate } = props;
        let listOrganizationalUnitKpi;
        let weight = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        if(listOrganizationalUnitKpi) {
            listOrganizationalUnitKpi.map(parent => {
                let temporary = {};

                temporary[parent.name] = parent.weight;
                weight = Object.assign(weight, temporary)
            })
        }

        weight = Object.assign(
            { name: translate('kpi.organizational_unit.dashboard.trend_chart.weight') },
            weight
        )

        return weight;
    };

    const removePreviousBarChart = () => {
        const chart = refBarChart.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    };

    const barChart = () => {
        const { translate } = props;
        removePreviousBarChart();

        const { createKpiUnit } = props;
        let numberOfParticipants, numberOfEmployeeKpis, executionTimes, numberOfTasks, weight, listOrganizationalUnitKpi, titleX = ['x'];
        let numberOfParticipantsArray = [], numberOfEmployeeKpisArray = [], executionTimesArray = [], numberOfTasksArray = [], weightArray = [];

        if(createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        executionTimes = setExecutionTimeData();
        numberOfEmployeeKpis = setNumberOfEmployeeKpiData();
        numberOfParticipants = setNumberOfParticipantData();
        numberOfTasks = setNumberOfTaskData();
        weight = setWeightData();

        executionTimesArray.push(executionTimes?.name ? executionTimes.name : null);
        numberOfEmployeeKpisArray.push(numberOfEmployeeKpis?.name ? numberOfEmployeeKpis.name : null);
        numberOfParticipantsArray.push(numberOfParticipants?.name ? numberOfParticipants.name : null);
        numberOfTasksArray.push(numberOfTasks?.name ? numberOfTasks.name : null);
        weightArray.push(weight?.name ? weight.name : null);

        if(listOrganizationalUnitKpi) {
            listOrganizationalUnitKpi.map(kpis => {
                titleX.push(kpis?.name);
                executionTimesArray.push(executionTimes?.[kpis?.name] ? executionTimes[kpis.name] : 0);
                numberOfEmployeeKpisArray.push(numberOfEmployeeKpis?.[kpis?.name] ? numberOfEmployeeKpis[kpis.name] : 0);
                numberOfParticipantsArray.push(numberOfParticipants?.[kpis?.name] ? numberOfParticipants[kpis.name] : 0);
                numberOfTasksArray.push(numberOfTasks?.[kpis?.name] ? numberOfTasks[kpis.name] : 0);
                weightArray.push(weight?.[kpis?.name] ? weight[kpis.name] : 0);
            })
        }

        let dataChart = [
            titleX,
            numberOfTasksArray,
            executionTimesArray,
            numberOfParticipantsArray,
            numberOfEmployeeKpisArray,
            weightArray
        ]

        let chart = c3.generate({
            bindto: refBarChart.current,

            size: {
                height: 350
            },

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            data: {
                x: 'x',
                columns: dataChart
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('trendsInChildrenUnitChart', titleX.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },

                y: {
                    label: {
                        text: translate('general.value'),
                        position: 'outer-right'
                    }
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (titleX?.length > 1)
                            return titleX[d + 1];
                    }
                }
            }
        });
    };

    const { createKpiUnit, translate } = props;
    let currentKpi, organizationalUnitKpiLoading;

    if(createKpiUnit) {
        currentKpi = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading
    }

    return (
        <React.Fragment>
            {currentKpi ?
                <div id="trendsInChildrenUnitChart" ref={refBarChart}> </div>
                : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )

}


function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllEmployeeKpiInChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiInChildrenOrganizationalUnit,
    getAllTaskOfChildrenOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfChildrenOrganizationalUnit
};

const connectedTrendsInChildrenOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(TrendsInChildrenOrganizationalUnitKpiChart));
export { connectedTrendsInChildrenOrganizationalUnitKpiChart as TrendsInChildrenOrganizationalUnitKpiChart };
