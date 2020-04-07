import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { ModalDialog, ErrorLabel } from '../../../../common-components';

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
        return this.props.edit(this.props.userId, {
            name: this.refs.name.value,
            active: this.refs.active.value,
            roles: [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value)
        });
    }


    validateForm = () => {
        // Kết hợp với kết quả validate các trường khác (nếu có trong form)
        let result = this.state.errorOnUserName === undefined;
        return result;
    }

    handleUserNameChange = (e) => {
        let value = e.target.value;
        let msg = undefined;

        if (value.trim() === ""){
            msg = "Tên không được để trống";
        } else if(value.length < 4){
            msg = "Tên không ít hơn 4 ký tự";
        } else if(value.length > 50){
            msg = "Tên không nhiều hơn 50 ký tự";
        }

        this.setState(state => {
            return {
                ...state,
                errorOnUserName: msg,
                userName: value,
            }
        });
    }

    handleRolesChange = (e) => {
        let value = [].filter.call(this.refs.roles.options, o => o.selected).map(o => o.value);
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

    componentDidMount(){
        window.$(".select2").select2();
        window.$(".select2").on("change", this.handleRolesChange);
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
                errorOnUserName: undefined, // Cần lưu ý reset lại các gợi ý nhắc lỗi
            } 
        } else {
            return null;
        }
    }

    render() { 
        const { translate, role, user } = this.props;
        const { userId, userEmail, userName, userActive, userRoles, status } = this.state;
        return ( 
            <React.Fragment>
                <ModalDialog
                    size='50' func={this.save} isLoading={user.isLoading}
                    modalID={`modal-edit-user`}
                    formID={`form-edit-user`}
                    title={translate('manage_user.edit')}
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('manage_user.edit_faile')}
                    disableSubmit={!this.validateForm()}
                >
                    <form id={`form-edit-user`}>
                        <div className="row">
                            <div className="form-group col-sm-8">
                                <label>{ translate('table.email') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" defaultValue={ userEmail } disabled/>
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
                        <div className={`form-group ${this.state.errorOnUserName===undefined?"":"has-error"}`}>
                            <label>{ translate('table.name') }<span className="text-red">*</span></label>
                            <input type="text" className="form-control" ref="name" value={ userName } onChange = {this.handleUserNameChange}/>
                            <ErrorLabel content={this.state.errorOnUserName}/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_user.roles') }</label>
                            <select
                                className="form-control select2" 
                                multiple="multiple" 
                                style={{ width: '100%' }} 
                                value={userRoles}
                                onChange = {() => {}}
                                ref="roles"
                            >
                                {
                                    this.checkSuperAdmin(userRoles) ? //neu tai khoan nay hien tai khong co role la Super Admin
                                    role.list.map( role => <option key={role._id} value={role._id}>{role.name}</option>):
                                    role.list.map( role => {
                                        if(role.name !== 'Super Admin')
                                            return <option key={role._id} value={role._id}>{role.name}</option>;
                                    })
                                }
                            </select>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;
const action = {
    edit: UserActions.edit
}


export default connect( mapStateToProps, action )( withTranslate(UserEditForm) );