import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';
import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import * as d3 from "d3";

class ResultsOfOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            year: new Date().getFullYear() 
        };
    }

    componentDidMount() {
        this.props.getCurrentKPIUnit(this.state.currentRole);
        this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.currentRole, this.state.year)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        
    }
    
    multiLineChart = () => {

    }

    render() {
        return(
            <div>sdfsdfsdf</div>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllOrganizationalUnitKpiSetEachYear: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetEachYear
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfOrganizationalUnitKpiChart);
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }