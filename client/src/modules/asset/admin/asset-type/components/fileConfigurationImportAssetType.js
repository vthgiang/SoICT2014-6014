export const configAssetType = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    code: {
        columnName: "Mã loại tài sản",
        description: "Tên tiêu đề ứng với mã loại tài sản",
        value: "Mã loại tài sản"
    },
    name: {
        columnName: "Tên loại tài sản",
        description: "Tên tiêu đề ứng với tên loại tài sản",
        value: "Tên loại tài sản"
    },
    parent: {
        columnName: "Tên loại tài sản cha",
        description: "Tên tiêu đề ứng với tên loại tài sản cha",
        value: "Tên loại tài sản cha"
    },
    description: {
        columnName: "Mô tả",
        description: "Tên tiêu đề ứng với mô tả",
        value: "Mô tả"
    },
    information: {
        columnName: "Thuộc tính mặc định",
        description: "Tên tiêu đề ứng với thuộc tính mặc định",
        value: "Thuộc tính mặc định"
    }
}


export const importAssetTypeTemplate = {
    fileName: "Mẫu import loại tài sản",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách loại tài sản',
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "code", value: "Mã loại tài sản" },
                { key: "name", value: "Tên loại tài sản" },
                { key: "parent", value:"Tên loại tài sản cha"},
                { key: "description", value: "Mô tả" },
                { key: "information", value: "Thuộc tính mặc định" }
            ],
            data: [
                {
                    code: "BA",
                    name: "Bàn",
                    parent: null,
                    description: "Các loại bàn",
                    information: "Chiều dài"
                },
                {
                    code: null,
                    name: null,
                    parent:null,
                    description: null,
                    information: "Chiều rộng"
                },
                {
                    code: "GH",
                    name: "Ghế",
                    parent:"Bàn",
                    description: null,
                    information: "Chiều cao"
                }
            ]
        }]
    }]
}