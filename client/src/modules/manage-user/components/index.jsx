import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManageUserTable from './ManageUserTable';
import UserCreateForm from './UserCreateForm';

class ManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    render() { 
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

export default connect( mapStateToProps, null )( withTranslate(ManageUser) );