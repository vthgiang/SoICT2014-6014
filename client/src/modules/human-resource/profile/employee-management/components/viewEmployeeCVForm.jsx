import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ApiImage, DialogModal } from '../../../../../common-components';
import { CareerMajorTab } from '../../employee-create/components/careerMajorTab';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, SalaryTab,
    DisciplineTab, AttachmentTab, ExperiencTab, CertificateTab, ContractTab
} from '../../employee-info/components/combinedContent';

import { EmployeeInfoActions } from '../../employee-info/redux/actions';

class ViewEmployeeCVForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                dataStatus: 0,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps._id !== this.state._id && !nextProps.employeesInfo.isLoading) {
            await this.props.getEmployeeProfile({ id: nextProps._id, callAPIByUser: false });
            this.setState({
                dataStatus: this.DATA_STATUS.QUERYING,
                employees: [],
                annualLeaves: [],
                commendations: [],
                disciplines: [],
                courses: [],
                roles: [],
                career: [],
                major: [],
            })
            return false;
        };
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.employeesInfo.isLoading) {
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                employees: nextProps.employeesInfo.employees,
                annualLeaves: nextProps.employeesInfo.annualLeaves,
                commendations: nextProps.employeesInfo.commendations,
                disciplines: nextProps.employeesInfo.disciplines,
                courses: nextProps.employeesInfo.courses,
                roles: nextProps.employeesInfo.roles,
                career: nextProps.employeesInfo.employees[0].career,
                major: nextProps.employeesInfo.employees[0].major,

            });
            return true;
        };
        return false;
    }

    /**
         * Function format dữ liệu Date thành string
         * @param {*} date : Ngày muốn format
         * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
         */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }
    
    formatSkill = (item) => {
        if(item === "intermediate_degree") return "Trung cấp";
        if(item === "colleges") return "Cao đẳng";
        if(item === "university") return "Đại học";
        if(item === "bachelor") return "Cử nhân";
        if(item === "engineer") return "Kỹ sư";
        if(item === "master_degree") return "Thạc sĩ";
        if(item === "phd") return "Tiến sĩ";
        if(item === "unavailable") return "Không có";
    }

    render() {
        const { employeesInfo, translate } = this.props;

        let { _id, employees, roles = [], career, major } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={`modal-view-cv-form-employee${_id}`} isLoading={employeesInfo.isLoading}
                    formID={`modal-view-cv-form-employee${_id}`}
                    title="LÝ LỊCH CHUYÊN MÔN CỦA NHÂN SỰ"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form className="form-group" id={`modal-view-cv-form-employee${_id}`} style={{ marginTop: "-15px" }}>
                        {employees && employees.length !== 0 &&
                            employees.map((x, index) => (
                                <div key={index}>
                                    <div className="general-info">
                                        {/* Công việc hiện tại */}
                                        <div className=" row box-body">
                                            {/* Ảnh đại diện */}
                                            <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                                                <div>
                                                    {x.avatar && <ApiImage className="attachment-img avarta" id={`avater-imform-${_id}`} src={`.${x.avatar}`} />}
                                                </div>
                                            </div>
                                            <div className="pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12">
                                                <div className="row">
                                                    {/* Chức vụ */}
                                                    <div className="form-group">
                                                        <strong>{translate('page.position')}&emsp; </strong>
                                                        {roles.length !== 0 && roles.map(e => e.roleId.name).join(', ')}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* Họ và tên nhân viên */}
                                                    <div className="form-group ">
                                                        <strong>{translate('human_resource.profile.full_name')}&emsp; </strong>
                                                        {x.fullName}
                                                    </div>
                                                    {/* Ngày sinh */}
                                                    <div className="form-group ">
                                                        <strong>{translate('human_resource.profile.date_birth')}&emsp; </strong>
                                                        {this.formatDate(x.birthdate)}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* Trình độ chuyên môn*/}
                                                    <div className="form-group ">
                                                        <strong>Trình độ chuyên môn&emsp; </strong>
                                                        {this.formatSkill(x.professionalSkill)}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* Chuyên ngành */}
                                                    <div className="form-group">
                                                        <strong>Chuyên ngành&emsp; </strong><br />
                                                        {major?.length > 0 ? (major?.map((e, key) => {
                                                            return <li key={key}> {e?.group?.name} - {e?.specialized?.name} </li>
                                                        })) : <p>Chưa có dữ liệu</p>}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {/* Chứng chỉ */}
                                                    <div className="form-group">
                                                        <strong>Chứng chỉ&emsp; </strong><br />
                                                        {x.certificates?.length > 0 ? x.certificates?.map((e, key) => {
                                                            return <li key={key}> {e?.name} - {e?.issuedBy} - Hiệu lực: {this.formatDate(e?.endDate)} </li>
                                                        }) : <p>Chưa có dữ liệu</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <br />
                                    <br />
                                    <div style={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
                                        <div className="career-info" style={{ display: "flex", flexDirection: 'column', alignItems: "center" }}>
                                            <h4>BẢN KINH NGHIỆM CHUYÊN MÔN</h4>
                                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                                <thead>
                                                    <tr>
                                                        <th>Từ</th>
                                                        <th>Đến</th>
                                                        <th>Kinh nghiệm làm việc</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {career && career.length !== 0 &&
                                                        career.map((x, index) => (
                                                            <tr key={index}>
                                                                <td>{this.formatDate(x.startDate)}</td>
                                                                <td>{this.formatDate(x.endDate)}</td>
                                                                <td style={{ textAlign: "left" }}>
                                                                    <li>
                                                                        <span style={{ fontWeight: "bold" }}>Dự án: </span>{x.package}
                                                                    </li>
                                                                    <li>
                                                                        <span style={{ fontWeight: "bold" }}>Chức vụ: </span>{x.position?.name}
                                                                    </li>
                                                                    <li>
                                                                        <strong>Kinh nghiệm chuyên môn và quản lý có liên quan: </strong>
                                                                        <ul>
                                                                            {x.action?.map((e, key) => {
                                                                                return <li key={key} style={{ listStyle: "lower-roman" }}> {e?.name} </li>
                                                                            })}
                                                                        </ul>
                                                                    </li>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            ))}
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreators = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
}

const detailEmployee = connect(mapState, actionCreators)(withTranslate(ViewEmployeeCVForm));
export { detailEmployee as ViewEmployeeCVForm };