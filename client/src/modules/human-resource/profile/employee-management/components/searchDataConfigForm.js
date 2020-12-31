export const configSearchData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    position: {
        columnName: "Vị trí công việc",
        description: "Tên tiêu đề ứng với vị trí công việc",
        value: "Vị trí công việc"
    },
    professionalSkill: {
        columnName: "Trình độ chuyên môn",
        description: "Tên tiêu đề ứng với trình độ chuyên môn",
        value: "Trình độ chuyên môn"
    },
    majorSearch: {
        columnName: "Chuyên ngành",
        description: "Tên tiêu đề ứng với chuyên ngành",
        value: "Chuyên ngành"
    },
    certificatesType: {
        columnName: "Loại chứng chỉ",
        description: "Tên tiêu đề ứng với loại chứng chỉ",
        value: "Loại chứng chỉ"
    },
    certificatesName: {
        columnName: "Tên chứng chỉ",
        description: "Tên tiêu đề ứng với tên chứng chỉ",
        value: "Tên chứng chỉ"
    },
    certificatesEndDate: {
        columnName: "Hiệu lực chứng chỉ",
        description: "Tên tiêu đề ứng với hiệu lực chứng chỉ",
        value: "Hiệu lực chứng chỉ"
    },
    exp: {
        columnName: "Số năm kinh nghiệm",
        description: "Tên tiêu đề ứng với số năm kinh nghiệm",
        value: "Số năm kinh nghiệm"
    },
    sameExp: {
        columnName: "Số năm kinh nghiệm tương đương",
        description: "Tên tiêu đề ứng với số năm kinh nghiệm tương đương",
        value: "Số năm kinh nghiệm tương đương"
    },
    field: {
        columnName: "Lĩnh vực công việc",
        description: "Tên tiêu đề ứng với lĩnh vực công việc",
        value: "Lĩnh vực công việc"
    },
    package: {
        columnName: "Gói thầu",
        description: "Tên tiêu đề ứng với gói thầu",
        value: "Gói thầu"
    },
    action: {
        columnName: "Hoạt động công việc",
        description: "Tên tiêu đề ứng với hoạt động công việc",
        value: "Hoạt động công việc"
    },
}

export const templateSearchImport = {
    fileName: "Mẫu thông tin tìm kiếm",
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Mẫu thông tin tìm kiếm',
        tables: [{
            rowHeader: 1,
            merges: [],
            columns: [
                { key: "position", value: "Vị trí công việc" },
                { key: "professionalSkill", value: "Trình độ chuyên môn" },
                { key: "majorSearch", value: "Chuyên ngành" },
                { key: "certificatesType", value: "Loại chứng chỉ" },
                { key: "certificatesName", value: "Tên chứng chỉ" },
                { key: "certificatesEndDate", value: "Hiệu lực chứng chỉ" },
                { key: "exp", value: "Số năm kinh nghiệm" },
                { key: "sameExp", value: "Số năm kinh nghiệm tương đương" },
                { key: "field", value: "Lĩnh vực công việc" },
                { key: "package", value: "Gói thầu" },
                { key: "action", value: "Hoạt động công việc" },
            ],
            // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
            data: []
        }]
    }]
}
