import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
import { getStorage } from '../../../../config';
import { convertDateTime } from '../../../project/projects/components/functionHelper';
import ProjectCreateFormData from '../../../project/projects/components/createProjectContent';
import AddTaskSchedule from '../../../bidding/bidding-contract/component/createProjectTaskCPM';

const CreateProjectByProjectTemplateModal = (props) => {
    const { translate, user, project } = props;
    const userId = getStorage('userId');
    const allUsers = user && user.list
    const listUserDepartment = user && user.usersInUnitsOfCompany;
    const TYPE = {
        DEFAULT: "DEFAULT", // tạo mới project thông thường
        CREATE_BY_CONTRACT: "CREATE_BY_CONTRACT", // tạo mới project theo hợp đồng
        CREATE_BY_TEMPLATE: "CREATE_BY_TEMPLATE", // tạo mới project theo mẫu
    }
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]

    const fakeUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]

    const fakeProjectTypeList = [
        { text: 'QLDA dạng đơn giản', value: 1 },
        { text: 'QLDA phương pháp CPM', value: 2 },
    ]

    const initPrjData = {
        projectName: "",
        projectType: 2,
        description: "",
        startDate: '',
        endDate: '',
        projectManager: [],
        responsibleEmployees: [],
        unitCost: fakeUnitCostList[0].value,
        unitTime: fakeUnitTimeList[0].value,

        tasks: [],
    }
    const [state, setState] = useState(initPrjData);
    const [projectInfo, setProjectInfo] = useState(null);
    const [projectInfoForTaskProps, setProjectInfoForTaskProps] = useState(null); // dùng để truyền props thông tin project xuống tab task project
    const [id, setId] = useState(props.id);
    const [projectTask, setProjectTask] = useState([]);
    const [taskProjectList, setTaskProjectList] = useState([]);// dùng để gửi xuống server
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState(); // [] // dùng để gửi xuống server
    const [form, setForm] = useState();// dùng để gửi xuống server

    const [startTime, setStartTime] = useState('08:00 AM');// dùng để gửi xuống server
    const [endTime, setEndTime] = useState('05:30 PM');// dùng để gửi xuống server

    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    useEffect(() => {
        props.getAllBiddingPackage({ name: '', status: 3, page: 0, limit: 1000 });
    }, [])

    useEffect(() => {
        setId(props.id)
    }, [props.id])

    const fommatDataProject = useCallback(() => {
        const { projectName, projectNameError, description, projectType, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost } = form;

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

        return {
            ...projectInfoForTaskProps,
            name: projectName,
            projectType,
            startDate: start,
            endDate: end,
            projectManager,
            responsibleEmployees: newEmployeesArr,
            description,
            unitCost,
            unitTime,
            estimatedCost,
            creator: userId,
            responsibleEmployeesWithUnit: currentSalaryMembers,
        }
    }, [endTime,
        startTime,
        JSON.stringify(form),
        JSON.stringify(responsibleEmployeesWithUnit),
        JSON.stringify(currentSalaryMembers),
    ])

    useEffect(() => {
        if (endTime && startTime && form && responsibleEmployeesWithUnit && currentSalaryMembers) {
            const data = fommatDataProject();
            setProjectInfoForTaskProps(data);
        }
    }, [
        endTime,
        startTime,
        JSON.stringify(form),
        JSON.stringify(responsibleEmployeesWithUnit),
        JSON.stringify(currentSalaryMembers),
    ])

    useEffect(() => {
        const { data } = props;

        if (data) {
            setState({
                ...state,
                id: data._id,
            })

            let projectData = {
                id: data._id,
                name: `${data.name}`,
                projectType: data.projectType,
                startDate: Date.now(),
                endDate: Date.now(),
                projectManager: data.projectManager?.map(x => x._id),
                responsibleEmployees: data?.responsibleEmployees?.map(x => x._id) ?? [],
                description: data.description,
                unitCost: data.currenceUnit,
                unitTime: data.unitOfTime,
                // creator: userId,
                responsibleEmployeesWithUnit: data.responsibleEmployeesWithUnit ?? [],

                tasks: data.tasks ?? [],
            }
            setProjectInfo(projectData);
            setProjectInfoForTaskProps(projectData);

            let projectTaskData = data.tasks?.map(x => {
                if (x)
                    return {
                        ...x,
                        preceedingTasks: x.preceedingTasks ? x.preceedingTasks.split(",")?.map(s => s?.trim()) : []
                    }
            }) ?? [];
            setProjectTask(projectTaskData);
        }
    }, [props.id])

    // console.log(115, projectInfo, projectTask);

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value,
        });
    }

    const save = () => {
        const { projectName, projectNameError, description, projectType, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost } = form;

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

        // props.createProjectDispatch
        console.log(206, {
            name: projectName,
            projectType,
            startDate: start,
            endDate: end,
            projectManager,
            responsibleEmployees: newEmployeesArr,
            description,
            unitCost,
            unitTime,
            estimatedCost,
            creator: userId,
            responsibleEmployeesWithUnit: currentSalaryMembers,
        });

        console.log(1718, state, projectInfo, projectTask, taskProjectList)
        // props.editBiddingContract(formData, id);
    }

    const isFormValidated = () => {
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, state.code, 3, 255).status) return false;
        if (!ValidationHelper.validateName(translate, state.name, 6, 255).status) return false;
        if (state.startDate.length === 0) return false;
        if (state.endDate.length === 0) return false;

        let splitter = state.startDate.split("-");
        let effectiveDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);
        splitter = state.endDate.split("-");
        let endDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);

        if (effectiveDate > endDate) return false;

        return true;
    }

    return (
        <DialogModal
            modalID={`modal-create-project-by-template--${id}`}
            formID={`form-create-project-by-template--${id}`}
            title="Tạo dự án cho hợp đồng"
            // disableSubmit={!isFormValidated()}
            func={save}
            size={100}
        >
            <form id={`form-create-project-by-template--${id}`}>
                <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                    {/* Tabbed pane */}
                    <ul className="nav nav-tabs">
                        {/* Nút tab thông tin cơ bản */}
                        <li className="active"><a title='Thông tin chung' data-toggle="tab" href={`#project-general-${id}`}>Thông tin chung</a></li>
                        {/* Nút tab các bên tgia */}
                        <li><a title='Công việc dự án' data-toggle="tab" href={`#project-task-${id}`} >Công việc dự án</a></li>
                    </ul>
                    <div className="tab-content">
                        <div id={`project-general-${id}`} className="active tab-pane">
                            <ProjectCreateFormData
                                id={`project-general-${id}`}
                                type={TYPE.CREATE_BY_TEMPLATE}
                                handleStartTime={setStartTime}
                                handleEndTime={setEndTime}
                                handleCurrentSalaryMembers={setCurrentSalaryMembers}
                                handleForm={setForm}
                                handleResponsibleEmployeesWithUnit={setResponsibleEmployeesWithUnit}
                                projectData={projectInfo}
                            />
                        </div>
                        <div id={`project-task-${id}`} className="tab-pane">
                            <AddTaskSchedule
                                type={TYPE.CREATE_BY_TEMPLATE}
                                id={`project-task-${id}`}
                                projectTask={projectTask}
                                projectData={{
                                    ...projectInfoForTaskProps,
                                    responsibleEmployeesWithUnit: currentSalaryMembers
                                }}
                                handleTaskProjectList={setTaskProjectList}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </DialogModal>
    );

}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateProjectByProjectTemplateModal));