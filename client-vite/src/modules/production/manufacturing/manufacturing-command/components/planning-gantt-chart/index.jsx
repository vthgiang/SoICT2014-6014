import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import Timeline, { CustomMarker, DateHeader, TimelineHeaders, SidebarHeader } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import { SelectBox } from '../../../../../../common-components'
import { formatDate } from '../../../../../../helpers/formatDate'
import { worksActions } from '../../../manufacturing-works/redux/actions'

import './planningGantChart.css'

const PlanningGanttChart = (props) => {
  const { translate, listCommands, manufacturingWorks, editable = false } = props
  const [viewMode, setViewMode] = useState('mill')
  const [works, setWorks] = useState('')
  const [itemGroupKey, setItemGroupKey] = useState('manufacturingMillId')
  const [groups, setGroups] = useState([])
  const [items, setItems] = useState([])

  const keys = {
    groupIdKey: 'id',
    groupTitleKey: 'name',
    groupRightTitleKey: 'rightTitle',
    itemIdKey: 'id',
    itemTitleKey: 'name',
    itemDivTitleKey: 'name',
    itemGroupKey: itemGroupKey,
    itemTimeStartKey: 'startTime',
    itemTimeEndKey: 'endTime'
  }

  const getWorksArr = () => {
    const worksArr = []
    manufacturingWorks.listWorks.forEach((works) => {
      worksArr.push({
        value: works._id,
        text: works.name
      })
    })

    return worksArr
  }

  const handleChangeViewMode = (value) => {
    setViewMode(value[0])
  }

  const handleChangeWorks = (value) => {
    setWorks(value[0])
    props.getDetailManufacturingWorks(value[0])
  }

  let count = 0
  const listWorkOrder = listCommands.flatMap((command) => {
    return command.workOrders.map((wo, index) => {
      count++
      return {
        id: count,
        name: `${index + 1}/${command.code}`,
        manufacturingCommandId: command._id,
        manufacturingMillId: wo.manufacturingMill._id,
        startTime: moment(wo.startDate, 'DD-MM-YYYY').add(wo.startHour, 'hour'),
        endTime: moment(wo.endDate, 'DD-MM-YYYY').add(wo.endHour, 'hour'),
        progress: wo.progress,
        tasks: wo.tasks.map((task) => ({
          ...task,
          startDate: formatDate(task.startDate),
          endDate: formatDate(task.endDate)
        })),
        itemProps: {
          style: {
            color: '#000',
            background: `linear-gradient(to right, rgba(61, 185, 211) ${wo.progress}%, rgba(61, 185, 211, 0.6) ${wo.progress}%)`
          }
        }
      }
    })
  })

  const listWorkOrderByMachine = listWorkOrder.flatMap((wo) =>
    wo.tasks
      .filter((task) => task.machine)
      .map((task) => {
        const progress = task.task?.progress? task.task.progress : wo.progress
        return {
          id: task._id,
          name: wo.name,
          startTime: moment(task.startDate, 'DD-MM-YYYY').add(task.startHour, 'hour'),
          endTime: moment(task.endDate, 'DD-MM-YYYY').add(task.endHour, 'hour'),
          machineId: task.machine._id,
          itemProps: {
            style: {
              color: '#000',
              background: `linear-gradient(to right, rgba(255, 193, 7) ${progress}%, rgba(255, 293, 7, 0.6) ${progress}%)`
            }
          }
        }
      })
  )

  const listWorkOrderByEmployee = listWorkOrder.flatMap((wo) =>
    wo.tasks
      .filter((task) => task.responsible)
      .map((task) => {
        if (task.responsible) {
          const progress = task.task?.progress? task.task.progress : wo.progress
          return {
            id: task._id,
            name: wo.name,
            startTime: moment(task.startDate, 'DD-MM-YYYY').add(task.startHour, 'hour'),
            endTime: moment(task.endDate, 'DD-MM-YYYY').add(task.endHour, 'hour'),
            employeeId: task.responsible._id,
            itemProps: {
              style: {
                color: '#000',
                background: `linear-gradient(to right, rgba(253, 126, 20) ${progress}%, rgba(253, 126, 20, 0.6) ${progress}%)`
              }
            }
          }
        }
      })
  )

  const getSidebarHeader = () => {
    switch (viewMode) {
      case 'mill':
        return translate('manufacturing.command.mills')
      case 'employee':
        return translate('manufacturing.command.employee')
      case 'machine':
        return translate('manufacturing.command.machine')
      default:
        return ''
    }
  }

  const handleItemResize = (itemId, time, edge) => {
    const itemIndex = items.findIndex((item) => item.id === itemId)
    let updatedItems = [...items]

    if (edge === 'left') {
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], startTime: time }
    } else {
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], endTime: time }
    }

    setItems(updatedItems)
  }

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const itemIndex = items.findIndex((item) => item.id === itemId)
    const item = items[itemIndex]

    const duration = item.endTime - item.startTime

    const updatedItem = {
      ...item,
      startTime: dragTime,
      endTime: dragTime + duration
    }

    if (viewMode === 'mill') {
      updatedItem.manufacturingMillId = manufacturingMillList[newGroupOrder].id
    }

    const updatedItems = [...items]
    updatedItems[itemIndex] = updatedItem

    setItems(updatedItems)
  }

  const itemRender = ({ item, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    return (
      <div {...getItemProps(item.itemProps)}>
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
        <div className='rct-item-content' style={{ maxHeight: `${itemContext.dimensions.height}` }}>
          {itemContext.title}
        </div>
        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
      </div>
    )
  }

  const listMills = (manufacturingWorks.currentWorks?.manufacturingMills || []).map((mill) => ({
    id: mill._id,
    name: mill.name
  }))

  const listMachines = (manufacturingWorks.currentAssets || []).map((a) => ({
    id: a._id,
    name: a.assetName
  }))

  const listEmployees = (manufacturingWorks.currentEmployees || []).map((e) => ({
    id: e._id,
    name: e.name
  }))

  useEffect(() => {
    switch (viewMode) {
      case 'mill':
        setItems(listWorkOrder)
        setItemGroupKey('manufacturingMillId')
        setGroups(listMills)
        break
      case 'employee':
        setItems(listWorkOrderByEmployee)
        setItemGroupKey('employeeId')
        setGroups(listEmployees)
        break
      case 'machine':
        setItems(listWorkOrderByMachine)
        setItemGroupKey('machineId')
        setGroups(listMachines)
        break
      default:
        break
    }
  }, [viewMode, manufacturingWorks.currentWorks, manufacturingWorks.currentAssets, manufacturingWorks.currentEmployees])

  useEffect(() => {
    const data = {
      currentRole: localStorage.getItem('currentRole')
    }
    props.getAllManufacturingWorks(data)

    if (manufacturingWorks.listWorks.length > 0) {
      props.getDetailManufacturingWorks(manufacturingWorks.listWorks[0]._id)
    }
  }, [])

  return (
    <div className='box-body qlcv'>
      <div className='form-inline' style={{ marginBottom: '1rem' }}>
        <div className='form-group'>
          <label className='form-control-static'>{translate('manufacturing.command.works')}</label>
          <SelectBox
            id={`select-works`}
            className='form-control select2'
            style={{ width: '100%' }}
            items={getWorksArr()}
            value={works}
            onChange={(value) => handleChangeWorks(value)}
          />
        </div>
        <div className='form-group'>
          <label className='form-control-static'>{translate('manufacturing.command.view_by')}</label>
          <SelectBox
            id={`select-viewmode`}
            className='form-control select2'
            style={{ width: '100%' }}
            items={[
              { value: 'mill', text: translate('manufacturing.command.mill') },
              { value: 'employee', text: translate('manufacturing.command.employee_schedule') },
              { value: 'machine', text: translate('manufacturing.command.machine_schedule') }
            ]}
            value={viewMode}
            onChange={(value) => handleChangeViewMode(value)}
          />
        </div>
      </div>
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        lineHeight={40}
        maxZoom={30 * 86400 * 1000}
        minZoom={24 * 60 * 60 * 1000}
        defaultTimeStart={moment().add(-12, 'hour')}
        defaultTimeEnd={moment().add(12, 'hour')}
        itemRenderer={itemRender}
        itemHeightRatio={0.75}
        canResize={editable ? 'both' : false}
        canMove={editable}
        onItemResize={handleItemResize}
        onItemMove={handleItemMove}
        stackItems={true}
      >
        <TimelineHeaders className='timeline_header'>
          <CustomMarker date={Date.now()}>
            {({ styles }) => {
              const customStyles = {
                ...styles,
                backgroundColor: 'red',
                width: '2px'
              }
              return <div style={customStyles} />
            }}
          </CustomMarker>
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div {...getRootProps()} className='sb-header'>
                  {getSidebarHeader()}
                </div>
              )
            }}
          </SidebarHeader>
          <DateHeader unit='primaryHeader' labelFormat='MM - YYYY' />
          <DateHeader
            unit='day'
            labelFormat='DD'
            intervalRenderer={({ getIntervalProps, intervalContext }) => {
              return <div {...getIntervalProps()}>{intervalContext.intervalText}</div>
            }}
          />
        </TimelineHeaders>
      </Timeline>
    </div>
  )
}

function mapStateToProps(state) {
  const { manufacturingWorks } = state
  return { manufacturingWorks }
}

const mapDispatchToProps = {
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
  getDetailManufacturingWorks: worksActions.getDetailManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PlanningGanttChart))
