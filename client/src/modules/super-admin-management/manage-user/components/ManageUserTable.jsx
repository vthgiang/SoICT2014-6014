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
        }
        this.editUser = this.editUser.bind(this);
        this.delete = this.delete.bind(this);
    }

    editUser = (data) => {
        this.props.edit(data);
    }

    delete = (id) => {
        this.props.destroy(id)
    }

    render() {
        const { user, translate } = this.props;
        console.log("RENDER USER TABLE");
        return (
            <React.Fragment>
                {
                    user.list.length > 0 &&
                    <table className="table table-bordered table-hover" style={{ marginTop: '50px' }}>
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