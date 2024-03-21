import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'

const formatTarget = (value) => {
  let number
  if (value > 1000000) {
    number = Math.round(value / 1000) * 1000
    return new Intl.NumberFormat().format(number)
  } else return new Intl.NumberFormat().format(Math.ceil(value))
}

const PreviewKpiEmployee = (props) => {
  const { data, disableNotice } = props
  const [delay, setDelay] = useState(false)

  // Tinh chi so can no luc de thuc hien kpi
  useEffect(() => {
    const currentDate = new Date().getDate()
    if (data) {
      let effort = 0
      let effortIndex = 0
      let count = 0
      for (let item of data.kpis) {
        if (typeof item.target === 'number' && typeof item.current === 'number') {
          if (item.current >= item.target) {
            effort += 100 * item.weight
          } else {
            effort += (item.current / item.target) * 100 * item.weight
          }
          effortIndex += (currentDate / 30) * 100 * item.weight
          count++
        }
      }
      if (count === 0) {
        count = 1
      }
      if (effort / count < effortIndex / count) {
        setDelay(true)
      }
    }
  }, [data])

  return (
    <React.Fragment>
      <div className={`${disableNotice ? '' : 'ml-15 mr-15'}`} style={{ marginBottom: '15px' }}>
        {/* style={{ display: 'flex', alignItems: "stretch" }} style={{ display: 'flex', margin: 16 }}*/}
        {data && (
          <div className=''>
            <div
              className='card'
              style={{ backgroundColor: '#FFFFFF', borderRadius: 2, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', padding: 10 }}
            >
              <div className='card-body' style={{ position: 'relative' }}>
                {delay && !disableNotice && (
                  <span
                    style={{ position: 'absolute', right: 0 }}
                    onClick={() => {
                      Swal.fire({
                        title: 'Nhân viên này đang chậm tiến độ KPI',
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      })
                    }}
                  >
                    <i style={{ fontSize: 20 }} className='fa fa-exclamation-circle text-danger' />
                  </span>
                )}
                <span className='card-title' style={{ fontWeight: 600, fontSize: 18 }}>
                  {data.creator.name}
                </span>

                <div>
                  {data.kpis.map((kpi, index) => {
                    return (
                      <div style={{ margin: '15px 10px 0 10px' }} key={index}>
                        {kpi.itemType === 0 ? (
                          <div>
                            <span style={{ fontWeight: 600 }}>{kpi.name}</span>
                            <div>Hoàn thành công việc</div>
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontWeight: 600 }}>
                              {kpi.name}
                              {kpi.type === 0 && (
                                <span
                                  className='text-success'
                                  style={{ marginLeft: 5 }}
                                >{`(${Math.round((kpi.current / kpi.target) * 100)}%)`}</span>
                              )}
                            </span>
                            <div>
                              {kpi.type !== 0 ? (
                                <span>
                                  <span className='text-info' style={{ fontWeight: 600, fontSize: 20 }}>
                                    {kpi.current === 1 ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                  </span>
                                </span>
                              ) : (
                                <span>
                                  <span className='text-info' style={{ fontWeight: 600, fontSize: 20 }}>
                                    {formatTarget(kpi.current)}
                                  </span>
                                  {`/${formatTarget(kpi.target)} ${kpi.unit}`}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state
  return { dashboardEvaluationEmployeeKpiSet, createKpiUnit }
}

const actions = {}

const connectedPreviewKpiEmployee = connect(mapState, actions)(withTranslate(PreviewKpiEmployee))
export { connectedPreviewKpiEmployee as PreviewKpiEmployee }
