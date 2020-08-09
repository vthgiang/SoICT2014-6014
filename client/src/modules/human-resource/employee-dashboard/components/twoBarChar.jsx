import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    withTranslate
} from 'react-redux-multilingual';

import {
    EmployeeManagerActions
} from '../../profile/employee-management/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class TwoBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lineChart: false,
        }
    }

    componentDidMount() {
        this.props.getAllEmployee({
            organizationalUnits: undefined,
            numberMonth: 12
        });
        this.renderChart(this.state);
    }
    componentDidUpdate() {
        this.renderChart(this.state);
    }
    // Bắt sự kiện thay đổi chế đọ xem biểu đồ
    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            lineChart: value
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            ...prevState,
            nameChart: nextProps.nameChart,
            nameData1: nextProps.nameData1,
            nameData2: nextProps.nameData2,
            ratioX: ['x', "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-02", "2019-12-01", "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01"],
            data1: ['data1', 12, 15, 8, 13, 10, 18, 5, 14, 6, 18, 6, 9],
            data2: ['data1', 2, 6, 5, 8, 3, 5, 7, 2, 8, 6, 4, 3],
        }
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
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
    render() {
        const { department, employeesManager, translate } = this.props;
        const { lineChart, nameChart } = this.state;
        return (
            <div className="box" >
                <div className="box-header with-border" >
                    <h3 className="box-title" > {nameChart} </h3> </div>
                <div className="box-body" >
                    <div className="qlcv" style={{ marginBottom: 15 }} >
                        <div className="form-inline" >
                            <div className="form-group" >
                                <label className="form-control-static" > {translate('kpi.evaluation.dashboard.organizational_unit')} </label>
                                <SelectMulti id="multiSelectUnits"
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