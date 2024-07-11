import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import Timeline, { CustomMarker, DateHeader, TimelineHeaders, SidebarHeader } from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import { SelectBox } from '../../../../../../../../common-components'
import { formatDate } from '../../../../../../../../helpers/formatDate'
import { worksActions } from '../../../../../manufacturing-works/redux/actions'
import { millActions } from '../../../../../manufacturing-mill/redux/actions'

import './ganttChart.css'

const GanttChart = (props) => {
  const { translate, manufacturingWorks, manufacturingMill, listCommands = [] } = props
  const [viewMode, setViewMode] = useState('mill')
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

  const handleChangeViewMode = (value) => {
    setViewMode(value[0])
  }

  let count = 1
  const listWorkOrder = listCommands.flatMap((command) => {
    const color = command.type === 'new' ? '#68c2d1' : '#ffc107'
    return command.workOrders.map((wo, index) => {
      return {
        id: count++,
        name: `${index + 1}/${command.code}`,
        manufacturingCommandId: command._id,
        manufacturingMillId: wo.manufacturingMill,
        startTime: moment(wo.startDate, 'YYYY-MM-DD').add(wo.startHour, 'hour'),
        endTime: moment(wo.endDate, 'YYYY-MM-DD').add(wo.endHour, 'hour'),
        tasks: wo.tasks.map((task) => ({
          ...task,
          startDate: formatDate(task.startDate),
          endDate: formatDate(task.endDate)
        })),
        itemProps: {
          style: {
            background: color
          }
        }
      }
    })
  })

  const manufacturingMillId = listWorkOrder[0]?.manufacturingMillId

  const listWorkOrderByMachine = listWorkOrder.flatMap((wo) =>
    wo.tasks
      .filter((task) => task.machine)
      .map((task) => ({
        id: task._id,
        name: wo.name,
        startTime: moment(task.startDate, 'DD-MM-YYYY').add(task.startHour, 'hour'),
        endTime: moment(task.endDate, 'DD-MM-YYYY').add(task.endHour, 'hour'),
        machineId: task.machine
      }))
  )

  const listWorkOrderByEmployee = listWorkOrder.flatMap((wo) =>
    wo.tasks
      .filter((task) => task.responsible)
      .map((task) => ({
        id: task._id,
        name: wo.name,
        startTime: moment(task.startDate, 'DD-MM-YYYY').add(task.startHour, 'hour'),
        endTime: moment(task.endDate, 'DD-MM-YYYY').add(task.endHour, 'hour'),
        employeeId: task.responsible
      }))
  )

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
    if (manufacturingMillId) {
      props.getDetailManufacturingMill(manufacturingMillId)
    }
  }, [manufacturingMillId])

  useEffect(() => {
    const manufacturingWorksId = manufacturingMill.currentMill.manufacturingWorks?._id
    if (manufacturingWorksId) {
      props.getDetailManufacturingWorks(manufacturingWorksId)
    }
  }, [manufacturingMill.currentMill])

  return (
    <div className='box-body qlcv'>
      <div className='form-inline'>
        <div className='form-group' style={{ marginBottom: '1rem' }}>
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
        canResize='both'
        canMove={true}
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
  const { manufacturingWorks, manufacturingMill } = state
  return { manufacturingWorks, manufacturingMill }
}

const mapDispatchToProps = {
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
  getDetailManufacturingWorks: worksActions.getDetailManufacturingWorks,
  getDetailManufacturingMill: millActions.getDetailManufacturingMill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GanttChart))
