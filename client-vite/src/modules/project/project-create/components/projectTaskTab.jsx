import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import { ErrorLabel, ImportFileExcel, SelectBox, ToolTip, UploadFile } from "../../../../common-components"
import { assetCapacities, DEFAULT_VALUE, fakeAssetRequireTypes, TASK_ACTION_TYPE } from "./consts"
import { TagActions } from "../../../bidding/tags/redux/actions"
import ValidationHelper from "../../../../helpers/validationHelper"
import { getAssetCapaciyNameFromValue, getAssetTypeFromTypeId, getCapacityKeyText, getCapacityOptions, getCapacityValueText, getListAssetFromIds, getListAssetIDsFromAssetGroups, getListAssetTypes, getListCapacityValues, getOptionTextFromValueInSelectBoxItems } from "../../../../helpers/assetHelper"
import ProjectModuleValidationHelper from "../../../../helpers/projectModuleValidationHelpers"
import { getEmployeeSelectBoxItemsWithEmployeeData } from "../../../task/organizationalUnitHelper"
import { convertToDate, getListDepartments } from "../../projects/components/functionHelper"
import { getListMembersInProject } from "../../../task/projectMemberHelper"
import { ProjectTaskViewInGantt } from "./projectTaskViewInGantt"
import moment from "moment"
import ExcelReader from "./excelReader"

