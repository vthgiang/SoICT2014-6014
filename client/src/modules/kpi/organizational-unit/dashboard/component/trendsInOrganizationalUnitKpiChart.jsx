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
        this.props.getChildTargetOfOrganizationalUnitKpis(localStorage.getItem('currentRole'))
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

    setExecutionTimeData = (executionTime) => {
        return { y: executionTime, label: "Thời gian thực hiện" }
        
    }

    setNumberOfTaskData = (numberOfTask) => {
        return { y: numberOfTask, label: "Số lượng công việc" }
        
    }

    setNumberOfParticipantData = (numberOfParticipant) => {
        return { y: numberOfParticipant, label: "Người tham gia" }
    }

    setNumberOfChildKpiData = (numberOfChildKpi) => {
        return { y: numberOfChildKpi, label: "Số Kpi con" }
    }
    
    setWeightData = (weight) => {
        return { y: weight, label: "Trọng số" }
    }

    render() {
        var numberOfParticipant, numberOfChildKpi, data2, data, listOrganizationalUnitKpi, listChildTarget;
        var key = -1;
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if (dashboardOrganizationalUnitKpi.childTargets) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }
        
        if(listOrganizationalUnitKpi === undefined){
            numberOfParticipant = [];
            numberOfChildKpi = []
        } else {
            numberOfParticipant = listOrganizationalUnitKpi.map(x => {
                return this.setNumberOfParticipantData(5);
            });
            numberOfChildKpi = listOrganizationalUnitKpi.map(parent => {
                var count;
                if(listChildTarget !== undefined){
                    listChildTarget.filter(item => item._id === parent._id).map(x => {
                        count = x.count
                    })
                }
                if(count === undefined){
                    return this.setNumberOfChildKpiData(0);
                } else {
                    return this.setNumberOfChildKpiData(count);
                }
            })
        }

        if(listOrganizationalUnitKpi === undefined){
            data2 = []
        } else {
            data2 = listOrganizationalUnitKpi.map(x => {
                return [this.setExecutionTimeData(5)].concat(this.setNumberOfTaskData(5));
            })
        }

        if(listOrganizationalUnitKpi === undefined){
            data = []
        } else {
            data = listOrganizationalUnitKpi.map(x => {
                key = key +1;
                return Object.assign(
                        this.setTypeData(),
                        this.setNameData(x.name),
                        Object.assign(
                            {dataPoints: [
                                numberOfParticipant[key],
                                numberOfChildKpi[key],
                                this.setWeightData(x.weight)
                            ].concat(data2[key])}
                        )
                    ) 
            })
            key = -1;
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
            data: data
        }
        return(
            <div className="box box-primary">
                <CanvasJSReact options={trends} />
            </div>
        );
    }
}

function mapState(state) {
    const { createKpiUnit, managerKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, managerKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getChildTargetOfOrganizationalUnitKpis: dashboardOrganizationalUnitKpiActions.getChildTargetOfOrganizationalUnitKpis
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(TrendsInOrganizationalUnitKpiChart);
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };