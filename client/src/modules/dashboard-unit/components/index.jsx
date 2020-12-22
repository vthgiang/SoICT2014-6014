import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { MainDashboardUnit } from './combinedContent';

import { DashboardEvaluationEmployeeKpiSetAction } from '../../kpi/evaluation/dashboard/redux/actions';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';

class DashboardUnit extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
        this.props.getDepartment();
    }

    render() {
        const { dashboardEvaluationEmployeeKpiSet } = this.props;

        let childOrganizationalUnit, childrenOrganizationalUnit, childrenOrganizationalUnitLoading;

        if (dashboardEvaluationEmployeeKpiSet) {
            childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
            childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
        };

        if (childrenOrganizationalUnit) {
            let temporaryChild;
            childOrganizationalUnit = [{
                'name': childrenOrganizationalUnit.name,
                'id': childrenOrganizationalUnit.id,
                'deputyManager': childrenOrganizationalUnit.deputyManager
            }]
            temporaryChild = childrenOrganizationalUnit.children;

            while (temporaryChild) {
                temporaryChild.map(x => {
                    childOrganizationalUnit = childOrganizationalUnit.concat({
                        'name': x.name,
                        'id': x.id,
                        'deputyManager': x.deputyManager
                    });
                })

                let hasNodeChild = [];
                temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                    x.children.map(x => {
                        hasNodeChild = hasNodeChild.concat(x)
                    })
                });

                if (hasNodeChild.length === 0) {
                    temporaryChild = undefined;
                } else {
                    temporaryChild = hasNodeChild
                }
            }
        };

        return (
            <React.Fragment>
                {childrenOrganizationalUnitLoading &&
                    childrenOrganizationalUnit.length !== 0 ?
                    <MainDashboardUnit childOrganizationalUnit={childOrganizationalUnit} /> :
                    <div className="box box-body">
                        <h4>Bạn chưa có đơn vị</h4>
                    </div>
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet } = state;
    return { dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    getDepartment: DepartmentActions.get,
};

const dashboardUnit = connect(mapState, actionCreators)(withTranslate(DashboardUnit));
export { dashboardUnit as DashboardUnit };