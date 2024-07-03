import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { fakeUnitCostList, fakeUnitTimeList, TABs } from './consts'
import ProjectGeneralInfoTab from './projectGeneralInfoTab'
import ProjectResourceTab from './projectResourceTab'
import ProjectTaskTab from './projectTaskTab'
import { convertToDate } from '../../projects/components/functionHelper'
import { getListMembersInProject } from '../../../task/projectMemberHelper'
import { getEmployeeSelectBoxItemsWithEmployeeData } from '../../../task/organizationalUnitHelper'
import { getListAssetFromIds, getListAssetIDsFromAssetGroups } from '../../../../helpers/assetHelper'
import { ProjectActions } from '../../projects/redux/actions'
import { PROJECT_ACTION_FORM } from '../../projects/constants'
import { formatDate } from '../../../../helpers/formatDate'
import { ProjectPhaseActions } from '../../project-phase/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { createUnitKpiActions } from '../../../kpi/organizational-unit/creation/redux/actions'
import { AssetManagerActions } from '../../../asset/admin/asset-information/redux/actions'
import { TagActions } from '../../../bidding/tags/redux/actions'
import { CapacityActions } from '../../../human-resource/capacity/redux/actions'
import { getStorage } from '../../../../config'

function ProjectCreateEditForm(props) {
  const [selectedTab, setSelectedTab] = useState(TABs.GENERAL)
  const { translate, user, assetsManager, createKpiUnit, actionType, projectEdit, projectEditId } = props
  // console.log("projectEdit: ", projectEdit)

  const organizationalUnitKpiSets =
    createKpiUnit?.organizationalUnitKpiSets?.kpiUnitSets && createKpiUnit?.organizationalUnitKpiSets?.kpiUnitSets?.length > 0
      ? createKpiUnit?.organizationalUnitKpiSets?.kpiUnitSets
          .map((item) => {
            return {
              ...item,
              text: `${item.organizationalUnit.name} (${item._id}) `,
              value: item._id,
              key: item._id
            }
          })
          .sort((a, b) => a.text.localeCompare(b.text))
      : []
  // Các hàm xử lý tabbedPane
  const handleChangeContent = (content) => {
    setSelectedTab(content)
  }

  const [generalProjectInfo, setGeneralProjectInfo] = useState({
    projectName: '',
    projectType: 2,
    description: '',
    willStartTime: '',
    willEndTime: '',
    unitOfCost: fakeUnitCostList[0].value,
    unitOfTime: fakeUnitTimeList[0].value,
    projectNameError: '',
    errorOnWillStartTime: '',
    errorOnWillEndTime: ''
  })

  const [projectKPITarget, setProjectKPITarget] = useState({
    kpiSet: '',
    kpiSetError: '',
    kpisTarget: [],
    kpisTargetErrors: []
  })

  const [projectMembers, setProjectMembers] = useState({
    managers: '',
    errorManagers: '',
    employees: [],
    employeesWithUnit: {
      list: [],
      currentUnitRow: '',
      currentEmployeeRow: []
    },
    errorEmployees: ''
  })

  const [projectAssets, setProjectAssets] = useState({
    assets: [],
    errorAssets: '',
    assetsWithGroup: {
      list: [],
      currentGroupRow: '',
      currentAssetRow: []
    }
  })

  const [projectTasks, setProjectTasks] = useState([])

  const isFormValidated = () => {
    const {
      projectName,
      projectNameError,
      projectType,
      willStartTime,
      errorOnWillStartTime,
      willEndTime,
      errorOnWillEndTime,
      unitOfCost,
      unitOfTime,
    } = generalProjectInfo
    if (!projectName || !projectType || !willStartTime || !willEndTime || !unitOfCost || !unitOfTime
      || projectNameError || errorOnWillStartTime || errorOnWillEndTime) {
      return false
    }

    const {
      kpiSetError,
      kpisTarget,
      kpisTargetErrors
    } = projectKPITarget

    if (!kpisTarget?.length ||
      (kpisTargetErrors && kpisTargetErrors?.length && kpisTargetErrors?.filter((item) => item)?.length > 0) ||
      kpiSetError) {
      return false
    }

    const {
      managers,
      errorManagers,
      employeesWithUnit,
      errorEmployees
    } = projectMembers

    if (!managers || !managers?.length || !employeesWithUnit ||
      !employeesWithUnit?.list || !employeesWithUnit?.list?.length ||
      errorManagers || errorEmployees) {
      return false
    }

    const {
      errorAssets,
      assetsWithGroup
    } = projectAssets
    if (!assetsWithGroup || !assetsWithGroup?.list || !assetsWithGroup?.list?.length || errorAssets) {
      return false
    }

    if (projectTasks && projectTasks?.length) {
      for (const task of projectTasks) {
        const {
          code,
          name,
          estimateNormalTime,
          kpiInTask,
          taskKPIWeight,
          tags
        } = task
        if (!code || !name || !estimateNormalTime || !kpiInTask || !taskKPIWeight || !tags || !tags?.length) {
          return false
        }
      }
    }

    if (!projectTasks || !projectTasks?.length) {
      return false
    }

    return true
  }

  const save = () => {
    const {
      projectName,
      projectType,
      willStartTime,
      willEndTime,
      unitOfCost,
      unitOfTime,
      description
    } = generalProjectInfo
    const startDate = new Date(convertToDate(willStartTime)).setHours(8)
    const endDate = new Date(convertToDate(willEndTime)).setHours(8)

    const {
      kpisTarget,
    } = projectKPITarget

    const kpiTarget = kpisTarget && kpisTarget?.length ? kpisTarget?.map((item) => {
      return {
        type: item?._id,
        typeIndex: item?.typeIndex,
        targetKPIValue: item?.kpiTargetValue,
        assignValueInProject: item?.assignValueInProject,
        targetValueInProject: item?.targetValueInProject
      }
    }) : []

    const {
      managers,
    } = projectMembers

    const listUsersWithUnit = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
    const responsibleEmployeesWithUnit = projectMembers?.employeesWithUnit?.list && projectMembers?.employeesWithUnit?.list?.length > 0 ? projectMembers?.employeesWithUnit?.list : []
    const listMembersInProject = listUsersWithUnit && listUsersWithUnit?.length > 0 && responsibleEmployeesWithUnit && responsibleEmployeesWithUnit?.length > 0 ? getListMembersInProject(responsibleEmployeesWithUnit, listUsersWithUnit) : []

    // console.log("responsibleEmployeesWithUnit: ", responsibleEmployeesWithUnit)
    const responsibleEmployees = listMembersInProject && listMembersInProject?.length ? listMembersInProject.map((item) => {
      return item?.userId
    }) : []

    const usersInProject = listMembersInProject && listMembersInProject?.length ? listMembersInProject.map((item) => {
      return {
        userId: item?.userId,
        unitId: item?.unitId,
        employeeId: item?.employeeId
      }
    }) : []


    const {
      assetsWithGroup
    } = projectAssets

    const listAllAssets = assetsManager?.listAssets
    const listAssetWithGroupInProject = assetsWithGroup?.list
    const listAssetIDsInProject = listAssetWithGroupInProject && listAssetWithGroupInProject?.length > 0 ? getListAssetIDsFromAssetGroups(listAssetWithGroupInProject) : []
    const listAssetsInProject = getListAssetFromIds(listAssetIDsInProject, listAllAssets)
    const assets = listAssetsInProject && listAssetsInProject?.length ? listAssetsInProject.map((item) => item._id) : []


    const projectData = {
      name: projectName,
      projectType,
      description,
      startDate,
      endDate,
      unitTime: unitOfTime,
      unitCost: unitOfCost,
      projectManager: managers,
      responsibleEmployees,
      // responsibleEmployeesWithUnit,
      usersInProject,
      assets,
      kpiTarget,
      proposals: {
        startTime: startDate,
        // tasks: projectTasks
      },
      tasksData: projectTasks
    }

    if (actionType === PROJECT_ACTION_FORM.CREATE) {
      props.submitFunction({
        ...projectData
      })
    } else {
      // edit
      if (projectEdit?._id && projectEditId) {
        props.submitFunction(projectEdit?._id, {
          ...projectData
        })
      }
    }

    // reset state modal after create project
    if (actionType === PROJECT_ACTION_FORM.CREATE) {
      setGeneralProjectInfo({
        projectName: '',
        projectType: 2,
        description: '',
        willStartTime: '',
        willEndTime: '',
        unitOfCost: fakeUnitCostList[0].value,
        unitOfTime: fakeUnitTimeList[0].value,
        projectNameError: '',
        errorOnWillStartTime: '',
        errorOnWillEndTime: ''
      })
  
      setProjectKPITarget({
        kpiSet: '',
        kpiSetError: '',
        kpisTarget: [],
        kpisTargetErrors: []
      })
  
      setProjectMembers({
        managers: '',
        errorManagers: '',
        employees: [],
        employeesWithUnit: {
          list: [],
          currentUnitRow: '',
          currentEmployeeRow: []
        },
        errorEmployees: '',
      })
  
      setProjectAssets({
        assets: [],
        errorAssets: '',
        assetsWithGroup: {
          list: [],
          currentGroupRow: '',
          currentAssetRow: []
        }
      })
  
      setProjectTasks([])
  
      setSelectedTab(TABs.GENERAL)

    }


    // setTimeout(() => {
    //   props.handleAfterCreateProject()
    // }, 30 * responsibleEmployees?.length)

  }

  useEffect(() => {
    setSelectedTab(TABs.GENERAL)
    if (actionType === PROJECT_ACTION_FORM.EDIT && projectEditId && projectEdit) {
      // console.log("vào đây lấy project infomation: ", projectEditId)
      // console.log("vào đây lấy project infomation edit: ", projectEdit)
      const {
        name,
        startDate,
        endDate,
        unitCost,
        unitTime,
        description,
        kpiTarget,
        usersInProject,
        projectManager,
        assets,
        proposals,
        tasks
      } = projectEdit

      // set project general info
      setGeneralProjectInfo({
        projectName: name ? name : '',
        projectType: 2,
        description: description ? description : '',
        willStartTime: startDate ? formatDate(startDate) : '',
        willEndTime: endDate ? formatDate(endDate) : '',
        unitOfCost: unitCost ? unitCost : fakeUnitCostList[0].value,
        unitOfTime: unitTime ? unitTime : fakeUnitTimeList[0].value
      })

      // Set KPI target
      if (!organizationalUnitKpiSets || !organizationalUnitKpiSets?.length || !kpiTarget || !kpiTarget?.length) {
        setProjectKPITarget({
          kpiSet: '',
          kpiSetError: '',
          kpisTarget: [],
          kpisTargetErrors: []
        })
      } else {
        const kpiSetItem = organizationalUnitKpiSets.find((organizationalUnitKpiSetItem) => {
          const { kpis } = organizationalUnitKpiSetItem
          if (!kpis || !kpis?.length || kpis?.length !== kpiTarget?.length) {
            return false
          } else {
            for (const kpi of kpis) {
              const kpiItemId = kpi?._id
              if (!kpiTarget.some((item) => item?.type?._id === kpiItemId)) {
                return false
              }
            }
          }
          return true
        })
        if (kpiSetItem) {
          setProjectKPITarget({
            kpiSet: kpiSetItem?._id,
            kpisTarget: kpiTarget.map((item) => {
              return {
                ...item,
                kpiTargetValue: item?.targetKPIValue,
                name: item?.type?.name,
                _id: item?.type?._id
              }
            }),
            kpisTargetErrors: [],
            kpiSetError: ''
          })
        } else {
          setProjectKPITarget({
            kpiSet: '',
            kpiSetError: '',
            kpisTarget: kpiTarget.map((item) => {
              return {
                ...item,
                kpiTargetValue: item?.targetKPIValue,
                name: item?.type?.name,
                _id: item?.type?._id
              }
            }),
            kpisTargetErrors: []
          })
        }
      }

      // Set Project employees
      let projectMembersInEditProject = {
        managers: projectManager && projectManager?.length ? projectManager.map((item) => item?._id) : [],
        errorManagers: '',
        employees: [],
        errorEmployees: '',
        employeesWithUnit: {
          list: [],
          currentUnitRow: '',
          currentEmployeeRow: []
        }
      }
      if (!usersInProject || !usersInProject?.length) {
        setProjectMembers({
          ...projectMembersInEditProject
        })
      } else {
        let usersWithUnitId = {}
        for (const userItem of usersInProject) {
          const { userId, unitId } = userItem
          if (!usersWithUnitId.hasOwnProperty(unitId)) {
            usersWithUnitId[unitId] = []
          }
          usersWithUnitId[unitId].push(userId)
        }
        let list = []
        for (let key in usersWithUnitId) {
          list.push({
            unitId: key,
            listUsers: usersWithUnitId[key]
          })
        }
        setProjectMembers({
          ...projectMembersInEditProject,
          employeesWithUnit: {
            ...projectMembersInEditProject?.employeesWithUnit,
            list: [...list]
          }
        })
      }

      // set project assets
      let projectAssetsInEditProject = {
        assets: [],
        errorAssets: '',
        assetsWithGroup: {
          list: [], // {group, listAssets: [id]}
          currentGroupRow: '',
          currentAssetRow: []
        }
      }

      if (!assets || !assets?.length) {
        setProjectAssets({
          ...projectAssetsInEditProject
        })
      } else {
        let assetWithGroupObj = {}
        for (const asset of assets) {
          const { group } = asset
          if (!assetWithGroupObj.hasOwnProperty(group)) {
            assetWithGroupObj[group] = []
          }
          assetWithGroupObj[group].push(asset?._id)
        }

        let list = []
        for (let key in assetWithGroupObj) {
          list.push({
            group: key,
            listAssets: assetWithGroupObj[key]
          })
        }
        setProjectAssets({
          ...projectAssetsInEditProject,
          assetsWithGroup: {
            ...projectAssetsInEditProject?.assetsWithGroup,
            list: [...list]
          }
        })
      }

      let tasksData = tasks || []
      if (tasks?.length) {
        tasksData = tasks.map((item) => {
          return {
            ...item,
            preceedingTasks:
              item?.preceedingTasks && item?.preceedingTasks?.length
                ? item?.preceedingTasks.map((preTask) => {
                    return preTask?.link
                  })
                : []
          }
        })
      }
      // Set project tasks
      setProjectTasks([...tasksData])
    }
  }, [projectEditId])

  const userId = getStorage('userId')
  const page = 1, perPage = 100

  useEffect(() => {
    props.getProjectsDispatch({ calledId: 'paginate', page, perPage, userId })
    props.getProjectsDispatch({ calledId: 'user_all', userId })
    props.getAllUserInAllUnitsOfCompany()
    props.getAllOrganizationalUnitKpiSet(null, 1)
    props.getAllAsset({
      status: ['in_use', 'ready_to_use']
    })
    props.getListTag()
    props.getListCapacity()
  }, [])

  

  return (
    <div className='row px-10'>
      <div className="flex justify-end mr-10">
        <button
          type='button'
          className='btn btn-success dropdown-toggle pull-right'
          onClick={save}
          data-toggle='dropdown'
          aria-expanded='true'
          title={"Cập nhật"}
          disabled={!isFormValidated()}
        >
          {"Cập nhật"}
        </button>
      </div>
      <div style={{ height: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <form id={actionType === PROJECT_ACTION_FORM.CREATE ? `form-create-project` : `form-edit-project`} className='w-full'>
          {/* Tabbed pane */}
          <ul className='nav nav-tabs'>
            {/* Nút tab thông tin cơ bản */}
            <li className={selectedTab === TABs.GENERAL ? 'active' : ''}>
              <a href='#general' onClick={() => handleChangeContent(TABs.GENERAL)} data-toggle='tab'>
                Thông tin chung
              </a>
            </li>
            {/* Nút tab Thông tin nhân lực và thiết bị thực hiện */}
            <li className={selectedTab === TABs.RESOURCES ? 'active' : ''}>
              <a href='#resources' onClick={() => handleChangeContent(TABs.RESOURCES)} data-toggle='tab'>
                Tài nguyên nhân lực và tài sản
              </a>
            </li>
            {/* Nút tab các bên tgia */}
            <li className={selectedTab === TABs.TASKS ? 'active' : ''}>
              <a href='#tasks' onClick={() => handleChangeContent(TABs.TASKS)} data-toggle='tab'>
                {actionType === PROJECT_ACTION_FORM.CREATE ? 'Thêm công việc' : 'Danh sách công việc'}
              </a>
            </li>
          </ul>

          <div className='tab-content'>
            <div className={selectedTab === TABs.GENERAL ? 'active tab-pane' : 'tab-pane'} id={TABs.GENERAL}>
              {/* Project Create Component */}
              <ProjectGeneralInfoTab
                generalProjectInfo={generalProjectInfo}
                setGeneralProjectInfo={setGeneralProjectInfo}
                projectKPITarget={projectKPITarget}
                setProjectKPITarget={setProjectKPITarget}
                organizationalUnitKpiSets={organizationalUnitKpiSets}
                actionType={actionType}
                projectEdit={projectEdit}
                projectId={projectEditId}
              />
            </div>

            <div className={selectedTab === TABs.RESOURCES ? 'active tab-pane' : 'tab-pane'} id={TABs.RESOURCES}>
              {/* Create Tasks ProjectTemplate */}
              <ProjectResourceTab
                projectMembers={projectMembers}
                setProjectMembers={setProjectMembers}
                projectAssets={projectAssets}
                setProjectAssets={setProjectAssets}
                actionType={actionType}
                projectEdit={projectEdit}
                projectId={projectEditId}
              />
            </div>

            <div className={selectedTab === TABs.TASKS ? 'active tab-pane' : 'tab-pane'} id={TABs.TASKS}>
              {/* Create Tasks ProjectTemplate */}
              <ProjectTaskTab
                generalProjectInfo={generalProjectInfo}
                projectKPITarget={projectKPITarget}
                projectMembers={projectMembers}
                projectAssets={projectAssets}
                projectTasks={projectTasks}
                setProjectTasks={setProjectTasks}
                actionType={actionType}
                projectEdit={projectEdit}
                projectId={projectEditId}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function mapState(state) {
  const { project, user, tasks, projectPhase, createKpiUnit, assetsManager, tag, capacity } = state
  return { project, user, tasks, projectPhase, createKpiUnit, assetsManager, tag, capacity }
}

const actions = {
  createProjectDispatch: ProjectActions.createProjectDispatch,

  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  createProjectDispatch: ProjectActions.createProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  getAllTasksByProject: taskManagementActions.getAllTasksByProject,
  getAllPhaseByProject: ProjectPhaseActions.getAllPhaseByProject,
  editProjectDispatch: ProjectActions.editProjectDispatch,
  getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
  getAllOrganizationalUnitKpiSet: createUnitKpiActions.getAllOrganizationalUnitKpiSet,
  getAllAsset: AssetManagerActions.getAllAsset,
  getListTag: TagActions.getListTag,
  getListCapacity: CapacityActions.getListCapacity
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ProjectCreateEditForm))
export { connectedExampleManagementTable as ProjectCreateEditForm }
