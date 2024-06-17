const { DAY_WORK_HOURS, KPI_NOT_WORK, KPI_FAIL } = require("./constants");
const { reCalculateTimeWorking, calculateEndDateFromStartDate } = require("./helper");

function topologicalSort(tasks) {
  const result = [];
  const visited = new Set();
  const inProgress = new Set();
  
  function visit(task) {
    if (inProgress.has(task)) {
      // throw new Error('Tasks have cyclic dependencies.');
      throw ['cycle_dependency_task_error']
    }
    
    if (!visited.has(task)) {
      inProgress.add(task);
      
      const dependencies = task?.preceedingTasks && task.preceedingTasks?.length ? task?.preceedingTasks.map((item) => item.link) : [];
      dependencies.forEach(depCode => {
        const dependency = tasks.find(t => t.code === depCode);
        if (!dependency) {
          // throw new Error(`Dependency with id ${depCode} not found.`);
          throw ['dependency_not_found']
        }
        visit(dependency);
      });
      
      inProgress.delete(task);
      visited.add(task);
      result.unshift(task);
    }
  }
  
  for (const task of tasks) { 
    visit(task);
  }
  
  return result.reverse();
}

function isAssetCompatibleWithRequirement(asset, requireAsset) {
  if (!asset.assetType.map((item) => String(item)).includes(String(requireAsset.type)))
    return false
  if (!asset.capacityValue || requireAsset?.capacityValue > asset.capacityValue) {
    return false
  }
  return true;
}

function getAvailableTimeForAssetOfTask(task, assets) {
  // console.log("task test: ", task.code)
  // console.log("task test 1: ", task.requireAsset)
  let availableAssets = []
  if (task.requireAsset?.length == 0) {
    return {
      taskAssets: [],
      availableTime: new Date(0)
    }
  }

  let availableTimes = [];
  availableTimes.push(new Date(0))
  // console.log("currentTask: ", task.code)
  // console.log("currentAsset In use: ", assets.inUse.map((item) => item.assetName))
  // console.log("currentAsset ready to use: ", assets.readyToUse.map((item) => item.assetName))
  let taskRequireCompulsoryAsset = task?.requireAsset && task?.requireAsset?.length ? 
    task?.requireAsset.filter((item) => item.requireType === 'obligatory')
    : []
    
  if (taskRequireCompulsoryAsset?.length) {

    task.requireAsset.forEach(require => {
      let readyToUse = assets.readyToUse.filter(asset => isAssetCompatibleWithRequirement(asset, require)).sort((a, b) => a.costPerHour - b.costPerHour)
      // Nếu có tài nguyên yêu cầu và đủ số lượng => trả về timeavailable = 0 
      // console.log("taskcode: ", task.code, readyToUse)
      // console.log("assets re: ", assets.readyToUse)
      // console.log("assets iu: ", assets.inUse)
      // console.log("require: ", require)
      if (readyToUse?.length >= require.number) {
        availableTimes.push(new Date(0));
        
        for (let i = 0; i < require.number; i++) {
          availableAssets.push(readyToUse[i])
        }
      }
      else {
        availableAssets = [...readyToUse]
        const remain = require.number - readyToUse.length;
        let inUse = assets.inUse.filter(asset => isAssetCompatibleWithRequirement(asset, require));
        // console.log("task: ", task.code, inUse)
        // console.log("task require: ", require)
        if (inUse?.length && remain <= inUse?.length) {
          // Lấy cả bọn tài nguyên đang được sử dụng ra 
          let sortedAssets = inUse.map(asset => {
            const latestLog = asset.usageLogs.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0].endDate;
            return { asset, latestLog };
          }).sort((a, b) => new Date(a.latestLog) - new Date(b.latestLog));
          
          const inUseToPush = sortedAssets.slice(0, remain).map((item) => item.asset)
          availableAssets.push(...inUseToPush)
          const logs = inUseToPush.map(_=>_.usageLogs.sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0].endDate).sort((a, b) =>  new Date(a) - new Date(b));
          // trả về mảng logs mới nhất của các tài nguyên đang sử dụng, trong đó chứa endDate gần nhất (tức là endDate sẽ được dùng available) của từng thằng tài nguyên đang sử dụng)), logs theo thứ tự tăng dần của endaDate của từng thằng tài nguyên đang dùng
          // Nến ví dụ cần 2 thằng thì thời điểm sớm nhất để 2 thằng đó được sử dụng là logs của thằng thứ 2 (remain - 1)
          // console.log("logs: ", typeof logs[remain - 1])
          availableTimes.push(new Date(logs[remain - 1]))
          return {
            taskAssets: availableAssets,
            availableTime: new Date(Math.max(...availableTimes))
          }
        } else {
          // Check từ đầu luôn khi tạo task cũng được
          throw ['not_enough_asset']
        }
      }
    });
  } else {
    return {
      taskAssets: [],
      availableTime: new Date(0)
    }
  }
  return {
    taskAssets: availableAssets,
    availableTime: new Date(Math.max(...availableTimes))
  }
}

function checkAssetOptionalIsAvailableForTask(asset, task, currentScheduleOfOptional) {
  // currentScheduleOfOptional : lưu trữ lịch tạm thời phân công cho các optional asset trong project hiện tại
  // key: id của asset
  // value: mảng các {startDate, endDate} nhưng là ISO string

  // console.log("check asset: ", asset)
  const { startDate, endDate } = task
  let usageLogs = asset?.usageLogs
  if (currentScheduleOfOptional && currentScheduleOfOptional[asset?._id] && currentScheduleOfOptional[asset?._id]?.length) {
    usageLogs.push(...currentScheduleOfOptional[asset?._id])
  }

  if (!usageLogs || !usageLogs?.length) {
    return true
  }
  usageLogs = usageLogs.sort((usageLogA, usageLogB) => new Date(usageLogA.startDate) - new Date(usageLogB.startDate))
  // console.log("usageLogs: ", usageLogs)
  earliestLog = usageLogs[0]
  lastestLog = usageLogs[usageLogs?.length - 1]
  if (new Date(earliestLog?.startDate) >= endDate || new Date(lastestLog?.endDate) <= startDate) {
    return true
  }

  if (usageLogs?.length > 2) {
    for(let i = 0; i < usageLogs?.length - 2; i++) {
      let currentLog = usageLogs[i]
      let nextLog = usageLogs[i + 1]
      if(new Date(currentLog?.endDate) <= startDate && endDate <= new Date(nextLog?.startDate)) {
        return true
      }
    }
  } else if (usageLogs?.length === 2) {
    let currentLog = usageLogs[0]
    let nextLog = usageLogs[1]
    if(new Date(currentLog?.endDate) <= startDate && endDate <= new Date(nextLog?.startDate)) {
      return true
    }
  }  
  return false
}

function checkAssetItemAvailableWithCurrentScheduleOfOptional(startDate, endDate, optionAssetItem, currentScheduleOfOptional) {
  // Check xem trong khoảng thời gian startDate, endDate của task thì thằng optionAssetItem đã được gán ở currentScheduleOfOptional chưa
  // Còn việc check time của usageLogs thì đã check ở bước trước rồi
  // true: không bị
  if(!currentScheduleOfOptional || !currentScheduleOfOptional[optionAssetItem?._id] || !currentScheduleOfOptional[optionAssetItem?._id]?.length) {
    return true
  } else {
    let listUsages = currentScheduleOfOptional[optionAssetItem?._id]
    let findTimeUsageConflict = listUsages.find((item) => {
      let logStartDate = new Date(item?.startDate)
      let logEndDate = new Date(item?.endDate)
      if(!(endDate <= logStartDate || startDate >= logEndDate)) {
        return true
      } else {
        return false
      }
    })
    if (findTimeUsageConflict) {
      return false
    } else {
      return true
    }
  }
} 

