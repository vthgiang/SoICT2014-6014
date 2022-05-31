import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox, TimePicker } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from '../redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import { convertDateTime, convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from './functionHelper';
import ProjectCreateFormData from './createProjectContent';

const ProjectCreateForm = (props) => {
    const { translate, project, user } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const [currentSalaryMembers, setCurrentSalaryMembers] = useState(undefined);
    // console.log('listUsers', listUsers)
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
        unitCost: fakeUnitCostList[0].value,
        unitTime: fakeUnitTimeList[0].value,
        estimatedCost: ''
    });

    const [startTime, setStartTime] = useState('08:00 AM');
    const [endTime, setEndTime] = useState('05:30 PM');

    const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
        list: [],
        currentUnitRow: '',
        currentEmployeeRow: [],
    })

    const { projectName, projectNameError, description, projectType, startDate, endDate, projectManager, responsibleEmployees, unitCost, unitTime, estimatedCost } = form;

    const isFormValidated = () => {
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, projectName, 6, 255).status) return false;
        if (projectManager.length === 0) return false;
        if (responsibleEmployeesWithUnit.list.length === 0) return false;
        if (startDate.length === 0) return false;
        if (endDate.length === 0) return false;
        if (startDate > endDate) return false;
        return true;
    }

    const save = () => {
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

            props.createProjectDispatch({
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

            setTimeout(() => {
                props.handleAfterCreateProject()
            }, 30 * newEmployeesArr.length);
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-project" isLoading={false}
                formID="form-create-project"
                title={translate('project.add_title')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
            >
                <ProjectCreateFormData
                    handleStartTime={setStartTime}
                    handleEndTime={setEndTime}
                    handleCurrentSalaryMembers={setCurrentSalaryMembers}
                    handleForm={setForm}
                    handleResponsibleEmployeesWithUnit={setResponsibleEmployeesWithUnit}
                />
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    createProjectDispatch: ProjectActions.createProjectDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectCreateForm));