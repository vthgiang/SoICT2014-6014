import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { RoleActions } from '../redux/actions';
import { VALIDATOR } from '../../../../helpers/validator';

class RoleCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleName: '',
            roleParents: [],
            roleUsers: []
        }
    }

    render() {
        const { translate, role, user } = this.props;
        const { roleNameError } = this.state;

        return (
            <React.Fragment>
                {/* Button thêm phân quyền mới */}
                <ButtonModal modalID="modal-create-role" button_name={translate('manage_role.add')} title={translate('manage_role.add_title')} />

                <DialogModal
                    modalID="modal-create-role" isLoading={role.isLoading}
                    formID="form-create-role"
                    title={translate('manage_role.add_title')}
                    msg_success={translate('manage_role.add_success')}
                    msg_faile={translate('manage_role.add_faile')}
                    func={this.save} disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm phân quyền mới */}
                    <form id="form-create-role">

                        {/* Tên phân quyền */}
                        <div className={`form-group ${!roleNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_role.name')}<span className="text-red">*</span></label>
                            <input className="form-control" onChange={this.handleRoleName} />
                            <ErrorLabel content={roleNameError} />
                        </div>

                        {/* Kế thừa phân quyền */}
                        <div className="form-group">
                            <label>{translate('manage_role.extends')}</label>
                            <SelectBox
                                id="select-role-parents-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    role.list.filter(role => (role && role.name !== 'Super Admin'))
                                        .map(role => { return { value: role ? role._id : null, text: role ? role.name : "Role is deleted" } })
                                }
                                onChange={this.handleParents}
                                multiple={true}
                            />
                        </div>

                        {/* Những người dùng có phân quyền */}
                        <div className="form-group">
                            <label>{translate('manage_role.users')}</label>
                            <SelectBox
                                id="select-role-users-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    user.list.map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "User is deleted" } })
                                }
                                onChange={this.handleUsers}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.get();
    }

    handleRoleName = (e) => {
        let {translate} = this.props;
        let { value } = e.target;
        let msg = VALIDATOR.checkName(value);
        this.setState({
            roleName: value,
            roleNameError: msg ? `${translate('manage_role.name')} ${translate(msg)}` : undefined
        });
    }

    handleParents = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleParents: value
            }
        });
    }

    handleUsers = (value) => {
        this.setState(state => {
            return {
                ...state,
                roleUsers: value
            }
        });
    }

    handleRoleUser = (e) => {
        const { value } = e.target;
        this.setState(state => {
            return {
                ...state,
                roleUsers: [value]
            }
        });
    }

    isFormValidated = () => {
        let {roleNameError} = this.state;
        if(roleNameError !== undefined) return false;
        return true;
    }

    save = () => {
        const data = {
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        }

        if (this.isFormValidated()) {
            return this.props.create(data);
        }
    }

}

function mapStateToProps(state) {
    const { role, user } = state;
    return { role, user };
}


const mapDispatchToProps = {
    get: RoleActions.get,
    create: RoleActions.create
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoleCreateForm));