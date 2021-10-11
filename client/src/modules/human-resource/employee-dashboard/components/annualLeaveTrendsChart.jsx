/* Biểu đồ xu hướng nghỉ phép của nhân viên */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { TimesheetsActions } from '../../timesheets/redux/actions';
import { SelectMulti, DatePicker } from '../../../../common-components';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css'
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
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

const AnnualLeaveTrendsChart = (props) => {
    const { annualLeave, translate, timesheets, childOrganizationalUnit, idUnits, unitName } = props;

    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);

    const [state, setState] = useState({
        countAnnuaLeave: true,
        startDate: _startDate,
        startDateShow: _startDate,
        endDate: formatDate(Date.now(), true),
        endDateShow: formatDate(Date.now(), true),
        organizationalUnits: idUnits ? idUnits : [],
    })
    const { countAnnuaLeave, nameChart, organizationalUnits, nameData1, nameData2, startDate, endDate, startDateShow, endDateShow } = state;

    const barChart = useRef(null);

    useEffect(() => {
        const { startDate, endDate } = state;
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');
        if (props?.idUnits?.length) {
            props.getAnnualLeave({ organizationalUnits: props.idUnits, startDate: startDateNew, endDate: endDateNew })
            props.getTimesheets({ organizationalUnits: props.idUnits, startDate: startDateNew, endDate: endDateNew, trendHoursOff: true })
        }
    }, [JSON.stringify(props?.idUnits)]);


    useEffect(() => {
        if (annualLeave?.arrMonth?.length > 0) {
            let arrMonth = cloneDeep(annualLeave?.arrMonth);
            arrMonth = arrMonth.reverse();

            let ratioX1 = [], ratioX2 = [];
            if (countAnnuaLeave) {
                // Xử lý dữ liệu lấy số lượt nghỉ phép.
                let listAnnualLeaveOfNumberMonth = JSON.parse(JSON.stringify(annualLeave.listAnnualLeaveOfNumberMonth));
                let data1 = ['data1']
                arrMonth.forEach(x => {
                    ratioX1 = [...ratioX1, dayjs(x).format("MM-YYYY")];
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
                })
                renderChart({ nameData: nameData1, ratioX: ratioX1, data: data1 });
            } else {
                // Xử lý dữ liệu lấy số giờ nghỉ phép
                let listHoursOffOfUnitsByStartDateAndEndDate = JSON.parse(JSON.stringify(timesheets.listHoursOffOfUnitsByStartDateAndEndDate));

                let data2 = ['data2'];
                arrMonth.forEach(x => {
                    ratioX2 = [...ratioX2, dayjs(x).format("MM-YYYY")]
                    let hoursOff = 0;
                    listHoursOffOfUnitsByStartDateAndEndDate.forEach(y => {
                        if (dayjs(y.month).format("MM-YYYY") === dayjs(x).format("MM-YYYY")) {
                            let totalHoursOff = y.totalHoursOff ? y.totalHoursOff : 0;
                            hoursOff = hoursOff + totalHoursOff
                        };
                    })
                    data2 = [...data2, hoursOff]
                })
                renderChart({ nameData: nameData2, ratioX: ratioX2, data: data2, });
            }
        }
    }, [JSON.stringify(props?.annualLeave?.listAnnualLeaveOfNumberMonth), JSON.stringify(props?.timesheets?.listHoursOffOfUnitsByStartDateAndEndDate), JSON.stringify(props?.annualLeave?.arrMonth), state.countAnnuaLeave])

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
    const handleChangeDataChart = (value) => {
        setState({
            ...state,
            countAnnuaLeave: value
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
            if (items1[i].startDate !== items2[i].startDate || items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    if (!state.arrMonth
        || props.annualLeave.arrMonth?.length !== state.arrMonth?.length
        || !isEqual(props.annualLeave.listAnnualLeaveOfNumberMonth, state.listAnnualLeaveOfNumberMonth)
        || !isEqual(props.timesheets.listHoursOffOfUnitsByStartDateAndEndDate, state.listHoursOffOfUnitsByStartDateAndEndDate)
        || props.nameChart !== state.nameChart
        || props.nameData1 !== state.nameData1
        || props.nameData2 !== state.nameData2
    ) {
        setState({
            ...state,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            nameData2: props.nameData2,
            arrMonth: props.annualLeave.arrMonth,
            listAnnualLeaveOfNumberMonth: props.annualLeave.listAnnualLeaveOfNumberMonth,
            listHoursOffOfUnitsByStartDateAndEndDate: props.timesheets.listHoursOffOfUnitsByStartDateAndEndDate,
        });
    }

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
        removePreviousChart();
        data.data.shift();

        let chart = c3.generate({
            bindto: barChart.current,
            data: {
                columns: [[data.nameData, ...data.data]],
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    categories: data.ratioX,

                },
                y: {
                    show: true,
                    label: countAnnuaLeave ? 'Số lượt' : 'Số giờ'
                },
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
        })
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        if (organizationalUnits?.length > 0) {
            props.getAnnualLeave({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, })
            props.getTimesheets({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew, trendHoursOff: true })
        }
    }


    const showDetailAnnualLeaveTrenCharts = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Biểu đồ thống kê nghỉ phép các đơn vị:</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Có 2 đường thống kê như sau</p>
            <ul>
                <li><b>Số lượt nghỉ:</b> được tính bằng cách thống kê tổng số đơn xin nghỉ phép đã được chấp nhận của từng nhân viên thuộc các đơn vị theo tháng</li>
                <li><b>Số giờ nghỉ phép: </b>được tính dựa bằng cách thống kê số giờ nghỉ phép của từng nhân viên dựa vào phần chấm công</li>
            </ul>`,
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
                                    <span>{` ${unitName?.[0]} `}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(unitName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {unitName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                </span>
                        }
                        {` ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{endDateShow}
                    </div>
                    <a title={'Giải thích'} onClick={showDetailAnnualLeaveTrenCharts}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', }} />
                    </a>
                </div>
                <div className="box-body">
                    <div className="qlcv" style={{ marginBottom: 15 }}>
                        <div className="form-inline" >
                            <div className="form-group">
                                <label className="form-control-static" >Từ tháng</label>
                                <DatePicker
                                    id="form-month-annual-leave"
                                    dateFormat="month-year"
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={handleStartMonthChange}
                                />
                            </div>
                            <div className='form-group'>
                                <label className="form-control-static" >Đến tháng</label>
                                <DatePicker
                                    id="to-month-annual-leave"
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
                                    <SelectMulti id="multiSelectUnits"
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
                    {annualLeave.isLoading
                        ? <div>{translate('general.loading')}</div>
                        : annualLeave?.arrMonth?.length > 0
                            ? <div className="dashboard_box_body">
                                {/* <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số lần</b></p> */}
                                <div className="box-tools pull-right" style={{ marginBottom: '10px' }}>
                                    <div className="btn-group pull-rigth">
                                        <button type="button" className={`btn btn-xs ${countAnnuaLeave ? 'btn-danger' : "active"}`} onClick={() => handleChangeDataChart(true)}>{nameData1}</button>
                                        <button type="button" className={`btn btn-xs ${countAnnuaLeave ? "active" : "btn-danger"}`} onClick={() => handleChangeDataChart(false)}>{nameData2}</button>
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
    const { annualLeave, timesheets } = state;
    return { annualLeave, timesheets };
}

const actionCreators = {
    getAnnualLeave: AnnualLeaveActions.searchAnnualLeaves,
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const barChart = connect(mapState, actionCreators)(withTranslate(AnnualLeaveTrendsChart));
export { barChart as AnnualLeaveTrendsChart };
