import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ErrorLabel, ModalDialog, } from '../../../../common-components';
import { CompanyFormValidator } from './CompanyFormValidator';

class CompanyEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() { 
        const { translate } = this.props;
        const {companyName, companyShortName, companyLinks, companyDescription, companyLog, companyActive, companyEmail, nameError, shortNameError, descriptionError, emailError} = this.state;
        
        return ( 
            <React.Fragment>
                <ModalDialog
                    modalID="modal-edit-company" size="75"
                    formID="form-edit-company" isLoading={this.props.company.isLoading}
                    title={translate('manage_company.edit')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-company">
                    <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="row">
                                    <div className={`form-group col-sm-9 ${nameError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                                        <input type="text" className="form-control" onChange={ this.handleChangeName } value={ companyName }/>
                                        <ErrorLabel content={nameError}/>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label>{ translate('manage_company.service') }<span className="text-red"> * </span></label>
                                        <select className="form-control" onChange={ this.handleActive } value={companyActive}>
                                            <option key='1' value={true}>{ translate('manage_company.on') }</option>
                                            <option key='2' value={false}>{ translate('manage_company.off') }</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className={`form-group col-sm-9 ${shortNameError===undefined?"":"has-error"}`}>
                                        <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                                        <input type="text" className="form-control" onChange={ this.handleChangeShortName } value={ companyShortName }/>
                                        <ErrorLabel content={shortNameError}/>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label>{ translate('manage_company.log') }<span className="text-red"> * </span></label>
                                        <select className="form-control" onChange={ this.handleLog } value={companyLog}>
                                            <option key='1' value={true}>{ translate('manage_company.on') }</option>
                                            <option key='2' value={false}>{ translate('manage_company.off') }</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" onChange={ this.handleChangeEmail } value={companyEmail}/>
                                    <ErrorLabel content={emailError}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '177px' }}  type="text" className="form-control" onChange={ this.handleChangeDescription } value={companyDescription}/>
                                    <ErrorLabel content={descriptionError}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{minHeight: '300px'}}>
                                    <legend className="scheduler-border">Các trang được truy cập</legend>
                                    <table className="table table-hover table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th>{ translate('manage_link.url') }</th>
                                                <th>{ translate('manage_link.description') }</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                companyLinks.length > 0 && companyLinks.map( link => 
                                                    <tr key={link._id}>
                                                        <td>{ link.url }</td>
                                                        <td>{ link.description }</td>
                                                    </tr> 
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
    
    // Luu du lieu ve cong ty
    save = () => {
        const data = { 
            name: this.state.companyName, 
            short_name: this.state.companyShortName, 
            log: this.state.companyLog, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            active: this.state.companyActive
        };
        if(this.isFormValidated()) return this.props.edit( this.state.companyId, data );
    }

    // Xu ly handle log va active
    handleActive = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                companyActive: value
            }
        })
    }

    handleLog = (e) => {
        const value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                companyLog: value
            }
        })
    }

    // Xu ly thay doi va validate cho ten cong ty
    handleChangeName = (e) => {
        const value = e.target.value;
        this.validateName(value, true);
    }

    validateName = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    nameError: msg,
                    companyName: value,
                }
            });
        }
        return msg === undefined;
    }

    // Xu ly thay doi va validate short_name cong ty
    handleChangeShortName = (e) => {
        const value = e.target.value;
        this.validateShortName(value, true);
    }

    validateShortName = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateShortName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    shortNameError: msg,
                    companyShortName: value,
                }
            });
        }
        return msg === undefined;
    }

    // Xu ly thay doi va validate cho phan description cua cong ty
    handleChangeDescription = (e) => {
        const value = e.target.value;
        this.validateDescription(value, true);
    }

    validateDescription = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateDescription(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    descriptionError: msg,
                    companyDescription: value,
                }
            });
        }
        return msg === undefined;
    }

    // Xu ly thay doi va validate cho email cua super admin cong ty
    handleChangeEmail = (e) => {
        const value = e.target.value;
        this.validateEmail(value, true);
    }

    validateEmail = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateEmailSuperAdmin(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    emailError: msg,
                    companyEmail: value,
                }
            });
        }
        return msg === undefined;
    }

    // Kiem tra thong tin da validated het chua?
    isFormValidated = () => {
        const {companyName, companyShortName, companyDescription, companyEmail} = this.state;
        let result = 
            this.validateName(companyName, false) &&
            this.validateShortName(companyShortName, false) &&
            this.validateDescription(companyDescription, false) &&
            this.validateEmail(companyEmail, false);
        return result;
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.companyId !== prevState.companyId) {
            return {
                ...prevState,
                companyId: nextProps.companyId,
                companyName: nextProps.companyName,
                companyShortName: nextProps.companyShortName,
                companyDescription: nextProps.companyDescription,
                companyLog: nextProps.companyLog,
                companyLinks: nextProps.companyLinks,
                companyActive: nextProps.companyActive,
                companyEmail: nextProps.companyEmail,
                nameError: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                shortNameError: undefined,
                descriptionError: undefined,
                emailError: undefined
            } 
        } else {
            return null;
        }
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps =  {
    edit: CompanyActions.edit
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyEditForm) );