import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { RoleActions } from '../../role/redux/actions';
import { LinkActions } from '../redux/actions';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { LinkValidator } from './linkValidator';

class LinkInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.linkId !== prevState.linkId) {
            return {
                ...prevState,
                linkId: nextProps.linkId,
                linkUrl: nextProps.linkUrl,
                linkDescription: nextProps.linkDescription,
                linkRoles: nextProps.linkRoles,
                linkDescriptionError: undefined,
            }
        } else {
            return null;
        }
    }

    // Xy ly va validate role name
    handleLinkDescription = (e) => {
        const { value } = e.target;
        this.validateLinkDescription(value, true);
    }
    validateLinkDescription = (value, willUpdateState = true) => {
        let msg = LinkValidator.validateDescription(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    linkDescriptionError: msg,
                    linkDescription: value,
                }
            });
        }
        return msg === undefined;
    }

    handleLinkRoles = (value) => {
        this.setState(state => {
            return {
                ...state,
                linkRoles: value
            }
        })
    }

    save = () => {
        const { linkId, linkUrl, linkDescription, linkRoles, linkDescriptionError } = this.state;

        const link = {
            url: linkUrl,
            description: linkDescription,
            roles: linkRoles
        };

        if (this.isFormValidated()) {
            return this.props.editLink(linkId, link);
        }
    }

    isFormValidated = () => {
        let result = this.validateLinkDescription(this.state.linkDescription, false);
        return result;
    }

    componentDidMount() {
        this.props.getRole();
    }

    render() {
        const { translate, role, link } = this.props;
        const { linkId, linkUrl, linkDescription, linkRoles, linkDescriptionError } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    isLoading={link.isLoading}
                    size='50' func={this.save}
                    modalID="modal-edit-link"
                    formID="form-edit-link"
                    title={translate('manage_link.edit')}
                    msg_success={translate('manage_link.edit_success')}
                    msg_faile={translate('manage_link.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
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
                            <input type="text" className="form-control" value={linkDescription} onChange={this.handleLinkDescription} />
                            <ErrorLabel content={linkDescriptionError} />
                        </div>

                        {/* Những role được truy cập */}
                        <div className="form-group">
                            <label>{translate('manage_link.roles')}</label>
                            <SelectBox
                                id={`link-roles-${linkId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={role.list ? role.list.map(role => { return { value: role._id, text: role.name } }) : []}
                                onChange={this.handleLinkRoles}
                                value={linkRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
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