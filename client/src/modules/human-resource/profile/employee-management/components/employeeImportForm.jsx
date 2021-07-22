import React, { Component, useState, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';
import { EmployeeImportTab } from './combinedContent';
import { DialogModal, Loading } from '../../../../../common-components';
import { FieldsActions } from '../../../field/redux/actions';
import {
    configurationEmployee,
} from './fileConfigurationImportEmployee';

import { EmployeeManagerActions } from '../redux/actions';

const EmployeeImportForm = (props) => {
    const [state, setState] = useState({})

    const toastId = useRef(null);

    /**
    * Function hiển thị thông báo khi đang import dữ liệu
    */
    const notify = () => {
        toastId.current = toast.warn(
            <div>
                <ServerResponseAlert
                    type="warning"
                    title={'general.warning'}
                    content={[
                        translate(
                            'human_resource.profile.employee_management.importing_employee',
                        ),
                    ]}
                />
                <Loading />
            </div>,
            {
                containerId: 'toast-notification',
                hideProgressBar: true,
                autoClose: false
            }
        )
    }

    useLayoutEffect(() => {
        if (!props.employeesManager.isLoading && toastId.current) toast.dismiss(toastId.current);
    }, [props.employeesManager.isLoading])

    /**
     * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial :số serial của ngày
     */
    const convertExcelDateToJSDate = (serial) => {
        let utc_days = Math.floor(serial - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);
        let month = date_info.getMonth() + 1;
        let day = date_info.getDate();
        if (month.toString().length < 2)
            month = '0' + month;
        if (day.toString().length < 2)
            day = '0' + day;
        return [day, month, date_info.getFullYear()].join('-');
    }

    /**
     * Hàm tiện ích dùng cho các function bên dưới
     * Function chuyển String(dd-mm-yyyy) sang date
     * @param {*} data 
     */
    const convertStringToDate = (data, monthYear = false) => {
        if (data) {
            data = data.split('-');
            let date;
            if (monthYear) {
                date = [data[1], data[0]];
            } else {
                date = [data[2], data[1], data[0]];
            }
            return date.join('-');
        } else {
            return data;
        }

    }

    const _convertRoleNameToId = (name) => {
        const { role } = props;
        let roles = role?.list;
        let roleFilter = roles && roles.filter(r => r.name.toLowerCase() === name.toLowerCase());

        return roleFilter.length > 0 ? roleFilter[0]._id : null;
    }

    /**
     * Function kiểm dữ liệu import thông tin cơ bản của nhân viên
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfEmployeeInfor = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let birthdate = (!x.birthdate || typeof x.birthdate === 'string') ? x.birthdate : convertExcelDateToJSDate(x.birthdate);
            let identityCardDate = (!x.identityCardDate || typeof x.identityCardDate === 'string') ? x.identityCardDate : convertExcelDateToJSDate(x.identityCardDate);
            let startingDate = (!x.startingDate || typeof x.startingDate === 'string') ? x.startingDate : convertExcelDateToJSDate(x.startingDate);
            let leavingDate = (!x.leavingDate || typeof x.leavingDate === 'string') ? x.leavingDate : convertExcelDateToJSDate(x.leavingDate);
            let taxDateOfIssue = (!x.taxDateOfIssue || typeof x.taxDateOfIssue === 'string') ? x.taxDateOfIssue : convertExcelDateToJSDate(x.taxDateOfIssue);
            let healthInsuranceStartDate = (!x.healthInsuranceStartDate || typeof x.healthInsuranceStartDate === 'string') ? x.healthInsuranceStartDate : convertExcelDateToJSDate(x.healthInsuranceStartDate);
            let healthInsuranceEndDate = (!x.healthInsuranceEndDate || typeof x.healthInsuranceEndDate === 'string') ? x.healthInsuranceEndDate : convertExcelDateToJSDate(x.healthInsuranceEndDate);

            let gender = x?.gender?.trim() === translate('human_resource.profile.male') ? "male" : "female";
            let maritalStatus = x.maritalStatus ? x.maritalStatus.trim() === translate('human_resource.profile.single') ? "single" : "married" : null;
            let professionalSkill, educationalLevel, status;
            switch (x?.status?.trim()) {
                case translate('human_resource.profile.leave'):
                    status = "leave";
                    break;
                case translate('human_resource.profile.maternity_leave'):
                    status = "maternity_leave";
                    break;
                case translate('human_resource.profile.unpaid_leave'):
                    status = "unpaid_leave";
                    break;
                case translate('human_resource.profile.probationary'):
                    status = "probationary";
                    break;
                case translate('human_resource.profile.sick_leave'):
                    status = "sick_leave";
                    break;

                default:
                    status = "active";
            };
            switch (x?.professionalSkill?.trim()) {
                case translate('human_resource.profile.intermediate_degree'):
                    professionalSkill = "intermediate_degree";
                    break;
                case translate('human_resource.profile.colleges'):
                    professionalSkill = "colleges";
                    break;
                case translate('human_resource.profile.university'):
                    professionalSkill = "university";
                    break;
                case translate('human_resource.profile.master_degree'):
                    professionalSkill = "master_degree";
                    break;
                case translate('human_resource.profile.phd'):
                    professionalSkill = "phd";
                    break;
                case translate('human_resource.profile.unavailable'):
                    professionalSkill = "unavailable";
                    break;
                default:
                    professionalSkill = "unavailable";
            };

            switch (x?.educationalLevel?.trim()) {
                case '12/12':
                    educationalLevel = '12/12';
                    break;
                case '11/12':
                    educationalLevel = '11/12';
                    break;
                case '10/12':
                    educationalLevel = '10/12';
                    break;
                case '9/12':
                    educationalLevel = '9/12';
                    break;
                default:
                    educationalLevel = "12/12";
            };
            return {
                ...x,
                employeeNumber: x?.employeeNumber?.trim(),
                employeeTimesheetId: x?.employeeTimesheetId?.trim(),
                fullName: x?.fullName?.trim(),
                emailInCompany: x?.emailInCompany?.trim(),
                birthdate: convertStringToDate(birthdate, false),
                identityCardDate: convertStringToDate(identityCardDate, false),
                startingDate: convertStringToDate(startingDate, false),
                leavingDate: convertStringToDate(leavingDate, false),
                taxDateOfIssue: convertStringToDate(taxDateOfIssue, false),
                healthInsuranceStartDate: convertStringToDate(healthInsuranceStartDate, false),
                healthInsuranceEndDate: convertStringToDate(healthInsuranceEndDate, false),
                gender: gender,
                maritalStatus: maritalStatus,
                educationalLevel: educationalLevel,
                professionalSkill: professionalSkill,
                status: status,
                houseHold: {
                    headHouseHoldName: x.headHouseHoldName,
                    documentType: x.documentType,
                    houseHoldNumber: x.houseHoldNumber,
                    city: x.city,
                    district: x.district,
                    ward: x.ward,
                    houseHoldAddress: x.houseHoldAddress,
                    phone: x.phone,
                    houseHoldCode: x.houseHoldCode,
                }
            };
        })

        // Check dữ liệu import có hợp lệ hay không
        let checkImportData = value, rowError = [];
        value = value.map((x, index) => {
            let positionId;
            if (x.position) {
                positionId = x.position.split(",");
                positionId = positionId.map(o => _convertRoleNameToId(o.trim()));
            }

            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1
                || (x.emailInCompany && checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1)
                || (x.employeeTimesheetId && checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1)) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            } else {
                if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                    errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.value_duplicate')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            }
            if (x.emailInCompany && checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.email_company')} ${translate('human_resource.value_duplicate')}`];
            }
            if (x.employeeTimesheetId && checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.attendance_code')} ${translate('human_resource.value_duplicate')}`];
            }
            x = { ...x, errorAlert: errorAlert };

            if (positionId && positionId.length > 0) {
                x = { ...x, positionId: positionId }
            }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfEmployeeInfor: value
        }))
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import kinh nghiệm làm việc
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfExperience = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: convertStringToDate(startDate, true),
                endDate: convertStringToDate(endDate, true),
            }
        });

        // Check dữ liệu import có hợp lệ hay không
        let rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.startDate === null || x.endDate === null
                || x.company === null || x.position === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.from_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.to_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.unit')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.position')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfExperience: value
        }))
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import thông tin bằng cấp
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfDegree = (value) => {
        const { translate, field } = props;
        const listFields = field.listFields
        value = value.map(x => {
            let degreeType;
            switch (x.degreeType) {
                case translate('human_resource.profile.excellent'):
                    degreeType = "excellent";
                    break;
                case translate('human_resource.profile.very_good'):
                    degreeType = "very_good";
                    break;
                case translate('human_resource.profile.good'):
                    degreeType = "good";
                    break;
                case translate('human_resource.profile.average_good'):
                    degreeType = "average_good";
                    break;
                case translate('human_resource.profile.ordinary'):
                    degreeType = "ordinary";
                    break;
                default:
                    degreeType = null;
            }
            let find = listFields.find(field => field.name === x.field)

            return { ...x, degreeType: degreeType, field: find ? find._id : null }
        })


        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.issuedBy === null
                || x.year === null || x.degreeType === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_diploma')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.diploma_issued_by')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.year === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.graduation_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.degreeType === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.ranking_learning')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfDegree: value
        }))
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import thông tin chứng chỉ
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfCertificate = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: convertStringToDate(startDate, false),
                endDate: convertStringToDate(endDate, false),
            }
        });

        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.issuedBy === null
                || x.startDate === null || x.endDate === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_certificate')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.issued_by')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.date_issued')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfCertificate: value
        }))
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import hợp đồng lao động
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfContract = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: convertStringToDate(startDate, false),
                endDate: convertStringToDate(endDate, false),
            }
        });

        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.contractType === null
                || x.startDate === null || x.endDate === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.name_contract')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.contractType === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.type_contract')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.start_date')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfContract: value
        }))
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import quá trình đóng bảo hiểm
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfSocialInsuranceDetails = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let startDate = (!x.startDate || typeof x.startDate === 'string') ? x.startDate : convertExcelDateToJSDate(x.startDate);
            let endDate = (!x.endDate || typeof x.endDate === 'string') ? x.endDate : convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: convertStringToDate(startDate, true),
                endDate: convertStringToDate(endDate, true),
            }
        });

        // Check dữ liệu import có hợp lệ hay không
        let rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.startDate === null || x.endDate === null
                || x.company === null || x.position === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.from_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.to_month_year')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.unit')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.position')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfSocialInsuranceDetails: value
        }))
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import tài liệu đính kèm
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfFile = (value) => {
        const { translate } = props;

        value = value.map(x => {
            let status;
            switch (x.status) {
                case translate('human_resource.profile.submitted'):
                    status = 'submitted';
                    break;
                case translate('human_resource.profile.not_submitted_yet'):
                    status = 'not_submitted_yet';
                    break;
                case translate('human_resource.profile.returned'):
                    status = 'returned';
                    break;
                default:
                    status = null;
            };
            return { ...x, status: status };
        })
        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.name === null || x.description === null
                || x.number === null || x.status === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.full_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.file_name')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.description === null) {
                errorAlert = [...errorAlert, `${translate('general.description')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.number === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.number')} ${translate('human_resource.cannot_be_empty')}`];
            };
            if (x.status === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.status')} ${translate('human_resource.cannot_be_empty')}`];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfFile: value
        }))
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import thông tin thành viên hộ gia đình
     * @param {*} value : dữ liệu cần import
     */
    const handleCheckImportDataOfFamily = (value) => {
        const { translate } = props;
        value = value.map(x => {
            let isHeadHousehold = x.isHeadHousehold ? 'yes' : 'no'
            let gender = x.gender === translate('human_resource.profile.male') ? "male" : "female";
            return {
                ...x,
                gender,
                isHeadHousehold,
            }
        })
        let rowError = [];
        // Check dữ liệu import có hợp lệ hay không
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null, x.name === null) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.staff_number')} ${translate('human_resource.cannot_be_empty')}`];
            };

            if (x.name === null) {
                errorAlert = [...errorAlert, `${translate('human_resource.profile.house_hold.members.name_member')} ${translate('human_resource.cannot_be_empty')}`];
            };

            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        setState(state => ({
            ...state,
            importDataOfFamily: value
        }))
        return { importData: value, rowError: rowError }
    }



    /**
     * Function bắt sự kiện import thông tin cơ bản của nhân viên
     */
    const handleImportEmployeeInfor = () => {
        let { importDataOfEmployeeInfor } = state;
        notify();
        props.importEmployees({ importType: "Employee_Infor", importData: importDataOfEmployeeInfor });
    }

    const handleImportUpdateEmployeeInfor = () => {
        let { importDataOfEmployeeInfor } = state;
        notify();
        props.importEmployees({ importType: "Update_Employee_Infor", importData: importDataOfEmployeeInfor });
    }

    /**
    * Function bắt sự kiện import kinh nghiệm làm việc
    */
    const handleImportExperience = () => {
        let { importDataOfExperience } = state;
        notify();
        props.importEmployees({ importType: "Experience", importData: importDataOfExperience });
    }

    /**
    * Function bắt sự kiện import thông tin bằng cấp
    */
    const handleImportDegree = () => {
        let { importDataOfDegree } = state;
        notify();
        props.importEmployees({ importType: "Degree", importData: importDataOfDegree });
    }

    /**
    * Function bắt sự kiện import thông tin chứng chỉ
    */
    const handleImportCertificate = () => {
        let { importDataOfCertificate } = state;
        notify();
        props.importEmployees({ importType: "Certificate", importData: importDataOfCertificate });
    }

    /**
    * Function bắt sự kiện import hợp đồng lao động
    */
    const handleImportConstract = () => {
        let { importDataOfContract } = state;
        notify();
        props.importEmployees({ importType: "Contract", importData: importDataOfContract });
    }

    /**
   * Function bắt sự kiện import quá trình đóng bảo hiểm
   */
    const handleImportSocialInsuranceDetails = () => {
        let { importDataOfSocialInsuranceDetails } = state;
        props.importEmployees({ importType: "SocialInsuranceDetails", importData: importDataOfSocialInsuranceDetails });
    }

    /**
    * Function bắt sự kiện import Tài liệu đính kèm
    */
    const handleImportFile = () => {
        let { importDataOfFile } = state;
        notify();
        props.importEmployees({ importType: "File", importData: importDataOfFile });
    }

    /**
    * Function bắt sự kiện import thành viên hộ gia đình
    */
    const handleFamilyMembers = () => {
        let { importDataOfFamily } = state;
        notify();
        props.importEmployees({ importType: "FamilyMembers", importData: importDataOfFamily });
    }


    const { employeesManager, translate, field } = props;
    let configurationEmployeeInfo = configurationEmployee.configurationEmployeeInfo(translate),
        configurationExperience = configurationEmployee.configurationExperience(translate),
        configurationSocialInsuranceDetails = configurationEmployee.configurationSocialInsuranceDetails(translate),
        configurationDegree = configurationEmployee.configurationDegree(translate),
        configurationCertificate = configurationEmployee.configurationCertificate(translate),
        configurationContract = configurationEmployee.configurationContract(translate),
        configurationFile = configurationEmployee.configurationFile(translate),
        configurationFamilyMembers = configurationEmployee.configurationFamilyMembers(translate),
        teamplateImport = configurationEmployee.templateImport(translate);
    let listFields = field.listFields
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal_import_file`} isLoading={false}
                formID={`form_import_file`}
                title={translate('human_resource.add_data_by_excel')}
                hasSaveButton={false}
                hasNote={false}
                size={75}
            >
                <form className="form-group" id={`form_import_file`}>
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate(`human_resource.profile.employee_management.import.import_general_infor_title`)} data-toggle="tab" href="#import_employee_general_infor">{translate(`human_resource.profile.employee_management.import.import_general_infor`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_experience_title`)} data-toggle="tab" href="#import_employee_experience">{translate(`human_resource.profile.employee_management.import.import_experience`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_degree_title`)} data-toggle="tab" href="#import_employee_degree">{translate(`human_resource.profile.employee_management.import.import_degree`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_certificate_title`)} data-toggle="tab" href="#import_employee_certificate">{translate(`human_resource.profile.employee_management.import.import_certificate`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_contract_title`)} data-toggle="tab" href="#import_employee_contract">{translate(`human_resource.profile.employee_management.import.import_contract`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_socialInsurance_details_title`)} data-toggle="tab" href="#import_employee_socialInsurance_details">{translate(`human_resource.profile.employee_management.import.import_socialInsurance_details`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_file_title`)} data-toggle="tab" href="#import_employee_file">{translate(`human_resource.profile.employee_management.import.import_file`)}</a></li>
                            <li><a title={translate(`human_resource.profile.employee_management.import.import_file_family`)} data-toggle="tab" href="#import_employee_family">{translate(`human_resource.profile.employee_management.import.import_family`)}</a></li>

                        </ul>
                        < div className="tab-content">
                            <EmployeeImportTab
                                id="import_employee_general_infor"
                                className="tab-pane active"
                                textareaRow={12}
                                configTableWidth={8000}
                                showTableWidth={5000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfEmployeeInfor}
                                dataOfReducer={employeesManager?.error?.employeesInfor}
                                configuration={configurationEmployeeInfo}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfEmployeeInfor}
                                handleImport={handleImportEmployeeInfor}
                                handleImportUpdate={handleImportUpdateEmployeeInfor}
                            />
                            <EmployeeImportTab
                                id="import_employee_experience"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfExperience}
                                dataOfReducer={employeesManager?.error?.experiences}
                                configuration={configurationExperience}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfExperience}
                                handleImport={handleImportExperience}
                            />
                            <EmployeeImportTab
                                id="import_employee_degree"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                fil
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfDegree}
                                dataOfReducer={employeesManager?.error?.degrees}
                                configuration={configurationDegree}
                                teamplateImport={teamplateImport}
                                listFields={listFields}
                                handleCheckImportData={handleCheckImportDataOfDegree}
                                handleImport={handleImportDegree}
                            />
                            <EmployeeImportTab
                                id="import_employee_certificate"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfCertificate}
                                dataOfReducer={employeesManager?.error?.certificates}
                                configuration={configurationCertificate}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfCertificate}
                                handleImport={handleImportCertificate}
                            />
                            <EmployeeImportTab
                                id="import_employee_contract"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfContract}
                                dataOfReducer={employeesManager?.error?.contracts}
                                configuration={configurationContract}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfContract}
                                handleImport={handleImportConstract}
                            />
                            <EmployeeImportTab
                                id="import_employee_socialInsurance_details"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfSocialInsuranceDetails}
                                dataOfReducer={employeesManager?.error?.SocialInsuranceDetails}
                                configuration={configurationSocialInsuranceDetails}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfSocialInsuranceDetails}
                                handleImport={handleImportSocialInsuranceDetails}
                            />

                            <EmployeeImportTab
                                id="import_employee_file"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfFile}
                                dataOfReducer={employeesManager?.error?.files}
                                configuration={configurationFile}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfFile}
                                handleImport={handleImportFile}
                            />

                            <EmployeeImportTab
                                id="import_employee_family"
                                textareaRow={10}
                                configTableWidth={1000}
                                showTableWidth={1000}
                                rowErrorOfReducer={employeesManager?.error?.rowErrorOfFile}
                                dataOfReducer={employeesManager?.error?.files}
                                configuration={configurationFamilyMembers}
                                teamplateImport={teamplateImport}
                                handleCheckImportData={handleCheckImportDataOfFamily}
                                handleImport={handleFamilyMembers}
                            />
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
    const { employeesManager, field, role } = state;
    return { employeesManager, field, role };
};

const actionCreators = {
    importEmployees: EmployeeManagerActions.importEmployees,
    getListFields: FieldsActions.getListFields,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(EmployeeImportForm));
export { importExcel as EmployeeImportForm };