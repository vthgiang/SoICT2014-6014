import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, SelectBox } from '../../../../common-components';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class TwoBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChart: false,
            numberMonth: 12,
            numberMonthShow: 12,
            organizationalUnitsSearch: []
        }
    }

    componentDidMount() {
        const { organizationalUnits, numberMonth } = this.state;
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, numberMonth: numberMonth });
    }

    // Function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            organizationalUnits: value
        })
    };

    // Function bắt sự kiện thay đổi số lượng tháng hiện thị
    handleNumberMonthChange = (value) => {
        this.setState({
            numberMonth: value
        })
    }

    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
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
            if (items1[i].startingDate !== items2[i].startingDate) {
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.arrMonth || nextProps.employeesManager.arrMonth.length !== prevState.arrMonth.length ||
            !TwoBarChart.isEqual(nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth, prevState.listEmployeesHaveStartingDateOfNumberMonth) ||
            !TwoBarChart.isEqual(nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, prevState.listEmployeesHaveLeavingDateOfNumberMonth)) {
            return {
                ...prevState,
                nameChart: nextProps.nameChart,
                nameData1: nextProps.nameData1,
                nameData2: nextProps.nameData2,
                arrMonth: nextProps.employeesManager.arrMonth,
                listEmployeesHaveStartingDateOfNumberMonth: nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth,
                listEmployeesHaveLeavingDateOfNumberMonth: nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth
            }
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.employeesManager.arrMonth.length !== this.state.arrMonth.length ||
            nextState.lineChart !== this.state.lineChart ||
            !TwoBarChart.isEqual(nextProps.employeesManager.listEmployeesHaveStartingDateOfNumberMonth, this.state.listEmployeesHaveStartingDateOfNumberMonth) ||
            !TwoBarChart.isEqual(nextProps.employeesManager.listEmployeesHaveLeavingDateOfNumberMonth, this.state.listEmployeesHaveLeavingDateOfNumberMonth) ||
            JSON.stringify(nextState.organizationalUnitsSearch) !== JSON.stringify(this.state.organizationalUnitsSearch)) {
            return true;
        }
        return false;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.chart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    renderChart = (data) => {
        data.data1.shift();
        data.data2.shift();
        let fakeData1 = data.data1.map(x => 2 * x);
        let fakeData2 = data.data2.map(x => x / 2);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.chart,
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

    // Bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        const { organizationalUnits, numberMonth } = this.state;
        this.setState({
            numberMonthShow: numberMonth,
            organizationalUnitsSearch: organizationalUnits,
        })
        this.props.getAllEmployee({ organizationalUnits: organizationalUnits, numberMonth: numberMonth })
    }

    render() {
        const { department, employeesManager, translate } = this.props;
        const { lineChart, nameChart, nameData1, nameData2, numberMonth, numberMonthShow } = this.state;
        if (employeesManager.arrMonth.length !== 0) {
            let ratioX = ['x', ...employeesManager.arrMonth];
            let listEmployeesHaveStartingDateOfNumberMonth = employeesManager.listEmployeesHaveStartingDateOfNumberMonth;
            let listEmployeesHaveLeavingDateOfNumberMonth = employeesManager.listEmployeesHaveLeavingDateOfNumberMonth;
            console.log(listEmployeesHaveLeavingDateOfNumberMonth);
            console.log(listEmployeesHaveStartingDateOfNumberMonth);
            let data1 = ['data1'], data2 = ['data2'];
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
            console.log(data1);
            console.log(data2);

            this.renderChart({ nameData1, nameData2, ratioX, data1, data2, lineChart });
        }
        return (
            <div className="box" >
                <div className="box-header with-border" >
                    <h3 className="box-title" > {nameChart} </h3> </div>
                <div className="box-body" >
                    <div className="qlcv" style={{ marginBottom: 15 }} >
                        <div className="form-inline" >
                            <div className="form-group" >
                                <label className="form-control-static" > {translate('kpi.evaluation.dashboard.organizational_unit')} </label>
                                <SelectMulti id="multiSelectUnits-towBarChart"
                                    items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                                    options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                    onChange={this.handleSelectOrganizationalUnit} >
                                </SelectMulti>
                            </div>
                            <div className="form-group" >
                                <label className="form-control-static" > Số tháng </label>
                                <SelectBox id={`numberMonth-towBarChart`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={numberMonth}
                                    items={[{ value: 6, text: '6 tháng' }, { value: 12, text: '12 tháng' }]}
                                    onChange={this.handleNumberMonthChange}
                                />
                            </div>
                            <div className="form-group" >
                                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} > {translate('general.search')} </button>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard_box_body" >
                        <p className="pull-left" style={{ marginBottom: 0 }} > < b > ĐV tính: % </b></p >
                        <div className="box-tools pull-right" >
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>Bar chart</button>
                                <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeViewChart(true)}>Line chart</button>
                            </div>
                        </div>
                        <div ref="chart" ></div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const twoBarChart = connect(mapState, actionCreators)(withTranslate(TwoBarChart));
export { twoBarChart as TwoBarChart };