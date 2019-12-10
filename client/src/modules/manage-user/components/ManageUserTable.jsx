import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
// import ReactLoading from 'react-loading';
import UserEditForm from './UserEditForm';

class ManageUserTable extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            email: null
         }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
        this.addUserSuccess = this.addUserSuccess.bind(this);
    }

    componentDidMount(){
        this.props.getUser();
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    alert(id, title, email){
        Swal.fire({
            title: `${title} "${email}"`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then((res) => {
            if(res.value){
                this.props.destroy(id)
            }
        });
    }

    save = (e) => {
        e.preventDefault();
        var {name , email } = this.state;
        this.props.create({
            name,
            email
        });
    }

    addUserSuccess(content){
        Swal.fire({
            type: 'success',
            title: content,
            showConfirmButton: false,
            timer: 2200
        });
    }

    render() { 
        const { user, translate } = this.props;
        return ( 
            <React.Fragment>
                {
                    user.list.length > 0 &&
                    <table className="table table-bordered table-hover" style={{ marginTop: '50px'}}>
                        <thead>
                            <tr>
                                <th>{ translate('table.name') }</th>
                                <th>{ translate('table.email') }</th>
                                <th>{ translate('table.status') }</th>
                                <th style={{ width: '120px' }}>{ translate('table.action') }</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.list.map( u => (
                                    <tr 
                                        key={ u._id }
                                        style={{ backgroundColor: u.active ? "white" : "#E2DFE7" }}
                                    >
                                        <td>{ u.name }</td>
                                        <td>{ u.email }</td>
                                        <td>{ u.active ? <p><i className="fa fa-circle text-success" /> Enable</p> : <p><i className="fa fa-circle text-danger" /> Disable</p> }</td>
                                        <td>
                                            <a className="btn btn-sm btn-primary" data-toggle="modal" href={ `#edit-user-modal-${u._id}` }><i className="fa fa-edit"></i></a>{' '}
                                            <button className="btn btn-sm btn-danger" onClick={() => this.alert(u._id, translate('manageUser.delete'), u.email)}><i className="fa fa-trash"></i></button>
                                            <UserEditForm 
                                                userEditID={ u._id } 
                                                email={ u.email }
                                                username={ u.name }
                                                active={ u.active }
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
    return{
        getUser: () => {
            dispatch(get()); 
        },
        // create: (user) => {
        //     dispatch(create(user));
        // },
        // destroy: (id) => {
        //     dispatch(destroy(id));
        // }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ManageUserTable) );