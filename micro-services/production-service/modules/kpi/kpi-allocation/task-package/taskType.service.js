const Models = require(`../../../../models`);
const { TaskType } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const getListTaskType = async (company_id, portal) => {
    const listTaskType = await TaskType(connect(DB_CONNECTION, portal)).find({ company_id: new ObjectId(company_id) });
    return listTaskType;
};

const addTaskType = async (company_id, portal, { name }) => {
    const taskType = await TaskType(connect(DB_CONNECTION, portal)).create({
        name,
        company_id: new ObjectId(company_id),
    });

    return taskType;
};

module.exports = {
    getListTaskType,
    addTaskType,
};
