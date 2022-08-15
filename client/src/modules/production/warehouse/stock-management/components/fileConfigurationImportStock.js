export const configStock = {
    sheets: {
        description: "Danh sách kho",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    code: {
        columnName: "Mã kho",
        description: "Mã kho",
        value: "Mã kho"
    },
    name: {
        columnName: "Tên kho",
        description: "Tên kho",
        value: "Tên kho"
    },
    address: {
        columnName: "Địa chỉ",
        description: "Địa chỉ",
        value: "Địa chỉ"
    },
    status: {
        columnName: "Trạng thái",
        description: "Trạng thái",
        value: "Trạng thái"
    },
    startTime: {
        columnName: "Thời gian bắt đầu",
        description: "Thời gian bắt đầu",
        value: "Thời gian bắt đầu"
    },
    endTime: {
        columnName: "Thời gian kết thúc",
        description: "Thời gian kết thúc",
        value: "Thời gian kết thúc"
    },
    organizationalUnitValue: {
        columnName: "Đơn vị tổ chức",
        description: "Đơn vị tổ chức",
        value: "Đơn vị tổ chức"
    },
    description: {
        columnName: "Mô tả",
        description: "Mô tả",
        value: "Mô tả"
    }
}

export const importStockTemplate = {
    fileName: "Mẫu import kho",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Mẫu import kho',
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "code", value: "Mã kho" },
                { key: "name", value: "Tên kho" },
                { key: "address", value: "Địa chỉ" },
                { key: "status", value: "Trạng thái" },
                { key: "startTime", value: "Thời gian bắt đầu" },
                { key: "endTime", value: "Thời gian kết thúc" },
                { key: "organizationalUnitValue", value: "Đơn vị tổ chức" },
                { key: "description", value: "Mô tả" }
            ],
            data: [
                {
                    code: "S001",
                    name: "Kho Trần Đại Nghĩa",
                    address: "Trần Đại Nghĩa",
                    status: 1,
                    startTime: "07:00 AM",
                    endTime: "07:00 PM",
                    organizationalUnitValue: "62f5afca868ff41c9c55a4b3",
                    description: "Kho Trần Đại Nghĩa"
                },
            ]
        }]
    }]
}
