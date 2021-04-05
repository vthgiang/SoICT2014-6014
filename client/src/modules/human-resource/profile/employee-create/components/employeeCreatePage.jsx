import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab, ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab, CareerMajorTab } from './combinedContent';
import FamilyMemberTab from './familyMemberTab';

import { EmployeeManagerActions } from '../../employee-management/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { generateCode } from "../../../../../helpers/generateCode";

const initMember = {
    name: '',
    codeSocialInsurance: '',
    bookNumberSocialInsurance: '',
    gender: 'male',
    isHeadHousehold: 'no',
    relationshipWithHeadHousehold: '',
    cnss: '',
    birth: '',
    placeOfBirthCertificate: '',
    nationality: '',
    nation: '',
    numberPassport: '',
    note: ''
}
class EmployeeCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: './upload/human-resource/avatars/avatar5.png',
            avatar: "",
            employee: {
                avatar: '/upload/human-resource/avatars/avatar5.png',
                gender: "male",
                maritalStatus: "single",
                educationalLevel: "",
                professionalSkill: "unavailable",
                status: 'active',
                identityCardDate: this.formatDate2(Date.now()),
                birthdate: this.formatDate2(Date.now()),
                experiences: [],
                socialInsuranceDetails: [],
            },
            courses: [],
            degrees: [],
            certificates: [],
            contracts: [],
            files: [],
            disciplines: [],
            commendations: [],
            annualLeaves: [],
            major: [],
            career: [],
            houseHold: {
                headHouseHoldName: '',
                documentType: '',
                houseHoldNumber: '',
                city: '',
                district: '',
                ward: '',
                houseHoldAddress: '',
                phone: '',
                houseHoldCode: '',
                familyMembers: []
            },
            editMember: initMember,
        };
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
     */
    formatDate2(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear) {
                return [year, month].join('-');
            } else return [year, month, day].join('-');
        }
        return date;

    }

    componentDidMount() {
        this.props.getDepartment();
    }

    /**
     * Function upload avatar
     * @param {*} img : 
     * @param {*} avatar :
     */
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    handleChange = (name, value) => {
        const { employee } = this.state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' ||
            name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        this.setState({
            employee: {
                ...employee,
                [name]: value
            }
        });
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    handleChangeExperience = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                experiences: data
            }
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm
     */
    handleChangeDegree = (data, addData) => {
        this.setState({
            degrees: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    handleChangeCertificate = (data, addData) => {
        this.setState({
            certificates: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu thông tin quá trình đóng BHXH
     * @param {*} addData : Quá trình đóng BHXH muốn thêm
     */
    handleChangeBHXH = (data, addData) => {
        const { employee } = this.state;
        this.setState({
            employee: {
                ...employee,
                socialInsuranceDetails: data
            }
        })
    }

    /**
     *Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng
     * @param {*} addData : Hợp đồng muốn thêm
     */
    handleChangeContract = (data, addData) => {
        this.setState({
            contracts: data
        })
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    handleChangeConmmendation = (data, addData) => {
        this.setState({
            commendations: data
        })
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    handleChangeDiscipline = (data, addData) => {
        this.setState({
            disciplines: data
        })
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : thông tin nghỉ phép muốn thêm
     */
    handleChangeAnnualLeave = (data, addData) => {
        this.setState({
            annualLeaves: data
        })
    }

    /**
     * Function thêm thông tin tài liệu đính kèm
     * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    handleChangeFile = (data, addData) => {
        this.setState({
            files: data
        })
    }

    /**
     * Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu thông tin quá trình đào tạo
     */
    handleChangeCourse = (data) => {
        this.setState({
            courses: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin chuyên ngành tương đương
     * @param {*} data : Dữ liệu thông tin chuyên ngành tương đương
     * @param {*} addData : Chuyên ngành tương đương muốn thêm
     */
    handleChangeMajor = (data, addData) => {
        this.setState({
            major: data
        })
    }

    /**
     * Function thêm, chỉnh sửa thông tin công việc tương đương
     * @param {*} data : Dữ liệu thông tin công việc tương đương
     * @param {*} addData : Công việc tương đương muốn thêm
     */
    handleChangeCareer = (data, addData) => {
        this.setState({
            career: data
        })
    }

    /**
     * Function thêm mới thông tin nhân viên
     */
    handleSubmit = async () => {
        let { employee, degrees, certificates, contracts, files, avatar,
            disciplines, commendations, annualLeaves, courses, major, career, houseHold } = this.state;

        await this.setState({
            employee: {
                ...employee,
                degrees,
                certificates,
                contracts,
                files,
                disciplines,
                commendations,
                annualLeaves,
                courses,
                career,
                major,
                houseHold,
            }
        })

        let formData = convertJsonObjectToFormData({ ...this.state.employee });
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
        major.forEach(x => {
            formData.append("fileMajor", x.fileUpload);
        })
        career.forEach(x => {
            formData.append("fileCareer", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);
        employee && employee.healthInsuranceAttachment && employee.healthInsuranceAttachment.forEach(x => {
            formData.append('healthInsuranceAttachment', x.fileUpload)
        })
        this.props.addNewEmployee(formData);
    }

    _fm_saveMember = (data) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                familyMembers: [...this.state.houseHold.familyMembers, data]
            }
        })
    }

    _fm_handleHeadHouseHoldName = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                headHouseHoldName: e.target.value
            }
        });
    }

    _fm_handleDocumentType = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                documentType: e.target.value
            }
        });
    }

    _fm_handleHouseHoldNumber = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                houseHoldNumber: e.target.value
            }
        })
    }

    _fm_handleCity = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                city: e.target.value
            }
        })
    }

    _fm_handleDistrict = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                district: e.target.value
            }
        });
    }

    _fm_handleWard = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                ward: e.target.value
            }
        });
    }

    _fm_handleHouseHoldAddress = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                houseHoldAddress: e.target.value
            }
        })
    }

    _fm_handlePhone = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                phone: e.target.value
            }
        });
    }

    _fm_handleHouseHoldCode = (e) => {
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                houseHoldCode: e.target.value
            }
        });
    }


    _fm_editMember = (index, data) => {
        let familyMembers = this.state.houseHold.familyMembers;
        familyMembers[index] = data;
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                familyMembers
            }
        })
    }

    _fm_deleteMember = (index) => {
        let familyMembers = this.state.houseHold.familyMembers;
        familyMembers = familyMembers.filter((node, i) => i !== index);
        this.setState({
            houseHold: {
                ...this.state.houseHold,
                familyMembers
            }
        })
    }

    regenerateCode = () => {
        let code = generateCode("NV");
        let { employeeNumber, employeeTimesheetId } = this.state.employee;
        if (!employeeNumber && !employeeTimesheetId)
            this.setState((state) => ({
                ...state,
                employee: {
                    ...state.employee,
                    employeeNumber: code,
                    employeeTimesheetId: code,
                }
            }));
    }

    componentDidMount = () => {
        this.regenerateCode();
    }
    render() {
        const { translate } = this.props;

        const { img, employee, degrees, certificates, contracts, courses, commendations, disciplines, annualLeaves, files, major, career, editMember } = this.state;

        return (
            <div className=" qlcv">
                <div className="nav-tabs-custom" >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#page_general">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#thongtinlienhe">{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href="#kinhnghiem">{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href="#bangcap">{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href="#taikhoan">{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href="#baohiem">{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href="#hopdong">{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href="#khenthuong">{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                        <li><a title={translate('menu.annual_leave_personal')} data-toggle="tab" href="#historySalary">{translate('menu.annual_leave_personal')}</a></li>
                        <li><a title={"Công việc - chuyên ngành tương đương"} data-toggle="tab" href="#major_career">Công việc - chuyên ngành tương đương</a></li>
                        <li><a title={"Thành viên hộ gia đình"} data-toggle="tab" href="#family_member">Thành viên hộ gia đình</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href="#pageAttachments">{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                    </ul>
                    < div className="tab-content">
                        {/* Tab thông tin chung */}
                        <GeneralTab
                            id="page_general"
                            img={img}
                            handleChange={this.handleChange}
                            handleUpload={this.handleUpload}
                            employee={employee}
                        />
                        {/* Tab thông tin liên hệ */}
                        <ContactTab
                            id="thongtinlienhe"
                            handleChange={this.handleChange}
                            employee={employee}
                        />
                        {/* Tab học vẫn - kinh nghiệm làm việc*/}
                        <ExperienceTab
                            id="kinhnghiem"
                            employee={employee}
                            handleChange={this.handleChange}

                            handleAddExperience={this.handleChangeExperience}
                            handleEditExperience={this.handleChangeExperience}
                            handleDeleteExperience={this.handleChangeExperience}
                        />
                        {/* Tab bằng cấp - chứng chỉ */}
                        <CertificateTab
                            id="bangcap"
                            degrees={degrees}
                            certificates={certificates}
                            handleAddDegree={this.handleChangeDegree}
                            handleEditDegree={this.handleChangeDegree}
                            handleDeleteDegree={this.handleChangeDegree}

                            handleAddCertificate={this.handleChangeCertificate}
                            handleEditCertificate={this.handleChangeCertificate}
                            handleDeleteCertificate={this.handleChangeCertificate}
                        />
                        {/* Tab tài khoản - Thuế */}
                        <TaxTab
                            id="taikhoan"
                            employee={employee}
                            handleChange={this.handleChange} />
                        {/* Tab  bảo hiểm */}
                        <InsurranceTab
                            id="baohiem"
                            pageCreate={true}
                            socialInsuranceDetails={employee.socialInsuranceDetails}
                            employee={employee}
                            handleChange={this.handleChange}

                            handleAddBHXH={this.handleChangeBHXH}
                            handleEditBHXH={this.handleChangeBHXH}
                            handleDeleteBHXH={this.handleChangeBHXH}
                        />
                        {/* Tab hợp đồng - quá trình đào tạo */}
                        <ContractTab
                            id="hopdong"
                            pageCreate={true}
                            employee={employee}
                            contracts={contracts}
                            courses={courses}
                            handleChange={this.handleChange}

                            handleAddContract={this.handleChangeContract}
                            handleEditContract={this.handleChangeContract}
                            handleDeleteContract={this.handleChangeContract}

                            handleAddCourse={this.handleChangeCourse}
                            handleEditCourse={this.handleChangeCourse}
                            handleDeleteCourse={this.handleChangeCourse}
                        />
                        {/* Tab khen thưởnng - kỷ luật */}
                        <DisciplineTab
                            id="khenthuong"
                            commendations={commendations}
                            disciplines={disciplines}

                            handleAddConmmendation={this.handleChangeConmmendation}
                            handleEditConmmendation={this.handleChangeConmmendation}
                            handleDeleteConmmendation={this.handleChangeConmmendation}

                            handleAddDiscipline={this.handleChangeDiscipline}
                            handleEditDiscipline={this.handleChangeDiscipline}
                            handleDeleteDiscipline={this.handleChangeDiscipline}
                        />
                        {/* Tab lương thưởng - nghỉ phép */}
                        <SalaryTab
                            id="historySalary"
                            pageCreate={true}
                            annualLeaves={annualLeaves}

                            handleAddAnnualLeave={this.handleChangeAnnualLeave}
                            handleEditAnnualLeave={this.handleChangeAnnualLeave}
                            handleDeleteAnnualLeave={this.handleChangeAnnualLeave}
                        />
                        {/* Tab tài liệu đính kèm */}
                        <FileTab
                            id="pageAttachments"
                            files={files}
                            employee={employee}
                            handleChange={this.handleChange}

                            handleAddFile={this.handleChangeFile}
                            handleEditFile={this.handleChangeFile}
                            handleDeleteFile={this.handleChangeFile}
                            handleSubmit={this.handleSubmit}
                        />
                        {/* Tab công việc - chuyên ngành tương đương */}
                        <CareerMajorTab
                            id={`major_career`}
                            files={files}
                            major={major}
                            career={career}
                            handleChange={this.handleChange}

                            handleAddMajor={this.handleChangeMajor}
                            handleEditMajor={this.handleChangeMajor}
                            handleDeleteMajor={this.handleChangeMajor}

                            handleAddCareer={this.handleChangeCareer}
                            handleEditCareer={this.handleChangeCareer}
                            handleDeleteCareer={this.handleChangeCareer}
                        />


                        {/* Tab thành viên hộ gia đình */}
                        <FamilyMemberTab
                            id="family_member"
                            tabEditMember="modal-edit-member-c"
                            editMember={editMember}
                            _fm_editMember={this._fm_editMember}
                            _fm_deleteMember={this._fm_deleteMember}
                            houseHold={this.state.houseHold}
                            _fm_handleHeadHouseHoldName={this._fm_handleHeadHouseHoldName}
                            _fm_handleDocumentType={this._fm_handleDocumentType}
                            _fm_handleHouseHoldNumber={this._fm_handleHouseHoldNumber}
                            _fm_handleCity={this._fm_handleCity}
                            _fm_handleDistrict={this._fm_handleDistrict}
                            _fm_handleWard={this._fm_handleWard}
                            _fm_handleHouseHoldAddress={this._fm_handleHouseHoldAddress}
                            _fm_handlePhone={this._fm_handlePhone}
                            _fm_handleHouseHoldCode={this._fm_handleHouseHoldCode}
                            _fm_saveMember={this._fm_saveMember}
                        />
                    </div>
                </div>
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, } = state;
    return { employeesManager };
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
    getDepartment: DepartmentActions.get,
};

const createPage = connect(mapState, actionCreators)(withTranslate(EmployeeCreatePage));
export { createPage as EmployeeCreatePage };