import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LOCAL_SERVER_API } from '../../../../../env';
import { DialogModal } from '../../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab,
    ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab
} from '../../employee-create/components/combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
class EmployeeEditFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        if (name === 'startingDate' || name === 'leavingDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'healthInsuranceStartDate' || name === 'healthInsuranceEndDate') {
            var partValue = value.split('-');
            value = [partValue[2], partValue[1], partValue[0]].join('-');
        }
        this.setState({
            employee: {
                ...employee,
                [name]: value
            }
        });
    }


    // Function thêm kinh nghiệm làm việc
    handleCreateExperiences = (data, addData) => {
        this.setState({
            experiences: data
        })
    }
    // Function chỉnh sửa kinh nghiệm làm việc
    handleEditExperiences = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editExperiences: [...this.state.editExperiences, editData]
            })
        } else {
            this.setState({
                experiences: data
            })
        }
    }
    // Function xoá kinh nghiệm làm việc
    handleDeleteExperiences = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteExperiences: [...this.state.deleteExperiences, deleteData],
                editExperiences: this.state.editExperiences.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                experiences: data
            })
        }
    }


    // Function thêm thông tin bằng cấp
    handleCreateDegree = (data, addData) => {
        this.setState({
            degrees: data
        })
    }
    // Function chỉnh sửa thông tin bằng cấp
    handleEditDegree = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editDegrees: [...this.state.editDegrees, editData]
            })
        } else {
            this.setState({
                degrees: data
            })
        }
    }
    // Function xoá thông tin bằng cấp
    handleDeleteDegree = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteDegrees: [...this.state.deleteDegrees, deleteData],
                editDegrees: this.state.editDegrees.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                degrees: data
            })
        }
    }


    // Function thêm thông tin chứng chỉ
    handleCreateCertificate = (data, addData) => {
        this.setState({
            certificates: data
        })
    }
    // Function chỉnh sửa thông tin chứng chỉ
    handleEditCertificate = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editCertificates: [...this.state.editCertificates, editData]
            })
        } else {
            this.setState({
                certificates: data
            })
        }
    }
    // Function xoá thông tin chứng chỉ
    handleDeleteCertificate = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteCertificates: [...this.state.deleteCertificates, deleteData],
                editCertificates: this.state.editCertificates.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                certificates: data
            })
        }
    }


    // Function thêm thông tin đóng bảo hiểm xã hội
    handleCreateBHXH = (data, addData) => {
        this.setState({
            socialInsuranceDetails: data
        })
    }
    // Function chỉnh sửa thông tin đóng bảo hiểm xã hội
    handleEditBHXH = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editSocialInsuranceDetails: [...this.state.editSocialInsuranceDetails, editData]
            })
        } else {
            this.setState({
                socialInsuranceDetails: data
            })
        }
    }
    // Function xoá thông tin đóng bảo hiểm xã hội
    handleDeleteBHXH = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteSocialInsuranceDetails: [...this.state.deleteSocialInsuranceDetails, deleteData],
                editSocialInsuranceDetails: this.state.editSocialInsuranceDetails.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                socialInsuranceDetails: data
            })
        }
    }


    // Function thêm thông tin hợp đồng lao động
    handleCreateContract = (data, addData) => {
        this.setState({
            contracts: data
        })
    }
    // Function chỉnh sửa thông tin hợp đồng lao động
    handleEditContract = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editContracts: [...this.state.editContracts, editData]
            })
        } else {
            this.setState({
                contracts: data
            })
        }
    }
    // Function xoá thông tin hợp đồng lao động
    handleDeleteContract = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteContracts: [...this.state.deleteContracts, deleteData],
                editContracts: this.state.editContracts.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                contracts: data
            })
        }
    }


    // Function thêm thông tin khen thưởng
    handleCreateConmmendation = (data, addData) => {
        this.setState({
            commendations: data
        })
    }
    // Function chỉnh sửa thông tin khen thưởng
    handleEditConmmendation = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editConmmendations: [...this.state.editConmmendations, editData]
            })
        } else {
            this.setState({
                commendations: data
            })
        }
    }
    // Function xoá thông tin khen thưởng
    handleDeleteConmmendation = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteConmmendations: [...this.state.deleteConmmendations, deleteData],
                editConmmendations: this.state.editConmmendations.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                commendations: data
            })
        }
    }


    // Function thêm thông tin kỷ luật
    handleCreateDiscipline = (data, addData) => {
        this.setState({
            disciplines: data
        })
    }
    // Function chỉnh sửa thông tin kỷ luật
    handleEditDiscipline = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editDisciplines: [...this.state.editDisciplines, editData]
            })
        } else {
            this.setState({
                disciplines: data
            })
        }
    }
    // Function xoá thông tin kỷ luật
    handleDeleteDiscipline = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteDisciplines: [...this.state.deleteDisciplines, deleteData],
                editDisciplines: this.state.editDisciplines.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                disciplines: data
            })
        }
    }


    // Function thêm thông tin lịch sử lương
    handleCreateSalary = (data, addData) => {
        this.setState({
            salaries: data
        })
    }
    // Function chỉnh sửa thông tin lịch sử lương
    handleEditSalary = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editSalaries: [...this.state.editSalaries, editData]
            })
        } else {
            this.setState({
                salaries: data
            })
        }
    }
    // Function xoá thông tin lịch sử lương
    handleDeleteSalary = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteSalaries: [...this.state.deleteSalaries, deleteData],
                editSalaries: this.state.editSalaries.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                salaries: data
            })
        }
    }


    // Function thêm thông tin nghỉ phép
    handleCreateAnnualLeave = (data, addData) => {
        this.setState({
            annualLeaves: data
        })
    }
    // Function chỉnh sửa thông tin nghỉ phép
    handleEditAnnualLeave = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editAnnualLeaves: [...this.state.editAnnualLeaves, editData]
            })
        } else {
            this.setState({
                annualLeaves: data
            })
        }
    }
    // Function xoá thông tin nghỉ phép
    handleDeleteAnnualLeave = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteAnnualLeaves: [...this.state.deleteAnnualLeaves, deleteData],
                editAnnualLeaves: this.state.editAnnualLeaves.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                annualLeaves: data
            })
        }
    }


    // Function thêm thông tin nghỉ phép
    handleCreateFile = (data, addData) => {
        this.setState({
            files: data
        })
    }
    // Function chỉnh sửa thông tin nghỉ phép
    handleEditFile = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editFiles: [...this.state.editFiles, editData]
            })
        } else {
            this.setState({
                files: data
            })
        }
    }
    // Function xoá thông tin nghỉ phép
    handleDeleteFile = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteFiles: [...this.state.deleteFiles, deleteData],
                editFiles: this.state.editFiles.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                files: data
            })
        }
    }

    // Function thêm thông tin quá trình đào tạo
    handleCreateCourse = (data, addData) => {
        this.setState({
            courses: data
        })
    }
    // Function chỉnh sửa thông tin quá trình đào tạo
    handleEditCourse = (data, editData) => {
        if (editData._id !== undefined) {
            this.setState({
                editCourses: [...this.state.editCourses, editData]
            })
        } else {
            this.setState({
                courses: data
            })
        }
    }
    // Function xoá thông tin quá trình đào tạo
    handleDeleteCourse = (data, deleteData) => {
        if (deleteData._id !== undefined) {
            this.setState({
                deleteCourses: [...this.state.deleteCourses, deleteData],
                editCourses: this.state.editCourses.filter(x => x._id !== deleteData._id)
            })
        } else {
            this.setState({
                courses: data
            })
        }
    }



    // function kiểm tra các trường bắt buộc phải nhập
    validatorInput = (value) => {
        if (value !== undefined && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { employee } = this.state;
        let result = this.validatorInput(employee.employeeNumber) && this.validatorInput(employee.employeeTimesheetId) &&
            this.validatorInput(employee.fullName) && this.validatorInput(employee.birthdate) &&
            this.validatorInput(employee.emailInCompany) && this.validatorInput(employee.identityCardNumber) &&
            this.validatorInput(employee.identityCardDate) && this.validatorInput(employee.identityCardAddress) &&
            this.validatorInput(employee.phoneNumber) && this.validatorInput(employee.temporaryResidence) &&
            this.validatorInput(employee.taxRepresentative) && this.validatorInput(employee.taxNumber) &&
            this.validatorInput(employee.taxDateOfIssue) && this.validatorInput(employee.taxAuthority);

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


    save = async () => {
        let { experiences, degrees, certificates, contracts, files,
            disciplines, commendations, salaries, annualLeaves, socialInsuranceDetails, courses } = this.state;
        await this.setState({
            createExperiences: experiences.filter(x => x._id === undefined),
            createDegrees: degrees.filter(x => x._id === undefined),
            createCertificates: certificates.filter(x => x._id === undefined),
            createContracts: contracts.filter(x => x._id === undefined),
            createDisciplines: disciplines.filter(x => x._id === undefined),
            createCommendations: commendations.filter(x => x._id === undefined),
            createSalaries: salaries.filter(x => x._id === undefined),
            createAnnualLeaves: annualLeaves.filter(x => x._id === undefined),
            createCourses: courses.filter(x => x._id === undefined),
            createSocialInsuranceDetails: socialInsuranceDetails.filter(x => x._id === undefined),
            createFiles: files.filter(x => x._id === undefined),
        })
        let formData = convertJsonObjectToFormData(this.state);
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
        this.props.updateInformationEmployee(this.state._id, formData);
    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
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
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: LOCAL_SERVER_API + nextProps.employees[0].avatar,
                avatar: "",
                employee: nextProps.employees[0],
                experiences: nextProps.employees[0].experiences,
                degrees: nextProps.employees[0].degrees,
                certificates: nextProps.employees[0].certificates,
                contracts: nextProps.employees[0].contracts,
                files: nextProps.employees[0].files,
                commendations: nextProps.commendations,
                salaries: nextProps.salaries,
                annualLeaves: nextProps.annualLeaves,
                disciplines: nextProps.disciplines,
                socialInsuranceDetails: nextProps.employees[0].socialInsuranceDetails,
                courses: nextProps.courses,
                organizationalUnits: nextProps.organizationalUnits,
                roles: nextProps.roles,

                editExperiences: [],
                deleteExperiences: [],
                editDegrees: [],
                deleteDegrees: [],
                editCertificates: [],
                deleteCertificates: [],
                editSocialInsuranceDetails: [],
                deleteSocialInsuranceDetails: [],
                editContracts: [],
                deleteContracts: [],
                editConmmendations: [],
                deleteConmmendations: [],
                editDisciplines: [],
                deleteDisciplines: [],
                editSalaries: [],
                deleteSalaries: [],
                editAnnualLeaves: [],
                deleteAnnualLeaves: [],
                editCourses: [],
                deleteCourses: [],
                editFiles: [],
                deleteFiles: [],

            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, employeesManager } = this.props;
        const { _id } = this.state;
        console.log(this.state);
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-employee" isLoading={employeesManager.isLoading}
                    formID="form-edit-employee"
                    title="Chỉnh sửa thông tin nhân viên"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* <form className="form-group" id="form-edit-employee"> */}
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('manage_employee.menu_general_infor_title')} data-toggle="tab" href={`#edit_general${_id}`}>{translate('manage_employee.menu_general_infor')}</a></li>
                            <li><a title={translate('manage_employee.menu_contact_infor_title')} data-toggle="tab" href={`#edit_contact${_id}`}>{translate('manage_employee.menu_contact_infor')}</a></li>
                            <li><a title={translate('manage_employee.menu_education_experience_title')} data-toggle="tab" href={`#edit_experience${_id}`}>{translate('manage_employee.menu_education_experience')}</a></li>
                            <li><a title={translate('manage_employee.menu_diploma_certificate_title')} data-toggle="tab" href={`#edit_diploma${_id}`}>{translate('manage_employee.menu_diploma_certificate')}</a></li>
                            <li><a title={translate('manage_employee.menu_account_tax_title')} data-toggle="tab" href={`#edit_account${_id}`}>{translate('manage_employee.menu_account_tax')}</a></li>
                            <li><a title={translate('manage_employee.menu_insurrance_infor_title')} data-toggle="tab" href={`#edit_insurrance${_id}`}>{translate('manage_employee.menu_insurrance_infor')}</a></li>
                            <li><a title={translate('manage_employee.menu_contract_training_title')} data-toggle="tab" href={`#edit_contract${_id}`}>{translate('manage_employee.menu_contract_training')}</a></li>
                            <li><a title={translate('manage_employee.menu_reward_discipline_title')} data-toggle="tab" href={`#edit_reward${_id}`}>{translate('manage_employee.menu_reward_discipline')}</a></li>
                            <li><a title={translate('manage_employee.menu_salary_sabbatical_title')} data-toggle="tab" href={`#edit_salary${_id}`}>{translate('manage_employee.menu_salary_sabbatical')}</a></li>
                            <li><a title={translate('manage_employee.menu_attachments_title')} data-toggle="tab" href={`#edit_attachments${_id}`}>{translate('manage_employee.menu_attachments')}</a></li>
                        </ul>
                        < div className="tab-content">
                            <GeneralTab
                                id={`edit_general${_id}`}
                                img={this.state.img}
                                handleChange={this.handleChange}
                                handleUpload={this.handleUpload}
                                employee={this.state.employee}
                            />
                            <ContactTab
                                id={`edit_contact${_id}`}
                                handleChange={this.handleChange}
                                employee={this.state.employee}
                            />
                            <ExperienceTab
                                id={`edit_experience${_id}`}
                                employee={this.state.employee}
                                handleChange={this.handleChange}

                                handleAddExperience={this.handleCreateExperiences}
                                handleEditExperience={this.handleEditExperiences}
                                handleDeleteExperience={this.handleDeleteExperiences}
                            />
                            <CertificateTab
                                id={`edit_diploma${_id}`}
                                degrees={this.state.degrees}
                                certificates={this.state.certificates}

                                handleAddDegree={this.handleCreateDegree}
                                handleEditDegree={this.handleEditDegree}
                                handleDeleteDegree={this.handleDeleteDegree}

                                handleAddCertificate={this.handleCreateCertificate}
                                handleEditCertificate={this.handleEditCertificate}
                                handleDeleteCertificate={this.handleDeleteCertificate}
                            />
                            <TaxTab
                                id={`edit_account${_id}`}
                                employee={this.state.employee}
                                handleChange={this.handleChange} />
                            <InsurranceTab
                                id={`edit_insurrance${_id}`}
                                socialInsuranceDetails={this.state.socialInsuranceDetails}
                                employee={this.state.employee}
                                handleChange={this.handleChange}

                                handleAddBHXH={this.handleCreateBHXH}
                                handleEditBHXH={this.handleEditBHXH}
                                handleDeleteBHXH={this.handleDeleteBHXH}
                            />
                            <ContractTab
                                id={`edit_contract${_id}`}
                                pageCreate={false}
                                contracts={this.state.contracts}
                                courses={this.state.courses}
                                organizationalUnits={this.state.organizationalUnits}
                                roles={this.state.roles}

                                handleAddContract={this.handleCreateContract}
                                handleEditContract={this.handleEditContract}
                                handleDeleteContract={this.handleDeleteContract}

                                handleAddCourse={this.handleCreateCourse}
                                handleEditCourse={this.handleEditCourse}
                                handleDeleteCourse={this.handleDeleteCourse}
                            />
                            <DisciplineTab
                                id={`edit_reward${_id}`}
                                commendations={this.state.commendations}
                                disciplines={this.state.disciplines}
                                handleAddConmmendation={this.handleCreateConmmendation}
                                handleEditConmmendation={this.handleEditConmmendation}
                                handleDeleteConmmendation={this.handleDeleteConmmendation}

                                handleAddDiscipline={this.handleCreateDiscipline}
                                handleEditDiscipline={this.handleEditDiscipline}
                                handleDeleteDiscipline={this.handleDeleteDiscipline}
                            />
                            <SalaryTab
                                id={`edit_salary${_id}`}
                                salaries={this.state.salaries}
                                annualLeaves={this.state.annualLeaves}
                                handleAddSalary={this.handleCreateSalary}
                                handleEditSalary={this.handleEditSalary}
                                handleDeleteSalary={this.handleDeleteSalary}

                                handleAddAnnualLeave={this.handleCreateAnnualLeave}
                                handleEditAnnualLeave={this.handleEditAnnualLeave}
                                handleDeleteAnnualLeave={this.handleDeleteAnnualLeave}
                            />
                            <FileTab
                                id={`edit_attachments${_id}`}
                                files={this.state.files}
                                employee={this.state.employee}
                                handleChange={this.handleChange}

                                handleAddFile={this.handleCreateFile}
                                handleEditFile={this.handleEditFile}
                                handleDeleteFile={this.handleDeleteFile}
                            />
                        </div>
                    </div>
                    {/* </form> */}
                </DialogModal>
            </React.Fragment>
        )
    }
};
function mapState(state) {
    const { employeesInfo, employeesManager } = state;
    return { employeesInfo, employeesManager };
};

const actionCreators = {
    updateInformationEmployee: EmployeeManagerActions.updateInformationEmployee,
};
const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeEditFrom));
export { editFrom as EmployeeEditFrom };