import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import moment from 'moment'
import { getEndDateOfProject, getUserIdToText, renderProjectTypeText } from './functionHelper'
import { ToolTip, TreeTable } from '../../../../common-components'
import { getEmployeeSelectBoxItemsWithEmployeeData } from '../../../task/organizationalUnitHelper'
import dayjs from 'dayjs'

const AssignTaskInformation = (props) => {
  const { translate, projectDetail, projectDetailId, user } = props

  const column = [
    { name: 'Mã công việc', key: 'code' },
    { name: 'Tên công việc', key: 'name' },
    { name: 'Công việc tiền nhiệm', key: 'preceedingTasks'},
    { name: 'Ngày bắt đầu', key: 'startDate' },
    { name: 'Ngày kết thúc', key: 'endDate' },
    { name: 'Nhân viên', key: 'assignee' },
    { name: 'Tài sản', key: 'assets' },
  ]

  const convertAssignmentToTableData = (assignments) => {
    let data = []
    if (assignments && assignments?.length > 0) {
      for(let i = 0; i < assignments?.length; i++) {
        let dataItem = assignments[i]
        data[i] = {
          rawData: dataItem,
          code: dataItem?.task?.code,
          name: dataItem?.task?.name,
          preceedingTasks: dataItem?.task?.preceedingTasks && 
            dataItem?.task?.preceedingTasks?.length > 0 ? (
              <ToolTip dataTooltip={dataItem?.task?.preceedingTasks?.map((item) => item?.link)}/> 
            ) : null,
          startDate: dayjs(dataItem?.task?.startDate).format('HH:mm A DD/MM/YYYY') || [],
          endDate: dayjs(dataItem?.task?.endDate).format('HH:mm A DD/MM/YYYY') || [],
          assignee: dataItem?.assignee?.fullName,
          assets: dataItem?.assets?.length > 0 ? (
            <ToolTip dataTooltip={dataItem?.assets.map((item) => item?.assetName)}/> 
          ) : null
        }
      }
    }
    return data
  }
  // const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  // const idToText = listUsers && listUsers?.length > 0 ? getUserIdToText(listUsers) : {}
  return (
    <div>
      <div className='text-2xl font-bold'>
        Thông tin phân công
        {(projectDetail?.status === 'proposal' || projectDetail?.status === 'wait_for_approval') && 
          <span className='pl-4 font-italic font-normal text-red-500'>
            <i>Chưa có thông tin phân công</i>
          </span>
        }
      </div>
      <div className='qlcv StyleScrollDiv StyleScrollDiv-y mt-4' style={{ maxHeight: '500px' }}>
        <TreeTable
          behaviour='show-children'
          tableId={`table-assign-project-${projectDetail?._id}`}
          column={column}
          actions={false}
          data={convertAssignmentToTableData(projectDetail?.proposals?.assignment)}
        />
      </div>
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
