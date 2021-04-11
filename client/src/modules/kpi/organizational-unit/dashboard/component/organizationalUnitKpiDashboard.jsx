import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';

import { TrendsInOrganizationalUnitKpiChart } from './trendsInOrganizationalUnitKpiChart';
import { TrendsInChildrenOrganizationalUnitKpiChart } from './trendsInChildrenOrganizationalUnitKpiChart';
import { DistributionOfOrganizationalUnitKpiChart } from './distributionOfOrganizationalUnitKpiChart';
import { ResultsOfOrganizationalUnitKpiChart } from './resultsOfOrganizationalUnitKpiChart';
import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart';
import { StatisticsOfOrganizationalUnitKpiResultsChart } from './statisticsOfOrganizationalUnitKpiResultsChart';

import { SelectBox, DatePicker, LazyLoadComponent, ExportExcel } from '../../../../../common-components/index';
import { showListInSwal } from '../../../../../helpers/showListInSwal';
import { withTranslate } from 'react-redux-multilingual';
import StatisticsKpiUnits from './statisticsKpiUnits';

function OrganizationalUnitKpiDashboard(props) {
    const today = new Date();

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const DATA_SEARCH = {
        organizationalUnitId: null,
        month: today.getFullYear() + '-' + (today.getMonth() + 1),
        date: (today.getMonth() + 1) + '-' + today.getFullYear(),
        monthStatistics: "",
    };

    const [state, setState] = useState({
        currentRole: null,
        organizationalUnitId: DATA_SEARCH.organizationalUnitId,

        currentYear: new Date().getFullYear(),
        month: DATA_SEARCH.month,
        date: DATA_SEARCH.date,

        dataStatus: DATA_STATUS.NOT_AVAILABLE,

        childUnitChart: 1,
        monthStatistics: DATA_SEARCH.monthStatistics,
    });

    let childOrganizationalUnit, childrenOrganizationalUnit, childrenOrganizationalUnitLoading;
    let organizationalUnitSelectBox, typeChartSelectBox, currentOrganizationalUnit;
    let organizationalUnitIds;

    useEffect(() => {
        props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

        setState( {
            ...state,
            currentRole: localStorage.getItem('currentRole'),
            dataStatus: DATA_STATUS.QUERYING
        })
    },[]);

    useEffect(() => {
        if (state.currentRole !== localStorage.getItem('currentRole')) {
            props.getChildrenOfOrganizationalUnitsAsTree(localStorage.getItem("currentRole"));

            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
                organizationalUnitId: null,
                childUnitChart: 1
            });

        }
    }, [state.currentRole])

    useEffect(() => {

        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.dashboardEvaluationEmployeeKpiSet.childrenOrganizationalUnit) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                    organizationalUnitId: props.dashboardEvaluationEmployeeKpiSet?.childrenOrganizationalUnit?.id,
                })
            }
        }
    });

    const handleSelectTypeChildUnit = (value) => {
        setState( {
            ...state,
            childUnitChart: Number(value)
        })
    };

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

    const checkPermisson = (managerCurrentUnit) => {
        let currentRole = localStorage.getItem("currentRole");
        return (currentRole === managerCurrentUnit);

    };

    const handleSelectOrganizationalUnitId = (value) => {
        DATA_SEARCH.organizationalUnitId = value[0];
    };

    const handleSelectMonth = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        DATA_SEARCH.month = month;
        DATA_SEARCH.date = value;
    };

    const handleSearchData = () => {
        setState( {
            ...state,
            organizationalUnitId: DATA_SEARCH.organizationalUnitId,
            month: DATA_SEARCH.month,
            date: DATA_SEARCH.date
        })
    };

    const handleResultsOfOrganizationalUnitKpiChartDataAvailable = (data) => {
        setState( {
            ...state,
            resultsOfOrganizationalUnitKpiChartData: data
        })
    };

    const handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable = (data) => {
        setState( {
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
        setState( {
            ...state,
            organizationalUnitOfChartAllKpis: data
        })
    };

    const handleSelectDateStatistics = (date) => {
        let month = date.slice(3, 7) + '-' + date.slice(0, 2);
        DATA_SEARCH.monthStatistics = month;
    };

    const handleSearchKpiUnits = () => {
        setState({
            ...state,
            monthStatistics: DATA_SEARCH.monthStatistics
        })
    };

    const { dashboardEvaluationEmployeeKpiSet, translate } = props;
    const { childUnitChart, organizationalUnitId,
        month, date, resultsOfOrganizationalUnitKpiChartData,
        resultsOfAllOrganizationalUnitsKpiChartData,
        statisticsOfOrganizationalUnitKpiResultChartData,
        organizationalUnitOfChartAllKpis,
        monthStatistics
    } = state;


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
            { childrenOrganizationalUnit
                ? <section>
                    <div className="qlcv">
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
                                    value={DATA_SEARCH.organizationalUnitId}
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

                            <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.dashboard.analyze')}</button>
                        </div>
                    </div>

                    <div className="row " style={{ marginTop: '10px' }}>
                        <div className="col-md-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Biểu đồ thống kê điểm kpi giữa các đơn vị</div>
                                </div>
                                <div className="box-body">
                                    <div className="form-inline" >
                                        <label style={{ width: 'auto', marginRight: '10px' }}>Tháng</label>
                                        <div className="form-group" style={{ marginRight: '10px' }}>
                                            <DatePicker
                                                id="monthFilterResultKpi"
                                                dateFormat="month-year"
                                                value={defaultDate}
                                                onChange={handleSelectDateStatistics}
                                                disabled={false}
                                            />
                                        </div>
                                        <button type="button" className="btn btn-success" onClick={handleSearchKpiUnits} >{translate('kpi.evaluation.employee_evaluation.search')}</button>
                                    </div>

                                    {
                                        organizationalUnitIds &&
                                        <StatisticsKpiUnits organizationalUnitIds={organizationalUnitIds} monthStatistics={monthStatistics} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Xu hướng thực hiện mục tiêu */}
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">{translate('kpi.organizational_unit.dashboard.trend')} {currentOrganizationalUnit} {translate('general.month')} {date}</div>
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
                                        {childOrganizationalUnit && (state.dataStatus === DATA_STATUS.AVAILABLE)
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
                                        {(state.dataStatus === DATA_STATUS.AVAILABLE) &&
                                        <ResultsOfOrganizationalUnitKpiChart
                                            organizationalUnitId={organizationalUnitId}
                                            organizationalUnit={childOrganizationalUnit}
                                            onDataAvailable={handleResultsOfOrganizationalUnitKpiChartDataAvailable}
                                        />
                                        }
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
                                                ? <span onClick={() => showListInSwal(organizationalUnitOfChartAllKpis, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                                            <a style={{ fontWeight: 'bold' }}> {organizationalUnitOfChartAllKpis.length} </a>{translate('kpi.organizational_unit.dashboard.organizational_unit_low_case')}
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
    const { dashboardEvaluationEmployeeKpiSet } = state;
    return { dashboardEvaluationEmployeeKpiSet };
}

const actionCreators = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree
};
const connectedOrganizationalUnitKpiDashboard = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiDashboard));
export { connectedOrganizationalUnitKpiDashboard as OrganizationalUnitKpiDashboard };
