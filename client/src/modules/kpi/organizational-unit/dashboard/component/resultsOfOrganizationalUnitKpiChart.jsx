import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { DatePicker } from '../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2)
        }

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            organizationalUnitId: null,
            startDate: this.INFO_SEARCH.startDate,
            endDate: this.INFO_SEARCH.endDate,
            dataStatus: this.DATA_STATUS.QUERYING
        };
    }

    componentDidMount = () => {
        this.props.getAllOrganizationalUnitKpiSetByTime(this.props.organizationalUnitId, this.state.startDate, this.state.endDate);

        this.setState(state => {
            return {
                ...state,
                dataStatus: this.DATA_STATUS.QUERYING,
            }
        });
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        // Call action again when this.props.organizationalUnitId changes
        if(nextProps.organizationalUnitId !== this.state.organizationalUnitId) {
            // Cần đặt await, và phải đặt trước setState để kịp thiết lập createEmployeeKpiSet.employeeKpiSetByMonth là null khi gọi service
            await this.props.getAllOrganizationalUnitKpiSetByTime(nextProps.organizationalUnitId, this.state.startDate, this.state.endDate);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }

        // Call action again when this.state.startDate or this.state.endDate changes
        if(nextState.startDate !== this.state.startDate || nextState.endDate !== this.state.endDate) {
            await this.props.getAllOrganizationalUnitKpiSetByTime(this.state.organizationalUnitId, nextState.startDate, nextState.endDate);
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                }
            });

            return false;
        }
        
        if(nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSets) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
            return false;
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

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.organizationalUnitId !== prevState.organizationalUnitId) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId
            }
        } else{
            return null;
        }
    }

    // Thiết lập dữ liệu biểu đồ
    setDataMultiLineChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart;

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSets) {
            listOrganizationalUnitKpiSetEachYear = dashboardOrganizationalUnitKpi.organizationalUnitKpiSets
        }

        if(listOrganizationalUnitKpiSetEachYear) {

            automaticPoint = ['Hệ thống đánh giá'];
            employeePoint = ['Cá nhân tự đánh giá'];
            approvedPoint = ['Quản lý đánh giá'];
            date = ['x'];

            listOrganizationalUnitKpiSetEachYear.map(x => {
                automaticPoint.push(x.automaticPoint);
                employeePoint.push(x.employeePoint);
                approvedPoint.push(x.approvedPoint);

                var newDate = new Date(x.date);
                newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + (newDate.getDate() - 1);
                date.push(newDate);
            });
        }
        
        dataMultiLineChart = [date, automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    };

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

    // Xóa các chart đã render trước khi đủ dữ liệu
    removePreviosMultiLineChart = () => {
        const chart =  this.refs.chart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild)
        }
    }

    // Khởi tạo MultiLineChart bằng C3
    multiLineChart = () => {
        this.removePreviosMultiLineChart();
        
        // Tạo mảng dữ liệu
        var dataMultiLineChart = this.setDataMultiLineChart();

        this.chart = c3.generate({
            bindto: this.refs.chart,       // Đẩy chart vào thẻ div có id="multiLineChart"

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                x: 'x',
                columns: dataMultiLineChart,
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

            zoom: {                                 // Cho phép zoom biểu đồ
                enabled: false
            }
        });
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

        return(
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

                <section ref="chart"></section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi };
}

const actions = {
    getAllOrganizationalUnitKpiSetByTime: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfOrganizationalUnitKpiChart);
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }