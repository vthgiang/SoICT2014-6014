import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeManagerActions } from '../../employee-management/redux/actions';

import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { LOCAL_SERVER_API } from '../../../../../env';
import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab,
    ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab
} from './combinedContent';
class EmployeeCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: LOCAL_SERVER_API + '/upload/human-resource/avatars/avatar5.png',
            avatar: "",
            employee: {
                avatar: '/upload/human-resource/avatars/avatar5.png',
                gender: "male",
                maritalStatus: "single",
                educationalLevel: "12/12",
                professionalSkill: "unavailable",
                identityCardDate: this.formatDate(Date.now()),
                birthdate: this.formatDate(Date.now()),
                taxDateOfIssue: this.formatDate(Date.now()),
                experiences: [],
                socialInsuranceDetails: [],
                courses: []
            },
            degrees: [],
            certificates: [],
            contracts: [],
            files: [],
            disciplines: [],
            commendations: [],
            salaries: [],
            annualLeaves: [],
        };
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
    }
    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    // Function upload avatar 
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }
    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                [name]: value
            }
        });
    }
    // Function thêm mới kinh nghiệm làm việc
    handleChangeExperience = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                experiences: data
            }
        })
    }
    // Function thêm, chỉnh sửa thông tin bằng cấp
    handleChangeDegree = (data, addData) => {
        this.setState({
            degrees: data
        })
    }
    // Function thêm, chỉnh sửa thông tin chứng chỉ
    handleChangeCertificate = (data, addData) => {
        this.setState({
            certificates: data
        })
    }
    // Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
    handleChangeBHXH = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                socialInsuranceDetails: data
            }
        })
    }
    // Function thêm thông tin hợp đồng lao động
    handleChangeContract = (data, addData) => {
        this.setState({
            contracts: data
        })
    }
    // Function thêm thông tin khen thưởng
    handleChangeConmmendation = (data, addData) => {
        this.setState({
            commendations: data
        })
    }
    // Function thêm thông tin kỷ luật
    handleChangeDiscipline = (data, addData) => {
        this.setState({
            disciplines: data
        })
    }
    // Function thêm thông tin lịch sử lương
    handleChangeSalary = (data, addData) => {
        this.setState({
            salaries: data
        })
    }
    // Function thêm thông tin nghỉ phép
    handleChangeAnnualLeave = (data, addData) => {
        this.setState({
            annualLeaves: data
        })
    }
    // Function thêm thông tin tài liệu đính kèm
    handleChangeFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    // TODO: function thêm thông tin quá trình đào tạo
    handleChangeCourse = (data) => {
        const { employeeNew } = this.state;
        var course = employeeNew.course;
        this.setState({
            employeeNew: {
                ...employeeNew,
                course: [...course, {
                    ...data
                }]
            }
        })
    }
    // function thêm mới thông tin nhân viên
    handleSubmit = async () => {
        let { employee, degrees, certificates, contracts, files,
            disciplines, commendations, salaries, annualLeaves } = this.state;
        await this.setState({
            employee: {
                ...employee,
                degrees,
                certificates,
                contracts,
                files,
                disciplines,
                commendations,
                salaries,
                annualLeaves
            }
        })
        let formData = convertJsonObjectToFormData(this.state.employee);
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })
        certificates.forEach(x => {
            formData.append("fileCertificate", x.fileUpload);
        })
        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", this.state.avatar);
        this.props.addNewEmployee(formData);
    }

    render() {
        const { translate } = this.props;
        return (
            <div className=" qlcv">
                <div className="nav-tabs-custom" >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_employee.menu_general_infor_title')} data-toggle="tab" href="#page_general">{translate('manage_employee.menu_general_infor')}</a></li>
                        <li><a title={translate('manage_employee.menu_contact_infor_title')} data-toggle="tab" href="#thongtinlienhe">{translate('manage_employee.menu_contact_infor')}</a></li>
                        <li><a title={translate('manage_employee.menu_education_experience_title')} data-toggle="tab" href="#kinhnghiem">{translate('manage_employee.menu_education_experience')}</a></li>
                        <li><a title={translate('manage_employee.menu_diploma_certificate_title')} data-toggle="tab" href="#bangcap">{translate('manage_employee.menu_diploma_certificate')}</a></li>
                        <li><a title={translate('manage_employee.menu_account_tax_title')} data-toggle="tab" href="#taikhoan">{translate('manage_employee.menu_account_tax')}</a></li>
                        <li><a title={translate('manage_employee.menu_insurrance_infor_title')} data-toggle="tab" href="#baohiem">{translate('manage_employee.menu_insurrance_infor')}</a></li>
                        <li><a title={translate('manage_employee.menu_contract_training_title')} data-toggle="tab" href="#hopdong">{translate('manage_employee.menu_contract_training')}</a></li>
                        <li><a title={translate('manage_employee.menu_reward_discipline_title')} data-toggle="tab" href="#khenthuong">{translate('manage_employee.menu_reward_discipline')}</a></li>
                        <li><a title={translate('manage_employee.menu_salary_sabbatical_title')} data-toggle="tab" href="#historySalary">{translate('manage_employee.menu_salary_sabbatical')}</a></li>
                        <li><a title={translate('manage_employee.menu_attachments_title')} data-toggle="tab" href="#pageAttachments">{translate('manage_employee.menu_attachments')}</a></li>
                    </ul>
                    < div className="tab-content">
                        <GeneralTab
                            id="page_general"
                            img={this.state.img}
                            handleChange={this.handleChange}
                            handleUpload={this.handleUpload}
                            employee={this.state.employee}
                        />
                        <ContactTab
                            id="thongtinlienhe"
                            handleChange={this.handleChange}
                            employee={this.state.employee}
                        />
                        <ExperienceTab
                            id="kinhnghiem"
                            employee={this.state.employee}
                            handleChange={this.handleChange}
                            handleAddExperience={this.handleChangeExperience}
                            handleEditExperience={this.handleChangeExperience}
                            handleDeleteExperience={this.handleChangeExperience}
                        />
                        <CertificateTab
                            id="bangcap"
                            degrees={this.state.degrees}
                            certificates={this.state.certificates}
                            handleAddDegree={this.handleChangeDegree}
                            handleEditDegree={this.handleChangeDegree}
                            handleDeleteDegree={this.handleChangeDegree}
                            handleAddCertificate={this.handleChangeCertificate}
                            handleEditCertificate={this.handleChangeCertificate}
                            handleDeleteCertificate={this.handleChangeCertificate}
                        />
                        <TaxTab
                            id="taikhoan"
                            employee={this.state.employee}
                            handleChange={this.handleChange} />
                        <InsurranceTab
                            id="baohiem"
                            socialInsuranceDetails={this.state.employee.socialInsuranceDetails}
                            employee={this.state.employee}
                            handleChange={this.handleChange}
                            handleAddBHXH={this.handleChangeBHXH}
                            handleEditBHXH={this.handleChangeBHXH}
                            handleDeleteBHXH={this.handleChangeBHXH}
                        />
                        <ContractTab
                            id="hopdong"
                            contracts={this.state.contracts}
                            courses={this.state.employee.courses}
                            handleAddContract={this.handleChangeContract}
                            handleEditContract={this.handleChangeContract}
                            handleDeleteContract={this.handleChangeContract}
                        />
                        <DisciplineTab
                            id="khenthuong"
                            commendations={this.state.commendations}
                            disciplines={this.state.disciplines}
                            handleAddConmmendation={this.handleChangeConmmendation}
                            handleEditConmmendation={this.handleChangeConmmendation}
                            handleDeleteConmmendation={this.handleChangeConmmendation}
                            handleAddDiscipline={this.handleChangeDiscipline}
                            handleEditDiscipline={this.handleChangeDiscipline}
                            handleDeleteDiscipline={this.handleChangeDiscipline}
                        />
                        <SalaryTab
                            id="historySalary"
                            salaries={this.state.salaries}
                            annualLeaves={this.state.annualLeaves}
                            handleAddSalary={this.handleChangeSalary}
                            handleEditSalary={this.handleChangeSalary}
                            handleDeleteSalary={this.handleChangeSalary}
                            handleAddAnnualLeave={this.handleChangeAnnualLeave}
                            handleEditAnnualLeave={this.handleChangeAnnualLeave}
                            handleDeleteAnnualLeave={this.handleChangeAnnualLeave}
                        />
                        <FileTab
                            id="pageAttachments"
                            files={this.state.files}
                            employee={this.state.employee}
                            handleChange={this.handleChange}
                            handleAddFile={this.handleChangeFile}
                            handleEditFile={this.handleChangeFile}
                            handleDeleteFile={this.handleChangeFile}
                            handleSubmit={this.handleSubmit}
                        />
                    </div>
                </div>
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager} = state;
    return { employeesManager};
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
};

const createPage = connect(mapState, actionCreators)(withTranslate(EmployeeCreatePage));
export { createPage as EmployeeCreatePage };