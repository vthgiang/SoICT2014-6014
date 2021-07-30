import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import { CourseActions } from '../redux/actions';

const CourseRegister = (props) => {
    const [state, setState] = useState({...props, addEmployees: []})

    useEffect(() => {
        const { applyForOrganizationalUnits, applyForPositions } = state;
        props.getAllEmployee({ organizationalUnits: applyForOrganizationalUnits, position: applyForPositions });
    }, [])

    const save = () => {
        let { startDate, endDate, listEmployees } = state;

        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let partEnd = endDate.split('-');
        let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        const subscriber = {
            employee: localStorage.getItem('userId'),
            registerType: 1
        }
        
        listEmployees = listEmployees.concat(state.addEmployees);
        props.updateCourse(state._id, { ...state, subscriber: subscriber, listEmployees: listEmployees, startDate: startDateNew, endDate: endDateNew });

    }

    if (props._id !== state._id) {
        setState({
            ...state,
            _id: props._id,
            unit: props.unit,
            name: props.name,
            courseId: props.courseId,
            offeredBy: props.offeredBy,
            coursePlace: props.coursePlace,
            startDate: props.startDate,
            endDate: props.endDate,
            cost: props.cost,
            lecturer: props.lecturer,
            applyForOrganizationalUnits: props.applyForOrganizationalUnits,
            applyForPositions: props.applyForPositions,
            educationProgram: props.educationProgram,
            employeeCommitmentTime: props.employeeCommitmentTime,
            type: props.type,
            listEmployees: props.listEmployees,
            addEmployees: [],
            registeredEmployees: props.registeredEmployees,
            errorOnCourseName: undefined,
            errorOnCoursePlace: undefined,
            errorOnOfferedBy: undefined,
            errorOnCost: undefined,
            errorOnEmployeeCommitmentTime: undefined,
            errorOnEducationProgram: undefined,
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
        })
    }
    
    const { education, translate, course, employeesManager } = props;

    const { _id, name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees, endDate, cost, lecturer,
        employeeCommitmentTime, educationProgram, errorOnCourseName, errorOnCoursePlace, errorOnOfferedBy,
        errorOnCost, errorOnEmployeeCommitmentTime, errorOnEducationProgram, errorOnStartDate, errorOnEndDate } = state;

    let listEducations = education.listAll, employeeInfors = [], userlist = [];

    if (employeesManager.listEmployeesOfOrganizationalUnits.length !== 0) {
        userlist = employeesManager.listEmployeesOfOrganizationalUnits;
    }

    if (listEmployees.length !== 0) {
        for (let n in listEmployees) {
            userlist = userlist.filter(x => x._id !== listEmployees[n]._id);
            let employeeInfor = employeesManager.listEmployeesOfOrganizationalUnits.filter(x => x._id === listEmployees[n]._id);
            employeeInfor[0] = { ...employeeInfor[0], result: listEmployees[n].result }
            employeeInfors = employeeInfor.concat(employeeInfors);
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-course${_id}`} isLoading={course.isLoading}
                formID={`form-edit-course${_id}`}
                title={translate('training.course.register')} 
                func={save}
                size={75}
                maxWidth={850}
                saveText={translate('training.course.register')}
            >
                <div className="row">
                        {/* Mã khoá đào tạo*/}
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>{translate('training.course.table.course_code')}: {courseId}</label>
                        </div>
                        {/* Tên khoá đào tạo*/}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnCourseName && "has-error"}`}>
                            <label>{translate('training.course.table.course_name')}: {name}</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* Thời gian bắt đầu */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                            <label>{translate('training.course.start_date')}: {startDate}</label>
                        </div>
                        {/* Thời gian kết thúc */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                            <label>{translate('training.course.end_date')}: {endDate}</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* Địa điểm đào tạo */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnCoursePlace && "has-error"}`}>
                            <label>{translate('training.course.table.course_place')}: {coursePlace}</label>
                        </div>
                        {/* Đơn vị đào tạo */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnOfferedBy && "has-error"}`}>
                            <label>{translate('training.course.table.offered_by')}: {offeredBy}</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* Giảng viên */}
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>{translate('training.course.table.lecturer')}: {lecturer}</label>
                        </div>
                        {/* Loại đào tạo */}
                        <div className="form-group col-sm-6 col-xs-12">
                            <label>{translate('training.course.table.course_type')}: {type}</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* Thuộc chương trình đào tạo*/}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnEducationProgram && "has-error"}`}>
                            <label>{translate('training.course.table.education_program')}: {educationProgram.name}</label>
                        </div>
                        {/* Chi phi đào tạo */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnCost && "has-error"}`}>
                            <label>{translate('training.course.table.cost')}: {cost}</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* Thời gian cam kêt */}
                        <div className={`form-group col-sm-6 col-xs-12 ${errorOnEmployeeCommitmentTime && "has-error"}`}>
                            <label>{translate('training.course.table.employee_commitment_time')}: {employeeCommitmentTime}</label>
                        </div>
                    </div>
            </DialogModal>
        </React.Fragment >
    );
};

function mapState(state) {
    const { course, education, employeesManager } = state;
    return { course, education, employeesManager };
};

const actionCreators = {
    updateCourse: CourseActions.updateCourse,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const courseRegister = connect(mapState, actionCreators)(withTranslate(CourseRegister));
export { courseRegister as CourseRegister};