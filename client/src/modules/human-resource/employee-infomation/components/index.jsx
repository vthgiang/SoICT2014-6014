import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { AuthActions } from "../../../auth/redux/actions";
import { DepartmentActions } from "../../../super-admin/organizational-unit/redux/actions";
import { DepartmentServices } from "../../../super-admin/organizational-unit/redux/services";
import { RoleActions } from "../../../super-admin/role/redux/actions";
import { role } from "../../../super-admin/role/redux/reducers";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { UserServices } from "../../../super-admin/user/redux/services";
import { RootRoleActions } from "../../../system-admin/root-role/redux/actions";
import { taskManagementActions } from "../../../task/task-management/redux/actions";


function EmployeeInfomation(props) {
    const [data, setData] = useState([])
    const { tasks } = props
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };
    const [month, setMonth] = useState(formatDate(Date.now(), true))
    useEffect(async () => {
        // console.log(props.user);

        let currentRole = localStorage.getItem("currentRole")
        props.show(currentRole)
        UserServices.getRoleSameDepartmentOfUser(currentRole)
            .then(async res => {
                console.log(res.data);
                let data = [res.data.content.employees[0].id, res.data.content.deputyManagers[0].id]
                await UserServices.getAllEmployeeOfUnitByRole(data)
                    .then(res => {
                        // let data1=data.concat(res.data.content)
                        setData(res.data.content)
                    })
                // await UserServices.getAllEmployeeOfUnitByRole(res.data.content.deputyManagers[0].id)
                // .then(res=>{
                //     let data1=data.concat(res.data.content)
                //     setData(data1)
                // })
                // await UserServices.getAllEmployeeOfUnitByRole(res.data.content.managers[0].id)
                // .then(res=>{
                //     let data1=data.concat(res.data.content)
                //     setData(data1)
                // })
                // res.data.content.employees
            })
        DepartmentServices.getDepartmentsThatUserIsManager()
            .then(res => {
                console.log(res.data.content[0]._id)
                let partMonth = month.split('-');
                let monthNew = [partMonth[1], partMonth[0]].join('-');
                props.getTaskInOrganizationUnitByMonth(res.data.content[0]._id, monthNew, monthNew)
            }
            )
        // props.getDepartmentsThatUserIsManager()
    }, [])
    // if (tasks.organizationUnitTasks){
    //     let taskListByStatus = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : null;
    //     let listEmployee = data.employees;
    //     let maxTask = 1;
    //     let employeeTasks = [], employeeOvertime = [], employeeHoursOff = [];
    //     for (let i in listEmployee) {
    //         let tasks = [];
    //         let accountableTask = [], consultedTask = [], responsibleTask = [], informedTask = [];
    //         taskListByStatus && taskListByStatus.forEach(task => {
    //             if (task.accountableEmployees?.includes(listEmployee[i]?.userId?._id)) {
    //                 accountableTask = [...accountableTask, task._id]
    //             }
    //             if (task.consultedEmployees?.includes(listEmployee[i]?.userId?._id)) {
    //                 consultedTask = [...consultedTask, task._id]
    //             }
    //             if (task.responsibleEmployees?.includes(listEmployee[i]?.userId?._id)) {
    //                 responsibleTask = [...responsibleTask, task._id]
    //             }
    //             if (task.informedEmployees?.includes(listEmployee[i]?.userId?._id)) {
    //                 informedTask = [...informedTask, task._id]
    //             }
    //         });
    //         tasks = tasks.concat(accountableTask).concat(consultedTask).concat(responsibleTask).concat(informedTask);
    //         let totalTask = tasks.filter(function (item, pos) {
    //             return tasks.indexOf(item) === pos;
    //         })
    //         if (totalTask.length > maxTask) {
    //             maxTask = totalTask
    //         };

    //         employeeTasks = [...employeeTasks, {
    //             _id: listEmployee[i]?.userId?._id,
    //             name: listEmployee[i]?.userId?.name,
    //             accountableTask: accountableTask.length,
    //             consultedTask: consultedTask.length,
    //             responsibleTask: responsibleTask.length,
    //             informedTask: informedTask.length,
    //             totalTask: totalTask.length
    //         }]
    //     };

    //     if (employeeTasks.length !== 0) {
    //         employeeTasks = employeeTasks.sort((a, b) => b.totalTask - a.totalTask);
    //     };

    //     /* Lấy tổng số công việc làm trong tháng của nhân viên */
    //     let totalTask = 0, accountableTask = 0, consultedTask = 0, responsibleTask = 0, informedTask = 0;
    //     let taskPersonal = employeeTasks.find(x => x._id === localStorage.getItem("userId"));
    //     if (taskPersonal) {
    //         totalTask = taskPersonal.totalTask;
    //         accountableTask = taskPersonal.accountableTask;
    //         consultedTask = taskPersonal.consultedTask;
    //         responsibleTask = taskPersonal.responsibleTask;
    //         informedTask = taskPersonal.informedTask;

    //     }

    // }
    return (
        <div><p>Trang thông tin nhân viên</p>
            {data && data.map(value => {
                return <div>{value.userId.name}</div>
            })}
        </div>
    )
}
function mapState(state) {
    const { auth, role, user } = state;

    return { auth, role, user }
}

const mapDispatchToProps = {
    getAllUser: UserActions.getAllUserOfCompany,
    show: RoleActions.show,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
    getDepartmentsThatUserIsManager: DepartmentActions.getDepartmentsThatUserIsManager,
    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth
}



export default connect(mapState, mapDispatchToProps)(withTranslate(EmployeeInfomation));