import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompanyTable from './CompanyTable';
import CompanyCreateForm from './CompanyCreateForm';

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
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

const mapDispatchToProps = (dispatch, props) => {
    return{
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Company );