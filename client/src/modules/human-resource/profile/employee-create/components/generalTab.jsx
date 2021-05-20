import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, ErrorLabel, SelectBox, ApiImage } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';
import "./addEmployee.css";
import { RoleActions } from '../../../../super-admin/role/redux/actions';

function GeneralTab(props) {

    const [state, setState] = useState({
        employeeNumber: "",
        errorOnEmployeeNumber: undefined,
        employeeTimesheetId: "",
        fullName: "",
        errorOnFullName: "",
        emailInCompany: "",
        identityCardNumber: "",
        identityCardAddress: "",
        roles: []
    });

    const { translate, role } = props;

    const { id, birthdate, identityCardDate, img, employeeNumber, employeeTimesheetId, fullName, gender, birthplace, status,
        startingDate, leavingDate, emailInCompany, maritalStatus, identityCardNumber, identityCardAddress, ethnic, religion, nationality,
        errorOnEmployeeNumber, errorOnFullName, errorOnStartingDate, errorOnLeavingDate, roles } = state;

    useEffect(() => {
        if ((props.id === "general" || props.id === "page_general") && !state.employeeNumber && !state.employeeTimesheetId && props.employee && props.employee.employeeNumber && props.employee.employeeTimesheetId) {
            setState(state => {
                return {
                    ...state,
                    employeeNumber: props.employee.employeeNumber,
                    employeeTimesheetId: props.employee.employeeTimesheetId
                }
            })
        }

        if (props.employee) {
            console.log('props.employee', props.employee)
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    img: props.img,
                    employeeNumber: props.employee ? props.employee.employeeNumber : '',
                    employeeTimesheetId: props.employee ? props.employee.employeeTimesheetId : "",
                    fullName: props.employee ? props.employee.fullName : '',
                    gender: props.employee ? props.employee.gender : '',
                    birthdate: formatDate(props.employee ? props.employee.birthdate : ''),
                    birthplace: props.employee ? props.employee.birthplace : '',
                    emailInCompany: props.employee ? props.employee.emailInCompany : '',
                    maritalStatus: props.employee ? props.employee.maritalStatus : '',
                    identityCardNumber: props.employee ? props.employee.identityCardNumber : '',
                    identityCardDate: formatDate(props.employee ? props.employee.identityCardDate : ''),
                    identityCardAddress: props.employee ? props.employee.identityCardAddress : '',
                    ethnic: props.employee ? props.employee.ethnic : '',
                    religion: props.employee ? props.employee.religion : '',
                    nationality: props.employee ? props.employee.nationality : '',
                    status: props.employee ? props.employee.status : "",
                    startingDate: formatDate(props.employee ? props.employee.startingDate : ''),
                    leavingDate: formatDate(props.employee ? props.employee.leavingDate : ''),
                    errorOnEmployeeNumber: undefined,
                    errorOnFullName: undefined,
                    errorOnStartingDate: undefined,
                    errorOnLeavingDate: undefined,
                    roles: props.roles ? props.roles : []
                }
            });
        }
    }, [props.id])

    useEffect(() => {
        props.getAllRoles();
    }, [])

    let listRoles = role?.list.filter(x => x.type.name !== "Root");

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date;
        }
    }


    /** Function upload avatar  */
    const handleUpload = (e) => {
        let file = e.target.files[0];
        if (file !== undefined) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                setState(state => {
                    return {
                        ...state,
                        img: fileLoad.result
                    }
                });
                props.handleUpload(fileLoad.result, file)
            };
        }
    }

    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }

    /**
     * Funtion bắt sự kiện thay đổi trạng thái làm việc
     * @param {*} value : Trạng thái làm việc
     */
    const handleChangeStatus = (value) => {
        setState(state => {
            return {
                ...state,
                status: value[0]
            }
        })
        props.handleChange('status', value[0]);
    }

    /** Funtion bắt sự kiện thay đổi giới tính */
    const handleGenderChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                gender: value,
            }
        });
        props.handleChange('gender', value);
    }

    /** Funtion bắt sự kiện thay đổi tình trạng quan hệ */
    const handleMaritalStatusChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                maritalStatus: value,
            }
        })
        props.handleChange('maritalStatus', value);
    }

    /** Function bắt sự kiện thay đổi mã nhân viên */
    const handleMSNVChange = (e) => {
        const { value } = e.target;
        validateEmployeeNumber(value, true);
    }

    const validateEmployeeNumber = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateCode(translate, value);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnEmployeeNumber: message,
                    employeeNumber: value,
                }
            });
            props.handleChange("employeeNumber", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi mã chấm công */
    const handleMSCCChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                employeeTimesheetId: value,
            }
        });
        props.handleChange("employeeTimesheetId", value);
    }

    /** Function bắt sự kiện thay đổi Họ và tên */
    const handleFullNameChange = (e) => {
        const { value } = e.target;
        validateFullName(value, true);
    }

    const validateFullName = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        if (willUpdateState) {

            setState(state => {
                return {
                    ...state,
                    errorOnFullName: message,
                    fullName: value,
                }
            });
            props.handleChange("fullName", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi Email công ty */
    const handleEmailCompanyChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                emailInCompany: value,
            }
        });
        props.handleChange("emailInCompany", value);
    }

    /** Function bắt sự kiện thay đổi số CMND */
    const handleCMNDChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                identityCardNumber: value,
            }
        });
        props.handleChange("identityCardNumber", value);
    }

    /** Function bắt sự kiện thay đổi nơi cấp */
    const handleAddressCMNDChange = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                identityCardAddress: value,
            }
        });
        props.handleChange("identityCardAddress", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày sinh
     * @param {*} value : Ngày sinh
     */
    const handleBrithdayChange = (value) => {
        setState(state => {
            return {
                ...state,
                birthdate: value,
            }
        });
        props.handleChange("birthdate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày bắt đầu làm việc
     * @param {*} value 
     */
    const handleStartingDateChange = (value) => {
        const { translate } = props;
        let { errorOnLeavingDate, leavingDate } = state;

        let errorOnStartingDate = undefined;
        let startDate;
        if (value) {
            let partValue = value.split('-');
            startDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(startDate);
            if (leavingDate) {
                let endDate = leavingDate.split('-');
                endDate = [endDate[2], endDate[1], endDate[0]].join('-');
                let d = new Date(endDate);
                if (date.getTime() >= d.getTime()) {
                    errorOnStartingDate = translate('human_resource.profile.starting_date_before_leaving_date');
                } else {
                    errorOnLeavingDate = errorOnLeavingDate === translate('human_resource.profile.leaving_date_after_starting_date') ? undefined : errorOnLeavingDate
                }
            }
        } else {
            props.handleChange("leavingDate", "");
            errorOnLeavingDate = undefined
        }

        setState(state => {
            return {
                ...state,
                startingDate: value,
                leavingDate: value ? leavingDate : "",
                errorOnStartingDate: errorOnStartingDate,
                errorOnLeavingDate: errorOnLeavingDate === translate('human_resource.profile.starting_date_required') ? undefined : errorOnLeavingDate
            }
        })
        props.handleChange("startingDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày nghỉ việc
     * @param {*} value 
     */
    const handleLeavingDateChange = (value) => {
        const { translate } = props;
        let { startingDate } = state;

        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(endDate);
            if (startingDate) {
                let startDate = startingDate.split('-');
                startDate = [startDate[2], startDate[1], startDate[0]].join('-');
                let d = new Date(startDate);
                if (d.getTime() >= date.getTime()) {
                    setState(state => {
                        return {
                            ...state,
                            leavingDate: value,
                            errorOnLeavingDate: translate('human_resource.profile.leaving_date_after_starting_date'),
                        }
                    })
                } else {
                    setState(state => {
                        return {
                            ...state,
                            leavingDate: value,
                            errorOnStartingDate: undefined,
                            errorOnLeavingDate: undefined,
                        }
                    })
                }
            } else {
                setState(state => {
                    return {
                        ...state,
                        leavingDate: value,
                        errorOnLeavingDate: translate('human_resource.profile.starting_date_required'),
                    }
                })
            }
        } else {
            setState(state => {
                return {
                    ...state,
                    leavingDate: value,
                    errorOnLeavingDate: undefined,
                }
            })
        }
        props.handleChange("leavingDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày cấp CMND
     * @param {*} value : Ngày cấp CMND
     */
    const handleDateCMNDChange = (value) => {
        setState(state => {
            return {
                ...state,
                identityCardDate: value,
            }
        });
        props.handleChange("identityCardDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi chức danh
     * @param {*} value : danh sách các chức danh
     */

    const handleEmployeeRolesChange = (value) => {
        setState({
            ...state,
            roles: value
        });
        props.handleChangeRole(value);
    }

    return (
        <div id={id} className="tab-pane active">
            <div className="row box-body">
                {/* Ảnh đại diện */}
                <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12" style={{ textAlign: 'center' }}>
                    <div>
                        {img && <ApiImage className='attachment-img avarta' src={img} />}
                    </div>
                    <div className="upload btn btn-default ">
                        {translate('human_resource.profile.upload')}
                        <input className="upload" type="file" name="file" onChange={handleUpload} />
                    </div>
                </div>

                <div className="pull-right col-lg-8 col-md-8 col-ms-12  ">
                    {
                        id === 'page_general' &&
                        <div className="row col-lg-12 col-md-12 col-ms-12 col-xs-12">
                            <p >(<span className="text-red">*</span>): <span className="text-red">{translate('modal.note')}</span></p>
                        </div>
                    }

                    <div className="row">
                        {/* Mã số nhân viên */}
                        <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnEmployeeNumber && "has-error"}`}>
                            <label>{translate('human_resource.profile.staff_number')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber ? employeeNumber : ''} placeholder={translate('human_resource.profile.staff_number')} onChange={handleMSNVChange} />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        {/* Mã số chấm công */}
                        <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                            <label htmlFor="MSCC">{translate('human_resource.profile.attendance_code')}</label>
                            <input type="text" className="form-control" placeholder={translate('human_resource.profile.attendance_code')} name="employeeTimesheetId" value={employeeTimesheetId} onChange={handleMSCCChange} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Tên nhân viên */}
                        <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnFullName && "has-error"}`}>
                            <label htmlFor="fullname">{translate('human_resource.profile.full_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="fullName" value={fullName} placeholder={translate('human_resource.profile.full_name')} onChange={handleFullNameChange} autoComplete="off" />
                            <ErrorLabel content={errorOnFullName} />
                        </div>
                        {/* Giới tính */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <label>{translate('human_resource.profile.gender')}<span className="text-red">*</span></label>
                            <div>
                                <div className="radio-inline">
                                    <label>
                                        <input type="radio" name={`gender${id}`} value="male" onChange={handleGenderChange}
                                            checked={gender === "male" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.male')}</label>
                                </div>
                                <div className="radio-inline">
                                    <label>
                                        <input type="radio" name={`gender${id}`} value="female" onChange={handleGenderChange}
                                            checked={gender === "female" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.female')}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* Ngày sinh */}
                        <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 `}>
                            <label >{translate('human_resource.profile.date_birth')}</label>
                            <DatePicker
                                id={`brithday${id}`}
                                value={birthdate}
                                onChange={handleBrithdayChange}
                            />
                        </div>
                        {/* Nơi sinh */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <label htmlFor="birthplace">{translate('human_resource.profile.place_birth')}</label>
                            <input type="text" className="form-control" name="birthplace" value={birthplace ? birthplace : ''} onChange={handleChange} placeholder={translate('human_resource.profile.place_birth')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Trạng thái làm việc */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <label>{translate('human_resource.status')}</label>
                            <SelectBox
                                id={`status${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: 'active', text: translate('human_resource.profile.active') },
                                    { value: 'leave', text: translate('human_resource.profile.leave') },
                                    { value: 'maternity_leave', text: translate('human_resource.profile.maternity_leave') },
                                    { value: 'unpaid_leave', text: translate('human_resource.profile.unpaid_leave') },
                                    { value: 'probationary', text: translate('human_resource.profile.probationary') },
                                    { value: 'sick_leave', text: translate('human_resource.profile.sick_leave') },
                                ]}
                                onChange={handleChangeStatus}
                            />
                        </div>
                        {/* Tình trạng hôn nhân */}
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <label>{translate('human_resource.profile.relationship')}</label>
                            <div>
                                <div className="radio-inline">
                                    <label>
                                        <input type="radio" name={`maritalStatus${id}`} value="single" onChange={handleMaritalStatusChange} checked={maritalStatus === "single" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.single')}</label>
                                </div>
                                <div className="radio-inline">
                                    <label>
                                        <input type="radio" name={`maritalStatus${id}`} value="married" onChange={handleMaritalStatusChange} checked={maritalStatus === "married" ? true : false} />&nbsp;&nbsp;{translate('human_resource.profile.married')}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                    <div className="row">
                        {/* Email công ty */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12`}>
                            <label htmlFor="emailCompany">{translate('human_resource.profile.email')}</label>
                            <input type="email" className="form-control" placeholder={translate('human_resource.profile.email_company')} name="emailInCompany" value={emailInCompany} onChange={handleEmailCompanyChange} autoComplete="off" />
                        </div>
                        {/* Ngày bắt đầu làm việc */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnStartingDate && "has-error"}`}>
                            <label >{translate('human_resource.profile.starting_date')}</label>
                            <DatePicker
                                id={`startingDate${id}`}
                                deleteValue={leavingDate ? false : true}
                                value={startingDate}
                                onChange={handleStartingDateChange}
                            />
                            <ErrorLabel content={errorOnStartingDate} />
                        </div>
                        {/* Ngày nghỉ việc */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12 ${errorOnLeavingDate && "has-error"}`}>
                            <label >{translate('human_resource.profile.leaving_date')}</label>
                            <DatePicker
                                id={`leavingDate${id}`}
                                value={leavingDate}
                                onChange={handleLeavingDateChange}
                            />
                            <ErrorLabel content={errorOnLeavingDate} />
                        </div>
                    </div>
                    <div className="row">
                        {/* Số CMND */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12`}>
                            <label htmlFor="CMND">{translate('human_resource.profile.id_card')}</label>
                            <input type="text" className="form-control" name="identityCardNumber" value={identityCardNumber} onChange={handleCMNDChange} placeholder={translate('human_resource.profile.id_card')} autoComplete="off" />
                        </div>
                        {/* Ngày cấp */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12`}>
                            <label >{translate('human_resource.profile.date_issued')}</label>
                            <DatePicker
                                id={`dateCMND${id}`}
                                value={identityCardDate}
                                onChange={handleDateCMNDChange}
                            />
                        </div>
                        {/* Nơi cấp */}
                        <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12`}>
                            <label htmlFor="addressCMND">{translate('human_resource.profile.issued_by')}</label>
                            <input type="text" className="form-control" name="identityCardAddress" value={identityCardAddress} onChange={handleAddressCMNDChange} placeholder={translate('human_resource.profile.issued_by')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Dân tộc */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                            <label htmlFor="national">{translate('human_resource.profile.ethnic')}</label>
                            <input type="text" className="form-control" name="ethnic" value={ethnic ? ethnic : ""} onChange={handleChange} placeholder={translate('human_resource.profile.ethnic')} autoComplete="off" />
                        </div>
                        {/* Tôn giáo */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                            <label htmlFor="religion">{translate('human_resource.profile.religion')}</label>
                            <input type="text" className="form-control" name="religion" value={religion ? religion : ""} onChange={handleChange} placeholder={translate('human_resource.profile.religion')} autoComplete="off" />
                        </div>
                        {/* Quốc tịch */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                            <label htmlFor="nation">{translate('human_resource.profile.nationality')}</label>
                            <input type="text" className="form-control" name="nationality" value={nationality ? nationality : ""} onChange={handleChange} placeholder={translate('human_resource.profile.nationality')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="row">
                        {/* Những role của nhân viên này */}
                        <div className="form-group col-lg-4 col-md-4 col-ms-12 col-xs-12">
                            <label>{translate('human_resource.profile.roles')}</label>
                            <SelectBox
                                id={`roles${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listRoles.map(role => { return { value: role ? role._id : null, text: role ? role.name : "" } })}
                                onChange={handleEmployeeRolesChange}
                                value={roles}
                                multiple={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function mapState(state) {
    const { role } = state;
    return { role };
};

const actionCreators = {
    getAllRoles: RoleActions.get
};

const generalTab = connect(mapState, actionCreators)(withTranslate(GeneralTab));
export { generalTab as GeneralTab };