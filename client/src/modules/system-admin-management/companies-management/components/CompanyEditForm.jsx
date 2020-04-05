import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ModalButton, ModalDialog} from '../../../../common-components';

class CompanyEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.companyID,
            name: this.props.companyName,
            short_name: this.props.companyShortName,
            log: this.props.comLog,
            description: this.props.companyDescription
        }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = () => {
        const { id, name, short_name, log, description } = this.state;
        const data = { id, name, short_name, log, description, active:null };

        return this.props.edit( this.props.companyID, data );
    }

    render() { 
        const { translate, companyID, companyName, companyShortName, comLog, companyDescription } = this.props;
       
        return ( 
            <React.Fragment>
                <ModalButton modalID={`modal-edit-company-${companyID}`} button_type="edit" button_name={translate('manage_company.add')} title={translate('manage_company.edit')}/>
                <ModalDialog
                    modalID={`modal-edit-company-${companyID}`} type="edit" size="100"
                    formID={`form-edit-company-${companyID}`} isLoading={this.props.company.isLoading}
                    title={translate('manage_company.edit')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save}
                >
                    <form id={`form-edit-company-${companyID}`}>
                    <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ companyName }/>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-9">
                                        <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                                        <input type="text" className="form-control" name="short_name" onChange={ this.inputChange } defaultValue={ companyShortName }/>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label>{ translate('manage_company.log') }<span className="text-red"> * </span></label>
                                        <select className="form-control" name="log" onChange={ this.inputChange } defaultValue={comLog}>
                                            <option key='1' value={true}>{ translate('manage_company.on') }</option>
                                            <option key='2' value={false}>{ translate('manage_company.off') }</option>
                                        </select>
                                    </div>
                                </div>
                                {/* <div className="form-group">
                                    <label>{ translate('manage_company.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" name="email" onChange={ this.inputChange } defaultValue={companyDescription}/>
                                </div> */}
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '177px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange }defaultValue={companyDescription}/>
                                </div>
                            </div>
                            {/* <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <fieldset className="scheduler-border" style={{minHeight: '300px'}}>
                                    <legend className="scheduler-border">Các trang được truy cập</legend>
                                    <table className="table table-hover table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{width: '32px'}}>
                                                    <input type="checkbox" onChange={this.checkAll} defaultChecked={this.checkCheckBoxAll(this.props.linksDefault.list.map(link => link._id))}/>
                                                </th>
                                                <th>{ translate('manage_link.url') }</th>
                                                <th>{ translate('manage_link.description') }</th>
                                                <th>{ translate('manage_link.roles') }</th>
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
                                                        <td>
                                                            { 
                                                            link.roles.map((role, index, arr) => {
                                                                if(index !== arr.length - 1)
                                                                    return <span key={role._id}>{role.name}, </span>
                                                                else
                                                                    return <span key={role._id}>{role.name}</span>
                                                                }) 
                                                            }
                                                        </td>
                                                    </tr> 
                                                ): linksDefault.isLoading ?
                                                <tr><td colSpan={4}>Loading...</td></tr>:
                                                <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div> */}
                        </div>


                        {/* <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ companyName }/>
                                </div>
                                <div className="row">
                                    <div className="form-group col-sm-9">
                                        <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                                        <input type="text" className="form-control" name="short_name" onChange={ this.inputChange } defaultValue={ companyShortName }/>
                                    </div>
                                    <div className="form-group col-sm-3">
                                        <label>{ translate('manage_company.log') }<span className="text-red"> * </span></label>
                                        <select className="form-control" name="log" onChange={ this.inputChange } defaultValue={comLog}>
                                            <option key='1' value={true}>{ translate('manage_company.on') }</option>
                                            <option key='2' value={false}>{ translate('manage_company.off') }</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                                    <textarea  style={{ height: '250px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange } defaultValue={ companyDescription }/>
                                </div>
                            </div>
                        </div> */}
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps =  {
    edit: CompanyActions.edit
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyEditForm) );