function checkAvailableOptionAssetsIsOkForAssign(optionAssets, task, assignee, lastKPIs, currentScheduleOfOptional, unitTime, assetHasKPIWeight) {
  let key = `${assignee?._id}-${task?._id}`
  let kpiValue = lastKPIs.get(key)
  if (!kpiValue) {
    kpiValue = 1
  }
  let kpiValueWithAsset = kpiValue * (1 - assetHasKPIWeight) + 1 * assetHasKPIWeight

  // console.log("KPI: ", kpiValue, kpiValueWithAsset)
  if (!optionAssets || !optionAssets?.length) {
    return false
  }

  // check time
  for(let i = 0; i < optionAssets?.length; i++) {
    let optionAssetItem = optionAssets[i]
    let checkIsAvailableWithTime = checkAssetItemAvailableWithCurrentScheduleOfOptional(task?.startDate, task?.endDate, optionAssetItem, currentScheduleOfOptional)
    if (!checkIsAvailableWithTime) {
      return false
    }
  }

  // check cost
  let totalCostWithoutOptionalAsset = 0
  let totalCostWithOptionalAsset = 0
  const  {mainSalary } = assignee
  const { estimateNormalTime } = task
  // console.log("taskkkk: ", task.code, assignee.fullName, mainSalary)


  if(unitTime === 'days') {
    totalCostWithoutOptionalAsset += estimateNormalTime * mainSalary / (30 * kpiValue)
    totalCostWithOptionalAsset += estimateNormalTime * mainSalary / (30 * kpiValueWithAsset)
    for(let i = 0; i < optionAssets?.length; i++) {
      let costPerHour = optionAssets[i]?.costPerHour || 0
      totalCostWithOptionalAsset += costPerHour * estimateNormalTime * DAY_WORK_HOURS
    }
  } else {
    // unit time hours
    totalCostWithoutOptionalAsset += estimateNormalTime * mainSalary / (30 * kpiValue * DAY_WORK_HOURS)
    totalCostWithOptionalAsset += estimateNormalTime * mainSalary / (30 * kpiValueWithAsset * DAY_WORK_HOURS)

    for(let i = 0; i < optionAssets?.length; i++) {
      let costPerHour = optionAssets[i]?.costPerHour || 0
      totalCostWithOptionalAsset += costPerHour * estimateNormalTime
    }
  }
  // console.log("totalCostWithoutOptionalAsset: ", totalCostWithoutOptionalAsset)
  // console.log("totalCostWithOptionalAsset: ", totalCostWithOptionalAsset)
  // console.log("assignee: ", assignee.fullName)

  if (totalCostWithOptionalAsset > totalCostWithoutOptionalAsset) {
    return false
  }

  return true
}

function getAvailableAssetsForAssetOptional(task, currentAssets, currentScheduleOfOptional={}) {
  // console.log("task test: ", task.code)
  // console.log("task test 1: ", task.requireAsset)
  // console.log("currentAssets: ", currentAssets)
  let availableAssets = []
  if (task.requireAsset?.length == 0) {
    return []
  }

  // let availableTimes = [];
  // availableTimes.push(new Date(0))
  // console.log("currentTask: ", task.code)
  // console.log("currentAsset In use: ", assets.inUse.map((item) => item.assetName))
  // console.log("currentAsset ready to use: ", assets.readyToUse.map((item) => item.assetName))
  let taskRequireOptionalAsset = task?.requireAsset && task?.requireAsset?.length ? 
    task?.requireAsset.filter((item) => item.requireType === 'optional')
    : []

  if (taskRequireOptionalAsset?.length) {
    // console.log("vào đây")
    taskRequireOptionalAsset.forEach(require => {
      let readyToUse = currentAssets.readyToUse.filter(asset => isAssetCompatibleWithRequirement(asset, require)).sort((a, b) => a.costPerHour - b.costPerHour)
      if (readyToUse?.length >= require.number) {
        // availableTimes.push(new Date(0));
        for (let i = 0; i < require.number; i++) {
          availableAssets.push(readyToUse[i])
        }
      }
      else {
        // console.log("vào đây")
        availableAssets = [...readyToUse]
        const remain = require.number - readyToUse.length;
        let inUse = currentAssets.inUse.filter(asset => isAssetCompatibleWithRequirement(asset, require));
        // console.log("inUse: ", inUse)
        // console.log("startDate-endDate: ", task.startDate, task.endDate)
        inUse = inUse.filter((assetItem) => {
          return checkAssetOptionalIsAvailableForTask(assetItem, task, currentScheduleOfOptional)
        })
        // console.log("inUse: ", inUse)
        if (!inUse || !inUse?.length || !inUse?.length < remain) {
          return []
        } 
        if (inUse?.length >= remain) {
          inUse = inUse.sort((itemA, itemB) => itemA?.costPerHour - itemB.costPerHour)
          let inUseToPush = inUse.slice(0, remain)
          availableAssets.push(...inUseToPush)
        }
      }
    });
  } else {
    return []
  }
  return availableAssets
}

function getAvailableAssetsOptionalForTask(task, currentAssets) {
// Tìm các tài sản optional và rảnh rỗi trong khoảng thời gian của task
  let availableAssets = []
  if (task.requireAsset?.length == 0) {
    return []
  }
  
  let taskRequireOptionalAsset = task?.requireAsset && task?.requireAsset?.length ? 
    task?.requireAsset.filter((item) => item.requireType === 'optional')
    : []

  if (taskRequireOptionalAsset?.length) {
    taskRequireOptionalAsset.forEach(require => {
      let readyToUse = currentAssets.readyToUse.filter(asset => isAssetCompatibleWithRequirement(asset, require)).sort((a, b) => a.costPerHour - b.costPerHour)
      if (readyToUse?.length >= require.number) {
        // availableTimes.push(new Date(0));
        for (let i = 0; i < require.number; i++) {
          availableAssets.push(readyToUse[i])
        }
      }
      else {
        // console.log("vào đây")
        availableAssets = [...readyToUse]
        const remain = require.number - readyToUse.length;
        let inUse = currentAssets.inUse.filter(asset => isAssetCompatibleWithRequirement(asset, require));
        // console.log("startDate-endDate: ", task.startDate, task.endDate)
        inUse = inUse.filter((assetItem) => {
          // thỏa mãn nằm trong range task.startTime task.endTime
          let result = checkAssetOptionalIsAvailableForTask(assetItem, task, {})
          return result 
        })
        if (!inUse || !inUse?.length || !inUse?.length < remain) {
          return []
        } 
        if (inUse?.length >= remain) {
          inUse = inUse.sort((itemA, itemB) => itemA?.costPerHour - itemB.costPerHour)
          // OPTION TODO: có thể lấy hết
          let inUseToPush = inUse.slice(0, remain)
          availableAssets.push(...inUseToPush)
        }
      }
    });
  } else {
    return []
  }
  return availableAssets
}

function markAssetsAsUsed(currentAssets, taskAssets, startDate, endDate) {
  let updateInUse = currentAssets.inUse
  let updateReadyToUse = currentAssets.readyToUse
  
  for (let i = 0; i < taskAssets.length; i++) {
    let taskAsset = taskAssets[i]
    const currentStatus = taskAsset.status
    if (!taskAsset?.usageLogs) {
      taskAsset.usageLogs = []
    }
    taskAsset.usageLogs.push({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    })
    if (currentStatus === 'ready_to_use') {
      taskAsset.status = 'in_use'
      updateReadyToUse = updateReadyToUse.filter((item) => item._id !== taskAsset._id)
      updateInUse = updateInUse.filter((item) => item._id !== taskAsset._id)
      updateInUse.push({...taskAsset})
    } else {
      updateInUse = updateInUse.filter((item) => item._id !== taskAsset._id)
      updateInUse.push({...taskAsset})
    }
    

  }
  return {
    inUse: updateInUse,
    readyToUse: updateReadyToUse
  }
}

