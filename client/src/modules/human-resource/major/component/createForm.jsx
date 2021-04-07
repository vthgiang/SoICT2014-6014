import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../common-components';
import { MajorActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
function CreateForm(props) {
    const [state, setState] = useState({
        archiveParent: ''
    })

    const { translate, documents } = props;
    const { list } = props;
    let { parent, nameError, codeError } = state;

    const handleName = (e) => {
        let { value } = e.target;
        const { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            name: value,
            nameError: !message ? '' : message
        });
    }

    const handleCode = (e) => {
        let { value } = e.target;
        const { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        setState({
            ...state,
            code: value,
            codeError: !message ? '' : message,
        });
    }

    const handleParent = (value) => {
        setState({
            ...state,
            parent: value[0]
        });
    };

    const validateMajorName = (name) => {
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    const validateMajorCode = (code) => {
        if (!code) return false;
        return true;
    }

    const isValidateForm = () => {
        let { name, code } = state;
        let { translate } = props;
        if (
            !validateMajorName(name) || !validateMajorCode(code)
        ) return false;
        return true;
    }

    const save = () => {
        const data = {
            name: state.name,
            code: state.code,
            parent: state.parent,
        }
        console.log('data', data);
        props.createMajor(data);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-major"
                formID="form-create-major"
                title="Thêm chuyên ngành"
                disableSubmit={!isValidateForm()}
                func={save}
            >
                <form id="form-create-major">
                    <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                        <label>Tên<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={handleName} />
                        <ErrorLabel content={nameError} />
                    </div>
                    <div className="form-group">
                        <label>Chọn thông tin cha</label>
                        <TreeSelect data={list} value={parent} handleChange={handleParent} mode="radioSelect" />
                    </div>
                    <div className={`form-group ${!codeError ? "" : "has-error"}`}>
                        <label>Nhãn<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={handleCode} />
                        <ErrorLabel content={codeError} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createMajor: MajorActions.createMajor,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));