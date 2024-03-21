import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'

import { withTranslate } from 'react-redux-multilingual'

import { UserActions } from '../../../super-admin/user/redux/actions'
import { ProjectPhaseActions } from '../redux/actions'

import qs from 'qs'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import { ProjectActions } from '../../projects/redux/actions'
import { TaskActions } from '../../../task/task-management/redux/actions'
import { DetailProjectTaskTab } from '../../../task/task-project/component/detailProjectTaskTab'
import { getCurrentProjectDetails } from '../../projects/components/functionHelper'

function PhaseComponent(props) {
  const { translate, project, projectPhase } = props

  const [state, setState] = useState({ phaseId: null })
  /**
   * Dùng khi mở task từ URL. Ban đầu flag là 1, chạy vào render trước, taskID=null
   * Khi flag có giá trị là 2, taskID sẽ là tham số từ URL
   */
  const [flag, setFlag] = useState(1)

  const { role } = state

  useEffect(() => {
    props.getAllDepartment()
    props.getDepartment()
    props.getProjectsDispatch({ calledId: '' })
  }, [])

  useEffect(() => {
    // xử lý khi mở chi tiết giai đoạn bằng link
    if (props.location) {
      const { phaseId } = qs.parse(props.location.search, { ignoreQueryPrefix: true })
      if (phaseId && flag === 1) {
        setFlag(2)
        props.getPhaseById(phaseId)
      }
    }
  }, [JSON.stringify(props.location)])

  useEffect(() => {
    if (props.id && !props.location) {
      props.getPhaseById(props.id) // props.id // đổi thành nextProps.id để lấy dữ liệu về sớm hơn
    }
  }, [props.id])

  let phaseId = props.id
  let phase

  if (props.location) {
    if (flag !== 1) {
      phaseId = qs.parse(props.location.search, { ignoreQueryPrefix: true }).phaseId
    }
  }

  if (projectPhase?.performPhase) {
    phase = projectPhase.performPhase
  }

  const check = props?.projectPhase.isPhaseLoading

  return (
    <React.Fragment>
      {flag === 1 && check ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>Đang tải dữ liệu ...</div>
      ) : (
        <div></div>
      )}
    </React.Fragment>
  )
}
function mapState(state) {
  const { projectPhase, project } = state
  return { projectPhase, project }
}

const actionCreators = {
  getPhaseById: ProjectPhaseActions.getPhaseById,
  getAllDepartment: DepartmentActions.get,
  getDepartment: UserActions.getDepartmentOfUser,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  getProjectsDispatch: ProjectActions.getProjectsDispatch
}

export default connect(mapState, actionCreators)(withTranslate(PhaseComponent))
