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
    EmployeeContact,
    AnnualLeave,
    Discipline,
    Commendation,
    EducationProgram,
    Course
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
        short_name: 'VNIST',
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
        name: "Nhân viên phòng hành chính",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const phoPhongHC = await Role.create({
        parents: [roles[2]._id, nvPhongHC._id],
        name: "Phó phòng hành chính",
        company: vnist._id,
        type: roleChucDanh._id
    });
    const truongPhongHC = await Role.create({
        parents: [roles[1]._id, nvPhongHC._id, phoPhongHC._id],
        name: "Trưởng phòng hành chính",
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
    {//Trưởng phòng hành chính Nguyễn Văn Danh
        userId: users[5]._id,
        roleId: truongPhongHC._id
    },
    {//Nguyễn Văn Danh cũng là thành viên ban giám đốc
        userId: users[5]._id,
        roleId: thanhVienBGĐ._id
    },
    {//Phó phòng hành chính Trần Thị Én
        userId: users[6]._id,
        roleId: phoPhongHC._id
    },
    {//Nhân viên phòng hành chính Phạm Đình Phúc
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
        vice_dean: phoGiamDoc._id,
        employee: thanhVienBGĐ._id,
        parent: null
    });
    const departments = await OrganizationalUnit.insertMany([
        {
            name: "Phòng hành chính",
            description: "Phòng hành chính Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
            company:  vnist._id,
            dean: truongPhongHC._id,
            vice_dean: phoPhongHC._id,
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
            url: '/hr-sabbatical',
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
        }
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
            resourceId: links[32]._id, // Danh sách KPI đơn vị
            resourceType: 'Link',
            roleId: roles[3]._id // Employee
        },
        {
            resourceId: links[32]._id, // Danh sách KPI đơn vị
            resourceType: 'Link',
            roleId: roles[2]._id // ViceDean
        },
        {
            resourceId: links[32]._id, // Danh sách KPI đơn vị
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

    ]);
    console.log("Gán quyền cho các role: ", privileges);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    var listEmployee = await Employee.insertMany([{
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Vũ Thị C",
        employeeNumber: "MS2015122",
        status:"active",
        company:vnist._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "vtc.vnist@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "intermediate_degree",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2020",
            endDate : "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
    }, {
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Trần Văn B",
        employeeNumber: "MS2015124",
        status:"active",
        company:vnist._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "tvb.vnist@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "intermediate_degree",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2020",
            endDate : "28-01-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [],
    }])

    await EmployeeContact.insertMany([{
        employee: listEmployee[0]._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    }, {
        employee: listEmployee[1]._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    }])
    console.log("Khởi tạo dữ liệu nhân viên!");
    var employee = await Employee.create({
        avatar: "lib/adminLTE/dist/img/avatar5.png",
        fullName: "Nguyễn Văn A",
        employeeNumber: "MS2015123",
        status:"active",
        company:vnist._id,
        MSCC: "123456",
        gender: "male",
        brithday: "17-04-1998",
        birthplace: "Hải Phương - Hải Hậu - Nam Định",
        CMND: 163414569,
        dateCMND: "20-10-2015",
        addressCMND: "Nam Định",
        emailCompany: "nva.vnist@gmail.com",
        numberTax: "12658974",
        userTax: "Nguyễn Văn Hưng",
        startTax: "12-08-2019",
        unitTax: "Chi cục thuế Huyện Hải Hậu",
        ATM: "102298653",
        nameBank: "ViettinBank",
        addressBank: "Hai Bà Trưng",
        numberBHYT: "N1236589",
        startDateBHYT: "09-02-2020",
        endDateBHYT: "16-02-2020",
        numberBHXH: "XH1569874",
        BHXH: [{
            unit: "Vnist",
            position: "Nhân viên",
            startDate: "01-2020",
            endDate: "05-2020"
        }],
        national: "Kinh",
        religion: "Không",
        relationship: "single",
        cultural: "12/12",
        foreignLanguage: "500 Toeic",
        educational: "intermediate_degree",
        experience: [{
            unit: "Vnist",
            startDate: "06-2019",
            endDate: "02-2020",
            position: "Nhân viên"
        }],
        certificate: [{
            nameCertificate: "Bằng tốt nghiệp",
            addressCertificate: "Đại học Bách Khoá",
            yearCertificate: "2020",
            typeCertificate: "good",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878169-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        certificateShort: [{
            "nameCertificateShort": "PHP",
            "unit": "Hà Nội",
            "startDate": "20-10-2019",
            "endDate": "22-02-2020",
            "file": "ViaVet Khoi San Xuat.xlsm",
            "urlFile": "lib/fileEmployee/1582031878201-viavet-khoi-san-xuat.xlsm"
        }],
        contract: [{
            nameContract: "Thực tập",
            typeContract: "Phụ thuộc",
            startDate : "28-01-2019",
            endDate : "28-02-2020",
            file: "Quản trị Hành chính Việt Anh.xlsm",
            urlFile: "lib/fileEmployee/1582031878139-quản-trị-hành-chính-việt-anh.xlsm"
        }],
        courst: [],
        nation: "Việt Nam",
        numberFile: "T3 - 123698",
        file: [{
            nameFile : "Ảnh",
            discFile : "Ảnh 3x4",
            number : "1",
            status : "submitted",
            file : "3.5.1.PNG",
            urlFile : "lib/fileEmployee/1582212624054-3.5.1.png"
        }],
    });

    var employeeContact = await EmployeeContact.create({
        employee: employee._id,
        phoneNumber: 962586290,
        emailPersonal: "tranhungcuong703@gmail.com",
        phoneNumber2: 9625845,
        emailPersonal2: "hungkaratedo03101998@gmail.com",
        phoneNumberAddress: 978590338,
        friendName: "Nguyễn Văn Thái",
        relation: "Em trai",
        friendPhone: 962586278,
        friendEmail: "cuong@gmail.com",
        friendPhoneAddress: 962586789,
        friendAddress: "Hải Phương - Hải Hậu - Nam Định",
        localAddress: "Hải Phương - Hải Hậu - Nam Định",
        localNational: "Việt Nam",
        localCity: "Nam Định",
        localDistrict: "Hải Hậu",
        localCommune: "Hải Phương",
        nowAddress: "số nhà 14 ngách 53/1 ngõ Trại Cá phường Trương Định",
        nowNational: "Việt Nam",
        nowCity: "Hà Nội",
        nowDistrict: "Hai Bà Trưng",
        nowCommune: "Bạch Mai",
    })
    console.log(`Xong! Thông tin nhân viên đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu nghỉ phép!");
    var sabbatical = await AnnualLeave.insertMany([{
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
    var salary = await Salary.insertMany([{
        employee: employee._id,
        company:vnist._id,
        month: "02-2020",
        mainSalary: "10000000VND",
        bonus: [{
            nameBonus: "Thưởng dự án",
            number: "1000000"
        }],
    }, {
        employee: employee._id,
        company:vnist._id,
        month: "01-2020",
        mainSalary: "10000000VND",
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
    var praise = await Commendation.insertMany([{
        employee: employee._id,
        company:vnist._id,
        number: "123",
        unit: "Phòng kinh doanh",
        startDate: "02-02-2020",
        type: "Thưởng tiền",
        reason: "Vượt doanh số",
    }, {
        employee: employee._id,
        company:vnist._id,
        number: "1234",
        unit: "Phòng kinh doanh",
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
    var discipline = await Discipline.insertMany([{
        employee: employee._id,
        company:vnist._id,
        number: "1456",
        unit: "Phòng nhân sự",
        startDate: "02-02-2020",
        endDate: "06-02-2020",
        type: "Phạt tiền",
        reason: "Không làm đủ công",
    }, {
        employee: employee._id,
        company:vnist._id,
        number: "1457",
        unit: "Phòng kinh doanh",
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
        unitEducation: [
            departments[0]._id
        ],
        positionEducation: [
            nvPhongHC._id
        ],
        nameEducation: "An toan lao dong",
        numberEducation: "M123",
    }, {
        company:vnist._id,
        unitEducation: [
            departments[0]._id
        ],
        positionEducation: [
            nvPhongHC._id
        ],
        nameEducation: "kỹ năng giao tiếp",
        numberEducation: "M1234",
    }])
    console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
    var course= await Course.insertMany([{
        company:vnist._id,
        nameCourse : "An toàn lao động 1",
        numberCourse : "LD1233",
        unitCourse : "Vnists",
        address : "P9.01",
        startDate : "03-03-2020",
        endDate : "21-03-2020",
        costsCourse : "1200000",
        teacherCourse : "Nguyễn B",
        typeCourse : "Đào tạo ngoài",
        educationProgram : educationProgram[0]._id,
        time : "6",
    }, {
        company:vnist._id,
        nameCourse : "An toàn lao động 2",
        numberCourse : "LD123",
        unitCourse : "Vnists",
        address : "P9.01",
        startDate : "03-03-2020",
        endDate : "21-03-2020",
        costsCourse : "1200000",
        teacherCourse : "Nguyễn Văn B",
        typeCourse : "Đào tạo ngoài",
        educationProgram : educationProgram[0]._id,
        time : "6",
    }])
    console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);
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