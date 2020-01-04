import React, { Component } from 'react';
import { connect } from 'react-redux';
import { employeeActions } from '../redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import './addemployee.css';
import 'react-toastify/dist/ReactToastify.css';
import { ModalImportFileBHXH } from './ModalImportFileBHXH';
// import { OutTable, ExcelRenderer } from 'react-excel-renderer';
class AddEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: "",
            defaulte: "display",
            adding: false,
            employeeNew: {
                avatar: 'adminLTE/dist/img/avatar5.png',
                gender: "Nam",
                relationship: "Độc thân",
                department: "Phòng nhân sự",
                cultural: "12/12",
                nameBank: "Techcombank",
                educational: "Không có",
                certificate: [],
                certificateShort: [],
                experience: [],
                contract: [],
                BHXH: [],
                course: [],
                file: []
            }

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTax = this.handleChangeTax.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChangeEmployeeNumber = this.handleChangeEmployeeNumber.bind(this);
        this.handleAddNew = this.handleAddNew.bind(this);
        this.handleChangeCertificate = this.handleChangeCertificate.bind(this);
        this.handleChangeCertificateShort = this.handleChangeCertificateShort.bind(this);
        this.handleChangeExperience = this.handleChangeExperience.bind(this);
        this.handleChangeContract = this.handleChangeContract.bind(this);
        this.handleChangeBHXH = this.handleChangeBHXH.bind(this);
        this.handleChangeCourse = this.handleChangeCourse.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
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
        const { employeeNew } = this.state;
        fileLoad.readAsDataURL(file);
        fileLoad.onload = () => {
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    avatar: fileLoad.result
                }
            })
        };
    }
    // function save data of all fields of the target of employee
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
    // function save data of Tax fields of the target of employee
    handleChangeTax(event) {
        const { name, value } = event.target;
        const { employeeNew } = this.state;
        this.setState({
            employeeNew: {
                ...employeeNew,
                Tax: {
                    ...employeeNew.Tax,
                    [name]: value
                },
            }
        });
    }
    // function save EmployeeNumber
    handleChangeEmployeeNumber(event) {
        const { name, value } = event.target;
        const { employeeNew } = this.state;
        this.props.getInformationEmployee(value);
        this.setState({
            employeeNew: {
                ...employeeNew,
                [name]: value
            }
        });

    }
    // function add new fields certificate, experience, contract, BHXH, course,File
    handleAddNew(event) {
        var check;
        const { employeeNew } = this.state;
        event.preventDefault();
        if (event.target.id === "certificate") {
            if (this.state.employeeNew.certificate !== []) {
                check = this.state.employeeNew.certificate.map(function (x, check) {
                    if (x.nameCertificate === "" || x.urlCertificate === "" || x.addressCertificate === "" || x.yearCertificate === "" || x.typeCertificate === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            certificate: [...employeeNew.certificate, { nameCertificate: "", addressCertificate: "", yearCertificate: "", typeCertificate: "Xuất sắc", urlCertificate: "" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Bằng cấp");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        certificate: [...employeeNew.certificate, { nameCertificate: "", addressCertificate: "", yearCertificate: "", typeCertificate: "Xuất sắc", urlCertificate: "" }]
                    }
                })
            }
        }
        if (event.target.id === "certificateShort") {
            if (this.state.employeeNew.certificateShort !== []) {
                check = this.state.employeeNew.certificateShort.map(function (x, check) {
                    if (x.nameCertificateShort === "" || x.urlCertificateShort === "" || x.unit === "" || x.startDate === "" || x.endDate === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            certificateShort: [...employeeNew.certificateShort, { nameCertificateShort: "", urlCertificateShort: "", unit: "", startDate: "", endDate: "" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Chứng chỉ");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        certificateShort: [...employeeNew.certificateShort, { nameCertificateShort: "", urlCertificateShort: "", unit: "", startDate: "", endDate: "" }]
                    }
                })
            }
        }
        if (event.target.id === "experience") {
            if (this.state.employeeNew.experience !== []) {
                check = this.state.employeeNew.experience.map(function (x, check) {
                    if (x.startDate === "" || x.endDate === "" || x.unit === "" || x.position === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            experience: [...employeeNew.experience, { startDate: "", endDate: "", unit: "", position: "" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Kinh nghiệm làm việc");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        experience: [...employeeNew.experience, { startDate: "", endDate: "", unit: "", position: "" }]
                    }
                })
            }
        }
        if (event.target.id === "contract") {
            if (this.state.employeeNew.contract !== []) {
                check = this.state.employeeNew.contract.map(function (x, check) {
                    if (x.nameContract === "" || x.typeContract === "" || x.startDate === "" || x.endDate === "" || x.urlContract === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            contract: [...employeeNew.contract, { nameContract: "", typeContract: "", startDate: "", endDate: "", urlContract: "" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Hợp đồng lao động");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        contract: [...employeeNew.contract, { nameContract: "", typeContract: "", startDate: "", endDate: "", urlContract: "" }]
                    }
                })
            }
        }
        if (event.target.id === "BHXH") {
            if (this.state.employeeNew.BHXH !== []) {
                check = this.state.employeeNew.BHXH.map(function (x, check) {
                    if (x.startDate === "" || x.endDate === "" || x.position === "" || x.unit === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            BHXH: [...employeeNew.BHXH, { startDate: "", endDate: "", position: "", unit: "" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Bảo hiểm y tế");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        BHXH: [...employeeNew.BHXH, { startDate: "", endDate: "", position: "", unit: "" }]
                    }
                })
            }
        }
        if (event.target.id === "course") {
            if (this.state.employeeNew.course !== []) {
                check = this.state.employeeNew.course.map(function (x, check) {
                    if (x.nameCourse === "" || x.startDate === "" || x.endDate === "" || x.unit === "" || x.status === "" || x.typeCourse === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            course: [...employeeNew.course, { nameCourse: "", startDate: "", endDate: "", unit: "", status: "Chưa hoàn thành", typeCourse: "Nội bộ" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Quá trình đào tạo");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        course: [...employeeNew.course, { nameCourse: "", startDate: "", endDate: "", unit: "", status: "Chưa hoàn thành", typeCourse: "Nội bộ" }]
                    }
                })
            }
        }
        if (event.target.id === "file") {
            if (this.state.employeeNew.file !== []) {
                check = this.state.employeeNew.file.map(function (x, check) {
                    if (x.nameFile === "" || x.discFile === "" || x.number === "" || x.status === "") check = true;
                    return check;
                })
                if (check.toString() !== 'true') {
                    this.setState({
                        employeeNew: {
                            ...employeeNew,
                            file: [...employeeNew.file, { nameFile: "", urlFile: "", discFile: "", number: "", status: "Chưa nộp" }]
                        }
                    })
                } else this.notifywarning("Hãy nhập đủ các trường Tài liệu đính kèm");
            } else {
                this.setState({
                    employeeNew: {
                        ...employeeNew,
                        file: [...employeeNew.file, { nameFile: "", urlFile: "", discFile: "", number: "", status: "Chưa nộp" }]
                    }
                })
            }
        }
    }

    // function save change certificate
    handleChangeCertificate(event) {
        var { name, value, className, type } = event.target;
        if (type === "file") {
            value = value.slice(12);
        }
        const { employeeNew } = this.state;
        var certificate = employeeNew.certificate;
        certificate[className] = { ...certificate[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                certificate: certificate
            }
        })
    }
    // function save change certificate
    handleChangeCertificateShort(event) {
        var { name, value, className, type } = event.target;
        if (type === "file") {
            value = value.slice(12);
        }
        const { employeeNew } = this.state;
        var certificateShort = employeeNew.certificateShort;
        certificateShort[className] = { ...certificateShort[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                certificateShort: certificateShort
            }
        })
    }
    // function save change experience
    handleChangeExperience(event) {
        var { name, value, className } = event.target;
        const { employeeNew } = this.state;
        var experience = employeeNew.experience;
        experience[className] = { ...experience[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                experience: experience
            }
        })
    }
    // function save change contract
    handleChangeContract(event) {
        var { name, value, className, type } = event.target;
        if (type === "file") {
            value = value.slice(12);
        }
        const { employeeNew } = this.state;
        var contract = employeeNew.contract;
        contract[className] = { ...contract[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                contract: contract
            }
        })
    }
    // function save change BHXH
    handleChangeBHXH(event) {
        var { name, value, className } = event.target;
        const { employeeNew } = this.state;
        var BHXH = employeeNew.BHXH;
        BHXH[className] = { ...BHXH[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                BHXH: BHXH
            }
        })
    }
    //function save change course 
    handleChangeCourse(event) {
        var { name, value, className } = event.target;
        const { employeeNew } = this.state;
        var course = employeeNew.course;
        course[className] = { ...course[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                course: course
            }
        })
    }
    handleChangeFile(event) {
        var { name, value, className, type } = event.target;
        if (type === "file") {
            value = value.slice(12);
        }
        const { employeeNew } = this.state;
        var file = employeeNew.file;
        file[className] = { ...file[className], [name]: value }
        this.setState({
            employeeNew: {
                ...employeeNew,
                file: file
            }
        })
    }
    // function delete fields certificate, experience, contract, BHXH, course
    delete = (key, index) => {
        const { employeeNew } = this.state;
        if (key === "certificate") {
            var certificate = employeeNew.certificate;
            certificate.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    certificate: [...certificate]
                }
            })
        };
        if (key === "certificateShort") {
            var certificateShort = employeeNew.certificateShort;
            certificateShort.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    certificateShort: [...certificateShort]
                }
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
            var contract = employeeNew.contract;
            contract.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    contract: [...contract]
                }
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
        if (key === "file") {
            var file = employeeNew.file;
            file.splice(index, 1);
            this.setState({
                employeeNew: {
                    ...employeeNew,
                    file: [...file]
                }
            })
        };
    }

    defaulteClick(event) {
        event.preventDefault();
        this.setState({
            show: "display",
            defaulte: "",

        })
    }

    // function add new employee
    handleSubmit(events) {
        events.preventDefault();
        var { employee } = this.props.employees;
        var employeeNumber;
        if (employee) {
            employeeNumber = employee.map(x => x.employeeNumber).toString();
        }
        const { employeeNew } = this.state;

        // kiểm tra việc nhập các trường bắt buộc
        if (!employeeNew.employeeNumber) {
            this.notifyerror("Bạn chưa nhập mã nhân viên");
        } else if (employeeNumber) {
            this.notifyerror("Mã nhân viên đã tồn tại");
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
        } else if (!employeeNew.ATM || !employeeNew.nameBank || !employeeNew.addressBank) {
            this.notifyerror("Bạn chưa nhập đủ thông tin tài khoản ngân hàng");
        } else if (!employeeNew.Tax) {
            this.notifyerror("Bạn chưa nhập mã số thuế");
        } else if (!employeeNew.Tax.numberTax || !employeeNew.Tax.userTax || !employeeNew.Tax.startDate || !employeeNew.Tax.unitTax) {
            this.notifyerror("Bạn chưa nhập đủ thông tin thuế");
        } else {
            this.props.addNewEmployee(employeeNew);
            this.notifysuccess("Thêm thành công");
        }
    }

    render() {
        console.log(this.state)
        return (
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <h1>
                        Thêm nhân viên
                    </h1>
                    <ol className="breadcrumb">
                        <li><a href="/"><i className="fa fa-dashboard" /> Home</a></li>
                        <li className="active">Quản lý nhân sự</li>
                    </ol>
                </section>
                <section className="content">
                    <div className="row">
                        {/* left column */}
                        <div className="col-md-12">
                            <form id="form">
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
                                                            <img className="attachment-img avarta" src={this.state.employeeNew.avatar} alt="Attachment" />
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
                                                            <input type="text" className="form-control" id="employeeNumber" name="employeeNumber" placeholder="Mã số nhân viên" onChange={this.handleChangeEmployeeNumber} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="fullname">Họ và tên:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control" name="fullName" id="fullname" placeholder="Họ và tên" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="brithday">Ngày sinh:<span className="required">&#42;</span></label>
                                                            <input type="Date" className="form-control" id="brithday" name="brithday" onChange={this.handleChange} autoComplete="off" />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="emailCompany">Email:<span className="required">&#42;</span></label>
                                                            <input type="email" className="form-control" id="emailCompany" placeholder="Email công ty" name="emailCompany" onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className=" col-md-4 " style={{ marginTop: 30 }}>
                                                        <div className="form-group">
                                                            <label htmlFor="MSCC">Mã số chấm công:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control" id="MSCC" placeholder="Mã số chấm công" name="MSCC" onChange={this.handleChange} />
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
                                                            <input type="text" className="form-control" id="birthplace" name="birthplace" onChange={this.handleChange} />
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
                                                            <input type="number" className="form-control" id="CMND" name="CMND" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="national">Dân tộc:</label>
                                                            <input type="text" className="form-control" id="national" name="national" onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="dateCMND">Ngày cấp:<span className="required">&#42;</span></label>
                                                            <input type="Date" className="form-control" id="dateCMND" name="dateCMND" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="religion">Tôn giáo:</label>
                                                            <input type="text" className="form-control" id="religion" name="religion" onChange={this.handleChange} />
                                                        </div>

                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="addressCMND">Nơi cấp:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control" id="addressCMND" name="addressCMND" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="nation">Quốc tịch:</label>
                                                            <input type="text" className="form-control" id="nation" name="nation" onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="thongtinlienhe" className="tab-pane">
                                            <div className="box-body">
                                                <div className="col-md-4">
                                                    <div className="form-group" style={{ paddingTop: 3 }}>
                                                        <label htmlFor="phoneNumber">Điện thoại đi động:<span className="required">&#42;</span></label>
                                                        <input type="number" className="form-control" id="phoneNumber" name="phoneNumber" onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="emailPersonal">Email cá nhân</label>
                                                        <input type="text" className="form-control" id="emailPersonal" name="emailPersonal" onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="phoneNumberAddress">Điện thoại nhà riêng:</label>
                                                        <input type="text" className="form-control" id="phoneNumberAddress" name="phoneNumberAddress" onChange={this.handleChange} />
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
                                                                <input type="text" className="form-control" id="friendName" name="friendName" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="friendPhone">Điện thoại di động:</label>
                                                                <input type="text" className="form-control" id="friendPhone" name="friendPhone" onChange={this.handleChange} />
                                                            </div>

                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="relation">Quan hệ:</label>
                                                                <input type="text" className="form-control" id="relation" name="relation" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="friendPhoneAddress">Điện thoại nhà riêng:</label>
                                                                <input type="text" className="form-control" id="friendPhoneAddress" name="friendPhoneAddress" onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="friendAddress">Địa chỉ:</label>
                                                                <input type="text" className="form-control" id="friendAddress" name="friendAddress" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="friendEmail">Email:</label>
                                                                <input type="text" className="form-control" id="friendEmail" name="friendEmail" onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Hộ khẩu thường trú</h4></legend>
                                                        <div className="form-group">
                                                            <label htmlFor="localAddress">Địa chỉ:</label>
                                                            <input type="text" className="form-control " name="localAddress" id="localAddress" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="localCommune">
                                                                Xã/Phường:</label>
                                                            <input type="text" className="form-control " name="localCommune" id="localCommune" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="localDistrict">
                                                                Quận/Huyện:</label>
                                                            <input type="text" className="form-control " name="localDistrict" id="localDistrict" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="localCity">
                                                                Tỉnh/Thành phố:</label>
                                                            <input type="text" className="form-control " name="localCity" id="localCity" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="localNational">Quốc gia:</label>
                                                            <input type="text" className="form-control " name="localNational" id="localNational" onChange={this.handleChange} />
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title"> Chỗ ở hiện tại</h4></legend>

                                                        <div className="form-group">
                                                            <label htmlFor="nowAddress">
                                                                Địa chỉ:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control " name="nowAddress" id="nowAddress" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="nowCommune">
                                                                Xã/Phường:</label>
                                                            <input type="text" className="form-control " name="nowCommune" id="nowCommune" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="nowDistrict">
                                                                Quận/Huyện:</label>
                                                            <input type="text" className="form-control " name="nowDistrict" id="nowDistrict" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="nowCity">
                                                                Tỉnh/Thành phố:</label>
                                                            <input type="text" className="form-control " name="nowCity" id="nowCity" onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="nowNational">
                                                                Quốc gia:</label>
                                                            <input type="text" className="form-control " name="nowNational" id="nowNational" onChange={this.handleChange} />
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
                                                        <label htmlFor="ATM">Số tài khoản:<span className="required">&#42;</span></label>
                                                        <input type="text" className="form-control" id="ATM" name="ATM" onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="nameBank">Tên ngân hàng:<span className="required">&#42;</span></label>
                                                        <input type="text" className="form-control" id="nameBank" name="nameBank" onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="addressBank">Chi nhánh:<span className="required">&#42;</span></label>
                                                        <input type="text" className="form-control" id="addressBank" name="addressBank" onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thuế thu nhập cá nhân:</h4></legend>
                                                <div className="form-group">
                                                    <label htmlFor="numberTax">Mã số thuế:<span className="required">&#42;</span></label>
                                                    <input type="number" className="form-control" id="numberTax" name="numberTax" onChange={this.handleChangeTax} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="userTax">Người đại diện:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" id="userTax" name="userTax" onChange={this.handleChangeTax} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="startDate">Ngày hoạt động:<span className="required">&#42;</span></label>
                                                    <input type="date" className="form-control" id="startDate" name="startDate" onChange={this.handleChangeTax} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="unitTax">Quản lý bởi:<span className="required">&#42;</span></label>
                                                    <input type="text" className="form-control" id="unitTax" name="unitTax" onChange={this.handleChangeTax} />
                                                </div>
                                            </fieldset>

                                        </div>
                                        <div id="bangcap" className="tab-pane">
                                            <div className="box-body">
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bằng cấp:</h4></legend>
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="certificate" title="Thêm mới bằng cấp/Chứng chỉ" onClick={this.handleAddNew}>Thêm mới</button>
                                                    <table className="table table-bordered " >
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
                                                            {this.state.employeeNew.certificate !== [] && this.state.employeeNew.certificate.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} type="text" value={x.nameCertificate} name="nameCertificate" style={{ width: "100%" }} onChange={this.handleChangeCertificate} /></td>
                                                                    <td><input className={index} type="text" value={x.addressCertificate} name="addressCertificate" style={{ width: "100%" }} onChange={this.handleChangeCertificate} /></td>
                                                                    <td><input className={index} type="text" value={x.yearCertificate} name="yearCertificate" style={{ width: "100%" }} onChange={this.handleChangeCertificate} /></td>
                                                                    <td><select className={index} style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="typeCertificate" onChange={this.handleChangeCertificate}>
                                                                        <option>Xuất sắc</option>
                                                                        <option>Giỏi</option>
                                                                        <option>Khá</option>
                                                                        <option>Trung bình khá</option>
                                                                        <option>Trung bình</option>
                                                                    </select></td>
                                                                    <td><div style={{ height: 26, paddingTop: 2 }} className="upload btn btn-default">Chọn tệp<input className={index} type="file" name="urlCertificate" id="file" onChange={this.handleChangeCertificate} /></div> {x.urlCertificate === "" ? "Chưa có tệp nào được chọn" : x.urlCertificate}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("certificate", index)}><i className="material-icons"></i></a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </fieldset>
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }}><h4 className="box-title">Chứng chỉ:</h4></legend>
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="certificateShort" title="Thêm mới bằng cấp/Chứng chỉ" onClick={this.handleAddNew}>Thêm mới</button>
                                                    <table className="table table-bordered " >
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
                                                            {this.state.employeeNew.certificateShort !== [] && this.state.employeeNew.certificateShort.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} type="text" value={x.nameCertificateShort} name="nameCertificateShort" style={{ width: "100%" }} onChange={this.handleChangeCertificateShort} /></td>
                                                                    <td><input className={index} type="text" value={x.unit} name="unit" style={{ width: "100%" }} onChange={this.handleChangeCertificateShort} /></td>
                                                                    <td><input className={index} type="text" value={x.startDate} name="startDate" style={{ width: "100%" }} onChange={this.handleChangeCertificateShort} /></td>
                                                                    <td><input className={index} type="text" value={x.endDate} name="endDate" style={{ width: "100%" }} onChange={this.handleChangeCertificateShort} /></td>
                                                                    <td><div style={{ height: 26, paddingTop: 2 }} className="upload btn btn-default">Chọn tệp<input className={index} type="file" name="urlCertificateShort" id="file" onChange={this.handleChangeCertificateShort} /></div> {x.urlCertificateShort === "" ? "Chưa có tệp nào được chọn" : x.urlCertificateShort}</td>
                                                                    <td style={{ textAlign: "center" }}>
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
                                                        <input type="text" className="form-control" id="foreignLanguage" name="foreignLanguage" onChange={this.handleChange} />
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
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="experience" title="Thêm mới kinh nghiệm làm việc" onClick={this.handleAddNew}>Thêm mới</button>
                                                    <table className="table table-bordered" >
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
                                                            {this.state.employeeNew.experience !== "" && this.state.employeeNew.experience.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} value={x.startDate} type="text" name="startDate" style={{ width: "100%" }} id="datepicker2" data-date-format="mm-yyyy" onChange={this.handleChangeExperience} /></td>
                                                                    <td><input className={index} value={x.endDate} type="text" name="endDate" style={{ width: "100%" }} id="datepicker2" data-date-format="mm-yyyy" onChange={this.handleChangeExperience} /></td>
                                                                    <td><input className={index} value={x.unit} type="text" name="unit" style={{ width: "100%" }} onChange={this.handleChangeExperience} /></td>
                                                                    <td><input className={index} value={x.position} type="text" name="position" style={{ width: "100%" }} onChange={this.handleChangeExperience} /></td>
                                                                    <td style={{ textAlign: "center" }}>
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
                                                        <input type="text" className="form-control" name="numberBHYT" onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="startDateBHYT">Ngày có hiệu lực:</label>
                                                        <input type="text" className="form-control" name="startDateBHYT" onChange={this.handleChange} />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="endDateBHYT">Ngày hết hạn:</label>
                                                        <input type="text" className="form-control" name="endDateBHYT" onChange={this.handleChange} />
                                                    </div>
                                                </fieldset>
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm xã hội</h4></legend>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="numberBHXH">Mã số BHXH:</label>
                                                        <input type="text" className="form-control" name="numberBHXH" onChange={this.handleChange} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>Quá trình đóng bảo hiểm xã hội:</h4>
                                                        <button style={{ marginBottom: 5, marginLeft: 10 }} type="submit" className="btn btn-primary pull-right" id="editBHXH" data-toggle="modal" data-target="#modal-importFileBHXH" title="Thêm mới bằng file excel" onClick={this.handleAddNew}>Import file</button>
                                                        <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="BHXH" title="Thêm mới bảo hiểm" onClick={this.handleAddNew}>Thêm mới</button>
                                                        <table className="table table-bordered " >
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
                                                                {this.state.employeeNew.BHXH !== "" && this.state.employeeNew.BHXH.map((x, index) => (
                                                                    <tr key={index}>
                                                                        <td><input className={index} value={x.startDate} type="text" name="startDate" style={{ width: "100%", height: 26 }} onChange={this.handleChangeBHXH} /></td>
                                                                        <td><input className={index} value={x.endDate} type="text" name="endDate" style={{ width: "100%", height: 26 }} onChange={this.handleChangeBHXH} /></td>
                                                                        <td><input className={index} value={x.position} type="text" name="position" style={{ width: "100%", height: 26 }} onChange={this.handleChangeBHXH} /></td>
                                                                        <td><input className={index} value={x.unit} type="text" name="unit" style={{ width: "100%", height: 26 }} onChange={this.handleChangeBHXH} /></td>
                                                                        <td style={{ textAlign: "center" }}>
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
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="contract" title="Thêm mới hợp đồng lao động" onClick={this.handleAddNew}>Thêm mới</button>
                                                    <table className="table table-bordered " >
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
                                                            {this.state.employeeNew.contract !== "" && this.state.employeeNew.contract.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} value={x.nameContract} type="text" name="nameContract" style={{ width: "100%" }} onChange={this.handleChangeContract} /></td>
                                                                    <td><input className={index} value={x.typeContract} type="text" name="typeContract" style={{ width: "100%" }} onChange={this.handleChangeContract} /></td>
                                                                    <td><input className={index} value={x.startDate} type="date" name="startDate" style={{ width: "100%" }} onChange={this.handleChangeContract} /></td>
                                                                    <td><input className={index} value={x.endDate} type="date" name="endDate" style={{ width: "100%" }} onChange={this.handleChangeContract} /></td>
                                                                    <td><div style={{ height: 26, paddingTop: 2 }} className="upload btn btn-default">Chọn tệp<input className={index} type="file" name="urlContract" id="file1" onChange={this.handleChangeContract} /></div> {x.urlContract === "" ? "Chưa có tệp nào được chọn" : x.urlContract}</td>
                                                                    <td style={{ textAlign: "center" }}>
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
                                                    <table className="table table-bordered" >
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '18%' }}>Tên khoá học</th>
                                                                <th style={{ width: '9%' }}>Ngày bắt đầu</th>
                                                                <th style={{ width: '10%' }}>Ngày kết thúc</th>
                                                                <th style={{ width: '17%' }}>Nơi đào tạo</th>
                                                                <th style={{ width: '12%' }}>Loại đào tạo</th>
                                                                <th style={{ width: '10%' }}>Chi phí</th>
                                                                <th style={{ width: '12%' }}>Thời gian cam kết</th>
                                                                <th style={{ width: '12%' }}>Trạng thái</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.employeeNew.course !== "" && this.state.employeeNew.course.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} value={x.nameCourse} type="text" name="nameCourse" style={{ width: "100%" }} onChange={this.handleChangeCourse} /></td>
                                                                    <td><input className={index} value={x.startDate} type="date" name="startDate" style={{ width: "100%" }} onChange={this.handleChangeCourse} /></td>
                                                                    <td><input className={index} value={x.endDate} type="date" name="endDate" style={{ width: "100%" }} onChange={this.handleChangeCourse} /></td>
                                                                    <td><input className={index} value={x.unit} type="text" name="unit" style={{ width: "100%" }} onChange={this.handleChangeCourse} /></td>
                                                                    <td><select className={index} style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="typeCourse" onChange={this.handleChangeCourse}>
                                                                        <option>Nội bộ</option>
                                                                        <option>Ngoài</option>
                                                                    </select></td>
                                                                    <td><input type="text" style={{ width: "100%" }} /></td>
                                                                    <td><input type="text" style={{ width: "100%" }} /></td>
                                                                    <td><select className={index} style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status" onChange={this.handleChangeCourse}>
                                                                        <option>Chưa hoàn thành</option>
                                                                        <option>Hoàn thành</option>
                                                                    </select></td>
                                                                    {/* <td style={{ textAlign: "center" }}>
                                                                            <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("course", index)}><i className="material-icons"></i></a>
                                                                        </td> */}
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
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới khen thưởng" >Thêm mới</button>
                                                    <table className="table table-bordered" >
                                                        <thead>
                                                            <tr>
                                                                <th>Số quyết định</th>
                                                                <th>Ngày quyết định</th>
                                                                <th>Cấp ra quyết định</th>
                                                                <th>Hình thức khen thưởng</th>
                                                                <th style={{ width: "15%" }}>Thành tích (lý do)</th>
                                                                <th>Hành động</th>
                                                            </tr>

                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                    </table>
                                                </fieldset>
                                                <fieldset className="scheduler-border">
                                                    <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Kỷ luật</h4></legend>
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới khen thưởng" >Thêm mới</button>
                                                    <table className="table table-bordered" >
                                                        <thead>
                                                            <tr>
                                                                <th>Số quyết định</th>
                                                                <th>Ngày có hiệu lực</th>
                                                                <th>Ngày hết hiệu lực</th>
                                                                <th>Cấp ra quyết định</th>
                                                                <th>Hình thức Kỷ luật</th>
                                                                <th>Lý do kỷ luật</th>
                                                                <th>Hành động</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

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
                                                        <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới bảng lương" >Thêm mới</button>
                                                        <table className="table table-bordered" >
                                                            <thead>
                                                                <tr>
                                                                    <th>Tháng</th>
                                                                    <th style={{ width: "50%" }}>Lương</th>
                                                                    <th>Hành động</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>

                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thông tin nghỉ phép</h4></legend>
                                                        <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới nghỉ phép" >Thêm mới</button>
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th >Từ ngày</th>
                                                                    <th >Đến ngày</th>
                                                                    <th>Lý do</th>
                                                                    <th>Trạng thái</th>
                                                                    <th >Hành động</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>

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
                                                        <input type="text" className="form-control" id="numberFile" name="numberFile" onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <h4 className="col-md-6" style={{ paddingLeft: 0 }}>Danh sách tài liệu đính kèm:</h4>
                                                    <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="file" title="Thêm mới bảo hiểm" onClick={this.handleAddNew}>Thêm mới</button>
                                                    <button style={{ marginBottom: 5, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title="Thêm các tài liệu mặc định">Mặc định</button>
                                                    <table className="table table-bordered " >
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "22%" }}>Tên tài liệu</th>
                                                                <th style={{ width: "22%" }}>Mô tả</th>
                                                                <th style={{ width: "9%" }}>Số lượng</th>
                                                                <th style={{ width: "12%" }}>Trạng thái</th>
                                                                <th style={{ width: "30%" }}>File đính kèm</th>
                                                                <th style={{ width: '10%' }}>Hành động</th>
                                                            </tr>

                                                        </thead>
                                                        <tbody className={this.state.show}>
                                                            {this.state.employeeNew.file !== "" && this.state.employeeNew.file.map((x, index) => (
                                                                <tr key={index}>
                                                                    <td><input className={index} value={x.nameFile} type="text" name="nameFile" style={{ width: "100%", height: 26 }} onChange={this.handleChangeFile} /></td>
                                                                    <td><input className={index} value={x.discFile} type="text" name="discFile" style={{ width: "100%", height: 26 }} onChange={this.handleChangeFile} /></td>
                                                                    <td><input className={index} value={x.number} type="number" name="number" style={{ width: "100%", height: 26 }} onChange={this.handleChangeFile} /></td>
                                                                    <td><select className={index} style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status" onChange={this.handleChangeFile}>
                                                                        <option>Chưa nộp</option>
                                                                        <option>Đã nộp</option>
                                                                        <option>Đã trả</option>
                                                                    </select></td>
                                                                    <td><div style={{ height: 26, paddingTop: 2 }} className="upload btn btn-default">Chọn tệp<input className={index} type="file" name="urlFile" id="file" onChange={this.handleChangeFile} /></div> {x.urlFile === "" ? "Chưa có tệp nào được chọn" : x.urlFile}</td>
                                                                    <td style={{ textAlign: "center" }}>
                                                                        <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("file", index)}><i className="material-icons"></i></a>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                        <tbody className={this.state.defaulte}>
                                                            <tr>
                                                                <td>Bằng cấp</td>
                                                                <td>Bằng tốt nghiệp trình độ học vấn cao nhất</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Sơ yếu lý lịch</td>
                                                                <td>Sơ yếu lý lịch có công chứng</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Ảnh</td>
                                                                <td>Ảnh 4X6 </td>
                                                                <td>3</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Bản sao CMND/Hộ chiếu</td>
                                                                <td>Bản sao chứng minh thư nhân dân hoặc hộ chiếu có công chứng</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Giấy khám sức khoẻ</td>
                                                                <td>Giấy khám sức khoẻ có dấu đỏ</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Giấy khai sinh</td>
                                                                <td>Giấy khái sinh có công chứng</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Đơn xin việc</td>
                                                                <td>Đơn xin việc viết tay</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td> CV</td>
                                                                <td> CV của nhân viên</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Cam kết</td>
                                                                <td> Giấy cam kết làm việc</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" ><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tạm trú tạm vắng</td>
                                                                <td>Giấy xác nhận tạm trú tạm vắng</td>
                                                                <td>1</td>
                                                                <td><select style={{ width: "100%", height: 26, paddingTop: 0, paddingLeft: 0 }} name="status">
                                                                    <option>Đã nộp</option>
                                                                    <option>Chưa nộp</option>
                                                                    <option>Đã trả</option>
                                                                </select></td>
                                                                <td></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="edit" title="Chỉnh sửa thông tin " data-toggle="modal" data-target="#modal"><i className="material-icons"></i></a>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className=" box-footer">
                                                <button type="submit" title="Thêm nhân viên mới" className="btn btn-success col-md-2 pull-right btnuser" onClick={this.handleSubmit} htmlFor="form">Thêm nhân viên</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <ToastContainer />
                        </div>
                    </div>
                </section>
                <ModalImportFileBHXH />
            </div >
        );
    };
}

function mapState(state) {
    const { employees } = state;
    return { employees };
};

const actionCreators = {
    addNewEmployee: employeeActions.addNewEmployee,
    getInformationEmployee: employeeActions.getInformationEmployee,
};

const connectedAddEmplyee = connect(mapState, actionCreators)(AddEmployee);
export { connectedAddEmplyee as AddEmployee };