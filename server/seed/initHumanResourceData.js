// Thêm nhiều dữ liệu mẫu để test chức năng quản lý nhân sự
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('./terms');

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
    ModuleConfiguration,

    RootRole,
    SystemLink,
    SystemComponent,

    Employee,
    Salary,
    AnnualLeave,
    Discipline,
    Commendation,
    EducationProgram,
    Course,

    EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet,
    Task

} = require('../models');


require('dotenv').config();


const initHumanResourceData = async () => {
    console.log("Add more human resource database, ...");

    /**
    * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
    */
    const systemDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME}`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_AUTHENTICATION === "true" ? process.env.DB_USERNAME : undefined,
            pass: process.env.DB_AUTHENTICATION === "true" ? process.env.DB_PASSWORD : undefined,
        }
    );
    
    const vnistDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`,
        process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD
        }:{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    );

    if (!systemDB) throw ('DB vnist cannot connect');
    console.log("DB vnist connected");

    if(!vnistDB) throw('DB vnist cannot connect');
    console.log("DB vnist connected");

    /**
    * 1.1 Khởi tạo model cho db
    */
    const initModels = (db) => {
        console.log("models", db.models);

        if (!db.models.Component) Component(db);
        if (!db.models.RoleType) RoleType(db);
        if (!db.models.Role) Role(db);
        if (!db.models.Company) Company(db);
        if (!db.models.OrganizationalUnit) OrganizationalUnit(db);
        if (!db.models.Link) Link(db);
        if (!db.models.Privilege) Privilege(db);
        if (!db.models.User) User(db);
        if (!db.models.UserRole) UserRole(db);
        if (!db.models.ModuleConfiguration) ModuleConfiguration(db);

        if (!db.models.RootRole) RootRole(db);
        if (!db.models.SystemLink) SystemLink(db);
        if (!db.models.SystemComponent) SystemComponent(db);

        if (!db.models.Employee) Employee(db);
        if (!db.models.Salary) Salary(db);
        if (!db.models.AnnualLeave) AnnualLeave(db);
        if (!db.models.Discipline) Discipline(db);
        if (!db.models.Commendation) Commendation(db);
        if (!db.models.EducationProgram) EducationProgram(db);
        if (!db.models.Course) Course(db);


        if(!db.models.EmployeeKpi) EmployeeKpi(db);
        if(!db.models.EmployeeKpiSet) EmployeeKpiSet(db);
        if(!db.models.OrganizationalUnitKpi) OrganizationalUnitKpi(db);
        if(!db.models.OrganizationalUnitKpiSet) OrganizationalUnitKpiSet(db);
        if(!db.models.Task) Task(db);

        console.log("models_list", db.models);
    }

    initModels(vnistDB);
    initModels(systemDB);

    /**
     * 1.3. Lấy dữ liệu về công ty VNIST trong database của hệ thống
     */
    const vnist = await Company(systemDB).findOne({
        shortName: 'vnist',
    });

    /**
     * 2. Thêm các tài khoản người dùng trong csdl của công ty VNIST
     */
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User(vnistDB).insertMany([
        { // 1
            name: 'Lê Thống Nhất',
            email: 'lethongnhat.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 2
            name: 'Nguyễn Văn thanh',
            email: 'nguyenvanthanh.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 3
            name: 'Nguyễn Viết Đảng',
            email: 'nguyenvietdang.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 4
            name: 'Đỗ Văn Dương',
            email: 'dovanduong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 5
            name: 'Đào Xuân Hướng',
            email: 'daoxuanhuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 6
            name: 'Đào Quang Phương',
            email: 'daoquangphuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 7
            name: 'Vũ Mạnh Cường',
            email: 'vumanhcuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 8
            name: 'Trần Văn Cường',
            email: 'tranvancuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 9
            name: 'Dương Thị Thanh Thuỳ',
            email: 'duongthithanhthuy.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 10
            name: 'Nguyễn Thị huệ',
            email: 'nguyenthihue.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 11
            name: 'Vũ Viết Xuân',
            email: 'vuvietxuan.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 12
            name: 'Trần Thị Thu Phương',
            email: 'tranthithuphuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 13
            name: 'Bùi Thị Mai',
            email: 'buithimai.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 14
            name: 'Nguyễn Lương Thử',
            email: 'nguyenluongthu.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 15
            name: 'Lưu Quang Ngọc',
            email: 'luuquangngoc.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 16
            name: 'Hoàng Văn Tùng',
            email: 'hoangvantung.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 17
            name: 'Nguyễn Văn Hải',
            email: 'nguyenvanhai.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 18
            name: 'Trần Văn Sơn',
            email: 'tranvanson.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 19
            name: 'Mai Thuỳ Dung',
            email: 'maithuydung.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 20
            name: 'Nguyễn Thống Nhất',
            email: 'nguyenthongnhat.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 21
            name: 'Trần Kim Cương',
            email: 'trankimcuong.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 22
            name: 'Nguyễn Đình Thuận',
            email: 'nguyendinhthuan.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 23
            name: 'Ngô Tri Dũng',
            email: 'ngotridung.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
        { // 24
            name: 'Nguyễn Khắc Đại',
            email: 'nguyenkhacdai.vnist@gmail.com',
            password: hash,
            company: vnist._id
        },
    ]);

    console.log("Dữ liệu tài khoản người dùng cho công ty VNIST", users);

    /**
     * 3. Tạo thêm các role mặc định cho công ty vnist
     */
    const roleChucDanh = await RoleType(vnistDB).findOne({
        name: Terms.ROLE_TYPES.POSITION
    });
    const roleDean = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.DEAN.name,
    });
    const roleViceDean = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
    });
    const roleEmployee = await Role(vnistDB).findOne({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
    });


    const nvPhongMaketing = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng Maketing & NCPT sản phẩm",
        type: roleChucDanh._id
    });
    const phoPhongMaketing = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongMaketing._id],
        name: "Phó phòng Maketing & NCPT sản phẩm",
        type: roleChucDanh._id
    });
    const truongPhongMaketing = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongMaketing._id, phoPhongMaketing._id],
        name: "Trưởng phòng Maketing & NCPT sản phẩm",
        type: roleChucDanh._id
    });

    const nvPhongKS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kiểm soát nội bộ",
        type: roleChucDanh._id
    });
    const phoPhongKS = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongKS._id],
        name: "Phó phòng kiểm soát nội bộ",
        type: roleChucDanh._id
    });
    const truongPhongKS = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongKS._id, phoPhongKS._id],
        name: "Trưởng phòng kiểm soát nội bộ",
        type: roleChucDanh._id
    });

    const nvPhongQTNS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị nhân sự",
        type: roleChucDanh._id
    });
    const phoPhongQTNS = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongQTNS._id],
        name: "Phó phòng quản trị nhân sự",
        type: roleChucDanh._id
    });
    const truongPhongQTNS = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongQTNS._id, phoPhongQTNS._id],
        name: "Trưởng phòng quản trị nhân sự",
        type: roleChucDanh._id
    });

    const nvPhongQTMT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị mục tiêu",
        type: roleChucDanh._id
    });
    const phoPhongQTMT = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongQTMT._id],
        name: "Phó phòng quản trị mục tiêu",
        type: roleChucDanh._id
    });
    const truongPhongQTMT = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongQTMT._id, phoPhongQTMT._id],
        name: "Trưởng phòng quản trị mục tiêu",
        type: roleChucDanh._id
    });

    const nvPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id
    });
    const phoPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongQTHCNS._id],
        name: "Phó phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id
    });
    const truongPhongQTHCNS = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongQTHCNS._id, phoPhongQTHCNS._id],
        name: "Trưởng phòng quản trị hành chính nhân sự",
        type: roleChucDanh._id
    });

    const nvPhongHCHT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng hậu cần - hỗ trợ",
        type: roleChucDanh._id
    });
    const phoPhongHCHT = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongHCHT._id],
        name: "Phó phòng hậu cần - hỗ trợ",
        type: roleChucDanh._id
    });
    const truongPhongHCHT = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongHCHT._id, phoPhongHCHT._id],
        name: "Trưởng phòng hậu cần - hỗ trợ",
        type: roleChucDanh._id
    });

    const nvPhongTCKT = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng tài chính kế toán",
        type: roleChucDanh._id
    });
    const phoPhongTCKT = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongTCKT._id],
        name: "Phó phòng tài chính kế toán",
        type: roleChucDanh._id
    });
    const truongPhongTCKT = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongTCKT._id, phoPhongTCKT._id],
        name: "Trưởng phòng tài chính kế toán",
        type: roleChucDanh._id
    });

    const nvPhongKTDN = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kế toán doanh nghiệp",
        type: roleChucDanh._id
    });
    const phoPhongKTDN = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongKTDN._id],
        name: "Phó phòng kế toán doanh nghiệp",
        type: roleChucDanh._id
    });
    const truongPhongKTDN = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongKTDN._id, phoPhongKTDN._id],
        name: "Trưởng phòng kế toán doanh nghiệp",
        type: roleChucDanh._id
    });

    const nvPhongKTBH = await Role(vnistDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên phòng kế toán bán hàng",
        type: roleChucDanh._id
    });
    const phoPhongKTBH = await Role(vnistDB).create({
        parents: [roleViceDean._id, nvPhongKTBH._id],
        name: "Phó phòng kế toán bán hàng",
        type: roleChucDanh._id
    });
    const truongPhongKTBH = await Role(vnistDB).create({
        parents: [roleDean._id, nvPhongKTBH._id, phoPhongKTBH._id],
        name: "Trưởng phòng kế toán bán hàng",
        type: roleChucDanh._id
    });

    console.log("Dữ liệu các phân quyền cho công ty VNIST");


    /**
     * 4. Gán phân quyền cho các vị trí trong công ty
     */
    await UserRole(vnistDB).insertMany([
        { // Nhân viên phòng Maketing & NCPT sản phẩm
            userId: users[1]._id,
            roleId: nvPhongMaketing._id
        },
        { // Phó phòng Maketing & NCPT sản phẩm
            userId: users[2]._id,
            roleId: phoPhongMaketing._id
        },
        { // Trưởng phòng Maketing & NCPT sản phẩm
            userId: users[3]._id,
            roleId: truongPhongMaketing._id
        },
        { // Nhân viên phòng kiểm soát nội bộ
            userId: users[4]._id,
            roleId: nvPhongKS._id
        },
        { // Phó phòng kiểm soát nội bộ
            userId: users[5]._id,
            roleId: phoPhongKS._id
        },
        { // Trưởng phòng kiểm soát nội bộ
            userId: users[6]._id,
            roleId: truongPhongKS._id
        },
        { // Nhân viên phòng quản trị nhân sự
            userId: users[7]._id,
            roleId: nvPhongQTNS._id
        },
        { // Phó phòng quản trị nhân sự
            userId: users[8]._id,
            roleId: phoPhongQTNS._id
        },
        { // Trưởng phòng quản trị nhân sự
            userId: users[9]._id,
            roleId: truongPhongQTNS._id
        },
        { // Nhân viên phòng quản trị mục tiêu
            userId: users[10]._id,
            roleId: nvPhongQTMT._id
        },
        { // Phó phòng quản trị mục tiêu
            userId: users[11]._id,
            roleId: phoPhongQTMT._id
        },
        { // Trưởng phòng quản trị mục tiêu
            userId: users[12]._id,
            roleId: truongPhongQTMT._id
        },
        { // Nhân viên phòng quản trị hành chính nhân sự
            userId: users[13]._id,
            roleId: nvPhongQTHCNS._id
        },

        { // Phó phòng quản trị hành chính nhân sự
            userId: users[14]._id,
            roleId: phoPhongQTHCNS._id
        },
        { // TTrưởng phòng quản trị hành chính nhân sự
            userId: users[15]._id,
            roleId: truongPhongQTHCNS._id
        },
        { // Nhân viên phòng hậu cần - hỗ trợ
            userId: users[16]._id,
            roleId: nvPhongHCHT._id
        },
        { // Phó phòng hậu cần - hỗ trợ
            userId: users[17]._id,
            roleId: phoPhongHCHT._id
        },
        { // Trưởng phòng hậu cần - hỗ trợ
            userId: users[18]._id,
            roleId: truongPhongHCHT._id
        },
        { // Nhân viên phòng tài chính kế toán
            userId: users[19]._id,
            roleId: nvPhongTCKT._id
        },
        { // Phó phòng tài chính kế toán
            userId: users[20]._id,
            roleId: phoPhongTCKT._id
        },
        { // Trưởng phòng tài chính kế toán
            userId: users[21]._id,
            roleId: truongPhongTCKT._id
        },
        { // Nhân viên phòng kế toán doanh nghiệp
            userId: users[22]._id,
            roleId: nvPhongKTDN._id
        },
        { // Phó phòng kế toán doanh nghiệp
            userId: users[23]._id,
            roleId: phoPhongKTDN._id
        },
        { // Trưởng phòng kế toán doanh nghiệp
            userId: users[15]._id,
            roleId: truongPhongKTDN._id
        },
        { // Nhân viên phòng kế toán bán hàng
            userId: users[22]._id,
            roleId: nvPhongKTBH._id
        },
        { // Phó phòng kế toán bán hàng
            userId: users[23]._id,
            roleId: phoPhongKTBH._id
        },
        { // Trưởng phòng kế toán bán hàng
            userId: users[17]._id,
            roleId: truongPhongKTBH._id
        },

    ]);

    /**
     * 5. Tạo thêm dữ liệu các phòng ban cho công ty VNIST
     */
    const Directorate = await OrganizationalUnit(vnistDB).findOne({ // Khởi tạo ban giám đốc công ty
        name: "Ban giám đốc",
    });
    const departments = await OrganizationalUnit(vnistDB).findOne({
        name: "Phòng kinh doanh",
    });

    const phongMaketing = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng Maketing & NCPT sản phẩm",
        description: "Phòng Maketing & NCPT sản phẩm Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongMaketing._id],
        viceDeans: [phoPhongMaketing._id],
        employees: [nvPhongMaketing._id],
        parent: Directorate._id
    }, ]);
    console.log('***',phongMaketing);

    const phongKS = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng kiểm soát nội bộ",
        description: "Phòng kinh kiểm soát nội bộ Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongKS._id],
        viceDeans: [phoPhongKS._id],
        employees: [nvPhongKS._id],
        parent: Directorate._id
    }, ]);

    const phongQTNS = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng quản trị nhân sự",
        description: "Phòng quản trị nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongQTNS._id],
        viceDeans: [phoPhongQTNS._id],
        employees: [nvPhongQTNS._id],
        parent: Directorate._id
    }, ]);

    const phongQTMT = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng quản trị mục tiêu",
        description: "Phòng quản trị mục tiêu Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongQTMT._id],
        viceDeans: [phoPhongQTMT._id],
        employees: [nvPhongQTMT._id],
        parent: phongQTNS[0]._id
    }, ]);

    const phongQTHCNS = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng hành chính nhân sự",
        description: "Phòng hành chính nhân sự Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongQTHCNS._id],
        viceDeans: [phoPhongQTHCNS._id],
        employees: [nvPhongQTHCNS._id],
        parent: phongQTNS[0]._id
    }, ]);

    const phongHCHT = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng hậu cần - hỗ trợ",
        description: "Phòng hậu cần - hỗ trợ Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongHCHT._id],
        viceDeans: [phoPhongHCHT._id],
        employees: [nvPhongHCHT._id],
        parent: phongQTNS[0]._id
    }, ]);

    const phongTCKT = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng tài chính kế toán",
        description: "Phòng tài chính kế toán Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongTCKT._id],
        viceDeans: [phoPhongTCKT._id],
        employees: [nvPhongTCKT._id],
        parent: Directorate._id
    }, ]);

    const phongKTDN = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng kế toán doanh nghiệp",
        description: "Phòng kế toán doanh nghiệp Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongKTDN._id],
        viceDeans: [phoPhongKTDN._id],
        employees: [nvPhongKTDN._id],
        parent: phongTCKT[0]._id
    }, ]);

    const phongKTBH = await OrganizationalUnit(vnistDB).insertMany([{
        name: "Phòng kế toán bán hàng",
        description: "Phòng kế toán bán hàng Công ty Cổ phần Công nghệ An toàn thông tin và Truyền thông Việt Nam",
        deans: [truongPhongKTBH._id],
        viceDeans: [phoPhongKTBH._id],
        employees: [nvPhongKTBH._id],
        parent: phongTCKT[0]._id
    }, ]);

    console.log("Đã tạo dữ liệu phòng ban: ", Directorate, departments);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NHÂN VIÊN CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    let employees = await Employee(vnistDB).insertMany([
        { // user 1
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Lê Thống Nhất",
            employeeNumber: "MS202015",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12315",
            gender: "male",
            startingDate: new Date("2020-02-19"),
            birthdate: new Date("1982-05-15"),
            birthplace: "Hải An - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "lethongnhat.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "102298653",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tranhungcuong@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hungkaratedo@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Văn Tài",
            relationWithEmergencyContactPerson: "Em trai",
            emergencyContactPersonPhoneNumber: 962586278,
            emergencyContactPersonEmail: "tai@gmail.com",
            emergencyContactPersonHomePhone: 962586789,
            emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
            permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
            permanentResidenceCountry: "Việt Nam",
            permanentResidenceCity: "Nam Định",
            permanentResidenceDistrict: "Hải Hậu",
            permanentResidenceWard: "Hải Phương",
            temporaryResidence: "ngõ Trại Cá phường Trương Định",
            temporaryResidenceCountry: "Việt Nam",
            temporaryResidenceCity: "Hà Nội",
            temporaryResidenceDistrict: "Hai Bà Trưng",
            temporaryResidenceWard: "Bạch Mai",
            educationalLevel: "12/12",
            foreignLanguage: "700 Toeic",
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12315",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 2
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Văn Thanh",
            employeeNumber: "MS202016",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12316",
            gender: "male",
            startingDate: new Date("2020-02-19"),
            birthdate: new Date("1994-10-17"),
            birthplace: "Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenvanthanh.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "10229865323",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tranhung@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hungkara@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Văn Tú",
            relationWithEmergencyContactPerson: "Em trai",
            emergencyContactPersonPhoneNumber: 962586256,
            emergencyContactPersonEmail: "cuong12@gmail.com",
            emergencyContactPersonHomePhone: 962586789,
            emergencyContactPersonAddress: "Xuân Trường - Nam Định",
            permanentResidence: "Hải Hậu - Nam Định",
            permanentResidenceCountry: "Việt Nam",
            permanentResidenceCity: "Nam Định",
            permanentResidenceDistrict: "Hải Hậu",
            permanentResidenceWard: "Hải Phương",
            temporaryResidence: "Trương Định",
            temporaryResidenceCountry: "Việt Nam",
            temporaryResidenceCity: "Hà Nội",
            temporaryResidenceDistrict: "Hai Bà Trưng",
            temporaryResidenceWard: "Bạch Mai",
            educationalLevel: "12/12",
            foreignLanguage: "750 Toeic",
            professionalSkill: 'master_degree',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 3
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Viết Đảng",
            employeeNumber: "MS202017",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12319",
            gender: "male",
            startingDate: new Date("2020-03-19"),
            birthdate: new Date("1972-08-17"),
            birthplace: "Hà Nội",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Hà Nội",
            emailInCompany: "nguyenvietdang.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "10229253",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tran@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hung@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Thị Mai",
            relationWithEmergencyContactPerson: "Em gái",
            emergencyContactPersonPhoneNumber: 962586278,
            emergencyContactPersonEmail: "mai@gmail.com",
            emergencyContactPersonHomePhone: 962586789,
            emergencyContactPersonAddress: "Hai Bà Trưng - Hà Nội",
            permanentResidence: "Hai Bà Trưng  - Hà Nội",
            permanentResidenceCountry: "Việt Nam",
            permanentResidenceCity: "Hà Nội",
            permanentResidenceDistrict: "Hai Bà Trưng",
            permanentResidenceWard: "Bạch Mai",
            temporaryResidence: "ngách 53/1 ngõ Trại Cá phường Trương Định",
            temporaryResidenceCountry: "Việt Nam",
            temporaryResidenceCity: "Hà Nội",
            temporaryResidenceDistrict: "Hai Bà Trưng",
            temporaryResidenceWard: "Bạch Mai",
            educationalLevel: "12/12",
            foreignLanguage: "595 Toeic",
            professionalSkill: 'colleges',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hai Bà Trưng",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 4
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Đỗ Văn Dương",
            employeeNumber: "MS202018",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12319",
            gender: "male",
            startingDate: new Date("2020-04-19"),
            birthdate: new Date("1986-05-03"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "dovanduong.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "102298653",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tran153@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hung3101998@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Văn Tình",
            relationWithEmergencyContactPerson: "Em trai",
            emergencyContactPersonPhoneNumber: 962586278,
            emergencyContactPersonEmail: "tinh@gmail.com",
            emergencyContactPersonHomePhone: 962586789,
            emergencyContactPersonAddress: "Hải Phương - Hải Hậu - Nam Định",
            permanentResidence: "Hải Phương - Hải Hậu - Nam Định",
            permanentResidenceCountry: "Việt Nam",
            permanentResidenceCity: "Nam Định",
            permanentResidenceDistrict: "Hải Hậu",
            permanentResidenceWard: "Hải Phương",
            temporaryResidence: "ngõ Trại Cá phường Trương Định",
            temporaryResidenceCountry: "Việt Nam",
            temporaryResidenceCity: "Hà Nội",
            temporaryResidenceDistrict: "Hai Bà Trưng",
            temporaryResidenceWard: "Bạch Mai",
            educationalLevel: "12/12",
            foreignLanguage: "500 Toeic",
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 5
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Đào Xuân Hướng",
            employeeNumber: "MS202019",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12319",
            gender: "male",
            startingDate: new Date("2020-04-19"),
            birthdate: new Date("200-02-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "daoxuanhuong.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "102298653",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tranhung@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hungkarate@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Văn Sơn",
            relationWithEmergencyContactPerson: "Em trai",
            emergencyContactPersonPhoneNumber: 962586278,
            emergencyContactPersonEmail: "sơn@gmail.com",
            emergencyContactPersonHomePhone: 962586789,
            emergencyContactPersonAddress: "Hà Nam",
            permanentResidence: "Hà Nam",
            permanentResidenceCountry: "Việt Nam",
            permanentResidenceCity: "Nam Định",
            permanentResidenceDistrict: "Hải Hậu",
            permanentResidenceWard: "Hải Phương",
            temporaryResidence: "số nhà 14 Phùng Khoang",
            temporaryResidenceCountry: "Việt Nam",
            temporaryResidenceCity: "Hà Nội",
            temporaryResidenceDistrict: "Nam Từ Liêm",
            temporaryResidenceWard: "Phùng Khoang",
            educationalLevel: "12/12",
            foreignLanguage: "900 Toeic",
            professionalSkill: 'intermediate_degree',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 6
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Đào Quang Phương",
            employeeNumber: "MS202020",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12320",
            gender: "male",
            startingDate: new Date("2020-04-19"),
            birthdate: new Date("2002-06-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "daoquangphuong.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "102298653",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tranhungcuon@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hungkara01998@gmail.com",
            homePhone: 978590338,
            emergencyContactPerson: "Nguyễn Thị Vui",
            relationWithEmergencyContactPerson: "Chị gái",
            emergencyContactPersonPhoneNumber: 962586278,
            emergencyContactPersonEmail: "vui@gmail.com",
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
            foreignLanguage: "620 Toeic",
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 7
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Vũ Mạnh Cường",
            employeeNumber: "MS202021",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12321",
            gender: "male",
            startingDate: new Date("2020-05-19"),
            birthdate: new Date("1998-6-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "vumanhcuong.vnist@gmail.com",
            nationality: "Việt Nam",
            atmNumber: "102298653",
            bankName: "ViettinBank",
            bankAddress: "Hai Bà Trưng",
            ethnic: "Kinh",
            religion: "Không",
            maritalStatus: "single",
            phoneNumber: 962586290,
            personalEmail: "tranhungcuong@gmail.com",
            phoneNumber2: 9625845,
            personalEmail2: "hungkarate998@gmail.com",
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
            professionalSkill: 'unavailable',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 8
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Trần Văn Cường",
            employeeNumber: "MS202022",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12322",
            gender: "male",
            startingDate: new Date("2020-06-19"),
            birthdate: new Date("1998-02-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "tranvancuong.vnist@gmail.com",
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
            professionalSkill: 'colleges',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 9
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Dương Thị Thanh Thuỳ",
            employeeNumber: "MS202023",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12323",
            startingDate: new Date("2019-09-19"),
            gender: "female",
            birthdate: new Date("1985-07-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "duongthithanhthuy.vnist@gmail.com",
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
            professionalSkill: 'colleges',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 10
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Thị huệ",
            employeeNumber: "MS202024",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12324",
            gender: "female",
            startingDate: new Date("2019-10-19"),
            birthdate: new Date("1988-01-14"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenthihue.vnist@gmail.com",
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
            professionalSkill: 'intermediate_degree',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 11
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Vũ Viết Xuân",
            employeeNumber: "MS202025",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123456",
            gender: "female",
            startingDate: new Date("2019-11-19"),
            birthdate: new Date("1999-11-12"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "vuvietxuan.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 12
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Trần Thị Thu Phương",
            employeeNumber: "MS202026",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12326",
            gender: "male",
            startingDate: new Date("2019-11-19"),
            birthdate: new Date("1991-06-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "tranthithuphuong.vnist@gmail.com",
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
            professionalSkill: 'phd',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 13
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Bùi Thị Mai",
            employeeNumber: "MS2015124",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12327",
            gender: "female",
            startingDate: new Date("2019-12-19"),
            birthdate: new Date("1965-06-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "buithimai.vnist@gmail.com",
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
            professionalSkill: 'unavailable',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 14
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Lương Thử",
            employeeNumber: "MS2015124",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12328",
            gender: "male",
            startingDate: new Date("2020-02-19"),
            birthdate: new Date("1966-02-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenluongthu.vnist@gmail.com",
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
            professionalSkill: 'phd',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 15
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Lưu Quang Ngọc",
            employeeNumber: "MS202029",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12329",
            gender: "male",
            startingDate: new Date("2020-02-19"),
            birthdate: new Date("1983-03-02"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "luuquangngoc.vnist@gmail.com",
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
            professionalSkill: 'master_degree',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // user 16
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Hoàng Văn Tùng",
            employeeNumber: "MS202030",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123430",
            gender: "male",
            startingDate: new Date("2020-02-19"),
            birthdate: new Date("1991-10-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "hoangvantung.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 17
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Văn Hải",
            employeeNumber: "MS202031",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123431",
            gender: "male",
            startingDate: new Date("2020-03-19"),
            birthdate: new Date("1989-12-10"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenvanhai.vnist@gmail.com",
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
            professionalSkill: 'colleges',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 18
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Trần Văn Sơn",
            employeeNumber: "MS202032",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "12332",
            gender: "male",
            startingDate: new Date("2020-04-19"),
            birthdate: new Date("1986-03-23"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "tranvanson.vnist@gmail.com",
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
            professionalSkill: 'intermediate_degree',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 19
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Mai Thuỳ Dung",
            employeeNumber: "MS202033",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123433",
            gender: "female",
            startingDate: new Date("2020-04-19"),
            birthdate: new Date("1998-02-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "maithuydung.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 20
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Thống Nhất",
            employeeNumber: "MS202034",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123434",
            gender: "male",
            startingDate: new Date("2020-05-19"),
            birthdate: new Date("1981-07-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenthongnhat.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 21
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Trần Kim Cương",
            employeeNumber: "MS202035",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123456",
            gender: "male",
            startingDate: new Date("2020-05-19"),
            birthdate: new Date("1990-09-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "trankimcuong.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 22
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Đình Thuận",
            employeeNumber: "MS202036",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123436",
            gender: "male",
            startingDate: new Date("2020-05-19"),
            birthdate: new Date("1979-09-29"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyendinhthuan.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 23
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Ngô Tri Dũng",
            employeeNumber: "MS202037",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123437",
            gender: "male",
            startingDate: new Date("2020-05-19"),
            birthdate: new Date("1981-11-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "ngotridung.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        },

        { // User 24
            avatar: "/upload/human-resource/avatars/avatar5.png",
            fullName: "Nguyễn Khắc Đại",
            employeeNumber: "MS202038",
            status: "active",
            company: vnist._id,
            employeeTimesheetId: "123438",
            gender: "male",
            startingDate: new Date("2020-06-19"),
            birthdate: new Date("1980-12-17"),
            birthplace: "Hải Phương - Hải Hậu - Nam Định",
            identityCardNumber: 163414569,
            identityCardDate: new Date("2015-10-20"),
            identityCardAddress: "Nam Định",
            emailInCompany: "nguyenkhacdai.vnist@gmail.com",
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
            professionalSkill: 'university',
            healthInsuranceNumber: "N1236589",
            healthInsuranceStartDate: new Date("2019-01-25"),
            healthInsuranceEndDate: new Date("2020-02-16"),
            socialInsuranceNumber: "XH1569874",
            socialInsuranceDetails: [{
                company: "Vnist",
                position: "Nhân viên",
                startDate: new Date("2020-01"),
                endDate: new Date("2020-05")
            }],
            taxNumber: "12658974",
            taxRepresentative: "Nguyễn Văn Hưng",
            taxDateOfIssue: new Date("12/08/2019"),
            taxAuthority: "Chi cục thuế Huyện Hải Hậu",
            degrees: [{
                name: "Bằng tốt nghiệp",
                issuedBy: "Đại học Bách Khoa",
                year: "2020",
                degreeType: "good",
            }],
            certificates: [{
                name: "PHP",
                issuedBy: "Hà Nội",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            experiences: [{
                startDate: new Date("2019-06"),
                endDate: new Date("2020-02"),
                company: "Vnist",
                position: "Nhân viên"
            }],
            contractType: 'Phụ thuộc',
            contractEndDate: new Date("2020-10-25"),
            contracts: [{
                name: "Thực tập",
                contractType: "Phụ thuộc",
                startDate: new Date("2019-10-25"),
                endDate: new Date("2020-10-25"),
            }],
            archivedRecordNumber: "T3 - 123698",
            files: [],
        }



    ]);
    console.log(`Xong! Thông tin nhân viên đã được tạo`);
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU NGHỊ PHÉP CHO CÔNG TY VNIST
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu nghỉ phép!");
    await AnnualLeave(vnistDB).insertMany([
        {
            company: vnist._id,
            employee: employees[3]._id,
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-05",
            endDate: "2020-09-19",
            status: "approved",
            reason: "Nghỉ du lịch"
        }, {
            company: vnist._id,
            employee: employees[4]._id,
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-02",
            endDate: "2020-09-22",
            status: "approved",
            reason: "Nghỉ về quê"
        }, {
            company: vnist._id,
            employee: employees[4]._id,
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-02-02",
            endDate: "2020-02-22",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[5]._id,
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-01",
            endDate: "2020-09-03",
            status: "waiting_for_approval",
            reason: "Nghỉ du lịch"
        }, {
            company: vnist._id,
            employee: employees[5]._id,
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-03-01",
            endDate: "2020-03-03",
            status: "waiting_for_approval",
            reason: "Nghỉ du lịch"
        },
        {
            company: vnist._id,
            employee: employees[6]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-09-05",
            endDate: "2020-09-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[7]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-09-05",
            endDate: "2020-09-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[7]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-04-05",
            endDate: "2020-04-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[7]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-01-05",
            endDate: "2020-01-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[8]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-09-04",
            endDate: "2020-09-16",
            status: "waiting_for_approval",
            reason: "Nghỉ du lịch"
        },
        {
            company: vnist._id,
            employee: employees[8]._id,
            organizationalUnit: phongKS[0]._id,
            startDate: "2019-10-04",
            endDate: "2019-10-16",
            status: "waiting_for_approval",
            reason: "Nghỉ du lịch"
        },
        {
            company: vnist._id,
            employee: employees[9]._id,
            organizationalUnit: phongQTNS[0]._id,
            startDate: "2020-09-05",
            endDate: "2020-09-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[9]._id,
            organizationalUnit: phongQTNS[0]._id,
            startDate: "2020-02-05",
            endDate: "2020-02-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },
        {
            company: vnist._id,
            employee: employees[9]._id,
            organizationalUnit: phongQTNS[0]._id,
            startDate: "2020-05-05",
            endDate: "2020-05-10",
            status: "approved",
            reason: "Nghỉ về quê"
        },

    ])
    console.log(`Xong! Thông tin nghỉ phép đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU LƯƠNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu lương nhân viên!");
    await Salary(vnistDB).insertMany([{
            company: vnist._id,
            employee: employees[1]._id,
            month: "2019-08",
            organizationalUnit: Directorate._id,
            mainSalary: "21000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng dự án",
                number: "1000000"
            }],
        }, {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2019-09",
            mainSalary: "20000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2019-10",
            mainSalary: "19000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2019-11",
            mainSalary: "17000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2019-12",
            mainSalary: "13000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-01",
            mainSalary: "14000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng dự án",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-02",
            mainSalary: "14000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-03",
            mainSalary: "10000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng dự án",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-04",
            mainSalary: "16000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng dự án",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-05",
            mainSalary: "18000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-06",
            mainSalary: "17000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng dự án",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-07",
            mainSalary: "12000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-08",
            mainSalary: "11000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            organizationalUnit: Directorate._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },

        {
            company: vnist._id,
            employee: employees[3]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },
        {
            company: vnist._id,
            employee: employees[4]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },

        {
            company: vnist._id,
            employee: employees[5]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },

        {
            company: vnist._id,
            employee: employees[6]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "18000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },

        {
            company: vnist._id,
            employee: employees[7]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },

        {
            company: vnist._id,
            employee: employees[8]._id,
            organizationalUnit: phongMaketing[0]._id,
            month: "2020-09",
            mainSalary: "15000000",
            unit: 'VND',
            bonus: [{
                nameBonus: "Thưởng tháng",
                number: "1000000"
            }],
        },




    ])
    console.log(`Xong! Thông tin lương nhân viên đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHEN THƯỞNG NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu khen thưởng!");
    await Commendation(vnistDB).insertMany([{
            company: vnist._id,
            employee: employees[1]._id,
            decisionNumber: "123",
            organizationalUnit: departments._id,
            startDate: "2020-02-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số",
        },
        {
            company: vnist._id,
            employee: employees[1]._id,
            decisionNumber: "1234",
            organizationalUnit: departments._id,
            startDate: "2020-02-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số 500 triệu",
        },
        {
            company: vnist._id,
            employee: employees[3]._id,
            decisionNumber: "12345",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-02-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số 500 triệu",
        },
        {
            company: vnist._id,
            employee: employees[4]._id,
            decisionNumber: "12346",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số 500 triệu",
        },
        {
            company: vnist._id,
            employee: employees[5]._id,
            decisionNumber: "12347",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số 500 triệu",
        },
        {
            company: vnist._id,
            employee: employees[6]._id,
            decisionNumber: "12348",
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-09-02",
            type: "Thưởng tiền",
            reason: "Vượt doanh số 500 triệu",
        }
    ])
    console.log(`Xong! Thông tin khen thưởng đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KỶ LUẬT NHÂN VIÊN
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */
    console.log("Khởi tạo dữ liệu kỷ luật!");
    await Discipline(vnistDB).insertMany([{
            company: vnist._id,
            employee: employees[1]._id,
            decisionNumber: "1456",
            organizationalUnit: departments._id,
            startDate: "2020-09-07",
            endDate: "2020-09-09",
            type: "Phạt tiền",
            reason: "Không làm đủ công",
        }, {
            company: vnist._id,
            employee: employees[1]._id,
            decisionNumber: "1457",
            organizationalUnit: departments._id,
            startDate: "2020-09-07",
            endDate: "2020-09-09",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },
        {
            company: vnist._id,
            employee: employees[3]._id,
            decisionNumber: "1458",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-08-07",
            endDate: "2020-08-09",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },
        {
            company: vnist._id,
            employee: employees[3]._id,
            decisionNumber: "1459",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-07",
            endDate: "2020-09-09",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },
        {
            company: vnist._id,
            employee: employees[4]._id,
            decisionNumber: "1460",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-07",
            endDate: "2020-09-09",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },
        {
            company: vnist._id,
            employee: employees[5]._id,
            decisionNumber: "1461",
            organizationalUnit: phongMaketing[0]._id,
            startDate: "2020-09-10",
            endDate: "2020-10-13",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },
        {
            company: vnist._id,
            employee: employees[6]._id,
            decisionNumber: "1462",
            organizationalUnit: phongKS[0]._id,
            startDate: "2020-09-20",
            endDate: "2020-09-25",
            type: "Phạt tiền",
            reason: "Không đủ doanh số",
        },


    ])
    console.log(`Xong! Thông tin kỷ luật đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CHƯƠNG TRÌNH ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    // console.log("Khởi tạo dữ liệu chương trình đào tạo bắt buộc!");
    // var educationProgram = await EducationProgram(vnistDB).insertMany([{
    //     applyForOrganizationalUnits: [
    //         departments[0]._id
    //     ],
    //     applyForPositions: [
    //         nvPhongHC._id
    //     ],
    //     name: "An toan lao dong",
    //     programId: "M123",
    // }, {
    //     applyForOrganizationalUnits: [
    //         departments[0]._id
    //     ],
    //     applyForPositions: [
    //         nvPhongHC._id
    //     ],
    //     name: "kỹ năng giao tiếp",
    //     programId: "M1234",
    // }])
    // console.log(`Xong! Thông tin chương trình đào tạo  đã được tạo`);

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU KHOÁ ĐÀO TẠO
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    // console.log("Khởi tạo dữ liệu khoá đào tạo bắt buộc!");
    // await Course(vnistDB).insertMany([{
    //     company: vnist._id,
    //     name: "An toàn lao động 1",
    //     courseId: "LD1233",
    //     offeredBy: "Vnists",
    //     coursePlace: "P9.01",
    //     startDate: "2020-02-16",
    //     endDate: "2020-03-21",
    //     cost: {
    //         number: "1200000",
    //         unit: 'VND'
    //     },
    //     lecturer: "Nguyễn B",
    //     type: "external",
    //     educationProgram: educationProgram[0]._id,
    //     employeeCommitmentTime: "6",
    // }, {
    //     company: vnist._id,
    //     name: "An toàn lao động 2",
    //     courseId: "LD123",
    //     offeredBy: "Vnists",
    //     coursePlace: "P9.01",
    //     startDate: "2020-02-16",
    //     endDate: "2020-03-21",
    //     cost: {
    //         number: "1200000",
    //         unit: 'VND'
    //     },
    //     lecturer: "Nguyễn Văn B",
    //     type: "internal",
    //     educationProgram: educationProgram[1]._id,
    //     employeeCommitmentTime: "6",
    // }])

    // console.log(`Xong! Thông tin khoá đào tạo  đã được tạo`);

    /**
     * Ngắt kết nối db
     */
    systemDB.close();
    vnistDB.close();

    console.log("End init sample company database!");
}

initHumanResourceData().catch(err => {
    console.log(err);
    process.exit(0);
})