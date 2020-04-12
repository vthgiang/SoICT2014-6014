import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EmployeeManagerActions } from '../redux/actions';
import { SalaryActions } from '../../salary-employee/redux/actions';
import { SabbaticalActions } from '../../sabbatical/redux/actions';
import { DisciplineActions } from '../../praise-discipline/redux/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalImportFileBHXH, ModalAddCertificate, ModalAddCertificateShort, ModalAddContract, ModalAddExperience } from './CombineContent';
import { ModalAddBHXH, ModalAddDiscipline, ModalAddPraise, ModalAddSalary, ModalAddSabbatical, ModalAddFile } from './CombineContent';
import { ModalEditFile, ModalEditSabbatical, ModalEditSalary, ModalEditPraise, ModalEditDiscipline, ModalEditBHXH } from './CombineContent';
import { ModalEditExperience, ModalEditContract, ModalEditCertificateShort, ModalEditCertificate } from './CombineContent';

class ModalEditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: this.props.employee.map(x => x.avatar),
            avatar: "",
            employeeNew: {
                brithday: this.props.employee[0].brithday,
                dateCMND: this.props.employee[0].dateCMND,
                startTax: this.props.employee[0].startTax,
                startDateBHYT: this.props.employee[0].startDateBHYT,
                endDateBHYT: this.props.employee[0].endDateBHYT,
                experience: this.props.employee.map(x => x.experience)[0],
                BHXH: this.props.employee.map(x => x.BHXH)[0],
                course: this.props.employee.map(x => x.course)[0],
            },
            certificate: this.props.employee.map(x => x.certificate)[0],
            certificateShort: this.props.employee.map(x => x.certificateShort)[0],
            contract: this.props.employee.map(x => x.contract)[0],
            file: this.props.employee.map(x => x.file)[0],
            disciplineNew: this.props.discipline,
            praiseNew: this.props.praise,
            salaryNew: this.props.salary,
            sabbaticalNew: this.props.sabbatical,
            disciplineDelete: [],
            praiseDelete: [],
            salaryDelete: [],
            sabbaticalDelete: [],
            disciplineEdit: [],
            praiseEdit: [],
            salaryEdit: [],
            sabbaticalEdit: [],
        };
        this.handleChangeMSNV = this.handleChangeMSNV.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeGender = this.handleChangeGender.bind(this);
        this.handleChangeRelationship = this.handleChangeRelationship.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
        this.defaulteClick = this.defaulteClick.bind(this);
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    // function upload avatar 
    handleUpload(event) {
        var file = event.target.files[0];
        var fileLoad = new FileReader();
        fileLoad.readAsDataURL(file);
        fileLoad.onload = () => {
            this.setState({
                img: fileLoad.result,
                avatar: file
            })
        };
    }
    // function lưu các trường thông tin vào state
    handleChange(event) {
        const { name, value } = event.target;
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                [name]: (value === "") ? " " : value
            }
        });
    }
    // function lưu giới tính
    handleChangeGender(event) {
        const { value } = event.target;
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                gender: value
            }
        });
    }
    // function lưu tình hình hôn nhân
    handleChangeRelationship(event) {
        const { value } = event.target;
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                relationship: value
            }
        });
    }
    // function thêm mã số nhân viên vào state và kiểm tra sự tồn tại của nó
    handleChangeMSNV(event) {
        const { name, value } = event.target;
        const { employeeNew } = this.state;
        if (value !== this.props.employee[0].employeeNumber && value !== "") {
            this.props.checkMSNV(value);
        }
        this.setState({
            employeeNew: {
                ...employeeNew,
                [name]: value
            }
        });
    }
    // function thêm email công ty vào state và kiểm tra sự tồn tại của nó
    handleChangeEmail(event) {
        const { name, value } = event.target;
        const { employeeNew } = this.state;
        if (value !== this.props.employee[0].emailCompany && value !== "") {
            this.props.checkEmail(value);
        }
        this.setState({
            employeeNew: {
                ...employeeNew,
                [name]: value
            }
        });
    }
    // function thêm thông tin bằng cấp
    handleChangeCertificate = (data) => {
        const { certificate } = this.state;
        this.setState({
            certificate: [...certificate, {
                ...data
            }]
        })

    }
    // function chỉnh sửa thông tin bằng cấp
    handleEditCertificate = (data) => {
        const { certificate } = this.state;
        certificate[data.index] = data;
        this.setState({
            certificate: certificate
        })

    }
    // function thêm thông tin chứng chỉ
    handleChangeCertificateShort = (data) => {
        const { certificateShort } = this.state;
        this.setState({
            certificateShort: [...certificateShort, {
                ...data
            }]
        })
    }
    // function chỉnh sửa thông tin chứng chỉ
    handleEditCertificateShort = (data) => {
        const { certificateShort } = this.state;
        certificateShort[data.index] = data;
        this.setState({
            certificateShort: certificateShort
        })
    }
    // function thêm mới kinh nghiệm làm việc
    handleChangeExperience = (data) => {
        const { employeeNew } = this.state;
        var experience = employeeNew.experience;
        this.setState({
            employeeNew: {
                ...employeeNew,
                experience: [...experience, {
                    ...data
                }]
            }
        })
    }
    // function chỉnh sửa kinh nghiệm làm việc
    handleEditExperience = (data) => {
        const { employeeNew } = this.state;
        var experience = employeeNew.experience;
        experience[data.index] = data
        this.setState({
            employeeNew: {
                ...employeeNew,
                experience: experience
            }
        })
    }
    // function thêm thông tin hợp đồng lao động
    handleChangeContract = (data) => {
        const { contract } = this.state;
        this.setState({
            contract: [...contract, {
                ...data
            }]
        })
    }
    // function chỉnh sửa thông tin hợp đồng lao động
    handleEditContract = (data) => {
        const { contract } = this.state;
        contract[data.index] = data;
        this.setState({
            contract: contract
        })
    }
    // function thêm thông tin quá trình đóng BHXH
    handleChangeBHXH = (data) => {
        const { employeeNew } = this.state;
        var BHXH = employeeNew.BHXH;
        this.setState({
            employeeNew: {
                ...employeeNew,
                BHXH: [...BHXH, {
                    ...data
                }]
            }
        })
    }
    // function chỉnh sửa thông tin quá trình đóng BHXH
    handleEditBHXH = (data) => {
        const { employeeNew } = this.state;
        var BHXH = employeeNew.BHXH;
        BHXH[data.index] = data;
        this.setState({
            employeeNew: {
                ...employeeNew,
                BHXH: BHXH
            }
        })
    }
    //function thêm thông tin quá trình đào tạo
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
    // function thêm thông tin khen thưởng
    handleChangePraise = (data) => {
        const { praiseNew } = this.state;
        this.setState({
            praiseNew: [...praiseNew, {
                ...data
            }]
        })
    }
    // function chỉnh sửa thông tin khen thưởng
    handleEditPraise = (data) => {
        const { praiseNew } = this.state;
        praiseNew[data.index] = data;
        if (data._id === " ") {
            this.setState({
                praiseNew: praiseNew
            })
        } else {
            this.setState({
                praiseEdit: [...this.state.praiseEdit, { ...data }],
                praiseNew: praiseNew
            })
        }
    }
    // function thêm thông tin kỷ luật
    handleChangeDiscipline = (data) => {
        const { disciplineNew } = this.state;
        this.setState({
            disciplineNew: [...disciplineNew, {
                ...data
            }]
        })
    }
    // function chỉnh sửa thông tin kỷ luật
    handleEditDiscipline = (data) => {
        const { disciplineNew } = this.state;
        disciplineNew[data.index] = data;
        if (data._id === " ") {
            this.setState({
                disciplineNew: disciplineNew
            })
        } else {
            this.setState({
                disciplineEdit: [...this.state.disciplineEdit, { ...data }],
                disciplineNew: disciplineNew
            })
        }

    }
    // function thêm thông tin lịch sử lương
    handleChangeSalary = (data) => {
        const { salaryNew } = this.state;
        let check = [];
        check = salaryNew.filter(salary => (salary.month === data.month));
        if (check.length !== 0) {
            this.notifyerror("Tháng lương đã tồn tại")
        } else {
            this.setState({
                salaryNew: [...salaryNew, {
                    ...data
                }]
            })
        }
    }
    // function chỉnh sửa thông tin lịch sử lương
    handleEditSalary = (data) => {
        const { salaryNew } = this.state;
        salaryNew[data.index] = data;
        if (data._id === " ") {
            this.setState({
                salaryNew: salaryNew
            })
        } else {
            this.setState({
                salaryEdit: [...this.state.salaryEdit, { ...data }],
                salaryNew: salaryNew
            })
        }
    }
    // function thêm thông tin nghỉ phép
    handleChangeSabbatical = (data) => {
        const { sabbaticalNew } = this.state;
        this.setState({
            sabbaticalNew: [...sabbaticalNew, {
                ...data
            }]
        })
    }
    // function chỉnh sửa thông tin nghỉ phép
    handleEditSabbatical = (data) => {
        const { sabbaticalNew } = this.state;
        sabbaticalNew[data.index] = data;
        if (data._id === " ") {
            this.setState({
                sabbaticalNew: sabbaticalNew
            })
        } else {
            this.setState({
                sabbaticalEdit: [...this.state.sabbaticalEdit, { ...data }],
                sabbaticalNew: sabbaticalNew
            })
        }
    }

    //function thêm thông tin tài liệu đính kèm
    handleChangeFile = (data) => {
        const { file } = this.state;
        this.setState({
            file: [...file, {
                ...data
            }]
        })
    }
    //function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = (data) => {
        const { file } = this.state;
        file[data.index] = data;
        this.setState({
            file: file
        })
    }
    // function xoá các thông tin certificate, experience, contract, BHXH, course
    delete = (key, index) => {
        const { employeeNew, file, contract, certificate, certificateShort } = this.state;
        if (key === "certificate") {
            certificate.splice(index, 1);
            this.setState({
                certificate: [...certificate]
            })
        };
        if (key === "certificateShort") {
            certificateShort.splice(index, 1);
            this.setState({
                certificateShort: [...certificateShort]
            })
        };
        if (key === "experience") {
            var experience = employeeNew.experience;
            experience.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    experience: [...experience]
                }
            })
        };
        if (key === "contract") {
            contract.splice(index, 1);
            this.setState({
                contract: [...contract]
            })
        };
        if (key === "BHXH") {
            var BHXH = employeeNew.BHXH;
            BHXH.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    BHXH: [...BHXH]
                }
            })
        };
        if (key === "course") {
            var course = employeeNew.course;
            course.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    course: [...course]
                }
            })
        };
        if (key === "praiseNew") {
            const { praiseNew } = this.state;
            var praiseDelete = praiseNew[index];
            praiseNew.splice(index, 1);
            if (praiseDelete._id === " ") {
                this.setState({
                    praiseNew: [...praiseNew]
                })
            } else {
                this.setState({
                    praiseDelete: [...this.state.praiseDelete, { ...praiseDelete }],
                    praiseNew: [...praiseNew]
                })
            }

        };
        if (key === "disciplineNew") {
            const { disciplineNew } = this.state;
            var disciplineDelete = disciplineNew[index];
            disciplineNew.splice(index, 1);
            if (disciplineDelete._id === " ") {
                this.setState({
                    disciplineNew: [...disciplineNew]
                })
            } else {
                this.setState({
                    disciplineDelete: [...this.state.disciplineDelete, { ...disciplineDelete }],
                    disciplineNew: [...disciplineNew]
                })
            }

        };
        if (key === "salaryNew") {
            const { salaryNew } = this.state;
            var salaryDelete = salaryNew[index];
            salaryNew.splice(index, 1);
            if (salaryDelete._id === " ") {
                this.setState({
                    salaryNew: [...salaryNew]
                })
            } else {
                this.setState({
                    salaryDelete: [...this.state.salaryDelete, { ...salaryDelete }],
                    salaryNew: [...salaryNew]
                })
            }

        };
        if (key === "sabbaticalNew") {
            const { sabbaticalNew } = this.state;
            var sabbaticalDelete = sabbaticalNew[index];
            sabbaticalNew.splice(index, 1);
            if (sabbaticalDelete._id === " ") {
                this.setState({
                    sabbaticalNew: [...sabbaticalNew]
                })
            } else {
                this.setState({
                    sabbaticalDelete: [...this.state.sabbaticalDelete, { ...sabbaticalDelete }],
                    sabbaticalNew: [...sabbaticalNew]
                })
            }

        };
        if (key === "file") {
            file.splice(index, 1);
            this.setState({
                file: [...file]
            })
        };
    }

    // function thêm tài liệu đính kèm mặc định
    defaulteClick(event) {
        event.preventDefault();
        const defaulteFile = [
            { nameFile: "Bằng cấp", discFile: "Bằng tốt nghiệp trình độ học vấn cao nhất", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Sơ yếu lý lịch", discFile: "Sơ yếu lý lịch có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Ảnh", discFile: "Ảnh 4X6", number: "3", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Bản sao CMND/Hộ chiếu", discFile: "Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Giấy khám sức khoẻ", discFile: "Giấy khám sức khoẻ có dấu đỏ", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Giấy khai sinh", discFile: "Giấy khái sinh có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Đơn xin việc", discFile: "Đơn xin việc viết tay", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "CV", discFile: "CV của nhân viên", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Cam kết", discFile: "Giấy cam kết làm việc", number: "1", status: "Đã nộp", file: "", urlFile: " " },
            { nameFile: "Tạm trú tạm vắng", discFile: "Giấy xác nhận tạm trú tạm vắng", number: "1", status: "Đã nộp", file: "", urlFile: " " }
        ]
        this.setState({
            file: defaulteFile
        })
    }

    handleSubmit = async () => {
        let newEmployee = this.state.employeeNew;
        let { file, contract, certificate, certificateShort } = this.state;
        // cập nhật lại state trước khi add employee
        await this.setState({
            employeeNew: {
                ...newEmployee,
                brithday: this.refs.brithday.value.length !== 0 ? this.refs.brithday.value : newEmployee.brithday,
                dateCMND: this.refs.dateCMND.value.length !== 0 ? this.refs.dateCMND.value : newEmployee.dateCMND,
                startTax: this.refs.startTax.value.length !== 0 ? this.refs.startTax.value : newEmployee.startTax,
                startDateBHYT: this.refs.startDateBHYT.value.length !== 0 ? this.refs.startDateBHYT.value : newEmployee.startDateBHYT,
                endDateBHYT: this.refs.endDateBHYT.value.length !== 0 ? this.refs.endDateBHYT.value : newEmployee.endDateBHYT,
                certificate: certificate.filter(certificate => (certificate.fileUpload === undefined)),
                certificateShort: certificateShort.filter(certificateShort => (certificateShort.fileUpload === undefined)),
                contract: contract.filter(contract => (contract.fileUpload === undefined)),
                file: file.filter(file => (file.fileUpload === undefined))
            }
        });
        const { employeeNew } = this.state;
        // kiểm tra việc nhập các trường bắt buộc
        if (employeeNew.employeeNumber !== undefined && employeeNew.employeeNumber === " ") {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (employeeNew.employeeNumber !== undefined && this.props.employeesManager.checkMSNV === true) {
            this.notifyerror("Mã số nhân viên đã tồn tại");
        } else if (employeeNew.fullName !== undefined && employeeNew.fullName === " ") {
            this.notifyerror("Bạn chưa nhập tên nhân viên");
        } else if (employeeNew.MSCC !== undefined && employeeNew.MSCC === " ") {
            this.notifyerror("Bạn chưa nhập mã chấm công");
        } else if (employeeNew.brithday !== undefined && employeeNew.brithday === " ") {
            this.notifyerror("Bạn chưa nhập ngày sinh");
        } else if (employeeNew.emailCompany !== undefined && employeeNew.emailCompany === " ") {
            this.notifyerror("Bạn chưa nhập email công ty");
        } else if (employeeNew.emailCompany !== undefined && this.props.employeesManager.checkEmail === true) {
            this.notifyerror("Email công ty đã được sử dụng");
        } else if (employeeNew.CMND !== undefined && employeeNew.CMND === " ") {
            this.notifyerror("Bạn chưa nhập số CMND/ Hộ chiếu");
        } else if (employeeNew.dateCMND !== undefined && employeeNew.dateCMND === " ") {
            this.notifyerror("Bạn chưa nhập ngày cấp CMND/ Hộ chiếu");
        } else if (employeeNew.addressCMND !== undefined && employeeNew.addressCMND === " ") {
            this.notifyerror("Bạn chưa nhập nơi cấp CMND/ Hộ chiếu");
        } else if (employeeNew.phoneNumber !== undefined && employeeNew.phoneNumber === " ") {
            this.notifyerror("Bạn chưa nhập số điện thoại");
        } else if (employeeNew.nowAddress !== undefined && employeeNew.nowAddress === " ") {
            this.notifyerror("Bạn chưa nhập nơi ở hiện tại");
        } else if ((employeeNew.numberTax !== undefined && employeeNew.numberTax === " ") || (employeeNew.userTax !== undefined && employeeNew.userTax === " ") ||
            (employeeNew.startTax !== undefined && employeeNew.startTax === " ") || (employeeNew.unitTax !== undefined && employeeNew.unitTax === " ")) {
            this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
        } else {
            await this.props.updateInformationEmployee(this.props.employee[0]._id, employeeNew);
            var employeeNumber = this.state.employeeNew.employeeNumber ? this.state.employeeNew.employeeNumber : this.props.employee[0].employeeNumber;
            if (this.state.avatar !== "") {
                let formData = new FormData();
                formData.append('fileUpload', this.state.avatar);
                this.props.uploadAvatar(employeeNumber, formData);
            };
            // lưu hợp đồng lao động
            if (this.state.contract.length !== 0) {
                let listContract = this.state.contract;
                listContract = listContract.filter(contract => (contract.fileUpload !== undefined))
                listContract.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameContract', x.nameContract);
                    formData.append('typeContract', x.typeContract);
                    formData.append('file', x.file);
                    formData.append('startDate', x.startDate);
                    formData.append('endDate', x.endDate);
                    //console.log("hdhadhahwhdhsfhjaw",x.fileUpload)
                    this.props.updateContract(employeeNumber, formData)
                })
            }
            // lưu thông tin bằng cấp
            if (this.state.certificate.length !== 0) {
                let listCertificate = this.state.certificate;
                listCertificate = listCertificate.filter(certificate => (certificate.fileUpload !== undefined))
                listCertificate.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameCertificate', x.nameCertificate);
                    formData.append('addressCertificate', x.addressCertificate);
                    formData.append('file', x.file);
                    formData.append('yearCertificate', x.yearCertificate);
                    formData.append('typeCertificate', x.typeCertificate);
                    this.props.updateCertificate(employeeNumber, formData)
                })
            }
            // lưu thông tin chứng chỉ
            if (this.state.certificateShort.length !== 0) {
                let listCertificateShort = this.state.certificateShort;
                listCertificateShort = listCertificateShort.filter(certificateShort => (certificateShort.fileUpload !== undefined))
                listCertificateShort.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameCertificateShort', x.nameCertificateShort);
                    formData.append('unit', x.unit);
                    formData.append('file', x.file);
                    formData.append('startDate', x.startDate);
                    formData.append('endDate', x.endDate);
                    this.props.updateCertificateShort(employeeNumber, formData)
                })
            }
            // lưu thông tin tài liệu đính kèm
            if (this.state.file.length !== 0) {
                let listFile = this.state.file;
                listFile = listFile.filter(file => (file.fileUpload !== undefined))
                listFile.map(x => {
                    let formData = new FormData();
                    formData.append('fileUpload', x.fileUpload);
                    formData.append('nameFile', x.nameFile);
                    formData.append('discFile', x.discFile);
                    formData.append('file', x.file);
                    formData.append('number', x.number);
                    formData.append('status', x.status);
                    this.props.updateFile(employeeNumber, formData)
                })
            }
            // lưu lịch sử tăng giảm lương
            if (this.state.salaryNew.length !== 0) {
                let createSalary = this.state.salaryNew.filter(salary => (salary._id === " "));
                if (createSalary.length !== 0) {
                    createSalary.map(x => {
                        this.props.createNewSalary({ ...x, employeeNumber })
                    });
                }
            }
            if (this.state.salaryEdit.length !== 0) {
                this.state.salaryEdit.map(x => {
                    this.props.updateSalary(x._id, { ...x, employeeNumber })
                });
            }
            if (this.state.salaryDelete.length !== 0) {
                this.state.salaryDelete.map(x => {
                    this.props.deleteSalary(x._id);
                })
            }
            // lưu thông tin nghỉ phép
            if (this.state.sabbaticalNew.length !== 0) {
                let createSabbatical = this.state.sabbaticalNew.filter(sabbatical => (sabbatical._id === " "));
                if (createSabbatical.length !== 0) {
                    createSabbatical.map(x => {
                        this.props.createNewSabbatical({ ...x, employeeNumber })
                    });
                }
            }
            if (this.state.sabbaticalEdit.length !== 0) {
                this.state.sabbaticalEdit.map(x => {
                    this.props.updateSabbatical(x._id, { ...x, employeeNumber })
                });
            }
            if (this.state.sabbaticalDelete.length !== 0) {
                this.state.sabbaticalDelete.map(x => {
                    this.props.deleteSabbatical(x._id);
                })
            }
            // lưu thông tin khen thưởng
            if (this.state.praiseNew.length !== 0) {
                let createPraise = this.state.praiseNew.filter(praise => (praise._id === " "));
                if (createPraise.length !== 0) {
                    createPraise.map(x => {
                        this.props.createNewPraise({ ...x, employeeNumber })
                    });
                }
            }
            if (this.state.praiseEdit.length !== 0) {
                this.state.praiseEdit.map(x => {
                    this.props.updatePraise(x._id, { ...x, employeeNumber })
                });
            }
            if (this.state.praiseDelete.length !== 0) {
                this.state.praiseDelete.map(x => {
                    this.props.deletePraise(x._id);
                })
            }
            // lưu thông tin kỷ luật
            if (this.state.disciplineNew.length !== 0) {
                let createDiscipline = this.state.disciplineNew.filter(discipline => (discipline._id === " "));
                if (createDiscipline.length !== 0) {
                    createDiscipline.map(x => {
                        this.props.createNewDiscipline({ ...x, employeeNumber })
                    });
                }
            }
            if (this.state.disciplineEdit.length !== 0) {
                this.state.disciplineEdit.map(x => {
                    this.props.updateDiscipline(x._id, { ...x, employeeNumber })
                });
            }
            if (this.state.disciplineDelete.length !== 0) {
                this.state.disciplineDelete.map(x => {
                    this.props.deleteDiscipline(x._id);
                })
            }
            await  this.props.getAllEmployee(this.props.initState);
            this.notifysuccess("Chỉnh sửa thông tin thành công");
            window.$(`#modal-editEmployee-${this.props.employee[0].employeeNumber}`).modal("hide");
        }
    }
    render() {
        console.log(this.props.initState);
        //console.log(this.state.employeeNew);
        var id = this.props.employee[0]._id;
        var formatter = new Intl.NumberFormat();
        var employee = this.props.employee;
        var employeeContact = this.props.employeeContact;
        return (
            <React.Fragment>
                {(typeof employee === 'undefined' || employee.length === 0) ? <span className="text-red">Chưa có thông tin cá nhân</span> :
                    employee.map((x, index) => (
                        <div style={{ display: "inline" }} key={index}>
                            <a href={`#modal-editEmployee-${x.employeeNumber}`} className="edit" title="Chỉnh sửa thông tin nhân viên " data-toggle="modal"><i className="material-icons"></i></a>
                            <div className="modal modal-full fade" id={`modal-editEmployee-${x.employeeNumber}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                <div className="modal-dialog-full">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span></button>
                                            <h4 className="modal-title">Cập nhật thông tin:  {x.fullName} - {x.employeeNumber} </h4>
                                        </div>
                                        <div className="modal-body" style={{ paddingTop: 0 }}>
                                            <div className="nav-tabs-custom" >
                                                <ul className="nav nav-tabs">
                                                    <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin chung của nhân viên" data-toggle="tab" href={`#editthongtinchung-${x.employeeNumber}`}>Thông tin chung</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin liên hệ của nhân viên" data-toggle="tab" href={`#editthongtinlienhe-${x.employeeNumber}`}>Thông tin liên hệ</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Trình độ học vấn - Khinh nghiệm làm việc" data-toggle="tab" href={`#editkinhnghiem-${x.employeeNumber}`}> Học vấn - Kinh nghiệm</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Bằng cấp - Chứng chỉ" data-toggle="tab" href={`#editbangcap-${x.employeeNumber}`}>Bằng cấp - Chứng chỉ</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Tài khoản ngân hành - Thuế thu nhập các nhân" data-toggle="tab" href={`#edittaikhoan-${x.employeeNumber}`}>Tài khoản - Thuế</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin bảo hiểm" data-toggle="tab" href={`#editbaohiem-${x.employeeNumber}`}>Thông tin bảo hiểm</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Hợp đồng lao động - Quá trình đào tạo" data-toggle="tab" href={`#edithopdong-${x.employeeNumber}`}>Hợp đồng - Đào tạo</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Khen thưởng - kỷ luật" data-toggle="tab" href={`#editkhenthuong-${x.employeeNumber}`}>Khen thưởng - Kỷ luật</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Lịch sử tăng giảm lương - Thông tin nghỉ phép" data-toggle="tab" href={`#edithistorySalary-${x.employeeNumber}`}>Lịch sử lương - Nghỉ phép</a></li>
                                                    <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Tài liệu đính kèm" data-toggle="tab" href={`#edittailieu-${x.employeeNumber}`}>Tài liệu đính kèm</a></li>
                                                </ul>
                                                < div className="tab-content">
                                                    <div id={`editthongtinchung-${x.employeeNumber}`} className="tab-pane active">
                                                        <div className="box-body">
                                                            <div className="col-md-12">
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <img className="attachment-img avarta" src={this.state.img} alt="Attachment" />
                                                                        <div className="upload btn btn-default" style={{ marginLeft: 55 }}>
                                                                            Chọn ảnh
                                                                        <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className=" col-md-4">
                                                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                                                        <label style={{ paddingLeft: 0 }}>
                                                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="employeeNumber">Mã nhân viên:<span className="text-red">&#42;</span></label>
                                                                        <input type="text" className="form-control" defaultValue={x.employeeNumber} name="employeeNumber" autoComplete="off" placeholder="Mã số nhân viên" onChange={this.handleChangeMSNV} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="fullname">Họ và tên:<span className="text-red">&#42;</span></label>
                                                                        <input type="text" className="form-control" name="fullName" defaultValue={x.fullName} placeholder="Họ và tên" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="brithday">Ngày sinh:<span className="text-red">&#42;</span></label>
                                                                        <div className={'input-group date has-feedback'}>
                                                                            <div className="input-group-addon">
                                                                                <i className="fa fa-calendar" />
                                                                            </div>
                                                                            <input type="text" className="form-control datepicker" defaultValue={x.brithday} name="brithday" ref="brithday" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autoComplete="off" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="emailCompany">Email:<span className="text-red">&#42;</span></label>
                                                                        <input type="email" className="form-control" defaultValue={x.emailCompany} placeholder="Email công ty" name="emailCompany" onChange={this.handleChangeEmail} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                                <div className=" col-md-4 " style={{ marginTop: 30 }}>
                                                                    <div className="form-group">
                                                                        <label htmlFor="MSCC">Mã số chấm công:<span className="text-red">&#42;</span></label>
                                                                        <input type="text" className="form-control" placeholder="Mã số chấm công" defaultValue={x.MSCC} name="MSCC" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label style={{ display: 'block', paddingBottom: 4 }}>Giới tính:<span className="text-red">&#42;</span></label>
                                                                        {
                                                                            x.gender === "Nam" ?
                                                                                <input type="radio" name={"gender" + x.employeeNumber} value="Nam" className="" checked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeGender} /> :
                                                                                <input type="radio" name={"gender" + x.employeeNumber} value="Nam" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeGender} />
                                                                        }
                                                                        <label>Nam</label>
                                                                        {
                                                                            x.gender === "Nữ" ?
                                                                                <input type="radio" name={"gender" + x.employeeNumber} value="Nữ" checked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeGender} /> :
                                                                                <input type="radio" name={"gender" + x.employeeNumber} value="Nữ" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeGender} />
                                                                        }
                                                                        <label>Nữ</label>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="birthplace">Nơi sinh:</label>
                                                                        <input type="text" className="form-control" defaultValue={x.birthplace} name="birthplace" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label style={{ display: 'block', paddingBottom: 7 }}>Tình trạng hôn nhân:</label>
                                                                        {
                                                                            x.relationship === "Độc thân" ?
                                                                                <input type="radio" name={"relationship" + x.employeeNumber} value="Độc thân" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeRelationship} /> :
                                                                                <input type="radio" name={"relationship" + x.employeeNumber} value="Độc thân" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeRelationship} />
                                                                        }

                                                                        <label> Độc thân</label>
                                                                        {
                                                                            x.relationship === "Đã kết hôn" ?
                                                                                <input type="radio" name={"relationship" + x.employeeNumber} value="Đã kết hôn" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeRelationship} /> :
                                                                                <input type="radio" name={"relationship" + x.employeeNumber} value="Đã kết hôn" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChangeRelationship} />
                                                                        }
                                                                        <label> Đã kết hôn</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label htmlFor="CMND">Số CMND/Hộ chiếu:<span className="text-red">&#42;</span></label>
                                                                        <input type="number" className="form-control" defaultValue={x.CMND} name="CMND" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="national">Dân tộc:</label>
                                                                        <input type="text" className="form-control" defaultValue={x.national} name="national" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label htmlFor="dateCMND">Ngày cấp:<span className="text-red">&#42;</span></label>
                                                                        <div className={'input-group date has-feedback'}>
                                                                            <div className="input-group-addon">
                                                                                <i className="fa fa-calendar" />
                                                                            </div>
                                                                            <input type="text" className="form-control datepicker" defaultValue={x.dateCMND} name="dateCMND" ref="dateCMND" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="religion">Tôn giáo:</label>
                                                                        <input type="text" className="form-control" defaultValue={x.religion} name="religion" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>

                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label htmlFor="addressCMND">Nơi cấp:<span className="text-red">&#42;</span></label>
                                                                        <input type="text" className="form-control" defaultValue={x.addressCMND} name="addressCMND" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nation">Quốc tịch:</label>
                                                                        <input type="text" className="form-control" defaultValue={x.nation} name="nation" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {employeeContact && employeeContact.map((y, indexs) => (
                                                        <div id={`editthongtinlienhe-${x.employeeNumber}`} className="tab-pane" key={indexs}>
                                                            <div className="box-body">
                                                                <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                                                    <div className="col-md-4">
                                                                        <div className="form-group" style={{ paddingTop: 3 }}>
                                                                            <label htmlFor="phoneNumber">Điện thoại đi động 1:<span className="text-red">&#42;</span></label>
                                                                            <input type="number" className="form-control" defaultValue={y.phoneNumber} name="phoneNumber" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="emailPersonal">Email cá nhân 1</label>
                                                                            <input type="text" className="form-control" defaultValue={y.emailPersonal} name="emailPersonal" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group" style={{ paddingTop: 3 }}>
                                                                        <label htmlFor="phoneNumber2">Điện thoại đi động 2:</label>
                                                                        <input type="number" className="form-control" defaultValue={y.phoneNumber2} name="phoneNumber2" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label htmlFor="emailPersonal2">Email cá nhân 2</label>
                                                                        <input type="text" className="form-control" defaultValue={y.emailPersonal2} name="emailPersonal2" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="form-group">
                                                                        <label htmlFor="phoneNumberAddress">Điện thoại nhà riêng:</label>
                                                                        <input type="text" className="form-control" defaultValue={y.phoneNumberAddress} name="phoneNumberAddress" onChange={this.handleChange} autoComplete="off" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <fieldset className="scheduler-border">
                                                                        <legend className="scheduler-border">
                                                                            <h4 className="box-title">Liên hệ khẩn cấp với ai</h4>
                                                                        </legend>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label htmlFor="friendName">Họ và tên:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.friendName} name="friendName" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="friendPhone">Điện thoại di động:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.friendPhone} name="friendPhone" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>

                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label htmlFor="relation">Quan hệ:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.relation} name="relation" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="friendPhoneAddress">Điện thoại nhà riêng:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.friendPhoneAddress} name="friendPhoneAddress" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-4">
                                                                            <div className="form-group">
                                                                                <label htmlFor="friendAddress">Địa chỉ:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.friendAddress} name="friendAddress" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>
                                                                            <div className="form-group">
                                                                                <label htmlFor="friendEmail">Email:</label>
                                                                                <input type="text" className="form-control" defaultValue={y.friendEmail} name="friendEmail" onChange={this.handleChange} autoComplete="off" />
                                                                            </div>
                                                                        </div>
                                                                    </fieldset>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <fieldset className="scheduler-border">
                                                                        <legend className="scheduler-border"><h4 className="box-title">Hộ khẩu thường trú</h4></legend>
                                                                        <div className="form-group">
                                                                            <label htmlFor="localAddress">Địa chỉ:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.localAddress} name="localAddress" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="localCommune">
                                                                                Xã/Phường:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.localCommune} name="localCommune" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="localDistrict">
                                                                                Quận/Huyện:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.localDistrict} name="localDistrict" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="localCity">
                                                                                Tỉnh/Thành phố:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.localCity} name="localCity" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="localNational">Quốc gia:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.localNational} name="localNational" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                    </fieldset>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <fieldset className="scheduler-border">
                                                                        <legend className="scheduler-border"><h4 className="box-title"> Chỗ ở hiện tại</h4></legend>

                                                                        <div className="form-group">
                                                                            <label htmlFor="nowAddress">
                                                                                Địa chỉ:<span className="text-red">&#42;</span></label>
                                                                            <input type="text" className="form-control" defaultValue={y.nowAddress} name="nowAddress" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="nowCommune">
                                                                                Xã/Phường:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.nowCommune} name="nowCommune" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="nowDistrict">
                                                                                Quận/Huyện:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.nowDistrict} name="nowDistrict" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="nowCity">
                                                                                Tỉnh/Thành phố:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.nowCity} name="nowCity" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="nowNational">
                                                                                Quốc gia:</label>
                                                                            <input type="text" className="form-control" defaultValue={y.nowNational} name="nowNational" onChange={this.handleChange} autoComplete="off" />
                                                                        </div>
                                                                    </fieldset>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    ))}
                                                    <div id={`edittaikhoan-${x.employeeNumber}`} className="tab-pane">
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Tài khoản ngân hàng:</h4></legend>
                                                            <div className="box-body">
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="ATM">Số tài khoản:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.ATM} name="ATM" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="nameBank">Tên ngân hàng:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.nameBank} name="nameBank" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="addressBank">Chi nhánh:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.addressBank} name="addressBank" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thuế thu nhập cá nhân:</h4></legend>
                                                            <div className="form-group">
                                                                <label htmlFor="numberTax">Mã số thuế:<span className="text-red">&#42;</span></label>
                                                                <input type="number" className="form-control" defaultValue={x.numberTax} name="numberTax" onChange={this.handleChange} autoComplete="off" />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="userTax">Người đại diện:<span className="text-red">&#42;</span></label>
                                                                <input type="text" className="form-control" defaultValue={x.userTax} name="userTax" onChange={this.handleChange} autoComplete="off" />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="startDate">Ngày hoạt động:<span className="text-red">&#42;</span></label>
                                                                <div className={'input-group date has-feedback'}>
                                                                    <div className="input-group-addon">
                                                                        <i className="fa fa-calendar" />
                                                                    </div>
                                                                    <input type="text" className="form-control datepicker" defaultValue={x.startTax} name="startTax" ref="startTax" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="unitTax">Quản lý bởi:<span className="text-red">&#42;</span></label>
                                                                <input type="text" className="form-control" defaultValue={x.unitTax} name="unitTax" onChange={this.handleChange} autoComplete="off" />
                                                            </div>
                                                        </fieldset>

                                                    </div>
                                                    <div id={`editbangcap-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bằng cấp:</h4></legend>
                                                                <ModalAddCertificate handleChange={this.handleChangeCertificate} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "18%" }}>Tên bằng</th>
                                                                            <th style={{ width: "16%" }}>Nơi đào tạo</th>
                                                                            <th style={{ width: "13%" }}>Năm tốt nghiệp</th>
                                                                            <th style={{ width: "13%" }}>Xếp loại</th>
                                                                            <th style={{ width: "30%" }}>File đính kèm</th>
                                                                            <th style={{ width: "10%" }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.certificate === 'undefined' || this.state.certificate.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.certificate.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.nameCertificate}</td>
                                                                                    <td>{x.addressCertificate}</td>
                                                                                    <td>{x.yearCertificate}</td>
                                                                                    <td>{x.typeCertificate}</td>
                                                                                    <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                                                        <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                                                                    </td>
                                                                                    <td>
                                                                                        <ModalEditCertificate index={index} keys={id} data={x} handleChange={this.handleEditCertificate} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("certificate", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">Chứng chỉ:</h4></legend>
                                                                <ModalAddCertificateShort handleChange={this.handleChangeCertificateShort} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "22%" }}>Tên chứng chỉ</th>
                                                                            <th style={{ width: "17%" }}>Nơi cấp</th>
                                                                            <th style={{ width: "9%" }}>Ngày cấp</th>
                                                                            <th style={{ width: "12%" }}>Ngày hết hạn</th>
                                                                            <th style={{ width: "30%" }}>File đính kèm</th>
                                                                            <th style={{ width: "10%" }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.certificateShort === 'undefined' || this.state.certificateShort.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.certificateShort.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.nameCertificateShort}</td>
                                                                                    <td>{x.unit}</td>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.endDate}</td>
                                                                                    <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                                                        <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                                                                    <td>
                                                                                        <ModalEditCertificateShort index={index} keys={id} handleChange={this.handleEditCertificateShort} data={x} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("certificateShort", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                        </div>

                                                    </div>
                                                    <div id={`editkinhnghiem-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">Trình độ học vấn</h4></legend>
                                                                <div className="form-group">
                                                                    <label>Trình độ văn hoá:<span className="text-red">&#42;</span></label>
                                                                    <select className="form-control" defaultValue={x.cultural} name="cultural" onChange={this.handleChange}>
                                                                        <option value="12/12">12/12</option>
                                                                        <option value="11/12">11/12</option>
                                                                        <option value="10/12">10/12</option>
                                                                        <option value="9/12">9/12</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="foreignLanguage ">Trình độ ngoại ngữ:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.foreignLanguage} name="foreignLanguage" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="educational ">Trình độ chuyên môn:</label>
                                                                    <select className="form-control" name="educational" defaultValue={x.educational} onChange={this.handleChange}>
                                                                        <option value="Trung cấp">Trung cấp</option>
                                                                        <option value="Cao đẳng">Cao đẳng</option>
                                                                        <option value="Đại học">Đại học</option>
                                                                        <option value="Thạc sỹ">Thạc sỹ</option>
                                                                        <option value="Tiến sỹ">Tiến sỹ</option>
                                                                        <option value="Không có">Không có</option>

                                                                    </select>
                                                                </div>
                                                            </fieldset>
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Kinh nghiệm làm việc</h4></legend>
                                                                <ModalAddExperience handleChange={this.handleChangeExperience} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: '14%' }}>Từ tháng/năm</th>
                                                                            <th style={{ width: '14%' }}>Đến tháng/năm</th>
                                                                            <th>Đơn vị công tác</th>
                                                                            <th>Chức vụ</th>
                                                                            <th style={{ width: '10%' }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.employeeNew.experience === 'undefined' || this.state.employeeNew.experience.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.employeeNew.experience.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.endDate}</td>
                                                                                    <td>{x.unit}</td>
                                                                                    <td>{x.position}</td>
                                                                                    <td >
                                                                                        <ModalEditExperience index={index} keys={id} data={x} handleChange={this.handleEditExperience} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("experience", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                        </div>

                                                    </div>
                                                    <div id={`editbaohiem-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm y tế</h4></legend>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="numberBHYT">Mã số BHYT:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.numberBHYT} name="numberBHYT" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="startDateBHYT">Ngày có hiệu lực:</label>
                                                                    <div className={'input-group date has-feedback'}>
                                                                        <div className="input-group-addon">
                                                                            <i className="fa fa-calendar" />
                                                                        </div>
                                                                        <input type="text" className="form-control datepicker" defaultValue={x.startDateBHYT} name="startDateBHYT" ref="startDateBHYT" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="endDateBHYT">Ngày hết hạn:</label>
                                                                    <div className={'input-group date has-feedback'}>
                                                                        <div className="input-group-addon">
                                                                            <i className="fa fa-calendar" />
                                                                        </div>
                                                                        <input type="text" className="form-control datepicker" defaultValue={x.endDateBHYT} name="endDateBHYT" ref="endDateBHYT" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm xã hội</h4></legend>
                                                                <div className="form-group col-md-4">
                                                                    <label htmlFor="numberBHXH">Mã số BHXH:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.numberBHXH} name="numberBHXH" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>Quá trình đóng bảo hiểm xã hội:</h4>
                                                                    <ModalImportFileBHXH index={x.employeeNumber} />
                                                                    <ModalAddBHXH handleChange={this.handleChangeBHXH} index={x.employeeNumber} />
                                                                    <table className="table table-striped table-bordered table-resizable " >
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: "15%" }}>Từ tháng</th>
                                                                                <th style={{ width: "15%" }}>Đến tháng</th>
                                                                                <th style={{ width: "30%" }}>Đơn vị công tác</th>
                                                                                <th style={{ width: "30%" }}>Chức vụ</th>
                                                                                <th style={{ width: '10%' }}>Hành động</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(typeof this.state.employeeNew.BHXH === 'undefined' || this.state.employeeNew.BHXH.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                                this.state.employeeNew.BHXH.map((x, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{x.startDate}</td>
                                                                                        <td>{x.endDate}</td>
                                                                                        <td>{x.unit}</td>
                                                                                        <td>{x.position}</td>
                                                                                        <td>
                                                                                            <ModalEditBHXH index={index} keys={id} handleChange={this.handleEditBHXH} data={x} />
                                                                                            <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("BHXH", index)}><i className="material-icons"></i></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </fieldset>
                                                        </div>

                                                    </div>
                                                    <div id={`edithopdong-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Hợp đồng lao động</h4></legend>
                                                                <ModalAddContract handleChange={this.handleChangeContract} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable " >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "25%" }}>Tên hợp đồng</th>
                                                                            <th style={{ width: "13%" }}>Loại hợp đồng</th>
                                                                            <th style={{ width: "14%" }}>Ngày có hiệu lực</th>
                                                                            <th style={{ width: "13%" }}>Ngày hết hạn</th>
                                                                            <th style={{ width: "30%" }}>File đính kèm</th>
                                                                            <th style={{ width: '10%' }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.contract === 'undefined' || this.state.contract.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.contract.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.nameContract}</td>
                                                                                    <td>{x.typeContract}</td>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.endDate}</td>
                                                                                    <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                                                        <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                                                                    <td>
                                                                                        <ModalEditContract data={x} index={index} keys={id} handleChange={this.handleEditContract} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("contract", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Quá trình đào tạo</h4></legend>
                                                                <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="course" title="Thêm mới quá trình đào tạo" onClick={this.handleAddNew}>Thêm mới</button>
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: '18%' }}>Tên khoá học</th>
                                                                            <th style={{ width: '11%' }}>Ngày bắt đầu</th>
                                                                            <th style={{ width: '11%' }}>Ngày kết thúc</th>
                                                                            <th style={{ width: '15%' }}>Nơi đào tạo</th>
                                                                            <th style={{ width: '11%' }}>Loại đào tạo</th>
                                                                            <th style={{ width: '10%' }}>Chi phí</th>
                                                                            {/* <th style={{ width: '12%' }}>Thời gian cam kết</th> */}
                                                                            <th style={{ width: '12%' }}>Trạng thái</th>
                                                                            <th style={{ width: '10%' }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.employeeNew.course === 'undefined' || this.state.employeeNew.course.length === 0) ? <tr><td colSpan={8}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.employeeNew.course.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.nameCourse}</td>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.endDate}</td>
                                                                                    <td>{x.unit}</td>
                                                                                    <td>{x.typeCourse}></td>
                                                                                    <td><input type="text" style={{ width: "100%" }} /></td>
                                                                                    <td>{x.status}</td>
                                                                                    <td style={{ textAlign: "center" }}>
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("course", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                        </div>

                                                    </div>
                                                    <div id={`editkhenthuong-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Khen thưởng</h4></legend>
                                                                <ModalAddPraise handleChange={this.handleChangePraise} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Số quyết định</th>
                                                                            <th>Ngày quyết định</th>
                                                                            <th>Cấp ra quyết định</th>
                                                                            <th>Hình thức khen thưởng</th>
                                                                            <th style={{ width: "15%" }}>Thành tích (lý do)</th>
                                                                            <th style={{ width: "10%" }}>Hành động</th>
                                                                        </tr>

                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.praiseNew === 'undefined' || this.state.praiseNew.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.praiseNew.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.number}</td>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.unit}</td>
                                                                                    <td>{x.type}</td>
                                                                                    <td>{x.reason}</td>
                                                                                    <td>
                                                                                        <ModalEditPraise index={index} keys={id} data={x} handleChange={this.handleEditPraise} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("praiseNew", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}

                                                                    </tbody>
                                                                </table>
                                                            </fieldset>
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Kỷ luật</h4></legend>
                                                                <ModalAddDiscipline handleChange={this.handleChangeDiscipline} index={x.employeeNumber} />
                                                                <table className="table table-striped table-bordered table-resizable" >
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Số quyết định</th>
                                                                            <th>Ngày có hiệu lực</th>
                                                                            <th>Ngày hết hiệu lực</th>
                                                                            <th>Cấp ra quyết định</th>
                                                                            <th>Hình thức Kỷ luật</th>
                                                                            <th>Lý do kỷ luật</th>
                                                                            <th style={{ width: "10%" }}>Hành động</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.disciplineNew === 'undefined' || this.state.disciplineNew.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.disciplineNew.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.number}</td>
                                                                                    <td>{x.startDate}</td>
                                                                                    <td>{x.endDate}</td>
                                                                                    <td>{x.unit}</td>
                                                                                    <td>{x.type}</td>
                                                                                    <td>{x.reason}</td>
                                                                                    <td>
                                                                                        <ModalEditDiscipline data={x} index={index} keys={id} handleChange={this.handleEditDiscipline} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("disciplineNew", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}

                                                                    </tbody>
                                                                </table>
                                                            </fieldset>

                                                        </div>
                                                    </div>
                                                    <div id={`edithistorySalary-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <div className="col-sm-12">
                                                                <fieldset className="scheduler-border">
                                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Lịch sử tăng giảm lương</h4></legend>
                                                                    <ModalAddSalary handleChange={this.handleChangeSalary} index={x.employeeNumber} />
                                                                    <table className="table table-striped table-bordered table-resizable" >
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Tháng</th>
                                                                                <th style={{ width: "30%" }}>Lương chính</th>
                                                                                <th style={{ width: "30%" }}>Tổng lương</th>
                                                                                <th style={{ width: "10%" }}>Hành động</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(typeof this.state.salaryNew === 'undefined' || this.state.salaryNew.length === 0) ? <tr><td colSpan={4}><center> Không có dữ liệu</center></td></tr> :
                                                                                this.state.salaryNew.map((x, index) => {
                                                                                    if (x.bonus.length !== 0) {
                                                                                        var total = 0;
                                                                                        for (let count in x.bonus) {
                                                                                            total = total + parseInt(x.bonus[count].number)
                                                                                        }
                                                                                    }
                                                                                    var unit = x.unit ? x.unit : x.mainSalary.slice(-3, x.mainSalary.length);
                                                                                    var salary = x.unit ? x.mainSalary : x.mainSalary.slice(0, x.mainSalary.length - 3);
                                                                                    return (
                                                                                        <tr key={index}>
                                                                                            <td>{x.month}</td>
                                                                                            <td>{formatter.format(parseInt(salary))} {unit}</td>
                                                                                            <td>
                                                                                                {(typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                                                    formatter.format(parseInt(salary)) :
                                                                                                    formatter.format(total + parseInt(salary))
                                                                                                } {unit}
                                                                                            </td>
                                                                                            <td>
                                                                                                <ModalEditSalary index={index} keys={id} data={x} handleChange={this.handleEditSalary} />
                                                                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("salaryNew", index)}><i className="material-icons"></i></a>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }

                                                                        </tbody>
                                                                    </table>
                                                                </fieldset>
                                                                <fieldset className="scheduler-border">
                                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thông tin nghỉ phép</h4></legend>
                                                                    <ModalAddSabbatical handleChange={this.handleChangeSabbatical} index={x.employeeNumber} />
                                                                    <table className="table table-striped table-bordered table-resizable">
                                                                        <thead>
                                                                            <tr>
                                                                                <th >Từ ngày</th>
                                                                                <th >Đến ngày</th>
                                                                                <th>Lý do</th>
                                                                                <th>Trạng thái</th>
                                                                                <th style={{ width: "10%" }} >Hành động</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {(typeof this.state.sabbaticalNew === 'undefined' || this.state.sabbaticalNew.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                                                this.state.sabbaticalNew.map((x, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{x.startDate}</td>
                                                                                        <td>{x.startDate}</td>
                                                                                        <td>{x.reason}</td>
                                                                                        <td>{x.status}</td>
                                                                                        <td >
                                                                                            <ModalEditSabbatical index={index} keys={id} handleChange={this.handleEditSabbatical} data={x} />
                                                                                            <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("sabbaticalNew", index)}><i className="material-icons"></i></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                        </tbody>
                                                                    </table>
                                                                </fieldset>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id={`edittailieu-${x.employeeNumber}`} className="tab-pane">
                                                        <div className="box-body">
                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ paddingTop: 3 }}>
                                                                    <label htmlFor="numberFile">Nơi lưu trữ bản cứng:</label>
                                                                    <input type="text" className="form-control" defaultValue={x.numberFile} name="numberFile" onChange={this.handleChange} autoComplete="off" />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <h4 className="col-md-6" style={{ paddingLeft: 0 }}>Danh sách tài liệu đính kèm:</h4>
                                                                <ModalAddFile handleChange={this.handleChangeFile} index={x.employeeNumber} />
                                                                <button style={{ marginBottom: 5, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title="Thêm các tài liệu mặc định">Mặc định</button>
                                                                <table className="table table-striped table-bordered table-resizable " >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "18%" }}>Tên tài liệu</th>
                                                                            <th style={{ width: "42%" }}>Mô tả</th>
                                                                            <th style={{ width: "8%" }}>Số lượng</th>
                                                                            <th style={{ width: "10%" }}>Trạng thái</th>
                                                                            <th style={{ width: "12%" }}>File đính kèm</th>
                                                                            <th style={{ width: '10%' }}>Hành động</th>
                                                                        </tr>

                                                                    </thead>
                                                                    <tbody>
                                                                        {(typeof this.state.file === 'undefined' || this.state.file.length === 0) ? <tr><td colSpan={6}><center> Không có dữ liệu</center></td></tr> :
                                                                            this.state.file.map((x, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{x.nameFile}</td>
                                                                                    <td>{x.discFile}</td>
                                                                                    <td>{x.number}</td>
                                                                                    <td>{x.status}</td>
                                                                                    <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                                                        <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                                                                    <td >
                                                                                        <ModalEditFile data={x} index={index} keys={id} handleChange={this.handleEditFile} />
                                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("file", index)}><i className="material-icons"></i></a>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <div className="col-md-12">
                                                <button type="button" style={{ marginRight: 10 }} title="Huỷ cập nhật thông tin" className="btn btn-default pull-right" data-dismiss="modal" >Đóng</button>
                                                <button type="button" style={{ marginRight: 10 }} title="Cập nhật thông tin nhân viên" className="btn btn-success pull-right" onClick={() => this.handleSubmit()}>Cập nhật thông tin</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </React.Fragment>
        );
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
    createNewSabbatical: SabbaticalActions.createNewSabbatical,
    createNewPraise: DisciplineActions.createNewPraise,
    createNewDiscipline: DisciplineActions.createNewDiscipline,

    updateSalary: SalaryActions.updateSalary,
    updateSabbatical: SabbaticalActions.updateSabbatical,
    updateDiscipline: DisciplineActions.updateDiscipline,
    updatePraise: DisciplineActions.updatePraise,

    deleteSalary: SalaryActions.deleteSalary,
    deleteSabbatical: SabbaticalActions.deleteSabbatical,
    deleteDiscipline: DisciplineActions.deleteDiscipline,
    deletePraise: DisciplineActions.deletePraise,
};

const connectedAddEmplyee = connect(mapState, actionCreators)(ModalEditEmployee);
export { connectedAddEmplyee as ModalEditEmployee };