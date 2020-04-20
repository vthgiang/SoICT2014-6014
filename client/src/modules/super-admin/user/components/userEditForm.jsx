import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { UserFormValidator} from './userFormValidator';

class UserEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            status: [
                { id: 1, name: "disable", value: false },
                { id: 2, name: "enable", value: true }
            ]
        }
        this.save = this.save.bind(this);
    }

    checkSuperAdmin = (roleArr) => {
        let superAdmin = this.props.role.list.find(obj => {
            return obj.name === "Super Admin"
        });

        var result = false;
        for (let i = 0; i < roleArr.length; i++) {
            if(roleArr[i] === superAdmin._id){
                result = true;
                break;
            }
        }
        
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            return this.props.edit(this.props.userId, {
                name: this.state.userName,
                active: this.state.userActive,
                roles: this.state.userRoles
            });
        }
    }

    isFormValidated = () => {
        let result = 
            this.validateUserName(this.state.userName, false); // Kết hợp với kết quả validate các trường khác (nếu có trong form)
        return result;
    }

    handleUserNameChange = (e) => {
        let value = e.target.value;
        this.validateUserName(value, true);
    }
    validateUserName = (value, willUpdateState=true) => {
        let msg = UserFormValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    errorOnUserName: msg,
                    userName: value,
                }
            });
        }
        return msg === undefined;
    }

    handleRolesChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                userRoles: value
            }
        });
    }

    handleUserActiveChange = (e) => {
        let value = e.target.value;
        this.setState(state=>{
             return {
                 ...state,
                 userActive: value
            }
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.userId !== prevState.userId) {
            return {
                ...prevState,
                userId: nextProps.userId,
                userEmail: nextProps.userEmail,
                userName: nextProps.userName,
                userActive: nextProps.userActive,
                userRoles: nextProps.userRoles,
                errorOnUserName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            } 
        } else {
            return null;
        }
    }

    render() { 
        const { translate, role, user } = this.props;
        const { userId, userEmail, userName, userActive, userRoles, status, errorOnUserName } = this.state;
        return ( 
            <React.Fragment>
                <DialogModal
                    size='50' func={this.save} isLoading={user.isLoading}
                    modalID={`modal-edit-user`}
                    formID={`form-edit-user`}
                    title={translate('manage_user.edit')}
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('manage_user.edit_faile')}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id={`form-edit-user`}>
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>{ translate('table.email') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={ userEmail } disabled/>
                            </div>
                            <div className="form-group col-sm-4">
                                <label>{ translate('table.status') }<span className="text-red">*</span></label>
                                <select 
                                    className="form-control" 
                                    style={{width: '100%'}} 
                                    value={ userActive }
                                    onChange = {this.handleUserActiveChange}
                                    ref="active"
                                    disabled={this.checkSuperAdmin(userRoles) ? true : false}>
                                    {   
                                        status.map(result => <option key={result.id} value={result.value}>{translate(`manage_user.${result.name}`)}</option>)    
                                    }
                                </select>
                            </div>
                        </div>
                        <div className={`form-group ${errorOnUserName===undefined?"":"has-error"}`}>
                            <label>{ translate('table.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" ref="name" value={ userName } onChange = {this.handleUserNameChange}/>
                            <ErrorLabel content={errorOnUserName}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_user.roles') }</label>
                            <SelectBox
                                id={`user-role-form${userId}`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {
                                    this.checkSuperAdmin(userRoles) ? //neu tai khoan nay hien tai khong co role la Super Admin
                                    role.list.map( role => {return {value: role._id, text: role.name}}):
                                    role.list.filter( role => {
                                        return role.name !== 'Super Admin'
                                    }).map( role => {return {value: role._id, text: role.name}})
                                }
                                onChange={this.handleRolesChange}
                                value={userRoles}
                                multiple={true}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;
const action = {
    edit: UserActions.edit
}


export default connect( mapStateToProps, action )( withTranslate(UserEditForm) );