function scheduleTasksWithAssetAndEmpTasks(job, assets, allTasksOutOfProject) {
  const sortedTasks = job.tasks;
  // console.log("sortedTasks: ", sortedTasks)
  // job.startDate = new Date('2024-08-17T05:00:00.000Z')

  // JSON => date to string hết
  let currentAssets = JSON.parse(JSON.stringify(assets))
  for (const task of sortedTasks) {

    // console.log("currentAsset: ", currentAssets.inUse.length, currentAssets.readyToUse.length, "id task: ", task.id)
    const { taskAssets, availableTime } = getAvailableTimeForAssetOfTask(task, currentAssets);
    // console.log("task: ", task.code)
    // console.log("taskAssets: ", taskAssets)
    // Gán các tài nguyên đã chọn cho task
    task.assets = taskAssets;
    const numDay = Math.floor(task.estimateNormalTime);
    const remainHour = (task.estimateNormalTime - numDay) * DAY_WORK_HOURS;

    const preceedingTasks = task.preceedingTasks.map(item => job.tasks.find(t => t.code === item.link));
    // console.log("taskcode: ", task.code, preceedingTasks)
    if (preceedingTasks?.length > 0 ) {
      const maxEndTimeOfPreceedingTasks = preceedingTasks.reduce((maxEndTime, t) => Math.max(maxEndTime, t.endDate), 0);
      // console.log("maxEndTimeOfPreceedingTasks 1: ", (maxEndTimeOfPreceedingTasks))
      // Tìm thời gian bắt đầu cho nhiệm vụ sau khi tất cả các nhiệm vụ tiền điều kiện của nó đã hoàn thành và tài nguyên cần được sử dụng rảnh rỗi
      task.startDate = new Date(Math.max(availableTime, maxEndTimeOfPreceedingTasks));
      // console.log("task: ", task.code, task.startDate, task.endDate)

    } else {
      task.startDate = new Date(Math.max(job.startDate, availableTime));
    }
    // recalculate Time
    task.startDate = reCalculateTimeWorking(task.startDate)
    task.endDate = new Date(task.startDate.getTime() + numDay * 3600 * 1000 * 24 + remainHour * 3600 * 1000);
    task.endDate = reCalculateTimeWorking(task.endDate)


    // Xét ở đây
    // allTasksOutOfProject
    while (true) {
      const availableAssigneeWithTask = task.availableAssignee
      const maxLength = availableAssigneeWithTask?.length

      const availableAssignees = task.availableAssignee.filter(assignee => {
        return !allTasksOutOfProject.some(otherTask => {
          return (otherTask.assignee) == (assignee._id) &&
            !(task.endDate <= otherTask.startDate || task.startDate >= otherTask.endDate);
        });
      });

      if (availableAssignees?.length > 1 || (maxLength <= 3 && availableAssignees.length == maxLength) || (maxLength > 3 &&  availableAssignees?.length >= maxLength - 1) || availableAssignees?.length >= 4) {
        task.availableAssignee = availableAssignees;
        break;
      } else {
        task.startDate.setHours(task.startDate.getHours() + 1);
        task.endDate.setHours(task.endDate.getHours() + 1);
      }
    }
    task.startDate = reCalculateTimeWorking(task.startDate)
    task.endDate = new Date(task.startDate.getTime() + numDay * 3600 * 1000 * 24 + remainHour * 3600 * 1000);
    task.endDate = reCalculateTimeWorking(task.endDate)
    currentAssets = markAssetsAsUsed(currentAssets, taskAssets, task.startDate, task.endDate);
    // console.log("task 2: ", task.code, task.startDate, task.endDate)
    // console.log("currentAsset.ready: ", currentAssets.readyToUse.map((item) => item.assetName))
    // console.log("currentAsset.inUse: ", currentAssets.inUse.map((item) => item.assetName))
    
    // console.log("vao day")
    // Check o day
    if (task.startDate > task.LS || task.endTime > task.LF) {
      throw ['out_of_limit_time_for_task']
    }
  }

  return {
    tasks: sortedTasks,
    currentAssets: currentAssets
  };
}

// Lấy thêm cả asset optionals
function addOptionalAssetsAvailableForTasks(job, currentAssets) {
  let sortedTasks = job.tasks;
  // console.log("sortedTasks: ", sortedTasks)
  // job.startDate = new Date('2024-08-17T05:00:00.000Z')

  // JSON => date to string hết
  // let currentAssets = JSON.parse(JSON.stringify(assets))

  for(let i = 0; i < sortedTasks?.length; i++) {
    let task = sortedTasks[i]
    const requireOptionalAsset = task?.requireAsset.filter((item) => item.requireType === 'optional')
    // console.log("task.code: ", task.code, requireOptionalAsset)
    if(requireOptionalAsset && requireOptionalAsset?.length) {
      // let timeAvailableForAssetInTask = getAvailableTimeForAssetOptional() 
      let assetOptionals = getAvailableAssetsOptionalForTask(task, currentAssets)
      // console.log("assetOptionals: ", assetOptionals)
      task.availableAssetOptional = [...assetOptionals]
    }
  }

  return sortedTasks
}

function getTotalKpi(assignment, lastKPIs, assetHasKPIWeight) {
  // console.log("assignment: ", assignment)
  // console.log("lastKPIs: ", lastKPIs)
  // console.log("assetHasKPIWeight: ", assetHasKPIWeight)
  const kpiAssignment = {}
  // for (const kpi of kpiTarget) {
  //   kpiAssignment[key] = 0
  // }

  assignment.forEach((assignmentItem) => {
    const { task, assignee } = assignmentItem
    const { requireAsset } = task
    const IS_HAS_ASSET = requireAsset && requireAsset?.length > 0

    const { kpiInTask, taskKPIWeight } = task
    const taskId = task._id
    const assigneeId = assignee._id
    const key = `${assigneeId}-${taskId}`
    let kpiValue = Number(lastKPIs.get(key))
    // kpiValue = lastKPIs.find((item) => item.id === assigneeId)?.kpiInTask[taskId]
    // if (kpiValue === 0) {
    //   const kpiWithTaskInPast = lastKPIs.map((item) => item.kpiInTask[taskId]).filter((item) => item !== -1).sort((a, b) => a - b)
    //   kpiValue = kpiWithTaskInPast[0]
    // }
    if(!kpiValue) {
      const kpiOfEmpsWithTask = Array.from(lastKPIs).filter((item) => item[0].includes(task._id) && item[1] !== KPI_FAIL && item[1] !== KPI_NOT_WORK);
      // console.log("kpiOfEmpsWithTask: ", kpiOfEmpsWithTask)
      
      const sortedKpiOfEmpsWithTask = kpiOfEmpsWithTask.sort((a, b) => a[1] - b[1])
      if (sortedKpiOfEmpsWithTask?.length) {
        kpiValue = sortedKpiOfEmpsWithTask[0][1]
      } else {
        // Lấy random 
        kpiValue = 0
      }
    }

    if (kpiInTask) {
      if (!kpiAssignment.hasOwnProperty(kpiInTask)) {
        kpiAssignment[kpiInTask] = 0
      }
      if (IS_HAS_ASSET) {
        kpiAssignment[kpiInTask] += kpiValue * taskKPIWeight * (1 - assetHasKPIWeight) + 1 * taskKPIWeight * assetHasKPIWeight
      } else {
        kpiAssignment[kpiInTask] += kpiValue * taskKPIWeight
      }
    }
  })

  return kpiAssignment
}

