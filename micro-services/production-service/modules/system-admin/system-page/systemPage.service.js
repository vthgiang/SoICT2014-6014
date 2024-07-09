const mongoose = require("mongoose");
const { links } = require('../../../middleware/servicesPermission');
const models = require('../../../models');
const Terms = require('../../../helpers/config');
const { Link, Role, Privilege, RoleType } = models;

let connectOptions, systemDB, roleSystemAdmin, roleAbstract;

const init = async () => {
    connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        user: process.env.DB_USERNAME,
        pass: process.env.DB_PASSWORD,
        auth: {
            authSource: 'admin'
        }
    } : {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }
    systemDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/${process.env.DB_NAME}`,
        connectOptions
    );
    if (!systemDB) throw ('Error! Cannot connect to MongoDB. Please check connection. :(');
    roleAbstract = await RoleType(systemDB).findOne({ name: Terms.ROLE_TYPES.ROOT });
    roleSystemAdmin = await Role(systemDB).create({ // Tạo role System Admin
        name: Terms.ROOT_ROLES.SYSTEM_ADMIN.name,
        type: roleAbstract._id
    });
}



const getSystemPageApis = async (data) => {
    init();
    const { path, method, description, page = 1, perPage = 30 } = data
  
    const pageUrl = data.pageUrl;
    const pageApis = links.find(pageLink => pageLink.url === pageUrl)?.apis;

    return pageApis;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
const getSystemAdminPage = async (data) => {
    init();
    let keySearch = {};
    if (data?.exampleName?.length > 0) {
        keySearch = {
            url: {
                $regex: data.exampleName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Link(systemDB).countDocuments(keySearch);
    let examples = await Link(systemDB).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return { 
        data: examples, 
        totalList 
    }
}

const addSystemAdminPage = async (data, currentRole) => {
    init();
    let newSystemAdminPage;
    if (data && data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            newSystemAdminPage = await Link(systemDB).create({
                url: data[i].exampleName,
                description: data[i].description,
                deleteSoft: false
            });

            await Privilege(systemDB).create({
                resourceId: newSystemAdminPage._id,
                resourceType: 'Link',
                roleId: currentRole
            })
        }
    }
    let systemAdminPage = await Link(systemDB).findById({ _id: newSystemAdminPage._id });
    return systemAdminPage;
}

const deleteSystemAdminPage = async (pageIds) => {
    init();
    let pages = await Link(systemDB)
        .deleteMany({ _id: { $in: pageIds.map(item => mongoose.Types.ObjectId(item)) } });
    await Privilege(systemDB)
        .deleteMany({ resourceId: { $in: pageIds.map(item => mongoose.Types.ObjectId(item)) }})
    return pages;
}

exports.SystemPageServices = {
    getSystemPageApis,
    getSystemAdminPage,
    addSystemAdminPage,
    deleteSystemAdminPage
}