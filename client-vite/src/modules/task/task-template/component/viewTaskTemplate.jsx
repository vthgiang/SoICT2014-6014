import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslate, withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'

const convertTimestampToDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toISOString().split('T')[0]
}

function ViewTaskTemplate({ isProcess, taskTemplate, listUser }) {
  const [showMore] = useState(false)
  const translate = useTranslate()

  const formatTypeInfo = (type) => {
    if (type === 'text') return translate('task_template.text')
    if (type === 'number') return translate('task_template.number')
    if (type === 'date') return translate('task_template.date')
    if (type === 'boolean') return 'Boolean'
    if (type === 'set_of_values') return translate('task_template.value_set')
    return ''
  }

  const listUserAccountable = []
  const listUserResponsible = []

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

  const organizationalUnit = taskTemplate?.organizationalUnit?.name
  const collaboratedWithOrganizationalUnits = taskTemplate?.collaboratedWithOrganizationalUnits
  const accountableEmployees = isProcess ? listUserAccountable : taskTemplate?.accountableEmployees
  const responsibleEmployees = isProcess ? listUserResponsible : taskTemplate?.responsibleEmployees

  const priority = useMemo(() => {
    switch (taskTemplate?.priority) {
      case 1:
        return translate('task.task_management.low')
      case 2:
        return translate('task.task_management.average')
      case 3:
        return translate('task.task_management.standard')
      case 4:
        return translate('task.task_management.high')
      case 5:
        return translate('task.task_management.urgent')
      default:
        return ''
    }
  }, [taskTemplate?.priority, translate])

  return (
    <>
      {/* Modal Body */}
      <div className='row row-equal-height' style={{ marginTop: -25 }}>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.general_information')}</h4>

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
              <ul>
                {collaboratedWithOrganizationalUnits.map((e) => (
                  <li key={e._id}>{e.name}</li>
                ))}
              </ul>
            )}
            <div>
              <strong>{translate('task_template.description')}:</strong>
              <span dangerouslySetInnerHTML={{ __html: taskTemplate?.description }} />
            </div>

            <div>
              <strong>{translate('task.task_management.priority')}:</strong>
              <span>{priority}</span>
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
                <>
                  <div>
                    <strong>{translate('task_template.permission_view')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.readByEmployees &&
                        taskTemplate?.readByEmployees.map((item, index) => <li key={index}>{item && item.name}</li>)}
                    </ul>
                  </div>
                </>
              )}
              {responsibleEmployees && responsibleEmployees.length > 0 && (
                <>
                  <div>
                    <strong>{translate('task_template.performer')}</strong>
                  </div>
                  <div>
                    <ul>
                      {responsibleEmployees.map((item, index) => (
                        <li key={index}>{item && item.name}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {accountableEmployees && accountableEmployees.length > 0 && (
                <>
                  <div>
                    <strong>{translate('task_template.approver')}</strong>
                  </div>
                  <div>
                    <ul>
                      {accountableEmployees.map((item, index) => (
                        <li key={index}>{item && item.name}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {showMore}
              {taskTemplate?.consultedEmployees && taskTemplate?.consultedEmployees.length > 0 && (
                <>
                  <div>
                    <strong>{translate('task_template.observer')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.consultedEmployees.map((item, index) => (
                        <li key={index}>{item && item.name}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {taskTemplate?.informedEmployees && taskTemplate?.informedEmployees.length > 0 && (
                <>
                  <div>
                    <strong>{translate('task_template.consultant')}</strong>
                  </div>
                  <div>
                    <ul>
                      {taskTemplate?.informedEmployees.map((item, index) => (
                        <li key={index}>{item && item.name}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='row row-equal-height'>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-6 col-lg-6'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4>{translate('task_template.activity_list')}</h4>

            {!taskTemplate?.taskActions || taskTemplate?.taskActions.length === 0 ? (
              <strong>{translate('task_template.no_data')}</strong>
            ) : (
              taskTemplate?.taskActions.map((item, index) => (
                <div style={{ padding: '5px 30px' }} key={index}>
                  <div className='task-item'>
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

      <div className='row row-equal-height'>
        <div className={`${isProcess ? 'col-lg-12 col-sm-12' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}`} style={{ padding: 10 }}>
          <div className='description-box' style={{ height: '100%' }}>
            <h4 className='mb-[16px]'>Danh sách các nhiệm vụ được ánh xạ bởi mẫu công việc</h4>

            {!taskTemplate?.isMappingTask ? (
              <strong>Không có nhiệm vụ được ánh xạ bởi mẫu công việc này</strong>
            ) : (
              <table className='table table-hover table-striped table-bordered'>
                <thead>
                  <tr>
                    <th className='col-fixed'>STT</th>
                    <th title='Tên nhiệm vụ'>Tên nhiệm vụ</th>
                    <th title='Mô tả'>Mô tả nhiệm vụ</th>
                    <th title='Khối lượng nhiệm vụ'>Khối lượng nhiệm vụ</th>
                    <th title='Đơn vị nhiệm vụ'>Đơn vị nhiệm vụ</th>
                    <th title='Ngày bắt đầ'>Ngày bắt đầu</th>
                    <th title='Ngày kết thúc'>Ngày kết thúc</th>
                    <th title='Thời gian tối đa hoàn thành'>Thời gian tối đa hoàn thành</th>
                  </tr>
                </thead>

                {taskTemplate?.listMappingTask?.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <center>{translate('task_template.no_data')}</center>
                    </td>
                  </tr>
                ) : (
                  <>
                    {taskTemplate.listMappingTask.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.taskName}</td>
                          <td dangerouslySetInnerHTML={{ __html: item.taskDescription }} />
                          <td>{item.target}</td>
                          <td>{item.unit}</td>
                          <td>{convertTimestampToDate(item.startDate)}</td>
                          <td>{convertTimestampToDate(item.endDate)}</td>
                          <td>{item.durations} h</td>
                        </tr>
                      )
                    })}
                  </>
                )}
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function mapState(state) {
  const { tasktemplates } = state
  return { tasktemplates }
}

const connectedViewTaskTemplate = connect(mapState)(withTranslate(ViewTaskTemplate))
export { connectedViewTaskTemplate as ViewTaskTemplate }
