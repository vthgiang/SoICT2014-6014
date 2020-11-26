const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Terms = require('./terms');

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
            } : {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            }
    );
    if (!vnistDB) throw ('DB vnist cannot connect');
    console.log("DB vnist connected");

    /**
     * 1.1 Khởi tạo model cho db
     */
    const initModels = (db) => {
        console.log("models", db.models);
        if (!db.models.Employee) Employee(db);
        if (!db.models.Major) Major(db);
        if (!db.models.CareerPosition) CareerPosition(db);

        console.log("models_list", db.models);
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

    console.log('1. Khởi tạo lĩnh vực công việc');

    var careerField = await CareerField(vnistDB).insertMany([
        {
            name: "Giáo dục",
            code: "giao_duc",
            position: [{
                name: "Giảng viên",
                code: ["giao_duc", "giang_vien"],
                type: 1,
            }, {
                name: "Trợ giảng",
                code: ["giao_duc", "tro_giang"],
                type: 1,
            }, {
                name: "IT Teacher",
                code: ["giao_duc", "it_phan_mem", "it_teacher"],
                type: 1,
            }]
        }, {
            name: "IT Phần mềm",
            code: "it_phan_mem",
            position: [{
                name: "Kỹ thuật viên",
                code: ["it_phan_mem", "it_phan_cung_mang", "ky_thuat_vien"],
                type: 1,
            },
            {
                name: "Chuyên viên hỗ trợ người dùng",
                code: ["it_phan_mem", "it_phan_cung_mang", "chuyen_vien_ho_tro_nguoi_dung"],
                type: 1,
            },
            {
                name: "Chuyên Viên Quản Trị và Bảo Trì Ứng Dụng",
                code: ["it_phan_mem", "it_phan_cung_mang", "chuyen_vien_quan_tri_bao_tri"],
                type: 1,
            },
            {
                name: "Web Developer",
                code: ["it_phan_mem", "web_developer"],
                type: 1,
            },
            {
                name: "Data Analyst",
                code: ["it_phan_mem", "it_phan_cung_mang", "data_analyst"],
                type: 1,
            },
            {
                name: "UX Designer",
                code: ["it_phan_mem", "ux_designer"],
                type: 1,
            },
            {
                name: "System Admin Engineer",
                code: ["it_phan_mem", "it_phan_cung_mang", "system_admin_engineer"],
                type: 1,
            },
            {
                name: "Business Analyst",
                code: ["it_phan_mem", "business_analyst"],
                type: 1,
            },
            {
                name: "Chuyên Viên công nghệ thông tin",
                code: ["it_phan_mem", "chuyen_vien_cong_nghe_thong_tin"],
                type: 1,
            },
            {
                name: "Unity Programmer",
                code: ["it_phan_mem", "unity_programer"],
                type: 1,
            },
            {
                name: "Android Engineer",
                code: ["it_phan_mem", "android_engineer"],
                type: 1,
            },
            {
                name: "iOS Engineer",
                code: ["it_phan_mem", "ios_engineer"],
                type: 1,
            },
            {
                name: "Front-End Engineer",
                code: ["it_phan_mem", "fe_engineer"],
                type: 1,
            },
            {
                name: "Back-End Engineer",
                code: ["it_phan_mem", "be_engineer"],
                type: 1,
            },
            {
                name: "Software Engineer",
                code: ["it_phan_mem", "software_engineer"],
                type: 1,
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
                    name: "Chuyên viên IT Mạng",
                    code: ["it_phan_cung_mang", "chuyen_vien_it_mang"],
                    type: 1,
                },
                {
                    name: "5G/ Lte System Engineer",
                    code: ["it_phan_cung_mang", "5G", "lte", "system_engineer"],
                    type: 1,
                },
                {
                    name: "Chuyên Viên Bảo Mật Ứng Dụng",
                    code: ["it_phan_cung_mang", "chuyen_vien_bao_mat"],
                    type: 1,
                },
                {
                    name: "Chuyên Viên Phân Tích Sự Kiện Bảo Mật",
                    code: ["it_phan_cung_mang", "chuyen_vien_phan_tich_su_kien_bao_mat"],
                    type: 1,
                },
                {
                    name: "Kỹ Sư Bảo Mật",
                    code: ["it_phan_cung_mang", "ky_su_bao_mat"],
                    type: 1,
                },
            ]
        }
    ]);


    console.log('2. Khởi tạo vị trí công việc');
    var careerPosition = await CareerPosition(vnistDB).insertMany([
        {
            name: "Giảng viên",
            code: "giang_vien",
            description: [{
                name: "Giảng dạy",
                code: ["giang_day"],
                type: 1,
            }, {
                name: "Nghiên cứu phát triển ứng dụng công nghệ thông tin",
                code: ["nghien_cuu"],
                type: 1,
            }]
        }, {
            name: "Trợ giảng",
            code: "tro_giang",
            description: [{
                name: "Hỗ trợ giảng dạy",
                code: ["giang_day"],
                type: 1,
            }, {
                name: "Hỗ trợ nghiên cứu khoa học",
                code: ["nghien_cuu"],
                type: 1,
            }]
        },
        {
            name: "IT Teacher",
            code: "it_teacher",
            description: [{
                name: "Lên kế hoạch chương trình giảng dạy cụ thể cho các tiết học",
                code: ["giang_day"],
                type: 1,
            }, {
                name: "Soạn và chấm bài kiểm tra",
                code: ["soan_thao", "cham_bai"],
                type: 1,
            }, {
                name: "Quản lý điểm và động lực học tập của sinh viên",
                code: ["quan_ly"],
                type: 1,
            }]
        },
        {
            name: "Kỹ thuật viên",
            code: "ky_thuat_vien",
            description: [{
                name: "Giám sát kỹ thuật an toàn thông tin",
                code: ["giam_sat"],
                type: 1,
            }, {
                name: "Giảng dạy đào tạo kĩ thuật ",
                code: ["giang_day"],
                type: 1,
            }, {
                name: "Quản lý hệ thống an toàn thông tin",
                code: ["quan_ly"],
                type: 1,
            }]
        }, {
            name: "Chuyên viên hỗ trợ người dùng",
            code: "chuyen_vien_ho_tro_nguoi_dung",
            description: [{
                name: "Phối hợp, giám sát và đốc thúc các đơn vị chức năng trong quá trình xử lý các yêu cầu hỗ trợ CNTT đảm bảo các SLA đã được cam kết",
                code: ["giam_sat"],
                type: 1,
            }, {
                name: "Thực hiện việc xử lý các yêu cầu hỗ trợ CNTT theo quy trình, hướng dẫn",
                code: ["ho_tro"],
                type: 1,
            }]
        }, {
            name: "Chuyên Viên Quản Trị và Bảo Trì Ứng Dụng",
            code: "chuyen_vien_quan_tri_bao_tri",
            description: [{
                name: "Tham gia triển khai các dự án công nghệ theo yêu cầu của lãnh đạo",
                code: ["trien_khai"],
                type: 1,
            }, {
                name: "Xây dựng các quy trình liên quan đến quản trị/ bảo trì các hệ thống ứng dụng",
                code: ["quan_tri", "bao_tri"],
                type: 1,
            }]
        },
        {
            name: "IT Support - Kỹ Sư Máy Tính/ Mạng",
            code: "it_support",
            description: [{
                name: "Tư vấn, hỗ trợ, khắc phục sự cố máy tính, mạng LAN, Internet và các thiết bị văn phòng",
                code: ["tu_van", "ho_tro"],
                type: 1,
            }, {
                name: "Bảo trì hệ thống máy tính, mạng máy tính và các thiết bị văn phòng",
                code: ["bao_tri"],
                type: 1,
            }]
        },
        {
            name: "Chuyên Viên Phân Tích Sự Kiện Bảo Mật",
            code: "chuyen_vien_phan_tich_su_kien_bao_mat",
            description: [{
                name: "Vận hành các hệ thống giám sát an ninh mạng.",
                code: ["van_hanh"],
                type: 1,
            }, {
                name: "Theo dõi, kiểm tra, phân loại, đánh giá và cảnh báo mức độ nguy hiểm các cảnh báo phát sinh từ hệ thống giám sát an ninh mạng.",
                code: ["theo_doi", "kiem_tra", "danh_gia", "phan_loai"],
                type: 1,
            }, {
                name: "Tham gia quá trình nghiên cứu, xây dựng kế hoạch triển khai và thực hiện các nội dung công việc liên quan đến phân tích các sự kiện bảo mật CNTT.",
                code: ["nghien_cuu"],
                type: 1,
            }]
        },
        {
            name: "Chuyên Viên Bảo Mật Ứng Dụng",
            code: "chuyen_vien_bao_mat",
            description: [{
                name: "Vận hành các hệ thống giám sát an ninh mạng.",
                code: ["van_hanh"],
                type: 1,
            }, {
                name: "Theo dõi, kiểm tra, phân loại, đánh giá và cảnh báo mức độ nguy hiểm các cảnh báo phát sinh từ hệ thống giám sát an ninh mạng.",
                code: ["theo_doi", "kiem_tra", "danh_gia", "phan_loai"],
                type: 1,
            }, {
                name: "Tham gia quá trình nghiên cứu, xây dựng kế hoạch triển khai và thực hiện các nội dung công việc liên quan đến phân tích các sự kiện bảo mật CNTT.",
                code: ["nghien_cuu"],
                type: 1,
            }]
        },
        {
            name: "Kỹ Sư Bảo Mật",
            code: "ky_su_bao_mat",
            description: [{
                name: "Thẩm định ATTT các hệ thống CNTT trước khi triển khai.",
                code: ["tham_dinh"],
                type: 1,
            }, {
                name: "Tham gia triển khai các dự án về ATTT cho Công ty",
                code: ["trien_khai"],
                type: 1,
            }, {
                name: "Thực hiện giám sát, quản lý các hệ thống về ATTT như hệ thống Firewall, IDS/IPS, Hệ thống Quản trị bảo mật Endpoint tập trung, hệ thống phòng chống thất thoát dữ liệu DLP",
                code: ["giam_sat", "quan_ly"],
                type: 1,
            }]
        },
        {
            name: "5G/ Lte System Engineer",
            code: "system_engineer",
            description: [{
                name: "Tích hợp hệ thống 5G / LTE / HSPA / Wi-Fi, hỗ trợ kiểm tra và gỡ lỗi, trình diễn và thử nghiệm thực địa qua mạng (OTA) các tính năng mới",
                code: ["tich_hop", "kiem_tra", "go_loi"],
                type: 1,
            }, {
                name: "Nghiên cứu hiệu suất trong phòng thí nghiệm, biên soạn sách trắng và tài liệu về các tiêu chuẩn và công nghệ không dây mới.",
                code: ["nghien_cuu", "bien_soan"],
                type: 1,
            }]
        },
        {
            name: "Chuyên viên IT Mạng",
            code: "chuyen_vien_it_mang",
            description: [{
                name: "Giám sát và báo cáo tình trạng hoạt động hằng ngày của hệ thống Core network (healthy daily checklist).",
                code: ["giam_sat", "bao_cao"],
                type: 1,
            }, {
                name: "Quản trị, đảm bảo kết nối internet cho các dịch vụ của công ty (phần mềm, dịch vụ số hóa, web, …",
                code: ["quan_tri"],
                type: 1,
            }]
        },
        {
            name: "Android Engineer",
            code: "android_engineer",
            description: [{
                name: "Nghiên cứu và áp dụng các công nghệ mới.",
                code: ["nghien_cuu", "bao_cao"],
                type: 1,
            }, {
                name: "Cải tiến và nâng cao chất lượng dự án.",
                code: ["cai_tien"],
                type: 1,
            }, {
                name: "Tham gia phân tích requirement, thiết kế hệ thống",
                code: ["phan_tich", "thiet_ke"],
                type: 1,
            }]
        },
        {
            name: "iOS Engineer",
            code: "ios_engineer",
            description: [{
                name: "Nghiên cứu và áp dụng các công nghệ mới.",
                code: ["nghien_cuu", "bao_cao"],
                type: 1,
            }, {
                name: "Cải tiến và nâng cao chất lượng dự án.",
                code: ["cai_tien"],
                type: 1,
            }, {
                name: "Tham gia phân tích requirement, thiết kế hệ thống",
                code: ["phan_tich", "thiet_ke"],
                type: 1,
            }]
        },
        {
            name: "Web Developer",
            code: "web_developer",
            description: [{
                name: "Lập trình ứng dụng web",
                code: ["lap_trinh"],
                type: 1,
            }]
        },
        {
            name: "Back-End Engineer",
            code: "be_engineer",
            description: [{
                name: "Thiết kế và phát triển các thành phần / dịch vụ vi mô hiệu suất cao cho một loạt các dự án chuyển đổi kỹ thuật số.",
                code: ["thiet_ke", "phat_trien"],
                type: 1,
            }, {
                name: "Làm việc với quy trình CI / CD của chúng tôi và đưa ra đề xuất để cải thiện quy trình đó",
                code: ["cai_thien"],
                type: 1,
            }]
        },
        {
            name: "Front-End Engineer",
            code: "fe_engineer",
            description: [{
                name: "Thực hiện UI của ứng dụng web hiện đại, giàu tương tác với yêu cầu cao về chất lượng và độ tin cậy",
                code: ["thiet_ke"],
                type: 1,
            }, {
                name: "Tìm kiếm cách tiếp cận thực tế nhất giúp phát triển UI mới",
                code: ["tim_kiem", "phat_trien"],
                type: 1,
            }, {
                name: "Nghiên cứu và lập luận về phương pháp hoặc công nghệ thích hợp để giải quyết vấn đề",
                code: ["nghien_cuu", "lap_luan"],
                type: 1,
            }]
        },
        {
            name: "Unity Programmer",
            code: "unity_programer",
            description: [{
                name: "Tham gia phát triển các dự án mini games trên nền tảng Unity;",
                code: ["phat_trien"],
                type: 1,
            }, {
                name: "Lập trình, debug và tối ưu hóa code để triển khai các ý tưởng gameplay vào game prototype và hoàn thiện prototype trước khi phát hành",
                code: ["lap_trinh", "debug", "toi_uu"],
                type: 1,
            },]
        },
        {
            name: "Business Analyst",
            code: "business_analyst",
            description: [{
                name: "Khảo sát, thu thập yêu cầu về dự án, tìm hiểu các quy trình nghiệp vụ cần thực hiện",
                code: ["khao_sat", "thu_thap"],
                type: 1,
            }, {
                name: "Hỗ trợ lập kế hoạch, đánh giá, kiểm tra chất lượng sản phẩm phần mềm",
                code: ["lap_ke_hoach", "danh_gia", "kiem_tra"],
                type: 1,
            },]
        },
        {
            name: "System Admin Engineer",
            code: "system_admin_engineer",
            description: [{
                name: "Giám sát, phòng chống, bảo mật, bảo trì, backup, restore, thường xuyên kiểm tra tình trạng server/storage & các lỗ hổng xuất hiện trên hệ thống máy chủ.",
                code: ["giam_sat", "phong_chong", "bao_tri", "kiem_tra"],
                type: 1,
            }, {
                name: "Vận hành hệ thống máy chủ, hệ thống lưu trữ, đảm bảo hoạt động ổn định suốt 24h.",
                code: ["van_hanh",],
                type: 1,
            }, {
                name: "Phụ trách thiết bị hạ tầng server, tháo ráp, cài đặt, di chuyển sang Data Center khi cần thiết.",
                code: ["thao_rap", "cai_dat"],
                type: 1,
            }, {
                name: "Thiết lập, cập nhật và duy trì các qui định, chính sách về sử dụng hệ thống cũng như thiết bị CNTT khác trong hệ thống.",
                code: ["thiet_lap", "cap_nhat"],
                type: 1,
            },]
        },
        {
            name: "Data Analyst",
            code: "data_analyst",
            description: [{
                name: "Thu thập các yêu cầu, tạo câu chuyện của người dùng và xác định các tiêu chí chấp nhận, ghi lại những yêu cầu này.",
                code: ["thu_thap", "luu_tru"],
                type: 1,
            }, {
                name: "Thử nghiệm xây dựng để đảm bảo sự phù hợp với các tiêu chí chấp nhận.",
                code: ["thu_nghiem", "xay_dung"],
                type: 1,
            }, {
                name: "Phát triển và duy trì trang tổng quan và hình ảnh hóa.",
                code: ["phat_trien", "duy_tri"],
                type: 1,
            }, {
                name: "Đánh giá và xác định các thước đo sản phẩm và kinh doanh.",
                code: ["danh_gia", "xac_dinh"],
                type: 1,
            },]
        },
        {
            name: "UX Designer",
            code: "ux_designer",
            description: [{
                name: "Quản lý bản đồ hành trình của người dùng về sản phẩm / miền bằng cách thu thập dữ liệu, phỏng vấn",
                code: ["thu_thap", "quan_ly"],
                type: 1,
            }, {
                name: "Tạo và quản lý kế hoạch UX để cải thiện sản phẩm thông qua UX nợ, tồn đọng",
                code: ["xay_dung", "quan_ly"],
                type: 1,
            },]
        },
        {
            name: "Software Engineer",
            code: "software_engineer",
            description: [{
                name: "Đảm bảo phát triển phần mềm đúng hạn và đảm bảo chất lượng của sản phẩm;",
                code: ["dam_bao",],
                type: 1,
            }, {
                name: "Phát triển các sản phẩm automotive và các công nghệ liên quan",
                code: ["phat_trien"],
                type: 1,
            },]
        },

    ]);

    console.log('3. Khởi tạo hoạt động công việc');
    //END
    var careerAction = await CareerAction(vnistDB).insertMany([
        {
            name: "Quản trị, bảo hành, bảo trì hoạt động của phần mềm và hệ thống thông tin",
            code: "itpm_01",
            detail: [
                {
                    name: "Quản trị",
                    code: "quan_tri",
                    type: 1,
                },
                {
                    name: "Bảo hành",
                    code: "bao_hanh",
                    type: 1,
                },
                {
                    name: "Bao trì",
                    code: "bao_tri",
                    type: 1,
                },
            ]
        },
        {
            name: "Tư vấn, đánh giá, thẩm định chất lượng phần mềm",
            code: "itpm_02",
            detail: [
                {
                    name: "Tư vấn",
                    code: "tu_van",
                    type: 1,
                },
                {
                    name: "Đánh giá",
                    code: "danh_gia",
                    type: 1,
                },
                {
                    name: "thẩm định",
                    code: "tham_dinh",
                    type: 1,
                },
            ]
        },
        {
            name: "tư vấn, xây dựng dự án phần mềm",
            code: "itpm_03",
            detail: [
                {
                    name: "Tư vấn",
                    code: "tu_van",
                    type: 1,
                },
                {
                    name: "Xây dựng",
                    code: "xay_dung",
                    type: 1,
                }
            ]
        },
        {
            name: "Bảo đảm an toàn, an ninh cho sản phẩm phần mềm, hệ thống thông tin",
            code: "itpm_04",
            detail: [
                {
                    name: "Bảo đảm",
                    code: "bao_dam",
                    type: 1,
                }
            ]
        },
        {
            name: "Phân phối, cung ứng sản phẩm phần mềm",
            code: "itpm_05",
            detail: [
                {
                    name: "Phân phối",
                    code: "phan_phoi",
                    type: 1,
                },
                {
                    name: "Cung ứng",
                    code: "cung_ung",
                    type: 1,
                },
                {
                    name: "Cung cấp",
                    code: "cung_cap",
                    type: 1,
                },
            ]
        },
        {
            name: "Lập trình phát triển phần mềm",
            code: "itpm_06",
            detail: [
                {
                    name: "Lập trình",
                    code: "lap_trinh",
                    type: 1,
                },
                {
                    name: "Phát triển",
                    code: "phat_trien",
                    type: 1,
                },
                {
                    name: "Xây dựng",
                    code: "xay_dung",
                    type: 1,
                }
            ]
        },
        {
            name: "Phân tích, thiết kế phần mềm",
            code: "itpm_07",
            detail: [
                {
                    name: "Thiết kế",
                    code: "thiet_ke",
                    type: 1,
                },
                {
                    name: "Phân tích",
                    code: "phan_tich",
                    type: 1,
                }
            ]
        },
        {
            name: "Kiểm thử, kiểm định phần mềm",
            code: "itpm_08",
            detail: [
                {
                    name: "Kiểm thử",
                    code: "kiem_thu",
                    type: 1,
                },
                {
                    name: "Kiểm định",
                    code: "kiem_dinh",
                    type: 1,
                }
            ]
        },
        {
            name: "kiểm tra, đánh giá, giám sát an toàn thông tin mạng;",
            code: "itpm_09",
            detail: [
                {
                    name: "Kiểm tra",
                    code: "kiem_tra",
                    type: 1,
                },
                {
                    name: "Đánh giá",
                    code: "danh_gia",
                    type: 1,
                },
                {
                    name: "Giám sát",
                    code: "giam_sat",
                    type: 1,
                }
            ]
        },
        {
            name: "Giảng dạy học tập",
            code: "itpm_10",
            detail: [
                {
                    name: "giang_day",
                    code: "giang_day",
                    type: 1,
                },
                {
                    name: "Nghiên cứu",
                    code: "nghien_cuu",
                    type: 1,
                },
                {
                    name: "Đào tạo",
                    code: "dao_tao",
                    type: 1,
                }
            ]
        },
    ])

    vnistDB.close();

    console.log("End init sample package database!");
}

initSampleCompanyDB().catch(err => {
    console.log(err);
    process.exit(0);
})