import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EmployeeInfoActions } from '../redux/actions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class UpdateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: " ",
            avatar: " ",
            check: false,
            informationEmployee: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount() {
        this.props.getInformationPersonal();
    }
    // upload avatar
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

    // bắt sự kiện thay đổi các trường thông tin nhân viên
    handleChange(event) {
        // lấy thông tin nhân viên đã tồn tại
        const content1 = this.props.employeesInfo.employee;
        const content2 = this.props.employeesInfo.employeeContact;
        var old = {
            national: (content1.map(x => x.national)).toString(),
            nation: (content1.map(x => x.nation)).toString(),
            gender: (content1.map(x => x.gender)).toString(),
            relationship: (content1.map(x => x.relationship)).toString(),
            religion: (content1.map(x => x.religion)).toString(),
            phoneNumber: (content1.map(x => x.phoneNumber)).toString(),
            phoneNumber2: (content1.map(x => x.phoneNumber2)).toString(),
            emailPersonal: (content2.map(x => x.emailPersonal)).toString(),
            emailPersonal2: (content2.map(x => x.emailPersonal2)).toString(),
            phoneNumberAddress: (content2.map(x => x.phoneNumberAddress)).toString(),
            friendName: (content2.map(x => x.friendName)).toString(),
            relation: (content2.map(x => x.relation)).toString(),
            friendPhone: (content2.map(x => x.friendPhone)).toString(),
            friendEmail: (content2.map(x => x.friendEmail)).toString(),
            friendPhoneAddress: (content2.map(x => x.friendPhoneAddress)).toString(),
            friendAddress: (content2.map(x => x.friendAddress)).toString(),
            localAddress: (content2.map(x => x.localAddress)).toString(),
            localNational: (content2.map(x => x.localNational)).toString(),
            localCity: (content2.map(x => x.localCity)).toString(),
            localDistrict: (content2.map(x => x.localDistrict)).toString(),
            localCommune: (content2.map(x => x.localCommune)).toString(),
            nowAddress: (content2.map(x => x.nowAddress)).toString(),
            nowNational: (content2.map(x => x.nowNational)).toString(),
            nowCity: (content2.map(x => x.nowCity)).toString(),
            nowDistrict: (content2.map(x => x.nowDistrict)).toString(),
            nowCommune: (content2.map(x => x.nowCommune)).toString()
        }
        var { name, value } = event.target;
        // truyền thông tin nhân viên đã công tại vào state
        if (this.state.informationEmployee === null) {
            this.setState({
                informationEmployee: {
                    ...old,
                    [name]: value
                }
            })
        } else {
            // thêm thông tin nhân viên được thây đổi vào state
            this.setState({
                informationEmployee: {
                    ...this.state.informationEmployee,
                    [name]: value
                }
            })
        }

    }

    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    // bắt sự kiện cam kêt thông tin yêu cầu cập nhật
    handleChecked = () => {
        this.setState({
            check: !this.state.check
        })
    }
    // bắt sự kiện gửi yêu cầu cập nhật thông tin nhân viên
    handleSubmit(events) {
        events.preventDefault();
        var { informationEmployee, check } = this.state;
        if (informationEmployee === null && this.state.avatar === " ") {
            this.notifywarning("Không có thông tin nào được thay đổi");
        } else {
            if (check === true) {
                if (this.state.avatar !== " ") {
                    let employeeNumber = this.props.employeesInfo.employee.map(x => x.employeeNumber);
                    let formData = new FormData();
                    formData.append('fileUpload', this.state.avatar);
                    this.props.uploadAvatar(employeeNumber, formData);
                }
                this.props.updateInformationPersonal(informationEmployee)
                this.notifysuccess("Cập nhật thông tin thành công");
            } else {
                this.notifyerror("Thất bại! Xin hãy xác nhận thông tin");
            }
        }
    }


    render() {
        const { employeesInfo } = this.props;
        var employee, employeeContact;
        if (employeesInfo.employee) employee = employeesInfo.employee;
        if (employeesInfo.employeeContact) employeeContact = employeesInfo.employeeContact;
        return (
            <React.Fragment>
                {(typeof employee === 'undefined' || employee.length === 0) ? <span className="required">Chưa có thông tin cá nhân</span> :
                    employee.map((x, index) => (
                        <div className="row" key={index}>
                            {/* left column */}
                            <div className="col-md-12">
                                {/* general form elements */}
                                <div className="box box-default">
                                    {
                                        employeeContact && employeeContact.map((y, indexs) => (
                                            <div className="box-body" key={indexs}>
                                                <div className="col-md-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Thông tin cơ bản</h4></legend>

                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <img className="attachment-img avarta" src={(this.state.img !== " ") ? this.state.img : x.avatar} alt="Attachment" />
                                                                <div className="upload btn btn-default" style={{ marginLeft: 55 }}>
                                                                    Chọn ảnh
                                                            <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className=" col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="MSNV">Mã nhân viên:</label>
                                                                <input type="text" className="form-control " id="MSNV" defaultValue={x.employeeNumber} disabled />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="fullname">Họ và tên:</label>
                                                                <input type="text" className="form-control " id="fullname" defaultValue={x.fullName} disabled />
                                                            </div>
                                                            <div className="form-group" style={{ height: 59 }}>
                                                                <label style={{ display: 'block', paddingBottom: 4 }}>Giới tính:</label>
                                                                {
                                                                    x.gender === "Nam" ?
                                                                        <input type="radio" name="gender" value="Nam" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                        <input type="radio" name="gender" value="Nam" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                }
                                                                <label>Nam</label>
                                                                {
                                                                    x.gender === "Nữ" ?
                                                                        <input type="radio" name="gender" value="Nữ" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                        <input type="radio" name="gender" value="Nữ" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                }

                                                                <label>Nữ</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="national">Dân tộc:</label>
                                                                <input type="text" className="form-control " id="national" name="national" defaultValue={x.national} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="phoneNumber">Điện thoại di động 1:</label>
                                                                <input type="text" className="form-control " name="phoneNumber" id="phoneNumber" defaultValue={y.phoneNumber ? "0" + y.phoneNumber : ""} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className=" col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="MSCC">Mã số chấm công:</label>
                                                                <input type="text" className="form-control " id="MSCC" defaultValue={x.MSCC} disabled />
                                                            </div>
                                                            {
                                                                x.department && x.department.map((department, key) => (
                                                                    <div className="form-group" key={key}>
                                                                        <label htmlFor="department">Đơn vị:</label>
                                                                        <input type="text" className="form-control " id="department" defaultValue={department.nameDepartment} disabled />
                                                                    </div>
                                                                ))
                                                            }

                                                            <div className="form-group">
                                                                <label style={{ display: 'block', paddingBottom: 7 }}>Tình trạng hôn nhân:</label>
                                                                {
                                                                    x.relationship === "Độc thân" ?
                                                                        <input type="radio" name="relationship" value="Độc thân" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                        <input type="radio" name="relationship" value="Độc thân" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                }

                                                                <label> Độc thân</label>
                                                                {
                                                                    x.relationship === "Đã kết hôn" ?
                                                                        <input type="radio" name="relationship" value="Đã kết hôn" className="" defaultChecked style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} /> :
                                                                        <input type="radio" name="relationship" value="Đã kết hôn" className="" style={{ marginLeft: 30, marginRight: 5 }} onChange={this.handleChange} />
                                                                }
                                                                <label> Đã kết hôn</label>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="religion">Tôn giáo:</label>
                                                                <input type="text" className="form-control " name="religion" id="religion" defaultValue={x.religion} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="nation">Quốc tịch:</label>
                                                                <input type="text" className="form-control " id="nation" name="nation" defaultValue={x.nation} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="phoneNumber2">Điện thoại di động 2:</label>
                                                                <input type="text" className="form-control " name="phoneNumber2" id="phoneNumber2" defaultValue={y.phoneNumber2 ? "0" + y.phoneNumber2 : ""} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>

                                                <div className="col-md-12" >
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border"><h4 className="box-title">Thông tin liên hệ</h4></legend>


                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="emailPersonal">Email cá nhân 1:</label>
                                                                <input type="text" className="form-control " name="emailPersonal" id="emailPersonal" defaultValue={y.emailPersonal} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="emailPersonal2">Email cá nhân 2:</label>
                                                                <input type="text" className="form-control " name="emailPersonal2" id="emailPersonal2" defaultValue={y.emailPersonal2} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="phoneNumberAddress">Điện thoại nhà riêng:</label>
                                                                <input type="text" className="form-control " name="phoneNumberAddress" id="phoneNumberAddress" defaultValue={y.phoneNumberAddress ? "0" + y.phoneNumberAddress : ""} onChange={this.handleChange} />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border">Liên hệ khẩn cấp</legend>
                                                                <div className="col-md-6">
                                                                    <div className="form-group" >
                                                                        <label htmlFor="friendName">Họ và tên:</label>
                                                                        <input type="text" className="form-control " name="friendName" id="friendName" defaultValue={y.friendName} onChange={this.handleChange} />

                                                                    </div>
                                                                    <div className="form-group" >
                                                                        <label htmlFor="relation">Quan hệ:</label>
                                                                        <input type="text" className="form-control " name="relation" id="relation" defaultValue={y.relation} onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group" >
                                                                        <label htmlFor="friendPhone">Điện Thoại di động:</label>
                                                                        <input type="text" className="form-control " name="friendPhone" id="friendPhone" defaultValue={y.friendPhone ? "0" + y.phoneNumberAddress : ""} onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group" >
                                                                        <label htmlFor="friendEmail">Email:</label>
                                                                        <input type="text" className="form-control " name="friendEmail" id="friendEmail" defaultValue={y.friendEmail} onChange={this.handleChange} />
                                                                    </div>

                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="form-group" >
                                                                        <label htmlFor="friendPhoneAddress">Điện thoại nhà riêng:</label>
                                                                        <input type="text" className="form-control " name="friendPhoneAddress" id="friendPhoneAddress" defaultValue={y.friendPhoneAddress ? "0" + y.friendPhoneAddress : ""} onChange={this.handleChange} />
                                                                    </div>
                                                                    <div className="form-group" >
                                                                        <label htmlFor="friendAddress">Địa chỉ:</label>
                                                                        <input type="text" className="form-control " name="friendAddress" id="friendAddress" defaultValue={y.friendAddress} onChange={this.handleChange} />
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border">Hộ khẩu thường trú</legend>
                                                                <div className="form-group" >
                                                                    <label htmlFor="localAddress">Địa chỉ:</label>
                                                                    <input type="text" className="form-control " name="localAddress" id="localAddress" defaultValue={y.localAddress} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="localNational">Quốc gia:</label>
                                                                    <input type="text" className="form-control " name="localNational" id="localNational" defaultValue={y.localNational} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="localCity">Tỉnh/Thành phố:</label>
                                                                    <input type="text" className="form-control " name="localCity" id="localCity" defaultValue={y.localCity} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="localDistrict">Quận/Huyện:</label>
                                                                    <input type="text" className="form-control " name="localDistrict" id="localDistrict" defaultValue={y.localDistrict} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="localCommune">Xã/Phường:</label>
                                                                    <input type="text" className="form-control " name="localCommune" id="localCommune" defaultValue={y.localCommune} onChange={this.handleChange} />
                                                                </div>
                                                            </fieldset>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <fieldset className="scheduler-border">
                                                                <legend className="scheduler-border">Chỗ ở hiện tại</legend>
                                                                <div className="form-group" >
                                                                    <label htmlFor="nowAddress">Địa chỉ:</label>
                                                                    <input type="text" className="form-control " name="nowAddress" id="nowAddress" defaultValue={y.nowAddress} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="nowNational">Quốc gia:</label>
                                                                    <input type="text" className="form-control " name="nowNational" id="nowNational" defaultValue={y.nowNational} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="nowCity">Tỉnh/Thành phố:</label>
                                                                    <input type="text" className="form-control " name="nowCity" id="nowCity" defaultValue={y.nowCity} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="nowDistrict">Quận/Huyện:</label>
                                                                    <input type="text" className="form-control " name="nowDistrict" id="nowDistrict" defaultValue={y.nowDistrict} onChange={this.handleChange} />
                                                                </div>
                                                                <div className="form-group" >
                                                                    <label htmlFor="nowCommune">Xã/Phường:</label>
                                                                    <input type="text" className="form-control " name="nowCommune" id="nowCommune" defaultValue={y.nowCommune} onChange={this.handleChange} />
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </fieldset>
                                                </div>

                                            </div>
                                        ))
                                    }
                                    <div className="box-footer">
                                        <div className="form-group col-md-12">
                                            <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                                <label>
                                                    <input type="checkbox" onChange={() => this.handleChecked()} />
                                                    Tôi xin cam đoan những lời khai trên đây là đúng sự thật và chịu trách nhiệm cho những lời khai này.
                                                        </label>
                                                <label style={{ color: "red" }}>
                                                    (Những thông tin khác vui lòng liên hệ các bên liên quan để được xử lý)
                                                        </label>
                                            </div>
                                        </div>
                                        <button type="submit" title="Cập nhật thông tin nhân viên" className="btn btn-primary col-md-2 pull-right btnuserupdate" onClick={this.handleSubmit} htmlFor="form" >Cập nhật thông tin</button>

                                    </div>
                                </div>

                                <ToastContainer />
                            </div>
                        </div>
                    ))
                }
            </React.Fragment>

        );
    };
}

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreator = {
    getInformationPersonal: EmployeeInfoActions.getInformationPersonal,
    updateInformationPersonal: EmployeeInfoActions.updateInformationPersonal,
    uploadAvatar: EmployeeInfoActions.uploadAvatar,
};
const connectUpdateEmployee = connect(mapState, actionCreator)(UpdateEmployee);
export { connectUpdateEmployee as UpdateEmployee };