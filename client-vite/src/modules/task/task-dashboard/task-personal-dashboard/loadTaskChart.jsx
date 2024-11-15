import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectMulti } from '../../../../common-components'
import c3 from 'c3'
import 'c3/c3.css'
import dayjs from 'dayjs'
const CHART_INFO = {
  currentRoles: []
}

const LoadTaskChart = (props) => {
  const [role, setRole] = useState(['res', 'acc', 'con'])
  const { translate } = props
  let { startMonth, endMonth } = props

  useEffect(() => {
    let { tasks } = props
    const { loadingResponsible, loadingConsulted, loadingAccountable } = tasks

    if (!loadingConsulted && !loadingAccountable && !loadingResponsible) {
      let res = tasks.responsibleTasks ? tasks.responsibleTasks : []
      let acc = tasks.accountableTasks ? tasks.accountableTasks : []
      let con = tasks.consultedTasks ? tasks.consultedTasks : []

      if (res && acc && con) {
        let allTask = { res, acc, con }
        let taskList = []

        for (let i in role) {
          taskList = taskList.concat(allTask[role[i]])
        }
        // Lấy tất cả công việc, ko chỉ lấy mõi công việc đang thực hiện.
        // let improcessTask = taskList?.filter(x => x.status === "inprocess");
        let improcessTask = taskList
        let startTime = new Date(startMonth.split('-')[0], startMonth.split('-')[1] - 1, 1)
        let endTime = new Date(endMonth.split('-')[0], endMonth.split('-')[1] ? endMonth.split('-')[1] : 1, 1)
        let category = []
        let m = startMonth.slice(5, 7)
        let y = startMonth.slice(0, 4)
        let period = Math.round((endTime - startTime) / 2592000000)
        let data = []
        for (let i = 0; i < period; i++) {
          category.push(dayjs([y, m].join('-')).format('M-YYYY'))
          m++
          data[i] = 0
        }
        for (let i in improcessTask) {
          let improcessDay = 0
          let startDate = new Date(improcessTask[i].startDate)
          let endDate = new Date(improcessTask[i].endDate)
          if (startTime < endDate) {
            for (let j = 0; j < period; j++) {
              let tmpStartMonth = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]) - 1, 1)
              let tmpEndMonth = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]), 0)

              if (tmpStartMonth > startDate && tmpEndMonth < endDate) {
                improcessDay = tmpEndMonth.getDate()
              }
              // thang dau
              else if (tmpStartMonth < startDate && tmpEndMonth > startDate) {
                improcessDay = tmpEndMonth.getDate() - startDate.getDate()
              } else if (tmpStartMonth < endDate && endDate < tmpEndMonth) {
                improcessDay = endDate.getDate()
              } else {
                improcessDay = 0
              }
              data[j] += Math.round(
                improcessDay /
                  (improcessTask?.[i]?.accountableEmployees?.length +
                    improcessTask?.[i]?.consultedEmployees?.length +
                    improcessTask?.[i]?.responsibleEmployees?.length)
              )
            }
          }
        }
        data.unshift('tải công viêc')
        barChart(data, category)
      }
    }
  }, [props, role])

  const handleSelectStatus = (value) => {
    if (value == []) value = ['res', 'acc', 'con', 'inf']
    CHART_INFO.currentRoles = value
  }

  const handleSearchData = () => {
    let { currentRoles } = CHART_INFO
    setRole(currentRoles)
  }

  const barChart = (data, category) => {
    const pie = c3.generate({
      bindto: document.getElementById('weight_task_chart'),

      data: {
        // x: 'x',
        columns: [
          //   ['x', "10-2020", "11-2020", "12-2020", "01-2021"],
          data
        ],
        type: 'line'
      },

      axis: {
        x: {
          label: {
            text: translate('task.task_management.time'),
            position: 'outer-right'
          },

          type: 'category',
          categories: category
        },
        y: {
          label: {
            text: translate('task.task_management.load_task'),
            position: 'outer-top'
          }
        }
      },

      legend: {
        show: false
      }
    })
  }

  return (
    <React.Fragment>
      <div className='qlcv'>
        <div className='form-inline'>
          {/* Chọn trạng thái công việc */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.role')}</label>
            <SelectMulti
              id='multiRole'
              items={[
                { value: 'res', text: translate('task.task_management.responsible') },
                { value: 'acc', text: translate('task.task_management.accountable') },
                { value: 'con', text: translate('task.task_management.consulted') }
              ]}
              onChange={handleSelectStatus}
              options={{
                nonSelectedText: translate('task.task_management.select_all_role'),
                allSelectedText: translate('task.task_management.select_all_role')
              }}
              value={role}
            ></SelectMulti>
          </div>
          <button className='btn btn-success' onClick={handleSearchData}>
            {translate('task.task_management.filter')}
          </button>
        </div>
      </div>
      <section id='weight_task_chart'></section>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actions = {}

const connectedLoadTask = connect(mapState, actions)(withTranslate(LoadTaskChart))
export { connectedLoadTask as LoadTaskChart }
