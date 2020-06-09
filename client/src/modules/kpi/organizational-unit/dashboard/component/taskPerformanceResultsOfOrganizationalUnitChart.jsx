import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TaskPerformanceResultsOfOrganizationalUnitChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            year: new Date().getFullYear(),
            dataStatus: this.DATA_STATUS.QUERYING,
            childrenOrganizationalUnitId: this.props.childrenOrganizationalUnit[1].id
        };

        this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.childrenOrganizationalUnitId, this.state.year)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.state.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy tập KPI đơn vị theo từng năm
            this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.childrenOrganizationalUnitId, this.state.year)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
        } else if(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.multiLineChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
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
        console.log("----", this.state.childrenOrganizationalUnit, this.props.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear)
        return (
            <React.Fragment>
                <div ref="chart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllOrganizationalUnitKpiSetEachYear: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetEachYear
}

const connectedTaskPerformanceResultsOfOrganizationalUnitChart = connect(mapState, actions)(TaskPerformanceResultsOfOrganizationalUnitChart);
export { connectedTaskPerformanceResultsOfOrganizationalUnitChart as TaskPerformanceResultsOfOrganizationalUnitChart };