function getTotalCost(assignment, lastKPIs, assetHasKPIWeight, unitTime) {
  let totalCost = 0
  for (let i = 0; i < assignment.length; i++) {
    const { task, assignee } = assignment[i]
    const { estimateNormalTime, assets } = task
    // console.log("assignee: ", assignee)
    const { mainSalary } = assignee
    
    // TODO: Tính cả cost theo KPI đạt được, ví dụ hiệu suất là 0.9 thì lấy cost / 0.9
    const IS_HAS_ASSET = assets?.length
    const key = `${assignee._id}-${task._id}`
    let kpiValue = lastKPIs.get(key)
    if (kpiValue === undefined)
      kpiValue = 0

    if(IS_HAS_ASSET) {
      kpiValue = kpiValue * (1 - assetHasKPIWeight) + 1 * assetHasKPIWeight
    }

    if (kpiValue) {
      if(unitTime === 'days') {
        totalCost += estimateNormalTime * mainSalary / (30 * kpiValue)
      } else {
        // hour
        totalCost += estimateNormalTime * mainSalary / (30 * DAY_WORK_HOURS * kpiValue)
      }
  
      for (let j = 0; j < assets?.length; j++) {
        totalCost += estimateNormalTime * DAY_WORK_HOURS * assets[j].costPerHour / kpiValue
      }
    } else {
      if(unitTime === 'days') {
        totalCost += estimateNormalTime * mainSalary / 30
      } else {
        // hour
        totalCost += estimateNormalTime * mainSalary / (30 * DAY_WORK_HOURS)
      }
  
      for (let j = 0; j < assets?.length; j++) {
        totalCost += estimateNormalTime * DAY_WORK_HOURS * assets[j].costPerHour
      }
    }
  }

  return totalCost
}

function getKpiOfEmployees(assignment, employees, lastKPIs, kpiTarget, assetHasKPIWeight) {
  const kpiOfEmployee = {}
  for(let i = 0; i < employees.length; i++) {
    kpiOfEmployee[employees[i]._id] = {}
    // kpiOfEmployee[employees[i].id]['total'] = 0
    for(const kpi of kpiTarget) {
      kpiOfEmployee[employees[i]._id][kpi.type] = 0
    }
  }
  for(let i = 0; i < assignment.length; i++) {
    const { task, assignee } = assignment[i]
    const { kpiInTask, requireAsset, taskKPIWeight } = task
    const assigneeId = assignee._id
    const taskId = task._id
    const IS_HAS_ASSET = requireAsset && requireAsset?.length > 0
    // console.log("kpiOfAssignee: ")
    let kpiValue = 0
    const key = `${assigneeId}-${taskId}`
    // console.log("kpivalue: ", lastKPIs.get(key))
    kpiValue = lastKPIs.get(key)
    if (!kpiValue) {
      const kpiOfEmpsWithTask = Array.from(lastKPIs).filter((item) => item[0].includes(task._id) && item[1] !== KPI_FAIL && item[1] !== KPI_NOT_WORK);
      // console.log("kpiOfEmpsWithTask: ", kpiOfEmpsWithTask)
      const sortedKpiOfEmpsWithTask = kpiOfEmpsWithTask.sort((a, b) => a[1] - b[1])
      if (sortedKpiOfEmpsWithTask?.length) {
        kpiValue = sortedKpiOfEmpsWithTask[0][1]
      } else {
        // Lấy random 
        kpiValue = 0
      }
    } 
    
    if (kpiInTask) {
      if (IS_HAS_ASSET) {
        kpiOfEmployee[assigneeId][kpiInTask] += kpiValue * taskKPIWeight * (1 - assetHasKPIWeight) + 1 * taskKPIWeight * assetHasKPIWeight
      } else {
        kpiOfEmployee[assigneeId][kpiInTask] += kpiValue * taskKPIWeight
      }
    }
  }
  return kpiOfEmployee
}

function getDistanceOfKPIEmployeesTarget(kpiOfEmployeesSolution, kpiOfEmployeesTarget, kpiTarget) {
  let sum = 0, sumPositive = 0, sumNegative = 0
  let edge1 = 0, edge2 = 0

  for (let employeeId in kpiOfEmployeesTarget) {
    for (const kpi of kpiTarget) {
      const weight = kpi.weight
      const type = kpi.type

      const detalValue = weight * (kpiOfEmployeesSolution[employeeId][type] - kpiOfEmployeesTarget[employeeId][type])
      sum += detalValue * detalValue
      edge1Value = weight * kpiOfEmployeesSolution[employeeId][type]
      edge2Value = weight * kpiOfEmployeesTarget[employeeId][type]

      edge1 += edge1Value * edge1Value
      edge2 += edge2Value * edge2Value
      if (detalValue > 0) {
        sumPositive += detalValue * detalValue
      } else {
        sumNegative += detalValue * detalValue
      }
    }
  }

  if (sumNegative === 0) {
    return 0
  }

  // let distance1 = Math.sqrt(sum) + Math.sqrt(sumPositive) - Math.sqrt(sumNegative)
  let distance2 = Math.sqrt(sum) - Math.sqrt(sumPositive) + Math.sqrt(sumNegative)
  let distance3 = Math.sqrt(sum)

  const distance = Math.min(distance2, distance3)

  return distance
}

function checkDuplicate(currentAssignment, employee, startDateCheck, endDateCheck) {
  let isDuplicate = false

  let currentAssignmentFilter = currentAssignment.filter((item) => item.assignee._id === employee._id)
  if (currentAssignmentFilter?.length) {
    for (let i = 0; i < currentAssignmentFilter.length; i++) {
      const { task } = currentAssignmentFilter[i]
      const { startDate, endDate } = task
      if (endDate <= startDateCheck || endDateCheck <= startDate) {
        continue
      } else {
        isDuplicate = true
        break
      }
    }
  } else {
    isDuplicate = false
  }

  return isDuplicate
}

// Function for DLHS
function initRandomHarmonyVector(tasks, employees, lastKPIs, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, unitTime = 'days') {
  const randomAssignment = []
  const empAssigned = []
  let falseAssigneeScore = 0, kpiAssignment = {}, totalCost = 0, falseDuplicate = 0
  let taskInDuplicate = []
  let currentScheduleOfOptional = {}

  for (let i = 0; i < tasks.length; i++) {
    let assignEmployee = {}
    const task = tasks[i]
    const { availableAssignee, assets, startDate, endDate } = task
    // console.log("availableAssignee, assets, startDate, endDate: ", availableAssignee, assets, startDate, endDate)

    let availableCheckDuplicate = availableAssignee.filter((employee) => !checkDuplicate(randomAssignment, employee, startDate, endDate))
    // console.log("task: ", task.code, "availableCheckDuplicate: ", availableCheckDuplicate)
    if (availableCheckDuplicate?.length) {
      assignEmployee = availableCheckDuplicate[Math.floor(Math.random() * availableCheckDuplicate.length)]
    } else {
      assignEmployee = availableAssignee[Math.floor(Math.random() * availableAssignee.length)]
      falseDuplicate++;
      taskInDuplicate.push(task._id)
    }

    let assignAssets = [...assets]

    // TODO: code for asset optional require

    const requireOptionalAsset = task.requireAsset.filter((item) => item.requireType === 'optional')
    if(requireOptionalAsset && requireOptionalAsset?.length) {
      const availableOptionalAssets = task?.availableAssetOptional
      // console.log("vào đây: ", task.code)
      let checkCanAssignOptionalAssets = checkAvailableOptionAssetsIsOkForAssign(availableOptionalAssets, task, assignEmployee, lastKPIs, currentScheduleOfOptional, unitTime, assetHasKPIWeight)
      // console.log("vào đây check: ", assignEmployee.fullName, assignEmployee.mainSalary, checkCanAssignOptionalAssets)
      if (checkCanAssignOptionalAssets) {
        assignAssets.push(...availableOptionalAssets)

        // mark optional assets time
        for(let i = 0; i < availableOptionalAssets?.length; i++) {
          let optionalAsset = availableOptionalAssets[i]
          if (!currentScheduleOfOptional[optionalAsset?._id]) {
            currentScheduleOfOptional[optionalAsset?._id] = []
          }
          currentScheduleOfOptional[optionalAsset?._id].push({
            startDate: task?.startDate,
            endDate: task?.endDate
          })
        }
        
      }
    }

    if (!empAssigned.includes(assignEmployee._id)) {
      empAssigned.push(assignEmployee._id)
    }

    
    randomAssignment.push({
      task,
      assignee: assignEmployee,
      assets: assignAssets
    })
  }
  falseAssigneeScore = employees.length - empAssigned.length
  // get total KPI
  kpiAssignment = getTotalKpi(randomAssignment, lastKPIs, assetHasKPIWeight)

  // get total cost
  totalCost = getTotalCost(randomAssignment, lastKPIs, assetHasKPIWeight, unitTime)

  
  // getKPI of Employees 
  const kpiOfEmployees = getKpiOfEmployees(randomAssignment, employees, lastKPIs, kpiTarget, assetHasKPIWeight)

  // function get distance

  const distanceWithKPIEmployeesTarget = getDistanceOfKPIEmployeesTarget(kpiOfEmployees, kpiOfEmployeesTarget, kpiTarget)

  const randomHarmonyVector = {
    // index,
    assignment: randomAssignment,
    falseAssigneeScore,
    totalCost,
    kpiAssignment,
    kpiOfEmployees,
    distanceWithKPIEmployeesTarget,
    falseDuplicate,
    taskInDuplicate,
    currentScheduleOfOptional
  }
  return randomHarmonyVector
}

