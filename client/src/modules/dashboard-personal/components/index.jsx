import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ComponentInfor } from './combinedContent';
import { UserActions } from '../../super-admin/user/redux/actions';

class DashboardPersonal extends Component {
    constructor(props) {
        super(props);
    };
    componentDidMount() {
        this.props.getDepartment();
        this.props.getRoleSameDepartment();
    }
    render() {
        const { user } = this.props;
        console.log(user.organizationalUnitsOfUser)
        console.log(user.roledepartments)
        return (
            <React.Fragment>
                { user.organizationalUnitsOfUser
                    && <ComponentInfor organizationalUnitsOfUser={user.organizationalUnitsOfUser} />
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { user } = state;
    return { user };
}

const actionCreators = {
    getDepartment: UserActions.getDepartmentOfUser,
    getRoleSameDepartment: UserActions.getRoleSameDepartment
};

export default connect(mapState, actionCreators)(withTranslate(DashboardPersonal));