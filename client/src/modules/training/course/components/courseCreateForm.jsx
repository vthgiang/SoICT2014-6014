import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, DatePicker, ErrorLabel, SelectBox } from '../../../../common-components';


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
            educationProgram: "",
            employeeCommitmentTime: "",
            type: "internal",
            listEmployees: [],

        };
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    handleEducationProgramChange = (value) => {
        this.setState({
            educationProgram: value,
        })

    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value,
        })
    }

    handleEndDateChange = (value) => {
        this.setState({
            endDate: value,
        })
    }

    handleEmployeeChange = (value) => {
        this.setState({
            addEmployees: value
        })
    }

    handleAdd = (e) => {
        e.preventDefault();
        this.setState({
            listEmployees: this.state.listEmployees.concat(this.state.addEmployees),
            addEmployees: [],
        })
    }

    save = () => {
        this.props.createNewCourse(this.state);
    }

    render() {
        const { education, translate, user } = this.props;
        const { name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees,
            endDate, cost, lecturer, employeeCommitmentTime, educationProgram } = this.state;
        var listEducations = this.props.education.listAll;
        var userlist = user.list, infoEmployee = [];
        for (let n in listEmployees) {
            userlist = userlist.filter(x => x._id !== listEmployees[n]);
            infoEmployee = user.list.filter(x => x._id === listEmployees[n]).concat(infoEmployee)
        }
        // Lấy thông tin name và email của nhân viên đơn vị
        for (let n in listEmployees) {

        }
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-course" button_name="Thêm chương trình đào tạo" title="Thêm chương trình đào tạo" />
                <DialogModal
                    modalID="modal-create-course" isLoading={education.isLoading}
                    formID="form-create-course"
                    title="Thêm khoá đào tạo"
                    func={this.save}
                    disableSubmit={false}
                    size={75}
                    maxWidth={850}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-course" >
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Mã khoá đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="courseId" value={courseId} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Tên khoá đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Địa điểm đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="coursePlace" value={coursePlace} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Đơn vị đào tạo<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="offeredBy" value={offeredBy} onChange={this.handleChange} autoComplete="off" />
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
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thuộc chương trình đào tạo<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`add-educationProgram`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={educationProgram}
                                    items={[...listEducations.map(x => { return { value: x._id, text: x.name } }), { value: "", text: 'Chọn chương trình đào tạo' }]}
                                    onChange={this.handleEducationProgramChange}
                                />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Chi phí đào tạo<span className="text-red">*</span></label>
                                <div>
                                    <input type="number" className="form-control" name="cost" value={cost} onChange={this.handleChange} style={{ display: "inline", width: "80%" }} autoComplete="off" placeholder="Chi phí đào tạo" />
                                    <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "20%" }}>
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian cam kết (đơn vị: Tháng)<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="employeeCommitmentTime" value={employeeCommitmentTime} onChange={this.handleChange} autoComplete="off" />
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
                                        items={userlist.map(x => { return { value: x._id, text: x.name } })}
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
                            </tbody>
                        </table>
                        {user.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listEmployees === 'undefined' || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
};

function mapState(state) {
    const { course, education, user } = state;
    return { course, education, user };
};

const actionCreators = {
    createNewCourse: CourseActions.createNewCourse,

};

const createForm = connect(mapState, actionCreators)(withTranslate(CourseCreateForm));
export { createForm as CourseCreateForm };