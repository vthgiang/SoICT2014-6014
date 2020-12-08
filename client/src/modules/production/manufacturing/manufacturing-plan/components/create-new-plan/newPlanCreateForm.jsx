import React, { Component } from 'react';
import { ButtonModal, DialogModal } from '../../../../../../common-components';
import CommandCreateForm from './commandCreateForm';
import PlanInfoForm from './generalPlanInfoForm';
import MaterialInfoForm from './materialInfoForm';
import MillScheduleBooking from './millScheduleBooking';
import WorkerBooking from './workerBooking';
import './planCreate.css';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { generateCode } from '../../../../../../helpers/generateCode';
import { salesOrderActions } from '../../../../order/sales-order/redux/actions';
import { manufacturingPlanActions } from '../../redux/actions';
import { GoodActions } from '../../../../common-production/good-management/redux/actions';

class NewPlanCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            steps: [{
                label: this.props.translate('manufacturing.plan.general_info'),
                active: true,
                disabled: false
            }, {
                label: this.props.translate('manufacturing.plan.command_info'),
                active: false,
                disabled: false
            }, {
                label: this.props.translate('manufacturing.plan.turn_info'),
                active: false,
                disabled: true
            }, {
                label: this.props.translate('manufacturing.plan.worker_info'),
                active: false,
                disabled: true
            }],

            code: '',
            salesOrders: [],
            startDate: '',
            endDate: '',
            description: '',
            goods: [],
        };
    }

    componentDidMount = () => {
        this.props.getAllSalesOrder();
        const currentRole = localStorage.getItem("currentRole");
        this.props.getAllApproversOfPlan(currentRole);
        this.props.getAllGoodsByType({ type: "product" })
    }

    setCurrentStep = async (e, step) => {
        e.preventDefault();
        let { steps } = this.state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        this.setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    }

    handleClickCreate = () => {
        this.setState({
            code: generateCode('KHSX')
        });
    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value
        })
    }

    handleEndDateChange = (value) => {
        this.setState({
            endDate: value
        })
    }

    handleDescriptionChange = (value) => {
        this.setState({
            description: value
        })
    }

    handleSalesOrderChange = (value) => {
        this.setState({
            salesOrders: value
        })
    }

    getListApproverIds = () => {
        const { manufacturingPlan } = this.props;
        let approvers = [];
        if (manufacturingPlan.listApprovers && manufacturingPlan.isLoading === false) {
            approvers = manufacturingPlan.listApprovers.map(x => x._id);
        }
        return approvers;
    }

    render() {
        const { step, steps } = this.state;
        const { translate } = this.props;
        const { code, salesOrders, startDate, endDate, description, goods } = this.state;
        return (
            <React.Fragment>
                <ButtonModal onButtonCallBack={this.handleClickCreate} modalID="modal-create-new-plan" button_name={translate('manufacturing.plan.create_plan')} title={translate('manufacturing.plan.create_plan_title')} />
                <DialogModal
                    modalID="modal-create-new-plan" isLoading={false}
                    formID="form-create-new-plan"
                    title={translate('manufacturing.plan.create_plan_title')}
                    msg_success={translate('manufacturing.plan.create_successfully')}
                    msg_faile={translate('manufacturing.plan.create_failed')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={100}
                    maxWidth={500}
                >
                    <form id="form-create-new-plan">
                        <div className="timeline">
                            <div className="timeline-progress" style={{ width: `${step * 100 / (steps.length - 1)}%` }}></div>
                            <div className="timeline-items">
                                {
                                    steps.map((item, index) => (
                                        <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index}>
                                            <div className={`timeline-contain ${item.disabled ? 'disable-timeline-contain' : ''}`} onClick={(e) => this.setCurrentStep(e, index)}>{item.label}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            {
                                step === 0 && <PlanInfoForm
                                    code={code}
                                    salesOrders={salesOrders}
                                    approvers={this.getListApproverIds()}
                                    startDate={startDate}
                                    endDate={endDate}
                                    description={description}
                                    goods={goods}
                                    onStartDateChange={this.handleStartDateChange}
                                    onEndDateChange={this.handleEndDateChange}
                                    onDescriptionChange={this.handleDescriptionChange}
                                    onSalesOrdersChange={this.handleSalesOrderChange}
                                />
                            }
                            {
                                step === 1 && <CommandCreateForm />
                            }
                            {
                                step === 2 && <MillScheduleBooking />
                            }
                            {
                                step === 3 && <WorkerBooking />
                            }
                        </div>
                        <div style={{ textAlign: "center" }}>
                            {`${step + 1} / ${steps.length}`}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { salesOrder, manufacturingPlan } = state;
    return { salesOrder, manufacturingPlan }
}

const mapDispatchToProps = {
    getAllSalesOrder: salesOrderActions.getAllSalesOrder,
    getAllApproversOfPlan: manufacturingPlanActions.getAllApproversOfPlan,
    getAllGoodsByType: GoodActions.getAllGoodsByType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(NewPlanCreateForm));
// export default NewPlanCreateForm;