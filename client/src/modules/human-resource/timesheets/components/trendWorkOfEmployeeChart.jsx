/* Biểu đồ xu làm thêm giờ của nhân viên */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DatePicker } from '../../../../common-components';
import { TimesheetsActions } from '../../timesheets/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

const TrendWorkOfEmployeeChart = (props) => {
    
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

    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);

    const [state, setState] = useState({
        lineChart: false,
        startDate: _startDate,
        startDateShow: _startDate,
        endDate: formatDate(Date.now(), true),
        endDateShow: formatDate(Date.now(), true),
        dataStatus: 0,
        arrMonth: [],
    })

    

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
            if (items1[i].totalHours !== items2[i].totalHours) {
                return false;
            }
        }
        return true;
    }

    if (state.employeeId !== props.employeeId) {
        let arrStart = state.startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = state.endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');
        props.getTimesheets({ callApiByEmployeeId: true, employeeId: props.employeeId, startDate: startDateNew, endDate: endDateNew });
        setState({
            ...state,
            employeeId: props.employeeId,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            nameData2: props.nameData2,
            dataStatus: 1,
        })
    }

    useEffect(() => {
        if (props.endDate === state.endDate || props.startDate === state.startDate) {
            setState({...state})
        }
    }, [props.endDate, props.startDate])

    const trendWork = useRef(null);

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = trendWork.current;
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
    const renderChart = (data) => {
        data.data1.shift();
        data.data2.shift();
        let fakeData1 = data.data1.map(x => 2 * x);
        let fakeData2 = data.data2.map(x => x / 2);
        removePreviousChart();
        let chart = c3.generate({
            bindto: trendWork.current,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? '' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                },
            },
            bar: {
                width: {
                    ratio: 0.8
                }
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
                    tick: {
                        outer: false
                    },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1],
                ['data2', ...fakeData2]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1],
                ['data2', ...data.data2]
                ],
            });
        }, 300);
    };

    /** Bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        const { startDate, endDate, employeeId } = state;
        await setState({
            ...state,
            startDateShow: startDate,
            endDateShow: endDate,
        });

        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        props.getTimesheets({ callApiByEmployeeId: true, employeeId: employeeId, startDate: startDateNew, endDate: endDateNew, })
    }

    const { timesheets, translate } = props;
    const { lineChart, nameChart, nameData1, nameData2, employeeId, startDate, endDate, startDateShow, endDateShow } = state;
    let listTimesheetsByEmployeeIdAndTime = timesheets.listTimesheetsByEmployeeIdAndTime;

    if (listTimesheetsByEmployeeIdAndTime.length !== 0) {
        let ratioX = ['x', ...timesheets.arrMonthById];
        let data1 = ['data1'], data2 = ['data2'];
        timesheets.arrMonthById.forEach(x => {
            let month = `${new Date(x).getFullYear()}-${new Date(x).getMonth()}`;
            let data = listTimesheetsByEmployeeIdAndTime.find(x => `${new Date(x.month).getFullYear()}-${new Date(x.month).getMonth()}` === month);
            if (data) {
                data1 = [...data1, data.totalHours];
                data2 = [...data2, data.totalOvertime ? data.totalOvertime : 0];
            } else {
                data1 = [...data1, 0];
                data2 = [...data2, 0];
            }
        })
        renderChart({ nameData1, nameData2, ratioX, data1, data2, lineChart });
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-view-chart${employeeId}`} isLoading={timesheets.isLoading}
                formID="form-view-chart"
                title={`${nameChart} từ ${startDateShow} đến ${endDateShow}`}
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id="form-view-chart">
                    <div className="box box-solid">
                        <div className="box-body">
                            <div className="qlcv" style={{ marginBottom: 15 }}>
                                <div className="form-inline">
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

                                </div>
                                <div className="form-inline" >
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
                                    <div className="form-group">
                                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                                    </div>
                                </div>

                            </div>
                            <div className="dashboard_box_body">
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số giờ</b></p>
                                <div className="box-tools pull-right">
                                    <div className="btn-group pull-rigth">
                                        <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Bar chart</button>
                                        <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Line chart</button>
                                    </div>
                                </div>
                                <div ref={trendWork}></div>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { timesheets } = state;
    return { timesheets };
}

const actionCreators = {
    getTimesheets: TimesheetsActions.searchTimesheets,
};

const trendWorkOfEmployeeChart = connect(mapState, actionCreators)(withTranslate(TrendWorkOfEmployeeChart));
export { trendWorkOfEmployeeChart as TrendWorkOfEmployeeChart };
