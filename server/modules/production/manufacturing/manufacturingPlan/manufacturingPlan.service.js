const moment = require('moment');
const axios = require('axios');
const fs = require('fs');

const {
    ManufacturingPlan, 
    OrganizationalUnit, 
    ManufacturingWorks, 
    ManufacturingCommand, 
    SalesOrder, 
    ManufacturingMill,
    ManufacturingRouting,
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

const TaskService = require('../../../task/task-management/task.service');
const UserService = require('../../../super-admin/user/user.service');

const { 
    createManufacturingCommand, 
} = require('../manufacturingCommand/manufacturingCommand.service');
const { 
    bookingManyManufacturingMills, 
    bookingManyWorkerToCommand, 
    deleteCommandFromSchedule 
} = require('../workSchedule/workSchedule.service');
const { 
    addManufacturingPlanForGood, 
    removeManufacturingPlanForGood 
} = require('../../order/sales-order/salesOrder.service');
const {
    getUserByWorksManageRole
} = require('../manufacturingWorks/manufacturingWorks.service')
const dayjs = require('dayjs');

function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

function formatDate (date, monthYear = false) {
    if (date) {
      let d = new Date(date)
      if (monthYear) {
        return dayjs(d).format('MM-YYYY')
      } else {
        return dayjs(d).format('DD-MM-YYYY')
      }
    }
    return date
}

// Hàm format to YYYY-MM để có thể dụng new Date
function formatToTimeZoneDate(stringDate) {
    let dateArray = stringDate.split("-");
    if (dateArray.length == 3) {
        let day = dateArray[0];
        let month = dateArray[1];
        let year = dateArray[2];
        return `${year}-${month}-${day}`
    }
    else if (dateArray.length == 2) {
        let month = dateArray[0];
        let year = dateArray[1];
        return `${year}-${month}`
    }
}

// Hàm check lệnh sản xuất có chậm tiến độ hay không, nhận vào 1 array các lệnh sản xuất
function checkProgressManufacturingCommand(arrayCommands) {
    let date = new Date(moment().subtract(1, "days"));
    for (let i = 0; i < arrayCommands.length; i++) {
        if ((arrayCommands[i].status == 1 || arrayCommands[i].status == 2 || arrayCommands[i].status == 6) && (arrayCommands[i].startDate < date)
            || (arrayCommands[i].status == 3 && arrayCommands[i].endDate < date)
        ) {
            return true;
        }
    }
    return false;
}


// Hàm filter kế hoạch theo tiến độ
function filterPlansWithProgress(arrayPlans, progress) {
    let date = new Date(moment().subtract(1, "days"));
    if (progress == 3) {// Qúa hạn
        arrayPlans = arrayPlans.filter(x => {
            return (x.status == 1 || x.status == 2 || x.status == 3) && (x.endDate < date);
        });
    }
    else if (progress == 2) {// có now  < enddate
        // Trễ tiến độ khi status = 1 || status = 2 start date < now
        // hoặc status = 2 || status = 3 và có 1 command bị quá hạn
        // Command quá hạn ở trạng thái chờ duyệt hoặc đã duyệt status = 1 || status = 2 và startDate < now;
        // Hoặc command ở trạng thái đang thực hiện status = 3 và endDate < now
        arrayPlans = arrayPlans.filter(x => date < x.endDate);
        arrayPlans = arrayPlans.filter(x => {
            return (x.status == 1 || x.status == 2) && (x.startDate < date)
        });
        arrayPlans = arrayPlans.filter(x => checkProgressManufacturingCommand(x.manufacturingCommands))
    } else if (progress == 1) {
        // Lấy ra những kế hoạch quá hạn và chậm tiến độ
        let plans2 = filterPlansWithProgress(arrayPlans, 2);
        let plans3 = filterPlansWithProgress(arrayPlans, 3);
        let plans23 = [...plans2, ...plans3];
        plans23Code = plans23.map(x => x._id);
        arrayPlans = arrayPlans.filter(x => !plans23Code.includes(x._id));
    }

    // Trả về những kế hoạch đúng tiến độ
    return arrayPlans;
}

function convertDateTime(dateString, hoursToAdd) {
    let newDate = new Date(dateString);
    newDate.setHours(newDate.getHours() + hoursToAdd);
    return newDate;
}

const createTaskFromPlan = async (id, portal) => {
    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(id);

    await Promise.all(manufacturingPlan.manufacturingCommands.map(async (command) => {
        const manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById(command);
        
        const manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById(manufacturingCommand.workOrders[0].manufacturingMill);
        const manufacturingWork = await ManufacturingWorks(connect(DB_CONNECTION, portal)).findById(manufacturingMill.manufacturingWorks);
        const organizationalUnitId = manufacturingWork.organizationalUnit;

        const responsibleTaskTemplate = manufacturingCommand.taskTemplates.responsible;
        const qualityControlTaskTemplate = manufacturingCommand.taskTemplates.qualityControl;

        await Promise.all(manufacturingCommand.workOrders.map(async (wo) => {
            await Promise.all(wo.tasks.map(async (task, index) => {
                if (responsibleTaskTemplate) {
                    const taskData = {
                        name: `Công đoạn ${wo.operation} - ${manufacturingCommand.code}`,
                        description: 'Công việc thực hiện sản xuất',
                        quillDescriptionDefault: '',
                        startDate: convertDateTime(task.startDate, task.startHour),
                        endDate: convertDateTime(task.endDate, task.endHour),
                        priority: 3,
                        responsibleEmployees: [task.responsible],
                        accountableEmployees: manufacturingCommand.accountables,
                        consultedEmployees: manufacturingCommand.accountables,
                        informedEmployees: manufacturingCommand.accountables,
                        creator: manufacturingPlan.creator,
                        organizationalUnit: organizationalUnitId,
                        collaboratedWithOrganizationalUnits: [],
                        taskTemplate: manufacturingCommand.taskTemplates.responsible,
                        parent: '',
                        taskProject: '',
                        tags: [],
                        taskOutputs: [],
                        imgs: null
                    }
        
                    const newTask = await TaskService.createTask(portal, taskData)
                    wo.tasks[index].task = newTask.task._id
                }

                if (qualityControlTaskTemplate && manufacturingCommand.qualityControlStaffs.length > 0) {
                    const qualityControlStaffs = manufacturingCommand.qualityControlStaffs.map(x => x.staff);
                    const taskData = {
                        name: `Kiểm định chất lượng ${manufacturingCommand.code}`,
                        description: `Kiểm định chất lưong công đoạn  ${wo.operation} - ${manufacturingCommand.code}`,
                        quillDescriptionDefault: '',
                        startDate: manufacturingCommand.startDate,
                        endDate: manufacturingCommand.endDate,
                        priority: 3,
                        responsibleEmployees: qualityControlStaffs,
                        accountableEmployees: qualityControlStaffs,
                        consultedEmployees: qualityControlStaffs,
                        informedEmployees: qualityControlStaffs,
                        creator: manufacturingPlan.creator,
                        organizationalUnit: organizationalUnitId,
                        collaboratedWithOrganizationalUnits: [],
                        taskTemplate: manufacturingCommand.taskTemplates.qualityControl,
                        parent: '',
                        taskProject: '',
                        tags: [],
                        taskOutputs: [],
                        imgs: null
                    }
                    const newTasks = await TaskService.createTask(portal, taskData)
                    wo.qualityControlTasks.push(newTasks.task._id)
                }
            }))
        }))

        await manufacturingCommand.save()
    }))
}

exports.createManufacturingPlan = async (data, portal) => {
    const manufacturingCommands = data.manufacturingCommands;
    const listMillSchedules = data.listMillSchedules;
    const arrayWorkerSchedules = data.arrayWorkerSchedules;
    const manufacturingMill = await ManufacturingMill(connect(DB_CONNECTION, portal)).findById({
        _id: manufacturingCommands[0].workOrders[0].manufacturingMill
    });
    const manufacturingWorksId = manufacturingMill.manufacturingWorks;

    let newManufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        salesOrders: data.salesOrders ? data.salesOrders : [],
        goods: data.goods.map(x => {
            return {
                good: x.good,
                quantity: x.quantity,
            }
        }),
        approvers: data.approvers.map(x => {
            return {
                approver: x,
                approvedTime: null
            }
        }),
        creator: data.creator,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        manufacturingWorks: [manufacturingWorksId]
    });

    let manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .findById(newManufacturingPlan._id)
        .populate([{
            path: "creator", select: "_id name email avatar"
        }, {
            path: "manufacturingCommands"
        }, {
            path: 'approvers.approver', select: "_id name email avatar"
        }]);
    for (let i = 0; i < manufacturingCommands.length; i++) {
        manufacturingCommands[i].manufacturingPlan = newManufacturingPlan._id;
        manufacturingCommands[i].creator = data.creator;
        manufacturingCommands[i].approver = data.approvers;
        await createManufacturingCommand(manufacturingCommands[i], portal);
    }

    // manual manufacturing schedule
    if (listMillSchedules) {
        await bookingManyManufacturingMills(listMillSchedules, portal);
    }

    if (arrayWorkerSchedules) {
        await bookingManyWorkerToCommand(arrayWorkerSchedules, portal);
    }
    
    if (data.salesOrders.length) {
        for (let i = 0; i < data.salesOrders.length; i++) {
            await addManufacturingPlanForGood(data.salesOrders[i], manufacturingWorksId, newManufacturingPlan._id, portal);
        }
    }

    return { manufacturingPlan }
}

