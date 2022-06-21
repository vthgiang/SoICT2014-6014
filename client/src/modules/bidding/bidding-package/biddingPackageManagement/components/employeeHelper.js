import moment from 'moment';
import { convertEmployeeToUserInUnit } from '../../../bidding-contract/component/functionHelper';

var getAllEmployeeSelectBoxItems = (listAllEmployees) => {
    let allEmployee = []
    allEmployee = listAllEmployees.map(item => {
        let text = item.fullName + " (" + item.emailInCompany + ")"
        return {
            value: item._id,
            text: text
        }
    })

    return allEmployee;
}

export default getAllEmployeeSelectBoxItems;

const checkEmpInTask = (task, empId) => {
    const resArr = task?.responsibleEmployees ?? []
    const accArr = task?.accountableEmployees ?? []
    const consultArr = task?.consultedEmployees ?? []
    const informArr = task?.informedEmployees ?? []

    return (
        resArr.find(x => String(x) === String(empId)) ||
        accArr.find(x => String(x) === String(empId)) ||
        consultArr.find(x => String(x) === String(empId)) ||
        informArr.find(x => String(x) === String(empId))
    )
}

export const getAllEmployeeWithTaskSelectBoxItems = (allUser = [], listAllEmployees = [], allTask = [], estimateTime, unitOfTime) => {
    let start = Date.now();
    let end = moment(start).add(estimateTime, unitOfTime).toDate();
    let allEmployee = [];
    let taskInEstimateTime = {};

    for (let x of listAllEmployees) {
        let user = convertEmployeeToUserInUnit(allUser, x);
        taskInEstimateTime[`${x._id}`] = {
            userId: user?._id,
            empId: x._id,
            fullName: x.fullName,
            task: [],
        }
    }


    for (let x of listAllEmployees) {
        let userX = convertEmployeeToUserInUnit(allUser, x);
        for (let t of allTask) {
            if (t.status === "wait_for_approval" || t.status === "inprocess") {
                if (!(new Date(t.startDate) > end || new Date(t.endDate) < start)) {
                    if (checkEmpInTask(t, userX?._id)) {
                        taskInEstimateTime[`${x._id}`].task.push(t);
                    }
                }
            }
        }
    }

    let formatedListEmp = [];
    for (let i in taskInEstimateTime) {
        let item = taskInEstimateTime[i];
        item.numOfTask = item.task?.length ?? 0;

        formatedListEmp.push(item);
    }

    formatedListEmp.sort(function (a, b) { return a.numOfTask - b.numOfTask });

    allEmployee = formatedListEmp.map(item => {
        let text = item.fullName + `( ${item.numOfTask} việc phải làm)`
        return {
            value: item.empId,
            text: text
        }
    })

    return allEmployee;
}

const labelingSkill = (skill) => {
    // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có
    switch (skill) {
        case "intermediate_degree": return 1;
        case "colleges": return 2;
        case "university": return 3;
        case "bachelor": return 4;
        case "engineer": return 5;
        case "master_degree": return 6;
        case "phd": return 7;

        default:
            return 0;
    }
}

// a - b
const compareProfessionalSkill = (skill1, skill2) => {
    return (labelingSkill(skill2) - labelingSkill(skill1)); // > 0 thì a > b => a sau b tức là ai có skill xịn hơn thì xếp trước
}

const checkIskeyPeople = (uid, keyPeople) => {
    let check = false;
    for (let x of keyPeople) {
        check = x.employees.find(e => String(e) === String(uid));
    }
    return check;
}

export const getEmployeeInfoWithTask = (allUser = [], listAllEmployees = [], allTask = [], estimateTime = 0, unitOfTime = "days", biddingPackage) => {
    let start = Date.now();
    let end = moment(start).add(Number(estimateTime), unitOfTime).toDate();
    let allEmployee = [];
    let taskInEstimateTime = {};
    let keyPeople = biddingPackage?.keyPeople ?? [];

    for (let x of listAllEmployees) {
        let user = convertEmployeeToUserInUnit(allUser, x);
        taskInEstimateTime[`${x._id}`] = {
            employeeInfo: x,
            user: user,
            userId: user?._id,
            empId: x._id,
            fullName: x.fullName,
            task: [],
            isKeyPeople: checkIskeyPeople(x._id, keyPeople) ? 1 : 0,
        }
    }


    for (let x of listAllEmployees) {
        let userX = convertEmployeeToUserInUnit(allUser, x);
        for (let t of allTask) {
            if (t.status === "wait_for_approval" || t.status === "inprocess") {
                if (!(new Date(t.startDate) > end || new Date(t.endDate) < start)) {
                    if (checkEmpInTask(t, userX?._id)) {
                        taskInEstimateTime[`${x._id}`].task.push(t);
                    }
                }
            }
        }
    }

    let formatedListEmp = [];
    for (let i in taskInEstimateTime) {
        let item = taskInEstimateTime[i];
        item.numOfTask = item.task?.length ?? 0;

        formatedListEmp.push(item);
    }

    // lọc ra nhân viên còn active
    let formatedListActiveEmp = formatedListEmp.filter(x => x.employeeInfo.status === "active");

    formatedListActiveEmp.sort(function (a, b) {
        if (a.isKeyPeople !== b.isKeyPeople) {
            return b.isKeyPeople - a.isKeyPeople // < 0, thì a là key, => a đứng trc b 
        }
        else if (a.numOfTask !== b.numOfTask) {
            return a.numOfTask - b.numOfTask // < 0 thì a xếp trước b
        }
        return compareProfessionalSkill(a?.employeeInfo?.professionalSkill, b?.employeeInfo?.professionalSkill);
    });

    allEmployee = formatedListActiveEmp.map(item => {
        let textEmail = item.fullName + `( ${item.employeeInfo.emailInCompany} )`
        let textTask = item.fullName + `( ${item.numOfTask} việc phải làm)`
        return {
            ...item,
            value: item.empId,
            text: textEmail,
            textEmail: textEmail,
            textTask: textTask,
        }
    })

    return allEmployee;
}