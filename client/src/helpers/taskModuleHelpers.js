
/**
 * Hàm lấy kiểm tra, và trả về tên vai trò của người dùng trong công việc vd: Người thực hiện,.....
 * @param {*} userId id của người dùng hiện tại
 * @param {*} currentTask task hiện tại,
 */
export const getRoleInTask = (userId, currentTask, translate) => {
    let roleInTask = [];
    if (currentTask?.responsibleEmployees?.length > 0) {
        currentTask.responsibleEmployees.forEach(obj => {
            // Trường hợp nếu responsibleEmployess được populate
            if (typeof (obj) === 'object') {
                if(obj._id === userId)
                    roleInTask=[...roleInTask, translate('task.task_management.responsible')]
            }
            if(typeof(obj) === 'string'){
                if(obj === userId)
                roleInTask = [...roleInTask, translate('task.task_management.responsible')]
            }
        })
    }

    if (currentTask?.accountableEmployees?.length > 0) {
        currentTask.accountableEmployees.forEach(obj => {
            // Trường hợp nếu accountableEmployees được populate
            if (typeof (obj) === 'object') {
                if(obj._id === userId)
                    roleInTask=[...roleInTask, translate('task.task_management.accountable')]
            }
            if(typeof(obj) === 'string'){
                if(obj === userId)
                roleInTask = [...roleInTask, translate('task.task_management.accountable')]
            }
        })
    }

    if (currentTask?.consultedEmployees?.length > 0) {
        currentTask.consultedEmployees.forEach(obj => {
            // Trường hợp nếu consultedEmployees được populate
            if (typeof (obj) === 'object') {
                if(obj._id === userId)
                    roleInTask=[...roleInTask, translate('task.task_management.consulted')]
            }
            if(typeof(obj) === 'string'){
                if(obj === userId)
                roleInTask = [...roleInTask, translate('task.task_management.consulted')]
            }
        })
    }
    if (currentTask?.informedEmployees?.length > 0) {
        currentTask.informedEmployees.forEach(obj => {
            // Trường hợp nếu informedEmployees được populate
            if (typeof (obj) === 'object') {
                if(obj._id === userId)
                    roleInTask=[...roleInTask, translate('task.task_management.informed')]
            }
            if(typeof(obj) === 'string'){
                if(obj === userId)
                roleInTask = [...roleInTask, translate('task.task_management.informed')]
            }
        })
    }
    return roleInTask.join(", ")
}

/**
 * Hàm kiểm tra độ ưu tiên của công việc để thiết lập màu sắc tương ứng
 * @param {*} priority độ ưu tiên công việc
 * @returns mã màu css
 */
export const checkPrioritySetColor = (priority) => {
    const parsePriority = parseInt(priority);
    if (parsePriority === 1) return "#808080"
    if (parsePriority === 2) return "#ffa707"
    if (parsePriority === 3) return "#28A745"
    if (parsePriority === 4) return "#ff5707"
    if (parsePriority === 5) return "#ff0707"
}

/**
 * Hàm convert độ ưu tiên ra text
 * @param {*} priority độ ưu tiên công việc
 * @param {*} translate biến translate 
 */
export const formatPriority = (priority, translate) => {
    const parsePriority = parseInt(priority);

    if (parsePriority === 1) return translate('task.task_management.low');
    if (parsePriority === 2) return translate('task.task_management.average');
    if (parsePriority === 3) return translate('task.task_management.standard');
    if (parsePriority === 4) return translate('task.task_management.high');
    if (parsePriority === 5) return translate('task.task_management.urgent');
}

/**
 * Hàm lấy thông tin tên dự án trong danh sách dự án
 * @param {*} id id dự án
 * @param {*} listProject 
 */
export const getProjectName = (id, listProject) => {
      if (id && listProject && listProject.length > 0) {
        const projectLength = listProject.length;
        for (let i = 0; i < projectLength; i++){
            if (listProject[i]._id === id) 
                return listProject[i].name
        }
    }
}
/**
 * Hàm lọc những phàn tử trùng lặp
 * @param {*} arr 
 * @returns hàm trả ra các phần tử khác nhau
 */
export const filterDifference = (arr) => {
    if (!arr && !Array.isArray(arr))
        return [];
    const seen = new Set();
    return arr.filter((el) => {
        const duplicate = seen.has(el._id);
        seen.add(el._id);
        return !duplicate;
    });
    }