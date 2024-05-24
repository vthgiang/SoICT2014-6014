const Models = require(`../../../../models`);
const { TaskPackageAllocation, TaskType } = Models;
const { connect } = require(`../../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const addTaskDetail = async (company_id, portal, payload) => {
    const {
        taskName,
        taskDescription,
        startDate,
        endDate,
        duration,
        taskValue,
        taskValueUnit,
        kpiId,
        kpiWeight,
        requireCertificates,
        requireMajors,
        taskType,
    } = payload;

    const taskTypeObject = await TaskType(connect(DB_CONNECTION, portal)).find({ name: taskType });
    const taskTypeId = taskTypeObject && taskTypeObject[0]._id;

    const [dayStart, monthStart, yearStart] = startDate.split('-');
    const formattedDateStringStart = `${yearStart}-${monthStart}-${dayStart}`;

    const [dayEnd, monthEnd, yearEnd] = endDate.split('-');
    const formattedDateStringEnd = `${yearEnd}-${monthEnd}-${dayEnd}`;

    const objectToSave = {
        name: taskName,
        description: taskDescription,
        durations: duration,
        startDate: new Date(formattedDateStringStart),
        endDate: new Date(formattedDateStringEnd),
        target: taskValue,
        unit: taskValueUnit,
        weight: kpiWeight,
        organizationalUnitKpi: new ObjectId(kpiId),
        taskTypeId: new ObjectId(taskTypeId),
        requireCertificates: requireCertificates.map((item) => {
            return new ObjectId(item);
        }),
        requireMajors: requireMajors.map((item) => {
            return new ObjectId(item);
        }),
    };

    const result = await TaskPackageAllocation(connect(DB_CONNECTION, portal)).create({ ...objectToSave });
    const result_id = result._id;
    const populateResult = await TaskPackageAllocation(connect(DB_CONNECTION, portal))
        .find({ _id: new ObjectId(result_id) })
        .populate('requireMajors')
        .populate('requireCertificates')
        .populate('organizationalUnitKpi')
        .populate('taskTypeId');

    return populateResult;
};

const getAllTaskPackage = async (company_id, portal) => {
    const populateResult = await TaskPackageAllocation(connect(DB_CONNECTION, portal))
        .find({})
        .populate('requireMajors')
        .populate('requireCertificates')
        .populate('organizationalUnitKpi')
        .populate('taskTypeId');
    return populateResult;
};

module.exports = {
    addTaskDetail,
    getAllTaskPackage,
};
