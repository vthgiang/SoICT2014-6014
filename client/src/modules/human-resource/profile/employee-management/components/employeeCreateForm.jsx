import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import { GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab, ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab, CareerMajorTab } from '../../employee-create/components/combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import FamilyMemberTab from '../../employee-create/components/familyMemberTab';
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
const EmployeeCreateForm = (props) => {

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
     */
     const formatDate2 = (date, monthYear = false) => {
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
                return [year, month].join('-');
            } else return [year, month, day].join('-');
        }
        return date;
    }
    
    const [state, setState] = useState({
        img: './upload/human-resource/avatars/avatar5.png',
            avatar: "",
            employee: {
                avatar: '/upload/human-resource/avatars/avatar5.png',
                gender: "male",
                maritalStatus: "single",
                educationalLevel: "",
                professionalSkill: "unavailable",
                status: 'active',
                identityCardDate: formatDate2(Date.now()),
                birthdate: formatDate2(Date.now()),
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
            editMember: initMember

    })


    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    const handleUpload = (img, avatar) => {
        setState(state => ({
            ...state,
            img: img,
            avatar: avatar
        }))
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        const { employee } = state;
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        setState(state => ({
            ...state,
            employee: {
                ...employee,
                [name]: value
            }
        }));
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     * @param {*} addData : Kinh nghiệm làm việc muốn thêm
     */
    const handleChangeExperience = (data, addData) => {
        const { employee } = state;
        setState(state => ({
            ...state,
            employee: {
                ...employee,
                experiences: data
            }
        }))
    }

    /**
     * Function thêm, chỉnh sửa thông tin bằng cấp
     * @param {*} data : Dữ liệu thông tin bằng cấp
     * @param {*} addData : Bằng cấp muốn thêm
     */
    const handleChangeDegree = (data, addData) => {
        setState(state => ({
            ...state,
            degrees: data
        }))
    }

    /**
     * Function thêm, chỉnh sửa thông tin chứng chỉ
     * @param {*} data : Dữ liệu thông tin chứng chỉ
     * @param {*} addData : Chứng chỉ muốn thêm
     */
    const handleChangeCertificate = (data, addData) => {
        setState(state => ({
            ...state,
            certificates: data
        }))
    }

    /**
     * Function thêm, chỉnh sửa thông tin chuyên ngành tương đương
     * @param {*} data : Dữ liệu thông tin chuyên ngành tương đương
     * @param {*} addData : Chuyên ngành tương đương muốn thêm
     */
    const handleChangeMajor = (data, addData) => {
        setState(state => ({
            ...state,
            major: data
        }))
    }

    /**
     * Function thêm, chỉnh sửa thông tin công việc tương đương
     * @param {*} data : Dữ liệu thông tin công việc tương đương
     * @param {*} addData : Công việc tương đương muốn thêm
     */
    const handleChangeCareer = (data, addData) => {
        setState(state => ({
            ...state,
            career: data
        }))
    }

    /**
     * Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
     * @param {*} data : Dữ liệu thông tin quá trình đóng BHXH
     * @param {*} addData : Quá trình đóng BHXH muốn thêm
     */
    const handleChangeBHXH = (data, addData) => {
        const { employee } = state;
        setState(state => ({
            ...state,
            employee: {
                ...employee,
                socialInsuranceDetails: data
            }
        }))
    }

    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng
     * @param {*} addData : Hợp đồng muốn thêm
     */
    const handleChangeContract = (data, addData) => {
        setState(state => ({
            ...state,
            contracts: data
        }))
    }

    /**
     * Function thêm thông tin khen thưởng
     * @param {*} data : Dữ liệu thông tin khen thưởng
     * @param {*} addData : Khen thưởng muốn thêm
     */
    const handleChangeConmmendation = (data, addData) => {
        setState(state => ({
            ...state,
            commendations: data
        }))
    }

    /**
     * Function thêm thông tin kỷ luật
     * @param {*} data : Dữ liệu thông tin kỷ luật
     * @param {*} addData : Kỷ luật muốn thêm
     */
    const handleChangeDiscipline = (data, addData) => {
        setState(state => ({
            ...state,
            disciplines: data
        }))
    }

    /**
     * Function thêm thông tin nghỉ phép
     * @param {*} data : Dữ liệu thông tin nghỉ phép
     * @param {*} addData : Nghỉ phép muốn thêm
     */
    const handleChangeAnnualLeave = (data, addData) => {
        setState(state => ({
            ...state,
            annualLeaves: data
        }))
    }

    /**
     * Function thêm thông tin tài liệu đính kèm
     * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    const handleChangeFile = (data, addData) => {
        setState(state => ({
            ...state,
            files: data
        }))
    }

    /**
     *  Function thêm thông tin quá trình đào tạo
     * @param {*} data : Dữ liệu thông tin quá trình đào tạo
     */
    const handleChangeCourse = (data) => {
        setState(state => ({
            ...state,
            courses: data
        }))
    }

    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    const validatorInput = (value) => {
        if (value !== undefined && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { employee } = state;
        let result = validatorInput(employee.employeeNumber) && validatorInput(employee.employeeTimesheetId) &&
            validatorInput(employee.fullName) && validatorInput(employee.birthdate) &&
            validatorInput(employee.emailInCompany) && validatorInput(employee.identityCardNumber) &&
            validatorInput(employee.identityCardDate) && validatorInput(employee.identityCardAddress) &&
            validatorInput(employee.phoneNumber) && validatorInput(employee.temporaryResidence);

        if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
            if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
                return false;
            }
        } else if ((employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
            (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)) {
            return false;
        }
        if (employee.leavingDate && employee.startingDate) {
            if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
                return false;
            }
        } else if (employee.leavingDate && !employee.startingDate) {
            return false;
        }
        return result;
    }

    /** Function thêm mới thông tin nhân viên */
    const save = async () => {
        let { employee, degrees, certificates, contracts, files, avatar,
            disciplines, commendations, annualLeaves, courses, major, career, houseHold } = state;

        await setState(state => ({
            ...state,
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
                houseHold
            }
        }))

        let formData = convertJsonObjectToFormData(state.employee);
        degrees.forEach(x => {
            formData.append("fileDegree", x.fileUpload);
        })
        certificates.forEach(x => {
            formData.append("fileCertificate", x.fileUpload);
        })
        major.forEach(x => {
            formData.append("fileMajor", x.fileUpload);
        })
        career.forEach(x => {
            formData.append("fileCareer", x.fileUpload);
        })
        contracts.forEach(x => {
            formData.append("fileContract", x.fileUpload);
        })
        files.forEach(x => {
            formData.append("file", x.fileUpload);
        })
        formData.append("fileAvatar", avatar);
        employee && employee.healthInsuranceAttachment && employee.healthInsuranceAttachment.forEach(x => {
            formData.append('healthInsuranceAttachment', x.fileUpload)
        })
        props.addNewEmployee(formData);
    }

    const _fm_saveMember = (data) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                familyMembers: [...state.houseHold.familyMembers, data]
            }
        }))
    }

    const _fm_handleHeadHouseHoldName = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                headHouseHoldName: e.target.value
            }
        }))
    }

    const _fm_handleDocumentType = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                documentType: e.target.value
            }
        }))
    }

    const _fm_handleHouseHoldNumber = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                houseHoldNumber: e.target.value
            }
        }))
    }

    const _fm_handleCity = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                city: e.target.value
            }
        }))
    }

    const _fm_handleDistrict = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                district: e.target.value
            }
        }))
    }

    const _fm_handleWard = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                ward: e.target.value
            }
        }))
    }

    const _fm_handleHouseHoldAddress = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                houseHoldAddress: e.target.value
            }
        }))
    }

    const _fm_handlePhone = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                phone: e.target.value
            }
        }))
    }

    const _fm_handleHouseHoldCode = (e) => {
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                houseHoldCode: e.target.value
            }
        }))
    }

    const _fm_editMember = (index, data) => {
        console.log('index, data', index, data)
        let familyMembers = state.houseHold.familyMembers;
        familyMembers[index] = data;
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                familyMembers
            }
        }))
    }

    const _fm_deleteMember = (index) => {
        let familyMembers = state.houseHold.familyMembers;
        familyMembers = familyMembers.filter((node, i) => i !== index);
        setState(prev => ({
            ...prev,
            houseHold: {
                ...state.houseHold,
                familyMembers
            }
        }))
    }

    const { translate, employeesManager } = props;
    const { img, employee, degrees, certificates, contracts, courses, commendations, disciplines, annualLeaves, files, major, career, editMember } = state;

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-create-employee" isLoading={employeesManager.isLoading}
                formID="form-create-employee"
                title={translate('human_resource.profile.add_staff')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* <form className="form-group" id="form-create-employee"> */}
                <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#general">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#contact">{translate('human_resource.profile.tab_name.menu_contact_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_education_experience_title')} data-toggle="tab" href="#experience">{translate('human_resource.profile.tab_name.menu_education_experience')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_diploma_certificate_title')} data-toggle="tab" href="#diploma">{translate('human_resource.profile.tab_name.menu_diploma_certificate')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_account_tax_title')} data-toggle="tab" href="#account">{translate('human_resource.profile.tab_name.menu_account_tax')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_insurrance_infor_title')} data-toggle="tab" href="#insurrance">{translate('human_resource.profile.tab_name.menu_insurrance_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contract_training_title')} data-toggle="tab" href="#contract">{translate('human_resource.profile.tab_name.menu_contract_training')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_reward_discipline_title')} data-toggle="tab" href="#reward">{translate('human_resource.profile.tab_name.menu_reward_discipline')}</a></li>
                        <li><a title={translate('menu.annual_leave_personal')} data-toggle="tab" href="#salary">{translate('menu.annual_leave_personal')}</a></li>
                        <li><a title={"Công việc - chuyên ngành tương đương"} data-toggle="tab" href="#major_career">Công việc - chuyên ngành tương đương</a></li>
                        <li><a title={"Thành viên hộ gia đình"} data-toggle="tab" href="#family_member">Thành viên hộ gia đình</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_attachments_title')} data-toggle="tab" href="#attachments">{translate('human_resource.profile.tab_name.menu_attachments')}</a></li>
                    </ul>
                    < div className="tab-content">
                        {/* Tab thông tin chung */}
                        <GeneralTab
                            id="general"
                            img={img}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            employee={employee}
                        />
                        {/* Tab thông tin liên hệ */}
                        <ContactTab
                            id="contact"
                            handleChange={handleChange}
                            employee={employee}
                        />
                        {/* Tab học vấn - kinh nghiệm */}
                        <ExperienceTab
                            id="experience"
                            employee={employee}
                            handleChange={handleChange}

                            handleAddExperience={handleChangeExperience}
                            handleEditExperience={handleChangeExperience}
                            handleDeleteExperience={handleChangeExperience}
                        />
                        {/* Tab bằng cấp - chứng chỉ */}
                        <CertificateTab
                            id="diploma"
                            degrees={degrees}
                            certificates={certificates}

                            handleAddDegree={handleChangeDegree}
                            handleEditDegree={handleChangeDegree}
                            handleDeleteDegree={handleChangeDegree}

                            handleAddCertificate={handleChangeCertificate}
                            handleEditCertificate={handleChangeCertificate}
                            handleDeleteCertificate={handleChangeCertificate}
                        />
                        {/* Tab Tài khoản - thuế */}
                        <TaxTab
                            id="account"
                            employee={employee}
                            handleChange={handleChange} />
                        {/* Tab thông tin bảo hiểm */}
                        <InsurranceTab
                            id="insurrance"
                            pageCreate={true}
                            socialInsuranceDetails={employee.socialInsuranceDetails}
                            employee={employee}
                            handleChange={handleChange}

                            handleAddBHXH={handleChangeBHXH}
                            handleEditBHXH={handleChangeBHXH}
                            handleDeleteBHXH={handleChangeBHXH}
                        />
                        {/* Tab hợp đồng - quá trình đào tạo*/}
                        <ContractTab
                            id="contract"
                            pageCreate={true}
                            employee={employee}
                            contracts={contracts}
                            courses={courses}
                            handleChange={handleChange}

                            handleAddContract={handleChangeContract}
                            handleEditContract={handleChangeContract}
                            handleDeleteContract={handleChangeContract}

                            handleAddCourse={handleChangeCourse}
                            handleEditCourse={handleChangeCourse}
                            handleDeleteCourse={handleChangeCourse}
                        />
                        {/* Tab khen thưởng - kỷ luật*/}
                        <DisciplineTab
                            id="reward"
                            commendations={commendations}
                            disciplines={disciplines}

                            handleAddConmmendation={handleChangeConmmendation}
                            handleEditConmmendation={handleChangeConmmendation}
                            handleDeleteConmmendation={handleChangeConmmendation}

                            handleAddDiscipline={handleChangeDiscipline}
                            handleEditDiscipline={handleChangeDiscipline}
                            handleDeleteDiscipline={handleChangeDiscipline}
                        />
                        {/* Tab lương thưởng - nghỉ phép*/}
                        <SalaryTab
                            id="salary"
                            pageCreate={true}
                            annualLeaves={annualLeaves}

                            handleAddAnnualLeave={handleChangeAnnualLeave}
                            handleEditAnnualLeave={handleChangeAnnualLeave}
                            handleDeleteAnnualLeave={handleChangeAnnualLeave}
                        />
                        {/* Tab tài liệu đính kèm */}
                        <FileTab
                            id="attachments"
                            files={files}
                            employee={employee}
                            handleChange={handleChange}

                            handleAddFile={handleChangeFile}
                            handleEditFile={handleChangeFile}
                            handleDeleteFile={handleChangeFile}
                        />
                        {/* Tab công việc - chuyên ngành tương đương */}
                        <CareerMajorTab
                            id={`major_career`}
                            files={files}
                            major={major}
                            career={career}
                            handleChange={handleChange}

                            handleAddMajor={handleChangeMajor}
                            handleEditMajor={handleChangeMajor}
                            handleDeleteMajor={handleChangeMajor}

                            handleAddCareer={handleChangeCareer}
                            handleEditCareer={handleChangeCareer}
                            handleDeleteCareer={handleChangeCareer}
                        />
                        {/* Tab thành viên hộ gia đình */}
                        <FamilyMemberTab
                            id="family_member"
                            tabEditMember="modal-create-member-c"
                            editMember={editMember}
                            _fm_editMember={_fm_editMember}
                            _fm_deleteMember={_fm_deleteMember}
                            houseHold={state.houseHold}
                            _fm_handleHeadHouseHoldName={_fm_handleHeadHouseHoldName}
                            _fm_handleDocumentType={_fm_handleDocumentType}
                            _fm_handleHouseHoldNumber={_fm_handleHouseHoldNumber}
                            _fm_handleCity={_fm_handleCity}
                            _fm_handleDistrict={_fm_handleDistrict}
                            _fm_handleWard={_fm_handleWard}
                            _fm_handleHouseHoldAddress={_fm_handleHouseHoldAddress}
                            _fm_handlePhone={_fm_handlePhone}
                            _fm_handleHouseHoldCode={_fm_handleHouseHoldCode}
                            _fm_saveMember={_fm_saveMember}
                        />
                    </div>
                </div>
                {/* </form> */}
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
};

const createForm = connect(mapState, actionCreators)(withTranslate(EmployeeCreateForm));
export { createForm as EmployeeCreateForm };