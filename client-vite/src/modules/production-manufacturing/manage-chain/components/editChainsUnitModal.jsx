import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { ErrorLabel, QuillEditor, SelectBox } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../modules/task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper'

import { AssetManagerActions } from "../../../asset/admin/asset-information/redux/actions";
import { DialogModal } from "../../../../common-components";
import { AddAssetTaskForm } from "./addAssetTaskForm";
import { ManagerChainActions } from './../redux/actions';

const EditChainsUnitModal = (props) => {

    useEffect(()=> {
        props.getAllAsset();
    }, [])

    useEffect(() => {
        templateEdit && templateEdit._id && props.getProductionLineTemplateById(templateEdit._id)
    }, [props.templateEdit])

    useEffect(() => {
        let currentTemplateSelected;
        // console.log("tesssst: ", currentTemplateSelected)
        if (manufacturingLineTemplate && manufacturingLineTemplate.templateById)
            currentTemplateSelected = manufacturingLineTemplate.templateById
        currentTemplateSelected && setState({
            ...state,
            editChainInformation: {
                ...editChainInformation,
                manufacturingLineName: currentTemplateSelected.manufacturingLineName && currentTemplateSelected.manufacturingLineName,
                organizationalUnit: currentTemplateSelected.organizationalUnit && currentTemplateSelected.organizationalUnit,
                description: currentTemplateSelected.description && currentTemplateSelected.description,
                approverEmloyees: currentTemplateSelected.approverEmployee && currentTemplateSelected.approverEmployee,
                watcherEmloyees: [],
                processTemplate: currentTemplateSelected.processTemplate && currentTemplateSelected.processTemplate,
                listTaskTemplate: currentTemplateSelected.taskList && currentTemplateSelected.taskList,
            }
        })
    }, [props.manufacturingLineTemplate])

    const [state, setState] = useState({
        editChainInformation: {
            manufacturingLineName: "",
            organizationalUnit: "",
            description: "",
            approverEmloyees: [],
            watcherEmloyees: [],
            processTemplate: "",
            listTaskTemplate: [],
            errorValidateName: {
                message: undefined,
                status: true
            },
            errorValidateApprover: {
                message: undefined,
                status: true
            },
            errorValidateDescription: {
                message: undefined,
                status: true
            },
            errorValidateProcessTemplate: {
                message: undefined,
                status: true
            },
            errorValidateWatcher: {
                message: undefined,
                status: true
            }
        },
        currentRow: undefined
    });

    const { editChainInformation, taskAssetEdit } = state;
    const { translate, size, width, department, user, taskProcess, templateEdit, manufacturingLineTemplate } = props;


    // useEffect(() => {
    //     let currentProductionLineTemplate;
    // })

    const handleChangeInfoDesc = (value) => {
        let errorValidateDescription = ValidationHelper.validateEmpty(translate, value);
        setState({
            editChainInformation: {
                ...state.editChainInformation,
                description: value,
                errorValidateDescription: errorValidateDescription
            }
        })
    }


    const handleChangeOrganizationalUnit = (event) => {
        event.preventDefault();
        let value = event.target.value;
        if (value) {
            setState({
                editChainInformation: {
                    ...state.editChainInformation,
                    organizationalUnit: value,
                    approverEmloyees: [],
                    errorValidateName: {
                        message: undefined,
                        status: true
                    },
                    errorValidateApprover: {
                        message: undefined,
                        status: false
                    }
                }
            })
        }
    }

    const handleEditTaskActionAsset = async (item, index) => {
        await setState({
            ...state,
            taskAssetEdit: item,
            currentRow: index
        })
        // await console.log("indexxxx: ", index, " ", state.currentRow)
        window.$(`#modal-add-asset-form-${index}`).modal("show")
    }

    const handleDeleteTaskActionAsset = (index) => {

    }

    const handleChangeApproverEmployees = (value) => {
        let errorApproverEmployees = ValidationHelper.validateArrayLength(translate, value);
        setState({
            editChainInformation: {
                ...state.editChainInformation,
                approverEmloyees: value,
                errorValidateApprover: errorApproverEmployees
            }
        })
    }

    const handleChangeWatcherEmployees = (value) => {
        let errorWatcherEmployees = ValidationHelper.validateArrayLength(translate, value);
        setState({
            editChainInformation: {
                ...state.editChainInformation,
                watcherEmloyees: value,
                errorValidateWatcher: errorWatcherEmployees
            }
        })
    }

    const handleChangeChainName = (event) => {
        let value = event.target.value;
        let errorNameValidate = ValidationHelper.validateName(translate, value, 6, 255);
        setState({
            editChainInformation: {
                ...state.editChainInformation,
                manufacturingLineName: value,
                errorValidateName: errorNameValidate
            }
        })
    }

    const handleChangeProcessTemplate = async (event) => {
        let value = event.target.value;
        let errorSelectProcessTemplate = ValidationHelper.validateEmpty(translate, value);
        let newListTaskTemplate = taskProcess.xmlDiagram.filter((item) => item._id === value);
        let tasks = newListTaskTemplate[0].tasks;
        let actionOnTask = [];
        tasks.map((task) => {
            task.taskActions.map((item) => actionOnTask.push(item))
        });
        await setState({
            editChainInformation: {
                ...state.editChainInformation,
                processTemplate: value,
                listTaskTemplate: actionOnTask,
                errorValidateProcessTemplate: errorSelectProcessTemplate
            }
        })
    }

    const handleAddAssetTaskForm = () => {
        window.$("#modal-add-asset-form-undefined").modal("show")
    }

    const isFormValidate = () => {
        return false
    }

    //update array at currentRow
    const handleUpdatedTaskAsset = (item) => {
        state.editChainInformation.listTaskTemplate.splice(state.currentRow, 1, item);
        let updatedChainInformation = {
            ...state.editChainInformation,
        }
        setState({
            ...state,
            editChainInformation: updatedChainInformation
        })
    }

    const save = () => {
        const updatedInfo = state.editChainInformation
        props.updateChainTemplateById(templateEdit._id, {
            name: updatedInfo.manufacturingLineName,
            organizationalUnit: updatedInfo.organizationalUnit,
            description: updatedInfo.description,
            approver: updatedInfo.approverEmloyees,
            watcher: updatedInfo.watcherEmloyees,
            processTemplate: updatedInfo.processTemplate,
            listActivityAsset: updatedInfo.listTaskTemplate
        })
        props.getAllChainsList()
    }

    const listDepartment = department.list;

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
    }
    //ham lay tat ca cac user => can phai chinh sua
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);

    let allProcessTemplate = [];
    if (taskProcess && taskProcess.xmlDiagram) {
        allProcessTemplate = taskProcess.xmlDiagram.filter((item) => {
            return allProcessTemplate.find(e => e._id === item._id) ? '' : allProcessTemplate.push(item)
        });
    }

    let listTaskTemplate = editChainInformation.listTaskTemplate;
    let id = templateEdit._id;
    let { currentRow } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-chain-unit`}
                isLoading={false}
                formID={`modal-edit-chain-unit`}
                title="Cập nhật mẫu thiết kế chuyền"
                disableSubmit={isFormValidate()}
                func={save}
                size={size}
                width={width}
            >
                <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing_managerment.management_chain.add_form_titile')}</legend>

                            {/**Thông tin quy trình*/}
                            <div className="row">
                                <div className="form-group col-lg-6 col-md-6">
                                    <label className="control-label">{translate('manufacturing_managerment.management_chain.chain_name')}<span className="text-red">*</span></label>
                                    <div className={`form-group ${editChainInformation.errorValidateName.status ? "" : "has-error"}`}>
                                        <input type="text" className="form-control"
                                            value={editChainInformation.manufacturingLineName}
                                            onChange={(event) => handleChangeChainName(event)} />
                                        <ErrorLabel content={editChainInformation.errorValidateName.message} />
                                    </div>
                                </div>
                                <div className="form-group col-lg-6 col-md-6">
                                    <label className="control-label">{translate('manufacturing_managerment.management_chain.unit_production')}<span className="text-red">*</span></label>
                                    <div>
                                        {(listDepartment || listDepartment.length === 0) ? (listDepartment &&
                                            <select value={editChainInformation.organizationalUnit} className="form-control" onChange={(event) => handleChangeOrganizationalUnit(event)}>
                                                {listDepartment.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </select>) :
                                            <select className="form-control">
                                                <option>Organization not found result</option>
                                            </select>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/**Mô tả của trường thông tin */}
                            <div className="form-group" >
                                <label className="control-label" htmlFor="inputDescriptionInfo">{translate('manufacturing_managerment.management_chain.description')}<span className="text-red">*</span></label>
                                <QuillEditor
                                    id="edit-inforChainProcess"
                                    getTextData={(value) => handleChangeInfoDesc(value)}
                                    quillValueDefault={editChainInformation.description}
                                    embeds={false}
                                    placeholder={translate('task.task_management.detail_description')}
                                />
                            </div>

                            {/**Người phê duyệt */}
                            <div className="form-group">
                                <label className="control-label">{translate('manufacturing_managerment.management_chain.employee_approver')}<span className="text-red">*</span></label>
                                <div className={`form-group ${editChainInformation.errorValidateApprover.status ? "" : "has-error"}`}>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id={`edit-approver-select-box-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={(value) => handleChangeApproverEmployees(value)}
                                            value={editChainInformation.approverEmloyees}
                                            multiple={true}
                                        />
                                    }
                                    <ErrorLabel content={editChainInformation.errorValidateApprover.message} />
                                </div>
                            </div>

                            {/**Người được xem */}
                            <div className="form-group">
                                <label className="control-label">{translate('manufacturing_managerment.management_chain.employee_watcher')}<span className="text-red">*</span></label>
                                <div className={`form-group ${editChainInformation.errorValidateWatcher.status ? "" : "has-error"}`}>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id={`edit-watcher-select-box-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={(value) => handleChangeWatcherEmployees(value)}
                                            value={editChainInformation.watcherEmloyees}
                                            multiple={true}
                                        />
                                    }
                                    <ErrorLabel content={editChainInformation.errorValidateWatcher.message} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing_managerment.management_chain.job_list_title')}</legend>

                            <div className="form-group">
                                <label className="control-label">Tên mẫu quy trình <span className="text-red">*</span></label>
                                <div className="form-group">
                                    {(allProcessTemplate || allProcessTemplate.length === 0) ? (allProcessTemplate &&
                                        <select value={editChainInformation.processTemplate} className="form-control" onChange={(event) => handleChangeProcessTemplate(event)}>
                                            {allProcessTemplate.map(x => {
                                                return <option key={x._id} value={x._id}>{x.processName}</option>
                                            })}
                                        </select>) :
                                        <select className="form-control">
                                            <option>Organization not found result</option>
                                        </select>
                                    }
                                </div>
                            </div>
                            <div className="pull-right" style={{ marginBottom: "10px" }}>
                                <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleAddAssetTaskForm}>{translate('general.add')}</button>
                            </div>

                            {/**table chứa danh sách các thông tin của mẫu công việc */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }} className="col-fixed">{translate('manufacturing_managerment.management_chain.index')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_name')}`}>{translate('manufacturing_managerment.management_chain.job_name')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_asset')}`}>{translate('manufacturing_managerment.management_chain.job_asset')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_times')}`}>{translate('manufacturing_managerment.management_chain.job_times')}</th>
                                        <th>{translate('task_template.action')}</th>
                                    </tr>
                                </thead>
                                <tbody id="list-jobs">
                                    {
                                        (typeof listTaskTemplate === 'undefined' || listTaskTemplate.length === 0) ? <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            listTaskTemplate.map((item, index) =>
                                                item &&
                                                <tr key={`${index}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name ? item.name : ""}</td>
                                                    <td>
                                                        {item.listAssetTask ? item.listAssetTask.map((x) => `${x.quantity} ${x.assetName}`).join(' ,') : ""}
                                                    </td>
                                                    {/**Khi acitvityTimeSchedule === 0 thì nó là 0 */}
                                                    <td>{item.timeSchedule ? item.timeSchedule : 0}</td>
                                                    <td>
                                                        <a href="#" className="edit" title={translate('general.edit')} onClick={() => handleEditTaskActionAsset(item, index)}><i className="material-icons">edit</i></a>
                                                        <a href="#" className="delete" title={translate('general.delete')} onClick={() => handleDeleteTaskActionAsset(index)}><i className="material-icons">delete</i></a>
                                                    </td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </fieldset>
                    </div>
                    {/* vcl code js */}
                    <AddAssetTaskForm id={currentRow ? `${currentRow}` : (currentRow === 0 ? 0 : "undefined")} taskAsset={taskAssetEdit} updatedTaskAsset={(updatedItem) => handleUpdatedTaskAsset(updatedItem)} />
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, department, taskProcess, manufacturingLineTemplate, assetsManager } = state;
    return { user, department, taskProcess, manufacturingLineTemplate, assetsManager };
}

const dispatchToProps = {
    getAllChainsList: ManagerChainActions.getChainsList,
    getProductionLineTemplateById: ManagerChainActions.getProductionLineTemplateById,
    updateChainTemplateById: ManagerChainActions.editChainTemplate,
    getAllAsset: AssetManagerActions.getAllAsset,
}

const connectEditChainsUnitModal = React.memo(connect(mapStateToProps, dispatchToProps)(withTranslate(EditChainsUnitModal)))
export { connectEditChainsUnitModal as EditChainsUnitModal }