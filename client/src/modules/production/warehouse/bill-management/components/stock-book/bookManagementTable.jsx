import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import BookDetailForm from './bookDetailForm';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar } from '../../../../../../common-components';

import { BillActions } from '../../redux/actions';
import { StockActions } from '../../../stock-management/redux/actions';
import { UserActions } from '../../../../../super-admin/user/redux/actions';

class BookManagementTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1,
            group: '',
        }
    }

    componentDidMount() {
        const { limit, page } = this.state;
        this.props.getBillsByType();
        this.props.getBillsByType({ page, limit });
        this.props.getAllStocks();
        this.props.getUser();
    }

    handleShowDetailInfo = async (id) => {
        await this.props.getDetailBill(id);
        window.$('#modal-detail-book').modal('show');
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                day = '' + d.getDate(),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getBillsByType(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
        };
        this.props.getBillsByType(data);
    }

    handleStockChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                stock: value
            }
        })
    }

    handleCreatorChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                creator: value
            }
        })
    }

    handleCodeChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                code: value
            }
        })
    }

    handleTypeChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                type: value
            }
        })
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        })
    }

    handleSubmitSearch = () => {
        let data = {
            page: this.state.page,
            limit: this.state.limit,
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            partner: this.state.partner,
            creator: this.state.creator
        }
        this.props.getBillsByType(data);
    }

    handleChangeStartDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                startDate: value
            }
        });
    }

    handleChangeEndDate = (value) => {
        if (value === '') {
            value = null;
        }

        this.setState(state => {
            return {
                ...state,
                endDate: value
            }
        });
    }

    render() {

        const { translate, bills, stocks, user} = this.props;
        const { listPaginate, totalPages, page } = bills;
        const { listStocks } = stocks;
        const { startDate, endDate } = this.state;

        return (
                    <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.creator')}</label>
                            <SelectMulti
                                id={`select-multi-creator`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={user.list.map(x => { return { value: x.id, text: x.name } })}
                                onChange={this.handleCreatorChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                            <SelectMulti
                                id={`select-multi-type`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manage_warehouse.bill_management.billType.1')},
                                    { value: '2', text: translate('manage_warehouse.bill_management.billType.2')},
                                    { value: '3', text: translate('manage_warehouse.bill_management.billType.3')},
                                    { value: '4', text: translate('manage_warehouse.bill_management.billType.4')},
                                    { value: '5', text: translate('manage_warehouse.bill_management.billType.5')},
                                    { value: '6', text: translate('manage_warehouse.bill_management.billType.6')},
                                    { value: '7', text: translate('manage_warehouse.bill_management.billType.7')},
                                ]}
                                onChange={this.handleTypeChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                            <DatePicker
                                id="book-stock-start-date"
                                dateFormat="month-year"
                                value={startDate}
                                onChange={this.handleChangeStartDate}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                            <DatePicker
                                id="book-stock-end-date"
                                dateFormat="month-year"
                                value={endDate}
                                onChange={this.handleChangeEndDate}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.partner')}</label>
                            <SelectMulti
                                id={`select-multi-partner`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn đối tác", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: "Công ty TNHH ABC"},
                                    { value: '2', text: "Xưởng máy A"},
                                    { value: '3', text: "Công ty B"},
                                ]}
                                onChange={this.handleCategoryChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.status')}</label>
                            <SelectMulti
                                id={`select-multi-status-book`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: '1', text: translate('manage_warehouse.bill_management.1.status')},
                                    { value: '2', text: translate('manage_warehouse.bill_management.2.status')},
                                    { value: '3', text: translate('manage_warehouse.bill_management.3.status')},
                                    { value: '4', text: translate('manage_warehouse.bill_management.4.status')},
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <BookDetailForm />

                        <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th>{translate('manage_warehouse.bill_management.code')}</th>
                                    <th>{translate('manage_warehouse.bill_management.type')}</th>
                                    <th>{translate('manage_warehouse.bill_management.status')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.creator')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.date')}</th>
                                    <th>{translate('manage_warehouse.bill_management.stock')}</th>
                                    <th>{translate('manage_warehouse.bill_management.partner')}</th>
                                    <th>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table`}
                                            columnArr={[
                                                translate('manage_warehouse.bill_management.index'),
                                                translate('manage_warehouse.bill_management.code'),
                                                translate('manage_warehouse.bill_management.type'),
                                                translate('manage_warehouse.bill_management.status'),
                                                translate('manage_warehouse.bill_management.creator'),
                                                translate('manage_warehouse.bill_management.date'),
                                                translate('manage_warehouse.bill_management.stock'),
                                                translate('manage_warehouse.bill_management.partner'),
                                                translate('manage_warehouse.bill_management.description')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.setLimit}
                                            hideColumnOption={true}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            { (typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                    listPaginate.map((x, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{x.code}</td>
                                            <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                                            <td style={{ color: translate(`manage_warehouse.bill_management.${x.status}.color`)}}>{translate(`manage_warehouse.bill_management.${x.status}.status`)}</td>
                                            <td>{x.creator ? x.creator.name : "creator is deleted"}</td>
                                            <td>{this.formatDate(x.timestamp)}</td>
                                            <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                            <td>{x.partner ? x.partner.name : "Partner is deleted"}</td>
                                            <td>{x.description}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo(x._id)}><i className="material-icons">visibility</i></a>
                                                <a className="text-black" onClick={() => this.handleShow()}><i className="material-icons">print</i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {bills.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                    </div>
        );
    }
    
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getBillsByType: BillActions.getBillsByType,
    getDetailBill: BillActions.getDetailBill,
    getAllStocks: StockActions.getAllStocks,
    getUser: UserActions.get,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BookManagementTable));
