import React, { Component } from 'react';
import MainHeaderMenu from './mainHeaderMenu';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { DialogModal, ErrorLabel } from '../../../common-components';
import { LOCAL_SERVER_API } from '../../../env';
import { Validator } from './validator';
import { auth } from '../../../modules/auth/redux/reducers';

class ModalChangeUserInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        const {userAvatar, userName, userEmail, userNameError, userEmailError} = this.state;
        console.log("state user: ", this.state)
        return ( 
            <DialogModal
                modalID="modal-profile"
                formID="form-profile"
                title={translate('auth.profile.title')}
                msg_success={translate('auth.profile.edit_success')}
                msg_faile={translate('auth.profile.edit_faile')}
                func={this.changeInformation}
                disableSubmit={!this.isFormValidated()}
            >
                <form id="form-profile">
                    
                    <div className="row">
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                            <div className="form-group text-center">
                                <img className="user-profile-avatar" src={
                                    this.state.img !== undefined ? 
                                    this.state.img : 
                                    (LOCAL_SERVER_API+this.props.auth.user.avatar)}/>
                                <div className="upload btn btn-default">
                                    Cập nhật
                                    <input className="upload" type="file" name="avatar" onChange={this.handleUpload} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                            <div className={`form-group ${userNameError===undefined?"":"has-error"}`}>
                                <label>{ translate('auth.profile.name') }<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="name" value={userName} onChange={this.handleChangeName}/>
                                <ErrorLabel content={userNameError}/>
                            </div>
                            <div className={`form-group ${userEmailError===undefined?"":"has-error"}`}>
                                <label>{ translate('auth.profile.email') }<span className="text-red">*</span></label>
                                <input type="email" className="form-control" name="email" onChange={this.handleEmail} value={userEmail}/>
                                <ErrorLabel content={userEmailError}/>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
         );
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.userId !== prevState.userId) {
            return {
                ...prevState,
                userId: nextProps.userId,
                userName: nextProps.userName,
                userEmail: nextProps.userEmail,
                userNameError: undefined,
                userEmailError: undefined
            } 
        } else {
            return null;
        }
    }
      
    changeInformation = async() => {
        const {userName, userEmail} = this.state;
        let formdata = new FormData();
        await formdata.append('avatar', this.state.avatar);
        await formdata.append('name', userName);
        await formdata.append('email', userEmail);

        if(this.isFormValidated()) return this.props.changeInformation(formdata);
            
    }
    
    handleUpload = (event) => {
        var file = event.target.files[0];
        var fileLoad = new FileReader();
        fileLoad.readAsDataURL(file);
        fileLoad.onload = () => {
            this.setState({
                img: fileLoad.result,
                avatar: file
            })
        };
    }

    handleChangeName = (e) => {
        const {value} = e.target;
        this.validateUserName(value, true);
    }
    validateUserName = (value, willUpdateState=true) => {
        let msg = Validator.validateName(value)
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    userNameError: msg,
                    userName: value,
                }
            });
        }
        return msg == undefined;
    }

    
    handleEmail = (e) => {
        const {value} = e.target;
        this.validateEmail(value);
    }
    validateEmail = (value, willUpdateState=true) => {
        let msg = Validator.validateEmail(value)
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    userEmailError: msg,
                    userEmail: value,
                }
            });
        }
        return msg == undefined;
    }

    
    isFormValidated = () => {
        let result = 
            this.validateUserName(this.state.userName, false) &&
            this.validateEmail(this.state.userEmail, false);
        
        return result;
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changeInformation: AuthActions.changeInformation
}
export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ModalChangeUserInformation) );