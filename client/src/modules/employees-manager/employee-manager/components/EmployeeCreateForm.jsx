import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton } from '../../../../common-components';

import { EmployeeManagerActions } from '../redux/actions';
import { SalaryActions } from '../../salary-employee/redux/actions';
import { SabbaticalActions } from '../../sabbatical/redux/actions';
import { DisciplineActions } from '../../praise-discipline/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    TabGeneralContent, TabContactContent, TabTaxContent, TabInsurranceContent, TabRearDisciplineContent,
    TabExperienceContent, TabCertificateContent, TabContractContent, TabSalaryContent, TabAttachmentsContent
} from '../../employee-create/components/CombineContent';
class EmployeeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: 'lib/adminLTE/dist/img/avatar5.png',
            avatar: "",
            employeeNew: {
                avatar: 'lib/adminLTE/dist/img/avatar5.png',
                gender: "male",
                relationship: "single",
                cultural: "12/12",
                educational: "unavailable",
                dateCMND: this.formatDate(Date.now()),
                brithday: this.formatDate(Date.now()),
                startTax: this.formatDate(Date.now()),
                experience: [],
                BHXH: [],
                course: []
            },
            certificate: [],
            certificateShort: [],
            contract: [],
            file: [],
            disciplineNew: [],
            praiseNew: [],
            salaryNew: [],
            sabbaticalNew: [],
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
    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        // let result =
        //     this.validateStartDateContract(this.state.startDate, false) && this.validateEndDateCertificateShort(this.state.endDate, false) &&
        //     this.validateNameContract(this.state.nameContract, false) && this.validateTypeContract(this.state.typeContract, false) ;
        // return result;
    }
    // function thêm mới thông tin nhân viên
    save = async () => {
        let newEmployee = this.state.employeeNew;
        let { file, contract, certificate, certificateShort } = this.state;
        // cập nhật lại state trước khi add employee
        await this.setState({
            employeeNew: {
                ...newEmployee,
                certificate: certificate.filter(certificate => (certificate.fileUpload === " ")),
                certificateShort: certificateShort.filter(certificateShort => (certificateShort.fileUpload === " ")),
                contract: contract.filter(contract => (contract.fileUpload === " ")),
                file: file.filter(file => (file.fileUpload === " "))
            }
        })
        const { employeeNew } = this.state;
        // kiểm tra việc nhập các trường bắt buộc
        if (!employeeNew.employeeNumber) {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (!employeeNew.fullName) {
            this.notifyerror("Bạn chưa nhập tên nhân viên");
        } else if (!employeeNew.MSCC) {
            this.notifyerror("Bạn chưa nhập mã chấm công");
        } else if (!employeeNew.brithday) {
            this.notifyerror("Bạn chưa nhập ngày sinh");
        } else if (!employeeNew.emailCompany) {
            this.notifyerror("Bạn chưa nhập email công ty");
        } else if (this.props.employeesManager.checkEmail === true) {
            this.notifyerror("Email công ty đã được sử dụng");
        } else if (!employeeNew.CMND) {
            this.notifyerror("Bạn chưa nhập số CMND/ Hộ chiếu");
        } else if (!employeeNew.dateCMND) {
            this.notifyerror("Bạn chưa nhập ngày cấp CMND/ Hộ chiếu");
        } else if (!employeeNew.addressCMND) {
            this.notifyerror("Bạn chưa nhập nơi cấp CMND/ Hộ chiếu");
        } else if (!employeeNew.phoneNumber) {
            this.notifyerror("Bạn chưa nhập số điện thoại");
        } else if (!employeeNew.nowAddress) {
            this.notifyerror("Bạn chưa nhập nơi ở hiện tại");
        } else if (!employeeNew.numberTax || !employeeNew.userTax || !employeeNew.startTax || !employeeNew.unitTax) {
            this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
        } else {
            await this.props.addNewEmployee(employeeNew);
            // lưu avatar
            if (this.state.avatar !== "") {
                let formData = new FormData();
                formData.append('fileUpload', this.state.avatar);
                this.props.uploadAvatar(this.state.employeeNew.employeeNumber, formData);
            };
            // lưu hợp đồng lao động
            if (this.state.contract.length !== 0) {
                let listContract = this.state.contract;
                listContract = listContract.filter(contract => (contract.fileUpload !== " "))
                listContract.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameContract', x.nameContract);
                    formData.append('typeContract', x.typeContract);
                    formData.append('file', x.file);
                    formData.append('startDate', x.startDate);
                    formData.append('endDate', x.endDate);
                    this.props.updateContract(this.state.employeeNew.employeeNumber, formData)
                })
            }
            // lưu thông tin bằng cấp
            if (this.state.certificate.length !== 0) {
                let listCertificate = this.state.certificate;
                listCertificate = listCertificate.filter(certificate => (certificate.fileUpload !== " "))
                listCertificate.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameCertificate', x.nameCertificate);
                    formData.append('addressCertificate', x.addressCertificate);
                    formData.append('file', x.file);
                    formData.append('yearCertificate', x.yearCertificate);
                    formData.append('typeCertificate', x.typeCertificate);
                    this.props.updateCertificate(this.state.employeeNew.employeeNumber, formData)
                })
            }
            // lưu thông tin chứng chỉ
            if (this.state.certificateShort.length !== 0) {
                let listCertificateShort = this.state.certificateShort;
                listCertificateShort = listCertificateShort.filter(certificateShort => (certificateShort.fileUpload !== " "))
                listCertificateShort.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameCertificateShort', x.nameCertificateShort);
                    formData.append('unit', x.unit);
                    formData.append('file', x.file);
                    formData.append('startDate', x.startDate);
                    formData.append('endDate', x.endDate);
                    this.props.updateCertificateShort(this.state.employeeNew.employeeNumber, formData)
                })
            }
            // lưu thông tin tài liệu đính kèm
            if (this.state.file.length !== 0) {
                let listFile = this.state.file;
                listFile = listFile.filter(file => (file.fileUpload !== " "))
                listFile.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameFile', x.nameFile);
                    formData.append('discFile', x.discFile);
                    formData.append('file', x.file);
                    formData.append('number', x.number);
                    formData.append('status', x.status);
                    this.props.updateFile(this.state.employeeNew.employeeNumber, formData)
                })
            }
            // lưu lịch sử tăng giảm lương
            if (this.state.salaryNew.length !== 0) {
                let employeeNumber = this.state.employeeNew.employeeNumber;
                this.state.salaryNew.map(x => {
                    this.props.createNewSalary({ ...x, employeeNumber })
                })
            }
            // lưu thông tin nghỉ phép
            if (this.state.sabbaticalNew.length !== 0) {
                let employeeNumber = this.state.employeeNew.employeeNumber;
                this.state.sabbaticalNew.map(x => {
                    this.props.createNewSabbatical({ ...x, employeeNumber })
                })
            }
            // lưu thông tin khen thưởng
            if (this.state.praiseNew.length !== 0) {
                let employeeNumber = this.state.employeeNew.employeeNumber;
                this.state.praiseNew.map(x => {
                    this.props.createNewPraise({ ...x, employeeNumber })
                })
            }
            // lưu thông tin kỷ luật
            if (this.state.disciplineNew.length !== 0) {
                let employeeNumber = this.state.employeeNew.employeeNumber;
                this.state.disciplineNew.map(x => {
                    this.props.createNewDiscipline({ ...x, employeeNumber })
                })
            }
            this.notifysuccess("Thêm nhân viên thành công");
        }
    }
    render() {
        console.log(this.state);
        const { translate, employeesManager } = this.props;
        return (
            <React.Fragment>
                <ModalButton modalID="modal-add-employee" button_name="Thêm mới nhân viên" title="Thêm mới nhân viên" />
                <ModalDialog
                    size='100' modalID="modal-add-employee" isLoading={false}
                    formID="form-add-employee"
                    title="Thêm mới nhân viên"
                    func={this.save}
                    disableSubmit={false}
                >
                    {/* <form className="form-group" id="form-addAA-employee"> */}
                        <div className="nav-tabs-custom" style={{marginTop:'-15px'}} >
                            <ul className="nav nav-tabs">
                                <li className="active"><a title={translate('manage_employee.menu_general_infor_title')} data-toggle="tab" href="#general">{translate('manage_employee.menu_general_infor')}</a></li>
                                <li><a title={translate('manage_employee.menu_contact_infor_title')} data-toggle="tab" href="#contact">{translate('manage_employee.menu_contact_infor')}</a></li>
                                <li><a title={translate('manage_employee.menu_education_experience_title')} data-toggle="tab" href="#experience">{translate('manage_employee.menu_education_experience')}</a></li>
                                <li><a title={translate('manage_employee.menu_diploma_certificate_title')} data-toggle="tab" href="#diploma">{translate('manage_employee.menu_diploma_certificate')}</a></li>
                                <li><a title={translate('manage_employee.menu_account_tax_title')} data-toggle="tab" href="#account">{translate('manage_employee.menu_account_tax')}</a></li>
                                <li><a title={translate('manage_employee.menu_insurrance_infor_title')} data-toggle="tab" href="#insurrance">{translate('manage_employee.menu_insurrance_infor')}</a></li>
                                <li><a title={translate('manage_employee.menu_contract_training_title')} data-toggle="tab" href="#contract">{translate('manage_employee.menu_contract_training')}</a></li>
                                <li><a title={translate('manage_employee.menu_reward_discipline_title')} data-toggle="tab" href="#reward">{translate('manage_employee.menu_reward_discipline')}</a></li>
                                <li><a title={translate('manage_employee.menu_salary_sabbatical_title')} data-toggle="tab" href="#salary">{translate('manage_employee.menu_salary_sabbatical')}</a></li>
                                <li><a title={translate('manage_employee.menu_attachments_title')} data-toggle="tab" href="#attachments">{translate('manage_employee.menu_attachments')}</a></li>
                            </ul>
                            < div className="tab-content">
                                <TabGeneralContent
                                    id="general"
                                    img={this.state.img}
                                    handleChange={this.handleChange}
                                    handleUpload={this.handleUpload}
                                    employee={this.state.employeeNew}
                                />
                                <TabContactContent
                                    id="contact"
                                    handleChange={this.handleChange}
                                    employeeContact={this.state.employeeNew}
                                />
                                <TabExperienceContent
                                    id="experience"
                                    employee={this.state.employeeNew}
                                    handleAddExperience={this.handleChangeExperience}
                                    handleEditExperience={this.handleChangeExperience}
                                    handleDeleteExperience={this.handleChangeExperience}
                                />
                                <TabCertificateContent
                                    id="diploma"
                                    certificate={this.state.certificate}
                                    certificateShort={this.state.certificateShort}
                                    handleAddCertificate={this.handleChangeCertificate}
                                    handleEditCertificate={this.handleChangeCertificate}
                                    handleDeleteCertificate={this.handleChangeCertificate}
                                    handleAddCertificateShort={this.handleChangeCertificateShort}
                                    handleEditCertificateShort={this.handleChangeCertificateShort}
                                    handleDeleteCertificateShort={this.handleChangeCertificateShort}
                                />
                                <TabTaxContent
                                    id="account"
                                    employee={this.state.employeeNew}
                                    handleChange={this.handleChange} />
                                <TabInsurranceContent
                                    id="insurrance"
                                    BHXH={this.state.employeeNew.BHXH}
                                    employee={this.state.employeeNew}
                                    handleChange={this.handleChange}
                                    handleAddBHXH={this.handleChangeBHXH}
                                    handleEditBHXH={this.handleChangeBHXH}
                                    handleDeleteBHXH={this.handleChangeBHXH}
                                />
                                <TabContractContent
                                    id="contract"
                                    contract={this.state.contract}
                                    course={this.state.employeeNew.course}
                                    handleAddContract={this.handleChangeContract}
                                    handleEditContract={this.handleChangeContract}
                                    handleDeleteContract={this.handleChangeContract}
                                />
                                <TabRearDisciplineContent
                                    id="reward"
                                    praise={this.state.praiseNew}
                                    discipline={this.state.disciplineNew}
                                    handleAddPraise={this.handleChangePraise}
                                    handleEditPraise={this.handleChangePraise}
                                    handleDeletePraise={this.handleChangePraise}
                                    handleAddDiscipline={this.handleChangeDiscipline}
                                    handleEditDiscipline={this.handleChangeDiscipline}
                                    handleDeleteDiscipline={this.handleChangeDiscipline}
                                />
                                <TabSalaryContent
                                    id="salary"
                                    salary={this.state.salaryNew}
                                    sabbatical={this.state.sabbaticalNew}
                                    handleAddSalary={this.handleChangeSalary}
                                    handleEditSalary={this.handleChangeSalary}
                                    handleDeleteSalary={this.handleChangeSalary}
                                    handleAddSabbatical={this.handleChangeSabbatical}
                                    handleEditSabbatical={this.handleChangeSabbatical}
                                    handleDeleteSabbatical={this.handleChangeSabbatical}
                                />
                                <TabAttachmentsContent
                                    id="attachments"
                                    file={this.state.file}
                                    employee={this.state.employeeNew}
                                    handleChange={this.handleChange}
                                    handleAddFile={this.handleChangeFile}
                                    handleEditFile={this.handleChangeFile}
                                    handleDeleteFile={this.handleChangeFile}
                                    handleSubmit={this.handleSubmit}
                                />
                            </div>
                        </div>
                    {/* </form> */}
                </ModalDialog>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { employeesManager, Salary, Discipline, Sabbatical } = state;
    return { employeesManager, Salary, Discipline, Sabbatical };
};

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
    uploadAvatar: EmployeeManagerActions.uploadAvatar,
    checkMSNV: EmployeeManagerActions.checkMSNV,
    checkEmail: EmployeeManagerActions.checkEmail,
    createNewSalary: SalaryActions.createNewSalary,
    createNewSabbatical: SabbaticalActions.createNewSabbatical,
    createNewPraise: DisciplineActions.createNewPraise,
    createNewDiscipline: DisciplineActions.createNewDiscipline,
    updateContract: EmployeeManagerActions.updateContract,
    updateCertificate: EmployeeManagerActions.updateCertificate,
    updateCertificateShort: EmployeeManagerActions.updateCertificateShort,
    updateFile: EmployeeManagerActions.updateFile,
};

const createForm = connect(mapState, actionCreators)(withTranslate(EmployeeCreateForm));
export { createForm as EmployeeCreateForm };