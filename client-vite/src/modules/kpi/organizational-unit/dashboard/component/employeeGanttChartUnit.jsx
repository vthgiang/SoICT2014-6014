import React, { useCallback, useMemo, useState } from 'react'
import { Gantt, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import './ganttChart.scss'

function EmployeeGanttChartUnit({ data }) {
  const listTaskAllUnit = useMemo(() => {
    const taskGroups = {}

    data.forEach((task) => {
      task.responsibleEmployees.forEach((employee) => {
        if (!taskGroups[employee._id]) {
          taskGroups[employee._id] = {
            employee,
            tasks: []
          }
        }
        taskGroups[employee._id].tasks.push(task)
      })
    })

    const groupedTasks = Object.values(taskGroups).map((group) => {
      group.tasks.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      return group
    })

    const transformedGroups = groupedTasks.map((group) => {
      const transformedTasks = group.tasks.map((task, index) => {
        const transformedTask = {
          start: new Date(task.startDate),
          end: new Date(task.endDate),
          name: task.name,
          id: task._id.toString(),
          progress: 0,
          type: 'task',
          project: group.employee._id.toString(),
          displayOrder: index + 2
        }

        if (index > 0) {
          transformedTask.dependencies = [group.tasks[index - 1]._id.toString()]
        }

        return transformedTask
      })

      // Calculate the earliest startDate and the latest endDate
      const earliestStartDate = new Date(Math.min(...group.tasks.map((task) => new Date(task.startDate))))
      const latestEndDate = new Date(Math.max(...group.tasks.map((task) => new Date(task.endDate))))

      const projectItem = {
        start: earliestStartDate,
        end: latestEndDate,
        name: group.employee.name,
        id: group.employee._id.toString(),
        progress: 0,
        type: 'project',
        hideChildren: true,
        displayOrder: 1
      }

      transformedTasks.unshift(projectItem)

      return {
        employee: group.employee,
        tasks: transformedTasks
      }
    })

    return transformedGroups
      .flatMap((item) => item.tasks)
      .map((item, index) => ({
        ...item,
        displayOrder: index + 1
      }))
  }, [data])

  const [view, setView] = useState(ViewMode.Day)
  const [tasks, setTasks] = useState(listTaskAllUnit)

  const columnWidth = useMemo(() => {
    switch (view) {
      case ViewMode.Year:
        return 350
      case ViewMode.Month:
        return 300
      case ViewMode.Week:
        return 250
      default:
        return 65
    }
  }, [view])

  const handleExpanderClick = useCallback((task) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? task : t)))
  }, [])

  return (
    <section className='d-flex'>
      <Gantt tasks={tasks} viewMode={view} onExpanderClick={handleExpanderClick} columnWidth={columnWidth} />
    </section>
  )
}

export default EmployeeGanttChartUnit
