import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserActions } from '../../../super-admin/user/redux/actions';
import CustomerHomePage from './customerHomePage';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';


function CrmCustomer(props) {
    useEffect(()=>{
        props.getDepartment();
    },[])
    const {user} = props
    return (
        <div>
           {user && user.organizationalUnitsOfUser && <CustomerHomePage/>}
        </div>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getDepartment: UserActions.getDepartmentOfUser, 
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
 
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomer));