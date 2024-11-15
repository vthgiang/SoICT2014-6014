import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { MainDashboardUnit } from './combinedContent'

import { DashboardEvaluationEmployeeKpiSetAction } from '../../kpi/evaluation/dashboard/redux/actions'
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions'

class DashboardUnit extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem('currentRole'))
    this.props.getDepartment()
  }

  render() {
    const { dashboardEvaluationEmployeeKpiSet } = this.props

    let childOrganizationalUnit, childrenOrganizationalUnit, childrenOrganizationalUnitLoading

    if (dashboardEvaluationEmployeeKpiSet) {
      childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit
      childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
    }

    if (childrenOrganizationalUnit) {
      let temporaryChild
      childOrganizationalUnit = [
        {
          name: childrenOrganizationalUnit.name,
          id: childrenOrganizationalUnit.id,
          managers: childrenOrganizationalUnit.managers,
          employees: childrenOrganizationalUnit.employees,
          deputyManagers: childrenOrganizationalUnit.deputyManagers
        }
      ]
      temporaryChild = childrenOrganizationalUnit.children

      while (temporaryChild) {
        temporaryChild.map((x) => {
          childOrganizationalUnit = childOrganizationalUnit.concat({
            name: x.name,
            id: x.id,
            managers: x.managers,
            employees: x.employees,
            deputyManagers: x.deputyManagers
          })
        })

        let hasNodeChild = []
        temporaryChild
          .filter((x) => x.hasOwnProperty('children'))
          .map((x) => {
            x.children.map((x) => {
              hasNodeChild = hasNodeChild.concat(x)
            })
          })

        if (hasNodeChild.length === 0) {
          temporaryChild = undefined
        } else {
          temporaryChild = hasNodeChild
        }
      }
    }

    return (
      <React.Fragment>
        {childrenOrganizationalUnit && childrenOrganizationalUnit.length !== 0 ? (
          <MainDashboardUnit childOrganizationalUnit={childOrganizationalUnit} />
        ) : (
          childrenOrganizationalUnitLoading && (
            <div className='box box-body'>
              <h4>Bạn chưa có đơn vị</h4>
            </div>
          )
        )}
      </React.Fragment>
    )
  }
}

function mapState(state) {
  const { dashboardEvaluationEmployeeKpiSet } = state
  return { dashboardEvaluationEmployeeKpiSet }
}

const actionCreators = {
  getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
  getDepartment: DepartmentActions.get
}
export default connect(mapState, actionCreators)(withTranslate(DashboardUnit))
