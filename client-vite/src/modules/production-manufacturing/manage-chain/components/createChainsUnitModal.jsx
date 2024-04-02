import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { ErrorLabel, QuillEditor, SelectBox } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../../modules/task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper'
import { AssetManagerActions } from "../../../asset/admin/asset-information/redux/actions";

import { DialogModal } from "../../../../common-components";
import { AddAssetTaskForm } from "./addAssetTaskForm";
import { ConfirmSaveAssetTemplateModal } from "./confirmSaveAssetTemplateModal";
import { UserActions } from '../../../../modules/super-admin/user/redux/actions';
import { ManagerChainActions } from './../redux/actions';
import { generateCode } from "../../../../helpers/generateCode";

const CreateChainsUnitModal = (props) => {
    const [state, setState] = useState({
        newChainInformation: {
            chainName: "",
            organizationalUnit: "",
            description: "",
            approverEmloyees: [],
            watcherEmloyees: [],
            processTemplate: "",
            listTaskTemplate: [],
            timeScheduleTotal: 0,
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
        currentRow: undefined,
        assetTemplate: undefined,
    });

    const { translate, size, width, type, department, user, taskProcess, manufacturingLineTemplate } = props;
    const { newChainInformation, taskAssetEdit, timeScheduleTotal } = state;

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        props.getAllAsset();
        props.getAllAssetTemplate();
    }, [])

    const handleChangeInfoDesc = (value) => {
        let errorValidateDescription = ValidationHelper.validateEmpty(translate, value);
        setState({
            newChainInformation: {
                ...state.newChainInformation,
                description: value,
                errorValidateDescription: errorValidateDescription
            }
        })
    }

    const handleChangeOrganizationalUnit = (event) => {
        event.preventDefault();
        let value = event.target.value;
        // console.log("valueeeee: " + value)
        if (value) {
            setState({
                newChainInformation: {
                    ...state.newChainInformation,
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
        props.getAllAsset({
            handoverUnit: value
        })
    }

    const handleEditTaskActionAsset = async (item, index) => {

        await setState({
            ...state,
            taskAssetEdit: item,
            currentRow: index,
        })
        // await console.log("indexxxx: ", index, " ", state.currentRow)
        window.$(`#modal-add-asset-form-${index}`).modal("show")
    }

    const handleDeleteTaskActionAsset = (index) => {

    }

    const handleChangeApproverEmployees = (value) => {
        let errorApproverEmployees = ValidationHelper.validateArrayLength(translate, value);
        setState({
            newChainInformation: {
                ...state.newChainInformation,
                approverEmloyees: value,
                errorValidateApprover: errorApproverEmployees
            }
        })
    }

    const handleChangeWatcherEmployees = (value) => {
        let errorWatcherEmployees = ValidationHelper.validateArrayLength(translate, value);
        setState({
            newChainInformation: {
                ...state.newChainInformation,
                watcherEmloyees: value,
                errorValidateWatcher: errorWatcherEmployees
            }
        })
    }

    const handleChangeChainName = (event) => {
        let value = event.target.value;
        let errorNameValidate = ValidationHelper.validateName(translate, value, 6, 255);
        setState({
            newChainInformation: {
                ...state.newChainInformation,
                chainName: value,
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
            task.taskActions.map((item, index) => actionOnTask.push({
                ...item,
                taskCodeId: generateCode(`TSK${index}`)
            }))
        });
        // console.log("actionOnTaskkkkk: ", actionOnTask)
        await setState({
            newChainInformation: {
                ...state.newChainInformation,
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
        state.newChainInformation.listTaskTemplate.splice(state.currentRow, 1, item);
        let updatedChainInformation = {
            ...state.newChainInformation,
        }

        setState({
            ...state,
            newChainInformation: updatedChainInformation
        })
    }

    const handleChangeAssetProcessTemplate = (event) => {
        let value = event.target.value;
        //Tìm mẫu tài sản dựa theo id
        let assetTemplateSelect = manufacturingLineTemplate.allAssetTemplate.filter((item) => item._id == value)
        console.log("asssettt: ", assetTemplateSelect)
        setState({
            ...state,
            newChainInformation: {
                ...state.newChainInformation,
                listTaskTemplate: assetTemplateSelect[0]?.listTaskTemplate
            },
            assetTemplate: assetTemplateSelect
        })
    }

    const addAssetTemplate = () => {
        setState({
            ...state,
            assetTemplate: newChainInformation.listTaskTemplate
        })
        window.$("#confirm-create-asset-template").modal("show")
    }

    const save = () => {
        props.createChainTemplate({
            name: newChainInformation.chainName,
            organizationalUnit: newChainInformation.organizationalUnit,
            description: newChainInformation.description,
            approver: newChainInformation.approverEmloyees,
            watcher: newChainInformation.watcherEmloyees,
            processTemplate: newChainInformation.processTemplate,
            listActivityAsset: newChainInformation.listTaskTemplate
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

    let listTaskTemplate = newChainInformation.listTaskTemplate;
    let allAssetProcessTemplate = [];
    if(manufacturingLineTemplate && manufacturingLineTemplate.allAssetTemplate) {
        allAssetProcessTemplate = manufacturingLineTemplate.allAssetTemplate.filter((item) => item.processTemplate === newChainInformation.processTemplate)
    }

    let { currentRow } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-create-chain-unit`}
                isLoading={false}
                formID={`modal-create-chain-unit`}
                title="Tạo mẫu thiết kế chuyền"
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
                                    <div className={`form-group ${newChainInformation.errorValidateName.status ? "" : "has-error"}`}>
                                        <input type="text" className="form-control"
                                            value={newChainInformation.chainName}
                                            onChange={(event) => handleChangeChainName(event)} />
                                        <ErrorLabel content={newChainInformation.errorValidateName.message} />
                                    </div>
                                </div>
                                <div className="form-group col-lg-6 col-md-6">
                                    <label className="control-label">{translate('manufacturing_managerment.management_chain.unit_production')}<span className="text-red">*</span></label>
                                    <div>
                                        {(listDepartment || listDepartment.length === 0) ? (listDepartment &&
                                            <select value={newChainInformation.organizationalUnit} className="form-control" onChange={(event) => handleChangeOrganizationalUnit(event)}>
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
                                    id="inforChainProcess"
                                    getTextData={(value) => handleChangeInfoDesc(value)}
                                    quillValueDefault={newChainInformation.quillValueDefault}
                                    embeds={false}
                                    placeholder={translate('task.task_management.detail_description')}
                                />
                            </div>

                            {/**Người phê duyệt */}
                            <div className="form-group">
                                <label className="control-label">{translate('manufacturing_managerment.management_chain.employee_approver')}<span className="text-red">*</span></label>
                                <div className={`form-group ${newChainInformation.errorValidateApprover.status ? "" : "has-error"}`}>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id="approver-select-box"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={(value) => handleChangeApproverEmployees(value)}
                                            value={newChainInformation.approverEmloyees}
                                            multiple={true}
                                        />
                                    }
                                    <ErrorLabel content={newChainInformation.errorValidateApprover.message} />
                                </div>
                            </div>

                            {/**Người được xem */}
                            <div className="form-group">
                                <label className="control-label">{translate('manufacturing_managerment.management_chain.employee_watcher')}<span className="text-red">*</span></label>
                                <div className={`form-group ${newChainInformation.errorValidateWatcher.status ? "" : "has-error"}`}>
                                    {allUnitsMember &&
                                        <SelectBox
                                            id="watcher-select-box"
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={allUnitsMember}
                                            onChange={(value) => handleChangeWatcherEmployees(value)}
                                            value={newChainInformation.watcherEmloyees}
                                            multiple={true}
                                        />
                                    }
                                    <ErrorLabel content={newChainInformation.errorValidateWatcher.message} />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-md-6 col-lg-6 col-sm-6">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manufacturing_managerment.management_chain.job_list_title')}</legend>
                            <div className="row">
                                <div className="col-lg-6 col-sm-6 col-md-6">
                                    <label className="control-label">Tên mẫu quy trình <span className="text-red">*</span></label>
                                    <div className="form-group">
                                        {(allProcessTemplate || allProcessTemplate.length === 0) ? (allProcessTemplate &&
                                            <select value={newChainInformation.processTemplate} className="form-control" onChange={(event) => handleChangeProcessTemplate(event)}>
                                                {allProcessTemplate.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.processName}</option>
                                                })}
                                            </select>) :
                                            <select className="form-control">
                                                <option>Process Template not found result</option>
                                            </select>
                                        }
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-md-6">
                                    <label className="control-label">Chọn tài sản mẫu</label>
                                    <div className="form-group">
                                        {(allAssetProcessTemplate || allAssetProcessTemplate.length === 0) ? (allAssetProcessTemplate &&
                                            <select className="form-control" onChange={(event) => handleChangeAssetProcessTemplate(event)}>
                                                {allAssetProcessTemplate.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.assetTemplateName}</option>
                                                })}
                                            </select>) :
                                            <select className="form-control">
                                                <option>Asset Process Template not found result</option>
                                            </select>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="pull-right" style={{ marginBottom: "10px" }}>
                                    <button className="btn btn-primary" style={{ marginRight: "10px" }} onClick={addAssetTemplate} disabled={listTaskTemplate.length === 0 ? true : false}>Lưu mẫu tài sản này</button>
                                    <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleAddAssetTaskForm}>{translate('general.add')}</button>
                                </div>
                            </div>

                            {/**table chứa danh sách các thông tin của mẫu công việc */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }} className="col-fixed">{translate('manufacturing_managerment.management_chain.index')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_code')}`}>{translate('manufacturing_managerment.management_chain.job_code')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_name')}`}>{translate('manufacturing_managerment.management_chain.job_name')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_asset')}`}>{translate('manufacturing_managerment.management_chain.job_asset')}</th>
                                        <th title={`${translate('manufacturing_managerment.management_chain.job_times')}`}>{translate('manufacturing_managerment.management_chain.job_times')}</th>
                                        <th>{translate('task_template.action')}</th>
                                    </tr>
                                </thead>
                                <tbody id="list-jobs">
                                    {
                                        (typeof listTaskTemplate === 'undefined' || listTaskTemplate.length === 0) ?
                                            <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                                            listTaskTemplate.map((item, index) =>
                                                <tr key={`${index}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.taskCodeId}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        {item.listAssetTask ? item.listAssetTask.map((x) => (`${x.quantity} ${x.assetName}`)).join(' ,') : ""}
                                                    </td>
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
                    <ConfirmSaveAssetTemplateModal saveAssetTemplate={state.assetTemplate} processTemplateId={state.newChainInformation.processTemplate} />
                    <AddAssetTaskForm id={currentRow ? `${currentRow}` : (currentRow === 0 ? 0 : "undefined")} taskAsset={taskAssetEdit} updatedTaskAsset={(updatedItem) => handleUpdatedTaskAsset(updatedItem)} />
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    const { user, department, taskProcess, assetsManager, manufacturingLineTemplate } = state;
    return { user, department, taskProcess, assetsManager, manufacturingLineTemplate };
}

const dispatchToProps = {
    getAllChainsList: ManagerChainActions.getChainsList,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    createChainTemplate: ManagerChainActions.createChainTemplate,
    getAllAsset: AssetManagerActions.getAllAsset,
    getAllAssetTemplate: ManagerChainActions.getAllAssetTemplate,
}

const connectCreateChainsUnitModal = connect(mapStateToProps, dispatchToProps)(withTranslate(CreateChainsUnitModal))
export { connectCreateChainsUnitModal as CreateChainsUnitModal }