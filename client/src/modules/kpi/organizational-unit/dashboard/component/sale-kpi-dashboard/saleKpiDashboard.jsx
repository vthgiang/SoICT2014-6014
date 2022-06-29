import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../../../common-components';
import { taskManagementActions } from '../../../../../task/task-management/redux/actions';
import { EmployeeCreateKpiAutoModal } from '../../../../evaluation/dashboard/component/employeeCreateKpiAutoModal';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../../evaluation/dashboard/redux/actions';
import { createUnitKpiActions } from '../../../creation/redux/actions';

import { exampleDataSale } from '../../example-data/exampleDataSale';
import { EmployeeResultChart } from './employeeResultChart';
import { PreviewKpiEmployee } from './previewKpiEmployee';
import { TargetKpiCard } from './targetKpiCard';

const getCurrentDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month >= 10) {
        return `${year}-${month}`
    } else return `${year}-0${month}`
}
const getMonthArr = (date) => {
    const current = new Date(date);
    const month = current.getMonth() + 1;
    const monthArr = [];
    for (let i = 0; i < 6; i++) {
        if (month >= 10) {
            monthArr.push(`${current.getFullYear()}-${current.getMonth() + 1}`);
        } else monthArr.push(`${current.getFullYear()}-0${current.getMonth() + 1}`);

        current.setMonth(current.getMonth() - 1)
    }
    return monthArr.reverse();
}

const SaleKpiDashboard = (props) => {
    const { tasks, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props;
    const [month, setMonth] = useState(() => {
        const d = new Date();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
        return `${month}-${d.getFullYear()}`
    });
    const [employeeKpiSet, setEmployeeKpiSet] = useState();
    const [saleData, setSaleData] = useState();
    const [dataKpis, setDataKpis] = useState();

    const handleSelectMonth = (value) => {
        setMonth(value)
    }

    const handleSearchData = () => {
        const dataOfMonth = exampleDataSale.filter(x => x.date === month);
        setSaleData(dataOfMonth[0]);
    }

    const handleAdjustKpiEmployee = () => {
        console.log(employeeKpiSet)
        const currentDate = new Date().getDate();
        let needEffort = 0;
        const employeeEffort = employeeKpiSet.map(kpi => {
            let effort = 0;
            let effortIndex = 0;
            let count = 0;
            for (let item of kpi.kpis) {
                if (typeof item.target === 'number' && typeof item.current === 'number') {
                    if (item.current >= item.target) {
                        effort += 100 * item.weight;
                    } else {
                        effort += item.current / item.target * 100 * item.weight;
                    }
                    effortIndex += currentDate / 30 * 100 * item.weight;
                    // count++;

                }
            }
            if (count === 0) {
                count = 1;
            }

            return {
                id: kpi.creator.id,
                effort: effort,
                effortIndex: effortIndex,
            }
        })
        let total = 0;

        for (let elem of employeeEffort) {
            total += (elem.effortIndex - elem.effort);
        }

        const employeeEffortCoef = {};

        employeeEffort.map(x => {
            employeeEffortCoef[x.id] = (x.effort + total / employeeEffort.length) / x.effortIndex
        })

        const adjustEmployeeKpiSet = employeeKpiSet.map(item => {
            let coef = employeeEffortCoef[item.creator.id];
            item.kpis.map(kpi => {
                if (typeof (kpi.target) === 'number') {
                    kpi.target *= coef
                }
            })
            return item;
        })
        console.log(adjustEmployeeKpiSet)
        setEmployeeKpiSet(adjustEmployeeKpiSet)
    }

    useEffect(() => {
        const dataOfMonth = exampleDataSale.filter(x => x.date === month);
        console.log(35, dataOfMonth)
        setSaleData(dataOfMonth[0]);
        props.getAllTasksThatHasEvaluation("62b27b2253dd041704877d33", "2022-01", "2022-08");
        props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        props.getAllEmployeeKpiSetOfUnitByIds(["62b27b2253dd041704877d33"]);
        // props.getAllEmployeeKpiInOrganizationalUnit(localStorage.getItem("currentRole"), "62b27b2253dd041704877d33", "2022-06");
        // props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), "62b27b2253dd041704877d33", "2022-06");

        // props.getAllOrganizationalUnitKpiSetByTime(localStorage.getItem('currentRole'), "62b27b2253dd041704877d33", "2022-01", "2022-08")
    }, [])

    useEffect(() => {
        if (tasks?.evaluatedTask && createKpiUnit?.currentKPI) {
            const { evaluatedTask } = tasks;
            const evaluations = {};

            for (let item of evaluatedTask) {
                for (let eva of item.evaluations) {
                    const key = eva.evaluatingMonth.slice(0, 7);
                    if (!evaluations[key]) {
                        evaluations[key] = {
                            revenue: 0,
                            cost: 0,
                            contract: 0
                        };
                    }
                    if (eva.valueDelivery?.value) {
                        if (eva.valueDelivery.valueUnit = "VND") {
                            evaluations[key].revenue += eva.valueDelivery.value;
                        } else {
                            evaluations[key].contract += eva.valueDelivery.value;
                        }
                    }
                    if (eva.valueDelivery?.cost) {
                        evaluations[key].cost += eva.valueDelivery.cost;
                    }
                }
            }
            // lấy data cho các chart target
            // {
            //     type: 'Doanh thu',
            //     target: 1000000,
            //     unit: 'VND',
            //     current: 800000,
            //     targetByMonth : [],
            //     resultByMonth: []
            // },

            const currentMonth = getCurrentDate();

            const monthArr = getMonthArr(currentMonth);
            const dataKpis = createKpiUnit?.currentKPI?.kpis.map((item) => {
                if (!item.target) {
                    //Mục tiêu không định lượng
                    return {
                        name: item.name,
                        current: evaluations[currentMonth] ? 1 : 0,
                        resultByMonth: monthArr.map(x => {
                            if (evaluations[x]) {
                                return 1
                            } else return 0;
                        })
                    }
                }
                if (item.name === "Doanh thu mục tiêu") {
                    return {
                        name: item.name,
                        target: item.target,
                        unit: item.unit,
                        current: evaluations[currentMonth]?.revenue,
                        resultByMonth: monthArr.map(x => {
                            console.log(128, x)
                            if (evaluations[x]) {
                                return evaluations[x].revenue
                            } else return 0;
                        })
                    }
                }
                if (item.name === "Tỉ lệ tăng trưởng doanh thu") {
                    return {
                        name: item.name,
                        target: item.target,
                        unit: item.unit,
                        current: 8,
                        resultByMonth: [8, 7, 12, 8, 10, 8]
                    }
                }
                if (item.name === "Lợi nhuận trung bình") {
                    return {
                        name: item.name,
                        target: item.target,
                        unit: item.unit,
                        current: evaluations[currentMonth]?.revenue - evaluations[currentMonth]?.cost,
                        resultByMonth: monthArr.map(x => {
                            if (evaluations[x]) {
                                return evaluations[x].revenue - evaluations[x].cost
                            } else return 0;
                        })
                    }
                }
                if (item.name === "Chi phí trung bình của nhân viên") {
                    return {
                        name: item.name,
                        target: item.target,
                        unit: item.unit,
                        current: evaluations[currentMonth]?.cost,
                        resultByMonth: monthArr.map(x => {
                            if (evaluations[x]) {
                                return evaluations[x].cost
                            } else return 0;
                        })
                    }
                }
                if (item.name === "Hợp đồng với đối tác") {
                    return {
                        name: item.name,
                        target: item.target,
                        unit: item.unit,
                        current: evaluations[currentMonth]?.contract,
                        resultByMonth: monthArr.map(x => {
                            if (evaluations[x]) {
                                return evaluations[x].contract
                            } else return 0;
                        })
                    }
                }
            })

            setDataKpis(dataKpis);
        }
    }, [tasks.evaluatedTask, createKpiUnit.currentKPI])

    useEffect(() => {
        if (dashboardEvaluationEmployeeKpiSet?.employeeKpiSets) {
            // loc cac kpi cua nhan vien trong thang 
            const employeeKpiSet = dashboardEvaluationEmployeeKpiSet.employeeKpiSets.filter(x => x.date.slice(0, 7) === "2022-06");
            console.log(11, employeeKpiSet)
            if (tasks?.evaluatedTask) {
                console.log(474777, tasks.evaluatedTask)
                const { evaluatedTask } = tasks;
                const evaluations = {};
                for (let item of evaluatedTask) {
                    for (let eva of item.evaluations) {

                        const responsibleResult = eva?.results?.filter(x => x.role = "responsible");
                        console.log(203, responsibleResult);
                        console.log(204, evaluations);
                        for (let res of responsibleResult) {

                            const key = res.employee;

                            const contribution = res ? res.contribution / 100 : 0;

                            if (!evaluations[key]) {
                                evaluations[key] = {
                                    revenue: 0,
                                    cost: 0,
                                    contract: 0
                                };
                            }

                            if (eva.valueDelivery?.value) {
                                if (eva.valueDelivery.valueUnit = "VND") {
                                    evaluations[key].revenue += eva.valueDelivery.value * contribution;
                                } else {
                                    evaluations[key].contract += eva.valueDelivery.value * contribution;
                                }
                            }
                            if (eva.valueDelivery?.cost) {
                                evaluations[key].cost += eva.valueDelivery.cost * contribution;
                            }
                        }

                    }
                }
                console.log(71, evaluations)
                // lấy data cho các chart target
                // {
                //     name: 'Doanh thu',
                //     target: 1000000,
                //     unit: 'VND',
                //     current: 800000,
                // },

                const currentMonth = getCurrentDate();

                const monthArr = getMonthArr(currentMonth);
                console.log(94, createKpiUnit?.currentKPI)
                const employeeKpi = employeeKpiSet.map((item) => {
                    let employeeId = item.creator.id;

                    const employeeKpis = item.kpis?.map(kpis => {
                        console.log(247, kpis.name)
                        if (!kpis.target) {
                            console.log('if1')
                            //Mục tiêu không định lượng
                            kpis.current = evaluations[employeeId] ? 1 : 0
                        }
                        else if (kpis.name === "Doanh thu mục tiêu") {
                            console.log('if2')
                            kpis.current = evaluations[employeeId] ? evaluations[employeeId].revenue : 0;
                        }
                        else if (kpis.name === "Tỉ lệ tăng trưởng doanh thu") {
                            console.log('if3')
                            kpis.current = 3;
                        }
                        else if (kpis.name === "Lợi nhuận trung bình") {
                            console.log('if4')
                            kpis.current = evaluations[employeeId] ? evaluations[employeeId].revenue - evaluations[employeeId].cost : 0;
                        }
                        else if (kpis.name === "Chi phí trung bình của nhân viên") {
                            kpis.current = evaluations[employeeId] ? evaluations[employeeId].cost : 0
                        }
                        else if (kpis.name === "Hợp đồng với đối tác") {
                            kpis.current = evaluations[employeeId] ? evaluations[employeeId].contract : 0
                        }
                        return kpis
                    })
                    console.log(272, employeeKpis)
                    item.kpis = employeeKpis
                    return item;
                })
                setEmployeeKpiSet(employeeKpi)
            }
        }
    }, [dashboardEvaluationEmployeeKpiSet.employeeKpiSets, tasks.evaluatedTask])

    console.log(employeeKpiSet)

    return <React.Fragment>
        <div className='qlcv'>
            <div className='form-inline'>
                <div className="form-group">
                    <label style={{ width: "auto" }}>Tháng</label>
                    <DatePicker
                        id="monthInOrganizationalUnitKpiDashboard"
                        dateFormat="month-year"
                        value={month}
                        onChange={handleSelectMonth}
                        disabled={false}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={() => handleSearchData()}>Phân tích</button>

                {
                    employeeKpiSet?.length === 0 ? <span style={{ 'marginLeft': 'auto', 'cursor': "pointer" }}>
                        <a className='btn btn-primary text-dark' data-toggle="modal" data-target="#employee-create-kpi-auto" data-backdrop="static" data-keyboard="false">
                            <i className="fa fa-gears" style={{ fontSize: "16px" }} /> Khởi tạo KPI nhân viên tự động
                        </a>
                        <EmployeeCreateKpiAutoModal
                            // childrenOrganizationalUnit={dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit}
                            organizationalUnitId={"62b27b2253dd041704877d33"}
                        />
                    </span> :
                        <button type="button" className="btn btn-primary" onClick={() => handleAdjustKpiEmployee()}>Cân bằng KPI nhân viên</button>
                }
            </div>
            {employeeKpiSet?.length === 0 && <h3 className='text-danger'> Chưa khởi tạo KPI nhân viên đơn vị</h3>}

            <div className="row"> {
                dataKpis?.map((item) => {
                    return (
                        <div className="col-sm-6">
                            <TargetKpiCard data={item} month={getMonthArr("2022-06")} />
                        </div>
                    )
                })
            }
                {/* <div className="col-sm-6">
                    <TargetKpiCard />
                </div>
                <div className="col-sm-6">
                    <TargetKpiCard />
                </div> */}
            </div>
            <div className="row">
                {
                    employeeKpiSet?.map((item, index) => {
                        return (
                            <div key={`${index}_${item._id}`}>
                                <PreviewKpiEmployee data={item} />
                            </div>
                        )
                    })
                }
            </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Đóng góp nhân viên</div>
                        </div>
                        <EmployeeResultChart />

                    </div>
                </div>
            </div>
            {/* <div className='row'>
                <div className="col-sm-2">
                    <div className="card"
                        style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
                    >
                        <div className="card-body">
                            <div className="card-title" style={{ "fontWeight": 600, 'fontSize': 18, textAlign: 'center' }}>Số mục tiêu</div>
                            <p className="card-text text-info" style={{ "fontWeight": 600, 'fontSize': 24, textAlign: 'center' }}>
                                4
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-10">
                    <div className="row">
                        <div className='col-sm-3'>
                            <KpiCard title={"Số đơn hàng"} target={200} currentValue={210} previousValue={189} />
                            <br />
                        </div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Doanh thu"} target={1000000} currentValue={600000} previousValue={900000} unit={"$"} />
                            <br /></div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Lợi nhuận"} target={200000} currentValue={500000} previousValue={210000} unit={"$"} />
                            <br /></div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Chi phí"} target={800000} currentValue={100000} previousValue={700000} unit={"$"} />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Điểm KPI theo tháng</div>
                        </div>
                        <ForecastKpiChart />

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-7">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Đóng góp nhân viên</div>
                        </div>
                        <EmployeeResultChart />

                    </div>
                </div>
                <div className="col-md-5">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Tỉ lệ hoàn thành tiêu chí KPI</div>
                        </div>
                        <CompleteTargetKpiRatioChart />
                    </div>
                </div>
            </div> */}
        </div>

    </React.Fragment>
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks };
}

const actions = {
    getAllTasksThatHasEvaluation: taskManagementActions.getAllTasksThatHasEvaluation,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime,
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,

}

const connectedSaleKpiDashboard = connect(mapState, actions)(withTranslate(SaleKpiDashboard));
export default connectedSaleKpiDashboard;
