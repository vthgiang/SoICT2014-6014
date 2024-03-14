const OrganizationalUnitService = require('../services/super-admin/organizationalUnit')
const AnnualLeaveService = require('../services/human-resource/annualLeave');
const TaskManagementService = require('../services/task/task-management/task');

const dayjs = require('dayjs');

const formatDateHasDay = (date, yearMonthDay = false) => {
    if (date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (yearMonthDay === true) {
            return [year, month, day].join('-');
        } else return [day, month, year].join('-');
    }
    return date;
}

const getDays = () => {
    const days = [];
    const dateNow = new Date();
    for (let i = 1; i <= 13; i++) {
        if (i !== 7) {
            days.push(new Date())
        } else {
            days.push(formatDateHasDay(new Date(), true))
        }
    }
    for (let i = 0; i < 6; i++) {
        days[i] = formatDateHasDay(days[i].setDate(dateNow.getDate() - 6 + i), true)
        days[days.length - 1 - i] = formatDateHasDay(days[days.length - 1 - i].setDate(dateNow.getDate() + 6 - i), true)
    }
    return days
}

const isEqualDate = (date1, date2) => {
    const pathDate1 = formatDateHasDay(date1, true)
    const pathDate2 = formatDateHasDay(date2, true)
    if (!pathDate1 || !pathDate2) {
        return false
    }
    if (new Date(pathDate1).getTime() === new Date(pathDate2).getTime()) {
        return true
    }
    return false
}

/**
 * Lấy dữ liệu bảng tin đơn vị
 * @data dữ liệu từ params
 * @companyId id công ty
 */
exports.getAllUnitDashboardData = async (portal, data, companyId) => {
    Object.keys(data).forEach((key) => {
        data[key] = JSON.parse(data[key])
    });
    const chartArr = Object.keys(data);
    let result = {};
    let list = [];
    let unit = [];

    let organizationalUnits = data['common-params'].organizationalUnits;
    let currentDate = data['common-params'].currentDate;
    let startMonth = data['common-params'].month;
    let endMonth = data['common-params'].month;

    let partDate = currentDate.split('-');
    let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

    if (organizationalUnits === 'allUnit') {
        list = await OrganizationalUnitService.getOrganizationalUnits(portal, companyId);
        unit = list.map(item => item?._id.toString())
    }
    else unit = organizationalUnits;

    if (chartArr.includes('urgent-task') || chartArr.includes('need-to-do-task')) {
        let organizationUnitTasksChartData = await getOrganizationUnitTasksChartData(portal, unit, newDate);

        result['urgent-task'] = organizationUnitTasksChartData['urgent-task'];
        result['need-to-do-task'] = organizationUnitTasksChartData['need-to-do-task'];
    }

    if (chartArr.includes('annual-leave-chart-and-table')) {
        let annualLeaveChartAndTableData = await getAnnualLeaveChartAndTableData(portal, unit);
        result['annual-leave-chart-and-table'] = annualLeaveChartAndTableData;
    }

    if (chartArr.includes('load-task-organization-chart')) {
        let loadTaskOrganizationChartData = await getLoadTaskOrganizationChartData(portal, companyId, unit, startMonth, endMonth);
        result['load-task-organization-chart'] = loadTaskOrganizationChartData
    }

    if (chartArr.includes('statistics-task-units')) {
        let statisticsTaskUnitsData = await getStatisticsTaskUnitsData(portal, companyId, unit, startMonth, endMonth);
        result['statistics-task-units'] = statisticsTaskUnitsData
    }

    result['statistics-kpi-units'] = {};
    return result;
}

/**
 * Lấy dữ liệu cho biểu đồ công việc khẩn cấp và cần làm
 * @organizationalUnitId danh sách id của các đơn vị
 * @date ngày đặt làm mốc
 */
const getOrganizationUnitTasksChartData = async (portal, organizationalUnitId, date) => {
    let result = {}
    let organizationUnitTasksChartData = await TaskManagementService.getAllTaskByPriorityOfOrganizationalUnit(portal, {
        organizationalUnitId: organizationalUnitId,
        date: date,
    });
    let taskNeedToDoPieChartAxis = [], taskNeedToDoPieChartData = [], urgentPieChartDataAxis = [], urgentPieChartDataData = [];
    let taskUrgent = organizationUnitTasksChartData.urgent.map(obj => ({
        _id: obj._id,
        name: obj.name,
        organizationalUnit: obj.organizationalUnit
    }));

    let taskNeedTodo = organizationUnitTasksChartData.taskNeedToDo.map(obj => ({
        _id: obj._id,
        name: obj.name,
        organizationalUnit: obj.organizationalUnit
    }));

    // convert công việc khẩn cấp qua dạng c3js
    if (taskUrgent && taskUrgent.length > 0) {
        let result1 = organizationUnitTasksChartData.urgent.reduce((total, value) => {
            if (value?.organizationalUnit?.name) {
                total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
            }

            return total;
        }, [])

        for (let key in result1) {
            urgentPieChartDataAxis.push(key)
            urgentPieChartDataData.push(result1[key])
        }
    }

    // convert công việc cần làm qua dạng c3js
    if (taskNeedTodo && taskNeedTodo.length > 0) {
        let result2 = organizationUnitTasksChartData.taskNeedToDo.reduce((total, value) => {
            if (value?.organizationalUnit?.name) {
                total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
            }

            return total;
        }, [])

        for (let key in result2) {
            taskNeedToDoPieChartAxis.push(key)
            taskNeedToDoPieChartData.push(result2[key])
        }
    }

    result['urgent-task'] = {
        tasks: taskUrgent,
        urgentPieChartDataAxis,
        urgentPieChartDataData
    };

    result['need-to-do-task'] = {
        tasks: taskNeedTodo,
        taskNeedToDoPieChartAxis,
        taskNeedToDoPieChartData
    };

    return result
}

/**
 * Lấy dữ liệu cho biểu đồ xu hướng nghỉ phép
 * @organizationalUnits danh sách các đơn vị
 */
const getAnnualLeaveChartAndTableData = async (portal, organizationalUnits) => {
    let beforeAndAfterOneWeeks = await AnnualLeaveService.getAnnaulLeaveBeforAndAfterOneWeek(portal, organizationalUnits);
    let beforeAndAfterOneWeeksData = JSON.parse(JSON.stringify(beforeAndAfterOneWeeks));

    let arrDay = getDays();
    let data1 = arrDay.map(x => 0), data2 = arrDay.map(x => 0);
    if (beforeAndAfterOneWeeksData.length) {
        data1 = arrDay.map(x => {
            let count = 0;
            beforeAndAfterOneWeeksData.forEach(y => {
                if (isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) {
                    count++
                }
            })
            return count
        })

        data2 = arrDay.map(x => {
            let count = 0;
            beforeAndAfterOneWeeksData.forEach(y => {
                if ((isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) && y.status === 'approved') {
                    count++
                }
            })
            return count
        })
    }

    return {
        annualLeaveChartAndTableData: { ratioX: arrDay, nameData1: 'Số đơn xin nghỉ', data1: data1, nameData2: 'Số đơn được duyệt', data2: data2 },
        beforeAndAfterOneWeeks: beforeAndAfterOneWeeksData
    }
}

/**
 * Lấy dữ liệu cho biểu đồ tải công việc
 * @companyId id công ty
 * @organizationalUnitId danh sách id các đơn vị
 * @startMonth tháng bắt đầu
 * @endMonth tháng kết thúc
 */
const getLoadTaskOrganizationChartData = async (portal, companyId, organizationalUnitId, startMonth, endMonth) => {
    let dataLoadTask = [], month = [], monthArr = [];
    let allUnit = await OrganizationalUnitService.getOrganizationalUnits(portal, companyId);
    let organizationUnitTasksInMonth = await TaskManagementService.getAllTaskOfOrganizationalUnitByMonth(portal, {
        organizationalUnitId: organizationalUnitId,
        startMonth: startMonth,
        endMonth: endMonth,
    });
    let newData = [];
    let taskList = organizationUnitTasksInMonth['tasks'];
    if (taskList?.length > 0) {
        let startTime = new Date(startMonth.split('-')[0], startMonth.split('-')[1] - 1, 1);
        let endTime = new Date(endMonth.split('-')[0], endMonth.split('-')[1] ? endMonth.split('-')[1] : 1, 1);
        let m = startMonth.slice(5, 7);
        let y = startMonth.slice(0, 4);
        let period = Math.round((endTime - startTime) / 2592000000);
        let array = [];
        for (let i = 0; i < period; i++) {
            month.push(dayjs([y, m].join('-')).format('M-YYYY'));
            monthArr.push(dayjs([y, m].join('-')).format('YYYY-MM-DD'))
            m++;
            array[i] = 0;
        }
        for (let i in organizationalUnitId) {
            dataLoadTask[i] = [];
            array.fill(0, 0);
            let findUnit = allUnit.find(elem => (elem._id.toString() === organizationalUnitId[i]))
            if (findUnit) {
                dataLoadTask[i].push(findUnit.name);
            }

            for (let k in taskList) {
                if (taskList[k].organizationalUnit._id.toString() === organizationalUnitId[i]) {
                    let inprocessDay = 0;
                    let startDate = new Date(taskList[k].startDate);
                    let endDate = new Date(taskList[k].endDate);

                    if (startTime < endDate) {
                        for (let j = 0; j < period; j++) {
                            let tmpStartMonth = new Date(parseInt(month[j].split('-')[1]), parseInt(month[j].split('-')[0]) - 1, 1);
                            let tmpEndMonth = new Date(parseInt(month[j].split('-')[1]), parseInt(month[j].split('-')[0]), 0);

                            if (tmpStartMonth > startDate && tmpEndMonth < endDate) {
                                inprocessDay = tmpEndMonth.getDate();
                            }
                            // thang dau
                            else if (tmpStartMonth < startDate && tmpEndMonth > startDate) {
                                inprocessDay = tmpEndMonth.getDate() - startDate.getDate();
                            }
                            else if (tmpStartMonth < endDate && endDate < tmpEndMonth) {
                                inprocessDay = endDate.getDate();
                            }
                            else {
                                inprocessDay = 0;
                            }
                            array[j] += Math.round(inprocessDay /
                                (taskList[k].accountableEmployees.length + taskList[k].consultedEmployees.length + taskList[k].responsibleEmployees.length))
                        }

                    }
                }

            }
            dataLoadTask[i] = [...dataLoadTask[i], ...array];
            newData.push(dataLoadTask[i])
        }
    }

    let result = {
        dataChart: newData,
        legend: dataLoadTask?.map(item => item[0])
    }
    return result
}

/**
 * Lấy dữ liệu cho biểu đồ thống kê điểm công việc
 * @organizationalUnitId danh sách id các đơn vị
 * @companyId id công ty
 * @startMonth tháng bắt đầu
 * @endMonth tháng kết thúc
 */
const getStatisticsTaskUnitsData = async (portal, companyId, organizationalUnitId, startMonth, endMonth) => {
    let organizationUnitTasksInMonth = await TaskManagementService.getAllTaskOfOrganizationalUnitByMonth(portal, {
        organizationalUnitId: organizationalUnitId,
        startMonth: startMonth,
        endMonth: endMonth,
    });

    let statisticsTaskUnits = [];
    let listTask = JSON.parse(JSON.stringify(organizationUnitTasksInMonth?.tasks));
    let allUnit = await OrganizationalUnitService.getOrganizationalUnits(portal, companyId);
    let findUnit = allUnit.map(elem => { 
        if (organizationalUnitId.includes( elem._id.toString())) {
            return elem;
        }

        else return null;
    }).filter(elem => elem !== null);

    statisticsTaskUnits = findUnit.map(unit => {
        let tasks = listTask?.filter(task => unit._id.toString() === task?.organizationalUnit?._id.toString()).map(item => {
            return {
                ...item,
                detailOrganizationalUnit: [{
                    name: item?.organizationalUnit?.name   // dùng cho modal hiển thị danh sách CV
                }]
            }
        });

        let totalPoint = 0, totalDays = 0;
        let currentMonth = new Date(startMonth.split('-')[0], startMonth.split('-')[1] - 1)
        let nextMonth = new Date(startMonth.split('-')[0], startMonth.split('-')[1] - 1)
        nextMonth.setMonth(nextMonth.getMonth() + 1)

        if (tasks?.length > 0) {
            tasks.map(task => {
                //  Loc danh gia theo thang
                if (task?.evaluations?.length > 0) {
                    task.evaluations.filter(evaluation => {
                        if (new Date(evaluation.evaluatingMonth) < nextMonth && new Date(evaluation.evaluatingMonth) >= currentMonth) {
                            return 1;
                        }
            
                        return 0;
                    }).map(eva => {
                        let startDate = new Date(eva?.startDate)
                        let endDate = new Date(eva?.endDate)

                        let days = (endDate?.getTime() - startDate.getTime())/(24*3600*1000) 
                        totalPoint = totalPoint + (eva?.results?.[0]?.automaticPoint ?? 0) * (days && !isNaN(days) ? days : 0)
                        totalDays = totalDays + (days && !isNaN(days) ? days : 0)
                    })
                }
            })
        }

        let pointShow = totalDays ? Math.round(totalPoint/totalDays) : null
        return {
            parent_id: unit?.parent? unit.parent.toString(): null,
            id: unit?._id.toString(),
            organizationalUnitName: unit?.name,
            tasks: tasks,
            pointShow: pointShow
        }
    })

    return {
        statisticsTaskUnits: statisticsTaskUnits,
    }
}
