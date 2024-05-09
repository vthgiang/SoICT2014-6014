import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { Gantt, SelectMulti } from "../../../../common-components";
import dayjs from 'dayjs'
import { EmployeeGantt } from "./employeeGantt";
import { AssetGantt } from "./assetGantt";

function ProposalScheduleGanttAsset(props) {
  let infoSearch = {
    taskStatus: ["inprocess"]
  }
  function groupTasksByAsset(tasksProject) {
    const groupedByAsset = {}

    if (!tasksProject || !tasksProject?.length) {
      return groupedByAsset
    }

    tasksProject.forEach((task) => {
      let assets = task?.assets 
      if (assets && assets?.length) {
        assets.forEach((asset) => {
          const assetName = asset?.assetName
          if (!groupedByAsset.hasOwnProperty(assetName) || !groupedByAsset[assetName]) {
            groupedByAsset[assetName] = []
          }
          groupedByAsset[assetName].push(task);
        })
      }
    })

    return groupedByAsset
  }

  const { translate, tasksProject, hideFilterStatus = false } = props

  const [state, setState] = useState({
    currentZoom: translate('system_admin.system_setting.backup.date'),
    messages: [],
    taskStatus: ["inprocess"],
    dataCalendar: {}
  })
  const { dataCalendar, currentZoom } = state

  const getProjectTasksGroupByAsset = (tasksProject) => {
    let data = [];
    let links = [];
    let linkId = 0
    if(tasksProject && tasksProject?.length) {
      tasksProject.forEach((taskItem) => {
        let preceedingTaskArr = taskItem.preceedingTasks?.map((x) => x.link?.trim()) ?? []
        // console.log("preceedingTasks: ", preceedingTaskArr)
        if(preceedingTaskArr && preceedingTaskArr?.length) {
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
      })
    }
    let taskGroup = groupTasksByAsset(tasksProject || []);
    let markNumber = 0;
    if (taskGroup && Object.keys(taskGroup) && Object.keys(taskGroup)?.length > 0) {
      Object.keys(taskGroup).forEach((key, index) => { 
        // console.log("key: ", key)
        let values = taskGroup[key];
        // console.log("value: ", values)
        data.push({
          id: markNumber + index + 1,
          text: "",
          role: key,
          assetName: key,
          start_date: null,
          duration: null,
          render: "split"
        });
  
        if (values && values?.length) {
          values.forEach((value, indexValue) => {
            // console.log("value: ", value, index, key)
            data.push({
              id: markNumber + index + indexValue + 2,
              text: value?.name,
              start_date: dayjs(value?.startDate).format("YYYY-MM-DD HH:mm"),
              end_date: dayjs(value?.endDate).format("YYYY-MM-DD HH:mm"),
              progress: 3,
              process: 3,
              parent: markNumber + index + 1
            });    
          })
    
          markNumber += values.length;
        }
      })
    }

    return {
      dataAllTask: {data: data, links: links},
      countAllTask: data?.filter(_ => _.render == null).length,
      lineAllTask: data?.filter(_ => _.render != null).length
    }
  }

  useEffect(() => {
    const projectTasksData = getProjectTasksGroupByAsset(tasksProject)
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
      <div className="gantt qlcv">
        <AssetGantt
          ganttId="asset-proposal-schedule-gantt-chart"
          ganttData={dataCalendar?.dataAllTask}
          zoom={currentZoom}
          count={dataCalendar?.countAllTask}
          line={dataCalendar?.lineAllTask}
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

export default connect(mapState, actions)(withTranslate(ProposalScheduleGanttAsset))