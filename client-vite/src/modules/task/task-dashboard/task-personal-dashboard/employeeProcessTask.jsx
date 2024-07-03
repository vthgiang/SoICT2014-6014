import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { taskManagementActions } from '../../task-management/redux/actions'
import { getStorage } from '../../../../config'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

const options = {
  indexAxis: 'y', // This sets the chart to be horizontal
  responsive: true,
  plugins: {
    legend: {
      position: 'right'
    },
    colors: {
      enabled: true,
      forceOverride: true // Ensure colors are applied automatically
    }
  }
}

function EmployeeProcessTask() {
  const dispatch = useDispatch()
  const listProgressTask = useSelector((state) => state.tasks.listProgressTask)
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  const generateListLabels = () => {
    return listProgressTask.tasksGroupedByEmployeeName?.map((item) => {
      return item.groupName
    })
  }

  const generateListDataset = (listLabel) => {
    const listTaskName = []
    const listTaskSet = new Set()
    listProgressTask.tasksGroupedByEmployeeName?.forEach((employee) => {
      employee.tasks.forEach((task) => {
        const taskIdentifier = `${task.name}`
        if (!listTaskSet.has(taskIdentifier)) {
          listTaskName.push(task.name)
          listTaskSet.add(taskIdentifier)
        }
      })
    })

    const flattenGroups = (groups) => {
      return groups?.reduce((acc, group) => {
        const { groupName, tasks } = group
        tasks.forEach((task) => {
          acc.push({
            groupName,
            ...task
          })
        })
        return acc
      }, [])
    }

    const flattenData = flattenGroups(listProgressTask.tasksGroupedByEmployeeName)

    const dataset = []
    listTaskName.forEach((taskName) => {
      const listTask = flattenData.filter((item) => item.name === taskName)
      const listDataSet = []
      listLabel.forEach((label) => {
        const listData = listTask.filter((item) => item.groupName === label)
        listDataSet.push(Math.floor(Math.random() * 101))
      })
      dataset.push({
        label: taskName,
        data: listDataSet
      })
    })

    return dataset
  }

  useEffect(() => {
    const d = new Date()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const payload = {
      currentRole: getStorage('currentRole'),
      month,
      year
    }
    dispatch(taskManagementActions.getCurrentUserProgressTask(payload))
  }, [dispatch])

  useEffect(() => {
    const labels = generateListLabels()
    const datasets = generateListDataset(labels)

    setData({
      labels,
      datasets
    })
  }, [listProgressTask])

  const renderNotDataComponent = () => {
    if (listProgressTask?.tasksGroupedByEmployeeName?.length === 0)
      return <div className='flex justify-center'>Bạn cần khởi tạo dữ liệu</div>
    return <Bar data={data} options={options} />
  }

  return (
    <div className='row'>
      <div className='col-xs-12 col-md-12'>
        <div className='box box-primary'>
          <div className='box-header with-border'>
            <div className='box-title'>Thống kê tiến độ làm việc của các nhân viên trong phòng ban</div>
            <div className='pt-[16px]'>{renderNotDataComponent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProcessTask
