import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { ComponentInfor } from './combinedContent'
import { UserActions } from '../../super-admin/user/redux/actions'
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions'

class DashboardPersonal extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getDepartment()
    this.props.getDepartmentOfUser()
  }

  render() {
    const { user } = this.props
    return (
      <React.Fragment>
        {user.organizationalUnitsOfUser && this.props.department?.list?.length && (
          <ComponentInfor organizationalUnitsOfUser={user.organizationalUnitsOfUser} />
        )}
      </React.Fragment>
    )
  }
}

function mapState(state) {
  const { user, department } = state
  return { user, department }
}

const actionCreators = {
  getDepartmentOfUser: UserActions.getDepartmentOfUser,
  getDepartment: DepartmentActions.get
}

export default connect(mapState, actionCreators)(withTranslate(DashboardPersonal))