function compareSolution(solutionA, solutionB, kpiTarget, kpiOfEmployeesTarget) {
  let checkNonKPIFlag = true
  for (const kpi of kpiTarget) {
    if (kpi?.targetKPIValue) {
      checkNonKPIFlag = false
    }
  }

  const kpiAssignmentOfA = solutionA.kpiAssignment
  const kpiAssignmentOfB = solutionB.kpiAssignment
  const falseAssigneeScoreA = solutionA.falseAssigneeScore
  const falseAssigneeScoreB = solutionB.falseAssigneeScore
  const kpiOfEmployeesA = solutionA.kpiOfEmployees
  const kpiOfEmployeesB = solutionB.kpiOfEmployees
 
  let totalKpiOfA = 0, totalKpiOfB = 0, totalKpiMissA = 0, totalKpiMissB = 0
  if (falseAssigneeScoreA === falseAssigneeScoreB) {
    if (!falseAssigneeScoreA) {
      // Nếu cả 2 đều gán oke => check KPI
      if (checkNonKPIFlag) {
        if (solutionA.falseDuplicate === solutionB.falseDuplicate) {
          if (solutionA.falseDuplicate === 0) {
            return solutionA.totalCost < solutionB.totalCost
          } else {
            return solutionA.falseDuplicate < solutionB.falseDuplicate
          }
        } else {
          return solutionA.falseDuplicate < solutionB.falseDuplicate
        }
      }

      let pointA = 0
      let pointB = 0
      let count = 0
      for (const kpi of kpiTarget) {
        const key = kpi?.type
        const weight = kpi?.weight
        const targetKPIValue = kpi?.targetKPIValue
        count++;
        totalKpiOfA += kpiAssignmentOfA[key] * weight
        totalKpiOfB += kpiAssignmentOfB[key] * weight
        if (kpiAssignmentOfA[key].toFixed(4) >= targetKPIValue && kpiAssignmentOfA[key] < 1.05 * targetKPIValue) {
          pointA++;
        } else {
          totalKpiMissA += targetKPIValue - kpiAssignmentOfA[key]
        }
        if (kpiAssignmentOfB[key].toFixed(4) >= targetKPIValue && kpiAssignmentOfB[key] < 1.05 * targetKPIValue) {
          pointB++;
        } else {
          totalKpiMissB += targetKPIValue - kpiAssignmentOfB[key]
        }
      }
      if (pointA === pointB) {
        const distanceA = solutionA.distanceWithKPIEmployeesTarget
        const distanceB = solutionB.distanceWithKPIEmployeesTarget
        // return distanceA <= distanceB

        // if (solutionA.falseDuplicate === solutionB.falseDuplicate) {
        //   return distanceA <= distanceB
        // } else {
        //   return solutionA.falseDuplicate < solutionB.falseDuplicate
        // }
        if (Math.abs(distanceA - distanceB) <= 0.001) {
          return solutionA.falseDuplicate < solutionB.falseDuplicate
        } else {
          return distanceA < distanceB
        }

        if (pointA === count) {
          // Nếu cả 2 đều đạt KPI target => xem xét đạt KPI target của từng đứa
          // return 
          const distanceA = solutionA.distanceWithKPIEmployeesTarget
          const distanceB = solutionB.distanceWithKPIEmployeesTarget

          if (solutionA.falseDuplicate === solutionB.falseDuplicate) {
            return distanceA <= distanceB
          } else {
            return solutionA.falseDuplicate < solutionB.falseDuplicate
          }


          let employeeTargetPointA = 0, employeeTargetPointB = 0
          for (let employeeId in kpiOfEmployeesTarget) {
            let flagA = true, flagB = true
            for (let kpiType in KPI_TYPES) {
              if (kpiOfEmployeesA[employeeId][kpiType] < kpiOfEmployeesTarget[employeeId][kpiType]) {
                flagA = false
              }
              if (kpiOfEmployeesB[employeeId][kpiType] < kpiOfEmployeesTarget[employeeId][kpiType]) {
                flagB = false
              }
            }
            if (flagA) 
              employeeTargetPointA++
            if (flagB)
              employeeTargetPointB++
          }
          return employeeTargetPointA >= employeeTargetPointB
        } else if (pointA) {
          // Nếu = point mà có tiêu chí không đạt xem xét về độ thọt KPI tương ứng của bọn không đủ
          return totalKpiMissA < totalKpiMissB
        } else {
          return totalKpiOfA > totalKpiOfB
        }
      } else {
        // Nếu 2 point khác nhau
        return pointA > pointB
      }
    } else {
      if (solutionA.totalCost < solutionB.totalCost) {
        return true
      } else {
        return totalKpiOfA > totalKpiOfB
      }
    }
  } else {
    return falseAssigneeScoreA < falseAssigneeScoreB
  }
}

function findBestAndWorstHarmonySolution(HM, kpiTarget, kpiOfEmployeesTarget) {
  HM.sort((solutionA, solutionB) => compareSolution(solutionA, solutionB, kpiTarget, kpiOfEmployeesTarget) ? -1 : 1)
  return {
    best: HM[0],
    worst: HM[HM.length - 1]
  }
}

function checkIsFitnessSolution(solution, kpiTarget, kpiOfEmployeesTarget) {
  const kpiAssignmentOfSolution = solution.kpiAssignment
  const kpiOfEmployees = solution.kpiOfEmployees
  
  for (const kpi of kpiTarget) {
    const targetKPIValue = kpi?.targetKPIValue
    const kpiType = kpi?.type
    if (kpiAssignmentOfSolution[kpiType] < targetKPIValue) {
      return false
    }
  }
  for (let employeeId in kpiOfEmployeesTarget) {
    for (const kpi of kpiTarget) {
      const kpiType = kpi?.type
      if (kpiOfEmployees[employeeId][kpiType] < kpiOfEmployeesTarget[employeeId][kpiType]) {
        return false
      }
    }
  }
  if (solution.distanceWithKPIEmployeesTarget >= 0.001)
    return false
  if (solution.falseDuplicate) {
    return false
  }

  return true
}

