import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ApiImage } from '../../../../../common-components';

import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';
import { toast } from 'react-toastify';

import { EmployeeInfoActions } from '../redux/actions';

function UpdateEmployee(props) {

    const [state, setState] = useState({
        img: "",
        check: false,
        informationEmployee: null
    })

    useEffect(() => {
        async function fetchData() {
            props.getEmployeeProfile({ callAPIByUser: true });
        }
        fetchData();
    }, [])


    const { employeesInfo, translate } = props;

    const { img } = state;

    let employees, avatar;
    if (employeesInfo.employees !== "") {
        employees = employeesInfo.employees;
        employees.forEach(x => {
            avatar = img ? img : `.${x.avatar}`;
        });
    }

    /** Bắt sự kiện thay đổi avatar */
    const handleUpload = (e) => {
        const { employees } = props.employeesInfo;
        let file = e.target.files[0];
        if (file !== undefined) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                if (state.informationEmployee === null) {
                    setState({
                        informationEmployee: { ...employees[0] },
                        img: fileLoad.result,
                        avatar: file
                    })
                }
                setState({
                    img: fileLoad.result,
                    avatar: file
                })
            };
        }
    }

    /** Bắt sự kiện thay đổi các trường thông tin nhân viên */
    const handleChange = (e) => {
        const { employees } = props.employeesInfo;
        let { name, value } = e.target;

        // Truyền thông tin nhân viên đã tồn tại vào state
        if (state.informationEmployee === null) {
            setState({
                informationEmployee: {
                    ...employees[0],
                    [name]: value
                }
            })
        } else {
            // Thêm thông tin nhân viên được thay đổi vào state
            setState({
                informationEmployee: {
                    ...state.informationEmployee,
                    [name]: value
                }
            })
        }

    }

    /** Bắt sự kiện cam kêt thông tin yêu cầu cập nhật */
    const handleChecked = () => {
        setState({
            check: !state.check
        })
    }

    /** Bắt sự kiện gửi yêu cầu cập nhật thông tin nhân viên */
    const handleSubmit = async (e) => {
        const { translate } = props;

        e.preventDefault();
        let { informationEmployee, check } = state;

        if (informationEmployee === null && state.avatar === "") {
            toast.warning(translate('human_resource.profile.employee_info.no_change_data'), { containerId: 'toast-notification' });
        } else {
            if (check === false) {
                toast.warning(translate('human_resource.profile.employee_info.guaranteed_infor_to_update'), { containerId: 'toast-notification' });
            } else {
                let formData = convertJsonObjectToFormData(informationEmployee) !== null ? convertJsonObjectToFormData(informationEmployee) : new FormData();
                formData.append('fileAvatar', state.avatar);
                props.updatePersonalInformation(formData);
            }
        }
    }

    return (
        <React.Fragment>
            {
                employees && employees.length === 0 && employeesInfo.isLoading === false &&
                <div className="box">
                    <div className="box-body qlcv" style={{ height: '100vh' }}>
                        <strong>{translate('human_resource.profile.employee_info.no_data_personal_to_update')}</strong>
                    </div>
                </div>
            }
            {
                (employees && employees.length !== 0) &&
                employees.map((x, index) => (
                    <div className="box qlcv" key={index} >
                        <div className="box-body">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.tab_name.menu_basic_infor')}</h4></legend>
                                {/* Ảnh đại diện */}
                                <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                                    <div>
                                        {avatar && <ApiImage className="attachment-img avarta" id={`avatar-update`} src={avatar} />}
                                    </div>
                                    <div className="upload btn btn-default ">
                                        {translate('human_resource.profile.upload')}
                                        <input className="upload" type="file" name="file" onChange={handleUpload} />
                                    </div>
                                </div>
                                <div className=" pull-right col-lg-8 col-md-8 col-ms-12 col-xs-12 ">
                                    <div className="row">
                                        {/* Mã sô nhân viên */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="MSNV">{translate('human_resource.profile.staff_number')}</label>
                                            <input type="text" className="form-control " id="MSNV" defaultValue={x.employeeNumber} disabled />
                                        </div>
                                        {/* Mã số chấm công */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="MSCC">{translate('human_resource.profile.attendance_code')}</label>
                                            <input type="text" className="form-control " id="MSCC" defaultValue={x.employeeTimesheetId} disabled />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Họ và tên */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="fullname">{translate('human_resource.profile.full_name')}</label>
                                            <input type="text" className="form-control " id="fullname" defaultValue={x.fullName} disabled />
                                        </div>
                                        {/* Giới tính */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label >{translate('human_resource.profile.gender')}</label>
                                            <div>
                                                <div className="radio-inline">
                                                    <label>
                                                        <input type="radio" name="gender" defaultValue="male" onChange={handleChange} defaultChecked={x.gender === "male" ? true : false} />{translate('human_resource.profile.male')}</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <label>
                                                        <input type="radio" name="gender" defaultValue="female" onChange={handleChange} defaultChecked={x.gender === "female" ? true : false} />{translate('human_resource.profile.female')}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Dân tộc */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="ethnic">{translate('human_resource.profile.ethnic')}</label>
                                            <input type="text" className="form-control " id="ethnic" name="ethnic" defaultValue={x.ethnic} onChange={handleChange} />
                                        </div>
                                        {/* Tình trạng hôn nhân */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label>{translate('human_resource.profile.relationship')}</label>
                                            <div>
                                                <div className="radio-inline">
                                                    <label>
                                                        <input type="radio" name="maritalStatus" value="single" onChange={handleChange} defaultChecked={x.maritalStatus === "single" ? true : false} />{translate('human_resource.profile.single')}</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <label>
                                                        <input type="radio" name="maritalStatus" value="married" onChange={handleChange} defaultChecked={x.maritalStatus === "married" ? true : false} />{translate('human_resource.profile.married')}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* Tôn giáo */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="religion">{translate('human_resource.profile.religion')}</label>
                                            <input type="text" className="form-control " name="religion" id="religion" defaultValue={x.religion} onChange={handleChange} />
                                        </div>
                                        {/* Quốc tịch */}
                                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                            <label htmlFor="nationality">{translate('human_resource.profile.nationality')}</label>
                                            <input type="text" className="form-control " id="nationality" name="nationality" defaultValue={x.nationality} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            {/* Thông tin liên hệ */}
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.tab_name.menu_contact_infor')}</h4></legend>
                                <div className="col-md-12">
                                    <div className="row">
                                        {/* Di động 1 */}
                                        <div className="form-group col-md-4">
                                            <label >{translate('human_resource.profile.mobile_phone_1')}</label>
                                            <input type="text" className="form-control " name="phoneNumber" defaultValue={x.phoneNumber ? x.phoneNumber : ""} onChange={handleChange} />
                                        </div>
                                        {/* Di động 2 */}
                                        <div className="form-group col-md-4">
                                            <label>{translate('human_resource.profile.mobile_phone_2')}</label>
                                            <input type="text" className="form-control " name="phoneNumber2" defaultValue={x.phoneNumber2 ? x.phoneNumber2 : ""} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        {/*  Email cá nhân 1*/}
                                        <div className="form-group col-md-4">
                                            <label >{translate('human_resource.profile.personal_email_1')}</label>
                                            <input type="text" className="form-control " name="personalEmail" defaultValue={x.personalEmail} onChange={handleChange} />
                                        </div>
                                        {/* Email cá nhân 2 */}
                                        <div className="form-group col-md-4">
                                            <label>{translate('human_resource.profile.personal_email_2')}</label>
                                            <input type="text" className="form-control " name="personalEmail2" defaultValue={x.personalEmail2} onChange={handleChange} />
                                        </div>
                                        {/* Điện thoại cố định */}
                                        <div className="form-group col-md-4">
                                            <label>{translate('human_resource.profile.home_phone')}</label>
                                            <input type="text" className="form-control " name="homePhone" defaultValue={x.homePhone ? x.homePhone : ""} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    {/* Thông tin người liên hệ khẩn cấp*/}
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate('human_resource.profile.emergency_contact')}</legend>
                                        <div className="col-md-6">
                                            {/* Họ và tên */}
                                            <div className="form-group" >
                                                <label >{translate('human_resource.profile.full_name')}</label>
                                                <input type="text" className="form-control " name="emergencyContactPerson" id="emergencyContactPerson" defaultValue={x.emergencyContactPerson} onChange={handleChange} />
                                            </div>
                                            {/* Di động */}
                                            <div className="form-group" >
                                                <label htmlFor="emergencyContactPersonPhoneNumber">{translate('human_resource.profile.mobile_phone')}</label>
                                                <input type="text" className="form-control " name="emergencyContactPersonPhoneNumber" id="emergencyContactPersonPhoneNumber" defaultValue={x.emergencyContactPersonPhoneNumber ? x.emergencyContactPersonPhoneNumber : ""} onChange={handleChange} />
                                            </div>
                                            {/* Emai cá nhân */}
                                            <div className="form-group" >
                                                <label htmlFor="emergencyContactPersonEmail">{translate('human_resource.profile.email')}</label>
                                                <input type="text" className="form-control " name="emergencyContactPersonEmail" id="emergencyContactPersonEmail" defaultValue={x.emergencyContactPersonEmail} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            {/* Quan hệ */}
                                            <div className="form-group" >
                                                <label htmlFor="relationWithEmergencyContactPerson">{translate('human_resource.profile.nexus')}</label>
                                                <input type="text" className="form-control " name="relationWithEmergencyContactPerson" id="relationWithEmergencyContactPerson" defaultValue={x.relationWithEmergencyContactPerson} onChange={handleChange} />
                                            </div>
                                            {/* Diện thoại có định */}
                                            <div className="form-group" >
                                                <label htmlFor="emergencyContactPersonHomePhone">{translate('human_resource.profile.home_phone')}</label>
                                                <input type="text" className="form-control " name="emergencyContactPersonHomePhone" id="emergencyContactPersonHomePhone" defaultValue={x.emergencyContactPersonHomePhone ? x.emergencyContactPersonHomePhone : ""} onChange={handleChange} />
                                            </div>
                                            {/* Địa chỉ */}
                                            <div className="form-group" >
                                                <label htmlFor="emergencyContactPersonAddress">{translate('human_resource.profile.address')}</label>
                                                <input type="text" className="form-control " name="emergencyContactPersonAddress" id="emergencyContactPersonAddress" defaultValue={x.emergencyContactPersonAddress} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="col-md-6">
                                    {/* Hộ khẩu thường trú */}
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate('human_resource.profile.permanent_address')}</legend>
                                        {/* Địa chỉ */}
                                        <div className="form-group" >
                                            <label htmlFor="permanentResidence">{translate('human_resource.profile.address')}</label>
                                            <input type="text" className="form-control " name="permanentResidence" id="permanentResidence" defaultValue={x.permanentResidence} onChange={handleChange} />
                                        </div>
                                        {/* Quốc gia */}
                                        <div className="form-group" >
                                            <label htmlFor="permanentResidenceCountry">{translate('human_resource.profile.nation')}</label>
                                            <input type="text" className="form-control " name="permanentResidenceCountry" id="permanentResidenceCountry" defaultValue={x.permanentResidenceCountry} onChange={handleChange} />
                                        </div>
                                        {/* Tỉnh/ Thành phố */}
                                        <div className="form-group" >
                                            <label htmlFor="permanentResidenceCity">{translate('human_resource.profile.province')}</label>
                                            <input type="text" className="form-control " name="permanentResidenceCity" id="permanentResidenceCity" defaultValue={x.permanentResidenceCity} onChange={handleChange} />
                                        </div>
                                        {/* Quận/ huyện */}
                                        <div className="form-group" >
                                            <label htmlFor="permanentResidenceDistrict">{translate('human_resource.profile.district')}</label>
                                            <input type="text" className="form-control " name="permanentResidenceDistrict" id="permanentResidenceDistrict" defaultValue={x.permanentResidenceDistrict} onChange={handleChange} />
                                        </div>
                                        {/* Xã/ phường */}
                                        <div className="form-group" >
                                            <label htmlFor="permanentResidenceWard">{translate('human_resource.profile.wards')}</label>
                                            <input type="text" className="form-control " name="permanentResidenceWard" id="permanentResidenceWard" defaultValue={x.permanentResidenceWard} onChange={handleChange} />
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="col-md-6">
                                    {/* Chỗ ở hiện tại*/}
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate('human_resource.profile.current_residence')}</legend>
                                        {/* Địa chỉ */}
                                        <div className="form-group" >
                                            <label htmlFor="temporaryResidence">{translate('human_resource.profile.address')}</label>
                                            <input type="text" className="form-control " name="temporaryResidence" id="temporaryResidence" defaultValue={x.temporaryResidence} onChange={handleChange} />
                                        </div>
                                        {/* Quốc gia*/}
                                        <div className="form-group" >
                                            <label htmlFor="temporaryResidenceCountry">{translate('human_resource.profile.nation')}</label>
                                            <input type="text" className="form-control " name="temporaryResidenceCountry" id="temporaryResidenceCountry" defaultValue={x.temporaryResidenceCountry} onChange={handleChange} />
                                        </div>
                                        {/* Tỉnh/ Thành phố */}
                                        <div className="form-group" >
                                            <label htmlFor="temporaryResidenceCity">{translate('human_resource.profile.province')}</label>
                                            <input type="text" className="form-control " name="temporaryResidenceCity" id="temporaryResidenceCity" defaultValue={x.temporaryResidenceCity} onChange={handleChange} />
                                        </div>
                                        {/* Quận / huyện */}
                                        <div className="form-group" >
                                            <label htmlFor="temporaryResidenceDistrict">{translate('human_resource.profile.district')}</label>
                                            <input type="text" className="form-control " name="temporaryResidenceDistrict" id="temporaryResidenceDistrict" defaultValue={x.temporaryResidenceDistrict} onChange={handleChange} />
                                        </div>
                                        {/* Xã/ Phường */}
                                        <div className="form-group" >
                                            <label htmlFor="temporaryResidenceWard">{translate('human_resource.profile.wards')}</label>
                                            <input type="text" className="form-control " name="temporaryResidenceWard" id="temporaryResidenceWard" defaultValue={x.temporaryResidenceWard} onChange={handleChange} />
                                        </div>
                                    </fieldset>
                                </div>
                            </fieldset>

                        </div>
                        <div className="box-footer">
                            <div className="form-group col-md-12">
                                <div className="checkbox" style={{ paddingLeft: "20%" }}>
                                    <label>
                                        <input type="checkbox" onChange={() => handleChecked()} />
                                        {` ${translate('human_resource.profile.employee_info.note_page_personal')}`}
                                    </label>
                                    <label style={{ color: "red" }}>
                                        {translate('human_resource.profile.employee_info.contact_other')}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" title={translate('human_resource.profile.employee_info.update_infor_personal')} className="btn btn-primary pull-right" onClick={handleSubmit} htmlFor="form" >{translate('modal.update')}</button>

                        </div>

                    </div>
                ))
            }
        </React.Fragment >

    );
};

function mapState(state) {
    const { employeesInfo } = state;
    return { employeesInfo };
};

const actionCreator = {
    getEmployeeProfile: EmployeeInfoActions.getEmployeeProfile,
    updatePersonalInformation: EmployeeInfoActions.updatePersonalInformation,
};

export default connect(mapState, actionCreator)(withTranslate(UpdateEmployee));