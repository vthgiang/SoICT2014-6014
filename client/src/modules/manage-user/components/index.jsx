import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import ManageUserTable from './ManageUserTable';
import UserCreateForm from './UserCreateForm';

class ManageUser extends Component {
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
                <UserCreateForm/>
                <ManageUserTable/>
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

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ManageUser) );