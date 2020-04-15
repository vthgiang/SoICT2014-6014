import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../common-components';
import "./add-employee.css";
class TabGeneralContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Function upload avatar 
    handleUpload = (e) => {
        var file = e.target.files[0];
        if (file !== undefined) {
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    img: fileLoad.result
                });
                this.props.handleUpload(fileLoad.result, file)
            };
        }
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }
    // Function bắt sự kiện thay đổi ngày sinh
    handleBrithdayChange = (value) => {
        this.props.handleChange("brithday", value);
    }

    // Function bắt sự kiện thay đổi ngày cấp CMND
    handleDateCMNDChange = (value) => {
        this.props.handleChange("dateCMND", value);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                img: nextProps.img,
                employeeNumber: nextProps.employee.employeeNumber,
                MSCC: nextProps.employee.MSCC,
                fullname: nextProps.employee.fullname,
                gender: nextProps.employee.gender,
                brithday: nextProps.employee.brithday,
                birthplace: nextProps.employee.birthplace,
                emailCompany: nextProps.employee.emailCompany,
                relationship: nextProps.employee.relationship,
                CMND: nextProps.employee.CMND,
                dateCMND: nextProps.employee.dateCMND,
                addressCMND: nextProps.employee.addressCMND,
                national: nextProps.employee.national,
                religion: nextProps.employee.religion,
                nation: nextProps.employee.nation,

                errorOnPosition: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { brithday, dateCMND, img, employeeNumber, MSCC, fullName, gender, birthplace,
            emailCompany, relationship, CMND, addressCMND, national, religion, nation } = this.state;
        return (
            <div id={id} className="tab-pane active">
                <div className="row box-body">
                    <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                        <div>
                            <img className="attachment-img avarta" src={img} alt="Attachment" />
                        </div>
                        <div className="upload btn btn-default ">
                            {translate('manage_employee.upload')}
                            <input className="upload" type="file" name="file" onChange={this.handleUpload} />
                        </div>
                    </div>
                    <div className="pull-right col-lg-8 col-md-8 col-ms-12  ">
                        <div className="row col-lg-12 col-md-12 col-ms-12 col-xs-12">
                            <p >(<span className="text-red">*</span>): {translate('modal.note')}.</p>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="employeeNumber">{translate('manage_employee.staff_number')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} autoComplete="off" placeholder={translate('manage_employee.staff_number')} onChange={this.handleChange} />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="MSCC">{translate('manage_employee.attendance_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" placeholder={translate('manage_employee.attendance_code')} name="MSCC" value={MSCC} onChange={this.handleChange} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="fullname">{translate('manage_employee.full_name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="fullName" value={fullName} placeholder={translate('manage_employee.full_name')} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('manage_employee.gender')}<span className="text-red">*</span></label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name="gender" value="male" onChange={this.handleChange} checked={gender === "male" ? true : false} />{translate('manage_employee.male')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name="gender" value="female" onChange={this.handleChange} checked={gender === "female" ? true : false} />{translate('manage_employee.female')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="brithday">{translate('manage_employee.date_birth')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`brithday${id}`}
                                    value={brithday}
                                    onChange={this.handleBrithdayChange}
                                />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="birthplace">{translate('manage_employee.place_birth')}</label>
                                <input type="text" className="form-control" name="birthplace" value={birthplace} onChange={this.handleChange} placeholder={translate('manage_employee.place_birth')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label htmlFor="emailCompany">{translate('manage_employee.email')}<span className="text-red">*</span></label>
                                <input type="email" className="form-control" placeholder="Email công ty" name="emailCompany" value={emailCompany} onChange={this.handleChange} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                <label>{translate('manage_employee.relationship')}:</label>
                                <div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name="relationship" value="single" onChange={this.handleChange} checked={relationship === "single" ? true : false} />{translate('manage_employee.single')}</label>
                                    </div>
                                    <div className="radio-inline">
                                        <label>
                                            <input type="radio" name="relationship" value="married" onChange={this.handleChange} checked={relationship === "married" ? true : false} />{translate('manage_employee.married')}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                        <div className="row">
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="CMND">{translate('manage_employee.id_card')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" name="CMND" value={CMND} onChange={this.handleChange} placeholder={translate('manage_employee.id_card')} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="dateCMND">{translate('manage_employee.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`dateCMND${id}`}
                                    value={dateCMND}
                                    onChange={this.handleDateCMNDChange}
                                />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="addressCMND">{translate('manage_employee.issued_by')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="addressCMND" value={addressCMND} onChange={this.handleChange} placeholder={translate('manage_employee.issued_by')} autoComplete="off" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="national">{translate('manage_employee.ethnic')}</label>
                                <input type="text" className="form-control" name="national" value={national} onChange={this.handleChange} placeholder={translate('manage_employee.ethnic')} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="religion">{translate('manage_employee.religion')}</label>
                                <input type="text" className="form-control" name="religion" value={religion} onChange={this.handleChange} placeholder={translate('manage_employee.religion')} autoComplete="off" />
                            </div>
                            <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                                <label htmlFor="nation">{translate('manage_employee.nationality')}</label>
                                <input type="text" className="form-control" name="nation" value={nation} onChange={this.handleChange} placeholder={translate('manage_employee.nationality')} autoComplete="off" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
const tabGeneral = connect(null, null)(withTranslate(TabGeneralContent));
export { tabGeneral as TabGeneralContent };