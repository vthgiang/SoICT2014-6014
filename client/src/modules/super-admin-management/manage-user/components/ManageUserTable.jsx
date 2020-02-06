import React, { Component } from 'react';
import { connect } from 'react-redux';
import { edit, destroy } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import UserEditForm from './UserEditForm';
import DeleteNotification from '../../../../common-components/DeleteNotification';
import PaginateBar from '../../../../common-components/PaginateBar';
import SearchBar from '../../../../common-components/SearchBar';
import UserCreateForm from './UserCreateForm';
import ActionColumn from '../../../../common-components/ActionColumn';

class ManageUserTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: '5',
            page: '1',
            username: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.setPage = this.setPage.bind(this);
        this.checkSuperRole = this.checkSuperRole.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    checkSuperRole = (roles) => {
        var result = false;
        if(roles !== undefined){
            roles.map( role => {
                if(role.roleId.name === 'Super Admin')
                    result = true;
            });
        }
        
        return result;
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        this.props.getPaginate(data);
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
                    />
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <UserCreateForm />
                    </div>
                </div>
                {
                    user.list.length > 0 &&
                    <table className="table table-bordered table-striped" id="myTable">
                        <thead>
                            <tr>
                                <th>{translate('table.name')}</th>
                                <th>{translate('table.email')}</th>
                                <th>{translate('table.status')}</th>
                                <th style={{ width: '120px' }}>
                                    <ActionColumn columnName={translate('table.action')} hideColumn={false} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.list.map(u => (
                                    <tr
                                        key={u._id}
                                        style={{ backgroundColor: u.active ? "white" : "#E2DFE7" }}
                                    >
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.active ? <p><i className="fa fa-circle text-success" /> Enable</p> : <p><i className="fa fa-circle text-danger" /> Disable</p>}</td>
                                        <td style={{ textAlign: 'center' }}>
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
                                                        title: translate('delete'),
                                                        btnNo: translate('question.no'),
                                                        btnYes: translate('delete'),
                                                    }}
                                                    data={{
                                                        id: u._id,
                                                        info: u.email
                                                    }}
                                                    func={this.props.destroy}
                                                />
                                            }
                                            
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                {/* PaginateBar */}
                <PaginateBar pageTotal={20} currentPage={5}/>  
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        edit: (user) => {
            dispatch(edit(user));
        },
        destroy: (id) => {
            dispatch(destroy(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManageUserTable));