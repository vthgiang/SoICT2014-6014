import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { manufacturingPlanActions } from '../../../../../manufacturing-plan/redux/actions'
import CreatedCommandTable from './createdCommandTable'
import GanttChart from './ganttChart'
import { commandActions } from '../../../../../manufacturing-command/redux/actions'

const AutoScheduleBooking = (props) => {
  const { translate, manufacturingCommands, startDate, endDate, onManufacturingCommandsChange, manufacturingPlan } = props
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  const handleCreateSchedule = () => {
    const data = {
      currentRole: localStorage.getItem('currentRole'),
      startDate: startDate,
      endDate: endDate,
      manufacturingCommands: manufacturingCommands
    }

    props.createAutomaticSchedule(data)
    setScheduleSuccess(true)
  }

  let affectedCommands = []
  let createdCommands = []
  if (manufacturingPlan.planSchedule) {
    affectedCommands = manufacturingPlan.planSchedule?.affectedCommands
    createdCommands = manufacturingPlan.planSchedule?.createdCommands

    createdCommands = manufacturingCommands.map((command, index) => {
      const createdCommand = createdCommands.find((c) => c.id === index)
      const workOrders = createdCommand?.workOrders

      return {
        ...command,
        type: 'new',
        startDate: createdCommand?.startDate,
        endDate: createdCommand?.endDate,
        startTurn: createdCommand?.startTurn,
        endTurn: createdCommand?.endTurn,
        workOrders: command.routing.operations.map((operation) => {
          const workOrder = workOrders.find((wo) => wo.id == operation.id)
          return {
            operation: operation.name,
            operationId: operation.id,
            manufacturingMill: operation.manufacturingMill._id,
            tasks: workOrder.tasks,
            startDate: workOrder.startDate,
            endDate: workOrder.endDate,
            startHour: workOrder.startHour,
            endHour: workOrder.endHour,
            progress: 0
          }
        })
      }
    })

    affectedCommands = affectedCommands.map((command) => ({
      ...command,
      type: 'affected'
    }))
  }

  const handleSaveSchedule = () => {
    affectedCommands.map((command) => {
      props.handleEditCommand(command._id, {
        workOrders: command.workOrders
      })
    })

    onManufacturingCommandsChange(
      createdCommands.map((command) => ({
        ...command,
        completed: true
      }))
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'end', gap: '1rem' }}>
        <button type='button' className='btn btn-primary' onClick={handleCreateSchedule}>
          {translate('manufacturing.work_schedule.add_work_schedule_button')}
        </button>

        {scheduleSuccess && (
          <button type='button' className='btn btn-success' onClick={handleSaveSchedule}>
            {translate('manufacturing.work_schedule.save_work_schedule_button')}
          </button>
        )}
      </div>

      {scheduleSuccess && (
        <div style={{ clear: 'right', marginBottom: '1rem' }}>
          <GanttChart listCommands={[...affectedCommands, ...createdCommands]} />
        </div>
      )}

      {!scheduleSuccess && <CreatedCommandTable translate={translate} manufacturingCommands={manufacturingCommands} />}
    </>
  )
}

function mapStateToProps(state) {
  const { manufacturingPlan } = state
  return { manufacturingPlan }
}

const mapDispatchToProps = {
  createAutomaticSchedule: manufacturingPlanActions.createAutomaticSchedule,
  handleEditCommand: commandActions.handleEditCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AutoScheduleBooking))
