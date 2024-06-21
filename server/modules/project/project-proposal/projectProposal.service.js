const {
  Project,
  Role,
  UserRole,
  OrganizationalUnit,
  Employee,
  User,
  Salary,
  Task,
  Tag,
  Asset,
  AssetType
} = require('../../../models');
const { connect, } = require(`../../../helpers/dbHelper`);
const { KPI_MAX, KPI_NOT_WORK, KPI_FAIL } = require('./constants');
const { findTasksWithMatchingTagsAndRequire, findEmployeesWithCapacities, getVectorLength, getDistanceQualityVector, calculateCPM, checkHasAvailableSolution } = require('./helper');
const { topologicalSort, scheduleTasksWithAssetAndEmpTasks, initRandomHarmonyVector, DLHS, reScheduleTasks, addOptionalAssetsAvailableForTasks } = require('./hs_helper');
const { splitKPIToEmployeesByKMeans, findBestMiniKPIOfTasks, reSplitKPIOfEmployees } = require('./kmean_helper');

const getInputsFromProject = async (portal, id) => {
  // console.log("KPI_MAX: ", KPI_MAX, KPI_NOT_WORK, KPI_FAIL)
  try {
    const project = await Project(connect(DB_CONNECTION, portal)).findOne({
      _id: id
    }).populate({path: 'kpiTarget.type'})
    .lean().exec()
    if (!project) {
      throw ['project_not_found']
    }
    const {
      startDate,
      endDate,
      usersInProject,
      kpiTarget,
      assets, 
      tasks,
      unitCost,
      unitTime,
    } = project
    // console.log("vao day project: ", kpiTarget)
    const tasksInProject = await Task(connect(DB_CONNECTION, portal)).find({
      taskProject: id
    }).select("_id code preceedingTasks name description tags point estimateNormalTime requireAssignee requireAsset kpiInTask taskKPIWeight assignee assets").lean().exec()

    const employeeIds = usersInProject && usersInProject?.length && usersInProject.map((item) => item.employeeId)
    const employeesInDB = await Employee(connect(DB_CONNECTION, portal)).find({
      _id: { $in: employeeIds }
    }).select("_id fullName emailInCompany employeeNumber capacities")
      .populate({ path: "capacities.capacity", select: "name key"})
      .lean()
      .exec()
    const salaries = await Salary(connect(DB_CONNECTION, portal)).find({
      employee: { $in: employeeIds }
    }).lean();
        
    const employees = employeesInDB.map((employee) => {
      const employeeCapacities = {}
      let salaryOfEmployee = 10000000
      let salaryUnitOfEmployee = "VND"
      const salariesOfEmployee = salaries.filter((salaryItem) => String(salaryItem.employee) === String(employee._id))
      // console.log("emoloyee>id: ", employee._id)

      if (salariesOfEmployee?.length) {
        salaryOfEmployee = Number(salariesOfEmployee.sort((a, b) => new Date(b.month) - new Date(a.month))[0].mainSalary)
        salaryUnitOfEmployee = salariesOfEmployee.sort((a, b) => new Date(b.month) - new Date(a.month))[0].unit
      }
      if (employee?.capacities && employee?.capacities?.length > 0) {
        employee.capacities.forEach(({capacity, value}) => {
          employeeCapacities[capacity.key] = value
        })
      }
      return {
        ...employee,
        capacities: employeeCapacities,
        mainSalary: salaryOfEmployee,
        salaryUnit: salaryUnitOfEmployee
      }
    })

    const assetsInProject = await Asset(connect(DB_CONNECTION, portal)).find({
      _id: { $in: assets }
    }).select("_id assetName assetType group cost capacityValue costPerHour status code serial usageLogs")
      .lean().exec()

    return {
      tasks: tasksInProject,
      employees,
      assets: assetsInProject,
      willStartDate: startDate,
      willEndDate: endDate,
      startDate,
      kpiTarget: kpiTarget.map((item) => {
        return {
          ...item,
          type: item.type._id,
          weight: item.type.weight / 100
        }
      }),
      unitCost,
      unitTime
    }
  } catch (error) {
    throw error
  }
}

