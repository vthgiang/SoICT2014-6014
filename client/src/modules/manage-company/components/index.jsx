import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../redux/actions';
import CompanyTable from './CompanyTable';
import CompanyCreateForm from './CompanyCreateForm';

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getCompanies();
    }

    render() { 
        const { company } = this.props;
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
        getCompanies: () => {
            dispatch(get()); 
        },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Company );