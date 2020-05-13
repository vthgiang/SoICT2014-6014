import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import CanvasJSReact from '../../../../../chart/canvasjs.react';

class TrendsInOrganizationalUnitKpiChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole")
        };
    }
    
    componentDidMount() {
        this.props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        this.props.getAllChildTargetOfOrganizationalUnitKpis(localStorage.getItem('currentRole'));
        this.props.getAllTaskOfOrganizationalUnit(localStorage.getItem('currentRole'));
    }
    
    setTypeData = () => {
        return { 
            type: "stackedBar100",
            toolTipContent: "{label}<br><b>{name}:</b> {y} (#percent%)",
            showInLegend: true
        }
    }

    setNameData = (name) => {
        return { name: name }
    }

    setExecutionTimeData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var executionTimes, listOrganizationalUnitKpi, listChildTarget, listTask;
        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();
        var currentTime = new Date(currentYear, currentMonth, currentDate);

        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets;
            listTask = dashboardOrganizationalUnitKpi.tasks
        }
        
        if(listOrganizationalUnitKpi === undefined){
            executionTimes = []
        } else {
            executionTimes = listOrganizationalUnitKpi.map(parent => {
                var executionTime = 0;
                var listTaskByOrganizationUnitKpi = [];
                if(listChildTarget !== undefined){
                    listChildTarget.filter(childTarget => childTarget.parent === parent._id).map(employeeKpi => {
                        if(listTask !== undefined){
                            var list = listTask.filter(item => {
                                var kpi, length;
                                item.evaluations.kpis.map(item => {
                                    kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                    length = kpi.length;
                                });
                                return length !== 0 && length !== undefined;
                            })
                            listTaskByOrganizationUnitKpi = listTaskByOrganizationUnitKpi.concat(list);
                        }
                    })
                }
                listTaskByOrganizationUnitKpi = Array.from(new Set(listTaskByOrganizationUnitKpi));

                listTaskByOrganizationUnitKpi.map(x => {
                    var date1 = new Date(x.evaluations.date);
                    var date2 = new Date(x.startDate);
                    if(x.evaluations.date) {
                        executionTime = executionTime + (date1.getTime() - date2.getTime())/(3600*24*1000)
                    } else {
                        executionTime = executionTime + (currentTime.getTime() - date2.getTime())/(3600*24*1000)
                    }
                })
                if(listTaskByOrganizationUnitKpi.length !== 0)
                    executionTime = executionTime/listTaskByOrganizationUnitKpi.length;
                
                return { y: executionTime, label: "Thời gian thực hiện (Ngày)" };
            })
        }
        return executionTimes;
    }

    setNumberOfTaskData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var numberOfTasks, listOrganizationalUnitKpi, listChildTarget, listTask;

        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets;
            listTask = dashboardOrganizationalUnitKpi.tasks
        }

        if(listOrganizationalUnitKpi === undefined){
            numberOfTasks = []
        } else {
            numberOfTasks = listOrganizationalUnitKpi.map(parent => {
                var numberOfTask ;
                var listTaskByOrganizationUnitKpi = [];
                if(listChildTarget !== undefined){
                    listChildTarget.filter(childTarget => childTarget.parent === parent._id).map(employeeKpi => {
                        if(listTask !== undefined){
                            var list = listTask.filter(item => {
                                var kpi, length;
                                item.evaluations.kpis.map(item => {
                                    kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                    length = kpi.length;
                                });
                                return length !== 0 && length !== undefined;
                            })
                            listTaskByOrganizationUnitKpi = listTaskByOrganizationUnitKpi.concat(list);
                        }
                    })
                }
                listTaskByOrganizationUnitKpi = Array.from(new Set(listTaskByOrganizationUnitKpi));
                numberOfTask = listTaskByOrganizationUnitKpi.length;
                return { y: numberOfTask, label: "Số lượng công việc" }
            })
        }

        return numberOfTasks; 
    }

    setNumberOfParticipantData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var numberOfParticipants, listOrganizationalUnitKpi, listChildTarget;

        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.childTargets) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }

        if(listOrganizationalUnitKpi === undefined){
            numberOfParticipants = []
        } else {
            numberOfParticipants = listOrganizationalUnitKpi.map(parent => {
                let creators;
                if(listChildTarget !== undefined){
                    creators = listChildTarget.filter(item => item.parent === parent._id).map(x => {
                        return x.creator;
                    })
                }
                creators = Array.from(new Set(creators));
                let numberOfParticipant = creators.length;
                return { y: numberOfParticipant, label: "Người tham gia" }
            })
        }

        return numberOfParticipants;
    }

    setNumberOfChildKpiData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var numberOfChildKpis, listOrganizationalUnitKpi, listChildTarget;

        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.childTargets) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }

        if(listOrganizationalUnitKpi === undefined){
            numberOfChildKpis = []
        } else {
            numberOfChildKpis = listOrganizationalUnitKpi.map(parent => {
                let numberOfChildKpi = 0;
                if(listChildTarget !== undefined){
                    listChildTarget.filter(item => item.parent === parent._id).map(x => {
                        numberOfChildKpi++;
                    })
                }
                
                return { y: numberOfChildKpi, label: "Số Kpi con" }
            })
        }

        return numberOfChildKpis;
    }
    
    setWeightData = (weight) => {
        return { y: weight, label: "Trọng số" }
    }

    render() {
        var numberOfParticipants, numberOfChildKpis, executionTimes, numberOfTasks, dataChart, listOrganizationalUnitKpi, listChildTarget;
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.childTargets) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }
        
        executionTimes = this.setExecutionTimeData();
        numberOfChildKpis = this.setNumberOfChildKpiData();
        numberOfParticipants = this.setNumberOfParticipantData();
        numberOfTasks = this.setNumberOfTaskData();

        if(listOrganizationalUnitKpi === undefined){
            dataChart = []
        } else {
            dataChart = listOrganizationalUnitKpi.map(x => {
                var key = listOrganizationalUnitKpi.indexOf(x);
                return Object.assign(
                        this.setTypeData(),
                        this.setNameData(x.name),
                        Object.assign(
                            {dataPoints: [
                                numberOfParticipants[key],
                                numberOfChildKpis[key],
                                executionTimes[key],
                                numberOfTasks[key],
                                this.setWeightData(x.weight)
                            ]}
                        )
                    ) 
            })
        }
        const trends = {
            exportEnabled: true,
            animationEnabled: true,
            theme: "light2", //"light1", "dark1", "dark2"
            title: {
                text: "Xu hướng thực hiện mục tiêu của nhân viên"
            },
            axisY: {
                interval: 10,
                suffix: "%"
            },
            toolTip: {
                shared: true
            },
            data: dataChart
        }
        return(
            <div className="box box-primary">
                <CanvasJSReact options={trends}/>
            </div>
        );
    }
}

function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllChildTargetOfOrganizationalUnitKpis: dashboardOrganizationalUnitKpiActions.getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfOrganizationalUnit
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(TrendsInOrganizationalUnitKpiChart);
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };