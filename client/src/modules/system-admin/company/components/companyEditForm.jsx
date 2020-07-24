import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';

import { CompanyFormValidator } from './companyFormValidator';

import { ErrorLabel, DialogModal } from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class CompanyEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    static getDerivedStateFromProps(nextProps, prevState) {
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

    // Luu du lieu ve cong ty
    save = () => {
        const data = { 
            name: this.state.companyName, 
            shortName: this.state.companyShortName, 
            log: this.state.companyLog, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            active: this.state.companyActive
        };

        if (this.isFormValidated()) {
            return this.props.editCompany(this.state.companyId, data);
        } 
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
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    nameError: msg ? translate(msg) : msg,
                    companyName: value,
                }
            });
        }

        return !msg;
    }

    // Xu ly thay doi va validate short_name cong ty
    handleChangeShortName = (e) => {
        const value = e.target.value;
        this.validateShortName(value, true);
    }

    validateShortName = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateShortName(value);
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    shortNameError: msg ? translate(msg) : msg,
                    companyShortName: value,
                }
            });
        }

        return !msg;
    }

    // Xu ly thay doi va validate cho phan description cua cong ty
    handleChangeDescription = (e) => {
        const value = e.target.value;
        this.validateDescription(value, true);
    }

    validateDescription = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateDescription(value);
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    descriptionError: msg ? translate(msg) : msg,
                    companyDescription: value,
                }
            });
        }

        return !msg;
    }

    // Xu ly thay doi va validate cho email cua super admin cong ty
    handleChangeEmail = (e) => {
        const value = e.target.value;
        this.validateEmail(value, true);
    }

    validateEmail = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateEmailSuperAdmin(value);
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    emailError: msg ? translate(msg) : msg,
                    companyEmail: value,
                }
            });
        }

        return !msg;
    }

    // Kiem tra thong tin da validated het chua?
    isFormValidated = () => {
        const { companyName, companyShortName, companyDescription, companyEmail } = this.state;
        let result = 
            this.validateName(companyName, false) &&
            this.validateShortName(companyShortName, false) &&
            this.validateDescription(companyDescription, false) &&
            this.validateEmail(companyEmail, false);

        return result;
    }

    render() { 
        const { translate } = this.props;
        const {
            // Phần edit nội dung của công ty
            companyName, 
            companyShortName, 
            companyDescription, 
            companyLog, 
            companyActive, 
            companyEmail, 
            nameError, 
            shortNameError, 
            descriptionError, 
            emailError,
        } = this.state;

        return ( 
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-company"
                    formID="form-edit-company" isLoading={this.props.company.isLoading}
                    title={translate('system_admin.company.edit')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-edit-company">
                        <div className="row">
                            <div className={`form-group col-sm-9 ${nameError===undefined?"":"has-error"}`}>
                                <label>{ translate('system_admin.company.table.name') }<span className="text-red"> * </span></label>
                                <input type="text" className="form-control" onChange={ this.handleChangeName } value={ companyName }/>
                                <ErrorLabel content={nameError}/>
                            </div>
                            <div className="form-group col-sm-3">
                                <label>{ translate('system_admin.company.table.service') }<span className="text-red"> * </span></label>
                                <select className="form-control" onChange={ this.handleActive } value={companyActive}>
                                    <option key='1' value={true}>{ translate('system_admin.company.on') }</option>
                                    <option key='2' value={false}>{ translate('system_admin.company.off') }</option>
                                </select>
                            </div>

                            <div className={`form-group col-sm-9 ${shortNameError===undefined?"":"has-error"}`}>
                                <label>{ translate('system_admin.company.table.short_name') }<span className="text-red"> * </span></label>
                                <input type="text" className="form-control" onChange={ this.handleChangeShortName } value={ companyShortName }/>
                                <ErrorLabel content={shortNameError}/>
                            </div>
                            <div className="form-group col-sm-3">
                                <label>{ translate('system_admin.company.table.log') }<span className="text-red"> * </span></label>
                                <select className="form-control" onChange={ this.handleLog } value={companyLog}>
                                    <option key='1' value={true}>{ translate('system_admin.company.on') }</option>
                                    <option key='2' value={false}>{ translate('system_admin.company.off') }</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.company.table.super_admin') }<span className="text-red"> * </span></label>
                            <input type="email" className="form-control" onChange={ this.handleChangeEmail } value={companyEmail}/>
                            <ErrorLabel content={emailError}/>
                        </div>
                        <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                            <label>{ translate('system_admin.company.table.description') }<span className="text-red"> * </span></label>
                            <textarea type="text" className="form-control" onChange={ this.handleChangeDescription } value={companyDescription}/>
                            <ErrorLabel content={descriptionError}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}

function mapState(state) {
    const { linksDefault } = state;
    return { linksDefault };
}
const action = {
    editCompany: CompanyActions.editCompany
}

const connectedCompanyEditForm = connect(mapState, action)(withTranslate(CompanyEditForm))
export { connectedCompanyEditForm as CompanyEditForm }