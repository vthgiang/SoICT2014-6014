const {
    Component,
    RoleType,
    Role,
    Company, 
    OrganizationalUnit,
    Link,
    Privilege,
    User,
    UserRole,
    Employee,
    AnnualLeave,
    Discipline,
    Commendation,
    EducationProgram,
    Course,

    //asset
    Asset,
    AssetType,
    RecommendProcure,
    RepairUpgrade,
    DistributeTransfer,

    DocumentDomain
} = require('../models').schema;

const Terms = require('./terms');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
const db = process.env.DATABASE;

// kẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Kết nối thành công đến MongoDB!\n");
}).catch(err => console.log("ERROR! :(\n", err));

const sampleCompanyData = async () => {
    console.log("Đang tạo dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VỀ CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu công ty!");
    var vnist = await Company.create({
        name: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam',
        shortName: 'VNIST',
        description: 'Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam'
    });
    console.log(`Xong! Công ty [${vnist.name}] đã được tạo.`);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log(`Khởi tạo các tài khoản cho công ty [${vnist.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([{
            name: 'Super Admin VNIST',
            email: 'super.admin.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Admin VNIST',
            email: 'admin.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },{
            name: 'Nguyễn Văn An',
            email: 'nva.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Trần Văn Bình',
            email: 'tvb.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Vũ Thị Cúc',
            email: 'vtc.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Nguyễn Văn Danh',
            email: 'nvd.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Trần Thị Én',
            email: 'tte.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Phạm Đình Phúc',
            email: 'pdp.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Trần Minh Đức',
            email: 'tmd.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Nguyễn Việt Anh',
            email: 'nguyenvietanh.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Nguyễn Viết Thái',
            email: 'nguyenvietthai.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Trần Mỹ Hạnh',
            email: 'tranmyhanh.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Nguyễn Minh Thành',
            email: 'nguyenminhthanh.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Nguyễn Gia Huy',
            email: 'nguyengiahuy.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }, {
            name: 'Trần Minh Anh',
            email: 'tranminhanh.vnist@gmail.com',
            password: hash,
            company: vnist._id
        }
    ]);
    console.log("Xong! Đã thêm tài khoản:", users);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Lấy role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({
        name: Terms.ROLE_TYPES.ROOT
    });
    const roleChucDanh = await RoleType.findOne({
        name: Terms.ROLE_TYPES.POSITION
    });

    const admin = await Role.create({
        name: Terms.ROOT_ROLES.ADMIN.NAME,
        company: vnist._id,
        type: roleAbstract._id
    });
    const roles = await Role.insertMany([{
        name: Terms.ROOT_ROLES.SUPER_ADMIN.NAME,
        company: vnist._id,
        type: roleAbstract._id,
        parents: [admin._id]
    },  {
        name: Terms.ROOT_ROLES.DEAN.NAME,
        company: vnist._id,
        type: roleAbstract._id
    }, {
        name: Terms.ROOT_ROLES.VICE_DEAN.NAME,
        company: vnist._id,
        type: roleAbstract._id
    }, {
        name: Terms.ROOT_ROLES.EMPLOYEE.NAME,
        company: vnist._id,
        type: roleAbstract._id
    }]);

    const thanhVienBGĐ = await Role.create({
        parents: [roles[3]._id],
        name: "Thành viên ban giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const phoGiamDoc = await Role.create({
        parents: [roles[2]._id, thanhVienBGĐ._id],
        name: "Phó giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const giamDoc = await Role.create({
        parents: [roles[1]._id, thanhVienBGĐ._id, phoGiamDoc._id],
        name: "Giám đốc",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const nvPhongHC = await Role.create({
        parents: [roles[3]._id],
        name: "Nhân viên phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role.create({
        parents: [roles[2]._id, nvPhongHC._id],
        name: "Phó phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role.create({
        parents: [roles[1]._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng kinh doanh",
        company: vnist._id,
        type: roleChucDanh._id
    });

    console.log("Đã tạo xong các role mặc định của công ty: ", admin, roles, thanhVienBGĐ, phoGiamDoc, giamDoc, nvPhongHC, phoPhongHC, truongPhongHC);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        GÁN QUYỀN CHO NHÂN VIÊN CỦA CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log('Gán quyền cho nhân viên trong công ty');

    await UserRole.insertMany([{ //gán tài khoản super.admin.vnist có role là Super Admin của công ty VNIST
        userId: users[0]._id,
        roleId: roles[0]._id
    }, {
        userId: users[1]._id, //gán tài khoản admin.vnist có role là admin
        roleId: admin._id
    },
    // Tiếp tục gán chức danh vai trò của phòng ban cho nhân viên:
    {//Giám đốc Nguyễn Văn An
        userId: users[2]._id,
        roleId: giamDoc._id
    },
    {//Phó giám đốc Trần Văn Bình
        userId: users[3]._id,
        roleId: phoGiamDoc._id
    },
    {//Thành viên ban giám đốc Vũ Thị Cúc
        userId: users[4]._id,
        roleId: thanhVienBGĐ._id
    },
    {//Trưởng phòng kinh doanh Nguyễn Văn Danh
        userId: users[5]._id,
        roleId: truongPhongHC._id
    },
    {//Nguyễn Văn Danh cũng là thành viên ban giám đốc
        userId: users[5]._id,
        roleId: thanhVienBGĐ._id
    },
    {//Phó phòng kinh doanh Trần Thị Én
        userId: users[6]._id,
        roleId: phoPhongHC._id
    },
    {//Nhân viên phòng kinh doanh Phạm Đình Phúc
        userId: users[7]._id,
        roleId: nvPhongHC._id
    }
    ]);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO PHÒNG BAN CỦA CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log('Tạo Phòng ban cho công ty...');
    const Directorate = await OrganizationalUnit.create({// Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
        description: "Ban giám đốc Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        company:  vnist._id,
        dean: giamDoc._id,
        viceDean: phoGiamDoc._id,
        employee: thanhVienBGĐ._id,
        parent: null
    });
    const departments = await OrganizationalUnit.insertMany([
        {
            name: "Phòng kinh doanh",
            description: "Phòng kinh doanh Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            company:  vnist._id,
            dean: truongPhongHC._id,
            viceDean: phoPhongHC._id,
            employee: nvPhongHC._id,
            parent: Directorate._id
        },
    ]);
    console.log('Xong! Đã tạo các phòng ban cho công ty', Directorate, departments);



    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo link cho các trang web của công ty...");
    const links = await Link.insertMany([
        { // 0
            url: '/',
            description: `Trang chủ công ty ${vnist.name}`,
            company: vnist._id
        }, { // 1
            url: '/departments-management',
            description: 'Quản lý cơ cấu tổ chức',
            company: vnist._id
        }, { // 2
            url: '/users-management',
            description: 'Quản lý người dùng',
            company: vnist._id
        }, { // 3
            url: '/roles-management',
            description: 'Quản lý phân quyền',
            company: vnist._id
        }, { // 4
            url: '/links-management',
            description: 'Quản lý trang web của công ty',
            company: vnist._id
        }, { // 5
            url: '/components-management',
            description: 'Quản lý các thành phần UI trên trang web của công ty',
            company: vnist._id
        }, { // 6
            url: '/documents-management',
            description: 'Quản lý tài liệu biểu mẫu',
            company: vnist._id
        }, { // 7
            url: '/hr-manage-holiday',
            description: 'Kế hoạch làm việc',
            company: vnist._id
        },
        { // 8
            url: '/hr-add-employee',
            description: 'Thêm mới nhân viên',
            company: vnist._id
        },
        { // 9
            url: '/hr-list-employee',
            description: 'Danh sách nhân viên',
            company: vnist._id
        },
        { // 10
            url: '/hr-update-employee',
            description: 'Cập nhật thông tin cá nhân của nhân viên',
            company: vnist._id
        },
        { // 11
            url: '/hr-detail-employee',
            description: 'Thông tin cá nhân của nhân viên',
            company: vnist._id
        },
        { // 12
            url: '/hr-salary-employee',
            description: 'Quản lý lương nhân viên',
            company: vnist._id
        },
        { // 13
            url: '/hr-annual-leave',
            description: 'Quản lý nghỉ phép của nhân viên',
            company: vnist._id
        },
        { // 14
            url: '/hr-discipline',
            description: 'Quản lý khen thưởng, kỷ luật',
            company: vnist._id
        },
        { // 15
            url: '/hr-dashboard-employee',
            description: 'Dashboard nhân sự',
            company: vnist._id
        },
        { // 16
            url: '/hr-time-keeping',
            description: 'Quản lý chấm công',
            company: vnist._id
        },
        { // 17
            url: '/hr-trainning-course',
            description: 'Quản lý đào tạo',
            company: vnist._id
        },
        { // 18
            url: '/hr-account',
            description: 'Thông tin tài khoản ',
            company: vnist._id
        },
        { // 19
            url: '/hr-training-plan',
            description: 'Kế hoạch đào tạo',
            company: vnist._id
        },
        { // 20
            url: '/hr-list-education',
            description: 'Chương trình đào tạo bắt buộc',
            company: vnist._id
        },

        //thêm link của quản lý KPI
        { // 21
            url: '/kpi-units/create',
            description: 'Khởi tạo KPI đơn vị',
            company: vnist._id
        },
        { // 22
            url: '/kpi-units/dashboard',
            description: 'Dashboard KPI đơn vị',
            company: vnist._id
        },
        { // 23
            url: '/kpi-personals/create',
            description: 'Khởi tạo KPI cá nhân',
            company: vnist._id
        },
       { //24  /kpi-personal-manager
            url: '/kpi-personals/manager',
            description: 'Quản lí KPI cá nhân',
            company: vnist._id
        },
        { // 25
            url: '/notifications',
            description: 'Thông báo',
            company: vnist._id
        },
        { // 26
            url: '/hr-manage-department',
            description: 'Quản lý nhân sự các đơn vị',
            company: vnist._id
        },
        { // 27
            url: '/task-template',
            description: 'Mẫu công việc',
            company: vnist._id
        },
        { // 28
            url: '/kpi-member/manager',
            description: 'Quản lí kpi nhân viên',
            company: vnist._id
        },
        { // 29
            url: '/task-management',
            description: 'Xem danh sách công việc',
            company: vnist._id
        },
        { // 30 
            url: '/task-management-dashboard',
            description: 'Dashboard công việc',
            company: vnist._id
        },
        { // 31 /kpi-member-dashboard
            url: '/kpi-member/dashboard',
            description: 'Dashboard KPI nhân viên',
            company: vnist._id
        },
        { // 32
            url: '/kpi-units/manager',
            description: 'Quản lý KPI đơn vị',
            company: vnist._id
        },
        
        { // 33
            url: '/kpi-units/dashboard',
            description: 'Tổng quan KPI đơn vị',
            company: vnist._id
        },

        { // 34  kpi-personal-dashboard
            url: '/kpi-personals/dashboard',
            description: 'DashBoard Kpi cá nhân',
            company: vnist._id
        },

        
        // thêm link quản lý tài sản
        // QUẢN LÝ
        { //35. quản lý loại tài sản
            url: '/manage-type-asset',
            description: 'Quản lý loại tài sản',
            company: vnist._id
        },
        { //36. Thêm mới tài sản
            url: '/add-asset',
            description: 'Thêm mới tài sản',
            company: vnist._id
        },
        { //37. quản lý thông tin tài sản
            url: '/manage-info-asset',
            description: 'Quản lý thông tin tài sản',
            company: vnist._id
        },
        { //38
            url: '/manage-history-asset',
            description: 'Quản lý lịch sử hoạt động sử dụng tài sản',
            company: vnist._id
        },
        { //39
            url: '/manage-repair-asset',
            description: 'Quản lý sửa chữa - thay thế - nâng cấp tài sản',
            company: vnist._id
        },
        { //40
            url: '/manage-maintain-asset',
            description: 'Quản lý bảo trì tài sản',
            company: vnist._id
        },
        { //41
            url: '/manage-distribute-asset',
            description: 'Quản lý cấp phát - điều chuyển - thu hồi tài sản',
            company: vnist._id
        },
        { //42
            url: '/manage-depreciation-asset',
            description: 'Quản lý khấu hao tài sản',
            company: vnist._id
        },
        { //43
            url: '/manage-room-asset',
            description: 'Quản lý phòng và trang thiết bị tài sản',
            company: vnist._id
        },
        { //44
            url: '/manage-recommend-procure',
            description: 'Quản lý đề nghị mua sắm tài sản',
            company: vnist._id
        },
        { //45
            url: '/manage-recommend-distribute-asset',
            description: 'Quản lý đề nghị cấp phát tài sản',
            company: vnist._id
        },

        // NHÂN VIÊN
        { //46
            url: '/recommend-equipment-procurement',
            description: 'Đăng ký mua sắm tài sản',
            company: vnist._id
        },
        { //47
            url: '/recommmend-distribute-asset',
            description: 'Đăng ký cấp phát tài sản',
            company: vnist._id
        },
        { //48
            url: '/manage-assigned-asset',
            description: 'Quản lý tài sản được bàn giao',
            company: vnist._id
        },
    ]);
    
    const updateVnist = await Company.findById(vnist._id);
    updateVnist.super_admin = users[0]._id;
    await updateVnist.save();
    console.log("Xong! Đã tạo links: ", links);

    //Thêm component -------------------------------------------------------
    const components = await Component.insertMany([
        {
            name: 'create-notification',
            description: 'Tạo thông báo mới',
            company: vnist._id
        },
        { // Tạo button Thêm mới
            name: 'create-task-template-button',
            description: 'Button thêm mới mẫu công việc',
            company: vnist._id
        }
    ]);
    const notificationLink = await Link.findById(links[25]._id);
    await notificationLink.components.push(components[0]._id);
    await notificationLink.save();

    const taskTemplateManagementLink = await Link.findById(links[27]._id);
    await taskTemplateManagementLink.components.push(components[1]._id);
    await taskTemplateManagementLink.save();

    //gán quyền tạo thông báo cho admin, superadmin
    var data = [roles[0]._id, admin._id].map( role => {
        return {
            resourceId: components[0]._id,
            resourceType: 'Component',
            roleId: role
        };
    });

    //gán quyền component tạo task template cho Dean
    var data2 = [roles[1]._id].map( role => {
        return {
            resourceId: components[1]._id,
            resourceType: 'Component',
            roleId: role
        };
    });

    var privileges_component = await Privilege.insertMany(data);
    console.log("privilege component: ", privileges_component);
    privileges_component = await Privilege.insertMany(data2);

    //END

    const privileges = await Privilege.insertMany([
        //gán 7 link trên cho super admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        },{
            resourceId: links[25]._id, //notifications
            resourceType: 'Link',
            roleId: roles[0]._id
        },
        //end
        
        //Gán quyền vào các trang cho admin
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: admin._id
        }, {
            resourceId: links[7]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[8]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[9]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[10]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[11]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[12]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[13]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[14]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[15]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[16]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[17]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[18]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[19]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[20]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        {
            resourceId: links[26]._id,
            resourceType: 'Link',
            roleId: admin._id
        },
        //end
        //gán quyền vào trang home '/' ,trang thông báo /notifications -> cho role Dean, Vice Dean và Employee
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        }, {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        }, {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        }, {
            resourceId: links[25]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },

        // Gán quyền vào trang kpi cho role Dean, Vice Dean và Employee
        {
            resourceId: links[21]._id, // Khởi tạo KPI đơn vị
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[22]._id, // Dashboard KPI đơn vị
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[22]._id, // Dashboard KPI đơn vị
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[22]._id, // Dashboard KPI đơn vị
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[32]._id, // Quản lý KPI đơn vị
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        
        {
            resourceId: links[23]._id, // Khởi tạo KPI cá nhân
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[24]._id, // Tổng quan KPI cá nhân
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },

        // Gán quyền mẫu công việc
        {
            resourceId: links[27]._id, // Mẫu công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[27]._id, // Mẫu công việc
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[27]._id, //M ẫu công việc
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },

        // Gán quyền quản lý KPI nhân viên
        {
            resourceId: links[28]._id, // Quản lý KPI nhân viên
            resourceType: 'Link',
            roleId: roles[1]._id  // Dean
        },
        {
            resourceId: links[31]._id, // Quản lý KPI nhân viên
            resourceType: 'Link',
            roleId: roles[1]._id  // Dean
        },
        // Gán quyền quản lý công việc
        {
            resourceId: links[29]._id, // Quản lý công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[29]._id, //Quản lý công việc
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[29]._id, // Quản lý công việc
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[2]._id // Vice Dean
        },
        {
            resourceId: links[30]._id, // Dashboard công việc
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
         // Gán quyền dashboard kpi cá nhân
         {
            resourceId: links[34]._id, // Tổng quan KPI đơn vị
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },


        // gán quyền quản lý tài sản cho Dean
        {
            resourceId: links[35]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[36]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[37]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[38]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[39]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[40]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[41]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[42]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[43]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[44]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },
        {
            resourceId: links[45]._id,
            resourceType: 'Link',
            roleId: roles[1]._id // Dean
        },

        // gán quyền quản lý tài sản cho nhân viên
        
        {
            resourceId: links[46]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[47]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[48]._id,
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },

    ]);
    console.log("Gán quyền cho các role: ", privileges);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    await Employee.insertMany([{
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Vũ Thị Cúc",
        employeeNumber: "MS2015122",
        status:"active",
        company:vnist._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: "20-10-2015",
        identityCardAddress: "Nam Định",
        emailInCompany: "vtc.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill:'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: "09-02-2020",
        healthInsuranceEndDate: "16-02-2020",
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],   
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: "12-08-2019",
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: "20-10-2019",
            endDate: "22-02-2020",
            file: "ViaVet Khoi San Xuat.xlsm",
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: "06-2019",
            endDate: "02-2020",
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: "28-01-2020",
            endDate: "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courses: [],
        archivedRecordNumber: "T3 - 123698",
        files: [],
    }, {
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Trần Văn Bình",
        employeeNumber: "MS2015124",
        status:"active",
        company:vnist._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: "20-10-2015",
        identityCardAddress: "Nam Định",
        emailInCompany: "tvb.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill:'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: "09-02-2020",
        healthInsuranceEndDate: "16-02-2020",
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],   
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: "12-08-2019",
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: "20-10-2019",
            endDate: "22-02-2020",
            file: "ViaVet Khoi San Xuat.xlsm",
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: "06-2019",
            endDate: "02-2020",
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: "28-01-2020",
            endDate: "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courses: [],
        archivedRecordNumber: "T2 - 123698",
        files: [],
    }])
    console.log("Khởi tạo dữ liệu nhân viên!");
    var employee = await Employee.create({
        avatar: "/upload/human-resource/avatars/avatar5.png",
        fullName: "Nguyễn Văn An",
        employeeNumber: "MS2015123",
        status:"active",
        company:vnist._id,
        employeeTimesheetId: "123456",
        gender: "male",
        birthdate: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        identityCardNumber: 163414569,
        identityCardDate: "20-10-2015",
        identityCardAddress: "Nam Định",
        emailInCompany: "nva.vnist@gmail.com",
        nationality: "Việt Nam",
        atmNumber: "102298653",
        bankName: "ViettinBank",
        bankAddress: "Hai Bà Trưng",
        ethnic: "Kinh",
        religion: "Không",
        maritalStatus: "single",
        phoneNumber: 962586290,
        personalEmail: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        personalEmail2: "hungkaratedo03101998@gmail.com",
        homePhone: 978590338,
        emergencyContactPerson: "Nguyễn Văn Thái",
        relationWithEmergencyContactPerson: "Em trai",
        emergencyContactPersonPhoneNumber: 962586278,
        emergencyContactPersonEmail: "cuong@gmail.com",
        emergencyContactPersonHomePhone: 962586789,
        emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
        permanentResidenceCountry: "Việt Nam",
        permanentResidenceCity: "Nam Định",
        permanentResidenceDistrict: "Hải Hậu",
        permanentResidenceWard: "Hải Phương",
        temporaryResidence: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        temporaryResidenceCountry: "Việt Nam",
        temporaryResidenceCity: "Hà Nội",
        temporaryResidenceDistrict: "Hai Bà Trưng",
        temporaryResidenceWard: "Bạch Mai",
        educationalLevel: "12/12",
        foreignLanguage: "500 Toeic",
        professionalSkill:'university',
        healthInsuranceNumber: "N1236589",
        healthInsuranceStartDate: "09-02-2020",
        healthInsuranceEndDate: "16-02-2020",
        socialInsuranceNumber: "XH1569874",
        socialInsuranceDetails: [{
            company: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],   
        taxNumber: "12658974",
        taxRepresentative: "Nguyễn Văn Hưng",
        taxDateOfIssue: "12-08-2019",
        taxAuthority: "Chi cục thuế Huyện Hải Hậu",
        degrees: [{
            name: "Bằng tốt nghiệp",
            issuedBy: "Đại học Bách Khoa",
            year: "2020",
            degreeType: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificates: [{
            name: "PHP",
            issuedBy: "Hà Nội",
            startDate: "20-10-2019",
            endDate: "22-02-2020",
            file: "ViaVet Khoi San Xuat.xlsm",
            urlFile: "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        experiences: [{
            startDate: "06-2019",
            endDate: "02-2020",
            company: "Vnist",
            position: "Nhân viên"
        }],
        contracts: [{
            name: "Thực tập",
            contractType: "Phụ thuộc",
            startDate: "28-01-2020",
            endDate: "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courses: [],
        archivedRecordNumber: "T4 - 123698",
        files: [{
            name: "Ảnh",
            description : "Ảnh 3x4",
            number : "1",
            status : "submitted",
            file : "3.5.1.PNG",
            urlFile : "lib/fileEmployee/1582212624054-3.5.1.png"
        }],
    });
    console.log(`Xong! Thông tin nhân viên đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu nghỉ phép!");
    await AnnualLeave.insertMany([{
        employee: employee._id,
        company:vnist._id,
        startDate: "04-02-2020",
        endDate: "08-02-2020",
        status: "pass",
        reason: "Về quê",
    }, {
        employee: employee._id,
        company:vnist._id,
        startDate: "05-02-2020",
        endDate: "10-02-2020",
        status: "process",
        reason: "Nghỉ tết"
    }])
    console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu lương nhân viên!");
    await Salary.insertMany([{
        employee: employee._id,
        company:vnist._id,
        month: "02-2020",
        mainSalary: "10000000",
        unit:'VND',
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
        company:vnist._id,
        month: "01-2020",
        mainSalary: "10000000",
        unit:'VND',
        bonus: [{
            nameBonus: "Thưởng tháng 1",
            number: "1000000"
        }],
    }])
    console.log(`Xong! Thông tin lương nhân viên đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHEN THƯỞNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu khen thưởng!");
    await Commendation.insertMany([{
        employee: employee._id,
        company:vnist._id,
        decisionNumber: "123",
        organizationalUnit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    }, {
        employee: employee._id,
        company:vnist._id,
        decisionNumber: "1234",
        organizationalUnit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        type: "Thưởng tiền",
        reason: "Vượt doanh số 500 triệu",
    }])
    console.log(`Xong! Thông tin khen thưởng đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu kỷ luật!");
    await Discipline.insertMany([{
        employee: employee._id,
        company:vnist._id,
        decisionNumber: "1456",
        organizationalUnit: "Phòng nhân sự",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
        company:vnist._id,
        decisionNumber: "1457",
        organizationalUnit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không đủ doanh số",
    }])
    console.log(`Xong! Thông tin kỷ luật đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CHƯƠNG TRÌNH ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu chương trình đào tạo bắt buộc!");
    var educationProgram = await EducationProgram.insertMany([{
        company:vnist._id,
        applyForOrganizationalUnits: [
            departments[0]._id
        ],
        applyForPositions: [
            nvPhongHC._id
        ],
        name: "An toan lao dong",
        programId: "M123",
    }, {
        company:vnist._id,
        applyForOrganizationalUnits: [
            departments[0]._id
        ],
        applyForPositions: [
            nvPhongHC._id
        ],
        name: "kỹ năng giao tiếp",
        programId: "M1234",
    }])
    console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
    await Course.insertMany([{
        company:vnist._id,
        name: "An toàn lao động 1",
        courseId : "LD1233",
        offeredBy : "Vnists",
        coursePlace : "P9.01",
        startDate : "03-03-2020",
        endDate : "21-03-2020",
        cost : "1200000",
        lecturer : "Nguyễn B",
        type: "Đào tạo ngoài",
        educationProgram : educationProgram[0]._id,
        employeeCommitmentTime : "6",
    }, {
        company:vnist._id,
        name: "An toàn lao động 2",
        courseId : "LD123",
        offeredBy : "Vnists",
        coursePlace : "P9.01",
        startDate : "03-03-2020",
        endDate : "21-03-2020",
        cost : "1200000",
        lecturer : "Nguyễn Văn B",
        type: "Đào tạo nội bộ",
        educationProgram : educationProgram[1]._id,
        employeeCommitmentTime : "6",
    }])
    console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);


    const domanins = await DocumentDomain.insertMany([
        { name: "Sản xuất", company: vnist, description: 'Sản xuất'},
        { name: "Sản xuất 2", company: vnist, description: 'Sản xuất 2'},
        { name: "Sản xuất 3", company: vnist, description: 'Sản xuất 3'},
    ]); 

    const domanins2 = await DocumentDomain.insertMany([
        { name: "Nhà Kho", company: vnist, description: 'Nhà Kho', parent: domanins[0]._id},
        { name: "Nhà Kho 2", company: vnist, description: 'Nhà Kho 2', parent: domanins[0]._id},
        { name: "Nhà Kho 3", company: vnist, description: 'Nhà Kho 3', parent: domanins[1]._id},
        { name: "Nhà Kho 4", company: vnist, description: 'Nhà Kho 4', parent: domanins[1]._id},
        { name: "Nhà Kho 5", company: vnist, description: 'Nhà Kho 5', parent: domanins[0]._id},
        { name: "Nhà Kho 6", company: vnist, description: 'Nhà Kho 6', parent: domanins[2]._id},
    ]); 


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU lOẠI TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu loại tài sản");
    var listAssetType = await AssetType.insertMany([
        {
            company: vnist._id,
            typeNumber: "10",
            typeName: "Tài sản hữu hình",
            timeDepreciation: null,
            parent: null,
            description: "Tài sản hữu hình"
        },{
            company: vnist._id,
            typeNumber: "101",
            typeName: "Nhà cửa, vật kiến trúc",
            timeDepreciation: null,
            parent: null,
            description: "Nhà cửa, vật kiến trúc"
        },{
            company: vnist._id,
            typeNumber: "10101",
            typeName: "Tòa nhà làm việc",
            timeDepreciation: null,
            parent: null,
            description: "Tòa nhà làm việc"
        },{
            company: vnist._id,
            typeNumber: "10102",
            typeName: "Nhà xưởng",
            timeDepreciation: null,
            parent: null,
            description: "Nhà xưởng"
        },{
            company: vnist._id,
            typeNumber: "10103",
            typeName: "Nhà kho",
            timeDepreciation: null,
            parent: null,
            description: "Nhà kho"
        },{
            company: vnist._id,
            typeNumber: "102",
            typeName: "Máy móc, thiết bị",
            timeDepreciation: null,
            parent: null,
            description: "Máy móc, thiết bị"
        },{
            company: vnist._id,
            typeNumber: "10201",
            typeName: "Thiết bị phát điện, máy biến áp và nguồn điện khác",
            timeDepreciation: null,
            parent: null,
            description: "Thiết bị phát điện, máy biến áp và nguồn điện khác "
        },{
            company: vnist._id,
            typeNumber: "10202",
            typeName: "Thiết bị an ninh",
            timeDepreciation: null,
            parent: null,
            description: "Thiết bị an ninh"
        },{
            company: vnist._id,
            typeNumber: "103",
            typeName: "Phương tiện vận tải, truyền dẫn",
            timeDepreciation: null,
            parent: null,
            description: "Phương tiện vận tải, truyền dẫn"
        },{
            company: vnist._id,
            typeNumber: "10301",
            typeName: "Ô tô",
            timeDepreciation: null,
            parent: null,
            description: "Ô tô"
        },{
            company: vnist._id,
            typeNumber: "10302",
            typeName: "Xe máy",
            timeDepreciation: null,
            parent: null,
            description: "Xe máy"
        },{
            company: vnist._id,
            typeNumber: "10303",
            typeName: "Thang máy",
            timeDepreciation: null,
            parent: null,
            description: "Thang máy"
        },{
            company: vnist._id,
            typeNumber: "10304",
            typeName: "Tổng đài điện thoại",
            timeDepreciation: null,
            parent: null,
            description: "Tổng đài điện thoại"
        },{
            company: vnist._id,
            typeNumber: "104",
            typeName: "Thiết bị, dụng cụ quản lý",
            timeDepreciation: null,
            parent: null,
            description: "Thiết bị, dụng cụ quản lý"
        },{
            company: vnist._id,
            typeNumber: "10401",
            typeName: "Máy chủ",
            timeDepreciation: null,
            parent: null,
            description: "Máy chủ"
        },{
            company: vnist._id,
            typeNumber: "10402",
            typeName: "Máy tính để bàn",
            timeDepreciation: null,
            parent: null,
            description: "Máy tính để bàn"
        },{
            company: vnist._id,
            typeNumber: "10403",
            typeName: "Máy tính xách tay",
            timeDepreciation: null,
            parent: null,
            description: "Máy tính xách tay"
        },{
            company: vnist._id,
            typeNumber: "10404",
            typeName: "Máy in",
            timeDepreciation: null,
            parent: null,
            description: "Máy in"
        },
    ])
        console.log(`Xong! Thông tin loại tài sản đã được tạo`);


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU PHIẾU ĐỀ NGHỊ MUA SẮM THIẾT BỊ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu phiếu đề nghị mua sắm thiết bị");
    var listRecommendProcure = await RecommendProcure.insertMany([
        {
            company: vnist._id,
            recommendNumber: "MS0001",
            dateCreate: "20-02-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua Laptop DELL 5559",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "60000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        },{
            company: vnist._id,
            recommendNumber: "MS0002",
            dateCreate: "20-03-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua Laptop DELL XPS",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "70000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        },{
            company: vnist._id,
            recommendNumber: "MS0003",
            dateCreate: "20-04-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua máy photocopy",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "50000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        },{
            company: vnist._id,
            recommendNumber: "MS0004",
            dateCreate: "20-05-2020",
            proponent: users[7]._id,
            equipment: "đề nghị mua PC",
            supplier: "HanoiComputer",
            total: "1",
            unit: "cái",
            estimatePrice: "40000000",
            note: "",
            approver: null,
            status: "Chờ phê duyệt"
        }
    ])
        console.log(`Xong! Thông tin phiếu đề nghị mua sắm thiết bị đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu tài sản");    
    var listAsset = await Asset.insertMany([{
        avatar: "/upload/asset/avatars/avatar5.png",
        assetName: "Laptop Dell 5559",
        assetNumber: "LT0001",
        company:vnist._id,
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        manager: users[2]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "",
        location: "P104",
        initialPrice: 50000000,
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "500GB",
        }],
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDeprecition: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [],
    }, {
        avatar: "/upload/asset/avatars/avatar5.png",
        assetName: "Laptop Dell XPS",
        assetNumber: "LT0002",
        company:vnist._id,
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        manager: users[2]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "",
        location: "P105",
        initialPrice: 60000000,
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "256GB",
        }],
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDeprecition: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [],
    },{
        avatar: "/upload/asset/avatars/avatar5.png",
        assetName: "Laptop Lenovo",
        assetNumber: "LT0003",
        company:vnist._id,
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        manager: users[2]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "",
        location: "P104",
        initialPrice: 50000000,
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "240GB",
        }],
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDeprecition: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [],
    },{
        avatar: "/upload/asset/avatars/avatar5.png",
        assetName: "Laptop HP",
        assetNumber: "LT0004",
        company:vnist._id,
        assetType: listAssetType[16]._id,
        datePurchase: "20-02-2020",
        manager: users[2]._id,
        person: users[4]._id,
        dateStartUse: "20-02-2020",
        dateEndUse: "",
        location: "P104",
        initialPrice: 50000000,
        status: "Đang sử dụng",
        description: "Laptop",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "120GB",
        }],
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDeprecition: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [],
    }])
    console.log("Khởi tạo dữ liệu tài sản!");
    var asset = await Asset.create({
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        assetName: "Laptop Dell 5559",
        assetNumber: "LT0001",
        company:vnist._id,
        assetType: listAssetType[1]._id,
        datePurchase: "20-02/2020",
        manager: users[7]._id,
        location: "P104",
        initialPrice: 50000000,
        status: "available", // sẵn sàng sử dụng
        description: "Laptop ver 2016",
        detailInfo: [{
            nameField: "Bộ nhớ ổ cứng",
            value: "500GB",
        }],
        startDepreciation: "20-02-2020", // thời gian bắt đầu trích khấu hao
        timeDeprecition: "5", // thời gian trích khấu hao
        numberFile: "T3 - 123698",
        file: [],
    });
    console.log(`Xong! Thông tin tài sản đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU SỬA CHỮA, THAY THẾ, NÂNG CẤP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu sửa chữa, thay thế, nâng cấp!");
    var repairupgrade = await RepairUpgrade.insertMany([{
        asset: asset._id,
        company:vnist._id,
        repairNumber: "SC0001",
        type: "repair", // sửa chữa
        dateCreate: "20-02-2020",
        reason: "Sửa chữa hỏng hóc thiết bị",
        repairDate: "20-02-2020",
        completeDate: "22-02-2020",
        cost: "10000000",
        status: "complete" // đã thực hiện
    }, {
        asset: asset._id,
        company:vnist._id,
        repairNumber: "SC0002",
        type: "upgrade", // nâng cấp
        dateCreate: "20-02-2020",
        reason: "Nâng cấp thiết bị",
        repairDate: "20-02-2020",
        completeDate: "22-02-2020",
        cost: "10000000",
        status: "complete" // đã thực hiện
    }])
    console.log(`Xong! Thông tin sửa chữa - thay thế - nâng cấp đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CẤP PHÁT - ĐIỀU CHUYỂN - THAY THẾ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu cấp phát - điều chuyển - thay thế!");
    var distributetransfer = await DistributeTransfer.insertMany([{
        asset: asset._id,
        company:vnist._id,
        distributeNumber: "CP0001",
        type: "distribute", // cấp phát
        dateCreate: "20-02-2020",
        place: "Phòng 104",
        handoverMan : users[2]._id,
        receiver : users[7]._id,
        nowLocation : "P104",
        nextLocation : "P105",
        reason: "Cấp phát abcd",
    }])
    console.log(`Xong! Thông tin cấp phát - điều chuyển - thu hồi đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU SỰ CỐ TÀI SẢN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu cấp phát - điều chuyển - thay thế!");
    var distributetransfer = await DistributeTransfer.insertMany([{
        asset: asset._id,
        company:vnist._id,
        distributeNumber: "CP0001",
        type: "distribute", // cấp phát
        dateCreate: "20-02-2020",
        place: "Phòng 104",
        handoverMan : users[2]._id,
        receiver : users[7]._id,
        nowLocation : "P104",
        nextLocation : "P105",
        reason: "Cấp phát abcd",
    }])
    console.log(`Xong! Thông tin cấp phát - điều chuyển - thu hồi đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU ĐỀ NGHỊ CẤP PHÁT
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu cấp phát - điều chuyển - thay thế!");
    var distributetransfer = await DistributeTransfer.insertMany([{
        asset: asset._id,
        company:vnist._id,
        distributeNumber: "CP0001",
        type: "distribute", // cấp phát
        dateCreate: "20-02-2020",
        place: "Phòng 104",
        handoverMan : users[2]._id,
        receiver : users[7]._id,
        nowLocation : "P104",
        nextLocation : "P105",
        reason: "Cấp phát abcd",
    }])
    console.log(`Xong! Thông tin cấp phát - điều chuyển - thu hồi đã được tạo`);
}



//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
sampleCompanyData()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });