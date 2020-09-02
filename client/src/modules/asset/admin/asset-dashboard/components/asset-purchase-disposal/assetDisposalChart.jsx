import React, { Component } from 'react';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker } from '../../../../../../common-components';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

class DisposalColumnChart extends Component {
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
            disposalDateAfter: year + '-' + (month - 3),
            disposalDateBefore: [year, month].join('-'),
        }

        this.state = {
            disposalDateAfter: this.INFO_SEARCH.disposalDateAfter,
            disposalDateBefore: this.INFO_SEARCH.disposalDateBefore,
            defaultStartMonth: '0' + (month - 3) + '-' + year,
            defaultEndMonth: [month, year].join('-'),
        }
    }

    setDataColumnChart = () => {
        const { listAssets, translate } = this.props;
        let { disposalDateAfter, disposalDateBefore } = this.state;

        let startDate = new Date(disposalDateAfter);
        let endDate = new Date(disposalDateBefore);
        let period = Math.round((endDate - startDate) / 2592000000) + 1;
        let listMonth = [], value = [], countAsset = [], category = [], arr = [];
        let m = disposalDateAfter.slice(5, 7);
        let y = disposalDateAfter.slice(0, 4);

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
                    if (listAssets[j].status === "Thanh lý") {
                        let disposalDate = new Date(listAssets[j].disposalDate).getTime();
                        if (disposalDate < maxDate && disposalDate >= minDate) {
                            cnt++;
                            val += listAssets[j].disposalCost / 1000000;
                        }
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

        return dataColumnChart;
    }

    columnChart = () => {
        let { translate } = this.props;
        let dataColumnChart = this.setDataColumnChart();

        if (translate('asset.dashboard.amount') === "Số lượng") {
            let chart = c3.generate({
                bindto: this.refs.DisposalColumnChart,

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
                // tooltip: {
                //     format: {
                //         title: function (d) { return d; },
                //         value: function (value) {
                //             return value;
                //         }
                //     }
                // },

                legend: {
                    show: true
                }
            })
        } else {
            let chart = c3.generate({
                bindto: this.refs.DisposalColumnChart,

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
                    top: 20,
                    bottom: 20
                },
                // tooltip: {
                //     format: {
                //         title: function (d) { return d; },
                //         value: function (value) {
                //             return value;
                //         }
                //     }
                // },

                legend: {
                    show: true
                }
            });
        }
    }

    handleChangeDateAfter = async (value) => {
        let month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.disposalDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month;
        month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.disposalDateBefore = month;
    }

    handleSearchData = async () => {
        let disposalDateAfter = new Date(this.INFO_SEARCH.disposalDateAfter);
        let disposalDateBefore = new Date(this.INFO_SEARCH.disposalDateBefore);

        if (disposalDateAfter.getTime() > disposalDateBefore.getTime()) {
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
                    disposalDateAfter: this.INFO_SEARCH.disposalDateAfter,
                    disposalDateBefore: this.INFO_SEARCH.disposalDateBefore,
                }
            })
        }
    }

    render() {
        const { translate } = this.props;
        let { defaultStartMonth, defaultEndMonth } = this.state;
        this.columnChart();

        return (
            <React.Fragment>
                <section className="form-inline" style={{ textAlign: "right" }}>
                    <div className="form-group">
                        <label>{translate('task.task_management.from')}</label>
                        <DatePicker
                            id="disposal_after"
                            dateFormat="month-year"
                            value={defaultStartMonth}
                            onChange={this.handleChangeDateAfter}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('task.task_management.to')}</label>
                        <DatePicker
                            id="disposal_before"
                            dateFormat="month-year"
                            value={defaultEndMonth}
                            onChange={this.handleChangeDateBefore}
                            disabled={false}
                        />
                    </div>
                    <button className="btn btn-success" onClick={this.handleSearchData}>{translate('task.task_management.search')}</button>
                </section>
                <section ref="DisposalColumnChart"></section>
            </React.Fragment>
        )
    }
}

export default withTranslate(DisposalColumnChart);