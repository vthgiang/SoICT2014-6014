export const getListMembersInProject = (listMembersInProjectWithUnit, listUsersWithUnit) => {
  if (!listUsersWithUnit || !listUsersWithUnit?.length || !listMembersInProjectWithUnit || !listMembersInProjectWithUnit?.length) {
    return []
  }
  const listMembersInProject = []
  for (let i = 0; i < listMembersInProjectWithUnit?.length; i++) {
    const { unitId, listUsers } = listMembersInProjectWithUnit[i]
    if (!unitId || !listUsers || !listUsers?.length) {
      continue
    }
    const listUsersInUnitId = listUsersWithUnit.find((item) => item.unit === unitId)?.value
    if (!listUsersInUnitId || !listUsersInUnitId?.length) {
      continue
    }
    listUsers.forEach((userId) => {
      const userData = listUsersInUnitId.find((item) => item.value === userId)
      let userToPush = {
        userId,
        unitId,
      }
      if (userData) {
        const capacities = userData?.employee?.capacities && userData?.employee?.capacities?.length > 0 ? userData?.employee.capacities.map((item) => {
          return {
            name: item.capacity.name,
            key: item.capacity.key,
            id: item.capacity._id,
            value: item.value
          }
        }) : []
        userToPush = {  
          ...userToPush,
          employeeId: userData?.employee?._id,
          text: userData?.text,
          value: userData?.value,
          capacities: capacities
        }
      }
      if (!listMembersInProject.some((item) => item.userId === userId)) {
        listMembersInProject.push({
          ...userToPush
        })
      }
    })
  }
  return listMembersInProject
}