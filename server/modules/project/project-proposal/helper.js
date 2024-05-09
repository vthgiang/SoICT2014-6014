const { DAY_WORK_HOURS } = require("./constants");

function getVectorLength(vector) {
  let length = 0;
  for (const key in vector) {
    length += vector[key] * vector[key]
  }
  return Math.sqrt(length)
}
function getDistanceQualityVector(vector1, vector2) {
  if (vector1 === undefined) {
    vector1 = {}
  }
  if (vector2 === undefined) {
    vector2 = {}
  }
  // Tạo một mảng mới để lưu trữ các key của cả hai vector
  const allKeys = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);

  let distance = 0;

  for (const key of allKeys) {
    const value1 = vector1[key] || 0;
    const value2 = vector2[key] || 0;
    const diff = value1 - value2

    const squaredDifference = diff * diff;

    distance += squaredDifference;
  }

  return Math.sqrt(distance);
}

function findEmployeesWithCapacities(employees, requiredQualities) {
  const employeesWithRequiredQualities = employees.filter(employee => {
    const qualities = employee.capacities;
    for (let key in requiredQualities) {
      if (!qualities[key] || qualities[key] < requiredQualities[key]) {
        return false;
      }
    }
    return true;
  });
  return employeesWithRequiredQualities;
}

function findTasksWithMatchingTagsAndRequire(allTasks, task) {
  // Lọc mảng allTasks để tìm các task có tags bao gồm tags của task đầu vào
  // console.log("allTasks: ", allTasks)
  const { requireAssignee } = task
  const taskKeys = Object.keys(requireAssignee !== undefined ? requireAssignee : {}).sort()
  
  return allTasks.filter((currentTask) => {

    const requireAssignOfCurrentTask = currentTask?.requireAssignee
    // console.log("requireAssignOfCurrentTask: ", requireAssignOfCurrentTask)
    // Kiểm tra tags
    if (!requireAssignOfCurrentTask || !Object.keys(requireAssignOfCurrentTask)?.length) {
      return false
    }
    // console.log("task: ", task)
    // console.log("currentTask: ", currentTask)
    
    if (!task.tags.every((tag) => currentTask.tags.includes(tag)) || !currentTask.tags.every((tag) => task.tags.includes(tag))) {
      return false;
    }
    const taskKeysItem = Object.keys(requireAssignOfCurrentTask).sort()

    if (Math.abs(taskKeys?.length - taskKeysItem?.length) > 1) {
      return false
    }

    if (taskKeys?.length >= taskKeysItem?.length) {
      for (const key of taskKeysItem) {
        if (!taskKeys.includes(key)) {
          return false
        }
      }
    } else {
      for (const key of taskKeys) {
        if (!taskKeysItem.includes(key)) {
          return false
        }
      }
    }

    // Kiểm tra requireAssign
    // for (const key in requireAssign) {
    //   if (requireAssignOfCurrentTask[key] === undefined || requireAssignOfCurrentTask[key] === 0) {
    //     return false;
    //   }
    // }

    return true;
  });
}

function getLastKPIAndAvailableEmpsInTasks(tasks, allTasksInPast, employees) {
  const lastKPIsOfEmps = []
  
  if (!allTasksInPast?.length || !allTasksInPast) {
    employees.forEach((employee) => {
      const id = employee.id
      let kpiInTask = []
      tasks.forEach(() => {
        kpiInTask.push(1)
      })
      kpiInTask.push(1)
      lastKPIsOfEmps.push({
        id,
        kpiInTask: kpiInTask
      })
    })
    tasks.forEach((task) => {
      const { requireAssign } = task
      task.availableAssignee = findEmployeesWithCapacities(employees, requireAssign)
    })
    return lastKPIsOfEmps
  } else {
    employees.forEach((employee) => {
      const id = employee.id
      let kpiInTask = []
      tasks.forEach(() => {
        kpiInTask.push(0)
      })
      kpiInTask.push(0)
      lastKPIsOfEmps.push({
        id,
        kpiInTask: kpiInTask
      })
    })
  }
  lastKPIsOfEmps.sort((a, b) => a.id - b.id)
  // console.log("lastKPI: ", lastKPIsOfEmps)
  tasks.forEach((task) => {
    const { requireAssign } = task
    // console.log("requireAssign: ", requireAssign)
    let availableAssignee = employees
    
    if (requireAssign === undefined || !Object.keys(requireAssign)?.length) {
      employees.map((employee) => {
        const employeeId = employee.id
        let kpiValue = 0
        // Nếu không yêu cầu năng lực => lấy năng lực thực hiện task tốt nhất từ trước giờ của nó
        taskOfEmps = allTasksInPast.filter((item) => item.assignee.id === employeeId).sort((a, b) => b.evaluatePoint - a.evaluatePoint)
        // console.log("taskOfEmp: ", taskOfEmps)
        kpiValue = taskOfEmps[0].evaluatePoint
        kpiInTaskWithEmp = lastKPIsOfEmps.find((item) => item.id === employee.id)

        kpiInTaskWithEmp[task.id] = kpiValue
      })
    } else {
      const listTasksMatching = findTasksWithMatchingTagsAndRequire(allTasksInPast, task)

      availableAssignee = findEmployeesWithCapacities(employees, requireAssign)
      // console.log("Avai 1: ", availableAssignee.map((item) => item.id))
      const vectorLengthAssigneeCurrentTask = getVectorLength(requireAssign)
  
      if (!availableAssignee || !availableAssignee?.length) {
        throw Error("Tồn tại công việc không có ai có khả năng làm dược")
      }
      availableAssignee.forEach((employee) => {
        let listTasksMatchingWithEmp = listTasksMatching.filter((item) => item.assignee.id === employee.id)
        if (listTasksMatchingWithEmp && listTasksMatchingWithEmp?.length > 0) {
          listTasksMatchingWithEmp = listTasksMatchingWithEmp.sort((a, b) => {
            const distanceA = getDistanceQualityVector(a.requireAssign, requireAssign);
            const distanceB = getDistanceQualityVector(b.requireAssign, requireAssign);
  
            // So sánh khoảng cách
            if (distanceA !== distanceB) {
              return distanceA - distanceB;
            }
  
            // Nếu khoảng cách bằng nhau, so sánh theo thuộc tính khác
            return a.evaluatePoint - b.evaluatePoint;
          });
  
          let kpiValue = 0

          // console.log("task: ", task.id, "emp: ", employee.id, "listTaskMachingWithEmps", listTasksMatchingWithEmp.map((item) => item.id))
          const taskFail = listTasksMatchingWithEmp.find((item) =>         
            item.evaluatePoint === -1 && getVectorLength(item.requireAssign) <= getVectorLength(task.requireAssign)
          )
          kpiInTaskWithEmp = lastKPIsOfEmps.find((item) => item.id === employee.id)
  
          if (taskFail) {
            kpiInTaskWithEmp.kpiInTask[task.id] = -1
          } else {
            let kpiValueFromTaskInPast = listTasksMatchingWithEmp[0].evaluatePoint
            const vectorLengthAssigneePastTask = getVectorLength(listTasksMatchingWithEmp[0].requireAssign)
            if (vectorLengthAssigneeCurrentTask <= vectorLengthAssigneePastTask) {
              kpiValue = kpiValueFromTaskInPast
            } else {
              kpiValue = kpiValueFromTaskInPast * Math.sqrt(vectorLengthAssigneePastTask / vectorLengthAssigneeCurrentTask)
            }
            kpiInTaskWithEmp.kpiInTask[task.id] = kpiValue

            //
          }
          // console.log("task: ", task.id, "- emp: ", employee.id, "- kpi: ", kpiValue)
        }
      })
      
    }


    let updateAvailableAssignee = availableAssignee.filter((employee) => {
      const employeeId = employee.id
      const lastKPIOfEmp = lastKPIsOfEmps.find((item) => item.id === employeeId)
      // kiểm tra mấy thằng bị KPI gán = -1
      if (lastKPIOfEmp.kpiInTask[task.id] === KPI_CANNOT_WORK) {
        return false
      } else {
        return true
      }
    })
    task.availableAssignee = updateAvailableAssignee
    // console.log("task: ", task.id, "Avai 2: ", task.availableAssignee.map((item) => item.id))

  })


  tasks.forEach((task) => {
    const { availableAssignee, id } = task

    availableAssignee.map((employee) => {
      const employeeId = employee.id
      let kpiOfEmployeeInTask = lastKPIsOfEmps.find((item) => item.id === employeeId)
      let kpiValue = kpiOfEmployeeInTask.kpiInTask[id]
      if (kpiValue === 0) {
        let kpiOfOthersEmployeeInTask = lastKPIsOfEmps.map((item) => item.kpiInTask[id]).filter((item) => item !== KPI_CANNOT_WORK && item !== KPI_NOT_VALUE).sort((a, b) => a - b)
        if (kpiOfOthersEmployeeInTask?.length) {
          kpiValue = kpiOfOthersEmployeeInTask[0]
        } else {
          kpiValue = 0.7 + Math.random() * (1 - 0.7)
        }
        kpiOfEmployeeInTask.kpiInTask[id] = kpiValue
      }
    })
    // console.log("task: ", id, "emp: ",availableAssignee.map((item) => item.id).join(", "), lastKPIsOfEmps.map((item) => item.kpiInTask[id]))

  })
  return lastKPIsOfEmps
}

