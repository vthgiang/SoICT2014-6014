/* Biểu đồ xu hướng nghỉ phép của nhân viên */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { TimesheetsActions } from '../../timesheets/redux/actions';
import { SelectMulti, DatePicker } from '../../../../common-components';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';

class AnnualLeaveTrendsChart extends Component {
    constructor(props) {
        super(props);
        // let startDate = ['01', new Date().getFullYear()].join('-');
        let date = new Date()
        let startDate = this.formatDate(date.setMonth(new Date().getMonth() - 6), true);
        this.state = {
            lineChart: true,
            startDate: startDate,
            startDateShow: startDate,
            endDate: this.formatDate(Date.now(), true),
            endDateShow: this.formatDate(Date.now(), true),
            organizationalUnitsSearch: this.props.defaultUnit ? this.props.organizationalUnits : [],
            organizationalUnits: this.props.defaultUnit ? this.props.organizationalUnits : [],
        }
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

    componentDidMount() {
        const { organizationalUnits, startDate, endDate } = this.state;
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getAnnualLeave({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew })
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, trendHoursOff: true })
    }

    /**
     * Function bắt sự kiện thay đổi unit
     * @param {*} value : Array id đơn vị
     */
    handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            organizationalUnits: value
        })
    };

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    handleStartMonthChange = (value) => {
        this.setState({
            startDate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    handleEndMonthChange = (value) => {
        this.setState({
            endDate: value,
        })
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            lineChart: value
        })
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i].startDate !== items2[i].startDate || items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.arrMonth || nextProps.annualLeave.arrMonth.length !== prevState.arrMonth.length ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.annualLeave.listAnnualLeaveOfNumberMonth, prevState.listAnnualLeaveOfNumberMonth) ||
            nextProps.timesheets.arrMonth.length !== prevState.arrMonth.length ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.timesheets.listHoursOffOfUnitsByStartDateAndEndDate, prevState.listHoursOffOfUnitsByStartDateAndEndDate)) {
            return {
                ...prevState,
                nameChart: nextProps.nameChart,
                nameData1: nextProps.nameData1,
                nameData2: nextProps.nameData2,
                arrMonth: nextProps.annualLeave.arrMonth,
                listAnnualLeaveOfNumberMonth: nextProps.annualLeave.listAnnualLeaveOfNumberMonth,
                listHoursOffOfUnitsByStartDateAndEndDate: nextProps.timesheets.listHoursOffOfUnitsByStartDateAndEndDate,
            }
        }
        return null;

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.annualLeave.arrMonth.length !== this.state.arrMonth.length ||
            nextState.lineChart !== this.state.lineChart ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.annualLeave.listAnnualLeaveOfNumberMonth, this.state.listAnnualLeaveOfNumberMonth) ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.timesheets.listHoursOffOfUnitsByStartDateAndEndDate, this.state.listHoursOffOfUnitsByStartDateAndEndDate) ||
            JSON.stringify(nextState.organizationalUnitsSearch) !== JSON.stringify(this.state.organizationalUnitsSearch)) {
            return true;
        }
        return false;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.barChart;
        if (chart) {
            while (chart && chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu biểu đồ
     */
    renderChart = (data) => {
        data.data1.shift();
        data.data2.shift();
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });
        let fakeData2 = data.data2.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.barChart,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? 'spline' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1], ['data2', ...fakeData2]],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1], ['data2', ...data.data2]],
            });
        }, 300);
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        const { organizationalUnits, startDate, endDate } = this.state;
        await this.setState({
            startDateShow: startDate,
            endDateShow: endDate,
            organizationalUnitsSearch: organizationalUnits,
        })
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        this.props.getAnnualLeave({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, })
        this.props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, trendHoursOff: true })

    }

    render() {
        const { department, annualLeave, translate, timesheets, childOrganizationalUnit } = this.props;
        const { lineChart, nameChart, organizationalUnits, nameData1, nameData2, startDate, endDate, startDateShow, endDateShow, organizationalUnitsSearch } = this.state;

        let organizationalUnitsName = [];
        if (organizationalUnitsSearch) {
            organizationalUnitsName = department.list.filter(x => organizationalUnitsSearch.includes(x._id));
            organizationalUnitsName = organizationalUnitsName.map(x => x.name);
        }

        if (annualLeave.arrMonth.length !== 0) {
            let ratioX = ['x', ...annualLeave.arrMonth];
            let listHoursOffOfUnitsByStartDateAndEndDate = timesheets.listHoursOffOfUnitsByStartDateAndEndDate;
            let listAnnualLeaveOfNumberMonth = annualLeave.listAnnualLeaveOfNumberMonth;
            let data1 = ['data1'], data2 = ['data2'];
            annualLeave.arrMonth.forEach(x => {
                let total = 0;
                let date = new Date(x);
                let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                listAnnualLeaveOfNumberMonth.forEach(y => {
                    if (firstDay.getTime() < new Date(y.startDate).getTime() && new Date(y.startDate).getTime() <= lastDay.getTime()) {
                        total += 1;
                    }
                })
                data1 = [...data1, total]
                let hoursOff = 0;
                listHoursOffOfUnitsByStartDateAndEndDate.forEach(y => {
                    if (new Date(y.month).getTime() === new Date(x).getTime()) {
                        hoursOff = hoursOff + y.totalHoursOff ? y.totalHoursOff : 0
                    };
                })
                data2 = [...data2, hoursOff]
            })
            this.renderChart({ nameData1, ratioX, data1, lineChart, nameData2, data2 });
        }
        return (
            <React.Fragment>
                <div className="box box-solid">
                    <div className="box-header with-border">
                        <div className="box-title">
                            {`${nameChart} của `}
                            {
                                organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                    <>
                                        <span>{` ${translate('task.task_dashboard.of_unit')}`}</span>
                                        <span style={{ fontWeight: "bold" }}>{` ${organizationalUnitsName?.[0]}`}</span>
                                    </>
                                    :
                                    <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                    </span>
                            } 
                            {` ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="qlcv" style={{ marginBottom: 15 }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    <SelectMulti id="multiSelectUnits"
                                        items={childOrganizationalUnit.map((p, i) => { return { value: p.id, text: p.name } })}
                                        options={{
                                            nonSelectedText: translate('page.non_unit'),
                                            allSelectedText: translate('page.all_unit'),
                                        }}
                                        onChange={this.handleSelectOrganizationalUnit}
                                        value={organizationalUnits}
                                    >
                                    </SelectMulti>
                                </div>
                                <div className="form-group">
                                    <label></label>
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                                </div>
                            </div>
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label className="form-control-static" >Từ tháng</label>
                                    <DatePicker
                                        id="form-month-annual-leave"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={startDate}
                                        onChange={this.handleStartMonthChange}
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className="form-control-static" >Đến tháng</label>
                                    <DatePicker
                                        id="to-month-annual-leave"
                                        dateFormat="month-year"
                                        deleteValue={false}
                                        value={endDate}
                                        onChange={this.handleEndMonthChange}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số lần</b></p>
                            <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Bar chart</button>
                                    <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Line chart</button>
                                </div>
                            </div>
                            <div ref="barChart"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

function mapState(state) {
    const { employeesManager, annualLeave, timesheets, department } = state;
    return { employeesManager, annualLeave, timesheets, department };
}

const actionCreators = {
    getAnnualLeave: AnnualLeaveActions.searchAnnualLeaves,
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const barChart = connect(mapState, actionCreators)(withTranslate(AnnualLeaveTrendsChart));
export { barChart as AnnualLeaveTrendsChart };
