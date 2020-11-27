import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';

class ManufacturingLotDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.lotDetail !== nextProps.lotDetail) {
            this.props.getDetailManufacturingLot(nextProps.lotDetail._id);
            return false;
        }
        return true;
    }

    render() {
        const { translate, lots } = this.props;
        let currentLot = {};
        if (lots.currentLot && lots.isLoading === false) {
            currentLot = lots.currentLot
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
                                    { }
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
                                        <span style={{ color: translate(`manufacturing.command.${currentLot.status}.color`) }}>
                                            {translate(`manufacturing.command.${currentLot.status}.content`)}
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
                                                    <th>{translate('manufacturing.command.good_base_unit_quantity')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{currentLot.good && currentLot.good.code}</td>
                                                    <td>{currentLot.good && currentLot.good.name}</td>
                                                    <td>{currentLot.good && currentLot.good.baseUnit}</td>
                                                    <td>{currentLot.quantity}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.lot.material')}</legend>
                                    <div className={`form-group`}>
                                        Thông tin về nguyên vật liệu được nhập từ đâu
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
                                        Cho biết lô được nhập vào những kho nào,  những lô hàng, thậm trí là xuất đi đơn hàng nào
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { lots } = state;
    return { lots }
}

const mapDispatchToProps = {
    getDetailManufacturingLot: LotActions.getDetailManufacturingLot
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingLotDetailForm));

