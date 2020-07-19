const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const AssetType = require('./assetType.model');
const User = require('../auth/user.model');
//  const OrganizationalUnit = require('../super-admin/organizationalUnit.model');

// Create Schema
const AssetSchema = new Schema({

    //  organizationalUnit: { // phòng ban
   //      type: Schema.Types.ObjectId,
   //      ref: OrganizationalUnit,
   //  },

    company: {// công ty
        type: Schema.Types.ObjectId,
        ref: Company,
    },

    /***************************************************************************************************
     * Tab thông tin chung
     */
    avatar: {
       type: String
   },

    code: { //2.mã tài sản
        type: String,
        required: true
    },

    assetName: { //3.tên tài sản
        type: String,
        required: true
    },

    serial: { //4. số serial 
        type: String,
    },

    assetType: { //5.loại tài sản
        type: Schema.Types.ObjectId,
        ref: AssetType,
    },

    purchaseDate: { //6.ngày nhập, ngày mua
       type: Date,
        defaut: Date.now,
        required: true
    },

    warrantyExpirationDate: { //7.ngày bảo hành (thời gian bảo hành)
        type: Date
    },

    managedBy: {//11.Người quản lý
       type: Schema.Types.ObjectId,
       ref: User,
       // required: true
   },

   assignedTo: {//12.Người đang được giao sử dụng
       type: Schema.Types.ObjectId,
       ref: User,
       // required: true
   },

   handoverFromDate: { //13.Người được giao sử dụng từ ngày
       type: Date,
       // defaut: Date.now,
       // required: true
   },

   handoverToDate: { //14.Người được giao sử dụng đến ngày
       type: Date,
       // defaut: Date.now,
       // required: true
   },

   location: { //15.vị trí tài sản
       type: String,
       // required: true
   },

   status: { //16.tình trạng: sẵn sàng sử dụng || đang sử dụng || hỏng hóc || mất || Thanh lý
       type: String,
       enum: ["Sẵn sàng sử dụng", "Đang sử dụng", "Hỏng hóc", "Mất", "Thanh lý"]
       // enum: ["InUse", "Unassigned", "InStorage", "Broken", "InRepair", "Disposed"]
       // InUse, Active, InStorage, Broken, Lost, In Repair, Disposed, Transferred out, Inoperable
   },

   canRegisterForUse: {
        // type: Boolean,
        type: String,
       enum: ["Được phép đăng ký sử dụng", "Không được phép đăng ký sử dụng"]
   },

   description: { //17.mô tả
       type: String,
   },

   detailInfo: [{// thông tin chi tiết
       nameField: String,// tên trường dữ liệu
       value: String, //giá trị
   }],

   /***********************************************************************************************
    * Tab Khấu hao
    */
    depreciationType:{ // Cách tính khấu hao
        type: String,
        enum: ["Đường thẳng", "Số dư giảm dần", "Sản lượng"],
        // Reducing balance chính là Declining Balance Method
    },
   
    cost: { //8. Nguyên giá
        type: Number
    },
    usefulLife: { //9. Thời gian sử dụng
        type: Number
    },
    startDepreciation: { // thời gian bắt đầu trích khấu hao
       type: Date
   },
    residualValue: { //10. Giá trị thu hồi ước tính.
        //Là giá trị ước tính của một tài sản vào cuối thời hạn thuê 
        //hoặc thời gian sử dụng hữu ích.Theo nguyên tắc chung, 
        //thời gian sử dụng hữu dụng hoặc thời gian thuê của một tài sản càng dài 
        // thì giá trị còn lại của nó càng thấp
        type: Number
    },
    rate: { // Dùng trong phương pháp Reducing balance/DecliningBalance
        type: Number,
    },
    unitsProducedDuringTheYears: [{// Dùng trong UnitsOfProduction
        year: Number,
        unitsProducedDuringTheYear: Number
    }],
    estimatedTotalProduction: {// Dùng trong UnitsOfProduction
        type: Number
    },

    /**************************************************************************************************
     * lịch sử sử dụng - Tab cấp phát
     */
    usageLogs: [{ //ghi lại lịch sử sử dụng
        usedBy: {// người sử dụng
            type: Schema.Types.ObjectId,
            ref: User,
        },
        startDate: {// ngày bắt đầu sử dụng
            type: Date
        },
        endDate: { //ngày kết thúc sử dụng
            type: Date
        },
        description: { //mô tả
            type: String
        }
    }],

    /**************************************************************************************************
     * bảo trì: tab Sửa chữa
     */
    maintainanceLogs: [{ // bảo trì thiết bị
        maintainanceCode: {//số phiếu
            type: String,
           //  required: true
        },
        createDate: { // ngày lập
            type: Date
        },
        type: {//phân loại: 1. sửa chữa , 2.thay thế , 3. nâng cấp
            type: String,
           //  required: true,
        },
        description: {// nội dung, lý do
            type: String,
           //  required: true
        },
        startDate: {//Ngày bắt đầu sửa
            type: Date
        },
        endDate: {//Ngày hoàn thành
            type: Date
        },
        expense: { //chi phí sửa chữa - thay thế  - NÂNG CẤP
            type: Number,
           //  required: true
        },
        status: {//trạng thái, tình trạng: 1-chưa thực hiện || 2-đang thực hiện || 3-đã thực hiện
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    /**************************************************************************************************
     * sự cố tài sản - tab Sự cố
     */
    incidentLogs: [{ //sự cố tài sản
        incidentCode: {
            type: String
        },
        type: {//Phân loại: 1. Báo hỏng , 2.Báo mất
            type: String,
           //  require: true,
        },
        reportedBy: {//Người báo cáo
            type: Schema.Types.ObjectId,
            ref: User,
            // required: true
        },
        dateOfIncident: { //Ngày phát hiện
            type: Date,
            defaut: Date.now,
            // required: true
        },
        description: { //Nội dung
            type: String,
            // required: true
        },
        statusIncident: { //Nội dung
            type: String,
            // required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],

    /**************************************************************************************************
     * Lịch sử vị trí tài sản
     */
    locationLogs: [{ //lịch sử vị trí của tài sản
        location: {
            type: String
        },
        startDate: Date,
        endDate: Date,
        description: String
    }],

    /**************************************************************************************************
     * Thông tin thanh lý
     */
   disposalDate: { // thời gian thanh lý
       type: Date
   },
   disposalType: { // 1-phá hủy(scrapped), 2-sold, 3-gifted
       type: String,
   },  
   disposalCost: { // giá trị thanh lý
       type: Number,
   },
   disposalDesc: { // Nội dung thanh lý
       type: String
   },

    /***************************************************************************************************
     * trường dữ liệu động
     */
    informations: [{ //
        code: { // Mã thuộc tính
            type: String,
        },
        name: { // Tên thông tin/thuộc tính 
            type: String,
        },
        description: {
            type: String,
        },
        extra: { // Cho kiểu dữ liệu tập giá trị, lưu lại các tập giá trị
            type: String
        },
        type: {
            type: String,
            required: true,
            enum: ['Text', 'Boolean', 'Date', 'Number', 'SetOfValues'],
        },
        value: {
            type: Schema.Types.Mixed,
        }
    }],

    /***************************************************************************************************
     * tab Tài liệu đính kèm
     */
    archivedRecordNumber: { //18.mã hồ sơ lưu trữ
        type: String
    },

   files: [{ // Các file scan đính kèm
       name: String,
       description: String,
       number: String,
       urlFile: String
   }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = Asset = mongoose.model("assets", AssetSchema);