exports.createAutomaticSchedule = async (data, portal) => {
    planStartDate = formatToTimeZoneDate(data.startDate);
    let approvedCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find({
            status: {
                $in: [2, 3]
            },
            endDate: {
                $gt: new Date(planStartDate)
            }
        })
    
    let unapprovedCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find({
            status: {
                $in: [1, 6]
            },
            endDate: {
                $gt: new Date(planStartDate)
            }
        })
        .populate([{
            path: "manufacturingRouting",
            select: "operations"
        }, {
            path: "manufacturingPlan",
            select: "startDate endDate"
        }])
    

    approvedCommands = approvedCommands?.map(command => {     
        return ({
            id: 1,
            command_id: command._id,
            quantity: command.quantity,
            status: "inprogress",
            start_date: formatDate(command.startDate),
            end_date: formatDate(command.endDate),
            workOrders: command.workOrders.map((wo, index) => ({
                "_id": `${index}`,
                "tasks": wo.tasks.map(task => ({
                    machine_id: task.machine,
                    worker_id: task.responsible,
                    start_date: formatDate(task.startDate),
                    start_hours: task.startHour,
                    end_date: formatDate(task.endDate),
                    end_hours: task.endHour
                }))
            }))
        })
    })

    unapprovedCommands = unapprovedCommands?.map(command => {
        const operations = command.manufacturingRouting.operations.map(o => ({
            id: o.id,
            _id: o._id,
            resources: o.resources.map(r => ({
                machine_id: r.machine,
                hprs: r.hourProduction,
                costPerHour: r.costPerHour,
                minExp: r.minExpYear,
                role: r.workerRole
            })),
            prevOperation: o.prevOperation
        }))

        return ({
            command_id: command._id,
            quantity: command.quantity,
            status: "new",
            start_date: formatDate(command.manufacturingPlan.startDate),
            end_date: formatDate(command.manufacturingPlan.endDate),
            operations
        })
    })
    
    const newCommands = await Promise.all(data.manufacturingCommands.map(async (command, index) => {
        const routing = await ManufacturingRouting(connect(DB_CONNECTION, portal))
            .findById(command.routingId);
        
        const operations = routing.operations.map(o => ({
            id: o.id,
            _id: o._id,
            resources: o.resources.map(r => ({
                machine_id: r.machine,
                hprs: r.hourProduction,
                costPerHour: r.costPerHour,
                minExp: r.minExpYear,
                role: r.workerRole
            })),
            prevOperation: o.preOperation
        }));
        return ({
            command_id: `${index}`,
            quantity: command.quantity,
            status: "new",
            start_date: data.startDate,
            end_date: data.endDate,
            operations
        });
    }));


    const userRes = await getUserByWorksManageRole(data.currentRole, portal)

    let workerCount = 1
    const workers = userRes.employees.map(employee => ({
        id: workerCount++,
        worker_id: employee.userId._id,
        name: employee.userId.name,
        exp: 5,
        baseSalary: 14000,
        role: employee.roleId._id
    }))

    const allCommands = [...approvedCommands, ...unapprovedCommands, ...newCommands]

    const res = await axios.post(`${process.env.PYTHON_URL_SERVER}/api/dxclan/production_schedule/`, {
        commands: allCommands,
        workers
    })

    const schedule = res.data.content.schedule

    const affectedCommands = await Promise.all(
        schedule
            .filter(command => command.id.length > 10)
            .map(async (command) => {
                const manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
                    .findById(command.id)
                const workOrders = command.workOrders.map(wo => {
                    const foundWorkOrder = manufacturingCommand.workOrders
                        .find(x => x.operationId == wo.id)

                    return {
                       ...wo,
                       operation: foundWorkOrder?.operation,
                       operationId: foundWorkOrder?.operationId,
                       manufacturingMill: foundWorkOrder?.manufacturingMill._id
                    }
                })

                return {
                    ...command,
                    _id: manufacturingCommand._id, 
                    code: manufacturingCommand.code,
                    workOrders
                }
            })
    );

    const createdCommands = schedule
        .filter(command => command.id.length < 10)
        .map(command => ({
            ...command,
            id: parseInt(command.id)
        }))
    return { schedule: { affectedCommands, createdCommands }}
}


