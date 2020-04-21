import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { LinkDefaultActions } from '../../system-link/redux/actions';
import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components';
import { CompanyFormValidator } from './companyFormValidator';

class CompanyCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            short_name: null,
            description: null,
            email: null,
            linkDefaultArr: []
        }
    }

    render() { 
        const { translate, linksDefault } = this.props;
        const {
            // Phần edit nội dung của công ty
            nameError, 
            shortNameError, 
            descriptionError, 
            emailError,
        } = this.state;

        return ( 
            <React.Fragment>
                <ButtonModal modalID="modal-create-company" button_name={translate('manage_company.add')} title={translate('manage_company.add_title')}/>
                <DialogModal
                    modalID="modal-create-company" size="75"
                    formID="form-create-company" isLoading={this.props.company.isLoading}
                    title={translate('manage_company.add_title')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-company">
                        <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${nameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeName }/>
                                    <ErrorLabel content={nameError}/>
                                </div>
                                <div className={`form-group ${shortNameError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" onChange={ this.handleChangeShortName }/>
                                    <ErrorLabel content={shortNameError}/>
                                </div>
                                <div className={`form-group ${emailError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" onChange={ this.handleChangeEmail }/>
                                    <ErrorLabel content={emailError}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className={`form-group ${descriptionError===undefined?"":"has-error"}`}>
                                    <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '182px' }}  type="text" className="form-control" onChange={ this.handleChangeDescription }/>
                                    <ErrorLabel content={descriptionError}/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{minHeight: '300px'}}>
                                    <legend className="scheduler-border">Các trang được truy cập</legend>
                                    <table className="table table-hover table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>{ translate('manage_link.url') }</th>
                                                <th>{ translate('manage_link.description') }</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                linksDefault.list.length > 0 ? linksDefault.list.map( link => 
                                                    <tr key={link._id}>
                                                        <td>
                                                            <input 
                                                                type="checkbox" 
                                                                value={link._id} 
                                                                onChange={this.handleCheckbox} 
                                                                checked={this.checkedCheckbox(link._id, this.state.linkDefaultArr)}
                                                            />
                                                        </td>
                                                        <td>{ link.url }</td>
                                                        <td>{ link.description }</td>
                                                    </tr> 
                                                ): linksDefault.isLoading ?
                                                <tr><td colSpan={4}>Loading...</td></tr>:
                                                <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
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
    
    checkCheckBoxAll = (arr) => {
        if(arr.length > 0 && arr.length === this.state.linkDefaultArr.length){
            return true;
        }
        else{
            return false;
        };
    }

    checkedCheckbox = (item, arr) => {
        var index = arr.indexOf(item);
        if(index !== -1){
            return true;
        }
        else{
            return false;
        }
    }

    checkAll = (e) => {
        const {checked} = e.target;
        if(checked){
            this.setState({
                linkDefaultArr: this.props.linksDefault.list.map(link => link._id)
            })
        }else{
            this.setState({
                linkDefaultArr: []
            })
        }
    }

    handleCheckbox = (e) => {
        const {value, checked} = e.target;
        if(checked){
            this.setState({
                linkDefaultArr: [
                    ...this.state.linkDefaultArr,
                    value
                ]
            });
        } 
        else{
            const arr = this.state.linkDefaultArr;
            const index = arr.indexOf(value);
            arr.splice(index,1);
            this.setState({
                linkDefaultArr: arr
            })
        }
    }

    save = () => {
        const company = {
            name: this.state.companyName, 
            short_name: this.state.companyShortName, 
            description: this.state.companyDescription, 
            email: this.state.companyEmail, 
            links: this.state.linkDefaultArr
        };
        if(this.isFormValidated()) return this.props.create(company);
    }

    componentDidMount() {
        this.props.getLinksDefault();
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
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    create: CompanyActions.create,
    getLinksDefault: LinkDefaultActions.get
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyCreateForm) );