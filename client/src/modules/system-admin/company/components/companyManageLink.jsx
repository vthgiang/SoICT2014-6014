import React, { Component } from 'react';import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ErrorLabel, PaginateBar, DataTableSetting, SearchBar} from '../../../../common-components';
import { CompanyFormValidator } from './companyFormValidator';

class CompanyManageLinks extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            linkUrl: "noturl",
            limit: 5,
            page: 1,
            option: 'url',
            value: { $regex: '', $options: 'i' }
         }
    }

    render() { 
        const {translate, company, linksDefault} = this.props;
        const {companyId, linkDescriptionError} = this.state;
        
        return ( 
            <div style={{padding: '10px 0px 10px 0px'}}>
                <a className="btn btn-success pull-right" onClick={this.showCreateLinkForm}>Thêm</a>
                <SearchBar 
                    columns={[
                        { title: translate('manage_link.url'), value: 'url' },
                        { title: translate('manage_link.description'), value: 'description' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                <table className="table table-hover table-striped table-bordered" id="company-manage-link-table">
                    <thead>
                        <tr>
                            <th>{ translate('manage_link.url') }</th>
                            <th>{ translate('manage_link.description') }</th>
                            <th style={{width: '120px'}}>
                                {translate('table.action')}
                                <DataTableSetting 
                                    tableId="company-manage-link-table"
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="add-new-link-default" style={{display: "none"}}>
                            <td>
                                <select
                                    className="form-control"
                                    style={{width: '100%'}}
                                    onChange={this.handleLinkUrl}
                                    value={this.state.linkUrl}
                                >
                                    <option key="noturl" value="noturl" disabled> --- Chọn url ---</option>
                                    {
                                        linksDefault.list.map(linkDefault => 
                                        <option 
                                            key={linkDefault._id} 
                                            value={linkDefault.url}
                                            disabled={this.companyHasLink(linkDefault.url, company.item.links.list)}
                                        >{linkDefault.url}</option>)
                                    }
                                </select>
                            </td>
                            <td className={linkDescriptionError===undefined?"":"has-error"}>
                                <input className="form-control" onChange={this.handleLinkDescription}/>
                                <ErrorLabel content={linkDescriptionError}/>
                            </td>
                            <td>
                                {
                                    this.isFormCreateLinkValidated() ?
                                    <a className="save" onClick={this.saveAndCloseLinkForm}><i className="material-icons">save</i></a>:
                                    <a className="delete" onClick={this.closeCreateLinkForm}><i className="material-icons">delete</i></a>
                                }
                            </td>
                        </tr> 
                        {
                            company.item.links.listPaginate.length > 0 ? 
                            company.item.links.listPaginate.map( link => 
                                <tr key={link._id}>
                                    <td>{ link.url }</td>
                                    <td>{ link.description }</td>
                                    <td>
                                        <a className="delete" onClick={() => this.deleteLink(companyId, link._id)}><i className="material-icons">delete</i></a>
                                    </td>
                                </tr> 
                            ) : (
                                company.item.links.isLoading ?
                                <tr><td colSpan='3'>{translate('confirm.loading')}</td></tr>:
                                <tr><td colSpan='3'>{translate('confirm.no_data')}</td></tr>
                            )
                        }
                    </tbody>
                </table>
                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.item.links.totalPages} currentPage={company.item.links.page} func={this.setPage}/>
            </div>
         );
    }
    
    companyHasLink = (linkUrl, companyLinks) => {
        let result = false;
        for (let i = 0; i < companyLinks.length; i++) {
            const link = companyLinks[i];
            if(linkUrl === link.url){
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
        const {linkUrl, linkDescription, linkDescriptionError} = this.state;
        if(linkDescriptionError === undefined && linkUrl !== undefined && linkDescription !== undefined){
            if(linkUrl !== 'noturl') return true;
            else return false;
        }
        else return false; 
    }

    
    showCreateLinkForm = () => {
        window.$("#add-new-link-default").slideDown();
    }

    closeCreateLinkForm = () => {
        window.$("#add-new-link-default").slideUp();
    }

    saveAndCloseLinkForm = async() => {
        const {companyId, linkUrl, linkDescription} = this.state;
        
        await window.$("#add-new-link-default").slideUp();
        return this.props.addNewLink(companyId, {
            url: linkUrl,
            description: linkDescription
        });
    }

    deleteLink = (companyId, linkId) => {
        return this.props.deleteLink(companyId, linkId);
    }
    
    // Xu ly thay doi va validate cho url link moi cho cong ty
    handleLinkUrl= (e) => {
        const value = e.target.value;
        this.setState({
            linkUrl: value
        });
    }

    // Xu ly thay doi va validate cho description link của công ty
    handleLinkDescription= (e) => {
        const value = e.target.value;
        this.validateLinkDescription(value, true);
    }

    validateLinkDescription = (value, willUpdateState=true) => {
        let msg = CompanyFormValidator.validateDescription(value);
        if (willUpdateState){
            this.setState(state => {
                return {
                    ...state,
                    linkDescriptionError: msg,
                    linkDescription: value,
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
        await this.props.linksPaginate(companyId, page, limit, data);
    }

    setPage = async (pageNumber) => {
        await this.setState({ page: pageNumber });
        const {limit, page, companyId, value, option} = this.state;
        const data = {};
        if(value !== null){
            data[option] = value;
        }
        await this.props.linksPaginate(companyId, page, limit, data);
    }
    
    setLimit = async (number) => {
        await this.setState({ limit: number });
        const {limit, page, companyId, value, option} = this.state;
        const data = {};
        if(value !== null){
            data[option] = value;
        }
        await this.props.linksPaginate(companyId, page, limit, data);
    }
}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    addNewLink: CompanyActions.addNewLink,
    deleteLink: CompanyActions.deleteLink,
    linksList: CompanyActions.linksList,
    linksPaginate: CompanyActions.linksPaginate,
    componentsList: CompanyActions.componentsList,
    componentsPaginate: CompanyActions.componentsPaginate
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyManageLinks) );