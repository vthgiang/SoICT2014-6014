const mongoose = require("mongoose");
const { generateUniqueCode } = require("../../helpers/functionHelper");
const Schema = mongoose.Schema;

// Model quản lý thông tin của một công việc và liên kết với tài liệu, kết quả thực hiện công việc
const TaskSchema = new Schema(
    {
        code: {
            type: String,
            default: generateUniqueCode('DXT_')
        },
        process: {
            type: Schema.Types.ObjectId,
            ref: "TaskProcess",
        },
        codeInProcess: {
            type: String,
        },
        commentsInProcess: [
            {
                // Bình luận trong quy trình
                creator: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                description: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
                files: [
                    {
                        // Các file đi kèm comments
                        name: {
                            type: String,
                        },
                        url: {
                            type: String,
                        },
                    },
                ],
                comments: [
                    {
                        // Comments của comment
                        creator: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        description: {
                            type: String,
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                        updatedAt: {
                            type: Date,
                            default: Date.now,
                        },
                        files: [
                            {
                                // Các file đi kèm comments
                                name: {
                                    type: String,
                                },
                                url: {
                                    type: String,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
        numberOfDaysTaken: {
            type: Number,
        },
        followingTasks: [
            {
                task: {
                    type: Schema.Types.ObjectId,
                    replies: this,
                },
                link: {
                    type: String,
                },
                activated: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        preceedingTasks: [
            {
                task: {
                    type: Schema.Types.ObjectId,
                    replies: this,
                },
                link: {
                    type: String,
                },
            },
        ],
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: "OrganizationalUnit",
        },
        collaboratedWithOrganizationalUnits: [
            {
                organizationalUnit: {
                    type: Schema.Types.ObjectId,
                    ref: "OrganizationalUnit",
                },
                isAssigned: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        tags: [{
            type: String
        }],
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        priority: {
            //
            // 1: Thấp, 2: Trung Bình, 3: Tiêu chuẩn, 4: Cao, 5: Khẩn cấp
            // Low, Average, Standard, High, Urgent
            type: Number,
            default: 3,
        },
        isArchived: {
            // Lưu kho hay không. Task lưu kho sẽ mặc định ẩn đi cho gọn giao diện, vì số task có thể rất lớn. Khi cần xem lại, phải chọn filter phù hợp và search
            type: Boolean,
            default: false,
        },
        status: {
            // có 5 trạng thái công việc: Đang thực hiện, Chờ phê duyệt, Đã hoàn thành, Tạm hoãn, Bị hủy
            type: String,
            default: "inprocess",
            enum: [
                "inprocess",
                "wait_for_approval",
                "finished",
                "delayed",
                "canceled",
            ],
        },
        taskTemplate: {
            type: Schema.Types.ObjectId,
            ref: "TaskTemplate",
        },
        parent: {
            // Công việc liên quan
            type: Schema.Types.ObjectId,
            replies: this,
        },
        level: {
            // Không có cha -> level 1, có cha -> level 2, có ông -> level 3, ...
            type: Number,
        },
        inactiveEmployees: [
            {
                // Những người từng tham gia công việc nhưng không còn tham gia nữa
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        responsibleEmployees: [
            {
                //người thực hiện
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        accountableEmployees: [
            {
                //người phê duyệt
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        consultedEmployees: [
            {
                //người tư vấn
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        informedEmployees: [
            {
                //người quan sát
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        confirmedByEmployees: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        requestToCloseTask: {
            requestedBy: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            description: {
                type: String,
            },
            taskStatus: { // Các trạng thái như trạng thái công việc, trừ inprocess
                type: String,
            },
            requestStatus: { // 0: chưa yêu cầu, 1: đang yêu cầu, 2: từ chối, 3: đồng ý
                type: Number,
                default: 0,
            },
            responsibleUpdatedAt: {
                type: Date,
            },
            accountableUpdatedAt: {
                type: Date,
            },
        },
        evaluations: [
            {
                // Một công việc có thể trải dài nhiều tháng, mỗi tháng phải đánh giá một lần
                date: { // về sau không dùng. thay bởi các thuộc tính (evaluatingMonth, startDate, endDate) bên dưới
                    // Lưu ngày đánh giá. Khi muốn match công việc trong 1 KPI thì chỉ lấy tháng
                    type: Date,
                },
                evaluatingMonth: { // tháng đánh giá
                    type: Date,
                },
                startDate: { // đánh giá từ ngày
                    type: Date,
                },
                endDate: { // đánh giá đến ngày
                    type: Date,
                },
                progress: {
                    type: Number,
                    default: 0,
                },
                results: [
                    {
                        // Kết quả thực hiện công việc trong tháng đánh giá nói trên
                        employee: {
                            // Người được đánh giá
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        organizationalUnit: {
                            type: Schema.Types.ObjectId,
                            ref: "OrganizationalUnit",
                        },
                        role: {
                            // người thực hiện: responsible, người tư vấn: consulted, người phê duyệt: accountable
                            type: String,
                            enum: ["responsible", "consulted", "accountable"],
                        },
                        kpis: [
                            {
                                // Các kpis của người thực hiện A đó. Phải chọn kpis lúc tạo công việc, và sang đầu tháng mới, nếu công việc chưa kết thúc thì phải chọn lại.
                                type: Schema.Types.ObjectId,
                                ref: "EmployeeKpi",
                            },
                        ],
                        automaticPoint: {
                            // Điểm hệ thống đánh giá
                            type: Number,
                            default: 0,
                        },
                        employeePoint: {
                            // Điểm tự đánh giá
                            type: Number,
                            default: 0,
                        },
                        approvedPoint: {
                            // Điểm được phê duyệt
                            type: Number,
                            default: 0,
                        },
                        contribution: {
                            // % Đóng góp: 0->100
                            type: Number,
                        },
                        hoursSpent: {
                            type: Number,
                        },
                        taskImportanceLevel: {
                            // Mức độ quan trọng của công việc với người được đánh giá, từ 0-10, dùng trong công thức tính điểm KPI
                            type: Number, // Suggest tự động dựa theo lần đánh giá trước đó (nếu có), theo thời gian thực hiện, độ quan trọng của công việc, % đóng góp
                            default: -1,
                        },
                        valueDelivery: {
                            // Giá trị mang lại của công việc và chi phí bỏ ra để thực hiện công việc
                            value: { // Giá trị mang lại
                                type: Number,
                            },
                            valueUnit: { // Đơn vị giá trị mang lại
                                type: String,
                            },
                            cost: { // Chi phí bỏ ra
                                type: Number,
                            },
                            costUnit: { // Đơn vị tính chi phí bỏ ra
                                type: String,
                            }
                        }
                    },
                ],
                taskInformations: [
                    {
                        // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                        code: {
                            // Mã thuộc tính công việc dùng trong công thức (nếu công việc theo mẫu)
                            type: String,
                        },
                        name: {
                            // Tên thuộc tính công việc (bao gồm progress + point + các thuộc tính khác nếu như đây là công việc theo mẫu)
                            type: String,
                        },
                        filledByAccountableEmployeesOnly: {
                            // Chỉ người phê duyệt được điền?
                            type: Boolean,
                            default: true,
                        },
                        extra: {
                            // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
                            type: String,
                        },
                        type: {
                            type: String,
                            enum: [
                                "text",
                                "boolean",
                                "date",
                                "number",
                                "set_of_values",
                            ],
                        },
                        value: {
                            // Giá trị tương ứng của các thuộc tính (tại thời điểm đánh giá)
                            type: Schema.Types.Mixed,
                        },
                    },
                ],
            },
        ],
        overallEvaluation: {
            automaticPoint: {
                // Điểm hệ thống đánh giá cho task
                type: Number,
                default: null,
            },
            responsibleEmployees: [
                {
                    employee: {
                        // Người đánh giá
                        type: Schema.Types.ObjectId,
                        ref: "User",
                    },
                    automaticPoint: {
                        // Điểm hệ thống đánh giá cho người thực hiện
                        type: Number,
                        default: null,
                    },
                    employeePoint: {
                        // Điểm người thực hiện tự đánh giá bản thân
                        type: Number,
                        default: null,
                    },
                    accountablePoint: {
                        // Điểm người phê duyệt đánh giá cho người thực hiện
                        type: Number,
                        default: null,
                    },
                    contribution: {
                        // % Đóng góp: 0->100
                        type: Number,
                    },
                    hoursSpent: {
                        type: Number,
                    },
                }
            ],
            accountableEmployees: [
                {
                    employee: {
                        // Người đánh giá
                        type: Schema.Types.ObjectId,
                        ref: "User",
                    },
                    automaticPoint: {
                        // Điểm hệ thống đánh giá cho người phê duyệt
                        type: Number,
                        default: null,
                    },
                    employeePoint: {
                        // Điểm người phê duyệt tự đánh giá bản thân
                        type: Number,
                        default: null,
                    },
                    contribution: {
                        // % Đóng góp: 0->100
                        type: Number,
                    },
                    hoursSpent: {
                        type: Number,
                    },
                }
            ],
            taskInformations: {
                // Lưu lại lịch sử các giá trị của thuộc tính công việc trong mỗi lần đánh giá
                code: {
                    // Mã thuộc tính công việc dùng trong công thức (nếu công việc theo mẫu)
                    type: String,
                },
                name: {
                    // Tên thuộc tính công việc (bao gồm progress + point + các thuộc tính khác nếu như đây là công việc theo mẫu)
                    type: String,
                },
                filledByAccountableEmployeesOnly: {
                    // Chỉ người phê duyệt được điền?
                    type: Boolean,
                    default: true,
                },
                extra: {
                    // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
                    type: String,
                },
                type: {
                    type: String,
                    enum: [
                        "text",
                        "boolean",
                        "date",
                        "number",
                        "set_of_values",
                    ],
                },
                value: {
                    // Giá trị tương ứng của các thuộc tính (tại thời điểm đánh giá)
                    type: Schema.Types.Mixed,
                },
            },
        },
        formula: {
            type: String,
            default:
                "progress / (daysUsed / totalDays) - (10 - averageActionRating) * 10",
        },
        progress: {
            // % Hoàn thành thành công việc
            type: Number,
            default: 0,
        },
        point: {
            type: Number,
            default: -1,
        },
        documents: [
            {
                // Các files đi kèm với công việc
                files: [
                    {
                        name: {
                            type: String,
                        },
                        url: {
                            type: String,
                        },
                    },
                ],
                description: {
                    type: String,
                },
                creator: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                isOutput: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        hoursSpentOnTask: {
            totalHoursSpent: {
                type: Number,
                default: 0,
            },
            contributions: [
                {
                    employee: {
                        type: Schema.Types.ObjectId,
                        ref: "User",
                    },
                    hoursSpent: {
                        type: Number,
                    },
                },
            ],
        },
        timesheetLogs: [
            {
                creator: {
                    // Người thực hiện nào tiến hành bấm giờ
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                startedAt: {
                    // Lưu dạng miliseconds. Thời gian khi người dùng nhất nút bắt đầu bấm giờ
                    type: Date,
                },
                stoppedAt: {
                    // Lưu dạng miliseconds. Thời gian kết thúc bấm giờ. Khi stoppedAt-startedAt quá 4 tiếng, hỏi lại người dùng stop chính xác vào lúc nào và cập nhật lại stoppedAt.
                    type: Date,
                },
                description: {
                    // Mô tả ngắn gọn việc đã làm khi log
                    type: String,
                },
                duration: {
                    type: Number,
                },
                autoStopped: { // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
                    type: Number,
                    default: 1,
                    enum: [1, 2, 3],
                },
                acceptLog: {
                    type: Boolean,
                    default: true
                }
            },
        ],

        taskInformations: [
            {
                // Khi tạo công việc theo mẫu, các giá trị này sẽ được copy từ mẫu công việc sang
                code: {
                    // Mã thuộc tính công việc dùng trong công thức
                    type: String,
                    required: true,
                },
                name: {
                    // Tên thuộc tính công việc
                    type: String,
                },
                description: {
                    type: String,
                },
                extra: {
                    // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
                    type: String,
                },
                filledByAccountableEmployeesOnly: {
                    // Chỉ người phê duyệt được điền?
                    type: Boolean,
                    default: true,
                },
                type: {
                    type: String,
                    enum: [
                        "text",
                        "boolean",
                        "date",
                        "number",
                        "set_of_values",
                    ],
                },
                value: {
                    type: Schema.Types.Mixed,
                },
                isOutput: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        taskActions: [
            {
                // Khi task theo tempate nào đó, sẽ copy hết actions trong template vào đây
                creator: {
                    // Trường này không bắt buộc. Khi người thực hiện task (loại task theo teamplate) xác nhận xong action thì mới điền id người đó vào trường này
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                name: {
                    type: String,
                },
                description: {
                    type: String,
                },
                mandatory: {
                    // Hoạt động này bắt buộc hay không?
                    type: Boolean,
                    default: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
                rating: {
                    // -1: chưa đánh giá, 0-10: tùy mức độ tốt
                    type: Number,
                    default: -1,
                },
                actionImportanceLevel: {
                    // 0-10: tùy mức độ quan trọng
                    type: Number,
                    default: 10,
                },
                files: [
                    {
                        // Các files đi kèm actions
                        name: {
                            type: String,
                        },
                        url: {
                            type: String,
                        },
                    },
                ],
                evaluations: [
                    {
                        // Đánh giá actions (Dù là người quản lý, phê duyệt, tư vấn, ai cũng có thể đánh giá, nhưng chỉ tính đánh gía của người phê duyệt)
                        creator: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        role: {
                            type: String // đánh giá với vai trò ntn (phê duyệt, tư vấn, quan sát, thiết)
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                        updatedAt: {
                            type: Date,
                            default: Date.now,
                        },
                        rating: {
                            // -1: chưa đánh giá, 0-10: tùy mức độ tốt
                            type: Number,
                            default: -1,
                        },
                        actionImportanceLevel: {
                            // 0-10: tùy mức độ quan trọng
                            type: Number,
                            default: 10,
                        },
                    },
                ],
                comments: [
                    {
                        // Comments của action
                        creator: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        description: {
                            type: String,
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                        updatedAt: {
                            type: Date,
                            default: Date.now,
                        },
                        files: [
                            {
                                // Các file đi kèm comments
                                name: {
                                    type: String,
                                },
                                url: {
                                    type: String,
                                },
                            },
                        ],
                    },
                ],
                timesheetLogs: [ // Lưu thời gian bấm giờ của một hoạt động
                    {
                        creator: {
                            // Người thực hiện nào tiến hành bấm giờ
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        startedAt: {
                            // Lưu dạng miliseconds. Thời gian khi người dùng nhất nút bắt đầu bấm giờ
                            type: Date,
                        },
                        stoppedAt: {
                            // Lưu dạng miliseconds. Thời gian kết thúc bấm giờ. Khi stoppedAt-startedAt quá 4 tiếng, hỏi lại người dùng stop chính xác vào lúc nào và cập nhật lại stoppedAt.
                            type: Date,
                        },
                        description: {
                            // Mô tả ngắn gọn việc đã làm khi log
                            type: String,
                        },
                        duration: {
                            type: Number,
                        },
                        autoStopped: { // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
                            type: Number,
                            default: 1,
                            enum: [1, 2, 3],
                        },
                        acceptLog: {
                            type: Boolean,
                            default: true
                        }
                    },
                ],
            },
        ],
        taskComments: [
            {
                // Trao đổi trong tasks
                creator: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                description: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
                files: [
                    {
                        // Các file đi kèm comments
                        name: {
                            type: String,
                        },
                        url: {
                            type: String,
                        },
                    },
                ],
                comments: [
                    {
                        // Comments của comment
                        creator: {
                            type: Schema.Types.ObjectId,
                            ref: "User",
                        },
                        description: {
                            type: String,
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                        updatedAt: {
                            type: Date,
                            default: Date.now,
                        },
                        files: [
                            {
                                // Các file đi kèm comments
                                name: {
                                    type: String,
                                },
                                url: {
                                    type: String,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
        logs: [
            {
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                creator: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                title: {
                    type: String,
                },
                description: {
                    type: String,
                },
            },
        ],

        taskProject: { //id dự án công việc thuộc về
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },
        //tên phase mà task thuộc về
        taskPhase: {
            type: Schema.Types.ObjectId,
            ref: 'ProjectPhase'
        },
        //thời gian ước lượng thông thường của task
        estimateNormalTime: {
            type: Number,
        },
        //thời gian ước lượng ít nhất để hoàn thành task
        estimateOptimisticTime: {
            type: Number,
        },
        //chi phí ước lượng thông thường của task
        estimateNormalCost: {
            type: Number,
        },
        //chi phí ước lượng nhiều nhất có thể cho phép của task
        estimateMaxCost: {
            type: Number,
        },
        //chi phí thực cho task đó
        actualCost: {
            type: Number,
        },
        //thời điểm thực kết thúc task đó
        actualEndDate: {
            type: Date,
        },
        //thời điểm thực bắt đầu task đó
        actualStartDate: {
            type: Date,
        },
        // Danh sách thành viên tham gia công việc + lương tháng + trọng số thành viên trong công việc
        actorsWithSalary: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                salary: {
                    type: Number,
                },
                // Số lớn hơn 1
                weight: {
                    type: Number,
                },
                actualCost: {
                    type: Number,
                },
            },
        ],
        // Ước lượng chi phí tài sản
        estimateAssetCost: {
            type: Number,
        },
        // Trọng số tổng dành cho Thành viên Thực hiện - Số lớn hơn 1
        totalResWeight: {
            type: Number,
        },
        isFromCPM: {
            type: Boolean,
        },
        formulaProjectTask: {
            type: String,
            default:
                "taskTimePoint + taskQualityPoint + taskCostPoint",
        },
        formulaProjectMember: {
            type: String,
            default:
                "memberTimePoint + memberQualityPoint + memberCostPoint + memberTimedistributionPoint",
        },
        taskWeight: {
            // Số bé hơn 1
            timeWeight: {
                type: Number,
                default: 1 / 3,
            },
            // Số bé hơn 1
            qualityWeight: {
                type: Number,
                default: 1 / 3,
            },
            // Số bé hơn 1
            costWeight: {
                type: Number,
                default: 1 / 3,
            },
        },
        memberWeight: {
            // Số bé hơn 1
            timeWeight: {
                type: Number,
                default: 0.25,
            },
            // Số bé hơn 1
            qualityWeight: {
                type: Number,
                default: 0.25,
            },
            // Số bé hơn 1
            costWeight: {
                type: Number,
                default: 0.25,
            },
            // Số bé hơn 1
            timedistributionWeight: {
                type: Number,
                default: 0.25,
            },
        },
    },
    {
        timestamps: true,
    }
);

TaskSchema.index({ tags: "text" });

module.exports = (db) => {
    if (!db.models.Task) {
        return db.model("Task", TaskSchema);
    }
    return db.models.Task;
};

/*
HƯỚNG DẪN:
1. Phân quyền cho các trường được edit:
Mô tả công việc: Thực hiện + quản lý
Phân định trách nhiệm: Quản lý
Liên kết mục tiêu: Người thực hiện
Ngày bắt đầu, kết thúc: Quản lý
Mức độ hoàn thành: Thực hiện + Quản lý
Thông tin công việc: Thực hiện + Quản lý
Thời gian quá hạn, thời gian làm việc, và các trường tự động khác: không ai được sửa

1. Thiết kế giao diện: tạo 3 component
Xem thông tin chung
Edit cho Quản lý
Edit cho Người thực hiện


3. Đánh giá điểm cho các vài trò
Điểm công việc được tính tự động (chưa kết thúc => mặc định là -1)
Có ba loại điểm: automaticPoint, employeePoint, approvedPoint lần lượt cho các đối tượng như sau:
Điểm cho người thực hiện: điểm công việc tự động + tự nhận + quản lý chấm. Ở đây sẽ suggest cho quản lý chấm điểm là (điểm công việc tự động + điểm thực hiện tự nhận)/2
Điểm tư vấn: điểm công việc tự động + tự nhận + quản lý chấm. Ở đây sẽ suggest cho quản lý chấm điểm là (điểm công việc tự động + điểm tư vấn tự nhận)/2
Điểm quản lý: điểm công việc tự động + tự nhận + (điểm công việc + điểm tự nhận)/2. Lưu ý approvedPoint của quản lý là (điểm công việc + điểm quản lý tự nhận)/2
Điểm quan sát: không có
Lưu ý: Tất cả các điểm đều được công khai
 */
