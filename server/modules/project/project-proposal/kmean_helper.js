
function preprocessEmployees(employees) {
    // Find all unique.capacities
    const allCapacities = new Set();
    for (const employee of employees) {
        for (const key in employee.capacities) {
            allCapacities.add(key);
        }
    }

    // Ensure all employees have the same.capacities
    for (const employee of employees) {
        for (const capacity of allCapacities) {
            if (!employee.capacities.hasOwnProperty(capacity)) {
                employee.capacities[capacity] = 0;
            }
        }
  }
  return employees
}

function getRandomEmployees(employees, k) {
  const randomEmployees = [];
  const shuffledEmployees = employees.sort(() => 0.5 - Math.random()); // Chiến lược 1: Randomize the order of employees
  // const shuffledEmployees = employees.sort((item) => )
  
  for (let i = 0; i < k; i++) {
    randomEmployees.push(shuffledEmployees[i]); // Select first k employees
  }
  // console.log("random: ", randomEmployees.map((item) => item.id))
  return randomEmployees;
}

function initializeCentroids_1(employees, k) {
  const randomEmployees = getRandomEmployees(employees, k);
  const centroids = randomEmployees.map(employee => ({ ...employee.capacities }));
  return centroids;
}

function initializeCentroids_2(employees, k) {
  const centroids = [];
  
  // Chọn một điểm ngẫu nhiên từ dữ liệu làm tâm cụm đầu tiên
  const firstCentroidIndex = Math.floor(Math.random() * employees.length);
  // console.log("firstIndex: ", firstCentroidIndex)
  centroids.push({ ...employees[firstCentroidIndex].capacities });

  // Tiến hành chọn các tâm cụm còn lại sử dụng phương pháp K-means++
  for (let i = 1; i < k; i++) {
    const distances = [];
    let totalDistance = 0;

    // Tính toán khoảng cách từ mỗi điểm đến tâm cụm gần nhất
    for (const employee of employees) {
        let minDistance = Infinity;
        for (const centroid of centroids) {
            const distance = euclideanDistance(employee.capacities, centroid);
            if (distance < minDistance) {
                minDistance = distance;
            }
        }
        distances.push(minDistance);
        totalDistance += minDistance;
    }

      // Chọn một điểm mới với xác suất tỉ lệ với khoảng cách của nó đến tâm cụm gần nhất
      let accumulatedProbability = 0;
      const randomValue = Math.random() * totalDistance;
      for (let j = 0; j < distances.length; j++) {
        accumulatedProbability += distances[j];
        if (accumulatedProbability >= randomValue) {
          centroids.push({ ...employees[j].capacities });
          break;
        }
      }
  }

  return centroids;
}

