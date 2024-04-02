import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { DialogModal, ErrorLabel, SelectBox } from "../../../../common-components";

import ValidationHelper from '../../../../helpers/validationHelper'

const AddAssetTaskForm = (props) => {
    const [state, setState] = useState({
        asset: {
            assetName: "",
            assetID: "",
            quantity: 0,
            unit: "",
            status: "",
        },
        taskAssetAssign: {
            name: "",
            timeSchedule: 0,
            listAssetTask: [],
        },
        errorValidate: {
            errorValidateAssetName: {
                status: true,
                message: undefined
            },
            errorValidateQuantity: {
                status: true,
                message: undefined
            },
            errorValidateUnitOfAsset: {
                status: true,
                messsage: undefined
            }
        }
    })

    const { translate, taskAsset, id, assetsManager } = props;
    const { taskAssetAssign, asset, errorValidate } = state

    useEffect(() => {

    }, [])

    useEffect(() => {
        let infoTaskAsset = taskAsset;
        // console.log("tassskkkkk: ", infoTaskAsset)
        if (infoTaskAsset) {
            setState({
                ...state,
                taskAssetAssign: {
                    ...infoTaskAsset,
                    name: infoTaskAsset.name ? infoTaskAsset.name : "",
                    timeSchedule: infoTaskAsset.timeSchedule ? infoTaskAsset.timeSchedule : 0,
                    listAssetTask: infoTaskAsset.listAssetTask ? infoTaskAsset.listAssetTask : []
                }
            })
        }
    }, [props.taskAsset])

    const handleChangeUnitsAsset = (value) => {
        //lay ten asset
        console.log("seleectttt: ", value)
        let itemFilter = assetsManager.listAssets.filter((item) => item.id == value)
        setState({
            ...state,
            asset: {
                ...state.asset,
                assetName: itemFilter[0]?.assetName,
                assetID: value
            },
        })
    }

    const handleEnterQuantityAsset = (event) => {
        let value = event.target.value;
        let errorQuantityValidate = ValidationHelper.validateNumberInputMin(translate, value, 0)
        setState({
            ...state,
            asset: {
                ...state.asset,
                quantity: value,
            },
            errorValidate: {
                ...state.errorValidate,
                errorValidateQuantity: errorQuantityValidate
            }
        })
    }

    const handleEnterUnitOfAsset = (event) => {
        let value = event.target.value;
        let errorUnitOfAssetValidate = ValidationHelper.validateEmpty(translate, value)
        setState({
            ...state,
            asset: {
                ...state.asset,
                unit: value,
            },
            errorValidate: {
                ...state.errorValidate,
                errorValidateUnitOfAsset: errorUnitOfAssetValidate
            }
        })
    }

    const handleDeleteAsset = async (index) => {
        if (taskAssetAssign) {
            taskAssetAssign.listAssetTask.splice(index, 1);
            let newTaskAssetAssign = {
                ...state.taskAssetAssign,
                listAssetTask: taskAssetAssign.listAssetTask
            };
            await setState({
                ...state,
                taskAssetAssign: newTaskAssetAssign
            })
        }
    }

    const isValidForm = () => {
        return false;
    }

    const handleAddListTaskAsset = () => {
        let error = state.errorValidate;
        let oldTaskAssetList = state.taskAssetAssign.listAssetTask;
        let newTaskAssetList = [...oldTaskAssetList, state.asset];

        let newTaskAssetAssgin = {
            ...state.taskAssetAssign,
            listAssetTask: newTaskAssetList
        }

        error.errorValidateAssetName.status && error.errorValidateQuantity.status && error.errorValidateUnitOfAsset.status &&
            setState({
                ...state,
                taskAssetAssign: newTaskAssetAssgin,
                asset: {
                    assetName: "",
                    quantity: 0,
                    unit: "",
                    status: "",
                }
            })
    }

    const handleChangeNameActivityName = (event) => {
        let value = event.target.value;
        setState({
            ...state,
            taskAssetAssign: {
                ...state.taskAssetAssign,
                name: value
            }
        })
    }

    const handleChangeTimesScheduler = (event) => {
        let value = event.target.value;
        setState({
            ...state,
            taskAssetAssign: {
                ...state.taskAssetAssign,
                timeSchedule: value
            }
        })
    }

    const save = () => {
        let updatedAssetTask = state.taskAssetAssign;
        props.updatedTaskAsset(updatedAssetTask);
    }

    let allUnitsAsset = [];
    assetsManager.listAssets.map((item) => {
        allUnitsAsset.push({
            text: item.assetName,
            value: item._id
        })
    });
    console.log(allUnitsAsset)

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-asset-form-${id}`}
                isLoading={false}
                formID={`modal-add-asset-form-${id}`}
                title="Thêm tài sản công việc"
                disableSubmit={isValidForm()}
                func={save}
                size="50"
                width="100"
            >
                <div className="row">
                    <div className="form-group col-sm-8 col-md-8">
                        <label className="control-label">{translate('manufacturing_managerment.management_chain.job_name')}</label>
                        <input type="text" className="form-control"
                            defaultValue={taskAssetAssign && taskAssetAssign.name ? taskAssetAssign.name : ""}
                            onChange={(event) => handleChangeNameActivityName(event)}
                        />
                    </div>
                    <div className="form-group col-sm-4 col-md-4">
                        <label className="control-label">{translate('manufacturing_managerment.management_chain.job_times')}(s)</label>
                        <input type="number" className="form-control"
                            defaultValue={taskAssetAssign && taskAssetAssign.timeSchedule ? taskAssetAssign.timesScheduler : 0}
                            onChange={(event) => handleChangeTimesScheduler(event)}
                        />
                    </div>
                </div>
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th title={`${translate('manufacturing_managerment.management_chain.job_asset')}`}>{translate('manufacturing_managerment.management_chain.job_asset')}</th>
                                <th title={`${translate('manufacturing_managerment.management_chain.job_asset_numbers')}`}>{translate('manufacturing_managerment.management_chain.job_asset_numbers')}</th>
                                <th title={`${translate('manufacturing_managerment.management_chain.job_asset_unit')}`}>{translate('manufacturing_managerment.management_chain.job_asset_unit')}</th>
                                <th title={`${translate('manufacturing_managerment.management_chain.job_asset_status')}`}>{translate('manufacturing_managerment.management_chain.job_asset_status')}</th>
                                <th>{translate('task_template.action')}</th>
                            </tr>
                        </thead>
                        <tbody id="list-jobs">
                            {
                                taskAssetAssign.listAssetTask.map((item, index) =>

                                    <tr key={`${index}`}>
                                        <td>{item.assetName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <a href="#" className="delete" title={translate('general.delete')} onClick={() => handleDeleteAsset(index)}><i className="material-icons">delete</i></a>
                                        </td>
                                    </tr>
                                )
                            }
                            <tr key={`add-asset-input-${taskAssetAssign.listAssetTask.length}`}>
                                <td>
                                    <div className={`form-group ${errorValidate.errorValidateAssetName.status ? "" : "has-error"}`}>
                                        {/* <input className="form-control" type="text" placeholder="Enter asset name" onChange={(event) => handleEnterNameAsset(event)} /> */}
                                        {allUnitsAsset &&
                                        <SelectBox
                                            id={`asset-select-box-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsAsset}
                                            onChange={(value) => handleChangeUnitsAsset(value)}
                                        />
                                    }
                                        <ErrorLabel content={errorValidate.errorValidateAssetName.message} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group ${errorValidate.errorValidateQuantity.status === true ? "" : "has-error"}`}>
                                        <input className="form-control" type="number" placeholder="Enter asset quantity" onChange={(event) => handleEnterQuantityAsset(event)} />
                                        <ErrorLabel content={errorValidate.errorValidateQuantity.message} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group ${errorValidate.errorValidateUnitOfAsset.status ? "" : "has-error"}`}>
                                        <input className="form-control" type="text" placeholder="Enter units of asset" onChange={(event) => handleEnterUnitOfAsset(event)} />
                                        <ErrorLabel content={errorValidate.errorValidateUnitOfAsset.message} />
                                    </div>
                                </td>
                                <td></td>
                                <td>
                                    <a className="save" title={translate('general.save')} onClick={() => handleAddListTaskAsset()}><i className="material-icons">save</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { assetsManager } = state;
    return { assetsManager }
}

const mapDispatchToProps = {

}

const connectAddAssetTakForm = connect(mapStateToProps, mapDispatchToProps)(withTranslate(AddAssetTaskForm))
export { connectAddAssetTakForm as AddAssetTaskForm }