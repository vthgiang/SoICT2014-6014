import React, { Component } from 'react';
import { CustomerActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CustomerManagement from './customer-management';
import Group from './group';

class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        const {customers} = this.props.customer;

        return ( 
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#customer-management" data-toggle="tab">Khách hàng</a></li>
                    <li><a href="#group" data-toggle="tab">Nhóm khách hàng</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="customer-management">
                        <CustomerManagement/>
                    </div>
                    <div className="tab-pane" id="group">
                        <Group/>
                    </div>
                </div>
            </div>
         );
    }
}
 

function mapState(state) {
    const { customer } = state;
    return { customer };
}

const getState = {
    getCustomers: CustomerActions.getCustomers,
}

export default connect(mapState, getState)(withTranslate(Customer));