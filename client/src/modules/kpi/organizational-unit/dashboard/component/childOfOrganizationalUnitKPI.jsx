import 'c3/c3.css';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker } from '../../../../../common-components';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
import { ChildOfOrganizationalUnitCreate } from '../../../organizational-unit/creation/component/childOfOrganizationUnitKpiCreate';
import { createUnitKpiActions } from '../../creation/redux/actions';

const getDateDefault = (type) => {
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (type === 'start') {
        return ['01', year].join('-');
    }
    return [month, year].join('-');
}

const getColsDefault = () => {
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let cols = ['STT', 'Đơn vị']
    for (let i = 0; i < month; i++) {
        cols.push(`${i + 1}-${year}`)
    }
    return cols;
}

const getTableCols = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tableCols = ['STT', 'Đơn vị'];

    while (start.getTime() <= end.getTime()) {
        tableCols.push(`${start.getMonth() + 1}-${start.getFullYear()}`);
        start.setMonth(start.getMonth() + 1);
    }

    return tableCols;
}

const getDataTable = (data, cols) => {

    const res = data?.map((item, index) => {
        let rowData = {
            STT: index + 1,
            'Đơn vị': item[0].name
        }

        for (let i = 2; i < cols.length; i++) {
            let isKpiInit = false;
            for (let j = 1; j < item.length; j++) {
                if (item[j]) {
                    let x = new Date(item[j].date);
                    let d = `${x.getMonth() + 1}-${x.getFullYear()}`;
                    if (d === cols[i]) {
                        isKpiInit = true;
                        break;
                    }
                }
            }
            rowData[cols[i]] = isKpiInit ?
                <i className="fa fa-check-circle text-success" /> :
                <i className="fa fa-exclamation-circle text-danger" />;

        }
        return rowData;
    })
    return res
}

const convertMMYYtoYYMM = (date) => {
    return date.slice(3, 7) + '-' + date.slice(0, 2);
}

function ChildOfOrganizationalUnitKpi(props) {
    const { translate, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props;

    const [startDate, setStartDate] = useState(convertMMYYtoYYMM(getDateDefault('start')));
    const [endDate, setEndDate] = useState(convertMMYYtoYYMM(getDateDefault()));
    const [cols, setCols] = useState(getColsDefault());
    const [tableData, setTableData] = useState();

    const { organizationalUnitKpiSetsOfChildUnit: kpiChildUnit, currentKPI } = createKpiUnit;

    const handleSearchData = () => {
        let tableCols = getTableCols(startDate, endDate);
        setCols(tableCols);

        props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(localStorage.getItem("currentRole"));
    }


    useEffect(() => {
        props.getAllOrganizationalUnitKpiSetByTimeOfChildUnit(localStorage.getItem("currentRole"));
    }, [])

    useEffect(() => {
        const table = getDataTable(kpiChildUnit, cols);
        setTableData(table);
    }, [cols, kpiChildUnit])


    return (
        <React.Fragment>
            {/* Search data trong một khoảng thời gian */}

            <section className="form-inline" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                <div className="form-group">
                    <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
                    <DatePicker
                        id="kpiChildOfOrganizationalUnitDashboardStartdate"
                        dateFormat="month-year"
                        value={getDateDefault('start')}
                        onChange={(e) => setStartDate(convertMMYYtoYYMM(e))}
                        disabled={false}
                    />

                </div>
                {/* <div className='form-group' style={{ 'display': 'flex' }}> */}
                <div style={{ 'marginLeft': 'auto' }} >
                    <a className="btn btn-info" data-toggle="modal" data-target="#sub-organizational-create" data-backdrop="static" data-keyboard="false">
                        {'Áp dụng KPI cho đơn vị con'}
                    </a>
                    <ChildOfOrganizationalUnitCreate />
                    {/* </div> */}
                </div>
            </section>
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.organizational_unit.dashboard.end_date')}</label>
                    <DatePicker
                        id="kpiChildOfOrganizationalUnitDashboardEnddate"
                        dateFormat="month-year"
                        value={getDateDefault()}
                        onChange={(e) => setEndDate(convertMMYYtoYYMM(e))}
                        disabled={false}
                    />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-success"
                        onClick={handleSearchData}>{translate('kpi.organizational_unit.dashboard.search')}</button>
                </div>
            </section>

            <DataTableSetting
                className="pull-right"
                tableId={'listKpiChildOfOrganizationalUnit'}
                tableContainerId="kpiTableContainer"
                tableWidth="1300px"
                columnArr={cols}
                // setLimit={setLimit} 
                hideColumnOption={true}
            />

            {/* Danh sách các KPI của đơn vị */}
            <table id={'listKpiChildOfOrganizationalUnit'} className="table table-hover table-bordered">
                <thead>
                    <tr>
                        {
                            cols.map(x => {
                                return <th key={x} title={x}>{x}</th>

                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData?.map((x, index) => {
                            return (
                                <tr key={index + 1}>
                                    {
                                        cols?.map(item => {
                                            return (<td key={item.id}>{x[item]}</td>)
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div style={{ 'textAlign': 'center', 'marginTop': 10 }}>
                <i style={{ 'marginRight': 5 }} className="fa fa-check-circle text-success" />
                <span style={{ 'marginRight': 10 }}>Đã khởi tạo</span>
                <i style={{ 'marginRight': 5 }} className="fa fa-exclamation-circle text-danger" />
                <span style={{ 'marginRight': 10 }}>Chưa khởi tạo</span>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit };
}

const actions = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    getAllOrganizationalUnitKpiSetByTimeOfChildUnit: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTimeOfChildUnit,
}

const connectedChildOfOrganizationalUnitKpi = connect(mapState, actions)(withTranslate(ChildOfOrganizationalUnitKpi));
export { connectedChildOfOrganizationalUnitKpi as ChildOfOrganizationalUnitKpi };

