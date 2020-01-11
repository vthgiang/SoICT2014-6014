import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManageUserTable from './ManageUserTable';
import UserCreateForm from './UserCreateForm';
import { get } from '../redux/actions';

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    componentDidMount(){
        this.props.getUser();
    }

    render() { 
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <UserCreateForm/>
                    <ManageUserTable/>
                </div>
            </div>
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
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(ManageUser) );
