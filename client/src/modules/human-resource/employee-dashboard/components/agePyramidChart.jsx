import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeManagerActions } from '../../profile/employee-management/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class AgePyramidChart extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {
        this.props.getAllEmployee({ status: 'active' });
    }

    // Function tính tuổi nhân viện theo năm sinh nhập vào
    getYear = (date) => {
        let dateNow = new Date(Date.now()), birthDate = new Date(date);
        let age = dateNow.getFullYear() - birthDate.getFullYear();
        return age;
    }


    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart() {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    findMaxOfArray = (data) => {
        let max = data[1];
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i] > max) {
                max = data[i];
            }
        }
        return max;
    }
    renderChart = (data) => {
        let maxData1 = this.findMaxOfArray(data.data1), maxData2 = this.findMaxOfArray(data.data2);
        let qty_max = maxData1 >= maxData2 ? maxData1 : maxData2;

        let chart = c3.generate({
            bindto: this.refs.chart,
            data: {
                columns: [],
                hide: true,
                type: 'bar',
                groups: [[data.nameData1, data.nameData2]]
            },
            padding: {
                top: 10,
            },
            bar: {
                width: { ratio: 0.9 },
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ageRanges,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false,
                        format: function (d) { return (parseInt(d) === d) ? Math.abs(d) : null; }
                    },
                    max: qty_max, min: -qty_max
                }
            },
            grid: {
                y: { lines: [{ value: 0 }], }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        var format = function (d) { return (parseInt(d) === d) ? Math.abs(d) : null; }
                        return format(value) + ' nhân viên';
                    }
                }
            }
        });

        var addColumn = (data, delay) => {
            var dataTmp = [data[0], 0];
            setTimeout(function () {
                chart.load({
                    columns: [dataTmp]
                });
            }, 200);
            data.forEach(function (value, index) {
                setTimeout(function () {
                    dataTmp[index] = value;
                    chart.load({
                        columns: [dataTmp],
                    });
                }, (200 + (delay / 12 * index)));
            });
        }
        addColumn(data.data1, 2200);
        addColumn(data.data2, 2200);
    }
    render() {
        const { listAllEmployees } = this.props.employeesManager;
        let maleEmployees = listAllEmployees.filter(x => x.gender === 'male');
        let femaleEmployees = listAllEmployees.filter(x => x.gender === 'female');

        // Start Định dạng dữ liệu cho biểu đồ tháp tuổi
        let age = 69, i = 0, data1AgePyramid = [], data2AgePyramid = [];
        while (age > 18) {
            let maleData = [], femaleData = [];
            if (age === 19) {
                femaleData = femaleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 2);
                maleData = maleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 2);
            } else {
                femaleData = femaleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 5);
                maleData = maleEmployees.filter(x => this.getYear(x.birthdate) <= age && this.getYear(x.birthdate) > age - 5);
            }
            data1AgePyramid[i] = 0 - femaleData.length;
            data2AgePyramid[i] = maleData.length;
            age = age - 5;
            i++;
        }
        data1AgePyramid.unshift('Nữ');
        data2AgePyramid.unshift('Nam');
        // End Định dạng dữ liệu cho biểu đồ tháp tuổi

        let data = {
            nameData1: 'Nữ',
            nameData2: 'Nam',
            ageRanges: ['65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '18-19'],
            data1: data1AgePyramid,
            data2: data2AgePyramid,
        }
        this.renderChart(data);
        return (
            <React.Fragment>
                <div ref="chart"></div>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">Tháp tuổi cán bộ công nhân viên trong công ty</h3>
                    </div>
                    <div className="box-body dashboard_box_body">
                        <div className="form-inline">
                            <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-md-sm-1 col-xs-1'>
                                <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/female_icon.png" />
                                <div className='number_box'>{femaleEmployees.length}</div>
                            </div>
                            <div className='row form-group col-lg-10 col-md-10 col-md-sm-10 col-xs-10' style={{ padding: 0 }}>
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>Độ tuổi</b></p>
                                <p className="pull-right" style={{ marginBottom: 0 }}><b>ĐV tính: Người</b></p>
                                <div ref="chart"></div>
                            </div>
                            <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-md-sm-1 col-xs-1'>
                                <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/male_icon.png" />
                                <div className='number_box'>{maleEmployees.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const agePyramidChart = connect(mapState, actionCreators)(withTranslate(AgePyramidChart));
export { agePyramidChart as AgePyramidChart };
