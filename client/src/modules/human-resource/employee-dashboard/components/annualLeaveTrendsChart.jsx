/* Biểu đồ xu hướng nghỉ phép của nhân viên */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';


import { SelectMulti, DatePicker } from '../../../../common-components';
import { getEmployeeDashboardActions } from "../redux/actions"

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css'
import Swal from 'sweetalert2';

const AnnualLeaveTrendsChart = (props) => {
    const { translate, childOrganizationalUnit, idUnits, unitName, employeeDashboardData, date } = props;

    const [state, setState] = useState({
        countAnnuaLeave: true,
        startDate: date.startDateAnnualLeaveTrendsChart,
        startDateShow: date.startDateAnnualLeaveTrendsChart,
        endDate: date.endDateAnnualLeaveTrendsChart,
        endDateShow: date.endDateAnnualLeaveTrendsChart,
        organizationalUnits: idUnits ? idUnits : [],
        data1: employeeDashboardData.annualLeaveTrendChartData.data1 ? { ratioX: employeeDashboardData.annualLeaveTrendChartData.data1.ratioX, data: employeeDashboardData.annualLeaveTrendChartData.data1.data } : {ratioX: [], data: []},
        data2: employeeDashboardData.annualLeaveTrendChartData.data2 ? { ratioX: employeeDashboardData.annualLeaveTrendChartData.data2.ratioX, data: employeeDashboardData.annualLeaveTrendChartData.data2.data } : {ratioX: [], data: []},
    })
    const { countAnnuaLeave, nameChart, organizationalUnits, nameData1, nameData2, startDate, endDate, startDateShow, endDateShow } = state;

    const barChart = useRef(null);

    const formatNewDate = (date) => {
        let partDate = date.split('-');
        return [partDate[1],partDate[0]].join('-');
    }

    if ( props.nameChart !== state.nameChart
        || props.nameData1 !== state.nameData1
        || props.nameData2 !== state.nameData2
    ) {
        setState({
            ...state,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            nameData2: props.nameData2
        });
    }
    useEffect(() => {
        setState({
            ...state,
            data1: { ratioX: employeeDashboardData.annualLeaveTrendChartData.data1?.ratioX, data: employeeDashboardData.annualLeaveTrendChartData.data1?.data },
            data2: { ratioX: employeeDashboardData.annualLeaveTrendChartData.data2?.ratioX, data: employeeDashboardData.annualLeaveTrendChartData.data2?.data }
        })
    }, [employeeDashboardData.annualLeaveTrendChartData?.data1?.data, employeeDashboardData.annualLeaveTrendChartData?.data2?.data])

    const { data1, data2 } = state
    useEffect(() => {
        let nameData
        let data = [], ratioX = [];
        if (countAnnuaLeave) {
            nameData = nameData1
            data = [...data1.data]
            ratioX = [...data1.ratioX]
        } else {
            nameData = nameData2
            data = [...data2.data]
            ratioX = [...data2.data]
        }
        renderChart({nameData, ratioX, data})
    }, [countAnnuaLeave, data1, data2])
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
        props.date.handleChangeAnnualLeaveTrendsChartTime(value, endDate)
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
        props.date.handleChangeAnnualLeaveTrendsChartTime(startDate, value)
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
       
        if (organizationalUnits?.length > 0) {
            props.getEmployeeDashboardData({
                searchChart: {
                    annualLeaveTrendChart: { organizationalUnits: props.organizationalUnits, startDate: formatNewDate(startDate), endDate: formatNewDate(endDate) }
                }
            })
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
    
    useEffect(() => {
        setState({
            ...state,
            startDate: date.startDateAnnualLeaveTrendsChart,
            startDateShow: date.startDateAnnualLeaveTrendsChart,
            endDate: date.endDateAnnualLeaveTrendsChart,
            endDateShow: date.endDateAnnualLeaveTrendsChart,
        })
    }, [date.month]);
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
                    {employeeDashboardData.isLoading
                        ? <div>{translate('general.loading')}</div>
                        : employeeDashboardData.annualLeaveTrendChartData?.arrMonth?.length > 0
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
    const { employeeDashboardData } = state;
    return { employeeDashboardData };
}

const actionCreators = {
    getEmployeeDashboardData: getEmployeeDashboardActions.getEmployeeDashboardData,
};

const barChart = connect(mapState, actionCreators)(withTranslate(AnnualLeaveTrendsChart));
export { barChart as AnnualLeaveTrendsChart };