const getLastKPIAndAvailableEmpsInTasks = (tasks, allTasksInPast, employees) => {
  try {
    const lastKPIMap = new Map()

    if (!allTasksInPast || !allTasksInPast?.length) {
      employees.forEach((employee) => {
        const employeeId = employee._id
        tasks.forEach((task) => {
          const taskId = task._id
          const key = `${employeeId}-${taskId}`
          lastKPIMap.set(key, KPI_MAX)
        })
      })
      tasks.forEach((task) => {
        const { requireAssignee } = task
        
        availableAssignee = findEmployeesWithCapacities(employees, requireAssignee)
        task.availableAssignee = availableAssignee
      })
      return lastKPIMap
    } else {
      employees.forEach((employee) => {
        const employeeId = employee._id
        tasks.forEach((task) => {
          const taskId = task._id
          const key = `${employeeId}-${taskId}`
          lastKPIMap.set(key, KPI_NOT_WORK)
        })
      })
    }
  
    tasks.forEach((task) => {
      const { requireAssignee } = task
      const taskId = task._id
      let availableAssignee = employees
      if (requireAssignee === undefined || !Object.keys(requireAssignee) || !Object.keys(requireAssignee)?.length) {
        employees.map((employee) => {
          const employeeId = employee._id
          const key = `${employeeId}-${task._id}`
          let kpiValue = 1
  
          // Nếu không có yêu cầu năng lực => Lấy năng lực thực hiện công việc tốt nhất trong quá khứ
          let taskOfEmpInPast = allTasksInPast.filter((taskInPast) => taskInPast.assignee._id === employeeId && taskInPast.point !== KPI_FAIL)
          if (taskOfEmpInPast && taskOfEmpInPast?.length) {
            kpiValue = taskOfEmpInPast.sort((a, b) => b.point - a.point)[0].point
          }
          lastKPIMap.set(key, kpiValue)
        })
      } else {
        const listTaskMatching = findTasksWithMatchingTagsAndRequire(allTasksInPast, task)
        // console.log("listMatching: ", listTaskMatching)
        availableAssignee = findEmployeesWithCapacities(employees, requireAssignee)
        // console.log("availableAssignee: ", availableAssignee)

        const vectorLengthAssigneeCurrentTask = getVectorLength(requireAssignee)
        // console.log("vectorLengthAssigneeCurrentTask: ", vectorLengthAssigneeCurrentTask)
        if (!availableAssignee || !availableAssignee?.length) {
          throw ['not_available_employee']
        }
        availableAssignee.forEach((employee) => {
          const employeeId = employee._id
          const key = `${employeeId}-${taskId}`

          // console.log("listTaskMatching: ", listTaskMatching)
          // console.log("employeeId: ", employeeId)
          let listTasksMatchingWithEmp = listTaskMatching.filter((item) => String(item.assignee) === String(employeeId))
          // console.log("listTaskMatching: ", listTasksMatchingWithEmp)
          if (listTasksMatchingWithEmp && listTasksMatchingWithEmp?.length > 0) {
            listTasksMatchingWithEmp = listTasksMatchingWithEmp.sort((a, b) => {
              const distanceA = getDistanceQualityVector(a.requireAssignee, requireAssignee);
              const distanceB = getDistanceQualityVector(b.requireAssignee, requireAssignee);
    
              // So sánh khoảng cách
              if (distanceA !== distanceB) {
                return distanceA - distanceB;
              }
    
              // Nếu khoảng cách bằng nhau, so sánh theo thuộc tính khác
              return a.point - b.point;
            });
    
            let kpiValue = 0
            // Nếu 1 công việc trong quá khứ tương tự công việc hiện tại (có thể yêu cầu nhiều hơn) mà nó fail => cho fail
            const taskFail = listTasksMatchingWithEmp.find((item) =>         
              item.evaluatePoint === -1 && getVectorLength(item.requireAssignee) <= getVectorLength(task.requireAssignee)
            )

            if (taskFail) {
              kpiValue = KPI_FAIL
            } else {
              let kpiValueFromTaskInPast = listTasksMatchingWithEmp[0].point
              const vectorLengthAssigneePastTask = getVectorLength(listTasksMatchingWithEmp[0].requireAssignee)
              if (vectorLengthAssigneeCurrentTask <= vectorLengthAssigneePastTask) {
                kpiValue = kpiValueFromTaskInPast
              } else {
                kpiValue = kpiValueFromTaskInPast * Math.sqrt(vectorLengthAssigneePastTask / vectorLengthAssigneeCurrentTask)
              }
            }
            // console.log("kpiValue: ", kpiValue)
            lastKPIMap.set(key, kpiValue)
          }
        })
      }

      let updateAvailableAssignee = availableAssignee.filter((employee) => {
        const employeeId = employee._id
        const key = `${employeeId}-${task._id}`
        if (lastKPIMap.get(key) === KPI_FAIL) {
          return false
        } else {
          return true
        }
      })
      task.availableAssignee = updateAvailableAssignee
    })

    // console.log("MAP: ", lastKPIMap)

    tasks.forEach((task) => {
      const { availableAssignee } = task
      // console.log("availableAssignee: ", availableAssignee)
      const taskId = task._id
      availableAssignee.forEach((employee) => {
        const employeeId = employee._id
        // const lastKPIOfEmp = lastKPIsOfEmps.find((item) => item.id === employeeId)
        // kiểm tra mấy thằng bị KPI gán = -1
        const key = `${employeeId}-${taskId}`
        let kpiValue = lastKPIMap.get(key)
        // console.log(task.name, employee.fullName, "kpiValue: ", kpiValue)
        if (!kpiValue) {
          // Lấy giá trị nhỏ nhất của thằng thực hiện task đó
          const kpiOfEmpsWithTask = Array.from(lastKPIMap).filter((item) => item[0].includes(task._id) && item[1] !== KPI_FAIL && item[1] !== KPI_NOT_WORK);
          // console.log("kpiOfEmpsWithTask: ", kpiOfEmpsWithTask)
          
          const sortedKpiOfEmpsWithTask = kpiOfEmpsWithTask.sort((a, b) => a[1] - b[1])
          if (sortedKpiOfEmpsWithTask?.length) {
            kpiValue = sortedKpiOfEmpsWithTask[0][1]
          } else {
            // Lấy random 
            kpiValue = 0.8 + Math.random() * (1 - 0.8)
          }
          lastKPIMap.set(key, kpiValue)
        }
      })
    })

    return lastKPIMap
  } catch (error) {
    throw error
  }
}

const initDLHS_Arguments = () => {
  const HMS = 60, Max_FEs = 30000, R = 100, numOfSub = 4, PSLSize = 5, BW_max = 2, BW_min = 1
  
  return {
    HMS,
    BW_max,
    BW_min,
    PSLSize,
    numOfSub,
    R,
    Max_FEs,
  }
}

const initHS_Arguments = () => {
  const bw = 1, maxIter = 20000, hmSize = 60, PAR = 0.5, HMCR = 0.95

  return {
    bw,
    maxIter,
    hmSize, 
    PAR,
    HMCR
  }
}

const proposalForProjectWithDLHS = (job, kpiInPast, allTasksOutOfProject, DLHS_Arguments, assetHasKPIWeight) => {
  const {
    employees, 
    assets,
    kpiTarget,
    unitTime
  } = job

  // STEP 1

  // Step 1.1: topo sort and check by criticalpath
  job.tasks = topologicalSort(job.tasks)

  job.tasks = calculateCPM(job.tasks, job?.willStartDate, job?.willEndDate, job?.unitTime)
  // console.log("vào đây")

  let checkResult = checkHasAvailableSolution(job.tasks, job?.willStartDate, job?.willEndDate, allTasksOutOfProject)

  if (checkResult?.isHasAvailableSolution === false && checkResult?.error_code) {
    throw [checkResult?.error_code]
  }
  // return {
  //   job
  // }
 
  // Step 1.2: split KPI 
  let kpiOfEmployeesTarget = {}
  employees.forEach((employee) => {
    kpiOfEmployeesTarget[employee._id] = {}
    for (const kpi of kpiTarget) {
      kpiOfEmployeesTarget[employee._id][kpi.type] = 0
    }
  })

  let isHasKPITarget = false
  for (const kpi of kpiTarget) {
    if (kpi?.targetKPIValue && kpi?.targetKPIValue !== 0) {
      isHasKPITarget = true
    }
  }

  if (isHasKPITarget) {
    kpiOfEmployeesTarget = splitKPIToEmployeesByKMeans(job.tasks, employees, kpiTarget, assetHasKPIWeight)
    const minimumKpi = findBestMiniKPIOfTasks(job.tasks, kpiTarget, assetHasKPIWeight)
    kpiOfEmployeesTarget = reSplitKPIOfEmployees(minimumKpi, kpiOfEmployeesTarget)
  }

  const assetsReadyToUse = assets.filter((item) => item.status === 'ready_to_use')
  const assetsInUse = assets.filter((item) => item.status === 'in_use')
  const assetsWithStatus = {
    readyToUse: [...assetsReadyToUse],
    inUse: [...assetsInUse]
  }


  // Step 1.2
  let temp = scheduleTasksWithAssetAndEmpTasks(job, assetsWithStatus, allTasksOutOfProject)
  // console.log("vaof day: ", temp)
  job.tasks = temp?.tasks
  let currentAssets = temp?.currentAssets
  // console.log("currentAssets: ", currentAssets)
  let sortedTasks = addOptionalAssetsAvailableForTasks(job, currentAssets)
  job.tasks = sortedTasks

  let lastestEndTime = new Date(0)
  for (let i = 0; i < job.tasks?.length; i++) {
    const task = job.tasks[i]
    const endDate = new Date(task?.endDate)
    if (lastestEndTime < endDate) {
      lastestEndTime = endDate
    }
    
  }
  if (new Date(lastestEndTime) > new Date(job.willEndDate)) {
    throw ['out_of_time']
  }

  // Step 3
  let result = DLHS(DLHS_Arguments, job.tasks, employees, kpiInPast, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, job.unitTime)
  if (result?.falseDuplidate) {
    result = reScheduleTasks(result, assetsWithStatus, allTasksOutOfProject, job.willEndDate, job.unitTime)
  }
  return result
}

