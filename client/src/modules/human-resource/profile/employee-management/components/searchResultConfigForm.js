export const configSearchData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Sheet1"]
    },
    rowHeader: {
        description: "Số tiêu đề của bảng",
        value: 1
    },
    fullName: {
        columnName: "Họ và tên",
        description: "Tên tiêu đề ứng với họ và tên",
        value: "Họ và tên"
    },
    emailInCompany: {
        columnName: "Email",
        description: "Tên tiêu đề ứng với email",
        value: "email"
    },
    birthdate: {
        columnName: "Ngày sinh",
        description: "Tên tiêu đề ứng với ngày sinh",
        value: "Ngày sinh"
    },
    degree: {
        columnName: "Bằng cấp",
        description: "Tên tiêu đề ứng với bằng cấp",
        value: "Bằng cấp"
    },
    professionalSkill: {
        columnName: "Trình độ chuyên môn",
        description: "Tên tiêu đề ứng với trình độ chuyên môn",
        value: "Trình độ chuyên môn"
    },
    major: {
        columnName: "Chuyên ngành",
        description: "Tên tiêu đề ứng với chuyên ngành",
        value: "Chuyên ngành"
    },
    certificates: {
        columnName: "Chứng chỉ",
        description: "Tên tiêu đề ứng với chứng chỉ",
        value: "Chứng chỉ"
    },
    career: {
        columnName: "Vị trí công việc",
        description: "Tên tiêu đề ứng với vị trí công việc",
        value: "Vị trí công việc"
    },
}

export const templateSearchImport = {
    fileName: "Danh sách tìm kiếm nhân viên",
    dataSheets: [
        {
            sheetName: "A.Bảng đề xuất nhân sự chủ chốt",
            sheetTitle: 'Bảng đề xuất nhân sự chủ chốt',
            tables: [{
                rowHeader: 1,
                merges: [],
                columns: [
                    { key: "STT", value: "STT", width: 7 },
                    { key: "fullName", value: "Họ và tên", width: 20 },
                    { key: "position", value: "Vị trí công việc", width: 30 },
                ],
                data: []
            }]
        },
        {
            sheetName: "B.Bảng lý lịch chuyên môn của nhân sự chủ chốt",
            sheetTitle: 'Bảng lý lịch chuyên môn của nhân sự chủ chốt',
            tables: [{
                rowHeader: 2,
                merges: [{
                    key: "info",
                    columnName: "Thông tin nhân sự",
                    keyMerge: 'STT',
                    colspan: 5
                }, {
                    key: "career",
                    columnName: "Công việc hiện tại",
                    keyMerge: 'boss',
                    colspan: 6
                }],
                columns: [
                    { key: "STT", value: "STT", width: 7 },
                    { key: "fullName", value: "Tên", width: 20 },
                    { key: "position", value: "Vị trí", width: 25 },
                    { key: "birthdate", value: "Ngày, tháng, năm sinh", width: 25 },
                    { key: "professionalSkill", value: "Trình độ chuyên môn", width: 25 },
                    { key: "boss", value: "Tên người sử dụng lao động", width: 30 },
                    { key: "address", value: "Địa chi người sử dụng lao động", width: 30 },
                    { key: "jobTitle", value: "Chức danh", width: 25 },
                    { key: "yearExp", value: "Số năm làm việc cho người sủ dụng lao động hiện tại", width: 15 },
                    { key: "contactPerson", value: "Người liên lạc (tưởng phòng / cán bộ phụ trách nhân sự)", width: 25 },
                    { key: "phone", value: "Điện thoại/ Fax/ Email", width: 35 },
                ],
                data: []
            }]
        },
        {
            sheetName: "C.Bảng kinh nghiệm chuyên môn",
            sheetTitle: 'Bảng kinh nghiệm chuyên môn',
            tables: [{
                rowHeader: 1,
                merges: [],
                columns: [
                    { key: "STT", value: "STT", width: 7 },
                    { key: "fullName", value: "Tên nhân sự chủ chốt", width: 20 },
                    { key: "startDate", value: "Từ ngày", width: 25 },
                    { key: "endDate", value: "Đến ngày", width: 25 },
                    { key: "career", value: "Dự án/ Chức vụ/ Kinh nghiệm chuyên môn và quản lý có liên quan", width: 60 },
                ],
                data: []
            }]
        }
    ]
}
