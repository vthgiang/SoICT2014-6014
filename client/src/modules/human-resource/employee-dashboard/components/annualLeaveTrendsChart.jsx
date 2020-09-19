import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { SelectMulti, SelectBox } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

class AnnualLeaveTrendsChart extends Component {
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
        this.props.getAnnualLeave({ organizationalUnits: organizationalUnits, numberMonth: numberMonth })
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
            if (items1[i].startDate !== items2[i].startDate) {
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.arrMonth || nextProps.annualLeave.arrMonth.length !== prevState.arrMonth.length ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.annualLeave.listAnnualLeaveOfNumberMonth, prevState.listAnnualLeaveOfNumberMonth)) {
            return {
                ...prevState,
                nameChart: nextProps.nameChart,
                nameData1: nextProps.nameData1,
                arrMonth: nextProps.annualLeave.arrMonth,
                listAnnualLeaveOfNumberMonth: nextProps.annualLeave.listAnnualLeaveOfNumberMonth,
            }
        }
        return null;

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.annualLeave.arrMonth.length !== this.state.arrMonth.length ||
            nextState.lineChart !== this.state.lineChart ||
            !AnnualLeaveTrendsChart.isEqual(nextProps.annualLeave.listAnnualLeaveOfNumberMonth, this.state.listAnnualLeaveOfNumberMonth) ||
            JSON.stringify(nextState.organizationalUnitsSearch) !== JSON.stringify(this.state.organizationalUnitsSearch)) {
            return true;
        }
        return false;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.barChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    renderChart = (data) => {
        data.data1.shift();
        let fakeData1 = data.data1.map((x, index) => {
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
                },
                colors: {
                    data1: '#ff7f0e',
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
                columns: [data.ratioX, ['data1', ...fakeData1]],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1]],
            });
        }, 300);
    }

    // Bắt sự kiện tìm kiếm 
    handleSunmitSearch = async () => {
        const { organizationalUnits, numberMonth } = this.state;
        this.setState({
            numberMonthShow: numberMonth,
            organizationalUnitsSearch: organizationalUnits,
        })
        this.props.getAnnualLeave({ organizationalUnits: organizationalUnits, numberMonth: numberMonth })

    }

    render() {
        const { department, annualLeave, translate } = this.props;
        const { lineChart, nameChart, numberMonth, nameData1, numberMonthShow } = this.state;

        if (annualLeave.arrMonth.length !== 0) {
            let ratioX = ['x', ...annualLeave.arrMonth];
            let listAnnualLeaveOfNumberMonth = annualLeave.listAnnualLeaveOfNumberMonth;
            let data1 = ['data1'];
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
            })
            this.renderChart({ nameData1, ratioX, data1, lineChart });
        }
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">{`${nameChart} trong ${numberMonthShow} tháng gần nhất`}</h3>
                    </div>
                    <div className="box-body">
                        <div className="qlcv" style={{ marginBottom: 15 }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    <SelectMulti id="multiSelectUnits"
                                        items={department.list.map((p, i) => { return { value: p._id, text: p.name } })}
                                        options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                        onChange={this.handleSelectOrganizationalUnit}
                                    >
                                    </SelectMulti>
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">Số tháng</label>
                                    <SelectBox
                                        id={`numberMonth-barChart`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={numberMonth}
                                        items={[{ value: 6, text: '6 tháng' }, { value: 12, text: '12 tháng' }]}
                                        onChange={this.handleNumberMonthChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: %</b></p>
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
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager, annualLeave, department } = state;
    return { employeesManager, annualLeave, department };
}

const actionCreators = {
    getAnnualLeave: AnnualLeaveActions.searchAnnualLeaves,
};

const barChart = connect(mapState, actionCreators)(withTranslate(AnnualLeaveTrendsChart));
export { barChart as AnnualLeaveTrendsChart };
