import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompanyTable from './CompanyTable';

class Company extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }

    render() { 
        console.log("manage company index")
        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <CompanyTable/>
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, null )( Company );