exports.getAllManufacturingPlans = async (query, portal) => {
    let { code, manufacturingOrderCode, salesOrderCode, commandCode, manufacturingWorks
        , startDate, endDate, createdAt, status, progress, page, limit, currentRole } = query;
    if (!currentRole) {
        throw Error("Role is not defined")
    }

    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    let options = {};

    options.manufacturingWorks = {
        $in: listWorksId
    }
    // Xử lý code
    if (code) {
        options.code = new RegExp(code, "i");
    }
    // Truyền manufacturingWorks nghĩa là được xem hết kế hoạch của tất cả các nhà máy
    // Xử lý manufacturingWorks
    if (manufacturingWorks) {
        options.manufacturingWorks = {
            $in: manufacturingWorks
        }
    }
    // Xử lý ngày bắt đầu
    if (startDate) {
        options.startDate = {
            '$gte': getArrayTimeFromString(startDate)[0],
            '$lte': getArrayTimeFromString(startDate)[1]
        }
    }
    // Xử lý ngày kết thúc
    if (endDate) {
        options.endDate = {
            '$gte': getArrayTimeFromString(endDate)[0],
            '$lte': getArrayTimeFromString(endDate)[1]
        }
    }
    // Xử lý ngày tạo
    if (createdAt) {
        options.createdAt = {
            '$gte': getArrayTimeFromString(createdAt)[0],
            '$lte': getArrayTimeFromString(createdAt)[1]
        }
    }
    // Xử lý trạng thái
    if (status) {
        options.status = {
            $in: status
        }
    }


    if (!page || !limit) {
        let manufacturingPlans = await ManufacturingPlan(connect(DB_CONNECTION, portal)).find(options);
        return { manufacturingPlans }
    } else {
        // Xử lý mã đơn sản xuất truyền vào
        if (manufacturingOrderCode) {
            let manufacturingOrders = await ManufacturingOrder(connect(DB_CONNECTION, portal)).find({
                code: new RegExp(manufacturingOrderCode, "i")
            });
            let manufacturingOrderIds = manufacturingOrders.map(x => x._id);
            options.manufacturingOrder = {
                $in: manufacturingOrderIds
            }

        }
        // Xử lý mã đơn kinh doanh
        if (salesOrderCode) {
            let salesOrders = await SalesOrder(connect(DB_CONNECTION, portal)).find({
                code: new RegExp(salesOrderCode, "i")
            });
            let salesOrderIds = salesOrders.map(x => x._id);
            options.salesOrders = {
                $in: salesOrderIds
            }

        }
        // Xử lý mã lệnh sản xuất truyền vào
        if (commandCode) {
            let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal)).find({
                code: new RegExp(commandCode, "i")
            });
            let manufacturingCommandIds = manufacturingCommands.map(x => x._id);
            options.manufacturingCommands = {
                $in: manufacturingCommandIds
            }
        }

        // let manufacturingPlans = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        //     .paginate(options, {
        //         limit,
        //         page,
        //         populate: [{
        //             path: "creator"
        //         }]
        //     });
        let plans = await ManufacturingPlan(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([{
                path: "creator", select: "_id name email avatar"
            }, {
                path: "manufacturingCommands"
            }, {
                path: "approvers.approver", select: "_id name email avatar"
            }]).sort({
                "updatedAt": "desc"
            });



        // Xử lý tình trạng truyền vào
        if (progress && (progress.length == 1 || progress.length == 2)) {
            // Trả về kế hoạch đúng tiến độ, trễ tiến độ và qúa hạn ứng  với progress 1, 2, 3 truyền vào
            // 1. Đúng hạn 2. Trễ tiến độ 3. Qúa hạn
            if (progress.length == 1 && progress.includes("3")) {
                plans = filterPlansWithProgress(plans, 3);
            } else if (progress.length == 1 && progress.includes("2")) {
                plans = filterPlansWithProgress(plans, 2);
            } else if (progress.length == 1 && progress.includes("1")) {
                plans = filterPlansWithProgress(plans, 1);
            } else if (progress.length == 2 && !progress.includes("1")) {
                plans2 = filterPlansWithProgress(plans, 2);
                plans3 = filterPlansWithProgress(plans, 3);
                plans = [...plans2, ...plans3];
            } else if (progress.length == 2 && !progress.includes("2")) {
                plans1 = filterPlansWithProgress(plans, 1);
                plans3 = filterPlansWithProgress(plans, 3);
                plans = [...plans1, ...plans3];
            } else if (progress.length == 2 && !progress.includes("3")) {
                plans1 = filterPlansWithProgress(plans, 1);
                plans2 = filterPlansWithProgress(plans, 2);
                plans = [...plans1, ...plans2];
            }
        }

        let manufacturingPlans = {};
        manufacturingPlans.totalPages = Math.ceil(plans.length / limit);
        manufacturingPlans.page = parseInt(page);
        const offset = (page - 1) * limit;
        plans = plans.slice(offset).slice(0, limit);
        manufacturingPlans.docs = plans;
        return { manufacturingPlans }
    }
}

