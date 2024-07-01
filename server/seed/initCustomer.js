const mongoose = require("mongoose");
const { Customer,
    CustomerCare,
    CustomerCareType,
    CustomerGroup,
    CustomerStatus,
    CustomerRankPoint,
    CustomerCareUnit, User} = require("../models");
const listCustomer = require('./Customer.json')
require("dotenv").config();
 
const initCustomer = async () => {
    let connectOptions =
        process.env.DB_AUTHENTICATION === "true"
            ? {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                user: process.env.DB_USERNAME,
                pass: process.env.DB_PASSWORD,
            }
            : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            };
    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/vnist`,
        connectOptions
    );
    if (!vnistDB) throw "DB vnist cannot connect";

    console.log("DB vnist connected");

    const initModels = (db) => {
        if (!db.models.Customer) Customer(db);
    };

    initModels(vnistDB);
    let customerStatuss = await CustomerStatus(vnistDB).find({});
    let users = await User(vnistDB).find({});
    let customerCareUnits =await CustomerCareUnit(vnistDB).find({});
    let customerGroups =await CustomerGroup(vnistDB).find({});
    for (let i = 0; i < listCustomer.length; i++) {
        const now = new Date();
        const month =
            now.getMonth() - i > 0 ? now.getMonth() - i : now.getMonth() - i + 12;
        const year =
            now.getMonth() - i > 0 ? now.getFullYear() : now.getFullYear() - 1;
        await Customer(vnistDB).create({
            owner: [users[(i % 3) + 5]._id],
            customerStatus: [customerStatuss[i % 5]._id],
            point: 0,
            isDeleted: false,
            code: listCustomer[i].code,
            name: listCustomer[i].name,
            customerType: listCustomer[i].customerType,
            customerGroup: customerGroups[i % 4]._id,
            gender: listCustomer[i].gender,
            birthDate: listCustomer[i].birthDate,
            mobilephoneNumber: listCustomer[i].mobilephoneNumber,
            email: listCustomer[i].email,
            address: listCustomer[i].address,
            telephoneNumber: listCustomer[i].telephoneNumber,
            taxNumber: 'Tax 123456789',
            location: 1,
            customerSource: listCustomer[i].customerSource,
            statusHistories: [
                {
                    createdAt: new Date(),
                    oldValue: customerStatuss[1]._id,
                    newValue: customerStatuss[1]._id,
                    createdBy: users[(i % 3) + 5]._id,
                    description: 'Khách hàng được khởi tạo',
                },
                {
                    oldValue: customerStatuss[1]._id,
                    newValue: customerStatuss[i % 5]._id,
                    createdAt: new Date(),
                    createdBy: users[(i % 3) + 5]._id,
                    description: 'Khách hàng đã được chuyển trạng thái',
                },
            ],
            creator: users[(i % 3) + 5]._id,
            rankPoints: [
                {
                    point: Math.floor(Math.random() * 9876),
                    expirationDate: new Date(year, 12),
                },
                {
                    point: Math.floor(Math.random() * 98),
                    expirationDate: new Date(year, 12),
                },
            ],
            files: [],
            promotions: [],
            createdAt: new Date(year, month),
            updatedAt: new Date(),
            __v: 0,
            address2: '',
            company: '',
            companyEstablishmentDate: null,
            email2: '',
            linkedIn: '',
            note: '',
            represent: '',
            website: '',
            customerCareUnit: customerCareUnits[0]._id,
        });
        console.log(`Tạo dữ liệu khách hàng thứ ${i + 1}/${listCustomer.length}`);
    }

    console.log('Xong! Đã tạo mẫu dữ liệu khách hàng');




}
initCustomer().then(() => {
    console.log("Xong! Khởi tạo dữ liệu inventory!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})