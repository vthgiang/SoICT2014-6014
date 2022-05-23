const { freshObject } = require("../../../helpers/functionHelper");

const { BiddingContract } = require("../../../models");

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * get url for file
 * @param {*} destination 
 * @param {*} filename 
 * @returns 
 */
exports.getUrl = (destination, filename) => {
    let url = `${destination}/${filename}`;
    return url.substr(1, url.length);
}

/**
 * Lấy danh sách thông tin hợp đồng
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchBiddingContract = async (portal, params, company) => {
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

    if (params.endDate) {
        let date = new Date(params.endDate);

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
        let data = await BiddingContract(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                endDate: -1,
            })
            .populate({ path: "biddingPackage" })
            .populate({ path: "project" })
            .populate({ path: "creator" })
        return {
            listBiddingContract: data,
            totalList: data.length,
        };
    } else {
        let data = await BiddingContract(connect(DB_CONNECTION, portal)).find(
            keySearch
        );
        let listBiddingContract = await BiddingContract(
            connect(DB_CONNECTION, portal)
        )
            .find(keySearch)
            .sort({
                endDate: -1,
            })
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .populate({ path: "biddingPackage" })
            .populate({
                path: "project", populate: [
                    { path: 'projectManager', select: 'name email avatar' },
                    { path: 'responsibleEmployees', select: 'name email avatar' },
                ]
            })
            .populate({ path: "creator" });
        return {
            listBiddingContract: listBiddingContract,
            totalList: data.length,
        };
    }
};

/**
 * Thêm mới hợp đồng
 * @data : dữ liệu hợp đồng
 *
 */
exports.createNewBiddingContract = async (portal, data, files, company) => {
    data = freshObject(data);
    const checkBidpackage = await BiddingContract(
        connect(DB_CONNECTION, portal)
    ).findOne({ biddingPackage: data.biddingPackage });
    if (checkBidpackage) throw ["contract_for_bidding_package_exist"];

    let filesConvert
    if (files) {
        filesConvert = files.map(obj => ({
            fileName: obj.originalname,
            url: this.getUrl(obj.destination, obj.filename),
        }))
    }

    data.createdDate = Date.now()
    data.files = filesConvert

    await BiddingContract(connect(DB_CONNECTION, portal)).create(data);

    return await this.searchBiddingContract(portal, {}, company);
};

/**
 * Cập nhật thông tin hợp đồng
 * @id : Id hợp đồng muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editBiddingContract = async (portal, data, params, files, company) => {
    data = freshObject(data);

    const existedContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({ _id: data.id });
    if (!existedContract) throw ["contract_not_exist"];

    const checkBidpackage = await BiddingContract(
        connect(DB_CONNECTION, portal)
    ).findOne({ biddingPackage: data.biddingPackage });
    if (checkBidpackage && String(checkBidpackage._id) !== String(data.id)) throw ["contract_for_bidding_package_exist"];

    let filesConvert
    if (files) {
        filesConvert = files.map(obj => ({
            fileName: obj.originalname,
            url: this.getUrl(obj.destination, obj.filename),
        }))
    }

    if (filesConvert) {
        filesConvert = [...data.files, ...filesConvert]
    }

    data.files = filesConvert

    // TODO: chưa xử lý xóa file

    await BiddingContract(connect(DB_CONNECTION, portal)).updateOne(
        { _id: params.id },
        {
            $set: {
                code: data.code,
                name: data.name,
                effectiveDate: data.effectiveDate,
                endDate: data.endDate,
                unitTime: data.unitTime,
                budget: data.budget,
                unitCost: data.unitCost,
                partyA: data.partyA,
                partyB: data.partyB,

                biddingPackage: data.biddingPackage,
                project: data.project,

                files: data.files
            },
        },
        { $new: true }
    );

    return await this.searchBiddingContract(portal, {}, company);
};

// =================DELETE=====================

/**
 * Xoá hợp đồng
 * @data : list id xóa
 */
exports.deleteBiddingContract = async (portal, data, id, company) => {
    await BiddingContract(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return await this.searchBiddingContract(portal, {}, company);
};


/**
 * upload file hợp đồng
 * @param {*} contractId
 * @param {*} file
 */
exports.uploadBiddingContractFile = async (
    portal,
    contractId,
    file = undefined
) => {
    let contract = await BiddingContract(connect(DB_CONNECTION, portal))
        .findById(contractId)
        .populate({ path: "biddingPackage" })
        .populate({ path: "project" })
        .populate({ path: "creator" });

    if (!contract) {
        throw ['contract_invalid'];
    }


    let deleteFile = "." + contract.fileUrl;
    if (file) {
        if (
            len(deleteFile) !== 0 &&
            fs.existsSync(deleteFile)
        ) {
            fs.unlinkSync(deleteFile);
        }
        contract.fileUrl = file;
    }
    await contract.save();

    return contract;
};