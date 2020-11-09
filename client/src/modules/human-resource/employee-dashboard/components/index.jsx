import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DashBoardEmployees } from './combinedContent';

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';

class EmployeeDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.getDepartment()
    };

    render() {
        const { department } = this.props;
        let childOrganizationalUnit = department.list.map(x => {
            return {
                id: x._id,
                name: x.name
            }
        })
        return (
            <React.Fragment>
                {
                    childOrganizationalUnit && childOrganizationalUnit.length !== 0 &&
                    <DashBoardEmployees childOrganizationalUnit={childOrganizationalUnit} />
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
};

export default connect(mapState, actionCreators)(withTranslate(EmployeeDashBoard));
