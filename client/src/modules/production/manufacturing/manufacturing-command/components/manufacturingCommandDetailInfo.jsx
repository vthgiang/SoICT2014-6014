import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { PaymentActions } from '../../../order/payment/redux/actions';
import SalesOrderDetailForm from '../../../order/sales-order/components/salesOrderDetailForm';
import { SalesOrderActions } from '../../../order/sales-order/redux/actions';
import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import ManufacturingLotDetailForm from '../../manufacturing-lot/components/manufacturingLotDetailForm';
import PurchasingRequestCreateForm from '../../purchasing-request/components/purchasingRequestCreateForm';
import { commandActions } from '../redux/actions';
class ManufacturingCommandDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.commandDetail !== nextProps.commandDetail) {
            this.props.getDetailManufacturingCommand(nextProps.commandDetail._id);
            this.props.getBillsByCommand({ manufacturingCommandId: nextProps.commandDetail._id });

            // Xử lý lấy ra tồn kho của danh sách nguyên vật liệu
            const materials = nextProps.commandDetail.good.materials;
            let materialIds = [];
            materials.map(x => {
                materialIds.push(x.good._id)
            });
            this.props.getInventoryByGoodIds({
                array: materialIds,
            });
            return false
        }
        return true;
    }

    showDetailManufacturingLot = async (lot) => {
        await this.setState({
            lotDetail: lot
        });

        window.$('#modal-detail-info-manufacturing-lot').modal('show');
    }

    getCurrentCommandIncludeMaterialInventory = () => {
        const { manufacturingCommand, lots } = this.props;
        const { currentCommand } = manufacturingCommand;
        const { listInventories } = lots;
        if (listInventories && currentCommand) {
            listInventories.map((x, index) => {
                if (currentCommand.good && currentCommand.good.materials[index]) {
                    currentCommand.good.materials[index].inventory = x.inventory;
                }
            });
        }
        return currentCommand;
    }

    checkInventoryMaterials = (material, currentCommand) => {
        if (material.quantity * currentCommand.quantity > material.inventory) {
            return 0
        }
        return 1
    }

    handleAddPurchasingRequest = async (currentCommand) => {
        await this.props.getAllGoodsByType({ type: "material" })
        await this.setState((state) => ({
            ...state,
            commandPurchase: currentCommand
        }));
        window.$(`#modal-create-purchasing-request`).modal('show');
    }

    checkApprovers = (commandDetail) => {
        const { approvers } = commandDetail;
        const userId = localStorage.getItem("userId");
        if (approvers) {
            let approverIds = approvers.map(x => x.approver._id);
            if (approverIds.includes(userId)) {
                return true;
            }
            return false
        }
    }

    render() {
        const { translate, manufacturingCommand, idModal, bills } = this.props;
        let currentCommand = {};
        if (manufacturingCommand.currentCommand && manufacturingCommand.isLoading === false) {
            // currentCommand = manufacturingCommand.currentCommand;
            currentCommand = this.getCurrentCommandIncludeMaterialInventory();
        }
        let listBillByCommand = [];
        if (bills.listBillByCommand && bills.isLoading === false) {
            listBillByCommand = bills.listBillByCommand;
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-info-manufacturing-command-${idModal}`} isLoading={manufacturingCommand.isLoading}
                    title={translate('manufacturing.command.command_detail')}
                    formID={`form-detail-manufacturing-command`}
                    size={idModal === 3 ? 100 : 75}
                    maxWidth={600}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    {
                        this.state.commandPurchase &&
                        <PurchasingRequestCreateForm bigModal={true} currentCommand={this.state.commandPurchase} NotHaveCreateButton={true} />
                    }
                    <ManufacturingLotDetailForm lotDetail={this.state.lotDetail} />
                    <form id={`form-detail-manufacturing-command`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.code')}:&emsp;</strong>
                                    {currentCommand.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.plan_code')}:&emsp;</strong>
                                    {currentCommand.manufacturingPlan && currentCommand.manufacturingPlan.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.sales_order_code')}:&emsp;</strong>
                                    {
                                        currentCommand.manufacturingPlan && currentCommand.manufacturingPlan.salesOrders &&
                                            currentCommand.manufacturingPlan.salesOrders.length
                                            ?
                                            currentCommand.manufacturingPlan.salesOrders.map((x, index) => {
                                                if (index === (currentCommand.manufacturingPlan.salesOrders.length - 1))
                                                    return (
                                                        x.code
                                                    )
                                                return (
                                                    x.code + ", "
                                                )
                                            })
                                            :
                                            ""

                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.lot_code')}:&emsp;</strong>
                                    {
                                        currentCommand.lot && currentCommand.lot[0] && <a href="#" onClick={() => this.showDetailManufacturingLot(currentCommand.lot[0])}>{currentCommand.lot[0].code}</a>
                                    }
                                    {
                                        currentCommand.lot && currentCommand.lot[1] && <a href="#" onClick={() => this.showDetailManufacturingLot(currentCommand.lot[1])}>{", " + currentCommand.lot[1].code}</a>
                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.creator')}:&emsp;</strong>
                                    {currentCommand.creator && currentCommand.creator.name + " - " + currentCommand.creator.email}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.created_at')}:&emsp;</strong>
                                    {formatDate(currentCommand.createdAt)}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.mill')}:&emsp;</strong>
                                    {currentCommand.manufacturingMill && currentCommand.manufacturingMill.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.start_date')}:&emsp;</strong>
                                    {formatDate(currentCommand.startDate)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.end_date')}:&emsp;</strong>
                                    {formatDate(currentCommand.endDate)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.start_turn')}:&emsp;</strong>
                                    {currentCommand.startTurn}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.end_turn')}:&emsp;</strong>
                                    {currentCommand.endTurn}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.status')}:&emsp;</strong>
                                    {
                                        currentCommand.status &&
                                        <span style={{ color: translate(`manufacturing.command.${currentCommand.status}.color`) }}>
                                            {translate(`manufacturing.command.${currentCommand.status}.content`)}
                                        </span>
                                    }
                                </div>

                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.description')}:&emsp;</strong>
                                    {currentCommand.description}
                                </div>
                            </div>
                        </div>
                        {
                            currentCommand.good &&
                            < div className="row">
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
                                                        <td>{currentCommand.good.code}</td>
                                                        <td>{currentCommand.good.name}</td>
                                                        <td>{currentCommand.good.baseUnit}</td>
                                                        <td>{currentCommand.quantity}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        }
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
                                                    <th>{translate('manufacturing.command.inventory')}</th>
                                                    <th>{translate('manufacturing.command.status')}</th>
                                                    {this.checkApprovers(currentCommand) && (currentCommand.status === 1) &&
                                                        <th style={{ textAlign: "left" }}>{translate('general.action')}</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentCommand && currentCommand.good && currentCommand.good.materials && currentCommand.good.materials.length
                                                    &&
                                                    currentCommand.good.materials.map((x, index) => (
                                                        <tr key={index}>
                                                            <td> {index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity * currentCommand.quantity}</td>
                                                            <td>{x.inventory}</td>
                                                            <td style={{ color: translate(`manufacturing.command.materials_info.${this.checkInventoryMaterials(x, currentCommand)}.color`) }}>
                                                                {translate(`manufacturing.command.materials_info.${this.checkInventoryMaterials(x, currentCommand)}.content`)}
                                                            </td>
                                                            {
                                                                this.checkApprovers(currentCommand) && (currentCommand.status === 1) &&
                                                                <td>
                                                                    <a style={{ width: '5px' }} title={translate('manufacturing.command.create_purchasing_request')} onClick={() => { this.handleAddPurchasingRequest(currentCommand) }}><i className="material-icons">add_shopping_cart</i></a>
                                                                </td>
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="pull-right" style={{ marginBottom: "10px" }}>
                                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleClearCommand}>{translate('manufacturing.command.approver_command')}</button>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.command.material_bill')}</legend>
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
                                                    listBillByCommand && listBillByCommand.length === 0 ? <tr><td colSpan={6}>{translate('general.no_data')}</td></tr>
                                                        :
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
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.command.result')}</legend>
                                    {
                                        (currentCommand.finishedProductQuantity
                                            && currentCommand.finishedTime)
                                            ?
                                            <React.Fragment>
                                                <p>
                                                    {translate('manufacturing.command.finishedProductQuantity')}: &emsp;
                                                    {currentCommand.finishedProductQuantity + " (" + currentCommand.good.baseUnit + ")"}
                                                    &emsp;&emsp;&emsp;
                                                    {translate('manufacturing.command.rateFinishedProductQuantity')}: &emsp;
                                                    {Math.round(currentCommand.finishedProductQuantity * 100 / (currentCommand.finishedProductQuantity + (currentCommand.substandardProductQuantity ? currentCommand.substandardProductQuantity : 0)) * 100) / 100}%
                                                </p>
                                                <p>
                                                    {translate('manufacturing.command.substandardProductQuantity')}: &emsp;
                                                    {currentCommand.substandardProductQuantity ? currentCommand.substandardProductQuantity + " (" + currentCommand.good.baseUnit + ")" : 0 + " (" + currentCommand.good.baseUnit + ")"}
                                                    &emsp;&emsp;&emsp;
                                                    {translate('manufacturing.command.rateSubstandardProductQuantity')}: &emsp;
                                                    {Math.round((currentCommand.substandardProductQuantity ? currentCommand.substandardProductQuantity : 0) * 100 / (currentCommand.finishedProductQuantity + (currentCommand.substandardProductQuantity ? currentCommand.substandardProductQuantity : 0)) * 100) / 100}%

                                                </p>
                                                <p>
                                                    {translate('manufacturing.command.finishedTime')}: &emsp;
                                                    {formatFullDate(currentCommand.finishedTime)}
                                                </p>
                                            </React.Fragment>
                                            :
                                            translate("manufacturing.command.no_data")
                                    }
                                </fieldset>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.command.responsibles')}</legend>
                                    {
                                        currentCommand.responsibles && currentCommand.responsibles.length &&
                                        currentCommand.responsibles.map((x, index) => {
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
                                        currentCommand.accountables && currentCommand.accountables.length &&
                                        currentCommand.accountables.map((x, index) => {
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
                                            {currentCommand.qualityControlStaffs && currentCommand.qualityControlStaffs.length &&
                                                currentCommand.qualityControlStaffs.map((qualityControlStaff, index) => (
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
                                    <legend className="scheduler-border">{translate('manufacturing.command.approvers')}</legend>
                                    {
                                        currentCommand.approvers && currentCommand.approvers.length &&
                                        currentCommand.approvers.map((x, index) => {
                                            return (
                                                <div className="form-group" key={index}>
                                                    <p>
                                                        {x.approver.name}
                                                        {" - "}
                                                        {x.approver.email}
                                                        {
                                                            x.approvedTime &&
                                                            <React.Fragment>
                                                                &emsp; &emsp; &emsp;
                                                                {translate('manufacturing.command.approvedTime')}
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
                        </div>
                        {/* <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.command.comment')}</legend>
                                    <div className={`form-group`}>
                                        Bình luận
                                    </div>
                                </fieldset>
                            </div>
                        </div> */}
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingCommand, bills, lots } = state;
    return { manufacturingCommand, bills, lots }
}

const mapDispatchToProps = {
    getDetailManufacturingCommand: commandActions.getDetailManufacturingCommand,
    getBillsByCommand: BillActions.getBillsByCommand,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
    getAllGoodsByType: GoodActions.getAllGoodsByType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandDetailInfo));