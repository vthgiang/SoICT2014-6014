import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../../role/redux/actions';
import { LinkActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

function LinkInfoForm(props) {
    const [state, setState] = useState({})

    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.linkId !== state.linkId) {
            setState({
                ...state,
                linkId: props.linkId,
                linkUrl: props.linkUrl,
                linkDescription: props.linkDescription,
                linkRoles: props.linkRoles,
                linkDescriptionError: undefined,
            })
        }
    }, [props.linkId])

    const handleLinkDescription = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateDescription(translate, value);
        setState({
            ...state,
            linkDescription: value,
            linkDescriptionError: message
        });
    }

    const handleLinkRoles = (value) => {
        setState({
            linkRoles: value
        });
    }

    const save = () => {
        const { linkId, linkUrl, linkDescription, linkRoles } = state;

        const link = {
            url: linkUrl,
            description: linkDescription,
            roles: linkRoles
        };

        if (isFormValidated()) {
            return props.editLink(linkId, link);
        }
    }

    const isFormValidated = () => {
        let { linkDescription } = state;
        let { translate } = props;
        if (!ValidationHelper.validateDescription(translate, linkDescription).status) return false;
        return true;
    }

    useEffect(() => {
        props.getRole();
    }, [])

    const { translate, role, link } = props;
    const { linkId, linkUrl, linkDescription, linkRoles, linkDescriptionError } = state;

    return (
        <React.Fragment>
            <DialogModal
                isLoading={link.isLoading}
                func={save}
                modalID="modal-edit-link"
                formID="form-edit-link"
                title={translate('manage_link.edit')}
                disableSubmit={!isFormValidated()}
            >

                {/* Form hỉnh sửa thông tin   */}
                <form id="form-edit-link">

                    {/* Đường link của trang web */}
                    <div className="form-group">
                        <label>{translate('manage_link.url')}<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkUrl} disabled />
                    </div>

                    {/* Mô tả về trang web */}
                    <div className={`form-group ${!linkDescriptionError ? "" : "has-error"}`}>
                        <label>{translate('manage_link.description')}<span className="text-red"> * </span></label>
                        <input type="text" className="form-control" value={linkDescription} onChange={handleLinkDescription} />
                        <ErrorLabel content={linkDescriptionError} />
                    </div>

                    {/* Những role được truy cập */}
                    <div className="form-group">
                        <label>{translate('manage_link.roles')}</label>
                        <SelectBox
                            id={`link-roles-${linkId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={role.list.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })}
                            onChange={handleLinkRoles}
                            value={linkRoles}
                            multiple={true}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { role, link } = state;
    return { role, link };
}

const getState = {
    getRole: RoleActions.get,
    editLink: LinkActions.edit,
}

export default connect(mapState, getState)(withTranslate(LinkInfoForm));
