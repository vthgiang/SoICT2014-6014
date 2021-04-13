/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { showListInSwal } from '../../../../helpers/showListInSwal';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import c3 from 'c3';
import 'c3/c3.css';

const HumanResourceIncreaseAndDecreaseChart = (props) => {
    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 3), true);

    const [state, setState] = useState({
        lineChart: false,
        startDate: _startDate,
        startDateShow: _startDate,
        endDate: formatDate(Date.now(), true),
        endDateShow: formatDate(Date.now(), true),
        organizationalUnits: props.defaultUnit ? props?.childOrganizationalUnit?.map(item => item?.id) : [],
        organizationalUnitsSearch: props.defaultUnit ? props?.childOrganizationalUnit?.map(item => item?.id) : [],
    })

    useEffect(() => {
        const { organizationalUnits, startDate, endDate } = state;
        let arrStart = startDate.split('-');
        let startDateNew = [arrStart[1], arrStart[0]].join('-');

        let arrEnd = endDate.split('-');
        let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

        props.getAllEmployee({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew });
    }, [])

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
            if (items1[i].startingDate !== items2[i].startingDate) {
                return false;
            }
        }
        return true;
    }

    if (!state.arrMonth
        || props.employeesManager.arrMonth?.length !== state.arrMonth?.length
        || !isEqual(props.employeesManager.listEmployeesHaveStartingDateOfNumberMonth, state.listEmployeesHaveStartingDateOfNumberMonth)
        || !isEqual(props.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, state.listEmployeesHaveLeavingDateOfNumberMonth)
    ) {
        setState({
            ...state,
            nameChart: props.nameChart,
            nameData1: props.nameData1,
            nameData2: props.nameData2,
            nameData3: props.nameData3,
            arrMonth: props.employeesManager.arrMonth,
            listEmployeesHaveStartingDateOfNumberMonth: props.employeesManager.listEmployeesHaveStartingDateOfNumberMonth,
            listEmployeesHaveLeavingDateOfNumberMonth: props.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth
        })
    }

    const _chart = useRef(null);
    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = _chart.current;
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
            bindto: _chart.current,
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? 'spline' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                    data3: data.nameData3,
                },
                colors: {
                    data1: '#2ca02c',
                    data2: '#ff7f0e',
                    data3: '#1f77b4'
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
                columns: [data.ratioX, data.data3, ['data1', ...fakeData1],
                ['data2', ...fakeData2]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, data.data3, ['data1', ...data.data1],
                ['data2', ...data.data2]
                ],
            });
        }, 300);
    };

    /** Bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        const { organizationalUnits, startDate, endDate } = state;
        if (organizationalUnits?.length > 0) {
            await setState({
                ...state,
                startDateShow: startDate,
                endDateShow: endDate,
                organizationalUnitsSearch: organizationalUnits,
            });

            let arrStart = startDate.split('-');
            let startDateNew = [arrStart[1], arrStart[0]].join('-');

            let arrEnd = endDate.split('-');
            let endDateNew = [arrEnd[1], arrEnd[0]].join('-');

            props.getAllEmployee({ organizationalUnits: organizationalUnits, startDate: startDateNew, endDate: endDateNew });
        }
    }

    const { department, employeesManager, translate } = props;

    const { lineChart, nameChart, nameData1, nameData2, nameData3, startDate, endDate, startDateShow, endDateShow, organizationalUnits, organizationalUnitsSearch } = state;

    const { childOrganizationalUnit } = props;

    let organizationalUnitsName = [];
    if (organizationalUnitsSearch) {
        organizationalUnitsName = department.list.filter(x => organizationalUnitsSearch.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    if (employeesManager.arrMonth.length !== 0) {
        let ratioX = ['x', ...employeesManager.arrMonth];
        let listEmployeesHaveStartingDateOfNumberMonth = employeesManager.listEmployeesHaveStartingDateOfNumberMonth;
        let listEmployeesHaveLeavingDateOfNumberMonth = employeesManager.listEmployeesHaveLeavingDateOfNumberMonth;
        let data1 = ['data1'], data2 = ['data2'], data3 = ["data3", ...employeesManager.totalEmployees];
        employeesManager.arrMonth.forEach(x => {
            let date = new Date(x);
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            let total1 = 0, total2 = 0;
            listEmployeesHaveStartingDateOfNumberMonth.forEach(y => {
                if (y.startingDate && firstDay.getTime() < new Date(y.startingDate).getTime() && new Date(y.startingDate).getTime() <= lastDay.getTime()) {
                    total1 += 1;
                }
            })
            listEmployeesHaveLeavingDateOfNumberMonth.forEach(y => {
                if (y.leavingDate && firstDay.getTime() < new Date(y.leavingDate).getTime() && new Date(y.leavingDate).getTime() <= lastDay.getTime()) {
                    total2 += 1;
                }
            })
            data1 = [...data1, total1];
            data2 = [...data2, total2];
        })
        renderChart({ nameData1, nameData2, nameData3, ratioX, data1, data2, data3, lineChart });
    }

    return (
        <div className="box box-solid" >
            <div className="box-header with-border" >
                <div className="box-title" >
                    {`${nameChart} `}
                    {
                        organizationalUnitsName && organizationalUnitsName.length < 2 ?
                            <>
                                <span>{` ${translate('task.task_dashboard.of_unit')}`}</span>
                                <span>{` ${organizationalUnitsName?.[0]}`}</span>
                            </>
                            :
                            <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                            </span>
                    }
                    {` ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{`${endDateShow}`}
                </div>
            </div>
            <div className="box-body" >
                <div className="qlcv" style={{ marginBottom: 15 }} >
                    <div className="form-inline" >
                        <div className="form-group" >
                            <label className="form-control-static" > {translate('kpi.evaluation.dashboard.organizational_unit')} </label>
                            <SelectMulti id="multiSelectUnits-towBarChart"
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
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} > {translate('general.search')} </button>
                        </div>
                    </div>
                    <div className="form-inline" >
                        <div className="form-group">
                            <label className="form-control-static" >Từ tháng</label>
                            <DatePicker
                                id="form-month-hr"
                                dateFormat="month-year"
                                deleteValue={false}
                                value={startDate}
                                onChange={handleStartMonthChange}
                            />
                        </div>
                        <div className='form-group'>
                            <label className="form-control-static" >Đến tháng</label>
                            <DatePicker
                                id="to-month-hr"
                                dateFormat="month-year"
                                deleteValue={false}
                                value={endDate}
                                onChange={handleEndMonthChange}
                            />
                        </div>
                    </div>

                </div>
                <div className="dashboard_box_body" >
                    <p className="pull-left" style={{ marginBottom: 0 }} > < b > ĐV tính: Người </b></p >
                    <div className="box-tools pull-right" >
                        <div className="btn-group pull-rigth">
                            <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Bar chart</button>
                            <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Line chart</button>
                        </div>
                    </div>
                    <div ref={_chart} ></div>
                </div>
            </div>
        </div>
    )
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const increaseAndDecreaseChart = connect(mapState, actionCreators)(withTranslate(HumanResourceIncreaseAndDecreaseChart));
export { increaseAndDecreaseChart as HumanResourceIncreaseAndDecreaseChart };