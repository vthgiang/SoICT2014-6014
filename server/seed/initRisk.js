const mongoose = require("mongoose");
const models = require('../models');
var faker = require('faker');
const riskList = require('./RiskTemplate.json');
const { TaskDistribution, Task } = require("../models");
const { connect } = require("../helpers/dbHelper");
const {
    User,
    Risk,
    RiskDistribution,
    Impact
} = models;
require('dotenv').config();

const initRisk = async () => {

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
        if (!db.models.Risk) Risk(db);
        if (!db.models.RiskDistribution) RiskDistribution(db);
        if( !db.models.Impact) Impact(db)
    }
    initModels(vnistDB);
    /**
    * Tạo dữ liệu cho mạng Bayes
    */
    let riskIdList = riskList.map(r => r.id)
    let riskNameList = riskList.map(r => r.name)
    let probList = riskList.map(r => r.probs)
    let parentsList = riskList.map(r => r.parents == undefined ? [] : r.parents)
    let taskClass = riskList.map(r=>r.taskClass == undefined?[]:r.taskClass)
    let isRiskClass = riskList.map(r => r.isRiskClass)
    console.log('isRiskClass',isRiskClass)
    let riskDisList = []
    for (let i = 0; i < riskIdList.length; i++) {
        riskDisList = [
            ...riskDisList,
            {
                riskID: riskIdList[i],
                parents: parentsList[i],
                probs: probList[i],
                name: riskNameList[i],
                taskClass : taskClass[i],
                parentList: [],
                isRiskClass:isRiskClass[i]
            }
        ]
    }
    await RiskDistribution(vnistDB).deleteMany({})
    var risk = await RiskDistribution(vnistDB).insertMany(riskDisList)
    // update riskParent
    var allRiskDis = await RiskDistribution(vnistDB).find()
    for (let riskDis of allRiskDis) {
        let parentList = []
        if (riskDis.parents.length != 0 && riskDis.parents != undefined) {

            for (let par of riskDis.parents) {
                riskPar = await RiskDistribution(vnistDB).findOne({ riskID: par })
                parentList = [...parentList, riskPar]
            }
            riskDis.parentList = parentList
        }
    }
    await RiskDistribution(vnistDB).deleteMany({})
    var risk = await RiskDistribution(vnistDB).insertMany(allRiskDis)
    /**
   * Tạo dữ liệu các Risk
   */
    riskDisList = await RiskDistribution(vnistDB).find().select(['riskID','name','parents','taskClass']);
    console.log('riskDisList',riskDisList)
    var riskNameParent = new Map(riskDisList.map(rd => [rd.name,rd.parents]))
    var riskNameIDMap = new Map(riskDisList.map(rd=> [rd.name,rd.riskID]))
    console.log(riskNameIDMap)
    let usersData = await User(vnistDB).find().select('_id');
    const adminData = await User(vnistDB).findOne({name: "Admin VNIST"}).select('_id');
    let items = [];
    const getRandomItem= (list,num=0,unique=true) =>{
        let items = []
        if(num ==0) return list[Math.floor(Math.random() * list.length)];
        for(var i=0;i<num;i++){

            var item = list[Math.floor(Math.random() * list.length)];
            if(unique==true){
                if(!items.includes(item)){
                    items = [...items,item]
                }
            }
        }

        return items;
    }
    let taskDistribution = await TaskDistribution(vnistDB).find()
    // Tạo một Map key: riskID, value : Những giá trị taskDistribution có class nằm trong trường taskClass
    let riskIDTasks = []// Lấy về những task chịu ảnh hưởng của Risk
    for(let rd of riskDisList){
        let taskClass = rd.taskClass
        let value = taskDistribution[0].tasks.filter(t=> taskClass.includes(t.class)).map(t=> t.taskID)
        riskIDTasks.push([rd.riskID,value])
    }
    riskIDTasks = new Map(riskIDTasks)
    let taskIDTemp = []
    let riskStatus  = {
        wait: 'wait_for_approve',
        finished: 'finished',
        approved: 'approved',
        inprocess: 'inprocess'
    }
    console.log('map with riskID and Task',riskIDTasks)
    for (i = 0; i < 100; i++) {

        let riskName = getRandomItem(riskList.map(r=>r.name))
        let riskID = riskNameIDMap.get(riskName)
        let riskParents = riskNameParent.get(riskName).sort()
        let randNumPar = faker.datatype.number({
            'min': 0,
            'max': riskParents.length
        })
        let status = riskStatus.finished
        if(i<14){
            status = riskStatus.inprocess
        }
        // tạo một impact
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        let impact = await Impact(vnistDB).create({
            type:1,
            health:getRandomInt(1,4),
            security:getRandomInt(1,4),
            enviroment:getRandomInt(1,4)
        })

        let taskRelateList = await Task(vnistDB).find().where('codeInProcess').in(riskIDTasks.get(riskID))
        let randNumTaskRelate = faker.datatype.number({
            'min': 1,
            'max': 3
        })
        // let riskDisOfRisk = riskDisList.find()
        let taskRelate = getRandomItem(taskRelateList,randNumTaskRelate)
        // lấy giá trị unique
        taskRelate = Array.from(new Set(taskRelate))
        let start = new Date()
        items.push(
            {
                riskID: riskID,
                riskName: riskName,
                description: riskName,
                raisedDate: faker.date.between('2021-05-01', '2021-05-19'),
                occurrenceDate: faker.date.between('2020-10-01', '2021-05-19'),
                responsibleEmployees: [faker.random.arrayElement(usersData)],
                accountableEmployees: adminData,
                riskParents: faker.random.arrayElements(riskParents,randNumPar),
                parentChecked: faker.random.arrayElements(riskParents,randNumPar),
                taskRelate: taskRelate,
                ranking: getRandomInt(1,12),
                riskStatus: faker.random.arrayElement(['finished','inprocess','wait_for_approve']),
                impact:impact
            }
        )
    }

    await Risk(vnistDB).deleteMany({})
    var risk = await Risk(vnistDB).insertMany(items)
    initModels(vnistDB);
}
initRisk().then(()=>{
    console.log("Xong! Khởi tạo dữ liệu cho rủi ro thành công!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})
// process.exit()