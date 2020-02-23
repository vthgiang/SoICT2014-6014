import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EmployeeManagerActions } from '../redux/actions';
import { SalaryActions } from '../../salary-employee/redux/actions';
import { SabbaticalActions } from '../../sabbatical/redux/actions';
import { DisciplineActions } from '../../discipline/redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import './addemployee.css';
import 'react-toastify/dist/ReactToastify.css';
import { ModalImportFileBHXH,ModalAddCertificate,ModalAddCertificateShort,ModalAddContract,ModalAddExperience } from './CombineContent';
import { ModalAddBHXH,ModalAddDiscipline,ModalAddPraise,ModalAddSalary,ModalAddSabbatical,ModalAddFile } from './CombineContent';
import { ModalEditFile, ModalEditSabbatical, ModalEditSalary, ModalEditPraise, ModalEditDiscipline, ModalEditBHXH } from './CombineContent';
import { ModalEditExperience, ModalEditContract, ModalEditCertificateShort, ModalEditCertificate } from './CombineContent';
import './listemployee.css';

class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: 'lib/adminLTE/dist/img/avatar5.png',
            avatar: "",
            employeeNew: {
                avatar: 'lib/adminLTE/dist/img/avatar5.png',
                gender: "Nam",
                relationship: "Độc thân",
                department: "Phòng nhân sự",
                cultural: "12/12",
                nameBank: "Techcombank",
                educational: "Không có",
                certificate: [],
                certificateShort: [],
                contract: [],
                file: [],
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
        this.handleResizeColumn();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
        this.defaulteClick = this.defaulteClick.bind(this);
    }
    // function tuỳ chỉnh kích thước cột của bảng
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
        this.setState({
            praiseNew: praiseNew
        })
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
        this.setState({
            disciplineNew: disciplineNew
        })
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
        this.setState({
            salaryNew: salaryNew
        })
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
        this.setState({
            sabbaticalNew: sabbaticalNew
        })
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
            file:file
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
            praiseNew.splice(index, 1);
            this.setState({
                praiseNew: [...praiseNew]
            })
        };
        if (key === "disciplineNew") {
            const { disciplineNew } = this.state;
            disciplineNew.splice(index, 1);
            this.setState({
                disciplineNew: [...disciplineNew]
            })
        };
        if (key === "salaryNew") {
            const { salaryNew } = this.state;
            salaryNew.splice(index, 1);
            this.setState({
                salaryNew: [...salaryNew]
            })
        };
        if (key === "sabbaticalNew") {
            const { sabbaticalNew } = this.state;
            sabbaticalNew.splice(index, 1);
            this.setState({
                sabbaticalNew: [...sabbaticalNew]
            })
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
            { nameFile: "Bằng cấp", discFile: "Bằng tốt nghiệp trình độ học vấn cao nhất", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Sơ yếu lý lịch", discFile: "Sơ yếu lý lịch có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Ảnh", discFile: "Ảnh 4X6", number: "3", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Bản sao CMND/Hộ chiếu", discFile: "Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Giấy khám sức khoẻ", discFile: "Giấy khám sức khoẻ có dấu đỏ", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Giấy khai sinh", discFile: "Giấy khái sinh có công chứng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Đơn xin việc", discFile: "Đơn xin việc viết tay", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "CV", discFile: "CV của nhân viên", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Cam kết", discFile: "Giấy cam kết làm việc", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " },
            { nameFile: "Tạm trú tạm vắng", discFile: "Giấy xác nhận tạm trú tạm vắng", number: "1", status: "Đã nộp", file: "", urlFile: "", fileUpload: " " }
        ]
        this.setState({
            file: defaulteFile
        })
    }

    // function thêm mới thông tin nhân viên
    handleSubmit = async () => {
        let newEmployee = this.state.employeeNew;
        let { file, contract, certificate, certificateShort } = this.state;
        // cập nhật lại state trước khi add employee
        await this.setState({
            employeeNew: {
                ...newEmployee,
                brithday: this.refs.brithday.value,
                dateCMND: this.refs.dateCMND.value,
                startTax: this.refs.startTax.value,
                startDateBHYT: this.refs.startDateBHYT.value,
                endDateBHYT: this.refs.endDateBHYT.value,
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
                listContract.filter(contract => (contract.fileUpload !== " "))
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
                listCertificate.filter(certificate => (certificate.fileUpload !== " "))
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
                listCertificateShort.filter(certificateShort => (certificateShort.fileUpload !== " "))
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
                listFile.filter(file => (file.fileUpload !== " "))
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
            this.notifysuccess("Thêm thành công");
        }
    }

    render() {
        var formatter = new Intl.NumberFormat();
        console.log(this.state);
        return (
            <React.Fragment>
                <div className="row">
                    {/* left column */}
                    <div className="col-md-12">
                        <div className="nav-tabs-custom" >
                            <ul className="nav nav-tabs">
                                <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin chung của nhân viên" data-toggle="tab" href="#thongtinchung">Thông tin chung</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin liên hệ của nhân viên" data-toggle="tab" href="#thongtinlienhe">Thông tin liên hệ</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Trình độ học vấn - Khinh nghiệm làm việc" data-toggle="tab" href="#kinhnghiem"> Học vấn - Kinh nghiệm</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Bằng cấp - Chứng chỉ" data-toggle="tab" href="#bangcap">Bằng cấp - Chứng chỉ</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Tài khoản ngân hành - Thuế thu nhập các nhân" data-toggle="tab" href="#taikhoan">Tài khoản - Thuế</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin bảo hiểm" data-toggle="tab" href="#baohiem">Thông tin bảo hiểm</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Hợp đồng lao động - Quá trình đào tạo" data-toggle="tab" href="#hopdong">Hợp đồng - Đào tạo</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Khen thưởng - Kỷ luật" data-toggle="tab" href="#khenthuong">Khen thưởng - kỷ luật</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Lịch sử tăng giảm lương - Thông tin nghỉ phép" data-toggle="tab" href="#historySalary">Lịch sử lương - Nghỉ phép</a></li>
                                <li><a style={{ paddingLeft: 5, }} title="Tài liệu đính kèm" data-toggle="tab" href="#tailieu">Tài liệu đính kèm</a></li>
                            </ul>
                            < div className="tab-content">
                                <div id="thongtinchung" className="tab-pane active">
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
                                                    <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" id="employeeNumber" name="employeeNumber" autoComplete="off" placeholder="Mã số nhân viên" onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="fullname">Họ và tên:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" name="fullName" id="fullname" placeholder="Họ và tên" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="brithday">Ngày sinh:<span className="required">&#42;</span></label>
                                                    <div className={'input-group date has-feedback'}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" className="form-control datepicker" name="brithday" ref="brithday" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" autoComplete="off" />
                                                    </div>
                                                    {/* <input type="Date" className="form-control" id="brithday" name="brithday" onChange={this.handleChange} autoComplete="off" /> */}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="emailCompany">Email:<span className="required">&#42;</span></label>
                                                    <input type="email" className="form-control" id="emailCompany" placeholder="Email công ty" name="emailCompany" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className=" col-md-4 " style={{ marginTop: 30 }}>
                                                <div className="form-group">
                                                    <label htmlFor="MSCC">Mã số chấm công:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" id="MSCC" placeholder="Mã số chấm công" name="MSCC" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ display: 'block', paddingBottom: 4 }}>Giới tính:<span className="required">&#42;</span></label>
                                                    <input type="radio" name="gender" value="Nam" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                    <label>Nam</label>
                                                    <input type="radio" name="gender" value="Nữ" className="" style={{ marginLeft: 90, marginRight: 5 }} onChange={this.handleChange} />
                                                    <label>Nữ</label>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="birthplace">Nơi sinh:</label>
                                                    <input type="text" className="form-control" id="birthplace" name="birthplace" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ display: 'block', paddingBottom: 7 }}>Tình trạng hôn nhân:</label>
                                                    <input type="radio" name="relationship" value="Độc thân" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                    <label> Độc thân</label>
                                                    <input type="radio" name="relationship" value="Đã kết hôn" className="" style={{ marginLeft: 80, marginRight: 5 }} onChange={this.handleChange} />
                                                    <label> Đã kết hôn</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="CMND">Số CMND/Hộ chiếu:<span className="required">&#42;</span></label>
                                                    <input type="number" className="form-control" id="CMND" name="CMND" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="national">Dân tộc:</label>
                                                    <input type="text" className="form-control" id="national" name="national" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="dateCMND">Ngày cấp:<span className="required">&#42;</span></label>
                                                    <div className={'input-group date has-feedback'}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" className="form-control datepicker" name="dateCMND" ref="dateCMND" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                    </div>
                                                    {/* <input type="Date" className="form-control" id="dateCMND" name="dateCMND" onChange={this.handleChange} /> */}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="religion">Tôn giáo:</label>
                                                    <input type="text" className="form-control" id="religion" name="religion" onChange={this.handleChange} autoComplete="off" />
                                                </div>

                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="addressCMND">Nơi cấp:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" id="addressCMND" name="addressCMND" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="nation">Quốc tịch:</label>
                                                    <input type="text" className="form-control" id="nation" name="nation" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="thongtinlienhe" className="tab-pane">
                                    <div className="box-body">
                                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <div className="col-md-4">
                                                <div className="form-group" style={{ paddingTop: 3 }}>
                                                    <label htmlFor="phoneNumber">Điện thoại đi động 1:<span className="required">&#42;</span></label>
                                                    <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="emailPersonal">Email cá nhân 1</label>
                                                    <input type="text" className="form-control" id="emailPersonal" name="emailPersonal" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group" style={{ paddingTop: 3 }}>
                                                <label htmlFor="phoneNumber2">Điện thoại đi động 2:</label>
                                                <input type="number" className="form-control" id="phoneNumber2" name="phoneNumber2" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="emailPersonal2">Email cá nhân 2</label>
                                                <input type="text" className="form-control" id="emailPersonal2" name="emailPersonal2" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="phoneNumberAddress">Điện thoại nhà riêng:</label>
                                                <input type="text" className="form-control" id="phoneNumberAddress" name="phoneNumberAddress" onChange={this.handleChange} autoComplete="off" />
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
                                                        <input type="text" className="form-control" id="friendName" name="friendName" onChange={this.handleChange} autoComplete="off" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="friendPhone">Điện thoại di động:</label>
                                                        <input type="text" className="form-control" id="friendPhone" name="friendPhone" onChange={this.handleChange} autoComplete="off" />
                                                    </div>

                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="relation">Quan hệ:</label>
                                                        <input type="text" className="form-control" id="relation" name="relation" onChange={this.handleChange} autoComplete="off" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="friendPhoneAddress">Điện thoại nhà riêng:</label>
                                                        <input type="text" className="form-control" id="friendPhoneAddress" name="friendPhoneAddress" onChange={this.handleChange} autoComplete="off" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="friendAddress">Địa chỉ:</label>
                                                        <input type="text" className="form-control" id="friendAddress" name="friendAddress" onChange={this.handleChange} autoComplete="off" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="friendEmail">Email:</label>
                                                        <input type="text" className="form-control" id="friendEmail" name="friendEmail" onChange={this.handleChange} autoComplete="off" />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="col-md-6">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border"><h4 className="box-title">Hộ khẩu thường trú</h4></legend>
                                                <div className="form-group">
                                                    <label htmlFor="localAddress">Địa chỉ:</label>
                                                    <input type="text" className="form-control " name="localAddress" id="localAddress" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="localCommune">
                                                        Xã/Phường:</label>
                                                    <input type="text" className="form-control " name="localCommune" id="localCommune" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="localDistrict">
                                                        Quận/Huyện:</label>
                                                    <input type="text" className="form-control " name="localDistrict" id="localDistrict" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="localCity">
                                                        Tỉnh/Thành phố:</label>
                                                    <input type="text" className="form-control " name="localCity" id="localCity" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="localNational">Quốc gia:</label>
                                                    <input type="text" className="form-control " name="localNational" id="localNational" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="col-md-6">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border"><h4 className="box-title"> Chỗ ở hiện tại</h4></legend>

                                                <div className="form-group">
                                                    <label htmlFor="nowAddress">
                                                        Địa chỉ:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control " name="nowAddress" id="nowAddress" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="nowCommune">
                                                        Xã/Phường:</label>
                                                    <input type="text" className="form-control " name="nowCommune" id="nowCommune" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="nowDistrict">
                                                        Quận/Huyện:</label>
                                                    <input type="text" className="form-control " name="nowDistrict" id="nowDistrict" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="nowCity">
                                                        Tỉnh/Thành phố:</label>
                                                    <input type="text" className="form-control " name="nowCity" id="nowCity" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="nowNational">
                                                        Quốc gia:</label>
                                                    <input type="text" className="form-control " name="nowNational" id="nowNational" onChange={this.handleChange} autoComplete="off" />
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>

                                </div>
                                <div id="taikhoan" className="tab-pane">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Tài khoản ngân hàng:</h4></legend>
                                        <div className="box-body">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="ATM">Số tài khoản:</label>
                                                <input type="text" className="form-control" id="ATM" name="ATM" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="nameBank">Tên ngân hàng:</label>
                                                <input type="text" className="form-control" id="nameBank" name="nameBank" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="addressBank">Chi nhánh:</label>
                                                <input type="text" className="form-control" id="addressBank" name="addressBank" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thuế thu nhập cá nhân:</h4></legend>
                                        <div className="form-group">
                                            <label htmlFor="numberTax">Mã số thuế:<span className="required">&#42;</span></label>
                                            <input type="number" className="form-control" id="numberTax" name="numberTax" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userTax">Người đại diện:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" id="userTax" name="userTax" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="startDate">Ngày hoạt động:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control datepicker" name="startTax" ref="startTax" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="unitTax">Quản lý bởi:<span className="required">&#42;</span></label>
                                            <input type="text" className="form-control" id="unitTax" name="unitTax" onChange={this.handleChange} autoComplete="off" />
                                        </div>
                                    </fieldset>

                                </div>
                                <div id="bangcap" className="tab-pane">
                                    <div className="box-body">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bằng cấp:</h4></legend>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới bằng cấp" data-toggle="modal" data-target="#modal-addNewCertificate">Thêm mới</button>
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
                                                                    <ModalEditCertificate index={index} data={x} handleChange={this.handleEditCertificate} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("certificate", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </fieldset>
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">Chứng chỉ:</h4></legend>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới chứng chỉ" data-toggle="modal" data-target="#modal-addNewCertificateShort">Thêm mới</button>
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
                                                                    <ModalEditCertificateShort index={index} handleChange={this.handleEditCertificateShort} data={x} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("certificateShort", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </fieldset>
                                    </div>

                                </div>
                                <div id="kinhnghiem" className="tab-pane">
                                    <div className="box-body">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">Trình độ học vấn</h4></legend>
                                            <div className="form-group">
                                                <label>Trình độ văn hoá:<span className="required">&#42;</span></label>
                                                <select className="form-control" name="cultural" onChange={this.handleChange}>
                                                    <option>12/12</option>
                                                    <option>11/12</option>
                                                    <option>10/12</option>
                                                    <option>9/12</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="foreignLanguage ">Trình độ ngoại ngữ:</label>
                                                <input type="text" className="form-control" id="foreignLanguage" name="foreignLanguage" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="educational ">Trình độ chuyên môn:</label>
                                                <select className="form-control" name="educational" defaultValue="Không có" onChange={this.handleChange}>
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
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới kinh nghiệm làm việc" data-toggle="modal" data-target="#modal-addNewExperience">Thêm mới</button>
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
                                                                    <ModalEditExperience index={index} data={x} handleChange={this.handleEditExperience} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("experience", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </fieldset>
                                    </div>

                                </div>
                                <div id="baohiem" className="tab-pane">
                                    <div className="box-body">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm y tế</h4></legend>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="numberBHYT">Mã số BHYT:</label>
                                                <input type="text" className="form-control" name="numberBHYT" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="startDateBHYT">Ngày có hiệu lực:</label>
                                                <div className={'input-group date has-feedback'}>
                                                    <div className="input-group-addon">
                                                        <i className="fa fa-calendar" />
                                                    </div>
                                                    <input type="text" className="form-control datepicker" name="startDateBHYT" ref="startDateBHYT" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                </div>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="endDateBHYT">Ngày hết hạn:</label>
                                                <div className={'input-group date has-feedback'}>
                                                    <div className="input-group-addon">
                                                        <i className="fa fa-calendar" />
                                                    </div>
                                                    <input type="text" className="form-control datepicker" name="endDateBHYT" ref="endDateBHYT" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm xã hội</h4></legend>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="numberBHXH">Mã số BHXH:</label>
                                                <input type="text" className="form-control" name="numberBHXH" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                            <div className="col-md-12">
                                                <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>Quá trình đóng bảo hiểm xã hội:</h4>
                                                <button style={{ marginBottom: 5, marginLeft: 10 }} type="submit" className="btn btn-primary pull-right" id="editBHXH" data-toggle="modal" data-target="#modal-importFileBHXH" title="Thêm mới bằng file excel" onClick={this.handleAddNew}>Import file</button>
                                                <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm quá trình đóng BHXH" data-toggle="modal" data-target="#modal-addNewBHXH">Thêm mới</button>
                                                <table className="table table-striped table-bordered table-resizable " >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "15%" }}>Từ tháng</th>
                                                            <th style={{ width: "15%" }}>Đến tháng</th>
                                                            <th style={{ width: "30%" }}>Chức vụ</th>
                                                            <th style={{ width: "30%" }}>Đơn vị công tác</th>
                                                            <th style={{ width: '10%' }}>Hành động</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(typeof this.state.employeeNew.BHXH === 'undefined' || this.state.employeeNew.BHXH.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                                            this.state.employeeNew.BHXH.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td>{x.startDate}</td>
                                                                    <td>{x.endDate}</td>
                                                                    <td>{x.position}</td>
                                                                    <td>{x.unit}</td>
                                                                    <td>
                                                                        <ModalEditBHXH index={index} handleChange={this.handleEditBHXH} data={x} />
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
                                <div id="hopdong" className="tab-pane">
                                    <div className="box-body">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Hợp đồng lao động</h4></legend>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới hợp đồng lao động" data-toggle="modal" data-target="#modal-addNewContract">Thêm mới</button>
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
                                                                    <ModalEditContract data={x} index={index} handleChange={this.handleEditContract} />
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
                                <div id="khenthuong" className="tab-pane">
                                    <div className="box-body">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Khen thưởng</h4></legend>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới thông tin khen thưởng" data-toggle="modal" data-target="#modal-addPraise">Thêm mới</button>
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
                                                                    <ModalEditPraise index={index} data={x} handleChange={this.handleEditPraise} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("praiseNew", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                </tbody>
                                            </table>
                                        </fieldset>
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Kỷ luật</h4></legend>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới thông tin kỷ luật" data-toggle="modal" data-target="#modal-addNewDiscipline">Thêm mới</button>
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
                                                                    <ModalEditDiscipline data={x} index={index} handleChange={this.handleEditDiscipline} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("disciplineNew", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                </tbody>
                                            </table>
                                        </fieldset>

                                    </div>
                                </div>
                                <div id="historySalary" className="tab-pane">
                                    <div className="box-body">
                                        <div className="col-sm-12">
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Lịch sử tăng giảm lương</h4></legend>
                                                <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới lịch sử lương" data-toggle="modal" data-target="#modal-addNewSalary">Thêm mới</button>
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
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{x.month}</td>
                                                                        <td>{formatter.format(parseInt(x.mainSalary))} {x.unit}</td>
                                                                        <td>
                                                                            {(typeof x.bonus === 'undefined' || x.bonus.length === 0) ?
                                                                                formatter.format(parseInt(x.mainSalary)) :
                                                                                formatter.format(total + parseInt(x.mainSalary))
                                                                            } {x.unit}
                                                                        </td>
                                                                        <td>
                                                                            <ModalEditSalary index={index} data={x} handleChange={this.handleEditSalary} />
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
                                                <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới thông tin nghỉ phép" data-toggle="modal" data-target="#modal-addNewSabbatical">Thêm mới</button>
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
                                                                        <ModalEditSabbatical index={index} handleChange={this.handleEditSabbatical} data={x} />
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
                                <div id="tailieu" className="tab-pane">
                                    <div className="box-body">
                                        <div className="col-md-4">
                                            <div className="form-group" style={{ paddingTop: 3 }}>
                                                <label htmlFor="numberFile">Nơi lưu trữ bản cứng:</label>
                                                <input type="text" className="form-control" id="numberFile" name="numberFile" onChange={this.handleChange} autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <h4 className="col-md-6" style={{ paddingLeft: 0 }}>Danh sách tài liệu đính kèm:</h4>
                                            <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" title="Thêm mới tài liệu đính kèm" data-toggle="modal" data-target="#modal-addNewFile">Thêm mới</button>
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
                                                                    <ModalEditFile data={x} index={index} handleChange={this.handleEditFile} />
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("file", index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className=" box-footer">
                                        <button type="reset" title="Thêm nhân viên mới" className="btn btn-success col-md-2 pull-right btnuser" onClick={this.handleSubmit}>Thêm nhân viên</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>
                <ModalAddCertificate handleChange={this.handleChangeCertificate} />
                <ModalImportFileBHXH />
                <ModalAddCertificateShort handleChange={this.handleChangeCertificateShort} />
                <ModalAddContract handleChange={this.handleChangeContract} />
                <ModalAddExperience handleChange={this.handleChangeExperience} />
                <ModalAddBHXH handleChange={this.handleChangeBHXH} />
                <ModalAddDiscipline handleChange={this.handleChangeDiscipline} />
                <ModalAddPraise handleChange={this.handleChangePraise} />
                <ModalAddSalary handleChange={this.handleChangeSalary} />
                <ModalAddSabbatical handleChange={this.handleChangeSabbatical} />
                <ModalAddFile handleChange={this.handleChangeFile} />
            </React.Fragment>
        );
    };
}

function mapState(state) {
    const { employeesManager, Salary, Discipline, Sabbatical } = state;
    return { employeesManager, Salary, Discipline, Sabbatical };
};

const actionCreators = {
    addNewEmployee: EmployeeManagerActions.addNewEmployee,
    uploadAvatar: EmployeeManagerActions.uploadAvatar,
    createNewSalary: SalaryActions.createNewSalary,
    createNewSabbatical: SabbaticalActions.createNewSabbatical,
    createNewPraise: DisciplineActions.createNewPraise,
    createNewDiscipline: DisciplineActions.createNewDiscipline,
    updateContract: EmployeeManagerActions.updateContract,
    updateCertificate: EmployeeManagerActions.updateCertificate,
    updateCertificateShort: EmployeeManagerActions.updateCertificateShort,
    updateFile: EmployeeManagerActions.updateFile,
};

const connectedAddEmplyee = connect(mapState, actionCreators)(AddEmployee);
export { connectedAddEmplyee as AddEmployee };