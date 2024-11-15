const {freshObject} = require('../helpers/functionHelper');

const {BiddingContract} = require('../models');
const {
    createProjectInfo,
    createTaskProjectCPM,
    updateProjectInfoAfterCreateProjectTask,
} = require('./projectTemplate');

const {connect} = require('../helpers/dbHelper');
const {existsSync, unlinkSync} = require('fs');

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
        let data = await BiddingContract(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({
                // endDate: -1,
                createdAt: -1,
            })
            .populate({
                path: 'biddingPackage', populate: [
                    {
                        path: 'proposals.tasks.backupEmployees',
                        select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                    },
                    {
                        path: 'proposals.tasks.directEmployees',
                        select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                    },
                ]
            })
            .populate({
                path: 'project', populate: [
                    {path: 'projectManager', select: 'name email avatar'},
                    {path: 'responsibleEmployees', select: 'name email avatar'},
                ]
            })
            .populate({path: 'creator'});
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
                // endDate: -1,
                createdAt: -1,
            })
            .skip((params.page - 1) * params.limit)
            .limit(params.limit)
            .populate({
                path: 'biddingPackage', populate: [
                    {
                        path: 'proposals.tasks.backupEmployees',
                        select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                    },
                    {
                        path: 'proposals.tasks.directEmployees',
                        select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                    },
                ]
            })
            .populate({
                path: 'project', populate: [
                    {path: 'projectManager', select: 'name email avatar'},
                    {path: 'responsibleEmployees', select: 'name email avatar'},
                ]
            })
            .populate({path: 'creator'});
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
    ).findOne({biddingPackage: data.biddingPackage});
    if (checkBidpackage) throw ['contract_for_bidding_package_exist'];

    let filesConvert
    if (files) {
        filesConvert = files.map(obj => ({
            fileName: obj.originalname,
            url: this.getUrl(obj.destination, obj.filename),
        }))
    }

    data.createdDate = Date.now()
    data.files = filesConvert

    let newContract = await BiddingContract(connect(DB_CONNECTION, portal)).create(data);

    return await this.getBidContractById(portal, newContract._id);
    // return await this.searchBiddingContract(portal, {}, company);
};

/**
 * Cập nhật thông tin hợp đồng
 * @id : Id hợp đồng muốn chỉnh sửa
 * @data : Dữ liệu thay đổi
 */
exports.editBiddingContract = async (portal, data, params, files, company) => {
    data = freshObject(data);

    const existedContract = await BiddingContract(connect(DB_CONNECTION, portal)).findOne({_id: data.id});
    if (!existedContract) throw ['contract_not_exist'];

    const checkBidpackage = await BiddingContract(
        connect(DB_CONNECTION, portal)
    ).findOne({biddingPackage: data.biddingPackage});
    if (checkBidpackage && String(checkBidpackage._id) !== String(data.id)) throw ['contract_for_bidding_package_exist'];

    if (!data.files) {
        data.files = [];
    }

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
        {_id: params.id},
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
                // project: data.project,
                decideToImplement: data.decideToImplement,

                files: data.files
            },
        },
        {$new: true}
    );

    return await this.getBidContractById(portal, params.id);
    // return await this.searchBiddingContract(portal, {}, company);
};

// =================DELETE=====================

/**
 * Xoá hợp đồng
 * @data : list id xóa
 */
exports.deleteBiddingContract = async (portal, data, id, company) => {
    await BiddingContract(connect(DB_CONNECTION, portal)).deleteOne({_id: id});
    return await this.searchBiddingContract(portal, {}, company);
};


exports.getBidContractById = async (portal, id) => {
    return await BiddingContract(connect(DB_CONNECTION, portal)).findById(id)
        .populate({
            path: 'biddingPackage', populate: [
                {
                    path: 'proposals.tasks.backupEmployees',
                    select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                },
                {
                    path: 'proposals.tasks.directEmployees',
                    select: '_id fullName emailInCompany personalEmail personalEmail2 emergencyContactPersonEmail'
                },
            ]
        })
        .populate({
            path: 'project', populate: [
                {path: 'projectManager', select: 'name email avatar'},
                {path: 'responsibleEmployees', select: 'name email avatar'},
            ]
        })
        .populate({path: 'creator'});
}

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
        .populate({path: 'biddingPackage'})
        .populate({path: 'project'})
        .populate({path: 'creator'});

    if (!contract) {
        throw ['contract_invalid'];
    }


    let deleteFile = '.' + contract.fileUrl;
    if (file) {
        if (
            deleteFile.length !== 0 &&
            existsSync(deleteFile)
        ) {
            unlinkSync(deleteFile);
        }
        contract.fileUrl = file;
    }
    await contract.save();

    return contract;
};

exports.createProjectByContract = async (portal, contractId, data, company) => {
    const project = await createProjectInfo(portal, data.project);
    if (!project) throw ['create_project_failed!'];

    const projectId = project._id;
    const createdTaskList = await createTaskProjectCPM(portal, projectId, data.tasks);
    if (!createdTaskList) throw ['create_task_project_failed!'];

    const updatedProject = await updateProjectInfoAfterCreateProjectTask(portal, projectId, createdTaskList)
    if (!updatedProject) throw ['failed_to_update_project_after_create_project_task!'];

    await BiddingContract(connect(DB_CONNECTION, portal)).findByIdAndUpdate(contractId, {$set: {'project': projectId}}, {new: true});

    const listContract = await this.searchBiddingContract(portal, {}, company);
    // const newContract = await BiddingContract(connect(DB_CONNECTION, portal)).findById(contractId);
    const newContract = await this.getBidContractById(portal, contractId);

    return {
        newContract: newContract,
        contracts: listContract,
        tasks: createdTaskList,
    }
}
