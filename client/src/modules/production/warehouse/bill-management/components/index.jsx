import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti, DatePicker, DataTableSetting, PaginateBar } from '../../../../../common-components';

// import BillDetailForm from './billDetailForm';
// import BillCreateForm from './billCreateForm';
// import BillEditForm from './billEditForm';

import BookManagement from '../components/stock-book';
import ReceiptManagement from '../components/good-receipts';
import IssueManagement from '../components/good-issues';
import ReturnManagement from '../components/good-returns';
import RotateManagement from '../components/stock-rotate';
import TakeManagement from '../components/stock-takes';

import { BillActions } from '../redux/actions';
import { StockActions } from '../../stock-management/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { CrmCustomerActions } from '../../../../crm/customer/redux/actions';

class BillManagement extends Component {

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
        this.props.getAllGoods();
        this.props.getCustomers();
    }

    handleShowDetailInfo = async (id) => {
        await this.props.getDetailBill(id);
        window.$('#modal-detail-bill').modal('show');
    }

    handleEdit = async (bill) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: bill
            }
        })

        window.$('#modal-edit-bill').modal('show');
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
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: this.state.customer,
            creator: this.state.creator
        };
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
        }
        this.props.getBillsByType(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            code: this.state.code,
            status: this.state.status,
            stock: this.state.stock,
            type: this.state.type,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            customer: this.state.customer,
            creator: this.state.creator
        };
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
        }
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

    handlePartnerChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                customer: value
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
            customer: this.state.customer,
            creator: this.state.creator
        }
        const { group } = this.state;
        if(group !== '') {
            data.group = group;
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

    handleStockBook = async () => {
        const page = 1;
        const group = '';
        await this.setState(state => {
            return {
                ...state,
                page: page,
                group: group
            }
        })
        const { limit } = this.state;
        await this.props.getBillsByType({ page, limit})
    }

    handleGoodReceipt = async () => {
        const page = 1;
        const group = '1';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group })
    }

    handleGoodIssue = async () => {
        const page = 1;
        const group = '2';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group })
    }

    handleGoodReturn = async () => {
        const page = 1;
        const group = '3';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group })
    }

    handleStockTake = async () => {
        const page = 1;
        const group = '4';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group })
    }

    handleStockRotate = async () => {
        const page = 1;
        const group = '5';
        const { limit } = this.state;
        await this.setState(state => {
            return {
                ...state,
                group: group,
                page: page
            }
        })

        await this.props.getBillsByType({ page, limit, group })
    }

    getPartner = () => {
        const { crm } = this.props;
        let partnerArr = [];

        crm.customers.list.map(item => {
            partnerArr.push({
                value: item._id,
                text: item.name
            })
        })

        return partnerArr;
    }

    render() {

        const { translate, bills, stocks, user} = this.props;
        const { listPaginate, totalPages, page } = bills;
        const { listStocks } = stocks;
        const { startDate, endDate, group, currentRow } = this.state;
        const dataPartner = this.getPartner();

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#bill-stock-book" data-toggle="tab" onClick={() => this.handleStockBook()}>{translate('manage_warehouse.bill_management.stock_book')}</a></li>
                    <li><a href="#bill-good-receipts" data-toggle="tab" onClick={() => this.handleGoodReceipt()}>{translate('manage_warehouse.bill_management.good_receipt')}</a></li>
                    <li><a href="#bill-good-issues" data-toggle="tab" onClick={() => this.handleGoodIssue()}>{translate('manage_warehouse.bill_management.good_issue')}</a></li>
                    <li><a href="#bill-good-returns" data-toggle="tab" onClick={() => this.handleGoodReturn()}>{translate('manage_warehouse.bill_management.good_return')}</a></li>
                    <li><a href="#bill-stock-takes" data-toggle="tab" onClick={() => this.handleStockTake()}>{translate('manage_warehouse.bill_management.stock_take')}</a></li>
                    <li><a href="#bill-stock-rotates" data-toggle="tab" onClick={() => this.handleStockRotate()}>{translate('manage_warehouse.bill_management.stock_rotate')}</a></li>
                </ul>
                <div className="tab-content">

                { group === '' && 
                    <BookManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}

                    />
                }

                { group === '1' && 
                    <ReceiptManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                    />
                }

                { group === '2' && 
                    <IssueManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                    />
                }

                { group === '3' && 
                    <ReturnManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                    />
                }

                { group === '4' &&
                    <TakeManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                    />
                }

                { group === '5' && 
                    <RotateManagement 
                        handleEdit={this.handleEdit}
                        formatDate={this.formatDate}
                        setPage={this.setPage}
                        setLimit={this.setLimit}
                        handleStockChange={this.handleStockChange}
                        handleCreatorChange={this.handleCreatorChange}
                        handleTypeChange={this.handleTypeChange}
                        handleStatusChange={this.handleStatusChange}
                        handleCodeChange={this.handleCodeChange}
                        handlePartnerChange={this.handlePartnerChange}
                        handleSubmitSearch={this.handleSubmitSearch}
                        handleChangeStartDate={this.handleChangeStartDate}
                        handleChangeEndDate={this.handleChangeEndDate}
                        getPartner={this.getPartner}
                        handleShowDetailInfo={this.handleShowDetailInfo}
                    />
                }

                {/* <div className="box-body qlcv">
                    { group !== '' ? <BillCreateForm group={group} /> : ''}
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
                                    { value: '8', text: translate('manage_warehouse.bill_management.billType.8')},
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
                        {
                            group !== '4' ?
                            <div className="form-group">
                                <label className="form-control-static">{group === '1' ? translate('manage_warehouse.bill_management.supplier') : group === '2' ? translate('manage_warehouse.bill_management.customer') : group === '5' ? translate('manage_warehouse.bill_management.receipt_stock') : translate('manage_warehouse.bill_management.partner')}</label>
                                <SelectMulti
                                    id={`select-multi-partner`}
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Chọn đối tác", allSelectedText: "Chọn tất cả" }}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={dataPartner}
                                    onChange={this.handlePartnerChange}
                                />
                            </div> : []
                        }
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
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            { group === '4' ? <label></label> : []}
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <BillDetailForm />
                    {
                        currentRow &&
                        <BillEditForm 
                            billId={currentRow._id}
                            fromStock={currentRow.fromStock ? currentRow.fromStock._id : null}
                            toStock={currentRow.toStock ? currentRow.toStock_id : null}
                            code={currentRow.code}
                            group={currentRow.group}
                            type={currentRow.type}
                            status={currentRow.status}
                            users={currentRow.users}
                            approver={currentRow.approver ? currentRow.approver._id : null}
                            customer={currentRow.customer ? currentRow.customer._id : null}
                            supplier={currentRow.supplier ? currentRow.supplier._id : null}
                            name={currentRow.receiver ? currentRow.receiver.name : ''}
                            phone={currentRow.receiver ? currentRow.receiver.phone : ''}
                            email={currentRow.receiver ? currentRow.receiver.email : ''}
                            address={currentRow.receiver ? currentRow.receiver.address : ''}
                            description={currentRow.description}
                            listGood={currentRow.goods}
                        />
                    }

                        <table id={`good-table`} className="table table-striped table-bordered table-hover" style={{marginTop: '15px'}}>
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th>{translate('manage_warehouse.bill_management.code')}</th>
                                    { group === '3' ? <th>{translate('manage_warehouse.bill_management.issued')}</th> : []}
                                    <th>{translate('manage_warehouse.bill_management.type')}</th>
                                    <th>{translate('manage_warehouse.bill_management.status')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.creator')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.approved')}</th> 
                                    <th>{translate('manage_warehouse.bill_management.date')}</th>
                                    <th>{translate('manage_warehouse.bill_management.stock')}</th>
                                    {group === '1' ? <th>{translate('manage_warehouse.bill_management.supplier')}</th> : group === '2' ? <th>{translate('manage_warehouse.bill_management.customer')}</th> : group === '5' ? <th>{translate('manage_warehouse.bill_management.receipt_stock')}</th> : group === '4' ? [] : <th>{translate('manage_warehouse.bill_management.partner')}</th>}
                                    <th>{translate('manage_warehouse.bill_management.description')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}
                                    <DataTableSetting
                                            tableId={`good-table`}
                                            columnArr={[
                                                translate('manage_warehouse.bill_management.index'),
                                                translate('manage_warehouse.bill_management.code'),
                                                group === '3' ? translate('manage_warehouse.bill_management.issued') : '',
                                                translate('manage_warehouse.bill_management.type'),
                                                translate('manage_warehouse.bill_management.status'),
                                                translate('manage_warehouse.bill_management.creator'),
                                                translate('manage_warehouse.bill_management.approved'),
                                                translate('manage_warehouse.bill_management.date'),
                                                translate('manage_warehouse.bill_management.stock'),
                                                group === '1' ? translate('manage_warehouse.bill_management.supplier') : group === '2' ? translate('manage_warehouse.bill_management.customer') : group === '5' ? translate('manage_warehouse.bill_management.receipt_stock') : group === '4' ? '' : translate('manage_warehouse.bill_management.partner'),
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
                                            <td style={{ color: translate(`manage_warehouse.bill_management.bill_color.${x.status}`)}}>{translate(`manage_warehouse.bill_management.bill_status.${x.status}`)}</td>
                                            <td>{x.creator ? x.creator.name : "Creator is deleted"}</td>
                                            <td>{x.approver ? x.approver.name : "approver is deleted"}</td>
                                            <td>{this.formatDate(x.timestamp)}</td>
                                            <td>{x.fromStock ? x.fromStock.name : "Stock is deleted"}</td>
                                            <td>{x.customer ? x.customer.name : 'Partner is deleted'}</td>
                                            <td>{x.description}</td>
                                            <td style={{textAlign: 'center'}}>
                                                <a className="text-green" onClick={() => this.handleShowDetailInfo(x._id)}><i className="material-icons">visibility</i></a>
                                                { this.state.group !== '' ? <a onClick={() => this.handleEdit(x)} className="text-yellow" ><i className="material-icons">edit</i></a> : ''}
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
                    </div> */}
                </div>
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
    getAllGoods: GoodActions.getAllGoods,
    getCustomers: CrmCustomerActions.getCustomers
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillManagement));
