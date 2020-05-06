import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';
import { managerActions } from '../../management/redux/actions';
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
        this.props.getChildTargetOfCurrentTarget('5eb05fada9eb290b40a57e62');
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

    setNumberOfParticipantData = (numberOfParticipants) => {
        return { y: numberOfParticipants, label: "Người tham gia" }
    }

    setNumberOfChildKpiData = (organizationalUnitKpi) => {
        this.props.getChildTargetOfCurrentTarget(organizationalUnitKpi);
        // const {managerKpiUnit} = this.props;
        // var employeeKi = managerKpiUnit.childtarget;
        // return employeeKi
    }
    
    setWeightData = (weight) => {
        return { y: weight, label: "Trọng số" }
    }

    render() {
        var data1, data2, data,  numberOfChildKpi, listOrganizationalUnitKpi;
        var key = -1;
        const { createKpiUnit, managerKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        if(listOrganizationalUnitKpi === undefined){
            data1 = []
        } else {
            data1 = listOrganizationalUnitKpi.map(x => {
                return this.setNumberOfParticipantData(5)
            })
        }
        
        if(listOrganizationalUnitKpi === undefined){
            data2 = []
        } else {
            data2 = listOrganizationalUnitKpi.map(x => {
                return [this.setExecutionTimeData(5)].concat(this.setNumberOfTaskData(5))
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
                                data1[key],
                                //numberOfChildKpi[key],
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
    const { createKpiUnit, managerKpiUnit } = state;
    return { createKpiUnit, managerKpiUnit };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getChildTargetOfCurrentTarget: managerActions.getChildTargetOfCurrentTarget
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(TrendsInOrganizationalUnitKpiChart);
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };