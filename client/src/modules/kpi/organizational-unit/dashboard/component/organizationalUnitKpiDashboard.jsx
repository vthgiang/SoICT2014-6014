import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DatePicker, ExportExcel, LazyLoadComponent, SelectBox } from '../../../../../common-components/index';
import { showListInSwal } from '../../../../../helpers/showListInSwal';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
import { ChildOfOrganizationalUnitKpi } from './childOfOrganizationalUnitKPI';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import StatisticsKpiUnits from './statisticsKpiUnits';
import { StatisticsOfOrganizationalUnitKpiResultsChart } from './statisticsOfOrganizationalUnitKpiResultsChart';
import { TrendsInChildrenOrganizationalUnitKpiChart } from './trendsInChildrenOrganizationalUnitKpiChart';
import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';



function OrganizationalUnitKpiDashboard(props) {
    const today = new Date();

    const [state, setState] = useState({
        currentRole: null,
        organizationalUnitId: null,

        currentYear: new Date().getFullYear(),
        month: today.getFullYear() + '-' + (today.getMonth() + 1),
        date: (today.getMonth() + 1) + '-' + today.getFullYear(),

        infoSearch: {
            organizationalUnitId: null,
            month: today.getFullYear() + '-' + (today.getMonth() + 1),
            date: (today.getMonth() + 1) + '-' + today.getFullYear(),
        },

        childUnitChart: 1,
    });

    useEffect(() => {
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

        setState({
            ...state,
            currentRole: localStorage.getItem('currentRole'),
        })
    }, []);

    useEffect(() => {
        if (props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
            setState({
                ...state,
                organizationalUnitId: props.dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit?.id,
                infoSearch: {
                    ...state.infoSearch,
                    organizationalUnitId: props.dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit?.id,
                }
            })
        }
    }, [JSON.stringify(props.dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit)]);

    const handleSelectTypeChildUnit = (value) => {
        setState({
            ...state,
            childUnitChart: Number(value)
        })
    };

    const handleSelectOrganizationalUnitId = (value) => {
        setState({
            ...state,
            infoSearch: {
                ...state.infoSearch,
                organizationalUnitId: value[0]
            }
        })
    };

    const handleSelectMonth = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            infoSearch: {
                ...state.infoSearch,
                month: month,
                date: value
            }
        })
    };

    const handleSearchData = () => {
        setState({
            ...state,
            organizationalUnitId: state?.infoSearch?.organizationalUnitId,
            month: state?.infoSearch?.month,
            date: state?.infoSearch?.date
        })
    };

    const handleResultsOfOrganizationalUnitKpiChartDataAvailable = (data) => {
        setState({
            ...state,
            resultsOfOrganizationalUnitKpiChartData: data
        })
    };

    const handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable = (data) => {
        setState({
            ...state,
            resultsOfAllOrganizationalUnitsKpiChartData: data
        })
    };

    const handleStatisticsOfOrganizationalUnitKpiResultChartDataAvailable = (data) => {
        setState({
            ...state,
            statisticsOfOrganizationalUnitKpiResultChartData: data
        })
    };

    const getOrganizationalUnit = (data) => {
        setState({
            ...state,
            organizationalUnitOfChartAllKpis: data
        })
    };

    const showDistributionOfOrganizationalUnitKpiDoc = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Xu hướng thực hiện mục tiêu của nhân viên</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Biểu đồ này cho biết xu hướng thực hiện mục tiêu của nhân viên. Biểu đồ có 5 đường: (1) số công việc, (2) thời gian thực hiện (ngày), (3) số người tham gia (4) số KPI nhân viên (5) trọng số. </b></p>
            <p>Lưu ý: 5 đường trên càng song song với nhau thì xu hướng thực hiện mục tiêu của nhân viên đúng với xu hướng đã đề ra của đơn vị.</p>
            <p>(3) = số người tham gia vào (1) và (4)</p>
            <p>(2) = thời gian thực hiện các công việc trong (1)</p>
            </div>`,
            width: "50%",
        })
    }

    const { dashboardEvaluationEmployeeKpiSet, managerKpiUnit, translate } = props;
    const { childUnitChart, organizationalUnitId,
        month, date, resultsOfOrganizationalUnitKpiChartData,
        resultsOfAllOrganizationalUnitsKpiChartData,
        statisticsOfOrganizationalUnitKpiResultChartData,
        organizationalUnitOfChartAllKpis, infoSearch
    } = state;
    let childOrganizationalUnit, childrenOrganizationalUnit, childrenOrganizationalUnitLoading;
    let organizationalUnitSelectBox, typeChartSelectBox, currentOrganizationalUnit;
    let organizationalUnitIds;
    let listUnitKpi, organizationalUnitNotInitialKpi, settingUpKpi, activedKpi

    if (dashboardEvaluationEmployeeKpiSet) {
        childrenOrganizationalUnit = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit;
        childrenOrganizationalUnitLoading = dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnitLoading
    }

    if (childrenOrganizationalUnit) {
        let temporaryChild;

        childOrganizationalUnit = [{
            'name': childrenOrganizationalUnit.name,
            'id': childrenOrganizationalUnit.id,
            'deputyManager': childrenOrganizationalUnit.deputyManager
        }]

        temporaryChild = childrenOrganizationalUnit.children;

        while (temporaryChild) {
            temporaryChild.map(x => {
                childOrganizationalUnit = childOrganizationalUnit.concat({
                    'name': x.name,
                    'id': x.id,
                    'deputyManager': x.deputyManager
                });
            })

            let hasNodeChild = [];
            temporaryChild.filter(x => x.hasOwnProperty("children")).map(x => {
                x.children.map(x => {
                    hasNodeChild = hasNodeChild.concat(x)
                })
            });

            if (hasNodeChild.length === 0) {
                temporaryChild = undefined;
            } else {
                temporaryChild = hasNodeChild
            }
        }
    }

    // Tạo các select box
    if (childOrganizationalUnit) {
        organizationalUnitSelectBox = childOrganizationalUnit.map(x => { return { 'text': x.name, 'value': x.id } });
        organizationalUnitIds = childOrganizationalUnit.map(x => x.id);
        currentOrganizationalUnit = childOrganizationalUnit.filter(item => item?.id === organizationalUnitId)?.[0]?.name;
    }
    typeChartSelectBox = [
        { 'text': 'Đơn vị hiện tại', 'value': 1 },
        { 'text': 'Đơn vị hiện tại và đơn vị con', 'value': 2 }
    ];

    if (managerKpiUnit) {
        listUnitKpi = managerKpiUnit.kpis;
    }

    // Lọc các đơn vị chưa khởi tạo KPI
    if (listUnitKpi?.length > 0) {
        let listUnitKpiInitialKpi = listUnitKpi.map(item => item?.organizationalUnit?._id)
        organizationalUnitNotInitialKpi = organizationalUnitSelectBox?.filter(item => !listUnitKpiInitialKpi.includes(item?.value?.toString()))
        settingUpKpi = listUnitKpi.filter(item => item?.status === 0).length
        activedKpi = listUnitKpi.filter(item => item?.status === 1).length
    } else {
        organizationalUnitNotInitialKpi = organizationalUnitSelectBox
    }




    let d = new Date(),
        monthDate = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (monthDate.length < 2)
        monthDate = '0' + monthDate;
    if (day.length < 2)
        day = '0' + day;
    let defaultDate = [monthDate, year].join('-');

    return (
        <React.Fragment>
            {childrenOrganizationalUnit
                ? <section>
                    <div className="qlcv" style={{ marginBottom: "10px" }}>
                        <div className="form-inline">
                            {childOrganizationalUnit &&
                                <div className="form-group">
                                    <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
                                    <SelectBox
                                        id={`organizationalUnitSelectBoxInOrganizationalUnitKpiDashboard`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={organizationalUnitSelectBox}
                                        multiple={false}
                                        onChange={handleSelectOrganizationalUnitId}
                                        value={infoSearch?.organizationalUnitId}
                                    />
                                </div>
                            }
                            <div className="form-group">
                                <label style={{ width: "auto" }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
                                <DatePicker
                                    id="monthInOrganizationalUnitKpiDashboard"
                                    dateFormat="month-year"
                                    value={defaultDate}
                                    onChange={handleSelectMonth}
                                    disabled={false}
                                />
                            </div>

                            <button type="button" className="btn btn-success" onClick={() => handleSearchData()}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                        </div>
                    </div>

                    <div className="row">
                        {/* Số đơn vị con */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-yellow"><i className="fa fa-university" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{translate('general.list_unit')}</span>
                                    <a className="info-box-number" onClick={() => showListInSwal(organizationalUnitSelectBox?.map(item => item?.text), translate('general.list_unit'))} style={{ cursor: 'pointer', fontSize: '20px' }}>{organizationalUnitSelectBox?.length ?? 0}</a>
                                </div>
                            </div>
                        </div>

                        {/* Chưa khởi tạo KPI */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-red"><i className="fa fa-exclamation-circle" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{translate('kpi.evaluation.dashboard.not_initial')}</span>
                                    {listUnitKpi && <a className="info-box-number" onClick={() => showListInSwal(organizationalUnitNotInitialKpi?.map(item => item?.text), translate('general.list_employee'))} style={{ cursor: 'pointer', fontSize: '20px' }}>{organizationalUnitNotInitialKpi?.length ?? 0}</a>}
                                </div>
                            </div>
                        </div>

                        {/* Đang thiết lập */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-aqua"><i className="fa fa-cogs" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{`${translate('kpi.evaluation.dashboard.setting_up')}`}</span>
                                    <Link to="/kpi-units/manager" onClick={() => localStorage.setItem('stateFromOrganizationalUnitKpiDashboard',
                                        JSON.stringify({
                                            organizationalUnit: organizationalUnitIds,
                                            status: ["0"],
                                            startDate: state.month,
                                            endDate: state.month,
                                            defaultStartDate: [state?.month?.slice(5), state?.month?.slice(0, 4)].join('-'),
                                            defaultEndDate: [state?.month?.slice(5), state?.month?.slice(0, 4)].join('-')
                                        }))}
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {listUnitKpi && <span className="info-box-number" style={{ fontSize: '20px' }}>{`${settingUpKpi ?? 0}`}</span>}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Đã kích hoạt */}
                        <div className="col-md-3 col-sm-6 form-inline">
                            <div className="info-box">
                                <span className="info-box-icon bg-green"><i className="fa fa-check-circle" /></span>
                                <div className="info-box-content">
                                    <span className="info-box-text">{`${translate('kpi.evaluation.dashboard.activated')}`}</span>
                                    <Link to="/kpi-units/manager" onClick={() => localStorage.setItem('stateFromOrganizationalUnitKpiDashboard',
                                        JSON.stringify({
                                            organizationalUnit: organizationalUnitIds,
                                            status: ["1"],
                                            startDate: state.month,
                                            endDate: state.month,
                                            defaultStartDate: [state?.month?.slice(5), state?.month?.slice(0, 4)].join('-'),
                                            defaultEndDate: [state?.month?.slice(5), state?.month?.slice(0, 4)].join('-')
                                        }))}
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {listUnitKpi && <span className="info-box-number" style={{ fontSize: '20px' }}>{`${activedKpi ?? 0}`}</span>}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ thống kê điểm KPI giữa các đơn vị {translate('general.month')} {date}</div>
                                </div>
                                {
                                    organizationalUnitIds &&
                                    <StatisticsKpiUnits
                                        organizationalUnitIds={organizationalUnitIds}
                                        month={month}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    {/* Xu hướng thực hiện mục tiêu */}
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">
                                        <span>{translate('kpi.organizational_unit.dashboard.trend')} {currentOrganizationalUnit} {translate('general.month')} {date}</span>
                                        <a className="text-red" title={translate('task.task_management.explain')} onClick={() => showDistributionOfOrganizationalUnitKpiDoc()}>
                                            <i className="fa fa-question-circle" style={{ color: '#dd4b39', cursor: 'pointer', marginLeft: '5px' }} />
                                        </a>
                                    </div>
                                </div>

                                <div className="box-body qlcv" style={{ minHeight: "420px" }}>
                                    <div className="form-inline" style={{ textAlign: 'right' }}>
                                        <div className="form-group">
                                            <label style={{ width: "auto" }}>Thống kê</label>
                                            <SelectBox
                                                id={`typeChartSelectBoxInOrganizationalUnitKpiDashboard`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={typeChartSelectBox}
                                                multiple={false}
                                                onChange={handleSelectTypeChildUnit}
                                                value={childUnitChart}
                                            />
                                        </div>
                                    </div>
                                    {childUnitChart === 1 ?
                                        <TrendsInOrganizationalUnitKpiChart
                                            organizationalUnitId={organizationalUnitId}
                                            month={month}
                                        />
                                        : <TrendsInChildrenOrganizationalUnitKpiChart
                                            organizationalUnitId={organizationalUnitId}
                                            month={month}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh sach KPI don vi con*/}
                    <LazyLoadComponent
                        key=""
                    >
                        {
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="box box-primary">
                                        <div className="box-header with-border">
                                            <div className="box-title">{'Danh sách KPI đơn vị con'}</div>
                                        </div>
                                        <div className="box-body qlcv">
                                            <ChildOfOrganizationalUnitKpi />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </LazyLoadComponent>

                    <LazyLoadComponent
                        key="distributionOfOrganizationalUnitKpiChart"
                    >
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('kpi.organizational_unit.dashboard.distributive')} {currentOrganizationalUnit} {translate('general.month')} {date}</div>
                                    </div>
                                    <div className="box-body">
                                        {childOrganizationalUnit
                                            &&
                                            <DistributionOfOrganizationalUnitKpiChart
                                                organizationalUnitId={organizationalUnitId}
                                                month={month}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LazyLoadComponent>

                    {/* Thống kê kết quả KPI */}
                    <LazyLoadComponent
                        key="statisticsOfOrganizationalUnitKpi"
                    >
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <div className="box-title">{translate('kpi.organizational_unit.dashboard.statiscial')} {currentOrganizationalUnit} {translate('general.month')} {date}</div>
                                        {statisticsOfOrganizationalUnitKpiResultChartData && <ExportExcel type="link" id="export-statistic-organizational-unit-kpi-results-chart" exportData={statisticsOfOrganizationalUnitKpiResultChartData} style={{ marginLeft: 10 }} />}
                                    </div>
                                    <div className="box-body">
                                        <StatisticsOfOrganizationalUnitKpiResultsChart
                                            organizationalUnitId={organizationalUnitId}
                                            month={month}
                                            organizationalUnit={childOrganizationalUnit}
                                            onDataAvailable={handleStatisticsOfOrganizationalUnitKpiResultChartDataAvailable}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </LazyLoadComponent>

                    {/* Kết quả KPI đơn vị */}
                    <LazyLoadComponent
                        key="resultsOfOrganizationalUnitKpiChart"
                    >
                        {childOrganizationalUnit
                            && <div className="row">
                                <div className="col-xs-12">
                                    <div className="box box-primary">
                                        <div className="box-header with-border">
                                            <div className="box-title">{translate('kpi.organizational_unit.dashboard.result_kpi_unit')} {currentOrganizationalUnit}</div>
                                            {resultsOfOrganizationalUnitKpiChartData && <ExportExcel type="link" id="export-organizational-unit-kpi-results-chart" exportData={resultsOfOrganizationalUnitKpiChartData} style={{ marginLeft: 10 }} />}
                                        </div>
                                        <div className="box-body qlcv">
                                            <ResultsOfOrganizationalUnitKpiChart
                                                organizationalUnitId={organizationalUnitId}
                                                organizationalUnit={childOrganizationalUnit}
                                                onDataAvailable={handleResultsOfOrganizationalUnitKpiChartDataAvailable}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </LazyLoadComponent>


                    {/* Kết quả KPI các đơn vị */}
                    <LazyLoadComponent
                        key="resultsOfAllOrganizationalUnitKpiChart"
                    >
                        {childOrganizationalUnit &&
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="box box-primary">
                                        <div className="box-header with-border">
                                            <div className="box-title">
                                                {translate('kpi.organizational_unit.dashboard.result_kpi_unit')}
                                                {organizationalUnitOfChartAllKpis?.length > 1
                                                    ? <span onClick={() => showListInSwal(organizationalUnitOfChartAllKpis.filter((item, index) => index > 0), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                                        <span> {organizationalUnitOfChartAllKpis?.[0]} </span> {translate('human_resource.profile.employee_management.and')} <a style={{ fontWeight: 'bold' }}> {organizationalUnitOfChartAllKpis.length - 1} </a>{translate('kpi.evaluation.dashboard.number_of_child_unit')}
                                                    </span>
                                                    : organizationalUnitOfChartAllKpis?.[0] && ` ${organizationalUnitOfChartAllKpis?.[0]}`
                                                }
                                            </div>
                                            {resultsOfAllOrganizationalUnitsKpiChartData && <ExportExcel type="link" id="export-all-organizational-unit-kpi-results-chart" exportData={resultsOfAllOrganizationalUnitsKpiChartData} style={{ marginLeft: 10 }} />}
                                        </div>
                                        <div className="box-body qlcv">
                                            <ResultsOfAllOrganizationalUnitKpiChart
                                                onDataAvailable={handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable}
                                                getOrganizationalUnit={getOrganizationalUnit}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </LazyLoadComponent>
                </section>
                : childrenOrganizationalUnitLoading
                && <div className="box box-body">
                    <h4>Bạn chưa có đơn vị</h4>
                </div>
            }
        </React.Fragment>
    );
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, managerKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, managerKpiUnit };
}

const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
export default connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiDashboard));