function updateHarmonyMemory(HM, improviseSolution) {
  HM.pop()
  HM.push(improviseSolution)
}

function initHM(HM, hmSize, tasks, employees, lastKPIs, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, unitTime) {
  for (let i = 0; i < hmSize; i++) {
    let randomSolution = initRandomHarmonyVector(tasks, employees, lastKPIs, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, unitTime)
    HM.push(randomSolution)
  }
}

function randomInRange(a, b) {
  // Tính toán phạm vi giữa a và b
  if (a > b) {
    const temp = a;
    a = b;
    b = temp;
  }
 
  const range = b - a;
  // Sinh số ngẫu nhiên trong phạm vi và trả về
  return Math.random() * range + a;
}

function initPSL(PSL, m) {
  for(let i = 0; i < m; i++) {
    let HMCR = randomInRange(0.9, 1)
    let PAR = randomInRange(0, 1)
    PSL.push({
      HMCR,
      PAR
    })
  }
}

function selectRandomFromPSL(PSL) {
  if (PSL?.length !== 0) {
    const randomIndex = Math.floor(Math.random() * PSL.length);
    const selected = PSL[randomIndex];
    PSL.splice(randomIndex, 1); // Xóa phần tử đã chọn khỏi mảng
    return selected;
  } else {
    const HMCR = randomInRange(0.9, 1)
    const PAR = randomInRange(0, 1)
    return {
      HMCR, PAR
    }
  }
}

function refillPSL(PSL, WPSL, lastPSL, PSLSize) {
  if(!WPSL?.length) {
    PSL = lastPSL
    return
  }
  for(let i = 0; i < PSLSize; i++) {
    const random = Math.random();
    if (random <= 0.75) {
      const { HMCR, PAR } = WPSL[Math.floor(Math.random() * WPSL.length)]
      PSL.push({
        HMCR, PAR
      })
    } else {
      const HMCR = randomInRange(0.9, 1);
      const PAR = randomInRange(0, 1);
      PSL.push({
        HMCR, PAR
      })
    }
  }
  WPSL = []
  return
}

function determineBW(BW_max, BW_min, FEs, Max_FEs) {
  if (FEs < Max_FEs / 2) {
    return BW_max - (BW_max - BW_min) * 2 * FEs / Max_FEs
  } else {
    return BW_min
  }
}

function divideHM(HM, numSubs) {
  const subHMs = [];
  const chunkSize = Math.ceil(HM.length / numSubs); // Kích thước của mỗi phần con

  for (let i = 0; i < HM.length; i += chunkSize) {
      const chunk = HM.slice(i, i + chunkSize); // Chia mảng chính thành các phần con
      subHMs.push(chunk); // Thêm phần con vào mảng subHMs
  }

  return subHMs;
}

function regroupSubHMs(subHMs, mSubs) {
  // console.log("RỂ")
  // Gộp các mảng con thành một mảng lớn
  let mergedArray = subHMs.reduce((acc, cur) => acc.concat(cur), []);

  // Xáo trộn mảng lớn bằng phương pháp xáo trộn mẫu (Fisher-Yates Shuffle)
  for (let i = mergedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mergedArray[i], mergedArray[j]] = [mergedArray[j], mergedArray[i]];
  }

  // Chia đều các phần tử vào các mảng con mới
  let newSubHMs = [];
  const subHMSize = Math.ceil(mergedArray.length / mSubs);
  for (let i = 0; i < mergedArray.length; i += subHMSize) {
    newSubHMs.push(mergedArray.slice(i, i + subHMSize));
  }

  return newSubHMs;
}


function newHMFromSubs(subHMs, kpiTarget, kpiOfEmployeesTarget) {
  let newHM = []
  for (let i = 0; i < subHMs?.length; i++) {
    let bestLocal = findBestAndWorstHarmonySolution(subHMs[i], kpiTarget, kpiOfEmployeesTarget).best
    newHM.push(bestLocal)
    subHMs[i].sort((solutionA, solutionB) => compareSolution(solutionA, solutionB, kpiTarget, kpiOfEmployeesTarget) ? -1 : 1)
    const SizeToPush = 5
    for (let j = 1; j < SizeToPush + 1; j++) {
      newHM.push(subHMs[i][j])
    }
  }
  return newHM
}


function DLHS(DLHS_Arguments, tasks, employees, lastKPIs, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, unitTime) {
  const { HMS, BW_max, BW_min, PSLSize, numOfSub, R, Max_FEs } = DLHS_Arguments
  let FEs = 0

  // Step 2: Initialize HM and PSL
  let PSL = []
  let HM = []
  let WPSL = []
  initHM(HM, HMS, tasks, employees, lastKPIs, kpiTarget, kpiOfEmployeesTarget, assetHasKPIWeight, unitTime)
  initPSL(PSL, PSLSize)

  let lastPSL = PSL
  let bestFitnessSolutions = []

  // Step 3: Main loop
  // Step 4: Randomly divide HM into m sub-HMs with the same size
  let subHMs = divideHM(HM, numOfSub)
  while (FEs < 0.9 * Max_FEs) {
    
    // Step 5: For each sub-HM
    for (let subHM of subHMs) {
      // console.log("FE: ", FEs)
      // Step 5.1: Select HMCR, PAR, and determine BW
      let { HMCR, PAR } = selectRandomFromPSL(PSL)
      let bw = determineBW(BW_max, BW_min, FEs, Max_FEs)
      // console.log("BW: ", bw)

      // Step 5.2: Improvise a new harmony vector
      const bestSolution = findBestAndWorstHarmonySolution(subHM, kpiTarget, kpiOfEmployeesTarget).best
      const worstSolution = findBestAndWorstHarmonySolution(subHM, kpiTarget, kpiOfEmployeesTarget).worst
      // console.log("best: ", bestSolution)
      // console.log("worst: ", worstSolution)
      let isFitnessSolution = checkIsFitnessSolution(bestSolution, kpiTarget, kpiOfEmployeesTarget) 
      // if (isFitnessSolution) {
        // console.log("vao day: ", isFitnessSolution)
      //   if (!isHaveSameSolution(bestFitnessSolutions, bestSolution, 0)) {
      //     bestFitnessSolutions.push(bestSolution)
      //   }
      // } 

      let improviseAssignment = []
      let empAssigned = []
      let falseAssigneeScore = 0, falseDuplicate = 0
      let taskInDuplicate = []
      let currentScheduleOfOptional = {}

      // let falseAssetScore = 0
      const bestSolutionAssignment = bestSolution.assignment
      tasks.forEach((task) => {
        const { availableAssignee, assets, startDate, endDate } = task
        let randomAssignee = availableAssignee[Math.floor(Math.random() * availableAssignee.length)]
        let availableCheckDuplicate = availableAssignee.filter((employee) => !checkDuplicate(improviseAssignment, employee, startDate, endDate))
        if (availableCheckDuplicate?.length) {
          randomAssignee = availableCheckDuplicate[Math.floor(Math.random() * availableCheckDuplicate.length)]
        } 
        if (Math.random() < HMCR) {
          randomAssignee = bestSolutionAssignment.find((item) => item.task._id === task._id).assignee
          if (Math.random() < PAR || !isFitnessSolution) {
            if (availableCheckDuplicate?.length) {
              let randomAssigneeIndex = availableAssignee.findIndex((item) => item._id === randomAssignee._id)
              randomAssigneeIndex = Math.floor(Math.random() * bw + randomAssigneeIndex) % availableCheckDuplicate.length
              randomAssignee = availableCheckDuplicate[randomAssigneeIndex]
            } else {
              let randomAssigneeIndex = availableAssignee.findIndex((item) => item._id === randomAssignee._id)
              randomAssigneeIndex = Math.floor(Math.random() * bw + randomAssigneeIndex) % availableAssignee.length
              randomAssignee = availableAssignee[randomAssigneeIndex]
            }
          }
        }
        if (checkDuplicate(improviseAssignment, randomAssignee, startDate, endDate)) {
          falseDuplicate++
          taskInDuplicate.push(task._id)
        }


        // Do for assets: TODO
        let assignedAssets = [...assets] || []
        const requireOptionalAsset = task?.requireAsset.filter((item) => item.requireType === 'optional')
        if(requireOptionalAsset && requireOptionalAsset?.length) {
          const availableOptionalAssets = task?.availableAssetOptional
          let checkCanAssignOptionalAssets = checkAvailableOptionAssetsIsOkForAssign(availableOptionalAssets, task, randomAssignee, lastKPIs, currentScheduleOfOptional, unitTime, assetHasKPIWeight)
          if (checkCanAssignOptionalAssets) {
            assignedAssets.push(...availableOptionalAssets)

            // mark optional assets time
            for(let i = 0; i < availableOptionalAssets?.length; i++) {
              let optionalAsset = availableOptionalAssets[i]
              if (!currentScheduleOfOptional[optionalAsset?._id]) {
                currentScheduleOfOptional[optionalAsset?._id] = []
              }
              currentScheduleOfOptional[optionalAsset?._id].push({
                startDate: task?.startDate,
                endDate: task?.endDate
              })
            }
            
          }
        }

        if (!empAssigned.includes(randomAssignee._id)) {
          empAssigned.push(randomAssignee._id)
        }
        
        improviseAssignment.push({
          task,
          assignee: randomAssignee,
          assets: [...assignedAssets]
        })
      })

      // total False
      falseAssigneeScore = employees.length - empAssigned.length
      // total False assets: TODO

      // get total KPI
      const kpiAssignment = getTotalKpi(improviseAssignment, lastKPIs, assetHasKPIWeight)

      // get total Cost
      const totalCost = getTotalCost(improviseAssignment, lastKPIs, assetHasKPIWeight, unitTime)

      // getKPI of Employees 
      const kpiOfEmployees = getKpiOfEmployees(improviseAssignment, employees, lastKPIs, kpiTarget, assetHasKPIWeight)

      //  get distance
      const distanceWithKPIEmployeesTarget = getDistanceOfKPIEmployeesTarget(kpiOfEmployees, kpiOfEmployeesTarget, kpiTarget)

      const improviseSolution = {
        assignment: improviseAssignment,
        falseAssigneeScore,
        totalCost,
        kpiAssignment,
        kpiOfEmployees,
        distanceWithKPIEmployeesTarget,
        falseDuplicate,
        taskInDuplicate,
        currentScheduleOfOptional
      }

      FEs++;

      // Step 5.3: Update sub-HM and record HMCR and PAR into WPSL if X_new is better than X_w
      // console.log("worstSolution: ", worstSolution.kpiAssignment)
      const checkIsImproviseSolution = compareSolution(improviseSolution, worstSolution, kpiTarget, kpiOfEmployeesTarget) 
      if (checkIsImproviseSolution) {
        updateHarmonyMemory(subHM, improviseSolution)
        
        // record to WPLS
        WPSL.push({
          HMCR, PAR
        })
      }


      // Step 5.4: Refill PSL if empty
      if (PSL?.length === 0) {
        refillPSL(PSL, WPSL, lastPSL, PSLSize);
        // console.log("PSL: ", PSL)
      }
    
      // Step 6: Check termination conditions
      if (FEs !== 0 && FEs % R === 0) {
        // console.log("vao day")
        // console.log("subHMs L: ", subHMs[0].length)
        subHMs = regroupSubHMs(subHMs, numOfSub);
        // console.log("subHMs L: ", subHMs[0].length)
      }
    }

  }

  // Step 7: 
  let newHM = newHMFromSubs(subHMs, kpiTarget, kpiOfEmployeesTarget)
  while (FEs < Max_FEs) {
    let { HMCR, PAR } = selectRandomFromPSL(PSL)
    let bw = determineBW(BW_max, BW_min, FEs, Max_FEs)

    const bestSolution = findBestAndWorstHarmonySolution(newHM, kpiTarget, kpiOfEmployeesTarget).best
    const worstSolution = findBestAndWorstHarmonySolution(newHM, kpiTarget, kpiOfEmployeesTarget).worst
    let isFitnessSolution = checkIsFitnessSolution(bestSolution, kpiTarget, kpiOfEmployeesTarget) 
    // if (isFitnessSolution) {
    //   if (!isHaveSameSolution(bestFitnessSolutions, bestSolution, 0)) {
    //     bestFitnessSolutions.push(bestSolution)
    //   }
    // } 

    let improviseAssignment = []
    let empAssigned = []
    let falseAssigneeScore = 0
    let falseAssetScore = 0, falseDuplicate = 0
    let taskInDuplicate = []
    let currentScheduleOfOptional = {}

    const bestSolutionAssignment = bestSolution.assignment
    tasks.forEach((task) => {
      let randomAssignee = {}
      const { availableAssignee, assets } = task
      const { startDate, endDate } = task 

      let availableCheckDuplicate = availableAssignee.filter((employee) => !checkDuplicate(improviseAssignment, employee, startDate, endDate))
      if (availableCheckDuplicate?.length) {
        randomAssignee = availableCheckDuplicate[Math.floor(Math.random() * availableCheckDuplicate.length)]
      } else {
        randomAssignee = availableAssignee[Math.floor(Math.random() * availableAssignee.length)]
      }

      if (Math.random() < HMCR) {
        randomAssignee = bestSolutionAssignment.find((item) => item.task._id === task._id).assignee

        if (Math.random() < PAR || !isFitnessSolution) {
          if (availableCheckDuplicate?.length) {
            let randomAssigneeIndex = availableAssignee.findIndex((item) => item._id === randomAssignee._id)
            randomAssigneeIndex = Math.floor(Math.random() * bw + randomAssigneeIndex) % availableCheckDuplicate.length
            randomAssignee = availableCheckDuplicate[randomAssigneeIndex]
          } else {
            let randomAssigneeIndex = availableAssignee.findIndex((item) => item._id === randomAssignee._id)
            randomAssigneeIndex = Math.floor(Math.random() * bw + randomAssigneeIndex) % availableAssignee.length
            randomAssignee = availableAssignee[randomAssigneeIndex]
          }
        }
      }
      if (checkDuplicate(improviseAssignment, randomAssignee, startDate, endDate)) {
        falseDuplicate++
        taskInDuplicate.push(task._id)
      }

      // Do for assets: TODO
      let assignedAssets = [...assets] || []
      const requireOptionalAsset = task?.requireAsset.filter((item) => item.requireType === 'optional')
      if(requireOptionalAsset && requireOptionalAsset?.length) {
        const availableOptionalAssets = task?.availableAssetOptional
        let checkCanAssignOptionalAssets = checkAvailableOptionAssetsIsOkForAssign(availableOptionalAssets, task, randomAssignee, lastKPIs, currentScheduleOfOptional, unitTime, assetHasKPIWeight)
        if (checkCanAssignOptionalAssets) {
          assignedAssets.push(...availableOptionalAssets)

          // mark optional assets time
          for(let i = 0; i < availableOptionalAssets?.length; i++) {
            let optionalAsset = availableOptionalAssets[i]
            if (!currentScheduleOfOptional[optionalAsset?._id]) {
              currentScheduleOfOptional[optionalAsset?._id] = []
            }
            currentScheduleOfOptional[optionalAsset?._id].push({
              startDate: task?.startDate,
              endDate: task?.endDate
            })
          }
        }
      }


      if (!empAssigned.includes(randomAssignee._id)) {
        empAssigned.push(randomAssignee._id)
      }
      
      improviseAssignment.push({
        task,
        assignee: randomAssignee,
        assets: [...assignedAssets]
      })
    })

    // total False
    falseAssigneeScore = employees.length - empAssigned.length
    // total False assets: TODO

    // get total KPI
    const kpiAssignment = getTotalKpi(improviseAssignment, lastKPIs, assetHasKPIWeight)

    // get total Cost
    const totalCost = getTotalCost(improviseAssignment, lastKPIs, assetHasKPIWeight, unitTime)

    // getKPI of Employees 
    const kpiOfEmployees = getKpiOfEmployees(improviseAssignment, employees, lastKPIs, kpiTarget, assetHasKPIWeight)

    //  get distance
    const distanceWithKPIEmployeesTarget = getDistanceOfKPIEmployeesTarget(kpiOfEmployees, kpiOfEmployeesTarget, kpiTarget)

    const improviseSolution = {
      assignment: improviseAssignment,
      // falseAssetScore, TODO
      falseAssigneeScore,
      totalCost,
      kpiAssignment,
      kpiOfEmployees,
      distanceWithKPIEmployeesTarget,
      falseDuplicate,
      taskInDuplicate,
      currentScheduleOfOptional
    }

    // console.log("improveSolution: ", improviseSolution.kpiAssignment)
    // console.log("worst: ", worstSolution.kpiAssignment)

    const checkIsImproviseSolution = compareSolution(improviseSolution, worstSolution, kpiTarget, kpiOfEmployeesTarget) 
    if (checkIsImproviseSolution) {
      updateHarmonyMemory(newHM, improviseSolution)
    }
    FEs++;
    // Step 5.4: Refill PSL if empty
    if (PSL.length === 0) {
      refillPSL(PSL, WPSL, lastPSL, PSLSize);
    }
  }
  return newHM[0]
}

