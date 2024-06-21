import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import moment from 'moment'
import { getStorage } from '../../../../config' 

import { SlimScroll, ToolTip } from '../../../../common-components' 
import ToolbarGantt from '../../../../common-components/src/gantt/toolbarGantt'



const BAR_HEIGHT = 30
function TaskGantt(props) {
  const { translate } = props
  const { ganttId, zoom, line, onZoomChange, unit, ganttData } = props
  // console.log("ganttData: ", ganttData)
  const [dataProcessor, setDataProcessor] = useState(null)
  const [lang, setLang] = useState(getStorage('lang'))
  const [gantt, setGantt] = useState(window.initializationGantt())
  useEffect(() => {
    initZoom(gantt)

    // Config biểu đồ
    if (gantt) {
      gantt.config.drag_move = false
      gantt.config.drag_multiple = false
      gantt.config.drag_progress = false
      gantt.config.drag_resize = false
      // gantt.config.links = true
      gantt.config.details_on_dblclick = false
      gantt.config.columns = [
        {
          name: 'taskName',
          label: "Tên công việc",
          align: 'right',
          resize: true,
          width: 180
        }
      ]
      gantt.config.xml_date = '%Y-%m-%d %H:%i'
      gantt.config.task_height = BAR_HEIGHT
      gantt.config.bar_height = BAR_HEIGHT
      gantt.config.row_height = 40

      // gantt.root.css("maxHeight", window.innerHeight/2);
      // Màu sắc cho công việc
      gantt.templates.task_class = function (start, end, task) {
        switch (task.process) {
          case 0:
            return 'delay'
          case 1:
            return 'intime'
          case 2:
            return 'notAchive'
          default:
            return 'none'
        }
      }

      // Thêm và custom tooltip
      gantt.plugins({
        tooltip: true,
        marker: true,
        critical_path: true,
      })
      gantt.templates.tooltip_text = function (start, end, task) {
        return `<b>${translate('task.task_dashboard.task_name')}:</b> ${task.text} 
                    <br/>
                    <b>${translate('task.task_dashboard.start_date')}:</b> ${moment(start).format('DD-MM-YYYY hh:mm A')} 
                    <br/>
                    <b>${translate('task.task_dashboard.end_date')}:</b> ${moment(end).format('DD-MM-YYYY hh:mm A')}
                    <br/>
                    <b>${'Nhân viên được phân công'}:</b> ${task?.assignee}
                    <br/>
                    <b>${'Tài sản được phân công'}:</b> ${task?.assets && task?.assets?.length ? task?.assets.map((item) => item?.assetName): ''}
                    `
      }

      gantt.attachEvent('onTaskDblClick', (id, mode) => {
        props.attachEvent(id)
      })
    }

    return () => {
      if (dataProcessor) {
        dataProcessor.destructor()
        setDataProcessor(null)
      }
    }
  }, [])

  useEffect(() => {
    if (gantt) {
      gantt.clearAll()
      gantt.init(`task-proposal-schedule-gantt-${ganttId}`)
      if (ganttData) {
        gantt.parse(ganttData)
      }

      // Thêm marker thời gian hiện tại
      const dateToStr = gantt.date.date_to_str(gantt.config.task_date)
      const markerId = gantt.addMarker({
        start_date: new Date(),
        css: 'today',
        text: 'Now',
        title: dateToStr(new Date())
      })
      gantt.getMarker(markerId)
    }

    let outer = window.$(`#task-proposal-schedule-gantt-${ganttId}`)
    // console.log(outer.css("height"), window.innerHeight / 2);
    let lenghHeight = outer.css('height')
    lenghHeight = lenghHeight.slice(0, lenghHeight.length - 2)
    lenghHeight = parseInt(lenghHeight)
    if (lenghHeight > window.innerHeight * 4 / 5) {
      outer.css({ 'max-height': `${window.innerHeight * 4 / 5}px` })
    }
    //console.log(outer[0]);
    // Focus vào ngày hiện tại
    let date = new Date()
    let date_x = gantt.posFromDate(date)
    let scroll_to = Math.max(date_x - gantt.config.task_scroll_offset, 0)
    gantt.scrollTo(scroll_to)

    setZoom(gantt, zoom)
  })

  const activeSlimScroll = () => {
    if (ganttId) {
      window.$(`#task-proposal-schedule-gantt-${ganttId}`).ready(function () {
        SlimScroll.removeVerticalScrollStyleCSS(`gantt-${ganttId}`)
        SlimScroll.addVerticalScrollStyleCSS(`gantt-${ganttId}`, 500, true)
      })
    }
  }
  const initZoom = (gantt) => {
    gantt.ext.zoom.init({
      levels: [
        {
          name: translate('system_admin.system_setting.backup.hour'),
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: 'day', step: 1, format: '%d %M' },
            { unit: 'hour', step: 1, format: '%H' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.date'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'week', step: 1, format: '# %W' },
            { unit: 'day', step: 1, format: '%d %M' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.week'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'month', step: 1, format: '%F' },
            { unit: 'week', step: 1, format: 'Tuần %W' }
          ]
        },
        {
          name: translate('system_admin.system_setting.backup.month'),
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: 'year', step: 1, format: '%Y' },
            { unit: 'month', step: 1, format: '%F' }
          ]
        }
      ]
    })
  }

  const setZoom = (gantt, value) => {
    let level = gantt?.ext?.zoom?.getLevels()
    if (level?.length > 0) {
      level = level.map((item) => item?.name)
    }
    if (gantt?.ext?.zoom && level.includes(value)) {
      gantt.ext.zoom.setLevel(value)
    }
  }

  let heightCalc = parseFloat(line) ? parseFloat(line) * 40 + 80 : 80

  return (
    <React.Fragment>
      <ToolbarGantt zoom={zoom} onZoomChange={onZoomChange} />
      <div className='gantt-container' id={`task-proposal-schedule-gantt-${ganttId}`} style={{ width: '100%', height: heightCalc }} />
    </React.Fragment>
  )
}

function mapState(state) {
  const {} = state
  return {}
}
const actions = {}
const ganttConnected = connect(mapState, actions)(withTranslate(TaskGantt))
export { ganttConnected as TaskGantt }
