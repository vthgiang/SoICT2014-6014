import React, { useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { formatDate, formatFullDate } from '../../../../../../helpers/formatDate';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

import QuantityLotDetailForm from './quantityLotDetail';
import BillLogs from './billLogs';

function BillDetailForm(props) {
    const [state, setState] = useState({

    })

    const handleShowDetailQuantity = async (lot) => {
        await setState({
            ...state,
            quantityDetail: lot
        })

        window.$('#modal-detail-lot-quantity').modal('show');
    }

    const handleViewVersion = (e) => {
        e.preventDefault();
        window.$('#modal-detail-logs-version-bill').modal('show');
    }

    const { translate, bills } = props;
    const { billDetail } = bills;
    const { quantityDetail } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-bill`}
                formID={`form-detail-bill`}
                title={translate(`manage_warehouse.bill_management.detail_title.${billDetail.group}`)}
                msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                msg_failure={translate('manage_warehouse.bin_location_management.add_faile')}
                size={75}
                hasSaveButton={false}
                hasNote={false}
            >
                <BillLogs logs={billDetail ? billDetail.logs : []} group={billDetail.group} />
                {
                    quantityDetail &&
                    <QuantityLotDetailForm quantityDetail={quantityDetail} group={billDetail.group} />
                }
                <form id={`form-detail-bill`} >
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                                    {billDetail ? <a style={{ color: translate(`manage_warehouse.bill_management.bill_color.${billDetail.status}`) }}>{translate(`manage_warehouse.bill_management.bill_status.${billDetail.status}`)}</a> : []}
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
                                    <strong>{translate('manage_warehouse.bill_management.date')}:&emsp;</strong>
                                    {formatDate(billDetail.createdAt)}
                                </div>
                                {billDetail.group === '1' && billDetail.sourceType === '1' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.mill')}:&emsp;</strong>
                                        {billDetail.manufacturingMill ? billDetail.manufacturingMill.name : "Mill is deleted"}
                                    </div>
                                }
                                {billDetail.group === '1' && billDetail.sourceType === '2' &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.supplier')}:&emsp;</strong>
                                        {billDetail.supplier ? billDetail.supplier.name : "Supplier is deleted"}
                                    </div>
                                }
                                {(billDetail.group === '2' || billDetail.group === '3') &&
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.bill_management.customer')}:&emsp;</strong>
                                        {billDetail.customer ? billDetail.customer.name : "Customer is deleted"}
                                    </div>
                                }
                                {billDetail.group === '5' &&
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
                        </div>
                        {
                            billDetail.approvers && billDetail.approvers.length && <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.approved')}</legend>
                                    {
                                        billDetail.approvers.map((x, index) => {
                                            return (
                                                <div className="form-group" key={index}>
                                                    <p>{x.approver.name}{" - "}{x.approver.email}
                                                        {
                                                            x.approvedTime &&
                                                            <React.Fragment>
                                                                &emsp; &emsp; &emsp;
                                                                {translate('manage_warehouse.bill_management.approved_time')}
                                                                : &emsp;
                                                                {formatFullDate(x.approvedTime)}
                                                            </React.Fragment>
                                                        }
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                </fieldset>
                            </div>
                        }
                        {billDetail && billDetail.qualityControlStaffs && billDetail.qualityControlStaffs.length ?
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.qualityControlStaffs')}</legend>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>{translate('manage_warehouse.bill_management.index')}</th>
                                                <th>{translate('manage_warehouse.bill_management.qc_name')}</th>
                                                <th>{translate('manage_warehouse.bill_management.qc_email')}</th>
                                                <th>{translate('manage_warehouse.bill_management.qc_status_bill')}</th>
                                                <th>{translate('manage_warehouse.bill_management.quality_control_content')}</th>
                                                <th>{translate('manage_warehouse.bill_management.time')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                billDetail.qualityControlStaffs.map((x, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.staff.name}</td>
                                                        <td>{x.staff.email}</td>
                                                        {x.status ? <td style={{ color: translate(`manage_warehouse.bill_management.qc_status.${x.status}.color`) }}>
                                                            {translate(`manage_warehouse.bill_management.qc_status.${x.status}.content`)}
                                                        </td> : <td></td>}
                                                        <td>{x.content}</td>
                                                        <td>{x.time && formatFullDate(x.time)}</td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                            :
                            ""
                        }
                        {
                            billDetail.accountables && billDetail.accountables.length && <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.accountables')}</legend>
                                    {
                                        billDetail.accountables.map((x, index) => {
                                            return (
                                                <div className="form-group" key={index}>
                                                    <p>{x.name}{" - "}{x.email}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </fieldset>
                            </div>
                        }
                        {
                            billDetail.responsibles && billDetail.responsibles.length && <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bill_management.users')}</legend>
                                    {
                                        billDetail.responsibles.map((x, index) => {
                                            return (
                                                <div className="form-group" key={index}>
                                                    <p>{x.name}{" - "}{x.email}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </fieldset>
                            </div>
                        }
                        {billDetail.group !== '4' &&
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                        }
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manage_warehouse.bill_management.goods')}</legend>

                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }} title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                            <th title={translate('manage_warehouse.bill_management.code')}>{translate('manage_warehouse.bill_management.code')}</th>
                                            <th title={translate('manage_warehouse.bill_management.good_name')}>{translate('manage_warehouse.bill_management.good_name')}</th>
                                            <th title={translate('manage_warehouse.bill_management.unit')}>{translate('manage_warehouse.bill_management.unit')}</th>
                                            {billDetail.group !== '3' && <th title={translate('manage_warehouse.bill_management.number')}>{translate('manage_warehouse.bill_management.number')}</th>}
                                            {billDetail.group !== '3' && <th title={translate('manage_warehouse.bill_management.number_passed')}>{translate('manage_warehouse.bill_management.number_passed')}</th>}
                                            {billDetail.group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_issue')}>{translate('manage_warehouse.bill_management.quantity_issue')}</th>}
                                            {billDetail.group === '3' && <th title={translate('manage_warehouse.bill_management.quantity_return')}>{translate('manage_warehouse.bill_management.quantity_return')}</th>}
                                            {billDetail.group === '4' && <th title={translate('manage_warehouse.bill_management.real_quantity')}>{translate('manage_warehouse.bill_management.real_quantity')}</th>}
                                            {billDetail.group === '4' && <th title={translate('manage_warehouse.bill_management.difference')}>{translate('manage_warehouse.bill_management.difference')}</th>}
                                            <th title={translate('manage_warehouse.bill_management.lot_with_unit')}>{translate('manage_warehouse.bill_management.lot_with_unit')}</th>
                                            <th title={translate('manage_warehouse.bill_management.description')}>{translate('manage_warehouse.bill_management.description')}</th>
                                        </tr>
                                    </thead>
                                    <tbody id={`good-edit-manage-by-archive`}>
                                        {(typeof billDetail.goods !== 'undefined' && billDetail.goods.length > 0) &&
                                            billDetail.goods.map((x, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.good ? x.good.code : ''}</td>
                                                    <td>{x.good ? x.good.name : ''}</td>
                                                    <td>{x.good ? x.good.baseUnit : ''}</td>
                                                    {billDetail.group !== '3' && <td>{x.quantity}</td>}
                                                    {billDetail.group !== '3' && <td>{x.realQuantity} <a href="#" onClick={() => handleShowDetailQuantity(x)}> (Chi tiết)</a></td>}
                                                    {billDetail.group === '3' && <td>{x.quantity}</td>}
                                                    {billDetail.group === '3' && <td>{x.returnQuantity} <a href="#" onClick={() => handleShowDetailQuantity(x)}> (Chi tiết)</a></td>}
                                                    {billDetail.group === '4' && <td>{x.realQuantity}</td>}
                                                    {billDetail.group === '4' && <td>{x.damagedQuantity}</td>}
                                                    <td>{x.lots.map((lot, index) =>
                                                        <div key={index}>
                                                            {lot.lot.code && <p>{lot.lot.code}/{lot.quantity} {x.good.baseUnit}</p>}
                                                        </div>)}
                                                    </td>
                                                    <td>{x.description}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </fieldset>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleViewVersion}>{translate('manage_warehouse.bill_management.view_version')}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(BillDetailForm));
