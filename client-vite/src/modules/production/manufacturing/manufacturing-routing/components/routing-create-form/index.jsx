import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { ButtonModal, DialogModal } from "../../../../../../common-components";
import { generateCode } from "../../../../../../helpers/generateCode";
import { manufacturingRoutingActions } from "../../redux/actions";
import GeneralForm from "./generalForm";
import RoutingSheet from "./routingSheet";
import RoutingFlowBuilder from "../routing-flow-builder";
import "./routingCreate.css"

const EMPTY_ROUTING = {
    code: "",
    name: "",
    works: "",
    products: [],
    approver: "",
    organizationalUnit: "",
    creator: "",
    status: "",
    description: "",
    operations: [],
}

const RoutingCreateForm = (props) => {
    const { translate } = props;
    const initSteps = [
        {
            label: translate('manufacturing.routing.general_info'),
            active: true,
        },
        {
            label: translate('manufacturing.routing.sheet_info'),
            active: false,
        },
        {
            label: translate('manufacturing.routing.create_flow'),
            active: false,
        },
    ]
    const validateRules = {
        name: {
            required: true,
        },
        works: {
            required: true,
        },
        products: {
            required: true,
        },
        operation: {
            name: {
                required: true,
            },
            mill: {
                required: true,
            },
            setupTime: {
                min: 0.1
            },
            hourProduction: {
                required: true,
                min: 0
            },
        }
    }

    const [step, setStep] = useState(0)
    const [steps, setSteps] = useState(initSteps)
    const [operationCount, setOperationCount] = useState(1)
    const [routing, setRouting] = useState(EMPTY_ROUTING);
    const [isValidatedForm, setIsValidatedForm] = useState(false)
    const [errorMsg, setErrorMsg] = useState({
        name: "",
        works: "",
        products: "",
        creator: "",
        operation: {
            name: "",
            mill: "",
            setupTime: "",
            hourProduction: "",
        },
    });

    const checkHasComponent = (name) => {
        let { auth } = props;
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
    }

    const isValidateStep = (index) => {
        if (index === 1) {
            return routing.code && routing.name && routing.works && routing.products.length > 0
        }
        if (index === 2) {
            return routing.operations.length > 0
        }
    }

    const handleChangeStep = (step) => {
        let newSteps = steps.map((item, index) => {
            if (index <= step) {
                return { ...item, active: true }
            } else {
                return { ...item, active: false }
            }
        })
        setStep(step)
        setSteps(newSteps)
    }

    /* Handle input */
    const handleUpdateField = (field) => {
        validateField(field)
        setRouting(prev => ({ ...prev, ...field }));
    }

    const handleUpdateOperations = (operation) => {
        const newOperation = {
            ...operation,
            id: operationCount,
            prevOperation: "",
            nextOperation: ""
        }
        setOperationCount(operationCount + 1)
        setRouting({ ...routing, operations: [...routing.operations, newOperation] });
    }

    const handleConnectOperations = (sourceId, targetId) => {
        const newOperations = routing.operations.map(operation => {
            if (operation.id == sourceId) {
                operation.nextOperation = targetId
            }
            if (operation.id == targetId) {
                operation.prevOperation = sourceId
            }
            return operation
        })
        setRouting({ ...routing, operations: newOperations });
    }

    /* Validate input */
    const validateField = (field) => {
        const fieldName = Object.entries(field)[0][0]
        const fieldValue = Object.entries(field)[0][1]
        const rules = validateRules[fieldName]
        let result = false
        let msg = ""

        if (rules?.required && fieldValue.length === 0) {
            msg = translate(`manufacturing.routing.validate.${fieldName}.required`)
        } else {
            result = true
        }

        setIsValidatedForm(result)
        setErrorMsg({ ...errorMsg, [fieldName]: msg })
    }

    const validateOperationField = (field) => {
        const fieldName = Object.entries(field)[0][0]
        const fieldValue = Object.entries(field)[0][1]
        const rules = validateRules["operation"][fieldName]
        let result = false
        let msg = ""

        if (rules?.required && fieldValue.length === 0) {
            msg = translate(`manufacturing.routing.validate.operation.${fieldName}.required`)
        } else if (rules?.min && fieldValue < rules.min) {
            msg = translate(`manufacturing.routing.validate.operation.${fieldName}.min`)
        } else {
            result = true
        }

        setIsValidatedForm(result)
        setErrorMsg({ ...errorMsg, operation: {[fieldName]: msg }})
    }



    const handleSave = () => {
        const data = {
            code: routing.code,
            name: routing.name,
            manufacturingWorks: routing.works,
            goods: routing.products,
            creator: localStorage.getItem("userId"),
            description: routing.description,
            operations: routing.operations.map(operation => ({
                id: operation.id,
                name: operation.name,
                manufacturingMill: operation.mill,
                setupTime: operation.setupTime,
                hourProduction: operation.hourProduction,
                workers: operation.workers.map(worker => ({
                    workerRole: worker.id,
                    expYear: worker.expYear,
                    number: worker.quantity

                })),
                machines: operation.machines.map(machine => ({
                    machine: machine.id,
                    operatingCost: machine.cost,
                    number: machine.quantity
                })),
                prevOperation: operation.prevOperation,
                nextOperation: operation.nextOperation
            }))
        }
        props.createManufacturingRouting(data)
    }

    useEffect(() => {
        setRouting({ ...routing, code: generateCode("DTSX") });
    }, [])

    return (
        <>
            {checkHasComponent && (
                <ButtonModal
                    modalID="modal-create-new-routing"
                    button_name={translate("manufacturing.routing.create")}
                    title={translate("manufacturing.routing.create_title")}
                />

            )}
            <DialogModal
                modalID="modal-create-new-routing"
                isLoading={false}
                formID="form-create-new-routing"
                title={translate("manufacturing.routing.create_title")}
                msg_success={translate("manufacturing.routing.create_routing_successfully")}
                msg_failure={translate("manufacturing.routing.create_routing_failure")}
                size={100}
                disableSubmit={!isValidatedForm}
                func={handleSave}
                maxWidth={1000}
            >
                <>
                    <div className="timeline">
                        <div className="timeline-progress" style={{ width: `${(step * 100) / (steps.length - 1)}%` }}></div>
                        <div className="timeline-items">
                            {steps.map((item, index) => (
                                <div className={`timeline-item ${item.active ? "active" : ""}`} key={index}>
                                    <div
                                        className={`timeline-contain ${!isValidateStep(index) && index > 0 ? "disable-timeline-contain" : ""}`}
                                        onClick={() => handleChangeStep(index)}
                                    >
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {step === 0 && (<GeneralForm {...routing} updateField={handleUpdateField} validateField={validateField} errorMsg={errorMsg} />)}
                    {step === 1 && (<RoutingSheet {...routing} updateOperations={handleUpdateOperations} validateField={validateOperationField} errorMsg={errorMsg} />)}
                    {step === 2 && (<RoutingFlowBuilder {...routing} mode="create" connectOperation={handleConnectOperations} />)}
                </>
            </DialogModal>
        </>
    )
}

const mapStateToProps = (state) => {
    const { manufacturingRouting } = state
    return { manufacturingRouting }
}

const mapDispatchToProps = {
    createManufacturingRouting: manufacturingRoutingActions.createManufacturingRouting
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutingCreateForm));
