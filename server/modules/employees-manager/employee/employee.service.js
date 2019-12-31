const Employee = require('../../../models/employee.model');
const EmployeeContact = require('../../../models/employeeContact.model');

// get all list employee
exports.get = async (req, res) => {
    try {
        var allEmployee = await Employee.find();

        res.json({
            message: "Lấy danh sách nhân viên của tất cả các phòng ban thành công",
            content: {
                allEmployee
            }
        });
    } catch (error) {

        res.json({
            message: error
        });
    }
}

// get list employee by nameDepartment and position
exports.getBydepartment = async (req, res) => {

    try {
        var chiefDepartment = await Employee.find({
            $and: [{
                department: {
                    $elemMatch: {
                        nameDepartment: req.params.nameDepartment,
                    },
                }
            }, {
                department: {
                    $elemMatch: {
                        position: req.params.chief,
                    },
                }

            }]
        });
        var deputyDepartment = await Employee.find({
            $and: [{
                department: {
                    $elemMatch: {
                        nameDepartment: req.params.nameDepartment,
                    },
                }
            }, {
                department: {
                    $elemMatch: {
                        position: req.params.deputy,
                    },
                }

            }]
        });
        var listEmployee = await Employee.find({
            department: {
                $elemMatch: {
                    nameDepartment: req.params.nameDepartment
                }
            }
        }).populate('employeeContact');
        res.json({
            message: "Lấy thông tin nhân viên theo phong ban thành công",
            content: {
                chiefDepartment,
                deputyDepartment,
                listEmployee
            }
        });
    } catch (error) {
        res.json({
            message: error
        });
    }
}

// get imformation employee by employeeNumber
exports.getByEmployeeNumber = async (req, res) => {
    try {
        var employee = await Employee.find({
            employeeNumber: req.params.id
        });
        var employeeContact = await EmployeeContact.find({
            employeeNumber: req.params.id
        });
        res.json({
            message: "Lấy thông tin nhân viên thành công",
            content: {
                employee,
                employeeContact
            }
        });
    } catch (error) {
        res.json({
            message: error
        });
    }
}

// add a new employee
exports.create = async (req, res) => {
    try {
        var employees = await Employee.create({
            avatar: req.body.avatar,
            fullName: req.body.fullName,
            employeeNumber: req.body.employeeNumber,
            MSCC: req.body.MSCC,
            gender: req.body.gender,
            brithday: req.body.brithday,
            birthplace: req.body.birthplace,
            CMND: req.body.CMND,
            dateCMND: req.body.dateCMND,
            addressCMND: req.body.addressCMND,
            phoneNumber: req.body.phoneNumber,
            emailCompany: req.body.emailCompany,
            Tax: req.body.Tax,
            ATM: req.body.ATM,
            nameBank: req.body.nameBank,
            addressBank: req.body.addressBank,
            BHYT: req.body.BHYT,
            numberBHYT: req.body.numberBHYT,
            startDateBHYT: req.body.startDateBHYT,
            endDateBHYT: req.body.endDateBHYT,
            numberBHXH: req.body.numberBHXH,
            BHXH: req.body.BHXH,
            national: req.body.national,
            religion: req.body.religion,
            relationship: req.body.relationship,
            cultural: req.body.cultural,
            foreignLanguage: req.body.foreignLanguage,
            educational: req.body.educational,
            experience: req.body.experience,
            certificate: req.body.certificate,
            certificateShort: req.body.certificateShort,
            contract: req.body.contract,
            insurrance: req.body.insurrance,
            course: req.body.course,
            nation: req.body.nation,
            numberFile: req.body.numberFile,
            file: req.body.file,
            createDate: req.body.createDate,
        });
        var employeeContact = await EmployeeContact.create({
            employeeNumber: req.body.employeeNumber,
            emailPersonal: req.body.emailPersonal,
            phoneNumberAddress: req.body.phoneNumberAddress,
            friendName: req.body.friendName,
            relation: req.body.relation,
            friendPhone: req.body.friendPhone,
            friendEmail: req.body.friendEmail,
            friendPhoneAddress: req.body.friendPhoneAddress,
            friendAddress: req.body.friendAddress,
            localAddress: req.body.localAddress,
            localNational: req.body.localNational,
            localCity: req.body.localCity,
            localDistrict: req.body.localDistrict,
            localCommune: req.body.localCommune,
            nowAddress: req.body.nowAddress,
            nowNational: req.body.nowNational,
            nowCity: req.body.nowCity,
            nowDistrict: req.body.nowDistrict,
            nowCommune: req.body.nowCommune,
            createDate: req.body.createDate,
        })
        var content = {
            employees,
            employeeContact
        }
        res.json({
            message: "Thêm mới thông tin nhân viên thành công",
            content: content
        });
    } catch (error) {
        res.json({
            message: error
        });

    }
}

// update information employee by employeeNumber

exports.updateByEmployeeNumber = async (req, res) => {
    try {
        // new information employee contact 
        var employeeContactUpdate = {
            emailPersonal: req.body.emailPersonal,
            phoneNumberAddress: req.body.phoneNumberAddress,
            friendName: req.body.friendName,
            relation: req.body.relation,
            friendPhone: req.body.friendPhone,
            friendEmail: req.body.friendEmail,
            friendPhoneAddress: req.body.friendPhoneAddress,
            friendAddress: req.body.friendAddress,
            localAddress: req.body.localAddress,
            localNational: req.body.localNational,
            localCity: req.body.localCity,
            localDistrict: req.body.localDistrict,
            localCommune: req.body.localCommune,
            nowAddress: req.body.nowAddress,
            nowNational: req.body.nowNational,
            nowCity: req.body.nowCity,
            nowDistrict: req.body.nowDistrict,
            nowCommune: req.body.nowCommune,
            updateDate: req.body.updateDate
        }

        // new information employee
        var employeeUpdate = {
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            national: req.body.national,
            nation: req.body.nation,
            religion: req.body.religion,
            relationship: req.body.relationship,
            updateDate: req.body.updateDate
        }

        // update information employee contact
        var employeeContact = await EmployeeContact.findOneAndUpdate({
            employeeNumber: req.params.id
        }, {
            $set: employeeContactUpdate
        });

        // update information employee
        var employee = await Employee.findOneAndUpdate({
            employeeNumber: req.params.id
        }, {
            $set: employeeUpdate
        });

        var content = {
            employeeContactUpdate,
            employeeUpdate
        }
        res.json({
            message: "Cập nhật thông tin nhân viên thành công",
            content: content
        })

    } catch (error) {
        res.json({
            message: error
        });
    }
}