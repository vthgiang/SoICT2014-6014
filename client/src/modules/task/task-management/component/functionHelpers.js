import { getFormatDateFromTime } from '../../../../helpers/stringMethod';

/** Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
export const convertDataToExportData = (translate, currentTasks, fileName) => {
    let data = JSON.parse(JSON.stringify(currentTasks));

    if (data?.length > 0) {
        data = data.map((item, index) => {
            let responsibleEmployees = "", accountableEmployees = "";
            item.responsibleEmployees?.length > 0 && item.responsibleEmployees.map((employee, index) => {
                if (index > 0) {
                    responsibleEmployees = responsibleEmployees + ", "
                }
                responsibleEmployees = responsibleEmployees + employee?.name;
            })
            item.accountableEmployees?.length > 0 && item.accountableEmployees.map((employee, index) => {
                if (index > 0) {
                    accountableEmployees = accountableEmployees + ", "
                }
                accountableEmployees = accountableEmployees + employee?.name;
            })
            return {
                STT: index + 1,
                name: item?.name,
                description: item?.description,
                parent: item?.parent?.name,
                organizationalUnit: item?.organizationalUnit?.name,
                project: item?.project,
                priority: formatPriority(translate, item?.priority),
                responsibleEmployees: responsibleEmployees,
                accountableEmployees: accountableEmployees,
                creator: item?.creator?.name,
                startDate: getFormatDateFromTime(item?.startDate, 'dd-mm-yyyy'),
                endDate: getFormatDateFromTime(item?.endDate, 'dd-mm-yyyy'),
                status: formatStatus(translate, item?.status),
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
                            { key: "name", value: "Tên công việc" },
                            { key: "description", value: "Mô tả" },
                            { key: "parent", value: "Công việc cha" },
                            { key: "organizationalUnit", value: "Đơn vị quản lý" },
                            { key: "project", value: "Dự án" },
                            { key: "priority", value: "Độ ưu tiên" },
                            { key: "responsibleEmployees", value: "Người thực hiện" },
                            { key: "accountableEmployees", value: "Người phê duyệt" },
                            { key: "creator", value: "Người thiết lập" },
                            { key: "startDate", value: "Ngày bắt đầu" },
                            { key: "endDate", value: "Ngày kết thúc" },
                            { key: "status", value: "Trạng thái" },
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

export const formatStatus = (translate, data) => {
    if (data === "inprocess") return translate('task.task_management.inprocess');
    else if (data === "wait_for_approval") return translate('task.task_management.wait_for_approval');
    else if (data === "finished") return translate('task.task_management.finished');
    else if (data === "delayed") return translate('task.task_management.delayed');
    else if (data === "canceled") return translate('task.task_management.canceled');
}
