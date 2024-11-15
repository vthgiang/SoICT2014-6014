import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import {
  formatTaskStatus,
  getCurrentProjectDetails,
  renderProgressBar,
  renderStatusColor,
  convertPriorityData,
  checkIfAbleToCRUDProject,
  renderLongList,
  renderProjectTypeText
} from '../../projects/components/functionHelper'

const TabGeneralInfo = (props) => {
  const { translate, phase } = props

  return (
    <div className='description-box' style={{ lineHeight: 1.5 }}>
      <div className='row'>
        {/* Người thiết lập */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.creator')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.creator ? phase?.creator?.name : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Độ ưu tiên */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.priority')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.priority ? convertPriorityData(phase?.priority, translate) : convertPriorityData(3, translate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* Người thực hiện */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.responsible')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.responsibleEmployees ? phase?.responsibleEmployees.map((o) => o.name).join(', ') : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Người phê duyệt */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.accountable')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.accountableEmployees ? phase?.accountableEmployees.map((o) => o.name).join(', ') : null}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* Người tư vấn */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.consulted')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.consultedEmployees ? phase?.consultedEmployees.map((o) => o.name).join(', ') : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Người quan sát */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.informed')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.informedEmployees ? phase?.informedEmployees.map((o) => o.name).join(', ') : null}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* Ngày bắt đầu */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.start_date')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.startDate ? moment(phase?.startDate).format('HH:mm DD/MM/YYYY') : null}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ngày kết thúc */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('task.task_management.end_date')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.endDate ? moment(phase?.endDate).format('HH:mm DD/MM/YYYY') : null}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* Tiến độ */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('phase.progress')}</strong>
              <div className='col-sm-8'>
                <span>{phase?.progress ? `${phase.progress}%` : `0%`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trạng thái */}
        <div className='col-md-6'>
          <div className='form-horizontal'>
            <div className='form-group'>
              <strong className='col-sm-4'>{translate('phase.status')}</strong>
              <div className='col-sm-8'>
                <span style={{ color: renderStatusColor(phase) }}>{formatTaskStatus(translate, phase?.status)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const project = state.project
  return { project }
}

const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabGeneralInfo))
