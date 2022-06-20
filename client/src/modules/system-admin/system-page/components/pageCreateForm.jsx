import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';

import { SystemPageActions } from '../redux/actions';

function PageCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        description: "",
        exampleNameError: {
            message: undefined,
            status: true
        }
    })

    const { translate, example, page, perPage } = props;
    const { exampleName, description, exampleNameError } = state;


    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated() && exampleName) {
            props.addSystemAdminPage([{ exampleName, description }]);
            props.getSystemAdminPage({
                exampleName: "",
                page: page,
                perPage: perPage
            });
        }
    }

    console.log("props----", example);


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleExampleName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            exampleName: value,
            exampleNameError: result
        })
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handleExampleDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-example-hooks" isLoading={example.isLoading}
                formID="form-create-example-hooks"
                title={translate('system_admin.system_page.add_title')}
                msg_success={translate('system_admin.system_page.add_success')}
                msg_failure={translate('system_admin.system_page.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-example-hooks" onSubmit={() => save(translate('system_admin.system_page.add_success'))}>
                    {/* Tên ví dụ */}
                    <div className={`form-group ${exampleNameError.status ? "" : "has-error"}`}>
                        <label>{translate('system_admin.system_page.URL')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={exampleName} onChange={handleExampleName}></input>
                        <ErrorLabel content={exampleNameError.message} />
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('system_admin.system_page.page_description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleExampleDescription}></input>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const actions = {
    addSystemAdminPage: SystemPageActions.addSystemAdminPage,
    getSystemAdminPage: SystemPageActions.getSystemAdminPage,
}

const connectedPageCreateForm = connect(mapState, actions)(withTranslate(PageCreateForm));
export { connectedPageCreateForm as PageCreateForm };