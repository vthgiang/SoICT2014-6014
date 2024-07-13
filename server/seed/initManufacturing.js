const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {
    User,
    UserRole,
    Role,
    RoleType,
    Asset,
    AssetType,
    Good,
    Company,
    OrganizationalUnit,
    ManufacturingWorks,
    ManufacturingMill,
    ManufacturingRouting,
    ManufacturingPlan,
    ManufacturingCommand,
    ManufacturingQualityError,
    ManufacturingQualityCriteria,
    ManufacturingQualityInspection,
    TaskTemplate,
    Task,
} = require('../models');
require('dotenv').config();

const Terms = require("../helpers/config");

const manufacturingData = require('./manufacturingData.json');


const initManufacturing = async () => {
    console.log('Init sample company database, ...');

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

    const systemDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
        connectOptions
    );

    if (!vnistDB) throw 'DB vnist cannot connect';
    console.log('DB vnist connected');

    const initModels = (db) => {
        if (!db.models.User) User(db);
        if (!db.models.UserRole) UserRole(db);
        if (!db.models.Role) Role(db);
        if (!db.models.Asset) Asset(db);
        if (!db.OrganizationUnit) OrganizationalUnit(db);
        if (!db.models.ManufacturingWorks) ManufacturingWorks(db);
        if (!db.models.ManufacturingMill) ManufacturingMill(db);
        if (!db.models.ManufacturingRouting) ManufacturingRouting(db);
        if (!db.models.ManufacturingPlan) ManufacturingPlan(db);
        if (!db.models.ManufacturingCommand) ManufacturingCommand(db);
        if (!db.models.ManufacturingQualityError) ManufacturingQualityError(db);
        if (!db.models.ManufacturingQualityCriteria) ManufacturingQualityCriteria(db);
        if (!db.models.ManufacturingQualityInspection) ManufacturingQualityInspection(db);

        console.log('models_list', db.models);
    };

    initModels(vnistDB);

    // Xóa dữ liệu cũ
    await ManufacturingRouting(vnistDB).deleteMany({});
    await ManufacturingPlan(vnistDB).deleteMany({});
    await ManufacturingCommand(vnistDB).deleteMany({});
    await ManufacturingQualityError(vnistDB).deleteMany({});
    await ManufacturingQualityCriteria(vnistDB).deleteMany({});
    await ManufacturingQualityInspection(vnistDB).deleteMany({});

    // get dữ liệu công ty
    const vnist = await Company(systemDB).findOne({
        shortName: 'vnist'
    })

    const Directorate = await OrganizationalUnit(vnistDB).findOne({
        name: 'Ban giám đốc',
    })

    // get dữ liệu role
    const roleEmployee = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.EMPLOYEE.name
    })

    const roleChucDanh = await RoleType(vnistDB).findOne({
        name: Terms.ROLE_TYPES.POSITION,
    });

    const roleManager = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.MANAGER.name,
    });

    const roleSuperAdmin = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
    });

    // get dữ liệu product

    const listProduct = await Good(vnistDB).find({
        code: "PR001"
    });

    // get dữ liệu tài sản
    const listAssetType = await AssetType(vnistDB).find({});


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('vnist123@', salt);

    // 1. Khởi tạo user nhà máy dược phẩm organic
    const manufacturingUsersData = manufacturingData.users.map(user => ({
        ...user,
        password: hash,
        company: vnist._id,
    }))

    const manufacturingUsers = await User(vnistDB).insertMany(manufacturingUsersData);

    // 2. Khởi tạo role cho nhà máy dược phẩm organic
    const nvNhaMayDuocPham = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: 'Nhân viên nhà máy dược phẩm organic',
        type: roleChucDanh._id,
    });

    const quanDocNhaMayDuocPham = await Role(vnistDB).create({
        parents: [roleManager._id, nvNhaMayDuocPham._id],
        name: 'Quản đốc nhà máy dược phẩm organic',
        type: roleChucDanh._id,
    });

    const nvXuongNguyenLieu = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên xử lý nguyên liệu',
        type: roleChucDanh._id,
    });

    const nvXuongXay = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên vận hành máy xay',
        type: roleChucDanh._id,
    });

    const nvXuongTron = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên vận hành máy trộn',
        type: roleChucDanh._id,
    });

    const nvXuongSay = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên xử lý nguyên liệu',
        type: roleChucDanh._id,
    });

    const nvXuongNen = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên vận hành máy nén',
        type: roleChucDanh._id,
    });

    const nvXuongDongGoi = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên đóng gói',
        type: roleChucDanh._id,
    });

    const nvQC = await Role(vnistDB).create({
        parents: [roleEmployee._id, nvNhaMayDuocPham._id],
        name: 'Nhân viên kiểm định chất lượng',
        type: roleChucDanh._id,
    });

    // 2.1 khởi tạo organanizational unit nhà máy dược phẩm 

    const nhaMayDuocPham = await OrganizationalUnit(vnistDB).create({
        name: "Nhà máy dược phẩm organic",
        description:
            "Nhà máy dược phẩm organic của công ty trách nhiệm hữu hạn VNIST Việt Nam",
        managers: [quanDocNhaMayDuocPham._id],
        deputyManagers: [],
        employees: [
            nvNhaMayDuocPham._id,
            nvXuongNguyenLieu._id,
            nvXuongXay._id,
            nvXuongTron._id,
            nvXuongSay._id,
            nvXuongNen._id,
            nvXuongDongGoi._id,
        ],
        parent: Directorate._id,
    });

    // 2.2 Gán role cho user nhà máy dược phẩm organic
    const roleNhaMayDuocPham = [
        nvXuongNguyenLieu,
        nvXuongXay,
        nvXuongTron,
        nvXuongSay,
        nvXuongNen,
        nvXuongDongGoi,
    ]

    const rolesData = []

    rolesData.push({
        userId: manufacturingUsers[0]._id,
        roleId: quanDocNhaMayDuocPham._id,
    })

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            rolesData.push({
                userId: manufacturingUsers[i * 4 + j + 1]._id,
                roleId: roleNhaMayDuocPham[i]._id,
            })
        }
    }

    rolesData.push({
        userId: manufacturingUsers[manufacturingUsers.length - 1]._id,
        roleId: nvQC._id,
    })

    rolesData.push({
        userId: manufacturingUsers[manufacturingUsers.length - 2]._id,
        roleId: nvQC._id,
    })


    await UserRole(vnistDB).insertMany(rolesData);

    // 2.3 Khởi tạo mẫu công việc cho nhà máy
    const responsibleTaskTemplate = await TaskTemplate(vnistDB).create({
        name: 'Mẫu công việc nhân viên sản xuất',
        creator: manufacturingUsers[0]._id,
        priority: 3,
        taskActions: [],
        taskInformations: [
            {
                code: "p1",
                name: "Sản lượng thực tế",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p2",
                name: "Sản lượng đạt yêu cầu",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p3",
                name: "Sản lượng không đạt yêu cầu",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p4",
                name: "Số lần kiểm tra tuân thủ quy trình",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p5",
                name: "Số lần không tuân thủ quy trình",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p6",
                name: "Thời gian dừng máy",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p7",
                name: "Thời gian rảnh rỗi"
            }
        ],
        readByEmployees: [quanDocNhaMayDuocPham._id],
        organizationalUnit: nhaMayDuocPham._id,
    })

    const qualityControlTaskTemplate =  await TaskTemplate(vnistDB).create({
        name: 'Mẫu công việc nhân viên kiểm định chất lượng',
        creator: manufacturingUsers[0]._id,
        priority: 3,
        taskActions: [],
        taskInformations: [
            {
                code: "p1",
                name: "Số lượng sản phẩm đã kiểm định",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p2",
                name: "Số lượng sản phẩm kiểm định lỗi",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p3",
                name: "Số lượng sản phẩm kiểm định đạt yêu cầu",
                description: "",
                type: "number",
                extra: "",
            },
            {
                code: "p4",
                name: "Số lỗi mới được phát hiện",
                description: "",
                type: "number",
                extra: "",
            }
        ],
        readByEmployees: [quanDocNhaMayDuocPham._id],
        organizationalUnit: nhaMayDuocPham._id,
    })

    // 3. Khởi tạo tài sản được giao cho nhà máy 
    const assetNhaMayDuocPham = await Asset(vnistDB).insertMany([
        {
            company: vnist._id,
            assetName: 'Máy kiểm tra nguyên liệu MMT1',
            code: 'MMT.0006',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00006',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[0]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy kiểm tra nguyên liệu',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        },
        {
            company: vnist._id,
            assetName: 'Máy xay SGE',
            code: 'MX.0006',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00006',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[0]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy xay nguyên liệu',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        },
        {
            company: vnist._id,
            assetName: 'Máy trộn D20',
            code: 'MT.0007',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00007',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[4]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy trộn nguyên liệu',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        },
        {
            company: vnist._id,
            assetName: 'Máy sấy 15MPa',
            code: 'MS.0008',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00008',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[4]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy nén thuốc viên',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        },
        {
            company: vnist._id,
            assetName: 'Máy nén 1.5T',
            code: 'MN.0008',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00008',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[4]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy nén thuốc viên',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        },
        {
            company: vnist._id,
            assetName: 'Máy đóng gói HC-61',
            code: 'MDG.0008',
            group: 'other',
            usefulLife: '20',
            unitsProducedDuringTheYears: [
                {
                    month: new Date('2024-04-05'),
                    unitsProducedDuringTheYear: 20,
                },
            ],
            estimatedTotalProduction: 500,
            serial: '00008',
            assetType: [listAssetType[16]._id],
            purchaseDate: new Date('2020-05-25'),
            warrantyExpirationDate: new Date('2022-05-25'),
            managedBy: manufacturingUsers[4]._id,
            assignedToUser: null,
            assignedToOrganizationalUnit: nhaMayDuocPham._id,
            status: 'ready_to_use',
            typeRegisterForUse: 3,
            description: 'Máy nén thuốc viên',
            readByRoles: [quanDocNhaMayDuocPham._id],
            cost: 30000000,
            residualValue: 5000000,
            startDepreciation: new Date('2020-05-25'),
            usefulLife: 16,
            depreciationType: 'straight_line',
            disposalType: '2',
        }
    ])

    // 4. Khởi tạo nhà máy dược phẩm organic
    const manufacturingWorksData = [
        {
            code: 'NMSX202411111',
            name: 'Nhà máy dược phẩm organic ',
            phoneNumber: '0337479966',
            status: 1,
            address: 'Bắc Ninh',
            description: 'Nhà máy dược phẩm organic của công ty trách nhiệm hữu hạn VNIST Việt Nam',
            organizationalUnit: nhaMayDuocPham._id,
            manageRoles: [roleSuperAdmin._id, quanDocNhaMayDuocPham._id],
        },
    ]
    const manufacturingWorks = await ManufacturingWorks(vnistDB).insertMany(manufacturingWorksData);


    // 4. Khởi tạo xưởng sản xuất 
    const manufacturingMillsData = manufacturingData.manufacturingMills.map(mill => ({
        ...mill,
        manufacturingWorks: manufacturingWorks[0]._id,
        teamLeader: manufacturingUsers[0]._id,
    }))

    const manufacturingMills = await ManufacturingMill(vnistDB).insertMany(manufacturingMillsData);

    manufacturingWorks[0].manufacturingMills = [
        manufacturingMills[0]._id,
        manufacturingMills[1]._id,
        manufacturingMills[2]._id,
        manufacturingMills[3]._id,
        manufacturingMills[4]._id,
        manufacturingMills[5]._id,
    ]

    await manufacturingWorks[0].save();

    // tạo sản phẩm cho nhà máy dược phẩm organic
    listProduct[0].manufacturingMills = [{
        manufacturingMill: manufacturingMills[0]._id,
    }, {
        manufacturingMill: manufacturingMills[1]._id,
    }, {
        manufacturingMill: manufacturingMills[2]._id,
    },{
        manufacturingMill: manufacturingMills[3]._id,
    },{
        manufacturingMill: manufacturingMills[4]._id,
    }, {
        manufacturingMill: manufacturingMills[5]._id,
    }]

    listProduct[0].save();

    // 7. Khởi tạo quy trình sản xuất
    const manufacturingRoutingData = [
        {
            code: "DT19032024",
            name: "Quy trình sản xuất thuốc viên",
            manufacturingWorks: manufacturingWorks[0]._id,
            goods: [listProduct[0]._id],
            creator: manufacturingUsers[0]._id,
            status: 1,
            minLotSize: 1000,
            description: "Quy trình sản xuất thuốc viên của nhà máy dược phẩm organic",
            operations: [
                {
                    id: 1,
                    name: "Nhập kho nguyên liệu",
                    manufacturingMill: manufacturingMills[0]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[0]._id,
                            costPerHour: 20000,
                            hourProduction: 200,
                            workerRole: nvXuongNguyenLieu._id,
                            expYear: 1,
                        }
                    ],
                    nextOperation: 2
                },
                {
                    id: 2,
                    name: "Xay nguyên liệu",
                    manufacturingMill: manufacturingMills[1]._id,
                    setupTime: 2,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[1]._id,
                            workerRole: nvXuongXay._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 40000,
                        }
                    ],
                    preOperation: 1,
                    nextOperation: 4
                },
                {
                    id: 4,
                    name: "Sấy nguyên liệu",
                    manufacturingMill: manufacturingMills[3]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[3]._id,
                            workerRole: nvXuongSay._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 40000,
                        }
                    ],
                    preOperation: 3,
                    nextOperation: 5
                },
                {
                    id: 5,
                    manufacturingMill: manufacturingMills[4]._id,
                    name: "Dập viên nén",
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[4]._id,
                            workerRole: nvXuongNen._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 10000,

                        }
                    ],
                    nextOperation: 6,
                    preOperation: 4
                },
                {
                    id: 6,
                    name: "Đóng gói",
                    manufacturingMill: manufacturingMills[5]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[5]._id,
                            costPerHour: 20000,
                            workerRole: nvXuongDongGoi._id,
                            hourProduction: 200,
                            expYear: 1,
                        }
                    ],
                    preOperation: 5
                }
            ]
        },
        {
            code: "DT19042024",
            name: "Quy trình sản xuất Đường hữu cơ",
            manufacturingWorks: manufacturingWorks[0]._id,
            goods: [listProduct[0]._id],
            creator: manufacturingUsers[0]._id,
            status: 1,
            minLotSize: 1000,
            description: "Quy trình sản xuất đường ACK của nhà máy dược phẩm organic",
            operations: [
                {
                    id: 1,
                    name: "Nhập kho nguyên liệu",
                    manufacturingMill: manufacturingMills[0]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[0]._id,
                            costPerHour: 20000,
                            workerRole: nvXuongNguyenLieu._id,
                            hourProduction: 200,
                            expYear: 1,
                        }
                    ],
                    nextOperation: 2
                },
                {
                    id: 2,
                    name: "Xay nguyên liệu",
                    manufacturingMill: manufacturingMills[1]._id,
                    setupTime: 2,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[1]._id,
                            workerRole: nvXuongXay._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 40000,
                        }
                    ],
                    preOperation: 1,
                    nextOperation: 3
                },
                {
                    id: 3,
                    name: "Trộn nguyên liệu",
                    manufacturingMill: manufacturingMills[2]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[2]._id,
                            workerRole: nvXuongTron._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 20000,
                            number: 1,
                        }
                    ],
                    preOperation: 2,
                    nextOperation: 4
                },
                {
                    id: 4,
                    name: "Sấy nguyên liệu",
                    manufacturingMill: manufacturingMills[3]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[3]._id,
                            workerRole: nvXuongSay._id,
                            minExpYear: 1,
                            hourProduction: 200,
                            costPerHour: 40000,
                            number: 1,
                        }
                    ],
                    preOperation: 3,
                    nextOperation: 5
                },
                {
                    id: 5,
                    name: "Dập viên nén",
                    manufacturingMill: manufacturingMills[4]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[4]._id,
                            workerRole: nvXuongNen._id,
                            minExpYear: 1,
                            costPerHour: 10000,
                            hourProduction: 200,
                        }
                    ],
                    nextOperation: 6,
                    preOperation: 4
                },
                {
                    id: 6,
                    name: "Đóng gói",
                    manufacturingMill: manufacturingMills[5]._id,
                    setupTime: 1,
                    hourProduction: 200,
                    resources: [
                        {
                            machine: assetNhaMayDuocPham[5]._id,
                            workerRole: nvXuongDongGoi._id,
                            hourProduction: 200,
                            expYear: 1,
                            number: 1,
                        }
                    ],
                    preOperation: 5
                }
            ]
        },
    ]

    const manufacturingRoutings = await ManufacturingRouting(vnistDB).insertMany(
        manufacturingRoutingData
    );

    // 5. Khởi tạo kế hoạch sản xuất
    const manufacturingPlansData = [
        {
            code: "KHSX202400001",
            manufacturingOrder: "5fa4fa483b746017bca19a3d",
            manufacturingWorks: [manufacturingWorks[0]._id],
            status: 3,
            goods: [
                {
                    good: listProduct[0]._id,
                    quantity: 20000,
                    orderedQuantity: 150,
                },
            ],
            approvers: [
                {
                    approver: manufacturingUsers[0]._id,
                    approvedTime: new Date('2024-06-01'),
                },
            ],
            creator: manufacturingUsers[0]._id,
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            description: 'Kế hoạch sản xuất trong tháng 6 năm 2024',
            logs: [
                {
                    creator: manufacturingUsers[0]._id,
                    title: 'Tạo kế hoạch sản xuất',
                    description: 'Tạo kế hoạch sản xuất KHSX202400001',
                },
            ],

        }
    ];

    const manufacturingPlans = await ManufacturingPlan(vnistDB).insertMany(
        manufacturingPlansData
    );

    // 6. Khởi tạo lếnh sản xuất
    const manufacturingCommandData = manufacturingData.manufacturingCommands.map((command) => ({
        ...command,
        manufacturingPlan: manufacturingPlans[0]._id,
        good: listProduct[0],
        quantity: 20000,
        manufacturingRouting: manufacturingRoutings[command.manufacturingRouting - 1]._id,
        approvers: [{
            approver: manufacturingUsers[0]._id,
            approvedTime: new Date(command.startDate)
        }],
        workOrders: command.workOrders.map((wo) => ({
            ...wo,
            manufacturingMill: manufacturingMills[wo.mill - 1],
            tasks: wo.tasks.map(task => ({
                ...task,
                responsible: manufacturingUsers[task.responsible - 1]._id,
                machine: assetNhaMayDuocPham[task.machine - 1],
            }))
        })),
        qualityControlStaffs: {
            staff: manufacturingUsers[manufacturingUsers.length - 1]._id,
        },
        taskTemplates: {
            responsible: responsibleTaskTemplate._id,
            qualityControl: qualityControlTaskTemplate._id,
        },
        accountables: [manufacturingUsers[0]._id],
        creator: [manufacturingUsers[0]._id]
    }));

    const manufacturingCommands = await ManufacturingCommand(vnistDB).insertMany(
        manufacturingCommandData
    );

    // 6.1. Khởi tạo dữ liệu công việc
    const convertDateTime = (dateStr, hours) => {
        const date = new Date(dateStr);
        date.setHours(hours);
        return date;
    }
    
    for (const wo of manufacturingCommands[0].workOrders){
        const quantity = manufacturingCommands[0].quantity;
        const commandCode = manufacturingCommands[0].code;
        for (const task of wo.tasks){
            const randomRate = 0.9 + Math.random() * 0.1;
            const taskData = {
                organizationalUnit: nhaMayDuocPham._id,
                creator: manufacturingUsers[0]._id,
                code: `THSX-${commandCode}`,
                name: `Thực hiện lệnh sản xuất ${commandCode}`,
                startDate: convertDateTime(task.startDate, task.startHour),
                endDate: convertDateTime(task.endDate, task.endHour),
                status: 'finished',
                taskTemplate: responsibleTaskTemplate._id,
                level: 1,
                responsibleEmployees: [task.responsible],
                accountableEmployees: [manufacturingCommands[0].accountable],
                consultedEmployees: [task.responsible],
                informedEmployees: [task.responsible], 
                evaluations: [],
                progress: 100,
                taskInformations: [
                    {
                        code: "p1",
                        name: "Sản lượng thực tế",
                        description: "",
                        type: "number",
                        value: quantity,
                        extra: "",
                    },
                    {
                        code: "p2",
                        name: "Sản lượng đạt yêu cầu",
                        description: "",
                        type: "number",
                        value: Math.floor(quantity * randomRate),
                        extra: "",
                    },
                    {
                        code: "p3",
                        name: "Sản lượng không đạt yêu cầu",
                        description: "",
                        type: "number",
                        value: Math.floor(quantity * (1 - randomRate)),
                        extra: "",
                    },
                    {
                        code: "p4",
                        name: "Số lần kiểm tra tuân thủ quy trình",
                        description: "",
                        type: "number",
                        value: Math.floor(Math.random() * 5) + 5,
                        extra: "",
                    },
                    {
                        code: "p5",
                        name: "Số lần không tuân thủ quy trình",
                        description: "",
                        type: "number",
                        value: Math.floor(Math.random() * 5),
                        extra: "",
                    },
                    {
                        code: "p6",
                        name: "Thời gian dừng máy",
                        description: "",
                        type: "number",
                        value: Math.floor(Math.random() * 5),
                        extra: "",
                    },
                    {
                        code: "p7",
                        name: "Thời gian rảnh rỗi",
                        description: "",
                        type: "number",
                        value: Math.floor(Math.random() * 5),
                        extra: "",
                    }
                ]
            }

            const newTask = await Task(vnistDB).create(taskData);
            task.task = newTask._id;
        }

        if (manufacturingCommands[0].qualityControlStaffs) {
            qcStaffs = manufacturingCommands[0].qualityControlStaffs.map(x => x.staff);
            const randomRate = 0.9 + Math.random() * 0.1;
            const qcNum = quantity / 1000
            const taskData = {
                organizationalUnit: nhaMayDuocPham._id,
                code: `KDCL-${commandCode}`,
                creator: manufacturingUsers[0]._id,
                name: `Thực hiện kiểm định chất lượng lệnh sản xuất ${manufacturingCommands[0].code}`,
                startDate: convertDateTime(wo.startDate, wo.startHour),
                endDate: convertDateTime(wo.endDate, wo.endHour),
                status: 'finished',
                taskTemplate: qualityControlTaskTemplate._id,
                level: 1,
                responsibleEmployees: qcStaffs,
                accountableEmployees: qcStaffs,
                consultedEmployees: qcStaffs,
                informedEmployees: qcStaffs, 
                evaluations: [],
                progress: 100,
                taskInformations: [
                    {
                        code: "p1",
                        name: "Số lượng sản phẩm đã kiểm định",
                        description: "",
                        type: "number",
                        value: Math.floor(qcNum),
                        extra: "",
                    },
                    {
                        code: "p2",
                        name: "Số lượng sản phẩm kiểm định lỗi",
                        description: "",
                        type: "number",
                        value: Math.floor(qcNum * randomRate),
                        extra: "",
                    },
                    {
                        code: "p3",
                        name: "Số lượng sản phẩm kiểm định đạt yêu cầu",
                        description: "",
                        type: "number",
                        value: Math.floor(qcNum * (1 - randomRate)),
                        extra: "",
                    },
                    {
                        code: "p4",
                        name: "Số lỗi mới được phát hiện",
                        description: "",
                        type: "number",
                        value: Math.floor(Math.random() * 5),
                        extra: "",
                    }
                ],
            }

            const newTask = await Task(vnistDB).create(taskData);
            wo.qualityControlTasks.push(newTask._id);
        }
    }
    await manufacturingCommands[0].save();

    const manufacturingPlan0 = await ManufacturingPlan(vnistDB).findById(manufacturingPlans[0]._id);
    manufacturingPlan0.manufacturingCommands = manufacturingCommands.map((command) => command._id);
    await manufacturingPlan0.save();

    // 8. Tạo dữ liệu lỗi sản phẩm
    const manufacturingQualityErrorData = manufacturingData.errors.map((error) => {
        const randomNum = Math.floor(Math.random() * 2) + 1
        return {
                ...error,
                reporter: manufacturingUsers[manufacturingUsers.length - randomNum]._id,
                aql: 0.05,
        }
    });

    const manufacturingQualityErrors = await ManufacturingQualityError(vnistDB)
        .insertMany(manufacturingQualityErrorData);

    // 9. Tạo dữ liệu tiêu chí kiểm định chất lượng
    const manufacturingQualityCriteriaData = manufacturingData.criterias.map((criteria) => ({
        ...criteria,
        goods: [listProduct[0]._id],
        creator: manufacturingUsers[manufacturingUsers.length - 1]._id,
        status: 1,
    }));

    const manufacturingQualityCriterias = await ManufacturingQualityCriteria(vnistDB).insertMany(
        manufacturingQualityCriteriaData
    );

    // 10. Tạo dữ liệu tiêu chí kiểm định chất lượng
    const getRandomErrors = (errors, count) => {
        return errors.sort(() => 0.5 - Math.random()).slice(0, count);
    }

    const manufacturingQualityInspectionData = manufacturingData.inspections.map((inspection) => ({
        ...inspection,
        manufacturingCommand: manufacturingCommands[0]._id,
        responsible: manufacturingUsers[manufacturingUsers.length - 1]._id,
        criteria: manufacturingQualityCriterias[0]._id,
        result: {
            ...inspection.result,
            errorList: getRandomErrors(manufacturingQualityErrors, 2).map((error) => error._id),
        }
    }));

    await ManufacturingQualityInspection(vnistDB)
        .insertMany(manufacturingQualityInspectionData);


    vnistDB.close();
    systemDB.close();

    console.log('End init manufacturing database!');
};

initManufacturing().catch((err) => {
    console.log(err);
    process.exit(0);
});
