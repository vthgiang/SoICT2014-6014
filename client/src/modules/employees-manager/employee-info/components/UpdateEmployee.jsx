import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EmployeeInfoActions } from '../redux/actions';
import { EmployeeManagerActions } from '../../employee-manager/redux/actions'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class UpdateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: "",
            avatar: "",
            check: false,
            informationEmployee: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    componentDidMount() {
        this.props.getInformationPersonal();
    }
    // Bắt sự kiện thay đổi avatar
    handleUpload(event) {
        var file = event.target.files[0];
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result,
                    avatar: file
                })
            };
        }
    }

    // Bắt sự kiện thay đổi các trường thông tin nhân viên
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
            // thêm thông tin nhân viên được thay đổi vào state
            this.setState({
                informationEmployee: {
                    ...this.state.informationEmployee,
                    [name]: value
                }
            })
        }

    }
    // Bắt sự kiện cam kêt thông tin yêu cầu cập nhật
    handleChecked = () => {
        this.setState({
            check: !this.state.check
        })
    }
    // Bắt sự kiện gửi yêu cầu cập nhật thông tin nhân viên
    handleSubmit = async (e) => {
        const { translate } = this.props;
        e.preventDefault();
        var { informationEmployee, check } = this.state;
        if (informationEmployee === null && this.state.avatar === "") {
            toast.warning(translate('error.no_change_data'), { containerId: 'toast-notification' });
        } else {
            if (check === true) {
                var updateAvater = false;
                if (this.state.avatar !== "") {
                    let employeeNumber = this.props.employeesInfo.employee.map(x => x.employeeNumber);
                    let formData = new FormData();
                    formData.append('fileUpload', this.state.avatar);
                    console.log(employeeNumber);
                    await this.props.uploadAvatar(employeeNumber, formData)
                        .then(res => {
                            updateAvater = res.success;
                        }).catch(err => {
                            toast.error(translate('error.edit_infor_personal_false'), { containerId: 'toast-notification' });
                        });
                } else {
                    updateAvater = true
                }
                if (informationEmployee !== null && updateAvater === true) {
                    this.props.updateInformationPersonal(informationEmployee)
                        .then(res => {
                            toast.success(translate('error.edit_infor_personal_success'), { containerId: 'toast-notification' });
                        }).catch(err => {
                            if (err.response.data.message) {
                                if (translate(`error.${err.response.data.message}`) !== undefined)
                                    toast.warning(translate(`error.${err.response.data.message}`), { containerId: 'toast-notification' });
                                else
                                    toast.warning(err.response.data.message, { containerId: 'toast-notification' });
                            } else
                                toast.error(translate('error.edit_infor_personal_false'), { containerId: 'toast-notification' });
                        })
                } else {
                    if (informationEmployee === null && updateAvater === true) {
                        toast.success(translate('error.edit_infor_personal_success'), { containerId: 'toast-notification' });
                    }
                }
            } else {
                toast.warning(translate('error.guaranteed_infor_to_update'), { containerId: 'toast-notification' });
            }
        }
    }

    render() {
        const { employeesInfo, translate } = this.props;
        var employee, employeeContact;
        if (employeesInfo.employee) employee = employeesInfo.employee;
        if (employeesInfo.employeeContact) employeeContact = employeesInfo.employeeContact;
        return (
            <React.Fragment>
                {typeof employee !== 'undefined' && employee.length === 0 && employeesInfo.isLoading === false && < span className="text-red">{translate('manage_employee.no_data_personal')}</span>
                }
                {
                    (typeof employee !== 'undefined' && employee.length !== 0) &&
                    employee.map((x, index) => (
                        <div className="box" key={index} >
                            <div className="box-body qlcv">
                                {
                                    employeeContact && employeeContact.map((y, indexs) => (
                                        <div className="box-body" key={indexs}>
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.menu_basic_infor')}</h4></legend>
                                                <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                                                    <div>
                                                        <img className="attachment-img avarta" src={(this.state.img !== "") ? this.state.img : x.avatar} alt="Attachment" />
                                                    </div>
                                                    <div className="upload btn btn-default ">
                                                        {translate('manage_employee.upload')}
                                                        <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                                                    </div>
                                                </div>
                                                <div className=" pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12 ">
                                                    <div className="row">
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="MSNV">{translate('manage_employee.staff_number')}</label>
                                                            <input type="text" className="form-control " id="MSNV" defaultValue={x.employeeNumber} disabled />
                                                        </div>
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="MSCC">{translate('manage_employee.attendance_code')}</label>
                                                            <input type="text" className="form-control " id="MSCC" defaultValue={x.MSCC} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="fullname">{translate('manage_employee.full_name')}</label>
                                                            <input type="text" className="form-control " id="fullname" defaultValue={x.fullName} disabled />
                                                        </div>
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label >{translate('manage_employee.gender')}</label>
                                                            <div>
                                                                <div className="radio-inline">
                                                                    <label>
                                                                        <input type="radio" name="gender" value="male" onChange={this.handleChange} defaultChecked={x.gender === "male" ? true : false} />{translate('manage_employee.male')}</label>
                                                                </div>
                                                                <div className="radio-inline">
                                                                    <label>
                                                                        <input type="radio" name="gender" value="female" onChange={this.handleChange} defaultChecked={x.gender === "female" ? true : false} />{translate('manage_employee.female')}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="national">{translate('manage_employee.ethnic')}</label>
                                                            <input type="text" className="form-control " id="national" name="national" defaultValue={x.national} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label>{translate('manage_employee.relationship')}</label>
                                                            <div>
                                                                <div className="radio-inline">
                                                                    <label>
                                                                        <input type="radio" name="relationship" value="single" onChange={this.handleChange} defaultChecked={x.relationship === "single" ? true : false} />{translate('manage_employee.single')}</label>
                                                                </div>
                                                                <div className="radio-inline">
                                                                    <label>
                                                                        <input type="radio" name="relationship" value="married" onChange={this.handleChange} defaultChecked={x.relationship === "married" ? true : false} />{translate('manage_employee.married')}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="religion">{translate('manage_employee.religion')}</label>
                                                            <input type="text" className="form-control " name="religion" id="religion" defaultValue={x.religion} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                            <label htmlFor="nation">{translate('manage_employee.nationality')}</label>
                                                            <input type="text" className="form-control " id="nation" name="nation" defaultValue={x.nation} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset className="scheduler-border">
                                                <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.menu_contact_infor')}</h4></legend>
                                                <div className="col-md-12 col-ms-12 col-xs-12">
                                                    <div className="row">
                                                        <div className="form-group col-md-4 col-ms-12 col-xs-12">
                                                            <label htmlFor="phoneNumber">{translate('manage_employee.mobile_phone_1')}</label>
                                                            <input type="text" className="form-control " name="phoneNumber" id="phoneNumber" defaultValue={y.phoneNumber ? "0" + y.phoneNumber : ""} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group col-md-4 col-ms-12 col-xs-12">
                                                            <label htmlFor="phoneNumber2">{translate('manage_employee.mobile_phone_2')}</label>
                                                            <input type="text" className="form-control " name="phoneNumber2" id="phoneNumber2" defaultValue={y.phoneNumber2 ? "0" + y.phoneNumber2 : ""} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12 col-ms-12 col-xs-12">
                                                    <div className="row">
                                                        <div className="form-group col-md-4 col-ms-12 col-xs-12">
                                                            <label htmlFor="emailPersonal">{translate('manage_employee.personal_email_1')}</label>
                                                            <input type="text" className="form-control " name="emailPersonal" id="emailPersonal" defaultValue={y.emailPersonal} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group col-md-4 col-ms-12 col-xs-12">
                                                            <label htmlFor="emailPersonal2">{translate('manage_employee.personal_email_2')}</label>
                                                            <input type="text" className="form-control " name="emailPersonal2" id="emailPersonal2" defaultValue={y.emailPersonal2} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group col-md-4 col-ms-12 col-xs-12">
                                                            <label htmlFor="phoneNumberAddress">{translate('manage_employee.home_phone')}</label>
                                                            <input type="text" className="form-control " name="phoneNumberAddress" id="phoneNumberAddress" defaultValue={y.phoneNumberAddress ? "0" + y.phoneNumberAddress : ""} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">{translate('manage_employee.emergency_contact')}</legend>
                                                        <div className="col-md-6">
                                                            <div className="form-group" >
                                                                <label htmlFor="friendName">{translate('manage_employee.full_name')}</label>
                                                                <input type="text" className="form-control " name="friendName" id="friendName" defaultValue={y.friendName} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group" >
                                                                <label htmlFor="friendPhone">{translate('manage_employee.mobile_phone')}</label>
                                                                <input type="text" className="form-control " name="friendPhone" id="friendPhone" defaultValue={y.friendPhone ? "0" + y.phoneNumberAddress : ""} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group" >
                                                                <label htmlFor="friendEmail">{translate('manage_employee.email')}</label>
                                                                <input type="text" className="form-control " name="friendEmail" id="friendEmail" defaultValue={y.friendEmail} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group" >
                                                                <label htmlFor="relation">{translate('manage_employee.nexus')}</label>
                                                                <input type="text" className="form-control " name="relation" id="relation" defaultValue={y.relation} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group" >
                                                                <label htmlFor="friendPhoneAddress">{translate('manage_employee.home_phone')}</label>
                                                                <input type="text" className="form-control " name="friendPhoneAddress" id="friendPhoneAddress" defaultValue={y.friendPhoneAddress ? "0" + y.friendPhoneAddress : ""} onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group" >
                                                                <label htmlFor="friendAddress">{translate('manage_employee.address')}</label>
                                                                <input type="text" className="form-control " name="friendAddress" id="friendAddress" defaultValue={y.friendAddress} onChange={this.handleChange} />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">{translate('manage_employee.permanent_address')}</legend>
                                                        <div className="form-group" >
                                                            <label htmlFor="localAddress">{translate('manage_employee.address')}</label>
                                                            <input type="text" className="form-control " name="localAddress" id="localAddress" defaultValue={y.localAddress} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="localNational">{translate('manage_employee.nation')}</label>
                                                            <input type="text" className="form-control " name="localNational" id="localNational" defaultValue={y.localNational} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="localCity">{translate('manage_employee.province')}</label>
                                                            <input type="text" className="form-control " name="localCity" id="localCity" defaultValue={y.localCity} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="localDistrict">{translate('manage_employee.district')}</label>
                                                            <input type="text" className="form-control " name="localDistrict" id="localDistrict" defaultValue={y.localDistrict} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="localCommune">{translate('manage_employee.wards')}</label>
                                                            <input type="text" className="form-control " name="localCommune" id="localCommune" defaultValue={y.localCommune} onChange={this.handleChange} />
                                                        </div>
                                                    </fieldset>
                                                </div>

                                                <div className="col-md-6">
                                                    <fieldset className="scheduler-border">
                                                        <legend className="scheduler-border">{translate('manage_employee.current_residence')}</legend>
                                                        <div className="form-group" >
                                                            <label htmlFor="nowAddress">{translate('manage_employee.address')}</label>
                                                            <input type="text" className="form-control " name="nowAddress" id="nowAddress" defaultValue={y.nowAddress} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="nowNational">{translate('manage_employee.nation')}</label>
                                                            <input type="text" className="form-control " name="nowNational" id="nowNational" defaultValue={y.nowNational} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="nowCity">{translate('manage_employee.province')}</label>
                                                            <input type="text" className="form-control " name="nowCity" id="nowCity" defaultValue={y.nowCity} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="nowDistrict">{translate('manage_employee.district')}</label>
                                                            <input type="text" className="form-control " name="nowDistrict" id="nowDistrict" defaultValue={y.nowDistrict} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="form-group" >
                                                            <label htmlFor="nowCommune">{translate('manage_employee.wards')}</label>
                                                            <input type="text" className="form-control " name="nowCommune" id="nowCommune" defaultValue={y.nowCommune} onChange={this.handleChange} />
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </fieldset>

                                        </div>
                                    ))
                                }
                                <div className="box-footer">
                                    <div className="form-group col-md-12">
                                        <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                            <label>
                                                <input type="checkbox" onChange={() => this.handleChecked()} />
                                                {translate('manage_employee.note_page_personal')}
                                            </label>
                                            <label style={{ color: "red" }}>
                                                {translate('manage_employee.contact_other')}
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" title={translate('manage_employee.update_infor_personal')} className="btn btn-primary pull-right" onClick={this.handleSubmit} htmlFor="form" >{translate('modal.update')}</button>

                                </div>
                            </div>
                        </div>
                    ))
                }
            </React.Fragment >

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
    uploadAvatar: EmployeeManagerActions.uploadAvatar,
};
const updateEmployee = connect(mapState, actionCreator)(withTranslate(UpdateEmployee));
export { updateEmployee as UpdateEmployee };