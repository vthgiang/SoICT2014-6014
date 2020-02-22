import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import UserEditForm from './UserEditForm';
import { DeleteNotification } from '../../../../common-components';
import { PaginateBar } from '../../../../common-components';
import { SearchBar } from '../../../../common-components';
import UserCreateForm from './UserCreateForm';
import { ActionColumn } from '../../../../common-components';

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

    render() { 
        const { user, translate } = this.props;
        
        return (
            <React.Fragment>
                <div className="row">
                    <SearchBar 
                        columns={[
                            { title: translate('table.name'), value: 'name' },
                            { title: translate('table.email'), value: 'email' }
                        ]}
                        option={this.state.option}
                        setOption={this.setOption}
                        search={this.searchWithOption}
                    />
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <UserCreateForm />
                    </div>
                </div>
                <table className="table table-bordered table-striped" id="myTable">
                    <thead>
                        <tr>
                            <th>{translate('table.name')}</th>
                            <th>{translate('table.email')}</th>
                            <th>{translate('table.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>
                                <ActionColumn 
                                    columnName={translate('table.action')} 
                                    hideColumn={false}
                                    setLimit={this.setLimit} 
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            user.listPaginate.length > 0 ? user.listPaginate.map(u => (
                                <tr
                                    key={u._id}
                                    style={{ backgroundColor: u.active ? "white" : "#E2DFE7" }}
                                >
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.active ? <p><i className="fa fa-circle text-success" />{translate('manage_user.enable')}</p> : <p><i className="fa fa-circle text-danger" />{translate('manage_user.disable')}</p>}</td>
                                    <td style={{textAlign: 'center'}}>
                                        <UserEditForm
                                            userEditID={u._id}
                                            email={u.email}
                                            username={u.name}
                                            active={u.active}
                                            editUser={this.editUser}
                                        />
                                        {
                                            !this.checkSuperRole(u.roles) && 
                                            <DeleteNotification 
                                                content={{
                                                    title: translate('manage_user.delete'),
                                                    btnNo: translate('confirm.no'),
                                                    btnYes: translate('confirm.yes'),
                                                }}
                                                data={{ id: u._id, info: u.email }}
                                                func={this.props.destroy}
                                            />
                                        }
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
                        }
                    </tbody>
                </table>
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
        this.setState({ limit: number });
        const data = { limit: number, page: this.state.page };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
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