/* Xu hướng tăng giảm nhân sự của nhân viên */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../common-components';
import { showListInSwal } from '../../../../helpers/showListInSwal';

import { getEmployeeDashboardActions } from "../redux/actions"

import c3 from 'c3';
import 'c3/c3.css';

const HumanResourceIncreaseAndDecreaseChart = (props) => {
    const { employeesManager, translate, employeeDashboardData, date, organizationalUnits } = props;
    const { childOrganizationalUnit } = props;

    const [state, setState] = useState({
        lineChart: false,
        startDate: date.startDateIncreaseAndDecreaseChart,
        startDateShow: date.startDateIncreaseAndDecreaseChart,
        endDate: date.endDate,
        endDateShow: date.endDate,
        organizationalUnits: props.defaultUnit ? props?.childOrganizationalUnit?.map(item => item?.id) : [],
        organizationalUnitsSearch: props.defaultUnit ? props?.childOrganizationalUnit?.map(item => item?.id) : [],
        organizationalUnitsName: []
    })
    const { lineChart, nameChart, nameData1, nameData2, nameData3, startDate, endDate, startDateShow, endDateShow } = state;

    useEffect(() => {
        if (employeeDashboardData.humanResourceIncreaseAndDecreaseChartData?.data1) {
            let data1 = [...employeeDashboardData.humanResourceIncreaseAndDecreaseChartData.data1]
            let data2 = [...employeeDashboardData.humanResourceIncreaseAndDecreaseChartData.data2]
            let data3 = [...employeeDashboardData.humanResourceIncreaseAndDecreaseChartData.data3]
            let ratioX = [...employeeDashboardData.humanResourceIncreaseAndDecreaseChartData.ratioX]
            renderChart({ nameData1, nameData2, nameData3, lineChart, data1: data1, data2: data2, data3: data3, ratioX: ratioX });
        }
    }, [employeeDashboardData.humanResourceIncreaseAndDecreaseChartData, lineChart, employeeDashboardData.isLoading]);
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
        });
    }

    /**
     * Bắt sự kiện thay đổi ngày kết thúc
     * @param {*} value : Giá trị ngày kết thúc
     */
    const handleEndMonthChange = (value) => {
        setState({
            ...state,
            endDate: value,
        });
    }

    /**
     * Bắt sự kiện thay đổi chế đọ xem biểu đồ
     * @param {*} value : chế độ xem biểu đồ (true or false)
     */
    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            lineChart: value
        });
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
        || employeesManager.arrMonth?.length !== state.arrMonth?.length
        || !isEqual(employeesManager.listEmployeesHaveStartingDateOfNumberMonth, state.listEmployeesHaveStartingDateOfNumberMonth)
        || !isEqual(employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, state.listEmployeesHaveLeavingDateOfNumberMonth)
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
        });
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
    function renderChart(data) {
        data.data1.shift();
        data.data2.shift();
        removePreviousChart();
        let chart = c3.generate({
            bindto: _chart.current,
            data: {
                x: 'x',
                columns: [
                    data.ratioX, data.data3,
                    ['data1', ...data.data1],
                    ['data2', ...data.data2]
                ],
                type: data.lineChart === true ? '' : 'bar',
                labels: data.lineChart === true ? false : true,
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

            props.getEmployeeDashboardData({
                searchChart: {
                    increaseAndDecreaseChart: { organizationalUnits: organizationalUnits, startDate: startDateNew,endDate: endDateNew }
                }
            })
        }
    }

    let organizationalUnitsName = [];
    if (organizationalUnits) {
        organizationalUnitsName = childOrganizationalUnit.filter(x => organizationalUnits.includes(x.id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    return (
        <div className="box box-solid" >
            <div className="box-header with-border" >
                <div className="box-title" >
                    {`${nameChart} `}
                    {
                        organizationalUnitsName && organizationalUnitsName.length < 2 ?
                            <>
                                <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""} `}</span>
                            </>
                            :
                            <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                    }
                    {` ${startDateShow}`}<i className="fa fa-fw fa-caret-right"></i>{`${endDateShow}`}
                </div>
            </div>
            <div className="box-body" >
                <div className="qlcv" style={{ marginBottom: 15 }} >
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
                    <div className="form-inline" >
                        {!props.defaultUnit
                            && <div className="form-group" >
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
                        }
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} > {translate('general.search')} </button>
                        </div>
                    </div>
                </div>
                {employeeDashboardData.isLoading
                    ? <p>{translate('general.loading')}</p>
                    : <div className="dashboard_box_body" >
                        <p className="pull-left" style={{ marginBottom: 0 }} > < b > ĐV tính: Người </b></p >
                        <div className="box-tools pull-right" >
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Bar chart</button>
                                <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Line chart</button>
                            </div>
                        </div>
                        <div ref={_chart} ></div>
                    </div>
                }
            </div>
        </div>
    )
}

function mapState(state) {
    const { employeesManager, department, employeeDashboardData } = state;
    return { employeesManager, department, employeeDashboardData };
}

const actionCreators = {
    getEmployeeDashboardData: getEmployeeDashboardActions.getEmployeeDashboardData,

};

const increaseAndDecreaseChart = connect(mapState, actionCreators)(withTranslate(HumanResourceIncreaseAndDecreaseChart));
export { increaseAndDecreaseChart as HumanResourceIncreaseAndDecreaseChart };