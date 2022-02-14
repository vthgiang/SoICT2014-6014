import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, ErrorLabel, SelectBox, ApiImage } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';
import "./addBiddingPackage.css";

function SearchEmployeeByCareerPositionTab(props) {

    const [state, setState] = useState({ });

    const { translate } = props;
    
    const { id, startDate, endDate,  name, code, status, type, description, errorOnName } = state;
    
    useEffect(() => {
        if ((props.id === "general" || props.id === "page_general") && !state.name && !state.code && props.biddingPackage && props.biddingPackage.name && props.biddingPackage.code) {
            setState(state => {
                return {
                    ...state,
                    name: props.biddingPackage.name,
                    code: props.biddingPackage.code
                }
            })
        }

        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    name: props.biddingPackage ? props.biddingPackage.name : '',
                    code: props.biddingPackage ? props.biddingPackage.code : '',
                    startDate: formatDate(props.biddingPackage ? props.biddingPackage.startDate : ''),
                    endDate: formatDate(props.biddingPackage ? props.biddingPackage.endDate : ''),
                    status: props.biddingPackage ? props.biddingPackage.status : "",
                    type: props.biddingPackage ? props.biddingPackage.type : "",
                    description: props.biddingPackage ? props.biddingPackage.description : '',
                    errorOnName: undefined,
                    errorOnStartingDate: undefined,
                    errorOnStartDate: undefined,
                }
            });
        }
    }, [props.id, props.biddingPackage])

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
     * Funtion bắt sự kiện thay đổi trạng thái 
     * @param {*} value : Trạng thái 
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

    /**
     * Funtion bắt sự kiện thay đổi loại gói thầu 
     * @param {*} value : Loại gói thầu 
     */
    const handleChangeType = (value) => {
        setState(state => {
            return {
                ...state,
                type: value[0]
            }
        })
        props.handleChange('type', value[0]);
    }

    /** Function bắt sự kiện thay đổi mã nhân viên */
    const handleBiddingPackageName = (e) => {
        const { value } = e.target;
        validateBiddingPackageName(value, true);
    }

    const validateBiddingPackageName = (value, willUpdateState = true) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateCode(translate, value);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnName: message,
                    name: value,
                }
            });
            props.handleChange("name", value);
        }
        return message === undefined;
    }

    /** Function bắt sự kiện thay đổi mã chấm công */
    const handleChangeCode = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                code: value,
            }
        });
        props.handleChange("code", value);
    }

    /** Function bắt sự kiện thay đổi mô tả */
    const handleDescription = (e) => {
        const { value } = e.target;
        setState(state => {
            return {
                ...state,
                description: value,
            }
        });
        props.handleChange("description", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày sinh
     * @param {*} value : Ngày sinh
     */
    const handleEndDateChange = (value) => {
        setState(state => {
            return {
                ...state,
                endDate: value,
            }
        });
        props.handleChange("endDate", value);
    }

    /**
     * Function bắt sự kiện thay đổi ngày bắt đầu 
     * @param {*} value 
     */
    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { errorOnStartDate, endDate } = state;

        let errorOnStartingDate = undefined;
        let startDate;
        if (value) {
            let partValue = value.split('-');
            startDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(startDate);
            console.log("endDate, endDate", endDate)
            if (endDate) {
                endDate = endDate.toString().split('-');
                endDate = [endDate[2], endDate[1], endDate[0]].join('-');
                let d = new Date(endDate);
                if (date.getTime() >= d.getTime()) {
                    errorOnStartingDate = "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
                } else {
                    errorOnStartDate = errorOnStartDate === "Thời gian kết thúc phải lớn hơn thời gian bắt đầu" ? undefined : errorOnStartDate
                }
            }
        } else {
            props.handleChange("endDate", "");
            errorOnStartDate = undefined
        }

        setState(state => {
            return {
                ...state,
                startDate: value,
                errorOnStartingDate: errorOnStartingDate,
                errorOnStartDate: errorOnStartDate === translate('human_resource.profile.starting_date_required') ? undefined : errorOnStartDate
            }
        })
        props.handleChange("startDate", value);
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-add-employee-package" isLoading={employeesManager.isLoading}
                formID="form-create-employee"
                title={translate('human_resource.profile.add_staff')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <div id={id} className="tab-pane active">
                    <div className="row box-body">

                        <div className="pull-right col-lg-12 col-md-12 col-sm-12">

                            <div className="row">
                                {/* Tên gói thầu */}
                                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errorOnName && "has-error"}`}>
                                    <label>Tên gói thầu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="name" value={name ? name : ''} placeholder="Tên gói thầu" onChange={handleBiddingPackageName} />
                                    <ErrorLabel content={errorOnName} />
                                </div>
                                {/* Mã gói thầu */}
                                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12`}>
                                    <label htmlFor="MGT">Mã gói thầu</label>
                                    <input type="text" className="form-control" placeholder="Mã gói thầu" name="code" value={code ? code : ''} onChange={handleChangeCode} autoComplete="off" />
                                </div>
                            </div>
                            <div className="row">
                                {/* Thời gian bắt đầu */}
                                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 `}>
                                    <label >Thời gian bắt đầu</label>
                                    <DatePicker
                                        id={`startDate${id}`}
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                    />
                                </div>
                                {/* Thời gian kết thúc */}
                                <div className={`form-group col-lg-6 col-md-6 col-ms-12 col-xs-12 `}>
                                    <label >Thời gian kết thúc</label>
                                    <DatePicker
                                        id={`endDate${id}`}
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                {/* Loại gói thầu */}
                                <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                    <label>Loại gói thầu</label>
                                    <SelectBox
                                        id={`type${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={type}
                                        items={[
                                            { value: 1, text: 'Gói thầu tư vấn' },
                                            { value: 2, text: 'Gói thầu phi tư vấn' },
                                            { value: 3, text: 'Gói thầu hàng hóa' },
                                            { value: 4, text: 'Gói thầu xây lắp' },
                                            { value: 5, text: 'Gói thầu hỗn hợp' },
                                        ]}
                                        onChange={handleChangeType}
                                    />
                                </div>
                                {/* Trạng thái */}
                                <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                                    <label>Trạng thái</label>
                                    <SelectBox
                                        id={`status${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={status}
                                        items={[
                                            { value: 1, text: 'Hoạt động' },
                                            { value: 0, text: 'Đã hủy' },
                                            { value: 2, text: 'Hoàn thành' },
                                        ]}
                                        onChange={handleChangeStatus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-ms-12 col-xs-12">
                            <div className="row">
                                {/* Mô tả */}
                                <div className={`form-group col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                                    <label htmlFor="emailCompany">Mô tả</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={handleDescription} placeholder="Enter ..." autoComplete="off" ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
        
    );
};

const  mapState = state => state;

const actionCreators = {};

const searchEmployeeByCareerPositionTab = connect(mapState, actionCreators)(withTranslate(SearchEmployeeByCareerPositionTab));
export { searchEmployeeByCareerPositionTab as SearchEmployeeByCareerPositionTab };