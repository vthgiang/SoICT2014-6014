import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, SlimScroll } from '../../../../common-components';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3';
import './employeeDashBoard.css';
import Swal from 'sweetalert2';

const AnnualLeaveChartAndTable = (props) => {
    const { defaultUnit, chartData } = props
    const [state, setState] = useState({
        organizationalUnitsSearch: null,
        organizationalUnits: null,
        organizationalUnitsShow: null,
    });
    const { organizationalUnits, organizationalUnitsSearch } = state
    const barChartAndTable = useRef(null);

    useEffect(() => {
        setState({
            organizationalUnits: defaultUnit ? props.organizationalUnits : null,
            organizationalUnitsShow: defaultUnit ? props.organizationalUnits : props?.childOrganizationalUnit?.map(x => x.id),
        })
    }, [JSON.stringify(props.organizationalUnits)])

    useEffect(() => {
        if(chartData?.annualLeaveChartAndTableData?.data1) {
            renderChart(chartData.annualLeaveChartAndTableData);
        }
    }, [chartData?.annualLeaveChartAndTableData,chartData?.beforeAndAfterOneWeeks , state.beforeAndAfterOneWeeks, JSON.stringify(props.organizationalUnits)])


    /**
    * Function bắt sự kiện thay đổi unit
    * @param {*} value : Array id đơn vị
    */
    const handleSelectOrganizationalUnit = (value) => {
        setState({
            ...state,
            organizationalUnitsSearch: value,
        })
    };

    const handleUpdateData = () => {
        if (organizationalUnitsSearch?.length > 0) {
            setState({
                ...state,
                organizationalUnits: organizationalUnitsSearch,
                organizationalUnitsShow: organizationalUnitsSearch
            })
        }
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = barChartAndTable.current;
        if (chart) {
            while (chart && chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu biểu đồ
     */
    const renderChart = (data) => {
        removePreviousChart();
        let chart = c3.generate({
            bindto: barChartAndTable.current,
            data: {
                x: 'x',
                columns: [["x", ...data.ratioX], ['data1', ...data.data1], ['data2', ...data.data2]],
                type: 'bar',
                labels: true,
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                },
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        outer: false,
                        rotate: -45,
                        multiline: true,
                        culling: {
                            max: 1
                        },
                        format: function (d) {
                            if (d.getDate() === new Date().getDate()) {
                                return "Hôm nay";
                            }
                            return d3.timeFormat('%d - %m - %Y')(d);
                        }
                    },
                },
                y: {
                    tick: { outer: false },
                }
            },
        });
    }
    const { translate, childOrganizationalUnit, department } = props;


    let organizationalUnitsName = [];
    if (organizationalUnits) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    const showDetailTAnnualeaveChartAndTable = () => {
        Swal.fire({
            icon: "question",
            html: `<h4><div>Biểu đồ xu hướng nghỉ phép của nhân viên trong tuần trước và tuần tới của các đơn vị lấy dữ liệu theo đơn xin nghỉ phép</div> </h4>`,
            width: "50%",
        })
    }

    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title" style={{ marginRight: '5px' }}>
                        Xu hướng nghỉ phép của nhân viên trong tuần trước và tuần tới
                        {
                            organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                <>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""}`}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                </span>
                        }
                    </div>
                    <a title={'Giải thích'} onClick={showDetailTAnnualeaveChartAndTable}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', }} />
                    </a>
                </div>
                <div className="box-body" >
                    {!defaultUnit
                        && <div className="qlcv" style={{ marginBottom: 15 }}>
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="form-control-static">{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                                    <SelectMulti id="multiSelectUnitsChartAndTable"
                                        items={childOrganizationalUnit?.map((p, i) => { return { value: p.id, text: p.name } })}
                                        options={{
                                            nonSelectedText: translate('page.non_unit'),
                                            allSelectedText: translate('page.all_unit'),
                                        }}
                                        onChange={handleSelectOrganizationalUnit}
                                        value={organizationalUnits}
                                    >
                                    </SelectMulti>
                                </div>
                                <button type="button" className="btn btn-success" onClick={handleUpdateData}>{translate('general.search')}</button>
                            </div>
                        </div>
                    }
                    <div className="dashboard_box_body">
                        {chartData?.isLoading
                            ? <div>{translate('general.loading')}</div>
                            : chartData?.beforeAndAfterOneWeeks?.length
                                ? <div ref={barChartAndTable}></div>
                                : <div>{translate('kpi.organizational_unit.dashboard.no_data')}</div>
                        }
                    </div>
                </div>
            </div>
            <SlimScroll verticalScroll={true} outerComponentId={"annualLeave-table"} maxHeight={400} activate={true} />
        </React.Fragment >
    )
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const actionCreators = {};

const barChartAndTable = connect(mapState, actionCreators)(withTranslate(AnnualLeaveChartAndTable));
export { barChartAndTable as AnnualLeaveChartAndTable };