// Lấy ra danh sách người dùng duyệt kế hoạch theo roleId của người hiện tại tạo kế hoạch

exports.getApproversOfPlan = async (portal, currentRole) => {
    
    if (!currentRole) {
        throw Error("Role is not defined")
    }

    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorksByManager = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
     // Lấy ra list các nhà máy currentRole là role quản lý khác
    let listManufacturingWorksByManagerRoles = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    });
    let listManufacturingWorks = [...listManufacturingWorksByManager, ...listManufacturingWorksByManagerRoles];


    // Lấy ra tất cả các manageRoles của các nhà máy này push vào mảng roles;
    let roles = [];
    for (let i = 0; i < listManufacturingWorks.length; i++) {
        let manageRoles = listManufacturingWorks[i].manageRoles;
        if (manageRoles.length) {
            for (let j = 0; j < manageRoles.length; j++) {
                if (!roles.includes(manageRoles[j])) {
                    roles.push(manageRoles[j])
                }
            }
        }
    }

    // Lấy ra tất cả các manage, deputymanager của các nhà máy này push vào mảng roles;
    const listOrganizationalUnitId = []
    listManufacturingWorks.map(work =>{
        listOrganizationalUnitId.push(work.organizationalUnit)
    })
    const listOrganizationalUnit = 
        await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ '_id': { $in: listOrganizationalUnitId } });
    for(let i = 0; i < listOrganizationalUnit.length; i++){
        const managerRoles = listOrganizationalUnit[i].managers;
        if (managerRoles.length) {
            for (let j = 0; j < managerRoles.length; j++) {
                if (!roles.includes(managerRoles[j])) {
                    roles.push(managerRoles[j])
                }
            }
        }

        const deputyManagerRoles = listOrganizationalUnit[i].deputyManagers;
        if (deputyManagerRoles.length) {
            for (let j = 0; j < deputyManagerRoles.length; j++) {
                if (!roles.includes(deputyManagerRoles[j])) {
                    roles.push(deputyManagerRoles[j])
                }
            }
        }
    }

    // Dùng service bên users để lấy ra tất cả các users trong mảng roles

    let users = await UserService.getUsersByRolesArray(portal, roles);

    // Xóa các bản ghi trùng nhau trong TH một user có 2 role có thể approver
    users = users.filter((user, index, self) =>
        index === self.findIndex((u) => (
            u.userId._id === user.userId._id
        ))
    );
    return { users }
}

