import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import LoyalCustomerHomePage from './homePage'
import { CrmCustomerActions } from '../../customer/redux/actions';

function CrmLoyalCustomer(props) {
    useEffect(() => {
        props.getDepartment();
       
    }, [])
    const { user } = props
    return (
        <div>
            {user && user.organizationalUnitsOfUser && <LoyalCustomerHomePage />}
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
    addPromotion: CrmCustomerActions.addPromotion,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmLoyalCustomer));