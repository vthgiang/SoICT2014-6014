/* Biểu đồ xu làm thêm giờ của nhân viên */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { TimesheetsActions } from '../../timesheets/redux/actions';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDate = (date, monthYear = false) => {
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

const TrendOfOvertime = (props) => {
    const { department, timesheets, translate, childOrganizationalUnit, idUnits, unitName } = props;

    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);

    const [state, setState] = useState({
        lineChart: false,
        startDate: _startDate,
        startDateShow: _startDate,
        endDate: formatDate(Date.now(), true),
        endDateShow: formatDate(Date.now(), true),
        organizationalUnitsSearch: props.defaultUnit ? props.organizationalUnits : [],
        organizationalUnits: props.defaultUnit ? props.organizationalUnits : [],
    })
    const { lineChart, nameChart, nameData1, startDate, endDate, startDateShow, endDateShow, organizationalUnits, organizationalUnitsSearch } = state;

    const barChart = useRef(null)

    useEffect(() => {
        const { startDate, endDate } = state;
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        if (props?.idUnits?.length)
            props.getTimesheets({ organizationalUnits: props.idUnits, startDate: startDateNew, endDate: endDateNew, trendOvertime: true })
    }, [JSON.stringify(props?.idUnits)]);

    useEffect(() => {
        if (timesheets?.arrMonth?.length > 0) {
            let ratioX = ['x', ...timesheets.arrMonth];
            let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate;
            let data1 = ['data1'];
            timesheets.arrMonth.forEach(x => {
                let overtime = 0;
                listOvertimeOfUnitsByStartDateAndEndDate.forEach(y => {
                    if (dayjs(y.month).format("MM-YYYY") === dayjs(x).format("MM-YYYY")) {
                        let totalOvertime = y.totalOvertime ? y.totalOvertime : 0;
                        overtime = overtime + totalOvertime
                    };
                })
                data1 = [...data1, overtime]
            })
            renderChart({ nameData1, ratioX, data1, lineChart });
        }
    }, [JSON.stringify(props?.timesheets?.listOvertimeOfUnitsByStartDateAndEndDate), JSON.stringify(props?.timesheets?.arrMonth)])
    /**
     * Function bắt sự kiện thay đổi unit
     * @param {*} value : Array id đơn vị
     */
    const handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState({
            ...state,
            organizationalUnits: value
        })
    };

    /**
     * Bắt sự kiện thay đổi ngày bắt đầu
     * @param {*} value : Giá trị ngày bắt đầu
     */
    const handleStartMonthChange = (value) => {
        setState({
            ...state,
            startDate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    const handleEndMonthChange = (value) => {
        setState({
            ...state,
            endDate: value,
        })
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            lineChart: value
        })
    }

    const isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    if (!state.arrMonth
        || props.timesheets.arrMonth?.length !== state.arrMonth?.length
        || !isEqual(props.timesheets.listOvertimeOfUnitsByStartDateAndEndDate, state.listOvertimeOfUnitsByStartDateAndEndDate)
        || props.nameChart !== state.nameChart
        || props.nameData1 !== state.nameData1
        || props.nameData2 !== state.nameData2
    ) {
        setState(state => ({
            ...state,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            arrMonth: props.timesheets.arrMonth,
            listOvertimeOfUnitsByStartDateAndEndDate: props.timesheets.listOvertimeOfUnitsByStartDateAndEndDate,
        }))
    }

    useEffect(() => {
        if (props.timesheets.arrMonth?.length !== state.arrMonth?.length ||
            !isEqual(props.timesheets.listOvertimeOfUnitsByStartDateAndEndDate, state.listOvertimeOfUnitsByStartDateAndEndDate)) {
            setState({ ...state });
        }
    }, [props.timesheets.arrMonth, state.arrMonth, state.lineChart, props.timesheets.listOvertimeOfUnitsByStartDateAndEndDate, state.listOvertimeOfUnitsByStartDateAndEndDate])

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = barChart.current;
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
    function renderChart(data) {
        data.data1.shift();
        removePreviousChart();
        let chart = c3.generate({
            bindto: barChart.current,
            data: {
                x: 'x',
                columns: [data.ratioX, ['data1', ...data.data1]],
                type: data.lineChart === true ? '' : 'bar',
                labels: data.lineChart === true ? false : true,
                names: {
                    data1: data.nameData1,
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
    }

    /** Bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        const { organizationalUnits, startDate, endDate } = state;
        await setState({
            ...state,
            startDateShow: startDate,
            endDateShow: endDate,
            organizationalUnitsSearch: organizationalUnits,
        })
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');
        if (new Date(startDateNew).getTime() < new Date(endDateNew).getTime()) {
            props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, trendOvertime: true })
        }
    }

    const showDetailTrendOfOverTimeCharts = () => {
        Swal.fire({
            icon: "question",
            html: `<h4><div>Biểu đồ xu hướng tăng ca được lấy dữ liệu tăng ca của nhân viên dựa theo chấm công</div> </h4>`,
            width: "50%",
        })
    }

    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title" style={{ marginRight: '5px' }}>
                        {`${nameChart} `}
                        {
                            unitName && unitName.length < 2 ?
                                <>
                                    <span>{` ${unitName?.[0] ? unitName?.[0] : ""} `}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(unitName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                </span>
                        }
                        {` ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}
                    </div>
                    <a title={'Giải thích'} onClick={showDetailTrendOfOverTimeCharts}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', }} />
                    </a>
                </div>
                <div className="box-body">
                    <div className="qlcv" style={{ marginBottom: 15 }}>
                        <div className="form-inline" >
                            <div className="form-group">
                                <label className="form-control-static" >Từ tháng</label>
                                <DatePicker
                                    id="form-month-overtime"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={handleStartMonthChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-control-static" >Đến tháng</label>
                                <DatePicker
                                    id="to-month-overtime"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={endDate}
                                    onChange={handleEndMonthChange}
                                />
                            </div>
                        </div>
                        <div className="form-inline">
                            {!props.defaultUnit
                                && <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    <SelectMulti id="multiSelectUnitsOvertime"
                                        items={childOrganizationalUnit.map((p, i) => { return { value: p.id, text: p.name } })}
                                        options={{
                                            nonSelectedText: translate('page.non_unit'),
                                            allSelectedText: translate('page.all_unit'),
                                        }}
                                        onChange={handleSelectOrganizationalUnit}
                                        value={organizationalUnits}
                                    >
                                    </SelectMulti>
                                </div>
                            }
                            <div className="form-group">
                                <label></label>
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                            </div>
                        </div>
                    </div>
                    {timesheets.isLoading
                        ? <div>{translate('general.loading')}</div>
                        : timesheets?.arrMonth?.length > 0
                            ? <div className="dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số giờ</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth">
                                        <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Dạng cột</button>
                                        <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Dạng đường</button>
                                    </div>
                                </div>
                                <div ref={barChart}></div>
                            </div>
                            : <div>{translate('kpi.organizational_unit.dashboard.no_data')}</div>
                    }
                </div>
            </div>
        </React.Fragment >
    )
}

function mapState(state) {
    const { employeesManager, timesheets, department } = state;
    return { employeesManager, timesheets, department };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const trendOfOvertime = connect(mapState, actionCreators)(withTranslate(TrendOfOvertime));
export { trendOfOvertime as TrendOfOvertime };
