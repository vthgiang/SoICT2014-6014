import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { DatePicker } from '../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfAllOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

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
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit) {
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
        const { dashboardOrganizationalUnitKpi } = this.props;
        var organizationalUnitKpiSetsOfChildUnit, point = [];

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit) {
            organizationalUnitKpiSetsOfChildUnit = dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsOfChildUnit;
        }

        if(organizationalUnitKpiSetsOfChildUnit) {
            for(let i=0; i<organizationalUnitKpiSetsOfChildUnit.length; i++) {
                point = point.concat(this.filterAndSetDataPoint(organizationalUnitKpiSetsOfChildUnit[i]));
            }
        }

        return point
    }

    /** Select month start in box */
    handleSelectMonthStart = (value) => {
        var month = value.slice(3,7) + '-' + value.slice(0,2);
        this.INFO_SEARCH.startDate = month;
    }

    /** Select month end in box */
    handleSelectMonthEnd = async (value) => {
        var month = value.slice(3,7) + '-' + (new Number(value.slice(0,2)) + 1);
        this.INFO_SEARCH.endDate = month;
    }

    /** Search data */
    handleSearchData = async () => {
        var startDate = this.INFO_SEARCH.startDate.split("-");
        var startdate = new Date(startDate[1], startDate[0], 0);
        var endDate = this.INFO_SEARCH.endDate.split("-");
        var enddate = new Date(endDate[1], endDate[0], 28);
        
        if (Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
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

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {
        this.removePreviosChart();
        
        var dataChart, xs = {};

        dataChart = this.setDataMultiLineChart();
        
        for(let i=0; i<dataChart.length; i=i+2) {
            let temporary = {};
            temporary[dataChart[i+1][0]] = dataChart[i][0]; 
            xs = Object.assign(xs, temporary);
        }

        this.chart = c3.generate({
            bindto: this.refs.chart,

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                xs: xs,
                columns: dataChart,
                type: 'spline'
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    max: 100,
                    min: 0,
                    label: {
                        text: 'Điểm',
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
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultEndDate = [month, year].join('-');
        var defaultStartDate = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="form-group">
                        <label>Từ tháng</label>
                        <DatePicker 
                            id="monthStart"      
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={defaultStartDate}                 // giá trị mặc định cho datePicker    
                            onChange={this.handleSelectMonthStart}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>
                </section>
                <section className="form-inline">
                    <div className="form-group">
                        <label>Đến tháng</label>
                        <DatePicker 
                            id="monthEnd"      
                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                            value={defaultEndDate}                 // giá trị mặc định cho datePicker    
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>Tìm kiếm</button>
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
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit
}

const connectedResultsOfAllOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfAllOrganizationalUnitKpiChart);
export { connectedResultsOfAllOrganizationalUnitKpiChart as ResultsOfAllOrganizationalUnitKpiChart };