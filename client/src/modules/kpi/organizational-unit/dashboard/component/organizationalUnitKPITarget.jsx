import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { taskManagementActions } from "../../../../task/task-management/redux/actions";
import { DashboardEvaluationEmployeeKpiSetAction } from "../../../evaluation/dashboard/redux/actions";
import { createUnitKpiActions } from "../../creation/redux/actions";
import { EmployeeResultChart } from "./employeeResultChart";
import { PreviewKpiEmployee } from './previewKpiEmployee';
import { TargetKpiCard } from "./targetKpiCard";

const getPrevDate = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 6);

    return `${d.getFullYear()}-${d.getMonth() + 1}`
}

const getCurrentDate = (d) => {
    const date = d ? new Date(d) : new Date();
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

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const responsiveKpi = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const OrganizationalUnitKPITarget = (props) => {
    const { tasks, createKpiUnit, dashboardEvaluationEmployeeKpiSet, createEmployeeKpiSet } = props;
    const { organizationalUnitId, organizationalUnitIds, month, onChangeData } = props;
    const [dataKpis, setDataKpis] = useState();
    const [dataCarousel, setDataCarousel] = useState();
    const [employeeKpiSet, setEmployeeKpiSet] = useState();
    const currentMonth = getCurrentDate();
    const monthArr = getMonthArr(currentMonth);

    useEffect(() => {
        props.getAllTasksThatHasEvaluation(organizationalUnitIds[0], getPrevDate(month), month);
        props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        props.getAllEmployeeKpiSetOfUnitByIds(organizationalUnitIds);
    }, [])

    // target kpi đơn vị
    useEffect(() => {
        if (tasks?.evaluatedTask && createKpiUnit?.currentKPI) {
            const { evaluatedTask } = tasks;
            const evaluations = {};
            console.log(evaluatedTask)
            for (let item of evaluatedTask) {
                for (let eva of item.evaluations) {
                    const key = eva.evaluatingMonth?.slice(0, 7);
                    if (!evaluations[key]) {
                        evaluations[key] = {};
                    }
                    for (let info of eva.taskInformations) {
                        if (info.type === 'number') {
                            if (!evaluations[key][info.name]) {
                                evaluations[key][info.name] = 0;
                            }
                            evaluations[key][info.name] += info.value;
                        }
                    }
                }
            }


            const dataKpis = createKpiUnit?.currentKPI?.kpis.map((item) => {
                if (!item.target) {
                    //Mục tiêu không định lượng
                    return {
                        ...item,
                        itemType: 0
                    }
                }
                console.log(evaluations[currentMonth])
                return {
                    name: item.name,
                    target: item.target,
                    unit: item.unit,
                    current: evaluations[currentMonth] ? evaluations[currentMonth][item?.criteria] : 0,
                    resultByMonth: monthArr.map(x => {
                        if (evaluations[x] && evaluations[x][item?.criteria]) {
                            return evaluations[x][item?.criteria]
                        } else return 0;
                    })
                }
            })

            console.log(142, dataKpis);

            setDataKpis(dataKpis);

            let dataCarousel = [];
            let carousel = [];

            for (let i = 0; i < dataKpis.length; i++) {
                if (i !== 0 && i % 4 === 0) {
                    dataCarousel.push(carousel);
                    carousel = [];
                } if (i === (dataKpis.length - 1)) {
                    carousel.push(dataKpis[i]);
                    dataCarousel.push(carousel);
                } else {
                    carousel.push(dataKpis[i]);
                }
            }
            setDataCarousel(dataCarousel)
        }
    }, [tasks.evaluatedTask, createKpiUnit.currentKPI])

    useEffect(() => {
        if (dashboardEvaluationEmployeeKpiSet?.employeeKpiSets) {
            const employeeKpiSet = dashboardEvaluationEmployeeKpiSet.employeeKpiSets.filter(x => x.date.slice(0, 7) === getCurrentDate(month));

            if (tasks?.evaluatedTask) {
                const { evaluatedTask } = tasks;
                const evaluations = {};
                for (let item of evaluatedTask) {
                    for (let eva of item.evaluations) {

                        const responsibleResult = eva?.results?.filter(x => x.role = "responsible");
                        for (let res of responsibleResult) {

                            const key = res.employee;

                            const contribution = res ? res.contribution / 100 : 0;

                            if (!evaluations[key]) {
                                evaluations[key] = {};
                            }
                            for (let info of eva.taskInformations) {
                                if (info.type === 'number') {
                                    if (!evaluations[key][info.name]) {
                                        evaluations[key][info.name] = 0;
                                    }
                                    evaluations[key][info.name] += info.value * contribution;
                                }
                            }
                        }
                    }
                }

                const employeeKpi = employeeKpiSet.map((item) => {
                    let employeeId = item.creator.id;

                    if (organizationalUnitId && organizationalUnitId === item.organizationalUnit._id) {
                        const employeeKpis = item.kpis?.map(kpis => {
                            if (!kpis.target) {
                                //Mục tiêu không định lượng
                                kpis.current = 'Đang thực hiện';
                                kpis.itemType = 0;
                            }
                            if (evaluations[employeeId]) {
                                kpis.current = evaluations[employeeId][kpis?.criteria] ?? 0
                            }
                            else {
                                kpis.current = 0;
                            }

                            return kpis
                        })
                        item.kpis = employeeKpis
                        return item;
                    }
                })
                setEmployeeKpiSet(employeeKpi.filter(x => x !== undefined))
                onChangeData(employeeKpi.filter(x => x !== undefined))
            }
        }
    }, [dashboardEvaluationEmployeeKpiSet.employeeKpiSets, dashboardEvaluationEmployeeKpiSet.reload, tasks.evaluatedTask, month])

    return (
        <React.Fragment>
            <div className="row mb"> {
                dataCarousel && <Carousel
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    responsive={responsiveKpi}
                    infinite={false}
                    autoPlaySpeed={1000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    deviceType={"desktop"}
                    dotListClass="custom-dot-list-style"
                    itemClass="mb"
                >
                    {
                        dataCarousel.map((kpiGroup, index) => {
                            return (
                                <div key={`${index}`} className="row pl-15 pr-15">
                                    {
                                        kpiGroup.map((item) => {
                                            return <div className="col-md-6" key={`${index}_${item.name}`}>
                                                <TargetKpiCard data={item} month={monthArr} />
                                            </div>
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </Carousel>

            }
            </div>

            <div className="row mb">
                {employeeKpiSet?.length > 0 ?
                    <Carousel
                        swipeable={false}
                        draggable={false}
                        showDots={true}
                        responsive={responsive}
                        infinite={false}
                        autoPlaySpeed={1000}
                        keyBoardControl={true}
                        customTransition="all .5"
                        transitionDuration={500}
                        containerClass="carousel-container"
                        deviceType={"desktop"}
                        dotListClass="custom-dot-list-style"
                        itemClass="mb"
                    >
                        {
                            employeeKpiSet.map((item, index) => {
                                return (
                                    <div key={`${index}`}>
                                        <PreviewKpiEmployee data={item} />
                                    </div>
                                )
                            })
                        }
                    </Carousel> : null
                }
            </div>
            {
                employeeKpiSet?.length > 0 ? <div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Tiến độ thực hiện KPI của nhân viên trong đơn vị</div>
                                </div>
                                <EmployeeResultChart employeeKpi={employeeKpiSet} unitKpi={createKpiUnit?.currentKPI} />
                            </div>
                        </div>
                    </div>
                </div> : null
            }
        </React.Fragment>
    )

}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks, createEmployeeKpiSet } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks, createEmployeeKpiSet };
}

const actions = {
    getAllTasksThatHasEvaluation: taskManagementActions.getAllTasksThatHasEvaluation,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime,
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,

}

const connectedOrganizationalUnitKPITarget = connect(mapState, actions)(withTranslate(OrganizationalUnitKPITarget));
export default connectedOrganizationalUnitKPITarget;