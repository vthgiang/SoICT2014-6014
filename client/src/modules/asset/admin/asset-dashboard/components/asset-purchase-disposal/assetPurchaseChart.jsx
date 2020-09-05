import React, { Component } from 'react';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker } from '../../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class PurchaseColumnChart extends Component {
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
            purchaseDateAfter: year + '-' + (month - 3),
            purchaseDateBefore: [year, month].join('-'),
        }

        this.state = {
            purchaseDateAfter: this.INFO_SEARCH.purchaseDateAfter,
            purchaseDateBefore: this.INFO_SEARCH.purchaseDateBefore,
            defaultStartMonth: '0' + (month - 3) + '-' + year,
            defaultEndMonth: [month, year].join('-'),
            year: false,
        }
    }

    setDataColumnChartForMonth = () => {
        const { listAssets, translate, getPurchaseData } = this.props;
        let { purchaseDateAfter, purchaseDateBefore } = this.state;

        let startDate = new Date(purchaseDateAfter);
        let endDate = new Date(purchaseDateBefore);
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], value = [], countAsset = [], category = [], arr = [];
        let m = purchaseDateAfter.slice(5, 7);
        let y = purchaseDateAfter.slice(0, 4);

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
                    let purchaseDate = new Date(listAssets[j].purchaseDate).getTime();
                    if (purchaseDate < maxDate && purchaseDate >= minDate) {
                        cnt++;
                        val += listAssets[j].cost / 1000000;
                    }
                }
                countAsset.push(cnt);
                value.push(val);
            }
        }
        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }

        category.pop();
        category.unshift('x');
        countAsset.unshift(translate('asset.dashboard.amount'));
        value.unshift(translate('asset.dashboard.value'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            value: value,
            yValues: arr
        };

        if (getPurchaseData && listAssets) {
            getPurchaseData(dataColumnChart);
        }

        return dataColumnChart;
    }

    setDataColumnChartForYear = () => {
        const { listAssets, translate, getPurchaseData } = this.props;
        let { purchaseDateAfter, purchaseDateBefore } = this.state;

        let startDate = purchaseDateAfter.slice(0, 4);
        let endDate = purchaseDateBefore.slice(0, 4);
        let period = endDate - startDate + 1;
        let value = [], countAsset = [], category = [], arr = [];

        for (let i = 0; i < period; i++) {
            category.push(parseInt(startDate) + i);
        }
        if (listAssets) {
            for (let i = 0; i < category.length; i++) {
                let cnt = 0, val = 0;
                for (let j in listAssets) {
                    let purchaseDate = new Date(listAssets[j].purchaseDate).getFullYear();

                    if (purchaseDate == category[i]) {
                        cnt++;
                        val += listAssets[j].cost / 1000000;
                    }
                }
                countAsset.push(cnt);
                value.push(val);
            }
        }
        let maxCnt = Math.max.apply(Math, countAsset);

        for (let i = 0; i <= maxCnt; i++) {
            arr.push(i)
        }

        category.unshift('x');
        countAsset.unshift(translate('asset.dashboard.amount'));
        value.unshift(translate('asset.dashboard.value'));

        let dataColumnChart = {
            category: category,
            count: countAsset,
            value: value,
            yValues: arr
        };

        if (getPurchaseData && listAssets) {
            getPurchaseData(dataColumnChart);
        }
        return dataColumnChart;
    }

    columnChart = () => {
        let { translate } = this.props;
        let { year } = this.state;
        let dataColumnChart = year ? this.setDataColumnChartForYear() : this.setDataColumnChartForMonth();

        if (translate('asset.dashboard.amount') === 'Số lượng') {
            let chart = c3.generate({
                bindto: this.refs.PurchaseColumnChart,

                data: {
                    x: 'x',
                    columns: [
                        dataColumnChart.category,
                        dataColumnChart.count,
                        dataColumnChart.value
                    ],
                    type: 'bar',
                    axes: {
                        'Giá trị': 'y2',
                        'Số lượng': 'y'
                    }
                },
                axis: {
                    x: {
                        type: 'category'
                    },
                    y: {
                        tick: {
                            values: dataColumnChart.yValues
                        },
                        label: {
                            text: translate('asset.dashboard.amount'),
                            position: 'outer-top'
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: translate('asset.dashboard.sum_value'),
                            position: 'outer-top'
                        }
                    }

                },
                padding: {
                    top: 20,
                    bottom: 20
                },
                legend: {
                    show: true
                }
            })
        } else {
            let chart = c3.generate({
                bindto: this.refs.PurchaseColumnChart,

                data: {
                    x: 'x',
                    columns: [
                        dataColumnChart.category,
                        dataColumnChart.count,
                        dataColumnChart.value
                    ],
                    type: 'bar',
                    axes: {
                        'Value': 'y2',
                        'Amount': 'y'
                    }
                },
                axis: {
                    x: {
                        type: 'category'
                    },
                    y: {
                        tick: {
                            values: dataColumnChart.yValues
                        },
                        label: {
                            text: translate('asset.dashboard.amount'),
                            position: 'outer-top'
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: translate('asset.dashboard.sum_value'),
                            position: 'outer-top'
                        }
                    }

                },
                padding: {
                    bottom: 20
                },
                legend: {
                    show: true
                }
            })
        }
    }

    handleChangeDateAfter = async (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.purchaseDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month;
        month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.purchaseDateBefore = month;
    }

    handleSearchData = async () => {
        let purchaseDateAfter = new Date(this.INFO_SEARCH.purchaseDateAfter);
        let purchaseDateBefore = new Date(this.INFO_SEARCH.purchaseDateBefore);

        if (purchaseDateAfter.getTime() > purchaseDateBefore.getTime()) {
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
                    purchaseDateAfter: this.INFO_SEARCH.purchaseDateAfter,
                    purchaseDateBefore: this.INFO_SEARCH.purchaseDateBefore,
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
                    <div className="form-group">
                        <label>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="purchase_after"
                            dateFormat="month-year"
                            value={defaultStartMonth}
                            onChange={this.handleChangeDateAfter}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="purchase_before"
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
                    <br />
                    <div className="box-tools" style={{ textAlign: "right", marginRight: "60px" }}>
                        <div className="btn-group">
                            <button type="button" className={`btn btn-xs ${year ? "active" : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>{translate('general.month')}</button>
                            <button type="button" className={`btn btn-xs ${year ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>{translate('general.year')}</button>
                        </div>
                    </div>
                    <div ref="PurchaseColumnChart"></div>
                </div>

            </React.Fragment>
        )
    }
}

export default withTranslate(PurchaseColumnChart);