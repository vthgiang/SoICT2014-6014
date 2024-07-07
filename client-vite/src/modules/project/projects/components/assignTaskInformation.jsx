import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import moment from 'moment'
import { getEndDateOfProject, getUserIdToText, renderProjectTypeText } from './functionHelper'
import { ToolTip } from '../../../../common-components'
import { getEmployeeSelectBoxItemsWithEmployeeData } from '../../../task/organizationalUnitHelper'

const AssignTaskInformation = (props) => {
  const { translate, projectDetail, projectDetailId, user } = props
  console.log("Project Detail: ", projectDetail)

  // const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  // const idToText = listUsers && listUsers?.length > 0 ? getUserIdToText(listUsers) : {}
  return (
    <div>
      Thông tin phân công
    </div>
  )
}

function mapStateToProps(state) {
  const { project, user } = state
  return { project, user }
}

const mapDispatchToProps = {
  // editProjectDispatch: ProjectActions.editProjectDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AssignTaskInformation))
