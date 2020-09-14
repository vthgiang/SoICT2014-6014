import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { EmployeeImportTab } from './combinedContent';
import { DialogModal } from '../../../../../common-components';

import {
    configurationEmployee,
} from './fileConfigurationImportEmployee';

import { EmployeeManagerActions } from '../redux/actions';

class EmployeeImportForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Function chuyển dữ liệu date trong excel thành dạng dd-mm-yyyy
     * @param {*} serial :số serial của ngày
     */
    convertExcelDateToJSDate = (serial) => {
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
    convertStringToDate = (data, monthYear = false) => {
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

    /**
     * Function kiểm dữ liệu import thông tin cơ bản của nhân viên
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfEmployeeInfor = (value) => {
        value = value.map(x => {
            let birthdate = typeof x.birthdate === 'string' ? x.birthdate : this.convertExcelDateToJSDate(x.birthdate);
            let identityCardDate = typeof x.identityCardDate === 'string' ? x.identityCardDate : this.convertExcelDateToJSDate(x.identityCardDate);
            let startingDate = typeof x.startingDate === 'string' ? x.startingDate : this.convertExcelDateToJSDate(x.startingDate);
            let leavingDate = typeof x.leavingDate === 'string' ? x.leavingDate : this.convertExcelDateToJSDate(x.leavingDate);
            let taxDateOfIssue = typeof x.taxDateOfIssue === 'string' ? x.taxDateOfIssue : this.convertExcelDateToJSDate(x.taxDateOfIssue);
            let healthInsuranceStartDate = typeof x.healthInsuranceStartDate === 'string' ? x.healthInsuranceStartDate : this.convertExcelDateToJSDate(x.healthInsuranceStartDate);
            let healthInsuranceEndDate = typeof x.healthInsuranceEndDate === 'string' ? x.healthInsuranceEndDate : this.convertExcelDateToJSDate(x.healthInsuranceEndDate);
            let gender = (x.gender === "Nam" || x.gender.toLowerCase() === "male") ? "male" : "female";
            console.log(x.status);
            let maritalStatus = (x.maritalStatus === "Độc thân" || x.maritalStatus.toLowerCase() === "single") ? "single" : "married";
            let professionalSkill;
            let status = (x.status === "Đang làm việc" || x.status.toLowerCase() === "active") ? "active" : "leave";
            switch (x.professionalSkill) {
                case "Trung cấp":
                    professionalSkill = "intermediate_degree";
                    break;
                case "Cao đẳng":
                    professionalSkill = "colleges";
                    break;
                case "Đại học":
                    professionalSkill = "university";
                    break;
                case "Thạc sĩ":
                    professionalSkill = "master_degree";
                    break;
                case "Tiến sĩ":
                    professionalSkill = "phd";
                    break;
                case "Không có":
                    professionalSkill = "unavailable";
                    break;
                default:
                    professionalSkill = "unavailable";
            }
            return {
                ...x,
                birthdate: this.convertStringToDate(birthdate, false),
                identityCardDate: this.convertStringToDate(identityCardDate, false),
                startingDate: this.convertStringToDate(startingDate, false),
                leavingDate: this.convertStringToDate(leavingDate, false),
                taxDateOfIssue: this.convertStringToDate(taxDateOfIssue, false),
                healthInsuranceStartDate: this.convertStringToDate(healthInsuranceStartDate, false),
                healthInsuranceEndDate: this.convertStringToDate(healthInsuranceEndDate, false),
                gender: gender,
                maritalStatus: maritalStatus,
                professionalSkill: professionalSkill,
                status: status
            };
        })

        // Check dữ liệu import có hợp lệ hay không
        let checkImportData = value, rowError = [];
        value = value.map((x, index) => {
            let errorAlert = [];
            if (x.employeeNumber === null || x.fullName === null || x.emailInCompany === null || x.employeeTimesheetId === null
                || x.birthdate === null || x.identityCardNumber === null || x.identityCardDate === null || x.identityCardAddress === null
                || x.phoneNumber === null || x.temporaryResidence === null || x.taxDateOfIssue === null || x.taxNumber === null
                || x.taxRepresentative === null || x.taxAuthority === null || checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1
                || checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1
                || checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1) {
                rowError = [...rowError, index + 1]
                x = { ...x, error: true }
            }
            if (x.employeeNumber === null) {
                errorAlert = [...errorAlert, 'employee_number_required'];
            } else {
                if (checkImportData.filter(y => y.employeeNumber === x.employeeNumber).length > 1)
                    errorAlert = [...errorAlert, 'employee_number_have_exist'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            }
            if (x.emailInCompany === null) {
                errorAlert = [...errorAlert, 'email_in_company_required'];
            } else {
                if (checkImportData.filter(y => y.emailInCompany === x.emailInCompany).length > 1)
                    errorAlert = [...errorAlert, 'email_in_company_have_exist'];
            };
            if (x.employeeTimesheetId === null) {
                errorAlert = [...errorAlert, 'employee_timesheet_id_required'];
            } else {
                if (checkImportData.filter(y => y.employeeTimesheetId === x.employeeTimesheetId).length > 1)
                    errorAlert = [...errorAlert, 'employee_timesheet_id_have_exist'];
            };
            if (x.birthdate === null) {
                errorAlert = [...errorAlert, 'birthdate_required'];
            }
            if (x.identityCardNumber === null) {
                errorAlert = [...errorAlert, 'identity_card_number_required'];
            }
            if (x.identityCardDate === null) {
                errorAlert = [...errorAlert, 'identity_card_date_required'];
            }
            if (x.identityCardAddress === null) {
                errorAlert = [...errorAlert, 'identity_card_address_required'];
            }
            if (x.phoneNumber === null) {
                errorAlert = [...errorAlert, 'phone_number_required'];
            }
            if (x.temporaryResidence === null) {
                errorAlert = [...errorAlert, 'temporary_residence_required'];
            }
            if (x.taxDateOfIssue === null) {
                errorAlert = [...errorAlert, 'tax_date_of_issue_required'];
            }
            if (x.taxNumber === null) {
                errorAlert = [...errorAlert, 'tax_number_required'];
            }
            if (x.taxRepresentative === null) {
                errorAlert = [...errorAlert, 'tax_representative_required'];
            }
            if (x.taxAuthority === null) {
                errorAlert = [...errorAlert, 'tax_authority_required'];
            }
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfEmployeeInfor: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import kinh nghiệm làm việc
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfExperience = (value) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, true),
                endDate: this.convertStringToDate(endDate, true),
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, 'start_date_required'];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, 'end_date_required'];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, 'company_required'];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, 'position_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfExperience: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import thông tin bằng cấp
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfDegree = (value) => {
        value = value.map(x => {
            let degreeType;
            switch (x.degreeType) {
                case "Xuất sắc":
                    degreeType = "excellent";
                    break;
                case "Giỏi":
                    degreeType = "very_good";
                    break;
                case "Khá":
                    degreeType = "good";
                    break;
                case "Trung bình khá":
                    degreeType = "average_good";
                    break;
                case "Trung bình":
                    degreeType = "ordinary";
                    break;
                default:
                    degreeType = null;
            }
            return { ...x, degreeType: degreeType }
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, 'name_required'];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, 'issuedBy_required'];
            };
            if (x.year === null) {
                errorAlert = [...errorAlert, 'year_required'];
            };
            if (x.degreeType === null) {
                errorAlert = [...errorAlert, 'degreeType_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfDegree: value,
        })
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import thông tin chứng chỉ
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfCertificate = (value) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, false),
                endDate: this.convertStringToDate(endDate, false),
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, 'name_required'];
            };
            if (x.issuedBy === null) {
                errorAlert = [...errorAlert, 'issued_by_required'];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, 'start_date_required'];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, 'end_date_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfCertificate: value,
        })
        return { importData: value, rowError: rowError }

    }

    /**
     * Function kiểm dữ liệu import hợp đồng lao động
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfContract = (value) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, false),
                endDate: this.convertStringToDate(endDate, false),
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, 'name_required'];
            };
            if (x.contractType === null) {
                errorAlert = [...errorAlert, 'contract_type_required'];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, 'start_date_required'];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, 'end_date_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfContract: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import kinh nghiệm làm việc
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfSocialInsuranceDetails = (value) => {
        value = value.map(x => {
            let startDate = typeof x.startDate === 'string' ? x.startDate : this.convertExcelDateToJSDate(x.startDate);
            let endDate = typeof x.endDate === 'string' ? x.endDate : this.convertExcelDateToJSDate(x.endDate);
            return {
                ...x,
                startDate: this.convertStringToDate(startDate, true),
                endDate: this.convertStringToDate(endDate, true),
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.startDate === null) {
                errorAlert = [...errorAlert, 'start_date_required'];
            };
            if (x.endDate === null) {
                errorAlert = [...errorAlert, 'end_date_required'];
            };
            if (x.company === null) {
                errorAlert = [...errorAlert, 'company_required'];
            };
            if (x.position === null) {
                errorAlert = [...errorAlert, 'position_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfSocialInsuranceDetails: value,
        })
        return { importData: value, rowError: rowError }
    }

    /**
     * Function kiểm dữ liệu import tài liệu đính kèm
     * @param {*} value : dữ liệu cần import
     */
    handleCheckImportDataOfFile = (value) => {
        value = value.map(x => {
            let status;
            switch (x.status) {
                case "Đã nộp":
                    status = 'submitted';
                    break;
                case "Chưa nộp":
                    status = 'no_submitted';
                    break;
                case "Đã trả lại":
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
                errorAlert = [...errorAlert, 'employee_number_required'];
            };
            if (x.fullName === null) {
                errorAlert = [...errorAlert, 'full_name_required'];
            };
            if (x.name === null) {
                errorAlert = [...errorAlert, 'name_required'];
            };
            if (x.description === null) {
                errorAlert = [...errorAlert, 'description_required'];
            };
            if (x.number === null) {
                errorAlert = [...errorAlert, 'number_required'];
            };
            if (x.status === null) {
                errorAlert = [...errorAlert, 'status_required'];
            };
            x = { ...x, errorAlert: errorAlert }
            return x;
        });
        this.setState({
            importDataOfFile: value,
        })
        return { importData: value, rowError: rowError }
    }



    /**
     * Function bắt sự kiện import thông tin cơ bản của nhân viên
     */
    handleImportEmployeeInfor = () => {
        let { importDataOfEmployeeInfor } = this.state;
        this.props.importEmployees({ importType: "Employee_Infor", importData: importDataOfEmployeeInfor });
    }

    /**
    * Function bắt sự kiện import kinh nghiệm làm việc
    */
    handleImportExperience = () => {
        let { importDataOfExperience } = this.state;
        this.props.importEmployees({ importType: "Experience", importData: importDataOfExperience });
    }

    /**
    * Function bắt sự kiện import thông tin bằng cấp
    */
    handleImportDegree = () => {
        let { importDataOfDegree } = this.state;
        this.props.importEmployees({ importType: "Degree", importData: importDataOfDegree });
    }

    /**
    * Function bắt sự kiện import thông tin chứng chỉ
    */
    handleImportCertificate = () => {
        let { importDataOfCertificate } = this.state;
        this.props.importEmployees({ importType: "Certificate", importData: importDataOfCertificate });
    }

    /**
    * Function bắt sự kiện import hợp đồng lao động
    */
    handleImportConstract = () => {
        let { importDataOfContract } = this.state;
        this.props.importEmployees({ importType: "Contract", importData: importDataOfContract });
    }

    /**
   * Function bắt sự kiện import kinh nghiệm làm việc
   */
    handleImportSocialInsuranceDetails = () => {
        let { importDataOfSocialInsuranceDetails } = this.state;
        this.props.importEmployees({ importType: "SocialInsuranceDetails", importData: importDataOfSocialInsuranceDetails });
    }

    /**
    * Function bắt sự kiện import Tài liệ đính kèm
    */
    handleImportFile = () => {
        let { importDataOfFile } = this.state;
        this.props.importEmployees({ importType: "File", importData: importDataOfFile });
    }


    render() {
        const { employeesManager, translate } = this.props;
        let configurationEmployeeInfo = configurationEmployee.configurationEmployeeInfo(translate),
            configurationExperience = configurationEmployee.configurationExperience(translate),
            configurationSocialInsuranceDetails = configurationEmployee.configurationSocialInsuranceDetails(translate),
            configurationDegree = configurationEmployee.configurationDegree(translate),
            configurationCertificate = configurationEmployee.configurationCertificate(translate),
            configurationContract = configurationEmployee.configurationContract(translate),
            configurationFile = configurationEmployee.configurationFile(translate);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal_import_file`} isLoading={false}
                    formID={`form_import_file`}
                    title='Thêm dữ liệu bằng việc Import file excel'
                    hasSaveButton={false}
                    hasNote={false}
                    size={75}
                >
                    <form className="form-group" id={`form_import_file`}>
                        <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                            <ul className="nav nav-tabs">
                                <li className="active"><a title="Import thông tin nhân viên" data-toggle="tab" href="#import_employee_general_infor">Thông tin cơ bản</a></li>
                                <li><a title="Import kinh nghiệm làm việc" data-toggle="tab" href="#import_employee_experience">Kinh nghiệm làm việc</a></li>
                                <li><a title="Import thông tin bằng cấp" data-toggle="tab" href="#import_employee_degree">Bằng cấp</a></li>
                                <li><a title="Import thông tin chứng chỉ" data-toggle="tab" href="#import_employee_certificate">Chứng chỉ</a></li>
                                <li><a title="Import hợp đồng lao động" data-toggle="tab" href="#import_employee_contract">Hợp đồng lao động</a></li>
                                <li><a title="Import quá trình đóng bảo hiểm xã hội" data-toggle="tab" href="#import_employee_socialInsurance_details">Bảo hiểm xã hội</a></li>
                                <li><a title="Import tài liệu đính kèm" data-toggle="tab" href="#import_employee_file">Tài liệu đính kèm</a></li>

                            </ul>
                            < div className="tab-content">
                                <EmployeeImportTab
                                    id="import_employee_general_infor"
                                    className="tab-pane active"
                                    textareaRow={12}
                                    configTableWidth={8000}
                                    showTableWidth={5000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfEmployeeInfor}
                                    dataOfReducer={employeesManager.error.employeesInfor}
                                    configuration={configurationEmployeeInfo}
                                    handleCheckImportData={this.handleCheckImportDataOfEmployeeInfor}
                                    handleImport={this.handleImportEmployeeInfor}
                                />
                                <EmployeeImportTab
                                    id="import_employee_experience"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfExperience}
                                    dataOfReducer={employeesManager.error.experiences}
                                    configuration={configurationExperience}
                                    handleCheckImportData={this.handleCheckImportDataOfExperience}
                                    handleImport={this.handleImportExperience}
                                />
                                <EmployeeImportTab
                                    id="import_employee_degree"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfDegree}
                                    dataOfReducer={employeesManager.error.degrees}
                                    configuration={configurationDegree}
                                    handleCheckImportData={this.handleCheckImportDataOfDegree}
                                    handleImport={this.handleImportDegree}
                                />
                                <EmployeeImportTab
                                    id="import_employee_certificate"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfCertificate}
                                    dataOfReducer={employeesManager.error.certificates}
                                    configuration={configurationCertificate}
                                    handleCheckImportData={this.handleCheckImportDataOfCertificate}
                                    handleImport={this.handleImportCertificate}
                                />
                                <EmployeeImportTab
                                    id="import_employee_contract"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfContract}
                                    dataOfReducer={employeesManager.error.contracts}
                                    configuration={configurationContract}
                                    handleCheckImportData={this.handleCheckImportDataOfContract}
                                    handleImport={this.handleImportConstract}
                                />
                                <EmployeeImportTab
                                    id="import_employee_socialInsurance_details"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfSocialInsuranceDetails}
                                    dataOfReducer={employeesManager.error.SocialInsuranceDetails}
                                    configuration={configurationSocialInsuranceDetails}
                                    handleCheckImportData={this.handleCheckImportDataOfSocialInsuranceDetails}
                                    handleImport={this.handleImportSocialInsuranceDetails}
                                />

                                <EmployeeImportTab
                                    id="import_employee_file"
                                    textareaRow={10}
                                    configTableWidth={1000}
                                    showTableWidth={1000}
                                    rowErrorOfReducer={employeesManager.error.rowErrorOfFile}
                                    dataOfReducer={employeesManager.error.files}
                                    configuration={configurationFile}
                                    handleCheckImportData={this.handleCheckImportDataOfFile}
                                    handleImport={this.handleImportFile}
                                />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
};

const actionCreators = {
    importEmployees: EmployeeManagerActions.importEmployees,
};

const importExcel = connect(mapState, actionCreators)(withTranslate(EmployeeImportForm));
export { importExcel as EmployeeImportForm };