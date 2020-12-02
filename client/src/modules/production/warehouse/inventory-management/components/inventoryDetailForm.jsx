import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, DatePicker, PaginateBar, DataTableSetting } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';
import { BillActions } from '../../bill-management/redux/actions';

class InventoryDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 1
        }
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

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = {
            limit: number,
            page: this.state.page,
            good: this.props.id
        };
        this.props.getBillByGood(data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            good: this.props.id
        };
        this.props.getBillByGood(data);
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

    handleSubmitSearch = () => {
        const data = {
            page: this.state.page,
            limit: this.state.limit,
            good: this.props.id,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
        }
        this.props.getBillByGood(data);
    }

    render() {
        const { translate, goods, lots, id, bills, quantity, stock } = this.props;
        const { endDate, startDate } = this.state;
        const { goodDetail } = goods;
        const { listLots } = lots;
        const { listBillByGood, totalPages, page } = bills;

        let goodQuantity = [];
        if(listBillByGood.length > 0) {
            for (let i = 0; i <listBillByGood.length; i++){
                if(listBillByGood[i].goods && listBillByGood[i].goods.length > 0){
                    for(let j = 0; j < listBillByGood[i].goods.length; j++){
                        if(listBillByGood[i].goods[j].good === id){
                            if(listBillByGood[i].group === '3'){
                                goodQuantity.push(listBillByGood[i].goods[j].returnQuantity)
                            }
                            goodQuantity.push(listBillByGood[i].goods[j].quantity)
                        }
                    }
                }
            }
        }


        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-inventory`}
                    formID={`form-detail-inventory`}
                    title={translate('manage_warehouse.inventory_management.stock_card')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-inventory`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.good_code')}:&emsp;</strong>
                                    {goodDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.unit')}:&emsp;</strong>
                                    {goodDetail.baseUnit}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.name')}:&emsp;</strong>
                                    {goodDetail.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.quantity')}:&emsp;</strong>
                                    {quantity} {goodDetail.baseUnit}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.inventory_management.description')}:&emsp;</strong>
                                    {goodDetail.description}
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.history')}</legend>
                                    <div className="form-inline">
                                        <div className="form-group">
                                            <label className="form-control-static">{translate('manage_warehouse.bill_management.from_date')}</label>
                                            <DatePicker
                                                id="date-history-start"
                                                dateFormat="month-year"
                                                value={startDate}
                                                onChange={this.handleChangeStartDate}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                                            <DatePicker
                                                id="date-history-end"
                                                dateFormat="month-year"
                                                value={endDate}
                                                onChange={this.handleChangeEndDate}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={this.handleSubmitSearch}>{translate('manage_warehouse.bill_management.search')}</button>
                                        </div>
                                    </div>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: "5%"}} title={translate('manage_warehouse.inventory_management.index')}>{translate('manage_warehouse.inventory_management.index')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.date_month')}>{translate('manage_warehouse.inventory_management.date_month')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.receipt')}>{translate('manage_warehouse.inventory_management.receipt')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.issue')}>{translate('manage_warehouse.inventory_management.issue')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.stock')}>{translate('manage_warehouse.inventory_management.stock')}
                                                <DataTableSetting
                                                    tableId={`inventory-detail-table`}
                                                    limit={this.state.limit}
                                                    setLimit={this.setLimit}
                                                    hideColumnOption={true}
                                                />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id={`inventory-detail-table`}>
                                            {
                                                (typeof listBillByGood !== undefined && listBillByGood.length !== 0) &&
                                                listBillByGood.map((x, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{this.formatDate(x.createdAt)}</td>
                                                        <td>{ x.group === '1' ? goodQuantity[index] : 0 }</td>
                                                        <td>{ (x.group === '2' || x.group === '3')? goodQuantity[index] : 0 }</td>
                                                        <td>{x.fromStock.name}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    {bills.isLoading ?
                                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                        (typeof listBillByGood === 'undefined' || listBillByGood.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                    <PaginateBar pageTotal = {totalPages} currentPage = {page} func = {this.setPage} />
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getBillByGood: BillActions.getBillByGood
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryDetailForm));