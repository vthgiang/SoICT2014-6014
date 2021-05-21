import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AnnualLeaveActions } from '../../annual-leave/redux/actions';
import { SelectMulti, SlimScroll } from '../../../../common-components';

import { showListInSwal } from '../../../../helpers/showListInSwal';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from 'd3';
import './employeeDashBoard.css';


const AnnualLeaveChartAndTable = (props) => {
    const { defaultUnit } = props
    const [state, setState] = useState({
        organizationalUnitsSearch: null,
        organizationalUnits: null,
        organizationalUnitsShow: null,
    });
    const { organizationalUnits, organizationalUnitsShow, organizationalUnitsSearch } = state
    const barChartAndTable = useRef(null);

    useEffect(() => {
        setState({
            organizationalUnits: defaultUnit ? props.organizationalUnits : null,
            organizationalUnitsShow: defaultUnit ? props.organizationalUnits : props?.childOrganizationalUnit?.map(x => x.id),
        })

        props.getAnnualLeave({ organizationalUnits: props.organizationalUnits, beforAndAfterOneWeek: true })
    }, [JSON.stringify(props.organizationalUnits)])

    useEffect(() => {
        if (!isEqual(props.annualLeave.beforAndAfterOneWeeks, state.beforAndAfterOneWeeks)) {
            setState({
                ...state
            })
        }
    }, [props.annualLeave.beforAndAfterOneWeeks, state.beforAndAfterOneWeeks]);

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, yearMonthDay = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (yearMonthDay === true) {
                return [year, month, day].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

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
            props.getAnnualLeave({ organizationalUnits: organizationalUnitsSearch, beforAndAfterOneWeek: true })
        }
    }

    function isEqual (items1, items2) {
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

    if (!isEqual(props.annualLeave.beforAndAfterOneWeeks, state.beforAndAfterOneWeeks)) {
        setState({
            ...state,
            beforAndAfterOneWeeks: props.annualLeave.beforAndAfterOneWeeks
        })
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

    const getDays = () => {
        const days = [];
        const dateNow = new Date();
        for (let i = 1; i <= 13; i++) {
            if (i !== 7) {
                days.push(new Date())
            } else {
                days.push(formatDate(new Date(), true))
            }
        }
        for (let i = 0; i < 6; i++) {
            days[i] = formatDate(days[i].setDate(dateNow.getDate() - 6 + i), true)
            days[days.length - 1 - i] = formatDate(days[days.length - 1 - i].setDate(dateNow.getDate() + 6 - i), true)
        }
        return days
    }

    const isEqualDate = (date1, date2) => {
        const pathDate1 = formatDate(date1, true)
        const pathDate2 = formatDate(date2, true)
        if (!pathDate1 || !pathDate2) {
            return false
        };
        if (new Date(pathDate1).getTime() === new Date(pathDate2).getTime()) {
            return true
        }
        return false
    }

    /** Bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => { }

    const { annualLeave, translate, childOrganizationalUnit, department } = props;
    const listAnnual = organizationalUnitsShow?.map(x => {
        const unit = childOrganizationalUnit?.find(y => y.id.toString() === x.toString())
        return {
            id: unit.id,
            name: unit.name,
            countPrev: 0,
            countCurrent: 0,
            countNext: 0
        }
    })

    if (annualLeave?.beforAndAfterOneWeeks?.length > 0 && listAnnual) {
        listAnnual.map(x => {
            annualLeave.beforAndAfterOneWeeks.forEach(y => {
                if (x.id.toString() === y.organizationalUnit.toString() && y.status === 'approved') {
                    let datePrev = new Date().setDate(new Date().getDate() - 1);
                    let dateNext = new Date().setDate(new Date().getDate() + 1);
                    if (isEqualDate(y.startDate, new Date()) || isEqualDate(y.endDate, new Date())) {
                        x.countCurrent++
                    }
                    if (isEqualDate(y.startDate, datePrev) || isEqualDate(y.endDate, datePrev)) {
                        x.countPrev++
                    }
                    if (isEqualDate(y.startDate, dateNext) || isEqualDate(y.endDate, dateNext)) {
                        x.countNext++
                    }
                }
            })
            return x
        })
    }

    const arrdays = getDays();
    let data1 = arrdays.map(x => 0), data2 = arrdays.map(x => 0);
    if (annualLeave.beforAndAfterOneWeeks.length) {
        data1 = arrdays.map(x => {
            let count = 0;
            annualLeave.beforAndAfterOneWeeks.forEach(y => {
                if (isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) {
                    count++
                }
            })
            return count
        })

        data2 = arrdays.map(x => {
            let count = 0;
            annualLeave.beforAndAfterOneWeeks.forEach(y => {
                if ((isEqualDate(y.startDate, x) || isEqualDate(y.endDate, x)) && y.status === "approved") {
                    count++
                }
            })
            return count
        })
    }
    renderChart({ ratioX: arrdays, nameData1: "Số đơn xin nghỉ", data1, nameData2: "Số đơn được duyệt", data2 });

    let organizationalUnitsName = [];
    if (organizationalUnits) {
        organizationalUnitsName = department.list.filter(x => organizationalUnits.includes(x._id));
        organizationalUnitsName = organizationalUnitsName.map(x => x.name);
    }

    return (
        <React.Fragment>
            <div className="box box-solid">
                <div className="box-header with-border">
                    <div className="box-title">
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
                </div>
                <div className="box-body" >
                    { !defaultUnit 
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
                        {!annualLeave.beforAndAfterOneWeeks.length &&
                            'Không có đơn xin nghỉ phép nào'}
                        <div ref={barChartAndTable}></div>
                    </div>
                    <div id="annualLeave-table">
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 20 }}>
                            <thead>
                                <tr>
                                    <th>Đơn vị</th>
                                    <th>Số nhân viên nghỉ hôm qua</th>
                                    <th>Số nhân viên nghỉ hôm nay</th>
                                    <th>Số nhân viên nghỉ ngày mai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listAnnual && listAnnual.length &&
                                    listAnnual.map(x => {
                                        return (
                                            <tr key={x.id}>
                                                <td>{x.name}</td>
                                                <td>{x.countPrev}</td>
                                                <td>{x.countCurrent}</td>
                                                <td>{x.countNext}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <SlimScroll verticalScroll={true} outerComponentId={"annualLeave-table"} maxHeight={400} activate={true} />
        </React.Fragment >
    )
}

function mapState(state) {
    const { annualLeave, department } = state;
    return { annualLeave, department };
}

const actionCreators = {
    getAnnualLeave: AnnualLeaveActions.searchAnnualLeaves,
};

const barChartAndTable = connect(mapState, actionCreators)(withTranslate(AnnualLeaveChartAndTable));
export { barChartAndTable as AnnualLeaveChartAndTable };
