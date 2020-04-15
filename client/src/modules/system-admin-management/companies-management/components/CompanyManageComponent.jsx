import React, { Component } from 'react';import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ErrorLabel, PaginateBar, ActionColumn, SearchBar} from '../../../../common-components';
import { CompanyFormValidator } from './CompanyFormValidator';

class CompanyManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name',
            value: { $regex: '', $options: 'i' }
         }
    }

    render() { 
        const {translate, company} = this.props;
        const {companyId, componentNameError, componentDescriptionError} = this.state;

        return ( 
            <div style={{padding: '10px 0px 10px 0px'}}>
                <a className="btn btn-success pull-right" onClick={this.showCreateLinkForm}>Thêm</a>
                <SearchBar 
                    columns={[
                        { title: translate('manage_component.name'), value: 'name' },
                        { title: translate('manage_component.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <table className="table table-hover table-striped table-bordered" id="company-manage-component-table">
                    <thead>
                        <tr>
                            <th>{ translate('manage_component.name') }</th>
                            <th>{ translate('manage_component.description') }</th>
                            <th style={{width: '120px'}}>
                                {translate('table.action')}
                                <ActionColumn 
                                    tableId="company-manage-component-table"
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="add-new-component-default" style={{display: "none"}}>
                            <td className={componentNameError===undefined?"":"has-error"}>
                                <input className="form-control" onChange={this.handleName}/>
                                <ErrorLabel content={componentNameError}/>
                            </td>
                            <td className={componentDescriptionError===undefined?"":"has-error"}>
                                <input className="form-control" onChange={this.handleComponentDescription}/>
                                <ErrorLabel content={componentDescriptionError}/>
                            </td>
                            <td>
                                {
                                    this.isFormCreateLinkValidated() ?
                                    <a className="save" onClick={this.saveAndCloseLinkForm}><i className="material-icons">save</i></a>:
                                    <a className="cancel" onClick={this.closeCreateLinkForm}><i className="material-icons">cancel</i></a>
                                }
                            </td>
                        </tr> 
                        {
                            company.item.components.listPaginate.length > 0 ? 
                            company.item.components.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td>
                                        <a className="delete" onClick={() => this.deleteLink(companyId, component._id)}><i className="material-icons">delete</i></a>
                                    </td>
                                </tr> 
                            ) : (
                                company.item.components.isLoading ?
                                <tr><td colSpan='3'>{translate('confirm.loading')}</td></tr>:
                                <tr><td colSpan='3'>{translate('confirm.no_data')}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.item.components.totalPages} currentPage={company.item.components.page} func={this.setPage}/>
            </div>
         );
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.companyId !== prevState.companyId) {
            return {
                ...prevState,
                companyId: nextProps.companyId
            } 
        } else {
            return null;
        }
    }

    // Kiem tra thong tin da validated het chua?
    isFormCreateLinkValidated = () => {
        const {componentName, componentDescription, componentNameError, componentDescriptionError} = this.state;
        if(componentDescriptionError === undefined && componentNameError === undefined && componentName !== undefined && componentDescription !== undefined) return true;
        else return false; 
    }

    
    showCreateLinkForm = () => {
        window.$("#add-new-component-default").slideDown();
    }

    closeCreateLinkForm = () => {
        window.$("#add-new-component-default").slideUp();
    }

    saveAndCloseLinkForm = async() => {
        const {companyId, componentName, componentDescription} = this.state;
        
        await window.$("#add-new-component-default").slideUp();
        return this.props.addNewLink(companyId, {
            name: componentName,
            description: componentDescription
        });
    }

    deleteLink = (companyId, componentId) => {
        return this.props.deleteLink(companyId, componentId);
    }
    
    // Xu ly thay doi va validate cho url link moi cho cong ty
    handleName= (e) => {
        const value = e.target.value;
        this.validateComponentName(value, true);
    }

    validateComponentName = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateName(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    componentNameError: msg,
                    componentName: value,
                }
            });
        }
        return msg === undefined;
    }

    // Xu ly thay doi va validate cho description link của công ty
    handleComponentDescription= (e) => {
        const value = e.target.value;
        this.validateComponentDescription(value, true);
    }

    validateComponentDescription = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateDescription(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    componentDescriptionError: msg,
                    componentDescription: value,
                }
            });
        }
        return msg === undefined;
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async() => {
        const {companyId, limit, page, option, value} = this.state;
        const data = {};
        data[option] = value;
        await this.props.componentsPaginate(companyId, page, limit, data);
    }

    setPage = async (pageNumber) => {
        await this.setState({ page: pageNumber });
        const {limit, page, companyId, value, option} = this.state;
        const data = {};
        if(value !== null){
            data[option] = value;
        }
        await this.props.componentsPaginate(companyId, page, limit, data);
    }
    
    setLimit = async (number) => {
        await this.setState({ limit: number });
        const {limit, page, companyId, value, option} = this.state;
        const data = {};
        if(value !== null){
            data[option] = value;
        }
        await this.props.componentsPaginate(companyId, page, limit, data);
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    // addNewComponent: CompanyActions.addNewComponent,
    // deleteComponent: CompanyActions.deleteComponent,
    componentsList: CompanyActions.componentsList,
    componentsPaginate: CompanyActions.componentsPaginate
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyManageComponent) );