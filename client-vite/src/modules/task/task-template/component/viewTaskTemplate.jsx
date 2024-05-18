import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { taskTemplateActions } from '../redux/actions'
import parse from 'html-react-parser'

const ViewTaskTemplate = (props) => {
  const [state, setState] = useState({ showMore: false })

  const clickShowMore = () => {
    setState((state) => {
      return {
        ...state,
        showMore: !state.showMore
      }
    })
  }

  const formatTypeInfo = (type) => {
    let { translate } = props

    if (type === 'text') return translate('task_template.text')
    else if (type === 'number') return translate('task_template.number')
    else if (type === 'date') return translate('task_template.date')
    else if (type === 'boolean') return 'Boolean'
    else if (type === 'set_of_values') return translate('task_template.value_set')
  }

  console.log('\n\n=======VIEW=========\n\n')
  const { translate, department } = props
  const { isProcess, data, taskTemplate, listUser } = props // data là props dữ liệu của process được chọn nếu đây là process
  const { showMore } = state
  let processTemplate = data
  console.log('processTemplate', taskTemplate)
  let listUserAccountable = [],
    listUserResponsible = []
  let organizationalUnitProcess, collaboratedWithOrganizationalUnitsProcess
  let priority = ''
  if (isProcess) {
    if (listUser) {
      listUser.forEach((x) => {
        if (taskTemplate?.accountableEmployees.some((y) => y._id === x._id)) {
          listUserAccountable.push({ value: x._id, name: x.name })
        }
      })
      listUser.forEach((x) => {
        if (taskTemplate?.responsibleEmployees.some((y) => y._id === x._id)) {
          listUserResponsible.push({ value: x._id, name: x.name })
        }
      })
    }
  }

  let organizationalUnit = taskTemplate?.organizationalUnit?.name
  let collaboratedWithOrganizationalUnits = taskTemplate?.collaboratedWithOrganizationalUnits
  let accountableEmployees = isProcess ? listUserAccountable : taskTemplate?.accountableEmployees
  let responsibleEmployees = isProcess ? listUserResponsible : taskTemplate?.responsibleEmployees

  switch (taskTemplate?.priority) {
    case 1:
      priority = translate('task.task_management.low')
      break
    case 2:
      priority = translate('task.task_management.average')
      break
    case 3:
      priority = translate('task.task_management.standard')
      break
    case 4:
      priority = translate('task.task_management.high')
      break
    case 5:
      priority = translate('task.task_management.urgent')
      break
  }

  return (
    <React.Fragment>
      {/* Modal Body */}
      <div className='row row-equal-height' style={{ marginTop: -25 }}>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.general_information')}</h4>

            {/**Các thông tin của mẫu công việc */}
            <div>
              <strong>{translate('task_template.unit')}:</strong>
              <span>{organizationalUnit}</span>
            </div>
            {collaboratedWithOrganizationalUnits && (
              <div>
                <strong>{translate('task.task_management.collaborated_with_organizational_units')}:</strong>
              </div>
            )}
            {collaboratedWithOrganizationalUnits && (
              <ul>{collaboratedWithOrganizationalUnits && collaboratedWithOrganizationalUnits.map((e) => <li>{e.name}</li>)}</ul>
            )}
            <div>
              <strong>{translate('task_template.description')}:</strong>
              <span>{parse(taskTemplate?.description)}</span>
            </div>

            <div>
              <strong>{translate('task.task_management.priority')}:</strong>
              <span>{taskTemplate && priority}</span>
            </div>

            <div>
              <strong>{translate('task_template.formula')}:</strong>
              <span>{taskTemplate?.formula}</span>
            </div>

            <div>
              <strong>{translate('task_template.parameters')}:</strong>
            </div>
            <ul>
              <li>
                <span style={{ fontWeight: 600 }}>daysOverdue</span> - Thời gian quá hạn (ngày)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>daysUsed</span> - Thời gian làm việc tính đến ngày đánh giá (ngày)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>totalDays</span> - Thời gian từ ngày bắt đầu đến ngày kết thúc công việc (ngày)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>averageActionRating</span> - Trung bình cộng điểm đánh giá hoạt động (1-10)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>numberOfFailedActions</span> - Số hoạt động không đạt (rating &lt; 5)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>numberOfPassedActions</span> - Số hoạt động đạt (rating &ge; 5)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>progress</span> - % Tiến độ công việc (0-100)
              </li>
              <li>
                <span style={{ fontWeight: 600 }}>p1, p2,...</span> - Thông tin công việc kiểu số có trong mẫu
              </li>
            </ul>
          </div>
        </div>

        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.roles')}</h4>
            <div>
              {!isProcess && (
                <React.Fragment>
                  {/**Người được xem mẫu công việc */}
                  <div>
                    <strong>{translate('task_template.permission_view')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.readByEmployees &&
                        taskTemplate?.readByEmployees.map((item, index) => {
                          return <li key={index}>{item && item.name}</li>
                        })}
                    </ul>
                  </div>
                </React.Fragment>
              )}
              {/**Người thực hiện mẫu công việc */}
              {responsibleEmployees && responsibleEmployees.length > 0 && (
                <React.Fragment>
                  <div>
                    <strong>{translate('task_template.performer')}</strong>
                  </div>
                  <div>
                    <ul>
                      {responsibleEmployees.map((item, index) => {
                        return <li key={index}>{item && item.name}</li>
                      })}
                    </ul>
                  </div>
                </React.Fragment>
              )}

              {/**Người phê duyệt mẫu công việc */}
              {accountableEmployees && accountableEmployees.length > 0 && (
                <React.Fragment>
                  <div>
                    <strong>{translate('task_template.approver')}</strong>
                  </div>
                  <div>
                    <ul>
                      {accountableEmployees.map((item, index) => {
                        return <li key={index}>{item && item.name}</li>
                      })}
                    </ul>
                  </div>
                </React.Fragment>
              )}
              {showMore}
              {/**Người quan sát mẫu công việc */}
              {taskTemplate?.consultedEmployees && taskTemplate?.consultedEmployees.length > 0 && (
                <React.Fragment>
                  <div>
                    <strong>{translate('task_template.observer')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.consultedEmployees.map((item, index) => {
                        return <li key={index}>{item && item.name}</li>
                      })}
                    </ul>
                  </div>
                </React.Fragment>
              )}

              {/**Người quan sát mẫu công việc */}
              {taskTemplate?.informedEmployees && taskTemplate?.informedEmployees.length > 0 && (
                <React.Fragment>
                  <div>
                    <strong>{translate('task_template.consultant')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.informedEmployees.map((item, index) => {
                        return <li key={index}>{item && item.name}</li>
                      })}
                    </ul>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='row row-equal-height'>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.activity_list')}</h4>

            {/**Các hoạt động mẫu công việc */}
            {!taskTemplate?.taskActions || taskTemplate?.taskActions.length === 0 ? (
              <strong>{translate('task_template.no_data')}</strong>
            ) : (
              taskTemplate?.taskActions.map((item, index, array) => (
                <div style={{ padding: '5px 30px' }}>
                  <div className='task-item' key={index}>
                    <p>
                      <b className='number'>{index + 1}</b>
                      <span className='content'>
                        {parse(item.name)}
                        {item.mandatory && <span className='note'>{translate('task_template.mandatory')}</span>}
                      </span>
                    </p>
                    <div>{parse(item.description)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.information_list')}</h4>

            {/**Các trường thông tin mẫu công việc */}
            <div>
              {!taskTemplate?.taskInformations || taskTemplate?.taskInformations.length === 0 ? (
                <strong>{translate('task_template.no_data')}</strong>
              ) : (
                taskTemplate?.taskInformations.map((item, index) => (
                  <div key={index}>
                    <strong>{item.name}</strong>
                    <ul>
                      <li>
                        <strong>{translate('task_template.code')}:</strong> {item.code}
                      </li>
                      <li>
                        <strong>{translate('task_template.datatypes')}:</strong> {formatTypeInfo(item.type)}
                      </li>
                      {item.filledByAccountableEmployeesOnly && <li>{translate('task_template.manager_fill')}</li>}
                      <li>
                        <strong>{translate('task_template.description')}:</strong>
                        {parse(item.description)}
                      </li>
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasktemplates, department } = state
  return { tasktemplates, department }
}

const actionCreators = {
  getTaskTemplate: taskTemplateActions.getTaskTemplateById
}
const connectedViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ViewTaskTemplate))
export { connectedViewTaskTemplate as ViewTaskTemplate }