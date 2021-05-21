import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import { customAxisC3js } from '../../../../../helpers/customAxisC3js';

import c3 from 'c3';
import 'c3/c3.css';

function TrendsInOrganizationalUnitKpiChart(props) {
    const DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    });

    const refBarChart = React.createRef();

    useEffect(() => {
        props.getCurrentKPIUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
        props.getAllEmployeeKpiInOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
        props.getAllTaskOfOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);

        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING
        })
    }, []);

    useEffect(() => {
        if (state.currentRole !== localStorage.getItem("currentRole")) {
            props.getCurrentKPIUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
            props.getAllEmployeeKpiInOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);
            props.getAllTaskOfOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);

            setState( {
                ...state,
                currentRole: localStorage.getItem("currentRole"),
                dataStatus: DATA_STATUS.QUERYING
            });

        }

        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.createKpiUnit.currentKPI && props.dashboardOrganizationalUnitKpi.employeeKpis && props.dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit) {
                setState( {
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                });
            }
        } else if (state.dataStatus === DATA_STATUS.AVAILABLE){
            barChart();

            setState( {
                ...state,
                dataStatus: DATA_STATUS.FINISHED,
            });
        }

        if (!props.createKpiUnit.currentKPI && state.dataStatus === DATA_STATUS.FINISHED) {
            setState(  {
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

    useEffect(() => {
        props.getCurrentKPIUnit(state.currentRole, props.organizationalUnitId, props.month);
        props.getAllEmployeeKpiInOrganizationalUnit(state.currentRole, props.organizationalUnitId, props.month);
        props.getAllTaskOfOrganizationalUnit(state.currentRole, props.organizationalUnitId, props.month)

        setState( {
            ...state,
            dataStatus:DATA_STATUS.QUERYING,
        });
    }, [state.organizationalUnitId, state.month])

    const getArrayListTaskSameOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = props;
        let listOrganizationalUnitKpi, listChildTarget, listTask, arrayListTaskSameOrganizationUnitKpi;

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis;
        }
        if (dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasksOfOrganizationalUnit;
        }

        if(listOrganizationalUnitKpi && listTask && listTask.length !== 0) {
            arrayListTaskSameOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                let temporaryArrayListTaskSameOrganizationUnitKpi = [];
                if (listChildTarget !== [] && listChildTarget) {
                    let temporary;

                    temporary = listChildTarget.filter(childTarget => childTarget._id === parent.name);
                    if (temporary.length !== 0) {
                        temporary[0].employeeKpi.map(employeeKpi => {
                            if(listTask.length !== 0){
                                let list = listTask.filter(item => {
                                    let kpi, length = 0;

                                    item.evaluations.results.map(item => {
                                        kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                        length = length + kpi.length;
                                    });
                                    return length !== 0 && length !== undefined;
                                })
                                temporaryArrayListTaskSameOrganizationUnitKpi = temporaryArrayListTaskSameOrganizationUnitKpi.concat(list);
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
                    executionTime = executionTime/arrayListTaskSameOrganizationUnitKpi.length;
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
    }

    const setNumberOfTaskData = () => {
        const { createKpiUnit, translate } = props;

        let listOrganizationalUnitKpi, arrayListTaskSameOrganizationUnitKpi;
        let numberOfTasks = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }

        arrayListTaskSameOrganizationUnitKpi = getArrayListTaskSameOrganizationUnitKpi();

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
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = props;

        let listOrganizationalUnitKpi, listChildTarget;
        let numberOfParticipants = {};
        let arrayListTaskSameOrganizationUnitKpi = getArrayListTaskSameOrganizationUnitKpi();

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis
        }

        if (!listOrganizationalUnitKpi && listChildTarget){
            numberOfParticipants = {}
        } else {
            if (listOrganizationalUnitKpi?.length > 0) {
                listOrganizationalUnitKpi.map(parent => {
                    let key = listOrganizationalUnitKpi.indexOf(parent);
                    let creators1, creators2, numberOfParticipant=0;
                    let temporary = {};
    
                    if (listChildTarget) {
                        creators1 = listChildTarget.filter(item => item._id === parent.name);
    
                        if (creators1.length !== 0) {
                            creators1 = creators1[0].employeeKpi.map(x => {
                                if (x.creator[0]) {
                                    return x.creator[0];
                                }
                            })
                        }
                    }
    
    
                    if (arrayListTaskSameOrganizationUnitKpi) {
                        creators2 = arrayListTaskSameOrganizationUnitKpi[key].map(x => {
                            return x.accountableEmployees.concat(x.consultedEmployees).concat(x.informedEmployees).concat(x.responsibleEmployees);
                        })
                        creators2.forEach(x => creators1 = creators1.concat(x));
                    }
    
                    creators1 = Array.from(new Set(creators1));
                    creators1.map(x => {
                        if (x) {
                            numberOfParticipant++;
                        }
                    });
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
        const { createKpiUnit, dashboardOrganizationalUnitKpi, translate } = props;

        let listOrganizationalUnitKpi, listChildTarget;
        let numberOfEmployeeKpis = {};

        if (createKpiUnit.currentKPI && createKpiUnit.currentKPI.kpis) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.employeeKpis !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.employeeKpis
        }
        if(!listOrganizationalUnitKpi && listChildTarget){
            numberOfEmployeeKpis = {}
        } else {
            if (listOrganizationalUnitKpi?.length > 0) {
                listOrganizationalUnitKpi.map(parent => {
                    let numberOfEmployeeKpi = 0;
                    let temporary = {};
                    if(listChildTarget){
                        numberOfEmployeeKpi = listChildTarget.filter(item => item._id === parent.name).map(item => {
                            if (item.employeeKpi[0].creator.length !== 0) {
                                return item.employeeKpi.length;
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
                            let result = customAxisC3js('trendsInUnitChart', titleX.filter((item, i) => i > 0), index);
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
                <div id="trendsInUnitChart" ref={refBarChart}></div>
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
    getAllEmployeeKpiInOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiInOrganizationalUnit,
    getAllTaskOfOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfOrganizationalUnit
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(TrendsInOrganizationalUnitKpiChart));
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };
