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
    console.log('aaaaaaaaa', query);
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
        ).paginate(options, { page, limit });
    }
    else
        project = await Project(connect(DB_CONNECTION, portal)).find(options);
    console.log('proooooooooo', project);
    return project;
}

exports.show = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id);

    return tp;
}

exports.create = async (portal, data) => {

    // console.log("create task project sss", data)
    let project = await Project(connect(DB_CONNECTION, portal)).create(data);

    return project;
}

exports.edit = async (portal, id, data) => {
    console.log('ddđ', id, data)
    let tp = await Project(connect(DB_CONNECTION, portal)).findById(id);
    if (!tp) throw ['task_project_notfound'];

    tp.name = data.name;
    tp.parent = data.parent;
    await tp.save();

    return tp;
}

exports.delete = async (portal, id) => {
    let tp = await Project(connect(DB_CONNECTION, portal)).deleteOne({ _id: id });
    // console.log('tpppp', tp)
    return id;
}


