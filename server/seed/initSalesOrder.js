const mongoose = require("mongoose");
const {
    SalesOrder,
    Good,
    MarketingCampaign,
    Customer,
    User,
    ServiceLevelAgreement,
    Tax,
    Discount,
    MarketingEffective
} = require("../models");
const saleOrders = require('./SaleOrders.json');
require("dotenv").config();
const marketingCampaign = require('./MarketingCampaign.json');
const marketingEffective = require("./MarketingEffective.json");

const initSalesOrder = async () => {
    const connectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        ...(process.env.DB_AUTHENTICATION === "true" && {
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        }),
    };

    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/vnist`,
        connectOptions
    );

    vnistDB.on('error', console.error.bind(console, 'connection error:'));
    vnistDB.once('open', () => {
        console.log("DB vnist connected");
    });

    const initModels = (db) => {
        if (!db.models.SalesOrder) SalesOrder(db);
    };

    initModels(vnistDB);

    await MarketingCampaign(vnistDB).insertMany(marketingCampaign);
    console.log("Marketing Campaigns inserted");

    const [
        productsInStock,
        listMarketing,
        listCustomers,
        users,
        listServiceLevelAgreements,
        listTaxes,
        listDiscounts
    ] = await Promise.all([
        Good(vnistDB).find({}),
        MarketingCampaign(vnistDB).find({}),
        Customer(vnistDB).find({}),
        User(vnistDB).find({}),
        ServiceLevelAgreement(vnistDB).find({}),
        Tax(vnistDB).find({}),
        Discount(vnistDB).find({}),
    ]);

    const listMarketingEffective = await Promise.all(
        marketingEffective.map(async (subCat) => {
            const marketingCampaign = await MarketingCampaign(vnistDB).findOne({ code: subCat.code });
            return {
                ...subCat,
                marketingId: marketingCampaign._id
            };
        })
    );

    await MarketingEffective(vnistDB).insertMany(listMarketingEffective);
    console.log("Marketing Effective inserted");

    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    const batchSize = 10000; // Số lượng bản ghi trong mỗi lô
    for (let i = 0; i < saleOrders.length; i += batchSize) {
        const bulkOperations = saleOrders.slice(i, i + batchSize).map((salesOrder) => {
            const product = productsInStock.find(product => product.code === String(salesOrder.product_id));
            const marketingCampaign = listMarketing.find(marketing => marketing.code == salesOrder.campaign_id);

            const customer = getRandomElement(listCustomers);
            const user = getRandomElement(users);

            return {
                insertOne: {
                    document: {
                        code: salesOrder.code,
                        status: salesOrder.status,
                        creator: user._id,
                        customer: customer._id,
                        customerName: customer.name,
                        customerPhone: customer.mobilephoneNumber,
                        customerAddress: customer.address,
                        customerRepresent: customer.represent,
                        customerTaxNumber: customer.taxNumber,
                        customerEmail: customer.email,
                        approvers: [
                            {
                                approver: users[1]._id,
                                status: 2,
                            },
                        ],
                        priority: 1,
                        goods: [
                            {
                                good: product._id,
                                pricePerBaseUnit: salesOrder.price,
                                quantity: salesOrder.orders,
                                productionCost: salesOrder.purchase_price,
                                pricePerBaseUnitOrigin: product.pricePerBaseUnit,
                                salesPriceVariance: product.salesPriceVariance,
                                serviceLevelAgreements: [
                                    {
                                        descriptions: [
                                            "Đóng gói đúng quy trình",
                                            "Sản phẩm đi đầu về chất lượng",
                                        ],
                                        _id: listServiceLevelAgreements[0]._id,
                                        title: "Chất lượng sản phẩm đi đầu",
                                    },
                                ],
                                taxes: [
                                    {
                                        _id: listTaxes[0]._id,
                                        code: listTaxes[0]._id,
                                        name: "VAT",
                                        description: listTaxes[0]._id,
                                        percent: 5,
                                    },
                                ],
                                amount: salesOrder.price,
                                amountAfterDiscount: salesOrder.price,
                                amountAfterTax: (salesOrder.price * 11) / 10,
                            },
                        ],
                        discounts: [
                            {
                                _id: listDiscounts[5]._id,
                                code: listDiscounts[5].code,
                                type: listDiscounts[5].type,
                                formality: listDiscounts[5].formality,
                                name: listDiscounts[5].name,
                                effectiveDate: listDiscounts[5].effectiveDate,
                                expirationDate: listDiscounts[5].expirationDate,
                                maximumFreeShippingCost: 20000,
                            },
                            {
                                _id: listDiscounts[6]._id,
                                code: listDiscounts[6].code,
                                type: listDiscounts[6].type,
                                formality: listDiscounts[6].formality,
                                name: listDiscounts[6].name,
                                effectiveDate: listDiscounts[6].effectiveDate,
                                expirationDate: listDiscounts[6].expirationDate,
                                discountedPercentage: 10,
                            },
                            {
                                _id: listDiscounts[7]._id,
                                code: listDiscounts[7].code,
                                type: listDiscounts[7].type,
                                formality: listDiscounts[7].formality,
                                name: listDiscounts[7].name,
                                effectiveDate: listDiscounts[7].effectiveDate,
                                expirationDate: listDiscounts[7].expirationDate,
                                loyaltyCoin: 1000,
                            },
                        ],
                        shippingFee: 10000,
                        createdAt: salesOrder.date,
                        deliveryTime: salesOrder.date,
                        coin: 500,
                        paymentAmount: (salesOrder.price * salesOrder.orders * 11) / 10 + 10000,
                        note: "Khách hàng quen thuộc",
                        marketingCampaign: marketingCampaign._id,
                    }
                }
            };
        });

        await SalesOrder(vnistDB).bulkWrite(bulkOperations);
        console.log(`Batch processed: ${i} to ${i + batchSize - 1}`);
    }
};

initSalesOrder().then(() => {
    console.log("Sales orders initialized successfully!");
    process.exit(0);
}).catch(err => {
    console.error(err);
});
