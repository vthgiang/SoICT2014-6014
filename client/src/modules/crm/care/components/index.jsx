import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import CrmCareHomePage from './homePage'
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { getStorage } from '../../../../config';


function CrmCare(props) {
    useEffect(() => {
        props.getDepartment();
        props.showRole(getStorage('currentRole'));
    }, [])
    const {role, user,crm } = props
    return (
        <div>
            { role && user && user.organizationalUnitsOfUser && <CrmCareHomePage />}
        </div>
    );
}

function mapStateToProps(state) {
    const { crm, user,role } = state;
    return { crm, user,role };
}

const mapDispatchToProps = {
    getDepartment: UserActions.getDepartmentOfUser,
    showRole : RoleActions.show, 
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCare));