import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentActions } from '../redux/actions';
import ComponentInfoForm from './componentInfoForm';
import { PaginateBar, DataTableSetting, SearchBar, ToolTip } from '../../../../common-components';
import { LinkActions } from '../../link/redux/actions';
import { RoleActions } from '../../role/redux/actions';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: ''
        }
    }

    componentDidMount(){
        this.props.getLinks();
        this.props.get();
        this.props.get({page: this.state.page, limit: this.state.limit});
        this.props.getRoles();
    }

    render() { 
        const { component, translate } = this.props;
        const { currentRow } = this.state;
        return ( 
            <React.Fragment>
                {
                    currentRow !== undefined &&
                    <ComponentInfoForm 
                        componentId={ currentRow._id }
                        componentName={ currentRow.name }
                        componentLink={ currentRow.link ? currentRow.link._id : null }
                        componentDescription={ currentRow.description }
                        componentRoles={ currentRow.roles.map(role => role.roleId._id) }
                    />
                }
                <SearchBar 
                    columns={[
                        { title: translate('manage_component.name'), value:'name' },
                        { title: translate('manage_component.description'), value:'description' },
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                
                <table className="table table-hover table-striped table-bordered" id="table-manage-component">
                    <thead>
                        <tr>
                            <th>{ translate('manage_component.name') }</th>
                            <th>{ translate('manage_component.link') }</th>
                            <th>{ translate('manage_component.description') }</th>
                            <th>{ translate('manage_component.roles') }</th>
                            <th style={{width: "120px"}}>
                                { translate('table.action') }
                                <DataTableSetting 
                                    columnArr={[
                                        translate('manage_component.name'),
                                        translate('manage_component.link'),
                                        translate('manage_component.description'),
                                        translate('manage_component.roles')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-component"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            component.listPaginate.length > 0 ?
                            component.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.link ? component.link.url : null }</td>
                                    <td>{ component.description }</td>
                                    <td><ToolTip dataTooltip={component.roles.map(role => role.roleId.name)}/></td>
                                    <td style={{ textAlign: 'center'}}>
                                        <a className="edit" onClick={() => this.handleEdit(component)}><i className="material-icons">edit</i></a>
                                    </td>
                                </tr>
                            ): component.isLoading ?
                            <tr><td colSpan={"5"}>{translate('confirm.loading')}</td></tr>:
                            <tr><td colSpan={"5"}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={component.totalPages} currentPage={component.page} func={this.setPage}/>
            </React.Fragment>
         );
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1,
            key: this.state.option,
            value: this.state.value
        };
        await this.props.get(data);
    }

    setPage = (page) => {
        this.setState({ page });
        const data = {
            limit: this.state.limit,
            page: page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.get(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = { 
            limit: number, 
            page: this.state.page,
            key: this.state.option,
            value: this.state.value
        };
        this.props.get(data);
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (component) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: component
            }
        });

        window.$('#modal-edit-component').modal('show');
    }
}
 
const mapState = state => state;
const getState = {
    get: ComponentActions.get,
    destroy: ComponentActions.destroy,
    getLinks: LinkActions.get,
    getRoles: RoleActions.get
}
 
export default connect(mapState, getState) (withTranslate(TableComponent));