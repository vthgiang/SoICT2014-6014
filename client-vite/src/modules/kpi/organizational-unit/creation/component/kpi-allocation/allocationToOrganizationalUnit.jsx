import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DialogModal, SelectBox } from '../../../../../../common-components'
import { taskTemplateActions } from '../../../../../task/task-template/redux/actions'
import AllocationResult from './allocationResult'
import ProgressTitle from './progressTitle'
import ConfigParameters from './configParameters'
import { ConfigParametersAction } from './redux/actions'

function AllocationToOrganizationalUnit({ month, currentKPI }) {
  const [listUnit, setListUnit] = useState([])
  const [selectedValue, setSelectedValue] = useState([])
  const [listUnitKpi, setListUnitKpi] = useState([])
  const dispatch = useDispatch()
  const taskTemplates = useSelector((state) => state.tasktemplates)
  const configData = useSelector((state) => state.configParametersReducer)

  useEffect(() => {
    const { organizationalUnitImportances } = currentKPI

    const formattedData = organizationalUnitImportances.map((item) => ({
      value: item.organizationalUnit._id,
      text: item.organizationalUnit.name
    }))
    setListUnit(formattedData)
  }, [])

  useEffect(() => {
    const getRandomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const listUnitWithTaskTemplate = listUnit.map((unit) => {
      const unitTaskTemplate = taskTemplates?.listTemplatesAll?.filter((template) => template.organizationalUnit === unit.value) ?? []

      // Group tasks by organizationalUnitKpi.name
      const tasksByKpiName = {}
      unitTaskTemplate.forEach((template) => {
        template.listMappingTask.forEach((task) => {
          const kpiName = task.organizationalUnitKpi.name
          if (!tasksByKpiName[kpiName]) tasksByKpiName[kpiName] = []
          tasksByKpiName[kpiName].push(task)
        })
      })

      // Function to generate random integer weights that sum to 100
      const generateRandomIntWeights = (count) => {
        const weights = Array(count).fill(1)
        let remainingWeight = 100 - count

        while (remainingWeight > 0) {
          const randomIndex = Math.floor(Math.random() * count)
          weights[randomIndex] += 1
          remainingWeight -= 1
        }

        return weights
      }

      // Assign random integer weights
      Object.values(tasksByKpiName).forEach((tasks) => {
        const randomWeights = generateRandomIntWeights(tasks.length)
        tasks.forEach((task, index) => {
          task.taskWeight = randomWeights[index]
        })
      })

      // Update the task templates with new weights
      const updatedUnitTaskTemplate = unitTaskTemplate.map((template) => ({
        ...template,
        listMappingTask: template.listMappingTask.map((task) => ({
          ...task,
          taskWeight: task.taskWeight ?? 0
        }))
      }))

      return {
        ...unit,
        taskTemplates: updatedUnitTaskTemplate
      }
    })

    const filterValue = listUnitWithTaskTemplate
      .filter((unit) => selectedValue.includes(unit.value))
      .map((unit) => {
        const numberOfKPIs = currentKPI.kpis.length

        if (numberOfKPIs < 2) throw new Error('Not enough KPIs to assign weights.')

        const kpiWeight1 = 5
        const kpiWeight2 = 5
        let remainingWeight = 100 - kpiWeight1 - kpiWeight2

        const initialWeights = [kpiWeight1, kpiWeight2]

        const kpiWeights = currentKPI.kpis.slice(2).reduce((acc, kpi, index, arr) => {
          const maxWeight = remainingWeight - (arr.length - index - 1)
          const weight = getRandomInt(1, maxWeight > 0 ? maxWeight : 1)
          remainingWeight -= weight
          return acc.concat(weight)
        }, initialWeights)

        if (numberOfKPIs > 2) kpiWeights[numberOfKPIs - 1] += remainingWeight

        return {
          ...unit,
          kpis: currentKPI.kpis.map((kpi, index) => ({
            ...kpi,
            kpiWeight: kpiWeights[index]
          }))
        }
      })

    setListUnitKpi(filterValue)
  }, [selectedValue])

  useEffect(() => {
    dispatch(taskTemplateActions.getAll())
  }, [dispatch])

  const handleSelectAll = () => {
    const allValue = listUnit.map((item) => {
      return item.value
    })
    setSelectedValue(allValue)
  }

  const handleClearAll = () => {
    setSelectedValue([])
  }

  const handleChangeSelectedValue = (value) => {
    setSelectedValue(value)
  }

  const isAbleToClearAll = () => {
    return selectedValue.length !== 0
  }

  const onChangeKpiWeightEachUnit = (event, unit, kpiId) => {
    const updatedList = listUnitKpi.map((item) => {
      if (item.value === unit.value) {
        const updatedKpis = item.kpis.map((kpi) => {
          if (kpi._id === kpiId) {
            return { ...kpi, kpiWeight: event.target.value }
          }
          return kpi
        })
        return { ...item, kpis: updatedKpis }
      }
      return item
    })

    setListUnitKpi(updatedList)
  }

  const onChangeTaskWeightMappingKPI = (event, unit, kpiId, taskId) => {
    const updateList = listUnitKpi.map((item) => {
      if (item.value === unit.value) {
        const updatedTaskTemplates = item.taskTemplates.map((taskTemplate) => {
          if (taskTemplate?.listMappingTask !== undefined && taskTemplate?.listMappingTask.length !== 0) {
            const updatedListMappingTask = taskTemplate?.listMappingTask.map((task) => {
              if (task._id === taskId) {
                return { ...task, taskWeight: event.target.value }
              }
              return task
            })

            return { ...taskTemplate, listMappingTask: updatedListMappingTask }
          }

          return taskTemplate
        })

        return { ...item, taskTemplates: updatedTaskTemplates }
      }
      return item
    })
    setListUnitKpi(updateList)
  }

  const calculateKpiWeightSumForUnit = (unit) => {
    const listItem = listUnitKpi.find((item) => item.value === unit.value)
    if (!listItem) return 0

    return listItem.kpis.reduce((sum, kpi) => sum + Number(kpi.kpiWeight), 0)
  }

  const [steps, setSteps] = useState([
    {
      label: 'Thiết lập thông tin',
      active: true,
      disabled: false
    },
    {
      label: 'Thiết lập tham số',
      active: false,
      disabled: true
    },
    {
      label: 'Review kết quả',
      active: false,
      disabled: true
    },
    {
      label: 'Xác nhận kết quả',
      active: false,
      disabled: true
    }
  ])
  const [step, setStep] = useState(0)

  const setCurrentStep = async (e, currentStep) => {
    e.preventDefault()

    const newSteps = steps.map((stepItem, index) => {
      return {
        ...stepItem,
        active: index <= currentStep
      }
    })

    setStep(currentStep)
    setSteps(newSteps)
  }

  const handleStartAllocation = (e) => {
    const payload = {
      configData,
      kpiData: listUnitKpi
    }
    setCurrentStep(e, 2)
    dispatch(ConfigParametersAction.handleStartAllocation(payload))
  }

  const calculateKpiTaskWeight = (item, kpiId) => {
    const totalWeight = item.taskTemplates.reduce((acc, taskTemplate) => {
      if (taskTemplate.isMappingTask && Array.isArray(taskTemplate.listMappingTask)) {
        const matchingTasks = taskTemplate.listMappingTask.filter((task) => task.organizationalUnitKpi._id === kpiId)
        const matchingTasksWeight = matchingTasks.reduce((weightAcc, task) => weightAcc + parseInt(task.taskWeight || 0, 10), 0)
        return acc + matchingTasksWeight
      }
      return acc
    }, 0)

    return totalWeight
  }

  const isValidScore = (score) => {
    return score === 100
  }

  const isAllDataValid = () => {
    return listUnitKpi.every((item) => {
      const totalWeight = item.kpis.reduce((acc, kpi) => acc + parseInt(kpi.kpiWeight || 0, 10), 0)
      if (totalWeight !== 100) return false

      return true

      // return item.kpis.every((kpi) => calculateKpiTaskWeight(item, kpi._id) === 100)
    })
  }

  return (
    <DialogModal
      modalID='allocation-kpi-into-unit'
      size='100'
      isLoading={false}
      formID='form-allocation-kpi-into-unit'
      title={`Phân bổ KPI cho các phòng ban tháng ${month}`}
      hasNote={false}
    >
      <ProgressTitle setCurrentStep={setCurrentStep} steps={steps} step={step} />

      {step === 0 && (
        <div className='box box-default'>
          <div className='box-header with-border text-center'>
            <b style={{ fontSize: '24px' }}>Thiết lập thông tin</b>
          </div>
          <div className='box-body'>
            <div className='m-[4px]'>
              <div className='mb-[8px] text-bold'>Lựa chọn bộ phận để phân bổ</div>
              <SelectBox
                id='user-role-form'
                className='form-control select2'
                style={{ width: '100%' }}
                items={listUnit}
                onChange={handleChangeSelectedValue}
                value={selectedValue}
                multiple
              />
              <div className='flex gap-[16px] my-[8px]'>
                <button type='button' className='btn btn-success' onClick={() => handleSelectAll()}>
                  Selected all
                </button>
                <button type='button' className='btn btn-primary' onClick={() => handleClearAll()} disabled={!isAbleToClearAll()}>
                  Clear all selected value
                </button>
              </div>
            </div>

            <div className='form-group m-[4px]'>
              {listUnitKpi.length !== 0 && <div className='text-bold mb-[16px]'>Danh sách mục tiêu KPI phân bổ</div>}
              {listUnitKpi.map((item, index) => {
                return (
                  <fieldset className='scheduler-border' key={index}>
                    <legend className='scheduler-border'>Phòng ban: {item.text}</legend>
                    <div className='form-group'>
                      <div>Danh sách KPI đơn vi</div>
                      <span>Tổng trọng số: {calculateKpiWeightSumForUnit(item)} / 100</span>
                      <span className={`${isValidScore(calculateKpiWeightSumForUnit(item)) ? 'text-success' : 'text-danger'} font-bold`}>
                        {isValidScore(calculateKpiWeightSumForUnit(item)) ? ' - Thoả mãn' : ' - Chưa thoả mãn'}
                      </span>
                      <table className='table table-hover table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th title='Tên nhiệm vụ'>Tên mục tiêu</th>
                            <th title='Mô tả'>Mục tiêu cha</th>
                            <th title='Khối lượng nhiệm vụ'>Tiêu chí đánh giá</th>
                            <th title='Đơn vị nhiệm vụ'>Chỉ tiêu</th>
                            <th title='Ngày bắt đầ'>Trọng số</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.kpis.map((kpi, indexKpi) => {
                            return (
                              <tr key={indexKpi}>
                                <td>{kpi.name}</td>
                                <td>{kpi.name}</td>
                                <td
                                  dangerouslySetInnerHTML={{
                                    __html: kpi.criteria
                                  }}
                                />
                                <td>{kpi.target ? 'N/A' : 'Hoàn thành mục tiêu'}</td>
                                <td>
                                  <input
                                    type='number'
                                    className='form-control'
                                    onChange={(event) => onChangeKpiWeightEachUnit(event, item, kpi._id)}
                                    value={kpi.kpiWeight}
                                  />
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                      <div className='mt-5'>Danh sách nhiệm vụ ánh xạ</div>
                      <div className='mb-3'>Tổng trọng số:</div>
                      <ol className='list-decimal list-inside space-y-2 pb-5 px-5 rounded-lg'>
                        {item.kpis.map((kpi, kpiIndex) => {
                          if (kpi.target !== null)
                            return (
                              <li className='text-gray-700' key={kpiIndex}>
                                {kpi.target !== null && kpi.name}: {calculateKpiTaskWeight(item, kpi._id)} / 100
                                <span
                                  className={`${isValidScore(calculateKpiTaskWeight(item, kpi._id)) ? 'text-success' : 'text-danger'} font-bold`}
                                >
                                  {isValidScore(calculateKpiTaskWeight(item, kpi._id)) ? ' - Thoả mãn' : ' - Chưa thoả mãn'}
                                </span>
                              </li>
                            )
                          return null
                        })}
                      </ol>

                      <table className='table table-hover table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th title='Tên nhiệm vụ'>Tên nhiệm vụ</th>
                            <th title='Mô tả'>Ánh xạ KPI đơn vị</th>
                            <th title='Khối lượng nhiệm vụ'>Trọng số</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.taskTemplates.length === 0 ? (
                            <tr>
                              <td colSpan={9}>
                                <center>Bạn cần tao mẫu công việc</center>
                              </td>
                            </tr>
                          ) : (
                            item.taskTemplates.map((taskTemplate, taskTemplateIndex) => {
                              return taskTemplate.listMappingTask.map((task, taskIndex) => {
                                return (
                                  <tr key={taskIndex}>
                                    <td>{task.taskName}</td>
                                    <td>{task.organizationalUnitKpi.name}</td>
                                    <td>
                                      <input
                                        type='number'
                                        className='form-control'
                                        onChange={(event) =>
                                          onChangeTaskWeightMappingKPI(event, item, task.organizationalUnitKpi._id, task._id)
                                        }
                                        value={task.taskWeight}
                                      />
                                    </td>
                                  </tr>
                                )
                              })
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </fieldset>
                )
              })}
            </div>
          </div>

          <div className='box-footer text-center flex justify-center gap-[16px]'>
            <button
              type='button'
              className='btn btn-primary my-[8px]'
              onClick={(event) => {
                setCurrentStep(event, 1)
              }}
              disabled={!isAllDataValid()}
            >
              Tinh chỉnh tham số
            </button>
          </div>
        </div>
      )}

      {step === 1 && <ConfigParameters handleStartAllocation={handleStartAllocation} />}

      {step === 2 && <AllocationResult listUnitKpi={listUnitKpi} month={month} />}
    </DialogModal>
  )
}

export default AllocationToOrganizationalUnit
