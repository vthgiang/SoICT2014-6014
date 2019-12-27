import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompanyTable from './CompanyTable';
import CompanyCreateForm from './CompanyCreateForm';

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    render() { 
        console.log("manage company index")
        return ( 
            <React.Fragment>
                <CompanyCreateForm/>
                <CompanyTable/>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( Company );