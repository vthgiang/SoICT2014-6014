import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ComponentDefaultActions } from '../redux/actions';
import ComponentInfoForm from './componentInfoForm';
import { PaginateBar, DataTableSetting, DeleteNotification, SearchBar } from '../../../../common-components';
import ComponentCreateForm from './componentCreateForm';
import { LinkDefaultActions } from '../../system-link/redux/actions';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: { $regex: '', $options: 'i' }
        }
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (component) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: component
            }
        });
        window.$('#modal-edit-component-default').modal('show');
    }

    componentDidMount(){
        this.props.getLinks();
        this.props.get();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit})
    }

    render() { 
        const { componentsDefault, translate } = this.props;
        const { currentRow } = this.state;
        return ( 
            <React.Fragment>
                <ComponentCreateForm />
                {
                    currentRow !== undefined &&
                    <ComponentInfoForm
                        componentId={ currentRow._id }
                        componentName={ currentRow.name }
                        componentDescription={ currentRow.description }
                        componentLink={ currentRow.link._id }
                        componentRoles={ currentRow.roles.map(role => role._id) }
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

                <table className="table table-hover table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>{ translate('manage_component.name') }</th>
                            <th>{ translate('manage_component.description') }</th>
                            <th>{ translate('manage_component.link') }</th>
                            <th>{ translate('manage_component.roles') }</th>
                            <th style={{width: "120px"}}>
                                { translate('table.action') }
                                <DataTableSetting 
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            componentsDefault.listPaginate.length > 0 ?
                            componentsDefault.listPaginate.map( component => 
                                <tr key={component._id}>
                                    <td>{ component.name }</td>
                                    <td>{ component.description }</td>
                                    <td>{component.link.url}</td>
                                    <td>{ component.roles.map((role, i, arr) => {
                                        if(i !== arr.length - 1)
                                            return <span key={role._id}>{role.name}, </span>
                                        else
                                            return <span key={role._id}>{role.name}</span> 
                                    }) }</td>
                                    <td style={{ textAlign: 'center'}}>
                                        <a onClick={() => this.handleEdit(component)} className="edit" title={translate('manage_component.edit')}><i className="material-icons">edit</i></a>
                                        <DeleteNotification 
                                            content={translate('manage_component.delete')}
                                            data={{
                                                id: component._id,
                                                info: component.name
                                            }}
                                            func={this.props.destroy}
                                        />
                                    </td>
                                </tr>
                            ): componentsDefault.isLoading ?
                            <tr><td colSpan={"5"}>{translate('confirm.loading')}</td></tr> : 
                            <tr><td colSpan={"5"}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={componentsDefault.totalPages} currentPage={componentsDefault.page} func={this.setPage}/>
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
            page: 1
        };
        data[this.state.option] = this.state.value;
        await this.props.getPaginate(data);
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        const data = { limit: number, page: this.state.page };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
}
 
const mapState = state => state;
const getState = {
    get: ComponentDefaultActions.get,
    destroy: ComponentDefaultActions.destroy,
    getPaginate: ComponentDefaultActions.getPaginate,
    getLinks: LinkDefaultActions.get,
}
 
export default connect(mapState, getState) (withTranslate(TableComponent));