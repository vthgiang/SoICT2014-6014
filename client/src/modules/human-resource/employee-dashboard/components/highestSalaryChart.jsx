import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker } from '../../../../common-components';

import { SalaryActions } from '../../salary/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';

class HighestSalaryChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameData: 'Lương thưởng',
            ratioX: ["Nguyễn Văn An", "Vũ Thị Cúc", "Nguyễn Văn Danh", "Nguyễn Văn Bình", "Trần Văn Sơn", "Trần Văn Anh", 'Nguyễn Thị Anh', 'Trần Thị Vui', 'Vũ Thị Hằng'],
            data1: ['data1', 100000, 80000, 60000, 51000, 50000, 45000, 40000, 35000, 34000],
        }
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    removePreviousChart() {
        const chart = this.refs.rotateBarChart;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /** Render chart */
    renderChart = (data) => {
        data.data1.shift();
        let fakeData1 = data.data1.map((x, index) => {
            if (index % 2 === 0) {
                return x * 2
            } else return x / 2
        });

        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.rotateChart,
            data: {
                columns: [],
                hide: true,
                type: 'bar',
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
                columns: [[data.nameData, ...fakeData1]],
            });
        }, 100);

        setTimeout(function () {
            chart.load({
                columns: [[data.nameData, ...data.data1]],
            });
        }, 300);
    };

    /**
     * Function lưu giá trị tháng vào state khi thay đổi
     * @param {*} value : Tháng tìm kiếm
     */
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        };
        this.setState({
            ...this.state,
            month: value
        });
    }

    /** Bắt sự kiện tìm kiếm */
    handleSunmitSearch = () => {
        const { month } = this.state;
        this.props.handleMonthChange(this.formatDate(month, true));
        this.props.searchSalary({ callApiDashboard: true, month: month });
    }

    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} result 
     */
    convertData = (result) => {
        if (result.length !== 0) {
            if (result.length > 1) {
                for (let i = 0; i < result.length - 1; i++) {
                    for (let j = i + 1; j < result.length; j++) {
                        if (result[i].total < result[j].total) {
                            let value = result[i];
                            result[i] = result[j];
                            result[j] = value;
                        }
                    }
                };
                let data = [];
                result.forEach((x, index) => {
                    if (index < 20) {
                        data = [...data, x]
                    }
                });
                let ratioX = data.map(x => x.employee ? x.employee.fullName : 'Deleted')
                let data1 = data.map(x => result[0].unit === 'VND' ? result[0].total / 1000 : result[0].total);
                return {
                    nameData: 'Lương thưởng',
                    ratioX: ratioX,
                    data1: ['data1', ...data1],
                }
            }
            return {
                nameData: 'Lương thưởng',
                ratioX: [result[0].employee ? result[0].employee.fullName : 'Deleted'],
                data1: ['data1', result[0].unit === 'VND' ? result[0].total / 1000 : result[0].total],
            }
        };
        return {
            nameData: 'Lương thưởng',
            ratioX: [],
            data1: ['data1'],
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.month !== this.state.month) {
            return false;
        };
        return true;
    }

    render() {
        const { translate, salary } = this.props;

        const { monthShow } = this.props;

        let data = salary.listAllSalary;
        if (data.length !== 0) {
            data = data.map(x => {
                let total = parseInt(x.mainSalary);
                if (x.bonus.length !== 0) {
                    for (let count in x.bonus) {
                        total = total + parseInt(x.bonus[count].number)
                    }
                };
                return { ...x, total: total }
            })
        };

        let result = [];
        data.forEach(x => {
            let check;
            result.forEach(y => {
                if (y._id === x._id) {
                    y.total = y.total + x.total;
                    check = y;
                }
            })
            if (check) {
                result = [...result, check];
            } else {
                result = [...result, x]
            }
        })

        console.log(result);
        this.renderChart(this.convertData(result));

        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <h3 className="box-title">Top 20 nhân sự nhận lương thưởng cao nhất {monthShow}</h3>
                    </div>
                    <div className="box-body">
                        <div className="qlcv" style={{ marginBottom: 15 }} >
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label className="form-control-static"  >{translate('human_resource.month')}</label>
                                    <DatePicker
                                        id="month-highest-salary"
                                        deleteValue={false}
                                        dateFormat="month-year"
                                        value={this.formatDate(Date.now(), true)}
                                        onChange={this.handleMonthChange}
                                    />
                                </div>
                                <div className="form-group" >
                                    <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} > {translate('general.search')} </button>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }} > < b > ĐV tính: {data[0] && data[0].unit === 'VND' ? '1000VND' : "USD"}</b></p >
                            <div ref="rotateChart"></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { salary } = state;
    return { salary };
};

const actionCreators = {
    searchSalary: SalaryActions.searchSalary,
};

const highestSalaryChart = connect(mapState, actionCreators)(withTranslate(HighestSalaryChart));
export { highestSalaryChart as HighestSalaryChart };
