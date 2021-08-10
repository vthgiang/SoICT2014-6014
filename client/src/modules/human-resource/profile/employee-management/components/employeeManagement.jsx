import React, { useEffect, useState, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, ConfirmNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { FieldsActions } from '../../../field/redux/actions';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

const EmployeeManagement = (props) => {

    let search = window.location.search.split('?')
    let keySearch = 'organizationalUnits';
    let _organizationalUnits = null;

    useEffect(() => {
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                _organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (_organizationalUnits !== 'null' && _organizationalUnits.trim() !== '') {
                    _organizationalUnits = _organizationalUnits.split(',')
                } else _organizationalUnits = null
                break;
            }
        }
    }, [search])

    const tableId = "table-employee-management";
    const defaultConfig = { limit: 10 }
    const _limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        tableId,
        position: null,
        gender: null,
        employeeName: null,
        employeeNumber: null,
        organizationalUnits: _organizationalUnits,
        status: ['active'],
        professionalSkills: null,
        careerFields: null,
        page: 0,
        limit: _limit,
        currentRow: {},
        currentRowView: {}
    });

    useEffect(() => {
        props.getListFields({ page: 0, limit: 10000 })
        props.getDepartment();
    }, [])

    useEffect(() => {
        props.getAllEmployee(state);
    }, [state.limit, state.page]);

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
            return date
        }
    }

    // Function bắt sự kiện thêm lương nhân viên bằng tay
    const createEmployee = () => {
        window.$('#modal-create-employee').modal({ backdrop: 'static', display: 'show' });
    }

    // Function bắt sự kiện thêm lương nhân viên bằng import file
    const _importEmployee = async () => {
        await setState(state => ({
            ...state,
            importEmployee: true
        }))
        window.$('#modal_import_file').modal('show');
    }

    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    const handleView = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRowView: value
            }
        });
        window.$(`#modal-detail-employee${value._id}`).modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    const handleEdit = async (value) => {
        await setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$(`#modal-edit-employee${value._id}`).modal('show');
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    const handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => ({
            ...state,
            organizationalUnits: value
        }))
    }

    /**
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id chức vụ
     */
    // 
    const handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => ({
            ...state,
            position: value
        }))
    }

    /**
     * Function lưu giá trị giới tính vào state khi thay đổi
     * @param {*} value : Giá trị giới tính
     */
    const handleGenderChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => ({
            ...state,
            gender: value
        }))
    }

    /**
     * Function lưu giá trị trạng thái vào state khi thay đổi
     * @param {*} value : Giá trị trạng thái
     */
    const handleStatusChange = (value) => {
        if (value.length === 0) {
            value = [""]
        };
        setState(state => ({
            ...state,
            status: value
        }))
    }

    /**
     * Function lưu giá trị chuyên môn vào state khi thay đổi
     * @param {*} value : Giá trị chuyên môn
     */
    const handleProfessionalSkillChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => ({
            ...state,
            professionalSkills: value
        }))
    };
    /**
     * Function lưu giá trị chuyên ngành vào state khi thay đổi
     * @param {*} value : Giá trị chuyên ngành
     */
    const handleCareerFieldChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState(state => ({
            ...state,
            careerFields: value
        }))
    }

    /**
     * Function lưu giá trị tháng sinh vào state khi thay đổi
     * @param {*} value : Giá trị tháng sinh
     */
    // 
    const handleBirthdateChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        setState(state => ({
            ...state,
            birthdate: value
        }))
    }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    const handleEndDateOfContractChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        setState(state => ({
            ...state,
            endDateOfContract: value
        }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => ({
            ...state,
            [name]: value
        }))
    }

    /** Function bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        props.getAllEmployee(state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    const setLimit = async (number) => {
        await setState(state => ({
            ...state,
            limit: parseInt(number),
        }))

    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (state.limit);
        await setState(state => ({
            ...state,
            page: parseInt(page)
        }))
    }

    const handleExportExcel = async () => {
        const { employeesManager } = props;
        let arrEmail = employeesManager.listEmployees.map(x => x.emailInCompany);
        await setState(state => ({
            ...state,
            exportDataStatus: 0
        }))
        await props.getAllEmployee({ exportData: true, arrEmail: arrEmail });
    }

    /**
     * Function chyển đổi dữ liệu thông tin nhân viên thành dạng dữ liệu dùng export
     * @param {*} data : Thông tin nhân viên
     */
    const convertDataToExportData = (data) => {
        const { department, translate } = props;
        let employeeInforSheet = data.map((x, index) => {
            let organizationalUnits = x.organizationalUnits.map(y => y.name);
            let position = x.roles.map(y => y.roleId.name);
            let employee = x.employees[0];
            return {
                STT: index + 1,
                employeeNumber: employee.employeeNumber,
                fullName: employee.fullName,
                organizationalUnits: organizationalUnits.join(', '),
                position: position.join(', '),
                birthdate: formatDate(employee.birthdate),
                gender: translate(`human_resource.profile.${employee.gender}`),
                employeeTimesheetId: employee.employeeTimesheetId,
                identityCardNumber: employee.identityCardNumber,
                identityCardDate: formatDate(employee.identityCardDate),
                identityCardAddress: employee.identityCardAddress,
                birthplace: employee.birthplace,
                permanentResidence: employee.permanentResidence,
                temporaryResidence: employee.temporaryResidence,
                maritalStatus: translate(`human_resource.profile.${employee.maritalStatus}`),
                status: translate(`human_resource.profile.${employee.status}`),
                startingDate: formatDate(employee.startingDate),
                leavingDate: formatDate(employee.leavingDate),
                emailInCompany: employee.emailInCompany,
                taxNumber: employee.taxNumber,
                taxRepresentative: employee.taxRepresentative,
                taxDateOfIssue: formatDate(employee.taxDateOfIssue),
                taxAuthority: employee.taxAuthority,
                ethnic: employee.ethnic,
                religion: employee.religion,
                nationality: employee.nationality,
                educationalLevel: employee.educationalLevel,
                foreignLanguage: employee.foreignLanguage,
                professionalSkill: translate(`human_resource.profile.${employee.professionalSkill}`),
                phoneNumber: employee.phoneNumber,
                phoneNumber2: employee.phoneNumber2,
                personalEmail: employee.personalEmail,
                personalEmail2: employee.personalEmail2,
                homePhone: employee.homePhone,
                emergencyContactPerson: employee.emergencyContactPerson,
                relationWithEmergencyContactPerson: employee.relationWithEmergencyContactPerson,
                emergencyContactPersonAddress: employee.emergencyContactPersonAddress,
                emergencyContactPersonPhoneNumber: employee.emergencyContactPersonPhoneNumber,
                emergencyContactPersonHomePhone: employee.emergencyContactPersonHomePhone,
                emergencyContactPersonEmail: employee.emergencyContactPersonEmail,
                atmNumber: employee.atmNumber,
                bankName: employee.bankName,
                bankAddress: employee.bankAddress,
                healthInsuranceNumber: employee.healthInsuranceNumber,
                healthInsuranceStartDate: formatDate(employee.healthInsuranceStartDate),
                healthInsuranceEndDate: formatDate(employee.healthInsuranceEndDate),
                socialInsuranceNumber: employee.socialInsuranceNumber,
                archivedRecordNumber: employee.archivedRecordNumber,

                headHouseHoldName: employee.houseHold?.headHouseHoldName,
                documentType: employee.houseHold?.documentType,
                houseHoldNumber: employee.houseHold?.houseHoldNumber,
                city: employee.houseHold?.city,
                district: employee.houseHold?.district,
                ward: employee.houseHold?.ward,
                houseHoldAddress: employee.houseHold?.houseHoldAddress,
                phone: employee.houseHold?.phone,
                houseHoldCode: employee.houseHold?.houseHoldCode
            };
        })

        let experiencesSheet = [], degreesSheet = [], certificatesSheet = [], contractsSheet = [], socialInsuranceDetailsSheet = [],
            filesSheet = [], commendationsSheet = [], disciplinesSheet = [], salarysSheet = [], annualLeavesSheet = [], coursesSheet = [], familysSheet = [];

        data.forEach(x => {
            let employee = x.employees[0];
            let experiences = employee.experiences.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: formatDate(y.startDate, true),
                    endDate: formatDate(y.endDate, true),
                }
            });
            let degrees = employee.degrees.map(y => {
                return {
                    ...y,
                    degreeType: translate(`human_resource.profile.${y.degreeType}`),
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });
            let certificates = employee.certificates.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: formatDate(y.startDate),
                    endDate: formatDate(y.endDate),
                }
            });
            let contracts = employee.contracts.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: formatDate(y.startDate),
                    endDate: formatDate(y.endDate),
                }
            });
            let socialInsuranceDetails = employee.socialInsuranceDetails.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: formatDate(y.startDate, true),
                    endDate: formatDate(y.endDate, true),
                }
            });
            let files = employee.files.map(y => {
                return {
                    ...y,
                    status: translate(`human_resource.profile.${y.status}`),
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });

            let familys = employee.houseHold?.familyMembers?.map(y => {
                return {
                    ...y,
                    gender: translate(`human_resource.profile.${y.gender}`),
                    employeeNumber: employee.employeeNumber,
                    isHeadHousehold: y.isHeadHousehold ? 'X' : null
                }
            })

            let commendations = x.commendations.map(y => {
                let decisionUnit = department.list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: formatDate(y.startDate),
                }
            });
            let disciplines = x.disciplines.map(y => {
                let decisionUnit = department.list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: formatDate(y.startDate),
                    endDate: formatDate(y.endDate),
                }
            });
            let salaries = x.salaries.map(y => {
                let organizationalUnit = department.list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    organizationalUnit: organizationalUnit.name,
                }
            });
            let annualLeaves = x.annualLeaves.map(y => {
                let organizationalUnit = department.list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    status: translate(`human_resource.annual_leave.status.${y.status}`),
                    organizationalUnit: organizationalUnit.name,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: formatDate(y.startDate),
                    endDate: formatDate(y.endDate),
                }
            });
            let courses = x.courses.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });

            experiencesSheet = experiencesSheet.concat(experiences);
            degreesSheet = degreesSheet.concat(degrees);
            certificatesSheet = certificatesSheet.concat(certificates);
            contractsSheet = contractsSheet.concat(contracts);
            socialInsuranceDetailsSheet = socialInsuranceDetailsSheet.concat(socialInsuranceDetails);
            filesSheet = filesSheet.concat(files);
            commendationsSheet = commendationsSheet.concat(commendations);
            disciplinesSheet = disciplinesSheet.concat(disciplines);
            salarysSheet = salarysSheet.concat(salaries);
            annualLeavesSheet = annualLeavesSheet.concat(annualLeaves);
            coursesSheet = coursesSheet.concat(courses);
            familysSheet = familysSheet.concat(familys);
        });

        experiencesSheet = experiencesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        degreesSheet = degreesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        certificatesSheet = certificatesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        contractsSheet = contractsSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        socialInsuranceDetailsSheet = socialInsuranceDetailsSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        filesSheet = filesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        commendationsSheet = commendationsSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        disciplinesSheet = disciplinesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        annualLeavesSheet = annualLeavesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        coursesSheet = coursesSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        });
        familysSheet = familysSheet.map((x, index) => {
            return { STT: index + 1, ...x }
        })


        let otherSalary = [];
        salarysSheet.forEach(x => {
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    if (!otherSalary.includes(x.bonus[count].nameBonus)) {
                        otherSalary = [...otherSalary, x.bonus[count].nameBonus]
                    }
                };
            }
        })
        salarysSheet = salarysSheet.map((x, index) => {
            let total = 0, bonus = {};
            let d = new Date(x.month),
                month = '' + (d.getMonth() + 1),
                year = d.getFullYear();
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number);
                    otherSalary.forEach((y, key) => {
                        if (y === x.bonus[count].nameBonus) {
                            bonus = { ...bonus, [`bonus${key}`]: parseInt(x.bonus[count].number) }
                        }
                    })
                };

                total = total + x?.mainSalary ? parseInt(x.mainSalary) : 0;
            }

            return {
                STT: index + 1,
                employeeNumber: x.employeeNumber,
                fullName: x.fullName,
                organizationalUnit: x.organizationalUnit,
                mainSalary: x?.mainSalary ? parseInt(x.mainSalary) : 0,
                total: total,
                month: month,
                year: year,
                ...bonus
            };
        })

        let columns = [{ key: 'bonus0', value: 0 }];
        if (otherSalary.length !== 0) {
            columns = otherSalary.map((x, index) => {
                return { key: `bonus${index}`, value: x, }
            })
        }


        let exportData = {
            fileName: translate(`human_resource.profile.employee_management.file_export_name`),
            dataSheets: [
                {
                    // 1.Nhân viên
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet1`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "position", value: translate(`human_resource.position`), width: 25 },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnits", value: translate(`human_resource.unit`), width: 25 },
                                { key: "birthdate", value: translate(`human_resource.profile.date_birth`) },
                                { key: "gender", value: translate(`human_resource.profile.gender`) },
                                { key: "employeeTimesheetId", value: translate(`human_resource.profile.attendance_code`) },
                                { key: "identityCardNumber", value: translate(`human_resource.profile.id_card`) },
                                { key: "identityCardDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "identityCardAddress", value: translate(`human_resource.profile.issued_by`) },
                                { key: "birthplace", value: translate(`human_resource.profile.place_birth`), width: 35 },
                                { key: "permanentResidence", value: translate(`human_resource.profile.permanent_address`), width: 35 },
                                { key: "temporaryResidence", value: translate(`human_resource.profile.current_residence`), width: 35 },
                                { key: "maritalStatus", value: translate(`human_resource.profile.relationship`) },
                                { key: "status", value: translate(`human_resource.profile.status_work`) },
                                { key: "startingDate", value: translate(`human_resource.profile.starting_date`) },
                                { key: "leavingDate", value: translate(`human_resource.profile.leaving_date`) },
                                { key: "emailInCompany", value: translate(`human_resource.profile.email_company`), width: 35 },
                                { key: "taxNumber", value: translate(`human_resource.profile.personal_income_tax`) },
                                { key: "taxRepresentative", value: translate(`human_resource.profile.representative`), width: 20 },
                                { key: "taxDateOfIssue", value: translate(`human_resource.profile.day_active`) },
                                { key: "taxAuthority", value: translate(`human_resource.profile.managed_by`), width: 35 },
                                { key: "ethnic", value: translate(`human_resource.profile.ethnic`) },
                                { key: "religion", value: translate(`human_resource.profile.religion`) },
                                { key: "nationality", value: translate(`human_resource.profile.nationality`) },
                                { key: "educationalLevel", value: translate(`human_resource.profile.educational_level`) },
                                { key: "foreignLanguage", value: translate(`human_resource.profile.language_level`) },
                                { key: "professionalSkill", value: translate(`human_resource.profile.qualification`) },
                                { key: "phoneNumber", value: translate(`human_resource.profile.mobile_phone_1`) },
                                { key: "phoneNumber2", value: translate(`human_resource.profile.mobile_phone_2`) },
                                { key: "personalEmail", value: translate(`human_resource.profile.personal_email_1`), width: 35 },
                                { key: "personalEmail2", value: translate(`human_resource.profile.personal_email_2`), width: 35 },
                                { key: "homePhone", value: translate(`human_resource.profile.home_phone`) },
                                { key: "emergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person`), width: 20 },
                                { key: "relationWithEmergencyContactPerson", value: translate(`human_resource.profile.employee_management.export.relation_with_emergency_contact_person`), width: 25 },
                                { key: "emergencyContactPersonAddress", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_address`), width: 35 },
                                { key: "emergencyContactPersonPhoneNumber", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_phone_number`), width: 25 },
                                { key: "emergencyContactPersonHomePhone", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_home_phone`), width: 25 },
                                { key: "emergencyContactPersonEmail", value: translate(`human_resource.profile.employee_management.export.emergency_contact_person_email`), width: 35 },
                                { key: "atmNumber", value: translate(`human_resource.profile.employee_management.export.atmNumber`) },
                                { key: "bankName", value: translate(`human_resource.profile.bank_name`) },
                                { key: "bankAddress", value: translate(`human_resource.profile.employee_management.export.bank_address`) },
                                { key: "healthInsuranceNumber", value: translate(`human_resource.profile.number_BHYT`) },
                                { key: "healthInsuranceStartDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_start_date`), width: 20 },
                                { key: "healthInsuranceEndDate", value: translate(`human_resource.profile.employee_management.export.health_insurance_end_date`), width: 20 },
                                { key: "socialInsuranceNumber", value: translate(`human_resource.profile.number_BHXH`) },
                                { key: "archivedRecordNumber", value: translate(`human_resource.profile.attachments_code`) },

                                { key: "houseHoldNumber", value: translate(`human_resource.profile.house_hold.appendix.house_hold_number`) },
                                { key: "headHouseHoldName", value: translate(`human_resource.profile.house_hold.appendix.head_house_hold_name`) },
                                { key: "documentType", value: translate(`human_resource.profile.house_hold.appendix.document_type`) },
                                { key: "city", value: translate(`human_resource.profile.house_hold.appendix.city`) },
                                { key: "district", value: translate(`human_resource.profile.house_hold.appendix.district`) },
                                { key: "ward", value: translate(`human_resource.profile.house_hold.appendix.ward`) },
                                { key: "houseHoldAddress", value: translate(`human_resource.profile.house_hold.appendix.house_hold_address`) },
                                { key: "phone", value: translate(`human_resource.profile.house_hold.appendix.phone_appendix`) },
                                { key: "houseHoldCode", value: translate(`human_resource.profile.house_hold.appendix.house_hold_code`) },
                            ],
                            data: employeeInforSheet
                        }
                    ]
                },
                {
                    // 2.HS Nhân viên - Kinh nghiệm
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet2`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: experiencesSheet
                        }
                    ]
                },
                {
                    // 3.HS Nhân viên - Bằng cấp
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet3`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_diploma`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.diploma_issued_by`), width: 35 },
                                { key: "year", value: translate(`human_resource.profile.graduation_year`) },
                                { key: "degreeType", value: translate(`human_resource.profile.ranking_learning`) },
                            ],
                            data: degreesSheet
                        }
                    ]
                },
                {
                    // 4.HS Nhân viên - Chứng chỉ
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet4`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_certificate`), width: 25 },
                                { key: "issuedBy", value: translate(`human_resource.profile.issued_by`), width: 35 },
                                { key: "startDate", value: translate(`human_resource.profile.date_issued`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: certificatesSheet
                        }
                    ]
                },
                {
                    // 5.HS Nhân viên - Hợp đồng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet5`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.name_contract`), width: 35 },
                                { key: "contractType", value: translate(`human_resource.profile.type_contract`), width: 25 },
                                { key: "startDate", value: translate(`human_resource.profile.start_date`) },
                                { key: "endDate", value: translate(`human_resource.profile.end_date_certificate`) },
                            ],
                            data: contractsSheet
                        }
                    ]
                },
                {
                    // 6.HS Nhân viên - Bảo hiểm XH
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet6`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "startDate", value: translate(`human_resource.profile.from_month_year`) },
                                { key: "endDate", value: translate(`human_resource.profile.to_month_year`) },
                                { key: "company", value: translate(`human_resource.profile.unit`), width: 35 },
                                { key: "position", value: translate(`human_resource.position`), width: 25 }
                            ],
                            data: socialInsuranceDetailsSheet
                        }
                    ]
                },
                {
                    // 7.HS Nhân viên - Tài liệu
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet7`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "name", value: translate(`human_resource.profile.file_name`) },
                                { key: "description", value: translate(`general.description`), width: 35 },
                                { key: "number", value: translate(`human_resource.profile.number`) },
                                { key: "status", value: translate(`human_resource.status`) },
                            ],
                            data: filesSheet
                        }
                    ]
                },
                {
                    // 8.HS Nhân viên - Thành viên hộ gia đình
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet8`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "name", value: translate(`human_resource.profile.house_hold.members.name_member`) },
                                { key: "codeSocialInsurance", value: translate('human_resource.profile.house_hold.members.code_social_insurance') },
                                { key: "bookNumberSocialInsurance", value: translate('human_resource.profile.house_hold.members.book_nci') },
                                { key: "gender", value: translate('human_resource.profile.house_hold.members.gender') },
                                { key: "isHeadHousehold", value: translate('human_resource.profile.house_hold.members.is_hh') },
                                { key: "relationshipWithHeadHousehold", value: translate('human_resource.profile.house_hold.members.rwhh') },
                                { key: "birth", value: translate('human_resource.profile.house_hold.members.birth') },
                                { key: "ccns", value: translate('human_resource.profile.house_hold.members.cnss') },
                                { key: "placeOfBirthCertificate", value: translate('human_resource.profile.house_hold.members.pob') },
                                { key: "nationality", value: translate('human_resource.profile.house_hold.members.nationality') },
                                { key: "nation", value: translate('human_resource.profile.house_hold.members.nation') },
                                { key: "numberPassport", value: translate('human_resource.profile.house_hold.members.npp') },
                                { key: "note", value: translate('human_resource.profile.house_hold.members.note') },
                            ],
                            data: familysSheet
                        }
                    ]
                },
                {
                    // 9.HS Nhân viên - Khen thưởng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet9`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.commendation.table.decision_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.commendation.table.reward_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.commendation.table.reason_praise'), width: 35 },
                            ],
                            data: commendationsSheet
                        }
                    ]
                },
                {
                    // 10.HS Nhân viên - Kỷ luật
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet10`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "decisionNumber", value: translate('human_resource.commendation_discipline.commendation.table.decision_number') },
                                { key: "decisionUnit", value: translate('human_resource.commendation_discipline.commendation.table.decision_unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.commendation_discipline.discipline.table.start_date') },
                                { key: "endDate", value: translate('human_resource.commendation_discipline.discipline.table.end_date') },
                                { key: "type", value: translate('human_resource.commendation_discipline.discipline.table.discipline_forms') },
                                { key: "reason", value: translate('human_resource.commendation_discipline.discipline.table.reason_discipline'), width: 35 },
                            ],
                            data: disciplinesSheet
                        }
                    ]
                },
                {
                    // 11.HS Nhân viên - Lương thưởng
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet11`),
                    tables: [
                        {
                            rowHeader: 2,
                            merges: [{
                                key: "other",
                                columnName: translate('human_resource.salary.other_salary'),
                                keyMerge: 'bonus0',
                                colspan: columns.length
                            }],

                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "month", value: translate('human_resource.month') },
                                { key: "year", value: translate('human_resource.work_plan.year') },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                                { key: "mainSalary", value: translate('human_resource.salary.table.main_salary'), },
                                ...columns,
                                { key: "total", value: translate('human_resource.salary.table.total_salary'), },
                            ],
                            data: salarysSheet
                        }
                    ]
                },
                {
                    // 12.HS Nhân viên - Nghỉ phép
                    sheetName: translate(`human_resource.profile.employee_management.export.sheet12`),
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate(`human_resource.stt`), width: 7 },
                                { key: "employeeNumber", value: translate(`human_resource.profile.staff_number`) },
                                { key: "fullName", value: translate(`human_resource.profile.full_name`), width: 20 },
                                { key: "organizationalUnit", value: translate('human_resource.unit'), width: 25 },
                                { key: "startDate", value: translate('human_resource.annual_leave.table.start_date') },
                                { key: "endDate", value: translate('human_resource.annual_leave.table.end_date') },
                                { key: "reason", value: translate('human_resource.annual_leave.table.reason'), width: 35 },
                                { key: "status", value: translate('human_resource.status'), width: 25 },
                            ],
                            data: annualLeavesSheet
                        }
                    ]
                },
            ]
        }
        return exportData
    }

    useLayoutEffect(() => {
        const { exportDataStatus } = state;
        const { employeesManager } = props;
        if (exportDataStatus === 0 && !employeesManager.isLoading && employeesManager.exportData.length !== 0) {
            let exportData = convertDataToExportData(employeesManager.exportData);
            ExportExcel.export(exportData);
        };

    }, [props.employeesManager.exportData]);

    const { employeesManager, translate, department, field } = props;

    const { importEmployee, limit, page, organizationalUnits, currentRow, currentRowView, status } = state;

    let listEmployees = [];
    if (employeesManager.listEmployees) {
        listEmployees = employeesManager.listEmployees;
    }

    let pageTotal = ((employeesManager.totalList % limit) === 0) ?
        parseInt(employeesManager.totalList / limit) :
        parseInt((employeesManager.totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);
    let professionalSkills = [
        { value: "intermediate_degree", text: translate('human_resource.profile.intermediate_degree') },
        { value: "colleges", text: translate('human_resource.profile.colleges') },
        { value: "university", text: translate('human_resource.profile.university') },
        { value: "master_degree", text: translate('human_resource.profile.master_degree') },
        { value: "phd", text: translate('human_resource.profile.phd') },
        { value: "unavailable", text: translate('human_resource.profile.unavailable') },
    ];

    return (
        <div className="box">
            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới nhân viên */}
                    <div className="dropdown pull-right">
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.profile.employee_management.add_employee_title')} >{translate('human_resource.profile.employee_management.add_employee')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={createEmployee}>{translate('human_resource.profile.employee_management.add_by_hand')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={_importEmployee}>{translate('human_resource.profile.employee_management.add_import')}</a></li>
                        </ul>
                    </div>
                    <button type="button" style={{ marginRight: 15, marginTop: 0 }} className="btn btn-primary pull-right" onClick={handleExportExcel} >{translate('human_resource.name_button_export')}<i className="fa fa-fw fa-file-excel-o"> </i></button>
                </div>

                <div className="form-inline">
                    {/* Đơn vị */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('page.unit')}</label>
                        <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                            options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                            value={organizationalUnits ? organizationalUnits : []}
                            items={department.list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={handleUnitChange}>
                        </SelectMulti>
                    </div>
                    {/* Mã nhân viên  */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('page.staff_number')}</label>
                        <input type="text" className="form-control" name="employeeNumber" onChange={handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    {/* Tên nhân viên  */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.staff_name')}</label>
                        <input type="text" className="form-control" name="employeeName" onChange={handleChange} placeholder={translate('human_resource.staff_name')} autoComplete="off" />
                    </div>
                    {/* Trạng thái */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('page.status')}</label>
                        <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                            options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                            items={[
                                { value: 'active', text: translate('human_resource.profile.active') },
                                { value: 'leave', text: translate('human_resource.profile.leave') },
                                { value: 'maternity_leave', text: translate('human_resource.profile.maternity_leave') },
                                { value: 'unpaid_leave', text: translate('human_resource.profile.unpaid_leave') },
                                { value: 'probationary', text: translate('human_resource.profile.probationary') },
                                { value: 'sick_leave', text: translate('human_resource.profile.sick_leave') },
                            ]}
                            value={status}
                            onChange={handleStatusChange}>
                        </SelectMulti>
                    </div>
                </div>

                <div className="form-inline">
                    {/* Giới tính */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.profile.gender')}</label>
                        <SelectMulti id={`multiSelectGender`} multiple="multiple"
                            options={{ nonSelectedText: translate('human_resource.profile.employee_management.no_gender'), allSelectedText: translate('human_resource.profile.employee_management.all_gender') }}
                            items={[{ value: "male", text: translate('human_resource.profile.male') }, { value: "female", text: translate('human_resource.profile.female') }]} onChange={handleGenderChange}>
                        </SelectMulti>
                    </div>
                    {/* Tháng sinh */}
                    <div className="form-group">
                        <label title={translate('human_resource.profile.employee_management.brithday_lable_title')} className="form-control-static">{translate('human_resource.profile.employee_management.brithday_lable')}</label>
                        <DatePicker
                            id="month-birthdate"
                            dateFormat="month-year"
                            value=""
                            onChange={handleBirthdateChange}
                        />
                    </div>
                </div>

                <div className="form-inline">
                    {/* Loại hợp đồng lao động */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.profile.type_contract')}</label>
                        <input type="text" className="form-control" name="typeOfContract" onChange={handleChange} placeholder={translate('human_resource.profile.employee_management.contract_type_title')} />
                    </div>
                    {/* Tháng hết hợp đồng lao động */}
                    <div className="form-group">
                        <label title={translate('human_resource.profile.employee_management.contract_lable_title')} className="form-control-static">{translate('human_resource.profile.employee_management.contract_lable')}</label>
                        <DatePicker
                            id="month-endDate-contract"
                            dateFormat="month-year"
                            value=""
                            onChange={handleEndDateOfContractChange}
                        />
                    </div>

                </div>
                <div className="form-inline" style={{ marginBottom: 15 }}>
                    {/* Trình độ chuyên môn */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.profile.qualification')}</label>
                        <SelectMulti id={`multiSelectProfessionalSkill`} multiple="multiple"
                            options={{ nonSelectedText: 'Chọn chuyên môn', allSelectedText: 'Chọn tất cả chuyên môn' }}
                            items={professionalSkills}
                            onChange={handleProfessionalSkillChange}>
                        </SelectMulti>
                    </div>
                    {/* Trình độ chuyên ngành */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('human_resource.profile.career_fields')}</label>
                        <SelectMulti id={`multiSelectCareerFields`} multiple="multiple"
                            options={{ nonSelectedText: 'Chọn chuyên ngành', allSelectedText: 'Chọn tất cả chuyên ngành' }}
                            items={field.listFields.map(x => { return { value: x._id, text: x.name } })}
                            onChange={handleCareerFieldChange}>
                        </SelectMulti>
                    </div>
                    {/* Button tìm kiếm */}
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={handleSunmitSearch} >{translate('general.search')}</button>
                    </div>
                </div>

                <div className="form-group col-md-12 row" >
                    {(Number(employeesManager.expiresContract) > 0 || Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0) &&
                        <span>{translate('human_resource.profile.employee_management.have')}&nbsp;</span>
                    }
                    {Number(employeesManager.expiresContract) > 0 &&
                        <React.Fragment>
                            <span className="text-danger" style={{ fontWeight: "bold" }}>{` ${employeesManager.expiresContract} ${translate('human_resource.profile.employee_management.staff')}`}</span>
                            <span>&nbsp;{translate('human_resource.profile.employee_management.contract_expiration')}</span>
                        </React.Fragment>
                    }
                    {(Number(employeesManager.expiresContract) > 0 && Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0) &&
                        <span>&nbsp;{translate('human_resource.profile.employee_management.and')}&nbsp;</span>
                    }
                    {
                        Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0 &&
                        <React.Fragment>
                            <span className="text-success" style={{ fontWeight: "bold" }}>{` ${employeesManager.employeesHaveBirthdateInCurrentMonth} ${translate('human_resource.profile.employee_management.staff')}`}</span>
                            <span>&nbsp;{translate('human_resource.profile.employee_management.have_birthday')}</span>
                        </React.Fragment>
                    }
                    {(Number(employeesManager.expiresContract) > 0 || Number(employeesManager.employeesHaveBirthdateInCurrentMonth)) > 0 &&
                        <span>&nbsp;{`${translate('human_resource.profile.employee_management.this_month')} (${formatDate(Date.now(), true)})`}</span>
                    }
                </div>

                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>{translate('human_resource.staff_number')}</th>
                            <th>{translate('human_resource.staff_name')}</th>
                            <th>{translate('human_resource.profile.gender')}</th>
                            <th>{translate('human_resource.profile.date_birth')}</th>
                            <th>{translate('human_resource.profile.contract_end_date')}</th>
                            <th>{translate('human_resource.profile.type_contract')}</th>
                            <th>{translate('human_resource.status')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        'STT',
                                        translate('human_resource.staff_number'),
                                        translate('human_resource.staff_name'),
                                        translate('human_resource.profile.gender'),
                                        translate('human_resource.profile.date_birth'),
                                        translate('human_resource.profile.contract_end_date'),
                                        translate('human_resource.profile.type_contract'),
                                        translate('human_resource.status'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listEmployees && listEmployees.length !== 0 &&
                            listEmployees.map((x, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{x.employeeNumber}</td>
                                    <td>{x.fullName}</td>
                                    <td>{translate(`human_resource.profile.${x.gender}`)}</td>
                                    <td>{formatDate(x.birthdate)}</td>
                                    <td>{formatDate(x.contractEndDate)}</td>
                                    <td>{x.contractType}</td>
                                    <td style={{ color: x.status === "active" ? "#28A745" : (x.status === "active" ? '#dd4b39' : null) }}>{translate(`human_resource.profile.${x.status}`)}</td>
                                    <td>
                                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.edit_employee')}><i className="material-icons">edit</i></a>
                                        <ConfirmNotification
                                            icon="question"
                                            title="Xóa thông tin nhân viên"
                                            name="delete"
                                            className="text-red"
                                            content={`<h4>${translate('human_resource.profile.employee_management.delete_employee')} ${x.fullName + " - " + x.employeeNumber}</h4>`}
                                            func={() => props.deleteEmployee(x._id, x.emailInCompany)}
                                        />
                                    </td>
                                </tr>
                            )
                            )}
                    </tbody>

                </table>
                {employeesManager.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (!listEmployees || listEmployees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }

                <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
            </div>
            {/* From thêm mới thông tin nhân viên */}
            <EmployeeCreateForm />

            {/* From import thông tin nhân viên*/
                importEmployee && <EmployeeImportForm />
            }

            {/* From xem thông tin nhân viên */
                <EmployeeDetailForm
                    _id={currentRowView ? currentRowView._id : ""}
                />
            }
            {/* From chinh sửa thông tin nhân viên */
                <EmployeeEditFrom
                    _id={currentRow ? currentRow._id : ""}
                />
            }
        </div >
    );
}

function mapState(state) {
    const { employeesManager, department, field } = state;
    return { employeesManager, department, field };
}

const actionCreators = {
    getListFields: FieldsActions.getListFields,
    getDepartment: DepartmentActions.get,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};

const employeeManagement = connect(mapState, actionCreators)(withTranslate(EmployeeManagement));
export { employeeManagement as EmployeeManagement };
