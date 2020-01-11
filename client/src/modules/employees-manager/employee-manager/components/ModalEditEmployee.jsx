import React, { Component } from 'react';
import { connect } from 'react-redux';
import { employeeInfoActions } from '../../employee-info/redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import '../../employee-info/components/addemployee.css';
import 'react-toastify/dist/ReactToastify.css';

class ModalEditEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adding: false,
            employeeNew: {
                avatar: 'adminLTE/dist/img/avatar5.png',
                gender: "Nam",
                relationship: "Độc thân",
                department: "Phòng nhân sự",
                cultural: "12/12",
                nameBank: "Techcombank",
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
        //this.props.getInformationEmployee(value);
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
        if (event.target.id === "editcertificate") {
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
        if (event.target.id === "editcertificateShort") {
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
        if (event.target.id === "editexperience") {
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
        if (event.target.id === "editcontract") {
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
        if (event.target.id === "editBHXH") {
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
        if (event.target.id === "editcourse") {
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
        if (event.target.id === "editfile") {
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

    // function add new employee
    handleSubmit(events) {
        events.preventDefault();
        //var { employee } = this.props.employeesInfo;
        // var employeeNumber = list.map(x => x.employeeNumber).toString();
        // const { employeeNew } = this.state;
        this.notifysuccess("Sửa thành công");
    }
    render() {
        var list = this.props.list;
        return (
            <div style={{display:"inline"}}>
                <a href={`#modal-editEmployee${list.employeeNumber}`} className="edit" title="Chỉnh sửa thông tin nhân viên " data-toggle="modal"><i className="material-icons"></i></a>
                <div className="modal modal-full fade" id={`modal-editEmployee${list.employeeNumber}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog-full">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">Cập nhật thông tin:  {list.fullName} - {list.employeeNumber} </h4>
                                    </div>
                                    <div className="modal-body" style={{ paddingTop: 0 }}>
                                        {/* <div className="col-md-12"> */}
                                        {/* <form id="form"> */}
                                        <div className="nav-tabs-custom" >
                                            <ul className="nav nav-tabs">
                                                <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin chung của nhân viên" data-toggle="tab" href="#editthongtinchung">Thông tin chung</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin liên hệ của nhân viên" data-toggle="tab" href="#editthongtinlienhe">Thông tin liên hệ</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Trình độ học vấn - Khinh nghiệm làm việc" data-toggle="tab" href="#editkinhnghiem"> Học vấn - Kinh nghiệm</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Bằng cấp - Chứng chỉ" data-toggle="tab" href="#editbangcap">Bằng cấp - Chứng chỉ</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Tài khoản ngân hành - Thuế thu nhập các nhân" data-toggle="tab" href="#edittaikhoan">Tài khoản - Thuế</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Thông tin bảo hiểm" data-toggle="tab" href="#editbaohiem">Thông tin bảo hiểm</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Hợp đồng lao động - Quá trình đào tạo" data-toggle="tab" href="#edithopdong">Hợp đồng - Đào tạo</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Khen thưởng - Kỷ luật" data-toggle="tab" href="#editkhenthuong">Khen thưởng - kỷ luật</a></li>
                                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Lịch sử tăng giảm lương - Thông tin nghỉ phép" data-toggle="tab" href="#edithistorySalary">Lịch sử lương - Nghỉ phép</a></li>

                                                <li><a style={{ paddingLeft: 5, }} title="Tài liệu đính kèm" data-toggle="tab" href="#edittailieu">Tài liệu đính kèm</a></li>

                                            </ul>
                                            < div className="tab-content">
                                                <div id="editthongtinchung" className="tab-pane active">
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
                                                                    <input type="text" className="form-control" name="employeeNumber" defaultValue={list.employeeNumber} onChange={this.handleChangeEmployeeNumber} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="fullname">Họ và tên:<span className="required">&#42;</span></label>
                                                                    <input type="text" className="form-control" name="fullName" defaultValue={list.fullName} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="brithday">Ngày sinh:<span className="required">&#42;</span></label>
                                                                    <input type="Date" className="form-control" name="brithday" onChange={this.handleChange} defaultValue={list.brithday} autoComplete="off" />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="emailCompany">Email:<span className="required">&#42;</span></label>
                                                                    <input type="email" className="form-control" placeholder="Email công ty" name="emailCompany" defaultValue={list.emailCompany} onChange={this.handleChange} />
                                                                </div>
                                                            </div>

                                                            <div className=" col-md-4 " style={{ marginTop: 30 }}>
                                                                <div className="form-group">
                                                                    <label htmlFor="MSCC">Mã số chấm công:<span className="required">&#42;</span></label>
                                                                    <input type="text" className="form-control" placeholder="Mã số chấm công" name="MSCC" defaultValue={list.MSCC} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label style={{ display: 'block', paddingBottom: 4 }}>Giới tính:</label>
                                                                    {
                                                                        list.gender === "Nam" ?
                                                                            <input type="radio" name="gender" value="Nam" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                            <input type="radio" name="gender" value="Nam" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                    }
                                                                    <label>Nam</label>
                                                                    {
                                                                        list.gender === "Nữ" ?
                                                                            <input type="radio" name="gender" value="Nữ" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                            <input type="radio" name="gender" value="Nữ" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                    }
                                                                    <label>Nữ</label>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="birthplace">Nơi sinh:</label>
                                                                    <input type="text" className="form-control" name="birthplace" defaultValue={list.birthplace} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label style={{ display: 'block', paddingBottom: 7 }}>Tình trạng hôn nhân:</label>
                                                                    {
                                                                        list.relationship === "Độc thân" ?
                                                                            <input type="radio" name="relationship" value="Độc thân" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                            <input type="radio" name="relationship" value="Độc thân" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                    }

                                                                    <label> Độc thân</label>
                                                                    {
                                                                        list.relationship === "Đã kết hôn" ?
                                                                            <input type="radio" name="relationship" value="Đã kết hôn" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                            <input type="radio" name="relationship" value="Đã kết hôn" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                    }
                                                                    <label> Đã kết hôn</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="CMND">Số CMND/Hộ chiếu:<span className="required">&#42;</span></label>
                                                                    <input type="number" className="form-control" name="CMND" defaultValue={list.CMND} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="national">Dân tộc:</label>
                                                                    <input type="text" className="form-control" name="national" defaultValue={list.national} onChange={this.handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="dateCMND">Ngày cấp:<span className="required">&#42;</span></label>
                                                                    <input type="Date" className="form-control" name="dateCMND" defaultValue={list.dateCMND} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="religion">Tôn giáo:</label>
                                                                    <input type="text" className="form-control" name="religion" defaultValue={list.religion} onChange={this.handleChange} />
                                                                </div>

                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="addressCMND">Nơi cấp:<span className="required">&#42;</span></label>
                                                                    <input type="text" className="form-control" name="addressCMND" defaultValue={list.addressCMND} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="nation">Quốc tịch:</label>
                                                                    <input type="text" className="form-control" name="nation" defaultValue={list.nation} onChange={this.handleChange} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                    <div id="editthongtinlienhe" className="tab-pane" >
                                                        <div className="box-body">
                                                            <div className="col-md-4">
                                                                <div className="form-group" style={{ paddingTop: 3 }}>
                                                                    <label htmlFor="phoneNumber">Điện thoại đi động:<span className="required">&#42;</span></label>
                                                                    <input type="number" className="form-control" name="phoneNumber" onChange={this.handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="emailPersonal">Email cá nhân<span className="required">&#42;</span></label>
                                                                    <input type="text" className="form-control" name="emailPersonal" onChange={this.handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="phoneNumberAddress">Điện thoại nhà riêng:</label>
                                                                    <input type="text" className="form-control" name="phoneNumberAddress" onChange={this.handleChange} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <fieldset className="scheduler-border">
                                                                    <legend className="scheduler-border"><h4 className="box-title">Liên hệ khẩn cấp với ai</h4></legend>
                                                                    <div className="col-md-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="friendName">Họ và tên:</label>
                                                                            <input type="text" className="form-control" name="friendName" onChange={this.handleChange} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="friendPhone">Điện thoại di động:</label>
                                                                            <input type="text" className="form-control" name="friendPhone" onChange={this.handleChange} />
                                                                        </div>

                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="relation">Quan hệ:</label>
                                                                            <input type="text" className="form-control" name="relation" onChange={this.handleChange} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="friendPhoneAddress">Điện thoại nhà riêng:</label>
                                                                            <input type="text" className="form-control" name="friendPhoneAddress" onChange={this.handleChange} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="friendAddress">Địa chỉ:</label>
                                                                            <input type="text" className="form-control" name="friendAddress" onChange={this.handleChange} />
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label htmlFor="friendEmail">Email:</label>
                                                                            <input type="text" className="form-control" name="friendEmail" onChange={this.handleChange} />
                                                                        </div>
                                                                    </div>
                                                                </fieldset>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <fieldset className="scheduler-border">
                                                                    <legend className="scheduler-border"><h4 className="box-title">Hộ khẩu thường trú</h4></legend>
                                                                    <div className="form-group">
                                                                        <label htmlFor="localAddress">Địa chỉ:</label>
                                                                        <input type="text" className="form-control " name="localAddress" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="localCommune">
                                                                            Xã/Phường:</label>
                                                                        <input type="text" className="form-control " name="localCommune" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="localDistrict">
                                                                            Quận/Huyện:</label>
                                                                        <input type="text" className="form-control " name="localDistrict" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="localCity">
                                                                            Tỉnh/Thành phố:</label>
                                                                        <input type="text" className="form-control " name="localCity" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="localNational">Quốc gia:</label>
                                                                        <input type="text" className="form-control " name="localNational" onChange={this.handleChange} />
                                                                    </div>
                                                                </fieldset>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <fieldset className="scheduler-border">
                                                                    <legend className="scheduler-border"><h4 className="box-title">Chỗ ở hiện tại</h4></legend>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nowAddress">
                                                                            Địa chỉ:<span className="required">&#42;</span></label>
                                                                        <input type="text" className="form-control " name="nowAddress" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nowCommune">
                                                                            Xã/Phường:</label>
                                                                        <input type="text" className="form-control " name="nowCommune" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nowDistrict">
                                                                            Quận/Huyện:</label>
                                                                        <input type="text" className="form-control " name="nowDistrict" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nowCity">
                                                                            Tỉnh/Thành phố:</label>
                                                                        <input type="text" className="form-control " name="nowCity" onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label htmlFor="nowNational">
                                                                            Quốc gia:</label>
                                                                        <input type="text" className="form-control " name="nowNational" onChange={this.handleChange} />
                                                                    </div>

                                                                </fieldset>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <div id="edittaikhoan" className="tab-pane">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Tài khoản ngân hàng:</h4></legend>
                                                        <div className="box-body">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="ATM">Số tài khoản:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="ATM" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="nameBank">Tên ngân hàng:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" id="nameBank" name="nameBank" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="addressBank">Chi nhánh:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="addressBank" onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Thuế thu nhập cá nhân:</h4></legend>
                                                        <div className="form-group">
                                                            <label htmlFor="numberTax">Mã số thuế:<span className="required">&#42;</span></label>
                                                            <input type="number" className="form-control" name="numberTax" onChange={this.handleChangeTax} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="userTax">Người đại diện:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control" name="userTax" onChange={this.handleChangeTax} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="startDate">Ngày hoạt động:<span className="required">&#42;</span></label>
                                                            <input type="date" className="form-control" name="startDate" onChange={this.handleChangeTax} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="unitTax">Quản lý bởi:<span className="required">&#42;</span></label>
                                                            <input type="text" className="form-control" name="unitTax" onChange={this.handleChangeTax} />
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div id="editbangcap" className="tab-pane">
                                                    <div className="box-body">
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bằng cấp:</h4></legend>
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editcertificate" title="Thêm mới bằng cấp/Chứng chỉ" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered " >
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: "18%" }}>Tên bằng</th>
                                                                        <th style={{ width: "18%" }}>Nơi đào tạo</th>
                                                                        <th style={{ width: "13%" }}>Năm tốt nghiệp</th>
                                                                        <th style={{ width: "15%" }}>Xếp loại</th>
                                                                        <th style={{ width: "30%" }}>File đính kèm</th>
                                                                        <th style={{ width: "5%" }}></th>
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
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editcertificateShort" title="Thêm mới bằng cấp/Chứng chỉ" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered " >
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: "22%" }}>Tên chứng chỉ</th>
                                                                        <th style={{ width: "22%" }}>Nơi cấp</th>
                                                                        <th style={{ width: "9%" }}>Ngày cấp</th>
                                                                        <th style={{ width: "12%" }}>Ngày hết hạn</th>
                                                                        <th style={{ width: "30%" }}>File đính kèm</th>
                                                                        <th style={{ width: "5%" }}></th>
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
                                                <div id="editkinhnghiem" className="tab-pane">
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
                                                                <input type="text" className="form-control" name="foreignLanguage" onChange={this.handleChange} />
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
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editexperience" title="Thêm mới kinh nghiệm làm việc" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered" >
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: '14%' }}>Từ tháng/năm</th>
                                                                        <th style={{ width: '14%' }}>Đến tháng/năm</th>
                                                                        <th>Đơn vị công tác</th>
                                                                        <th>Chức vụ</th>
                                                                        <th style={{ width: '5%' }}></th>
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
                                                <div id="editbaohiem" className="tab-pane">
                                                    <div className="box-body">
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm y tế</h4></legend>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="numberBHYT">Mã số BHYT:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="numberBHYT" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="startDateBHYT">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="startDateBHYT" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="endDateBHYT">Ngày hết hạn:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="endDateBHYT" onChange={this.handleChange} />
                                                            </div>
                                                        </fieldset>
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Bảo hiểm Xã hội</h4></legend>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="numberBHXH">Mã số BHXH:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" name="numberBHXH" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="col-md-12">
                                                                <h4 className="col-md-6" style={{ paddingLeft: 0 }}>Quá trình đóng bảo hiểm xã hội:</h4>
                                                                <button style={{ marginBottom: 5, marginLeft: 10 }} type="submit" className="btn btn-primary pull-right" id="editBHXH" title="Thêm mới bằng file excel" onClick={this.handleAddNew}>Import file</button>
                                                                <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editBHXH" title="Thêm mới bảo hiểm " onClick={this.handleAddNew}>Thêm mới</button>
                                                                <table className="table table-bordered " >
                                                                    <thead>
                                                                        <tr>
                                                                            <th style={{ width: "16%" }}>Từ tháng</th>
                                                                            <th style={{ width: "16%" }}>Đến tháng</th>
                                                                            <th style={{ width: "30%" }}>Chức vụ</th>
                                                                            <th style={{ width: "30%" }}>Đơn vị công tác</th>
                                                                            <th style={{ width: '5%' }}></th>
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
                                                <div id="edithopdong" className="tab-pane">
                                                    <div className="box-body">
                                                        <fieldset className="scheduler-border">
                                                            <legend className="scheduler-border" style={{ marginBottom: 0 }} ><h4 className="box-title">Hợp đồng lao động</h4></legend>
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editcontract" title="Thêm mới hợp đồng lao động" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered " >
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: "25%" }}>Tên hợp đồng</th>
                                                                        <th style={{ width: "13%" }}>Loại hợp đồng</th>
                                                                        <th style={{ width: "14%" }}>Ngày có hiệu lực</th>
                                                                        <th style={{ width: "13%" }}>Ngày hết hạn</th>
                                                                        <th style={{ width: "30%" }}>File đính kèm</th>
                                                                        <th style={{ width: '5%' }}></th>
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
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editcourse" title="Thêm mới quá trình đào tạo" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered table-hover" >
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
                                                <div id="editkhenthuong" className="tab-pane">
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
                                                <div id="edithistorySalary" className="tab-pane">
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
                                                                <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới khen thưởng" >Thêm mới</button>
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
                                                <div id="edittailieu" className="tab-pane">
                                                    <div className="box-body">
                                                        <div className="col-md-4">
                                                            <div className="form-group" style={{ paddingTop: 3 }}>
                                                                <label htmlFor="numberFile">Nơi lưu trữ bản cứng:<span className="required">&#42;</span></label>
                                                                <input type="text" className="form-control" id="numberFile" name="numberFile" onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <h4 className="col-md-6" style={{ paddingLeft: 0 }}>Danh sách tài liệu đính kèm:</h4>
                                                            <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" id="editfile" title="Thêm mới bảo hiểm" onClick={this.handleAddNew}>Thêm mới</button>
                                                            <table className="table table-bordered " >
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{ width: "22%" }}>Tên tài liệu</th>
                                                                        <th style={{ width: "22%" }}>Mô tả</th>
                                                                        <th style={{ width: "9%" }}>Số lượng</th>
                                                                        <th style={{ width: "12%" }}>Trạng thái</th>
                                                                        <th style={{ width: "30%" }}>File đính kèm</th>
                                                                        <th style={{ width: '5%' }}></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
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
                                            <button type="submit" style={{ marginRight: 10 }} title="Huỷ cập nhật thông tin" className="btn btn-default pull-right" data-dismiss="modal" >Đóng</button>
                                            <button type="submit" style={{ marginRight: 10 }} title="Cập nhật thông tin nhân viên" className="btn btn-success pull-right" onClick={this.handleSubmit} htmlFor="form">Cập nhật thông tin</button>
                                        </div>
                                    </div>
                                    {/* </form> */}
                                    <ToastContainer />
                                    {/* </div> */}
                                </div>
                    </div>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreators = {
    addNewEmployee: employeeInfoActions.addNewEmployee,
    //getInformationEmployee: employeeInfoActions.getInformationEmployee,
};

const connectedAddEmplyee = connect(mapState, actionCreators)(ModalEditEmployee);
export { connectedAddEmplyee as ModalEditEmployee };