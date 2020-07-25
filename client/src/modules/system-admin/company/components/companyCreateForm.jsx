import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';
import { SystemLinkActions } from '../../system-link/redux/actions';

import { CompanyFormValidator } from './companyFormValidator';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class CompanyCreateForm extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            companyName: "",
            companyShortName: "",
            companyDescription: "",
            companyEmail: "",
            linkDefaultArr: []
        }
    }

    componentDidMount() {
        this.props.getAllSystemLinks();
    }

    checkCheckBoxAll = (arr) => {
        if (arr.length > 0 && arr.length === this.state.linkDefaultArr.length) {
            return true;
        } else {
            return false;
        }
    }

    checkedCheckbox = (item, arr) => {
        let index = arr.indexOf(item);

        if (index !== -1) {
            return true;
        } else {
            return false;
        }
    }

    checkAll = async (e) => {
        const {checked} = e.target;
        const { systemLinks } = this.props;

        if (checked) {
            await this.setState({
                linkDefaultArr: systemLinks.list.map(link => link._id)
            })
        } else { 
            this.setState({
                linkDefaultArr: []
            })
        } 
    }

    handleCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            this.setState({
                linkDefaultArr: [
                    ...this.state.linkDefaultArr,
                    value
                ]
            });
        } else {
            const arr = this.state.linkDefaultArr;
            const index = arr.indexOf(value);

            arr.splice(index,1);
            this.setState({
                linkDefaultArr: arr
            })
        }
    }

    /**
     * Hàm xử lý khi chọn theo danh mục
     */
    handleCategoryCheckbox = async (e, link) => {
        const { value, checked } = e.target;
        const { systemLinks } = this.props;

        if (checked) {
            for (const element of systemLinks.list) {
                if (element.category === link.category) {
                    // Nếu phần tử đó chưa tồn tại thì mới thêm vào state
                    if (this.state.linkDefaultArr.indexOf(element._id) === -1){
                        await this.setState({
                            linkDefaultArr: [
                                ...this.state.linkDefaultArr,
                                element._id
                            ]
                        });
                    }
                }
            }
        } else {
            for (const element of systemLinks.list) {
                if (element.category === link.category) {
                    const arr = this.state.linkDefaultArr;
                    const index = arr.indexOf(element._id);

                    arr.splice(index,1);
                    await this.setState({
                        linkDefaultArr: arr
                    })
                }
            }
        }
    }

    save = () => {
        console.log(this.state.linkDefaultArr);
        
        const company = {
            name: this.state.companyName, 
            shortName: this.state.companyShortName, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            links: this.state.linkDefaultArr
        };

        if (this.isFormValidated()) return this.props.createCompany(company);
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
                    nameError: msg !== undefined ? translate(msg) : msg,
                    companyName: value,
                }
            });
        }

        return msg === undefined;
    }

    // Xu ly thay doi va validate shortName cong ty
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
                    shortNameError: msg !== undefined ? translate(msg) : msg,
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
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    descriptionError: msg !== undefined ? translate(msg) : msg,
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
        const { translate } = this.props;

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    emailError: msg !== undefined ? translate(msg) : msg,
                    companyEmail: value,
                }
            });
        }

        return msg === undefined;
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
        const { translate, systemLinks, company } = this.props;
        const {
            // Phần edit nội dung của công ty
            nameError, 
            shortNameError, 
            descriptionError, 
            emailError,
        } = this.state;

        let list = [];
        let category;

        for (let i = 0; i < systemLinks.list.length; i++) {
            const element = systemLinks.list[i];
            
            if (element.category !== category){
                const group = {
                    _id: i,
                    category: element.category,
                    isGroup: true,
                }

                list.push(group);
                category = element.category;
            }

            list.push(element);
        }

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-company" button_name={translate('general.add')} title={translate('system_admin.company.add')}/>
                
                <DialogModal
                    modalID="modal-create-company" size="75"
                    formID="form-create-company" isLoading={company.isLoading}
                    title={translate('system_admin.company.add')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-create-company">
                        <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${nameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeName }/>
                                    <ErrorLabel content={nameError}/>
                                </div>
                                <div className={`form-group ${shortNameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.short_name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeShortName }/>
                                    <ErrorLabel content={shortNameError}/>
                                </div>
                                <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" onChange={ this.handleChangeEmail }/>
                                    <ErrorLabel content={emailError}/>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                                    <label>{ translate('system_admin.company.table.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '182px' }}  type="text" className="form-control" onChange={ this.handleChangeDescription }/>
                                    <ErrorLabel content={descriptionError}/>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{minHeight: '300px'}}>
                                    <legend className="scheduler-border">{ translate('system_admin.company.service') }</legend>
                                    
                                    <table className="table table-hover table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: '32px'}} className="col-fixed">
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={this.checkAll} 
                                                    />
                                                </th>
                                                <th>{ translate('system_admin.system_link.table.category') }</th>
                                                <th>{ translate('system_admin.system_link.table.url') }</th>
                                                <th>{ translate('system_admin.system_link.table.description') }</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {
                                                list.length > 0 ? list.map( link => 
                                                    link.isGroup ?
                                                        <tr key={link._id}>
                                                            <td>
                                                                <input 
                                                                    type="checkbox" 
                                                                    value={link._id} 
                                                                    onChange={ (e) => this.handleCategoryCheckbox(e, link) } 
                                                                />
                                                            </td>
                                                            <td>{ link.category }</td>
                                                            <td>{ link.url }</td>
                                                            <td>{ link.description }</td>
                                                        </tr>
                                                    :
                                                        <tr key={link._id}>
                                                            <td>
                                                                <input 
                                                                    type="checkbox" 
                                                                    value={link._id} 
                                                                    onChange={this.handleCheckbox} 
                                                                    checked={this.checkedCheckbox(link._id, this.state.linkDefaultArr)}
                                                                />
                                                            </td>
                                                            <td>{ link.category }</td>
                                                            <td>{ link.url }</td>
                                                            <td>{ link.description }</td>
                                                        </tr> 
                                                ): systemLinks.isLoading ?
                                                <tr><td colSpan={4}>{translate('general.loading')}</td></tr>:
                                                <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
         );
    }
}
 
function mapState(state) {
    const { systemLinks, company } = state;
    return { systemLinks, company };
}
const action = {
    createCompany: CompanyActions.createCompany,
    getAllSystemLinks: SystemLinkActions.getAllSystemLinks
}

const connectedCompanyCreateForm = connect(mapState, action)(withTranslate(CompanyCreateForm))
export { connectedCompanyCreateForm as CompanyCreateForm }