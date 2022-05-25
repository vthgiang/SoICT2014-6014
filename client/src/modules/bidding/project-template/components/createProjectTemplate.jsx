import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectTemplateActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import { convertDateTime, getParticipants } from './functionHelper';
import CreateGeneralTab from "./createGeneralInfo"
import CreateTaskProjectTemplate from "./createTaskProjectTemplate"

const CreateProjectTemplateForm = (props) => {
    const { translate, projectTemplate, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
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
    const userId = getStorage('userId');
    const [currentSalaryMembers, setCurrentSalaryMemData] = useState(undefined);
    const [userSelectOptions, setUserSelectOptions] = useState([]);
    const [selectedTab, setSelectedTab] = useState("general");
    const [generalInfo, setGeneralInfo] = useState({
        projectNameError: undefined,
        projectName: "",
        projectType: 2,
        description: "",
        startDate: '',
        endDate: '',
        projectManager: [],
        responsibleEmployees: [],
        unitCost: fakeUnitCostList[0].value,
        unitTime: fakeUnitTimeList[0].value,
        estimatedCost: ''
    });
    const { projectName, projectNameError, description, projectType, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost } = generalInfo;
    const [tasksInfo, setTasksInfo] = useState([]);
    const [startTime, setStartTimeRq] = useState('08:00 AM');
    const [endTime, setEndTimeRq] = useState('05:30 PM');
    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnitReqData] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    useEffect(() => {
        const op = getParticipants(listUsers, projectManager, responsibleEmployeesWithUnit)
        setUserSelectOptions(op)
    }, [projectManager, responsibleEmployeesWithUnit])


    const isFormValidated = () => {
        let { translate } = props;
        // console.log('\n----------------')
        // console.log(!ValidationHelper.validateName(translate, projectName, 6, 255).status)
        // console.log(projectManager.length === 0)
        // console.log(responsibleEmployeesWithUnit.list.length === 0)
        // console.log(startDate.length === 0)
        // console.log(endDate.length === 0)
        if (!ValidationHelper.validateName(translate, projectName, 6, 255).status) return false;
        if (projectManager.length === 0) return false;
        if (responsibleEmployeesWithUnit.list.length === 0) return false;
        if (startDate.length === 0) return false;
        if (endDate.length === 0) return false;
        if (startDate > endDate) return false;
        return true;
    }

    const save = () => {
        console.log(66, generalInfo, endTime, startTime, responsibleEmployeesWithUnit, currentSalaryMembers)
        console.log(80, tasksInfo)
        if (isFormValidated()) {
            let partStartDate = convertDateTime(startDate, startTime).split('-');
            let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

            let partEndDate = convertDateTime(endDate, endTime).split('-');
            let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

            // Cái này để hiển thị danh sách ra - không quan tâm user nào thuộc unit nào
            let newEmployeesArr = [];
            for (let unitItem of responsibleEmployeesWithUnit.list) {
                for (let userItem of unitItem.listUsers) {
                    newEmployeesArr.push(userItem)
                }
            }


            // props.createProjectDispatch({
            //     name: projectName,
            //     projectType,
            //     startDate: start,
            //     endDate: end,
            //     projectManager,
            //     responsibleEmployees: newEmployeesArr,
            //     description,
            //     unitCost,
            //     unitTime,
            //     estimatedCost,
            //     creator: userId,
            //     responsibleEmployeesWithUnit: currentSalaryMembers,
            // });

            // setTimeout(() => {
            //     props.handleAfterCreateProject()
            // }, 30 * newEmployeesArr.length);
        }
    }

    // Các hàm xử lý tabbedPane
    const handleChangeContent = async (content) => {
        await setSelectedTab(content)
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-project-template" isLoading={false}
                formID="form-create-project-template"
                title={"Thêm mẫu dự án"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={100}
            >
                <form id="form-create-project-template">
                    <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        {/* Tabbed pane */}
                        <ul className="nav nav-tabs">
                            {/* Nút tab thông tin cơ bản */}
                            <li className="active"><a href="#general" onClick={() => handleChangeContent("general")} data-toggle="tab">Thông số và nhân sự mẫu dự án</a></li>
                            {/* Nút tab các bên tgia */}
                            <li><a href="#tasks" onClick={() => handleChangeContent("tasks")} data-toggle="tab">Thêm công việc vào mẫu dự án</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className={selectedTab === "general" ? "active tab-pane" : "tab-pane"} id="general">
                                <CreateGeneralTab
                                    setCurrentSalaryMemData={setCurrentSalaryMemData}
                                    setResponsibleEmployeesWithUnitReqData={setResponsibleEmployeesWithUnitReqData}
                                    setGeneralInfo={setGeneralInfo}
                                    setStartTimeRq={setStartTimeRq}
                                    setEndTimeRq={setEndTimeRq}
                                    setUserSelectOptions={setUserSelectOptions}
                                />
                            </div>
                            <div className={selectedTab === "tasks" ? "active tab-pane" : "tab-pane"} id="tasks">
                                <CreateTaskProjectTemplate
                                    userSelectOptions={userSelectOptions}
                                    setTasksInfo={setTasksInfo}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { projectTemplate, user } = state;
    return { projectTemplate, user }
}

const mapDispatchToProps = {
    createProjectDispatch: ProjectTemplateActions.createProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateProjectTemplateForm));