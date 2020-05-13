import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectMulti } from '../../../../common-components';

class CourseDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                unit: nextProps.unit,
                name: nextProps.name,
                courseId: nextProps.courseId,
                offeredBy: nextProps.offeredBy,
                coursePlace: nextProps.coursePlace,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                cost: nextProps.cost,
                lecturer: nextProps.lecturer,
                educationProgram: nextProps.educationProgram,
                employeeCommitmentTime: nextProps.employeeCommitmentTime,
                type: nextProps.type,
                listEmployees: nextProps.listEmployees,
                addEmployees: [],
            }
        } else {
            return null;
        }
    }
    render() {
        var { course, translate } = this.props
        const { name, courseId, type, offeredBy, coursePlace, startDate, unit, listEmployees,
            endDate, cost, lecturer, employeeCommitmentTime, educationProgram } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-course" isLoading={course.isLoading}
                    formID="form-view-course"
                    title="Thông tin khoá đào tạo"
                    hasSaveButton={false}
                    size={75}
                    maxWidth={850}
                >
                    <form className="form-group" id="form-view-course" >
                        <div>
                            <h4 style={{ display: "inline-block", fontWeight: "600" }}>
                                {name} - {courseId}
                            </h4>
                            <div className="form-group">
                                <span> Học tại</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{coursePlace}</span>
                                <span>,&nbsp;từ</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{startDate}&nbsp;</span>
                                <span>đến</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{endDate}&nbsp;</span>
                                {
                                    lecturer && <span>với giảng viên {lecturer}</span>
                                }
                            </div>
                            <div className="form-group">
                                <span>Đào tạo bởi</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{offeredBy}&nbsp;</span>
                                <span>- Thuộc chương trình đào tạo</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{educationProgram.name}&nbsp;</span>


                            </div>
                            <div className="form-group">
                                <span>Thuộc loại</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{type}&nbsp;</span>
                                <span>với chi phí</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{cost}{unit}&nbsp;</span>
                                <span>và thời gian cam kết làm việc</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;{employeeCommitmentTime} tháng&nbsp;</span>
                            </div>
                            <div className="form-group">
                                <span>60 nhân viên tham gia</span>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;- 56 hoàn thành - 4 chưa hoàn thành&nbsp;</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="pull-left">Nhân viên tham gia</label>
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
                        {course.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listEmployees === 'undefined' || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }


                        {/* <div className="col-md-12">
                                            <div className="col-md-6">
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Mã khoá đào tạo:&emsp; </strong>
                                                    {courseId}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Thời gian bắt đầu:&emsp; </strong>
                                                    {startDate}
                                                </div>
                                                <div className="form-group" >
                                                    <strong>Địa điểm đào tạo:&emsp; </strong>
                                                    {coursePlace}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Giảng viên:&emsp; </strong>
                                                    {lecturer}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Thuộc chương trình đào tạo:&emsp; </strong>
                                                    {educationProgram.name}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Thời gian cam kết:&emsp; </strong>
                                                    {employeeCommitmentTime} Tháng
                                                        </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group" style={{ marginTop: 20 }} >
                                                    <strong>Tên khoá đào tạo:&emsp; </strong>
                                                    {name}
                                                </div>

                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Thời gian kết thúc:&emsp; </strong>
                                                    {endDate}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Đơn vị đào tạo:&emsp; </strong>
                                                    {offeredBy}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Loại đào tạo:&emsp; </strong>
                                                    {type}
                                                </div>
                                                <div className="form-group" style={{ marginTop: 20 }}>
                                                    <strong>Chi phí đào tạo:&emsp; </strong>
                                                    {cost} {unit}
                                                </div>

                                            </div>
                                            <div className="col-md-12"> */}

                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapState(state) {
    const { course } = state;
    return { course };
};
const detailForm = connect(mapState, null)(withTranslate(CourseDetailForm));
export { detailForm as CourseDetailForm };