import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import UserEditForm from './UserEditForm';
import { PaginateBar, ActionColumn, SearchBar, DeleteNotification } from '../../../../common-components';
import UserCreateForm from './UserCreateForm';

class ManageUserTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'name', //mặc định tìm kiếm theo tên
            value: null
        }
        this.setPage = this.setPage.bind(this);
        this.setOption = this.setOption.bind(this);
        this.searchWithOption = this.searchWithOption.bind(this);
        this.checkSuperRole = this.checkSuperRole.bind(this);
        this.setLimit = this.setLimit.bind(this);
    }

    handleEdit = async (user) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: user
            }
        });

        window.$('#modal-edit-user').modal('show');
    }

    render() { 
        const { user, translate } = this.props;
        
        return (
            <React.Fragment>
                <UserCreateForm />
                <SearchBar 
                    columns={[
                        { title: translate('manage_user.name'), value: 'name' },
                        { title: translate('manage_user.email'), value: 'email' }
                    ]}
                    option={this.state.option}
                    setOption={this.setOption}
                    search={this.searchWithOption}
                />
                {
                    this.state.currentRow !== undefined &&

                    <UserEditForm
                        userId={this.state.currentRow._id}
                        userEmail={this.state.currentRow.email}
                        userName={this.state.currentRow.name}
                        userActive={this.state.currentRow.active}
                        userRoles={this.state.currentRow.roles.map(role => role.roleId._id)}
                    />
                }
                <table className="table table-hover table-striped table-bordered" id="table-manage-user">
                    <thead>
                        <tr>
                            <th>{translate('manage_user.name')}</th>
                            <th>{translate('manage_user.email')}</th>
                            <th>{translate('manage_user.roles')}</th>
                            <th>{translate('manage_user.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                {translate('table.action')}
                                <ActionColumn
                                    columnArr={[
                                        translate('manage_user.name'),
                                        translate('manage_user.email'),
                                        translate('manage_user.roles'),
                                        translate('manage_user.status')
                                    ]}
                                    limit={this.state.limit}
                                    setLimit={this.setLimit}
                                    hideColumnOption = {true}
                                    tableId="table-manage-user"
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !user.isLoading && user.listPaginate.length > 0 && user.listPaginate.map(u => (
                                <tr
                                    key={u._id}
                                >
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{
                                        u.roles.map((role, index, arr) => {
                                            if(arr.length < 4){
                                                if(index !== arr.length - 1) return `${role.roleId.name}, `;
                                                else return `${role.roleId.name}`
                                            }else{
                                                if(index < 3 ){
                                                    return `${role.roleId.name}, `
                                                }
                                            }
                                        })
                                    }{
                                        u.roles.length >=4 &&
                                        <React.Fragment>
                                            <div className="tooltip2">...
                                                <span className="tooltip2text">
                                                    {
                                                        u.roles.map((role, index, arr) => {
                                                            if(index !== arr.length - 1) return `${role.roleId.name}, `;
                                                            else return `${role.roleId.name}`
                                                        })
                                                    }
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    }</td>
                                    <td>{u.active 
                                        ? <p><i className="fa fa-circle text-success" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('manage_user.enable')} </p>
                                        : <p><i className="fa fa-circle text-danger" style={{fontSize: "1em", marginRight: "0.25em"}} /> {translate('manage_user.disable')} </p>}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <a onClick={() => this.handleEdit(u)} className="edit text-yellow" style={{width: '5px'}} title={translate('manage_user.edit')}><i className="material-icons">edit</i></a>
                                        {
                                            !this.checkSuperRole(u.roles) && 
                                            <DeleteNotification 
                                                content={translate('manage_user.delete')}
                                                data={{ id: u._id, info: u.email }}
                                                func={this.props.destroy}
                                            />
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                
                {user.isLoading?
                    <div className="table-info-panel">{translate('confirm.loading')}</div>:
                    user.listPaginate.length===0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                
                {/* PaginateBar */}
                <PaginateBar pageTotal={user.totalPages} currentPage={user.page} func={this.setPage}/>  
            </React.Fragment>
        );
    }

    checkSuperRole = (roles) => {
        var result = false;
        if(roles !== undefined){
            roles.map( role => {
                if(role.roleId.name === 'Super Admin')
                    result = true;
                return true;
            });
        }
        
        return result;
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
        if (this.state.limit !== number){
            this.setState({ limit: number });
            const data = { limit: number, page: this.state.page };
            if(this.state.value !== null){
                data[this.state.option] = this.state.value;
            }
            this.props.getPaginate(data);
        }
    }

    componentDidMount(){
        this.props.getUser();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
    }

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getUser: UserActions.get,
    getPaginate: UserActions.getPaginate,
    edit: UserActions.edit,
    destroy: UserActions.destroy
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageUserTable));