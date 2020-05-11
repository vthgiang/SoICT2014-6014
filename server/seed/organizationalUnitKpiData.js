var { EmployeeKpi,
    EmployeeKpiSet,
    OrganizationalUnitKpi,
    OrganizationalUnitKpiSet, 
    User,
    OrganizationalUnit,
    Task
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
    /**
     * @dean Nguyễn Văn An
     * @viceDean Trần Văn Bình
     * @employee_1 Vũ Thị Cúc
     * @employee_2 Nguyễn Văn Danh
     * @organizationalUnit Ban giám đốc
     * @currentYear Năm hiện tại
     * @currentMonth Tháng hiện tại
     */
    var dean = await User.findOne({ name: "Nguyễn Văn An" });
    var viceDean = await User.findOne({ name: "Trần Văn Bình" });
    var employee_1 = await User.findOne({ name: "Vũ Thị Cúc" });
    var employee_2 = await User.findOne({ name: "Nguyễn Văn Danh" });
    var organizationalUnit = await OrganizationalUnit.findOne({ name: "Ban giám đốc" });
    var now = new Date();
    var currentYear = now.getFullYear();
    var currentMonth = now.getMonth();

    console.log("Đang tạo dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU Organizational Unit Kpi Set
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo Organizational Unit Kpi Set");
    
    var organizationalUnitKpiSet = await OrganizationalUnitKpiSet.insertMany([
        {
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
            status: 2
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
            criteria: "Doanh số bán hàng",
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
    

    /**
     * Gắn các KPI vào tập KPI của đơn vị
     */
    for(let i = 0; i < 2; i++){
        organizationalUnitKpiSet[i] = await OrganizationalUnitKpiSet.findByIdAndUpdate(
            organizationalUnitKpiSet[i], { $push: { kpis: organizationalUnitKpiArray[i].map(x => {return x._id}) } }, { new: true }
        );
    }
    

    console.log("Khởi tạo Employee Kpi Set");

    
    var employeeKpiSet_1 = await EmployeeKpiSet.insertMany([
        {
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
            status: 3,
        }, 
    ]);

    var employeeKpiSet_2 = await EmployeeKpiSet.insertMany([
        {
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
            status: 3,
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
            name: "Khảo sát thị trường bán hàng ở trong nước",
            parent: organizationalUnitKpiArray[1][2]._id,
            weight: 50,
            criteria: "Các cuộc khảo sát thực hiện được",
            status: 2,
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

    /**
     * Gắn các KPI vào tập KPI cá nhân
     */
    for(let i = 0; i < 2; i++){
        // Gắn các kpi vào tập kpi của Vũ Thị Cúc
        employeeKpiSet_1[i] = await EmployeeKpiSet.findByIdAndUpdate(
            employeeKpiSet_1[i], { $push: { kpis: employee_1KpiArray[i].map(x => {return x._id}) } }, { new: true }
        );

        // Gắn các kpi vào tập kpi của Nguyễn Văn Danh
        employeeKpiSet_2[i] = await EmployeeKpiSet.findByIdAndUpdate(
            employeeKpiSet_2[i], { $push: { kpis: employee_2KpiArray[i].map(x => {return x._id}) } }, { new: true }
        );
    }



    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU CÔNG VIỆC 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    // Tạo công việc tương ứng với kpi của employee_1
    var task_employee_1 = await Task.insertMany([
        // Tháng trước
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Mở rộng việc bán hàng ở các khu vực trong Hà Nội",
            description: "Doanh thu thu được từ hoạt động bán hàng so với kế hoạch đã xây dựng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [employee_2], // Người hỗ trợ
            informedEmployees: [viceDean], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_1,
                    kpis: [employee_1KpiArray[0][2]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 70,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_2, 
                        role: "Consulted",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 30,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: dean, 
                        role: "Accountable",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tham gia vào đội ngũ xây dựng kế hoạch ban hàng",
            description: "KHBH tháng. Cần có vào 25 tháng trước. Yêu cầu kịp thời và sát nhu cầu thị trường",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [viceDean], // Người hỗ trợ
            informedEmployees: [employee_1], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_2,
                    kpis: [employee_1KpiArray[0][2]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 90,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: viceDean, 
                        role: "Consulted",
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: dean, 
                        role: "Accountable",
                        automaticPoint: 70,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 100,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tăng doanh số bán hàng",
            description: "Doanh số bán hàng",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth, 25, 12),
            priority: "Trung bình", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1, employee_2], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [viceDean], // Người hỗ trợ
            informedEmployees: [dean], // Người quan sát
            evaluations: [
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth - 1, 30),
                    kpis:[
                        { // Kpis của những người thực hiện (responsibleEmployees)
                            employee: employee_1,
                            kpis: [employee_1KpiArray[0][2]]
                        },
                        { 
                            employee: employee_2,
                            kpis: [employee_1KpiArray[0][2]]
                        }
                    ],
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1, // Người được đánh giá
                            role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                            automaticPoint: 80,
                            employeePoint: 80,
                            approvedPoint: 60,
                            contribution: 40,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: employee_2, 
                            role: "Responsible",
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 40,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: viceDean, 
                            role: "Consulted",
                            automaticPoint: 100,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: dean, 
                            role: "Accountable",
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 0,
                            taskImportanceLevel: 5,
                        }
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                },
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth, 30),
                    kpis:[
                        { // Kpis của những người thực hiện (responsibleEmployees)
                            employee: employee_1,
                            kpis: [employee_1KpiArray[1][2]]
                        },
                        { 
                            employee: employee_2,
                            kpis: [employee_1KpiArray[1][2]]
                        }
                    ],
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1, // Người được đánh giá
                            role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                            automaticPoint: 90,
                            employeePoint: 100,
                            approvedPoint: 80,
                            contribution: 50,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: employee_2, 
                            role: "Responsible",
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: viceDean, 
                            role: "Consulted",
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 30,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: dean, 
                            role: "Accountable",
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 0,
                            taskImportanceLevel: 5,
                        }
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                }

            ],
            progress: 95,
        }, 

        // Tháng hiện tại
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Ký kết các hợp đồng với các đối tác nước ngoài",
            description: "Đánh giá theo các bản hợp đồng ký kết thành công",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [viceDean], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [employee_1], // Người hỗ trợ
            informedEmployees: [employee_2], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: viceDean,
                    kpis: [employee_1KpiArray[1][2]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: viceDean, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 80,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_1, 
                        role: "Consulted",
                        automaticPoint: 90,
                        employeePoint: 100,
                        approvedPoint: 100,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: dean, 
                        role: "Accountable",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tiến hành các cuộc khảo sát nhanh",
            description: "Đánh giá theo các cuộc khảo sát được tiến hành",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [viceDean], // Người phê duyệt
            consultedEmployees: [employee_1], // Người hỗ trợ
            informedEmployees: [dean], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_2,
                    kpis: [employee_1KpiArray[0][3]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 95,
                        employeePoint: 95,
                        approvedPoint: 95,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_1, 
                        role: "Consulted",
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 95,
                        contribution: 40,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: viceDean, 
                        role: "Accountable",
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 100,
        },


    ]);
    
    // Tạo công việc tương ứng với kpi của employee_2
    var task_employee_2 = await Task.insertMany([
        // Tháng trước
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tiến hành các cuộc khảo sát chuỗi bán hàng",
            description: "Đánh giá theo các cuộc khảo sát được tiến hành",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: "Thấp", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1], // Người thực hiện
            accountableEmployees: [viceDean], // Người phê duyệt
            consultedEmployees: [employee_2], // Người hỗ trợ
            informedEmployees: [dean], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_1,
                    kpis: [employee_2KpiArray[0][2]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_1, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_2, 
                        role: "Consulted",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 40,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: viceDean, 
                        role: "Accountable",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 90,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tham gia vào đội ngũ xây dựng kế hoạch ban hàng",
            description: "KHBH tháng. Cần có vào 25 tháng trước. Yêu cầu kịp thời và sát nhu cầu thị trường",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth - 1, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [viceDean], // Người hỗ trợ
            informedEmployees: [employee_1], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth - 1, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_2,
                    kpis: [employee_2KpiArray[0][3]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 95,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 90,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: viceDean, 
                        role: "Consulted",
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 85,
                        contribution: 10,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: dean, 
                        role: "Accountable",
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 95,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tăng doanh số bán hàng ở trong nước",
            description: "Doanh số bán hàng trong nước",
            startDate: new Date(currentYear, currentMonth - 1, 1, 12),
            endDate: new Date(currentYear, currentMonth, 28, 12),
            priority: "Trung bình", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_1, employee_2], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [viceDean], // Người hỗ trợ
            informedEmployees: [dean], // Người quan sát
            evaluations: [
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth - 1, 30),
                    kpis:[
                        { // Kpis của những người thực hiện (responsibleEmployees)
                            employee: employee_1,
                            kpis: [employee_2KpiArray[0][2]]
                        },
                        { 
                            employee: employee_2,
                            kpis: [employee_2KpiArray[0][2]]
                        }
                    ],
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1, // Người được đánh giá
                            role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 50,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: employee_2, 
                            role: "Responsible",
                            automaticPoint: 60,
                            employeePoint: 90,
                            approvedPoint: 70,
                            contribution: 40,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: viceDean, 
                            role: "Consulted",
                            automaticPoint: 95,
                            employeePoint: 90,
                            approvedPoint: 90,
                            contribution: 10,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: dean, 
                            role: "Accountable",
                            automaticPoint: 70,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 0,
                            taskImportanceLevel: 5,
                        }
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                },
                { // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                    date: new Date(currentYear, currentMonth, 30),
                    kpis:[
                        { // Kpis của những người thực hiện (responsibleEmployees)
                            employee: employee_1,
                            kpis: [employee_2KpiArray[1][2]]
                        },
                        { 
                            employee: employee_2,
                            kpis: [employee_2KpiArray[1][2]]
                        }
                    ],
                    results: [
                        { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                            employee: employee_1, // Người được đánh giá
                            role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                            automaticPoint: 90,
                            employeePoint: 100,
                            approvedPoint: 90,
                            contribution: 50,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: employee_2, 
                            role: "Responsible",
                            automaticPoint: 90,
                            employeePoint: 100,
                            approvedPoint: 80,
                            contribution: 20,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: viceDean, 
                            role: "Consulted",
                            automaticPoint: 90,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 30,
                            taskImportanceLevel: 5,
                        },
                        { 
                            employee: dean, 
                            role: "Accountable",
                            automaticPoint: 80,
                            employeePoint: 90,
                            approvedPoint: 80,
                            contribution: 0,
                            taskImportanceLevel: 5,
                        }
                    ],
                    taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                }

            ],
            progress: 85,
        }, 

        // Tháng hiện tại
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tiến hành các khảo sát về nguồn nhân lực",
            description: "Đánh giá theo các cuộc khảo sát thực hiện được",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: "Trung bình", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [dean], // Người phê duyệt
            consultedEmployees: [employee_1], // Người hỗ trợ
            informedEmployees: [viceDean], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_2,
                    kpis: [employee_2KpiArray[1][2]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 50,
                        employeePoint: 90,
                        approvedPoint: 60,
                        contribution: 20,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_1, 
                        role: "Consulted",
                        automaticPoint: 90,
                        employeePoint: 100,
                        approvedPoint: 80,
                        contribution: 80,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: dean, 
                        role: "Accountable",
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 95,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 90,
        }, 
        {
            organizationalUnit: organizationalUnit,
            creator: dean,
            name: "Tìm kiếm nguồn nhân lực ở các trường đại học",
            description: "Thông qua thống kê khảo sát. Đánh giá theo số lần chậm do lỗi chủ quan. Không chậm: 100%. Chậm 3 lần: 95%. Chậm 5 lần : 90%. Chậm 7 lần: 85%. Chậm >7 lần: 80%",
            startDate: new Date(currentYear, currentMonth, 1, 12),
            endDate: new Date(currentYear, currentMonth, 30, 12),
            priority: "Cao", // Mức độ ưu tiên
            isArchived: false,
            status: "Finished",
            taskTemplate: null,
            parent: null,
            level: 1,
            inactiveEmployees: [],
            responsibleEmployees: [employee_2], // Người thực hiện
            accountableEmployees: [viceDean], // Người phê duyệt
            consultedEmployees: [employee_1], // Người hỗ trợ
            informedEmployees: [dean], // Người quan sát
            evaluations: [{ // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: new Date(currentYear, currentMonth, 30),
                kpis:[{ // Kpis của những người thực hiện (responsibleEmployees)
                    employee: employee_2,
                    kpis: [employee_2KpiArray[1][3]]
                }],
                results: [
                    { // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: employee_2, // Người được đánh giá
                        role: "Responsible", // người thực hiện: responsible, người hỗ trợ: consulted, người phê duyệt: accountable
                        automaticPoint: 90,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 60,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: employee_1, 
                        role: "Consulted",
                        automaticPoint: 100,
                        employeePoint: 90,
                        approvedPoint: 80,
                        contribution: 40,
                        taskImportanceLevel: 5,
                    },
                    { 
                        employee: viceDean, 
                        role: "Accountable",
                        automaticPoint: 80,
                        employeePoint: 90,
                        approvedPoint: 60,
                        contribution: 0,
                        taskImportanceLevel: 5,
                    }
                ],
                taskInformations: [] // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
            }],
            progress: 80,
        },


    ]);


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