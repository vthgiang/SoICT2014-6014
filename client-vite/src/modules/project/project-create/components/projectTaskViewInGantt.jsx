import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import { convertUserIdToUserName } from '../../projects/components/functionHelper'
import { UserActions } from '../../../super-admin/user/redux/actions' 
import { ProjectTaskGantt } from './projectTaskGantt'

const ProjectTaskViewInGantt = (props) => {
  const { translate, taskList, allEmployee, unitOfTime, projectStartTime } = props

  const [currentZoom, setCurrentZoom] = useState(translate('system_admin.system_setting.backup.date'))
  const [dataTask, setDataTask] = useState({
    data: [],
    links: [],
    count: 0,
    line: 0
  })
  const taskStatus = ['inprocess']
  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom)
    setDataTask(getDataTask(zoom))
  }
  const attachEvent = (id) => {
    if (!RegExp(/baseline/g).test(String(id))) {
      props.getTaskById(id)
      window.$(`#modal-detail-task-Employee`).modal('show')
    }
  }

  function topologicalSort(tasks) {
    const result = [];
    const visited = new Set();
    const inProgress = new Set();
    
    function visit(task) {
      if (inProgress.has(task)) {
        // throw new Error('Tasks have cyclic dependencies.');
        throw ['cycle_dependency_task_error']
      }
      
      if (!visited.has(task)) {
        inProgress.add(task);
        
        const dependencies = task?.preceedingTasks && task.preceedingTasks?.length ? task?.preceedingTasks.map((item) => item) : [];
        dependencies.forEach(depCode => {
          const dependency = tasks.find(t => t.code === depCode);
          if (!dependency) {
            // throw new Error(`Dependency with id ${depCode} not found.`);
            throw ['dependency_not_found']
          }
          visit(dependency);
        });
        
        inProgress.delete(task);
        visited.add(task);
        result.unshift(task);
      }
    }
    
    for (const task of tasks) { 
      visit(task);
    }
    
    return result.reverse();
  }

  useEffect(() => {
    setDataTask(getDataTask())
  }, [])

  const getEndDate = (start, estimateTime, unitOfTime) => {
    // console.log("test Unit of Time: ", unitOfTime)
    if (unitOfTime === 'days') {
      const numDay = Math.floor(estimateTime)
      const remainHour = (estimateTime - numDay) * 24
      // console.log("day h", numDay, remainHour)
      let endTime = moment(start).add(numDay, 'days')
      endTime.add(remainHour, 'hours')
      // console.log("endtime: ", endTime.format("YYYY-MM-DD HH:mm"))
      return endTime
    } else {
      // unitOfTime = hours
      let endTime = moment(start).add(estimateTime, 'hours')
      return endTime
    }
  }

  const getDataTask = (zoom = currentZoom) => {
    // Dựa vào currentZoom để tính toán duration theo giờ, ngày, tuần, tháng
    let currentMode = ''
    switch (zoom) {
      case translate('system_admin.system_setting.backup.hour'): {
        currentMode = 'hours'
        break
      }
      case translate('system_admin.system_setting.backup.date'): {
        currentMode = 'days'
        break
      }
      case translate('system_admin.system_setting.backup.week'): {
        currentMode = 'weeks'
        break
      }
      case translate('system_admin.system_setting.backup.month'): {
        currentMode = 'months'
        break
      }
      default: {
        break
      }
    }
    let data = [],
      links = [],
      linkId = 0,
      line = 0
    let taskWithTime = []

  
    if (taskList && taskList.length > 0) {
      let sortedTaskList = topologicalSort(taskList)
      console.log("sortedTaskList: ", sortedTaskList)
      for (let taskItem of sortedTaskList) {
        let start = projectStartTime ? projectStartTime : ''   
        const estimateTime = Number(taskItem?.estimateNormalTime)
        start = moment(new Date(start))
        let end = getEndDate(start, estimateTime, unitOfTime)

        if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
          let preceedingTaskArr = taskItem.preceedingTasks?.map((x) => x.trim()) ?? []

          let preTasks = taskWithTime.filter((x) => preceedingTaskArr.indexOf(String(x.code.trim())) !== -1)
          preTasks.sort((a, b) => {
            // console.log(a.end, b.end)
            return -moment(a.end).diff(moment(b.end))
          })
          if (preTasks[0]?.end) {
            start = preTasks[0]?.end
            end = getEndDate(start, estimateTime, unitOfTime)
          }
        }

        taskWithTime.push({
          ...taskItem,
          start: start,
          end: end,
          taskName: taskItem.name
        })
      }
    }
    if (taskWithTime && taskWithTime.length > 0) {
      for (let taskItem of taskWithTime) {
        data.push({
          id: taskItem.code,
          text: taskItem.taskName,
          estimateTime: taskItem.estimateNormalTime,
          taskName: `${taskItem.name}`,
          requireAsset: taskItem.requireAsset,
          // responsible: `${taskItem.responsibleEmployees.map(resItem => convertUserIdToUserName( , resItem.name)).join(', ')}`,
          start_date: moment(taskItem.start).format('YYYY-MM-DD HH:mm'),
          end_date: moment(taskItem.end).format('YYYY-MM-DD HH:mm')
        })

        // Nếu task có các task tiền nhiệm thì tạo link
        if (taskItem.preceedingTasks && taskItem.preceedingTasks.length > 0) {
          // let preceedingTaskArr = taskItem.preceedingTasks.split(',').map(x => x.trim());
          let preceedingTaskArr = taskItem.preceedingTasks?.map((x) => x.trim()) ?? []
          for (let preceedingItem of preceedingTaskArr) {
            links.push({
              id: linkId,
              source: preceedingItem,
              target: taskItem.code,
              type: '0'
            })
            linkId++
          }
        }
      }
      line = data.length
    }
    return {
      data,
      // count,
      line,
      links
    }
  }

  return (
    <React.Fragment>
      <div style={{ marginTop: '0px' }}>
        <>
          <ProjectTaskGantt
            ganttData={dataTask}
            zoom={currentZoom}
            line={dataTask.line}
            onZoomChange={handleZoomChange}
            unitOfTime={unitOfTime}
            // attachEvent={attachEvent}
          />
        </>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, tasks } = state
  return { project, user, tasks }
}

const mapDispatchToProps = {
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}
const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectTaskViewInGantt))
export { connectedComponent as ProjectTaskViewInGantt }
