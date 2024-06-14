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

  useEffect(() => {
    const { organizationalUnitImportances } = currentKPI

    const formattedData = organizationalUnitImportances.map((item) => ({
      value: item.organizationalUnit._id,
      text: item.organizationalUnit.name
    }))
    setListUnit(formattedData)
  }, [])

  useEffect(() => {
    const listUnitWithTaskTemplate = listUnit.map((unit) => {
      const unitTaskTemplate = taskTemplates?.listTemplatesAll?.filter((template) => template.organizationalUnit === unit.value) ?? []
      const updatedUnitTaskTemplate = unitTaskTemplate.map((template) => {
        const updatedListMappingTask = template.listMappingTask.map((task) => ({
          ...task,
          taskWeight: 0
        }))
        return {
          ...template,
          listMappingTask: updatedListMappingTask
        }
      })
      return {
        ...unit,
        taskTemplates: updatedUnitTaskTemplate
      }
    })

    const filterValue = listUnitWithTaskTemplate
      .filter((unit) => selectedValue.includes(unit.value))
      .map((unit) => ({
        ...unit,
        kpis: currentKPI.kpis.map((kpi) => ({
          ...kpi,
          kpiWeight: 0
        }))
      }))

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

  const handleStartAllocation = () => {
    console.log(123)
    dispatch(ConfigParametersAction.handleStartAllocation())
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
                <button type='button' className='btn btn-primary' onClick={() => handleClearAll()}>
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
                      <table className='table table-hover table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th className='col-fixed'>STT</th>
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
                                <td>{indexKpi + 1}</td>
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
                      <span>Danh sách task ánh xạ</span>
                      <table className='table table-hover table-striped table-bordered'>
                        <thead>
                          <tr>
                            <th className='col-fixed'>STT</th>
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
                                    <td>{taskIndex + 1}</td>
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
            >
              Tinh chỉnh tham số
            </button>
          </div>
        </div>
      )}

      {step === 1 && <ConfigParameters handleStartAllocation={handleStartAllocation} />}

      {step === 2 && <AllocationResult />}
    </DialogModal>
  )
}

export default AllocationToOrganizationalUnit
