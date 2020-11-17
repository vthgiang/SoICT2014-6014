import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar } from '../../../../../../common-components';

import BillDetailForm from '../genaral/billDetailForm';

class BookManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1,
            group: ''
        }
    }
    
    render() {
        const { translate, bills, stocks, user} = this.props;
        const { listPaginate, totalPages, page } = bills;
        const { listStocks } = stocks;
        const { startDate, endDate, group, currentRow } = this.state;
        const dataPartner = this.props.getPartner();
        return (
            <div id="bill-stock-book">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.stock')}</label>
                            <SelectMulti
                                id={`select-multi-stock-book`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name }})}
                                onChange={this.props.handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.creator')}</label>
                            <SelectMulti
                                id={`select-multi-creator-book`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn người tạo", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={user.list.map(x => { return { value: x.id, text: x.name } })}
                                onChange={this.props.handleCreatorChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.props.handleCodeChange} placeholder={translate('manage_warehouse.bill_management.code')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.type')}</label>
                            <SelectMulti
                                id={`select-multi-type-book`}
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
                                    { value: '8', text: translate('manage_warehouse.bill_management.billType.8')},
                                ]}
                                onChange={this.props.handleTypeChange}
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
                                onChange={this.props.handleChangeStartDate}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                            <DatePicker
                                id="book-stock-end-date"
                                dateFormat="month-year"
                                value={endDate}
                                onChange={this.props.handleChangeEndDate}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manage_warehouse.bill_management.partner')}</label>
                            <SelectMulti
                                id={`select-multi-partner-book`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn đối tác", allSelectedText: "Chọn tất cả" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={dataPartner}
                                onChange={this.props.handlePartnerChange}
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
                                    { value: '1', text: translate('manage_warehouse.bill_management.bill_status.1')},
                                    { value: '2', text: translate('manage_warehouse.bill_management.bill_status.2')},
                                    { value: '3', text: translate('manage_warehouse.bill_management.bill_status.3')},
                                    { value: '4', text: translate('manage_warehouse.bill_management.bill_status.4')},
                                    { value: '5', text: translate('manage_warehouse.bill_management.bill_status.5')},
                                ]}
                                onChange={this.props.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.props.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <BillDetailForm />

                        <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th>{translate('manage_warehouse.bill_management.code')}</th>
                                    <th>{translate('manage_warehouse.bill_management.type')}</th>
                                    <th>{translate('manage_warehouse.bill_management.status')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.creator')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.approved')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.date')}</th>
                                    <th>{translate('manage_warehouse.bill_management.stock')}</th>
                                    <th>{translate('manage_warehouse.bill_management.partner')}</th>
                                    <th>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table`}
                                            columnArr={[
                                                translate('manage_warehouse.bill_management.index'),
                                                translate('manage_warehouse.bill_management.code'),
                                                translate('manage_warehouse.bill_management.type'),
                                                translate('manage_warehouse.bill_management.status'),
                                                translate('manage_warehouse.bill_management.creator'),
                                                translate('manage_warehouse.bill_management.approved'),
                                                translate('manage_warehouse.bill_management.date'),
                                                translate('manage_warehouse.bill_management.stock'),
                                                translate('manage_warehouse.bill_management.partner'),
                                                translate('manage_warehouse.bill_management.description')
                                            ]}
                                            limit={this.state.limit}
                                            setLimit={this.props.setLimit}
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
                                            <td style={{ color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`)}}>{translate(`manage_warehouse.bill_management.bill_status.${x.status}`)}</td>
                                            <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                            <td>{x.approver ? x.approver.name : "approver is deleted"}</td>
                                            <td>{this.props.formatDate(x.timestamp)}</td>
                                            <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                            <td>{x.customer ? x.customer.name : 'Partner is deleted'}</td>
                                            <td>{x.description}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.props.handleShowDetailInfo(x._id)}><i className="material-icons">visibility</i></a>
                                                <a className="text-black" onClick={() => this.props.handleShow()}><i className="material-icons">print</i></a>
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
                        <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.props.setPage} />
                    </div>
            </div>
        );
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(BookManagement));