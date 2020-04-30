import React, { Component } from 'react';
import { connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoleActions } from '../redux/actions';
import { DialogModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { RoleValidator } from './roleValidator';

class RoleInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { role, user, translate } = this.props;
        const { roleId, roleType, roleName, roleParents, roleUsers, roleNameError } = this.state;
        return ( 
            <React.Fragment>
                <DialogModal
                    size='50' func={this.save} isLoading={role.isLoading}
                    modalID="modal-edit-role"
                    formID="form-edit-role"
                    title={translate('manage_role.edit')}
                    msg_success={translate('manage_role.edit_success')}
                    msg_faile={translate('manage_role.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-role">
                        <div className={`form-group ${roleNameError===undefined?"":"has-error"}`}>
                            <label>{ translate('manage_role.name') }<span className="text-red">*</span></label>
                            {
                                roleType === 'Abstract' ?
                                <input className="form-control" value={ roleName } disabled={true}/> :
                                <input className="form-control" value={ roleName } onChange={ this.handleRoleName }/>
                            }
                            <ErrorLabel content={roleNameError}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.extends') }</label>
                            <SelectBox
                                id={`role-parents-${roleId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    role.list
                                    .filter( role => (role.name !== 'Super Admin' && role.name !== roleName))
                                    .map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleParents}
                                value={roleParents}
                                multiple={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_role.users') } { roleName }</label>
                            <SelectBox
                                id={`role-users-${roleId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    user.list.map( user => {return {value: user._id, text: `${user.name} - ${user.email}`}})
                                }
                                onChange={this.handleUsers}
                                value={roleUsers}
                                multiple={roleName !== 'Super Admin' ? true : false}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.roleId !== prevState.roleId) {
            return {
                ...prevState,
                roleId: nextProps.roleId,
                roleName: nextProps.roleName,
                roleType: nextProps.roleType,
                roleParents: nextProps.roleParents,
                roleUsers: nextProps.roleUsers,
                roleNameError: undefined,
            } 
        } else {
            return null;
        }
    }

    // Xy ly va validate role name
    handleRoleName = (e) => {
        const {value} = e.target;
        this.validateRoleName(value, true);
    }
    validateRoleName = (value, willUpdateState=true) => {
        let msg = RoleValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    roleNameError: msg,
                    roleName: value,
                }
            });
        }
        return msg === undefined;
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
        const {value} = e.target;
        this.setState(state => {
            return {
                ...state,
                roleUsers: [value]
            }
        });
    }

    isFormValidated = () => {
        let result = this.validateRoleName(this.state.roleName, false);
        return result;
    }

    save = () => {
        const role = {
            id: this.state.roleId,
            name: this.state.roleName,
            parents: this.state.roleParents,
            users: this.state.roleUsers
        };
        
        if(this.isFormValidated()) return this.props.edit(role);
    }
}
 
const mapState = state => state;

const dispatchStateToProps =  {
    edit: RoleActions.edit
}

export default connect(mapState, dispatchStateToProps)(withTranslate( RoleInfoForm ));