
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../common-components';

class CustomerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieChart: true
        }
    }

    componentDidMount() {
        this.pieChart();
    }

    pieChart = () => {
        let chart = c3.generate({
            bindto: this.refs.customerDashboard,

            data: {
                columns: [
                    ['Công ty TNHH ABC', 30],
                    ['Công ty B', 50],
                    ['Công ty C', 90],
                    ['Công ty D', 20],
                    ['Công ty E', 60],
                    ['Công ty F', 30],
                ],
                type: 'pie',
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    render() {
        const { translate } = this.props;
        this.pieChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Xem số lượng phiếu xuất cho từng khách hàng
                        </h3>
                        <div className="form-inline">
                            <div className="form-group">
                                    <label className="form-control-static">Từ</label>
                                    <DatePicker
                                        id="purchase-month"
                                        dateFormat="month-year"
                                        value=""
                                        onChange={this.handlePurchaseMonthChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">Đến</label>
                                    <DatePicker
                                        id="purchase-month"
                                        dateFormat="month-year"
                                        value=""
                                        onChange={this.handlePurchaseMonthChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                                </div>
                            </div>
                        <div ref="customerDashboard"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(CustomerDashboard);