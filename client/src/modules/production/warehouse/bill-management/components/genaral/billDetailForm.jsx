import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

import QuantityLotDetailForm from './quantityLotDetail';

class BillDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

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

    handleShowDetailQuantity = async (lot) => {
        await this.setState(state => {
            return {
                ...state,
                quantityDetail: lot
            }
        })

        window.$('#modal-detail-lot-quantity').modal('show');
    }

    render() {
        const { translate, bills } = this.props;
        const { billDetail } = bills;
        const { quantityDetail } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-bill`}
                    formID={`form-detail-bill`}
                    title={translate(`manage_warehouse.bill_management.detail_title.${billDetail.group}`)}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={100}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-bill`} >
                    {
                        quantityDetail &&
                        <QuantityLotDetailForm quantityDetail={quantityDetail} />
                    }
                        <div className="row">
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.infor')}</legend>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.code')}:&emsp;</strong>
                                    {billDetail.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.type')}:&emsp;</strong>
                                    {translate(`manage_warehouse.bill_management.billType.${billDetail.type}`)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate(`manage_warehouse.bill_management.status`)}:&emsp;</strong>
                                    {billDetail ? <a style={{color: translate(`manage_warehouse.bill_management.bill_color.${billDetail.status}`)}}>{translate(`manage_warehouse.bill_management.bill_status.${billDetail.status}`)}</a> : []}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.stock')}:&emsp;</strong>
                                    {billDetail.fromStock ? billDetail.fromStock.name : "Stock is deleted"}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.creator')}:&emsp;</strong>
                                    {billDetail.creator ? billDetail.creator.name : "Creator is deleted"}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.approved')}:&emsp;</strong>
                                    {billDetail.approver ? billDetail.approver.name : "Approver is deleted"}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.date')}:&emsp;</strong>
                                    {this.formatDate(billDetail.timestamp)}
                                </div>
                                { billDetail.group === '1' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.supplier')}:&emsp;</strong>
                                        {billDetail.supplier ? billDetail.supplier.name : "Supplier is deleted"}
                                    </div>
                                }
                                { (billDetail.group === '2' || billDetail.group === '3') &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.customer')}:&emsp;</strong>
                                        {billDetail.customer ? billDetail.customer.name : "Customer is deleted"}
                                    </div>
                                }
                                { billDetail.group === '5' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.receipt_stock')}:&emsp;</strong>
                                        {billDetail.toStock ? billDetail.toStock.name : "Stock is deleted"}
                                    </div>
                                }
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bill_management.description')}:&emsp;</strong>
                                    {billDetail.description}
                                </div>
                            </div>
                            </fieldset>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_warehouse.bill_management.receiver')}</legend>
                            <div className={`form-group`}>
                                <strong>{translate('manage_warehouse.bill_management.name')}:&emsp;</strong>
                                {billDetail.receiver ? billDetail.receiver.name : ''}
                            </div>
                            <div className={`form-group`}>
                                <strong>{translate('manage_warehouse.bill_management.phone')}:&emsp;</strong>
                                {billDetail.receiver ? billDetail.receiver.phone : ''}
                            </div>
                            <div className={`form-group`}>
                                <strong>{translate('manage_warehouse.bill_management.email')}:&emsp;</strong>
                                {billDetail.receiver ? billDetail.receiver.email : ''}
                            </div>
                            <div className={`form-group`}>
                                <strong>{translate('manage_warehouse.bill_management.address')}:&emsp;</strong>
                                {billDetail.receiver ? billDetail.receiver.address : ''}
                            </div>
                        </fieldset>
                        </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: "5%"}} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th title={translate('manage_warehouse.bill_management.code')}>{translate('manage_warehouse.bill_management.code')}</th>
                                                <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                                <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                                <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>
                                                <th title={translate('manage_warehouse.bill_management.note')}>{translate('manage_warehouse.bill_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            {(typeof billDetail.goods !== 'undefined' && billDetail.goods.length > 0) &&
                                                billDetail.goods.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.good.code}</td>
                                                        <td>{x.good.name}</td>
                                                        <td>{x.good.baseUnit}</td>
                                                        <td>{x.quantity} <a href="#" onClick={() => this.handleShowDetailQuantity(x)}> (Chi tiết)</a></td>
                                                        <td>{x.description}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
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

export default connect(mapStateToProps, null)(withTranslate(BillDetailForm));