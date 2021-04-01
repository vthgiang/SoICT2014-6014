import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { formatDate } from '../../../../helpers/formatDate';

const ProjectEditForm = (props) => {
    const { translate, project, user, projectEdit, projectEditId } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'hour', value: 'hour' },
        { text: 'day', value: 'day' },
    ]
    const [form, setForm] = useState({
        projectNameError: undefined,
        projectName: projectEdit.fullName || "",
        description: projectEdit.description || "",
        code: projectEdit.codeName || "",
        startDate: projectEdit.startDate ? formatDate(projectEdit.startDate) : '',
        endDate: projectEdit.estimatedEndDate ? formatDate(projectEdit.estimatedEndDate) : '',
        projectManager: projectEdit.projectManager ? projectEdit?.projectManager?.map(item => item._id) : [],
        projectMembers: projectEdit.projectMembers ? projectEdit.projectMembers?.map(item => item._id) : [],
        unitCost: projectEdit.unitCost || fakeUnitCostList[0].text,
        unitTime: projectEdit.unitTime || fakeUnitTimeList[0].text,
        estimatedCost: projectEdit.estimatedCost || '',
    })

    const { projectName, projectNameError, description, code, startDate, endDate, projectManager, projectMembers, unitCost, unitTime, estimatedCost } = form;

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
        const justRenderEventArr = ['projectManager', 'projectMembers', 'startDate', 'endDate'];
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

            props.createProjectDispatch({
                fullName: projectName,
                codeName: code,
                startDate: start,
                estimatedEndDate: end,
                projectManager,
                projectMembers,
                description,
                unitCost,
                unitTime,
                estimatedCost
            });
        }
    }

    const list = project.data.list;

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID={`modal-edit-project-${projectEdit._id}`} isLoading={false}
                formID="form-edit-project"
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id="form-edit-project">
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
                            id={`edit-project-state-date`}
                            value={startDate}
                            onChange={(e) => handleChangeForm(e, 'startDate')}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.endDate')}</label>
                        <DatePicker
                            id={`edit-project-end-date`}
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
                                id={`edit-project-manager`}
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
                                id={`edit-project-members`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listUsers}
                                onChange={(e) => handleChangeForm(e, 'projectMembers')}
                                value={projectMembers}
                                multiple={true}
                            />
                        }
                    </div>
                    <div className="form-group">
                        <label>{translate('project.unitTime')}</label>
                        <SelectBox
                            id={`edit-project-unit-time`}
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
                            id={`edit-project-unit-cost`}
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