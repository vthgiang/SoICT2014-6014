const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
    Component,
    Company,
    Link,
    User,
    SystemApi,
    Task,
    Resource,
    Requester,
    AuthorizationPolicy,
    Service,
} = require('../models');

require('dotenv').config();

const syncDBAuth = async () => {
    console.log('Init sync database for authorization, ...');

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

    vnistDB.dropCollection('resources')
    vnistDB.dropCollection('requesters')
    vnistDB.dropCollection('services')
    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        if (!db.models.Component) Component(db);
        if (!db.models.Company) Company(db);
        if (!db.models.Link) Link(db);
        if (!db.models.User) User(db);
        if (!db.models.SystemApi) SystemApi(db);
        if (!db.models.Resource) Resource(db);
        if (!db.models.Requester) Requester(db);
        if (!db.models.AuthorizationPolicy) AuthorizationPolicy(db);
    };

    initModels(vnistDB);

    const superAdmin = await User(vnistDB).findOne({email: 'super.admin.vnist@gmail.com'});
    
    // add components to Resource
    const components = await Component(vnistDB).find();
    const componentResources = components.map(x => ({
        name: x.name,
        refId: x._id,
        type: 'Component',
        owner: superAdmin._id,
        ownerType: 'User',
        attributes: []
    }));
    
    await Resource(vnistDB).insertMany(componentResources);

    // add links to Resource
    const links = await Link(vnistDB).find();
    const linkResources = links.map(x => ({
        name: x.url,
        refId: x._id,
        type: 'Link',
        owner: superAdmin._id,
        ownerType: 'User',
        attributes: []
    }));
    
    await Resource(vnistDB).insertMany(linkResources);

    // add apis to Resource
    const apis = await SystemApi(systemDB).find();
    const apiResources = apis.map(x => ({
        name: x.path,
        refId: x._id,
        type: 'SystemApi',
        owner: superAdmin._id,
        ownerType: 'User',
        attributes: []
    }));
    
    await Resource(vnistDB).insertMany(apiResources);
    await SystemApi(vnistDB).insertMany(apis);

    // add tasks to Resource
    const tasks = await Task(vnistDB).find();
    const taskResources = tasks.map(x => ({
        name: x.code,
        refId: x._id,
        type: 'Task',
        owner: x.organizationalUnit,
        ownerType: 'OrganizationalUnit',
        attributes: []
    }));
    
    await Resource(vnistDB).insertMany(taskResources);

    // add Users to Requester
    const users = await User(vnistDB).find();
    const userRequesters = users.map(x => ({
        name: x.name,
        refId: x._id,
        type: 'User',
        attributes: []
    }));
    
    await Requester(vnistDB).insertMany(userRequesters);


    // init new Services
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('vnist123@', salt);
    await Service(vnistDB).insertMany([
        {
          // 1
          name: 'Task Service',
          email: 'task.service@vnist.com',
          password: hash,
          company: vnist._id,
        },
        {
          // 2
          name: 'User Service',
          email: 'user.service@vnist.com',
          password: hash,
          company: vnist._id,
        },
        {
          // 3
          name: 'Google Service',
          email: 'google.service@vnist.com',
          password: hash,
          company: vnist._id,
        },
    ]);

    // add Services to Requester
    const services = await Service(vnistDB).find();
    const serviceRequesters = services.map(x => ({
        name: x.name,
        refId: x._id,
        type: 'Service',
        attributes: []
    }));
    
    await Requester(vnistDB).insertMany(serviceRequesters);

    systemDB.close();
    vnistDB.close();

    console.log('End sync database for authorization!');
};

syncDBAuth().catch((err) => {
    console.log(err);
    process.exit(0);
});
