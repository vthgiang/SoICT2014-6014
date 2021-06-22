import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { DataTableSetting, ExportExcel, DatePicker, SelectBox, PaginateBar, SelectMulti, ToolTip } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { ROOT_ROLE } from '../../../../../helpers/constants';

import { UserActions } from "../../../../super-admin/user/redux/actions";
import { managerActions } from '../../../organizational-unit/management/redux/actions';
import { kpiMemberActions } from '../redux/actions';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { EmployeeKpiApproveModal } from './employeeKpiApproveModal';
import { EmployeeKpiEvaluateModal } from './employeeKpiEvaluateModal';
import { showWeeklyPoint } from '../../../employee/management/component/functionHelpers'

function EmployeeKpiManagement(props) {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    let d = new Date(),
        month = d.getMonth() + 1,
        year = d.getFullYear();
    let startMonth, endMonth, startYear;

    if (month > 1) {
        startMonth = month - 1;
        startYear = year;
    } else {
        startMonth = month - 1 + 12;
        startYear = year - 1;
    }
    if (startMonth < 10)
        startMonth = '0' + startMonth;
    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const tableId = "table-employee-kpi-management";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;
    const stateFromEmployeeKpiEvaluationDashboard = JSON.parse(localStorage.getItem("stateFromEmployeeKpiEvaluationDashboard"));
    localStorage.removeItem("stateFromEmployeeKpiEvaluationDashboard");

    const [state, setState] = useState({
        tableId,
        commenting: false,
        userId: '',
        approver: '',
        status: stateFromEmployeeKpiEvaluationDashboard?.status ?? -1,
        startDate: stateFromEmployeeKpiEvaluationDashboard?.startDate ?? [startYear, startMonth].join('-'),
        endDate: stateFromEmployeeKpiEvaluationDashboard?.endDate ?? [year, endMonth].join('-'),
        infosearch: {
            role: localStorage.getItem("currentRole"),
            user: '',
            status: stateFromEmployeeKpiEvaluationDashboard?.status ?? -1,
            startDate: stateFromEmployeeKpiEvaluationDashboard?.startDate ?? [startYear, startMonth].join('-'),
            endDate: stateFromEmployeeKpiEvaluationDashboard?.endDate ?? [year, endMonth].join('-'),
            perPage: limit,
            page: 1
        },
        startDateDefault: stateFromEmployeeKpiEvaluationDashboard?.startDateDefault ?? [startMonth, startYear].join('-'),
        endDateDefault: stateFromEmployeeKpiEvaluationDashboard?.endDateDefault ?? [endMonth, year].join('-'),
        showApproveModal: null,
        showEvaluateModal: null,
        dataStatus: DATA_STATUS.NOT_AVAILABLE,

        organizationalUnitSelectBox: null,
        organizationalUnit: stateFromEmployeeKpiEvaluationDashboard?.organizationalUnit ?? []
    });

    const { user, kpimembers, dashboardEvaluationEmployeeKpiSet } = props;
    const { translate } = props;
    const { status, kpiId, employeeKpiSet, startDate, endDate,
        perPage, userId, startDateDefault, employeeKpiSetApprove,
        endDateDefault, organizationalUnit, 
        approver, infosearch, organizationalUnitSelectBox
    } = state;

    useEffect(() => {
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));
    }, []);

    useEffect(() => {
        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (!props.kpimembers?.tasksList || !props.kpimembers?.kpimembers || !props.managerKpiUnit?.kpis) {
            } else {
                let exportData = convertDataToExportTotalData(props.kpimembers, props.managerKpiUnit);
                if (exportData) ExportExcel.export(exportData);

                setState({
                    ...state,
                    dataStatus: DATA_STATUS.FINISHED,
                });
            }
        }
    });

    useEffect(() => {
        let childrenOrganizationalUnit = [], queue = [], currentOrganizationalUnit;

        // Khởi tạo selectbox đơn vị
        if (dashboardEvaluationEmployeeKpiSet) {
            currentOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        }
        if (currentOrganizationalUnit) {
            childrenOrganizationalUnit.push(currentOrganizationalUnit);
            queue.push(currentOrganizationalUnit);
            while (queue.length > 0) {
                let v = queue.shift();
                if (v.children) {
                    for (let i = 0; i < v.children.length; i++) {
                        let u = v.children[i];
                        queue.push(u);
                        childrenOrganizationalUnit.push(u);
                    }
                }
            }
        }

        if (state?.organizationalUnit?.length > 0 || childrenOrganizationalUnit?.[0]?.id) {
            let unit = state?.organizationalUnit?.length > 0 ? state?.organizationalUnit : [childrenOrganizationalUnit?.[0]?.id]
            
            setState({
                ...state,
                organizationalUnitSelectBox: childrenOrganizationalUnit,
                organizationalUnit: unit,
                approver: '',
                userId: ''
            })
            props.getEmployeeKPISets({
                ...infosearch,
                organizationalUnit: unit
            });
            props.getAllEmployeeOfUnitByIds({
                organizationalUnitIds: unit,
                perPage: 10000,
                page: 1
            });
        }
    }, [dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit])

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const formatTaskStatus = (translate, status) => {
        switch (status) {
            case "inprocess":
                return translate('task.task_management.inprocess');
            case "wait_for_approval":
                return translate('task.task_management.wait_for_approval');
            case "finished":
                return translate('task.task_management.finished');
            case "delayed":
                return translate('task.task_management.delayed');
            default: //cancel
                return translate('task.task_management.canceled');
        }
    };

    const checkStatusKPI = (status) => {
        if (status === 0) {
            return "Đang thiết lập";
        } else if (status === 1) {
            return "Chờ phê duyệt";
        } else if (status === 2) {
            return "Đã kích hoạt";
        }
    };

    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnit: value,
            approver: '',
            userId: ''
        })
        props.getAllEmployeeOfUnitByIds({
            organizationalUnitIds: value,
            perPage: 10000,
            page: 1
        });
    };

    const handleApproverChange = (value) => {
        setState({
            ...state,
            approver: value
        })
    };

    const handleStartDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState({
            ...state,
            startDate: month
        });

    };

    const handleEndDateChange = (value) => {
        let month;
        if (value === '') {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        setState({
            ...state,
            endDate: month,
        });

    };

    const handleEmployeeChange = async (value) => {
        await setState({
            ...state,
            userId: value
        });
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0]
        });
    };

    const handleSearchData = async () => {
        await setState({
            ...state,
            infosearch: {
                ...state.infosearch,
                user: userId && userId[0] !== '0' ? userId : [],
                status: status && Number(status[0]),
                startDate: startDate !== "" ? startDate : null,
                endDate: endDate !== "" ? endDate : null,
                organizationalUnit: organizationalUnit,
                approver: approver && approver[0] !== '0' ? approver : [],
                page: 1
            },
            kpiId: null,
            employeeKpiSet: { _id: null },
        })

        let startdate, enddate;
        if (startDate && endDate) {
            startdate = new Date(startDate);
            enddate = new Date(endDate);
        }

        if (startdate && enddate && startdate.getTime() > enddate.getTime()) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        }
        else {
            props.getEmployeeKPISets({
                user: userId && userId[0] !== '0' ? userId : [],
                status: status && Number(status),
                startDate: startDate !== "" ? startDate : null,
                endDate: endDate !== "" ? endDate : null,
                organizationalUnit: organizationalUnit,
                approver: approver && approver[0] !== '0' ? approver : [],
                page: 1
            });
        }
    };

    const handleShowApproveModal = async (item) => {
        await setState({
            ...state,
            kpiId: item?._id,
            employeeKpiSetApprove: item
        })
        window.$(`modal-approve-KPI-member`).modal('show');
    };

    const showEvaluateModal = async (item) => {
        await setState({
            ...state,
            employeeKpiSet: item
        })
        window.$(`employee-kpi-evaluation-modal`).modal('show');
    };

    const handleExportTotalData = () => {
        let kpimember;
        const { kpimembers } = props;
        if (kpimembers.kpimembers) {
            kpimember = kpimembers.kpimembers
        }
        let data = kpimember && kpimember.map(item => {
            return item._id;
        })
        props.getTaskByListKpis(data);
        props.getAllKPIUnit({
            role: localStorage.getItem("currentRole"),
            status: -1,
            startDate: null,
            endDate: null
        })

        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        });
    };

    const setLimit = async (limit) => {
        if (Number(limit) !== state?.infosearch?.limit) {
            await setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    perPage: Number(limit)
                }
            })

            props.getEmployeeKPISets({
                ...infosearch,
                perPage: Number(limit)
            });
        }
    }

    const handleGetDataPagination = async (index) => {
        await setState({
            ...state,
            infosearch: {
                ...state.infosearch,
                page: index
            }
        })

        props.getEmployeeKPISets({
            ...infosearch,
            page: index
        });
    };

    const pushDataIntoTable = (dataOfOneSheet) => {
        let tables = [], table = [], names = [], organizationalUnits = [], kpiSetApproverPoint = [], kpiSetAutomaticPoint = [], kpiSetEmployeePoint = [], kpiNum = [], numTask = 0, row;

        for (let i = 0; i < dataOfOneSheet.data.length; i++) {
            names.push(dataOfOneSheet.data[i].name);
            organizationalUnits.push(dataOfOneSheet.data[i].organizationalUnit);
            kpiSetApproverPoint.push(dataOfOneSheet.data[i].kpiSetApproverPoint);
            kpiSetAutomaticPoint.push(dataOfOneSheet.data[i].kpiSetAutomaticPoint);
            kpiSetEmployeePoint.push(dataOfOneSheet.data[i].kpiSetEmployeePoint);
            kpiNum.push(dataOfOneSheet.data[i].kpiNum)
            table = [];
            let kpis = dataOfOneSheet.data[i].kpis;
            let tasks = dataOfOneSheet.data[i].oneKpiSetTasks;

            for (let k = 0; k < kpis.length; k++) {
                let numberRowToMerge = parseInt(tasks[k].length);
                numTask += numberRowToMerge;
                let task = tasks[k];
                //khi 1 Kpis chưa có công việc nào hoặc chỉ có 1 công việc
                if (numberRowToMerge < 2) {
                    row = {
                        STT: k + 1,
                        kpiName: kpis[k].name,
                        kpiWeight: kpis[k].weight,
                        kpiAutomaticPoint: kpis[k].automaticPoint,
                        kpiEmployeePoint: kpis[k].employeePoint,
                        kpiApprovedPoint: kpis[k].approverPoint,
                        kpiStatus: kpis[k].status,
                        taskName: task[0] ? (task[0].name) : "",
                        unit: task[0] ? (task[0].unit) : "",
                        importantLevel: task[0] ? task[0].importantLevel : "",
                        contributionPoint: task[0] ? task[0].contributionPoint : "",
                        automaticPoint: task[0] ? task[0].automaticPoint : "",
                        employeePoint: task[0] ? task[0].employeePoint : "",
                        approverPoint: task[0] ? task[0].approverPoint : "",
                        startTaskDate: task[0] ? task[0].startTaskDate : "",
                        endTaskDate: (task[0]) ? task[0].endTaskDate : "",
                        startApproveDate: task[0] ? task[0].startApproveDate : "",
                        endApproveDate: task[0] ? task[0].endApproveDate : "",
                        taskStatus: task[0] ? task[0].status : "",
                        progress: task[0] ? task[0].progress : "",

                    }
                    table.push(row);
                }
                else {
                    row = {
                        merges: {
                            STT: numberRowToMerge,
                            kpiName: numberRowToMerge,
                            kpiWeight: numberRowToMerge,
                            kpiAutomaticPoint: numberRowToMerge,
                            kpiEmployeePoint: numberRowToMerge,
                            kpiApprovedPoint: numberRowToMerge,
                            kpiStatus: numberRowToMerge
                        },
                        STT: k + 1,
                        kpiName: kpis[k].name,
                        kpiWeight: kpis[k].weight,
                        kpiAutomaticPoint: kpis[k].automaticPoint,
                        kpiEmployeePoint: kpis[k].employeePoint,
                        kpiApprovedPoint: kpis[k].approverPoint,
                        kpiStatus: kpis[k].status,
                        taskName: task[0].name,
                        unit: task[0].unit,
                        importantLevel: task[0].importantLevel,
                        contributionPoint: task[0].contributionPoint,
                        automaticPoint: task[0].automaticPoint,
                        employeePoint: task[0].employeePoint,
                        approverPoint: task[0].approverPoint,
                        startTaskDate: task[0].startTaskDate,
                        endTaskDate: task[0].endTaskDate,
                        startApproveDate: task[0].startApproveDate,
                        endApproveDate: task[0].endApproveDate,
                        taskStatus: task[0].status,
                        progress: task[0].progress
                    }
                    table.push(row);
                    for (let j = 1; j < (numberRowToMerge); j++) {
                        let row = {
                            STT: "",
                            kpiName: "",
                            kpiWeight: "",
                            kpiAutomaticPoint: "",
                            kpiEmployeePoint: "",
                            kpiApprovedPoint: "",
                            kpiStatus: "",
                            taskName: task[j].name,
                            unit: task[j].unit,
                            importantLevel: task[j].importantLevel,
                            contributionPoint: task[j].contributionPoint,
                            automaticPoint: task[j].automaticPoint,
                            employeePoint: task[j].employeePoint,
                            approverPoint: task[j].approverPoint,
                            startTaskDate: task[j].startTaskDate,
                            endTaskDate: task[j].endTaskDate,
                            startApproveDate: task[j].startApproveDate,
                            endApproveDate: task[j].endApproveDate,
                            taskStatus: task[j].status,
                            progress: task[j].progress
                        }
                        table.push(row);
                    }
                }
            }
            tables.push(table);
        }

        return {
            tables: tables,
            names: names,
            organizationalUnits: organizationalUnits,
            kpiSetApproverPoint,
            kpiSetAutomaticPoint,
            kpiSetEmployeePoint,
            kpiNum,
            numTask
        }
    }

    const convertDataToExportTotalData = (kpimembers, managerKpiUnit) => {
        let listTasks, listKpis, data = {}, convertedData = [], listKpiUnit = [], unitName = "";

        if (organizationalUnit?.length > 0 && organizationalUnitSelectBox?.length > 0) {
            if (organizationalUnit?.length > 1) {
                unitName = organizationalUnit?.length + " đơn vị"
            } else {
                let unit = organizationalUnitSelectBox.filter(item => organizationalUnit.includes(item?.id))

                unit.map(item => {
                    unitName = item?.name
                })
            }
        }

        if (kpimembers.tasksList) {
            listTasks = kpimembers.tasksList;
            listKpis = kpimembers.kpimembers;
        }
        if (managerKpiUnit) {
            listKpiUnit = managerKpiUnit.kpis;
        }

        if (listTasks && listKpis && listKpiUnit && unitName) {
            //Convert dữ liệu RAW
            for (let i = 0; i < listKpis.length; i++) {
                let d = new Date(listKpis[i].date),
                    month = (d.getMonth() + 1),
                    year = d.getFullYear(),
                    date = month + "-" + year;
                if (!data.hasOwnProperty(date)) {
                    data[date] = []
                }
                let kpiSetAutomaticPoint = (listKpis[i].automaticPoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].automaticPoint);
                let kpiSetEmployeePoint = (listKpis[i].employeePoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].employeePoint);
                let kpiSetApproverPoint = (listKpis[i].approvedPoint === null) ? "Chưa đánh giá" : parseInt(listKpis[i].approvedPoint);
                let kpiNum = listKpis[i].kpis.length;
                let kpis = listKpis[i].kpis.map((x, index) => {
                    let name = x.name;
                    let createdAt = new Date(x.createdAt);
                    let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                    let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                    let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                    let status = checkStatusKPI(x.status);
                    let criteria = x.criteria;
                    let weight = x.weight;

                    return {
                        STT: index + 1,
                        name: name,
                        criteria: criteria,
                        automaticPoint: automaticPoint,
                        status: status,
                        employeePoint: employeePoint,
                        approverPoint: approverPoint,
                        createdAt: createdAt,
                        weight: weight,
                    }
                });

                let oneKpiSetTasks = listTasks[i].map((item, index) => {
                    let oneKpiTasks = item.map((x, idx) => {
                        let name = x.name;
                        let startTaskD = new Date(x.startDate);
                        let endTaskD = new Date(x.endDate);
                        let startApproveD = new Date(x.preEvaDate);
                        let endApproveD = new Date(x.date);
                        let automaticPoint = (x?.results?.automaticPoint < 0) ? "Chưa đánh giá" : parseInt(x.results.automaticPoint);
                        let employeePoint = (x?.results?.employeePoint < 0) ? "Chưa đánh giá" : parseInt(x.results.employeePoint);
                        let approverPoint = (x?.results?.approvedPoint < 0) ? "Chưa đánh giá" : parseInt(x.results.approvedPoint);
                        let status = formatTaskStatus(translate, x.status);
                        let contributionPoint = parseInt(x.results.contribution);
                        let importantLevel = parseInt(x.results.taskImportanceLevel);
                        let progress = parseInt(x.progress);
                        let unit = x.unit && x.unit[0] && x.unit[0].name;

                        return {
                            STT: idx + 1,
                            name: name,
                            automaticPoint: automaticPoint,
                            status: status,
                            employeePoint: employeePoint,
                            approverPoint: approverPoint,
                            startTaskDate: startTaskD,
                            endTaskDate: endTaskD,
                            startApproveDate: startApproveD,
                            endApproveDate: endApproveD,
                            contributionPoint: contributionPoint,
                            importantLevel: importantLevel,
                            progress: progress,
                            unit: unit
                        };
                    })
                    return oneKpiTasks;
                })

                let oneSet = {
                    organizationalUnit: listKpis?.[i]?.organizationalUnit?.name,
                    name: listKpis?.[i]?.creator?.name,
                    oneKpiSetTasks: oneKpiSetTasks,
                    kpis: kpis,
                    kpiSetAutomaticPoint: kpiSetAutomaticPoint,
                    kpiSetEmployeePoint: kpiSetEmployeePoint,
                    kpiSetApproverPoint: kpiSetApproverPoint,
                    kpiNum: kpiNum
                }
                data[date].push(oneSet);
            }

            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                let temp = {
                    time: keys[i],
                    data: data[keys[i]],
                }
                convertedData.push(temp);
            }

            //Convert xong, push data theo form data của component ExportExcel
            let dataSheets = [], sheetInfo = [];
            for (let i = 0; i < listKpiUnit.length; i++) {
                let d = new Date(listKpiUnit[i].date),
                    time = (d.getMonth() + 1) + "-" + (d.getFullYear());
                let employeeNumber = parseInt(listKpiUnit[i].organizationalUnit.managers.length) + parseInt(listKpiUnit[i].organizationalUnit.deputyManagers.length) + parseInt(listKpiUnit[i].organizationalUnit.employees.length);
                let kpisUnitNumber = listKpiUnit[i].kpis.length;
                let automaticPoint = (listKpiUnit[i].automaticPoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].automaticPoint);
                let employeePoint = (listKpiUnit[i].employeePoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].employeePoint);
                let approverPoint = (listKpiUnit[i].approvedPoint === null) ? "Chưa đánh giá" : parseInt(listKpiUnit[i].approvedPoint);
                if (time === (convertedData?.[i]?.time)) {
                    let info = {
                        employeeNumber,
                        kpisUnitNumber,
                        automaticPoint,
                        employeePoint,
                        approverPoint
                    }
                    sheetInfo.push(info);
                }
            }
            for (let i = 0; i < convertedData.length; i++) {
                let tablesData = pushDataIntoTable(convertedData[i]);
                let temp = {
                    sheetName: convertedData[i].time,
                    sheetTitle: "Báo cáo tổng hợp " + unitName + " tháng " + convertedData[i].time,
                    tables: tablesData.tables,
                    names: tablesData.names,
                    organizationalUnits: tablesData.organizationalUnits,
                    kpiSetEmployeePoint: tablesData.kpiSetEmployeePoint,
                    kpiSetAutomaticPoint: tablesData.kpiSetAutomaticPoint,
                    kpiSetApproverPoint: tablesData.kpiSetApproverPoint,
                    kpiNum: tablesData.kpiNum,
                    numTask: tablesData.numTask
                }
                dataSheets.push(temp);
            }
            let exportData = {
                fileName: "Báo cáo tổng hợp ",
                dataSheets: dataSheets.map((item, idx) => {
                    return {
                        sheetName: item.sheetName,
                        sheetTitle: item.sheetTitle,
                        tables: item.tables.map((x, index) => {
                            return {
                                moreInform: [
                                    (index === 0) ? {
                                        title: "Thông tin chung KPI " + (unitName) + " " + item.sheetName,
                                        value: [
                                            "Số nhân viên: " + sheetInfo?.[idx]?.employeeNumber,
                                            "Số lượng KPI đơn vị: " + sheetInfo?.[idx]?.kpisUnitNumber,
                                            "Điểm KPI tự động của đơn vị: " + sheetInfo?.[idx]?.automaticPoint,
                                            "Điểm KPI tự đánh giá của đơn vị: " + sheetInfo?.[idx]?.employeePoint,
                                            "Điểm KPI được phê duyệt của đơn vị: " + sheetInfo?.[idx]?.approverPoint,
                                            "Số công việc được đánh giá: " + item?.numTask
                                        ]
                                    } : "",
                                    {
                                        title: "Báo cáo " + (item?.names?.[index] ? item.names[index] : "") + " của " + (item?.organizationalUnits?.[index] ? item.organizationalUnits[index] : "") + " " + item?.sheetName,
                                        value: [
                                            "Số KPI: " + item?.kpiNum?.[index],
                                            "Điểm KPI tự động: " + item?.kpiSetAutomaticPoint?.[index],
                                            "Điểm KPI tự đánh giá: " + item?.kpiSetEmployeePoint?.[index],
                                            "Điểm KPI được phê duyệt: " + item?.kpiSetApproverPoint?.[index]
                                        ]
                                    }],
                                merges: [{
                                    key: "kpiPoint",
                                    columnName: "Kết quả KPI",
                                    keyMerge: 'kpiAutomaticPoint',
                                    colspan: 3
                                }, {
                                    key: "taskInfomations",
                                    columnName: "Điểm công việc",
                                    keyMerge: 'automaticPoint',
                                    colspan: 3
                                },
                                {
                                    key: "taskTime",
                                    columnName: "Thời gian thực hiện công việc",
                                    keyMerge: 'startTaskDate',
                                    colspan: 2
                                }, {
                                    key: "taskApprovedTime",
                                    columnName: "Thời gian đánh giá công việc",
                                    keyMerge: 'startApproveDate',
                                    colspan: 2
                                }],
                                rowHeader: 2,
                                columns: [
                                    { key: "STT", value: "STT", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiName", value: "KPI", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiWeight", value: "Trọng số", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiStatus", value: "Trạng thái KPI", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiAutomaticPoint", value: "Tự động", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiEmployeePoint", value: "Tự đánh giá", vertical: 'center', horizontal: 'center' },
                                    { key: "kpiApprovedPoint", value: "Được phê duyệt", vertical: 'center', horizontal: 'center' },
                                    { key: "taskName", value: "Tên công việc" },
                                    { key: "unit", value: "Đơn vị quản lý công việc" },
                                    { key: "importantLevel", value: "Độ quan trọng" },
                                    { key: "contributionPoint", value: "% Đóng góp công việc" },
                                    { key: "automaticPoint", value: "Tự động" },
                                    { key: "employeePoint", value: "Tự đánh giá" },
                                    { key: "approverPoint", value: "Được phê duyệt" },
                                    { key: "startTaskDate", value: "Bắt đầu" },
                                    { key: "endTaskDate", value: "Kết thúc" },
                                    { key: "startApproveDate", value: "Bắt đầu" },
                                    { key: "endApproveDate", value: "Kết thúc" },
                                    { key: "taskStatus", value: "Trạng thái" },
                                    { key: "progress", value: "% Hoàn thành công việc" }
                                ],
                                data: x
                            }
                        })
                    }
                })
            }
            return exportData;
        }

    }

    /** Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data) => {
        let unitName, fileName;

        if (organizationalUnit?.length > 0 && organizationalUnitSelectBox?.length > 0) {
            if (organizationalUnit?.length > 1) {
                unitName = organizationalUnit?.length + " đơn vị"
            } else {
                let unit = organizationalUnitSelectBox.filter(item => organizationalUnit.includes(item?.id))

                unit.map(item => {
                    unitName = item?.name
                })
            }
        }
        fileName = "Bảng theo dõi KPI nhân viên " + (unitName ? unitName : "");

        if (data?.length > 0) {
            data = data.map((x, index) => {
                let organizationalUnit = x?.organizationalUnit?.name;
                let fullName = x?.creator?.name;
                let email = x?.creator?.email;
                let automaticPoint = (x?.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x?.automaticPoint);
                let employeePoint = (x?.employeePoint === null) ? "Chưa đánh giá" : parseInt(x?.employeePoint);
                let approverPoint = (x?.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x?.approvedPoint);
                let time = new Date(x?.date)
                let status = checkStatusKPI(x?.status);
                let numberTarget = parseInt(x?.kpis?.length);

                return {
                    STT: index + 1,
                    fullName: fullName,
                    organizationalUnit: organizationalUnit,
                    email: email,
                    automaticPoint: automaticPoint,
                    status: status,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    time: time,
                    numberTarget: numberTarget
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
                                { key: "time", value: "Thời gian" },
                                { key: "fullName", value: "Họ và tên" },
                                { key: "organizationalUnit", value: "Đơn vị" },
                                { key: "email", value: "Email nhân viên" },
                                { key: "numberTarget", value: "Số lượng mục tiêu" },
                                { key: "status", value: "Trạng thái mục tiêu" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }

        return exportData;
    }

    let userdepartments, kpimember, unitMembers, exportData, approverSelectBox = [];

    // Khởi tạo select box chọn nhân viên
    if (user?.employees?.length > 0) {
        unitMembers = user.employees.map(item => { 
            return {
                text: item?.userId?.name, 
                value: item?.userId?._id
            }
        })
        unitMembers.unshift({ text: translate('kpi.evaluation.employee_evaluation.choose_employee'), value: 0 })
    }

    // Khởi tạo select box chọn người phê duyệt
    if (user?.employees?.length > 0) {
        approverSelectBox = user.employees.filter(employee => { 
            let checkManager = false

            if (employee?.roleId?.length > 0) {
                employee.roleId.map(role => {
                    if (role?.parents?.length > 0) {
                        role.parents.map(parent => {
                            if (parent?.name === ROOT_ROLE.MANAGER) {
                                checkManager = true
                            }
                        })
                    }
                })
            }

            return checkManager
        }).map(employee => {
            return {
                text: employee?.userId?.name, 
                value: employee?.userId?._id
            }
        });
        approverSelectBox.unshift({ text: translate('manage_warehouse.bill_management.choose_approver'), value: 0 });
    }

    if (kpimembers.kpimembers) {
        kpimember = kpimembers.kpimembers;
    }
    if (kpimember) {
        exportData = convertDataToExportData(kpimember);
    }
    
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body">
                    <EmployeeKpiApproveModal id={kpiId} employeeKpiSet={employeeKpiSetApprove}/>
                    <EmployeeKpiEvaluateModal employeeKpiSet={employeeKpiSet} />

                    <div className="qlcv">
                        {/* Tìm kiếm theo đơn vị và trạng thái */}
                        <div className="form-inline hide-component">
                            <div className="form-group">
                                <label>{translate('task.task_management.department')}</label>
                                {organizationalUnitSelectBox && organizationalUnitSelectBox.length !== 0
                                    && <SelectMulti
                                        key="multiSelectUnitEmployeeKpiManagement"
                                        id="multiSelectUnitEmployeeKpiManagement"
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={organizationalUnitSelectBox.map(item => { return { value: item.id, text: item.name } })}
                                        onChange={handleSelectOrganizationalUnit}
                                        value={organizationalUnit}
                                    >
                                    </SelectMulti>
                                }
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.management.over_view.status')}</label>
                                <SelectBox
                                    id={`status-kpi`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: -1, text: translate('kpi.evaluation.employee_evaluation.choose_status') },
                                        { value: 0, text: translate('kpi.evaluation.employee_evaluation.establishing') },
                                        { value: 1, text: translate('kpi.evaluation.employee_evaluation.expecting') },
                                        { value: 2, text: translate('kpi.evaluation.employee_evaluation.activated') }
                                    ]}
                                    onChange={handleStatusChange}
                                    value={status}
                                />
                            </div>
                        </div>

                        {/* Tìm kiếm theo người phê duyệt và nhân viên */}
                        <div className="form-inline hide-component">
                            <div className="form-group">
                                <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</label>
                                {approverSelectBox &&
                                    <SelectBox
                                        id={`approver-employee-kpi`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={approverSelectBox}
                                        onChange={handleApproverChange}
                                        value={approver}
                                    />
                                }
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.employee')}</label>
                                {unitMembers &&
                                    <SelectBox
                                        id={`employee-kpi-manage`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={unitMembers}
                                        onChange={handleEmployeeChange}
                                        value={userId}
                                    />
                                }
                            </div>
                        </div>

                        {/* Tìm kiém theo thời gian */}
                        <div className="form-inline" style={{ marginBottom: '5px' }}>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                                <DatePicker
                                    id='start_date'
                                    value={startDateDefault}
                                    onChange={handleStartDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                                <DatePicker
                                    id='end_date'
                                    value={endDateDefault}
                                    onChange={handleEndDateChange}
                                    dateFormat="month-year"
                                />
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-success" onClick={() => handleSearchData()}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                            </div>

                            {/* Button tìm kiếm và export */}
                            <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                                <button type="button" className="btn btn-primary dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('menu.add_asset_title')} >Báo cáo</button>
                                <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                    <li>{exportData && <ExportExcel id="export-employee-kpi-evaluation-management" type='link' buttonName="Báo cáo chung" exportData={exportData} style={{ marginRight: 15, marginTop: 5 }} />}</li>
                                    <li>{kpimember && <ExportExcel id="export-total-employee-kpi-evaluation-management" type='link' buttonName="Báo cáo tổng hợp" onClick={() => handleExportTotalData(kpimember)} />}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <DataTableSetting
                        tableId={tableId}
                        tableContainerId="tree-table-container"
                        tableWidth="1300px"
                        columnArr={[
                            'STT',
                            translate('kpi.evaluation.employee_evaluation.name'),
                            translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver'),
                            translate('kpi.evaluation.employee_evaluation.time'),
                            translate('kpi.evaluation.employee_evaluation.num_of_kpi'),
                            translate('kpi.evaluation.employee_evaluation.kpi_status'),
                            translate('kpi.evaluation.employee_evaluation.system_evaluate'),
                            translate('kpi.evaluation.employee_evaluation.result_self_evaluate'),
                            translate('kpi.evaluation.employee_evaluation.evaluation_management'),
                            translate('kpi.evaluation.employee_evaluation.approve'),
                            translate('kpi.evaluation.employee_evaluation.evaluate')
                        ]}
                        setLimit={setLimit}
                        hideColumnOption={true}
                    />
                    <div id="tree-table-container" style={{ marginTop: '30px' }}>
                        <table id={tableId} className="table table-hover table-bordered" style={{ marginBottom: '0px' }}>
                            <thead>
                                <tr>
                                    <th title="STT" style={{ width: "40px" }} className="col-fixed not-sort">STT</th>
                                    <th title="Tên nhân viên">{translate('kpi.evaluation.employee_evaluation.name')}</th>
                                    <th title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set_modal.approver')}</th>
                                    <th title="Thời gian">{translate('kpi.evaluation.employee_evaluation.time')}</th>
                                    <th title="Số lượng mục tiêu">{translate('kpi.evaluation.employee_evaluation.num_of_kpi')}</th>
                                    <th title="Trạng thái KPI">{translate('kpi.evaluation.employee_evaluation.kpi_status')}</th>
                                    <th title={translate('task.task_management.eval_of')}>{translate('task.task_management.eval_of')}</th>
                                    <th title={translate('kpi.evaluation.employee_evaluation.weekly_point')} style={{ textAlign: "center" }}>{translate('kpi.evaluation.employee_evaluation.weekly_point')}</th>
                                    <th title="Phê duyệt" style={{ textAlign: "center" }}>{translate('kpi.evaluation.employee_evaluation.approve')}</th>
                                    <th title="Đánh giá">{translate('kpi.evaluation.employee_evaluation.evaluate')}</th>
                                </tr>
                            </thead>
                            <tbody className="task-table">
                                {(kpimember && kpimember.length !== 0) ?
                                    kpimember.map((kpi, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{kpi.creator ? kpi.creator.name : ""}</td>
                                            <td>{kpi.approver ? kpi.approver.name : ""}</td>
                                            <td>{kpi ? formatDate(kpi.date) : ""}</td>
                                            <td>{kpi.kpis ? kpi.kpis.length : ""}</td>
                                            <td>{kpi ? checkStatusKPI(kpi.status) : ""}</td>
                                            <td>
                                                <ToolTip 
                                                    type={'text_tooltip'}
                                                    dataTooltip={`${translate('kpi.evaluation.dashboard.auto_point')} - ${translate('kpi.evaluation.dashboard.employee_point')} - ${translate('kpi.evaluation.dashboard.approve_point')}`}
                                                >
                                                    <span>
                                                        <span>{kpi?.automaticPoint !== null && kpi?.automaticPoint >= 0 ? kpi.automaticPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                        <span>{kpi?.employeePoint !== null && kpi?.employeePoint >= 0 ? kpi.employeePoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')} - </span>
                                                        <span>{kpi?.approvedPoint !== null && kpi?.approvedPoint >= 0 ? kpi.approvedPoint : translate('kpi.evaluation.employee_evaluation.not_evaluated_yet')}</span>
                                                    </span>
                                                </ToolTip>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <a style={{ cursor: 'pointer' }} onClick={() => showWeeklyPoint(translate, kpi?.weeklyEvaluations)}> {translate('general.detail')}</a>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <a data-target={`#modal-approve-KPI-member`} onClick={() => handleShowApproveModal(kpi)} data-toggle="modal" className="approve"
                                                    title={translate('kpi.evaluation.employee_evaluation.approve_this_kpi')}><i className="fa fa-bullseye"></i></a>
                                            </td>
                                            <td>
                                                <a data-target={`#employee-kpi-evaluation-modal`} onClick={() => showEvaluateModal(kpi)} data-toggle="modal"
                                                    className="copy" title={translate('kpi.evaluation.employee_evaluation.evaluate_this_kpi')}><i className="fa fa-list"></i></a>
                                            </td>
                                        </tr>
                                    ) : null}
                            </tbody>
                        </table>
                        {(kpimember && kpimember?.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                    </div>

                    <PaginateBar
                        display={kpimember?.length}
                        total={kpimembers?.totalCountEmployeeKpiSet}
                        pageTotal={kpimembers?.totalPageEmployeeKpiSet}
                        currentPage={infosearch?.page}
                        func={handleGetDataPagination}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { user, kpimembers, KPIPersonalManager, managerKpiUnit, dashboardEvaluationEmployeeKpiSet } = state;
    return { user, kpimembers, KPIPersonalManager, managerKpiUnit, dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
    getEmployeeKPISets: kpiMemberActions.getEmployeeKPISets,
    getTaskByListKpis: kpiMemberActions.getTaskByListKpis,
    getAllKPIUnit: managerActions.getAllKPIUnit,
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
};
export default connect(mapState, actionCreators)(withTranslate(EmployeeKpiManagement));
