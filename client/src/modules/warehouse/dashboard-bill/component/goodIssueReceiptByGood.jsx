
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../common-components';

class GoodIssueReceiptByGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        this.barAndChart();
    }

    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            barChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    barAndChart = () => {
        let { translate } = this.props;
        const { barChart } = this.state;
        let chart = c3.generate({
            bindto: this.refs.goodIssueReceipt,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Máy tính', 'Bàn học', 'Điện thoại', 'Chuột', 'Cặp sách', 'Bình nước', 'Sách vở', 'Bút'],
                    ['Xuất kho', 100, 200, 140, 200, 600, 228, 600, 200, 130],
                    ['Nhập kho', 300, 150, 140, 200, 500, 228, 290, 200, 130],
                ],
                type: barChart ? 'bar' : 'line',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                }
            }
        });
    }

    render() {
        const { translate } = this.props;
        const { barChart } = this.state;
        this.barAndChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng xuất, nhập theo từng mặt hàng
                        </h3>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                                    <DatePicker
                                        id="purchase-month"
                                        dateFormat="month-year"
                                        value=""
                                        onChange={this.handlePurchaseMonthChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                                    <DatePicker
                                        id="purchase-month"
                                        dateFormat="month-year"
                                        value=""
                                        onChange={this.handlePurchaseMonthChange}
                                    />
                                </div>
                            </div>
                            {/* <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn ${barChart === true ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(true)}>Bar chart</button>
                                    <button type="button" className={`btn ${barChart === false ? 'btn-danger' : null}`} onClick={() => this.handleChangeViewChart(false)}>Line chart</button>
                                </div>
                            </div> */}
                        
                        <div ref="goodIssueReceipt"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(GoodIssueReceiptByGood);