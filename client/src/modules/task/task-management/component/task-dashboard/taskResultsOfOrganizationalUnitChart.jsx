import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../../../../kpi/organizational-unit/dashboard/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskResultsOfOrganizationalUnitChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: this.DATA_STATUS.QUERYING
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE){
          // bổ sung
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
           
            // bổ sung
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE){
            this.multiLineChart();
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }
    setDataMultiLineChart = () => {

    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {
        this.removePreviosChart();

        var dataChart = this.setDataMultiLineChart();

        
    }

    render() {
        return (
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const {} = state;
    return {}
}
const actions = {

}

const connectedTaskResultsOfOrganizationalUnitChart = connect(mapState, actions)(TaskResultsOfOrganizationalUnitChart);
export { connectedTaskResultsOfOrganizationalUnitChart as TaskResultsOfOrganizationalUnitChart };