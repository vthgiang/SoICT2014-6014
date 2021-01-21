import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';

const ProjectEditForm = (props) => {

    const [state, setState] = useState({
        projectId: undefined,
        projectName: "",
        description: "",
        code: "",
        projectParent: "",
        projectNameError: ""

    })

    const { translate, project } = props;
    const { projectName, code, projectNameError, projectParent, projectId } = state;
    console.log('eeeeedddddddddd', props.projectId, projectId, props.projectId !== projectId);
    if (props.projectId !== projectId) {
        console.log('eeeeeeeeeee');
        setState({
            projectId: props.projectId,
            projectName: props.projectName,
            code: props.code,
            projectParent: props.parent,
            projectNameError: "",
        })
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
            const { projectName, code, projectParent } = state;
            props.editProject(projectId, { name: projectName, code: code, parent: projectParent });
        }
    }

    const handleProjectName = (e) => {
        const { value } = e.target;
        console.log("hhhhhhhhh", value);
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
        setState({
            ...state,
            projectParent: value[0],
        });
    }




    const list = project.data.list;
    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID="modal-edit-project" isLoading={project.isLoading}
                formID="form-edit-project"
                title={translate('manage_example.add_title')}
                msg_success={translate('manage_example.add_success')}
                msg_faile={translate('manage_example.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <form id="form-edit-project" onSubmit={() => save(translate('manage_example.add_success'))}>
                    <div className={`form-group ${!projectNameError ? "" : "has-error"}`}>
                        <label>Tên dự án<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={projectName} onChange={handleProjectName}></input>
                        <ErrorLabel content={projectNameError} />
                    </div>
                    <div className={`form-group`}>
                        <label>Mã dự án</label>
                        <input type="text" className="form-control" value={code} onChange={handleProjectCode}></input>
                    </div>
                    <div className="form-group">
                        <label>Dự án cha</label>
                        <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    editProject: ProjectActions.editProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectEditForm)); 