import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CrmCustomerActions } from '../redux/actions';
import { getStorage } from '../../../../config';

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

    componentDidMount(){
        let company = getStorage('companyId');
        let {limit, page} = this.state;
        this.props.getCustomers({company});
        this.props.getCustomers({company, limit, page});
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
 

function mapStateToProps(state) {
    return state;
}

const mapDispatchToProps = {
    getCustomers: CrmCustomerActions.getCustomers
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomer));