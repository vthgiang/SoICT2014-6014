import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DashBoardEmployees } from './combinedContent';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

const EmployeeDashBoard = (props) => {
    const { department, getDepartment } = props;

    useEffect(() => {
        getDepartment();
    }, []);

    const childOrganizationalUnit = department.list.map(x => ({id: x._id, name: x.name}));

    return (
            <React.Fragment>
                {
                    childOrganizationalUnit && childOrganizationalUnit.length !== 0 &&
                    <DashBoardEmployees childOrganizationalUnit={childOrganizationalUnit} />
                }
            </React.Fragment>
        );
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
};

export default connect(mapState, actionCreators)(withTranslate(EmployeeDashBoard));

