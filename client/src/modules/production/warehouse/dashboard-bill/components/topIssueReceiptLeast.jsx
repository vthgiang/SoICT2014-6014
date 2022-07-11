
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import Swal from 'sweetalert2';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function TopIssueReceiptLeast(props) {
    let today = new Date(),
        month = today.getMonth() + 1,
        year = today.getFullYear();
    let endMonth;
    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const INFO_SEARCH = {
        startMonth: year + '-01',
        endMonth: [year, endMonth].join('-'),
    };
    const [state, setState] = useState({
        barChart: true,
        currentRole: localStorage.getItem("currentRole"),
        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,
        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        },
        defaultEndMonth: [endMonth, year].join('-'),
        defaultStartMonth: ['01', year].join('-'),
        type: '1',
        numberTopAtLeast: '1',
    })

    const refBarAndLineChart = React.createRef();


    useEffect(() => {
        barAndChart();
    }, [props.dataChart])

    const handleStockChange = (value) => {
        setState({
            ...state,
            stock: value
        })
    }

    /** Select month start in box */
    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            startMonth: month
        })
    };

    /** Select month end in box */
    const handleSelectMonthEnd = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            endMonth: month
        })
    };

    const handleTypeChange = (value) => {
        setState({
            ...state,
            type: value[0]
        })
    }

    const handleNumberTopAtLeastChange = (value) => {
        setState({
            ...state,
            numberTopAtLeast: value[0]
        })
    }

    const getDataChart = () => {
        const { dataChart } = props;
        let quantity = ["Số lượng"];
        let name = ["x"];
        if (dataChart && dataChart.length > 0) {
            dataChart.map((item, index) => {
                quantity.push(item.quantity);
                name.push(item.good.name);        
            })
        }
        return { quantity, name };
    }

    // Khởi tạo BarChart bằng C3
    const barAndChart = () => {
        let dataChart = getDataChart();  
        c3.generate({
            bindto: refBarAndLineChart.current,
            data: {
                x: 'x',
                columns: [
                    dataChart.name,
                    dataChart.quantity
                ],
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                }
            }
        });
    }

    const handleSearchData = async () => {
        let startMonth = new Date(state.startMonth);
        let endMonth = new Date(state.endMonth);
        if (startMonth.getTime() > endMonth.getTime()) {
            const { translate } = props;
            Swal.fire({
                title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
            })
        } else {
            await setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    managementLocation: state.currentRole,
                    stock: state.stock,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth,
                    type: state.type,
                    numberTopAtLeast: state.numberTopAtLeast,
                },
                isSubmit: true,
            })

        }
        // await props.getInventoryByGoodAndStock(state.infosearch);
    };

    const { translate, lots, stocks } = props;
    const { listStocks } = stocks;
    const { defaultEndMonth, defaultStartMonth, type, numberTopAtLeast } = state;

    barAndChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{"Tốp những mặt hàng nhập, xuất nhiều nhất"}</h3>
                    <div className="form-inline" style={{ display: 'flex', marginTop: '10px' }}>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label>{"Kho"}</label>
                            <SelectMulti
                                id={`select-multi-stock-top-bill-issue-receipt-at-least`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                                onChange={handleStockChange}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label className="form-control-static">{"Loại"}</label>
                            <SelectBox
                                id="select-box-type-top-bill-issue-receipt-at-least"
                                className="form-control select2"
                                value={type}
                                items={[
                                    { value: '1', text: 'Nhập' },
                                    { value: '0', text: 'Xuất' },
                                ]}
                                onChange={handleTypeChange}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label className="form-control-static">{"Top"}</label>
                            <SelectBox
                                id="select-top-bill-issue-receipt-at-least"
                                className="form-control select2"
                                value={numberTopAtLeast}
                                items={[
                                    { value: '1', text: '5' },
                                    { value: '2', text: '10' },
                                    { value: '3', text: '15' },
                                    { value: '4', text: '20' },
                                ]}
                                onChange={handleNumberTopAtLeastChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{"Từ Tháng"}</label>
                            <DatePicker
                                id="start-month-top-issue-receipt-at-least"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Đến Tháng"}</label>
                            <DatePicker
                                id="end-month-top-issue-receipt-at-least"
                                dateFormat="month-year"
                                value={defaultEndMonth}
                                onChange={handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={handleSearchData}
                            >{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>

                    <div ref={refBarAndLineChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopIssueReceiptLeast));
