import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CourseFormValidator } from './combinedContent';

import { DialogModal, ButtonModal, DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions';
import { CourseActions } from '../redux/actions';

import './courseManager.css';
class CourseCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "VND",
            name: "",
            courseId: "",
            offeredBy: "",
            coursePlace: "",
            startDate: "",
            endDate: "",
            cost: "",
            lecturer: "",
            employeeCommitmentTime: "",
            type: "internal",
            listEmployees: [],
            addEmployees: [],
            educationProgram: "",
        };
    }

    // Bắt sự kiện thay đổi mã khoá đào tạo
    handleCourseIdChange = (e) => {
        const { value } = e.target;
        this.validateCourseId(value, true);
    }
    validateCourseId = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCourseId(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCourseId: msg,
                    courseId: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi tên kháo đào tạo
    handleCourseNameChange = (e) => {
        const { value } = e.target;
        this.validateCourseName(value, true);
    }
    validateCourseName = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCourseName(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCourseName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi địa điểm đào tạo
    handleCoursePlaceChange = (e) => {
        const { value } = e.target;
        this.validateCoursePlace(value, true);
    }
    validateCoursePlace = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCoursePlace(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCoursePlace: msg,
                    coursePlace: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi đơn vị đào tạo
    handleOfferedByChange = (e) => {
        const { value } = e.target;
        this.validateOfferedBy(value, true);
    }
    validateOfferedBy = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateOfferedBy(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOfferedBy: msg,
                    offeredBy: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại đào tạo và giảng viên
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Bắt sự kiện thay chi phí đào tạo
    handleCostChange = (e) => {
        const { value } = e.target;
        this.validateCost(value, true);
    }
    validateCost = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCost(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCost: msg,
                    cost: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thời gian cam kết
    handleEmployeeCommitmentTimeChange = (e) => {
        const { value } = e.target;
        this.validateEmployeeCommitmentTime(value, true);
    }
    validateEmployeeCommitmentTime = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateEmployeeCommitmentTime(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployeeCommitmentTime: msg,
                    employeeCommitmentTime: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thuộc chương trình đào tạo
    handleEducationProgramChange = (value) => {
        if (value[0] !== 'null') {
            let educationInfo = this.props.education.listAll.filter(x => x._id === value[0]);
            this.props.getAllEmployee({ organizationalUnits: educationInfo[0].applyForOrganizationalUnits, position: educationInfo[0].applyForPositions });
        }
        this.setState({ check: true })
        this.validateEducationProgram(value[0], true);
    }
    validateEducationProgram = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateEducationProgram(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEducationProgram: msg,
                    educationProgram: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thời gian bắt đầu
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateStartDate(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi thời gian kết thúc
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateEndDate(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thêm nhân viên tham gia
    handleEmployeeChange = (value) => {
        this.setState({
            addEmployees: value.map(x => { return { _id: x, result: 'failed' } })
        })
    }
    // Bắt sự kiện xoá nhân viên thêm gia
    handleDelete = (id) => {
        this.setState({
            listEmployees: this.state.listEmployees.filter(x => x._id !== id)
        })
    }

    // Bắt sự kiện click buttom thêm nhân viên tham gia
    handleAdd = (e) => {
        e.preventDefault();
        this.setState({
            listEmployees: this.state.listEmployees.concat(this.state.addEmployees),
            addEmployees: [],
        })
    }

    handleResultChange = async (id, value) => {
        let listEmployees = this.state.listEmployees;
        for (let n in listEmployees) {
            if (listEmployees[n]._id === id) {
                if (value === 'pass') {
                    listEmployees[n].result = 'failed'
                } else if (value === 'failed') {
                    listEmployees[n].result = 'pass'
                }
            }
        }
        await this.setState({
            listEmployees: listEmployees
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateCourseId(this.state.courseId, false) && this.validateCourseName(this.state.name, false) &&
            this.validateCoursePlace(this.state.coursePlace, false) && this.validateCost(this.state.cost, false) &&
            this.validateEducationProgram(this.state.educationProgram, false) && this.validateEmployeeCommitmentTime(this.state.employeeCommitmentTime, false) &&
            this.validateEndDate(this.state.endDate, false) && this.validateOfferedBy(this.state.offeredBy, false) && this.validateStartDate(this.state.startDate, false);
        return result;
    }
    save = () => {
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.startDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        let listEmployees = this.state.listEmployees.concat(this.state.addEmployees);
        if (this.isFormValidated()) {
            this.props.createNewCourse({ ...this.state, listEmployees: listEmployees, startDate: startDate, endDate: endDate });
        }
    }

    render() {
        var userlist = [];
        const { education, translate, course, employeesManager } = this.props;
        const { name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees, endDate, cost, lecturer,
            employeeCommitmentTime, educationProgram, errorOnCourseId, errorOnCourseName, errorOnCoursePlace, errorOnOfferedBy,
            errorOnCost, errorOnEmployeeCommitmentTime, errorOnEducationProgram, errorOnStartDate, errorOnEndDate } = this.state;
        var listEducations = education.listAll;
        if (employeesManager.listEmployeesOfOrganizationalUnits.length !== 0 && this.state.check === true) {
            userlist = employeesManager.listEmployeesOfOrganizationalUnits;
        }
        let employeeInfors = [];
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
                <ButtonModal modalID="modal-create-course" button_name="Thêm chương trình đào tạo" title="Thêm chương trình đào tạo" />
                <DialogModal
                    modalID="modal-create-course" isLoading={course.isLoading}
                    formID="form-create-course"
                    title="Thêm khoá đào tạo"
                    func={this.save}
                    size={75}
                    maxWidth={850}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-course" >
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCourseId === undefined ? "" : "has-error"}`}>
                                <label>Mã khoá đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="courseId" value={courseId} onChange={this.handleCourseIdChange} autoComplete="off" />
                                <ErrorLabel content={errorOnCourseId} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCourseName === undefined ? "" : "has-error"}`}>
                                <label>Tên khoá đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleCourseNameChange} autoComplete="off" />
                                <ErrorLabel content={errorOnCourseName} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCoursePlace === undefined ? "" : "has-error"}`}>
                                <label>Địa điểm đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="coursePlace" value={coursePlace} onChange={this.handleCoursePlaceChange} autoComplete="off" />
                                <ErrorLabel content={errorOnCoursePlace} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnOfferedBy === undefined ? "" : "has-error"}`}>
                                <label>Đơn vị đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="offeredBy" value={offeredBy} onChange={this.handleOfferedByChange} autoComplete="off" />
                                <ErrorLabel content={errorOnOfferedBy} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Giảng viên</label>
                                <input type="text" className="form-control" name="lecturer" value={lecturer} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Loại đào tạo<span className="text-red">*</span></label>
                                <select className="form-control" value={type} name="type" onChange={this.handleChange}>
                                    <option value="internal">Đào tạo nội bộ</option>
                                    <option value="external">Đào tạo ngoài</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEducationProgram === undefined ? "" : "has-error"}`}>
                                <label>Thuộc chương trình đào tạo<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`add-educationProgram`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={educationProgram}
                                    items={[...listEducations.map(x => { return { value: x._id, text: x.name } }), { value: 'null', text: 'Chọn chương trình đào tạo' }]}
                                    onChange={this.handleEducationProgramChange}
                                    disabled={listEmployees.length !== 0 ? true : false}
                                />
                                <ErrorLabel content={errorOnEducationProgram} />
                            </div>
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnCost === undefined ? "" : "has-error"}`}>
                                <label>Chi phí đào tạo<span className="text-red">*</span></label>
                                <div>
                                    <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleCostChange} style={{ display: "inline", width: "80%" }} autoComplete="off" placeholder="Chi phí đào tạo" />
                                    <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "20%" }}>
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                                <ErrorLabel content={errorOnCost} />
                            </div>
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEmployeeCommitmentTime === undefined ? "" : "has-error"}`}>
                                <label>Thời gian cam kết (đơn vị: Tháng)<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="employeeCommitmentTime" value={employeeCommitmentTime} onChange={this.handleEmployeeCommitmentTimeChange} autoComplete="off" />
                                <ErrorLabel content={errorOnEmployeeCommitmentTime} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0, marginTop: 20 }}>
                            <label>Nhân viên tham gia</label>
                            <div>
                                <div className="employeeBox2">
                                    <SelectBox
                                        id={`add-employee`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={userlist.map(x => { return { value: x._id, text: `${x.fullName} - ${x.employeeNumber}` } })}
                                        onChange={this.handleEmployeeChange}
                                        multiple={true}
                                    />
                                </div>
                                <button type="button" className="btn btn-success pull-right" style={{ marginBottom: 5 }} onClick={this.handleAdd} title={translate('manage_unit.add_employee_unit')}>{translate('manage_employee.add_staff')}</button>
                            </div>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Mã nhân viên</th>
                                    <th>Tên nhân viên</th>
                                    <th>Kết quả</th>
                                    <th style={{ width: "120px" }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (employeeInfors.length !== 0 && employeeInfors !== undefined) &&
                                    employeeInfors.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.employeeNumber}</td>
                                            <td>{x.fullName}</td>
                                            <td>
                                                <div>
                                                    <div className="radio-inline">
                                                        <input type="radio" name={`result${x._id}`} value="pass" checked={x.result === 'pass'}
                                                            onChange={() => this.handleResultChange(x._id, x.result)} />
                                                        <label>Đạt</label>
                                                    </div>
                                                    <div className="radio-inline">
                                                        <input type="radio" name={`result${x._id}`} value="failed" checked={x.result === "failed"}
                                                            onChange={() => this.handleResultChange(x._id, x.result)} />
                                                        <label>Không đạt</label>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <a className="delete" title="Delete" onClick={() => this.handleDelete(x._id)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {employeesManager.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof employeeInfors === 'undefined' || employeeInfors.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { course, education, employeesManager } = state;
    return { course, education, employeesManager };
};

const actionCreators = {
    createNewCourse: CourseActions.createNewCourse,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,

};

const createForm = connect(mapState, actionCreators)(withTranslate(CourseCreateForm));
export { createForm as CourseCreateForm };