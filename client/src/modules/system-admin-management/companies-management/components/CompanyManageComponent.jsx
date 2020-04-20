import React, { Component } from 'react';import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ErrorLabel, PaginateBar, DataTableSetting, SearchBar} from '../../../../common-components';
import { CompanyFormValidator } from './CompanyFormValidator';

class CompanyManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            componentName: 'noname',
            componentLink: 'nolink',
            limit: 5,
            page: 1,
            option: 'name',
            value: { $regex: '', $options: 'i' }
         }
    }

    render() { 
        const {translate, company, componentsDefault} = this.props;
        const {companyId, componentDescriptionError} = this.state;

        return ( 
            <div style={{padding: '10px 0px 10px 0px'}}>
                <a className="btn btn-success pull-right" onClick={this.showCreateComponentForm}>Thêm</a>
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
                            <th>{ translate('manage_component.link') }</th>
                            <th>{ translate('manage_component.description') }</th>
                            <th style={{width: '120px'}}>
                                {translate('table.action')}
                                <DataTableSetting 
                                    tableId="company-manage-component-table"
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="add-new-component-default" style={{display: "none"}}>
                            <td>
                                <select
                                    className="form-control"
                                    style={{width: '100%'}}
                                    onChange={this.handleName}
                                    value={this.state.componentName}
                                >
                                    <option key="noname" value="noname" disabled> --- Chọn component ---</option>
                                    {
                                        componentsDefault.list.map(componentDefault => 
                                        <option 
                                            key={componentDefault._id} 
                                            value={componentDefault.name}
                                            disabled={this.companyHasComponent(componentDefault.name, company.item.components.list)}
                                        >{componentDefault.name}</option>)
                                    }
                                </select>
                            </td>
                            <td>
                                <select
                                    className="form-control"
                                    style={{width: '100%'}}
                                    onChange={this.handleLink}
                                    value={this.state.componentLink}
                                >
                                    <option key="nolink" value="nolink" disabled> --- Chọn trang ---</option>
                                    {
                                        company.item.links.list.map(link => 
                                        <option 
                                            key={link._id} 
                                            value={link._id}
                                        >{link.url}</option>)
                                    }
                                </select>
                            </td>
                            <td className={componentDescriptionError===undefined?"":"has-error"}>
                                <input className="form-control" onChange={this.handleComponentDescription}/>
                                <ErrorLabel content={componentDescriptionError}/>
                            </td>
                            <td>
                                {
                                    this.isFormCreateLinkValidated() ?
                                    <a className="save" onClick={this.saveAndCloseComponentForm}><i className="material-icons">save</i></a>:
                                    <a className="delete" onClick={this.closeCreateComponentForm}><i className="material-icons">delete</i></a>
                                }
                            </td>
                        </tr> 
                        {
                            company.item.components.listPaginate.length > 0 ? 
                            company.item.components.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.link !== undefined ? component.link.url : null}</td>
                                    <td>{ component.description }</td>
                                    <td>
                                        <a className="delete" onClick={() => this.deleteComponent(companyId, component._id)}><i className="material-icons">delete</i></a>
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
    
    companyHasComponent = (componentName, companyComponents) => {
        let result = false;
        for (let i = 0; i < companyComponents.length; i++) {
            const component = companyComponents[i];
            if(componentName === component.name){
                result = true;
                break;
            }
        }

        return result;
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
        const {componentName, componentDescription, componentDescriptionError} = this.state;
        if(componentDescriptionError === undefined && componentName !== "noname" && componentDescription !== undefined) return true;
        else return false; 
    }

    
    showCreateComponentForm = () => {
        window.$("#add-new-component-default").slideDown();
    }

    closeCreateComponentForm = () => {
        window.$("#add-new-component-default").slideUp();
    }

    saveAndCloseComponentForm = async() => {
        const {companyId, componentName, componentLink, componentDescription} = this.state;
        
        await window.$("#add-new-component-default").slideUp();
        return this.props.addNewComponent(companyId, {
            name: componentName,
            link: componentLink,
            description: componentDescription
        });
    }

    deleteComponent = (companyId, componentId) => {
        return this.props.deleteComponent(companyId, componentId);
    }
    
    handleName= (e) => {
        const value = e.target.value;
        this.setState({componentName: value});
    }

    handleLink= (e) => {
        const value = e.target.value;
        this.setState({componentLink: value});
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
    addNewComponent: CompanyActions.addNewComponent,
    deleteComponent: CompanyActions.deleteComponent,
    componentsList: CompanyActions.componentsList,
    componentsPaginate: CompanyActions.componentsPaginate
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyManageComponent) );