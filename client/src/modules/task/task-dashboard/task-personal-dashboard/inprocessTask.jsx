import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectMulti } from '../../../../common-components'
import { filterDifference } from '../../../../helpers/taskModuleHelpers'
import c3 from 'c3'
import 'c3/c3.css'
import dayjs from 'dayjs'

const CHART_INFO = {
  currentRoles: []
}

const InprocessTask = (props) => {
  const [role, setRole] = useState(['res', 'acc', 'con', 'inf'])
  const { translate } = props

  useEffect(() => {
    let { tasks } = props

    if (tasks) {
      let res = tasks.responsibleTasks
      let acc = tasks.accountableTasks
      let con = tasks.consultedTasks
      let inf = tasks.informedTasks

      if (res && acc && con && inf) {
        let allTask = { res, acc, con, inf }
        let taskList = []

        for (let i in role) {
          taskList = taskList.concat(allTask[role[i]])
        }

        taskList = filterDifference(taskList)
        let inprocessTask = taskList?.filter((x) => x.status === 'inprocess')

        let delayed = [translate('task.task_management.delayed_time')]
        let intime = [translate('task.task_management.in_time')]
        let notAchived = [translate('task.task_management.not_achieved')]
        let currentTime = dayjs(new Date())
        let delayedCnt = 0,
          intimeCnt = 0,
          notAchivedCnt = 0

        for (let i in inprocessTask) {
          let startTime = dayjs(inprocessTask[i].startDate)
          let endTime = dayjs(inprocessTask[i].endDate)
          let duration = endTime.diff(startTime, 'day')

          if (currentTime > endTime) {
            notAchivedCnt++ // quá hạn
          } else {
            let processDay = Math.floor((inprocessTask[i].progress * duration) / 100)
            let startToNow = currentTime.diff(startTime, 'days')

            if (startToNow > processDay) {
              // Trễ tiến độ
              delayedCnt++
            } else if (startToNow <= processDay) {
              // Đúng tiến độ
              intimeCnt++
            }
          }
        }
        delayed.push(delayedCnt)
        intime.push(intimeCnt)
        notAchived.push(notAchivedCnt)

        pieChart(delayed, intime, notAchived)
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

  const pieChart = (delayed, intime, notAchived) => {
    const pie = c3.generate({
      bindto: document.getElementById('inprocess'),

      data: {
        columns: [intime, delayed, notAchived],
        type: 'pie'
      },
      tooltip: {
        format: {
          value: function (value) {
            return value
          }
        }
      },

      color: {
        pattern: ['#28A745 ', '#f39c12', '#DD4B39']
      },

      padding: {
        top: 20,
        bottom: 20,
        right: 20,
        left: 20
      },

      legend: {
        show: true
      }
    })
  }

  return (
    <React.Fragment>
      <div className='qlcv'>
        <div className='form-inline'>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.role')}</label>
            <SelectMulti
              id='multiSelectStatusInprocessTask'
              items={[
                { value: 'res', text: translate('task.task_management.responsible') },
                { value: 'acc', text: translate('task.task_management.accountable') },
                { value: 'con', text: translate('task.task_management.consulted') },
                { value: 'inf', text: translate('task.task_management.informed') }
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

      <section id='inprocess'></section>
    </React.Fragment>
  )
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actions = {}

const connectedInprocessTask = connect(mapState, actions)(withTranslate(InprocessTask))
export { connectedInprocessTask as InprocessTask }
