exports.getDataOrganizationalUnitKpiSetLog = (data) => {
    const { creator, type, organizationalUnit, month, newData } = data
    let monthIso = new Date(month);

    let log = {
        creator: creator,
        title: getTitleLogs(type) + " " + organizationalUnit?.name + " tháng " + (monthIso?.getMonth() + 1) + "-" + monthIso?.getFullYear(),
        description: getDescriptionLogs(type, newData, true)
    }

    return log
}

exports.getDataEmployeeKpiSetLog = (data) => {
    const { creator, type, employee, organizationalUnit, month, newData } = data
    let monthIso = new Date(month);

    let log = {
        creator: creator,
        title: getTitleLogs(type) + " " + employee?.name + " tháng " + (monthIso?.getMonth() + 1) + "-" + monthIso?.getFullYear() + " của " + organizationalUnit?.name,
        description: getDescriptionLogs(type, newData, false)
    }

    return log
}

const getTitleLogs = (type) => {
    switch (type) {
        case "create":
            return "Khởi tạo KPI"
        case "edit_kpi_set":
            return "Chỉnh sửa KPI"
        case "edit_kpi":
            return "Chỉnh sửa mục tiêu KPI"
        case "add_kpi":
            return "Thêm mục tiêu KPI"
        case "delete_kpi": 
            return "Xóa mục tiêu KPI"
        case "approval": 
            return "Phê duyệt KPI"
        case "evaluate":
            return "Đánh gía KPI"
        case "edit_status":
            return "Chỉnh sửa trạng thái KPI"
        default:
            return null
    }
}

const getDescriptionLogs = (type, newData, isUnit) => {
    switch (type) {
        case "create":
            let totalWeight = 0
            if (newData?.kpis?.length > 0) {
                newData.kpis.map(item => {
                    totalWeight += item?.weight
                })
            }
            return (newData?.approver ? `<div>Người phê duyệt: ${newData?.approver?.name}</div>` : "")
                + `
                    <div>Đơn vị: ${newData?.organizationalUnit?.name}</div>
                    <div>Số mục tiêu: ${newData?.kpis?.length}</div>
                    <div>Tổng trọng số: ${totalWeight}</div>
                ` 
        case "edit_kpi_set":
            return (newData?.approver ? `<div>Người phê duyệt mới: ${newData?.approver?.name}</div>` : "")
                + `
                    <div>Đơn vị: ${newData?.organizationalUnit?.name}</div>
                    <div>Số mục tiêu: ${newData?.kpis?.length}</div>
                    <div>Tổng trọng số: ${totalWeight}</div>
                ` 
        case "edit_kpi":
            return `
                <div>Mục tiêu mới: ${newData?.name}</div>
                <div>Tiêu chí đánh giá: ${newData?.criteria}</div>
                <div>Trọng số: ${newData?.weight}</div>
            `
        case "add_kpi":
            return `
                <div>Mục tiêu mới: ${newData?.name}</div>
                <div>Tiêu chí đánh giá: ${newData?.criteria}</div>
                <div>Trọng số: ${newData?.weight}</div>
            `
        case "delete_kpi": 
            return `
                <div>Mục tiêu đã xóa: ${newData?.name}</div>
                <div>Tiêu chí đánh giá: ${newData?.criteria}</div>
                <div>Trọng số: ${newData?.weight}</div>
            `
        case "approval": 
            return "Phê duyệt KPI"
        case "evaluate":
            return "Đánh gía KPI"
        case "edit_status":
            return `
                <div>Trạng thái mới: ${isUnit ? formatStatusOrganizationalUnitKpiSet(newData?.status) : formatStatusEmployeeKpiSet(newData?.status)}</div>
            `
        default:
            return null
    }
}

const formatStatusEmployeeKpiSet = (status) => {
    switch (status) {
        case 0:
            return "Đang thiết lập"
        case 1: 
            return "Chờ phê duyệt"
        case 2:
            return "Đã kích hoạt"
    }
}

const formatStatusOrganizationalUnitKpiSet = (status) => {
    switch (status) {
        case 0:
            return "Đang thiết lập"
        case 1:
            return "Đã kích hoạt"
    }
}