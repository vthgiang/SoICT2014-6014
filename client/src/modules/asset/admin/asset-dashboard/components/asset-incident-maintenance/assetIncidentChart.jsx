import React, { Component } from 'react';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker } from '../../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class AssetIncidentChart extends Component {
    constructor(props) {
        super(props);

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;

        if (day.length < 2)
            day = '0' + day;

        this.INFO_SEARCH = {
            incidentDateAfter: year + '-' + (month - 3),
            incidentDateBefore: [year, month].join('-'),
        }

        this.state = {
            incidentDateAfter: this.INFO_SEARCH.incidentDateAfter,
            incidentDateBefore: this.INFO_SEARCH.incidentDateBefore,
            defaultStartMonth: '0' + (month - 3) + '-' + year,
            defaultEndMonth: [month, year].join('-'),
            year: false,
        }
    }

    setDataColumnChartForMonth = () => {
        const { listAssets, translate } = this.props;
        let { incidentDateAfter, incidentDateBefore } = this.state;

        let startDate = new Date(incidentDateAfter);
        let endDate = new Date(incidentDateBefore);
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], countAsset = [], category = [], arr = [];
        let m = incidentDateAfter.slice(5, 7);
        let y = incidentDateAfter.slice(0, 4);

        for (let i = 0; i <= period; i++) {
            if (m > 12) {
                m = 1;
                y++;
            }
            if (m < 10) {
                m = '0' + m;
            }
            category.push([m, y].join('-'));
            listMonth.push([y, m].join(','));
            m++;
        }

        if (listAssets) {
            for (let i = 0; i < listMonth.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonth[i]).getTime();
                let maxDate = new Date(listMonth[i + 1]).getTime();

                for (let j in listAssets) {
                    let incidentLogs = listAssets[j].incidentLogs;

                    if (incidentLogs.length) {
                        for (let k in incidentLogs) {
                            let incidentDate = new Date(incidentLogs[k].dateOfIncident).getTime();
                            if (incidentDate < maxDate && incidentDate >= minDate) {
                                cnt++;
                            }
                        }
                    }
                }
                countAsset.push(cnt);
            }
        }
        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }
        category.pop();
        countAsset.unshift(translate('asset.dashboard.time'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            yValues: arr
        };

        // if (getincidentData && listAssets) {
        //     getincidentData(dataColumnChart);
        // }

        return dataColumnChart;
    }

    setDataColumnChartForYear = () => {
        const { listAssets, translate } = this.props;
        let { incidentDateAfter, incidentDateBefore } = this.state;

        let startDate = incidentDateAfter.slice(0, 4);
        let endDate = incidentDateBefore.slice(0, 4);
        let period = endDate - startDate + 1;
        let countAsset = [], category = [], arr = [];

        for (let i = 0; i < period; i++) {
            category.push(parseInt(startDate) + i);
        }
        if (listAssets) {
            for (let i = 0; i < category.length; i++) {
                let cnt = 0;
                for (let j in listAssets) {
                    let incidentLogs = listAssets[j].incidentLogs;
                    if (incidentLogs.length) {
                        for (let k in incidentLogs) {
                            let incidentDate = new Date(incidentLogs[k].dateOfIncident).getFullYear();

                            if (incidentDate == category[i]) {
                                cnt++;
                            }
                        }
                    }
                }
                countAsset.push(cnt);
            }
        }

        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }
        countAsset.unshift(translate('asset.dashboard.time'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            yValues: arr
        };

        // if (getincidentData && listAssets) {
        //     getincidentData(dataColumnChart);
        // }
        return dataColumnChart;
    }

    columnChart = () => {
        let { translate } = this.props;
        let { year } = this.state;
        let dataColumnChart = year ? this.setDataColumnChartForYear() : this.setDataColumnChartForMonth();
        console.log('data', dataColumnChart);
        let chart = c3.generate({
            bindto: this.refs.assetIncidentChart,
            data: {
                columns: [
                    dataColumnChart.count,
                ],
                type: 'bar',
            },
            axis: {
                x: {
                    type: 'category',
                    categories: dataColumnChart.category
                },
                y: {
                    tick: {
                        values: dataColumnChart.yValues
                    },
                    label: {
                        text: translate('asset.dashboard.time'),
                        position: 'outer-top'
                    }
                },

            },
            padding: {
                top: 20,
                bottom: 20
            },
            legend: {
                show: false
            }
        })
    }

    handleChangeDateAfter = async (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month;
        month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateBefore = month;
    }

    handleSearchData = async () => {
        let incidentDateAfter = new Date(this.INFO_SEARCH.incidentDateAfter);
        let incidentDateBefore = new Date(this.INFO_SEARCH.incidentDateBefore);

        if (incidentDateAfter.getTime() > incidentDateBefore.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    incidentDateAfter: this.INFO_SEARCH.incidentDateAfter,
                    incidentDateBefore: this.INFO_SEARCH.incidentDateBefore,
                }
            })
        }
    }

    handleChangeViewChart = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                year: value
            }
        })
    }

    render() {
        const { translate } = this.props;
        let { defaultStartMonth, defaultEndMonth, year } = this.state;
        this.columnChart();

        return (
            <React.Fragment>
                <section className="form-inline" style={{ textAlign: "right" }}>
                    {/* Chọn ngày bắt đầu và kết thúc để tìm kiếm */}
                    <div className="form-group">
                        <label>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="incident_after"
                            dateFormat="month-year"
                            value={defaultStartMonth}
                            onChange={this.handleChangeDateAfter}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="incident_before"
                            dateFormat="month-year"
                            value={defaultEndMonth}
                            onChange={this.handleChangeDateBefore}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                    </div>
                </section>
                <div>
                    {/* Chọn hiển thị theo tháng/ năm*/}
                    <br />
                    <div className="box-tools" style={{ textAlign: "right", marginRight: "60px" }}>
                        <div className="btn-group">
                            <button type="button" className={`btn btn-xs ${year ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>{translate('general.month')}</button>
                            <button type="button" className={`btn btn-xs ${year ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>{translate('general.year')}</button>
                        </div>
                    </div>
                    <div ref="assetIncidentChart"></div>
                </div>

            </React.Fragment>
        )
    }
}

export default withTranslate(AssetIncidentChart);