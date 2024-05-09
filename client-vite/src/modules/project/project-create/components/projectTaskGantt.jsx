import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import moment from 'moment'
import { getStorage } from '../../../../config' 

import toolbarGantt from '../../../../common-components/src/gantt/toolbarGantt' 
import '../../../../common-components/src/gantt/taskGantt.css'
import ToolbarGantt from '../../../../common-components/src/gantt/toolbarGantt'

const BAR_HEIGHT = 28

function ProjectTaskGantt(props) {
  const { translate } = props
  const { ganttId, zoom, line, onZoomChange, ganttData, unitOfTime } = props
  const [dataProcessor, setDataProcessor] = useState(null)
  const [lang, setLang] = useState(getStorage('lang'))
  const [gantt, setGantt] = useState(window.initializationGantt())

  const draw_planned = (task) => {
    if (task.start_date && task.end_date) {
      var sizes = gantt.getTaskPosition(task, task.start_date, task.end_date)
      var el = document.createElement('div')
      el.className = 'baseline'
      el.style.left = sizes.left + 'px'
      el.style.width = sizes.width + 'px'
      el.style.top = sizes.top + gantt.config.bar_height + 13 + 'px'
      return el
    }
    return false
  }

  useEffect(() => {
    initZoom(gantt)

    // Config biểu đồ
    if (gantt) {
      gantt.config.drag_move = false
      gantt.config.drag_multiple = false
      gantt.config.drag_progress = false
      gantt.config.drag_resize = false
      gantt.config.autosize = true
      gantt.config.details_on_dblclick = false
      gantt.config.columns = [
        {
          name: 'taskName',
          label: 'Tên công việc',
          resize: true,
          width: '*'
        },
        {
          name: 'estimateTime',
          label: `Thời lượng (${unitOfTime === 'days' ? translate('system_admin.system_setting.backup.date') : translate('system_admin.system_setting.backup.hour')})`,
          align: 'center',
          resize: true,
          width: '*'
        }
      ]
      gantt.config.xml_date = '%Y-%m-%d %H:%i'

      gantt.config.task_height = BAR_HEIGHT
      gantt.config.bar_height = BAR_HEIGHT
      gantt.config.row_height = 50
      gantt.config.lightbox.sections = [
        { name: 'description', height: 70, map_to: 'text', type: 'textarea', focus: true },
        { name: 'time', map_to: 'auto', type: 'duration' }
      ]

      // Thêm và custom tooltip
      gantt.plugins({
        tooltip: true,
        marker: true,
        critical_path: true,
      })
      gantt.templates.tooltip_text = function (start, end, task) {
        return `<b>${'Tên công việc'}:</b> ${task.text}
                        <br/>
                        <b>Thời điểm bắt đầu dự kiến:</b> ${moment(task.start_date).format('DD-MM-YYYY HH:mm')} 
                        <br/>
                        <b>Thời điểm kết thúc dự kiến:</b> ${moment(task.end_date).format('DD-MM-YYYY HH:mm')}
                        <br>
                        <b>KPI liên quan - Trọng số:</b> ${moment(task.end_date).format('DD-MM-YYYY HH:mm')}
                        <br/>`
      }

      gantt.attachEvent('onTaskLoading', function (task) {
        task.start_date = gantt.date.parseDate(task.start_date, 'xml_date')
        task.end_date = gantt.date.parseDate(task.end_date, 'xml_date')
        return true
      })

      // gantt.attachEvent("onTaskDblClick", (id, mode) => {
      //     props.attachEvent(id);
      // });
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
      gantt.init(`task-gantt-${ganttId}`)
      gantt.parse(ganttData)
      // Add lại layer baseline dự án khi re-render component
      // gantt.addTaskLayer(task => draw_planned(task));

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

    // Focus vào ngày hiện tại
    let date = new Date()
    let date_x = gantt.posFromDate(date)
    let scroll_to = Math.max(date_x - gantt.config.task_scroll_offset, 0)
    gantt.scrollTo(scroll_to)

    setZoom(gantt, zoom)
  })

  useEffect(() => {
    gantt.config.columns = [
      {
        name: 'taskName',
        label: 'Tên công việc',
        resize: true,
        width: '*'
      },
      {
        name: 'estimateTime',
        label: `Thời lượng (${unitOfTime === 'days' ? translate('system_admin.system_setting.backup.day') : translate('system_admin.system_setting.backup.hour')})`,
        align: 'center',
        resize: true,
        width: '*'
      }
    ]
  }, [zoom])

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

  let heightCalc = line ? line * 50 : 80
  return (
    <React.Fragment>
      <ToolbarGantt zoom={zoom} onZoomChange={onZoomChange} />
      <div
        className='gantt-container'
        id={`task-gantt-${ganttId}`}
        style={{
          width: '100%',
          height: heightCalc
        }}
      />
    </React.Fragment>
  )
}

function mapState(state) {
  const {} = state
  return {}
}
const actions = {}
const ganttConnected = connect(mapState, actions)(withTranslate(ProjectTaskGantt))
export { ganttConnected as ProjectTaskGantt }