exports.getManufacturingPlanById = async (id, portal) => {
    const manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([{
            path: 'salesOrders',
            select: 'code'
        }, {
            path: 'manufacturingWorks',
            select: 'code name'
        }, {
            path: 'manufacturingCommands'
        }, {
            path: 'goods.good'
        }, {
            path: 'approvers.approver', select: "_id name email avatar"
        }, {
            path: 'creator', select:" id name email avatar"
        }]);

    return { manufacturingPlan }
}


function findIndexOfApprover(array, id) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.approver == id) {
            result = index;
        }
    });
    return result;
}

function checkApproved(oldPlan) {
    let result = true;
    oldPlan.approvers.forEach(x => {
        if (!x.approvedTime) {
            result = false;
        }
    });
    return result;
}

exports.editManufacturingPlan = async (id, data, portal) => {
    let oldPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPlan) {
        throw Error("Plan is not existing")
    }
    oldPlan.code = data.code ? data.code : oldPlan.code;
    oldPlan.manufacturingWorks = data.manufacturingWorks ? data.manufacturingWorks : oldPlan.manufacturingWorks;
    oldPlan.salesOrders = data.salesOrders ? data.salesOrders : oldPlan.salesOrders;
    oldPlan.goods = data.goods ? data.goods : oldPlan.goods;

    // Xử lý người phê duyệt truyền vào
    if (data.approvers) {
        let index = findIndexOfApprover(oldPlan.approvers, data.approvers.approver);
        if (index !== -1) {
            oldPlan.approvers[index].approvedTime = new Date(Date.now());
        }
        if (checkApproved(oldPlan)) {
            let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal)).find({
                manufacturingPlan: oldPlan._id
            });
            await createTaskFromPlan(oldPlan._id, portal); // Tạo công việc từ kế hoạch cho từng công đoạn SX
            oldPlan.status = 2; // Đã duyệt
            manufacturingCommands.map(x => {
                x.status = 1;
                x.save();
            })
        }
    } else {
        oldPlan.approvers = oldPlan.approvers;
    }

    oldPlan.manufacturingCommands = data.manufacturingCommands ? data.manufacturingCommands : oldPlan.manufacturingCommands;
    oldPlan.creator = data.creator ? data.creator : oldPlan.creator;
    oldPlan.status = data.status ? data.status : oldPlan.status;
    oldPlan.description = data.description ? data.description : oldPlan.description;
    oldPlan.startDate = data.startDate ? data.startDate : oldPlan.startDate;
    oldPlan.endDate = data.endDate ? data.endDate : oldPlan.endDate;

    await oldPlan.save();

    if (data.status == 5) {
        const listCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find({
                manufacturingPlan: oldPlan._id
            });
        for (let i = 0; i < listCommands.length; i++) {
            await deleteCommandFromSchedule(listCommands[i], portal);
            listCommands[i].status = 5;
            await listCommands[i].save();
        }
        const salesOrders = oldPlan.salesOrders;
        if (salesOrders.length) {
            const manufacturingWorks = oldPlan.manufacturingWorks;
            for (let i = 0; i < salesOrders.length; i++) {
                for (let j = 0; j < manufacturingWorks.length; j++) {
                    await removeManufacturingPlanForGood(salesOrders[i], manufacturingWorks[j], portal);
                }
            }
        }
    }

    const manufacturingPlan = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .findById({ _id: oldPlan._id })
        .populate([{
            path: "creator", select:"_id name email avatar"
        }, {
            path: "manufacturingCommands"
        }, {
            path: "approvers.approver", select:"_id name email avatar"
        }]);
    return { manufacturingPlan }
}

