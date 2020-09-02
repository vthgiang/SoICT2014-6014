import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti, ExportExcel, DatePicker } from '../../../../../common-components';

import { EmployeeCreateForm, EmployeeDetailForm, EmployeeEditFrom, EmployeeImportForm } from './combinedContent';

import { EmployeeManagerActions } from '../redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

class EmployeeManagement extends Component {
    constructor(props) {
        super(props);
        let search = window.location.search.split('?')
        let keySearch = 'organizationalUnits';
        let organizationalUnits = null;
        for (let n in search) {
            let index = search[n].lastIndexOf(keySearch);
            if (index !== -1) {
                organizationalUnits = search[n].slice(keySearch.length + 1, search[n].length);
                if (organizationalUnits !== 'null' && organizationalUnits.trim() !== '') {
                    organizationalUnits = organizationalUnits.split(',')
                } else organizationalUnits = null
                break;
            }
        }

        this.state = {
            position: null,
            gender: null,
            employeeNumber: null,
            organizationalUnits: organizationalUnits,
            status: 'active',
            page: 0,
            limit: 5,
        }
    }

    componentDidMount() {
        this.props.getAllEmployee(this.state);
        this.props.getDepartment();
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
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
    createEmployee = () => {
        window.$('#modal-create-employee').modal('show');
    }

    // Function bắt sự kiện thêm lương nhân viên bằng import file
    importEmployee = async () => {
        await this.setState({
            importEmployee: true
        })
        window.$('#modal_import_file').modal('show');
    }

    //
    /**
     *  Bắt sự kiện click xem thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn xem
     */
    handleView = async (value) => {
        await this.setState(state => {
            return {
                currentRowView: value
            }
        });
        window.$('#modal-view-employee').modal('show');
    }

    /**
     * Bắt sự kiện click chỉnh sửa thông tin nhân viên
     * @param {*} value : Thông tin nhân viên muốn chỉnh sửa
     */
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-employee').modal('show');
    }

