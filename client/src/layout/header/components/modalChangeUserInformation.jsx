import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../modules/auth/redux/actions';
import { DialogModal, ErrorLabel } from '../../../common-components';
import { LOCAL_SERVER_API } from '../../../env';
import { Validator } from './validator';
import CropImage from './cropImage';
import './cropImage.css'

class ModalChangeUserInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    showCropImageSpace= () => {
        window.$('#modal-crop-user-image').modal('show');
    }

    getImage = (img) => {
        this.setState({
            img: img
        })
        fetch(img)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'avatar.png', blob)
                this.setState({
                    img: img,
                    avatar: file
                })
            })
    }

    render() { 
        const {translate} = this.props;
        const {userAvatar, userName, userEmail, userNameError, userEmailError} = this.state;
        return ( 
            <React.Fragment>
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
                        {/* User information */}
                        <div className="row">
                            <div className="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                                <div className="profile-pic">
                                    <img className="user-avatar" src={
                                        this.state.img !== undefined ? 
                                        this.state.img : 
                                        (LOCAL_SERVER_API+this.props.auth.user.avatar)}
                                    />
                                    <button type="button" className="edit-option" onClick={this.showCropImageSpace}><i className="fa fa-camera" style={{color: 'white'}}></i></button>
                                </div>
                            </div>
                            <div className="col-xs-6 col-sm-8 col-md-8 col-lg-8">
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
                {/* Crop image */}
                <CropImage getImage={this.getImage}/>
            </React.Fragment>
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