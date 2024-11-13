const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
    Entity,
    Object,
    Attribute,
    Rule,
    Policy,
    Company
} = require('../models');

require('dotenv').config();

const syncDBAuth = async () => {
    console.log('Init sync database for security, ...');

    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
     */
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
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
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
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectVNISTOptions);
    
    /**
     * 1.3. Lấy dữ liệu về công ty VNIST trong database của hệ thống
     */
    const vnist = await Company(systemDB).findOne({
        shortName: 'vnist',
    });

    try {
        const collections = await vnistDB.db.listCollections().toArray();
        const dropIfExists = async (collectionName) => {
            if (collections.some(col => col.name === collectionName)) {
            await vnistDB.dropCollection(collectionName);
                console.log(`Dropped collection: ${collectionName}`);
            } else {
                console.log(`Collection ${collectionName} does not exist.`);
            }
        };

        await dropIfExists('entities');
        await dropIfExists('objects');
    } catch (error) {
        console.error('Error dropping collections:', error);
    }
    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        if (!db.models.Entity) Entity(db);
        if (!db.models.Object) Object(db);
        if (!db.models.Attribute) Attribute(db);
        if (!db.models.Rule) Rule(db);
        if (!db.models.Policy) Policy(db);
    };


    initModels(vnistDB);

    // init new Entites
    // const salt = await bcrypt.genSaltSync(10);
    // const hash = await bcrypt.hashSync('vnist123@', salt);
    await Entity(vnistDB).insertMany([
        {
          // 1
          name: 'John Doe',
          type: 'Human',
          attributes: [
            {
                key: 'pos',
                value: 'Sales Manager',
                dataType: 'string'
            },
            {
                key: 'department',
                value: 'Sales',
                dataType: 'string'
            },
            {
                key: 'clearance_level',
                value: '3',
                dataType: 'int'
            },
            {
                key: 'prj',
                value: 'New Product Launch',
                dataType: 'string'
            },
          ]
        },
        {
            // 2
            name: 'Automatic report analysis',
            type: 'Service',
            attributes: [
              {
                  key: 'bot_function',
                  value: 'report_analysis',
                  dataType: 'string'
              },
              {
                  key: 'type',
                  value: 'microservice',
                  dataType: 'string'
              },
              {
                  key: 'prj',
                  value: 'New Product Launch',
                  dataType: 'string'
              }
            ]
          },
          {
            // 2
            name: 'Admin',
            type: 'Human',
            attributes: [
            ]
          },
    ]);

    const entity = await Entity(vnistDB).findOne({
        name: 'Admin'
    });

    await Object(vnistDB).insertMany([
        {
          // 1
          name: 'Sales Report',
          relatedEntities: {
            owner: entity.id
          },
          type: 'Resource',
          attributes: [
            {
                key: 'type',
                value: 'financial_report',
                dataType: 'string'
            },
            {
                key: 'department',
                value: 'Sales',
                dataType: 'string'
            },
            {
                key: 'confidentiality',
                value: 'high',
                dataType: 'string'
            }
          ]
        },
        {
            // 2
            name: 'Set Sales Targets',
            relatedEntities: {
              owner: entity.id
            },
            type: 'Action',
            attributes: [
              {
                  key: 'type',
                  value: 'action',
                  dataType: 'string'
              },
              {
                  key: 'department',
                  value: 'Sales',
                  dataType: 'string'
              },
              {
                  key: 'impact_level',
                  value: 'high',
                  dataType: 'string'
              }
            ]
          },
          {
            // 3
            name: 'Sales Targets',
            relatedEntities: {
              owner: entity.id
            },
            type: 'Resource',
            attributes: [
              {
                  key: 'type',
                  value: 'sales_target',
                  dataType: 'string'
              },
              {
                  key: 'department',
                  value: 'Sales',
                  dataType: 'string'
              }
            ]
          },
    ]);

    systemDB.close();
    vnistDB.close();

    console.log('End sync database for authorization!');
};

syncDBAuth().catch((err) => {
    console.log(err);
    process.exit(0);
});
