/* Biểu đồ nhân sự phân theo dải lương */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';

const HumanResourceChartBySalary = (props) => {

    const [state, setState] = useState({})

    const rotateChart = useRef(null);

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = _ => {
        const chart = rotateChart.current;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /**
     * Render chart
     * @param {*} data : Dữ liệu của chart
     */
    const renderChart = (data) => {
        data.data1.shift();

        removePreviousChart();
        let chart = c3.generate({
            bindto: rotateChart.current,
            data: {
                columns: [[data.nameData, ...data.data1]],
                type: 'bar',
                labels: true,
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ratioX,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            }
        });
    };

    const isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i]._id !== items2[i]._id) {
                return false;
            }
        }
        return true;
    }

    if (props.organizationalUnits !== state.organizationalUnits || props.monthShow !== state.monthShow ||
        !isEqual(props.employeeDashboardData.listSalaryByMonth, state.listSalaryByMonthAndOrganizationalUnits)) {
        setState({
            ...state,
            monthShow: props.monthShow,
            organizationalUnits: props.organizationalUnits,
            listSalaryByMonthAndOrganizationalUnits: props.employeeDashboardData.listSalaryByMonth
        })
    }

    const { translate, department, employeeDashboardData } = props;

    const { monthShow, organizationalUnits } = props;

    let organizationalUnitsName;
    if (organizationalUnits && department?.list?.length > 0) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    useEffect(() => {
        if (employeeDashboardData.humanResourceChartBySalaryData.data1) {
            renderChart(employeeDashboardData.humanResourceChartBySalaryData)
        }
    }, [employeeDashboardData.humanResourceChartBySalaryData, employeeDashboardData.isLoading])

    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title">
                        {`Biểu đồ nhân sự `}
                        {
                            organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                <>
                                    <span>{`${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ""} `}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                </span>
                        }
                        {`phân theo dải lương ${monthShow}`}
                    </div>
                </div>
                <div className="box-body">
                    {employeeDashboardData.isLoading
                        ? <p>{translate('general.loading')}</p>
                        : <div className="dashboard_box_body">
                            <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: Người</b></p >
                            <div ref={rotateChart}></div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { department, employeeDashboardData } = state;
    return { department, employeeDashboardData };
};

const humanResourceChartBySalary = connect(mapState, null)(withTranslate(HumanResourceChartBySalary));
export { humanResourceChartBySalary as HumanResourceChartBySalary };
