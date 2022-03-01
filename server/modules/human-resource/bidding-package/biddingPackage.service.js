const { BiddingPackage, Employee } = require("../../../models");
const fs = require("fs");
const { connect } = require(`../../../helpers/dbHelper`);
const { getEmployeeInforByListId } = require("../profile/profile.service");

/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchBiddingPackage = async (portal, params) => {
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

    let listBiddingPackages = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    )
        .find()
        .populate([
            {
                path: "keyPeople.employees",
                populate: { path: "employees" },
            },
        ]);
    // .sort({
    //     'createdAt': 'desc'
    // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).countDocuments();

    return {
        totalList,
        listBiddingPackages,
    };
};

/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.getDetailBiddingPackage = async (portal, params) => {
    let listBiddingPackages = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).findOne({ _id: params.id });
    let keyPeopleArr = {};
    keyPeopleArr = {
        ...listBiddingPackages._doc,
        keyPeople: [],
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
 * Thêm mới chuyên ngành
 * @data : dữ liệu chuyên ngành tương đương mới
 *
 */
exports.createNewBiddingPackage = async (portal, data) => {
    position = await BiddingPackage(connect(DB_CONNECTION, portal)).create({
        name: data.name,
        code: data.code,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status ? data.status : 1,
        type: data.type ? data.type : 1,
        description: data.description,
        keyPersonnelRequires: data.keyPersonnelRequires,
    });

    return await this.searchBiddingPackage(portal, {});
};

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editBiddingPackage = async (portal, data, params) => {
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
                    name: data.name,
                    code: data.code,
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
    // .sort({
    //     'createdAt': 'desc'
    // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(
        connect(DB_CONNECTION, portal)
    ).countDocuments();

    return {
        totalList,
        listBiddingPackages,
    };
};

exports.autoUpdateEmployeeBiddingStatus = async (portal) => {
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
        if (!fs.existsSync(`${SERVER_UPLOAD_DIR}/${portal}/document`)) {
            fs.mkdirSync(`${SERVER_UPLOAD_DIR}/${portal}/document`, {
                recursive: true,
            });
        }

        people = biddingPackage.keyPeople.map((item) => item.employees);
    }
    let rootPath = `${SERVER_UPLOAD_DIR}/${portal}`;
    people = Array.prototype.concat.apply([], people);
    people.map((x) => {
        if (
            !fs.existsSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}`
            )
        ) {
            fs.mkdirSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}/experiences`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}/professional-experiences`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}/degrees`,
                {
                    recursive: true,
                }
            );
            fs.mkdirSync(
                `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}/certificates`,
                {
                    recursive: true,
                }
            );
        }
        x.experiences.map((y) => {
            if (y.urlFile)
                fs.copyFile(
                    `${SERVER_DIR}/${y.urlFile}`,
                    `${SERVER_UPLOAD_DIR}/${portal}/document/${x.emailInCompany}/experiences/${y.file}`,
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
