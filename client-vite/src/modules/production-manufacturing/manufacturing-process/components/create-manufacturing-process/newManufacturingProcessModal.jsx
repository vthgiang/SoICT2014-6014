import React, { useState, useEffect } from "react";
import { ButtonModal, DialogModal } from "../../../../../common-components";
import "./planCreate.css";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { generateCode } from "../../../../../helpers/generateCode";
import { InfoProcessTab } from "./infoProcessTab";
import { AssetProcessUnitTab } from "./assetProcessUnitTab";
import { EditProcessUnitTab } from "./editProcessUnitTab";
import { ManufacturingProcessActions } from './../../redux/actions';

const NewManufacturingProcessModal = (props) => {

    const { translate } = props;

    //state dành cho tab thông tin chung
    const [processInfo, setProcessInfo] = useState({
        manufacturingProcessCode: generateCode('USX'),
        organizationalUnit: "",
        productionLineTemplate: "",
        processManufacturingName: "",
        manager: undefined,
        supporter: undefined,
        quantityOfDay: 0,
        startTime: "08:00 AM",
        endTime: "05:30 PM",
    })

    //state dành cho process diagram
    const [processDiagram, setProcessDiagram] = useState({
        processTemplate: undefined,
        xmlDiagram: undefined,
    })

    //state dành cho tab tài sản
    const [asset, setAsset] = useState({
        listAsset: []
    })

    const [state, setState] = useState({
        step: 0,
        steps: [
            {
                label: translate("manufacturing.plan.general_info"),
                active: true,
                disabled: false,
            },
            {
                label: translate("manufacturing.plan.command_info"),
                active: false,
                disabled: true,
            },
            {
                label: translate("manufacturing.plan.schedule_info"),
                active: false,
                disabled: true,
            }
        ],
    })

    const setCurrentStep = (e, step) => {
        let { steps } = state;
        steps.map((item, index) => {
            if (index <= step) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        setState((state) => {
            return {
                ...state,
                steps: steps,
                step: step,
            };
        });
    };

    const handleChangeGeneralInfo = (info) => {
        setProcessInfo({
            manufacturingProcessCode: generateCode('USX'),
            organizationalUnit: info.organizationalUnit ? info.organizationalUnit : processInfo.organizationalUnit,
            productionLineTemplate: info.productionLineTemplate ? info.productionLineTemplate : processInfo.productionLineTemplate,
            processManufacturingName: info.processManufacturingName ? info.processManufacturingName : processInfo.processManufacturingName,
            manager: info.manager ? info.manager : processInfo.manager,
            supporter: info.supporter ? info.supporter : processInfo.supporter,
            quantityOfDay: info.quantityOfDay !== 0 ? info.quantityOfDay : processInfo.quantityOfDay,
            startTime: info.startTime ? info.startTime : processInfo.startTime,
            endTime: info.endTime ? info.endTime : processInfo.endTime,
        })
    }

    const handleChangeProductionLineTemple = (xmlDiagram) => {
        setProcessDiagram({
            ...processDiagram,
            xmlDiagram: xmlDiagram
        })
    }

    const handleChangeProcessInfoDiagram = (info) => {
        setProcessDiagram({
            ...processDiagram,
        })
    }

    const save = () => {
        props.createManufacturingProcess({processInfo, processDiagram})
    }

    const isFormValidated = () => {

    }

    const isValidateStep = (index) => {
        if (index == 1) {
            // if (processInfo.organizationalUnit === ""
            //     || processInfo.processManufacturingName === ""
            //     || processInfo.productionLineTemplate === ""
            //     || !processInfo.startTime || !processInfo.endTime
            //     || processInfo.supporter === undefined
            //     || processInfo.manager === undefined) return false;
            return true
        }
        else if (index == 2) {
            if (processDiagram.processTemplate === undefined
                || processDiagram.xmlDiagram === undefined
            ) return false;
            return true;
        }
    };

    const { step, steps } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-new-manufacturing-process"
                isLoading={false}
                formID="form-create-new-manufacturing-process"
                title={translate("manufacturing.plan.create_plan_title")}
                // msg_success={translate("manufacturing.plan.create_successfully")}
                // msg_faile={translate("manufacturing.plan.create_failed")}
                func={save}
                disableSubmit={isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="form-create-new-plan">
                    <div className="timeline" style={{ width: "90%" }}>
                        <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                        <div className="timeline-items">
                            {steps.map((item, index) => (
                                <div className={`timeline-item ${item.active ? "active" : ""}`} key={index}>
                                    <div
                                        className={`timeline-contain ${!isValidateStep(index) && index > 0 ? "disable-timeline-contain" : ""}`}
                                        onClick={(e) => setCurrentStep(e, index)}
                                    >
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            {
                                step === 0 &&
                                <InfoProcessTab
                                    generalInfo={processInfo}
                                    onChangeGeneralInfo={handleChangeGeneralInfo}
                                    onChangeProductionLineTemplate={handleChangeProductionLineTemple}
                                />
                            }
                            {
                                step === 1 &&
                                <EditProcessUnitTab
                                    // processTemplate={processDiagram.processTemplate}
                                    xmlDiagramTemplate={processDiagram.xmlDiagram}
                                    onChangeProcessInfoDiagram={handleChangeProcessInfoDiagram}
                                />
                            }
                            {
                                step === 2 &&
                                <AssetProcessUnitTab></AssetProcessUnitTab>
                            }
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>{`${step + 1} / ${steps.length}`}</div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {

}

const mapDispatchToProps = {
    createManufacturingProcess: ManufacturingProcessActions.createManufacturingProcess
}

const connectNewManufacturingProcess = connect(mapStateToProps, mapDispatchToProps)(withTranslate(NewManufacturingProcessModal))
export { connectNewManufacturingProcess as NewManufacturingProcessModal }