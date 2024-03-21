const { BiddingPackage, Employee, User, Task, BiddingContract, Tag } = require('../models');
const fs = require('fs');
const { connect } = require('../helpers/dbHelper');
const moment = require('moment');
const { getEmployeeInforByListId } = require('./profile');

/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchBiddingPackage = async (portal, params, company) => {
    // let keySearch = {
    //     company: company,
    // };
    let keySearch = {};

    if (params?.name) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: params.name,
                $options: 'i',
            },
        };
    }

    if (params?.code) {
        keySearch = {
            ...keySearch,
            code: {
                $regex: params.code,
                $options: 'i',
            },
        };
    }

    if (params.status && params.status.length) {
        keySearch = {
            ...keySearch,
            status: {
                $in: params.status,
            },
        };
    }

    if (params.type && params.type.length) {
        keySearch = {
            ...keySearch,
            type: {
                $in: params.type,
            },
        };
    }

    if (params.endDate) {
        let date = new Date(params.endDate);
        console.log('aaaaaaâ', date);

        keySearch = {
            ...keySearch,
            endDate: {
                $lte: date,
            },
        };
    }

    if (params.startDate) {
        let date = new Date(params.startDate);
        console.log('start', params.startDate);
        console.log('start', date);

        keySearch = {
            ...keySearch,
            startDate: {
                $gte: date,
            },
        };
    }

    if (params.limit === undefined && params.page === undefined) {
        let data = await BiddingPackage(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                createdAt: 'desc',
            })
            .populate({ path: 'proposals.tasks.directEmployees proposals.tasks.backupEmployees', select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail' })
            .populate({ path: 'proposals.logs.createdBy', select: '-tokens -status -password -deleteSoft' });

        let result = [];
        for (let x of data) {
            let checkHasContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({ biddingPackage: x._id });
            if (checkHasContract) {
                result.push({ ...x._doc, hasContract: true })
            } else {
                result.push({ ...x._doc, hasContract: false })
            }
        }
        return {
            listBiddingPackages: result,
            totalList: data.length,
        };
    } else {
        let data = await BiddingPackage(connect(DB_CONNECTION, portal)).find(
            keySearch
        );
        let listBiddingPackages = await BiddingPackage(
            connect(DB_CONNECTION, portal)
        )
            .find(keySearch)
            .sort({
                createdAt: 'desc',
            })
            .skip(params.page)
            .limit(params.limit)
            .populate({ path: 'proposals.tasks.directEmployees proposals.tasks.backupEmployees', select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail' })
            .populate({ path: 'proposals.logs.createdBy', select: '-tokens -status -password -deleteSoft' });

        let result = [];
        for (let x of listBiddingPackages) {
            let checkHasContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({ biddingPackage: x._id });
            if (checkHasContract) {
                result.push({ ...x._doc, hasContract: true })
            } else {
                result.push({ ...x._doc, hasContract: false })
            }
        }

        return {
            listBiddingPackages: result,
            totalList: data.length,
        };
    }
};

/**
 * Lấy chi tiết thông tin gói thầu
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.getDetailBiddingPackage = async (portal, params) => {
    let listBiddingPackages = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).findOne({ _id: params.id })
        .populate({ path: 'proposals.logs.createdBy', select: '-tokens -status -password -deleteSoft' })
        .populate({ path: 'proposals.tasks.directEmployees proposals.tasks.backupEmployees', select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail professionalSkill experiences certificates' })
        .populate({ path: 'proposals.tasks.directEmployees.certificates.certificate proposals.tasks.backupEmployees.certificates.certificate' });

    let checkHasContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({ biddingPackage: params.id });
    let keyPeopleArr = {};
    keyPeopleArr = {
        ...listBiddingPackages._doc,
        keyPeople: [],
        hasContract: checkHasContract ? true : false,
    };

    if (listBiddingPackages.keyPeople) {
        for (let [index, item] of listBiddingPackages.keyPeople.entries()) {
            let keyPeople = await getEmployeeInforByListId(
                portal,
                item.employees,
                {
                    page: 0,
                    limit: 100,
                }
            );
            keyPeopleArr.keyPeople.push({
                ...listBiddingPackages.keyPeople[index]._doc,
                employees: keyPeople.listEmployees,
            });
        }
    }
    return {
        listBiddingPackages: keyPeopleArr,
    };
};

/**
 * Lấy chi tiết thông tin gói thầu
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.getDetailBiddingPackageToEdit = async (portal, params) => {
    let listBiddingPackages = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).findOne({ _id: params.id })
    .populate({ path: 'proposals.logs.createdBy', select: '-tokens -status -password -deleteSoft' });
    // .populate({ path: "proposals.directEmployees proposals.backupEmployees", select: "_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail" });

    let checkHasContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({ biddingPackage: params.id });
    let res = {};
    res = {
        ...listBiddingPackages._doc,
        hasContract: checkHasContract ? true : false,
    };
    return {
        listBiddingPackages: res,
    };
};

/**
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewBiddingPackage = async (portal, data, company) => {
    let position = await BiddingPackage(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        customer: data.customer,
        price: data.price,
        openLocal: data.openLocal,
        receiveLocal: data.receiveLocal,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status ? data.status : 1,
        type: data.type ? data.type : 1,
        description: data.description,
        keyPeople: data.keyPeople,
        keyPersonnelRequires: data.keyPersonnelRequires,
        proposals: data.proposals,
        company: company,
    });

    return await this.getDetailBiddingPackage(portal, {id: position._id})
    // return await this.searchBiddingPackage(portal, {});
};

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editBiddingPackage = async (portal, data, params, company) => {
    console.log(data);

    if (data?.addEmployeeForPackage) {
        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne(
            { _id: params.id },
            {
                $set: {
                    keyPeople: data?.keyPeople,
                    status: 2,
                },
            },
            { $new: true }
        );

        const biddingPackage = await BiddingPackage(
            connect(DB_CONNECTION, portal)
        ).find({
            _id: params.id,
            endDate: { $gte: new Date() },
            status: { $in: [1, 2, 3] },
        });
        if (biddingPackage) {
            if (biddingPackage[0].keyPeople) {
                for (let position of biddingPackage[0].keyPeople) {
                    for (let employee of position.employees) {
                        await Employee(
                            connect(DB_CONNECTION, portal)
                        ).updateOne(
                            { _id: employee },
                            {
                                $set: {
                                    biddingPackagePersonalStatus: 2,
                                    packageEndDate: biddingPackage.endDate,
                                },
                            }
                        );
                    }
                }
            }
        }
    } else {
        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne(
            { _id: params.id },
            {
                $set: {
                    company: company,
                    name: data.name,
                    code: data.code,
                    customer: data.customer,
                    price: data.price,
                    openLocal: data.openLocal,
                    receiveLocal: data.receiveLocal,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status ? Number(data.status) : 1,
                    type: data.type ? data.type : 1,
                    description: data.description,
                    keyPersonnelRequires: data.keyPersonnelRequires,
                    keyPeople: data?.keyPeople,
                    certificateRequirements: {
                        certificates: data.certificates,
                        count: data.count,
                    },
                    proposals: data.proposals
                },
            },
            { $new: true }
        );
        const biddingPackage = await BiddingPackage(
            connect(DB_CONNECTION, portal)
        ).find({
            _id: params.id,
            status: { $in: [2, 3] },
            endDate: { $gte: new Date() },
        });
        console.log('biddingPackage', biddingPackage);
        if (biddingPackage.length) {
            let status = 1;
            if (
                biddingPackage[0].status === 2 ||
                biddingPackage[0].status === 1
            )
                status = 2;
            else if (biddingPackage === 3) status = 3;
            if (biddingPackage[0].keyPeople) {
                for (let position of biddingPackage[0].keyPeople) {
                    for (let employee of position.employees) {
                        await Employee(
                            connect(DB_CONNECTION, portal)
                        ).updateOne(
                            { _id: employee },
                            {
                                $set: {
                                    biddingPackagePersonalStatus: status,
                                    packageEndDate: biddingPackage.endDate,
                                },
                            }
                        );
                    }
                }
            }
        }
    }

    return await this.getDetailBiddingPackage(portal, params)
    // return await this.searchBiddingPackage(portal, {});
};

/**
 * Xoá vị trí
 * @data : list id xóa
 */
exports.deleteBiddingPackage = async (portal, id) => {
    await BiddingPackage(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });

    let listBiddingPackages = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).find();
    let totalList = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).countDocuments();

    // return {
    //     totalList,
    //     listBiddingPackages,
    // };

    return id;
    // return await this.searchBiddingPackage(portal, {});
};

exports.autoUpdateEmployeeBiddingStatus = async (portal) => {
    console.log('autoUpdateEmployeeBiddingStatus', portal);
    await await Employee(connect(DB_CONNECTION, portal)).updateMany(
        { packageEndDate: { $lt: new Date() } },
        {
            $set: {
                biddingPackagePersonalStatus: 1,
            },
        }
    );
};

exports.getBiddingPackageDocument = async (biddingPackageId, portal) => {
    const biddingPackage = await BiddingPackage(connect(DB_CONNECTION, portal))
        .findOne({ _id: biddingPackageId })
        .populate({
            path: 'keyPeople.employees',
            select: {
                _id: 1,
                emailInCompany: 1,
                careerPositions: 1,
                degrees: 1,
                certificates: 1,
                experiences: 1,
            },
        });
    let people = [];
    let documentList = [];
    if (biddingPackage.keyPeople.length) {
        if (!fs.existsSync(`${SERVER_BACKUP_DIR}/${portal}/document`)) {
            fs.mkdirSync(`${SERVER_BACKUP_DIR}/${portal}/document`, {
                recursive: true,
            });
        }

        people = biddingPackage.keyPeople.map((item) => item.employees);
    }
    let rootPath = `${SERVER_BACKUP_DIR}/${portal}`;
    people = Array.prototype.concat.apply([], people);
    people.map((x) => {
        if (
            !fs.existsSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}`
            )
        ) {
            fs.mkdirSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/experiences`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/professional-experiences`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/degrees`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/certificates`,
                {
                    recursive: true,
                }
            );
        }
        x.experiences.map((y) => {
            const startDate = y.startDate
                ? moment(new Date(y.startDate)).format('DD-MM-YYYY')
                : moment(new Date()).format('DD-MM-YYYY');
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/experiences/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log('Error Found:', err);
                        }
                    }
                );
        });
        x.careerPositions.map((y) => {
            const startDate = y.startDate
                ? moment(new Date(y.startDate)).format('DD-MM-YYYY')
                : moment(new Date()).format('DD-MM-YYYY');
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/professional-experiences/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log('Error Found:', err);
                        }
                    }
                );
        });
        x.degrees.map((y) => {
            const year = y.year
                ? moment(new Date(y.year)).format('DD-MM-YYYY')
                : moment(new Date()).format('DD-MM-YYYY');
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/degrees/${year}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log('Error Found:', err);
                        }
                    }
                );
        });
        x.certificates.map((y) => {
            const startDate = y.startDate
                ? moment(new Date(y.startDate)).format('DD-MM-YYYY')
                : moment(new Date()).format('DD-MM-YYYY');
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/certificates/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log('Error Found:', err);
                        }
                    }
                );
        });
    });
    if (fs.existsSync(rootPath)) return rootPath;
};

const findEmployee = async (
    availableEmployees, // mảng các emp phù hợp với từng vị trí, vidu mảng là [[1, 2, 3], [3, 4, 5]] có 2 vị trí - ứng với vị trí nhân sự trực tiếp và nhân sự gián tiếp, mỗi vị trí có ...
    otherPeople,
    result,
    resultIndex,
    number,
    index
) => {
    // console.log("otherPeople", availableEmployees,  otherPeople)
    if (index >= availableEmployees.length) {
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
        let a = availableEmployees[index];
        let n = availableEmployees[index].length;
        let flat = 0;
        for (let i = 0; i <= t; i++) {
            let value = resultIndex[index][i]; // nhãn giá trị đã tìm của vị trí này
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
                        availableEmployees,
                        otherPeople,
                        result,
                        resultIndex,
                        number,
                        index
                    );
                    return {
                        result: data['result'],
                        isComplete: data['isComplete'],
                    };
                }
            }
        }
        if (flat === 0 && index === 0) {
            return {
                result: [],
                isComplete: 0,
            };
        }
    } else {
        // nếu chưa
        result[index] = []; // tâp kết quả cho vị trí index
        resultIndex[index] = []; // tập kết quả theo nhãn cho vị trí index
        let a = availableEmployees[index]; // những thằng nhân sự thỏa mãn vị trí index (giá trị là mảng id emp thỏa mãn vị trí index này) 
        let n = availableEmployees[index]?.length; // số nhân sự thỏa mãn tìm đc cho vị trí index
        let i = 0;
        let key = 0;
        for (let j = 0; j <= t; j++) { // 
            while (i < n) { // chạy theo các thằng tìm đc
                if (!otherPeople.includes(a[i].toString())) { // nếu other không có thằng a[i] thì nó thêm vào other
                    result[index].push(a[i]);
                    resultIndex[index].push(i);
                    otherPeople.push(a[i].toString());
                    if (j == t) key = 1; // t là số lượng nhân sự cần thiết cho vị trí này // j == t thì vị trí này đã tìm đủ
                    i = i + 1;
                    break;
                }
                i = i + 1;
            }
        }
        if (key == 1) {
            let data = await findEmployee(
                availableEmployees,
                otherPeople,
                result,
                resultIndex,
                number,
                index + 1
            );
            return {
                result: data['result'],
                isComplete: data['isComplete'],
            };
        }

        if (key == 0) {
            if (index < 0)
                return {
                    result: [],
                    isComplete: 0,
                };
            let data = await findEmployee(
                availableEmployees,
                oldOtherPeople,
                oldResult,
                oldResultIndex,
                number,
                index - 1
            );
            return {
                result: data['result'],
                isComplete: data['isComplete'],
            };
        }
    }
};

exports.getEmployeeNotInBiddingPackage = async (portal) => {
    return await Employee(connect(DB_CONNECTION, portal)).find({
        biddingPackagePersonalStatus: 1
    })
}

exports.getEmployeeNotInTaskByDate = async (portal, taskBody, startDate) => {
    if (!startDate) {
        startDate = Date.now();
    }
    const fmStartDate = new Date(startDate);
    // const fmStartDate = moment(startDate).format('YYYY/MM/DD HH:mm:ss');
    let keySearch = {
        isArchived: false,
        status: {
            $in: ['inprocess', 'wait_for_approval'],
        },
    };
    const estimateTimeOfTask = Number(taskBody.estimateTime);
    const unitOfTime = taskBody.unitOfTime;

    // let endDate = moment(moment(fmStartDate).add(estimateTimeOfTask, unitOfTime).format('YYYY/MM/DD HH:mm:ss')).toDate();
    let endDate = moment(fmStartDate).add(estimateTimeOfTask, unitOfTime).format('YYYY/MM/DD HH:mm:ss');

    if (startDate && endDate) {
        endDate = new Date(endDate);
        endDate.setMonth(endDate.getMonth() + 1);

        keySearch = {
            ...keySearch,
            $or: [
                { 'endDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { 'startDate': { $lt: new Date(endDate), $gte: new Date(startDate) } },
                { $and: [{ 'endDate': { $gte: new Date(endDate) } }, { 'startDate': { $lt: new Date(startDate) } }] }
            ]
        }
    }

    let taskList = await Task(connect(DB_CONNECTION, portal)).find(keySearch);

    // lấy ra tất cả các user có trong task
    let userIdInTaskArr = [];
    for (let x of taskList) {
        let allMemberOfTask = [
            ...x.responsibleEmployees,
            ...x.accountableEmployees,
            ...x.consultedEmployees,
            ...x.informedEmployees
        ];

        for (let m of allMemberOfTask) {
            if (!userIdInTaskArr.find(uid => String(uid) === String(m))) { // nếu m chưa có trong arr -> true;
                userIdInTaskArr.push(m);
            }
        }

    }

    // lấy thông tin user ở trên
    let listUserMember = await User(connect(DB_CONNECTION, portal)).find({
        _id: { $in: userIdInTaskArr }
    })

    let emailUserInTaskArr = listUserMember.map(x => x.email);
    console.log(1134, emailUserInTaskArr);
    let availableEmployees = await Employee(connect(DB_CONNECTION, portal)).find({
        biddingPackagePersonalStatus: 1,
        emailInCompany: { $nin: emailUserInTaskArr }
    })

    // console.log(availableEmployees)

    return availableEmployees
}

const convertEmployeeToUserInUnit = (allUser, employee) => {
    if (!allUser?.length) return null;
    for (let u of allUser) {
        if (u.email === employee.emailInCompany) {
            return u;
        }
    }
}

const checkEmpInTask = (task, empId) => {
    const resArr = task?.responsibleEmployees ?? []
    const accArr = task?.accountableEmployees ?? []
    const consultArr = task?.consultedEmployees ?? []
    const informArr = task?.informedEmployees ?? []

    return (
        resArr.find(x => String(x) === String(empId)) ||
        accArr.find(x => String(x) === String(empId)) ||
        consultArr.find(x => String(x) === String(empId)) ||
        informArr.find(x => String(x) === String(empId))
    )
}

const checkIskeyPeople = (uid, keyPeople) => {
    let check = false;
    for (let x of keyPeople) {
        check = x.employees.find(e => String(e) === String(uid));
    }
    return check;
}

const labelingSkill = (skill, isPreferedHighSkill) => {
    // Trình độ chuyên môn: intermediate_degree - Trung cấp, colleges - Cao đẳng, university - Đại học, bachelor - cử nhân, engineer - kỹ sư, master_degree - Thạc sỹ, phd- Tiến sỹ, unavailable - Không có
    if (isPreferedHighSkill) { // nếu ưu tiên theo thứ tự trình độ cao đến thấp
        switch (skill) {
            case 'intermediate_degree': return 1;
            case 'colleges': return 2;
            case 'university': return 3;
            case 'bachelor': return 4;
            case 'engineer': return 5;
            case 'master_degree': return 6;
            case 'phd': return 7;
    
            default:
                return 0;
        }
    }
    else { // nếu không
        switch (skill) {
            case 'intermediate_degree': return 1;
            case 'colleges': return 2;
            case 'university': return 3;
            case 'phd': return 4;
            case 'master_degree': return 5;
            case 'bachelor': return 6;
            case 'engineer': return 7;

            default:
                return 0;
        }
    }
}

// a - b
const compareProfessionalSkill = (skill1, skill2, isPreferedHighSkill) => {
    return (labelingSkill(skill2, isPreferedHighSkill) - labelingSkill(skill1, isPreferedHighSkill)); // > 0 thì a > b => a sau b tức là ai có skill xịn hơn thì xếp trước
}


exports.getEmployeeInfoWithTask = async (
    allUser = [], 
    listAllEmployees = [], 
    allTask = [], 
    startDate = Date.now(), 
    estimateTime = 0, 
    unitOfTime = 'days', 
    prevTask = null, 
    biddingPackage, 
    oldEmployees = [], 
    allTag = [],
    currentTag = [],
    suitableEmployees = [],
    isPreferedHighSkill = true,
) => {
    let start = startDate ?? Date.now();
    let end = moment(start).add(Number(estimateTime), unitOfTime).toDate();
    let allEmployee = [];
    let taskInEstimateTime = {};
    let keyPeople = biddingPackage?.keyPeople ?? [];

    if (oldEmployees.length == 0) {
        for (let x of listAllEmployees) {
            let user = convertEmployeeToUserInUnit(allUser, x);
            taskInEstimateTime[`${x._id}`] = {
                employeeInfo: x,
                user: user,
                userId: user?._id,
                empId: x._id,
                fullName: x.fullName,
                emailInCompany: x.emailInCompany,
                numOfFree: 0, // số lượng công việc liên tiếp không tham gia trong đề xuất // ConsecutiveProposalTask
                numOfInvole: 0, // số lượng công việc liên tiếp tham gia trong đề xuất
                notAvailable: 0, // chỉ số kiểm tra người đó có làm nhiều hơn 2 cv liên tiếp hay ko, nếu numOfInvole == 2 -> notAvailable = 1 (không cho làm nữa, đẩy nó xuống cuối mảng), nếu numOfFree == 2 -> notAvailable = 0
                task: [],
                isKeyPeople: checkIskeyPeople(x._id, keyPeople) ? 1 : 0,
                suitabilityWithTag: 5, // độ phù hợp với tag
            }
        }
    } else {
        for (let x of oldEmployees) {
            taskInEstimateTime[`${x.empId}`] = {
                employeeInfo: x.employeeInfo,
                user: x.user,
                userId: x.userId,
                empId: x.empId,
                fullName: x.fullName,
                emailInCompany: x.emailInCompany,
                numOfFree: x.numOfFree,
                numOfInvole: x.numOfInvole,
                notAvailable: x.notAvailable,
                task: [],
                isKeyPeople: checkIskeyPeople(x.empId, keyPeople) ? 1 : 0,
                suitabilityWithTag: x.suitabilityWithTag,
            }
        }
    }


    for (let x of listAllEmployees) {
        let userX = convertEmployeeToUserInUnit(allUser, x);
        for (let t of allTask) {
            if (t.status === 'wait_for_approval' || t.status === 'inprocess') {
                if (!(new Date(t.startDate) > end || new Date(t.endDate) < start)) {
                    if (checkEmpInTask(t, userX?._id)) {
                        taskInEstimateTime[`${x._id}`].task.push(t);
                    }
                }
            }
        }
    }

    // xử lý prevTask trong proposal xem người nhân sự nào tham gia -> cập nhật numOfFree, numOfInvole, notAvailable.
    if (prevTask) {
        for (let i in taskInEstimateTime) {
            let item = taskInEstimateTime[i];
            let checkDirectEmp = prevTask.directEmployees?.find(x => String(x) === String(item.empId));
            if (checkDirectEmp) {
                item.numOfInvole = item.numOfInvole + 1;
                item.numOfFree = 0;
                if (item.numOfInvole === 2) {
                    item.notAvailable = 1;
                }
            } else {
                item.numOfFree = item.numOfFree + 1;
                item.numOfInvole = 0;
                if (item.numOfFree == 2) {
                    item.notAvailable = 0;
                }
            }
        }
    }

    // xử lý độ phù hợp với tag
    if (allTag?.length && allTag.length > 0) {
        for (let i in taskInEstimateTime) {
            let item = taskInEstimateTime[i];
            let checkTag = allTag.filter(x => currentTag.find(ct => String(x._id) === String(ct)) );

            let numOfTag = checkTag.length;
            let suitablePointObj = {};

            for(let t of checkTag ) {
                let listSuitability = t.employeeWithSuitability;
                for (let s of listSuitability) {
                    suitablePointObj[s.employee] = suitablePointObj[s.employee]?.suitability ? Number(suitablePointObj[s.employee]?.suitability) + Number(s.suitability) : Number(s.suitability);
                }
            }

            for(let obj in suitablePointObj) {
                for(let se of suitableEmployees) {
                    if (String(se) === String(obj) && String(se) === String(item.empId)) {
                        item.suitabilityWithTag = suitablePointObj[obj]?.suitability/numOfTag
                    }
                }
            }

        }
    }

    let formatedListEmp = [];
    for (let i in taskInEstimateTime) {
        let item = taskInEstimateTime[i];
        item.numOfTask = item.task?.length ?? 0;

        formatedListEmp.push(item);
    }

    // lọc ra nhân viên còn active
    let formatedListActiveEmp = formatedListEmp.filter(x => x.employeeInfo.status === 'active');

    formatedListActiveEmp.sort(function (a, b) {
        if (a.notAvailable !== b.notAvailable) {
            return a.notAvailable - b.notAvailable
        }
        else if (a.isKeyPeople !== b.isKeyPeople) {
            return b.isKeyPeople - a.isKeyPeople // < 0, thì a là key, => a đứng trc b 
        }
        else if (a.suitabilityWithTag !== b.suitabilityWithTag) {
            return (b.suitabilityWithTag - a.suitabilityWithTag)
        }
        else if (a.numOfTask !== b.numOfTask) {
            return a.numOfTask - b.numOfTask // < 0 thì a xếp trước b
        }
        return compareProfessionalSkill(a?.employeeInfo?.professionalSkill, b?.employeeInfo?.professionalSkill, isPreferedHighSkill);
    });

    allEmployee = formatedListActiveEmp.map(item => {
        // let text = item.fullName + `( ${item.emailInCompany} việc phải làm)`
        let text = item.fullName + `( ${item.numOfTask} việc phải làm)`
        return {
            ...item,
            value: item.empId,
            text: text,
        }
    })

    return allEmployee;
}

exports.proposalForBiddingPackage = async (portal, body, params, companyId) => {
    //bid, estimateTime = 0, unitOfTime = "days", task
    const { tags, tasks, biddingPackage, unitOfTime, executionTime, type, isPreferedHighSkill } = body;
    const { bidId } = params;

    // lấy all user
    const allUser = await User(connect(DB_CONNECTION, portal)).find({});

    // lấy all user
    const allTag = await Tag(connect(DB_CONNECTION, portal)).find({});

    // lấy all employee active
    const listAllEmployees = await Employee(connect(DB_CONNECTION, portal)).find({
        // biddingPackagePersonalStatus: 1,
        status: 'active'
    })

    // lấy ra tất cả các task
    const allTask = await Task(connect(DB_CONNECTION, portal)).find({
        isArchived: false,
        status: {
            $in: ['inprocess', 'wait_for_approval'],
        },
    });

    let logs = biddingPackage?.proposals?.logs ?? []
    let proposalTask = [];
    let isComplete = 0;
    let startOfTask = Date.now();
    let endOfTask = Date.now();
    let prevTask = null;
    let oldEmployees = [];
    let compareVersion = [];
    // return task đề xuất
    // xử lý task để trả về nhân viên với thông tin các task sẽ phải làm
    for (let t of tasks) {
        startOfTask = endOfTask;

        // danh sách tất cả nhân viên với task
        let empWithTask = await this.getEmployeeInfoWithTask(
            allUser, 
            listAllEmployees, 
            allTask, 
            startOfTask, 
            t.estimateTime, 
            unitOfTime, 
            prevTask, 
            biddingPackage, 
            oldEmployees, 
            allTag, 
            t.tag,
            t.suitableEmployees,
            isPreferedHighSkill,
        );
        endOfTask = moment(startOfTask).add(Number(t.estimateTime), unitOfTime).toDate();
        oldEmployees = empWithTask;

        // tìm danh sách emp tương ứng với tag
        // let tagOfTask = tags.find(x => x.name === t.tag)


        // let listEmpByTag = [];
        // if (allTag?.length > 0) listEmpByTag = allTag.find(x => String(t.tag) === String(x._id))?.employees ?? [];

        // if (!listEmpByTag?.length) listEmpByTag = [...empWithTask];

        let listSuitableEmp = t.suitableEmployees ?? [];
        // if (!listSuitableEmp?.length) listSuitableEmp = empWithTask.map(x => String(x.empId));
        console.log(listSuitableEmp);


        let directEmpAvailable = empWithTask.filter(x => listSuitableEmp.indexOf(String(x.empId)) !== -1).map(x => x.empId);
        let backupEmpAvailable = empWithTask.filter(x => listSuitableEmp.indexOf(String(x.empId)) !== -1).map(x => x.empId);
        let proposalEmpArr = [directEmpAvailable, backupEmpAvailable];
        console.log(directEmpAvailable);

        // let numBackupEmpRequired = t.numberOfEmployees; // t.numberOfEmployees <= listSuitableEmp?.length
        let numDirectpEmpRequired = t.numberOfEmployees;
        let numBackupEmpRequired = (listSuitableEmp?.length - numDirectpEmpRequired) <= numDirectpEmpRequired + 2 ? (listSuitableEmp?.length - numDirectpEmpRequired) : numDirectpEmpRequired;
        let numOfEmpRequireArr = [numDirectpEmpRequired, numBackupEmpRequired];

        // let data = await findEmployee(proposalEmpArr, [], [], [], numOfEmpRequireArr, 0);
        let data = {
            isComplete: 0,
        }

        let flag = 1;
        while(flag === 1) {
            flag = 1;
            numOfEmpRequireArr = [numDirectpEmpRequired, numBackupEmpRequired];
            data = await findEmployee(proposalEmpArr, [], [], [], numOfEmpRequireArr, 0);
            
            if (data.isComplete == 1) {
                // console.log(data.result[0]);

                const newTask = {
                    ...t,
                    directEmployees: data.result[0],
                    backupEmployees: data.result[1],
                };
                prevTask = newTask;

                compareVersion.push({
                    isComplete: 1,
                    code: t.code,
                    tag: t.tag,
                    name: t.taskName,
                    old: t,
                    new: newTask
                })

                proposalTask.push(newTask);

                isComplete = 1;
                flag = 0
            } else {
                isComplete = 0;
            }

            numBackupEmpRequired = numBackupEmpRequired - 1;
            if(numBackupEmpRequired <= 0) {
                flag = 0
            }
        }
        console.log(1718, data);
        if (isComplete === 0) {
            console.log(data);
            if (numDirectpEmpRequired === listSuitableEmp.length) {

            }
            const newTaskErr = {
                ...t,
                directEmployees: numDirectpEmpRequired >= listSuitableEmp.length ? listSuitableEmp : [],
                backupEmployees: [],
            };
            prevTask = newTaskErr;

            compareVersion.push({
                isComplete: 0,
                code: t.code,
                tag: t.tag,
                name: t.taskName,
                old: t,
                new: newTaskErr
            })

            proposalTask.push(newTaskErr);

            isComplete = 0;
        }
    }

    let countResult = 0;
    for (let item of compareVersion) {
        if (item.isComplete === 1) {
            countResult = countResult + 1;
        }
    }
    if (countResult === tasks.length) {
        isComplete = 1;
    } else {
        isComplete = 0;
    }

    console.log(proposalTask.map(x => {return {d: x.directEmployees, b: x.backupEmployees}}));

    return {
        type: type,
        id: bidId,
        compareVersion: compareVersion,
        proposal: {
            executionTime,
            unitOfTime,
            tags,
            tasks: proposalTask,
            logs: logs,
        },
        isComplete
    }
}
