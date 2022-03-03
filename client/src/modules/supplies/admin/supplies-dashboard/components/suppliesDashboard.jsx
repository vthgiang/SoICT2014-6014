import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import isEqual from 'lodash/isEqual';
import { SuppliesActions } from '../../supplies/redux/actions';
import { SuppliesDashboardActions } from '../redux/actions';
import Swal from 'sweetalert2';
import { DatePicker, SelectBox } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { SuppliesDashboardService } from '../redux/service';
import StatisticalSuppliesByType from './statisticalSuppliesByType';

function SuppliesDashboard(props) {

    let d = new Date(),
        month = d.getMonth() + 1,
        year = d.getFullYear();
    let startMonth, endMonth, startYear;

    if (month > 3) {
        startMonth = month - 3;
        startYear = year;
    } else {
        startMonth = month - 3 + 12;
        startYear = year - 1;
    }
    if (startMonth < 10)
        startMonth = '0' + startMonth;
    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    let INFO_SEARCH = {
        typeOfChart: ["Bar"],
        purchaseDateAfter: [startYear, startMonth].join('-'),
        purchaseDateBefore: [year, endMonth].join('-'),
    }

    const defaultConfig = { limit: 10 }
    const dashboardSuppliesId = "dashboard_supplies_by_type";
    const dashboardSupplies = getTableConfiguration(dashboardSuppliesId, defaultConfig).limit;

    const [state, setState] = useState({
        suppliesData: [],
        countInvoice: [],
        countAllocation: [],
        valueInvoice: [],

        purchaseDateAfter: INFO_SEARCH.purchaseDateAfter,
        purchaseDateBefore: INFO_SEARCH.purchaseDateBefore,
        defaultStartMonth: [startMonth, startYear].join('-'),
        defaultEndMonth: [endMonth, year].join('-'),

        page: 1,
        limit: dashboardSupplies,
        listSupplies: [],
    })

    useEffect(() => {
        props.getSuppliesDashboard();
    }, []);

    const handleChangeSupplies = (value) => {
        setState({
            ...state,
            listSupplies: value,
        })
        console.log("type", JSON.stringify(value));
    }

    const handleSelectSuppliesOfDisplay = async (value) => {
        INFO_SEARCH.displayBy = value
    }

    const handlePaginationSupplies = (page) => {
        const { limit } = state;
        let pageConvert = (page - 1) * (limit);

        setState({
            ...state,
            page: parseInt(pageConvert),
        })
    }

    const handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        INFO_SEARCH.purchaseDateAfter = month;
    }

    const handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        INFO_SEARCH.purchaseDateBefore = month;
    }

    const handleSearchData = async () => {
        let purchaseDateAfter = new Date(INFO_SEARCH.purchaseDateAfter);
        let purchaseDateBefore = new Date(INFO_SEARCH.purchaseDateBefore);

        if (purchaseDateAfter.getTime() > purchaseDateBefore.getTime()) {
            const { translate } = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            props.getSuppliesDashboard({ name: "purchase-date-data", endTime: purchaseDateBefore, startTime: purchaseDateAfter })
        }
    }

    const setCountInvoice = (value) => {
        let { countInvoice } = state;

        if (!isEqual(countInvoice, value)) {
            setState(state => {
                return {
                    ...state,
                    countInvoice: value,
                }
            })
        }
    }

    const setCountAllocation = (value) => {
        let { countAllocation } = state;

        if (!isEqual(countAllocation, value)) {
            setState(state => {
                return {
                    ...state,
                    countAllocation: value,
                }
            })
        }
    }

    const setValueInvoice = (value) => {
        let { valueInvoice } = state;

        if (!isEqual(valueInvoice, value)) {
            setState(state => {
                return {
                    ...state,
                    valueInvoice: value,
                }
            })
        }
    }

    const { translate } = props;
    let { listSupplies, countInvoiceState, countAllocationState, valueInvoiceState } = state;
    let { purchaseDateAfter, purchaseDateBefore } = INFO_SEARCH;
    // let { suppliesData, valueInvoice, countInvoice, countAllocation } = state;
    let { suppliesData, valueInvoice, countInvoice, countAllocation } = props.suppliesDashboardReducer;

    let format = year == "true" ? "year" : "month-year";
    let startValue = year == "true" ? purchaseDateAfter.slice(0, 4) : purchaseDateAfter.slice(5, 7) + ' - ' + purchaseDateAfter.slice(0, 4);
    let endValue = year == "true" ? purchaseDateBefore.slice(0, 4) : purchaseDateBefore.slice(5, 7) + ' - ' + purchaseDateBefore.slice(0, 4);

    // let listSuppliesAmount = {}
    // if (this.state.listSupplies.length !== 0) {
    //     let countInvoice = [], countAllocation = [], valueInvoice = [], idSupplies = [], shortName = [], listSuppliesData = []
    //     this.state.listSupplies.forEach(element => {
    //         let index = suppliesData.findIndex(value => value._id === element)
    //         countInvoice = [...countInvoice, countInvoiceState[index]]
    //         countAllocation = [...countAllocation, countAllocationState[index]]
    //         valueInvoice = [...valueInvoice, valueInvoiceState[index]]
    //         idSupplies = [...idSupplies, suppliesData[index]._id]
    //         shortName = [...shortName, suppliesData[index].suppliesName]
    //         listSuppliesData = [...listSuppliesData, suppliesData[index]]
    //     });
    //     listSuppliesAmount = {
    //         countInvoice: countInvoice,
    //         countAllocation: countAllocation,
    //         valueInvoice: valueInvoice,
    //         idSupplies: idSupplies,
    //         shortName: shortName,
    //         listSuppliesData: listSuppliesData,
    //     }
    // } else {
    //     listSuppliesAmount = {
    //         countInvoice: this.state.countInvoice,
    //         countAllocation: this.state.countAllocation,
    //         valueInvoice: this.state.valueInvoice,
    //         idSupplies: this.state.suppliesData.map(x => {
    //             return x._id;
    //         }),
    //         shortName: this.state.suppliesData.map(x => {
    //             return x.suppliesName;
    //         }),
    //         listSuppliesData: this.state.suppliesData,
    //     }
    // }

    return (
        <React.Fragment>
            <div className='qlcv'>
                <div className='row'>
                    <div className='col-md-12'>
                        {/* <div className="form-inline">
                            <div className="form-group">
                                <label>{translate('asset.dashboard.statistic_by')}</label>
                                <SelectBox
                                    id="selectSuppliesOfStatistic2"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={suppliesData.map(x => {
                                        return { value: x._id, text: x.suppliesName }
                                    })}
                                    onChange={handleChangeSupplies}
                                    value={listSupplies}
                                    multiple={true}
                                />
                            </div>
                        </div> */}

                        <div className="form-inline">
                            <div className="form-group">
                                <label >{translate('task.task_management.from')}</label>
                                <DatePicker
                                    id={`purchase_after${year}`}
                                    dateFormat={format}
                                    value={startValue}
                                    onChange={handleChangeDateAfter}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <label >{translate('task.task_management.to')}</label>
                                <DatePicker
                                    id={`purchase_before${year}`}
                                    dateFormat={format}
                                    value={endValue}
                                    onChange={handleChangeDateBefore}
                                    disabled={false}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success" onClick={handleSearchData}>{translate('task.task_management.search')}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-solid">
                            <div className="box-header">
                                <div className="box-title">Biểu đồ thống kê vật tư</div>
                            </div>
                            <div className="box-body qlcv">
                                {
                                    (countInvoice || countAllocation || valueInvoice) &&
                                    <StatisticalSuppliesByType
                                        countInvoice={countInvoice}
                                        countAllocation={countAllocation}
                                        valueInvoice={valueInvoice}
                                        suppliesData={suppliesData}
                                    />
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const { suppliesReducer, suppliesDashboardReducer } = state;
    return { suppliesReducer, suppliesDashboardReducer };
}

const mapDispatchToProps = {
    searchSupplies: SuppliesActions.searchSupplies,
    getSuppliesDashboard: SuppliesDashboardActions.getSuppliesDashboard,
}

const dashboardSuppliesConnect = connect(mapState, mapDispatchToProps)(withTranslate(SuppliesDashboard));
export { dashboardSuppliesConnect as SuppliesDashboard };