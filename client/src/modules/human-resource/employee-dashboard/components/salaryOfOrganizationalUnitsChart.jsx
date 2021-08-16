/* Biểu đồ thể hiện lương thưởng các đơn vị trong công ty */
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';
import Swal from 'sweetalert2';

const SalaryOfOrganizationalUnitsChart = (props) => {

    const [state, setState] = useState({
        unit: true
    });

    const salaryChart = useRef(null);
    /**
     * Bắt sự kiện thay đổi đơn vị biểu đồ
     * @param {*} value : đơn vị biểu đồ (true or false)
     */
    const handleChangeUnitChart = (value) => {
        setState({
            ...state,
            unit: value
        })
    }

    useEffect(() => {
        if (props.salary.listSalaryByMonth !== state.listSalaryByMonth) {
            setState({
                ...state,
                listSalaryByMonth: props.salary.listSalaryByMonth
            })
        };
    }, [props.salary.listSalaryByMonth, state.unit, state.listSalaryByMonth])

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = salaryChart.current;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /** Render chart */
    const renderChart = (data) => {
        data.data1.shift();
        let setHeightChart = (data.ratioX.length * 40) < 320 ? 320 : (data.ratioX.length * 40);
        removePreviousChart();
        let chart = c3.generate({
            bindto: salaryChart.current,
            data: {
                columns: [[data.nameData, ...data.data1]],
                type: 'bar',
                labels: true,
            },
            padding: {
                bottom: 20,
            },
            size: {
                height: setHeightChart
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

    const { translate, salary, department } = props;

    const { monthShow, organizationalUnits } = props;
    const { unit } = state;

    let organizationalUnitsName = department?.list?.filter(item => organizationalUnits?.includes(item?._id))?.map(x => { return { _id: x._id, name: x.name, salary: 0 } });
    let data = salary.listSalaryByMonth;
    if (data.length !== 0) {
        data = data.map(x => {
            let total = x?.mainSalary ? parseInt(x.mainSalary) : 0;
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                }
            };
            return { ...x, total: unit ? total / 1000000000 : total / 1000000 }
        })
    };

    organizationalUnitsName = organizationalUnitsName.map(x => {
        data.forEach(y => {
            if (x._id === y.organizationalUnit) {
                x.salary = x.salary + y.total
            }
        })
        return x;
    })

    let ratioX = organizationalUnitsName.map(x => x.name);
    let data1 = organizationalUnitsName.map(x => x.salary);
    let dataChart = {
        nameData: 'Thu nhập',
        ratioX: ratioX,
        data1: ['data1', ...data1],
    }

    const showDetailSalary = () => {
        Swal.fire({
            icon: "question",
            html: `<h3 style="color: red"><div>Biểu đồ thu nhập được tính như sau:</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
                <li>Lương chính (Lương cơ bản)</b></li>
                <li>Các khoản lương thưởng, phụ cấp,...vv</li>
            </ul>`,
            width: "50%",
        })
    }

    renderChart(dataChart);

    return (
        <React.Fragment>
            <div className="box box-solid" style={{ paddingBottom: 20 }}>
                <div className="box-header with-border">
                    <div className="box-title" style={{ marginRight: '5px' }}>
                        {`Biểu đồ thu nhập `}
                        {
                            organizationalUnitsName && organizationalUnitsName.length < 2 ?
                                <>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <span>{` ${organizationalUnitsName?.[0]?.name ? organizationalUnitsName?.[0]?.name : ""}`}</span>
                                </>
                                :
                                <span onClick={() => showListInSwal(organizationalUnitsName.map(item => item?.name), translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                                </span>
                        }
                        {` tháng ${monthShow}`}
                    </div>
                    <a title={'Giải thích'} onClick={showDetailSalary}>
                        <i className="fa fa-question-circle" style={{ cursor: 'pointer', }} />
                    </a>
                </div>
                {salary.isLoading
                    ? <div style={{ marginLeft: "5px" }}>{translate('general.loading')}</div>
                    : <div className="box-body">
                        <div className="box-tools pull-right" >

                            <div className="btn-group pull-right">
                                <button type="button" className={`btn btn-xs ${unit ? "active" : "btn-danger"}`} onClick={() => handleChangeUnitChart(false)}>Triệu</button>
                                <button type="button" className={`btn btn-xs ${unit ? 'btn-danger' : "active"}`} onClick={() => handleChangeUnitChart(true)}>Tỷ</button>
                            </div>
                            <p className="pull-right" style={{ marginBottom: 0, marginRight: 10 }} > < b > ĐV tính</b></p >
                        </div>
                        <div ref={salaryChart}></div>
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const salaryOfOrganizationalUnits = connect(mapState, null)(withTranslate(SalaryOfOrganizationalUnitsChart));
export { salaryOfOrganizationalUnits as SalaryOfOrganizationalUnitsChart };
