import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions} from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../user/redux/actions';
import RoleInfoForm from './roleInfoForm';
import { SearchBar, DeleteNotification, PaginateBar, DataTableSetting } from '../../../../common-components';
import RoleCreateForm from './roleCreateForm';

class RoleTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: { $regex: '', $options: 'i' }
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
                        roleUsers={currentRow.users.map(user => user.userId._id)}
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
                    
                <table className="table table-hover table-striped table-bordered">
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
                                    <td> { 
                                        role.parents.map((parent, index, arr) => {
                                            if(arr.length < 4){
                                                if(index !== arr.length - 1) return `${parent.name}, `;
                                                else return `${parent.name}`
                                            }else{
                                                if(index < 3 ){
                                                    return `${parent.name}, `
                                                }
                                            }
                                        })
                                    }{
                                        role.parents.length >=4 &&
                                        <React.Fragment>
                                            <div className="tooltip2">...
                                                <span className="tooltip2text">
                                                    {
                                                        role.parents.map((parent, index, arr) => {
                                                            if(index !== arr.length - 1) return `${parent.name}, `;
                                                            else return `${parent.name}`
                                                        })
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    } </td>
                                    <td> { 
                                        role.users.map((user, index, arr) => {
                                            if(arr.length < 3){
                                                if(index !== arr.length - 1) return `${user.userId !== null ? user.userId.name : null}, `;
                                                else return `${user.userId !== null ? user.userId.name : null}`
                                            }else{
                                                if(index < 2 ){
                                                    return `${user.userId !== null ? user.userId.name : null}, `
                                                }
                                            }
                                        })
                                    }{
                                        role.users.length >=3 &&
                                        <React.Fragment>
                                            <div className="tooltip2">...
                                                <span className="tooltip2text">
                                                    {
                                                        role.users.map((user, index, arr) => {
                                                            if(index !== arr.length - 1) return `${user.userId.name}, `;
                                                            else return `${user.userId.name}`
                                                        })
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    } </td>
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

    componentDidMount(){
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
        this.props.get();
        this.props.getUser();
    }

    deleteRole = (roleId) => {
        this.props.destroy(roleId);
    }

}
 
const mapStateToProps = state => state;

const mapDispatchToProps =  {
    get: RoleActions.get,
    getPaginate: RoleActions.getPaginate,
    getUser: UserActions.get,
    destroy: RoleActions.destroy
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(RoleTable) );