/**
 * Phân bổ nguồn lực dự án
 * @param {*} query 
 */

exports.proposalForProject = async (portal, id, data) => {
  try {
    const job = await getInputsFromProject(portal, id)
    const { algorithm } = data
    const allTasksInPast = await Task(connect(DB_CONNECTION, portal)).find({
      status: 'finished',
      taskProject: { $ne: id }
    }).select("_id code preceedingTasks name description tags point estimateNormalTime requireAssignee requireAsset kpiInTask taskKPIWeight assignee assets")
      .lean().exec()

    const kpiInPast = getLastKPIAndAvailableEmpsInTasks(job.tasks, allTasksInPast, job.employees)

    // console.log("kpiInPast: ", kpiInPast
    // job.tasks.forEach((item) => {
    //   console.log(item.code, "avali: ", item.availableAssignee.map((item) => item.fullName))
    // })
    const allTasksOutOfProject = await Task(connect(DB_CONNECTION, portal)).find({
      status: 'inprocess',
      taskProject: { $ne: id }
    }).select("_id code preceedingTasks name description tags point estimateNormalTime requireAssignee requireAsset kpiInTask taskKPIWeight assignee assets")
      .lean().exec()
    
    const DLHS_Arguments = initDLHS_Arguments()
    const assetHasKPIWeight = 0.1

    const result = proposalForProjectWithDLHS(job, kpiInPast, allTasksOutOfProject, DLHS_Arguments, assetHasKPIWeight) 

    let kpiAssignment = result?.kpiAssignment
    let isCompleteProposal = true
    if (!kpiAssignment) {
      isCompleteProposal = false
    } 
    for (const kpi of job.kpiTarget) {
      if (kpi.targetKPIValue > kpiAssignment[kpi.type]) {
        isCompleteProposal = false
        break
      }
    }

    // update assets and task after proposal
  
    // update project
    const project = await Project(connect(DB_CONNECTION, portal)).findOne({
      _id: id
    }).lean().exec()

    const newProposal = {
      ...result,
      isComplete: isCompleteProposal,
      algorithm
    }
    const currentProposal = project?.proposals

    // Nếu đã có dữ liệu phân bổ rồi
    let oldVersion = {}
    if (currentProposal && currentProposal?.assignment) {
      oldVersion = currentProposal
    }

    let updateProjectData = {
      ...project,
      proposals: newProposal,
      proposalLogs: {
        newVersion: newProposal,
        oldVersion: oldVersion
      }
    }

    await Project(connect(DB_CONNECTION, portal)).findOneAndUpdate(
      { _id: id },
      { $set: updateProjectData },
      { new: true, lean: true } // Return the updated document
    ).exec();


    // update project 

    // TODO: update tasks and assets after proposal for project 
    return {
      projectId: id,
      proposalData: result
    }
  } catch (error) {
    throw error
  }
}
