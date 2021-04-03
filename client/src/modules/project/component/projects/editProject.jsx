import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { formatDate } from '../../../../helpers/formatDate';

const ProjectEditForm = (props) => {
    const { translate, user, projectEdit, projectEditId } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'hour', value: 'hour' },
        { text: 'day', value: 'day' },
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

    const { projectName, projectNameError, description, code, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost, projectId } = form;

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

    const save = () => {
        if (isFormValidated()) {
            let partStartDate = startDate.split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = endDate.split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            props.editProjectDispatch(projectEdit?._id, {
                fullName: projectName,
                code: code,
                startDate: start,
                endDate: end,
                projectManager,
                responsibleEmployees,
                description,
                unitCost,
                unitTime,
                estimatedCost
            });
        }
    }

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID={`modal-edit-project-${projectEdit?._id}`} isLoading={false}
                formID={`form-edit-project-${projectEdit?._id}`}
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id={`form-edit-project-${projectEdit?._id}`}>
                    <div className={`form-group ${!projectNameError ? "" : "has-error"}`}>
                        <label>{translate('project.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={projectName} onChange={(e) => handleChangeForm(e, 'projectName')}></input>
                        <ErrorLabel content={projectNameError} />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('project.code')}</label>
                        <input type="text" className="form-control" value={code} onChange={(e) => handleChangeForm(e, 'code')}></input>
                    </div>

                    <div className="form-group">
                        <label>{translate('project.startDate')}</label>
                        <DatePicker
                            id={`edit-project-state-date-${projectEdit?._id}`}
                            value={startDate}
                            onChange={(e) => handleChangeForm(e, 'startDate')}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.endDate')}</label>
                        <DatePicker
                            id={`edit-project-end-date-${projectEdit?._id}`}
                            value={endDate}
                            onChange={(e) => handleChangeForm(e, 'endDate')}
                            disabled={false}
                        />
                    </div>
                    {/* <div className="form-group">
                        <label>{translate('project.parent')}</label>
                        <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                    </div> */}
                    <div className="form-group">
                        <label>{translate('project.manager')}</label>
                        {listUsers &&
                            <SelectBox
                                id={`edit-project-manager-${projectEdit?._id}`}
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
                        <label>{translate('project.member')}</label>
                        {listUsers &&
                            <SelectBox
                                id={`edit-project-members-${projectEdit?._id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listUsers}
                                onChange={(e) => handleChangeForm(e, 'responsibleEmployees')}
                                value={responsibleEmployees}
                                multiple={true}
                            />
                        }
                    </div>
                    <div className="form-group">
                        <label>{translate('project.unitTime')}</label>
                        <SelectBox
                            id={`edit-project-unit-time-${projectEdit?._id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={fakeUnitTimeList}
                            onChange={(e) => handleChangeForm(e, 'unitTime')}
                            value={unitTime}
                            multiple={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.unitCost')}</label>
                        <SelectBox
                            id={`edit-project-unit-cost-${projectEdit?._id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={fakeUnitCostList}
                            onChange={(e) => handleChangeForm(e, 'unitCost')}
                            value={unitCost}
                            multiple={false}
                        />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('project.estimatedCost')}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={estimatedCost}
                            onChange={(e) => handleChangeForm(e, 'estimatedCost')}
                        />
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('project.description')}</label>
                        <textarea type="text" className="form-control" value={description} onChange={(e) => handleChangeForm(e, 'description')} />
                    </div>
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