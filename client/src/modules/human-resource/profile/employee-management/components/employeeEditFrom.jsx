import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LOCAL_SERVER_API } from '../../../../../env';
import { DialogModal } from '../../../../../common-components';


import { EmployeeManagerActions } from '../redux/actions';
import { SalaryActions } from '../../../salary/redux/actions';
import { AnnualLeaveActions } from '../../../annual-leave/redux/actions';
import { DisciplineActions } from '../../../commendation-discipline/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    GeneralTab, ContactTab, TaxTab, InsurranceTab, DisciplineTab,
    ExperienceTab, CertificateTab, ContractTab, SalaryTab, FileTab
} from '../../employee-create/components/combinedContent';

class EmployeeEditFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    // Function upload avatar 
    handleUpload = (img, avatar) => {
        this.setState({
            img: img,
            avatar: avatar
        })
    }
    // Function lưu các trường thông tin vào state
    handleChange = (name, value) => {
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                [name]: value
            }
        });
    }
    // Function thêm mới kinh nghiệm làm việc
    handleChangeExperience = (data) => {
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                experience: data
            }
        })
    }
    // Function thêm, chỉnh sửa thông tin bằng cấp
    handleChangeCertificate = (data) => {
        this.setState({
            certificate: data
        })
    }
    // Function thêm, chỉnh sửa thông tin chứng chỉ
    handleChangeCertificateShort = (data) => {
        this.setState({
            certificateShort: data
        })
    }
    // Function thêm, chỉnh sửa thông tin quá trình đóng BHXH
    handleChangeBHXH = (data) => {
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                BHXH: data
            }
        })
    }
    // Function thêm thông tin hợp đồng lao động
    handleChangeContract = (data) => {
        this.setState({
            contract: data
        })
    }
    // Function thêm thông tin khen thưởng
    handleChangePraise = (data) => {
        this.setState({
            praiseNew: data
        })
    }
    // Function thêm thông tin kỷ luật
    handleChangeDiscipline = (data) => {
        this.setState({
            disciplineNew: data
        })
    }
    // Function thêm thông tin lịch sử lương
    handleChangeSalary = (data) => {
        this.setState({
            salaryNew: data
        })
    }
    // Function thêm thông tin nghỉ phép
    handleChangeSabbatical = (data) => {
        this.setState({
            sabbaticalNew: data
        })
    }
    // Function thêm thông tin tài liệu đính kèm
    handleChangeFile = (data) => {
        this.setState({
            file: data
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

    save = async () => {
        // let newEmployee = this.state.employeeNew;
        // let { file, contract, certificate, certificateShort } = this.state;
        // // cập nhật lại state trước khi add employee
        // await this.setState({
        //     employeeNew: {
        //         ...newEmployee,
        //         brithday: this.refs.brithday.value.length !== 0 ? this.refs.brithday.value : newEmployee.brithday,
        //         dateCMND: this.refs.dateCMND.value.length !== 0 ? this.refs.dateCMND.value : newEmployee.dateCMND,
        //         startTax: this.refs.startTax.value.length !== 0 ? this.refs.startTax.value : newEmployee.startTax,
        //         startDateBHYT: this.refs.startDateBHYT.value.length !== 0 ? this.refs.startDateBHYT.value : newEmployee.startDateBHYT,
        //         endDateBHYT: this.refs.endDateBHYT.value.length !== 0 ? this.refs.endDateBHYT.value : newEmployee.endDateBHYT,
        //         certificate: certificate.filter(certificate => (certificate.fileUpload === undefined)),
        //         certificateShort: certificateShort.filter(certificateShort => (certificateShort.fileUpload === undefined)),
        //         contract: contract.filter(contract => (contract.fileUpload === undefined)),
        //         file: file.filter(file => (file.fileUpload === undefined))
        //     }
        // });
        // const { employeeNew } = this.state;
        // // kiểm tra việc nhập các trường bắt buộc
        // if (employeeNew.employeeNumber !== undefined && employeeNew.employeeNumber === " ") {
        //     this.notifyerror("Bạn chưa nhập mã nhân viên");
        // } else if (employeeNew.employeeNumber !== undefined && this.props.employeesManager.checkMSNV === true) {
        //     this.notifyerror("Mã số nhân viên đã tồn tại");
        // } else if (employeeNew.fullName !== undefined && employeeNew.fullName === " ") {
        //     this.notifyerror("Bạn chưa nhập tên nhân viên");
        // } else if (employeeNew.MSCC !== undefined && employeeNew.MSCC === " ") {
        //     this.notifyerror("Bạn chưa nhập mã chấm công");
        // } else if (employeeNew.brithday !== undefined && employeeNew.brithday === " ") {
        //     this.notifyerror("Bạn chưa nhập ngày sinh");
        // } else if (employeeNew.emailCompany !== undefined && employeeNew.emailCompany === " ") {
        //     this.notifyerror("Bạn chưa nhập email công ty");
        // } else if (employeeNew.emailCompany !== undefined && this.props.employeesManager.checkEmail === true) {
        //     this.notifyerror("Email công ty đã được sử dụng");
        // } else if (employeeNew.CMND !== undefined && employeeNew.CMND === " ") {
        //     this.notifyerror("Bạn chưa nhập số CMND/ Hộ chiếu");
        // } else if (employeeNew.dateCMND !== undefined && employeeNew.dateCMND === " ") {
        //     this.notifyerror("Bạn chưa nhập ngày cấp CMND/ Hộ chiếu");
        // } else if (employeeNew.addressCMND !== undefined && employeeNew.addressCMND === " ") {
        //     this.notifyerror("Bạn chưa nhập nơi cấp CMND/ Hộ chiếu");
        // } else if (employeeNew.phoneNumber !== undefined && employeeNew.phoneNumber === " ") {
        //     this.notifyerror("Bạn chưa nhập số điện thoại");
        // } else if (employeeNew.nowAddress !== undefined && employeeNew.nowAddress === " ") {
        //     this.notifyerror("Bạn chưa nhập nơi ở hiện tại");
        // } else if ((employeeNew.numberTax !== undefined && employeeNew.numberTax === " ") || (employeeNew.userTax !== undefined && employeeNew.userTax === " ") ||
        //     (employeeNew.startTax !== undefined && employeeNew.startTax === " ") || (employeeNew.unitTax !== undefined && employeeNew.unitTax === " ")) {
        //     this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
        // } else {
        //     await this.props.updateInformationEmployee(this.props.employee[0]._id, employeeNew);
        //     var employeeNumber = this.state.employeeNew.employeeNumber ? this.state.employeeNew.employeeNumber : this.props.employee[0].employeeNumber;
        //     if (this.state.avatar !== "") {
        //         let formData = new FormData();
        //         formData.append('fileUpload', this.state.avatar);
        //         this.props.uploadAvatar(employeeNumber, formData);
        //     };
        //     // lưu hợp đồng lao động
        //     if (this.state.contract.length !== 0) {
        //         let listContract = this.state.contract;
        //         listContract = listContract.filter(contract => (contract.fileUpload !== undefined))
        //         listContract.map(x => {
        //             let formData = new FormData();
        //             formData.append('fileUpload', x.fileUpload);
        //             formData.append('nameContract', x.nameContract);
        //             formData.append('typeContract', x.typeContract);
        //             formData.append('file', x.file);
        //             formData.append('startDate', x.startDate);
        //             formData.append('endDate', x.endDate);
        //             //console.log("hdhadhahwhdhsfhjaw",x.fileUpload)
        //             this.props.updateContract(employeeNumber, formData)
        //         })
        //     }
        //     // lưu thông tin bằng cấp
        //     if (this.state.certificate.length !== 0) {
        //         let listCertificate = this.state.certificate;
        //         listCertificate = listCertificate.filter(certificate => (certificate.fileUpload !== undefined))
        //         listCertificate.map(x => {
        //             let formData = new FormData();
        //             formData.append('fileUpload', x.fileUpload);
        //             formData.append('nameCertificate', x.nameCertificate);
        //             formData.append('addressCertificate', x.addressCertificate);
        //             formData.append('file', x.file);
        //             formData.append('yearCertificate', x.yearCertificate);
        //             formData.append('typeCertificate', x.typeCertificate);
        //             this.props.updateCertificate(employeeNumber, formData)
        //         })
        //     }
        //     // lưu thông tin chứng chỉ
        //     if (this.state.certificateShort.length !== 0) {
        //         let listCertificateShort = this.state.certificateShort;
        //         listCertificateShort = listCertificateShort.filter(certificateShort => (certificateShort.fileUpload !== undefined))
        //         listCertificateShort.map(x => {
        //             let formData = new FormData();
        //             formData.append('fileUpload', x.fileUpload);
        //             formData.append('nameCertificateShort', x.nameCertificateShort);
        //             formData.append('unit', x.unit);
        //             formData.append('file', x.file);
        //             formData.append('startDate', x.startDate);
        //             formData.append('endDate', x.endDate);
        //             this.props.updateCertificateShort(employeeNumber, formData)
        //         })
        //     }
        //     // lưu thông tin tài liệu đính kèm
        //     if (this.state.file.length !== 0) {
        //         let listFile = this.state.file;
        //         listFile = listFile.filter(file => (file.fileUpload !== undefined))
        //         listFile.map(x => {
        //             let formData = new FormData();
        //             formData.append('fileUpload', x.fileUpload);
        //             formData.append('nameFile', x.nameFile);
        //             formData.append('discFile', x.discFile);
        //             formData.append('file', x.file);
        //             formData.append('number', x.number);
        //             formData.append('status', x.status);
        //             this.props.updateFile(employeeNumber, formData)
        //         })
        //     }
        //     // lưu lịch sử tăng giảm lương
        //     if (this.state.salaryNew.length !== 0) {
        //         let createSalary = this.state.salaryNew.filter(salary => (salary._id === " "));
        //         if (createSalary.length !== 0) {
        //             createSalary.map(x => {
        //                 this.props.createNewSalary({ ...x, employeeNumber })
        //             });
        //         }
        //     }
        //     if (this.state.salaryEdit.length !== 0) {
        //         this.state.salaryEdit.map(x => {
        //             this.props.updateSalary(x._id, { ...x, employeeNumber })
        //         });
        //     }
        //     if (this.state.salaryDelete.length !== 0) {
        //         this.state.salaryDelete.map(x => {
        //             this.props.deleteSalary(x._id);
        //         })
        //     }
        //     // lưu thông tin nghỉ phép
        //     if (this.state.sabbaticalNew.length !== 0) {
        //         let createSabbatical = this.state.sabbaticalNew.filter(sabbatical => (sabbatical._id === " "));
        //         if (createSabbatical.length !== 0) {
        //             createSabbatical.map(x => {
        //                 this.props.createAnnualLeave({ ...x, employeeNumber })
        //             });
        //         }
        //     }
        //     if (this.state.sabbaticalEdit.length !== 0) {
        //         this.state.sabbaticalEdit.map(x => {
        //             this.props.updateAnnualLeave(x._id, { ...x, employeeNumber })
        //         });
        //     }
        //     if (this.state.sabbaticalDelete.length !== 0) {
        //         this.state.sabbaticalDelete.map(x => {
        //             this.props.deleteAnnualLeave(x._id);
        //         })
        //     }
        //     // lưu thông tin khen thưởng
        //     if (this.state.praiseNew.length !== 0) {
        //         let createPraise = this.state.praiseNew.filter(praise => (praise._id === " "));
        //         if (createPraise.length !== 0) {
        //             createPraise.map(x => {
        //                 this.props.createNewPraise({ ...x, employeeNumber })
        //             });
        //         }
        //     }
        //     if (this.state.praiseEdit.length !== 0) {
        //         this.state.praiseEdit.map(x => {
        //             this.props.updatePraise(x._id, { ...x, employeeNumber })
        //         });
        //     }
        //     if (this.state.praiseDelete.length !== 0) {
        //         this.state.praiseDelete.map(x => {
        //             this.props.deletePraise(x._id);
        //         })
        //     }
        //     // lưu thông tin kỷ luật
        //     if (this.state.disciplineNew.length !== 0) {
        //         let createDiscipline = this.state.disciplineNew.filter(discipline => (discipline._id === " "));
        //         if (createDiscipline.length !== 0) {
        //             createDiscipline.map(x => {
        //                 this.props.createNewDiscipline({ ...x, employeeNumber })
        //             });
        //         }
        //     }
        //     if (this.state.disciplineEdit.length !== 0) {
        //         this.state.disciplineEdit.map(x => {
        //             this.props.updateDiscipline(x._id, { ...x, employeeNumber })
        //         });
        //     }
        //     if (this.state.disciplineDelete.length !== 0) {
        //         this.state.disciplineDelete.map(x => {
        //             this.props.deleteDiscipline(x._id);
        //         })
        //     }
        //     await this.props.getAllEmployee(this.props.initState);
        //     this.notifysuccess("Chỉnh sửa thông tin thành công");
        //     window.$(`#modal-editEmployee-${this.props.employee[0].employeeNumber}`).modal("hide");
        // }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                img: LOCAL_SERVER_API + nextProps.employees[0].avatar,
                avatar: "",
                employee: nextProps.employees[0],
                commendations: nextProps.commendations,
                salaries: nextProps.salaries,
                annualLeaves: nextProps.annualLeaves,
                disciplines: nextProps.disciplines,
                files: nextProps.employees[0].files,
                degrees: nextProps.employees[0].degrees,
                certificates: nextProps.employees[0].certificates,
                contracts: nextProps.employees[0].contracts,
                socialInsuranceDetails: nextProps.employees[0].socialInsuranceDetails,
                courses: nextProps.employees[0].courses,

                // disciplineDelete: [],
                // praiseDelete: [],
                // salaryDelete: [],
                // sabbaticalDelete: [],
                // disciplineEdit: [],
                // praiseEdit: [],
                // salaryEdit: [],
                // sabbaticalEdit: [],
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, employeesManager } = this.props;
        const { _id } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='100' modalID="modal-edit-employee" isLoading={false}
                    formID="form-edit-employee"
                    title={translate('manage_employee.edit_diploma')}
                    func={this.save}
                    disableSubmit={false}
                >
                    {/* <form className="form-group" id="form-edit-employee"> */}
                    <div className="nav-tabs-custom" style={{ marginTop: '-15px' }} >
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
                                handleAddExperience={this.handleChangeExperience}
                                handleEditExperience={this.handleChangeExperience}
                                handleDeleteExperience={this.handleChangeExperience}
                            />
                            <CertificateTab
                                id={`edit_diploma${_id}`}
                                degrees={this.state.degrees}
                                certificates={this.state.certificates}
                                handleAddCertificate={this.handleChangeCertificate}
                                handleEditCertificate={this.handleChangeCertificate}
                                handleDeleteCertificate={this.handleChangeCertificate}
                                handleAddCertificateShort={this.handleChangeCertificateShort}
                                handleEditCertificateShort={this.handleChangeCertificateShort}
                                handleDeleteCertificateShort={this.handleChangeCertificateShort}
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
                                handleAddBHXH={this.handleChangeBHXH}
                                handleEditBHXH={this.handleChangeBHXH}
                                handleDeleteBHXH={this.handleChangeBHXH}
                            />
                            <ContractTab
                                id={`edit_contract${_id}`}
                                contracts={this.state.contracts}
                                courses={this.state.courses}
                                handleAddContract={this.handleChangeContract}
                                handleEditContract={this.handleChangeContract}
                                handleDeleteContract={this.handleChangeContract}
                            />
                            <DisciplineTab
                                id={`edit_reward${_id}`}
                                commendations={this.state.commendations}
                                disciplines={this.state.disciplines}
                                handleAddPraise={this.handleChangePraise}
                                handleEditPraise={this.handleChangePraise}
                                handleDeletePraise={this.handleChangePraise}
                                handleAddDiscipline={this.handleChangeDiscipline}
                                handleEditDiscipline={this.handleChangeDiscipline}
                                handleDeleteDiscipline={this.handleChangeDiscipline}
                            />
                            <SalaryTab
                                id={`edit_salary${_id}`}
                                salaries={this.state.salaries}
                                annualLeaves={this.state.annualLeaves}
                                handleAddSalary={this.handleChangeSalary}
                                handleEditSalary={this.handleChangeSalary}
                                handleDeleteSalary={this.handleChangeSalary}
                                handleAddSabbatical={this.handleChangeSabbatical}
                                handleEditSabbatical={this.handleChangeSabbatical}
                                handleDeleteSabbatical={this.handleChangeSabbatical}
                            />
                            <FileTab
                                id={`edit_attachments${_id}`}
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
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    uploadAvatar: EmployeeManagerActions.uploadAvatar,
    checkMSNV: EmployeeManagerActions.checkMSNV,
    checkEmail: EmployeeManagerActions.checkEmail,

    updateCertificate: EmployeeManagerActions.updateCertificate,
    updateCertificateShort: EmployeeManagerActions.updateCertificateShort,
    updateContract: EmployeeManagerActions.updateContract,
    updateFile: EmployeeManagerActions.updateFile,

    createNewSalary: SalaryActions.createNewSalary,
    createAnnualLeave: AnnualLeaveActions.createAnnualLeave,
    createNewPraise: DisciplineActions.createNewPraise,
    createNewDiscipline: DisciplineActions.createNewDiscipline,

    updateSalary: SalaryActions.updateSalary,
    updateAnnualLeave: AnnualLeaveActions.updateAnnualLeave,
    updateDiscipline: DisciplineActions.updateDiscipline,
    updatePraise: DisciplineActions.updatePraise,

    deleteSalary: SalaryActions.deleteSalary,
    deleteAnnualLeave: AnnualLeaveActions.deleteAnnualLeave,
    deleteDiscipline: DisciplineActions.deleteDiscipline,
    deletePraise: DisciplineActions.deletePraise,
};
const editFrom = connect(mapState, actionCreators)(withTranslate(EmployeeEditFrom));
export { editFrom as EmployeeEditFrom };