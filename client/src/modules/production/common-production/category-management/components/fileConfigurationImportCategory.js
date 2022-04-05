export const configCategory = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    code: {
        columnName: "Mã danh mục",
        description: "Tên tiêu đề ứng với mã danh mục",
        value: "Mã danh mục"
    },
    name: {
        columnName: "Tên danh mục",
        description: "Tên tiêu đề ứng với tên danh mục",
        value: "Tên danh mục"
    },
    parent: {
        columnName: "Tên danh mục cha",
        description: "Tên tiêu đề ứng với tên danh mục cha",
        value: "Tên loại danh mục cha"
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


export const importCategoryTemplate = {
    fileName: "Mẫu import danh mục",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách danh mục',
        tables: [{
            rowHeader: 1,
            columns: [
                { key: "code", value: "Mã danh mục" },
                { key: "name", value: "Tên danh mục" },
                { key: "parent", value:"Tên danh mục cha"},
                { key: "description", value: "Mô tả" },
                { key: "information", value: "Thuộc tính mặc định" }
            ],
            data: [
                {
                    code: "CT001",
                    name: "Sản phẩm",
                    parent: null,
                    description: "Những mặt hàng được sản xuất xong",
                    information: null,
                },
                {
                    code: "CT002",
                    name: "Công cụ dụng cụ",
                    parent:null,
                    description: "Những mặt hàng chỉ mới hoàn thành một giai đoạn sản xuất",
                    information: null,
                },
                {
                    code: "GHCTP001",
                    name: "Dạng bột",
                    parent:"Sản phẩm",
                    description: "Thuốc dạng bột",
                    information: null,
                }
            ]
        }]
    }]
}
