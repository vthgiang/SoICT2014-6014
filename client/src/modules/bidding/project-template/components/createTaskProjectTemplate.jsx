/**
 * Dùng tạm cho việc tạo task cho mẫu dự án
 * vì chưa phân chia là tạo cv cho dự án CPM hay là dự án đơn giản
 */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { ErrorLabel, SelectBox } from '../../../../common-components';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import ValidationHelper from '../../../../helpers/validationHelper';
import { convertUserIdToUserName, getListDepartments } from './functionHelper';
import { checkIfHasCommonItems, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { getStorage } from '../../../../config';
import { withTranslate } from 'react-redux-multilingual';

export const CreateTaskProjectTemplate = (props) => {
    const { translate, taskInProjectTemplate, userSelectOptions, respEmployeesWithUnit, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const initNewTask = {
        name: "",
        priority: 3,
        responsibleEmployees: [],
        accountableEmployees: [],
        consultedEmployees: [],
        informedEmployees: [],
        creator: getStorage("userId"),
        // organizationalUnit: "",
        collaboratedWithOrganizationalUnits: [],
        // preceedingTasks: "",
        // followingTasks: [],
        estimateNormalTime: '',
        estimateOptimisticTime: '',
        estimateNormalCost: '',
        estimateMaxCost: '',
        estimateAssetCost: 1000000,
        estimateHumanCost: '',
        actorsWithSalary: [],
        totalResWeight: 80,
        totalAccWeight: 20,
        currentResWeightArr: [],
        currentAccWeightArr: [],
        currentLatestStartDate: '',
        currentEarliestEndDate: '',
    }
    const [optionUsers, setOptionUsers] = useState(userSelectOptions);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState(initNewTask);
    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState(respEmployeesWithUnit);

    useEffect(() => {
        // setTasks(taskInProjectTemplate)
        setResponsibleEmployeesWithUnit(respEmployeesWithUnit)
    }, [respEmployeesWithUnit])

    useEffect(() => {
        setOptionUsers(userSelectOptions)
    }, [userSelectOptions])

    useEffect(() => {
        props.setTasksInfo(tasks)
    }, [tasks])

    const handleChange = (e) => {
        let { name, value } = e?.target;

        setNewTask({
            ...newTask,
            [name]: value,
        })
    }

    const handleChangeTotalResWeight = (e) => {
        let { name, value } = e?.target;

        setNewTask({
            ...newTask,
            totalResWeight: Number(value),
            totalAccWeight: 100 - Number(value)
        })
    }

    const handleChangeTaskResponsibleEmployees = (value) => {
        validateTaskResponsibleEmployees(value, true);
    }
    const validateTaskResponsibleEmployees = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateArrayLength(translate, value);
        if (checkIfHasCommonItems(value, newTask.accountableEmployees)) {
            message = "Thành viên Thực hiện và Phê duyệt không được trùng nhau"
        }

        if (willUpdateState) {
            const responsiblesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
                    weight: Number(newTask.totalResWeight) / value.length,
                })
            })
            const accountablesWithSalaryArr = newTask.accountableEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
                    weight: Number(newTask.totalAccWeight) / newTask.accountableEmployees.length,
                })
            })
            const currentNewTask = {
                ...newTask,
                responsibleEmployees: value,
                errorOnResponsibleEmployees: message,
                actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr],
            }
            setNewTask(currentNewTask);
            // setTimeout(() => {
            //     props.handleChangeTaskData(currentNewTask)
            // }, 10);
        }
        return message === undefined;
    }

    const handleChangeTaskAccountableEmployees = (value) => {
        validateTaskAccountableEmployees(value, true);
    }
    const validateTaskAccountableEmployees = (value, willUpdateState = true) => {
        let { translate } = props;
        let { message } = ValidationHelper.validateArrayLength(translate, value);
        if (checkIfHasCommonItems(value, newTask.responsibleEmployees)) {
            message = "Thành viên Thực hiện và Phê duyệt không được trùng nhau"
        }

        if (willUpdateState) {
            const accountablesWithSalaryArr = value?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
                    weight: Number(newTask.totalAccWeight) / value.length,
                })
            })
            const responsiblesWithSalaryArr = newTask.responsibleEmployees?.map(valueItem => {
                return ({
                    userId: valueItem,
                    salary: getSalaryFromUserId(responsibleEmployeesWithUnit, valueItem),
                    weight: Number(newTask.totalResWeight) / newTask.responsibleEmployees.length,
                })
            })
            const currentNewTask = {
                ...newTask,
                accountableEmployees: value,
                errorOnAccountableEmployees: message,
                actorsWithSalary: [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr],
            }
            setNewTask(currentNewTask);
            // setTimeout(() => {
            //     props.handleChangeTaskData(currentNewTask)
            // }, 10);
        }
        return message === undefined;
    }

    const handleDelete = (index) => {
        if (tasks && tasks.length > 0) {
            const cloneArr = [...tasks];
            cloneArr.splice(index, 1);
            setTasks(cloneArr)
        }
    }

    const handleAddRow = () => {
        if (newTask) {
            const newListTask = [...tasks, newTask];
            setTasks(newListTask);
            setNewTask(initNewTask)
        }
    }

    return (
        <div className="form-group">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', color: 'red' }}>
                <p>Điền các thông tin công việc theo mẫu bên duói<span className="text-red">*</span></p>
            </div>
            <table id="project-template-task-table" className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Mã công việc</th>
                        <th>Tên công việc</th>
                        <th>Công việc tiền nhiệm</th>
                        <th>Thời gian ước lượng</th>
                        <th>Thời lượng thỏa hiệp</th>
                        <th>Người thực hiện</th>
                        <th>Người phê duyệt</th>
                        <th>Trọng số người thực hiện</th>
                        <th>{translate('task_template.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks && tasks.length > 0 &&
                        tasks.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.code}</td>
                                <td>{item?.name}</td>
                                <td>{item?.preceedingTasks}</td>
                                <td>{item?.estimateNormalTime}</td>
                                <td>{item?.estimateOptimisticTime}</td>
                                <td>
                                    {item?.responsibleEmployees.map(userItem =>
                                        convertUserIdToUserName(listUsers, userItem))
                                        .join(', ')
                                    }
                                </td>
                                <td>
                                    {item?.accountableEmployees.map(userItem =>
                                        convertUserIdToUserName(listUsers, userItem))
                                        .join(', ')
                                    }
                                </td>
                                <td>{item?.totalResWeight}</td>
                                <td>
                                    <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                </td>
                            </tr>
                        ))
                    }
                    <tr key={`add-task-input-${tasks.length}`}>
                        <td>
                            <div className="form-group">
                                <input type="text" className="form-control" name="code" value={newTask.code} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </td>
                        <td>
                            <div className="form-group">
                                <input type="text" className="form-control" name="name" required value={newTask.name} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </td>
                        <td>
                            <div className="form-group">
                                <input type="text" className="form-control" name="preceedingTasks" required value={newTask.preceedingTasks} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </td>
                        <td>
                            <div className="form-group">
                                <input type="number" className="form-control" name="estimateNormalTime" required value={newTask.estimateNormalTime} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </td>
                        <td>
                            <div className="form-group">
                                <input type="number" className="form-control" name="estimateOptimisticTime" required value={newTask.estimateOptimisticTime} onChange={(e) => handleChange(e)}></input>
                            </div>
                        </td>
                        <td>
                            <div className={`form-group ${newTask.errorOnResponsibleEmployees === undefined ? "" : "has-error"}`}>
                                {
                                    <SelectBox
                                        id={`responsible-select-box${newTask.code}`}
                                        className="form-control select"
                                        style={{ width: "100%" }}
                                        items={optionUsers}
                                        onChange={handleChangeTaskResponsibleEmployees}
                                        value={newTask.responsibleEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_resp') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnResponsibleEmployees} />
                            </div>
                        </td>
                        <td>
                            <div className={`form-group ${newTask.errorOnAccountableEmployees === undefined ? "" : "has-error"}`}>
                                {
                                    <SelectBox
                                        id={`accounatable-select-box${newTask.code}`}
                                        className="form-control select"
                                        style={{ width: "100%" }}
                                        items={optionUsers}
                                        onChange={handleChangeTaskAccountableEmployees}
                                        value={newTask.accountableEmployees}
                                        multiple={true}
                                        options={{ placeholder: translate('task.task_management.add_acc') }}
                                    />
                                }
                                <ErrorLabel content={newTask.errorOnAccountableEmployees} />
                            </div>
                        </td>
                        <td>
                            <div className="form-group">
                                <input type="number" className="form-control" name="totalResWeight" required value={newTask.totalResWeight} onChange={(e) => handleChangeTotalResWeight(e)}></input>
                            </div>
                        </td>
                        <td>
                            <a className="save text-green" title={translate('general.save')} onClick={handleAddRow}><i className="material-icons">add_circle</i></a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateTaskProjectTemplate));