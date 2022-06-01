import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox, TimePicker } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import { getParticipants, convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments, formatTime } from './functionHelper';
import ModalSalaryMembers from './modalSalaryMembers';
import { formatDate } from '../../../../helpers/formatDate';
import ModalSalaryMembersEdit from './modalSalaryMembersEdit';

const CreateGeneralTab = (props) => {
    const { translate, project, user } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState(undefined);
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
    ]
    const fakeProjectTypeList = [
        { text: 'QLDA dạng đơn giản', value: 1 },
        { text: 'QLDA phương pháp CPM', value: 2 },
    ]
    const [form, setForm] = useState({
        projectNameError: undefined,
        projectName: "",
        projectType: 2,
        description: "",
        startDate: '',
        endDate: '',
        projectManager: [],
        responsibleEmployees: [],
        currenceUnit: fakeUnitCostList[0].value,
        unitOfTime: fakeUnitTimeList[0].value,
        estimatedCost: ''
    });

    const [startTime, setStartTime] = useState('08:00 AM');
    const [endTime, setEndTime] = useState('05:30 PM');

    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    const { projectName, projectNameError, description, projectType, startDate, endDate, projectManager, responsibleEmployees, currenceUnit, unitOfTime, estimatedCost, id } = form;

    const handleChangeForm = (event, currentKey) => {
        if (currentKey === 'projectName') {
            let { translate } = props;
            let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255);
            setForm({
                ...form,
                [currentKey]: event.target.value,
                projectNameError: message,
            })
            return;
        }
        const justRenderEventArr = ['projectManager', 'responsibleEmployees', 'startDate', 'endDate'];
        if (justRenderEventArr.includes(currentKey)) {
            setForm({
                ...form,
                [currentKey]: event,
            })
            return;
        }
        const renderFirstItemArr = ['currenceUnit', 'unitOfTime', 'projectType'];
        if (renderFirstItemArr.includes(currentKey)) {
            setForm({
                ...form,
                [currentKey]: event[0],
            })
            return;
        }
        if (currentKey === 'estimatedCost') {
            setForm({
                ...form,
                [currentKey]: event.target.value,
            })
            return;
        }
        setForm({
            ...form,
            [currentKey]: event?.target?.value,
        })
    }

    const preprocessUsersList = useCallback((currentObject) => {
        if (typeof currentObject?.[0] === 'string') {
            return currentObject;
        }
        return currentObject?.map(item => item._id)
    }, [])

    useEffect(() => {
        let prjData = props.projectData;
        if (props.type === "edit" && prjData) {
            setForm({
                id: props.id,
                // projectId: prjDataId,
                projectNameError: undefined,
                projectName: prjData?.name || "",
                description: prjData?.description || "",
                projectType: prjData?.projectType || 2,
                startDate: prjData?.startDate ? formatDate(prjData?.startDate) : '',
                endDate: prjData?.endDate ? formatDate(prjData?.endDate) : '',
                projectManager: preprocessUsersList(prjData?.projectManager),
                responsibleEmployees: preprocessUsersList(prjData?.responsibleEmployees),
                currenceUnit: prjData?.currenceUnit || fakeUnitCostList[0].text,
                unitOfTime: prjData?.unitOfTime || fakeUnitTimeList[0].text,
                estimatedCost: prjData?.estimatedCost || '',
            })
            setStartTime(formatTime(prjData?.startDate) || '08:00 AM')
            setEndTime(formatTime(prjData?.endDate) || '05:30 PM')
            let newResponsibleEmployeesWithUnit = [];
            for (let i = 0; i < prjData?.responsibleEmployeesWithUnit.length; i++) {
                newResponsibleEmployeesWithUnit.push({
                    unitId: prjData?.responsibleEmployeesWithUnit[i].unitId,
                    listUsers: prjData?.responsibleEmployeesWithUnit[i].listUsers.map((item, index) => ({
                        userId: item.userId,
                        salary: item.salary,
                    }))
                })
            }
            setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
            setTimeout(() => {
                setResponsibleEmployeesWithUnit({
                    ...responsibleEmployeesWithUnit,
                    list: prjData?.responsibleEmployeesWithUnit?.map((unitItem) => {
                        return {
                            unitId: unitItem.unitId,
                            listUsers: unitItem?.listUsers?.map((userItem) => {
                                return userItem.userId
                            })
                        }
                    }),
                })
            }, 10);
        } else {
            setForm({
                ...form,
                id: props.id,
            })
        }
    }, [JSON.stringify(props.projectData), props.id])

    useEffect(() => {
        props.setGeneralInfo({
            projectNameError: form.projectNameError,
            projectName: form.projectName,
            projectType: form.projectType,
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate,
            projectManager: form.projectManager,
            responsibleEmployees: form.responsibleEmployees,
            currenceUnit: form.currenceUnit,
            unitOfTime: form.unitOfTime,
            estimatedCost: form.estimatedCost,
        })
    }, [form])

    // update state cua component cha
    useEffect(() => {
        props.setResponsibleEmployeesWithUnitReqData(responsibleEmployeesWithUnit)
    }, [responsibleEmployeesWithUnit])

    useEffect(() => {
        props.setCurrentSalaryMemData(currentSalaryMembers)
    }, [currentSalaryMembers])

    useEffect(() => {
        props.setStartTimeRq(startTime)
    }, [startTime])

    useEffect(() => {
        props.setEndTimeRq(endTime)
    }, [endTime])

    const handleDelete = (index) => {
        if (responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0) {
            const cloneArr = [...responsibleEmployeesWithUnit.list];
            cloneArr.splice(index, 1);
            setResponsibleEmployeesWithUnit({
                ...responsibleEmployeesWithUnit,
                list: cloneArr,
                currentUnitRow: '',
                currentEmployeeRow: [],
            })
        }
    }

    const handleAddRow = () => {
        if (responsibleEmployeesWithUnit.currentEmployeeRow.length > 0) {
            // Đề phòng user không chọn gì thì lấy default là Ban giám đốc
            const currentChoosenUnitRow = responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value;
            const isUnitAlreadyExistedInArr = responsibleEmployeesWithUnit.list.find((item) => {
                return currentChoosenUnitRow === item.unitId
            })
            const oldListRow = responsibleEmployeesWithUnit.list;
            // Nếu unit đã có trong array rồi
            if (isUnitAlreadyExistedInArr) {
                let newListRow = oldListRow.map((oldListRowItem) => {
                    if (String(oldListRowItem.unitId) === String(isUnitAlreadyExistedInArr.unitId)) {
                        let currentListUsers = oldListRowItem.listUsers;
                        for (let currentEmployeeRowItem of responsibleEmployeesWithUnit.currentEmployeeRow) {
                            if (!currentListUsers.includes(currentEmployeeRowItem)) {
                                currentListUsers.push(currentEmployeeRowItem)
                            }
                        }
                        return {
                            unitId: oldListRowItem.unitId,
                            listUsers: currentListUsers,
                        }
                    }
                    return oldListRowItem;
                })
                setResponsibleEmployeesWithUnit({
                    ...responsibleEmployeesWithUnit,
                    list: newListRow,
                    currentUnitRow: '',
                    currentEmployeeRow: [],
                })
            }
            else {
                const newListRow = [...oldListRow, {
                    unitId: currentChoosenUnitRow,
                    listUsers: responsibleEmployeesWithUnit.currentEmployeeRow,
                }];
                setResponsibleEmployeesWithUnit({
                    ...responsibleEmployeesWithUnit,
                    list: newListRow,
                    currentUnitRow: '',
                    currentEmployeeRow: [],
                })
            }
        }
    }

    useEffect(() => {
        let newResponsibleEmployeesWithUnit = [];
        for (let i = 0; i < responsibleEmployeesWithUnit.list.length; i++) {
            newResponsibleEmployeesWithUnit.push({
                unitId: responsibleEmployeesWithUnit.list[i].unitId,
                listUsers: responsibleEmployeesWithUnit.list[i].listUsers.map((item, index) => ({
                    userId: item,
                    salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary,
                }))
            })
        }
        setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
    }, [responsibleEmployeesWithUnit.list])

    const handleOpenModalSalaryMembers = (id) => {
        setTimeout(() => {
            window.$(`#modal-salary-members-template-${id}`).modal("show");
        }, 10);
    }

    const handleSaveCurrentSalaryMember = (data) => {
        setCurrentSalaryMembers(data);
    }

    return (
        <React.Fragment>
            {/* {
                props.type === "create" ?
                    <ModalSalaryMembers
                        id
                        createProjectCurrentSalaryMember={currentSalaryMembers}
                        responsibleEmployeesWithUnit={responsibleEmployeesWithUnit}
                        handleSaveCurrentSalaryMember={handleSaveCurrentSalaryMember}
                    /> : 
            }*/}
            <ModalSalaryMembersEdit
                showInput={true}
                projectDetailId={id}
                createProjectCurrentSalaryMember={currentSalaryMembers}
                responsibleEmployeesWithUnit={responsibleEmployeesWithUnit}
                handleSaveCurrentSalaryMember={handleSaveCurrentSalaryMember}
            />

            <div className="row">
                <div className={"col-sm-6"}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thông số dự án</legend>

                        <div className="row">
                            <div className={`form-group col-md-6 col-xs-6 ${!projectNameError ? "" : "has-error"}`}>
                                <label>{translate('project.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={projectName} onChange={(e) => handleChangeForm(e, 'projectName')}></input>
                                <ErrorLabel content={projectNameError} />
                            </div>

                            <div className={`form-group col-md-6 col-xs-6`}>
                                <label>Hình thức quản lý dự án<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`${props.type}-select-project-type-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={fakeProjectTypeList}
                                    onChange={(e) => handleChangeForm(e, 'projectType')}
                                    value={projectType}
                                    multiple={false}
                                />
                            </div>
                        </div>

                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <label>{translate('project.startDate')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`create-project-start-date`}
                                    value={startDate}
                                    onChange={(e) => handleChangeForm(e, 'startDate')}
                                    dateFormat="day-month-year"
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Thời gian bắt đầu dự án<span className="text-red">*</span></label>
                                <TimePicker
                                    id={`create-project-start-time`}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e)}
                                    disabled={false}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <label>{translate('project.endDate')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`create-project-end-date`}
                                    value={endDate}
                                    onChange={(e) => handleChangeForm(e, 'endDate')}
                                    dateFormat="day-month-year"
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Thời gian dự kiến kết thúc dự án<span className="text-red">*</span></label>
                                <TimePicker
                                    id={`create-project-end-time`}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e)}
                                    disabled={false}
                                />
                            </div>
                        </div> */}

                        <div className="form-group">
                            <label>{translate('project.unitTime')}</label>
                            <SelectBox
                                id={`${props.type}-select-project-unitTime-${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={fakeUnitTimeList}
                                onChange={(e) => handleChangeForm(e, 'unitOfTime')}
                                value={unitOfTime}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('project.unitCost')}</label>
                            <div className="form-control">VND</div>
                        </div>

                        <div className={`form-group`}>
                            <label>{translate('project.description')}</label>
                            <textarea type="text" className="form-control" value={description} onChange={(e) => handleChangeForm(e, 'description')} />
                        </div>
                    </fieldset>
                </div>
                <div className={"col-sm-6"}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Nhân lực</legend>
                        <div className="form-group">
                            <label>{translate('project.manager')}<span className="text-red">*</span></label>
                            {listUsers &&
                                <SelectBox
                                    id={`${props.type}-select-project-manager-${id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listUsers}
                                    onChange={(e) => handleChangeForm(e, 'projectManager')}
                                    value={projectManager}
                                    multiple={true}
                                />
                            }
                        </div>
                        <div className="form-group">
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <label>{translate('project.member')}<span className="text-red">*</span></label>
                                <button type="button" className="btn-link" onClick={() => handleOpenModalSalaryMembers(id)}>Xem chi tiết lương nhân viên</button>
                            </div>
                            <table id="project-table" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Thuộc đơn vị</th>
                                        <th>Thành viên tham gia</th>
                                        <th>{translate('task_template.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0 &&
                                        responsibleEmployeesWithUnit.list.map((item, index) => (
                                            <tr key={index}>
                                                <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                                                <td>
                                                    {item?.listUsers.map(userItem =>
                                                        convertUserIdToUserName(listUsers, userItem))
                                                        .join(', ')
                                                    }
                                                </td>
                                                <td>
                                                    <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    <tr key={`add-task-input-${responsibleEmployeesWithUnit.list.length}`}>
                                        <td>
                                            <div className={`form-group`}>
                                                {listDepartments && listDepartments.length > 0 &&
                                                    <SelectBox
                                                        id={`${props.type}-create-project-${responsibleEmployeesWithUnit.list.length}-${id}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listDepartments}
                                                        onChange={(e) => {
                                                            setTimeout(() => {
                                                                setResponsibleEmployeesWithUnit({
                                                                    ...responsibleEmployeesWithUnit,
                                                                    currentUnitRow: e[0],
                                                                })
                                                            }, 10);
                                                        }}
                                                        value={responsibleEmployeesWithUnit.currentUnitRow}
                                                        multiple={false}
                                                    />}
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: 250 }}>
                                            <div className={`form-group`}>
                                                {listDepartments && listDepartments.length > 0 &&
                                                    <SelectBox
                                                        id={`${props.type}-select-project-members--${responsibleEmployeesWithUnit.list.length}-${id}`}
                                                        className="form-control select2"
                                                        style={{ width: "100%" }}
                                                        items={listUsers.filter(item =>
                                                            item.text === convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany,
                                                                responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value)
                                                        )}
                                                        onChange={(e) => {
                                                            setTimeout(() => {
                                                                setResponsibleEmployeesWithUnit({
                                                                    ...responsibleEmployeesWithUnit,
                                                                    currentEmployeeRow: e,
                                                                })
                                                            }, 10);
                                                        }}
                                                        value={responsibleEmployeesWithUnit.currentEmployeeRow}
                                                        multiple={true}
                                                    />}
                                            </div>
                                        </td>
                                        <td>
                                            <a className="save text-green" title={translate('general.save')} onClick={handleAddRow}><i className="material-icons">add_circle</i></a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateGeneralTab));