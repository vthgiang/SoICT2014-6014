import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UserActions } from '../../super-admin/user/redux/actions';

class DashboardUnit extends Component {
    constructor(props) {
        super(props);
    };
    componentDidMount() {
        this.props.getDepartment();
    }
    render() {
        const { user } = this.props;
        return (
            <React.Fragment>
                <h1>Bang tin don vi</h1>
                {/* { user.organizationalUnitsOfUser
                    && <ComponentInfor organizationalUnitsOfUser={user.organizationalUnitsOfUser} />
                } */}
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
};

const dashboardUnit = connect(mapState, actionCreators)(withTranslate(DashboardUnit));
export { dashboardUnit as DashboardUnit };