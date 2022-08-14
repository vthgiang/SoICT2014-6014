import React from "react";
import { DialogModal } from "../../../../../../common-components";
import "../good-receipts/goodReceipt.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import QualityControlComponent from './qualityControlComponent';
import AddLotComponent from './addLotComponent';
import QueueGoodIntoTheWarehouseComponent from './queueGoodIntoTheWarehouseComponent';
import CompleteComponent from './completeComponent';
import { BillActions } from "../../redux/actions";

function GoodReceiptWorkFlowModal(props) {

    const [state, setState] = React.useState({
        statusQuality: 0,
        statusLot: 0,
        statusInventory: 0,
        statusAll: 0,
        step: 0,
        steps: [
            {
                label: "Kiểm định chất lượng",
                active: true,
                disabled: false,
            },
            {
                label: "Đánh lô hàng hóa",
                active: false,
                disabled: true,
            },
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
            statusQuality: props.billInfor.statusSteps[0],
            statusLot: props.billInfor.statusSteps[1],
            statusInventory: props.billInfor.statusSteps[2],
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

    const handleQualityControlDataChange = (data) => {
        setState({
            ...state,
            statusQuality: data,
        });
    }

    const handleAddLotDataChange = (data) => {
        setState({
            ...state,
            statusLot: data,
        });
    }

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
            let statusSteps = [state.statusQuality, state.statusLot, state.statusInventory];
            await props.editBill(billInfor._id, {
                statusAll: state.statusAll,
                goods: billInfor.goods,
                statusSteps: statusSteps,
                group: billInfor.group,
                fromStock: billInfor.fromStock,
                oldStatus: billInfor.status,
                code: billInfor.code,
            });
        }
    }

    const { step, steps, statusQuality, statusLot, statusInventory } = state;
    const { billInfor } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="good-receipt-work-flow-modal"
                isLoading={false}
                formID="good-receipt-work-flow-modal"
                title={"Tạo mới phiếu nhập kho"}
                msg_success={"Tạo mới phiếu nhập kho thành công"}
                msg_failure={"Tạo mới phiếu nhập kho thất bại"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id="good-receipt-work-flow-modal">
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
                        {step === 0 && billInfor &&
                            <QualityControlComponent
                                billId={billInfor._id}
                                billInfor={billInfor}
                                statusQuality={statusQuality}
                                onDataChange={handleQualityControlDataChange}
                            />
                        }
                        {step === 1 && billInfor &&
                            <AddLotComponent
                                billId={billInfor._id}
                                billInfor={billInfor}
                                statusLot={statusLot}
                                onDataChange={handleAddLotDataChange}
                            />
                        }
                        {step === 2 &&
                            <QueueGoodIntoTheWarehouseComponent
                                billId={billInfor._id}
                                billInfor={billInfor}
                                statusInventory={statusInventory}
                                onDataChange={handleQueueGoodIntoTheWarehouseDataChange}
                            />
                        }
                        {step === 3 &&
                            <CompleteComponent
                                statusQuality={statusQuality}
                                statusLot={statusLot}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReceiptWorkFlowModal));