    /**
     * Function lưu giá trị unit vào state khi thay đổi
     * @param {*} value : Array id đơn vị
     */
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            organizationalUnits: value
        })
    }

    /**
     * Function lưu giá trị chức vụ vào state khi thay đổi
     * @param {*} value : Array id chức vụ
     */
    // 
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    /**
     * Function lưu giá trị giới tính vào state khi thay đổi
     * @param {*} value : Giá trị giới tính
     */
    handleGenderChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            gender: value
        })
    }

    /**
     * Function lưu giá trị trạng thái vào state khi thay đổi
     * @param {*} value : Giá trị trạng thái
     */
    handleStatusChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            status: value
        })
    }

    /**
     * Function lưu giá trị tháng sinh vào state khi thay đổi
     * @param {*} value : Giá trị tháng sinh
     */
    // 
    handleBirthdateChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            birthdate: value
        });
    }

    /**
     * Function lưu giá trị ngày hết hạn hợp đồng vào state khi thay đổi
     * @param {*} value : Tháng hết hạn hợp đồng
     */
    handleEndDateOfContractChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            endDateOfContract: value
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    /** Function bắt sự kiện tìm kiếm */
    handleSunmitSearch = async () => {
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện setting số dòng hiện thị trên một trang
     * @param {*} number : Số dòng trên 1 trang
     */
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getAllEmployee(this.state);
    }

    /**
     * Bắt sự kiện chuyển trang
     * @param {*} pageNumber : Số trang muốn xem
     */
    setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getAllEmployee(this.state);
    }

    /**
     * Function chyển đổi dữ liệu thông tin nhân viên thành dạng dữ liệu dùng export
     * @param {*} data : Thông tin nhân viên
     */
    convertDataToExportData = (data) => {
        const { list } = this.props.department;
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
                birthdate: this.formatDate(employee.birthdate),
                gender: employee.gender,
                employeeTimesheetId: employee.employeeTimesheetId,
                identityCardNumber: employee.identityCardNumber,
                identityCardDate: this.formatDate(employee.identityCardDate),
                identityCardAddress: employee.identityCardAddress,
                birthplace: employee.birthplace,
                permanentResidence: employee.permanentResidence,
                temporaryResidence: employee.temporaryResidence,
                maritalStatus: employee.maritalStatus,
                status: employee.status,
                startingDate: this.formatDate(employee.startingDate),
                leavingDate: this.formatDate(employee.leavingDate),
                emailInCompany: employee.emailInCompany,
                taxNumber: employee.taxNumber,
                taxRepresentative: employee.taxRepresentative,
                taxDateOfIssue: this.formatDate(employee.taxDateOfIssue),
                taxAuthority: employee.taxAuthority,
                ethnic: employee.ethnic,
                religion: employee.religion,
                nationality: employee.nationality,
                educationalLevel: employee.educationalLevel,
                foreignLanguage: employee.foreignLanguage,
                professionalSkill: employee.professionalSkill,
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
                healthInsuranceStartDate: this.formatDate(employee.healthInsuranceStartDate),
                healthInsuranceEndDate: this.formatDate(employee.healthInsuranceEndDate),
                socialInsuranceNumber: employee.socialInsuranceNumber,
                archivedRecordNumber: employee.archivedRecordNumber,
            };
        })

        let experiencesSheet = [], degreesSheet = [], certificatesSheet = [], contractsSheet = [], socialInsuranceDetailsSheet = [],
            filesSheet = [], commendationsSheet = [], disciplinesSheet = [], salarysSheet = [], annualLeavesSheet = [], coursesSheet = [];

        data.forEach(x => {
            let employee = x.employees[0];
            let experiences = employee.experiences.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: this.formatDate(y.startDate, true),
                    endDate: this.formatDate(y.endDate, true),
                }
            });
            let degrees = employee.degrees.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });
            let certificates = employee.certificates.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: this.formatDate(y.startDate),
                    endDate: this.formatDate(y.endDate),
                }
            });
            let contracts = employee.contracts.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: this.formatDate(y.startDate),
                    endDate: this.formatDate(y.endDate),
                }
            });
            let socialInsuranceDetails = employee.socialInsuranceDetails.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: this.formatDate(y.startDate, true),
                    endDate: this.formatDate(y.endDate, true),
                }
            });
            let files = employee.files.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });
            let commendations = x.commendations.map(y => {
                let decisionUnit = list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: this.formatDate(y.startDate),
                }
            });
            let disciplines = x.disciplines.map(y => {
                let decisionUnit = list.find(u => u._id === y.organizationalUnit);
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    decisionUnit: decisionUnit ? decisionUnit.name : "",
                    startDate: this.formatDate(y.startDate),
                    endDate: this.formatDate(y.endDate),
                }
            });
            let salarys = x.salarys.map(x => {
                return {
                    ...x,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName
                }
            });
            let annualLeaves = x.annualLeaves.map(y => {
                return {
                    ...y,
                    employeeNumber: employee.employeeNumber,
                    fullName: employee.fullName,
                    startDate: this.formatDate(y.startDate),
                    endDate: this.formatDate(y.endDate),
                }
            });
            let courses = x.courses.map(x => {
                return {
                    ...x,
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
            salarysSheet = salarysSheet.concat(salarys);
            annualLeavesSheet = annualLeavesSheet.concat(annualLeaves);
            coursesSheet = coursesSheet.concat(courses);
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

                total = total + parseInt(x.mainSalary);
            }

            return {
                STT: index + 1,
                employeeNumber: x.employeeNumber,
                fullName: x.fullName,
                mainSalary: parseInt(x.mainSalary),
                total: total,
                month: month,
                year: year,
                ...bonus
            };
        })
        let columns = otherSalary.map((x, index) => {
            return { key: `bonus${index}`, value: x, type: "Number" }
        })


        let exportData = {
            fileName: "Bảng theo dõi thông tin nhân viên",
            dataSheets: [
                {
                    sheetName: "1.Nhân viên",
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "organizationalUnits", value: "Phòng ban" },
                                { key: "position", value: "Chức vụ" },
                                { key: "birthdate", value: "Ngày sinh" },
                                { key: "gender", value: "Giới tính" },
                                { key: "employeeTimesheetId", value: "Mã số chấm công" },
                                { key: "identityCardNumber", value: "Số chứng minh thư" },
                                { key: "identityCardDate", value: "Ngày cấp chứng minh thư" },
                                { key: "identityCardAddress", value: "Nơi cấp chứng minh thư" },
                                { key: "birthplace", value: "Nơi sinh" },
                                { key: "permanentResidence", value: "Hộ khẩu thưởng trú" },
                                { key: "temporaryResidence", value: "Nơi ở hiện tại" },
                                { key: "maritalStatus", value: "Tình trạng hôn nhân" },
                                { key: "status", value: "Tình trạng lao động" },
                                { key: "startingDate", value: "Ngày bắt đầu làm việc" },
                                { key: "leavingDate", value: "Ngày nghỉ việc" },
                                { key: "emailInCompany", value: "Email công ty" },
                                { key: "taxNumber", value: "Mã số thuế thu nhập cá nhân" },
                                { key: "taxRepresentative", value: "Đại diện của người nộp thuế" },
                                { key: "taxDateOfIssue", value: "Ngày cấp mã số thuế" },
                                { key: "taxAuthority", value: "Cơ quan quản lý thuế" },
                                { key: "ethnic", value: "Dân tộc" },
                                { key: "religion", value: "Tôn giáo" },
                                { key: "nationality", value: "Quốc tịch" },
                                { key: "educationalLevel", value: "Trình độ văn hoá" },
                                { key: "foreignLanguage", value: "Trình độ ngoại ngữ" },
                                { key: "professionalSkill", value: "Trình độ chuyên môn" },
                                { key: "phoneNumber", value: "Điện thoại di động 1" },
                                { key: "phoneNumber2", value: "Điện thoại di động 2" },
                                { key: "personalEmail", value: "Email cá nhân 1" },
                                { key: "personalEmail2", value: "Email cá nhân 2" },
                                { key: "homePhone", value: "Điện thoại nhà riêng" },
                                { key: "emergencyContactPerson", value: "Người liên hệ khẩn cấp" },
                                { key: "relationWithEmergencyContactPerson", value: "Quan hệ với người liên hệ khẩn cấp" },
                                { key: "emergencyContactPersonAddress", value: "Địa chỉ người liên hệ khẩn cấp" },
                                { key: "emergencyContactPersonPhoneNumber", value: "Điện thoại di động người liên hệ khẩn cấp" },
                                { key: "emergencyContactPersonHomePhone", value: "Điện thoại nhà riêng người liên hệ khẩn cấp" },
                                { key: "emergencyContactPersonEmail", value: "Email người liên hệ khẩn cấp" },
                                { key: "atmNumber", value: "Số tài khoản ngân hàng" },
                                { key: "bankName", value: "Tên ngân hàng" },
                                { key: "bankAddress", value: "Chi nhánh ngân hàng" },
                                { key: "healthInsuranceNumber", value: "Mã số BHYT" },
                                { key: "healthInsuranceStartDate", value: "Ngày BHYT có hiệu lực" },
                                { key: "healthInsuranceEndDate", value: "Ngày BHYT hết hạn" },
                                { key: "socialInsuranceNumber", value: "Mã số BHXH" },
                                { key: "archivedRecordNumber", value: "Nơi lưu trữ hồ sơ" },
                            ],
                            data: employeeInforSheet
                        }
                    ]
                },
                {
                    sheetName: '2.HS Nhân viên - Kinh nghiệm',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "startDate", value: "Từ tháng/năm" },
                                { key: "endDate", value: "Đến tháng/năm" },
                                { key: "company", value: "Đơn vị công tác" },
                                { key: "position", value: "Chức vụ" },
                            ],
                            data: experiencesSheet
                        }
                    ]
                },
                {
                    sheetName: '3.HS Nhân viên - Bằng cấp',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "name", value: "Tên bằng cấp" },
                                { key: "issuedBy", value: "Nơi đào tạo" },
                                { key: "year", value: "Năm tốt nghiệp" },
                                { key: "degreeType", value: "Xếp loại" },
                            ],
                            data: degreesSheet
                        }
                    ]
                },
                {
                    sheetName: '4.HS Nhân viên - Chứng chỉ',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "name", value: "Tên chứng chỉ" },
                                { key: "issuedBy", value: "Nơi cấp" },
                                { key: "startDate", value: "Ngày cấp" },
                                { key: "endDate", value: "Ngày hết hạn" },
                            ],
                            data: certificatesSheet
                        }
                    ]
                },
                {
                    sheetName: '5.HS Nhân viên - Hợp đồng',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "name", value: "Tên hợp đồng" },
                                { key: "contractType", value: "Loại hợp đồng" },
                                { key: "startDate", value: "Ngày có hiệu lực" },
                                { key: "endDate", value: "Ngày hết hạn" },
                            ],
                            data: contractsSheet
                        }
                    ]
                },
                {
                    sheetName: '6.HS Nhân viên - Bảo hiểm XH',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "startDate", value: "Từ tháng/năm" },
                                { key: "endDate", value: "Đến tháng/năm" },
                                { key: "company", value: "Đơn vị công tác" },
                                { key: "position", value: "Chức vụ" },
                            ],
                            data: socialInsuranceDetailsSheet
                        }
                    ]
                },
                {
                    sheetName: '7.HS Nhân viên - Tài liệu',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "name", value: "Tên tài liệu" },
                                { key: "description", value: "Mô tả" },
                                { key: "number", value: "Số lượng" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: filesSheet
                        }
                    ]
                },
                {
                    sheetName: '8.HS Nhân viên - Khen thưởng',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "decisionNumber", value: "Số ra quyết định" },
                                { key: "decisionUnit", value: "Cấp ra quyết định" },
                                { key: "startDate", value: "Ngày ra quyết định" },
                                { key: "type", value: "Hình thức khen thưởng" },
                                { key: "reason", value: "Lý do khen thưởng" },
                            ],
                            data: commendationsSheet
                        }
                    ]
                },
                {
                    sheetName: '9.HS Nhân viên - Kỷ luật',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "decisionNumber", value: "Số ra quyết định" },
                                { key: "decisionUnit", value: "Cấp ra quyết định" },
                                { key: "startDate", value: "Ngày có hiệu lực" },
                                { key: "endDate", value: "Ngày có hiệu lực" },
                                { key: "type", value: "Hình thức kỷ luật" },
                                { key: "reason", value: "Lý do kỷ luật" },
                            ],
                            data: disciplinesSheet
                        }
                    ]
                },
                {
                    sheetName: '10.HS Nhân viên - Lương thưởng',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "month", value: "Tháng" },
                                { key: "year", value: "Năm" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "mainSalary", value: "Tiền lương chính", type: "Number" },
                                ...columns,
                                { key: "total", value: "Tổng lương", type: "Number" },
                            ],
                            data: salarysSheet
                        }
                    ]
                },
                {
                    sheetName: '11.HS Nhân viên - Nghỉ phép',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: "STT" },
                                { key: "employeeNumber", value: "Mã số nhân viên" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "startDate", value: "Ngày bắt đầu" },
                                { key: "endDate", value: "Ngày kết thúc" },
                                { key: "reason", value: "Lý do" },
                                { key: "status", value: "Trạng thái" },
                            ],
                            data: annualLeavesSheet
                        }
                    ]
                },
            ]
        }
        return exportData
    }


    render() {
        const { employeesManager, translate, department } = this.props;

        const { importEmployee, limit, page, organizationalUnits, currentRow, currentRowView } = this.state;

        let lists, listPosition = [{ value: "", text: translate('human_resource.not_unit'), disabled: true }], list = department.list;
        if (organizationalUnits !== null) {
            listPosition = [];
            organizationalUnits.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }

        let exportData;
        if (employeesManager.listEmployees) {
            lists = employeesManager.listEmployees;
            exportData = this.convertDataToExportData(lists);
        }

        let pageTotal = ((employeesManager.totalList % limit) === 0) ?
            parseInt(employeesManager.totalList / limit) :
            parseInt((employeesManager.totalList / limit) + 1);
        let currentPage = parseInt((page / limit) + 1);

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* nuuton thêm mới nhân viên */}
                        <div className="dropdown pull-right">
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('human_resource.profile.employee_management.add_employee_title')} >{translate('human_resource.profile.employee_management.add_employee')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} onClick={this.importEmployee}>{translate('human_resource.profile.employee_management.add_import')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={this.createEmployee}>{translate('human_resource.profile.employee_management.add_by_hand')}</a></li>
                            </ul>
                        </div>
                        <ExportExcel id="export-employee" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginRight: 15, marginTop: 0 }} />
                    </div>
                    <div className="form-inline">
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.unit')}</label>
                            <SelectMulti id={`multiSelectUnit`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                value={organizationalUnits !== null ? organizationalUnits : []}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        {/* Chức vụ */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.position')}</label>
                            <SelectMulti id={`multiSelectPosition`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_position'), allSelectedText: translate('page.all_position') }}
                                items={organizationalUnits === null ? listPosition : listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline">
                        {/*Mã nhân viên  */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        {/* Giới tính */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.profile.gender')}</label>
                            <SelectMulti id={`multiSelectGender`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.profile.employee_management.no_gender'), allSelectedText: translate('human_resource.profile.employee_management.all_gender') }}
                                items={[{ value: "male", text: "Nam" }, { value: "female", text: "Nữ" }]} onChange={this.handleGenderChange}>
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline">
                        {/* Trạng thái */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('human_resource.non_status'), allSelectedText: translate('human_resource.all_status') }}
                                items={[{ value: "active", text: translate('human_resource.profile.active') }, { value: "leave", text: translate('human_resource.profile.leave') }]} onChange={this.handleStatusChange}>
                            </SelectMulti>
                        </div>
                        {/* Tháng sinh */}
                        <div className="form-group">
                            <label title={translate('human_resource.profile.employee_management.brithday_lable_title')} className="form-control-static">{translate('human_resource.profile.employee_management.brithday_lable')}</label>
                            <DatePicker
                                id="month-birthdate"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handleBirthdateChange}
                            />
                        </div>

                    </div>
                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Tháng hết hợp đồng lao động */}
                        <div className="form-group">
                            <label title={translate('human_resource.profile.employee_management.contract_lable_title')} className="form-control-static">{translate('human_resource.profile.employee_management.contract_lable')}</label>
                            <DatePicker
                                id="month-endDate-contract"
                                dateFormat="month-year"
                                value=""
                                onChange={this.handleEndDateOfContractChange}
                            />
                        </div>
                        {/* Loại hợp đồng lao động */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('human_resource.profile.type_contract')}</label>
                            <input type="text" className="form-control" name="typeOfContract" onChange={this.handleChange} placeholder={translate('human_resource.profile.employee_management.contract_type_title')} />
                        </div>
                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={this.handleSunmitSearch} >{translate('general.search')}</button>
                        </div>
                    </div>
                    <div className="form-group col-md-12 row" >
                        {(Number(employeesManager.expiresContract) > 0 || Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0) &&
                            <span>Có</span>
                        }
                        {Number(employeesManager.expiresContract) > 0 &&
                            <React.Fragment>
                                <span className="text-danger" style={{ fontWeight: "bold" }}>{` ${employeesManager.expiresContract} nhân viên`}</span>
                                <span>{` hết hạn hợp đồng`}</span>
                            </React.Fragment>
                        }
                        {(Number(employeesManager.expiresContract) > 0 && Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0) &&
                            <span>{` và`}</span>
                        }
                        {
                            Number(employeesManager.employeesHaveBirthdateInCurrentMonth) > 0 &&
                            <React.Fragment>
                                <span className="text-success" style={{ fontWeight: "bold" }}>{` ${employeesManager.employeesHaveBirthdateInCurrentMonth} nhân viên`}</span>
                                <span>{` có sinh nhật`}</span>
                            </React.Fragment>
                        }
                        {(Number(employeesManager.expiresContract) > 0 || Number(employeesManager.employeesHaveBirthdateInCurrentMonth)) > 0 &&
                            <span>{` trong tháng này (${this.formatDate(Date.now(), true)})`}</span>
                        }
                    </div>
                    <table id="employee-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('human_resource.staff_number')}</th>
                                <th>{translate('human_resource.staff_name')}</th>
                                <th>{translate('human_resource.profile.gender')}</th>
                                <th>{translate('human_resource.profile.date_birth')}</th>
                                <th>{translate('human_resource.unit')}</th>
                                <th>{translate('human_resource.position')}</th>
                                <th>{translate('human_resource.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId="employee-table"
                                        columnArr={[
                                            translate('human_resource.staff_number'),
                                            translate('human_resource.staff_name'),
                                            translate('human_resource.profile.gender'),
                                            translate('human_resource.profile.date_birth'),
                                            translate('human_resource.unit'),
                                            translate('human_resource.position'),
                                            translate('human_resource.status'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists && lists.length !== 0 &&
                                lists.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.employees.map(y => y.employeeNumber)}</td>
                                        <td>{x.employees.map(y => y.fullName)}</td>
                                        <td>{x.employees.map(y => y.gender)}</td>
                                        <td>{this.formatDate(x.employees.map(y => y.birthdate))}</td>
                                        <td>{x.organizationalUnits.length !== 0 ? x.organizationalUnits.map(unit => (
                                            <React.Fragment key={unit._id}>
                                                {unit.name}<br />
                                            </React.Fragment>
                                        )) : null}</td>
                                        <td>{x.roles.length !== 0 ? x.roles.map(role => (
                                            <React.Fragment key={role._id}>
                                                {role.roleId.name}<br />
                                            </React.Fragment>
                                        )) : null}</td>
                                        <td>{x.employees.map(y => y.status)}</td>
                                        < td >
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.view_employee')}><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.employee_management.edit_employee')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('human_resource.profile.employee_management.delete_employee')}
                                                data={{
                                                    id: x.employees.map(y => y._id),
                                                    info: x.employees.map(y => y.fullName) + " - " + x.employees.map(y => y.employeeNumber)
                                                }}
                                                func={this.props.deleteEmployee}
                                            />
                                        </td>
                                    </tr>
                                )
                                )}
                        </tbody>

                    </table>
                    {employeesManager.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
                </div>
                {/** From thêm mới thông tin nhân viên */}
                <EmployeeCreateForm />

                {   /** From import thông tin nhân viên*/
                    importEmployee && <EmployeeImportForm />
                }

                {   /** From xem thông tin nhân viên */
                    currentRowView &&
                    <EmployeeDetailForm
                        _id={this.state.currentRowView.employees[0]._id}
                        employees={this.state.currentRowView.employees}
                        salaries={this.state.currentRowView.salarys}
                        annualLeaves={this.state.currentRowView.annualLeaves}
                        commendations={this.state.currentRowView.commendations}
                        disciplines={this.state.currentRowView.disciplines}
                        courses={this.state.currentRowView.courses}
                        roles={this.state.currentRowView.roles}
                    />
                }
                {   /** From chinh sửa thông tin nhân viên */
                    currentRow &&
                    <EmployeeEditFrom
                        _id={this.state.currentRow.employees[0]._id}
                        employees={this.state.currentRow.employees}
                        salaries={this.state.currentRow.salarys}
                        annualLeaves={this.state.currentRow.annualLeaves}
                        commendations={this.state.currentRow.commendations}
                        disciplines={this.state.currentRow.disciplines}
                        courses={this.state.currentRow.courses}
                        organizationalUnits={this.state.currentRow.organizationalUnits.map(x => x._id)}
                        roles={this.state.currentRow.roles.map(x => x.roleId._id)}
                    />
                }
            </div>
        );
    };
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const actionCreators = {
    getDepartment: DepartmentActions.get,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
    deleteEmployee: EmployeeManagerActions.deleteEmployee,
};

const employeeManagement = connect(mapState, actionCreators)(withTranslate(EmployeeManagement));
export { employeeManagement as EmployeeManagement };