function initializeCentroids_3(employees, k) {
  const centroids = [];
  
  // Chọn ngẫu nhiên centroid đầu tiên từ các điểm dữ liệu
  const firstCentroidIndex = Math.floor(Math.random() * employees.length);
  centroids.push({ ...employees[firstCentroidIndex].capacities });

  // Lặp lại cho đến khi k centroid được lấy mẫu
  for (let i = 1; i < k; i++) {
    const distances = [];
    let maxDistance = -Infinity;
    let farthestIndex = -1;

      // Tính toán khoảng cách của mỗi điểm dữ liệu từ trung tâm gần nhất đã chọn trước đó
    for (const employee of employees) {
      let minDistance = Infinity;
      for (const centroid of centroids) {
        const distance = euclideanDistance(employee.capacities, centroid);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
      distances.push(minDistance);
      if (minDistance > maxDistance) {
        maxDistance = minDistance;
        farthestIndex = distances.length - 1;
      }
    }

    // Chọn centroid tiếp theo từ các điểm dữ liệu
    // Xác suất chọn một điểm làm centroid tỷ lệ thuận với khoảng cách của nó từ centroid gần nhất đã chọn trước đó
    let accumulatedProbability = 0;
    const randomValue = Math.random() * maxDistance;
    for (let j = 0; j < distances.length; j++) {
        accumulatedProbability += distances[j];
        if (accumulatedProbability >= randomValue) {
            centroids.push({ ...employees[j].capacities });
            break;
        }
    }
  }

  return centroids;
}


// K-Means ++
function initializeCentroids_4(employees, k) {
  /*
  initialized the centroids for K-means++
  inputs:
    employees - array of employees points with shape (200, 2)
    k - number of clusters
  */

  // Initialize the centroids list and add
  // a randomly selected employees point to the list
  const centroids = [];
  const randomIndex = Math.floor(Math.random() * employees.length)
  centroids.push(employees[randomIndex].capacities);

  // Compute remaining k - 1 centroids
  for (let c_id = 1; c_id < k; c_id++) {
    // Initialize a list to store distances of employees
    // points from the nearest centroid
    const dist = [];

    for (let i = 0; i < employees.length; i++) {
      const point = employees[i].capacities;
      let d = Infinity;

      // Compute distance of 'point' from each of the previously
      // selected centroids and store the minimum distance
      for (let j = 0; j < centroids.length; j++) {
        const temp_dist = euclideanDistance(point, centroids[j]);
        d = Math.min(d, temp_dist);
      }
      dist.push(d);
    }

    // Select employees point with maximum distance as our next centroid
    const next_centroid = employees[dist.indexOf(Math.max(...dist))].capacities;
    centroids.push(next_centroid);
  }
  return centroids;
}

function getPointFromQuality(employee) {
  let sum = 0;
  for (let key in employee.capacities) {
    let t = employee.capacities[key]
    sum += t * t
  }
}

// KMeans: chọn K thằng tốt nhất
function initializeCentroids_5(employees, k) {
  const centroids = [];
  let newEmployees = employees.sort((employeeA, employeeB) => {
    const pointA = getPointFromQuality(employeeA)
    const pointB = getPointFromQuality(employeeB)

    return pointB - pointA
  })

  for (let i = 0; i < k; i++) {
    centroids.push(newEmployees[i].capacities)
  }
  
  return centroids
}


// KMeans: Chọn K thằng tồi nhất
function initializeCentroids_6(employees, k) {
  const centroids = [];
  let newEmployees = employees.sort((employeeA, employeeB) => {
    const pointA = getPointFromQuality(employeeA)
    const pointB = getPointFromQuality(employeeB)

    return pointA - pointB
  })

  for (let i = 0; i < k; i++) {
    centroids.push(newEmployees[i].capacities)
  }
  
  return centroids
}



function euclideanDistance(capacities1, capacities2) {
  let sum = 0;
  for (let key in capacities1) {
    sum += Math.pow(capacities1[key] - capacities2[key], 2);
  }
  return Math.sqrt(sum);
}

function assignToCluster(employees, centroids) {
  const clusters = new Array(centroids.length).fill().map(() => []);
  
  for (const employee of employees) {
    let minDistance = Infinity;
    let clusterIndex = -1;
    for (let i = 0; i < centroids.length; i++) {
      const distance = euclideanDistance(employee.capacities, centroids[i]);
      if (distance < minDistance) {
        minDistance = distance;
        clusterIndex = i;
      }
    }
    clusters[clusterIndex].push(employee);
  }
  return clusters;
}


function calculateCentroids(clusters) {
  const centroids = [];
  for (const cluster of clusters) {
    if (cluster.length === 0) {
      centroids.push(null);
      console.log("vao day")
      continue;
    }
    const centroidAbs = {};
    for (const key in cluster[0].capacities) {
      let sum = 0;
      let count = 0; // Add count variable
      for (const employee of cluster) {
        if (employee.capacities.hasOwnProperty(key)) { // Check if employee has the property
          sum += employee.capacities[key];
          count++; // Increment count only when property exists
        }
      }
      centroidAbs[key] = count > 0 ? sum / count : 0; // Avoid division by zero
    }
    let centroid = {}
    let distanceFromCentroidAbs = Infinity
    for (item of cluster) {
      const distance = euclideanDistance(item.capacities, centroidAbs)
      if (distance < distanceFromCentroidAbs) {
        distanceFromCentroidAbs = distance
        centroid = item.capacities
      }
    }
    centroids.push(centroid);
  }
  return centroids
}

// function calculateCentroids(clusters) {
//   const centroids = [];
//   for (const cluster of clusters) {
//     if (cluster.length === 0) {
//       centroids.push(null);
//       continue;
//     }
//     const currentCentroid = cluster[0]; // Initialize current centroid with first point in cluster
//     let minDistance = Infinity;
//     let closestPoint = currentCentroid;
//     for (const point of cluster) {
//       const distance = euclideanDistance(point.capacities, currentCentroid.capacities);
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestPoint = point;
//       }
//     }
//     centroids.push({ ...closestPoint.capacities });
//   }
//   return centroids;
// }



function kMeansWithEmployees(employees, k) {
  let employeesAfterProcess = preprocessEmployees(employees)
  // Initialize centroids randomly
  let centroids = initializeCentroids_5(employeesAfterProcess, k)
  // console.log("centroids ban dau: ", centroids)

  let prevClusters = [];
  let clusters = assignToCluster(employeesAfterProcess, centroids);
  // console.log("cluster: ", clusters)

  while (!clusters.every((cluster, i) => prevClusters[i] && cluster.length === prevClusters[i].length)) {
    prevClusters = clusters;
    centroids = calculateCentroids(clusters);
    clusters = assignToCluster(employeesAfterProcess, centroids);
  }
  // console.log("cluster: ", clusters.map(cluster => cluster.map((item) => item.id)))
  return clusters;
}

// Test the function

// Preprocess the employees data
// preprocessEmployees(employees);
// // console.log(employees);
// const k = 4;
// const clusters = kMeansWithEmployees(employees, k);
// // console.log(clusters);


// Now, all employees have the same set of capacities with default values for missing keys
function calculateCompetencyScore(employee) {
  let totalScore = 0;
  for (const key in employee.capacities) {
    totalScore += employee.capacities[key];
  }
  return totalScore;
}

function calculateClusterScores(clusters) {
  const clusterScores = [];
  for (const cluster of clusters) {
    let totalScore = 0;
    for (const employee of cluster) {
      totalScore += calculateCompetencyScore(employee) / cluster.length;
    }
    clusterScores.push(totalScore);
  }
  return clusterScores;
}

function createClusterData(clusters, clusterScores) {
    const clusterData = {};
    for (let i = 0; i < clusters.length; i++) {
      for (let employee of clusters[i]) {
        const id = employee._id
        clusterData[id] = {}
        clusterData[id]['clusterScore'] = clusterScores[i]
        clusterData[id]['cluster'] = i
      } 
      
    }
    return clusterData;
}

function getCapacityPointOfEmployeeInTask(requiredQualities, employee) {
  let total = 0
  let count = 0
  if (requiredQualities && Object.keys(requiredQualities).length > 0) {
    for (let qualityKey in requiredQualities) {
      count++;
      total += employee.capacities[qualityKey]
    }
  } else {
    for (let qualityKey in employee.capacities) {
      if (employee.capacities[qualityKey]) {
        count++;
        total += employee.capacities[qualityKey]
      }
    }
  }
  if (count === 0) return 0
  return total / count;
}

function findMeanOfQuality(qualityKey, availableAssignee) {
  const values = availableAssignee.map(employee => employee.capacities[qualityKey]);
  const sum = values.reduce((acc, currentValue) => acc + currentValue, 0);

  const mean = sum / availableAssignee.length;
  return mean;
}

function splitKPIOfTaskToEmployees(task, kpiTarget, clusterData, assetHasKPIWeight = 0) {
  const kpiOfEmployee = {}
  let { requireAssignee, availableAssignee, kpiInTask, requireAsset, taskKPIWeight } = task
  const IS_HAS_ASSET = requireAsset && requireAsset?.length > 0 ? true : false
  // console.log("task test: ",kpiInTask, taskKPIWeight)
  // if (!kpiInTask) {

  // }

  // if (!kpiInTask) {
  //   kpiInTask = []
  //   for (let key in KPI_TYPES) {
  //     kpiInTask.push({
  //       type: key,
  //       weight: 0
  //     })
  //   }
  // }
  // console.log("task: ", task)
  // let totalMeanOfTask = 0
  // let totalQualityRequire = 0
  // for (let qualityKey in requireAssignee) {
  //   totalQualityRequire++;
  //   const meanCapacityOfQuality = findMeanOfQuality(qualityKey, availableAssignee)
  //   // console.log("key: ", qualityKey, ": ", meanCapacityOfQuality)
  //   totalMeanOfTask += meanCapacityOfQuality
  // }
  // // const total 
  // const meanCapacityOfTask = totalMeanOfTask / totalQualityRequire
  // // console.log("mean: ", meanCapacityOfTask, "task: ", task.id)
  
  let totalClusterScore = 0
  // let availableAssigneeFilter = availableAssignee.filter((employee) => getCapacityPointOfEmployeeInTask(requireAssignee, employee) >= meanCapacityOfTask)
  // console.log("availableAssigneeFilter: ", availableAssigneeFilter)

  let kpiInClusters = {}
  availableAssignee.forEach((employee) => {
    const id  = employee._id
    
     // init KPI in Clusters
    const clusterId = clusterData[id].cluster
    if (!kpiInClusters[clusterId]) {
      kpiInClusters[clusterId] = {}
      for (const kpi of kpiTarget) {
        const type = kpi.type
        kpiInClusters[clusterId][type] = 0
        kpiInClusters[clusterId]['totalRatio'] = 0
      }
    }

    kpiOfEmployee[id] = {}
    for (const kpi of kpiTarget) {
      kpiOfEmployee[id][kpi.type] = 0
    }
    // kpiOfEmployee[id]['ratio'] = getCapacityPointOfEmployeeInTask(requireAssign, employee) / meanCapacityOfTask
    const capacityOfEmployeeInTask = getCapacityPointOfEmployeeInTask(requireAssignee, employee)
    // console.log('capacity Emp: ', capacityOfEmployeeInTask)
    kpiOfEmployee[id]['ratio'] = capacityOfEmployeeInTask

    kpiInClusters[clusterId]['totalRatio'] += capacityOfEmployeeInTask

    for (let key in clusterData[id]) {
      kpiOfEmployee[id][key] = clusterData[id][key]
    }
    
    totalClusterScore += kpiOfEmployee[id]['clusterScore']
   
  })
  // console.log("vao day: ", kpiInClusters)

  // let testTotalKPI = 0
  // console.log("kpiTarget: ", kpiTarget)
  // console.log(task.code,"availableAssignee: ",availableAssignee.map((item) => item.fullName))
  availableAssignee.forEach((employee) => {
    const clusterScore = kpiOfEmployee[employee._id]['clusterScore']
    const clusterId = clusterData[employee._id].cluster
    
    // kpiInTask.forEach(({ type, weight }) => {
    //   let value = weight * kpiTarget[type].value * clusterScore / totalClusterScore
    //   if (IS_HAS_ASSET) {
    //     value = value * (1 - assetHasKPIWeight)
    //   }
    //   kpiOfEmployee[employee.id][type] += value
    //   kpiInClusters[clusterId][type] += value
    //   // testTotalKPI += value
    // })
    const kpiTargetInTask = kpiTarget.find((item) => String(item.type) === String(kpiInTask))
    let value = taskKPIWeight * kpiTargetInTask.targetKPIValue * clusterScore / totalClusterScore
    if (IS_HAS_ASSET) {
      value = value * (1 - assetHasKPIWeight)
    }
    // console.log("value: ", value)
    kpiOfEmployee[employee._id][kpiInTask] += value
    kpiInClusters[clusterId][kpiInTask] += value

  })
  // console.log("code: ", task.code, "kpiOfEmployee: ", kpiOfEmployee)
  for (let employeeId in kpiOfEmployee) {
    for (const kpi of kpiTarget) {
      const type = kpi.type
      const clusterId = kpiOfEmployee[employeeId].cluster
      kpiOfEmployee[employeeId][type] = kpiInClusters[clusterId][type] * kpiOfEmployee[employeeId].ratio / kpiInClusters[clusterId].totalRatio
    }

    delete kpiOfEmployee[employeeId].ratio;
    delete kpiOfEmployee[employeeId].clusterScore;
    delete kpiOfEmployee[employeeId].cluster;
  }
  return kpiOfEmployee
}

function findBestMiniKPIOfTasks(tasks, kpiTarget, assetHasKPIWeight) {
  const minimumKpi = {}
  if (!kpiTarget[0] || !kpiTarget[0]?.targetKPIValue) {
    return minimumKpi
  }

  for (const kpi of kpiTarget) {
    minimumKpi[kpi.type] = Infinity
  }
  // console.log("minimunKPI: ", minimumKpi)

  // tìm weight nhỏ nhất trước
  tasks.forEach((task) => {
    const { kpiInTask, requireAsset, taskKPIWeight } = task
    // console.log(kpiInTask, requireAsset, taskKPIWeight)
    const IS_HAS_ASSET = requireAsset && requireAsset?.length > 0

    if (minimumKpi[kpiInTask] > taskKPIWeight) {
      minimumKpi[kpiInTask] = taskKPIWeight
      if (IS_HAS_ASSET) {
        minimumKpi[kpiInTask] = taskKPIWeight * (1 - assetHasKPIWeight)
      }
    }
  })

  for (const kpi of kpiTarget) {
    minimumKpi[kpi.type] = minimumKpi[kpi.type] * kpi.targetKPIValue
  }

  return minimumKpi
}

function reSplitKPIOfEmployees(minimumKpi, kpiOfEmployeesBefore) {
  const kpiOfEmployees = { ...kpiOfEmployeesBefore }
  const isCanSplitKpi = {}
  const totalToSplit = {}
  for (let key in minimumKpi) {
    totalToSplit[key] = {}
    totalToSplit[key]['COUNT'] = 0
    totalToSplit[key]['TOTAL'] = 0
  }
  // console.log("totalToSplit")
  for (let employeeId in kpiOfEmployees) {
    isCanSplitKpi[employeeId] = {}
    isCanSplitKpi[employeeId]['NOT_FLAG'] = true
    const kpiOfEmployee = kpiOfEmployees[employeeId]

    for (let kpiType in kpiOfEmployee) {
      if (kpiOfEmployee[kpiType] * 2 >= minimumKpi[kpiType]) {
        // Nếu có 1 thằng KPI là có thể gán task
        isCanSplitKpi[employeeId]['NOT_FLAG'] = false
      }
    }
    for (let kpiType in kpiOfEmployee) {
      isCanSplitKpi[employeeId][kpiType] = 0
      if (!isCanSplitKpi[employeeId]['NOT_FLAG']) {
        if (kpiOfEmployee[kpiType] * 2 < minimumKpi[kpiType]) {
          isCanSplitKpi[employeeId][kpiType] = 1
          totalToSplit[kpiType]['TOTAL'] += kpiOfEmployee[kpiType]
        } else {
          totalToSplit[kpiType]['COUNT'] += 1
        }
      } else {
        totalToSplit[kpiType]['COUNT'] += 1
      }
    }
  }

  for (let kpiType in totalToSplit) {
    totalToSplit[kpiType]['VALUE'] = 0
    if (totalToSplit[kpiType]['COUNT']) {
      totalToSplit[kpiType]['VALUE'] = totalToSplit[kpiType]['TOTAL'] / totalToSplit[kpiType]['COUNT']
    } 
  }

  for (let employeeId in kpiOfEmployees) {
    const kpiOfEmployee = kpiOfEmployees[employeeId]
    
    for (let kpiType in kpiOfEmployee) {
      if (isCanSplitKpi[employeeId][kpiType]) {
        kpiOfEmployee[kpiType] = 0
      } else {
        kpiOfEmployee[kpiType] += totalToSplit[kpiType]['VALUE']
      }
    }
  }
  return kpiOfEmployees
}

function splitKPIToEmployeesByKMeans(tasks, employees, kpiTarget, assetHasKPIWeight) {
  const clusters = kMeansWithEmployees(employees, employees?.length >= 4 ? 4 : employees?.length / 2)
  // console.log("vao day cluster: ", clusters)
  // Calculate cluster scores
  const clusterScores = calculateClusterScores(clusters);
  // console.log("vao day cluster score: ", clusterScores)


  // Create cluster data
  const clusterData = createClusterData(clusters, clusterScores);
  // console.log("vao day cluster data: ", clusterData)

  // Print cluster data
  const kpiOfEmployees = {}
  employees.forEach((employee) => {
    kpiOfEmployees[employee._id] = {}
    for (const kpi of kpiTarget) {
      kpiOfEmployees[employee._id][kpi.type] = 0
    }
  })

  tasks.forEach((task) => {
    const kpiSplitInTask = splitKPIOfTaskToEmployees(task, kpiTarget, clusterData, assetHasKPIWeight)
    // console.log("kpiOfEmployees: ", task.code, kpiOfEmployees)
    for (let employeeId in kpiSplitInTask) {
      for (const kpi of kpiTarget) {
        kpiOfEmployees[employeeId][kpi.type] += kpiSplitInTask[employeeId][kpi.type]
      }
    }
  })
  return kpiOfEmployees
}


module.exports = {
  kMeansWithEmployees,
  splitKPIToEmployeesByKMeans,
  findBestMiniKPIOfTasks,
  reSplitKPIOfEmployees
}