const {
    ModuleConfiguration
} = require(`../../../models`);

const {
    connect
} = require(`../../../helpers/dbHelper`);

/**
 * Lấy tất cả cấu hình 
 * @param {*} portal : Tên ngắn của công ty
 */
exports.getAllConfiguration = async (portal) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).findOne();
    return {
        humanResourceConfig: config.humanResource,
        biddingConfig: config.bidding,
    };
}

/**
 * Lấy cấu hình chức năng quản lý nhân sự
 * @param {*} portal : Tên ngắn của công ty
 */
exports.getHumanResourceConfiguration = async (portal) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).findOne();
    return config.humanResource;
}

/**
 * Tạo cấu hình mặc định cho công ty (được gọi khi tạo công ty)
 * @param {*} portal : Tên ngắn của công ty
 */
exports.createHumanResourceConfiguration = async (portal) => {
    return await ModuleConfiguration(connect(DB_CONNECTION, portal)).create({
        humanResource: {
            contractNoticeTime: 15,
            timekeepingType: "shift",
            timekeepingByShift: {
                shift1Time: 4,
                shift2Time: 4,
                shift3Time: 4,
            },
        },
        bidding: {
            company: "Công ty công nghệ an toàn thông tin và truyền thông Vnist",
            address: "Tầng 10, số 266 Đội Cấn, quận Ba Đình, Hà Nội",
            email: "vnist@gmail.com",
            phone: "0987654345",
            taxCode: "564651658496456",
            representative: {
                name: "Nguyễn Văn An",
                role: "Giám đốc"
            },
            bank: {
                name: "SHB - chi nhánh Ba Đình",
                accountNumber: "98676745678"
            }
        },
    });
}

/**
 * Chỉnh sửa cấu hình chức năng quản lý nhân sự
 * @param {*} portal : Tên ngắn của công ty
 * @param {*} data : dữ liệu cấu hình chức năng quản lý nhân sự
 */
exports.editHumanResourceConfiguration = async (portal, data) => {
    let config = await ModuleConfiguration(connect(DB_CONNECTION, portal)).findOne();
    if (data.humanResource) {
        config.humanResource = data.humanResource
    }
    if (data.bidding) {
        config.bidding = data.bidding
    }
    await config.save();

    return {
        humanResourceConfig: config.humanResource,
        biddingConfig: config.bidding,
    };
};