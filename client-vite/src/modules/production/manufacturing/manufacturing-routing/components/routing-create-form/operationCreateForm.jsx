import React, { useEffect, useState } from "react"
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SelectBox, DialogModal, ButtonModal, ConfirmNotification, ErrorLabel } from "../../../../../../common-components";
import { AssetManagerActions } from "../../../../../asset/admin/asset-information/redux/actions";
import { worksActions } from "../../../manufacturing-works/redux/actions";

const EMPTY_OPERATION = {
    name: "",
    mill: "1",
    setupTime: "",
    hourProduction: "",
    cost: "",
    description: "",
    machines: [],
    workers: []
}

const EMPTY_MACHINE = {
    id: "1",
    name: "",
    cost: "",
    quantity: ""
}

const EMPTY_WORKER = {
    id: "1",
    name: "",
    expYear: "",
    quantity: ""
}

const OperationCreatForm = (props) => {
    const {
        translate,
        works,
        organizationalUnit,
        updateOperations,
        validateField,
        errorMsg,
        manufacturingWorks,
        assetsManager
    } = props

    const [operation, setOperation] = useState(EMPTY_OPERATION)
    const [machine, setMachine] = useState(EMPTY_MACHINE)
    const [worker, setWorker] = useState(EMPTY_WORKER)
    
    /* Init data for select box */
    const getMillArr = () => {
        const selectedWorks = manufacturingWorks.listWorks.find(work => work._id === works)
        let millArr = [
            { value: "1", text: `---${translate('manufacturing.routing.choose_mill')}---` }
        ]
        selectedWorks?.manufacturingMills.forEach(mill => {
            millArr.push({ value: mill._id, text: mill.name })
        })

        return millArr
    }

    const getAssetArr = () => {
        let assetArr = [
            { value: "1", text: `---${translate('manufacturing.routing.choose_machine')}---` }
        ]
        assetsManager?.listAssets.forEach((asset) => {
            assetArr.push({ value: asset._id, text: asset.assetName })
        })

        return assetArr
    }

    const getWorkerRoleArr = () => {
        const { employeeRoles } = manufacturingWorks
        let workerRoleArr = [
            { value: "1", text: `---${translate('manufacturing.routing.choose_worker_role')}---` }
        ]
        employeeRoles?.forEach((role) => {
            workerRoleArr.push({ value: role._id, text: role.name })
        })

        return workerRoleArr
    }

    /* Handle input change */
    const handleUpdateOperationField = (field) => {
        validateField(field)
        setOperation({ ...operation, ...field })
    }

    const handleUpdateMachineField = (field) => {
        setMachine({ ...machine, ...field })
    }

    const handleUpdateWorkerField = (field) => {
        setWorker({ ...worker, ...field })
    }

    /* Validate input */
    const isValidatedMachine = () => {
        if (operation.machines.length >= 1){
            return false
        }
        return machine.id && machine.cost && machine.quantity && worker.id && worker.expYear
    }

    /* Handle add and submit */
    const handleAddMachine = () => {
        const newMachine = {
            ...machine,
            name: getMachineNameById(machine.id)
        }
        setOperation(prev => ({ ...prev, machines: [...prev.machines, newMachine] }))
        handleAddWorker(newMachine.quantity) // Add worker operating this machine
        setMachine(EMPTY_MACHINE)
    }

    const handleAddWorker = (quantity) => {
        const newWorker = {
            ...worker,
            name: getWorkerRoleNameById(worker.id),
            quantity
        }
        setOperation(prev => ({ ...prev, workers: [...prev.workers, newWorker] }))
        setWorker(EMPTY_WORKER)
    }

    const handleSave = () => {
        updateOperations(operation)
        setOperation(EMPTY_OPERATION)
        setMachine(EMPTY_MACHINE)
        setWorker(EMPTY_WORKER)
    }

    /* Helper */
    const getMachineNameById = (id) => {
        const machine = assetsManager.listAssets.find(asset => asset._id === id)
        return machine ? machine.assetName : ""
    }

    const getWorkerRoleNameById = (id) => {
        const { employeeRoles } = manufacturingWorks
        const workerRole = employeeRoles.find(role => role._id == id)
        return workerRole ? workerRole.name : ""
    }

    useEffect(() => {
        const getData = async () => {
            await props.getAllManufacturingWorks();
            await props.getAllAsset({ handoverUnit: organizationalUnit });
            await props.getAllManufacturingEmployeeRoles(works)
        }
        getData();
    }, [])

    return (

        <>
            <ButtonModal
                modalID="modal-create-new-operation"
                button_name={translate("manufacturing.routing.add_operation")}
                title={translate("manufacturing.routing.add_operation")}
            />
            <DialogModal
                modalID="modal-create-new-operation"
                isLoading={false}
                formID="form-create-new-operation"
                title={translate("manufacturing.routing.add_operation")}
                msg_success=""
                msg_failure=""
                func={handleSave}
                size={100}
                maxWidth={800}
            >
                <div className='row'>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <fieldset className='scheduler-border'>
                            <legend className='scheduler-border'>{translate('manufacturing.routing.operation_general_info')}</legend>
                            <div className="row">
                                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                                    <div className={`form-group ${!errorMsg.operation.name ? '' : 'has-error'}`}>
                                        <label>{translate('manufacturing.routing.operation_name')} <span className="text-red">*</span></label>
                                        <input type='text' className='form-control' value={operation.name} onChange={(e) => handleUpdateOperationField({name: e.target.value})} />
                                        <ErrorLabel content={errorMsg.operation.name} />
                                    </div>
                                    <div className={`form-group ${!errorMsg.operation.setupTime ? '' : 'has-error'}`}>
                                        <label>{translate('manufacturing.routing.setup_time')}</label>
                                        <input type='number' className='form-control' value={operation.setupTime} onChange={(e) => handleUpdateOperationField({setupTime: e.target.value})} />
                                        <ErrorLabel content={errorMsg.operation.setupTime} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('manufacturing.routing.cost')}</label>
                                        <input type='number' className='form-control' disabled />
                                    </div>

                                </div>
                                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                                    <div className="form-group">
                                        <label>{translate('manufacturing.routing.mill')} <span className="text-red">*</span></label>
                                        <SelectBox
                                            id="select-mill"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={operation.mill}
                                            onChange={(value) => handleUpdateOperationField({ mill: value[0] })}
                                            items={getMillArr()}
                                        />
                                    </div>
                                    <div className={`form-group ${!errorMsg.operation.hourProduction ? '' : 'has-error'}`}>
                                        <label>{translate('manufacturing.routing.hour_production')}</label>
                                        <input type='number' className='form-control' value={operation.hourProduction} onChange={(e) => handleUpdateOperationField({hourProduction: e.target.value})} />
                                        <ErrorLabel content={errorMsg.operation.hourProduction} />
                                    </div>
                                    <div className="form-group">
                                        <label>{translate('manufacturing.routing.description')}</label>
                                        <textarea type='text' className='form-control' value={operation.description} onChange={(e) => handleUpdateOperationField({description: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <fieldset className='scheduler-border'>
                            <legend className='scheduler-border'>{translate('manufacturing.routing.machine_info')}</legend>
                            <div className="form-group">
                                <label>{translate('manufacturing.routing.machine_name')} <span className="text-red">*</span></label>
                                <SelectBox
                                    id="select-machine"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={machine.id}
                                    onChange={(value) => handleUpdateMachineField({ id: value[0] })}
                                    items={getAssetArr()}
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.routing.operating_cost')} <span className="text-red">*</span></label>
                                <input type='number' className='form-control' value={machine.cost} onChange={(e) => handleUpdateMachineField({ cost: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.routing.number')} <span className="text-red">*</span></label>
                                <input type='number' className='form-control' value={machine.quantity} onChange={(e) => handleUpdateMachineField({ quantity: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.routing.worker_role')} <span className="text-red">*</span> </label>
                                <SelectBox
                                    id="select-worker-role"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={worker.id}
                                    onChange={(value) => handleUpdateWorkerField({ id: value[0] })}
                                    items={getWorkerRoleArr()}
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('manufacturing.routing.exp_years')} <span className="text-red">*</span></label>
                                <input type='number' className='form-control' value={worker.expYear} onChange={(e) => handleUpdateWorkerField({ expYear: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <button className='btn btn-success pull-right' onClick={handleAddMachine} disabled={!isValidatedMachine()}>
                                    {translate('manufacturing.routing.add')}
                                </button>
                            </div>
                        </fieldset>

                    </div>
                    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                        <table className='table table-striped'>
                            <thead>
                                <tr>
                                    <th>{translate('manufacturing.routing.index')}</th>
                                    <th>{translate('manufacturing.routing.resource_type')}</th>
                                    <th>{translate('manufacturing.routing.number')}</th>
                                    <th>{translate('manufacturing.routing.resource_detail_info')}</th>
                                    <th>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {operation.machines.map((machine, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{translate('manufacturing.routing.machine')}</td>
                                        <td>{machine.quantity}</td>
                                        <td>
                                            <ul>
                                                <li>{getMachineNameById(machine.id)}</li>
                                                <li>{`${translate('manufacturing.routing.operating_cost')}: ${machine.cost}`}</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <a
                                                className='edit text-yellow'
                                                style={{ width: '5px' }}
                                                title={translate('manufacturing.routing.edit_resource')}
                                            >
                                                <i className='material-icons'>edit</i>
                                            </a>
                                            <ConfirmNotification
                                                icon='question'
                                                title={translate('manufacturing.routing.delete_resource')}
                                                name='delete'
                                                className='text-red'
                                                content={`<h4>${translate('manufacturing.routing.delete_resource')} ${"Ép khuôn thân xe"}</h4>`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {operation.workers.map((worker, index) => (
                                    <tr key={index}>
                                        <td>{operation.machines.length + index + 1}</td>
                                        <td>{translate('manufacturing.routing.worker')}</td>
                                        <td>{worker.quantity}</td>
                                        <td>
                                            <ul>
                                                <li>{getWorkerRoleNameById(worker.id)}</li>
                                                <li>{`${translate('manufacturing.routing.exp_years')}: ${worker.expYear}`}</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <a
                                                className='edit text-yellow'
                                                style={{ width: '5px' }}
                                                title={translate('manufacturing.routing.edit_resource')}
                                            >
                                                <i className='material-icons'>edit</i>
                                            </a>
                                            <ConfirmNotification
                                                icon='question'
                                                title={translate('manufacturing.routing.delete_resource')}
                                                name='delete'
                                                className='text-red'
                                                content={`<h4>${translate('manufacturing.routing.delete_resource')} ${"Ép khuôn thân xe"}</h4>`}
                                            />
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </DialogModal>
        </>
    )
}

const mapStateToProps = (state) => {
    const { manufacturingWorks, assetsManager } = state
    return { manufacturingWorks, assetsManager }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    getAllManufacturingEmployeeRoles: worksActions.getAllManufacturingEmployeeRoles,
    getAllAsset: AssetManagerActions.getAllAsset,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OperationCreatForm));
