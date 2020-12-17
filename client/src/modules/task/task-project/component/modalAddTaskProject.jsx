import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, ToolTip, TreeSelect, ErrorLabel } from '../../../../common-components';
import TaskProjectAction from '../redux/action';
import ValidationHelper from '../../../../helpers/validationHelper';

const ModalAddTaskProject = ({ translate, get, create, taskProject }) => {
    const [state, setState] = useState({});

    useEffect(() => {
        get()
    }, [])

    const _handleCode = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            code: value
        })
    }

    const _handleName = (e) => {
        let { value } = e.target;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        setState({
            ...state,
            name: value,
            nameError: message
        })
    }

    const _handleParent = (selected) => {
        setState({
            ...state,
            parent: selected[0]
        })
    }

    const _save = () => {
        let data = {
            code: state.code,
            name: state.name,
            parent: state.parent
        }
        create(data);
    }

    const _isFormValidated = () => {
        let { name } = state;
        if (!ValidationHelper.validateName(translate, name, 6, 255).status) return false;
        return true;
    }

    return (
        <DialogModal
            modalID='modal-add-task-project'
            formID="form-add-task-project"
            title='Thêm mới dự án'
            func={_save}
            disableSubmit={!_isFormValidated()}
        >
            <div className={`form-group ${!state.nameError ? "" : "has-error"}`}>
                <label>Tên dự án <span className="text-red">*</span></label>
                <input className="form-control" onChange={_handleName}></input>
                <ErrorLabel content={state.nameError} />
            </div>
            <div className="form-group">
                <label>
                    Mã dự án
                    <ToolTip
                        type="icon_tooltip"
                        dataTooltip={[
                            '(*) Mã dự án sẽ được hệ thống tạo một cách tự động trong trường hợp người dùng không nhập trường thông tin này'
                        ]}
                    />
                </label>
                <input className="form-control" onChange={_handleCode}></input>
            </div>
            <div className="form-group">
                <label>Dự án cha</label>
                <ToolTip
                    type="icon_tooltip"
                    dataTooltip={[
                        'Dự án cha của dự án hiện tại'
                    ]}
                />
                <TreeSelect
                    id='select-task-project-parent'
                    mode='radioSelect'
                    data={taskProject.list}
                    handleChange={_handleParent}
                    value={[state.parent]}
                    option='fa fa-plus'
                    optionHandle={() => { console.log("Handle option") }}
                />
            </div>
        </DialogModal>
    )
}

const mapStateToProps = state => {
    return {
        taskProject: state.taskProject
    }
}

const mapDispathToProps = {
    get: TaskProjectAction.get,
    create: TaskProjectAction.create,
}

export default connect(mapStateToProps, mapDispathToProps)(withTranslate(ModalAddTaskProject));