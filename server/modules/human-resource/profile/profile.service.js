const {
    Employee,
    Discipline,
    Commendation,
    AnnualLeave,
    Salary,
    OrganizationalUnit,
    UserRole,
    User,
    Course,
    Notification,
    Timesheet,
    Company,
    BiddingPackage,
    // CareerAction,
    // CareerPosition,
    // CareerField,
} = require("../../../models");

const { connect } = require(`../../../helpers/dbHelper`);

const fs = require("fs");
const mongoose = require("mongoose");
const moment = require("moment");
const UserService = require(`../../super-admin/user/user.service`);
const RoleService = require(`../../super-admin/role/role.service`);

/**
 * Lấy thông tin phòng ban, chức vụ của nhân viên theo emailCompany
 * @emailInCompany : Email công ty của nhân viên
 */
exports.getAllPositionRolesAndOrganizationalUnitsOfUser = async (
    portal,
    emailInCompany
) => {
    let roles = [],
        organizationalUnits = [];
    let user = await User(connect(DB_CONNECTION, portal)).findOne(
        {
            email: emailInCompany,
        },
        {
            _id: 1,
        }
    );
    if (user !== null) {
        roles = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                userId: user._id,
            })
            .populate([
                {
                    path: "roleId",
                },
            ]);
        let newRoles = roles.map((role) => role.roleId._id);
        organizationalUnits = await OrganizationalUnit(
            connect(DB_CONNECTION, portal)
        ).find({
            $or: [
                {
                    managers: {
                        $in: newRoles,
                    },
                },
                {
                    deputyManagers: {
                        $in: newRoles,
                    },
                },
                {
                    employees: {
                        $in: newRoles,
                    },
                },
            ],
        });
    }
    if (roles !== []) {
        let arrayRole = [
            "Admin",
            "Super Admin",
            "Employee",
            "Manager",
            "Deputy Manager",
        ];
        roles = roles.filter((role) => !arrayRole.includes(role.roleId.name));
    }

    return {
        roles,
        organizationalUnits,
    };
    // TODO: Còn có role tự tạo, cần loại bỏ Root roles và Company-Defined roles
};

/**
 * Lấy danh sách email công ty theo phòng ban và chức vụ
 * @organizationalUnits : Mảng id phòng ban
 * @position : Mảng id chức vụ(role)
 */
exports.getEmployeeEmailsByOrganizationalUnitsAndPositions = async (
    portal,
    organizationalUnits,
    position
) => {
    let units = [],
        roles = [];
    for (let n in organizationalUnits) {
        // Lấy thông tin đơn vị
        let unitInfo = await OrganizationalUnit(
            connect(DB_CONNECTION, portal)
        ).findById(organizationalUnits[n]);
        units = [...units, unitInfo];
    }
    if (position === undefined) {
        units.forEach((u) => {
            roles = roles
                .concat(u.managers)
                .concat(u.deputyManagers)
                .concat(u.employees);
        });
    } else {
        roles = position;
    }

    // Lấy danh sách người dùng theo phòng ban và chức danh
    let userRoles = await UserRole(connect(DB_CONNECTION, portal)).find({
        roleId: {
            $in: roles,
        },
    });

    // Lấy userID vào 1 arr
    let userId = userRoles.map((userRole) => userRole.userId);

    // Lấy email của người dùng theo phòng ban và chức danh
    let emailUsers = await User(connect(DB_CONNECTION, portal)).find(
        {
            _id: {
                $in: userId,
            },
        },
        {
            email: 1,
        }
    );
    return emailUsers.map((user) => user.email);
};

/**
 * Lấy thông tin cá nhân của nhân viên theo emailInCompany
 * @userId : Id người dùng(tài khoản)
 */
exports.getEmployeeProfile = async (portal, email) => {
    let employees = await Employee(connect(DB_CONNECTION, portal)).find({
        emailInCompany: email,
    });

    if (employees.length === 0) {
        return {
            employees: employees,
        };
    } else {
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(
            portal,
            email
        );
        let salaries = await Salary(connect(DB_CONNECTION, portal)).find({
            employee: employees[0]._id,
        });
        let annualLeaves = await AnnualLeave(
            connect(DB_CONNECTION, portal)
        ).find({
            employee: employees[0]._id,
        });
        let commendations = await Commendation(
            connect(DB_CONNECTION, portal)
        ).find({
            employee: employees[0]._id,
        });
        let disciplines = await Discipline(connect(DB_CONNECTION, portal)).find(
            {
                employee: employees[0]._id,
            }
        );
        let courses = await Course(connect(DB_CONNECTION, portal)).find({
            results: {
                $elemMatch: {
                    employee: employees[0]._id,
                },
            },
        });

        return {
            employees: employees,
            salaries,
            annualLeaves,
            commendations,
            disciplines,
            courses,
            ...value,
        };
    }
};

/**
 * Cập nhật thông tin cá nhân của nhân viên
 * @userId : Id người dùng
 * @data : Dữ liệu chỉnh sửa thông tin của nhân viên
 * @avatar : URL file avatar
 */
exports.updatePersonalInformation = async (portal, userId, data, avatar) => {
    if (avatar === "") {
        avatar = data.avatar;
    }
    let user = await User(connect(DB_CONNECTION, portal)).findById(userId);
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).findOne(
        {
            emailInCompany: user.email,
        },
        {
            _id: 1,
        }
    );
    // Thông tin cần cập nhật
    let employeeUpdate = {
        avatar: avatar,
        gender: data.gender,
        ethnic: data.ethnic,
        religion: data.religion,
        nationality: data.nationality,
        maritalStatus: data.maritalStatus,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.phoneNumber2,
        personalEmail: data.personalEmail,
        personalEmail2: data.personalEmail2,
        homePhone: data.homePhone,
        emergencyContactPerson: data.emergencyContactPerson,
        relationWithEmergencyContactPerson:
            data.relationWithEmergencyContactPerson,
        emergencyContactPersonPhoneNumber:
            data.emergencyContactPersonPhoneNumber,
        emergencyContactPersonEmail: data.emergencyContactPersonEmail,
        emergencyContactPersonHomePhone: data.emergencyContactPersonHomePhone,
        emergencyContactPersonAddress: data.emergencyContactPersonAddress,
        permanentResidence: data.permanentResidence,
        permanentResidenceCountry: data.permanentResidenceCountry,
        permanentResidenceCity: data.permanentResidenceCity,
        permanentResidenceDistrict: data.permanentResidenceDistrict,
        permanentResidenceWard: data.permanentResidenceWard,
        temporaryResidence: data.temporaryResidence,
        temporaryResidenceCountry: data.temporaryResidenceCountry,
        temporaryResidenceCity: data.temporaryResidenceCity,
        temporaryResidenceDistrict: data.temporaryResidenceDistrict,
        temporaryResidenceWard: data.temporaryResidenceWard,
    };

    // Cập nhật thông tin cơ bản vào database
    await Employee(connect(DB_CONNECTION, portal)).findOneAndUpdate(
        {
            _id: employeeInfo._id,
        },
        {
            $set: employeeUpdate,
        }
    );

    return await Employee(connect(DB_CONNECTION, portal)).find({
        _id: employeeInfo._id,
    });
};

/**
 * Lấy thông tin nhân viên theo id
 * @id : Id thông tin nhân viên cần lấy
 */
exports.getEmployeeInforById = async (portal, id) => {
    return await Employee(connect(DB_CONNECTION, portal)).findById(id);
};

/**
 * Lấy thông tin nhân viên theo email công ty
 * @param {*} emailInCompany : Email công ty
 * @param {*} company : Id công ty
 */
exports.getEmployeeInforByEmailInCompany = async (
    portal,
    emailInCompany,
    company
) => {
    return await Employee(connect(DB_CONNECTION, portal)).findOne(
        {
            company: company,
            emailInCompany: emailInCompany,
        },
        {
            fullName: 1,
            employeeNumber: 1,
        }
    );
};

/**
 * Lấy tất cả danh sách nhân viên đang làm việc của công ty theo đơn vị và phòng ban
 * @company : Id công ty
 * @organizationalUnits : Array id đơn vị
 * @positions : Array id chức vụ
 * @allInfor : 'true' lấy hết thông tin của mỗi nhân viên, false lấy 1 số thông tin của mỗi nhân viên
 */
exports.getEmployees = async (
    portal,
    company,
    organizationalUnits,
    positions,
    allInfor = true,
    status = [
        "active",
        "maternity_leave",
        "unpaid_leave",
        "probationary",
        "sick_leave",
    ]
) => {
    let keySearch = {
        company: company,
    };
    if (status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: status,
            },
        };
    }

    if (allInfor === true) {
        if (organizationalUnits !== undefined) {
            let emailInCompany =
                await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(
                    portal,
                    organizationalUnits,
                    positions
                );
            keySearch = {
                ...keySearch,
                emailInCompany: {
                    $in: emailInCompany,
                },
            };

            let listEmployeesOfOrganizationalUnits = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(keySearch);
            let totalEmployee = listEmployeesOfOrganizationalUnits.length;
            return {
                totalEmployee,
                listEmployeesOfOrganizationalUnits,
            };
        }
        let listAllEmployees = await Employee(
            connect(DB_CONNECTION, portal)
        ).find(keySearch);
        let totalAllEmployee = listAllEmployees.length;

        return {
            totalAllEmployee,
            listAllEmployees,
        };
    } else {
        if (organizationalUnits !== undefined) {
            let emailInCompany = [];
            if (organizationalUnits === "allUnist") {
                let units = await OrganizationalUnit(
                    connect(DB_CONNECTION, portal)
                ).find();
                units = units.map((x) => x._id);
                emailInCompany =
                    await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(
                        portal,
                        units,
                        undefined
                    );
            } else {
                emailInCompany =
                    await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(
                        portal,
                        organizationalUnits,
                        positions
                    );
            }

            keySearch = {
                ...keySearch,
                emailInCompany: {
                    $in: emailInCompany,
                },
            };

            let listEmployeesOfOrganizationalUnits = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(keySearch, {
                _id: 1,
                emailInCompany: 1,
                fullName: 1,
                employeeNumber: 1,
                gender: 1,
                birthdate: 1,
                startingDate: 1,
                leavingDate: 1,
                professionalSkill: 1,
                status: 1,
                degrees: 1,
                certificates: 1,
                experiences: 1,
            });
            let totalEmployee = listEmployeesOfOrganizationalUnits.length;
            return {
                totalEmployee,
                listEmployeesOfOrganizationalUnits,
            };
        }
        let totalAllEmployee = await Employee(
            connect(DB_CONNECTION, portal)
        ).countDocuments(keySearch);
        let listAllEmployees = await Employee(
            connect(DB_CONNECTION, portal)
        ).find(keySearch, {
            _id: 1,
            emailInCompany: 1,
            fullName: 1,
            employeeNumber: 1,
            gender: 1,
            birthdate: 1,
            startingDate: 1,
            leavingDate: 1,
            professionalSkill: 1,
            status: 1,
            degrees: 1,
            certificates: 1,
            experiences: 1,
        }).populate([
            { path: "certificates.certificate" },
        ]);

        return {
            totalAllEmployee,
            listAllEmployees,
        };
    }
};

/**
 * Lấy số nhân viên hết hạn hợp đồng lao động trong tháng hiện tại
 * @param {*} company : Id công ty
 */
exports.getEmployeeNumberExpiresContractInCurrentMonth = async (
    portal,
    company,
    month = new Date()
) => {
    let firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    let lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    let results = await Employee(connect(DB_CONNECTION, portal)).find({
        company: company,
        status: {
            $in: [
                "active",
                "maternity_leave",
                "unpaid_leave",
                "probationary",
                "sick_leave",
            ],
        },
        contractEndDate: {
            $gt: firstDay,
            $lte: lastDay,
        },
    });
    return results;
};

/**
 * Lấy số lượng nhân viên có sinh nhật trong tháng hiện tại
 * @param {*} company
 * @param {*} month
 */
exports.getEmployeeNumberHaveBirthdateInCurrentMonth = async (
    portal,
    company,
    month = new Date()
) => {
    return await Employee(connect(DB_CONNECTION, portal)).find({
        company: company,
        status: {
            $in: [
                "active",
                "maternity_leave",
                "unpaid_leave",
                "probationary",
                "sick_leave",
            ],
        },
        $expr: {
            $eq: [
                {
                    $month: "$birthdate",
                },
                month.getMonth() + 1,
            ],
        },
    });
};

/**
 * Lấy danh sách nhân viên tuyển mới hoặc nghỉ việc trong 6 hoặc 12 tháng gần nhất theo đơn vị
 * @param {*} organizationalUnits : array id đơn vị
 * @param {*} numberMonth : số tháng gần nhất
 * @param {*} company : Id công ty
 */
exports.getEmployeesByStartingAndLeaving = async (
    portal,
    organizationalUnits,
    startDate,
    endDate,
    company
) => {
    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
        return {
            arrMonth: [],
            listEmployeesHaveStartingDateOfNumberMonth: [],
            listEmployeesHaveLeavingDateOfNumberMonth: [],
        };
    } else {
        let endMonth = new Date(endDate).getMonth();
        let endYear = new Date(endDate).getFullYear();
        endMonth = endMonth + 1;
        let arrMonth = [];
        for (let i = 0; ; i++) {
            let month = endMonth - i;
            if (month > 0) {
                if (month.toString().length === 1) {
                    month = `${endYear}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            } else {
                let j = 1;
                for (j; ; j++) {
                    month = month + 12;
                    if (month > 0) {
                        break;
                    }
                }
                if (month.toString().length === 1) {
                    month = `${endYear - j}-0${month}-01`;
                    arrMonth = [...arrMonth, month];
                } else {
                    month = `${endYear - j}-${month}-01`;
                    arrMonth = [...arrMonth, month];
                }
                if (`${startDate}-01` === month) {
                    break;
                }
            }
        }
        let querysStartingDate = [],
            querysLeavingDate = [],
            totalEmployees = [];
        for (let x of arrMonth) {
            let date = new Date(x);
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            (querysStartingDate = [
                ...querysStartingDate,
                {
                    startingDate: {
                        $gt: firstDay,
                        $lte: lastDay,
                    },
                },
            ]),
                (querysLeavingDate = [
                    ...querysLeavingDate,
                    {
                        leavingDate: {
                            $gt: firstDay,
                            $lte: lastDay,
                        },
                    },
                ]);
            let total = await Employee(
                connect(DB_CONNECTION, portal)
            ).countDocuments({
                status: {
                    $in: [
                        "active",
                        "maternity_leave",
                        "unpaid_leave",
                        "probationary",
                        "sick_leave",
                    ],
                },
                startingDate: {
                    $lt: lastDay,
                },
            });
            totalEmployees = [...totalEmployees, total];
        }

        if (organizationalUnits) {
            let totalEmployeesUnit = [];
            let emailInCompany =
                await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(
                    portal,
                    organizationalUnits,
                    undefined
                );
            let listEmployeesHaveStartingDateOfNumberMonth = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(
                {
                    company: company,
                    emailInCompany: {
                        $in: emailInCompany,
                    },
                    $or: querysStartingDate,
                },
                {
                    _id: 1,
                    startingDate: 1,
                    leavingDate: 1,
                }
            );
            let listEmployeesHaveLeavingDateOfNumberMonth = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(
                {
                    company: company,
                    emailInCompany: {
                        $in: emailInCompany,
                    },
                    $or: querysLeavingDate,
                },
                {
                    _id: 1,
                    startingDate: 1,
                    leavingDate: 1,
                }
            );

            for (let month of arrMonth) {
                let monthIso = new Date(month);
                let lastDay = new Date(
                    monthIso.getFullYear(),
                    monthIso.getMonth() + 1,
                    1
                );
                let total = await Employee(
                    connect(DB_CONNECTION, portal)
                ).countDocuments({
                    company: company,
                    emailInCompany: {
                        $in: emailInCompany,
                    },
                    startingDate: {
                        $lt: lastDay,
                    },
                });
                totalEmployeesUnit = [...totalEmployeesUnit, total];
            }

            return {
                arrMonth,
                listEmployeesHaveStartingDateOfNumberMonth,
                listEmployeesHaveLeavingDateOfNumberMonth,
                totalEmployees: totalEmployeesUnit,
            };
        } else {
            let listEmployeesHaveStartingDateOfNumberMonth = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(
                {
                    company: company,
                    $or: querysStartingDate,
                },
                {
                    _id: 1,
                    startingDate: 1,
                    leavingDate: 1,
                }
            );
            let listEmployeesHaveLeavingDateOfNumberMonth = await Employee(
                connect(DB_CONNECTION, portal)
            ).find(
                {
                    company: company,
                    $or: querysLeavingDate,
                },
                {
                    _id: 1,
                    startingDate: 1,
                    leavingDate: 1,
                }
            );

            return {
                arrMonth,
                totalEmployees,
                listEmployeesHaveStartingDateOfNumberMonth,
                listEmployeesHaveLeavingDateOfNumberMonth,
            };
        }
    }
};

/**
 * Lấy danh sách nhân viên theo key tìm kiếm
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */
exports.searchEmployeeProfiles = async (portal, params, company) => {
    let keySearch = {
        company: company,
    };
    // Bắt sựu kiện theo đơn vị
    if (params.organizationalUnits) {
        let emailInCompany =
            await this.getEmployeeEmailsByOrganizationalUnitsAndPositions(
                portal,
                params.organizationalUnits,
                undefined
            );
        keySearch = {
            ...keySearch,
            emailInCompany: {
                $in: emailInCompany,
            },
        };
    }

    // Bắt sựu kiện theo mã nhân viên
    if (params.employeeNumber) {
        keySearch = {
            ...keySearch,
            employeeNumber: {
                $regex: ".*" + params.employeeNumber + ".*",
            },
        };
    }

    // Bắt sựu kiện theo tên nhân viên nhân viên
    if (params.employeeName) {
        keySearch = {
            ...keySearch,
            fullName: {
                $regex: ".*" + params.employeeName + ".*",
            },
        };
    }

    // Bắt sựu kiện tìm kiếm theo giới tính
    if (params.gender !== undefined) {
        keySearch = {
            ...keySearch,
            gender: {
                $in: params.gender,
            },
        };
    }

    // Bắt sự kiện tìm kiếm theo trạng thái
    if (params.status) {
        keySearch = {
            ...keySearch,
            status: {
                $in: params.status,
            },
        };
    }

    // Bắt sự kiện tìm kiếm theo chuyên môn
    if (params.professionalSkills) {
        keySearch = {
            ...keySearch,
            professionalSkill: {
                $in: params.professionalSkills,
            },
        };
    }
    // Bắt sự kiện tìm kiếm theo chuyên ngành
    if (params.careerFields) {
        keySearch = {
            ...keySearch,
            "degrees.field": {
                $in: params.careerFields,
            },
        };
    }

    // Thêm key tìm kiếm nhân viên theo ngày hết hạn hợp đồng vào keySearch
    if (params.endDateOfContract) {
        let month = new Date(params.endDateOfContract);
        let firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
        let lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        keySearch = {
            ...keySearch,
            contractEndDate: {
                $gt: firstDay,
                $lte: lastDay,
            },
        };
    }

    // Bắt sựu kiện theo Loại hợp đồng lao động
    if (params.typeOfContract) {
        keySearch = {
            ...keySearch,
            contractType: {
                $regex: params.typeOfContract,
                $options: "i",
            },
        };
    }

    // Bắt sựu kiện theo tháng sinh
    if (params.birthdate) {
        let month = new Date(params.birthdate).getMonth() + 1;
        keySearch = {
            ...keySearch,
            $expr: {
                $eq: [
                    {
                        $month: "$birthdate",
                    },
                    month,
                ],
            },
        };
    }

    if (params?.certificates) {
        keySearch = {
            ...keySearch,
            certificates: {
                $elemMatch: {
                    name: { $regex: params.certificates, $options: "i" },
                },
            },
        };
    }

    if (params?.degrees) {
        keySearch = {
            ...keySearch,
            degrees: {
                $elemMatch: { name: { $regex: params.degrees, $options: "i" } },
            },
        };
    }

    // Lấy danh sách nhân viên
    let listEmployees = await Employee(connect(DB_CONNECTION, portal))
        .find(keySearch, {
            field1: 1,
            employeeNumber: 1,
            emailInCompany: 1,
            birthdate: 1,
            contracts: 1,
            fullName: 1,
            gender: 1,
            contractEndDate: 1,
            contractType: 1,
            status: 1,
            degrees: 1,
        })
        .populate([
            { path: "career.field" },
            { path: "career.position" },
            { path: "career.action" },
        ])
        .sort({
            createdAt: "desc",
        })
        .skip(params.page)
        .limit(params.limit);

    let totalList = await Employee(
        connect(DB_CONNECTION, portal)
    ).countDocuments(keySearch);

    let expiresContract =
        await this.getEmployeeNumberExpiresContractInCurrentMonth(
            portal,
            company,
            new Date()
        );
    let employeesHaveBirthdateInCurrentMonth =
        await this.getEmployeeNumberHaveBirthdateInCurrentMonth(
            portal,
            company,
            new Date()
        );
    return {
        listEmployees,
        totalList,
        expiresContract,
        employeesHaveBirthdateInCurrentMonth,
    };
};

/**
 * Hàm tiện ích merge urlFile upload với object
 * @arrayFile : Mảng chứa các file
 * @arrayObject : Mảng chứa các object
 */
exports.mergeUrlFileToObject = (arrayFile, arrayObject) => {
    if (arrayFile !== undefined) {
        arrayObject.forEach((x) => {
            arrayFile.forEach((y) => {
                if (x.file === y.originalname) {
                    if (y.path) {
                        let path = y.path;
                        let regex = /\\/gi;
                        x.urlFile = `/${path.replace(regex, "/")}`;
                    }
                }
            });
        });
        return arrayObject;
    } else return arrayObject;
};

/**
 * Thêm mới nhân viên
 * @data : Dữ liệu thông tin nhân viên
 * @company : Id công ty
 * @fileInfor : Thông tin file đính kèm
 */
exports.createEmployee = async (portal, data, company, fileInfor) => {
    let avatar = fileInfor.avatar === "" ? data.avatar : fileInfor.avatar,
        fileDegree = fileInfor.fileDegree,
        fileCertificate = fileInfor.fileCertificate,
        fileContract = fileInfor.fileContract,
        fileExperience = fileInfor.fileExperience,
        fileCareerPosition = fileInfor.fileCareerPosition,
        file = fileInfor.file,
        healthInsuranceAttachment = fileInfor.healthInsuranceAttachment;
    let {
        degrees,
        certificates,
        careerPositions,
        experiences,
        contracts,
        files,
    } = data;

    degrees = degrees
        ? degrees.map((x) => {
            if (x.field === "") x.field = null;
            return x;
        })
        : [];

    degrees = this.mergeUrlFileToObject(fileDegree, degrees);

    certificates = this.mergeUrlFileToObject(fileCertificate, certificates);

    contracts = this.mergeUrlFileToObject(fileContract, contracts);

    console.log("aaaaaaaaaaaaaaaaaaaaa", fileExperience);
    console.log("aaaaaaaaaaaaaaaaaaaaa", fileCareerPosition);
    experiences = this.mergeUrlFileToObject(fileExperience, experiences);

    careerPositions = this.mergeUrlFileToObject(fileCareerPosition, careerPositions);

    files = this.mergeUrlFileToObject(file, files);

    // file đính kèm bảo hiểm y tế
    if (healthInsuranceAttachment) {
        healthInsuranceAttachment = healthInsuranceAttachment.map((obj) => {
            let url = `${obj.destination}/${obj.filename}`;
            let urlConvert = url.substr(1, url.length);
            return {
                fileName: obj.originalname,
                url: urlConvert,
            };
        });
    }

    let createEmployee = await Employee(connect(DB_CONNECTION, portal)).create({
        avatar: avatar,
        fullName: data.fullName,
        employeeNumber: data.employeeNumber,
        employeeTimesheetId: data.employeeTimesheetId,
        company: company,
        gender: data.gender,
        status: data.status,
        startingDate: data.startingDate,
        leavingDate: data.leavingDate,
        birthdate: data.birthdate,
        birthplace: data.birthplace,
        identityCardNumber: data.identityCardNumber,
        identityCardDate: data.identityCardDate,
        identityCardAddress: data.identityCardAddress,
        emailInCompany: data.emailInCompany,
        taxNumber: data.taxNumber,
        taxRepresentative: data.taxRepresentative,
        taxDateOfIssue: data.taxDateOfIssue ? data.taxDateOfIssue : null,
        taxAuthority: data.taxAuthority,
        atmNumber: data.atmNumber,
        bankName: data.bankName,
        bankAddress: data.bankAddress,
        healthInsuranceNumber: data.healthInsuranceNumber,
        healthInsuranceStartDate: data.healthInsuranceStartDate,
        healthInsuranceEndDate: data.healthInsuranceEndDate,
        socialInsuranceNumber: data.socialInsuranceNumber,
        socialInsuranceDetails: data.socialInsuranceDetails,
        healthInsuranceAttachment: healthInsuranceAttachment,
        nationality: data.nationality,
        religion: data.religion,
        maritalStatus: data.maritalStatus,
        ethnic: data.ethnic,
        professionalSkill: data.professionalSkill,
        foreignLanguage: data.foreignLanguage,
        educationalLevel: data.educationalLevel,
        experiences: experiences,
        careerPositions: careerPositions,
        workProcess: data.workProcess,
        certificates: certificates,
        degrees: degrees,
        contractEndDate: data.contractEndDate ? data.contractEndDate : null,
        contractType: data.contractType,
        contracts: contracts,
        insurrance: data.insurrance,
        courses: data.courses,
        archivedRecordNumber: data.archivedRecordNumber,
        files: files,
        phoneNumber: data.phoneNumber,
        phoneNumber2: data.phoneNumber2,
        personalEmail: data.personalEmail,
        personalEmail2: data.personalEmail2,
        homePhone: data.homePhone,
        emergencyContactPerson: data.emergencyContactPerson,
        relationWithEmergencyContactPerson:
            data.relationWithEmergencyContactPerson,
        emergencyContactPersonPhoneNumber:
            data.emergencyContactPersonPhoneNumber,
        emergencyContactPersonEmail: data.emergencyContactPersonEmail,
        emergencyContactPersonHomePhone: data.emergencyContactPersonHomePhone,
        emergencyContactPersonAddress: data.emergencyContactPersonAddress,
        permanentResidence: data.permanentResidence,
        permanentResidenceCountry: data.permanentResidenceCountry,
        permanentResidenceCity: data.permanentResidenceCity,
        permanentResidenceDistrict: data.permanentResidenceDistrict,
        permanentResidenceWard: data.permanentResidenceWard,
        temporaryResidence: data.temporaryResidence,
        temporaryResidenceCountry: data.temporaryResidenceCountry,
        temporaryResidenceCity: data.temporaryResidenceCity,
        temporaryResidenceDistrict: data.temporaryResidenceDistrict,
        temporaryResidenceWard: data.temporaryResidenceWard,
        houseHold: data.houseHold,
    });
    if (data.disciplines !== undefined) {
        let disciplines = data.disciplines;
        for (let x in disciplines) {
            await Discipline(connect(DB_CONNECTION, portal)).create({
                employee: createEmployee._id,
                company: company,
                decisionNumber: disciplines[x].decisionNumber,
                organizationalUnit: disciplines[x].organizationalUnit,
                startDate: disciplines[x].startDate,
                endDate: disciplines[x].endDate,
                type: disciplines[x].type,
                reason: disciplines[x].reason,
            });
        }
    }
    if (data.commendations !== undefined) {
        let commendations = data.commendations;
        for (let x in commendations) {
            await Commendation(connect(DB_CONNECTION, portal)).create({
                employee: createEmployee._id,
                company: company,
                decisionNumber: commendations[x].decisionNumber,
                organizationalUnit: commendations[x].organizationalUnit,
                startDate: commendations[x].startDate,
                type: commendations[x].type,
                reason: commendations[x].reason,
            });
        }
    }
    if (data.annualLeaves !== undefined) {
        let annualLeaves = data.annualLeaves;
        for (let x in annualLeaves) {
            AnnualLeave.create({
                employee: createEmployee._id,
                company: company,
                organizationalUnit: annualLeaves[x].organizationalUnit,
                startDate: annualLeaves[x].startDate,
                endDate: annualLeaves[x].endDate,
                status: annualLeaves[x].status,
                reason: annualLeaves[x].reason,
            });
        }
    }
    if (data.courses !== undefined) {
        let courses = data.courses;
        for (let x in courses) {
            Course.update(
                { _id: course[x].course },
                {
                    $push: {
                        results: {
                            employee: createEmployee._id,
                            result: courses[x].result,
                        },
                    },
                }
            );
        }
    }

    // Lấy thông tin nhân viên vừa thêm vào
    return await Employee(connect(DB_CONNECTION, portal)).findOne(
        {
            _id: createEmployee._id,
        },
        {
            field1: 1,
            employeeNumber: 1,
            emailInCompany: 1,
            birthdate: 1,
            contracts: 1,
            fullName: 1,
            gender: 1,
            contractEndDate: 1,
            contractType: 1,
            status: 1,
        }
    );
};

/**
 * Cập nhât thông tin nhân viên theo id
 */
exports.updateEmployeeInformation = async (
    portal,
    id,
    data,
    fileInfor,
    company
) => {
    let {
        employee,
        createExperiences,
        deleteExperiences,
        editExperiences,
        createWorkProcess,
        editWorkProcess,
        deleteWorkProcess,
        createDegrees,
        editDegrees,
        deleteDegrees,
        createCareerPosition,
        editCareerPosition,
        deleteCareerPosition,
        createCertificates,
        editCertificates,
        deleteCertificates,
        createContracts,
        editContracts,
        deleteContracts,
        createDisciplines,
        editDisciplines,
        deleteDisciplines,
        createCommendations,
        editConmmendations,
        deleteConmmendations,
        createAnnualLeaves,
        editAnnualLeaves,
        deleteAnnualLeaves,
        deleteCourses,
        editCourses,
        createCourses,
        createFiles,
        editFiles,
        deleteFiles,
        createSocialInsuranceDetails,
        editSocialInsuranceDetails,
        deleteSocialInsuranceDetails,
        houseHold, // dữ liệu về hộ khẩu - thành viên hộ gia đình
        roles, // dữ liệu về chức danh
    } = data;

    let avatar = employee.avatar,
        fileDegree = fileInfor.fileDegree,
        fileCertificate = fileInfor.fileCertificate,
        fileCareerPosition = fileInfor.fileCareerPosition,
        fileExperience = fileInfor.fileExperience,
        fileContract = fileInfor.fileContract,
        file = fileInfor.file;
    if (fileInfor.avatar) {
        avatar = fileInfor.avatar;
        let deleteAvatar = `.${employee.avatar}`;
        if (
            deleteAvatar !== `./upload/human-resource/avatars/avatar5.png` &&
            fs.existsSync(deleteAvatar)
        ) {
            fs.unlinkSync(deleteAvatar);
        }
    }
    let oldEmployee = await Employee(connect(DB_CONNECTION, portal)).findById(
        id
    );
    const oldMailInCompany = oldEmployee.emailInCompany;

    deleteEditCreateObjectInArrayObject = (
        arrObject,
        arrDelete,
        arrEdit,
        arrCreate,
        fileInfor = undefined
    ) => {
        if (arrDelete !== undefined) {
            for (let n in arrDelete) {
                let obj = arrDelete[n];
                if (obj.urlFile) {
                    let deleteAvatar = `.${obj.urlFile}`;
                    if (fs.existsSync(deleteAvatar)) {
                        fs.unlinkSync(deleteAvatar);
                    }
                }
                arrObject = arrObject.filter(
                    (x) => x._id.toString() !== arrDelete[n]._id
                );
            }
        }
        if (arrEdit !== undefined) {
            if (fileInfor !== undefined) {
                arrEdit = this.mergeUrlFileToObject(fileInfor, arrEdit);
            }
            for (let n in arrEdit) {
                arrObject = arrObject.map((x) => {
                    if (x._id.toString() !== arrEdit[n]._id) {
                        return x;
                    } else {
                        let obj = arrEdit[n];
                        if (
                            x.urlFile &&
                            obj.urlFile &&
                            x.urlFile !== obj.urlFile
                        ) {
                            let deleteAvatar = `.${x.urlFile}`;
                            if (fs.existsSync(deleteAvatar)) {
                                fs.unlinkSync(deleteAvatar);
                            }
                        }
                        return arrEdit[n];
                    }
                });
            }
        }
        if (arrCreate !== undefined) {
            if (fileInfor !== undefined) {
                arrCreate = this.mergeUrlFileToObject(fileInfor, arrCreate);
            }
            arrCreate.forEach((x) => arrObject.push(x));
        }
        return arrObject;
    };
    oldEmployee.experiences = deleteEditCreateObjectInArrayObject(
        oldEmployee.experiences,
        deleteExperiences,
        editExperiences,
        createExperiences,
        fileExperience
    );
    // oldEmployee.workProcess = deleteEditCreateObjectInArrayObject(
    //     oldEmployee.workProcess,
    //     deleteWorkProcess,
    //     editWorkProcess,
    //     createWorkProcess
    // );
    oldEmployee.socialInsuranceDetails = deleteEditCreateObjectInArrayObject(
        oldEmployee.socialInsuranceDetails,
        deleteSocialInsuranceDetails,
        editSocialInsuranceDetails,
        createSocialInsuranceDetails
    );

    oldEmployee.careerPositions = deleteEditCreateObjectInArrayObject(
        oldEmployee.careerPositions,
        deleteCareerPosition,
        editCareerPosition,
        createCareerPosition,
        fileCareerPosition
    );
    // oldEmployee.major = deleteEditCreateObjectInArrayObject(oldEmployee.major, deleteMajor, editMajor, createMajor, fileMajor);
    oldEmployee.degrees = deleteEditCreateObjectInArrayObject(
        oldEmployee.degrees,
        deleteDegrees,
        editDegrees,
        createDegrees,
        fileDegree
    );
    oldEmployee.certificates = deleteEditCreateObjectInArrayObject(
        oldEmployee.certificates,
        deleteCertificates,
        editCertificates,
        createCertificates,
        fileCertificate
    );
    oldEmployee.contracts = deleteEditCreateObjectInArrayObject(
        oldEmployee.contracts,
        deleteContracts,
        editContracts,
        createContracts,
        fileContract
    );
    oldEmployee.files = deleteEditCreateObjectInArrayObject(
        oldEmployee.files,
        deleteFiles,
        editFiles,
        createFiles,
        file
    );

    // let x = oldEmployee.career;
    // let careerEdit = {
    //     ...x,
    //     package: x.package,
    //     field: x.field && x.field._id,
    //     position: x.position ? x.position._id : null,
    //     action: x.action && x.action.length > 0 && x.action.map(e => e._id),
    // }

    // oldEmployee.career = careerEdit;

    oldEmployee.avatar = avatar;
    oldEmployee.fullName = employee.fullName;
    oldEmployee.employeeNumber = employee.employeeNumber;
    oldEmployee.employeeTimesheetId = employee.employeeTimesheetId;
    oldEmployee.gender = employee.gender;
    oldEmployee.status = employee.status;
    oldEmployee.startingDate = employee.startingDate;
    oldEmployee.leavingDate = employee.leavingDate;
    oldEmployee.birthdate = employee.birthdate;
    oldEmployee.birthplace = employee.birthplace;
    oldEmployee.identityCardNumber = employee.identityCardNumber;
    oldEmployee.identityCardDate = employee.identityCardDate;
    oldEmployee.identityCardAddress = employee.identityCardAddress;
    oldEmployee.emailInCompany = employee.emailInCompany;
    oldEmployee.taxNumber = employee.taxNumber;
    oldEmployee.taxRepresentative = employee.taxRepresentative;
    oldEmployee.taxDateOfIssue = employee.taxDateOfIssue
        ? employee.taxDateOfIssue
        : null;
    oldEmployee.taxAuthority = employee.taxAuthority;
    oldEmployee.atmNumber = employee.atmNumber;
    oldEmployee.bankName = employee.bankName;
    oldEmployee.bankAddress = employee.bankAddress;
    oldEmployee.healthInsuranceNumber = employee.healthInsuranceNumber;
    oldEmployee.healthInsuranceStartDate = employee.healthInsuranceStartDate;
    oldEmployee.healthInsuranceEndDate = employee.healthInsuranceEndDate;
    oldEmployee.socialInsuranceNumber = employee.socialInsuranceNumber;
    oldEmployee.nationality = employee.nationality;
    oldEmployee.religion = employee.religion;
    oldEmployee.maritalStatus = employee.maritalStatus;
    oldEmployee.ethnic = employee.ethnic;
    oldEmployee.professionalSkill = employee.professionalSkill;
    oldEmployee.foreignLanguage = employee.foreignLanguage;
    oldEmployee.educationalLevel = employee.educationalLevel;
    oldEmployee.insurrance = employee.insurrance;
    oldEmployee.archivedRecordNumber = employee.archivedRecordNumber;
    oldEmployee.phoneNumber = employee.phoneNumber;
    oldEmployee.phoneNumber2 = employee.phoneNumber2;
    oldEmployee.personalEmail = employee.personalEmail;
    oldEmployee.personalEmail2 = employee.personalEmail2;
    oldEmployee.homePhone = employee.homePhone;
    oldEmployee.emergencyContactPerson = employee.emergencyContactPerson;
    oldEmployee.relationWithEmergencyContactPerson =
        employee.relationWithEmergencyContactPerson;
    oldEmployee.emergencyContactPersonPhoneNumber =
        employee.emergencyContactPersonPhoneNumber;
    oldEmployee.emergencyContactPersonEmail =
        employee.emergencyContactPersonEmail;
    oldEmployee.emergencyContactPersonHomePhone =
        employee.emergencyContactPersonHomePhone;
    oldEmployee.emergencyContactPersonAddress =
        employee.emergencyContactPersonAddress;
    oldEmployee.permanentResidence = employee.permanentResidence;
    oldEmployee.permanentResidenceCountry = employee.permanentResidenceCountry;
    oldEmployee.permanentResidenceCity = employee.permanentResidenceCity;
    oldEmployee.permanentResidenceDistrict =
        employee.permanentResidenceDistrict;
    oldEmployee.permanentResidenceWard = employee.permanentResidenceWard;
    oldEmployee.temporaryResidence = employee.temporaryResidence;
    oldEmployee.temporaryResidenceCountry = employee.temporaryResidenceCountry;
    oldEmployee.temporaryResidenceCity = employee.temporaryResidenceCity;
    oldEmployee.temporaryResidenceDistrict =
        employee.temporaryResidenceDistrict;
    oldEmployee.temporaryResidenceWard = employee.temporaryResidenceWard;
    oldEmployee.contractEndDate = employee.contractEndDate
        ? employee.contractEndDate
        : null;
    oldEmployee.contractType = employee.contractType;
    oldEmployee.biddingPackageEndDate = employee.biddingPackageEndDate;
    oldEmployee.biddingPackagePersonalStatus =
        employee.biddingPackagePersonalStatus;
    oldEmployee.houseHold = houseHold;

    // Edit  thông tin nhân viên
    oldEmployee.save();

    // Function edit, create, Delete Document of collection
    queryEditCreateDeleteDocumentInCollection = async (
        employeeId,
        company,
        collection,
        arrDelete,
        arrEdit,
        arrCreate
    ) => {
        let queryDelete =
            arrDelete !== undefined
                ? arrDelete.map((x) => {
                    return {
                        deleteOne: {
                            filter: {
                                _id: x._id,
                            },
                        },
                    };
                })
                : [];
        let queryEdit =
            arrEdit !== undefined
                ? arrEdit.map((x) => {
                    return {
                        updateOne: {
                            filter: {
                                _id: x._id,
                            },
                            update: {
                                $set: x,
                            },
                        },
                    };
                })
                : [];
        let queryCrete =
            arrCreate !== undefined
                ? arrCreate.map((x) => {
                    return {
                        insertOne: {
                            document: {
                                ...x,
                                employee: employeeId,
                                company: company,
                            },
                        },
                    };
                })
                : [];
        let query = [...queryDelete, ...queryEdit, ...queryCrete];
        if (query.length !== 0) {
            await collection(connect(DB_CONNECTION, portal)).bulkWrite(query);
        }
    };
    queryEditCreateDeleteDocumentInCollection(
        oldEmployee._id,
        company,
        Discipline,
        deleteDisciplines,
        editDisciplines,
        createDisciplines
    );
    queryEditCreateDeleteDocumentInCollection(
        oldEmployee._id,
        company,
        Commendation,
        deleteConmmendations,
        editConmmendations,
        createCommendations
    );
    queryEditCreateDeleteDocumentInCollection(
        oldEmployee._id,
        company,
        AnnualLeave,
        deleteAnnualLeaves,
        editAnnualLeaves,
        createAnnualLeaves
    );
    queryEditCreateDeleteDocumentInCollection(
        oldEmployee._id,
        company,
        Course,
        deleteCourses,
        editCourses,
        createCourses
    );

    if (employee.emailInCompany) {
        // Kiểm tra xem email mới của nhân viên có tồn tại trong bảng user hay chưa
        const user = await User(connect(DB_CONNECTION, portal)).findOne({
            email: employee.emailInCompany,
        });

        // Kiểm tra nhân viên được edit  có tài khoản người dùng hay chưa.
        const oldUser = await User(connect(DB_CONNECTION, portal))
            .findOne({
                email: oldMailInCompany,
            })
            .populate([
                {
                    path: "roles",
                    populate: {
                        path: "roleId",
                        populate: { path: "type" },
                    },
                },
            ]);

        let rootRole = [];
        oldUser &&
            oldUser.roles &&
            oldUser.roles.length > 0 &&
            oldUser.roles.forEach((o) => {
                if (
                    o?.roleId?.type?.name === "Root" ||
                    o?.roleId?.type?.name === "Company-Defined"
                )
                    rootRole = [...rootRole, o.roleId._id];
            });
        if (roles && roles.length > 0) {
            roles = [...roles, ...rootRole];
        }

        // Nếu email mới chưa trùng trong bảng user và employees đang chỉnh sửa đã có tài khoản đăng nhạp vào hệ thống.
        if (
            (!user || (user && employee.emailInCompany === oldUser.email)) &&
            oldUser
        ) {
            await User(connect(DB_CONNECTION, portal)).findOneAndUpdate(
                {
                    email: oldMailInCompany,
                },
                {
                    $set: { email: employee.emailInCompany },
                }
            );

            await UserRole(connect(DB_CONNECTION, portal)).deleteMany({
                userId: oldUser._id,
            });

            if (roles && roles.length > 0)
                for (let x in roles) {
                    if (roles[x])
                        await RoleService.createRelationshipUserRole(
                            portal,
                            oldUser._id,
                            roles[x]
                        );
                }
        }

        // Nếu email mới chưa trùng trong bảng user và employees đang chỉnh sửa chưa có tài khoản thì tạo mới.
        if (!user && !oldUser) {
            let userInfo = {
                email: employee.emailInCompany,
                name: employee.fullName,
            };

            let user = await UserService.createUser(portal, userInfo, company);
            if (roles && roles.length > 0)
                for (let x in roles) {
                    if (roles[x])
                        await RoleService.createRelationshipUserRole(
                            portal,
                            user._id,
                            roles[x]
                        );
                }
        }
    }

    // Lấy thông tin nhân viên vừa chỉnh sửa
    return await Employee(connect(DB_CONNECTION, portal)).findOne(
        {
            _id: id,
        },
        {
            field1: 1,
            employeeNumber: 1,
            emailInCompany: 1,
            birthdate: 1,
            contracts: 1,
            fullName: 1,
            gender: 1,
            contractEndDate: 1,
            contractType: 1,
            status: 1,
            houseHold: 1,
        }
    );
};

/**
 * Xoá thông tin nhân viên
 * @id : Id nhân viên cần xoá
 */
exports.deleteEmployee = async (portal, id) => {
    let employee = await Employee(
        connect(DB_CONNECTION, portal)
    ).findOneAndDelete({
        _id: id,
    });
    await Discipline(connect(DB_CONNECTION, portal)).deleteMany({
        employee: id,
    });
    await Commendation(connect(DB_CONNECTION, portal)).deleteMany({
        employee: id,
    });
    await AnnualLeave(connect(DB_CONNECTION, portal)).deleteMany({
        employee: id,
    });
    await Salary(connect(DB_CONNECTION, portal)).deleteMany({
        employee: id,
    });
    await Timesheet(connect(DB_CONNECTION, portal)).deleteMany({
        employee: id,
    });
    if (employee?.avatar) {
        let deleteAvatar = `.${employee.avatar}`;
        if (
            deleteAvatar !== `./upload/human-resource/avatars/avatar5.png` &&
            fs.existsSync(deleteAvatar)
        ) {
            fs.unlinkSync(deleteAvatar);
        }
    }
    if (employee?.degrees?.length) {
        employee.degrees.forEach((x) => {
            if (x?.urlFile) {
                let deleteDegrees = `.${x.urlFile}`;
                if (fs.existsSync(deleteDegrees)) {
                    fs.unlinkSync(deleteDegrees);
                }
            }
        });
    }
    if (employee?.certificates?.length) {
        employee.certificates.forEach((x) => {
            if (x?.urlFile) {
                let deleteCertificates = `.${x.urlFile}`;
                if (fs.existsSync(deleteCertificates)) {
                    fs.unlinkSync(deleteCertificates);
                }
            }
        });
    }

    if (employee?.contracts?.length) {
        employee.contracts.forEach((x) => {
            if (x?.urlFile) {
                let deleteContracts = `.${x.urlFile}`;
                if (fs.existsSync(deleteContracts)) {
                    fs.unlinkSync(deleteContracts);
                }
            }
        });
    }

    if (employee?.files?.length) {
        employee.files.forEach((x) => {
            if (x?.urlFile) {
                let deleteFiles = `.${x.urlFile}`;
                if (fs.existsSync(deleteFiles)) {
                    fs.unlinkSync(deleteFiles);
                }
            }
        });
    }
    return employee;
};

/**
 * Kiểm tra sự tồn tại của MSNV
 * @employeeNumber : Mã số nhân viên
 * @company : Id công ty
 */
exports.checkEmployeeExisted = async (portal, employeeNumber, company) => {
    let employee = await Employee(connect(DB_CONNECTION, portal)).find(
        {
            employeeNumber: employeeNumber,
            company: company,
        },
        {
            field1: 1,
        }
    );
    let checkMSNV = false;
    if (employee.length !== 0) {
        checkMSNV = true;
    }
    return checkMSNV;
};

/**
 * Kiểm tra sự tồn tại của email công ty
 * @email : Mã số nhân viên
 */
exports.checkEmployeeCompanyEmailExisted = async (portal, email) => {
    let employee = await Employee(connect(DB_CONNECTION, portal)).find(
        {
            emailInCompany: email,
        },
        {
            field1: 1,
        }
    );
    let checkEmail = false;
    if (employee.length !== 0) {
        checkEmail = true;
    }
    return checkEmail;
};

/**
 * Hàm tiện ích dùng cho các function bên dưới
 * Format dữ liệu date thành dạng string dd-mm
 */
exports.formatDate = (date, monthDay = true) => {
    var d = new Date(date),
        year = "" + d.getFullYear(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (monthDay) {
        return [day, month].join("-");
    } else {
        return [year, month, day].join("-");
    }
};

/**
 * Tạo thông báo cho các nhân viên có ngày sinh trùng với ngày hiện tại
 * @param {*} portal : Tên ngắn công ty
 */
exports.createNotificationForEmployeesHaveBrithdayCurrent = async (portal) => {
    let employees = await Employee(connect(DB_CONNECTION, portal)).find(
        {},
        {
            birthdate: 1,
            emailInCompany: 1,
        }
    );
    employees = employees.filter(
        (x) => this.formatDate(x.birthdate) === this.formatDate(new Date())
    );
    emails = employees.map((x) => x.emailInCompany);
    users = await User(connect(DB_CONNECTION, portal)).find(
        {
            email: {
                $in: emails,
            },
        },
        {
            _id: 1,
            company: 1,
            email: 1,
            name: 1,
        }
    );

    // Tạo thông báo cho người có ngày sinh nhật trùng với ngày hiện tại
    let notifications = users.map((user) => {
        return {
            company: user.company,
            title: "Thông báo sinh nhật",
            level: "info",
            content: "Chúc bạn có một ngày sinh nhật vui vẻ",
            sender: process.env.WEB_NAME,
            user: user._id,
            manualNotification: undefined,
        };
    });

    // Tạo thông báo cho nhân viên cùng phòng ban với người có sinh nhật là ngày hiện tại
    for (let n in users) {
        // Lấy id phòng ban của nhân viên có sinh nhật là hôm nay
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(
            portal,
            users[n].email
        );
        let unitId = value.organizationalUnits;
        let roles = [];
        unitId.forEach((x) => {
            roles = roles
                .concat(x.managers)
                .concat(x.deputyManagers)
                .concat(x.employees);
        });
        // Lấy danh sách nhân viên cùng phòng ban với người
        let usersArr = await UserRole(connect(DB_CONNECTION, portal)).find(
            {
                roleId: {
                    $in: roles,
                },
            },
            {
                userId: 1,
            }
        );
        usersArr = usersArr.map((x) => x.userId.toString());
        for (let i = 0, max = usersArr.length; i < max; i++) {
            if (
                usersArr.indexOf(usersArr[i]) !==
                usersArr.lastIndexOf(usersArr[i]) ||
                usersArr[i] === users[n]._id.toString()
            ) {
                usersArr.splice(usersArr.indexOf(usersArr[i]), 1);
                i--;
            }
        }
        let notificationsArr = usersArr.map((x) => {
            return {
                company: users[n].company,
                title: "Thông báo sinh nhật",
                level: "info",
                content: `Hôm nay là sinh nhật của ${users[n].name}. Hãy gửi những lời chúc đến ${users[n].name}`,
                sender: process.env.WEB_NAME,
                user: x,
                manualNotification: undefined,
            };
        });
        notifications = notifications.concat(notificationsArr);
    }
    let result = await Notification(connect(DB_CONNECTION, portal)).insertMany(
        notifications
    );
};

// /**
//  * Tạo thông báo cho nhân viên khi hết hạn ký hợp đồng làm việc
//  * @param {*} portal : Tên ngắn công ty
//  */
// exports.createNotificationEndOfContract = async (portal) => {
//     let arrayTime = [30, 15];
//     let dateNow = new Date(this.formatDate(new Date(), false));
//     let notifications = [];
//     for (let n in arrayTime) {
//         let dateCheck = new Date(
//             dateNow.getFullYear(),
//             dateNow.getMonth(),
//             dateNow.getDate() + arrayTime[n]
//         );
//         dateCheck = new Date(this.formatDate(dateCheck, false));
//         let employees = await Employee(connect(DB_CONNECTION, portal)).find(
//             {
//                 contractEndDate: dateCheck,
//             },
//             {
//                 emailInCompany: 1,
//                 _id: 1,
//             }
//         );
//
//         // Lấy thời gian phải gia hạn hợp đồng do được học các khoá đào tạo có thời gian cam kết
//         for (let i in employees) {
//             let infoCourses = await EmployeeCourse(
//                 connect(DB_CONNECTION, portal)
//             )
//                 .find(
//                     {
//                         employee: employees[i]._id,
//                     },
//                     {
//                         course: 1,
//                     }
//                 )
//                 .populate({
//                     path: "course",
//                     select: "endDate employeeCommitmentTime",
//                 });
//             let endDateCommitmentTimes = infoCourses.map((x) => {
//                 let endDateCourse = new Date(x.course.endDate);
//                 let endDateCommitmentTime = new Date(
//                     endDateCourse.getFullYear(),
//                     endDateCourse.getMonth() +
//                     Number(x.course.employeeCommitmentTime),
//                     endDateCourse.getDate()
//                 );
//                 return endDateCommitmentTime;
//             });
//             endDateCommitmentTimes.filter(
//                 (x) => x.getTime() > dateCheck.getTime()
//             );
//             let maxCommitmentTime = endDateCommitmentTimes[0];
//             if (endDateCommitmentTimes.length !== 0) {
//                 endDateCommitmentTimes.forEach((x) => {
//                     if (x.getTime() > maxCommitmentTime.getTime()) {
//                         maxCommitmentTime = x;
//                     }
//                 });
//             }
//             employees[i] = {
//                 ...employees[i]._doc,
//                 endDateCommitmentTime: maxCommitmentTime,
//             };
//         }
//
//         // Lấy thông tin tài khoản ứng với mỗi nhân viên
//         let emails = employees.map((x) => x.emailInCompany);
//         let users = await User(connect(DB_CONNECTION, portal)).find(
//             {
//                 email: {
//                     $in: emails,
//                 },
//             },
//             {
//                 _id: 1,
//                 company: 1,
//                 email: 1,
//                 name: 1,
//             }
//         );
//         // Tạo thông báo cho nhân viên
//         users.forEach((user, index) => {
//             let notification = {
//                 company: user.company,
//                 title: "Thông báo hết hạn hợp đồng lao động",
//                 level: "important",
//                 content:
//                     `Hợp đồng lao động của bạn sẽ hết hiệu lực sau ${arrayTime[n]} ngày.` +
//                     `${employees[index].endDateCommitmentTime
//                         ? " Tuy nhiên bạn phải làm thêm đến ngày " +
//                         this.formatDate(
//                             employees[index].endDateCommitmentTime,
//                             false
//                         ) +
//                         " do bạn tham gia các khoá học có thời gian cam kết làm việc sau khi học xong khoá đào tạo."
//                         : ""
//                     }`,
//                 sender: process.env.WEB_NAME,
//                 user: user._id,
//                 manualNotification: undefined,
//             };
//             notifications = [...notifications, notification];
//         });
//     }
//     await Notification(connect(DB_CONNECTION, portal)).insertMany(
//         notifications
//     );
// };

/**
 * Import thông tin nhân viên
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu thông tin nhân viên cần import
 */
exports.importEmployeeInfor = async (portal, company, data) => {
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(
        {
            company: company,
        },
        {
            employeeNumber: 1,
            _id: 1,
            emailInCompany: 1,
            employeeTimesheetId: 1,
        }
    );

    let rowError = [];
    data = data.map((x, index) => {
        // Check lỗi trùng mã nhân viên, mã chấm công, email
        let checkEmployeeNumber, checkEmailInCompany, checkEmployeeTimesheetId;
        if (x.employeeNumber)
            checkEmployeeNumber = employeeInfo.some(
                (y) =>
                    y?.employeeNumber?.toString() ===
                    x?.employeeNumber?.toString()
            );

        if (x.emailInCompany)
            checkEmailInCompany = employeeInfo.some(
                (y) => y.emailInCompany === x.emailInCompany
            );

        if (x.employeeTimesheetId)
            checkEmployeeTimesheetId = employeeInfo.some(
                (y) =>
                    y?.employeeTimesheetId?.toString() ===
                    x?.employeeTimesheetId?.toString()
            );

        if (checkEmployeeNumber) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "employee_number_have_exist"],
                error: true,
            };
        }
        if (checkEmailInCompany) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "email_in_company_have_exist"],
                error: true,
            };
        }
        if (checkEmployeeTimesheetId) {
            x = {
                ...x,
                errorAlert: [
                    ...x.errorAlert,
                    "employee_timesheet_id_have_exist",
                ],
                error: true,
            };
        }
        if (
            checkEmployeeNumber ||
            checkEmailInCompany ||
            checkEmployeeTimesheetId
        ) {
            rowError = [...rowError, index + 1];
        }
        return {
            ...x,
            avatar: "/upload/human-resource/avatars/avatar5.png",
            company: company,
        };
    });

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            employeesInfor: data,
            rowErrorOfEmployeeInfor: rowError,
        };
    } else {
        return await Employee(connect(DB_CONNECTION, portal)).insertMany(data);
    }
};

/**
 * Import thông tin nhân viên
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu thông tin nhân viên cần import
 */
exports.importUpdateEmployeeInfor = async (portal, company, data) => {
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(
        {
            company: company,
        },
        {
            employeeNumber: 1,
            _id: 1,
            emailInCompany: 1,
            employeeTimesheetId: 1,
        }
    );

    const dataLength = data.length;
    for (let i = 0; i < dataLength; i++) {
        let checkEmployeeNumber, checkEmailInCompany, checkEmployeeTimesheetId;
        if (data[i].employeeNumber)
            checkEmployeeNumber = employeeInfo.filter(
                (y) =>
                    y.employeeNumber.toString() ===
                    data[i].employeeNumber.toString()
            );

        if (data[i].emailInCompany)
            checkEmailInCompany = employeeInfo.filter(
                (y) => y.emailInCompany === data[i].emailInCompany
            );

        if (data[i].employeeTimesheetId)
            checkEmployeeTimesheetId = employeeInfo.filter(
                (y) =>
                    y.employeeTimesheetId.toString() ===
                    data[i].employeeTimesheetId.toString()
            );

        // Nếu mã NV tồn tại và duy nhất thì cập nhật, ko thì bỏ qua
        if (
            checkEmployeeNumber?.length === 1 &&
            (checkEmailInCompany?.length === 0 ||
                checkEmployeeNumber[0]?.emailInCompany ===
                data[i].emailInCompany)
        ) {
            data[i] = {
                ...data[i],
                updateFlag: true,
            };
        }

        // NẾu nhân viên nào
        if (
            checkEmployeeNumber?.length === 1 &&
            checkEmailInCompany?.length === 0 &&
            data[i].emailInCompany &&
            checkEmployeeNumber?.[0]?.emailInCompany !== data[i].emailInCompany
        ) {
            const getUser = await User(connect(DB_CONNECTION, portal)).findOne({
                email: data[i].emailInCompany,
            });
            if (!getUser)
                data[i] = {
                    ...data[i],
                    updateUserFlag: true,
                };
        }
        let positionIdConvert = [];
        if (data[i]?.positionId?.length) {
            data[i]?.positionId.forEach((x) => {
                if (x) positionIdConvert = [...positionIdConvert, x];
            });
        }
        data[i] = {
            ...data[i],
            positionId: positionIdConvert,
        };

        Object.keys(data[i]).forEach(
            (key) => data[i][key] == null && delete data[i][key]
        );
    }

    for (let i = 0; i < data?.length; i++) {
        if (data[i].updateFlag) {
            await Employee(connect(DB_CONNECTION, portal)).updateOne(
                { employeeNumber: data[i]?.employeeNumber },
                data[i]
            );
        }

        const checkEmployeeNumber = employeeInfo.filter(
            (y) =>
                y.employeeNumber.toString() ===
                data[i].employeeNumber.toString()
        );
        if (checkEmployeeNumber?.length === 1 && data[i]?.positionId?.length) {
            const employee = employeeInfo.filter(
                (y) =>
                    y.employeeNumber.toString() ===
                    data[i].employeeNumber.toString()
            );

            if (employee?.length) {
                const user = await User(connect(DB_CONNECTION, portal)).findOne(
                    {
                        email: employee[0]?.emailInCompany,
                    }
                );
                if (user) {
                    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({
                        userId: user._id,
                    });

                    for (let k = 0; k < data[i]?.positionId?.length; k++) {
                        if (data[i]?.positionId[k])
                            await UserRole(
                                connect(DB_CONNECTION, portal)
                            ).create({
                                userId: user._id,
                                roleId: data[i].positionId[k],
                            });
                    }
                }
            }
        }

        if (data[i].updateUserFlag) {
            const employee = employeeInfo.filter(
                (y) =>
                    y.employeeNumber.toString() ===
                    data[i].employeeNumber.toString()
            );
            if (employee?.length)
                await User(connect(DB_CONNECTION, portal)).updateOne(
                    { email: employee[0].emailInCompany },
                    { email: data[i].emailInCompany }
                );
        }
    }
};

/**
 * Hàm tiện ích dùng để kiểm tra mã số nhân viên trong dữ liệu import có tồn tại ko
 * Dùng cho các function import bên dưới
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu import
 */
exports.checkImportData = async (portal, company, data) => {
    let employeeInfo = await Employee(connect(DB_CONNECTION, portal)).find(
        {
            company: company,
        },
        {
            employeeNumber: 1,
            _id: 1,
        }
    );
    let rowError = [];
    data = data.map((x, index) => {
        let employee = employeeInfo.filter(
            (y) => y.employeeNumber.toString() === x.employeeNumber.toString()
        );
        if (employee.length === 0) {
            x = {
                ...x,
                errorAlert: [...x.errorAlert, "staff_code_not_find"],
                error: true,
            };
            rowError = [...rowError, index + 1];
        } else {
            x = {
                ...x,
                _id: employee[0]._id,
            };
        }
        return x;
    });
    return {
        data: data,
        rowError: rowError,
    };
};

/**
 * Import kinh nghiệm làm việc
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu kinh nghiệm làm việc cần import
 */
exports.importExperience = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            experiences: data,
            rowErrorOfExperience: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                experiences: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.experiences.push(y);
                }
            });
            return result;
        });

        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.experiences = editEmployee.experiences.concat(
                x.experiences
            );
            editEmployee.save();
        }
        return data;
    }
};

exports.importWorkProcess = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            workProcess: data,
            rowErrorOfExperience: rowErrorOfWorkProcess,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                workProcess: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.workProcess.push(y);
                }
            });
            return result;
        });

        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.workProcess = editEmployee.workProcess.concat(
                x.workProcess
            );
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import thông tin bằng cấp
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu thông tin bằng cấp cần import
 */
exports.importDegree = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            degrees: data,
            rowErrorOfDegree: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }

        importData = importData.map((x) => {
            let result = {
                _id: x,
                degrees: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.degrees.push(y);
                }
            });
            return result;
        });
        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.degrees = editEmployee.degrees.concat(x.degrees);
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import thông tin chứng chỉ
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu thông tin chứng chỉ cần import
 */
exports.importCertificate = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            certificates: data,
            rowErrorOfCertificate: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                certificates: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.certificates.push(y);
                }
            });
            return result;
        });
        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.certificates = editEmployee.certificates.concat(
                x.certificates
            );
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import hợp đồng lao động
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu hợp đồng lao động cần import
 */
exports.importContract = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            contracts: data,
            rowErrorOfContract: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                contracts: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.contracts.push(y);
                }
            });
            return result;
        });
        for (let x of importData) {
            let crurrentContract = x.contracts[0];
            x.contracts.forEach((y) => {
                if (
                    new Date(crurrentContract.startDate).getTime() <
                    new Date(y.startDate).getTime()
                ) {
                    crurrentContract = y;
                }
            });
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });

            if (
                crurrentContract.endDate &&
                editEmployee.contractEndDate &&
                new Date(crurrentContract.endDate).getTime() >
                new Date(editEmployee.contractEndDate).getTime()
            ) {
                editEmployee.contractEndDate = crurrentContract.endDate;
                editEmployee.contractType = crurrentContract.contractType;
            } else if (
                crurrentContract.endDate &&
                !editEmployee.contractEndDate
            ) {
                editEmployee.contractEndDate = crurrentContract.endDate;
                editEmployee.contractType = crurrentContract.contractType;
            }

            editEmployee.contracts = editEmployee.contracts.concat(x.contracts);
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import quá trình đóng bảo hiểm xã hội
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu quá trình đóng bảo hiểm xã hội cần import
 */
exports.importSocialInsuranceDetails = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            socialInsuranceDetails: data,
            rowErrorOfSocialInsuranceDetails: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                socialInsuranceDetails: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.socialInsuranceDetails.push(y);
                }
            });
            return result;
        });

        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.socialInsuranceDetails =
                editEmployee.socialInsuranceDetails.concat(
                    x.socialInsuranceDetails
                );
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import thông tin tài liệu đính kèm
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu tài liệu đính kèm cần import
 */
exports.importFile = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            files: data,
            rowErrorOfFile: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                files: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.files.push(y);
                }
            });
            return result;
        });
        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.files = editEmployee.files.concat(x.files);
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Import thông tin thành viên gia đình
 * @param {*} company : Id công ty
 * @param {*} data : Dữ liệu thành viên gia đình cần import
 */
exports.importFamily = async (portal, company, data) => {
    let result = await this.checkImportData(portal, company, data);
    data = result.data;
    let rowError = result.rowError;

    if (rowError.length !== 0) {
        return {
            errorStatus: true,
            files: data,
            rowErrorOfFile: rowError,
        };
    } else {
        let importData = [];
        for (let x of data) {
            if (!importData.includes(x._id)) {
                importData = [...importData, x._id];
            }
        }
        importData = importData.map((x) => {
            let result = {
                _id: x,
                familyMembers: [],
            };
            data.forEach((y) => {
                if (y._id === x) {
                    result.familyMembers.push(y);
                }
            });
            return result;
        });
        for (let x of importData) {
            let editEmployee = await Employee(
                connect(DB_CONNECTION, portal)
            ).findOne({
                _id: x._id,
            });
            editEmployee.houseHold.familyMembers =
                editEmployee.houseHold.familyMembers.concat(x.familyMembers);
            editEmployee.save();
        }
        return data;
    }
};

/**
 * Hàm tính tổng số năm kinh nghiệm tương đương
 * @param {*} params
 */
exports.calcSumOfExp = (data) => {
    let sum = 0;
    for (let i in data) {
        let start = new Date(data[i].startDate).getTime();
        let end = new Date(data[i].endDate).getTime();

        sum = sum + (end - start);
    }

    return sum;
};

/**
 * Lấy danh sách nhân viên theo key tìm kiếm
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người tìm kiếm
 */

const checkEmployeePackageValid = async (employees, require, otherEmployee) => {
    let result = [];
    if (require.majors) {
        let result = employees.filter((x) => {
            let isValid = false;
            x.degrees.map((x) => {
                x;
            });
        });
    }
};

exports.searchEmployeeForPackage = async (portal, params, companyId) => {
    let noResultsPerPage = parseInt(params.limit);
    let pageNumber = parseInt(params.page);
    let keySearch = [{ $match: { status: "active" } }];

    if (
        params.biddingPackagePersonalStatus &&
        params.biddingPackagePersonalStatus.length
    ) {
        keySearch = [
            ...keySearch,
            {
                $match: {
                    biddingPackagePersonalStatus: {
                        $in: params.biddingPackagePersonalStatus,
                    },
                },
            },
        ];
    } else {
        keySearch = [
            ...keySearch,
            {
                $match: {
                    biddingPackagePersonalStatus: 1,
                },
            },
        ];
    }

    if (params.majors) {
        // Bắt sựu kiện theo chuyên ngành
        if (params.professionalSkill) {
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        $and: [
                            {
                                "degrees.major": {
                                    $in: params.majors.map((item) =>
                                        mongoose.Types.ObjectId(item)
                                    ),
                                },
                            },
                            {
                                "degrees.degreeQualification": {
                                    $gte: Number(params.professionalSkill),
                                },
                            },
                        ],
                    },
                },
            ];
        } else {
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        "degrees.major": {
                            $in: params.majors.map((item) =>
                                mongoose.Types.ObjectId(item)
                            ),
                        },
                    },
                },
            ];
        }
    } else {
        if (params.professionalSkill) {
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        "degrees.degreeQualification": {
                            $gte: Number(params.professionalSkill),
                        },
                    },
                },
            ];
        }
    }

    // Bắt sự kiện tìm kiếm theo số năm kinh nghiệm
    if (params.exp) {
        let year = new Date();
        let yearOfExp = year.getFullYear() - params.exp;
        year.setFullYear(yearOfExp);
        let lever = 2;
        if (
            params.professionalSkill &&
            Number(params.professionalSkill) < lever
        ) {
            lever = Number(params.professionalSkill);
        }

        keySearch = [
            ...keySearch,
            {
                $match: {
                    $and: [
                        {
                            "degrees.year": {
                                $lte: year,
                            },
                        },
                        {
                            "degrees.degreeQualification": {
                                $gte: lever,
                            },
                        },
                    ],
                },
            },
        ];
    }

    // Bắt sựu kiện theo tên chứng chỉ
    if (params.certificates) {
        let certificatesCount = 1;
        if (params.certificatesCount) {
            certificatesCount = Number(params.certificatesCount);
        }

        keySearch = [
            ...keySearch,
            {
                $unwind: "$certificates",
            },
            {
                $match: {
                    "certificates.certificate": {
                        $in: params.certificates.map((item) =>
                            mongoose.Types.ObjectId(item)
                        ),
                    },
                },
            },
        ];

        if (params.certificatesEndDate) {
            let splitter = params.certificatesEndDate.split("-");
            let date = new Date(splitter[2], splitter[1] - 1, splitter[0]);
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        "certificates.endDate": {
                            $gte: date,
                        },
                    },
                },
            ];
        }

        keySearch = [
            ...keySearch,
            {
                $group: {
                    _id: "$_id",
                    careerPositions: { $first: "$careerPositions" },
                    count: { $sum: 1 },
                },
            },
            {
                $match: { count: { $gte: certificatesCount } },
            },
        ];
    }

    // Bắt sựu kiện tìm kiếm vị trí cv
    if (
        params.careerPosition &&
        params.careerPosition?.length &&
        params.sameExp
    ) {
        keySearch = [
            ...keySearch,
            {
                $unwind: "$careerPositions",
            },
            {
                $match: {
                    "careerPositions.careerPosition": {
                        $in: params.careerPosition.map((item) =>
                            mongoose.Types.ObjectId(item)
                        ),
                    },
                },
            },
        ];
    }

    if (params.sameExp || params.numblePackageWorkInCarreer) {
        let expInMiliseconds = params.sameExp * 86400000 * 365;

        keySearch = [
            ...keySearch,
            {
                $unwind: "$careerPositions",
            },
            {
                $addFields: {
                    "careerPositions._id": "$_id",
                },
            },
            {
                $replaceRoot: {
                    newRoot: "$careerPositions",
                },
            },
            {
                $project: {
                    position: 1,
                    action: 1,
                    field: 1,
                    package: 1,
                    empId: 1,
                    dateDifference: {
                        $subtract: ["$endDate", "$startDate"],
                    },
                    id: "$_id",
                },
            },
        ];

        // kiểm tra thêm điều kiện để dùng group

        keySearch = [
            ...keySearch,
            {
                $group: {
                    _id: "$_id",
                    totalExp: {
                        $sum: "$dateDifference",
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
        ];

        if (params.sameExp) {
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        totalExp: {
                            $gte: expInMiliseconds,
                        },
                    },
                },
            ];
        }

        if (params.numblePackageWorkInCarreer) {
            keySearch = [
                ...keySearch,
                {
                    $match: {
                        count: {
                            $gte: params.numblePackageWorkInCarreer,
                        },
                    },
                },
            ];
        }
    }

    console.log("xxxxxxxxxxxxxx", keySearch);

    // Lấy danh sách nhân viên
    let listData = [];
    let listEmployees = [];
    let totalList = 1000;

    listData = await Employee(connect(DB_CONNECTION, portal)).aggregate(
        keySearch
    );

    let listEmpId = listData.map((e) => e._id.toString());
    // if (params.sameExp || params.certificates) {
    //     listEmpId = listData.map((e) => e._id.employee.toString());
    // } else {
    //     listEmpId = listData.map((e) => e._id.toString());
    // }

    return listEmpId;
};

exports.getEmployeeByPackageId = async (
    portal,
    biddingPackageId,
    companyId
) => {
    let biddingPackage = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).find({
        _id: {
            $in: mongoose.Types.ObjectId(biddingPackageId),
        },
    });

    let employees = [];

    let numberEmployees = biddingPackage[0]?.keyPersonnelRequires.map(
        (item) => item.count
    );

    for (const require of biddingPackage[0]?.keyPersonnelRequires) {
        let careerPosition = require?.careerPosition
            ? [String(require?.careerPosition)]
            : [];
        let sameCareerPositions = require?.sameCareerPosition
            ? require?.sameCareerPosition.map((item) => String(item))
            : [];
        let careerPositions = Array.from(
            new Set(careerPosition.concat(sameCareerPositions))
        );
        if (require) {
            let params = {
                careerPosition: careerPositions ? careerPositions : NaN,
                professionalSkill: require?.professionalSkill
                    ? Number(require?.professionalSkill)
                    : NaN,
                majors: require?.majors
                    ? require?.majors?.map((item) => String(item))
                    : NaN,
                certificates: require?.certificateRequirements?.certificates
                    ? require?.certificateRequirements?.certificates?.map(
                        (item) => String(item)
                    )
                    : NaN,
                certificatesCount: require?.certificateRequirements?.count
                    ? require?.certificateRequirements?.count
                    : 0,
                certificatesEndDate: require?.certificateRequirements
                    ?.certificatesEndDate
                    ? moment(
                        require?.certificateRequirements?.certificatesEndDate
                    ).format("DD-MM-YYYY")
                    : null,
                exp: require?.numberYearsOfExperience
                    ? require?.numberYearsOfExperience
                    : NaN,
                sameExp: require?.experienceWorkInCarreer
                    ? require?.experienceWorkInCarreer
                    : NaN,
                numblePackageWorkInCarreer: require?.numblePackageWorkInCarreer
                    ? require?.numblePackageWorkInCarreer
                    : NaN,
                page: 0,
                limit: 500,
            };
            let employee = await this.searchEmployeeForPackage(
                portal,
                params,
                companyId
            );

            if (employee.length === 0)
                return {
                    listEmployees: null,
                    isComplete: 0,
                };

            employees.push(employee);
        }
    }
    // console.log("employees", employees);

    let [valid] = await Promise.all([
        employees.filter((item, index) => item.length < numberEmployees[index]),
    ]);

    if (valid?.length)
        return {
            listEmployees: null,
            isComplete: 0,
        };

    let data = await findEmployee(employees, [], [], [], numberEmployees, 0);

    let listEmployees = [];
    if (data.isComplete == 1) {
        for (const [index, item] of data.result.entries()) {
            let a = await this.getEmployeeInforByListId(portal, item, {
                page: 0,
                limit: 100,
            });
            listEmployees.push({
                careerPosition:
                    biddingPackage[0]?.keyPersonnelRequires[index]
                        .careerPosition,
                employees: a.listEmployees,
            });
        }

        return {
            listEmployees,
            isComplete: 1,
        };
    } else {
        return {
            listEmployees: null,
            isComplete: 0,
        };
    }
};

const findEmployee = async (
    keyPeople,
    otherPeople,
    result,
    resultIndex,
    number,
    index
) => {
    // console.log("otherPeople", keyPeople,  otherPeople)
    if (index >= keyPeople.length) {
        return {
            result: result,
            isComplete: 1,
        };
    }

    let t = number[index] - 1;
    let oldOtherPeople = [...otherPeople];
    let oldResult = [...result];
    let oldResultIndex = [...resultIndex];
    let flat = 0;

    if (result[index]) {
        let a = keyPeople[index];
        let n = keyPeople[index].length;
        let flat = 0;
        for (let i = 0; i <= t; i++) {
            let value = resultIndex[index][i];
            while (value < n - 1) {
                value = value + 1;
                if (i < t) {
                    if (value >= resultIndex[index][i + 1]) break;
                }
                if (!otherPeople.includes(a[value])) {
                    otherPeople.splice(
                        otherPeople.indexOf(result[index][i]),
                        1
                    );
                    result[index][i] = a[value];
                    resultIndex[index][i] = value;
                    flat = 1;
                    otherPeople.push(a[value]);
                    index = index + 1;
                    let data = await findEmployee(
                        keyPeople,
                        otherPeople,
                        result,
                        resultIndex,
                        number,
                        index
                    );
                    return {
                        result: data["result"],
                        isComplete: data["isComplete"],
                    };
                }
            }
        }
        if (flat == 0 && index == 0) {
            return {
                result: [],
                isComplete: 0,
            };
        }
    } else {
        // nếu chưa
        result[index] = [];
        resultIndex[index] = [];
        let a = keyPeople[index];
        let n = keyPeople[index].length;
        let i = 0;
        let key = 0;
        for (let j = 0; j <= t; j++) {
            while (i < n) {
                if (!otherPeople.includes(a[i].toString())) {
                    result[index].push(a[i]);
                    resultIndex[index].push(i);
                    otherPeople.push(a[i].toString());
                    if (j == t) key = 1;
                    i = i + 1;
                    break;
                }
                i = i + 1;
            }
        }
        if (key == 1) {
            let data = await findEmployee(
                keyPeople,
                otherPeople,
                result,
                resultIndex,
                number,
                index + 1
            );
            return {
                result: data["result"],
                isComplete: data["isComplete"],
            };
        }

        if (key == 0) {
            if (index < 0)
                return {
                    result: [],
                    isComplete: 0,
                };
            let data = await findEmployee(
                keyPeople,
                oldOtherPeople,
                oldResult,
                oldResultIndex,
                number,
                index - 1
            );
            return {
                result: data["result"],
                isComplete: data["isComplete"],
            };
        }
    }
};

exports.getEmployeeInforByListId = async (portal, listId, params) => {
    listEmployees = await Employee(connect(DB_CONNECTION, portal))
        .find({
            _id: {
                $in: listId,
            },
        })
        .populate([
            { path: "degrees.field" },
            { path: "careerPositions.careerPosition" },
            { path: "degrees.major" },
            { path: "certificates.certificate" },
        ])
        .sort({
            createdAt: 1,
        })
        .skip(params.page * params.limit)
        .limit(params.limit);

    totalList = await Employee(connect(DB_CONNECTION, portal)).countDocuments({
        _id: {
            $in: listId,
        },
    });

    let arrEmployee = [];
    for (let i = 0; i < listEmployees.length; i++) {
        let idCompany = listEmployees[i].company;
        let company = await Company(
            connect(DB_CONNECTION, process.env.DB_NAME)
        ).findById(idCompany);
        let contactPerson = await User(
            connect(DB_CONNECTION, company.shortName)
        ).findById(company.contactPerson);
        company.contactPerson = contactPerson;

        let email = listEmployees[i].emailInCompany;
        let value = await this.getAllPositionRolesAndOrganizationalUnitsOfUser(
            portal,
            email
        );

        listEmployees[i].company = company;

        let newItem = Object.assign(listEmployees[i]._doc, value);
        arrEmployee.push(newItem);

        listEmployees[i] = {
            ...listEmployees[i]._doc, // sua lỗi thừa thuộc tính
            ...value,
            company,
        };
    }

    return {
        listEmployees,
        totalList,
    };
};
