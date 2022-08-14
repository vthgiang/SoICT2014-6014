import React from "react";
import { DialogModal } from "../../../../../../common-components";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import BaseInformationComponent from './baseInformationComponent';
import StockWorkAssignment from "../genaral/stockWorkAssignment";
import { generateCode } from "../../../../../../helpers/generateCode";
import { BillActions } from "../../redux/actions";
import "../good-receipts/goodReceipt.css";

function GoodReturnCreateFormModal(props) {

    const [state, setState] = React.useState({
        fromStock: "",
        group: "3",
        status: "1",
        type: "",
        listGood: "",
        bill: '',
        manufacturingWork: "",
        supplier: "",
        code: generateCode("BIRT"),
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
        priority: 3,
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
            type: data.type,
            listGood: data.listGood,
            manufacturingWork: data.manufacturingWork,
            requestValue: data.requestValue,
            supplier: data.supplier,
            code: data.code,
            description: data.description,
            bill: data.bill ? data.bill : state.bill,
            isHaveDataStep1: state.isHaveDataStep1 + 1,
        });
    }

    const handleStockWorkAssignmentChange = (data, stockWorkAssignmentState, priority) => {
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
            priority: priority,
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
        setState({
            ...state,
            listGood: props.request.goods,
            fromStock: props.request.stock._id,
            manufacturingWork: props.request.manufacturingWork ? props.request.manufacturingWork._id : "",
            requestValue: props.requestValue ? props.requestValue : "",
            supplier: props.request.supplier ? props.request.supplier._id : "",
            type:props.request.supplier ? "2" : "1",
            requestId: props.requestId,
            isHaveDataStep1: state.isHaveDataStep1 + 1,
            bill: props.request.bill._id,
        })
    }
            

    const save = async () => {
        if (isFormValidated()) {
            const data = {
                bill: state.bill,
                fromStock: state.fromStock,
                group: state.group,
                status: state.status,
                type: state.type,
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
                priority: state.priority,
                request: state.requestId ? state.requestId : "",
            }
            await props.createBill(data);
        }
    }

    const { step, steps, fromStock, code, type, listGood, manufacturingWork, supplier, requestValue, description, isHaveDataStep1, isHaveDataStep2,
        peopleInCharge, accountables, accountants, startTime, endTime, startDate, endDate, workAssignment, name, email, address, phone, group, priority } = state;
        const { translate, createType } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-new-return-bill"
                isLoading={false}
                formID="modal-create-new-return-bill"
                title={"Tạo mới phiếu trả hàng"}
                msg_success={"Tạo mới phiếu trả hàng thành công"}
                msg_failure={"Tạo mới phiếu trả hàng thất bại"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id="modal-create-new-return-bill">
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
                                type={type}
                                listGood={listGood}
                                manufacturingWork={manufacturingWork}
                                supplier={supplier}
                                description={description}
                                onDataChange={handleBaseInformationChange}
                                createType={createType}
                                requestValue={requestValue}
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
                                group={group}
                                priority={priority}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodReturnCreateFormModal));
