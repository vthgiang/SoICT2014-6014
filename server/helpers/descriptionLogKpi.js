exports.getDataOrganizationalUnitKpiSetLog = (data) => {
    const { creator, type, newData } = data

    let log = {
        creator: creator,
        title: getTitleLogs(data, true),
        description: getDescriptionLogs(type, newData, true)
    }

    return log
}

exports.getDataEmployeeKpiSetLog = (data) => {
    const { creator, type, newData } = data

    let log = {
        creator: creator,
        title: getTitleLogs(data, false),
        description: getDescriptionLogs(type, newData, false)
    }

    return log
}

const getTitleLogs = (data, isUnit) => {
    const { type, organizationalUnit, month, employee, copyKpi } = data
    let monthIso = new Date(month)
    let monthIsoCopy = copyKpi?.date && new Date(copyKpi.date)
    let tail = "", copyTail = ""
    
    if (isUnit) {
        tail = organizationalUnit?.name + " tháng " + (monthIso?.getMonth() + 1) + "-" + monthIso?.getFullYear()
        copyTail = copyKpi?.organizationalUnit?.name + " tháng " + (monthIsoCopy?.getMonth() + 1) + "-" + monthIsoCopy?.getFullYear()
    } else {
        tail = employee?.name + " tháng " + (monthIso?.getMonth() + 1) + "-" + monthIso?.getFullYear() + " của " + organizationalUnit?.name
        
        if (type === "copy_kpi_unit_to_employee") {
            copyTail = copyKpi?.organizationalUnit?.name + " tháng " + (monthIsoCopy?.getMonth() + 1) + "-" + monthIsoCopy?.getFullYear()
        } else {
            copyTail = copyKpi?.creator?.name + " tháng " + (monthIsoCopy?.getMonth() + 1) + "-" + monthIsoCopy?.getFullYear() + " của " + organizationalUnit?.name
        }
    }

    switch (type) {
        case "create":
            return "Khởi tạo KPI " + tail
        case "edit_kpi_set":
            return "Chỉnh sửa KPI " + tail
        case "edit_kpi":
            return "Chỉnh sửa mục tiêu KPI " + tail
        case "add_kpi":
            return "Thêm mục tiêu KPI " + tail
        case "delete_kpi": 
            return "Xóa mục tiêu KPI " + tail
        case "approval_all": 
            return "Phê duyệt tất cả mục tiêu KPI " + tail
        case "set_point_all":
            return `
                <div>Tính điểm toàn bộ mục tiêu KPI ${tail}</div>
            `
        case "set_point_kpi":
            return "Tính điểm mục tiêu KPI " + tail
        case "edit_status":
            return "Chỉnh sửa trạng thái KPI " + tail
        case "edit_status_kpi":
            return "Phê duyệt mục tiêu KPI " + tail
        case "copy_kpi_unit_to_unit":
        case "copy_kpi_unit_to_employee":
        case "copy_kpi_employee_to_employee":
            return `Khởi tạo KPI ${tail} được sao chép từ KPI ${copyTail}`
        default:
            return null
    }
}

const getDescriptionLogs = (type, newData, isUnit) => {
    switch (type) {
        case "create":
        case "copy_kpi_unit_to_unit":
        case "copy_kpi_unit_to_employee":
        case "copy_kpi_employee_to_employee":
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
                <div>Mục tiêu chỉnh sửa: ${newData?.name}</div>
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
        case "approval_all": 
            return `
                <div>Trạng thái mới: ${formatStatusEmployeeKpiSet(newData?.status)}</div>
            `
        case "set_point_all":
            return `
                <div>Điểm tự động: ${newData?.automaticPoint}</div>
                <div>Điểm tự đánh giá: ${newData?.employeePoint}</div>
                <div>Điểm người phê duyệt đánh giá: ${newData?.approvedPoint}</div>
            `
        case "set_point_kpi":
            return `
                <div>Mục tiêu: ${newData?.name}</div>
                <div>Điểm tự động: ${newData?.automaticPoint}</div>
                <div>Điểm tự đánh giá: ${newData?.employeePoint}</div>
                <div>Điểm người phê duyệt đánh giá: ${newData?.approvedPoint}</div>
            `
        case "edit_status":
            return `
                <div>Trạng thái mới: ${isUnit ? formatStatusOrganizationalUnitKpiSet(newData?.status) : formatStatusEmployeeKpiSet(newData?.status)}</div>
            `
        case "edit_status_kpi":
            return `
                <div>Mục tiêu: ${newData?.name}</div>
                <div>Trạng thái mục tiêu mới: ${formatStatusEmployeeKpi(newData?.status)}</div>
            `
        default:
            return null
    }
}

const formatStatusEmployeeKpi = (status) => {
    switch (status) {
        case 0:
            return "Yêu cầu làm lại"
        case 1: 
            return "Đã kích hoạt"
        case 2:
            return "Đã kết thúc"
        default:
            return "Chưa phê duyệt"
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