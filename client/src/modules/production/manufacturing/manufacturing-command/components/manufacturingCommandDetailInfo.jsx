import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate';
import { commandActions } from '../redux/actions';
class ManufacturingCommandDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.commandDetail !== nextProps.commandDetail) {
            this.props.getDetailManufacturingCommand(nextProps.commandDetail._id);
            return false
        }
        return true;
    }

    render() {
        const { translate, manufacturingCommand } = this.props;
        let currentCommand = {};
        if (manufacturingCommand.currentCommand && manufacturingCommand.isLoading === false) {
            currentCommand = manufacturingCommand.currentCommand;
        }
        console.log(currentCommand);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-info-manufacturing-command`} isLoading={manufacturingCommand.isLoading}
                    title={translate('manufacturing.command.command_detail')}
                    formID={`form-detail-manufacturing-command`}
                    size={75}
                    maxWidth={600}
                    hasSaveButton={false}
                    hasNote={false}
                >
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
                                    <strong>{translate('manufacturing.command.manufacturing_order_code')}:&emsp;</strong>
                                    {
                                        currentCommand.manufacturingPlan && currentCommand.manufacturingPlan.manufacturingOrder
                                        && currentCommand.manufacturingPlan.manufacturingOrder.code

                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.sales_order_code')}:&emsp;</strong>
                                    {
                                        currentCommand.manufacturingPlan && currentCommand.manufacturingPlan.salesOrder
                                        && currentCommand.manufacturingPlan.salesOrder.code

                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.lot_code')}:&emsp;</strong>
                                    {
                                        currentCommand.lot && currentCommand.lot.code
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
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.description')}:&emsp;</strong>
                                    {currentCommand.description}
                                </div>
                            </div>
                        </div>
                        {
                            currentCommand.good && currentCommand.good.good &&
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
                                                        <th>{translate('manufacturing.command.packing_rule')}</th>
                                                        <th>{translate('manufacturing.command.packing_rule_quantity')}</th>
                                                        <th>{translate('manufacturing.command.good_base_unit')}</th>
                                                        <th>{translate('manufacturing.command.good_base_unit_quantity')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{currentCommand.good.good.code}</td>
                                                        <td>{currentCommand.good.good.name}</td>
                                                        <td>{currentCommand.good.packingRule}</td>
                                                        <td>{currentCommand.good.quantity}</td>
                                                        <td>{currentCommand.good.good.baseUnit}</td>
                                                        <td>{Number(currentCommand.good.quantity) * Number(currentCommand.good.conversionRate)}</td>
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
                                    <legend className="scheduler-border">{translate('manufacturing.command.approvers')}</legend>
                                    {
                                        currentCommand.manufacturingPlan && currentCommand.manufacturingPlan.approvers &&
                                        currentCommand.manufacturingPlan.approvers.map((x, index) => {
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
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingCommand } = state;
    return { manufacturingCommand }
}

const mapDispatchToProps = {
    getDetailManufacturingCommand: commandActions.getDetailManufacturingCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandDetailInfo));