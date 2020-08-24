import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeInfoActions } from '../redux/actions';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { toast } from 'react-toastify';

import { AuthActions } from '../../../../auth/redux/actions';

class UpdateEmployee extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            img: "",
            check: false,
            informationEmployee: null,
        };
    }

    componentDidMount() {
        this.props.getEmployeeProfile();
    }
    // Bắt sự kiện thay đổi avatar
    handleUpload = (e) => {
        const { employees } = this.props.employeesInfo;
        var file = e.target.files[0];
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                if (this.state.informationEmployee === null) {
                    this.setState({
                        informationEmployee: { ...employees[0] },
                        img: fileLoad.result,
                        avatar: file
                    })
                }
                this.setState({
                    img: fileLoad.result,
                    avatar: file
                })
            };
        }
    }

    // Bắt sự kiện thay đổi các trường thông tin nhân viên
    handleChange = (e) => {
        const { employees } = this.props.employeesInfo;
        var { name, value } = e.target;
        // Truyền thông tin nhân viên đã tồn tại vào state
        if (this.state.informationEmployee === null) {
            this.setState({
                informationEmployee: {
                    ...employees[0],
                    [name]: value
                }
            })
        } else {
            // Thêm thông tin nhân viên được thay đổi vào state
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
        e.preventDefault();
        const { translate } = this.props;
        var { informationEmployee, check } = this.state;
        if (informationEmployee === null && this.state.avatar === "") {
            toast.warning(translate('error.no_change_data'), { containerId: 'toast-notification' });
        } else {
            if (check === false) {
                toast.warning(translate('error.guaranteed_infor_to_update'), { containerId: 'toast-notification' });
            } else {
                let formData = convertJsonObjectToFormData(informationEmployee) !== null ? convertJsonObjectToFormData(informationEmployee) : new FormData();
                formData.append('fileAvatar', this.state.avatar);
                this.props.updatePersonalInformation(formData);
            }
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextProps.employeesInfo.employees) {
            let employee = nextProps.employeesInfo.employees[0];
            if (employee.avatar && !nextProps.auth.isLoading &&
                this.state.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
                this.props.downloadFile(`.${employee.avatar}`, 'avatarEmployeeUpdate', 'show');
                this.setState({
                    dataStatus: this.DATA_STATUS.QUERYING
                });
                return false;
            };
        }

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.auth.isLoading) {
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE
            });
            return false;
        };
        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE && nextProps.auth.show_files.length !== 0) {
            let img = nextProps.auth.show_files.find(x => x.fileName === "avatarEmployeeUpdate");
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
                img: img.file
            });
            return true;
        }
        return false;
    }

    render() {
        const { employeesInfo, translate } = this.props;
        var employees;
        if (employeesInfo.employees !== "") employees = employeesInfo.employees;
        return (
            <React.Fragment>
                {
                    typeof employees !== 'undefined' && employees.length === 0 && employeesInfo.isLoading === false && < span className="text-red">{translate('manage_employee.no_data_personal')}</span>
                }
                {
                    (typeof employees !== 'undefined' && employees.length !== 0) &&
                    employees.map((x, index) => (
                        <div className="box qlcv" key={index} >
                            <div className="box-body">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.menu_basic_infor')}</h4></legend>
                                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                                        <div>
                                            <img className="attachment-img avarta" src={this.state.img} alt="Attachment" />
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
                                                <input type="text" className="form-control " id="MSCC" defaultValue={x.employeeTimesheetId} disabled />
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
                                                            <input type="radio" name="gender" defaultValue="male" onChange={this.handleChange} defaultChecked={x.gender === "male" ? true : false} />{translate('manage_employee.male')}</label>
                                                    </div>
                                                    <div className="radio-inline">
                                                        <label>
                                                            <input type="radio" name="gender" defaultValue="female" onChange={this.handleChange} defaultChecked={x.gender === "female" ? true : false} />{translate('manage_employee.female')}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                <label htmlFor="ethnic">{translate('manage_employee.ethnic')}</label>
                                                <input type="text" className="form-control " id="ethnic" name="ethnic" defaultValue={x.ethnic} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                                <label>{translate('manage_employee.relationship')}</label>
                                                <div>
                                                    <div className="radio-inline">
                                                        <label>
                                                            <input type="radio" name="maritalStatus" value="single" onChange={this.handleChange} defaultChecked={x.maritalStatus === "single" ? true : false} />{translate('manage_employee.single')}</label>
                                                    </div>
                                                    <div className="radio-inline">
                                                        <label>
                                                            <input type="radio" name="maritalStatus" value="married" onChange={this.handleChange} defaultChecked={x.maritalStatus === "married" ? true : false} />{translate('manage_employee.married')}</label>
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
                                                <label htmlFor="nationality">{translate('manage_employee.nationality')}</label>
                                                <input type="text" className="form-control " id="nationality" name="nationality" defaultValue={x.nationality} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.menu_contact_infor')}</h4></legend>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label >{translate('manage_employee.mobile_phone_1')}</label>
                                                <input type="text" className="form-control " name="phoneNumber" defaultValue={x.phoneNumber ? "0" + x.phoneNumber : ""} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>{translate('manage_employee.mobile_phone_2')}</label>
                                                <input type="text" className="form-control " name="phoneNumber2" defaultValue={x.phoneNumber2 ? "0" + x.phoneNumber2 : ""} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label >{translate('manage_employee.personal_email_1')}</label>
                                                <input type="text" className="form-control " name="personalEmail" defaultValue={x.personalEmail} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>{translate('manage_employee.personal_email_2')}</label>
                                                <input type="text" className="form-control " name="personalEmail2" defaultValue={x.personalEmail2} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label>{translate('manage_employee.home_phone')}</label>
                                                <input type="text" className="form-control " name="homePhone" defaultValue={x.homePhone ? "0" + x.homePhone : ""} onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">{translate('manage_employee.emergency_contact')}</legend>
                                            <div className="col-md-6">
                                                <div className="form-group" >
                                                    <label >{translate('manage_employee.full_name')}</label>
                                                    <input type="text" className="form-control " name="emergencyContactPerson" id="emergencyContactPerson" defaultValue={x.emergencyContactPerson} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group" >
                                                    <label htmlFor="emergencyContactPersonPhoneNumber">{translate('manage_employee.mobile_phone')}</label>
                                                    <input type="text" className="form-control " name="emergencyContactPersonPhoneNumber" id="emergencyContactPersonPhoneNumber" defaultValue={x.emergencyContactPersonPhoneNumber ? "0" + x.emergencyContactPersonPhoneNumber : ""} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group" >
                                                    <label htmlFor="emergencyContactPersonEmail">{translate('manage_employee.email')}</label>
                                                    <input type="text" className="form-control " name="emergencyContactPersonEmail" id="emergencyContactPersonEmail" defaultValue={x.emergencyContactPersonEmail} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group" >
                                                    <label htmlFor="relationWithEmergencyContactPerson">{translate('manage_employee.nexus')}</label>
                                                    <input type="text" className="form-control " name="relationWithEmergencyContactPerson" id="relationWithEmergencyContactPerson" defaultValue={x.relationWithEmergencyContactPerson} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group" >
                                                    <label htmlFor="emergencyContactPersonHomePhone">{translate('manage_employee.home_phone')}</label>
                                                    <input type="text" className="form-control " name="emergencyContactPersonHomePhone" id="emergencyContactPersonHomePhone" defaultValue={x.emergencyContactPersonHomePhone ? "0" + x.emergencyContactPersonHomePhone : ""} onChange={this.handleChange} />
                                                </div>
                                                <div className="form-group" >
                                                    <label htmlFor="emergencyContactPersonAddress">{translate('manage_employee.address')}</label>
                                                    <input type="text" className="form-control " name="emergencyContactPersonAddress" id="emergencyContactPersonAddress" defaultValue={x.emergencyContactPersonAddress} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-md-6">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">{translate('manage_employee.permanent_address')}</legend>
                                            <div className="form-group" >
                                                <label htmlFor="permanentResidence">{translate('manage_employee.address')}</label>
                                                <input type="text" className="form-control " name="permanentResidence" id="permanentResidence" defaultValue={x.permanentResidence} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="permanentResidenceCountry">{translate('manage_employee.nation')}</label>
                                                <input type="text" className="form-control " name="permanentResidenceCountry" id="permanentResidenceCountry" defaultValue={x.permanentResidenceCountry} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="permanentResidenceCity">{translate('manage_employee.province')}</label>
                                                <input type="text" className="form-control " name="permanentResidenceCity" id="permanentResidenceCity" defaultValue={x.permanentResidenceCity} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="permanentResidenceDistrict">{translate('manage_employee.district')}</label>
                                                <input type="text" className="form-control " name="permanentResidenceDistrict" id="permanentResidenceDistrict" defaultValue={x.permanentResidenceDistrict} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="permanentResidenceWard">{translate('manage_employee.wards')}</label>
                                                <input type="text" className="form-control " name="permanentResidenceWard" id="permanentResidenceWard" defaultValue={x.permanentResidenceWard} onChange={this.handleChange} />
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="col-md-6">
                                        <fieldset className="scheduler-border">
                                            <legend className="scheduler-border">{translate('manage_employee.current_residence')}</legend>
                                            <div className="form-group" >
                                                <label htmlFor="temporaryResidence">{translate('manage_employee.address')}</label>
                                                <input type="text" className="form-control " name="temporaryResidence" id="temporaryResidence" defaultValue={x.temporaryResidence} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="temporaryResidenceCountry">{translate('manage_employee.nation')}</label>
                                                <input type="text" className="form-control " name="temporaryResidenceCountry" id="temporaryResidenceCountry" defaultValue={x.temporaryResidenceCountry} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="temporaryResidenceCity">{translate('manage_employee.province')}</label>
                                                <input type="text" className="form-control " name="temporaryResidenceCity" id="temporaryResidenceCity" defaultValue={x.temporaryResidenceCity} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="temporaryResidenceDistrict">{translate('manage_employee.district')}</label>
                                                <input type="text" className="form-control " name="temporaryResidenceDistrict" id="temporaryResidenceDistrict" defaultValue={x.temporaryResidenceDistrict} onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group" >
                                                <label htmlFor="temporaryResidenceWard">{translate('manage_employee.wards')}</label>
                                                <input type="text" className="form-control " name="temporaryResidenceWard" id="temporaryResidenceWard" defaultValue={x.temporaryResidenceWard} onChange={this.handleChange} />
                                            </div>
                                        </fieldset>
                                    </div>
                                </fieldset>

                            </div>
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
                    ))
                }
            </React.Fragment >

        );
    };
}

function mapState(state) {
    const { employeesInfo, auth } = state;
    return { employeesInfo, auth };
};

const actionCreator = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
    updatePersonalInformation: EmployeeInfoActions.updatePersonalInformation,
    downloadFile: AuthActions.downloadFile,
};

const updateEmployee = connect(mapState, actionCreator)(withTranslate(UpdateEmployee));
export { updateEmployee as UpdateEmployee };