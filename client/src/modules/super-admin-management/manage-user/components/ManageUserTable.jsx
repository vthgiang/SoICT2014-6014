import React, { Component } from 'react';
import { connect } from 'react-redux';
import { edit, destroy } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import UserEditForm from './UserEditForm';
import DeleteNotificationModal from './DeleteNotificationModal';

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
        this.editUser = this.editUser.bind(this);
        this.delete = this.delete.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        this.props.getPaginate(data);
    }

    editUser = (data) => {
        this.props.edit(data);
    }

    delete = (id) => {
        this.props.destroy(id)
    }

    searchByName = () => {
        const { username } = this.state;
        this.props.searchByName(username);
    }

    render() { 
        const { user, translate } = this.props;
        console.log("RENDER USER TABLE");
        return (
            <React.Fragment>

                <div className="row" style={{ marginBottom: '5px' }}>
                    <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                        <div>
                            <select name="limit" className="form-control" onChange={this.inputChange}>
                                <option key='1' value={5}>5</option>
                                <option key='2' value={10}>10</option>
                                <option key='3' value={15}>15</option>
                                <option key='4' value={20}>20</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6"></div>
                    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-4">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder={translate('searchByName')} />
                            <span className="input-group-btn">
                                <button type="button" className="btn btn-primary btn-flat">{translate('search')}</button>
                            </span>
                        </div>
                    </div>
                </div>
                {
                    user.list.length > 0 &&
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('table.name')}</th>
                                <th>{translate('table.email')}</th>
                                <th>{translate('table.status')}</th>
                                <th style={{ width: '120px' }}>{translate('table.action')}</th>
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
                                        <td>
                                            <a className="btn btn-sm btn-primary" data-toggle="modal" href={`#edit-user-modal-${u._id}`}><i className="fa fa-edit"></i></a>{' '}
                                            <a className="btn btn-sm btn-danger" data-toggle="modal" href={`#modal-delete-${u._id}`}><i className="fa fa-trash"></i></a>
                                            <UserEditForm
                                                userEditID={u._id}
                                                email={u.email}
                                                username={u.name}
                                                active={u.active}
                                                editUser={this.editUser}
                                            />
                                            <DeleteNotificationModal
                                                userId={u._id}
                                                userEmail={u.email}
                                                delete={this.delete}
                                            />

                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                <div className="row">
                    <div className="col-sm-3">
                        <p style={{ marginTop: '25px' }}>{translate('page')}{`${user.page}/${user.totalPages}`}</p>
                    </div>
                    <div className="col-sm-6">
                        <div className="center">
                            <div className="pagination">
                                <button className="btn btn-default" disabled={!user.hasPrevPage} onClick={() => this.setPage(user.prevPage)} >&laquo;</button>
                                {
                                    user.hasPrevPage && <button className="btn btn-default" onClick={() => this.setPage(user.prevPage)} >{user.prevPage}</button>
                                }
                                <button className="btn btn-primary">{user.page}</button>
                                {
                                    user.hasNextPage && <button className="btn btn-default" onClick={() => this.setPage(user.nextPage)} >{user.nextPage}</button>
                                }
                                <button className="btn btn-default" disabled={!user.hasNextPage} onClick={() => this.setPage(user.nextPage)} >&raquo;</button>
                            </div>
                        </div>
                    </div>
                </div>
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