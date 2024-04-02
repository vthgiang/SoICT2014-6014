const mongoose = require("mongoose");
const models = require('../models');
var faker = require('faker');
const {
    RiskDistribution,
    BayesDataset,
    TaskDistribution
} = models;

require('dotenv').config();
const initDataset = async () => {
    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectOptions);
    const initModels = (db) => {
        console.log("models", db.models);
        if (!db.models.BayesDataset) BayesDataset(db);
        if (!db.models.RiskDistribution) RiskDistribution(db);
    }
    initModels(vnistDB);
    const riskDistributions = await RiskDistribution(vnistDB).find()
    let items = []

    for (let j = 0; j < 100; j++) {
        let states = []
        for (let i = 0; i < riskDistributions.length; i++) {
            states = [
                ...states,
                faker.random.arrayElement([1, 0])
            ]
        }
        items.push({
            type: 1,
            states: states
        })
    }

    // Tạo dataset cho các công việc
    let taskData = []
    let taskDisList = await TaskDistribution(vnistDB).find()
    for (let taskDis of taskDisList) {
        let tasks = taskDis.tasks
        let dataPointConfig = []
        for (let task of tasks) {
            let parentLength = task.parentList.length// Số task cha
            let dataPointLength = 3 + parentLength// 3 nút cố định :nút xác suất thành công, nút rủi ro, nút xác suất thành công tính theo PERT
            let max = 2 ** (dataPointLength) - 1
            dataPointConfig.push(max)
        }
        for (let i = 0; i < 100; i++) {
            let states = []
            for (let dp of dataPointConfig) {
                let randNumInRange = faker.datatype.number({
                    'min': 0,
                    'max': dp
                })
                states = [...states, randNumInRange]
            }
            taskData = [...taskData, {
                taskDistribution:taskDis,
                type: 2,
                states: states
            }]
        }

    }
    
    
    await BayesDataset(vnistDB).deleteMany({})
    const bayesDataSet = await BayesDataset(vnistDB).insertMany(items)
    await BayesDataset(vnistDB).insertMany(taskData)


}
initDataset().then(
    res => {
        console.log('Tạo dataset mẫu thành công')
        process.exit(0)
    }
).catch(err => {
    console.log(err);
    process.exit(0)
});