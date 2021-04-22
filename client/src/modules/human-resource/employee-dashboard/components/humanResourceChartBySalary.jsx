/* Biểu đồ nhân sự phân theo dải lương */
import React, { Component, useEffect, useRef, useState } from 'react';
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
                columns: [],
                hide: true,
                type: 'bar',
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

        setTimeout(function () {
            chart.load({
                columns: [[data.nameData, ...data.data1]],
            });
        }, 100);
    };

    /**
     * Function chyển dữ liệu thành dữ liệu chart
     * @param {*} dataCovert 
     */
    const convertData = (dataCovert) => {
        if (dataCovert.length !== 0) {
            if (dataCovert[0].unit && dataCovert[0].unit === 'VND') {
                let ratioX = [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    let check = x.total / 1000000;
                    if (check > 100) {
                        data1[1] = data1[1] + 1;
                    } else if (90 < check && check <= 100) {
                        data1[2] = data1[2] + 1;
                    } else if (80 < check && check <= 90) {
                        data1[3] = data1[3] + 1;
                    } else if (70 < check && check <= 80) {
                        data1[4] = data1[4] + 1;
                    } else if (60 < check && check <= 70) {
                        data1[5] = data1[5] + 1;
                    } else if (50 < check && check <= 60) {
                        data1[6] = data1[6] + 1;
                    } else if (40 < check && check <= 50) {
                        data1[7] = data1[7] + 1;
                    } else if (30 < check && check <= 40) {
                        data1[8] = data1[8] + 1;
                    } else if (20 < check && check <= 30) {
                        data1[9] = data1[9] + 1;
                    } else if (10 < check && check <= 20) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            };
            if (dataCovert[0].unit && dataCovert[0].unit === 'USD') {
                let ratioX = [">5000", "4500-5000", "4000-4500", "3500-4000tr", "3000-3500", "2500-3000", "2000-2500", "1500-2000", "1000-1500", "500-1000", "<500"];
                let data1 = ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                dataCovert.forEach(x => {
                    if (x.total > 5000) {
                        data1[1] = data1[1] + 1;
                    } else if (4500 < x.total && x.total <= 5000) {
                        data1[2] = data1[2] + 1;
                    } else if (4000 < x.total && x.total <= 4500) {
                        data1[3] = data1[3] + 1;
                    } else if (3500 < x.total && x.total <= 4000) {
                        data1[4] = data1[4] + 1;
                    } else if (3000 < x.total && x.total <= 3500) {
                        data1[5] = data1[5] + 1;
                    } else if (2500 < x.total && x.total <= 3000) {
                        data1[6] = data1[6] + 1;
                    } else if (2000 < x.total && x.total <= 2500) {
                        data1[7] = data1[7] + 1;
                    } else if (1500 < x.total && x.total <= 2000) {
                        data1[8] = data1[8] + 1;
                    } else if (1000 < x.total && x.total <= 1500) {
                        data1[9] = data1[9] + 1;
                    } else if (500 < x.total && x.total <= 1000) {
                        data1[10] = data1[10] + 1;
                    } else {
                        data1[11] = data1[11] + 1;
                    }
                });
                return {
                    ratioX: ratioX,
                    data1: data1,
                    nameData: 'Nhân viên',
                }
            }
        };
        return {
            ratioX: [">100tr", "90tr-100tr", "80tr-90tr", "70tr-80tr", "60tr-70tr", "50tr-60tr", "40tr-50tr", "30tr-40tr", "20tr-30tr", "10tr-20tr", "<10tr"],
            data1: ['data1', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            nameData: 'Nhân viên',
        }
    }

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

    useEffect(() => {
        if (props.organizationalUnits !== state.organizationalUnits || props.monthShow !== state.monthShow ||
            !isEqual(props.salary.listSalaryByMonthAndOrganizationalUnits, state.listSalaryByMonthAndOrganizationalUnits)) {
            setState({
                ...state,
                monthShow: props.monthShow,
                organizationalUnits: props.organizationalUnits,
                listSalaryByMonthAndOrganizationalUnits: props.salary.listSalaryByMonthAndOrganizationalUnits
            })
        }
    }, [props.organizationalUnits, props.monthShow, props.salary.listSalaryByMonthAndOrganizationalUnits])

    useEffect(() => {
        if (props.organizationalUnits !== state.organizationalUnits || props.monthShow !== state.monthShow ||
            !isEqual(props.salary.listSalaryByMonthAndOrganizationalUnits, state.listSalaryByMonthAndOrganizationalUnits)) {
            setState({...state})
        };
    }, [props.organizationalUnits, props.monthShow, props.salary.listSalaryByMonthAndOrganizationalUnits]);

    const { translate, salary, department } = props;

    const { monthShow, organizationalUnits } = props;

    let data = salary.listSalaryByMonthAndOrganizationalUnits;
    let organizationalUnitsName;
    if (organizationalUnits && department?.list?.length > 0) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    if (data.length !== 0) {
        data = data.map(x => {
            let total = parseInt(x.mainSalary);
            if (x.bonus.length !== 0) {
                for (let count in x.bonus) {
                    total = total + parseInt(x.bonus[count].number)
                }
            };
            return { ...x, total: total }
        })
    }

    let result = [];
    data.forEach(x => {
        let check;
        result.forEach(y => {
            if (y._id === x._id) {
                y.total = y.total + x.total;
                check = y;
            }
        })
        if (check) {
            result = [...result, check];
        } else {
            result = [...result, x]
        }
    });

    renderChart(convertData(result));

    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title">
                        {`Biểu đồ nhân sự `}
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
                        {` phân theo dải lương tháng ${monthShow}`}
                    </div>
                </div>
                <div className="box-body">
                    <div className="dashboard_box_body">
                        <p className="pull-right" style={{ marginBottom: 0 }} > < b > ĐV tính: Người</b></p >
                        <div ref={rotateChart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { salary, department } = state;
    return { salary, department };
};

const humanResourceChartBySalary = connect(mapState, null)(withTranslate(HumanResourceChartBySalary));
export { humanResourceChartBySalary as HumanResourceChartBySalary };
