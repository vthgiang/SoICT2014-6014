import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { LinkDefaultActions } from '../../links-default-management/redux/actions';
import { ModalButton, ModalDialog } from '../../../../common-components';

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
        this.inputChange = this.inputChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.checkCheckBoxAll = this.checkCheckBoxAll.bind(this);
        this.checkedCheckbox = this.checkedCheckbox.bind(this);
        this.checkAll = this.checkAll.bind(this);
        this.save = this.save.bind(this);
    }

    checkCheckBoxAll = (arr) => {
        if(arr.length > 0 && arr.length === this.state.linkDefaultArr.length){
            return true;
        }
        else{
            console.log("CHECK ALL FALSE");
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

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = () => {
        const { name, short_name, description, email, linkDefaultArr } = this.state;
        const company = { name, short_name, description, email, links: linkDefaultArr };
        this.setState({
            linkDefaultArr: []
        });
        return this.props.create( company );
    }

    componentDidMount() {
        this.props.getLinksDefault();
    }

    render() { 
        const { translate, linksDefault } = this.props;
        console.log("LINK ARR: ", this.state.linkDefaultArr);

        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-company" button_name={translate('manage_company.add')} title={translate('manage_company.add_title')}/>
                <ModalDialog
                    modalID="modal-create-company" size="100"
                    formID="form-create-company" isLoading={this.props.company.isLoading}
                    title={translate('manage_company.add_title')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-company">
                        <div className="row" style={{padding: '20px'}}>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                                    <input type="text" className="form-control" name="short_name" onChange={ this.inputChange }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manage_company.super_admin') }<span className="text-red"> * </span></label>
                                    <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                                    <textarea style={{ height: '182px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange }/>
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
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
                            </div>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
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