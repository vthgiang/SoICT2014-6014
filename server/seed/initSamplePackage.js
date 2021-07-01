const mongoose = require("mongoose");

const {
    Employee,
    Major,
    CareerPosition,
    CareerField,
    CareerAction,
} = require('../models');

require('dotenv').config();

const initSampleCompanyDB = async () => {
    console.log("Init sample company database, ...");

    /**
     * 1. Tạo kết nối đến csdl của hệ thống và công ty VNIST
     */

    let connectOptions = process.env.DB_AUTHENTICATION === 'true' ?
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    const vnistDB = mongoose.createConnection(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/vnist`, connectOptions);
    if (!vnistDB) throw ('DB vnist cannot connect');
    console.log("DB vnist connected");

    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        
        if (!db.models.Employee) Employee(db);
        if (!db.models.Major) Major(db);
        if (!db.models.CareerPosition) CareerPosition(db);

       
    }

    initModels(vnistDB);

    console.log("Tạo dữ liệu cho gán nhãn chuyên ngành");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        Khởi tạo thông tin chuyên ngành tương đương
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo thông tin chuyên ngành tương đương");

    var majors = await Major(vnistDB).insertMany([
        {
            name: "Máy tính và công nghệ thông tin",
            code: "748",
            group: [{
                name: "Máy tính",
                code: "74801",
                specialized: [{
                    name: "Khoa học máy tính",
                    code: "7480101",
                    type: 1,
                }, {
                    name: "Mạng máy tính và truyền thông dữ liệu",
                    code: "7480102",
                    type: 1,
                }, {
                    name: "Kỹ thuật phần mềm",
                    code: "7480103",
                    type: 1,
                }, {
                    name: "Hệ thống thông tin",
                    code: "7480104",
                    type: 1,
                }, {
                    name: "Kỹ thuật máy tính",
                    code: "7480106",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật máy tính",
                    code: "7480108",
                    type: 1,
                }]
            }, {
                name: "Công nghệ thông tin",
                code: "78402",
                specialized: [{
                    name: "Công nghệ thông tin",
                    code: "7840201",
                    type: 1,
                }, {
                    name: "An toàn thông tin",
                    code: "7840202",
                    type: 1,
                }]
            }]
        }, {
            name: "Công nghệ kỹ thuật",
            code: "751",
            group: [{
                name: "Công nghệ kỹ thuật điện, điện tử và viễn thông",
                code: "75103",
                specialized: [{
                    name: "Công nghệ kỹ thuật điện, điện tử",
                    code: "7510301",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật điện tử - viễn thông",
                    code: "7510302",
                    type: 1,
                }, {
                    name: "Công nghệ kỹ thuật điều khiển và tự động hóa",
                    code: "7510303",
                    type: 1,
                }]
            }]
        }, {
            name: "Kỹ thuật",
            code: "752",
            group: [{
                name: "Kỹ thuật điện, điện tử và viễn thông",
                code: "75202",
                specialized: [{
                    name: "Kỹ thuật ra đa- dẫn đường",
                    code: "7520204",
                    type: 1,
                }, {
                    name: "Kỹ thuật điện tử -  viễn thông",
                    code: "7520207",
                    type: 1,
                }]
            }, {
                name: "Vật lý kỹ thuật",
                code: "75204",
                specialized: [{
                    name: "Vật lý kỹ thuật",
                    code: "7520401",
                    type: 1,
                }, {
                    name: "Kỹ thuật hạt nhân",
                    code: "7520402",
                    type: 1,
                }]
            }]
        }
    ]);

    //END
    console.log("Tạo dữ liệu cho gán nhãn chuyên ngành");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        Khởi tạo thông tin công việc tương đương
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("=====Khởi tạo thông tin công việc tương đương=====");

    /**
     * =======================BEGIN CAREER ACTION========================
     * =======================BEGIN CAREER ACTION========================
     */

    console.log('1. Khởi tạo hoạt động công việc');
    //END


    var actionLabel = await CareerAction(vnistDB).insertMany([
        { // 00
            name: "Quản trị",
            code: "quan_tri",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 01
            name: "Bảo hành",
            code: "bao_hanh",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 02
            name: "Bao trì",
            code: "bao_tri",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 03
            name: "Tư vấn",
            code: "tu_van",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { //04
            name: "Đánh giá",
            code: "danh_gia",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { //05
            name: "Thẩm định",
            code: "tham_dinh",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { //06
            name: "Xây dựng",
            code: "xay_dung",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { //07
            name: "Bảo đảm",
            code: "bao_dam",
            package: [],
            detail: [],
            isLabel: 1,
        },

        { //08
            name: "Phân phối",
            code: "phan_phoi",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { //09
            name: "Cung ứng",
            code: "cung_ung",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { //10
            name: "Lập trình",
            code: "lap_trinh",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 11
            name: "Phát triển",
            code: "phat_trien",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 12
            name: "Thiết kế",
            code: "thiet_ke",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 13
            name: "Phân tích",
            code: "phan_tich",
            package: [],
            detail: [],
            isLabel: 1,
        },

        { // 14
            name: "Kiểm thử",
            code: "kiem_thu",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 15
            name: "Kiểm định",
            code: "kiem_dinh",
            package: [],
            detail: [],
            isLabel: 1,
        },

        { //16
            name: "Kiểm tra",
            code: "kiem_tra",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 17
            name: "Giám sát",
            code: "giam_sat",
            package: [],
            detail: [],
            isLabel: 1,
        },

        { // 18
            name: "Giảng dạy",
            code: "giang_day",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { //19
            name: "Nghiên cứu",
            code: "nghien_cuu",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { //20
            name: "Đào tạo",
            code: "dao_tao",
            package: [],
            detail: [],
            isLabel: 1,

        },

        { // 21
            name: "Soạn thảo",
            code: "soan_thao",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 22
            name: "Chấm bài",
            code: "cham_bai",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 23
            name: "Quản lý",
            code: "quan_ly",
            package: [],
            detail: [],
            isLabel: 1,

        },

        { // 24
            name: "Xử lý",
            code: "xu_ly",
            package: [],
            detail: [],
            isLabel: 1,
        },
        { // 25
            name: "Hỗ trợ",
            code: "ho_tro",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 26
            name: "Phối hợp",
            code: "phoi_hop",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 27
            name: "Vận hành",
            code: "van_hanh",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 28
            name: "Triển khai",
            code: "trien_khai",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 29
            name: "Thu thập",
            code: "thu_thap",
            package: [],
            detail: [],
            isLabel: 1,
        },


        { // 30
            name: "Báo cáo",
            code: "bao_cao",
            package: [],
            detail: [],
            isLabel: 1,
        },

    ])

    var careerAction = await CareerAction(vnistDB).insertMany([
        { // 00
            name: "Quản trị, bảo hành, bảo trì hoạt động của phần mềm và hệ thống thông tin",
            code: "itpm_01",
            package: ["Quản trị, bảo trì hoạt động của hệ thống thông tin"],
            label: [
                actionLabel[0]._id,
                actionLabel[1]._id,
                actionLabel[2]._id,
            ],
            detail: [
                { label: actionLabel[0]._id },
                { label: actionLabel[1]._id },
                { label: actionLabel[2]._id },
            ]
        },
        { // 01
            name: "Tư vấn, đánh giá, thẩm định chất lượng phần mềm",
            code: "itpm_02",
            package: ["Đánh giá kiểm định chất lượng phần mềm"],
            label: [
                actionLabel[3]._id,
                actionLabel[4]._id,
                actionLabel[5]._id,
            ],
            detail: []
        },
        { // 02
            name: "Tư vấn, xây dựng dự án phần mềm",
            code: "itpm_03",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[3]._id,
                actionLabel[6]._id,
            ],
            detail: []
        },
        { // 03
            name: "Bảo đảm an toàn, an ninh cho sản phẩm phần mềm, hệ thống thông tin",
            code: "itpm_04",
            package: ["Quản trị, bảo trì hoạt động của hệ thống thông tin"],
            label: [
                actionLabel[7]._id,
            ],
            detail: []
        },
        { // 04
            name: "Phân phối, cung ứng sản phẩm phần mềm",
            code: "itpm_05",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[8]._id,
                actionLabel[9]._id,
            ],
            detail: []
        },
        { // 05
            name: "Lập trình phát triển phần mềm",
            code: "itpm_06",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[10]._id,
                actionLabel[11]._id,
                actionLabel[6]._id,
            ],
            detail: []
        },
        { // 06
            name: "Phân tích, thiết kế phần mềm",
            code: "itpm_07",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[12]._id,
                actionLabel[13]._id,
            ],
            detail: []
        },
        { // 07
            name: "Kiểm thử, kiểm định phần mềm",
            code: "itpm_08",
            package: ["Đánh giá kiểm định chất lượng phần mềm"],
            label: [
                actionLabel[14]._id,
                actionLabel[15]._id,
            ],
            detail: []
        },
        { // 08
            name: "kiểm tra, đánh giá, giám sát an toàn thông tin mạng;",
            code: "itpm_09",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            label: [
                actionLabel[16]._id,
                actionLabel[4]._id,
                actionLabel[17]._id,
            ],
            detail: []
        },
        { // 09
            name: "Giảng dạy học tập",
            code: "itpm_10",
            package: ["Giảng dạy IT"],
            label: [
                actionLabel[18]._id,
                actionLabel[19]._id,
                actionLabel[20]._id,
            ],
            detail: []
        },
        { // 10
            name: "Quản lý, soạn thảo, chấm bài",
            code: "itpm_11",
            package: ["Giảng dạy IT"],
            label: [
                actionLabel[21]._id,
                actionLabel[22]._id,
                actionLabel[23]._id,
            ],
            detail: []
        },
        { // 11
            name: "Thực hiện việc xử lý các yêu cầu hỗ trợ CNTT theo quy trình, hướng dẫn",
            code: "itpm_12",
            package: ["Hỗ trợ sử dụng sản phẩm"],
            label: [
                actionLabel[24]._id,
                actionLabel[25]._id,
            ],
            detail: []
        },
        { // 12
            name: "Phối hợp, giám sát và đốc thúc các đơn vị chức năng trong quá trình xử lý các yêu cầu hỗ trợ CNTT đảm bảo các SLA đã được cam kết",
            code: "itpm_13",
            package: ["Hỗ trợ sử dụng sản phẩm"],
            label: [
                actionLabel[26]._id,
                actionLabel[17]._id,
            ],
            detail: []
        },
        { // 13
            name: "Vận hành các hệ thống giám sát an ninh mạng.",
            code: "itpm_14",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            label: [
                actionLabel[27]._id,
            ],
            detail: []
        },
        { // 14
            name: "Tham gia triển khai các dự án cho Công ty",
            code: "itpm_15",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            label: [
                actionLabel[28]._id,
            ],
            detail: []
        },
        { // 15
            name: "Thu thập dữ liệu phục vụ nhu cầu sử dụng thiết kế ứng dụng phần mềm",
            code: "itpm_16",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[29]._id,
            ],
            detail: []
        },
        { // 16
            name: "Nghiên cứu và áp dụng các công nghệ mới",
            code: "itpm_17",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            label: [
                actionLabel[19]._id,
                actionLabel[30]._id,
            ],
            detail: []
        },
    ])


    /**
     * =======================END CAREER ACTION========================
     * =======================END CAREER ACTION========================
     */


    /**
     * ======================BEGIN POSITION===========================
     * ======================BEGIN POSITION===========================
     */


    console.log('2. Khởi tạo vị trí công việc');
    var careerPosition = await CareerPosition(vnistDB).insertMany([
        { //0
            name: "Giảng viên",
            code: "giang_vien",
            package: ["Giảng dạy IT"],
            description: [{
                action: careerAction[9]._id,
                multi: 1,
            }, {
                action: careerAction[10]._id,
                multi: 1,
            }]
        }, { //1
            name: "Trợ giảng",
            code: "tro_giang",
            package: ["Giảng dạy IT"],
            description: [{
                action: careerAction[9]._id,
                multi: 1,
            }, {
                action: careerAction[10]._id,
                multi: 1,
            }]
        },
        { //2
            name: "IT Teacher",
            code: "it_teacher",
            package: ["Giảng dạy IT"],
            description: [{
                action: careerAction[9]._id,
                multi: 1,
            }, {
                action: careerAction[10]._id,
                multi: 1,
            }]
        },
        { //3
            name: "Kỹ thuật viên",
            code: "ky_thuat_vien",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            description: [{
                action: careerAction[8]._id,
                multi: 1,
            }, {
                action: careerAction[9]._id,
                multi: 1,
            },]
        }, { //4
            name: "Chuyên viên hỗ trợ người dùng",
            code: "chuyen_vien_ho_tro_nguoi_dung",
            package: ["Hỗ trợ sử dụng sản phẩm"],
            description: [{
                action: careerAction[12]._id,
            }, {
                action: careerAction[11]._id,
            }]
        }, { //5
            name: "Chuyên Viên Quản Trị và Bảo Trì Ứng Dụng",
            code: "chuyen_vien_quan_tri_bao_tri",
            package: ["Quản trị, bảo trì hoạt động của hệ thống thông tin"],
            description: [{
                action: careerAction[0]._id,
            }]
        },
        { //6
            name: "IT Support - Kỹ Sư Máy Tính/ Mạng",
            code: "it_support",
            package: ["Hỗ trợ sử dụng sản phẩm", "Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                action: careerAction[2]._id,
            }, {
                action: careerAction[11]._id,
            }]
        },
        {//7
            name: "Chuyên Viên Phân Tích Sự Kiện Bảo Mật",
            code: "chuyen_vien_phan_tich_su_kien_bao_mat",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            description: [{
                // name: "Vận hành các hệ thống giám sát an ninh mạng.",
                // code: ["van_hanh"],
                // type: 1,
                action: careerAction[13]._id
            },
            {
                // name: "Theo dõi, kiểm tra, phân loại, đánh giá và cảnh báo mức độ nguy hiểm các cảnh báo phát sinh từ hệ thống giám sát an ninh mạng.",
                // code: ["theo_doi", "kiem_tra", "danh_gia", "phan_loai"],
                // type: 1,
                action: careerAction[8]._id,
            }]
        },
        {//8
            name: "Chuyên Viên Bảo Mật Ứng Dụng",
            code: "chuyen_vien_bao_mat",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            description: [{
                // name: "Vận hành các hệ thống giám sát an ninh mạng.",
                // code: ["van_hanh"],
                // type: 1,
                action: careerAction[13]._id,
            }, {
                // name: "Theo dõi, kiểm tra, phân loại, đánh giá và cảnh báo mức độ nguy hiểm các cảnh báo phát sinh từ hệ thống giám sát an ninh mạng.",
                // code: ["theo_doi", "kiem_tra", "danh_gia", "phan_loai"],
                // type: 1,
                action: careerAction[8]._id,
            },
                // {
                //     name: "Tham gia quá trình nghiên cứu, xây dựng kế hoạch triển khai và thực hiện các nội dung công việc liên quan đến phân tích các sự kiện bảo mật CNTT.",
                //     code: ["nghien_cuu"],
                //     type: 1,
                // }
            ]
        },
        {//9
            name: "Kỹ Sư Bảo Mật",
            code: "ky_su_bao_mat",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            description: [{
                // name: "Thẩm định ATTT các hệ thống CNTT trước khi triển khai.",
                // code: ["tham_dinh"],
                // type: 1,
                action: careerAction[1]._id,
            }, {
                // name: "Tham gia triển khai các dự án về ATTT cho Công ty",
                // code: ["trien_khai"],
                // type: 1,
                action: careerAction[14]._id,
            }, {
                // name: "Thực hiện giám sát, quản lý các hệ thống về ATTT như hệ thống Firewall, IDS/IPS, Hệ thống Quản trị bảo mật Endpoint tập trung, hệ thống phòng chống thất thoát dữ liệu DLP",
                // code: ["giam_sat", "quan_ly"],
                // type: 1,
                action: careerAction[8]._id,
            }]
        },
        // {
        //     name: "5G/ Lte System Engineer",
        //     code: "system_engineer",
        //     description: [{
        //         name: "Tích hợp hệ thống 5G / LTE / HSPA / Wi-Fi, hỗ trợ kiểm tra và gỡ lỗi, trình diễn và thử nghiệm thực địa qua mạng (OTA) các tính năng mới",
        //         code: ["tich_hop", "kiem_tra", "go_loi"],
        //         type: 1,
        //     }, {
        //         name: "Nghiên cứu hiệu suất trong phòng thí nghiệm, biên soạn sách trắng và tài liệu về các tiêu chuẩn và công nghệ không dây mới.",
        //         code: ["nghien_cuu", "bien_soan"],
        //         type: 1,
        //     }]
        // },
        {//10
            name: "Chuyên viên IT Mạng",
            code: "chuyen_vien_it_mang",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin", "Quản trị, bảo trì hoạt động của hệ thống thông tin"],
            description: [{
                // name: "Giám sát và báo cáo tình trạng hoạt động hằng ngày của hệ thống Core network (healthy daily checklist).",
                // code: ["giam_sat", "bao_cao"],
                // type: 1,
                action: careerAction[8]._id,
            }, {
                // name: "Quản trị, đảm bảo kết nối internet cho các dịch vụ của công ty (phần mềm, dịch vụ số hóa, web, …",
                // code: ["quan_tri"],
                // type: 1,
                action: careerAction[0]._id
            }]
        },
        {//11
            name: "Android Engineer",
            code: "android_engineer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Nghiên cứu và áp dụng các công nghệ mới.",
                // code: ["nghien_cuu", "bao_cao"],
                // type: 1,
                action: careerAction[16]._id
            }, , {
                // name: "Tham gia phân tích requirement, thiết kế hệ thống",
                // code: ["phan_tich", "thiet_ke"],
                // type: 1,
                action: careerAction[6]._id,
            }]
        },
        {//12
            name: "iOS Engineer",
            code: "ios_engineer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Nghiên cứu và áp dụng các công nghệ mới.",
                // code: ["nghien_cuu", "bao_cao"],
                // type: 1,
                action: careerAction[16]._id
            }, , {
                // name: "Tham gia phân tích requirement, thiết kế hệ thống",
                // code: ["phan_tich", "thiet_ke"],
                // type: 1,
                action: careerAction[6]._id,
            }]
        },
        // {
        //     name: "Web Developer",
        //     code: "web_developer",
        //     package: ["Thiết kế xây dựng triển khai phần mềm"],
        //     description: [{
        //         name: "Lập trình ứng dụng web",
        //         code: ["lap_trinh"],
        //         type: 1,
        //     }]
        // },
        {//13
            name: "Back-End Engineer",
            code: "be_engineer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Thiết kế và phát triển các thành phần / dịch vụ vi mô hiệu suất cao cho một loạt các dự án chuyển đổi kỹ thuật số.",
                // code: ["thiet_ke", "phat_trien"],
                // type: 1,
                action: careerAction[6]._id
            },
                // {
                // name: "Làm việc với quy trình CI / CD của chúng tôi và đưa ra đề xuất để cải thiện quy trình đó",
                // code: ["cai_thien"],
                // type: 1,
                // }
            ]
        },
        {//14
            name: "Front-End Engineer",
            code: "fe_engineer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Thực hiện UI của ứng dụng web hiện đại, giàu tương tác với yêu cầu cao về chất lượng và độ tin cậy",
                // code: ["thiet_ke"],
                // type: 1,
                action: careerAction[6]._id
            }, {
                // name: "Nghiên cứu và lập luận về phương pháp hoặc công nghệ thích hợp để giải quyết vấn đề",
                // code: ["nghien_cuu", "lap_luan"],
                // type: 1,
                action: careerAction[16]._id,
            }]
        },
        // {
        //     name: "Unity Programmer",
        //     code: "unity_programer",
        //     package: ["Thiết kế xây dựng triển khai phần mềm"],
        //     description: [{
        //         name: "Tham gia phát triển các dự án mini games trên nền tảng Unity;",
        //         code: ["phat_trien"],
        //         type: 1,
        //     }, {
        //         name: "Lập trình, debug và tối ưu hóa code để triển khai các ý tưởng gameplay vào game prototype và hoàn thiện prototype trước khi phát hành",
        //         code: ["lap_trinh", "debug", "toi_uu"],
        //         type: 1,
        //     },]
        // },
        { //15
            name: "Business Analyst",
            code: "business_analyst",
            package: ["Đánh giá kiểm định chất lượng phần mềm"],
            description: [{
                // name: "Khảo sát, thu thập yêu cầu về dự án, tìm hiểu các quy trình nghiệp vụ cần thực hiện",
                // code: ["khao_sat", "thu_thap"],
                // type: 1,
                action: careerAction[7]._id
            }, {
                // name: "Hỗ trợ lập kế hoạch, đánh giá, kiểm tra chất lượng sản phẩm phần mềm",
                // code: ["lap_ke_hoach", "danh_gia", "kiem_tra"],
                // type: 1,
                action: careerAction[1]._id
            },]
        },
        {//16
            name: "System Admin Engineer",
            code: "system_admin_engineer",
            package: ["Kiểm tra đánh giá giám sát hệ thống an toàn thông tin"],
            description: [{
                // name: "Giám sát, phòng chống, bảo mật, bảo trì, backup, restore, thường xuyên kiểm tra tình trạng server/storage & các lỗ hổng xuất hiện trên hệ thống máy chủ.",
                // code: ["giam_sat", "phong_chong", "bao_tri", "kiem_tra"],
                // type: 1,
                action: careerAction[8]._id
            }, {
                // name: "Vận hành hệ thống máy chủ, hệ thống lưu trữ, đảm bảo hoạt động ổn định suốt 24h.",
                // code: ["van_hanh",],
                // type: 1,
                action: careerAction[13]._id,
            },
                // {
                //     name: "Phụ trách thiết bị hạ tầng server, tháo ráp, cài đặt, di chuyển sang Data Center khi cần thiết.",
                //     code: ["thao_rap", "cai_dat"],
                //     type: 1,
                // }, {
                //     name: "Thiết lập, cập nhật và duy trì các qui định, chính sách về sử dụng hệ thống cũng như thiết bị CNTT khác trong hệ thống.",
                //     code: ["thiet_lap", "cap_nhat"],
                //     type: 1,
                // },
            ]
        },
        {//17
            name: "Data Analyst",
            code: "data_analyst",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Thu thập các yêu cầu, tạo câu chuyện của người dùng và xác định các tiêu chí chấp nhận, ghi lại những yêu cầu này.",
                // code: ["thu_thap", "luu_tru"],
                // type: 1,
                action: careerAction[15]._id,
            }, {
                // name: "Thử nghiệm xây dựng để đảm bảo sự phù hợp với các tiêu chí chấp nhận.",
                // code: ["thu_nghiem", "xay_dung"],
                // type: 1,
                action: careerAction[5]._id,
            }, {
                // name: "Đánh giá và xác định các thước đo sản phẩm và kinh doanh.",
                // code: ["danh_gia", "xac_dinh"],
                // type: 1,
                action: careerAction[2]._id
            },]
        },
        {//18
            name: "UX Designer",
            code: "ux_designer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Quản lý bản đồ hành trình của người dùng về sản phẩm / miền bằng cách thu thập dữ liệu, phỏng vấn",
                // code: ["thu_thap", "quan_ly"],
                // type: 1,
                action: careerAction[15]._id,
            }, {
                // name: "Tạo và quản lý kế hoạch UX để cải thiện sản phẩm thông qua UX nợ, tồn đọng",
                // code: ["xay_dung", "quan_ly"],
                // type: 1,
                action: careerAction[5]._id,
            },]
        },
        {//19
            name: "Software Engineer",
            code: "software_engineer",
            package: ["Thiết kế xây dựng triển khai phần mềm"],
            description: [{
                // name: "Phát triển các sản phẩm automotive và các công nghệ liên quan",
                // code: ["phat_trien"],
                // type: 1,
                action: careerAction[5]._id,
            },]
        },

    ]);

    /**
     * ===================END POSITION============================================
     * ===================END POSITION============================================
     */




    /**
     * ===================BEGIN FIELD============================================
     * ===================BEGIN FIELD============================================
     */
    console.log('3. Khởi tạo lĩnh vực công việc');

    var careerField = await CareerField(vnistDB).insertMany([
        {
            name: "Giáo dục",
            code: "giao_duc",
            position: [{
                // name: "Giảng viên",
                position: careerPosition[0]._id,
                multi: 0,
            }, {
                // name: "Trợ giảng",
                position: careerPosition[1]._id,
                multi: 0,
            }, {
                // name: "IT Teacher",
                position: careerPosition[2]._id,
                multi: 0,
            }]
        }, {
            name: "IT Phần mềm",
            code: "it_phan_mem",
            position: [{
                // name: "Kỹ thuật viên",
                position: careerPosition[3]._id,
                multi: 1,
            },
            {
                // name: "Chuyên viên hỗ trợ người dùng",
                position: careerPosition[4]._id,
                multi: 1,
            },
            {
                // name: "Chuyên Viên Quản Trị và Bảo Trì Ứng Dụng",
                position: careerPosition[5]._id,
                multi: 0,
            },
            // {
            //     name: "Web Developer",
            //     // code: ["it_phan_mem", "web_developer"],
            //     code: "web_developer",
            //     type: 1,
            // },
            {
                // name: "Data Analyst",
                position: careerPosition[17]._id,
                multi: 0,
            },
            {
                // name: "UX Designer",
                position: careerPosition[18]._id,
                multi: 0,
            },
            {
                // name: "System Admin Engineer",
                position: careerPosition[16]._id,
                multi: 0,
            },
            {
                // name: "Business Analyst",
                position: careerPosition[15]._id,
                multi: 0,
            },
            // {
            //     name: "Unity Programmer",
            //     // code: ["it_phan_mem", "unity_programer"],
            //     code: "unity_programer",
            //     type: 1,
            // },
            {
                // name: "Android Engineer",
                position: careerPosition[11]._id,
                multi: 0,
            },
            {
                // name: "iOS Engineer",
                position: careerPosition[12]._id,
                multi: 0,
            },
            {
                // name: "Front-End Engineer",
                position: careerPosition[14]._id,
                multi: 0,
            },
            {
                // name: "Back-End Engineer",
                position: careerPosition[13]._id,
                multi: 0,
            },
            {
                // name: "Software Engineer",
                position: careerPosition[19]._id,
                multi: 0,
            },
                // {
                //     name: "IT Teacher",
                //     code: ["it_phan_mem", "it_teacher"],
                //     type: 1,
                // }
            ]
        }, {
            name: "IT Phần cứng/mạng",
            code: "it_phan_cung_mang",
            position: [
                // {
                //     name: "IT Support - Kỹ Sư Máy Tính/ Mạng",
                //     code: ["it_phan_cung_mang", "it_support_ky_su_mang"],
                //     type: 1,
                // },
                {
                    // name: "Chuyên viên IT Mạng",
                    position: careerPosition[10]._id,
                    multi: 0,
                },
                // {
                //     name: "5G/ Lte System Engineer",
                //     // code: ["it_phan_cung_mang", "5G", "lte", "system_engineer"],
                //     code: "lte_system_engineer",
                //     type: 1,
                // },
                {
                    // name: "Chuyên Viên Bảo Mật Ứng Dụng",
                    position: careerPosition[8]._id,
                    multi: 0,
                },
                {
                    // name: "Chuyên Viên Phân Tích Sự Kiện Bảo Mật",
                    position: careerPosition[7]._id,
                    multi: 0,
                },
                {
                    // name: "Kỹ Sư Bảo Mật",
                    position: careerPosition[9]._id,
                    multi: 0,
                },
            ]
        }
    ]);


    vnistDB.close();

    console.log("End init sample package database!");
}

initSampleCompanyDB().catch(err => {
    console.log(err);
    process.exit(0);
})