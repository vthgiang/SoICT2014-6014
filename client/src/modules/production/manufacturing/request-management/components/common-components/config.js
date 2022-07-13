export const dataListStatus = {
    listStatusPurchase,
    listStatusIssue,
    listStatusReceipt,
}

function listStatusPurchase() {
    const listStatus = [
        {
            value: 1,
            completed: 'Tạo phiếu thành công',
            wait: 'Chưa xử lý'
        },
        {
            value: 2,
            completed: 'đã gửi đến bộ phận mua hàng',
            wait: 'Chưa phê duyệt'
        },
        {
            value: 3,
            completed: 'đã phê duyệt mua hàng',
            wait: 'Chưa phê duyệt mua hàng',
        },
        {
            value: 4,
            completed: 'Đã tạo đơn mua hàng',
            wait: 'Chưa tạo đơn mua hàng'
        },
        {
            value: 5,
            completed: 'Đã phê duyệt đơn mua hàng',
            wait: 'Chưa phê duyệt đơn mua hàng'
        },
        {
            value: 6,
            completed: 'Đã gửi yêu cầu nhập kho',
            wait: 'Chưa phê duyệt đơn mua hàng'
        },
        {
            value: 7,
            completed: 'Đã phê duyệt yêu cầu nhập kho',
            wait: 'Chưa phê duyệt gửi yêu cầu đến kho'
        },
        {
            value: 8,
            completed: 'Đang tiến hành nhập kho',
            wait: 'Chưa nhập kho'
        },
        {
            value: 9,
            completed: 'Đã hoàn thành nhập kho',
            wait: 'Chưa hoàn thành nhập kho'
        }
    ]
    return listStatus;
}

function listStatusIssue() {
    const listStatus = [
        {
            value: 1,
            completed: 'Tạo phiếu thành công',
            wait: 'Chưa xử lý'
        },
        {
            value: 2,
            completed: 'Yêu cầu đã gửi đến kho',
            wait: 'Chưa phê duyệt'
        },
        {
            value: 3,
            completed: 'Đã phê duyệt yêu cầu xuất kho',
            wait: 'Chưa phê duyệt yêu cầu xuất kho',
        },
        {
            value: 4,
            completed: ' Đang tiến hành xuất kho',
            wait: 'Chưa xuất kho'
        },
        {
            value: 5,
            completed: 'Đã hoàn thành xuất kho',
            wait: 'Chưa hoàn thành xuất kho'
        }
    ]
    return listStatus;
}

function listStatusReceipt() {
    const listStatus = [
        {
            value: 1,
            completed: 'Tạo phiếu thành công',
            wait: 'Chưa xử lý'
        },
        {
            value: 2,
            completed: 'Yêu cầu đã gửi đến kho',
            wait: 'Chưa phê duyệt'
        },
        {
            value: 3,
            completed: 'Đã phê duyệt yêu cầu nhập kho',
            wait: 'Chưa phê duyệt yêu cầu nhập kho',
        },
        {
            value: 4,
            completed: ' Đang tiến hành nhập kho',
            wait: 'Chưa nhập kho'
        },
        {
            value: 5,
            completed: 'Đã hoàn thành nhập kho',
            wait: 'Chưa hoàn thành nhập kho'
        }
    ]
    return listStatus;
}

export const timelineText = {
    timelineTextPurchase1,
    timelineTextPurchase2,
    timelineTextIssue,
    timelineTextReceipt,
}

function timelineTextPurchase1() {
    let listTimeline = [
        { text: "Tạo yêu cầu" },
        { text: "Gửi yêu cầu đến đơn hàng" },
        { text: "Phê duyệt yêu cầu mua hàng" },
        { text: "Tạo phiếu mua hàng" },
        { text: "Phê duyệt phiếu mua hàng" },
    ];
    return listTimeline;
}

function timelineTextPurchase2() {
    let listTimeline = [
        { text: "Đã gửi yêu cầu nhập kho" },
        { text: "Đã phê duyệt yêu cầu nhập kho" },
        { text: "Đang tiến hành nhập kho" },
        { text: "Đã hoàn thành nhập kho" },
    ]
    return listTimeline;
}

function timelineTextReceipt() {
    let listTimeline = [
        { text: "Tạo yêu cầu" },
        { text: "Gửi yêu cầu kho" },
        { text: "Phê duyệt yêu cầu nhập kho" },
        { text: "Đang tiến hành nhập kho" },
        { text: "Đã hoàn thành nhập kho" },
    ]
    return listTimeline;
}

function timelineTextIssue() {
    let listTimeline = [
        { text: "Tạo yêu cầu" },
        { text: "Gửi yêu cầu kho" },
        { text: "Phê duyệt yêu cầu xuất kho" },
        { text: "Đang tiến hành xuất kho" },
        { text: "Đã hoàn thành xuất kho" },
    ]
    return listTimeline;
}
