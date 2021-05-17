import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

import LogLots from './logLots';
import BillDetailForm from '../../bill-management/components/genaral/billDetailForm';
import { BillActions } from '../../bill-management/redux/actions';

function LotDetailForm(props) {
    const [state, setState] = useState({

    })

    const handleShowDetailManufacturingCommand = async (command) => {
        await setState({
            ...state,
            commandDetail: command
        });
        window.$('#modal-detail-info-manufacturing-command-9').modal('show');
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    const handleShowDetailInfo = async (id) => {
        await props.getDetailBill(id);
        window.$('#modal-detail-bill').modal('show');
    }

    const { translate, lots } = props;
    const { lotDetail } = lots;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-lot`}
                formID={`form-detail-lot`}
                title={translate('manage_warehouse.inventory_management.lot_detail')}
                msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                size={75}
                hasSaveButton={false}
                hasNote={false}
            >
                <BillDetailForm />

                <form id={`form-detail-lot`} >
                    {
                        lotDetail ?
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.lot_code')}:&emsp;</strong>
                                        {lotDetail.code}
                                    </div>
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.unit')}:&emsp;</strong>
                                        {lotDetail.good.baseUnit}
                                    </div>
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.stock')}:&emsp;</strong>
                                    Tất cả kho
                                </div>
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.from_to')}:&emsp;</strong>
                                        {lotDetail.manufacturingCommand ? <a href="#">{lotDetail.manufacturingCommand.code}</a> : "Lô hàng nhập từ nhà cung cấp"}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.original_quantity')}:&emsp;</strong>
                                        {lotDetail.originalQuantity} {lotDetail.good.baseUnit}
                                    </div>
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.quantity')}:&emsp;</strong>
                                        {lotDetail.quantity} {lotDetail.good.baseUnit}
                                    </div>
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.date')}:&emsp;</strong>
                                        {formatDate(lotDetail.expirationDate)}
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                    <div className="form-group">
                                        <strong>{translate('manage_warehouse.inventory_management.description')}:&emsp;</strong>
                                        {lotDetail.description}
                                    </div>
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.bin')}</legend>
                                        {lotDetail.stocks.map((x, index) => <p key={index}><b>Kho {x.stock.name} có {x.quantity} {
                                            lotDetail.good.baseUnit}: </b>{x.binLocations.map((item, index) => {
                                                if (x.binLocations.length === index + 1) {
                                                    return item.binLocation.path + "(" + item.quantity + lotDetail.good.baseUnit + ")"
                                                }
                                                return item.binLocation.path + "(" + item.quantity + lotDetail.good.baseUnit + "), "
                                            }
                                            )}</p>)}
                                    </fieldset>
                                    {/* <LogLots logs={lotDetail.lotLogs} /> */}
                                    <div>
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">{translate('manage_warehouse.inventory_management.history')}</legend>

                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "5%" }} title={translate('manage_warehouse.inventory_management.index')}>{translate('manage_warehouse.inventory_management.index')}</th>
                                                        <th title={translate('manage_warehouse.inventory_management.bill')}>{translate('manage_warehouse.inventory_management.bill')}</th>
                                                        <th title={translate('manage_warehouse.inventory_management.date_month')}>{translate('manage_warehouse.inventory_management.date_month')}</th>
                                                        <th title={translate('manage_warehouse.inventory_management.status')}>{translate('manage_warehouse.inventory_management.status')}</th>
                                                        <th title={translate('manage_warehouse.inventory_management.number')}>{translate('manage_warehouse.inventory_management.number')}</th>
                                                        {/* <th title={translate('manage_warehouse.inventory_management.quantity')}>{translate('manage_warehouse.inventory_management.quantity')}</th> */}
                                                        <th title={translate('manage_warehouse.inventory_management.stock')}>{translate('manage_warehouse.inventory_management.stock')}</th>
                                                        {/* <th style={{width: "16%"}} title={translate('manage_warehouse.inventory_management.bin')}>{translate('manage_warehouse.inventory_management.bin')}</th> */}
                                                        <th title={translate('manage_warehouse.inventory_management.partner')}>{translate('manage_warehouse.inventory_management.partner')}</th>
                                                        <th title={translate('manage_warehouse.inventory_management.note')}>{translate('manage_warehouse.inventory_management.note')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody id={`good-edit-manage-by-archive`}>
                                                    {(typeof lotDetail.lotLogs === 'undefined' || lotDetail.lotLogs.length === 0) ? <tr><td colSpan={3}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                        lotDetail.lotLogs.map((x, index) =>
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                {x.bill ? <td><a href="#" onClick={() => handleShowDetailInfo(x.bill._id)}>{x.bill.code}</a></td> : <td></td>}
                                                                <td>{formatDate(x.createdAt)}</td>
                                                                <td>{translate(`manage_warehouse.bill_management.billType.${x.type}`)}</td>
                                                                <td>{x.quantity ? x.quantity : 0}</td>
                                                                <td>{x.stock ? x.stock.name : ""}</td>
                                                                {/* <td>{x.binLocations ? x.binLocations.map((item, index) => <p key={index}>{item.binLocation.path} ({item.quantity})</p>) : ""}</td> */}
                                                                {x.type === '1' ? <td>{(x.bill && x.bill.supplier) ? x.bill.supplier.name : ''}</td> :
                                                                    (x.type === '2' || x.type === '4') ? <td>{(x.bill && x.bill.manufacturingMill) ? x.bill.manufacturingMill.name : ''}</td> :
                                                                        (x.type === '3' || x.type === '7') ? <td>{(x.bill && x.bill.customer) ? x.bill.customer.name : ''}</td> :
                                                                            x.type === '8' ? <td>{(x.bill && x.bill.toStock) ? x.bill.toStock.name : ''}</td> : <td></td>
                                                                }
                                                                <td>{x.description}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </fieldset>
                                    </div>
                                </div>
                            </div> : []
                    }
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getDetailBill: BillActions.getDetailBill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(LotDetailForm));