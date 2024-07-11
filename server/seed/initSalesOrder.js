const mongoose = require('mongoose');
const {
  SalesOrder,
  Good,
  MarketingCampaign,
  Customer,
  User,
  ServiceLevelAgreement,
  Tax,
  Discount,
  MarketingEffective,
  Quote,
} = require('../models');
const saleOrders1 = require('./SaleOrders1.json');
const saleOrders2 = require('./SalesOrder2.json');
const marketingCampaign = require('./MarketingCampaign.json');
const marketingEffective = require('./MarketingEffective.json');
const quotes = require('./Quote.json');
require('dotenv').config();

const initSalesOrder = async () => {
  let connectOptions =
    process.env.DB_AUTHENTICATION === 'true'
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
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
    connectOptions
  );
  if (!vnistDB) throw 'DB vnist cannot connect';

  console.log('DB vnist connected');

  const initModels = (db) => {
    if (!db.models.SalesOrder) SalesOrder(db);
    if (!db.models.Quote) Quote(db);
  };

  initModels(vnistDB);

  // Gộp saleOrders1 và saleOrders2 thành một mảng duy nhất saleOrders
  const saleOrders = [...saleOrders1, ...saleOrders2];

  // Insert danh sách MarketingCampaign từ file JSON vào database
  const listMarketing1 = marketingCampaign.map((subCat) => ({ ...subCat }));
  await MarketingCampaign(vnistDB).insertMany(listMarketing1);

  // Lấy danh sách sản phẩm từ Good collection trong database
  let products_in_stock = await Good(vnistDB).find({});

  // Lấy danh sách MarketingCampaign từ MarketingCampaign collection trong database
  let listMarketing = await MarketingCampaign(vnistDB).find({});

  // Lấy danh sách khách hàng từ Customer collection trong database
  let listCustomers = await Customer(vnistDB).find({});

  // Lấy danh sách người dùng từ User collection trong database
  let users = await User(vnistDB).find({});

  // Lấy danh sách ServiceLevelAgreement từ ServiceLevelAgreement collection trong database
  let listServiceLevelAgreements = await ServiceLevelAgreement(vnistDB).find(
    {}
  );

  // Lấy danh sách Tax từ Tax collection trong database
  let listTaxs = await Tax(vnistDB).find({});

  // Lấy danh sách Discount từ Discount collection trong database
  let listDistcounts = await Discount(vnistDB).find({});

  // Chuyển đổi danh sách MarketingEffective từ file JSON và insert vào database
  const listMarketingEffective = await Promise.all(
    marketingEffective.map(async (subCat) => {
      const marketingCampaign = await MarketingCampaign(vnistDB).findOne({
        code: subCat.code,
      });
      return {
        ...subCat,
        marketingId: marketingCampaign._id,
      };
    })
  );
  await MarketingEffective(vnistDB).insertMany(listMarketingEffective);

  console.log('Khởi tạo dữ liệu đơn bán hàng');

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  function generateRandomCode(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const batchSize = 3000; // Số lượng bản ghi trong mỗi lô
  for (let i = 0; i < saleOrders.length; i += batchSize) {
    let bulkOperations = [];
    for (let j = i; j < i + batchSize && j < saleOrders.length; j++) {
      let salesOrder = saleOrders[j];

      // Bỏ qua đơn hàng có status = 0
      if (salesOrder.status === 0) {
        continue;
      }

      let product = products_in_stock.find(
        (product) => product.code === String(salesOrder.product_id)
      );
      let marketingCampaign = listMarketing.find(
        (marketing) => marketing.code == salesOrder.campaign_id
      );
      let customer = getRandomElement(listCustomers);
      let user = getRandomElement(users);

      bulkOperations.push({
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
                      'Đóng gói đúng quy trình',
                      'Sản phẩm đi đầu về chất lượng',
                    ],
                    _id: listServiceLevelAgreements[0]._id,
                    title: 'Chất lượng sản phẩm đi đầu',
                  },
                ],
                taxs: [
                  {
                    _id: listTaxs[0]._id,
                    code: listTaxs[0]._id,
                    name: 'VAT',
                    description: listTaxs[0]._id,
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
                _id: listDistcounts[5]._id,
                code: listDistcounts[5].code,
                type: listDistcounts[5].type,
                formality: listDistcounts[5].formality,
                name: listDistcounts[5].name,
                effectiveDate: listDistcounts[5].effectiveDate,
                expirationDate: listDistcounts[5].expirationDate,
                maximumFreeShippingCost: 20000,
              },
              {
                _id: listDistcounts[6]._id,
                code: listDistcounts[6].code,
                type: listDistcounts[6].type,
                formality: listDistcounts[6].formality,
                name: listDistcounts[6].name,
                effectiveDate: listDistcounts[6].effectiveDate,
                expirationDate: listDistcounts[6].expirationDate,
                discountedPercentage: 10,
              },
              {
                _id: listDistcounts[7]._id,
                code: listDistcounts[7].code,
                type: listDistcounts[7].type,
                formality: listDistcounts[7].formality,
                name: listDistcounts[7].name,
                effectiveDate: listDistcounts[7].effectiveDate,
                expirationDate: listDistcounts[7].expirationDate,
                loyaltyCoin: 1000,
              },
            ],
            shippingFee: 10000,
            createdAt: salesOrder.date,
            deliveryTime: salesOrder.date,
            coin: 500,
            paymentAmount:
              (salesOrder.price * salesOrder.orders * 11) / 10 + 10000,
            note: 'Khách hàng quen thuộc',
            marketingCampaign: marketingCampaign._id,
          },
        },
      });
    }

    await SalesOrder(vnistDB).bulkWrite(bulkOperations);
    console.log(`Đã chèn xong lô từ ${i} đến ${i + batchSize - 1}`);
  }
  let listQuote = [];
  for (let i = 0; i < quotes.length; i++) {
    let quote = quotes[i];
    let product = products_in_stock.find(
      (product) => product.code === String(quote.product_id)
    );

    let customer = getRandomElement(listCustomers);
    let user = getRandomElement(users);
    let newQuote = {
      code: generateRandomCode(8),
      // status: quote.status,
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
          pricePerBaseUnit: quote.price,
          quantity: quote.orders,
          productionCost: quote.purchase_price,
          pricePerBaseUnitOrigin: product.pricePerBaseUnit,
          salesPriceVariance: product.salesPriceVariance,
          serviceLevelAgreements: [
            {
              descriptions: [
                'Đóng gói đúng quy trình',
                'Sản phẩm đi đầu về chất lượng',
              ],
              _id: listServiceLevelAgreements[0]._id,
              title: 'Chất lượng sản phẩm đi đầu',
            },
          ],
          taxs: [
            {
              _id: listTaxs[0]._id,
              code: listTaxs[0]._id,
              name: 'VAT',
              description: listTaxs[0]._id,
              percent: 5,
            },
          ],
          amount: quote.price,
          amountAfterDiscount: quote.price,
          amountAfterTax: (quote.price * 11) / 10,
        },
      ],
      discounts: [
        {
          _id: listDistcounts[5]._id,
          code: listDistcounts[5].code,
          type: listDistcounts[5].type,
          formality: listDistcounts[5].formality,
          name: listDistcounts[5].name,
          effectiveDate: listDistcounts[5].effectiveDate,
          expirationDate: listDistcounts[5].expirationDate,
          maximumFreeShippingCost: 20000,
        },
        {
          _id: listDistcounts[6]._id,
          code: listDistcounts[6].code,
          type: listDistcounts[6].type,
          formality: listDistcounts[6].formality,
          name: listDistcounts[6].name,
          effectiveDate: listDistcounts[6].effectiveDate,
          expirationDate: listDistcounts[6].expirationDate,
          discountedPercentage: 10,
        },
        {
          _id: listDistcounts[7]._id,
          code: listDistcounts[7].code,
          type: listDistcounts[7].type,
          formality: listDistcounts[7].formality,
          name: listDistcounts[7].name,
          effectiveDate: listDistcounts[7].effectiveDate,
          expirationDate: listDistcounts[7].expirationDate,
          loyaltyCoin: 1000,
        },
      ],
      shippingFee: 10000,
      createdAt: quote.date,
      effectiveDate: quote.date,
      expirationDate: quote.date,
    };

    listQuote.push(newQuote);
  }
  await Quote(vnistDB).insertMany(listQuote);
};

initSalesOrder()
  .then(() => {
    console.log('Xong! Khởi tạo dữ liệu doanh số từng tháng!');
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
  });
