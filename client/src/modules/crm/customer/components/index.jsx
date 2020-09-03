import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class CrmCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 10,
            page: 1,
            option: 'name',
            value: ''
         }
    }

    render() { 

        return ( 
            <div class="box">
                <div className="box-body">
                </div>
            </div>
         );
    }

}
 

function mapState(state) {
    return state;
}

const getState = {
}

export default connect(mapState, getState)(withTranslate(CrmCustomer));