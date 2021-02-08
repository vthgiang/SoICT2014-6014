import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox } from '../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../super-admin/user/redux/actions';
const ProjectCreateForm = (props) => {

    const [state, setState] = useState({
        projectName: "",
        description: "",
        code: "",
        stateDate: "",
        endDate: "",
        description: "",
        managerProject: [],
        memberProject: [],
        projectNameError: undefined,

    });
    useEffect(() => {

        props.getAllUser();
    }, [])

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
            const { projectName, code, projectParent, startDate, endDate, managerProject } = state;
            props.createProject({
                name: projectName,
                code: code,
                parent: projectParent,
                startDate: startDate,
                endDate: endDate,
                projectManager: managerProject,
                description: description,
                projectMembers: memberProject,
            });
        }
    }

    const handleProjectName = (e) => {
        const { value } = e.target;

        console.log(value);
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
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


    const handleStartDate = (value) => {
        setState({
            ...state,
            stateDate: value,
        });
    }
    const handleEndDate = (value) => {
        setState({
            ...state,
            endDate: value,
        });
    }

    const handleManagerProject = (value) => {
        setState({
            ...state,
            managerProject: value,
        });
    }

    const handleMemberProject = (value) => {
        setState({
            ...state,
            memberProject: value,
        });
    }

    const handleProjectDescription = (value) => {
        setState({
            ...state,
            description: value,
        });
    }

    const { translate, project, user } = props;
    const { projectName, code, projectNameError, projectParent, managerProject, startDate, endDate,
        description, memberProject } = state;
    const list = project.data.list;

    console.log('aloooooooooo', props, user);
    return (
        <React.Fragment>
            {/* <ButtonModal modalID="modal-create-example" button_name={translate('manage_example.add')} title={translate('manage_example.add_title')} /> */}
            <DialogModal
                modalID="modal-create-project" isLoading={project.isLoading}
                formID="form-create-project"
                title={translate('manage_example.add_title')}
                msg_success={translate('manage_example.add_success')}
                msg_faile={translate('manage_example.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="form-create-project" onSubmit={() => save(translate('manage_example.add_success'))}>
                    <div className="tab-content">
                        <div className="tab-pane active">
                            {/* <div className="row"> */}
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
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
                                    <label>Ngày bắt đầu</label>
                                    <DatePicker
                                        id={`project-state-date`}
                                        onChange={handleStartDate}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày kết thúc</label>
                                    <DatePicker
                                        id={`project-end-date`}
                                        onChange={handleEndDate}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Dự án cha</label>
                                    <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
                                </div>
                                <div>
                                    <label>Người quản trị dự án</label>
                                    <SelectBox
                                        id={`select-project-manager`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            user.list.length ? user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } }) : []
                                        }
                                        onChange={handleManagerProject}
                                        value={managerProject}
                                        multiple={true}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>Mô tả</label>
                                    <input type="text" className="form-control" value={description} onChange={handleProjectDescription}></input>
                                </div>
                                <div>
                                    <label>Người tham gia dự án</label>
                                    <SelectBox
                                        id={`select-project-memember`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            user.list.length ? user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } }) : []
                                        }
                                        onChange={handleMemberProject}
                                        value={memberProject}
                                        multiple={true}
                                    />
                                </div>
                            </div>


                        </div>
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

    getAllUser: UserActions.get,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectCreateForm)); 