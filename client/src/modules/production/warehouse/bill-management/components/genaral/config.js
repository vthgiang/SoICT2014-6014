export const UserGuideCreateBillReceipt = [
    {
        pageName: "Hướng dẫn tạo mới phiếu nhập kho",
        fileName: 'phieunhapkho.pdf',
        url: '/upload/user-guide/bill/phieunhapkho.pdf',
    },
]

export const UserGuideCreateBillIssue = [
    {
        pageName: "Hướng dẫn tạo mới phiếu xuất kho",
        fileName: 'phieuxuatkho.pdf',
        url: '/upload/user-guide/bill/phieuxuatkho.pdf',
    },
]

export const UserGuideCreateBillReturn = [
    {
        pageName: "Hướng dẫn tạo mới phiếu trả hàng",
        fileName: 'phieutrahang.pdf',
        url: '/upload/user-guide/bill/phieutrahang.pdf',
    },
]

export const UserGuideCreateBillRotate = [
    {
        pageName: "Hướng dẫn tạo mới phiếu luân chuyển",
        fileName: 'phieuluanchuyen.pdf',
        url: '/upload/user-guide/bill/phieuluanchuyen.pdf',
    },
]

export const UserGuideCreateBillTake = [
    {
        pageName: "Hướng dẫn tạo mới phiếu kiểm kê",
        fileName: 'phieukiemke.pdf',
        url: '/upload/user-guide/bill/phieukiemke.pdf',
    },
]

export const dataWorkAssignment = {
    goodReceiptData,
    goodIssueData,
    goodReturnData,
    // goodTakeData,
    // goodRotateData,
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, month, year].join('-');
}

function goodReceiptData(code) {
    const data = [
        {
            nameField: "Công việc vận chuyển, phiếu nhập kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Vận chuyển hàng hóa đến đúng vị trí'
        },
        {
            nameField: "Công việc kiểm định chất lượng, phiếu nhập kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: `unpack, kiểm tra số lượng và chất lượng. Phân loại hàng hóa theo danh mục. Đối chiếu, packing. Ghi chú thay đổi`
        },
        {
            nameField: "Đánh lô hàng hóa, phiếu nhập kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Đánh mã số lô hàng cho hàng hóa khi nhập'
        },
        {
            nameField: "Xếp hàng hóa vào vị trí lưu trữ, phiếu nhập kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Xếp hàng đến vị trí lưu trữ trong kho'
        },
    ]
    return data;
}

function goodIssueData(code) {
    const data = [
        {
            nameField: "Xếp lại những hàng hóa còn lại trong lô vừa xuất vào vị trí lưu trữ, phiếu xuất kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Đánh mã số lô hàng cho hàng hóa khi nhập'
        },
        {
            nameField: "Công việc vận chuyển, bốc dỡ hàng hóa, phiếu xuất kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Vận chuyển hàng hóa đến đúng vị trí'
        },
        {
            nameField: "Scan hàng hóa, phiếu xuất kho: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: `Scan hàng hóa xuất kho, ghi chú thay đổi`
        }
    ]
    return data;
}

function goodReturnData(code) {
    const data = [
        {
            nameField: "Công việc vận chuyển, phiếu trả hàng: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Vận chuyển hàng hóa đến đúng vị trí'
        },
        {
            nameField: "Công việc kiểm định chất lượng, phiếu trả hàng: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: `unpack, kiểm tra số lượng và chất lượng. Phân loại hàng hóa theo danh mục. Đối chiếu, packing. Ghi chú thay đổi`
        },
        {
            nameField: "Đánh lô hàng hóa, phiếu trả hàng: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Đánh mã số lô hàng cho hàng hóa khi nhập'
        },
        {
            nameField: "Xếp hàng hóa vào vị trí lưu trữ, phiếu trả hàng: " + code, workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM", type: 'default', description: 'Xếp hàng đến vị trí lưu trữ trong kho'
        },
    ]
    return data;
}
