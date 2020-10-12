const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('./terms');
const {initModels} = require('../helpers/dbHelper');
const Models = require('../models');
const { UserRole } = require("../models");

const {
    Component,
    RoleType,
    Role,
    Company,
    OrganizationalUnit,
    Link,
    Privilege,
    User,

    Configuration,

    SystemLink,
    SystemComponent,
} = Models;

require('dotenv').config();

const initSampleCompanyDB = async () => {
    console.log("Init sample VIAVET company database, ...");

    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty viavet
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
    if (!systemDB) throw ('DB system cannot connect');
    console.log("DB system connected");
    await Configuration(systemDB).insertMany([
        {
            name: 'viavet',
            backup: {
                time: {
                    second: '0',
                    minute: '0',
                    hour: '2',
                    date: '1',
                    month: '*',
                    day: '*'
                },
                limit: 10
            }
        }
    ]);

    const viavetDB = mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/viavet`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_AUTHENTICATION === "true" ? process.env.DB_USERNAME : undefined,
            pass: process.env.DB_AUTHENTICATION === "true" ? process.env.DB_PASSWORD : undefined,
        }
    );
    if (!systemDB) throw ('DB viavet cannot connect');
    console.log("DB viavet connected");

    /**
     * 1.1 Khởi tạo model cho db
     */
    initModels(viavetDB, Models);
    initModels(systemDB, Models);


    /**
     * 2. Xóa dữ liệu db cũ của công ty viavet
     */
    await Company(systemDB).deleteOne({ shortName: 'viavet' });
    viavetDB.dropDatabase();



    /**
     * 3. Khởi tạo dữ liệu về công ty viavet trong database của hệ thống
     */
    const viavet = await Company(systemDB).create({
        name: 'CÔNG TY CỔ PHẦN ĐẦU TƯ LIÊN DOANH VIỆT ANH',
        shortName: 'viavet',
        description: 'CÔNG TY CỔ PHẦN ĐẦU TƯ LIÊN DOANH VIỆT ANH'
    });
    console.log(`Xong! Công ty [${viavet.name}] đã được tạo.`);


    /**
     * 4. Tạo các tài khoản người dùng trong csdl của công ty viavet
     */
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User(viavetDB).insertMany([
    // QUẢN TRỊ HỆ THỐNG
    {
        name: 'Super Admin viavet',
        email: 'super.admin.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Admin viavet',
        email: 'admin.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, 

    // BAN LÃNH ĐẠO 
    {
        name: 'Ngô Phương Loan',
        email: 'ngophuongloan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Văn Dũng',
        email: 'tranvandung.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Phương Liên',
        email: 'tranphuonglien.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, 
    
    // PHÒNG KINH DOANH VIAVET
    {
        name: 'Trần Văn Vịnh',
        email: 'tranvanvinh.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Văn Long',
        email: 'nguyenvanlong.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Ma Tiến Công',
        email: 'matiencong.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Đoàn Ngọc Kiên',
        email: 'doanngockien.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Lê Thành Lâm',
        email: 'lethanhlam.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Phùng Thanh Sơn',
        email: 'phungthanhson.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, 
    
    // PHÒNG KINH DOANH SANVFOVET
    {
        name: 'ngô Văn Tuyền',
        email: 'ngovantuyen.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Văn Quang',
        email: 'tranvanquang.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Thach Minh Trí',
        email: 'thachminhtri.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Văn Tròn',
        email: 'nguyenvantron.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // PHÒNG NHẬP KHẨU - KINH DOANH NGUYÊN LIỆU
    , {
        name: 'Trần Việt Anh',
        email: 'tranvietanh.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Trung Kiên',
        email: 'nguyentrungkien.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Văn Thành',
        email: 'nguyenvanthanh.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Ngọc Tuấn',
        email: 'tranngontuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // PHÒNG THƯƠNG MẠI QUỐC TẾ
    , {
        name: 'Lương Quốc Phong',
        email: 'luongquocphong.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trương Huy Tùng',
        email: 'truonghuytung.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // PHÒNG MARKETING
    , {
        name: 'Nguyễn Viết Đảng',
        email: 'nguyenvietdang.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Thị Hằng',
        email: 'nguyenthihang.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Phạm Viết Truyền',
        email: 'phamviettruyen.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Quốc Doanh',
        email: 'nguyenquocdoanh.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // BAN KINH DOANH DỰ ÁN
    , {
        name: 'Phạm Ngọc Khoan',
        email: 'nguyenngockhoan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, 
    
    // PHÒNG HÀNH CHÍNH - QUẢN TRỊ
    {
        name: 'Phạm Minh Tuấn',
        email: 'phamminhtuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trương Anh Tuấn',
        email: 'truonganhtuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Dương Thị Thanh Thùy',
        email: 'duongthithanhthuy.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Thị Huệ',
        email: 'nguyenthihue.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Vũ Viết Xuân',
        email: 'vuvietxuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // PHÒNG KẾ TÓAN DOANH NGHIỆP
    , {
        name: 'Hoàng Văn Tùng',
        email: 'hoangvantung.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Văn Hải',
        email: 'nguyenvanhai.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Văn Sơn A',
        email: 'tranvansona.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // PHÒNG KẾ TOÁN ADMIN
    , {
        name: 'Nguyễn Thống Nhất',
        email: 'nguyenthongnhat.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Trần Kim Cương',
        email: 'trankimcuong.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Nguyễn Đình Thuận',
        email: 'nguyendinhthuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }

    // TỔ HỖ TRỢ
    , {
        name: 'Trần Văn Trường',
        email: 'tranvantruong.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Ngô Văn Hậu',
        email: 'ngovanhau.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }, {
        name: 'Ngô Văn Tuấn',
        email: 'ngovantuan.viavet@gmail.com',
        password: hash,
        company: viavet._id
    }
]);
    console.log("Dữ liệu tài khoản người dùng cho công ty viavet", users);

    let viavetCom = await Company(systemDB).findById(viavet._id);
    viavetCom.superAdmin = users[0]._id;
    await viavetCom.save();

    /**
     * 5. Tạo các role mặc định cho công ty viavet
     */
    await RoleType(viavetDB).insertMany([
        { name: Terms.ROLE_TYPES.ROOT },
        { name: Terms.ROLE_TYPES.POSITION },
        { name: Terms.ROLE_TYPES.COMPANY_DEFINED }
    ]);
    const roleAbstract = await RoleType(viavetDB).findOne({
        name: Terms.ROLE_TYPES.ROOT
    });
    const roleChucDanh = await RoleType(viavetDB).findOne({
        name: Terms.ROLE_TYPES.POSITION
    });
    const roleTuDinhNghia = await RoleType(viavetDB).findOne({
        name: Terms.ROLE_TYPES.COMPANY_DEFINED
    });

    /**
     * ------------------------------------------------------------
     * TẠO ROLE QUẢN TRỊ VÀ CÁC ROLE CHỨC DANH CHO CÔNG TY VIAVET
     * ------------------------------------------------------------
     */
    const roleAdmin = await Role(viavetDB).create({
        name: Terms.ROOT_ROLES.ADMIN.name,
        type: roleAbstract._id,
    });
    const roleSuperAdmin = await Role(viavetDB).create({
        name: Terms.ROOT_ROLES.SUPER_ADMIN.name,
        type: roleAbstract._id,
        parents: [roleAdmin._id]
    });
    const roleDean = await Role(viavetDB).create({
        name: Terms.ROOT_ROLES.DEAN.name,
        type: roleAbstract._id,
    });
    const roleViceDean = await Role(viavetDB).create({
        name: Terms.ROOT_ROLES.VICE_DEAN.name,
        type: roleAbstract._id,
    });
    const roleEmployee = await Role(viavetDB).create({
        name: Terms.ROOT_ROLES.EMPLOYEE.name,
        type: roleAbstract._id,
    });

    // Phòng ban giám đốc - ban lãnh đạo
    const thanhVienBGĐ = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Thành viên ban giám đốc",
        type: roleChucDanh._id
    });
    const chutich = await Role(viavetDB).create({
        parents: [roleDean._id, thanhVienBGĐ._id],
        name: "Chủ tịch hội đồng quản trị",
        type: roleChucDanh._id
    });
    const tdg = await Role(viavetDB).create({
        parents: [roleDean._id, thanhVienBGĐ._id],
        name: "Tổng giám đốc",
        type: roleChucDanh._id
    });
    const gdTaiChinh = await Role(viavetDB).create({
        parents: [roleDean._id, thanhVienBGĐ._id],
        name: "Giám đốc tài chính",
        type: roleChucDanh._id
    });

    // Phòng kinh doanh VIAVET
    const nvKtttViavet = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên KTTT ViaVet",
        type: roleChucDanh._id
    });
    const nvKinhDoanhViavet = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên kinh doanh",
        type: roleChucDanh._id
    });
    const qlBanHangViavet = await Role(viavetDB).create({
        parents: [roleViceDean._id, nvKtttViavet._id, nvKinhDoanhViavet._id],
        name: "Quản lý bán hàng",
        type: roleChucDanh._id
    });
    const gdBanHangViavet = await Role(viavetDB).create({
        parents: [roleDean._id, qlBanHangViavet._id, nvKinhDoanhViavet._id, nvKtttViavet._id],
        name: "Giám đốc bán hàng VIAVET",
        type: roleChucDanh._id
    });
    const gdKTTTViavet = await Role(viavetDB).create({
        parents: [roleDean._id, qlBanHangViavet._id, nvKinhDoanhViavet._id, nvKtttViavet._id],
        name: "Giám đốc KTTT VIAVET",
        type: roleChucDanh._id
    });
    const gdKinhDoanhViavet = await Role(viavetDB).create({
        parents: [roleDean._id, qlBanHangViavet._id, nvKinhDoanhViavet._id, nvKtttViavet._id],
        name: "Giám đốc kinh doanh VIAVET",
        type: roleChucDanh._id
    });

    // Phòng kinh doanh SANFOVET
    const nvKtttSanfovet = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên KTTT SANFOVET",
        type: roleChucDanh._id
    });
    const nvKinhDoanhSanfovet = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên kinh doanh SANFOVET",
        type: roleChucDanh._id
    });
    const qlBanHangSanfovet = await Role(viavetDB).create({
        parents: [roleViceDean._id, nvKtttSanfovet._id, nvKinhDoanhViavet._id],
        name: "Quản lý bán hàng SANFOVET",
        type: roleChucDanh._id
    });
    const gdBanHangSanfovet = await Role(viavetDB).create({
        parents: [roleDean._id, qlBanHangSanfovet, nvKinhDoanhSanfovet._id, nvKtttSanfovet._id],
        name: "Giám đốc bán hàng SANFOVET",
        type: roleChucDanh._id
    });
    const gdKTTTSanfovet = await Role(viavetDB).create({
        parents: [roleDean._id, qlBanHangSanfovet, nvKinhDoanhSanfovet._id, nvKtttSanfovet._id],
        name: "Giám đốc KTTT SANFOVET",
        type: roleChucDanh._id
    });

    // Phòng nhập khẩu nguyên liệu
    const nvNhapKhau = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên nhập khẩu",
        type: roleChucDanh._id
    });
    const canboKDNL = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Cán bộ kinh doanh nguyên liệu",
        type: roleChucDanh._id
    });
    const gdKDNL = await Role(viavetDB).create({
        parents: [roleDean._id, canboKDNL._id, nvNhapKhau._id],
        name: "Giám đốc kinh doanh nguyên liệu",
        type: roleChucDanh._id
    });
    const gdNhapKhau = await Role(viavetDB).create({
        parents: [roleDean._id, canboKDNL._id, nvNhapKhau._id],
        name: "Giám đốc nhập khẩu",
        type: roleChucDanh._id
    });

    // Phòng MARKETTING
    const nvThietKe = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên thiết kế ",
        type: roleChucDanh._id
    });
    const nvKTTTMarketing = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên KTTT Marketing",
        type: roleChucDanh._id
    });
    const gdMarketing = await Role(viavetDB).create({
        parents: [roleDean._id, nvThietKe._id, nvKTTTMarketing._id],
        name: "Giám đốc DufaFarm & Marketing",
        type: roleChucDanh._id
    });

    // Phòng hành chính quản trị
    const nvHanhChinh = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên hành chính",
        type: roleChucDanh._id
    });
    const nvVanThu = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên văn thư",
        type: roleChucDanh._id
    });
    const nvVatTu = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên vật tư",
        type: roleChucDanh._id
    });
    const nvBepAn = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên bếp ăn",
        type: roleChucDanh._id
    });
    const nvBaoVe = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên bảo vệ",
        type: roleChucDanh._id
    });
    const nvTapVu = await Role(viavetDB).create({
        parents: [roleEmployee._id],
        name: "Nhân viên tạp vụ",
        type: roleChucDanh._id
    });
    const tpHCQT = await Role(viavetDB).create({
        parents: [roleDean._id, nvHanhChinh._id, nvVanThu._id, nvVatTu._id, nvBepAn._id, nvBaoVe._id, nvTapVu._id],
        name: "Trưởng phòng hành chính quản trị",
        type: roleChucDanh._id
    });
    const gdHCQT = await Role(viavetDB).create({
        parents: [roleDean._id, nvHanhChinh._id, nvVanThu._id, nvVatTu._id, nvBepAn._id, nvBaoVe._id, nvTapVu._id],
        name: "Giám đốc quản trị",
        type: roleChucDanh._id
    });
    console.log("Dữ liệu các phân quyền cho công ty viavet");


    /**
     * 6. Gán phân quyền cho các vị trí trong công ty
     */
    const userRoles = await UserRole(viavetDB).insertMany([
        { 
            userId: users[0]._id, 
            roleId: roleSuperAdmin._id
        },
    ])

    /**
     * 7. Tạo dữ liệu các phòng ban cho công ty viavet
     */
    const pbGiamDoc = await OrganizationalUnit(viavetDB).create({ // Khởi tạo ban giám đốc công ty
        name: "Ban lãnh đạo",
        description: "Ban lãnh đạo công ty VIAVET",
        deans: [chutich._id, tdg._id, gdTaiChinh._id],
        viceDeans: [],
        employees: [thanhVienBGĐ._id],
        parent: null
    });
    const pbKDVIAVET = await OrganizationalUnit(viavetDB).create({
        name: "Phòng kinh doanh VIAVET",
        description: "Phòng kinh doanh VIAVET",
        deans: [gdBanHangViavet._id, gdKTTTViavet._id, gdKinhDoanhViavet._id],
        viceDeans: [qlBanHangViavet._id],
        employees: [nvKtttViavet._id, nvKinhDoanhViavet._id],
        parent: pbGiamDoc._id
    });
    const pbKDSANFOVET = await OrganizationalUnit(viavetDB).create({
        name: "Phòng kinh doanh SANFOVET",
        description: "Phòng kinh doanh SANFOVET",
        deans: [gdBanHangSanfovet._id, gdKTTTSanfovet._id],
        viceDeans: [qlBanHangSanfovet._id],
        employees: [nvKtttSanfovet._id, nvKinhDoanhSanfovet._id],
        parent: pbGiamDoc._id
    });
    const pbNKNL = await OrganizationalUnit(viavetDB).create({
        name: "Phòng nhập khẩu nguyên liệu",
        description: "Phòng nhập khẩu nguyên liệu",
        deans: [gdKDNL._id, gdNhapKhau._id],
        viceDeans: [],
        employees: [nvNhapKhau._id, canboKDNL._id],
        parent: pbGiamDoc._id
    });
    const pbMarketing = await OrganizationalUnit(viavetDB).create({
        name: "Phòng MARKETING",
        description: "Phòng MARKETING",
        deans: [gdMarketing._id],
        viceDeans: [],
        employees: [nvThietKe._id, nvKTTTMarketing._id],
        parent: pbGiamDoc._id
    });
    const pbHCQT = await OrganizationalUnit(viavetDB).create({
        name: "Phòng hành chính - quản trị",
        description: "Phòng hành chính - quản trị",
        deans: [tpHCQT._id, gdHCQT._id],
        viceDeans: [],
        employees: [nvHanhChinh._id, nvVanThu._id, nvVatTu._id, nvBepAn._id, nvBaoVe._id, nvTapVu._id],
        parent: pbGiamDoc._id
    });
    console.log("Đã tạo dữ liệu phòng ban");

    /**
     * 8. Tạo link cho các trang web của công ty viavet
     */
    const createCompanyLinks = async (linkArr, roleArr) => {
        let checkIndex = (link, arr) => {
            let resIndex = -1;
            arr.forEach((node, i) => {
                if (node.url === link.url) {
                    resIndex = i;
                }
            });

            return resIndex;
        }

        let allLinks = await SystemLink(systemDB).find()
            .populate({
                path: 'roles'
            });
        let activeLinks = await SystemLink(systemDB).find({ _id: { $in: linkArr } })
            .populate({
                path: 'roles'
            });

        let dataLinks = allLinks.map(link => {
            if (checkIndex(link, activeLinks) === -1)
                return {
                    url: link.url,
                    category: link.category,
                    description: link.description
                }
            else return {
                url: link.url,
                category: link.category,
                description: link.description,
                deleteSoft: false
            }
        })

        let links = await Link(viavetDB).insertMany(dataLinks);

        //Thêm phân quyền cho link
        let dataPrivilege = [];
        for (let i = 0; i < links.length; i++) {
            let link = links[i];

            for (let j = 0; j < allLinks.length; j++) {
                let systemLink = allLinks[j];

                if (link.url === systemLink.url) {
                    for (let x = 0; x < systemLink.roles.length; x++) {
                        let rootRole = systemLink.roles[x];

                        for (let y = 0; y < roleArr.length; y++) {
                            let role = roleArr[y];

                            if (role.name === rootRole.name) {
                                dataPrivilege.push({
                                    resourceId: link._id,
                                    resourceType: 'Link',
                                    roleId: role._id
                                });
                            }
                        }
                    }
                }
            }
        }
        await Privilege(viavetDB).insertMany(dataPrivilege);

        return await Link(viavetDB).find()
            .populate({
                path: 'roles',
                populate: { path: 'roleId' }
            });
    }

    const createCompanyComponents = async (linkArr) => {

        let systemLinks = await SystemLink(systemDB).find({ _id: { $in: linkArr } });

        let dataSystemComponents = systemLinks.map(link => link.components);
        dataSystemComponents = dataSystemComponents.reduce((arr1, arr2) => [...arr1, ...arr2]);
        dataSystemComponents.filter((component, index) => dataSystemComponents.indexOf(component) === index);
        const systemComponents = await SystemComponent(systemDB)
            .find({ _id: { $in: dataSystemComponents } })
            .populate({ path: 'roles' });

        for (let i = 0; i < systemComponents.length; i++) {
            let sysLinks = await SystemLink(systemDB)
                .find({ _id: { $in: systemComponents[i].links } });
            let links = await Link(viavetDB).find({
                url: sysLinks.map(link => link.url)
            });
            // Tạo component
            let component = await Component(viavetDB).create({
                name: systemComponents[i].name,
                description: systemComponents[i].description,
                links: links.map(link => link._id),
                deleteSoft: false
            })
            for (let j = 0; j < links.length; j++) {
                let updateLink = await Link(viavetDB).findById(links[j]._id);
                updateLink.components.push(component._id);
                await updateLink.save();
            }
            // Tạo phân quyền cho components
            let roles = await Role(viavetDB).find({
                name: {
                    $in: systemComponents[i].roles.map(role => role.name)
                }
            });
            let dataPrivileges = roles.map(role => {
                return {
                    resourceId: component._id,
                    resourceType: 'Component',
                    roleId: role._id
                }
            });
            await Privilege(viavetDB).insertMany(dataPrivileges);
        }

        return await Component(viavetDB).find();
    }
    let linkArrData = await SystemLink(systemDB).find();
    let linkArr = linkArrData.map(link => link._id);
    let roleArr = [roleSuperAdmin, roleAdmin, roleDean, roleViceDean, roleEmployee];
    await createCompanyLinks(linkArr, roleArr);
    await createCompanyComponents(linkArr);


    /**
     * Ngắt kết nối db
     */
    systemDB.close();
    viavetDB.close();

    console.log("End init sample company database!");
}

initSampleCompanyDB().catch(err => {
    console.log(err);
    process.exit(0);
})