const ProjectTasksTab = (props) => {
  const {
    translate,
    projectKPITarget,
    projectMembers,
    user,
    tag,
    capacity,
    assetsManager,
    projectAssets,
    projectTasks,
    setProjectTasks,
    generalProjectInfo,
    actionType, projectId
  } = props

  const [isTable, setIsTable] = useState(true)

  // Get all Options
  const listTagOptions = tag?.listTag &&
    tag?.listTag?.length > 0 ?
    tag.listTag.map((item) => {
      return {
        value: item.name,
        text: item.name,
        key: item.name
      }
    }) : []
  const listKPIOptions = projectKPITarget &&
    projectKPITarget?.kpisTarget &&
    projectKPITarget?.kpisTarget?.length > 0 ?
    projectKPITarget?.kpisTarget.map((item) => {
      return {
        text: item.name,
        value: item._id
      }
    }) : []

  const {
    willStartTime,
    unitOfTime
  } = generalProjectInfo

  // get Assets
  const listAllAssets = assetsManager?.listAssets
  const listAssetWithGroupInProject = projectAssets?.assetsWithGroup?.list
  const listAssetIDsInProject = listAssetWithGroupInProject && listAssetWithGroupInProject?.length > 0 ? getListAssetIDsFromAssetGroups(listAssetWithGroupInProject) : []
  const listAssetsInProject = getListAssetFromIds(listAssetIDsInProject, listAllAssets)
  const listAssetsTypes = getListAssetTypes(listAssetsInProject)
  const listCapacityOptions = capacity && capacity?.listCapacity && capacity?.listCapacity?.length > 0 ? getCapacityOptions(capacity.listCapacity) : []

  // Get employees to check capacities in tasks
  const listUsersWithUnit = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  const listMembersInProjectWithUnit = projectMembers?.employeesWithUnit?.list && projectMembers?.employeesWithUnit?.list?.length > 0 ? projectMembers?.employeesWithUnit?.list : []
  const listMembersInProject = listUsersWithUnit && listUsersWithUnit?.length > 0 && listMembersInProjectWithUnit && listMembersInProjectWithUnit?.length > 0 ? getListMembersInProject(listMembersInProjectWithUnit, listUsersWithUnit) : []

  // Get assets to check capacities in tasks
  const initTaskData = {
    name: '',
    code: '',
    description: '',
    preceedingTasks: [],
    estimateNormalTime: 0,
    requireAssignee: {
      require: {},
      currentCapacityType: '',
      currentCapacityValue: '',
    },
    requireAsset: {
      require: [],
      currentAssetType: '',
      currentAssetNumber: 0,
      currentAssetCapacity: '',
      currentAssetRequireType: ''
    },
    tags: [],
    kpiInTask: '',
    taskKPIWeight: 0,

    errors: {
      name: '',
      code: '',
      preceedingTasks: '',
      estimateNormalTime: '',
      requireAssignee: '',
      requireAsset: '',
      tags: '',
      kpiInTask: '',
      taskKPIWeight: ''
    }
  }

  const [state, setState] = useState({
    type: TASK_ACTION_TYPE.ADD_TYPE,
    // currentTask: initTaskData,
    currentTask: { ...initTaskData },
    currentIndex: null,
    tagType: TASK_ACTION_TYPE.ADD_TYPE,
    currentTag: '',
    // currentTag: initTag,
    currentTagIndex: null,
  })

  const { type, currentTask, currentIndex } = state
  const {
    errors,
    name,
    code,
    description,
    preceedingTasks,
    estimateNormalTime,
    requireAssignee,
    requireAsset,
    tags,
    kpiInTask,
    taskKPIWeight,
  } = currentTask

  const listPrevTask =
    projectTasks?.map((x) => {
      return { text: x.code, value: x.code?.trim() }
    }) ?? []

  // Data on file
  const [errorUpload, setErrorUpload] = useState('')

  const handleChangeCurrentTask = (e, key = '') => {
    const name = e?.target?.name
    const keyChange = name ? name : key

    let value = e?.target?.value

    if (keyChange === 'tags' || keyChange === 'preceedingTasks') {
      value = e
    }
    if (keyChange === 'kpiInTask') {
      value = e[0]
    }

    if (['estimateNormalTime', 'taskKPIWeight'].includes(keyChange)) {
      value = Number(e.target.value)
    }

    let message = ''
    if (keyChange === 'name') {
      message = ValidationHelper.validateTaskName(translate, value, projectTasks)?.message
    }
    if (keyChange === 'tags') {
      message = ValidationHelper.validateArrayLength(translate, value)?.message
    }
    if (keyChange === 'code') {
      message = ProjectModuleValidationHelper.validateTaskCode(translate, value, projectTasks)?.message
    }
    if (keyChange === 'kpiInTask') {
      message = ValidationHelper.validateEmpty(translate, value)?.message
    }
    if (keyChange === 'estimateNormalTime') {
      message = ValidationHelper.validateNumberInput(translate, value, 0)?.message
    }
    if (keyChange === 'taskKPIWeight') {
      message = ProjectModuleValidationHelper.validateTaskWeight(translate, value, 0, 1)?.message
    }

    setState({
      ...state,
      currentTask: {
        ...currentTask,
        [keyChange]: value,
        errors: {
          ...errors,
          [keyChange]: message
        }
      }
    })
  }

  const handleChangeCurrentCapacityType = (e) => {
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAssignee: {
          ...requireAssignee,
          currentCapacityType: e[0],
          currentCapacityValue: ""
        }
      }
    })
  }

  const handleChangeCurrentCapacityValue = (e) => {
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAssignee: {
          ...requireAssignee,
          currentCapacityValue: e[0]
        }
      }
    })
  }

  const handleAddCapacityInTask = (e) => {
    if (!requireAssignee?.currentCapacityValue || !listMembersInProject || !listMembersInProject?.length) {
      e.preventDefault()
      return
    }
    // tránh trường hợp chưa chọn loại năng lực mà đã thêm
    const capacityType = requireAssignee?.currentCapacityType || listCapacityOptions[0]?.value

    const capacityValue = requireAssignee?.currentCapacityValue
    const currentRequireAssignee = requireAssignee?.require
    const { message } = ProjectModuleValidationHelper.validateRequireAssignee(translate, capacityType, capacityValue, currentRequireAssignee, listMembersInProject)
    if (message) {
      setState({
        ...state,
        currentTask: {
          ...currentTask,
          errors: {
            ...errors,
            requireAssignee: message
          }
        }
      })
      return
    }
    // TODO: Check xem yêu cầu năng lực có nhân viên nào đáp ứng được không
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAssignee: {
          ...requireAssignee,
          require: {
            ...requireAssignee.require,
            [capacityType]: Number(requireAssignee.currentCapacityValue)
          },
          currentCapacityType: "",
          currentCapacityValue: "",
        },
        errors: {
          ...errors,
          requireAssignee: ''
        }
      },
    })
  }

  const removeObjectKey = (object, keyToRemove) => {
    // Tạo một bản sao của đối tượng ban đầu
    const newObject = { ...object };
    // Xóa cặp key-value từ đối tượng mới
    delete newObject[keyToRemove];
    // Trả về đối tượng mới đã được chỉnh sửa
    return newObject;
  };

  const handleDeleteCapacity = (key) => {
    const require = requireAssignee?.require
    const newRequire = removeObjectKey(require, key)
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAssignee: {
          ...requireAssignee,
          require: {
            ...newRequire
          }
        }
      }
    })
  }


  const handleChangeCurrentTaskAssetTypeOrCapacity = (e, key) => {
    let value = ''
    if (key === 'currentAssetType') {
      value = e[0]
    } else if (key === 'currentAssetCapacity') {
      value = Number(e[0])
    } else if (key === 'currentAssetRequireType') {
      value = e[0]
    }
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAsset: {
          ...requireAsset,
          [key]: value,
        }
      }
    })
  }

  const handleChangeCurrentTaskAssetNumber = (e) => {
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAsset: {
          ...requireAsset,
          currentAssetNumber: Number(e.target.value),
        }
      }
    })
  }

  const handleAddAssetInCurrentTask = (e) => {
    if (!requireAsset?.currentAssetNumber || 
      !requireAsset?.currentAssetCapacity || 
      !requireAsset?.currentAssetType || 
      !requireAsset?.currentAssetRequireType ||
      !listAssetsInProject || !listAssetsInProject?.length) {
      e.preventDefault()
      return
    }
    const { currentAssetType, currentAssetNumber, currentAssetCapacity, currentAssetRequireType } = requireAsset
    //TODO: Check xem có tài sản nào phù hợp với năng lực yêu cầu không
    const { message } = ProjectModuleValidationHelper.validateRequireAsset(translate, requireAsset, listAssetsInProject)

    if (message) {
      setState({
        ...state,
        currentTask: {
          ...currentTask,
          errors: {
            ...errors,
            requireAsset: message
          }
        },
      })
      return
    }

    const currentRequire = requireAsset?.require
    let updateRequireAsset = [...currentRequire]
    // Neu ton tai type roi
    if (!currentRequire || !currentRequire?.length || !currentRequire.some(item => item.type === currentAssetType)) {
      updateRequireAsset.push({
        type: currentAssetType,
        number: currentAssetNumber,
        capacityValue: currentAssetCapacity,
        requireType: currentAssetRequireType
      })
    } else if (currentRequire.some((item) => item.type === currentAssetType)) {
      updateRequireAsset = updateRequireAsset.filter((item) => item.type !== currentAssetType)
      updateRequireAsset.push({
        type: currentAssetType,
        number: currentAssetNumber,
        capacityValue: currentAssetCapacity,
        requireType: currentAssetRequireType
      })
    }

    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAsset: {
          ...requireAsset,
          require: [...updateRequireAsset],
          currentAssetType: "",
          currentAssetNumber: 0,
          currentAssetCapacity: "",
          currentAssetRequireType: ""
        },
        errors: {
          ...errors,
          requireAsset: ''
        }
      }
    })
  }

  const handleDeleteRequireAssetItemInCurrentTask = (type) => {
    const require = requireAsset?.require
    if (!require || !require?.length) {
      return
    }
    let updateRequireAsset = require.filter((item) => item.type !== type)
    setState({
      ...state,
      currentTask: {
        ...currentTask,
        requireAsset: {
          ...requireAsset,
          require: [...updateRequireAsset]
        }
      }
    })
  }

  const isTaskFormValidated = () => {
    if (
      errors?.name ||
      errors?.code ||
      errors?.preceedingTasks ||
      errors?.estimateNormalTime ||
      errors?.requireAssignee ||
      errors?.requireAsset ||
      errors?.tags ||
      errors?.kpiInTask ||
      errors?.taskKPIWeight ||
      !name || !code || !tags || !tags?.length
    ) {
      return false
    }
    return true
  }

  const handleAddTask = () => {
    const currentTaskToAdd = {
      ...currentTask,
      requireAsset: requireAsset?.require,
      requireAssignee: requireAssignee?.require
    }
    delete currentTaskToAdd['errors']
    let newList = [...projectTasks]
    newList.push(currentTaskToAdd)
    setState({
      ...state,
      type: TASK_ACTION_TYPE.ADD_TYPE,
      currentTask: {
        ...initTaskData
      },
      currentIndex: null
    })

    setProjectTasks(newList)
  }

  const handleEditTask = (listIndex) => {
    const taskFindByIndex = projectTasks[listIndex]
    const taskToEdit = {
      ...taskFindByIndex,
      requireAssignee: {
        require: taskFindByIndex?.requireAssignee,
        currentCapacityType: '',
        currentCapacityValue: '',
      },
      requireAsset: {
        require: taskFindByIndex?.requireAsset,
        currentAssetType: '',
        currentAssetNumber: 0,
        currentAssetCapacity: '',
      },
      errors: {
        name: '',
        code: '',
        preceedingTasks: '',
        estimateNormalTime: '',
        requireAssignee: '',
        requireAsset: '',
        tags: '',
        kpiInTask: '',
        taskKPIWeight: ''
      }
    }
    setState({
      ...state,
      type: TASK_ACTION_TYPE.EDIT_TYPE,
      currentTask: {
        ...taskToEdit
      },
      currentIndex: listIndex
    })
  }

  const handleDeleteTask = (listIndex) => {
    let newList = [...projectTasks]
    newList.splice(listIndex, 1)

    if (type === TASK_ACTION_TYPE.EDIT_TYPE && Number(listIndex) === Number(currentIndex)) {
      setState({
        ...state,
        type: TASK_ACTION_TYPE.ADD_TYPE,
        currentTask: {
          ...initTaskData
        },
        currentIndex: null
      })
    } else {
      setState({
        ...state,
        // type: TASK_ACTION_TYPE.ADD_TYPE,
        currentTask: {
          ...initTaskData
        },
        currentIndex: null
      })
    }
    setProjectTasks([...newList])
  }

  const handleCancel = () => {
    setState({
      ...state,
      type: TASK_ACTION_TYPE.ADD_TYPE,
      currentTask: {
        ...initTaskData
      },
      currentIndex: null
    })
  }

  const handleSaveTask = (listIndex) => {
    const currentTaskToSaveUpdate = {
      ...currentTask,
      requireAsset: requireAsset?.require,
      requireAssignee: requireAssignee?.require
    }
    delete currentTaskToSaveUpdate['errors']
    let newListTask = projectTasks.map((item, index) => {
      if (index === listIndex) {
        item = {
          ...currentTaskToSaveUpdate
        }
      }
      return item
    })

    setState({
      ...state,
      type: TASK_ACTION_TYPE.ADD_TYPE,
      currentTask: {
        ...initTaskData
      },
      currentIndex: null
    })

    setProjectTasks(newListTask)
  }

  const handleResetTask = () => {
    setState({
      ...state,
      currentTask: initTaskData,
      currentIndex: null
    })
  }

  const covertRequireAssignee = (requireAssignee, listCapacityOptions) => {
    if (requireAssignee && Object.keys(requireAssignee)?.length) {
      Object.keys(requireAssignee)
    }
  }
  const onDataLoad = (data) => {

    let taskData = []
    if (data && data?.length) {
      data.forEach((item) => {
        const { kpiInTask, requireAsset } = item
        let kpiInTaskToAdd = ""
        let requireAssetToAdd = []
        let itemToPush = {
          ...item
        }

        if (kpiInTask) {
          let kpiFind = listKPIOptions.find((item) => item.text === kpiInTask)
          if (kpiFind) {
            kpiInTaskToAdd = kpiFind?.value
            itemToPush = { 
              ...item,
              kpiInTask: kpiInTaskToAdd
            }
          } else {
            setErrorUpload("Lỗi! Tồn tại công việc trong file import có KPI ứng với công việc không hợp lệ!")
            return
          }
        } else {
          setErrorUpload("Lỗi! Tồn tại công việc trong file import có KPI ứng với công việc không hợp lệ!")
          return
        }

        if (requireAsset && requireAsset?.length) {
          requireAsset.forEach((requireAssetItem) => {
            let requireAssetItemToAdd = {
              ...requireAssetItem
            }
            const { type } = requireAssetItem
            if (type) {
              // let requireTypeFind = listAssetsInProject
              let typeFind = listAssetsTypes.find((item) => {
                return item.text === type
              })
              if (!typeFind) {
                setErrorUpload("Lỗi! Tồn tại công việc trong file import có yêu loại cầu tài sản không hợp lệ")
                return
              }
              requireAssetItemToAdd = {
                ...requireAssetItem,
                type: typeFind.value
              }
              requireAssetToAdd.push({
                ...requireAssetItemToAdd
              })              
            } else {
              setErrorUpload("Lỗi! Tồn tại công việc trong file import có yêu loại cầu tài sản không hợp lệ")
              return
            }
          })
        }

        taskData.push({
          ...itemToPush,
          requireAsset: [...requireAssetToAdd]
        })
        
      })
    }

    if (!errorUpload) {
      setProjectTasks([...taskData])
    }
  }
  
  return (
    <React.Fragment>
      <div className="pt-2 flex justify-end">
        <a 
          href="/data/Upload/task_sample_import.xlsx" // Đường dẫn đến file mẫu trong thư mục public
          download 
          className="btn btn-secondary mt-2 underline"
        >
          Mẫu file import
        </a>
        <ExcelReader onDataLoad={onDataLoad} setErrorUpload={setErrorUpload}/>
      </div>
      <div>
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Đề xuất công việc</legend>
          {/* <a style={{ cursor: 'pointer' }} onClick={() => setState({ ...state, showFormTask: !showFormTask })}>
            {showFormTask ? 'Ẩn form' : 'Hiển thị form'}
          </a>
          <br />
          <CreateTagForm id={`${currentIndex}-${id}`} /> */}
          <div className="has-error">
            <ErrorLabel content={errorUpload} />
          </div>
          <div className="col-lg-6 col-md-12">
            <fieldset className="scheduler-border">
              <legend>Thông tin chung về công việc</legend>
              {/* Tên */}
              <div className="row">
                <div className="form-group col-md-12 col-xs-12">
                  <label>
                    {'Tên công việc'}
                    <span className='text-red'>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={handleChangeCurrentTask}
                  >
                  </input>
                  <div className="has-error">
                    <ErrorLabel content={errors?.name} />
                  </div>
                </div>
              </div>

              {/* Mã & Thời gian ước tính */}
              <div className="row">
                <div className="form-group col-md-6 col-xs-6">
                  <label>
                    {'Mã công việc'}
                    <span className='text-red'>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={code}
                    onChange={handleChangeCurrentTask}
                  >
                  </input>
                  <div className="has-error">
                    <ErrorLabel content={errors?.code} />
                  </div>
                </div>

                <div className="form-group col-md-6 col-xs-6">
                  <label>
                    {'Ước tính thời gian thực hiện'}
                    <span className='text-red'>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="estimateNormalTime"
                    value={estimateNormalTime}
                    onChange={handleChangeCurrentTask}
                    // placeholder="Thời gian thực hiện"
                    autoComplete="off"
                  >
                  </input>
                  <div className="has-error">
                    <ErrorLabel content={errors?.estimateNormalTime} />
                  </div>
                </div>
              </div>

              {/* Mô tả về công việc */}
              <div className='form-group'>
                <label>Mô tả công việc</label>
                <textarea
                  type='text'
                  rows={3}
                  style={{ minHeight: '103.5px' }}
                  name={`description`}
                  onChange={handleChangeCurrentTask}
                  value={description}
                  className='form-control'
                  // placeholder='Mô tả công việc'
                  autoComplete='off'
                />
                <div className="has-error">
                  <ErrorLabel content={errors?.description} />
                </div>
              </div>

              {/* Công việc tiền nhiệm */}
              <div className="row">
                <div className="form-group col-md-12 col-xs-12">
                  <label>
                    {'Tags'}
                    <span className='text-red'>*</span>
                  </label>
                  <SelectBox
                    id={`${actionType}-tags-task-select-box-${currentIndex}-${projectId}`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    items={listTagOptions}
                    onChange={(e) => handleChangeCurrentTask(e, 'tags')}
                    value={tags}
                    multiple={true}
                    // options={{ placeholder: 'Chọn tags liên quan đến công việc' }}
                  />
                  <div className="has-error">
                    <ErrorLabel content={errors?.tags} />
                  </div>
                </div>
              </div>

              {/* Công việc tiền nhiệm */}
              <div className="row">
                <div className="form-group col-md-12 col-xs-12">
                  <label>
                    {'Công việc tiền nhiệm'}
                    {/* <span className='text-red'>*</span> */}
                  </label>
                  <SelectBox
                    id={`${actionType}-preceeding-task-select-box-${state.currentIndex}-${code}-${projectId}`}
                    className='form-control select'
                    style={{ width: '100%' }}
                    items={listPrevTask ?? []}
                    onChange={(e) => handleChangeCurrentTask(e, 'preceedingTasks')}
                    value={preceedingTasks}
                    multiple={true}
                    // options={{ placeholder: 'Chọn công việc tiền nhiệm' }}
                  />
                  {/* <div className="has-error">
                    <ErrorLabel content={errors?.preceedingTasks} />
                  </div> */}
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6 col-xs-6">
                  <label>
                    {'KPI Liên quan'}
                    <span className='text-red'>*</span>
                  </label>
                  {listKPIOptions && listKPIOptions?.length > 0 ? (
                    <SelectBox
                      id={`${actionType}-kpi-in-task-select-box-${state.currentIndex}-${code}-${projectId}`}
                      className="form-control select"
                      style={{width: '100%'}}
                      items={listKPIOptions}
                      value={kpiInTask}
                      multiple={false}
                      onChange={(e) => {
                        handleChangeCurrentTask(e, 'kpiInTask')
                      }}
                      autoComplete="off"
                      options={{
                        placeholder: "Chọn KPI liên quan"
                      }}
                    >
                    </SelectBox>
                  ) : (
                      <div className="text-red">Chọn KPI mục tiêu cho dự án trước</div>
                  )}
                  <div className="has-error">
                    <ErrorLabel content={errors?.kpiInTask} />
                  </div>
                </div>

                {listKPIOptions && listKPIOptions?.length > 0 &&
                  <div className="form-group col-md-6 col-xs-6">
                    <label>
                      {'Trọng số'}
                      <span className='text-red'>*</span>
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      name="taskKPIWeight"
                      min="0"
                      max="1"
                      value={taskKPIWeight}
                      onChange={handleChangeCurrentTask}
                      // placeholder="Thời gian thực hiện"
                      autoComplete="off"
                    >
                    </input>
                    <div className="has-error">
                      <ErrorLabel content={errors?.taskKPIWeight} />
                    </div>
                  </div>
                }
              </div>


            </fieldset>
          </div>

          <div className="col-lg-6 col-md-12">
            <fieldset className="scheduler-border">
              <legend>Yêu cầu về năng lực nhân sự</legend>
              <div className="row">
                <div className="form-group col-lg-6 col-md-12 w-full">
                  {/* <label>
                    {'Năng lực'}
                    <span className='text-red'>*</span>
                  </label> */}
                  {(!listMembersInProject || !listMembersInProject?.length) &&
                    <div className="text-red py-4">Chọn nhân lực cho dự án trước!</div>
                  }
                  <div className="has-error">
                    <ErrorLabel content={errors?.requireAssignee} />
                  </div>
                  <table id={`${actionType}-task-require-assign-table-${currentIndex}-${currentIndex}`} className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th className="w-[45%]">Năng lực</th>
                        <th className="w-2/5">Giá trị</th>
                        <th className="w-[15%]">{translate('task_template.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* list giá trị đã chọn */}
                      {requireAssignee?.require && Object.keys(requireAssignee?.require).map((key) => (
                        <tr key={key}>
                          <td>{getCapacityKeyText(key, listCapacityOptions, translate)}</td>
                          <td>{getCapacityValueText(key, requireAssignee?.require[key], listCapacityOptions, translate)}</td>
                          <td>
                            <a className='delete'
                              title={translate('general.delete')}
                              onClick={() => handleDeleteCapacity(key)}
                            >
                              <i className='material-icons'>delete</i>
                            </a>
                          </td>
                        </tr>
                      ))}

                      {/* Dòng để thêm */}
                      <tr key={`${actionType}-add-capacity-input-${currentIndex}-${projectId}`}>
                        <td>
                          <div className="form-group">
                            {listCapacityOptions && listCapacityOptions?.length > 0 &&
                              <SelectBox
                                id={`${actionType}-add-capacity--type-${currentIndex}-${requireAssignee?.currentCapacityType}-${projectId}`}
                                className='form-control select2'
                                style={{ width: '100%' }}
                                items={listCapacityOptions}
                                value={requireAssignee?.currentCapacityType}
                                multiple={false}
                                onChange={(e) => {
                                  handleChangeCurrentCapacityType(e)
                                }}
                              />
                            }
                          </div>
                        </td>

                        <td>
                          <div className="form-group">
                            {listCapacityOptions && listCapacityOptions?.length > 0 &&
                              <SelectBox
                                id={`${actionType}-add-capacity-value-${currentIndex}-${requireAssignee?.currentCapacityValue}-${projectId}`}
                                className='form-control select2'
                                style={{ width: '100%' }}
                                items={getListCapacityValues(requireAssignee?.currentCapacityType || listCapacityOptions[0]?.value, listCapacityOptions)}
                                multiple={false}
                                options={{
                                  placeholder: "--- Chọn giá trị năng lực ---"
                                }}
                                value={requireAssignee?.currentCapacityValue}
                                onChange={(e) => {
                                  handleChangeCurrentCapacityValue(e)
                                }}
                              />
                            }
                          </div>
                        </td>

                        <td>
                          <a className={`save ${requireAssignee?.currentCapacityValue ? 'text-green' : 'text-green'}`}
                            title={translate('general.save')}
                            onClick={handleAddCapacityInTask}
                          >
                            <i className='material-icons'>add_circle</i>
                          </a>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="col-lg-6 col-md-12">
            <fieldset className="scheduler-border">
              <legend>Yêu cầu tài sản</legend>
              <div className="row">
                <div className="form-group col-lg-6 col-md-12 w-full">
                  {!listAssetsTypes || !listAssetsTypes?.length &&
                    <div className="text-red py-4">Chọn tài sản cho dự án trước!</div>
                  }
                  <div className="has-error">
                    <ErrorLabel content={errors?.requireAsset} />
                  </div>
                  <table id={`${actionType}-task-require-assign-table-${currentIndex}-${projectId}`} className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th className="w-[20%]">Loại tài sản</th>
                        <th className="w-[20%]">Số lượng</th>
                        <th className="w-[20%]">Năng lực sử dụng</th>
                        <th className="w-[20%]">Bắt buộc</th>
                        <th className="w-[20%]">{translate('task_template.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* List yêu cầu tài sản đã chọn */}
                      {
                        requireAsset?.require && requireAsset?.require?.length > 0 && requireAsset?.require.map((item, index) => (
                          <tr key={index}>
                            <td>{getOptionTextFromValueInSelectBoxItems(item?.type, listAssetsTypes, translate)}</td>
                            <td>{item?.number}</td>
                            <td>{getOptionTextFromValueInSelectBoxItems(item?.capacityValue, assetCapacities, translate)}</td>
                            <td>{getOptionTextFromValueInSelectBoxItems(item?.requireType, fakeAssetRequireTypes, translate)}</td>
                            <td>
                              <a className='delete'
                                title={translate('general.delete')}
                                onClick={() => handleDeleteRequireAssetItemInCurrentTask(item?.type)}
                              >
                                <i className='material-icons'>delete</i>
                              </a>
                            </td>
                          </tr>
                        ))
                      }

                      {/* Dòng để thêm */}
                      <tr key={`${actionType}-add-capacity-input-${currentIndex}-${projectId}`}>
                        <td>
                          <SelectBox
                            id={`${actionType}-require-asset-select-box-${currentIndex}-${requireAsset?.currentAssetType}-${projectId}`}
                            className='form-control select'
                            style={{ width: '100%' }}
                            items={listAssetsTypes}
                            value={requireAsset?.currentAssetType}
                            onChange={(e) => handleChangeCurrentTaskAssetTypeOrCapacity(e, 'currentAssetType')}
                            multiple={false}
                            options={{ placeholder: 'Loại tài sản' }}
                          />
                        </td>
                        <td>
                          <input
                            id={`${props.type}-require-asset-number-${currentIndex}-${requireAsset?.currentAssetNumber}`}
                            className='form-control select'
                            style={{ width: '100%' }}
                            type="number"
                            min="0"
                            value={requireAsset?.currentAssetNumber}
                            onChange={handleChangeCurrentTaskAssetNumber}
                          />
                        </td>
                        <td>
                          <SelectBox
                            id={`${actionType}-require-asset-capacity-${currentIndex}-${requireAsset?.currentAssetCapacity}-${projectId}`}
                            className='form-control select'
                            style={{ width: '100%' }}
                            items={assetCapacities}
                            defaultValue={null}
                            value={requireAsset?.currentAssetCapacity}
                            onChange={(e) => handleChangeCurrentTaskAssetTypeOrCapacity(e, 'currentAssetCapacity')}
                            multiple={false}
                            options={{ placeholder: 'Năng lực SD' }}
                          />
                        </td>
                        <td>
                          <SelectBox
                            id={`${actionType}-require-asset-type-select-box-${currentIndex}-${requireAsset?.currentAssetType}-${projectId}`}
                            className='form-control select'
                            // style={{ width: '100%' }}
                            items={fakeAssetRequireTypes}
                            value={requireAsset?.currentAssetRequireType}
                            onChange={(e) => handleChangeCurrentTaskAssetTypeOrCapacity(e, 'currentAssetRequireType')}
                            multiple={false}
                            options={{ placeholder: 'Loại yêu cầu' }}
                          />
                        </td>
                        <td>
                          <a className={`save ${'text-green'}`}
                            title={translate('general.save')}
                            onClick={handleAddAssetInCurrentTask}
                            style={{ width: '100%' }}
                          >
                            <i className='material-icons'>add_circle</i>
                          </a>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </fieldset>
          </div>
        </fieldset>

        <div className='row' style={{ marginRight: 0, marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          {state.type === TASK_ACTION_TYPE.EDIT_TYPE && (
            <>
              <button
                className='btn btn-danger'
                style={{ marginRight: '5px' }}
                type={'button'}
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                className='btn btn-success'
                style={{ marginRight: '5px' }}
                type={'button'}
                onClick={() => {
                  handleSaveTask(currentIndex)
                }}
              >
                Lưu
              </button>
            </>
          )}
          {state.type === TASK_ACTION_TYPE.ADD_TYPE && (
            <button
              className='btn btn-success'
              style={{ marginRight: '5px' }}
              type={'button'}
              disabled={!isTaskFormValidated()}
              onClick={handleAddTask}
            >
              Thêm
            </button>
          )}
          <button
            className='btn btn-primary'
            type={'button'}
            onClick={handleResetTask}
          >
            Xóa trắng
          </button>
        </div>


        {/* Hiển thị Thông tin bảng hoặc  */}
        <div className='box-tools' style={{ marginBottom: '5px' }}>
          <div className='btn-group'>
            <button type='button' onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${isTable ? 'btn-danger' : 'active'}`}>
              Bảng
            </button>
            <button type='button' onClick={() => setIsTable(!isTable)} className={`btn btn-xs ${!isTable ? 'btn-danger' : 'active'}`}>
              Biểu đồ Gantt
            </button>
          </div>
        </div>
      <br />
      {!isTable ? (
        <ProjectTaskViewInGantt
          taskList={projectTasks}
          unitOfTime={unitOfTime}
          projectStartTime={willStartTime ? new Date(convertToDate(willStartTime)).setHours(8) : new Date()}
        />
      ) : (
        <table id={`${actionType}-project-template-task-table-${projectId}-${currentIndex}`} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Mã công việc</th>
              <th>Tên công việc</th>
              <th>Công việc tiền nhiệm</th>
              <th>Thời gian ước lượng</th>
              <th>Tags công việc</th>
              <th>KPI liên quan</th>
              <th>Yêu cầu nhân lực</th>
              <th>Yêu cầu tài sản</th>
              <th>{translate('task_template.action')}</th>
            </tr>
          </thead>
          <tbody>
            {projectTasks &&
              projectTasks.length > 0 &&
              projectTasks.map((item, index) => (
                <tr key={index}>
                  <td>{item?.code}</td>
                  <td>{item?.name}</td>
                  <td>{item?.preceedingTasks?.join(', ')}</td>
                  <td>{item?.estimateNormalTime}</td>
                  <td>{item?.tags && item?.tags.join(", ")}</td>
                  <td>{item?.kpiInTask}</td>
                  <td>{JSON.stringify(item?.requireAssignee)}</td>
                  <td>{JSON.stringify(item?.requireAsset)}</td>
                  <td>
                    <a
                      className='edit'
                      title={translate('general.delete')}
                      onClick={() => handleEditTask(index)}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <a
                      className='delete'
                      title={translate('general.delete')}
                      onClick={() => handleDeleteTask(index)}
                    >
                      <i className='material-icons'>delete</i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = {

}

function mapStateToProps(state) {
  const { user, createKpiUnit, assetsManager, tag, capacity } = state
  return {user, createKpiUnit, assetsManager, tag, capacity }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectTasksTab))
