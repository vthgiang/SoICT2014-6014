import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import moment from 'moment'
import { getEndDateOfProject, getUserIdToText, renderProjectTypeText } from './functionHelper'
import { ToolTip } from '../../../../common-components'
import { getEmployeeSelectBoxItemsWithEmployeeData } from '../../../task/organizationalUnitHelper'

const DetailContent = (props) => {
  const { translate, projectDetail, projectDetailId, currentProjectTasks, user } = props

  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  const idToText = listUsers && listUsers?.length > 0 ? getUserIdToText(listUsers) : {}
  return (
    <div className='description-box' style={{ lineHeight: 1.5 }}>
      <div className='row'>
        {/* Tên dự án */}
        <div className='col-md-12'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-2'>{translate('project.name')}</strong>
              <a className='col-sm-8' href={`/project/project-details?id=${projectDetail?._id}`} target='_blank'>
                {projectDetail ? projectDetail?.name : null}
              </a>
            </div>
          </div>
        </div>

        {/* Hình thức quản lý dự án */}
        {/* <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>Hình thức quản lý dự án</strong>
              <div className='col-sm-8'>{projectDetail ? translate(renderProjectTypeText(projectDetail?.projectType)) : null}</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Ngày bắt đầu */}
      <div className='row'>
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('project.startDate')}</strong>
              <div className='col-sm-8'>
                <span>{projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ngày kết thúc */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('project.endDate')}</strong>
              <div className='col-sm-8'>
                <span>{projectDetail ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Người quản lý dự án */}
      <div className='row'>

        {/* Đơn vị tính thời gian */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('project.unitTime')}</strong>
              <div className='col-sm-8'>
                <span>{projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Đơn vị tính chi phí */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('project.unitCost')}</strong>
              <div className='col-sm-8'>
                <span>{projectDetail && projectDetail?.unitCost ? projectDetail?.unitCost : null}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-12'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-2'>{translate('project.manager')}</strong>
              <div className='col-sm-8'>
                <span>
                  {projectDetail && projectDetail?.projectManager
                    ? <ToolTip dataTooltip={projectDetail?.projectManager?.map((item) => idToText[item?._id] ? idToText[item?._id] : item?.name)} />
                    : null}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        
        {/* Thành viên tham gia */}
        <div className='col-md-12'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-2'>{translate('project.member')}</strong>
              <div className='col-sm-8'>
                <span>
                  {projectDetail && projectDetail?.responsibleEmployees
                    ? <ToolTip dataTooltip={projectDetail?.responsibleEmployees?.map((item) => idToText[item?._id] ? idToText[item?._id] : item?.name)} />
                    : null}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { project, user } = state
  return { project, user }
}

const mapDispatchToProps = {
  editProjectDispatch: ProjectActions.editProjectDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailContent))
