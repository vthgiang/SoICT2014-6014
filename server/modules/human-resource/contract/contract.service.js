const { Contract } = require(`${SERVER_MODELS_DIR}`);

const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

/**
 * Lấy danh sách thông tin hợp đồng
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty người dùng
 */
exports.searchContract = async (portal, params, company) => {
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
        let data = await Contract(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                endDate: -1,
            })
            .populate({ path: "biddingPackage"})
            .populate({ path: "project"})
            .populate({ path: "creator"})
        return {
            listContract: data,
            totalList: data.length,
        };
    } else {
        let data = await Contract(connect(DB_CONNECTION, portal)).find(
            keySearch
        );
        let listContract = await Contract(
            connect(DB_CONNECTION, portal)
        )
            .find(keySearch)
            .sort({
                endDate: -1,
            })
            .skip(params.page)
            .limit(params.limit)
            .populate({ path: "biddingPackage"})
            .populate({ path: "project"})
            .populate({ path: "creator"});
        return {
            listContract: listContract,
            totalList: data.length,
        };
    }
};

/**
 * Thêm mới hợp đồng
 * @data : dữ liệu hợp đồng
 *
 */
exports.createNewContract = async (portal, data, company) => {
    await Contract(connect(DB_CONNECTION, portal)).create(data);

    return await this.searchContract(portal, {}, company);
};

/**
 * Cập nhật thông tin hợp đồng
 * @id : Id hợp đồng muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editContract = async (portal, data, params, company) => {
    await Contract(connect(DB_CONNECTION, portal)).updateOne(
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
            },
        },
        { $new: true }
    );

    return await this.searchContract(portal, {}, company);
};

// =================DELETE=====================

/**
 * Xoá hợp đồng
 * @data : list id xóa
 */
exports.deleteContract = async (portal, data, id, company) => {
    await Contract(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return await this.searchContract(portal, {}, company);
};


/**
 * upload file hợp đồng
 * @param {*} contractId
 * @param {*} file
 */
 exports.uploadContractFile = async (
    portal,
    contractId,
    file = undefined
) => {
    let contract = await Contract(connect(DB_CONNECTION, portal))
        .findById(contractId)
        .populate({ path: "biddingPackage"})
        .populate({ path: "project"})
        .populate({ path: "creator"});
    
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