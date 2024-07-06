const mongoose = require("mongoose");
const { Good, Category, ManufacturingMill,Company } = require("../models");
require("dotenv").config();
const categoryChild = require('./CategoryChild.json');
const listProducts = require('./ListProduct.json');
const initProduct = async () => {

    console.log('Init sample company database, ...');
    let connectOptions =
        process.env.DB_AUTHENTICATION === 'true'
            ? {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                user: process.env.DB_USERNAME,
                pass: process.env.DB_PASSWORD,
                auth: {
                    authSource: 'admin',
                },
            }
            : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            };
    const systemDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME
        }`,
        connectOptions
    );

    let connectVNISTOptions =
        process.env.DB_AUTHENTICATION === 'true'
            ? {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
                user: process.env.DB_USERNAME,
                pass: process.env.DB_PASSWORD,
                auth: {
                    authSource: 'admin',
                },
            }
            : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            };
    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
        connectVNISTOptions
    );
    if (!vnistDB) throw "DB vnist cannot connect";

    console.log("DB vnist connected");

    const initModels = (db) => {
        if (!db.models.Category) Category(db);
        if (!db.models.Good) Good(db);
    };

    initModels(vnistDB);
    initModels(systemDB);
    /**
    * Tạo dữ liệu
    */
    let vnist = await Company(systemDB).find({})
    console.log(vnist)
    let listGood = await Good(vnistDB).find({ description: 'Nguyên liệu may quần áo, giày' });
    let manufacturingMills = await ManufacturingMill(vnistDB).find({})
    let listCategory = await Category(vnistDB).find({});
    let listCategoryChild = categoryChild.map((subCat) => {
        return {
            ...subCat,
            parent: listCategory[0]._id, // Gán _id của danh mục cha đầu tiên cho tất cả danh mục con, bạn có thể thay đổi điều này nếu muốn phân biệt
        };
    });
    let listCategoryChild1 = await Category(vnistDB).insertMany(listCategoryChild);


    console.log('Khởi tạo dữ liệu hàng hóa');
    let newProducts = [];

    listProducts.forEach((product) => {
        let newProduct = {
            company: vnist._id,
            name: product.name,
            code: product.code,
            type: 'product',
            baseUnit: 'Chiếc',
            unit: [],
            sourceType: '1',
            quantity: 20,
            description: product.description,
            materials: [
                {
                    good: listGood[0]._id,
                    quantity: 5,
                },
            ],
            numberExpirationDate: 800,
            manufacturingMills: [
                {
                    manufacturingMill: manufacturingMills[12]._id,
                    productivity: 100,
                    personNumber: 3,
                },
            ],
            pricePerBaseUnit: product.pricePerBaseUnit,
            salesPriceVariance: 9000,
        };

        let category = listCategoryChild1.find((category) => category.code === product.categories_id);
        if (category) {
            newProduct.category = category._id;
        }

        newProducts.push(newProduct);
    });
    await Good(vnistDB).insertMany(newProducts);
    // const list_goods = await Good(vnistDB).insertMany(newProducts);
    console.log('Khởi tạo xong danh sách hàng hóa');
}
initProduct().then(() => {
    console.log("Xong! Khởi tạo dữ liệu hàng hóa!")
    process.exit(0)

}).catch(err => {
    console.log(err)
})