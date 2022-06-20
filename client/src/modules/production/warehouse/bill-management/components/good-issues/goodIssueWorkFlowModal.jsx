import React from "react";
import { DialogModal } from "../../../../../../common-components";
import "../good-receipts/goodReceipt.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import QueueGoodIntoTheWarehouseComponent from './queueGoodIntoTheWarehouseComponent';
import CompleteComponent from './completeComponent';
import { BillActions } from "../../redux/actions";

function GoodIssueWorkFlowModal(props) {

    const [state, setState] = React.useState({
        statusInventory: 0,
        statusAll: 0,
        step: 0,
        steps: [
            {
                label: "Xếp hàng vào kho",
                active: false,
                disabled: true,
            },
            {
                label: "Hoàn thành phiếu",
                active: false,
                disabled: true,
            }
        ],
    })

    if (props.billId !== state.billId) {
        setState({
            ...state,
            statusInventory: props.billInfor.statusSteps ? props.billInfor.statusSteps[0] : 1,
            billId: props.billId,
        })
    }


    const setCurrentStep = async (e, step) => {
        e.preventDefault();
        let { steps } = state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        setState({
            ...state,
            steps: steps,
            step: step,
        });
    };

    const handleQueueGoodIntoTheWarehouseDataChange = (data) => {
        setState({
            ...state,
            statusInventory: data,
        });
    }

    const handleCompleteDataChange = (data) => {
        setState({
            ...state,
            statusAll: data,
        });
    }

    const isFormValidated = () => {
        let { statusQuality, statusLot, statusInventory } = state;
        return statusQuality != 0 && statusLot != 0 && statusInventory != 0;
    }

    const save = async () => {
        if (isFormValidated()) {
            const { billInfor } = props;
            let statusSteps = [state.statusInventory];
            await props.editBill(billInfor._id, {
                statusAll: state.statusAll,
                goods: billInfor.goods,
                group: billInfor.group,
                fromStock: billInfor.fromStock,
                oldStatus: billInfor.status,
                code: billInfor.code,
                statusSteps: statusSteps,
            });
        }
    }

    const { step, steps, statusQuality, statusLot, statusInventory } = state;
    const { billInfor } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="good-issue-work-flow-modal"
                isLoading={false}
                formID="good-issue-work-flow-modal"
                title={"Thực hiện công việc xuất kho"}
                msg_success={"Lưu thành công"}
                msg_failure={"Lưu thất bại"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <form id="good-issue-work-flow-modal">
                    <div className="timeline">
                        <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                        <div className="timeline-items">
                            {steps.map((item, index) => (
                                <div className={`timeline-item ${item.active ? "active" : ""}`} key={index}>
                                    <div
                                        className={`timeline-contain`}
                                        onClick={(e) => setCurrentStep(e, index)}
                                    >
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        {step === 0 &&
                            <QueueGoodIntoTheWarehouseComponent
                                billId={billInfor._id}
                                billInfor={billInfor}
                                statusInventory={statusInventory}
                                onDataChange={handleQueueGoodIntoTheWarehouseDataChange}
                            />
                        }
                        {step === 1 &&
                            <CompleteComponent
                                statusInventory={statusInventory}
                                billId={billInfor._id}
                                billInfor={billInfor}
                                onDataChange={handleCompleteDataChange} />
                        }
                    </div>
                    <div style={{ textAlign: "center" }}>{`${step + 1} / ${steps.length}`}</div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editBill: BillActions.editBill,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueWorkFlowModal));