function getLastestEndDate(assignment) {
  let endDate = new Date(0)
  for (let i = 0; i < assignment.length; i++) {
    const task = assignment[i].task
    const taskEndTime = new Date(task.endDate)
    if (endDate < taskEndTime) {
      endDate = taskEndTime
    }
  }
  return endDate
}

function reScheduleTasks(solution, assets, allTasksOutOfProject, projectEndTime, unitTime = 'days') {
  // Làm việc với 1 assignmentTemp
  const assignment = solution.assignment
  for (let i = 0; i < assignment.length; i++) {
    const { task } = assignment[i]
    const { startDate, endDate } = task
    task.startDateTmp = new Date(startDate)
    task.endDateTmp = new Date(endDate)
  }
  assignment.sort((itemA, itemB) => new Date(itemA.task.endDate) - new Date(itemB.task.endDate))
  assignment.forEach(({ task }) => {
    task.startDate = new Date(task.startDate)
    task.endDate = new Date(task.endDate)
  })
  // Test
  // assignment[0].task.startDate.setDate(assignment[0].task.startDate.getDate())
  // console.log("assignment: ", assignment[0].task.startDate)
  // console.log("assignment: ", assignment[0].task.startDateTmp)
  const endDateSaves = {}
  const assetAssignments = {};

  assignment.forEach((assignmentItem) => {
    let task = assignmentItem?.task
    let assignee = assignmentItem?.assignee
    let assignmentAssets = assignmentItem?.assets

    let startDate = task.startDate
    // const numDay = Math.floor(task.estimateNormalTime);
    // const remainHour = (task.estimateNormalTime - numDay) * DAY_WORK_HOURS;
    
    const preceedingTasks = task.preceedingTasks.map(preItem => assignment.find((item) => item.task.code === preItem.link).task)
    const timeAvailableForAsset = getAvailableTimeForAssetOfTask(task, assets).availableTime
    task.startDate = new Date(Math.max(startDate, timeAvailableForAsset));
    if (preceedingTasks?.length > 0) {
      const maxEndTimeOfPreceedingTasks = preceedingTasks.reduce((maxEndTime, t) => Math.max(maxEndTime, t.endDate), 0);
      task.startDate = new Date(Math.max(startDate, maxEndTimeOfPreceedingTasks));
    }
    if (assignee._id in endDateSaves && endDateSaves[assignee._id].getTime() > task.startDate.getTime()) {
      // Nếu có xung đột, cập nhật thời gian bắt đầu của task
      task.startDate = endDateSaves[assignee._id]
    }
    console.log("giữa hàm 1: ", task.code, task.startDate)
    // Kiểm tra xung đột với tài nguyên
    if (assignmentAssets && assignmentAssets?.length) {
      let assetConflict = false;
      assignmentAssets.forEach(asset => {
        if (asset._id in assetAssignments && assetAssignments[asset._id].getTime() > task.startDate.getTime()) {
          assetConflict = true;
          // Nếu có xung đột với tài nguyên, cập nhật thời gian bắt đầu của task
          task.startDate = assetAssignments[asset._id];
        }
      });

      // ReCalculate Time
      task.startDate = reCalculateTimeWorking(task.startDate)
      // Nếu có xung đột với tài nguyên, xem xét lại thời gian kết thúc của task
      if (assetConflict) {
        task.endDate = calculateEndDateFromStartDate(task.startDate, task?.estimateNormalTime, unitTime);
      }
    }

    // check thêm cả điều kiện về thời gian của thằng nhân viên
    while (true) {
      const isAvailable = !allTasksOutOfProject.some(otherTask => {
        return otherTask.assignee == assignee._id &&
          !(task.endDate <= otherTask.startDate || task.startDate >= otherTask.endDate);
      })

      if (isAvailable) {
        break;
      } else {
        task.startDate.setHours(task.startDate.getHours() + 1);
        task.endDate.setHours(task.endDate.getHours() + 1);
      }
    }


    task.startDate = reCalculateTimeWorking(task.startDate)
    if (task?.LS && task?.LF && (task?.startDate > task?.LS || task?.endTime > task?.LF)) {
      console.log("Điều chỉnh lịch nhưng không được vì vượt quá thời gian cho phép, những task bị trùng sẽ cần được ủy quyền")
      assignment.forEach(({ task }) => {
        task.startDate = new Date(task.startDateTmp)
        task.endDate = new Date(task.endDateTmp)
      })
      solution.assignment = assignment
      solution = {
        ...solution,
        isReScheduleOk: false
      }
      return solution
    }
    // ReCalculate Time
    task.endDate = calculateEndDateFromStartDate(task.startDate, task?.estimateNormalTime, unitTime);
    task.endDate = reCalculateTimeWorking(task.endDate)
    endDateSaves[assignee._id] = task.endDate;


    // Cập nhật lại thông tin về tài nguyên được gán
    if (assignmentAssets && assignmentAssets?.length) {
      assignmentAssets.forEach(asset => {
        assetAssignments[asset._id] = task.endDate;
      });
    }

  })

  let endDateTmp = getLastestEndDate(assignment)
  // console.log("endDateTmp: ", endDateTmp)
  
 
  if (endDateTmp > projectEndTime) {
    console.log("Điều chỉnh lịch nhưng không được vì vượt quá thời gian cho phép, những task bị trùng sẽ cần được ủy quyền")
    assignment.forEach(({ task }) => {
      task.startDate = new Date(task.startDateTmp)
      task.endDate = new Date(task.endDateTmp)
    })
    solution.assignment = assignment
    solution = {
      ...solution,
      isReScheduleOk: false
    }
  } 
  return solution
}

module.exports = {
  topologicalSort,
  scheduleTasksWithAssetAndEmpTasks,
  addOptionalAssetsAvailableForTasks,
  getAvailableTimeForAssetOfTask,
  initRandomHarmonyVector,
  DLHS,
  reScheduleTasks
}
