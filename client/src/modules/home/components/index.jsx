import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../../manage-company/redux/actions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        
        console.log("constructor home");
    }

    componentDidMount(){
        this.props.getCompanies();
        console.log("component didmount home");
    }

    render() { 

        console.log("render home");
        return ( 
            <React.Fragment>
                Home
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
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );