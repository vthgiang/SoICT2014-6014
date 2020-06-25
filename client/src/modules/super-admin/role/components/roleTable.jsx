import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions} from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../user/redux/actions';
import RoleInfoForm from './roleInfoForm';
import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting, ToolTip } from '../../../../common-components';
import RoleCreateForm from './roleCreateForm';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: ''
        }
    }

    render() { 
        const { role, translate } = this.props;
        const { currentRow, option } = this.state;
        
        return ( 
            <React.Fragment>
                <RoleCreateForm />
                {
                    currentRow !== undefined &&
                    <RoleInfoForm
                        roleId={currentRow._id}
                        roleName={currentRow.name}
                        roleType={currentRow.type.name}
                        roleParents={currentRow.parents.map(parent => parent._id)}
                        roleUsers={currentRow.users.map(user => user.userId?user.userId._id:null)}
                    />
                }
                <SearchBar 
                    columns={[
                        { title: translate('manage_role.name'), value:'name' }
                    ]}
                    option={option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                    
                <table className="table table-hover table-striped table-bordered" id="table-manage-role">
                    <thead>
                        <tr>
                            <th>{ translate('manage_role.name') }</th>
                            <th>{ translate('manage_role.extends') }</th>
                            <th>{ translate('manage_role.users') }</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                { translate('table.action') }
                                <DataTableSetting 
                                    columnName={translate('table.action')} 
                                    columnArr={[
                                        translate('manage_role.name'),
                                        translate('manage_role.extends'),
                                        translate('manage_role.users')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    tableId="table-manage-role"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            role.listPaginate.length > 0 ? 
                            role.listPaginate.map( role => 
                                <tr key={ `roleList${role._id}` }>
                                    <td> { role.name } </td>
                                    <td><ToolTip dataTooltip={role.parents.map(parent => parent.name)}/></td>
                                    <td><ToolTip dataTooltip={role.users.map(user => user.userId !== null ? user.userId.name : null)}/></td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a className="edit" onClick={() => this.handleEdit(role)}><i className="material-icons">edit</i></a>
                                        {
                                            role.type.name === 'Company-Defined' && 
                                            <DeleteNotification 
                                                content={translate('manage_role.delete')}
                                                data={{id: role._id, info: role.name}}
                                                func={this.props.destroy}
                                            />
                                        }
                                    </td>
                                </tr>       
                            ): role.isLoading ?
                            <tr><td colSpan={'4'}>{translate('confirm.loading')}</td></tr>:
                            <tr><td colSpan={'4'}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                <PaginateBar pageTotal={role.totalPages} currentPage={role.page} func={this.setPage}/>
            </React.Fragment>
         );
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (role) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: role
            }
        });

        window.$('#modal-edit-role').modal('show');
    }

    // Cac ham thiet lap va tim kiem gia tri
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
        this.props.getUser();
    }

    deleteRole = (roleId) => {
        this.props.destroy(roleId);
    }

}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    getUser: UserActions.get,
    destroy: RoleActions.destroy
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );