var { EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet, 
    User
} = require('../models').schema;

var mongoose = require("mongoose");
require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
var db = process.env.DATABASE;

// kẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Kết nối thành công đến MongoDB!\n");
}).catch(err => console.log("ERROR! :(\n", err));

var organizationalUnitKpiData = async () => {
    console.log("Đang tạo dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi Set
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi Set");
    var users = await User.findOne({ name: "Nguyễn Văn An" });
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.create({
        organizationalUnit: "Ban giám đốc",
        creator: users,
        date: "6",
        kpis: []
    });
    console.log("Xong! Organizational Unit Kpi Set đã được tạo");
    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi");
    var organizationalUnitKpi = await OrganizationalUnitKpi.insertMany([{
        name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            default: 1
        }, {
            name: "Tăng doanh số bán hàng 20 tỷ",
            parent: null,
            weight: 20,
            criteria: "Tăng doanh số",
            default: 0
        }, {
            name: "Phát triển chuỗi bán hàng ở Đà Nẵng",
            parent: null,
            weight: 25,
            criteria: "Tăng số lượng cửa hàng",
            default: 0
        }, {
            name: "Mở rộng thị trường ở Đài Loan",
            parent: null,
            weight: 40,
            criteria: "Mở rộng thị trường",
            default: 0
        }, {
            name: "Củng cố nguồn nhân lực ở HN",
            parent: null,
            weight: 10,
            criteria: "Củng cố nhân sự",
            default: 0
        }
    ])
    organizationalUnitKpiSet = await OrganizationalUnitKpiSet.findByIdAndUpdate(
        organizationalUnitKpiSet, { $push: { kpis: organizationalUnitKpi.map(x => {return x._id}) } }, { new: true }
    );
    console.log("Xong! Organizational Unit Kpi đã được tạo");
}

//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
organizationalUnitKpiData()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });