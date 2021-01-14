import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal } from '../../../../../common-components';
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate';
import { PaymentActions } from '../../../order/payment/redux/actions';
import SalesOrderDetailForm from '../../../order/sales-order/components/salesOrderDetailForm';
import { BillActions } from '../../../warehouse/bill-management/redux/actions';
import ManufacturingLotDetailForm from '../../manufacturing-lot/components/manufacturingLotDetailForm';
import { commandActions, manufacturingPlanActions } from '../redux/actions';
class ManufacturingCommandDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.planDetail !== nextProps.planDetail) {
            this.props.getDetailManufacturingPlan(nextProps.planDetail._id);
            return false
        }
        return true;
    }

    showDetailSalesOrder = async (data) => {
        await this.props.getPaymentForOrder({ orderId: data._id, orderType: 1 });
        await this.setState((state) => {
            return {
                ...state,
                salesOrderDetail: data,
            };
        });
        await window.$("#modal-detail-sales-order").modal("show");
    }

    render() {
        const { translate, manufacturingPlan } = this.props;
        let currentPlan = {};
        if (manufacturingPlan.currentPlan && manufacturingPlan.isLoading === false) {
            currentPlan = manufacturingPlan.currentPlan;
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-info-manufacturing-plan`} isLoading={manufacturingPlan.isLoading}
                    title={translate('manufacturing.plan.plan_detail')}
                    formID={`form-detail-manufacturing-plan`}
                    size={75}
                    maxWidth={600}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    {this.state.salesOrderDetail && <SalesOrderDetailForm salesOrderDetail={this.state.salesOrderDetail} />}
                    <form id={`form-detail-manufacturing-plan`}>
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.code')}:&emsp;</strong>
                                    {currentPlan.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.sales_order_code')}:&emsp;</strong>
                                    {
                                        currentPlan && currentPlan.salesOrders &&
                                            currentPlan.salesOrders.length
                                            ?
                                            currentPlan.salesOrders.map((x, index) => {
                                                if (index === (currentPlan.salesOrders.length - 1))
                                                    return (
                                                        <a href="#" onClick={() => this.showDetailSalesOrder(x)}>{x.code}</a>
                                                    )
                                                return (
                                                    <a href="#" onClick={() => this.showDetailSalesOrder(x)}>{x.code}, </a>
                                                )
                                            })
                                            :
                                            ""
                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.works')}:&emsp;</strong>
                                    {currentPlan.manufacturingWorks &&
                                        currentPlan.manufacturingWorks.map((x, index) => {
                                            if (index === (currentPlan.manufacturingWorks.length - 1))
                                                return (
                                                    x.name
                                                )
                                            return (
                                                x.name + ", "
                                            )
                                        })
                                    }
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.command.creator')}:&emsp;</strong>
                                    {currentPlan.creator && currentPlan.creator.name + " - " + currentPlan.creator.email}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.created_at')}:&emsp;</strong>
                                    {formatDate(currentPlan.createdAt)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.start_date')}:&emsp;</strong>
                                    {formatDate(currentPlan.startDate)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.end_date')}:&emsp;</strong>
                                    {formatDate(currentPlan.endDate)}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.status')}:&emsp;</strong>
                                    {
                                        currentPlan.status &&
                                        <span style={{ color: translate(`manufacturing.plan.${currentPlan.status}.color`) }}>
                                            {translate(`manufacturing.plan.${currentPlan.status}.content`)}
                                        </span>
                                    }
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manufacturing.plan.description')}:&emsp;</strong>
                                    {currentPlan.description}
                                </div>
                            </div>
                        </div>
                        < div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.command.good_info')}</legend>
                                    <div className={`form-group`}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>{translate('manufacturing.command.index')}</th>
                                                    <th>{translate('manufacturing.command.good_code')}</th>
                                                    <th>{translate('manufacturing.command.good_name')}</th>
                                                    <th>{translate('manufacturing.command.good_base_unit')}</th>
                                                    <th>{translate('manufacturing.command.quantity')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentPlan.goods && currentPlan.goods.length &&
                                                    currentPlan.goods.map((x, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.good.code}</td>
                                                            <td>{x.good.name}</td>
                                                            <td>{x.good.baseUnit}</td>
                                                            <td>{x.quantity}</td>
                                                        </tr>
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
                                    <legend className="scheduler-border">{translate('manufacturing.command.approvers')}</legend>
                                    {
                                        currentPlan.approvers && currentPlan.approvers.length &&
                                        currentPlan.approvers.map((x, index) => {
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
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.plan.manufacturing_commands')}</legend>
                                  LSX HERE
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
    const { manufacturingPlan } = state;
    return { manufacturingPlan }
}

const mapDispatchToProps = {
    getDetailManufacturingPlan: manufacturingPlanActions.getDetailManufacturingPlan,
    getPaymentForOrder: PaymentActions.getPaymentForOrder
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandDetailInfo));