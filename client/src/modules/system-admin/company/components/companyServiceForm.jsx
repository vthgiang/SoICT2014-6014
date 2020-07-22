import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';

import { CompanyFormValidator } from './companyFormValidator';
import { CompanyManageLinks } from './companyManageLink';
import { CompanyManageComponent } from './companyManageComponent';

import { ErrorLabel, DialogModal, PaginateBar} from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class CompanyServicesForm extends Component {

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
            short_name: this.state.companyShortName, 
            log: this.state.companyLog, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            active: this.state.companyActive
        };

        if (this.isFormValidated()) {
            return this.props.edit( this.state.companyId, data );
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

        if (willUpdateState) {
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

        if (willUpdateState) {
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

        if (willUpdateState) {
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

        if (willUpdateState) {
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

    render() { 
        const { translate, systemLinks, systemComponents, company } = this.props;
        const {
            // Phần edit nội dung của công ty
            companyId,
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
                    modalID="modal-edit-services-company" size="75"
                    formID="form-edit-services-company" isLoading={this.props.company.isLoading}
                    title={translate('manage_company.service')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save} hasSaveButton={false}
                    disableSubmit={!this.isFormValidated()}
                >
                    <div role="tabpanel">
                        {/* Nav tabs */}
                        <ul className="nav nav-tabs" role="tablist">
                            <li role="presentation" className="active">
                            <a href="#company_manage_link" aria-controls="home" role="tab" data-toggle="tab"><b>Links</b>{`(${company.item.links.list.length}/${systemLinks.list.length})`}</a>
                            </li>
                            <li role="presentation">
                            <a href="#company_manage_component" aria-controls="tab" role="tab" data-toggle="tab"><b>Component</b>{`(${company.item.components.list.length}/${systemComponents.list.length})`}</a>
                            </li>
                        </ul>
                        
                        {/* Tab panes */}
                        <div className="tab-content">
                            <div role="tabpanel" className="tab-pane active" id="company_manage_link">
                                <CompanyManageLinks companyId={companyId}/>
                            </div>
                            <div role="tabpanel" className="tab-pane" id="company_manage_component">
                                <CompanyManageComponent companyId={companyId}/>
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
         );
    }
}

function mapState(state) {
    const { systemLinks, systemComponents, company } = state;
    return { systemLinks, systemComponents, company };
}
const action = {
    edit: CompanyActions.edit
}

const connectedCompanyServicesForm = connect(mapState, action)(withTranslate(CompanyServicesForm))
export { connectedCompanyServicesForm as CompanyServicesForm }