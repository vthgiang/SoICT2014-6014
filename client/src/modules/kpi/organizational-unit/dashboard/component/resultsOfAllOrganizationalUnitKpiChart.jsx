import React, { Component } from 'react';
import { connect } from 'react-redux';

import {createUnitKpiActions} from '../../creation/redux/actions' 
import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfAllOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2)
        }

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3};

        this.state = {
            userRoleId: localStorage.getItem("currentRole"),
            startDate: this.INFO_SEARCH.startDate,
            endDate: this.INFO_SEARCH.endDate,
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC
        };

        this.props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(this.state.userRoleId, this.state.startDate, this.state.endDate);
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        // Call action again when this.state.startDate or this.state.endDate changes
        if(nextState.startDate !== this.state.startDate || nextState.endDate !== this.state.endDate) {
            await this.props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(this.state.userRoleId, nextState.startDate, nextState.endDate);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        if(nextState.kindOfPoint !== this.state.kindOfPoint) {
            await this.setState(state =>{
                return {
                    ...state,
                    kindOfPoint: nextState.kindOfPoint,
                };
            });
            
            this.multiLineChart();
        }

        if(nextState.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            // Lấy tập KPI đơn vị theo từng năm
            this.props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(this.state.userRoleId, this.state.startDate, this.state.endDate)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
        } else if(nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {
            
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

    /** Select kind of point */
    handleSelectKindOfPoint = (value) => {
        if(Number(value) !== this.state.kindOfPoint) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: Number(value)
                }
            })
        }
    }

    /** Select month start in box */
    handleSelectMonthStart = (value) => {
        let month = value.slice(3,7) + '-' + value.slice(0,2);

        this.INFO_SEARCH.startDate = month;
    }

    /** Select month end in box */
    handleSelectMonthEnd = async (value) => {
        if(value.slice(0,2)<12) {
            var month = value.slice(3,7) + '-' + (new Number(value.slice(0,2)) + 1);
        } else {
            var month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endDate = month;
    }

    /** Search data */
    handleSearchData = async () => {
        var startDate = new Date(this.INFO_SEARCH.startDate);
        var endDate = new Date(this.INFO_SEARCH.endDate);
        const {translate} = this.props;
        if (startDate.getTime() >= endDate.getTime()) {
            Swal.fire({
                title:  translate('kpi.organizational_unit.dashboard.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startDate: this.INFO_SEARCH.startDate,
                    endDate: this.INFO_SEARCH.endDate
                }
            })
        }
    }

    filterAndSetDataPoint = (arrayPoint) => {
        var dateAxisX = [], point = [];

        dateAxisX.push('date-' + arrayPoint[0].name);
        point.push(arrayPoint[0].name);

        for(let i=1; i<arrayPoint.length; i++) {
            let newDate = new Date(arrayPoint[i].date);
            newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);

            dateAxisX.push(newDate);

            if(this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC) {
                point.push(arrayPoint[i].automaticPoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE) {
                point.push(arrayPoint[i].employeePoint);
            } else if(this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED) {
                point.push(arrayPoint[i].automaticPoint);
            }
        }

        return [
            dateAxisX,
            point
        ]
    }

    setDataMultiLineChart = () => {
        const { createKpiUnit } = this.props;
        var organizationalUnitKpiSetsOfChildUnit, point = [];

        if(createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
            organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit;
        }

        if(organizationalUnitKpiSetsOfChildUnit) {
            for(let i=0; i<organizationalUnitKpiSetsOfChildUnit.length; i++) {
                point = point.concat(this.filterAndSetDataPoint(organizationalUnitKpiSetsOfChildUnit[i]));
            }
        }

        return point
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {
        this.removePreviosChart();
        
        var dataChart, xs = {};
        const {translate}= this.props;
        dataChart = this.setDataMultiLineChart();
        
        for(let i=0; i<dataChart.length; i=i+2) {
            let temporary = {};
            temporary[dataChart[i+1][0]] = dataChart[i][0]; 
            xs = Object.assign(xs, temporary);
        }

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 
                xs: xs,
                columns: dataChart,
                type: 'spline'
            },

            axis: {                                
                x: {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: translate('kpi.organizational_unit.dashboard.point'),
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },
        })

    }

    render() {
        const { createKpiUnit, translate } = this.props;
        var organizationalUnitKpiSetsOfChildUnit;

        if(createKpiUnit.organizationalUnitKpiSetsOfChildUnit) {
            organizationalUnitKpiSetsOfChildUnit = createKpiUnit.organizationalUnitKpiSetsOfChildUnit;
        }

        let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        let defaultEndDate = [month, year].join('-');
        let defaultStartDate = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
                        <DatePicker 
                            id="monthStartInResultsOfAllOrganizationalUnitKpiChart"      
                            dateFormat="month-year"             
                            value={defaultStartDate}                
                            onChange={this.handleSelectMonthStart}
                            disabled={false}                    
                        />
                    </div>
                </section>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.organizational_unit.dashboard.end_date')}</label>
                        <DatePicker 
                            id="monthEndInResultsOfAllOrganizationalUnitKpiChart"      
                            dateFormat="month-year"             
                            value={defaultEndDate}                   
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}                    
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.organizational_unit.dashboard.search')}</button>
                    </div>
                </section>

                <section className="box-body" style={{textAlign: "right"}}>
                    <div className="btn-group">
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.AUTOMATIC)}>Automatic Point</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.EMPLOYEE)}>Employee Point</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.APPROVED)}>Approved Point</button>
                    </div>

                    <div ref="chart"></div>
                </section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit }
}
const actions = {
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit
}

const connectedResultsOfAllOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(ResultsOfAllOrganizationalUnitKpiChart));
export { connectedResultsOfAllOrganizationalUnitKpiChart as ResultsOfAllOrganizationalUnitKpiChart };