exports.getNumberPlans = async (data, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = data;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    let options = {};

    options.manufacturingWorks = {
        $in: listWorksId
    }

    if (manufacturingWorks) {
        options.manufacturingWorks = {
            $in: manufacturingWorks
        }
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }

    // Tra ve tong so ke hoach
    let plans = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options)
        .populate([{
            path: "creator",select:"_id name email avatar"
        }, {
            path: "manufacturingCommands"
        }, {
            path: "approvers.approver", select:"_id name email avatar"
        }]).sort({
            "updatedAt": "desc"
        });


    const totalPlans = plans.length;
    // 1 Đúng tiến độ 2 Chậm tiến độ 3 Quá hạn
    // Tra ve ke hoach qua han
    let expiredPlans = filterPlansWithProgress(plans, 3).length;
    // Tra ve ke hoach cham tien do
    let slowPlans = filterPlansWithProgress(plans, 2).length;
    // Tra ve ke hoach dung tien do
    let truePlans = totalPlans - expiredPlans - slowPlans;

    return { totalPlans, truePlans, slowPlans, expiredPlans }

}

exports.getNumberPlansByStatus = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);

    let options = {};

    options.manufacturingWorks = {
        $in: listWorksId
    }

    if (manufacturingWorks) {
        options.manufacturingWorks = {
            $in: manufacturingWorks
        }
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }
    // Tra ve tong so ke hoach
    options.status = 1;
    const plan1 = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 2;
    const plan2 = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 3;
    const plan3 = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 4;
    const plan4 = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options).count();
    options.status = 5;
    const plan5 = await ManufacturingPlan(connect(DB_CONNECTION, portal))
        .find(options).count();
    return { plan1, plan2, plan3, plan4, plan5 }

}
