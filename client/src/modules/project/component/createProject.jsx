import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../task/organizationalUnitHelper';

const ProjectCreateForm = (props) => {

    const [state, setState] = useState({
        projectName: "",
        description: "",
        code: "",
        projectNameError: undefined,

    });
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [projectParent, setProjectParent] = useState("")
    const [managerProject, setManagerProject] = useState([])

    const handleProjectCode = (e) => {
        const { value } = e.target;

        setState({
            ...state,
            code: value
        });
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
        const { value } = e.target;
        setState({
            ...state,
            description: value,
        });
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
            const { projectName, code, description } = state;
            let partStartDate = startDate.split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = endDate.split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            props.createProject({
                name: projectName,
                code: code,
                parent: projectParent,
                startDate: start,
                endDate: end,
                projectManager: managerProject,
                description: description,
            });
        }
    }

    const { translate, project, user } = props;

    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []

    const { projectName, code, projectNameError, description } = state;

    const list = project.data.list;

    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID="modal-create-project" isLoading={project.isLoading}
                formID="form-create-project"
                title={translate('project.add_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
            >
                <form id="form-create-project">
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
                            id={`create-project-state-date`}
                            value={startDate}
                            onChange={handleStartDate}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.endDate')}</label>
                        <DatePicker
                            id={`create-project-end-date`}
                            value={endDate}
                            onChange={handleEndDate}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.parent')}</label>
                        <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                    </div>
                    <div className="form-group">
                        <label>{translate('project.manager')}</label>
                        {listUsers &&
                            <SelectBox
                                id={`select-project-manager`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listUsers}
                                onChange={handleManagerProject}
                                value={managerProject}
                                multiple={true}
                            />
                        }
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('project.description')}</label>
                        <textarea type="text" className="form-control" value={description} onChange={handleProjectDescription} />
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
    createProject: ProjectActions.createProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectCreateForm));