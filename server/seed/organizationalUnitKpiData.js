var { EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet, 
    User,
    OrganizationalUnit
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

    var dean = await User.findOne({ name: "Nguyễn Văn An" });
    var viceDean = await User.findOne({ name: "Trần Văn Bình" });
    var employee_1 = await User.findOne({ name: "Vũ Thị Cúc" });
    var employee_2 = await User.findOne({ name: "Nguyễn Văn Danh" });
    var organizationalUnit = await OrganizationalUnit.findOne({ name: "Ban giám đốc" });
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();
    
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.insertMany([
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 11 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 10 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 9 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 8 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 7 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 6 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 5 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 4 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 3 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 2 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2
        }, {
            organizationalUnit: organizationalUnit,
            creator: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 1
        },
    ]);

    //END

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi");
    var organizationalUnitKpiArray = [];
    organizationalUnitKpiArray[0] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng 20 tỷ",
            parent: null,
            weight: 40,
            criteria: "Tăng doanh số",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Phát triển chuỗi bán hàng ở Đà Nẵng",
            parent: null,
            weight: 50,
            criteria: "Tăng số lượng cửa hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[1] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mở rộng thị trường ở ở các nước",
            parent: null,
            weight: 35,
            criteria: "Mở rộng thị trường",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Củng cố nguồn nhân lực ở HN",
            parent: null,
            weight: 55,
            criteria: "Củng cố nhân sự",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[2] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Công tác tham mưu cho lãnh đạo trong XD kế hoạch bán hàng năm",
            parent: null,
            weight: 35,
            criteria: "Công tác tham mưu cho lãnh đạo trong XD kế hoạch bán hàng năm",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Công tác tham mưu cho lãnh đạo trong XD kế hoạch bán hàng quý",
            parent: null,
            weight: 55,
            criteria: "Công tác tham mưu cho lãnh đạo trong XD kế hoạch bán hàng quý",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[3] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Xây dựng các kế hoạch bán hàng theo tháng",
            parent: null,
            weight: 40,
            criteria: "Xây dựng các kế hoạch bán hàng theo tháng phù hợp",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: null,
            weight: 50,
            criteria: "Doanh số bán hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[4] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm tỷ lệ chi phí bán hàng/Doanh số",
            parent: null,
            weight: 40,
            criteria: "Tỷ lệ chi phí bán hàng/Doanh số",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng lợi nhuận thu được từ bán hàng",
            parent: null,
            weight: 50,
            criteria: "Lợi nhuận thu được từ bán hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[5] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mở rộng nghiên cứu thị trường",
            parent: null,
            weight: 40,
            criteria: "Số lần nghiên cứu thị trường được thực hiện",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm tỷ lệ chi phí mua hàng/Doanh số mua",
            parent: null,
            weight: 50,
            criteria: "Tỷ lệ chi phí mua hàng/Doanh số mua",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[6] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Hoàn thành các mục tiêu chất lượng của ISO",
            parent: null,
            weight: 40,
            criteria: "Tỷ lệ hoàn thành các mục tiêu chất lượng của ISO trong kỳ đánh giá",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện nhanh các thủ tục xuất kho hàng hóa và nhập nho vật tư",
            parent: null,
            weight: 50,
            criteria: "Mức độ kịp thời trong thực hiện các thủ tục xuất kho hàng hóa và nhập nho vật tư",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[7] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Xây dựng kế hoạch mua hàng",
            parent: null,
            weight: 40,
            criteria: "Xây dựng kế hoạch mua hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng tỷ lệ chi phí mua hàng/Doanh số mua",
            parent: null,
            weight: 50,
            criteria: "Tỷ lệ chi phí mua hàng/Doanh số mua",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[8] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng tiến độ mua hàng đáp ứng nhu cầu vụ sản xuất",
            parent: null,
            weight: 40,
            criteria: "Tỷ lệ đảm bảo kịp tiến độ mua hàng đáp ứng nhu cầu vụ SX ",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mua vật tư phục vụ việc kinh doanh",
            parent: null,
            weight: 50,
            criteria: "Tỷ lệ mua vật tư chính xác",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[9] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mua hàng đáp ứng nhu cầu KH kiểm tu",
            parent: null,
            weight: 40,
            criteria: "Tỷ lệ đảm bảo kịp tiến độ mua hàng đáp ứng nhu cầu KH kiểm tu",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Hoàn thành các mục tiêu chất lượng của ISO trong công việc cá nhân",
            parent: null,
            weight: 50,
            criteria: "Tỷ lệ hoàn thành các mục tiêu chất lượng của ISO trong công việc cá nhân trong kỳ đánh giá?",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[10] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Xây dựng kế hoạch bán hàng",
            parent: null,
            weight: 40,
            criteria: "Tham gia xây dựng kế hoạch bán hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: null,
            weight: 50,
            criteria: "Doanh số bán hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);

    organizationalUnitKpiArray[11] = await OrganizationalUnitKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: null,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: null,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm tỷ lệ chi phí bán hàng / Doanh số",
            parent: null,
            weight: 40,
            criteria: "Tỷ lệ chi phí bán hàng / Doanh số",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm số khiếu nại, phản hồi tiêu cực từ khách hàng",
            parent: null,
            weight: 50,
            criteria: "Số khiếu nại, phản hồi tiêu cực từ khách hàng",
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }
    ]);
    

    /**
     * Gắn các KPI vào tập KPI của đơn vị
     */
    for(let i = 0; i < 12; i++){
        organizationalUnitKpiSet[i] = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpiSet[i], { $push: { kpis: organizationalUnitKpiArray[i].map(x => {return x._id}) } }, { new: true }
        );
    }
    

    console.log("Khởi tạo Employee Kpi Set");

    
    var employeeKpiSet_1 = await EmployeeKpiSet.insertMany([
        {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 11 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 10 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 9 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 8 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 7 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 6 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 5 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 4 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 3 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 2 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_1,
            approver: dean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2,
        }, 
    ]);

    var employeeKpiSet_2 = await EmployeeKpiSet.insertMany([
        {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 11 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 10 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 9 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 8 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 7 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 6 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 5 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 4 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 3 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 2 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth - 1 + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 3,
        }, {
            organizationalUnit: organizationalUnit,
            creator: employee_2,
            approver: viceDean,
            date: new Date(currentYear, currentMonth + 1, 0),
            kpis: [],
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null,
            status: 2,
        }, 
    ]);

    
    console.log("Khởi tạo Employee Kpi");

    var employee_1KpiArray = [];
    employee_1KpiArray[0] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[0][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[0][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng 10 tỷ",
            parent: organizationalUnitKpiArray[0][2]._id,
            weight: 40,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[0][2]._id,
            weight: 50,
            criteria: "Tham gia xây dựng kế hoạch bán",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[1] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[1][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[1][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mở rộng thị trường ở Đài Loan",
            parent: organizationalUnitKpiArray[1][2]._id,
            weight: 40,
            criteria: "Mức độ mở rộng thị trường ở Đài Loan",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mở rộng nghiên cứu thị trường ở Đài Loan",
            parent: organizationalUnitKpiArray[1][2]._id,
            weight: 50,
            criteria: "Số lần nghiên cứu thị trường thực hiện được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[2] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[2][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[2][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Đóng góp các ý kiến cho lãnh đạo trong XD kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[2][2]._id,
            weight: 40,
            criteria: "Tính hiệu quả của các ý kiến",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Góp ý các ý kiến cho lãnh đạo về XD kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[2][2]._id,
            weight: 50,
            criteria: "Góp ý các ý kiến cho lãnh đạo về XD kế hoạch bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[3] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[3][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[3][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng các kế hoạch bán hàng theo tháng",
            parent: organizationalUnitKpiArray[3][2]._id,
            weight: 40,
            criteria: "Số lần tham gia xây dựng các kế hoạch bán hàng theo tháng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu thị trường",
            parent: organizationalUnitKpiArray[3][2]._id,
            weight: 50,
            criteria: "Số lượng khảo sát nhu cầu thị trường",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[4] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[4][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[4][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm chi phí bán hàng",
            parent: organizationalUnitKpiArray[4][2]._id,
            weight: 40,
            criteria: "Chi phí bán hàng giảm được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray[4][2]._id,
            weight: 50,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[5] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[5][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[5][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Nghiên cứu thị trường tiềm năng",
            parent: organizationalUnitKpiArray[5][2]._id,
            weight: 40,
            criteria: "Số lần nghiên cứu thị trường được thực hiện",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng tỷ lệ tiếp xúc khách hàng",
            parent: organizationalUnitKpiArray[5][2]._id,
            weight: 50,
            criteria: "Tỷ lệ tiếp xúc khách hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[6] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[6][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[6][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện tham gia các mục tiêu chất lượng của ISO",
            parent: organizationalUnitKpiArray[6][2]._id,
            weight: 40,
            criteria: "Số lượng tham gia các mục tiêu chất lượng của ISO",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Hoàn thành các mục tiêu đã đặt ra",
            parent: organizationalUnitKpiArray[6][2]._id,
            weight: 50,
            criteria: "Số lượng hoàn thành các mục tiêu",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[7] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[7][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[7][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng các kế hoạch mua hàng",
            parent: organizationalUnitKpiArray[7][2]._id,
            weight: 40,
            criteria: "Mức độ tham gia xây dựng các kế hoạch mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu mua hàng",
            parent: organizationalUnitKpiArray[7][2]._id,
            weight: 50,
            criteria: "Các khảo sát được thực hiện",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[8] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[8][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[8][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện tăng tiến độ mua hàng đáp ứng nhu cầu vụ sản xuất",
            parent: organizationalUnitKpiArray[8][2]._id,
            weight: 40,
            criteria: "Tỷ lệ tăng tiến độ mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát tiến độ mua hàng đáp ứng nhu cầu vụ sản xuất",
            parent: organizationalUnitKpiArray[8][2]._id,
            weight: 50,
            criteria: "Các khảo sát được thực hiện",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[9] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[9][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[9][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng tiến độ mua hàng đáp ứng nhu cầu KH kiểm tu",
            parent: organizationalUnitKpiArray[9][2]._id,
            weight: 40,
            criteria: "Tiến độ mua hàng đáp ứng nhu cầu KH kiểm tu",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát tiến độ mua hàng đáp ứng nhu cầu KH kiểm tu",
            parent: organizationalUnitKpiArray[9][2]._id,
            weight: 50,
            criteria: "Các khảo sát được thực hiện",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[10] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[10][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[10][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[10][2]._id,
            weight: 40,
            criteria: "Mức độ tham gia xây dựng kế hoạch bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu mua hàng của thị trường",
            parent: organizationalUnitKpiArray[10][2]._id,
            weight: 50,
            criteria: "Các khảo sát được thực hiện",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_1KpiArray[11] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[11][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 1,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[11][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 1,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm tỷ lệ chi phí bán hàng",
            parent: organizationalUnitKpiArray[11][2]._id,
            weight: 40,
            criteria: "Tỷ lệ giảm chi phí bán hàng",
            status: 1,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray[11][2]._id,
            weight: 50,
            criteria: "Doanh số bán hàng",
            status: 1,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    
    var employee_2KpiArray = [];
    employee_2KpiArray[0] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[0][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[0][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát các chuỗi bán hàng",
            parent: organizationalUnitKpiArray[0][3]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát chuỗi bán hàng ở Đà Nẵng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[0][3]._id,
            weight: 50,
            criteria: "Tham gia xây dựng kế hoạch bán",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[1] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[1][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[1][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tiến hành các cuộc khảo sát nguồn nhân lực ở HN",
            parent: organizationalUnitKpiArray[1][3]._id,
            weight: 40,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tìm kiếm, củng cố nguồn nhân lực ở các vùng",
            parent: organizationalUnitKpiArray[1][3]._id,
            weight: 50,
            criteria: "Nguồn nhân lực củng cố được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[2] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[2][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[2][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia tham mưu cho lãnh đạo trong XD kế hoạch bán hàng quý",
            parent: organizationalUnitKpiArray[2][3]._id,
            weight: 40,
            criteria: "Mức độ tham gia tham mưu cho lãnh đạo",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu thị trường hàng tháng",
            parent: organizationalUnitKpiArray[2][3]._id,
            weight: 50,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[3] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[3][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[3][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray[3][3]._id,
            weight: 40,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu thị trường",
            parent: organizationalUnitKpiArray[3][3]._id,
            weight: 50,
            criteria: "Số lượng khảo sát nhu cầu thị trường",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[4] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[4][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[4][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm chi phí bán hàng",
            parent: organizationalUnitKpiArray[4][3]._id,
            weight: 40,
            criteria: "Chi phí bán hàng giảm được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng",
            parent: organizationalUnitKpiArray[4][3]._id,
            weight: 50,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[5] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[5][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[5][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm chi phí mua hàng",
            parent: organizationalUnitKpiArray[5][3]._id,
            weight: 40,
            criteria: "Chi phí mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng chi phí doanh số mua hàng",
            parent: organizationalUnitKpiArray[5][3]._id,
            weight: 50,
            criteria: "Chi phí doanh số mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[6] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[6][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[6][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện nhanh các thủ tục xuất kho hàng hóa và nhập nho vật tư",
            parent: organizationalUnitKpiArray[6][3]._id,
            weight: 40,
            criteria: "Số lượng tham gia các mục tiêu chất lượng của ISO",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Mua vật tư phục vụ nhu cầu sản xuất",
            parent: organizationalUnitKpiArray[6][3]._id,
            weight: 50,
            criteria: "Thông qua thống kê khảo sát. Đánh giá theo số lần mua không chính xác của cả Phòng (số lượng, chất lượng, chủng loại).: Không sai lần nào: 100%. 2 lần: 95%. 3 lần: 90%. 4 lần: 85%. >4 lần: 80%",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[7] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[7][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[7][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm chi phí mua hàng",
            parent: organizationalUnitKpiArray[7][3]._id,
            weight: 40,
            criteria: "Chi phí mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng chi phí doanh số mua hàng",
            parent: organizationalUnitKpiArray[7][3]._id,
            weight: 50,
            criteria: "Chi phí doanh số mua hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[8] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[8][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[8][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện nhanh việc mua vật tư phục vụ việc kinh doanh",
            parent: organizationalUnitKpiArray[8][3]._id,
            weight: 40,
            criteria: "Thông qua thống kê khảo sát. Đánh giá theo số lần mua không chính xác (số lượng, chất lượng, chủng loại).: Không sai lần nào: 100%. 1 lần: 95%. 2 lần: 90%. 3 lần: 85%. >3 lần: 80%",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Khảo sát nhu cầu mua vật tư phục vụ kinh doanh",
            parent: organizationalUnitKpiArray[8][3]._id,
            weight: 50,
            criteria: "Thống kê theo thực tế. Có báo cáo kết quả nghiên cứu thị trường được cấp trên đánh giá hữu ích và sát thực tế. 1 quý 4 lần",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[9] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[9][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[9][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện các mục tiêu chất lượng của ISO trong công việc cá nhân",
            parent: organizationalUnitKpiArray[9][3]._id,
            weight: 40,
            criteria: "Tỷ lệ hoàn thành các mục tiêu chất lượng của ISO trong công việc cá nhân trong kỳ đánh giá",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Giảm tỷ lệ chi phí  Mar / Doanh số bán hàng",
            parent: organizationalUnitKpiArray[9][3]._id,
            weight: 50,
            criteria: "Được tính bằng tỷ lệ các chi phí phát sinh trong quá trình marketing/ doanh số bán hàng. So với kế hoạch",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[10] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[10][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 2,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[10][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 2,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tăng doanh số bán hàng ở các vùng trong Hà Nội",
            parent: organizationalUnitKpiArray[10][3]._id,
            weight: 40,
            criteria: "Doanh số bán hàng",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[10][3]._id,
            weight: 50,
            criteria: "Các kế hoạch bán hàng xây dựng được",
            status: 2,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    employee_2KpiArray[11] = await EmployeeKpi.insertMany([
        {
            name: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            parent: organizationalUnitKpiArray[11][0]._id,
            weight: 5,
            criteria: "Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)",
            status: 1,
            type: 1,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            parent: organizationalUnitKpiArray[11][1]._id,
            weight: 5,
            criteria: "Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)",
            status: 1,
            type: 2,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Tham gia xây dựng kế hoạch bán hàng",
            parent: organizationalUnitKpiArray[11][3]._id,
            weight: 40,
            criteria: "Cấp trên đánh giá về chất lượng. Thời gian theo yêu cầu của trưởng phòng. Thống kê theo các lần thực hiện",
            status: 1,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, {
            name: "Thực hiện các biện pháp giảm số khiếu nại, phản hồi tiêu cực từ khách hàng",
            parent: organizationalUnitKpiArray[11][3]._id,
            weight: 50,
            criteria: "Thống kê theo thực tế. Các khiếu nại được xác minh là đúng thực tế.",
            status: 1,
            type: 0,
            automaticPoint: null,
            employeePoint: null,
            approvedPoint: null
        }, 
    ]);

    

    /**
     * Gắn các KPI vào tập KPI cá nhân
     */
    for(let i = 0; i < 12; i++){
        // Gắn các kpi vào tập kpi của Vũ Thị Cúc
        employeeKpiSet_1[i] = await EmployeeKpiSet.findByIdAndUpdate(
            employeeKpiSet_1[i], { $push: { kpis: employee_1KpiArray[i].map(x => {return x._id}) } }, { new: true }
        );

        // Gắn các kpi vào tập kpi của Nguyễn Văn Danh
        employeeKpiSet_2[i] = await EmployeeKpiSet.findByIdAndUpdate(
            employeeKpiSet_2[i], { $push: { kpis: employee_2KpiArray[i].map(x => {return x._id}) } }, { new: true }
        );
    }


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