function reCalculateTimeWorking(time) {
  // console.log("time: ", time)
  // Đưa về giờ làm chuẩn
  if (time.getHours() >= 17) { // giờ >=17 chuyển sang ngày hôm sau
    time.setDate(time.getDate() + 1);
    time.setHours(8 + time.getHours() - 17)
  } else if (time.getHours() < 13 && time.getHours() > 12) {
    time.setHours(time.getHours() + 1)
  } else if (time.getHours() < 8) {
    time.setHours(8)
  };

  while (time.getDay() % 6 == 0 || time.getDay() % 7 == 0) { // Không làm T7, chủ nhật
    time.setDate(time.getDate() + 1);
  }

  // console.log("return time: ", time)

  return time;
}

function calculateStartDateFromEndDate(endDate, duration, unitTime = 'days') {
  if (unitTime === 'days') {
    let numDay = Math.floor(duration)
    let remainHour = (duration - numDay) * DAY_WORK_HOURS
    let startDate = new Date(endDate).getTime() - (remainHour * 3600 * 1000 + numDay * 24 * 3600 * 1000)
    return new Date(startDate)
  } else {
    // unitTime = hours
    let startDate = new Date(endDate).getTime() - duration * 3600 * 1000
    return new Date(startDate)
  }
}

function calculateEndDateFromStartDate(startDate, duration, unitTime = 'days') {
  // console.log("startDate, duration, unitTIme: ", startDate, duration, unitTime)
  if (unitTime === 'days') {
    let numDay = Math.floor(duration)
    let remainHour = (duration - numDay) * DAY_WORK_HOURS
    let endDate = new Date(startDate).getTime() + (remainHour * 3600 * 1000 + numDay * 24 * 3600 * 1000)
    return new Date(endDate)
  } else {
    let endDate = new Date(startDate).getTime() + duration * 3600 * 1000
    return new Date(endDate)
  }
}


const calculateCPM = (tasks, projectStartTime, projectEndTime, unitTime) => {
  if (!tasks || !tasks?.length) {
    return []
  }
  let updateTasks = [...tasks]
  // console.log("updateTasks: ", updateTasks.map((item) => item.code))


  //
  let successors = {
    // key: code of task
    // value: [] array list tasks v that v has key is one of preceedingTasks 
  }

  for(let i = 0; i < updateTasks?.length; i++) {
    let task = updateTasks[i]
    task.ES = new Date(0)
    task.EF = new Date(0)
    task.LS = new Date("2100-04-30T00:00:00Z")
    task.LF = Date("2100-04-30T00:00:00Z")
    if (!successors[task?.code]) {
      successors[task.code] = []
    }
    let preceedingTasks = task?.preceedingTasks
    if (preceedingTasks && preceedingTasks?.length > 0) {
      preceedingTasks.forEach((item) => {
        let taskCode = item.link

        // taskCode is prev of this task => this taskCode has successor is this task.code

        if (!successors[taskCode]) {
          successors[taskCode] = []
        }
        successors[taskCode].push(task.code)
      })
      // console.log("task.code: ", task.code, "pre: ", preceedingTasks.map((item) => item.link))
    }
  }

  for(let i = 0; i < updateTasks?.length; i++) {
    let task = updateTasks[i]
    let preceedingTasks = task?.preceedingTasks && task?.preceedingTasks?.length ? 
      task?.preceedingTasks.map((item) => updateTasks?.find((taskItem) => taskItem?.code === item?.link))
      : []
    // console.log("pre: ", task.code, preceedingTasks)
    if (!preceedingTasks || !preceedingTasks?.length) {
      task.ES = new Date(projectStartTime)
    } else {
      task.ES = new Date(Math.max(...preceedingTasks.map((item) => item.EF)))
    }
    task.ES = reCalculateTimeWorking(task.ES)
    task.EF = calculateEndDateFromStartDate(task.ES, task?.estimateNormalTime, unitTime)
    task.EF = reCalculateTimeWorking(task.EF)
  }

  updateTasks = updateTasks.reverse()
  // console.log("updateTasks: ", updateTasks.map((item) => item.code))
  for(let i = 0; i < updateTasks?.length; i++) {
    let task = updateTasks[i]
    // let preceedingTasks = task?.preceedingTasks && task?.preceedingTasks?.length ? 
    //   task?.preceedingTasks.map((item) => updateTasks?.find((taskItem) => taskItem?.code === item?.link))
    //   : []
    // console.log("pre: ", task.code, preceedingTasks)
    let successorTasks = successors[task.code] && successors[task.code]?.length > 0 ? 
      successors[task.code].map((item) => updateTasks.find((task) => task.code === item)) : []
    
    if (!successorTasks || !successorTasks?.length) {
      task.LF = new Date(projectEndTime)
    } else {
      task.LF = new Date(Math.min(...successorTasks.map((item) => item.LS)))
    }
    task.LS = calculateStartDateFromEndDate(task.LF, task?.estimateNormalTime, unitTime)
  }
  return updateTasks.reverse()
}

