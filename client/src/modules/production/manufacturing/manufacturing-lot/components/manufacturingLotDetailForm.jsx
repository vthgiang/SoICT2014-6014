import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate';
import BillDetailForm from '../../../warehouse/bill-management/components/genaral/billDetailForm';
import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import LogLots from '../../../warehouse/inventory-management/components/logLots';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';

function ManufacturingLotDetailForm(props) {
    
    const [prevProps, setPrevProps] = useState(props)

    useEffect(() => {
        if(props.lotDetail !== prevProps.lotDetail){
            prevProps.getDetailManufacturingLot(props.lotDetail._id);
            setPrevProps(props);
        }
    },[props.lotDetail])
    
    const showDetailBill = async (id) => {
        await props.getDetailBill(id);
        window.$('#modal-detail-bill').modal('show');
    }

    
    const { translate, lots, bills } = props;
    let currentLot = {};
    if (lots.currentLot && lots.isLoading === false) {
        currentLot = lots.currentLot
    }
    let listBillByCommand = [];
    if (bills.listBillByCommand && bills.isLoading === false) {
        listBillByCommand = bills.listBillByCommand;
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-manufacturing-lot`} isLoading={lots.isLoading}
                title={translate('manufacturing.lot.lot_detail')}
                formID={`form-detail-manufacturing-lot`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <BillDetailForm />
                <form id={`form-detail-manufacturing-lot`}>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.code')}:&emsp;</strong>
                                {currentLot.code}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.command_code')}:&emsp;</strong>
                                {currentLot.manufacturingCommand && currentLot.manufacturingCommand.code}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.lot_type')}:&emsp;</strong>
                                {translate(`manufacturing.lot.product_type_object.${currentLot.productType}`)}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.bill_import_code')}:&emsp;</strong>
                                {currentLot.bills && currentLot.bills.map((bill, index) => {
                                    if (index === currentLot.bills.length - 1) {
                                        return <a href="#" onClick={() => showDetailBill(bill._id)}>{bill.code}</a>
                                    }
                                    return <a href="#" onClick={() => showDetailBill(bill._id)}>{bill.code}, </a>
                                })}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.manufacturing_mill')}:&emsp;</strong>
                                {currentLot.manufacturingCommand && currentLot.manufacturingCommand.manufacturingMill.code + " - " + currentLot.manufacturingCommand.manufacturingMill.name}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.team_leader')}:&emsp;</strong>
                                {currentLot.manufacturingCommand && currentLot.manufacturingCommand.manufacturingMill.teamLeader.email}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.creator')}:&emsp;</strong>
                                {currentLot.creator && currentLot.creator.name + " - " + currentLot.creator.email}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.created_at')}:&emsp;</strong>
                                {formatDate(currentLot.createdAt)}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.expiration_date')}:&emsp;</strong>
                                {formatDate(currentLot.expirationDate)}
                            </div>
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.status')}:&emsp;</strong>
                                {
                                    currentLot.status &&
                                    <span style={{ color: translate(`manufacturing.lot.${currentLot.status}.color`) }}>
                                        {translate(`manufacturing.lot.${currentLot.status}.content`)}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <strong>{translate('manufacturing.lot.description')}:&emsp;</strong>
                                {currentLot.description}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.good_info')}</legend>
                                <div className={`form-group`}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>{translate('manufacturing.command.good_code')}</th>
                                                <th>{translate('manufacturing.command.good_name')}</th>
                                                <th>{translate('manufacturing.command.good_base_unit')}</th>
                                                <th>{translate('manufacturing.command.quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{currentLot.good && currentLot.good.code}</td>
                                                <td>{currentLot.good && currentLot.good.name}</td>
                                                <td>{currentLot.good && currentLot.good.baseUnit}</td>
                                                <td>{currentLot.originalQuantity}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.material')}</legend>
                                <div className={`form-group`}>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>{translate('manufacturing.command.material_code')}</th>
                                                <th>{translate('manufacturing.command.material_name')}</th>
                                                <th>{translate('manufacturing.command.good_base_unit')}</th>
                                                <th>{translate('manufacturing.command.quantity')}</th>
                                                <th>{translate('manufacturing.command.from_stock')}</th>
                                                <th style={{ textAlign: "left" }}>{translate('manufacturing.command.status_bill')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listBillByCommand && listBillByCommand.length &&
                                                listBillByCommand.map((bill, index) => (
                                                    bill.goods.map((good, index1) => (
                                                        index1 === 0
                                                            ?
                                                            <tr key={index1}>
                                                                <td>{good.good.code}</td>
                                                                <td>{good.good.name}</td>
                                                                <td>{good.good.baseUnit}</td>
                                                                <td style={{ textAlign: "left" }}>{good.quantity}</td>
                                                                <td rowSpan={bill.goods.length}>{bill.fromStock.code + " - " + bill.fromStock.name}</td>
                                                                <td
                                                                    style={{ textAlign: "left", color: translate(`manufacturing.command.bill.${bill.status}.color`) }}
                                                                    rowSpan={bill.goods.length}
                                                                >
                                                                    {translate(`manufacturing.command.bill.${bill.status}.content`)}
                                                                </td>
                                                            </tr>
                                                            :
                                                            <tr key={index1}>
                                                                <td>{good.good.code}</td>
                                                                <td>{good.good.name}</td>
                                                                <td>{good.good.baseUnit}</td>
                                                                <td style={{ textAlign: "left" }}>{good.quantity}</td>
                                                            </tr>
                                                    ))
                                                ))

                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.material')}</legend>
                                <div className={`form-group`}>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>{translate('manufacturing.command.index')}</th>
                                                <th>{translate('manufacturing.command.material_code')}</th>
                                                <th>{translate('manufacturing.command.material_name')}</th>
                                                <th>{translate('manufacturing.command.good_base_unit')}</th>
                                                <th>{translate('manufacturing.command.quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentLot.manufacturingCommand && currentLot.manufacturingCommand
                                                    && currentLot.manufacturingCommand.good && currentLot.manufacturingCommand.good.materials && currentLot.manufacturingCommand.good.materials.length
                                                    ?
                                                    currentLot.manufacturingCommand.good.materials.map((x, index) => (
                                                        <tr key={index}>
                                                            <td> {index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity * currentLot.manufacturingCommand.quantity}</td>
                                                        </tr>
                                                    ))
                                                    :
                                                    <tr>
                                                        <td colSpan={5}>{translate('general.no_data')}</td>
                                                    </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.responsibles')}</legend>
                                {
                                    currentLot.manufacturingCommand && currentLot.manufacturingCommand.responsibles && currentLot.manufacturingCommand.responsibles.length &&
                                    currentLot.manufacturingCommand.responsibles.map((x, index) => {
                                        return (
                                            <div className="form-group" key={index}>
                                                <p>{x.name}{" - "}{x.email}</p>
                                            </div>
                                        )
                                    })
                                }
                            </fieldset>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.accountables')}</legend>
                                {
                                    currentLot.manufacturingCommand && currentLot.manufacturingCommand.accountables && currentLot.manufacturingCommand.accountables.length &&
                                    currentLot.manufacturingCommand.accountables.map((x, index) => {
                                        return (
                                            <div className="form-group" key={index}>
                                                <p>{x.name}{" - "}{x.email}</p>
                                            </div>
                                        )
                                    })
                                }
                            </fieldset>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.command.qualityControlStaffs')}</legend>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>{translate('manufacturing.command.index')}</th>
                                            <th>{translate('manufacturing.command.qc_name')}</th>
                                            <th>{translate('manufacturing.command.qc_email')}</th>
                                            <th>{translate('manufacturing.command.qc_status_command')}</th>
                                            <th>{translate('manufacturing.command.quality_control_content')}</th>
                                            <th>{translate('manufacturing.command.time')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentLot.manufacturingCommand && currentLot.manufacturingCommand.qualityControlStaffs && currentLot.manufacturingCommand.qualityControlStaffs.length &&
                                            currentLot.manufacturingCommand.qualityControlStaffs.map((qualityControlStaff, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{qualityControlStaff.staff.name}</td>
                                                    <td>{qualityControlStaff.staff.email}</td>
                                                    <td style={{ color: translate(`manufacturing.command.qc_status.${qualityControlStaff.status}.color`) }}>
                                                        {translate(`manufacturing.command.qc_status.${qualityControlStaff.status}.content`)}
                                                    </td>
                                                    <td>{qualityControlStaff.content}</td>
                                                    <td>{qualityControlStaff.time && formatFullDate(qualityControlStaff.time)}</td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('manufacturing.lot.lot_diary')}</legend>
                                <div className={`form-group`}>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }} title={translate('manage_warehouse.inventory_management.index')}>{translate('manage_warehouse.inventory_management.index')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.bill')}>{translate('manage_warehouse.inventory_management.bill')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.date_month')}>{translate('manage_warehouse.inventory_management.date_month')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.status')}>{translate('manage_warehouse.inventory_management.status')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.number')}>{translate('manage_warehouse.inventory_management.number')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.stock')}>{translate('manage_warehouse.inventory_management.stock')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.partner')}>{translate('manage_warehouse.inventory_management.partner')}</th>
                                                <th title={translate('manage_warehouse.inventory_management.note')}>{translate('manage_warehouse.inventory_management.note')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                            {(typeof currentLot.lotLogs === 'undefined' || currentLot.lotLogs.length === 0) ? <tr><td colSpan={8}><center>{translate('task_template.no_data')}</center></td></tr> :
                                                currentLot.lotLogs.map((x, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.bill ? x.bill.code : ''}</td>
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
                                </div>
                            </fieldset>
                            {/* <LogLots logs={currentLot.lotLogs} /> */}
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { lots, bills } = state;
    return { lots, bills }
}

const mapDispatchToProps = {
    getDetailManufacturingLot: LotActions.getDetailManufacturingLot,
    // getBillsByCommand: BillActions.getBillsByCommand,
    getDetailBill: BillActions.getDetailBill,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotDetailForm));

