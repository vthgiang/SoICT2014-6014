/* Biểu đồ thể hiện đổ tuổi của nhân viên */
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';

const AgePyramidChart = (props) => {
    const { employeesManager, department, translate } = props;

    const [state, setState] = useState({
        organizationalUnits: []
    })
    const { organizationalUnits } = state;

    const _chart = useRef(null);

    /**
     * Function tính tuổi nhân viên theo ngày sinh nhập vào
     * @param {*} date : Ngày sinh
     */
    const getYear = (date) => {
        let dateNow = new Date(Date.now()), birthDate = new Date(date);
        let age = dateNow.getFullYear() - birthDate.getFullYear();
        return age;
    }

    /** Xóa các chart đã render khi chưa đủ dữ liệu */
    const removePreviousChart = () => {
        const chart = _chart.current;
        while (chart && chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    /**
     * Hàm tiện ích tìm giá trị lớn nhất của mảng
     * @param {*} data : Array dữ liệu truyền vào
     */
    const findMaxOfArray = (data) => {
        let max = data[1];
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i] > max) {
                max = data[i];
            }
        }
        return max;
    };

    /**
     * Hàm tiện ích tìm giá trị nhỏ nhất của mảng
     * @param {*} data : Array dữ liệu truyền vào
     */
    const findMinOfArray = (data) => {
        let min = data[1];
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i] < min) {
                min = data[i];
            }
        }
        return min;
    };

    /**
     * Render chart
     * @param {*} data : Dữ liệu của Chart
     */
    const renderChart = (data) => {
        let maxData1 = 0 - findMinOfArray(data.data1), maxData2 = findMaxOfArray(data.data2);
        let qty_max = maxData1 >= maxData2 ? maxData1 : maxData2;
        data.data1.shift(); data.data2.shift();

        removePreviousChart();

        let chart = c3.generate({
            bindto: _chart.current,
            data: {
                columns: [[data.nameData1, ...data.data1], [data.nameData2, ...data.data2]],
                type: 'bar',
                groups: [[data.nameData1, data.nameData2]]
            },
            padding: {
                top: 10,
            },
            bar: {
                width: { ratio: 0.9 },
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category', categories: data.ageRanges,
                    tick: { outer: false, centered: true },
                },
                y: {
                    tick: {
                        outer: false,
                        format: function (d) { return (parseInt(d) === d) ? Math.abs(d) : null; }
                    },
                    max: qty_max, min: -qty_max
                }
            },
            grid: {
                y: { lines: [{ value: 0 }], }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        var format = function (d) { return (parseInt(d) === d) ? Math.abs(d) : null; }
                        return format(value) + ' nhân viên';
                    }
                }
            }
        });
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

    if (
        props.organizationalUnits !== state.organizationalUnits
        || !isEqual(props.employeesManager.listAllEmployees, state.listAllEmployees)
        || !isEqual(props.employeesManager.listEmployeesOfOrganizationalUnits, state.listEmployeesOfOrganizationalUnits)
    ) {
        setState({
            ...state,
            organizationalUnits: props.organizationalUnits,
            listAllEmployees: props.employeesManager.listAllEmployees,
            listEmployeesOfOrganizationalUnits: props.employeesManager.listEmployeesOfOrganizationalUnits
        })
    }

    useEffect(() => {
        let listAllEmployees = employeesManager.listEmployeesOfOrganizationalUnits;
        let maleEmployees = listAllEmployees.filter(x => x.gender === 'male' && x.birthdate);
        let femaleEmployees = listAllEmployees.filter(x => x.gender === 'female' && x.birthdate);

        // Start Định dạng dữ liệu cho biểu đồ tháp tuổi
        let age = 69, i = 0, data1AgePyramid = [], data2AgePyramid = [];
        while (age > 18) {
            let maleData = [], femaleData = [];
            if (age === 19) {
                femaleData = femaleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 2);
                maleData = maleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 2);
            } else {
                femaleData = femaleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 5);
                maleData = maleEmployees.filter(x => getYear(x.birthdate) <= age && getYear(x.birthdate) > age - 5);
            }
            data1AgePyramid[i] = 0 - femaleData.length;
            data2AgePyramid[i] = maleData.length;
            age = age - 5;
            i++;
        }
        data1AgePyramid.unshift('Nữ');
        data2AgePyramid.unshift('Nam');
        // End Định dạng dữ liệu cho biểu đồ tháp tuổi

        let data = {
            nameData1: 'Nữ',
            nameData2: 'Nam',
            ageRanges: ['65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '18-19'],
            data1: data1AgePyramid,
            data2: data2AgePyramid,
        }
        renderChart(data);
    }, [JSON.stringify(employeesManager)])


    let organizationalUnitsName;
    if (organizationalUnits && department?.list) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    let listAllEmployees = employeesManager.listEmployeesOfOrganizationalUnits;
    let maleEmployees = listAllEmployees.filter(x => x.gender === 'male');
    let femaleEmployees = listAllEmployees.filter(x => x.gender === 'female');



    return (
        <React.Fragment>
            <div ref={_chart}></div>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <div className="box-title">
                        {`Tháp tuổi cán bộ công nhân viên `}
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
                </div>
                <div className="box-body dashboard_box_body">
                    {employeesManager.isLoading
                        ? <p>{translate('general.loading')}</p>
                        : <div className="form-inline">
                            <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-sm-1 col-xs-1'>
                                <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/female_icon.png" />
                                <div className='number_box'>{femaleEmployees.length}</div>
                            </div>
                            <div className='row form-group col-lg-10 col-md-10 col-sm-10 col-xs-10' style={{ padding: 0 }}>
                                <p className="pull-left" style={{ marginBottom: 0 }}><b>Độ tuổi</b></p>
                                <p className="pull-right" style={{ marginBottom: 0 }}><b>ĐV tính: Người</b></p>
                                <div ref={_chart}></div>
                            </div>
                            <div style={{ textAlign: "center", padding: 2 }} className='form-group col-lg-1 col-md-1 col-sm-1 col-xs-1'>
                                <img style={{ width: 40, marginTop: 80, height: 120 }} src="image/male_icon.png" />
                                <div className='number_box'>{maleEmployees.length}</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { employeesManager, department } = state;
    return { employeesManager, department };
}

const agePyramidChart = connect(mapState, null)(withTranslate(AgePyramidChart));
export { agePyramidChart as AgePyramidChart };
