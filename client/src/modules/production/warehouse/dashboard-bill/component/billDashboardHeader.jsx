import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../../common-components';
import { BillActions } from '../../bill-management/redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
class BillDashboardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
        }
    }

    componentDidMount() {
        this.props.getNumberBills();
        this.props.getAllStocks({ managementLocation: this.state.currentRole });
    }

    handleStockChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
            }
        })
    }

    handleChangeDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                createdAt: value
            }
        });
    }

    handleSubmitSearch = () => {
        let data = {
            stock: this.state.stock,
            createdAt: this.state.createdAt
        }
        this.props.getNumberBills(data);
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

    // Function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = async (value) => {
        if (value.length === 0) {
            value = null
        };
        await this.setState({
            organizationalUnits: value
        })
    };

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }
    render() {
        const { translate, bills, stocks } = this.props;
        const { numberBills } = bills;
        const { listStocks } = stocks;
        const { createdAt } = this.state;

        return (
            <React.Fragment>
                <div className="form-inline">
                <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock-dashboard-bill`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.handleStockChange}
                            />
                        </div>
                    <div className="form-group">
                            <label className="form-control-static">Trong tháng</label>
                            <DatePicker
                                id="purchase-month-bill-dashboard"
                                dateFormat="month-year"
                                value={createdAt}
                                onChange={this.handleChangeDate}
                            />
                        </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSubmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-database"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số lượng phiếu</span>
                                <span className="info-box-number">
                                    { numberBills !== null ? numberBills.totalBills : 0 }
                                </span>
                                <a href={`/bill-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-cart-plus"></i></span>
                            <div className="info-box-content" title="Số khen thưởng tháng/số khen thưởng năm" >
                                <span className="info-box-text">Số phiếu xuất</span>
                                <span className="info-box-number">{ numberBills !== null ? numberBills.totalGoodIssues : 0 }/{ numberBills !== null ? numberBills.totalBills : 0 }</span>
                                <a href={`/bill-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa  fa-cart-arrow-down"></i></span>
                            <div className="info-box-content" title="Số kỷ luật tháng/số kỷ luật năm">
                                <span className="info-box-text">Số phiếu nhập</span>
                                <span className="info-box-number">{ numberBills !== null ? numberBills.totalGoodReceipts : 0 }/{ numberBills !== null ? numberBills.totalBills : 0 }</span>
                                <a href={`/bill-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa  fa-bicycle"></i></span>
                            <div className="info-box-content" title="Số nghỉ phép tháng/số nghỉ phép năm">
                                <span className="info-box-text">Số phiếu trả hàng</span>
                                <span className="info-box-number">{ numberBills !== null ? numberBills.totalGoodReturns : 0 }/{ numberBills !== null ? numberBills.totalBills : 0 }</span>
                                <a href={`/bill-management`} target="_blank" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getNumberBills: BillActions.getNumberBills,
    getAllStocks: StockActions.getAllStocks,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillDashboardHeader));