import { getFormatDateFromTime } from '../../../../helpers/stringMethod';

/** Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
export const convertDataToExportData = (translate, currentTasks, fileName) => {
    let data = JSON.parse(JSON.stringify(currentTasks));

    if (data?.length > 0) {
        data = data.map((item, index) => {
            let responsibleEmployees = "", accountableEmployees = "", responsibleEmployeesaEmail= "", accountableEmployeesEmail = "";
            item.responsibleEmployees?.length > 0 && item.responsibleEmployees.map((employee, index) => {
                if (index > 0) {
                    responsibleEmployees = responsibleEmployees + ", ";
                    responsibleEmployeesaEmail = responsibleEmployeesaEmail + ", "
                }
                responsibleEmployees = responsibleEmployees + employee?.name;
                responsibleEmployeesaEmail = responsibleEmployeesaEmail + employee?.email;
            })
            item.accountableEmployees?.length > 0 && item.accountableEmployees.map((employee, index) => {
                if (index > 0) {
                    accountableEmployees = accountableEmployees + ", ";
                    accountableEmployeesEmail = accountableEmployeesEmail + ", ";
                }
                accountableEmployees = accountableEmployees + employee?.name;
                accountableEmployeesEmail = accountableEmployeesEmail + employee?.email;
            })
            return {
                STT: index + 1,
                ID: item?._id,
                name: item?.name,
                description: item?.description,
                parent: item?.parent?.name,
                organizationalUnit: item?.organizationalUnit?.name,
                project: item?.project,
                priority: formatPriority(translate, item?.priority),
                priorityCode: formatPriorityCode(translate, item?.priority),
                responsibleEmployees: responsibleEmployees,
                responsibleEmployeesaEmail: responsibleEmployeesaEmail,
                accountableEmployees: accountableEmployees,
                accountableEmployeesEmail: accountableEmployeesEmail,
                creator: item?.creator?.name,
                startDate: getFormatDateFromTime(item?.startDate, 'dd-mm-yyyy'),
                endDate: getFormatDateFromTime(item?.endDate, 'dd-mm-yyyy'),
                status: formatStatus(translate, item?.status),
                statusCode: formatStatusCode(translate, item?.status),
                progress: item?.progress ? item?.progress + "%" : "0%",
                totalLoggedTime: getTotalTimeSheetLogs(item?.timesheetLogs),
            };
        })
    }

    let exportData = {
        fileName: fileName,
        dataSheets: [
            {
                sheetName: "sheet1",
                sheetTitle: fileName,
                tables: [
                    {
                        columns: [
                            { key: "STT", value: "STT" },
                            { key: "ID", value: "ID" },
                            { key: "name", value: "Tên công việc" },
                            { key: "description", value: "Mô tả" },
                            { key: "parent", value: "Công việc cha" },
                            { key: "organizationalUnit", value: "Đơn vị quản lý" },
                            { key: "project", value: "Dự án" },
                            { key: "priority", value: "Độ ưu tiên" },
                            { key: "priorityCode", value: "Mã độ ưu tiên" },
                            { key: "responsibleEmployees", value: "Người thực hiện" },
                            { key: "responsibleEmployeesaEmail", value: "Email người thực hiện" },
                            { key: "accountableEmployees", value: "Người phê duyệt" },
                            { key: "accountableEmployeesEmail", value: "Email người phê duyệt" },
                            { key: "creator", value: "Người thiết lập" },
                            { key: "startDate", value: "Ngày bắt đầu" },
                            { key: "endDate", value: "Ngày kết thúc" },
                            { key: "status", value: "Trạng thái" },
                            { key: "statusCode", value: "Mã trạng thái" },
                            { key: "progress", value: "Tiến độ" },
                            { key: "totalLoggedTime", value: "Thời gian thực hiện" }
                        ],
                        data: data
                    }
                ]
            },
        ]
    }

    return exportData;
}

export const getTotalTimeSheetLogs = (timesheetLogs) => {
    let totalTime = timesheetLogs.reduce(function (tong, cur) {
        if (cur.stoppedAt && cur.acceptLog) return tong + cur.duration;
        else return tong;
    }, 0);
    let tt = convertTime(totalTime);

    return tt;
}

const convertTime = (ms) => {
    if (!ms) return '00:00:00';
    let hour = Math.floor(ms / (60 * 60 * 1000));
    let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
    let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

    return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
}

export const formatPriority = (translate, data) => {
    if (data === 1) return translate('task.task_management.low');
    if (data === 2) return translate('task.task_management.average');
    if (data === 3) return translate('task.task_management.standard');
    if (data === 4) return translate('task.task_management.high');
    if (data === 5) return translate('task.task_management.urgent');
}

export const formatPriorityCode = (translate, data) => {
    if (data === 1) return "LOW";
    if (data === 2) return "AVERAGE";
    if (data === 3) return "STANDARD";
    if (data === 4) return "HIGH";
    if (data === 5) return "URGENT";
}

export const formatStatus = (translate, data) => {
    if (data === "inprocess") return translate('task.task_management.inprocess');
    else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
    else if (data === "finished") return translate('task.task_management.finished');
    else if (data === "delayed") return translate('task.task_management.delayed');
    else if (data === "canceled") return translate('task.task_management.canceled');
    else if (data === "requested_to_close") return translate('task.task_management.requested_to_close');
}

export const formatStatusCode = (translate, data) => {
    if (data === "inprocess") return "INPROCESS";
    else if (data === "wait_for_approval") return "WAIT_FOR_APPROVAL";
    else if (data === "finished") return "FINISHED";
    else if (data === "delayed") return "DELAYED";
    else if (data === "canceled") return "CANCELED";
    else if (data === "requested_to_close") return "REQUESTED_TO_CLOSE";
}
