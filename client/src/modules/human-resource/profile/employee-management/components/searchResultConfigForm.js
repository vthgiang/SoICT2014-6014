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
    dataSheets: [{
        sheetName: "Sheet1",
        sheetTitle: 'Danh sách tìm kiếm nhân viên',
        tables: [{
            rowHeader: 1,
            merges: [],
            columns: [
                { key: "STT", value: "STT", width: 7  },
                { key: "fullName", value: "Họ và tên", width: 20  },
                { key: "emailInCompany", value: "Email", width: 25  },
                { key: "birthdate", value: "Ngày sinh", width: 25  },
                { key: "degree", value: "Bằng cấp", width: 25  },
                { key: "professionalSkill", value: "Trình độ chuyên môn", width: 25  },
                { key: "major", value: "Chuyên ngành", width: 25  },
                { key: "certificates", value: "Chứng chỉ", width: 25  },
                { key: "career", value: "Vị trí công việc", width: 60  },
            ],
            // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
            data: []
        }]
    }]
}
