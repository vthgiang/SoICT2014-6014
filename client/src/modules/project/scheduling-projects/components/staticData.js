
export const fakeArr = [
    {
        "code": "A",
        "estimateOptimisticTime": 5,
        "estimateNormalTime": 6,
        "estimatePessimisticTime": 7,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "B",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 3,
        "estimatePessimisticTime": 5,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "C",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 4,
        "estimatePessimisticTime": 7,
        "predecessors": [],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "D",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 2,
        "estimatePessimisticTime": 3,
        "predecessors": [
            "A"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "E",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 4,
        "estimatePessimisticTime": 7,
        "predecessors": [
            "B"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "F",
        "estimateOptimisticTime": 1,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 9,
        "predecessors": [
            "C"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "G",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "C"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "H",
        "estimateOptimisticTime": 4,
        "estimateNormalTime": 7,
        "estimatePessimisticTime": 10,
        "predecessors": [
            "E",
            "F"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "I",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "D"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    },
    {
        "code": "J",
        "estimateOptimisticTime": 2,
        "estimateNormalTime": 5,
        "estimatePessimisticTime": 8,
        "predecessors": [
            "H",
            "G"
        ],
        estimateNormalCost: 100000,
        estimateMaxCost: 105000,
    }
]

export const fakeObj = {
    "A": {
        "id": "A",
        "optimisticTime": 5,
        "mostLikelyTime": 6,
        "pessimisticTime": 7,
        "predecessors": []
    },
    "B": {
        "id": "B",
        "optimisticTime": 1,
        "mostLikelyTime": 3,
        "pessimisticTime": 5,
        "predecessors": []
    },
    "C": {
        "id": "C",
        "optimisticTime": 1,
        "mostLikelyTime": 4,
        "pessimisticTime": 7,
        "predecessors": []
    },
    "D": {
        "id": "D",
        "optimisticTime": 1,
        "mostLikelyTime": 2,
        "pessimisticTime": 3,
        "predecessors": [
            "A"
        ]
    },
    "E": {
        "id": "E",
        "optimisticTime": 1,
        "mostLikelyTime": 4,
        "pessimisticTime": 7,
        "predecessors": [
            "B"
        ]
    },
    "F": {
        "id": "F",
        "optimisticTime": 1,
        "mostLikelyTime": 5,
        "pessimisticTime": 9,
        "predecessors": [
            "C"
        ]
    },
    "G": {
        "id": "G",
        "optimisticTime": 2,
        "mostLikelyTime": 5,
        "pessimisticTime": 8,
        "predecessors": [
            "C"
        ]
    },
    "H": {
        "id": "H",
        "optimisticTime": 4,
        "mostLikelyTime": 7,
        "pessimisticTime": 10,
        "predecessors": [
            "E",
            "F"
        ]
    },
    "I": {
        "id": "I",
        "optimisticTime": 2,
        "mostLikelyTime": 5,
        "pessimisticTime": 8,
        "predecessors": [
            "D"
        ]
    },
    "J": {
        "id": "J",
        "optimisticTime": 2,
        "mostLikelyTime": 5,
        "pessimisticTime": 8,
        "predecessors": [
            "H",
            "G"
        ]
    }
}

export const fakeChangeRequestsList = [
    {
        name: 'Yêu cầu 1',
        creator: {
            name: 'Trương Anh Quốc'
        },
        createdAt: '2021-04-18T00:00:00.000+00:00',
        description: 'Thêm thông tin cho công việc A. Thời gian sẽ tăng 1 ngày, chi phí sẽ tăng 100000 VND',
        requestStatus: 1,
    }
]

export const configImportCPMData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Danh sách công việc"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 2
    },
    code: {
        columnName: "Mã công việc",
        description: "Mã công việc",
        value: "Mã công việc"
    },
    name: {
        columnName: "Tên công việc",
        description: "Tên công việc",
        value: "Tên công việc"
    },
    predecessors: {
        columnName: "Mã công việc tiền nhiệm",
        description: "Mã công việc tiền nhiệm",
        value: "Mã công việc tiền nhiệm"
    },
    projectPhase: {
        columnName: "Mã giai đoạn",
        description: "Mã giai đoạn",
        value: "Mã giai đoạn"
    },
    estimateNormalTime: {
        columnName: "Thời gian ước lượng",
        description: "Thời gian ước lượng",
        value: "Thời gian ước lượng"
    },
    estimateOptimisticTime: {
        columnName: "Thời gian ước lượng thoả hiệp",
        description: "Thời gian ước lượng thoả hiệp",
        value: "Thời gian ước lượng thoả hiệp"
    },
    emailResponsibleEmployees: {
        columnName: "Email thành viên thực hiện",
        description: "Email thành viên thực hiện",
        value: "Email thành viên thực hiện"
    },
    emailAccountableEmployees: {
        columnName: 'Email thành viên phê duyệt',
        description: 'Email thành viên phê duyệt',
        value: 'Email thành viên phê duyệt'
    },
    totalResWeight: {
        columnName: 'Trọng số thành viên thực hiện (%)',
        description: 'Trọng số thành viên thực hiện (%)',
        value: 'Trọng số thành viên thực hiện (%)'
    },
}

export const configMemberData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Danh sách thành viên dự án"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 2
    },
    memberName: {
        columnName: 'Tên thành viên',
        description: 'Tên thành viên',
        value: 'Tên thành viên',
    },
    emailProjectMembers: {
        columnName: 'Email',
        description: 'Email',
        value: 'Email',
    },
}

export const configPhaseData = {
    sheets: {
        description: "Tên các sheet",
        value: ["Các giai đoạn trong dự án"]
    },
    rowHeader: {
        description: "Số dòng tiêu đề của bảng",
        value: 2
    },
    phaseCode: {
        columnName: 'Mã giai đoạn',
        description: 'Mã giai đoạn',
        value: 'Mã giai đoạn',
    },
    phaseName: {
        columnName: 'Tên giai đoạn',
        description: 'Tên giai đoạn',
        value: 'Tên giai đoạn',
    },
}