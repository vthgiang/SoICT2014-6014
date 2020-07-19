import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LinkDefaultActions } from '../redux/actions';
import LinkInfoForm from './linkInfoForm';
import CreateLinkForm from './linkCreateForm';
import { SearchBar, DataTableSetting, PaginateBar, DeleteNotification, ModalEditButton } from '../../../../common-components';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'url', //mặc định tìm kiếm theo tên
            value: ''
        }
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (link) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: link
            }
        });
        window.$('#modal-edit-link-default').modal('show');
    }

    render() { 
        const { translate, linksDefault } = this.props;
        const {currentRow} = this.state;
        
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <CreateLinkForm/>
                        {
                            currentRow !== undefined &&
                            <LinkInfoForm
                                linkId={currentRow._id}
                                linkUrl={currentRow.url}
                                linkCategory={currentRow.category}
                                linkDescription={currentRow.description}
                                linkRoles={currentRow.roles.map(role => role._id)}
                            />
                        }
                        <SearchBar 
                            columns={[
                                { title: translate('system_admin.system_link.table.url'), value:'url' },
                                { title: translate('system_admin.system_link.table.category'), value:'category' },
                                { title: translate('system_admin.system_link.table.description'), value:'description' },
                            ]}
                            option={this.state.option}
                            setOption={this.setOption}
                            search={this.searchWithOption}
                        />
                        
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{ translate('system_admin.system_link.table.url') }</th>
                                    <th>{ translate('system_admin.system_link.table.category') }</th>
                                    <th>{ translate('system_admin.system_link.table.description') }</th>
                                    <th>{ translate('system_admin.system_link.table.roles') }</th>
                                    <th style={{width: "120px"}}>
                                        { translate('table.action') }
                                        <DataTableSetting 
                                            columnName={translate('table.action')} 
                                            columnArr={[
                                                translate('system_admin.system_link.table.url'),
                                                translate('system_admin.system_link.table.category'),
                                                translate('system_admin.system_link.table.description'),
                                                translate('system_admin.system_link.table.roles')
                                            ]}
                                            setLimit={this.setLimit}
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    linksDefault.listPaginate.length > 0 ? linksDefault.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.category }</td>
                                            <td>{ link.description }</td>
                                            <td>{ link.roles.map((role, index, arr) => {
                                                if(index !== arr.length - 1)
                                                    return <span key={role._id}>{role.name}, </span>
                                                else
                                                    return <span key={role._id}>{role.name}</span>
                                            }) }</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <a onClick={() => this.handleEdit(link)} className="edit" title={translate('system_admin.system_link.edit')}><i className="material-icons">edit</i></a>
                                                <DeleteNotification 
                                                    content={translate('system_admin.system_link.delete')}
                                                    data={{
                                                        id: link._id,
                                                        info: link.url
                                                    }}
                                                    func={this.props.destroy}
                                                />
                                            </td>
                                        </tr> 
                                    ): linksDefault.isLoading ?
                                    <tr><td colSpan={5}>{translate('general.loading')}</td></tr>:
                                    <tr><td colSpan={5}>{translate('general.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        <PaginateBar pageTotal={linksDefault.totalPages} currentPage={linksDefault.page} func={this.setPage}/>
                    </React.Fragment>
                </div>
            </div>
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

    componentDidMount(){
        this.props.get();
        this.props.get({page: this.state.page, limit: this.state.limit});
        this.props.getCategories();
    }
}
 
const mapState = state => state;
const getState =  {
    get: LinkDefaultActions.get,
    getCategories: LinkDefaultActions.getCategories,
    destroy: LinkDefaultActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));