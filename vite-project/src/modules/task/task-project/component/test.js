const currentProjectTasks = [
  {
    _id: '1',
    preceedingTasks: []
  },
  {
    _id: '2',
    preceedingTasks: []
  },
  {
    _id: '3',
    preceedingTasks: ['1', '2']
  },
  {
    _id: '4',
    preceedingTasks: ['2']
  },
  {
    _id: '5',
    preceedingTasks: ['2']
  },
  {
    _id: '6',
    preceedingTasks: ['3']
  }
]

let allTasksNodeRelationArr = []
const getAllRelationTasks = (currentProjectTasks, currentTask) => {
  // for (let taskItem of currentProjectTasks) {
  //     if (String(taskItem._id) !== String(currentTask._id)) {
  //         if (taskItem.preceedingTasks.include(String(currentTask._id)) {
  //             for (let preItem of taskItem.preceedingTasks) {
  //                 if (!allTasksNodeRelationArr.include(preItem)) {
  //                     allTasksNodeRelationArr.push(preItem);
  //                 }
  //             }
  //         }
  //     }
  // }
  const preceedsContainCurrentTask = currentProjectTasks.filter((taskItem) => {
    console.log(taskItem, taskItem.preceedingTasks, taskItem.preceedingTasks.includes(currentTask._id))
    taskItem.preceedingTasks.includes(currentTask._id)
  })
  console.log('preceedsContainCurrentTask', preceedsContainCurrentTask)
  for (let preConItem of preceedsContainCurrentTask) {
    /* console.log('preConItem', preConItem) */
    allTasksNodeRelationArr.push(preConItem)
    getAllRelationTasks(currentProjectTasks, preConItem)
  }
  return preceedsContainCurrentTask
  // if (!preceedsContainCurrentTask) {
  //     return;
  // }
}

console.log(
  getAllRelationTasks(currentProjectTasks, {
    _id: '1',
    preceedingTasks: []
  })
)
/* console.log('allTasksNodeRelationArr', allTasksNodeRelationArr) */
