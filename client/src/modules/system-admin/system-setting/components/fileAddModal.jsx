import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, UploadFile } from '../../../../common-components';

import ValidationHelper from '../../../../helpers/validationHelper';

function FileAddModal(props) {
    const [state, setState] = useState({
        description: "",
        file: "",
        urlFile: "",
        fileUpload: ""
    });

    const { translate } = props;

    const { id } = props;

    const {description, errorOnDiscFile } = state;

    const handleChangeFile = (value) => {
        if (value.length !== 0) {
            setState({
                ...state,
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            setState({
                ...state,
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    const handleDiscFileChange = (e) => {
        let { value } = e.target;
        validateDiscFile(value, true);
    }

    const validateDiscFile = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnDiscFile: message,
                    description: value,
                }
            });
        }
        return message === undefined;
    }

    const isFormValidated = () => {
        const { name, description, number } = state;
        let result = validateDiscFile(description, false);
        return result;
    }

    /** Bắt sự kiện submit form */
    const save = () => {
        if (isFormValidated()) {
            return props.handleChange(state);
        }
    }

    return (
        <React.Fragment>
            <ButtonModal modalID={`modal-create-file-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_file')} />
            <DialogModal
                size='50' modalID={`modal-create-file-${id}`} isLoading={false}
                formID={`form-create-file-${id}`}
                title={translate('human_resource.profile.add_file')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form className="form-group" id={`form-create-file-${id}`}>
                    {/* Mô tả */}
                    <div className={`form-group ${errorOnDiscFile && "has-error"}`}>
                        <label>{translate('table.description')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" name="description" value={description} onChange={handleDiscFileChange} autoComplete="off" />
                        <ErrorLabel content={errorOnDiscFile} />
                    </div>
                    {/* File đính kèm */}
                    <div className="form-group">
                        <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                        <UploadFile onChange={handleChangeFile} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}
const addModal = connect(null, null)(withTranslate(FileAddModal));
export { addModal as FileAddModal };