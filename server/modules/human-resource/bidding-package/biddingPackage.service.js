const {
    BiddingPackage,
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);



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
            "name": {
                $regex: params.name,
                $options: "i",
            }
        };
    }
    
    let listBiddingPackages = await BiddingPackage(connect(DB_CONNECTION, portal))
        .find()
        .populate([
            { 
                path: "keyPeople.employees", 
                populate: { path: 'employees' }
            }
        ])
        // .sort({
        //     'createdAt': 'desc'
        // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(connect(DB_CONNECTION, portal)).countDocuments();

    return {
        totalList,
        listBiddingPackages
    }
}

/**
 * Lấy danh sách thông tin nghỉ phép
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.getDetailBiddingPackage = async (portal, params) => {
    
    let listBiddingPackages = await BiddingPackage(connect(DB_CONNECTION, portal)).find({ _id: params.id }).populate([
            { 
                path: "keyPeople.employees", 
                populate: { path: 'employees' }
            }
        ])
        // .sort({
        //     'createdAt': 'desc'
        // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(connect(DB_CONNECTION, portal)).countDocuments();

    return {
        totalList,
        listBiddingPackages
    }
}

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
    })

    return await this.searchBiddingPackage(portal, {})
}

/**
 * Chỉnh sửa vị trí công việc
 * @data dữ liệu chỉnh sửa
 */
exports.editBiddingPackage = async (portal, data, params) => {
    console.log(data)

    if (data?.addEmployeeForPackage) {
        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
        {
            $set: {
                keyPeople: data?.keyPeople,
            },
        }, { $new: true }
    )

    } 
    else {
        await BiddingPackage(connect(DB_CONNECTION, portal)).updateOne({ _id: params.id },
            {
                $set: {
                    name: data.name,
                    code: data.code,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status ? data.status : 1,
                    type: data.type ? data.type : 1,
                    description: data.description,
                    keyPersonnelRequires: data.keyPersonnelRequires,
                    keyPeople: data?.keyPeople,
                    certificateRequirements: {
                        certificates: data.certificates,
                        count: data.count
                    }
                },
            }, { $new: true }
        )
    }

    return await this.searchBiddingPackage(portal, {});
}

/**
 * Xoá vị trí
 * @data : list id xóa
 */
exports.deleteBiddingPackage = async (portal, id) => {
    await BiddingPackage(connect(DB_CONNECTION, portal)).deleteOne({ _id: id});

    let listBiddingPackages = await BiddingPackage(connect(DB_CONNECTION, portal)).find()
        // .sort({
        //     'createdAt': 'desc'
        // }).skip(params.limit * (params.page - 1)).limit(params.limit);
    let totalList = await BiddingPackage(connect(DB_CONNECTION, portal)).countDocuments();

    return {
        totalList,
        listBiddingPackages
    }
}