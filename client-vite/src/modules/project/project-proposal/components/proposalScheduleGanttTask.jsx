import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { Gantt, SelectMulti } from "../../../../common-components";
import dayjs from 'dayjs'
import { EmployeeGantt } from "./employeeGantt";
import { TaskGantt } from "./taskGantt";

function ProposalScheduleGanttTask(props) {
  const { translate, tasksProject } = props

  const [state, setState] = useState({
    currentZoom: translate('system_admin.system_setting.backup.date'),
    messages: [],
    taskStatus: ["inprocess"],
    dataCalendar: {}
  })
  const { dataCalendar, currentZoom } = state
  const getProjectTasks = (tasksProject) => {
    let data = [];
    let links = [];
    let linkId = 0

    if(tasksProject && tasksProject?.length) {
      tasksProject.forEach((taskItem) => {
        let preceedingTaskArr = taskItem?.preceedingTasks?.map((x) => x.link?.trim()) ?? []

        if(preceedingTaskArr && preceedingTaskArr?.length) {
          for (let preceedingItem of preceedingTaskArr) {
            links.push({
              id: linkId,
              source: preceedingItem,
              target: taskItem?.code,
              type: '0'
            })
            linkId++
          }
        }
        data.push({
          id: taskItem?.code,
          text: taskItem?.name,
          estimateTime: taskItem?.estimateNormalTime,
          taskName: `${taskItem?.name}`,
          start_date: dayjs(taskItem?.startDate).format("YYYY-MM-DD HH:mm"),
          end_date: dayjs(taskItem?.endDate).format("YYYY-MM-DD HH:mm"),
          progress: 3,
          assets: taskItem?.assets,
          assignee: taskItem?.assignee
        })
      })
    }

    // console.log("data: ", data)

    return {
      dataAllTask: {data: data, links: links},
      count: data?.length,
      line: data?.length
    }
  }

  useEffect(() => {
    const projectTasksData = getProjectTasks(tasksProject)
    setState({
      ...state,
      dataCalendar: projectTasksData
    })
  }, [JSON.stringify(tasksProject)])

  const handleZoomChange = (zoom) => {
    setState({
      ...state,
      currentZoom: zoom
    });
  }

  return (
    <React.Fragment>
      <div className="gantt qlcv" >
        <TaskGantt
          ganttId="task-proposal-schedule-gantt-chart"
          ganttData={dataCalendar?.dataAllTask}
          zoom={currentZoom}
          count={dataCalendar?.count}
          line={dataCalendar?.line}
          // unit={unit}
          onZoomChange={handleZoomChange}
        />
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { project, user, projectProposal } = state
  return { project, user, projectProposal }
}

const actions = {
  // getProjectsDispatch: ProjectActions.getProjectsDispatch,
  // proposalForProjectDispatch: ProjectProposalActions.proposalForProjectDispatch
}

export default connect(mapState, actions)(withTranslate(ProposalScheduleGanttTask))
  