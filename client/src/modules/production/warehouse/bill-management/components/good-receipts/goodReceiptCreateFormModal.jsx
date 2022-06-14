import React from "react";
import { DialogModal } from "../../../../../../common-components";
import "./goodReceipt.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import BaseInformationComponent from './baseInformationComponent';
import StockWorkAssignment from "./stockWorkAssignment";
import { generateCode } from "../../../../../../helpers/generateCode";
import { BillActions } from "../../redux/actions";

function GoodReceiptCreateFormModal(props) {

    const [state, setState] = React.useState({
        fromStock: "",
        group: "1",
        status: "1",
        sourceType: "",
        listGood: "",
        manufacturingWork: "",
        supplier: "",
        code: generateCode("BIRE"),
        description: "",
        step: 0,
        isHaveDataStep1: 0,
        peopleInCharge: [],
        accountables: [],
        accountants: [],
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        workAssignment: [],
        isHaveDataStep2: 0,
        name: "",
        email: "",
        address: "",
        phone: "",
        dataStockWorkAssignment: [],
        steps: [
            {
                label: "Tạo phiếu",
                active: true,
                disabled: false,
            },
            {
                label: "Phân công công việc",
                active: false,
                disabled: true,
            }
        ],
    })


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

    const handleBaseInformationChange = (data) => {
        setState({
            ...state,
            fromStock: data.fromStock,
            sourceType: data.sourceType,
            listGood: data.listGood,
            manufacturingWork: data.manufacturingWork,
            supplier: data.supplier,
            code: data.code,
            description: data.description,
            isHaveDataStep1: state.isHaveDataStep1 + 1,
        });
    }

    const handleStockWorkAssignmentChange = (data, stockWorkAssignmentState) => {
        let peopleInCharge = data[0].workAssignmentStaffs;
        let accountables = data[1].workAssignmentStaffs;
        let accountants = data[2].workAssignmentStaffs;
        let startTime = data[0].startTime;
        let endTime = data[0].endTime;
        let startDate = data[0].startDate;
        let endDate = data[0].endDate;
        let dataStockWorkAssignment = data.concat(stockWorkAssignmentState.workAssignment);
        setState({
            ...state,
            peopleInCharge: peopleInCharge,
            accountables: accountables,
            accountants: accountants,
            startTime: startTime,
            endTime: endTime,
            startDate: startDate,
            endDate: endDate,
            workAssignment: stockWorkAssignmentState.workAssignment,
            isHaveDataStep2: state.isHaveDataStep2 + 1,
            dataStockWorkAssignment: dataStockWorkAssignment,
        });
    }

    const handleTranferInformationChange = (name, data) => {
        setState({
            ...state,
            [name]: data,
        })
    }

    const isValidateStep = (index) => {
        if (index == 1) {
            return isHaveDataStep1 > 0;
        }
    };

    const isFormValidated = () => {
        return isHaveDataStep1 > 0 && isHaveDataStep2 > 0;
    }

    if (props.createType === 3 && props.requestId && (props.requestId !== state.requestId)) {
        console.log("props.createType", props.requestId, props.request);
        setState({
            ...state,
            listGood: props.request.goods,
            fromStock: props.request.stock._id,
            manufacturingWork: props.request.manufacturingWork ? props.request.manufacturingWork._id : "",
            supplier: props.request.supplier ? props.request.supplier._id : "",
            sourceType:props.request.supplier ? "2" : "1",
            requestId: props.requestId,
            isHaveDataStep1: state.isHaveDataStep1 + 1,
        })
    }
            

    const save = async () => {
        if (isFormValidated()) {
            const data = {
                fromStock: state.fromStock,
                group: state.group,
                status: state.status,
                sourceType: state.sourceType,
                goods: state.listGood,
                manufacturingWork: state.manufacturingWork,
                supplier: state.supplier,
                code: state.code,
                description: state.description,
                dataStockWorkAssignment: state.dataStockWorkAssignment,
                name: state.name,
                email: state.email,
                address: state.address,
                phone: state.phone,
            }
            console.log(data);
            await props.createBill(data);
        }
    }

    const { step, steps, fromStock, code, sourceType, listGood, manufacturingWork, supplier, description, isHaveDataStep1, isHaveDataStep2,
        peopleInCharge, accountables, accountants, startTime, endTime, startDate, endDate, workAssignment, name, email, address, phone } = state;
    const { translate, createType } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-new-receipt-bill"
                isLoading={false}
                formID="modal-create-new-receipt-bill"
                title={"Tạo mới phiếu nhập kho"}
                msg_success={"Tạo mới phiếu nhập kho thành công"}
                msg_failure={"Tạo mới phiếu nhập kho thất bại"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <form id="modal-create-new-receipt-bill">
                    <div className="timeline">
                        <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                        <div className="timeline-items">
                            {steps.map((item, index) => (
                                <div className={`timeline-item ${item.active ? "active" : ""}`} key={index}>
                                    <div
                                        className={`timeline-contain ${!isValidateStep(index) && index > 0 ? "disable-timeline-contain" : ""
                                            }`}
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
                            <BaseInformationComponent
                                isHaveDataStep1={isHaveDataStep1}
                                code={code}
                                fromStock={fromStock}
                                sourceType={sourceType}
                                listGood={listGood}
                                manufacturingWork={manufacturingWork}
                                supplier={supplier}
                                description={description}
                                onDataChange={handleBaseInformationChange}
                                createType={createType}

                            />
                        }
                        {step === 1 &&
                            <StockWorkAssignment
                                isHaveDataStep2={isHaveDataStep2}
                                peopleInCharge={peopleInCharge}
                                accountables={accountables}
                                accountants={accountants}
                                startTime={startTime}
                                endTime={endTime}
                                startDate={startDate}
                                endDate={endDate}
                                workAssignment={workAssignment}
                                name={name}
                                email={email}
                                address={address}
                                phone={phone}
                                code={code}
                                onDataChange={handleStockWorkAssignmentChange} 
                                onTranferInformationChange={handleTranferInformationChange}
                                />
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
    createBill: BillActions.createBill,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReceiptCreateFormModal));
