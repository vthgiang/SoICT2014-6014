import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';

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

        let formater = new Intl.NumberFormat();
        let faliedNumber = 0, passNumber = 0, total = 0;
        if (listEmployees && listEmployees.length !== 0) {
            listEmployees.forEach(x => {
                if (x.result === "failed") {
                    faliedNumber += 1;
                } else {
                    passNumber += 1;
                }
            })
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-course" isLoading={course.isLoading}
                    formID="form-view-course"
                    title={`Khoá đào tạo: ${name} - ${courseId}`}
                    hasSaveButton={false}
                    size={75}
                    maxWidth={850}
                    hasNote={false}
                >
                    <form className="form-group" id="form-view-course" >
                        <div className="form-group">
                            <span> Học tại</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{coursePlace}</span>
                            <span>,&nbsp;từ</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{startDate}&nbsp;</span>
                            <span>đến</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;{endDate}&nbsp;</span>
                            {
                                lecturer && <span>với giảng viên {lecturer}</span>
                            }
                        </div>
                        <div className="form-group">
                            <span>Đào tạo bởi {offeredBy} - Thuộc chương trình đào tạo "{educationProgram.name}"</span>
                        </div>
                        <div className="form-group">
                            <span>Thuộc loại "{type}" với chi phí {formater.format(cost)}{unit} và thời gian cam kết làm việc {employeeCommitmentTime} tháng</span>
                        </div>
                        <div className="form-group">
                            <span>{total} nhân viên tham gia</span>
                            <span className="text-success" style={{ fontWeight: "bold" }}>&nbsp;- {passNumber} hoàn thành&nbsp;</span>
                            <span className="text-danger" style={{ fontWeight: "bold" }}>&nbsp;- {faliedNumber} chưa hoàn thành&nbsp;</span>
                        </div>
                        <div className="form-group">
                            <label className="pull-left">Danh sách nhân viên tham gia:</label>
                        </div>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>Mã nhân viên</th>
                                    <th>Tên nhân viên</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listEmployees !== undefined && listEmployees.length !== 0 &&
                                    listEmployees.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.employee.employeeNumber}</td>
                                            <td>{x.employee.fullName}</td>
                                            <td>{x.result}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {course.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listEmployees === 'undefined' || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
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