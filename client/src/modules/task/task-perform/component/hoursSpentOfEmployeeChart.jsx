import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import './hoursSpentOfEmployeeChart.css';
import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class HoursSpentOfEmployeeChart extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    componentDidMount = () => {
        const { refs, data } = this.props;

        if (data) {
            this.pieChart(refs, data);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.refs !== prevState.refs) {
            return {
                ...prevState,
                refs: nextProps.refs,
                data: nextProps.data
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.refs !== this.state.refs) {
            if (nextState.data) {
                return true
            }
        }
        return true
    }

    componentDidUpdate = () => {
        const { refs, data } = this.state;

        this.pieChart(refs, data)
    }

    removePreviousChart(refs) {
        const chart = this.refs[refs];

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    }

    setDataPieChart = (data) => {
        let dataChart;
        dataChart = Object.entries(data);

        return dataChart;
    }

    pieChart = (refs, data) => {
        this.removePreviousChart(refs);

        let dataPieChart;
        dataPieChart = this.setDataPieChart(data);
        
        this.chart = c3.generate({
            bindto: document.getElementById(refs),

            data: {
                columns: dataPieChart,
                type: 'pie',
            },

            legend: {
                show: true
            },

            tooltip: {
                format: {
                    value: function (value) {
                        return value + "h"
                    }
                }
            }
        });
    }

    render() {
        const { refs } = this.state;

        return (
            <React.Fragment>
                <div id={refs} className="hoursSpentOfEmployee"></div>
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

const connectedHoursSpentOfEmployeeChart = connect(mapState, actions)(withTranslate(HoursSpentOfEmployeeChart));
export { connectedHoursSpentOfEmployeeChart as HoursSpentOfEmployeeChart}