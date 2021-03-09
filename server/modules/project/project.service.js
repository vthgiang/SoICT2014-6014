const {
    Project,
    Role,
    UserRole,
    OrganizationalUnit,
} = require('../../models');
const arrayToTree = require("array-to-tree");
const fs = require("fs");
const ObjectId = require("mongoose").Types.ObjectId;
const { connect, } = require(`../../helpers/dbHelper`);
const { dateParse } = require(`../../helpers/functionHelper`);



exports.get = async (portal, query) => {
    let page = query.page;
    let limit = query.limit;
    let options = {};
    if (query.limit) {
        // options = {
        //     ...options,
        //     limit: query.limit
        // }
        // limit = query.lim
    }

    if (query.page) {
        // options = {
        //     ...options,
        //     page: query.page
        // }
    }
    let project;
    if (query.calledId === "paginate") {
        project = await Project(
            connect(DB_CONNECTION, portal)
        ).paginate(options, {
            page, limit,
            populate: [{ path: "projectManager", select: "_id name" }]
        });
    }
    else
        project = await Project(connect(DB_CONNECTION, portal)).find(options).populate({path: "projectManager", select:"_id name"});
    return project;
}

exports.show = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id).populate({path: "projectManager", select:"_id name"});

    return tp;
}

exports.create = async (portal, data) => {
    let project = await Project(connect(DB_CONNECTION, portal)).create(data);

    return project;
}

exports.edit = async (portal, id, data) => {
    console.log('data', data);
    const a = await Project(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, {
        $set: {
            code: data.code,
            name: data.name,
            parent: data.parent,
            startDate: data.startDate,
            endDate: data.startDate,
            description: data.description,
            projectManager: data.projectManager,
        }
    }, { new: true });
    return await Project(connect(DB_CONNECTION, portal)).findOne({ _id: id }).populate({ path: "projectManager", select: "_id name" });
}

exports.delete = async (portal, id) => {
    await Project(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    return id;
}


