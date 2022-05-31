import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components';
import { BiddingContractActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { BiddingPackageManagerActions } from '../../bidding-package/biddingPackageManagement/redux/actions';
import { getStorage } from '../../../../config';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
import { DecisionForImplement } from './decisionAssignImplementContract';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { convertDateTime, getListDepartments } from '../../../project/projects/components/functionHelper';
import ProjectCreateFormData from '../../../project/projects/components/createProjectContent';
import { getDecisionDataWhenUpdateBidPackage, getProjectTaskDataWhenCreateByContract } from './functionHelper';
import { ProjectTaskForm } from './createProjectTaskList';
import AddTaskSchedule from './createProjectTaskCPM';

const CreateProjectByContractModal = (props) => {
    const { translate, biddingContract, biddingPackagesManager, user, project } = props;
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

    const initState = {
        contractNameError: undefined,
        contractCodeError: undefined,

        id: "",

        code: "",
        name: "",
        effectiveDate: "",
        endDate: "",
        unitOfTime: fakeUnitTimeList[0].value,
        budget: 0,
        currenceUnit: fakeUnitCostList[0].value,

        companyA: "",
        addressA: "",
        phoneA: "",
        emailA: "",
        taxCodeA: "",
        representativeNameA: "",
        representativeRoleA: "",
        bankNameA: "",
        bankAccountNumberA: "",

        companyB: "",
        addressB: "",
        phoneB: "",
        emailB: "",
        taxCodeB: "",
        representativeNameB: "",
        representativeRoleB: "",
        bankNameB: "",
        bankAccountNumberB: "",

        decideToImplement: null,
        biddingPackage: null,
        project: null,

        // projectInfo: null,
        // projectTask: [],

        selectedTab: 'general'
    }
    const initPrjData = {
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
    }
    const [state, setState] = useState(initState);
    const [projectInfo, setProjectInfo] = useState(null);
    const [id, setId] = useState(props.id);
    const [projectTask, setProjectTask] = useState([]);
    const [taskProjectList, setTaskProjectList] = useState([]);
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState(undefined);
    const [prjForAddTaskProps, setPrjForAddTaskProps] = useState();
    const [form, setForm] = useState();

    const [startTime, setStartTime] = useState('08:00 AM');
    const [endTime, setEndTime] = useState('05:30 PM');

    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    const listBiddingPackages = biddingPackagesManager?.listBiddingPackages;

    useEffect(() => {
        props.getAllBiddingPackage({ name: '', status: 3, page: 0, limit: 1000 });
    }, [])

    useEffect(() => {
        setId(props.id)
    }, [props.id])

    // useEffect(() => {
    //     if (projectInfo) {
    //         setPrjForAddTaskProps({ ...projectInfo, responsibleEmployeesWithUnit: currentSalaryMembers })
    //     }

    // }, [JSON.stringify(currentSalaryMembers)])

    useEffect(() => {
        const { data } = props;

        if (data) {
            setState({
                ...state,
                id: data._id,

                code: data.code,
                name: data.name,
                effectiveDate: formatDate(data.effectiveDate),
                endDate: formatDate(data.endDate),
                unitOfTime: fakeUnitTimeList.find(x => x.value === data.unitOfTime).value,
                budget: data.budget,
                currenceUnit: fakeUnitCostList.find(x => x.value === data.currenceUnit).value,

                companyA: data.partyA.company,
                addressA: data.partyA.address,
                phoneA: data.partyA.phone,
                emailA: data.partyA.email,
                taxCodeA: data.partyA.taxCode,
                representativeNameA: data.partyA.representative.name,
                representativeRoleA: data.partyA.representative.role,
                bankNameA: data.partyA.bank.name,
                bankAccountNumberA: data.partyA.bank.accountNumber,

                companyB: data.partyB.company,
                addressB: data.partyB.address,
                phoneB: data.partyB.phone,
                emailB: data.partyB.email,
                taxCodeB: data.partyB.taxCode,
                representativeNameB: data.partyB.representative.name,
                representativeRoleB: data.partyB.representative.role,
                bankNameB: data.partyB.bank.name,
                bankAccountNumberB: data.partyB.bank.accountNumber,

                biddingPackage: data.biddingPackage?._id,
                project: data.project,

                decideToImplement: data.decideToImplement,

                files: data.files,
            })

            let projectData = {
                code: data.code,
                name: `Dự án ${data.biddingPackage?.name}`,
                projectType: 2,
                startDate: data.effectiveDate,
                endDate: data.endDate,
                projectManager: data.decideToImplement?.projectManager,
                responsibleEmployees: data.decideToImplement?.responsibleEmployees ?? [],
                // description,
                unitCost: data.currenceUnit,
                unitTime: data.unitOfTime,
                estimatedCost: data.budget,
                creator: userId,
                responsibleEmployeesWithUnit: data.decideToImplement?.responsibleEmployeesWithUnit ?? [],
            }
            setProjectInfo(projectData);

            let projectTaskData = getProjectTaskDataWhenCreateByContract(data.biddingPackage, allUsers);
            setProjectTask(projectTaskData);
        }
    }, [props.id])

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
        if (state.effectiveDate.length === 0) return false;
        if (state.endDate.length === 0) return false;

        let splitter = state.effectiveDate.split("-");
        let effectiveDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);
        splitter = state.endDate.split("-");
        let endDate = new Date(`${splitter[2]}-${splitter[1]}-${splitter[0]}`);

        if (effectiveDate > endDate) return false;

        return true;
    }

    return (
        <DialogModal
            modalID={`modal-create-project-for-contract--${id}`}
            formID={`form-create-project-for-contract--${id}`}
            title="Tạo dự án cho hợp đồng"
            disableSubmit={!isFormValidated()}
            func={save}
            size={100}
        >
            <form id={`form-edit-bidding-contract-${id}`}>
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
                                type={TYPE.CREATE_BY_CONTRACT}
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
                                type={TYPE.CREATE_BY_CONTRACT}
                                id={`project-task-${id}`}
                                projectTask={projectTask}
                                projectData={{ ...projectInfo, responsibleEmployeesWithUnit: currentSalaryMembers }}
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateProjectByContractModal));