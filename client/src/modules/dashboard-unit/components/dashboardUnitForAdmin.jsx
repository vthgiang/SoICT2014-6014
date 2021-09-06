import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { SelectMulti, LazyLoadComponent } from '../../../common-components';
import { showListInSwal } from '../../../helpers/showListInSwal';
import { customAxisC3js } from '../../../helpers/customAxisC3js';

import { EmployeeManagerActions } from '../../human-resource/profile/employee-management/redux/actions';
import { taskManagementActions } from '../../task/task-management/redux/actions';
import { DepartmentActions } from '../../super-admin/organizational-unit/redux/actions';

import { AnnualLeaveChartAndTable } from '../../human-resource/employee-dashboard/components/combinedContent';
import { LoadTaskOrganizationChart } from '../../task/task-dashboard/task-organization-dashboard/loadTaskOrganizationChart'
import ViewAllTaskUrgent from './viewAllTaskUrgent';
import ViewAllTaskNeedToDo from './viewAllTaskNeedToDo';
import StatisticsKpiUnits from '../../kpi/organizational-unit/dashboard/component/statisticsKpiUnits'
import { StatisticsTaskUnits } from './statisticsTaskUnits'

import c3 from 'c3';
import "./dashboardUnit.css";

let INFO_SEARCH = {
    organizationalUnits: null,
}

function DashboardUnitForAdmin(props) {
    const { translate, department, user, tasks } = props;

    const [state, setState] = useState({
        monthTitle: formatDate(Date.now(), true),
        month: formatDate(Date.now(), true, true),
        organizationalUnits: INFO_SEARCH.organizationalUnits,
        // Biểu đồ khẩn cấp / cần làm
        currentDate: formatDate(Date.now(), false),
        listUnit: null,
        urgent: null,
        taskNeedToDo: null,
        listUnitSelect: [],
    })

    const {
        organizationalUnits, monthTitle, month,
        currentDate, clickUrgentChart, clickNeedTodoChart,
        listUnitSelect
    } = state;

    useEffect(() => {
        if (props.tasks?.organizationUnitTasksChart?.urgent || props.tasks?.organizationUnitTasksChart?.taskNeedToDo)
            setState({
                ...state,
                urgent: props.tasks?.organizationUnitTasksChart?.urgent,
                taskNeedToDo: props.tasks?.organizationUnitTasksChart?.taskNeedToDo,
            })
    }, [JSON.stringify(props.tasks?.organizationUnitTasksChart?.urgent, props.tasks?.organizationUnitTasksChart?.taskNeedToDo)])


    useEffect(() => {
        props.getAllUnit();
    }, [])


    useEffect(() => {
        if (props?.department?.list?.length && !organizationalUnits) {
            let unit = department.list.map(item => item?._id)

            if (unit) {
                /* Lấy danh sách nhân viên  */
                props.getAllEmployee({ organizationalUnits: unit, status: ["active", 'maternity_leave', 'unpaid_leave', 'probationary', 'sick_leave'] });

                /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
                props.getTaskInOrganizationUnitByMonth(unit, month, month, "in_month");

                let partDate = currentDate.split('-');
                let newDate = [partDate[2], partDate[1], partDate[0]].join('-');
                props.getTaskInOrganizationUnitByDateNow(unit, newDate)
            }

            setState({
                ...state,
                organizationalUnits: unit,
                listUnitSelect: department.list.map(item => {
                    return { text: item?.name, value: item?._id }
                })
            })
        }
    }, [JSON.stringify(props?.department?.list)])

    useEffect(() => {
        pieChartNeedTodo();
        pieChartUrgent();
    })


    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    function formatDate(date, monthYear = false, yearMonth = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (yearMonth) {
                return [year, month].join('-');
            } else if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    const removePreviousUrgentPieChart = () => {
        const chart = document.getElementById('pieChartUrgent');
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    const removePreviousNeedToDoPieChart = () => {
        const chart = document.getElementById('pieChartTaskNeedToDo')
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const pieChartUrgent = () => {
        removePreviousUrgentPieChart();
        let chartUrgentDataTmp = convertDataUrgentPieChart(tasks?.organizationUnitTasksChart?.urgent);

        const chartUrgent = c3.generate({
            bindto: document.getElementById('pieChartUrgent'),
            data: { // Dữ liệu biểu đồ
                x: 'x',
                columns: chartUrgentDataTmp,
                type: 'bar',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickUrgentChart: chartUrgentDataTmp?.[0]?.[d?.index + 1]
                    })
                    window.$('#modal-view-all-task-urgent').modal('show');
                }.bind(this)
            },
            zoom: {
                enabled: true
            },
            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('pieChartUrgent', chartUrgentDataTmp?.[0]?.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },
                y: {
                    label: {
                        text: translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks'),
                        position: "outer-top"
                    },
                    tick: {
                        format: function (d) {
                            if (d - parseInt(d) === 0) {
                                return d;
                            } else {
                                return "";
                            }
                        }
                    },
                }
            },

            bar: {
                width: {
                    ratio: chartUrgentDataTmp?.length < 5 ? 0.3 : 0.7 // this makes bar width 50% of length between ticks
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (chartUrgentDataTmp?.[0]?.length > 1)
                            return chartUrgentDataTmp?.[0]?.[d + 1];
                    }
                }
            }
        })
    }

    const pieChartNeedTodo = () => {
        removePreviousNeedToDoPieChart();
        let chartTaskNeedToDoDataTmp = convertDataTaskNeedToDoPieChart(tasks?.organizationUnitTasksChart?.taskNeedToDo);

        const chartTaskNeedToDo = c3.generate({
            bindto: document.getElementById('pieChartTaskNeedToDo'),
            data: { // Dữ liệu biểu đồ
                x: 'x',
                columns: chartTaskNeedToDoDataTmp,
                type: 'bar',
                labels: true,
                onclick: function (d, e) {
                    setState({
                        ...state,
                        clickNeedTodoChart: chartTaskNeedToDoDataTmp?.[0]?.[d?.index + 1],
                    })
                    window.$('#modal-view-all-task-need-to-do').modal('show');
                }.bind(this)
            },
            zoom: {
                enabled: true
            },
            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('pieChartTaskNeedToDo', chartTaskNeedToDoDataTmp?.[0]?.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },

                y: {
                    label: {
                        text: translate('kpi.organizational_unit.dashboard.trend_chart.amount_tasks'),
                        position: "outer-top"
                    },
                    tick: {
                        format: function (d) {
                            if (d - parseInt(d) === 0) {
                                return d;
                            } else {
                                return "";
                            }
                        }
                    }
                }
            },

            bar: {
                width: {
                    ratio: chartTaskNeedToDoDataTmp?.length < 5 ? 0.3 : 0.7 // this makes bar width 50% of length between ticks
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (chartTaskNeedToDoDataTmp?.[0]?.length > 1)
                            return chartTaskNeedToDoDataTmp?.[0]?.[d + 1];
                    }
                }
            }
        })
    }

    const handleSelectOrganizationalUnitUrgent = (value) => {
        INFO_SEARCH = {
            organizationalUnits: value
        }
    }

    const convertDataUrgentPieChart = (data) => {
        let urgentPieChartDataAxis = ['x'], urgentPieChartDataData = [translate('dashboard_unit.urgent_task_amount')];

        // convert công việc khẩn cấp qua dạng c3js
        if (data && data.length > 0) {
            const result = data.reduce((total, value) => {
                if (value?.organizationalUnit?.name) {
                    total[value.organizationalUnit.name] = (total[value.organizationalUnit.name] || 0) + 1;
                }
                return total;
            }, [])

            for (let key in result) {
                urgentPieChartDataAxis.push(key)
                urgentPieChartDataData.push(result[key])
            }
        }

        return [
            urgentPieChartDataAxis,
            urgentPieChartDataData
        ];
    }

    const convertDataTaskNeedToDoPieChart = (data) => {
        let taskNeedToDoPieChartAxis = ['x'], taskNeedToDoPieChartData = [translate('dashboard_unit.need_to_do_task_amount')];
        // convert công việc cần làm qua dạng c3js
        if (data && data.length > 0) {
            const result2 = data.reduce((total, value) => {
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

        return [
            taskNeedToDoPieChartAxis,
            taskNeedToDoPieChartData
        ];
    }

    const handleUpdateDataUrgent = () => {
        let partDate = currentDate.split('-');
        let newDate = [partDate[2], partDate[1], partDate[0]].join('-');

        setState({
            ...state,
            organizationalUnits: INFO_SEARCH.organizationalUnits,
        })
        props.getTaskInOrganizationUnitByDateNow(INFO_SEARCH.organizationalUnits, newDate);
    }

    const handleClickshowTaskUrgent = () => {
        Swal.fire({
            html: `<h3 style="color: red"><div>Công việc được xem là khẩn cấp nếu: ?</div> </h3>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td>> 25 %</td>
                        <td>>= 50 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td>> 20 %</td>
                        <td>>= 40 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td>> 15 % </td>
                        <td>>= 30 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td>> 10 % </td>
                        <td>>= 20 %</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td>> 5 %</td>
                        <td>>= 10 %</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })
    }

    const handleClickshowTaskNeedToDo = () => {
        Swal.fire({
            html: `<h3 style="color: red"><div>Công việc được xem là cần làm nếu: ?</div> </h3>
            <table class="table" style=" margin-bottom: 0 ">
                <tbody style="text-align: left;font-size: 13px;">
                    <tr>
                        <th class="not-sort" style="width: 100px">Độ ưu tiên công việc</th>
                        <th class="not-sort" style="width: 43px">Quá hạn</th>
                        <th class="not-sort" style="width: 61px">Chậm tiến độ</th>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên thấp</td>
                        <td><= 25%</td>
                        <td>40% < x < 50%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên trung bình</td>
                        <td><= 20%</td>
                        <td>30% < x < 40%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên tiêu chuẩn</td>
                        <td><= 15%</td>
                        <td>20% < x < 30%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên cao</td>
                        <td><= 10%</td>
                        <td>10% < x < 20%</td>
                    </tr>
                    <tr>
                        <td>Cv độ ưu tiên khẩn cấp</td>
                        <td><= 5%</td>
                        <td>0% < x < 10%</td>
                    </tr>
                </tbody>
            </table>`,
            width: "40%",
        })

    }

    const showStatisticsTaskUnitDoc = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Thống kê điểm công việc giữa các đơn vị</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Biểu đồ này cho biết điểm tự động trung bình theo thời gian thực hiện công việc của từng đơn vị.</b></p>
            <p>Cách tính:</p>
            <ul>
                <li>Lấy n công việc đã tạo đánh giá trong tháng hiện tại của 1 đơn vị</li>
                <li>Tính tổng (điểm tự động x thời gian thực hiện trong lần đánh giá) của từng công việc</li>
                <li>Điểm trung bình = Tổng trên / Tổng (thời gian trong lần đánh giá của từng công việc)</p></li>
            </ul>
            </div>`,
            width: "50%",
        })
    }

    const getUnitName = (arrayUnit, arrUnitId) => {
        let data = [];
        arrayUnit && arrayUnit.forEach(x => {
            arrUnitId && arrUnitId.length > 0 && arrUnitId.forEach(y => {
                if (x.value === y)
                    data.push(x.text)
            })
        })
        return data;
    }

    const showUnitTask = (selectBoxUnit, idsUnit) => {
        const { translate } = props
        if (idsUnit && idsUnit.length > 0) {
            const listUnit = getUnitName(selectBoxUnit, idsUnit);
            showListInSwal(listUnit, translate('general.list_unit'))
        }
    }

    return (
        <React.Fragment>
            <div className="qlcv" style={{ marginBottom: "10px" }}>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                        <SelectMulti id="multiSelectOrganizationalUnitInpriority"
                            items={listUnitSelect}
                            options={{
                                nonSelectedText: translate('page.non_unit'),
                                allSelectedText: translate('page.all_unit'),
                            }}
                            onChange={handleSelectOrganizationalUnitUrgent}
                            value={state?.organizationalUnits ? state?.organizationalUnits : []}
                        >
                        </SelectMulti>
                    </div>
                    <button type="button" className="btn btn-success" onClick={handleUpdateDataUrgent}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                </div>
            </div>

            <div className="qlcv">
                <ViewAllTaskUrgent data={tasks?.organizationUnitTasksChart?.urgent} clickUrgentChart={clickUrgentChart} />
                <ViewAllTaskNeedToDo data={tasks?.organizationUnitTasksChart?.taskNeedToDo} clickNeedTodoChart={clickNeedTodoChart} />

                {/* Biểu đồ só công việc khẩn cấp /  cần làm */}
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <div className="box-title" >
                                    {translate('dashboard_unit.urgent_chart')}
                                    {
                                        organizationalUnits && organizationalUnits.length < 2 ?
                                            <>
                                                <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                <span>{` ${getUnitName(listUnitSelect, organizationalUnits).map(o => o).join(", ")}`}</span>
                                            </>
                                            :
                                            <span onClick={() => showUnitTask(listUnitSelect, organizationalUnits)} style={{ cursor: 'pointer' }}>
                                                <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnits?.length}</a>
                                                <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                            </span>
                                    }
                                    <a title={translate('task.task_management.explain')} onClick={() => handleClickshowTaskUrgent()}>
                                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                    </a>
                                </div>
                            </div>

                            <div className="box-body" style={{ marginBottom: 15 }}>
                                <div className="row " >
                                    <div className="">
                                        <div className="col-md-12">
                                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                                                {
                                                    tasks.isLoading ? <p>{translate('general.loading')}</p>
                                                        : tasks?.organizationUnitTasksChart?.urgent?.length > 0
                                                            ? <div id="pieChartUrgent"></div>
                                                            : <p>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-solid">
                            <div className="box-header with-border">
                                <div className="box-title" >
                                    {translate('dashboard_unit.need_to_do_chart')}
                                    {
                                        organizationalUnits && organizationalUnits.length < 2 ?
                                            <>
                                                <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                <span>{` ${getUnitName(listUnitSelect, organizationalUnits).map(o => o).join(", ")}`}</span>
                                            </>
                                            :
                                            <span onClick={() => showUnitTask(listUnitSelect, organizationalUnits)} style={{ cursor: 'pointer' }}>
                                                <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnits?.length}</a>
                                                <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                            </span>
                                    }
                                    <a title={translate('task.task_management.explain')} onClick={() => handleClickshowTaskNeedToDo()}>
                                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                                    </a>
                                </div>
                            </div>

                            <div className="box-body" style={{ marginBottom: 15 }}>
                                <div className="row " >
                                    <div className="col-md-12">
                                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                                            {
                                                tasks.isLoading ?
                                                    <p>{translate('general.loading')}</p>
                                                    :
                                                    tasks?.organizationUnitTasksChart?.taskNeedToDo?.length > 0
                                                        ? <div id="pieChartTaskNeedToDo"></div>
                                                        : <p>{translate('kpi.organizational_unit.dashboard.no_data')}</p>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LazyLoadComponent>
                    <AnnualLeaveChartAndTable
                        defaultUnit={true}
                        organizationalUnits={organizationalUnits}
                        childOrganizationalUnit={listUnitSelect?.map(item => {
                            return {
                                id: item?.value,
                                name: item?.text
                            }
                        })}
                    />
                </LazyLoadComponent>

                {/*Dashboard tải công việc */}
                <div className="row">
                    <div className="col-xs-12">
                        <LazyLoadComponent once={true}>
                            <LoadTaskOrganizationChart
                                getUnitName={getUnitName}
                                showUnitTask={showUnitTask}
                                units={listUnitSelect}
                                startMonth={month}
                                endMonth={month}
                                startMonthTitle={monthTitle}
                                idsUnit={organizationalUnits}
                                employeeLoading={user?.employeeLoading}
                                typeChart={"followUnit"}
                            />
                        </LazyLoadComponent>
                    </div>
                </div>

                {/* Thống kê CV */}
                <div className="row">
                    <div className="col-md-12">
                        <LazyLoadComponent>
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">
                                        {translate('dashboard_unit.statistics_task_unit')} {monthTitle}
                                        {
                                            organizationalUnits && organizationalUnits.length < 2 ?
                                                <>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <span>{` ${getUnitName(listUnitSelect, organizationalUnits).map(o => o).join(", ")}`}</span>
                                                </>
                                                :
                                                <span onClick={() => showUnitTask(listUnitSelect, organizationalUnits)} style={{ cursor: 'pointer' }}>
                                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnits?.length}</a>
                                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                                </span>
                                        }
                                        <a className="text-red" title={translate('task.task_management.explain')} onClick={() => showStatisticsTaskUnitDoc()}>
                                            <i className="fa fa-question-circle" style={{ color: '#dd4b39', cursor: 'pointer', marginLeft: '5px' }} />
                                        </a>
                                    </div>
                                </div>
                                <div className="box-body">
                                    {
                                        organizationalUnits &&
                                        <StatisticsTaskUnits
                                            organizationalUnits={department?.list?.filter(item => organizationalUnits.includes(item?._id))}
                                            monthStatistics={month}
                                        />
                                    }
                                </div>
                            </div>
                        </LazyLoadComponent>
                    </div>
                </div>

                {/* Thống kê KPI */}
                <div className="row">
                    <div className="col-md-12">
                        <LazyLoadComponent>
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ thống kê điểm KPI {monthTitle} giữa các đơn vị </div>
                                </div>
                                <div className="box-body">
                                    {
                                        organizationalUnits &&
                                        <StatisticsKpiUnits organizationalUnitIds={organizationalUnits} month={month} type="for-admin" />
                                    }
                                </div>
                            </div>
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { department, tasks, user } = state;
    return { department, tasks, user };
}

const actionCreators = {
    getAllUnit: DepartmentActions.get,

    getAllEmployee: EmployeeManagerActions.getAllEmployee,

    getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
    getTaskInOrganizationUnitByDateNow: taskManagementActions.getTaskByPriorityInOrganizationUnit,
};

export default connect(mapState, actionCreators)(withTranslate(DashboardUnitForAdmin));