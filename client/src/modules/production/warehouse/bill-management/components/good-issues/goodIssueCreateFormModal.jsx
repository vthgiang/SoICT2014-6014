import React from "react";
import { DialogModal } from "../../../../../../common-components";
import "../good-receipts/goodReceipt.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import BaseInformationComponent from './baseInformationComponent';
import SelectLotComponent from './selectLotComponent';
import { generateCode } from "../../../../../../helpers/generateCode";
import { BillActions } from "../../redux/actions";
import StockWorkAssignment from "../genaral/stockWorkAssignment";

function GoodIssueCreateFormModal(props) {

    const [state, setState] = React.useState({
        code: generateCode("BIIS"),
        fromStock: "",
        toStock: "",
        group: "2",
        status: "1",
        type: "",
        listGood: "",
        manufacturingWork: "",
        supplier: "",
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
                label: "Chọn lô hàng",
                active: false,
                disabled: true,
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
            toStock: data.toStock,
            type: data.type,
            listGood: data.listGood,
            manufacturingWork: data.manufacturingWork,
            requestValue: data.requestValue,
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

    const checkLots = (lots, quantity) => {
        if (lots.length === 0) {
            return false;
        } else {
            let totalQuantity = 0;
            for (let i = 0; i < lots.length; i++) {
                totalQuantity += Number(lots[i].quantity);
            }
            if (Number(quantity) !== Number(totalQuantity)) {
                return false;
            }
        }
        return true;
    }

    const isValidateStep = (index) => {
        let { listGood } = state;
        if (index == 1) {
            return isHaveDataStep1 > 0;
        } else if (index == 2) {
            let counter = 0;
            if (listGood && listGood.length > 0) {
                listGood.map(item => {
                    if (item.lots && item.lots.length > 0) {
                        counter = !checkLots(item.lots, item.quantity) ? counter + 1 : counter;
                    }
                })
            }
            return counter === 0;
        }
    };

    const isFormValidated = () => {
        return isHaveDataStep1 > 0 && isHaveDataStep2 > 0;
    }

    if ((props.createType === 3 || props.createType === 4)  && props.requestId && (props.requestId !== state.requestId)) {
        let type = '';
        if (props.request.requestType === 3 && props.request.type === 2) {
            type = props.request.supplier ? "2" : "1"
        } else if (props.request.requestType === 3 && props.request.type === 4) {
            type = "5"
        }
        setState({
            ...state,
            listGood: props.request.goods,
            fromStock: props.request.stock._id,
            toStock: props.request.toStock._id,
            manufacturingWork: props.request.manufacturingWork ? props.request.manufacturingWork._id : "",
            supplier: props.request.supplier ? props.request.supplier._id : "",
            type: type,
            requestId: props.requestId,
            isHaveDataStep1: state.isHaveDataStep1 + 1,
        })
    }


    const save = async () => {
        if (isFormValidated()) {
            const data = {
                fromStock: state.fromStock,
                toStock: state.toStock,
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
            }
            await props.createBill(data);
        }
    }

    const { step, steps, fromStock, toStock, code, type, listGood, manufacturingWork, supplier, description, isHaveDataStep1, isHaveDataStep2, requestValue,
        peopleInCharge, accountables, accountants, startTime, endTime, startDate, endDate, workAssignment, name, email, address, phone, group } = state;
    const { translate, createType } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-new-issue-bill"
                isLoading={false}
                formID="modal-create-new-issue-bill"
                title={"Tạo mới phiếu nhập kho"}
                msg_success={"Tạo mới phiếu xuất kho thành công"}
                msg_failure={"Tạo mới phiếu xuất kho thất bại"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <form id="modal-create-new-issue-bill">
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
                                toStock={toStock}
                                type={type}
                                listGood={listGood}
                                manufacturingWork={manufacturingWork}
                                supplier={supplier}
                                description={description}
                                createType={createType}
                                requestValue={requestValue}
                                onDataChange={handleBaseInformationChange}
                            />
                        }
                        {step === 1 &&
                            <SelectLotComponent
                                isHaveDataStep2={isHaveDataStep2}
                                listGood={listGood}
                                fromStock={fromStock}
                                toStock={toStock}
                                type={type}
                            />
                        }
                        {step === 2 &&
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodIssueCreateFormModal));
