import React, { Component } from 'react';import { connect } from 'react-redux';

import { CompanyActions } from '../redux/actions';

import { PaginateBar, DataTableSetting, SearchBar} from '../../../../common-components';

import { withTranslate } from 'react-redux-multilingual';
class CompanyManageComponent extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            limit: 5,
            page: 1,
            option: 'name',
            value: ''
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.companyId !== prevState.companyId) {
            return {
                ...prevState,
                companyId: nextProps.companyId
            } 
        } else {
            return null;
        }
    }

    companyHasComponent = (componentName, companyComponents) => {
        let result = false;

        for (let i = 0; i < companyComponents.length; i++) {
            const component = companyComponents[i];
            if (componentName === component.name) {
                result = true;
                break;
            }
        }

        return result;
    }

    // Kiem tra thong tin da validated het chua?
    isFormCreateLinkValidated = () => {
        const { componentName } = this.state;

        if (componentName !== undefined) {
            return true;
        } else {
            return false; 
        }
    }

    showCreateComponentForm = () => {
        window.$("#add-new-component-default").slideDown();
    }

    closeCreateComponentForm = () => {
        window.$("#add-new-component-default").slideUp();
    }

    saveAndCloseComponentForm = async () => {
        const { companyId, componentName, componentLink, componentDescription } = this.state;
        
        await window.$("#add-new-component-default").slideUp();
        return this.props.addCompanyComponent(companyId, {
            name: componentName,
            link: componentLink,
            description: componentDescription
        });
    }

    deleteCompanyComponent = (companyId, componentId) => {
        return this.props.deleteCompanyComponent(companyId, componentId);
    }
    
    handleName= (e, systemComponents) => {
        const value = e.target.value;

        for (let index = 0; index < systemComponents.list.length; index++) {
            const systemComponent = systemComponents.list[index];

            if (value === systemComponent.name) {
                this.setState({
                    componentName: systemComponent.name,
                    componentLink: systemComponent.url,
                    componentDescription: systemComponent.description
                });
            }
        }
    }
    
    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async () => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };

        await this.props.getCompanyComponents(this.state.companyId, data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };

        this.props.getCompanyComponents(this.state.companyId, data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });

        const data = { 
            limit: number, 
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };

        this.props.getCompanyComponents(this.state.companyId, data);
    }

    render() { 
        const { translate, company, systemComponents } = this.props;
        const { companyId, componentDescriptionError } = this.state;

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
                                    onChange={(e)=>this.handleName(e, systemComponents)}
                                    value={this.state.componentName}
                                >
                                    <option key="noname" value="noname"> --- Chọn component ---</option>
                                    {
                                        systemComponents.list.map(systemComponent => 
                                        <option 
                                            key={systemComponent._id} 
                                            value={systemComponent.name}
                                            disabled={this.companyHasComponent(systemComponent.name, company.item.components.list)}
                                        >{systemComponent.name}</option>)
                                    }
                                </select>
                            </td>
                            <td>{this.state.componentLink}</td>
                            <td>{this.state.componentDescription}</td>
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
                            company.item.components.listPaginate.map(component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.link ? component.link.url : null}</td>
                                    <td>{ component.description }</td>
                                    <td>
                                        <a className="delete" onClick={() => this.deleteCompanyComponent(companyId, component._id)}><i className="material-icons">delete</i></a>
                                    </td>
                                </tr> 
                            ) : (
                                company.item.components.isLoading ?
                                <tr><td colSpan='4'>{translate('confirm.loading')}</td></tr>:
                                <tr><td colSpan='4'>{translate('confirm.no_data')}</td></tr>
                            )
                        }
                    </tbody>
                </table>

                {/* Paginate Bar */}
                <PaginateBar pageTotal={company.item.components.totalPages} currentPage={company.item.components.page} func={this.setPage}/>
            </div>
         );
    }
}

function mapState(state) {
    const { company, systemComponents } = state;
    return { company, systemComponents };
}
const action = {
    addCompanyComponent: CompanyActions.addCompanyComponent,
    deleteCompanyComponent: CompanyActions.deleteCompanyComponent,
    getCompanyComponents: CompanyActions.getCompanyComponents,
}

const connectedCompanyManageComponent = connect(mapState, action)(withTranslate(CompanyManageComponent))
export { connectedCompanyManageComponent as CompanyManageComponent }