import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { commandActions } from '../redux/actions'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { formatDate } from '../../../../../helpers/formatDate'

import PlanningGanttChart from './planning-gantt-chart'

function ManufacturingCommandManagementGantt(props) {
    const { manufacturingCommand } = props

    let listCommands = []
    if (manufacturingCommand.listCommands) {
        listCommands = manufacturingCommand.listCommands.map(command => {
            const workOrders = command.workOrders.map(wo => ({
                ...wo,
                startDate: formatDate(wo.startDate),
                endDate: formatDate(wo.endDate)
            }))
            return {
                code: command.code,
                workOrders: workOrders
            }
        })
    }

    useEffect(() => {
        const data = {
            currentRole: localStorage.getItem('currentRole'),
            page: 1,
            limit: 10,
        }
        props.getAllManufacturingCommands(data)
    }, [])

    return (
        <PlanningGanttChart listCommands={listCommands} />
    )
}

function mapStateToProps(state) {
    const { manufacturingCommand } = state
    return { manufacturingCommand }
}

const mapDispatchToProps = {
    getAllManufacturingCommands: commandActions.getAllManufacturingCommands,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandManagementGantt))
