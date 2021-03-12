import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../task/organizationalUnitHelper';
import { formatDate } from '../../../helpers/formatDate';
const ProjectEditForm = (props) => {

    const [state, setState] = useState({
        projectId: undefined,
        projectName: "",
        description: "",
        code: "",
        projectNameError: undefined,

    });
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [parent, setProjectParent] = useState("")
    const [projectManager, setManagerProject] = useState([])


    const { translate, projectEdit, projectEditId, project, user } = props;
    const { projectName, code, projectNameError, projectDescription, projectId } = state;

    if (projectEditId !== projectId) {
        setState({
            projectId: projectEditId,
            code: projectEdit.code,
            projectName: projectEdit.name,
            projectDescription: projectEdit.description,
            projectNameError: "",
        })

        setStartDate(formatDate(projectEdit.startDate));
        setEndDate(formatDate(projectEdit.endDate));
        setProjectParent(projectEdit.parent);
        setManagerProject(projectEdit.projectManager ? projectEdit.projectManager.map(o => o._id) : []);
    }

    const isFormValidated = () => {
        const { projectName } = state;
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

            const { projectName, code, projectDescription, projectId } = state;

            props.editProject(projectId, {
                name: projectName, code: code, parent, startDate: start,
                endDate: end, description: projectDescription, projectManager
            });
        }
    }

    const handleProjectName = (e) => {
        const { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            projectName: value,
            projectNameError: message
        })
    }

    const handleProjectCode = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            code: value
        });
    }

    const handleParent = (value) => {
        setProjectParent(value[0]);
    }

    const handleStartDate = (value) => {
        setStartDate(value);
    }

    const handleEndDate = (value) => {
        setEndDate(value);
    }

    const handleManagerProject = (value) => {
        setManagerProject(value);
    }

    const handleProjectDescription = (e) => {
        const { value } = e.target
        setState({
            ...state,
            projectDescription: value,
        })
    }


    const list = project.data.list;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID="modal-edit-project" isLoading={false}
                formID="form-edit-project"
                title={translate('project.edit_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id="form-edit-project" onSubmit={() => save(translate('manage_example.add_success'))}>
                    <div className={`form-group`}>
                        <label>{translate('project.code')}</label>
                        <input type="text" className="form-control" value={code} onChange={handleProjectCode}></input>
                    </div>

                    <div className={`form-group ${!projectNameError ? "" : "has-error"}`}>
                        <label>{translate('project.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={projectName} onChange={handleProjectName}></input>
                        <ErrorLabel content={projectNameError} />
                    </div>

                    <div className="form-group">
                        <label>{translate('project.startDate')}</label>
                        <DatePicker
                            id={`edit-project-state-date`}
                            value={startDate}
                            onChange={handleStartDate}
                        />
                    </div>

                    <div className="form-group">
                        <label>{translate('project.endDate')}</label>
                        <DatePicker
                            id={`edit-project-end-date`}
                            value={endDate}
                            onChange={handleEndDate}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dự án cha</label>
                        {
                            list &&
                            <TreeSelect data={list} value={parent} handleChange={handleParent} mode="radioSelect" />
                        }
                    </div>

                    <div className="form-group">
                        <label>{translate('project.manager')}</label>
                        <SelectBox
                            id={`edit-project-manager`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listUsers}
                            onChange={handleManagerProject}
                            value={projectManager}
                            multiple={true}
                        />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('project.description')}</label>
                        <textarea type="text" className="form-control" value={projectDescription} onChange={handleProjectDescription} />
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
    editProject: ProjectActions.editProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectEditForm));