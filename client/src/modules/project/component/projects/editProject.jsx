import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { formatDate } from '../../../../helpers/formatDate';
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from './functionHelper';
import { getStorage } from '../../../../config';

const ProjectEditForm = (props) => {
    const { translate, user, projectEdit, projectEditId } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'day', value: 'day' },
        { text: 'hour', value: 'hour' },
    ]
    const preprocessUsersList = useCallback((currentObject) => {
        if (typeof currentObject?.[0] === 'string') {
            return currentObject;
        }
        return currentObject?.map(item => item._id)
    }, [])
    const [form, setForm] = useState({
        projectId: '',
        projectNameError: undefined,
        codeError: undefined,
        projectName: projectEdit?.name || "",
        description: projectEdit?.description || "",
        code: projectEdit?.code || "",
        startDate: projectEdit?.startDate ? formatDate(projectEdit?.startDate) : '',
        endDate: projectEdit?.endDate ? formatDate(projectEdit?.endDate) : '',
        projectManager: preprocessUsersList(projectEdit?.projectManager),
        responsibleEmployees: preprocessUsersList(projectEdit?.responsibleEmployees),
        unitCost: projectEdit?.unitCost || fakeUnitCostList[0].text,
        unitTime: projectEdit?.unitTime || fakeUnitTimeList[0].text,
        estimatedCost: projectEdit?.estimatedCost || '',
    })

    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    const { projectName, projectNameError,codeError, description, code, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost, projectId } = form;

    if (projectEditId !== projectId) {
        setForm({
            projectId: projectEditId,
            projectNameError: undefined,
            projectName: projectEdit?.name || "",
            description: projectEdit?.description || "",
            code: projectEdit?.code || "",
            startDate: projectEdit?.startDate ? formatDate(projectEdit?.startDate) : '',
            endDate: projectEdit?.endDate ? formatDate(projectEdit?.endDate) : '',
            projectManager: preprocessUsersList(projectEdit?.projectManager),
            responsibleEmployees: preprocessUsersList(projectEdit?.responsibleEmployees),
            unitCost: projectEdit?.unitCost || fakeUnitCostList[0].text,
            unitTime: projectEdit?.unitTime || fakeUnitTimeList[0].text,
            estimatedCost: projectEdit?.estimatedCost || '',
        })
        setTimeout(() => {
            setResponsibleEmployeesWithUnit({
                ...responsibleEmployeesWithUnit,
                list: projectEdit?.responsibleEmployeesWithUnit,
            })
        }, 10);
    }

    const handleChangeForm = (event, currentKey) => {
        if (currentKey === 'projectName') {
            let { translate } = props;
            let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255);
            setForm({
                ...form,
                [currentKey]: event.target.value,
                projectNameError: message,
            })
            return;
        }
        if (currentKey === 'code') {
            let { translate } = props;
            let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 6);
            setForm({
                ...form,
                [currentKey]: event.target.value,
                codeError: message === undefined ? message : "Mã dự án phải có 6 kí tự",
            })
            return;
        }
        const justRenderEventArr = ['projectManager', 'responsibleEmployees', 'startDate', 'endDate'];
        if (justRenderEventArr.includes(currentKey)) {
            setForm({
                ...form,
                [currentKey]: event,
            })
            return;
        }
        const renderFirstItemArr = ['unitCost', 'unitTime'];
        if (renderFirstItemArr.includes(currentKey)) {
            setForm({
                ...form,
                [currentKey]: event[0],
            })
            return;
        }
        if (currentKey === 'estimatedCost') {
            setForm({
                ...form,
                [currentKey]: event.target.value,
            })
            return;
        }
        setForm({
            ...form,
            [currentKey]: event?.target?.value,
        })
    }

    const isFormValidated = () => {
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, projectName, 6, 255).status) {
            return false;
        }
        return true;
    }

    const save = async () => {
        if (isFormValidated()) {
            let partStartDate = startDate.split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = endDate.split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            // Cái này để hiển thị danh sách ra - không quan tâm user nào thuộc unit nào
            let newEmployeesArr = [];
            for (let unitItem of responsibleEmployeesWithUnit.list) {
                for (let userItem of unitItem.listUsers) {
                    console.log(userItem.userId || userItem);
                    newEmployeesArr.push(userItem.userId || userItem)
                }
            }            
            
            // Cái này để hiển thị danh sách ra - có quan tâm user và unit và salary của user đó
            let newResponsibleEmployeesWithUnit = [];
            for (let employeeItem of responsibleEmployeesWithUnit.list) {
                newResponsibleEmployeesWithUnit.push({
                    unitId: employeeItem.unitId,
                    listUsers: employeeItem.listUsers.map(item => {
                        return ({
                            userId: item.userId || item,
                            salary: item.salary || 0,
                        })
                    })
                })
            } 

            await props.editProjectDispatch(projectEdit?._id, {
                name: projectName,
                code,
                startDate: start,
                endDate: end,
                projectManager,
                responsibleEmployees: newEmployeesArr,
                description,
                unitCost,
                unitTime,
                estimatedCost,
                creator: userId,
                responsibleEmployeesWithUnit: newResponsibleEmployeesWithUnit,
            });

            setTimeout(() => {
                props.handleAfterCreateProject()
            }, 500);
        }
    }

    const handleDelete = (index) => {
        if (responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0) {
            responsibleEmployeesWithUnit.list.splice(index, 1);
            // responsibleEmployeesWithUnit.list.splice(responsibleEmployeesWithUnit.list.length - 1, 1);
            setResponsibleEmployeesWithUnit({
                ...responsibleEmployeesWithUnit,
                list: responsibleEmployeesWithUnit.list,
                currentUnitRow: '',
                currentEmployeeRow: [],
            })
        }
    }

    const handleAddRow = () => {
        const oldListRow = responsibleEmployeesWithUnit.list;
        const newListRow = [...oldListRow, {
            unitId: responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value,
            listUsers: responsibleEmployeesWithUnit.currentEmployeeRow,
        }];
        setResponsibleEmployeesWithUnit({
            ...responsibleEmployeesWithUnit,
            list: newListRow,
            currentUnitRow: '',
            currentEmployeeRow: [],
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-project-${projectEdit?._id && projectEditId}`} isLoading={false}
                formID={`form-edit-project-${projectEdit?._id && projectEditId}`}
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <form id={`form-edit-project-${projectEdit?._id && projectEditId}`}>
                    <div className="row">
                        <div className={"col-sm-6"}>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông số dự án</legend>

                                <div className={`form-group ${!projectNameError ? "" : "has-error"}`}>
                                    <label>{translate('project.name')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" value={projectName} onChange={(e) => handleChangeForm(e, 'projectName')}></input>
                                    <ErrorLabel content={projectNameError} />
                                </div>

                                <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                                    <label>{translate('project.code')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" value={code} onChange={(e) => handleChangeForm(e, 'code')}></input>
                                    <ErrorLabel content={codeError} />
                                </div>

                                <div className="form-group">
                                    <label>{translate('project.startDate')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-project-state-date`}
                                        value={startDate}
                                        onChange={(e) => handleChangeForm(e, 'startDate')}
                                        disabled={false}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{translate('project.endDate')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-project-end-date`}
                                        value={endDate}
                                        onChange={(e) => handleChangeForm(e, 'endDate')}
                                        disabled={false}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{translate('project.unitTime')}</label>
                                    <div className="form-control">Ngày</div>
                                </div>
                                <div className="form-group">
                                    <label>{translate('project.unitCost')}</label>
                                    <div className="form-control">VND</div>
                                </div>

                                <div className={`form-group`}>
                                    <label>{translate('project.description')}</label>
                                    <textarea type="text" className="form-control" value={description} onChange={(e) => handleChangeForm(e, 'description')} />
                                </div>
                            </fieldset>
                        </div>
                        <div className={"col-sm-6"}>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Nhân lực</legend>
                                <div className="form-group">
                                    <label>{translate('project.manager')}<span className="text-red">*</span></label>
                                    {listUsers &&
                                        <SelectBox
                                            id={`edit-select-project-manager-${projectEdit?._id && projectEditId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listUsers}
                                            onChange={(e) => handleChangeForm(e, 'projectManager')}
                                            value={projectManager}
                                            multiple={true}
                                        />
                                    }
                                </div>
                                <div className="form-group">
                                    <label>{translate('project.member')}<span className="text-red">*</span></label>
                                    <table id="project-table" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Thuộc đơn vị</th>
                                                <th>Thành viên tham gia</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0 &&
                                                responsibleEmployeesWithUnit.list.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                                                        <td>
                                                            {item?.listUsers.map(userItem =>
                                                                convertUserIdToUserName(listUsers, userItem.userId || userItem))
                                                                .join(', ')
                                                            }
                                                        </td>
                                                        <td>
                                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                            <tr key={`add-task-input-${responsibleEmployeesWithUnit?.list?.length}`}>
                                                <td>
                                                    <div className={`form-group`}>
                                                        {listDepartments && listDepartments.length > 0 &&
                                                            <SelectBox
                                                                id={`edit-project-select-unit-${projectEdit?._id && projectEditId}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                items={listDepartments}
                                                                onChange={(e) => {
                                                                    setTimeout(() => {
                                                                        setResponsibleEmployeesWithUnit({
                                                                            ...responsibleEmployeesWithUnit,
                                                                            currentUnitRow: e[0],
                                                                        })
                                                                    }, 10);
                                                                }}
                                                                value={responsibleEmployeesWithUnit.currentUnitRow}
                                                                multiple={false}
                                                            />}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`form-group`}>
                                                        {listDepartments && listDepartments.length > 0 &&
                                                            <SelectBox
                                                                id={`edit-project-select-project-members-${projectEdit?._id && projectEditId}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                items={listUsers.filter(item =>
                                                                    item.text === convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany,
                                                                        responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value)
                                                                )}
                                                                onChange={(e) => {
                                                                    setTimeout(() => {
                                                                        setResponsibleEmployeesWithUnit({
                                                                            ...responsibleEmployeesWithUnit,
                                                                            currentEmployeeRow: e,
                                                                        })
                                                                    }, 10);
                                                                }}
                                                                value={responsibleEmployeesWithUnit.currentEmployeeRow}
                                                                multiple={true}
                                                            />}
                                                    </div>
                                                </td>
                                                <td>
                                                    <a className="save text-green" title={translate('general.save')} onClick={handleAddRow}><i className="material-icons">add_circle</i></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                            </fieldset>
                        </div>
                    </div>
                    {/* <div className="form-group">
                        <label>{translate('project.parent')}</label>
                        <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                    </div> */}
                    {/* <div className={`form-group`}>
                        <label>{translate('project.estimatedCost')}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={estimatedCost}
                            onChange={(e) => handleChangeForm(e, 'estimatedCost')}
                        />
                    </div> */}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    editProjectDispatch: ProjectActions.editProjectDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectEditForm));