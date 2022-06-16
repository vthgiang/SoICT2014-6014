const { BiddingPackage, Employee, User, Task, BiddingContract } = require("../../../models");
const fs = require("fs");
const { connect } = require(`../../../helpers/dbHelper`);
const { getEmployeeInforByListId } = require("../profile/profile.service");
const moment = require("moment");

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
                $options: "i",
            },
        };
    }

    if (params?.code) {
        keySearch = {
            ...keySearch,
            code: {
                $regex: params.code,
                $options: "i",
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
        console.log("aaaaaaâ", date);

        keySearch = {
            ...keySearch,
            endDate: {
                $lte: date,
            },
        };
    }

    if (params.startDate) {
        let date = new Date(params.startDate);
        console.log("start", params.startDate);
        console.log("start", date);

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
                createdAt: "desc",
            })
            .populate({ path: "proposals.tasks.directEmployees proposals.tasks.backupEmployees", select: "_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail" });

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
                createdAt: "desc",
            })
            .skip(params.page)
            .limit(params.limit)
            .populate({ path: "proposals.tasks.directEmployees proposals.tasks.backupEmployees", select: "_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail" });

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
        .populate({ path: "proposals.tasks.directEmployees proposals.tasks.backupEmployees", select: "_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail professionalSkill experiences certificates" })
        .populate({ path: "proposals.tasks.directEmployees.certificates.certificate proposals.tasks.backupEmployees.certificates.certificate" });

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
    position = await BiddingPackage(connect(DB_CONNECTION, portal)).create({
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

    return await this.searchBiddingPackage(portal, {});
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
        console.log("biddingPackage", biddingPackage);
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

    return await this.searchBiddingPackage(portal, {});
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

    return {
        totalList,
        listBiddingPackages,
    };
};

exports.autoUpdateEmployeeBiddingStatus = async (portal) => {
    console.log("autoUpdateEmployeeBiddingStatus", portal);
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
            path: "keyPeople.employees",
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
                ? moment(new Date(y.startDate)).format("DD-MM-YYYY")
                : moment(new Date()).format("DD-MM-YYYY");
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/experiences/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                    }
                );
        });
        x.careerPositions.map((y) => {
            const startDate = y.startDate
                ? moment(new Date(y.startDate)).format("DD-MM-YYYY")
                : moment(new Date()).format("DD-MM-YYYY");
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/professional-experiences/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                    }
                );
        });
        x.degrees.map((y) => {
            const year = y.year
                ? moment(new Date(y.year)).format("DD-MM-YYYY")
                : moment(new Date()).format("DD-MM-YYYY");
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/degrees/${year}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                    }
                );
        });
        x.certificates.map((y) => {
            const startDate = y.startDate
                ? moment(new Date(y.startDate)).format("DD-MM-YYYY")
                : moment(new Date()).format("DD-MM-YYYY");
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_BACKUP_DIR}/${portal}/document/${x.emailInCompany}/certificates/${startDate}-${y.file}`,
                    (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                    }
                );
        });
    });
    if (fs.existsSync(rootPath)) return rootPath;
};


/**
 * các thuật toán đề xuất nhân sự cho hồ sơ đề xuất
 */
exports.getEmployeeByKeyRequired = async (portal, params, companyId) => {
    let noResultsPerPage = parseInt(params.limit);
    let pageNumber = parseInt(params.page);
    let keySearch = [{ $match: { status: "active" } }];

    // tìm các nhân viên đang không có trong dự án nào hết
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

    // console.log("xxxxxxxxxxxxxx", keySearch);

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
            let employee = await this.getEmployeeByKeyRequired(
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
            $in: ["inprocess", "wait_for_approval"],
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
    };

    let taskList = await Task(connect(DB_CONNECTION, portal)).find(keySearch);
    // console.log(1100, taskList.map(x => x.name))

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

        // userIdInTaskArr = [
        //     ...userIdInTaskArr,
        //     ...allMemberOfTask
        // ]
    }
    // console.log(1121, userIdInTaskArr)

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



exports.proposalForBiddingPackage = async (portal, body, params, companyId) => {
    const availableEmployees = await this.getEmployeeNotInTaskByDate(portal, body.tasks, Date.now());

    return {
        availableEmployees: availableEmployees.map(x => { return { id: x._id, value: x._id, text: `${x.fullName}(${x.emailInCompany})` } })
    }
}