function checkHasAvailableSolution(tasks, projectStartTime, projectEndTime, tasksOutOfProject = []) {
  let parallelTaskFlows = {}
  let result = {
    isHasAvailableSolution: true,
    error_code: ''
  }
  let maxEF = new Date(Math.max(...tasks.map((item) => item.EF)))
  let minLS = new Date(Math.min(...tasks.map((item) => item.LS)))

  if (maxEF > projectEndTime || minLS < projectStartTime) {
    result = {
      isHasAvailableSolution: false,
      error_code: 'out_of_time'
    }
  }

  for(let i = 0; i < tasks?.length; i++) {
    let task = tasks[i]
    if(!parallelTaskFlows[task.code]) {
      parallelTaskFlows[task.code] = {
        ES: task.ES,
        LF: task.LF,
        parallelTasks: []
      }
    }

    let currentEF = task?.EF
    let currentLS = task?.LS
    let parallelTasks = tasks.filter((taskItem) => {
      const { ES, EF, LS, LF } = taskItem
      if ((currentEF > LS || EF > currentLS) && taskItem.code !== task.code) {
        return true
      } else {
        return false
      }
    })
    if(parallelTasks && parallelTasks?.length) {
      let parallelTasksWithCurrentTask = [...parallelTasks, task]
      parallelTaskFlows[task.code].parallelTasks = parallelTasksWithCurrentTask
    }
  }

  // console.log("parallelTaskFlows: ", parallelTaskFlows)


  for(let taskCode in parallelTaskFlows) {
    // console.log("taskcode: ", taskCode)
    const { ES, LF, parallelTasks } = parallelTaskFlows[taskCode]
    // console.log("taskcode: ", taskCode, parallelTasks.map((item) => item.code))
    if (parallelTasks && parallelTasks?.length) {
      let availableAssigneeForTask = []
      parallelTasks.forEach((task) => {
        let availableAssignee = task?.availableAssignee
        if (availableAssignee && availableAssignee?.length) {
          availableAssignee = availableAssignee.filter((assignee) => {
            if (!tasksOutOfProject || !tasksOutOfProject?.length) {
              return true
            }
            let findTaskConflictWithEmp = tasksOutOfProject.find((taskOutOf) => taskOutOf.assignee === assignee._id && taskOutOf.startDate <= ES && taskOutOf.endDate >= LF)
            if (findTaskConflictWithEmp) {
              return false
            } else {
              return true
            }
          })

          if (availableAssignee) {
            availableAssignee.forEach((assignee) => {
              if(!availableAssigneeForTask.includes(assignee._id)) {
                availableAssigneeForTask.push(assignee._id)
              }
            })
          }
        }
      })

      // Nếu số nhân viên phù hợp < số task song song => lỗi
      // console.log("flow: ", taskCode, "check length: ", availableAssigneeForTask?.length, parallelTasks?.length)
      if (availableAssigneeForTask?.length < parallelTasks?.length) {
        result = {
          isHasAvailableSolution: false,
          error_code: 'not_enough_employee_for_parallel'
        }
      }
    }
  }

  return result
}

module.exports = {
  getVectorLength,
  getDistanceQualityVector,
  findTasksWithMatchingTagsAndRequire,
  getLastKPIAndAvailableEmpsInTasks,
  findEmployeesWithCapacities,
  calculateStartDateFromEndDate,
  calculateEndDateFromStartDate,
  calculateCPM,
  reCalculateTimeWorking,
  checkHasAvailableSolution
}