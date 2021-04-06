/* Biểu đồ thể hiện lương thưởng các đơn vị trong công ty */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';

class SalaryOfOrganizationalUnitsChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: true
        }
    }

    /**
     * Bắt sự kiện thay đổi đơn vị biểu đồ
     * @param {*} value : đơn vị biểu đồ (true or false)
     */
    handleChangeUnitChart = (value) => {
        this.setState({
            ...this.state,
            unit: value
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.salary.listSalaryByMonth !== prevState.listSalaryByMonth) {
            return {
                listSalaryByMonth: nextProps.salary.listSalaryByMonth
            };
        }
        return null;
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.salary.listSalaryByMonth !== this.state.listSalaryByMonth || nextState.unit !== this.unit) {
            return true
        };
        return false;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.salaryChart;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /** Render chart */
    renderChart = (data) => {
        data.data1.shift();
        let setHeightChart = (data.ratioX.length * 40) < 320 ? 320 : (data.ratioX.length * 40);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.salaryChart,
            data: {
                columns: [],
                hide: true,
                type: 'bar',
            },
            padding: {
                bottom: 20,
            },
            size: {
                height: setHeightChart
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ratioX,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            }
        });

        setTimeout(function () {
            chart.load({
                columns: [[data.nameData, ...data.data1]],
            });
        }, 100);
    };

    render() {
        const { translate, salary, department } = this.props;

        const { monthShow } = this.props;
        const { unit } = this.state;

        let organizationalUnitsName = department.list.map(x => { return { _id: x._id, name: x.name, salary: 0 } });
        let data = salary.listSalaryByMonth;
        if (data.length !== 0) {
            data = data.map(x => {
                let total = parseInt(x.mainSalary);
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number)
                    }
                };
                return { ...x, total: unit ? total / 1000000000 : total / 1000000 }
            })
        };

        organizationalUnitsName = organizationalUnitsName.map(x => {
            data.forEach(y => {
                if (x._id === y.organizationalUnit) {
                    x.salary = x.salary + y.total
                }
            })
            return x;
        })

        let ratioX = organizationalUnitsName.map(x => x.name);
        let data1 = organizationalUnitsName.map(x => x.salary);
        let dataChart = {
            nameData: 'Thu nhập',
            ratioX: ratioX,
            data1: ['data1', ...data1],
        }


        this.renderChart(dataChart);

        return (
            <React.Fragment>
                <div className="box box-solid" style={{ paddingBottom: 20 }}>
                    <div className="box-header with-border">
                        <div className="box-title">
                            {`Biểu đồ thu nhập `}
                            {
                                organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                    <>
                                        <span>{` ${translate('task.task_dashboard.of_unit')}`}</span>
                                        <span>{` ${organizationalUnitsName?.[0]?.name}`}</span>
                                    </>
                                    :
                                    <span onClick={() => showListInSwal(organizationalUnitsName.map(item => item?.name), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                        <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                        <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                        <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                    </span>
                            }
                            {` tháng ${monthShow}`}
                        </div>
                    </div>
                    <div className="box-body">
                        <div className="box-tools pull-right" >

                            <div className="btn-group pull-right">
                                <button type="button" className={`btn btn-xs ${unit ? "active" : "btn-danger"}`} onClick={() => this.handleChangeUnitChart(false)}>Triệu</button>
                                <button type="button" className={`btn btn-xs ${unit ? 'btn-danger' : "active"}`} onClick={() => this.handleChangeUnitChart(true)}>Tỷ</button>
                            </div>
                            <p className="pull-right" style={{ marginBottom: 0, marginRight: 10 }} > < b > ĐV tính</b></p >
                        </div>
                        <div ref="salaryChart"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const salaryOfOrganizationalUnits = connect(mapState, null)(withTranslate(SalaryOfOrganizationalUnitsChart));
export { salaryOfOrganizationalUnits as SalaryOfOrganizationalUnitsChart };
