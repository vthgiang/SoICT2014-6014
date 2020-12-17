const {TaskProject} = require('../../../models');
const {connect} = require('../../../helpers/dbHelper');

exports.get = async(portal, query) => {
    let options = {};
    if(query.limit){
        options = {
            ...options,
            limit: query.limit
        }
    }

    if(query.page){
        options = {
            ...options,
            page: query.page
        }
    }

    let tp = await TaskProject(connect(DB_CONNECTION, portal)).find(options);

    return tp;
}

exports.show = async(portal, id) => {
    let tp = await TaskProject(connect(DB_CONNECTION, portal)).findById(id);

    return tp;
}

exports.create = async(portal, data) => {
    console.log("create task project sss")
    let tp = await TaskProject(connect(DB_CONNECTION, portal)).create(data);

    return tp;
}

exports.edit = async(portal, id, data) => {
    let tp = await TaskProject(connect(DB_CONNECTION, portal)).findById(id);
    if(!tp) throw ['task_project_notfound'];

    tp.name = data.name;
    tp.parent = data.parent
    await tp.save();

    return tp;
}

exports.delete = async(portal, id) => {
    let tp = await TaskProject(connect(DB_CONNECTION, portal)).deleteOne({_id: id});

    return tp;
}

