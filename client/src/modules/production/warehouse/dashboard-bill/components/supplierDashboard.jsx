
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import Swal from 'sweetalert2';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function SupplierDashboard(props) {

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
        pieChart: true,
        currentRole: localStorage.getItem("currentRole"),
        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,
        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        },
        defaultEndMonth: [endMonth, year].join('-'),
        defaultStartMonth: ['01', year].join('-'),
    })

    const refPieChart = React.createRef();

    useEffect(() => {
        pieChart();
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

    const getDataForChart = () => {
        const { dataChart } = props;
        let data = [];
        if (dataChart && dataChart.length > 0) {
            dataChart.forEach(item => {
                let name = item.supplier.name;
                let quantity = item.quantity;
                let obj = [[name]]
                obj.push(quantity);
                data.push(obj);
            })
        }
        return data;
    }

    const pieChart = () => {
        let dataChart = getDataForChart();
        c3.generate({
            bindto: refPieChart.current,
            data: {
                columns: dataChart,
                type: 'pie',
            },
            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },
            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },
            legend: {
                show: true
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
                },
                isSubmit: true,
            })

        }
        // await props.getInventoryByGoodAndStock(state.infosearch);
    };

    const { translate, lots, stocks } = props;
    const { listStocks } = stocks;
    const { defaultEndMonth, defaultStartMonth } = state;

    pieChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{"Xem số lượng phiếu nhập cho từng nhóm nhà cung cấp"}</h3>
                    <div className="form-inline">
                        <div className="form-group" style={{ display: 'flex', width: '30%' }}>
                            <label>{"Kho"}</label>
                            <SelectMulti
                                id={`select-multi-stock-supplier-dashboard`}
                                multiple="multiple"
                                options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                                onChange={handleStockChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Từ"}</label>
                            <DatePicker
                                id="start-month-supplier-dashboard"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Đến"}</label>
                            <DatePicker
                                id="end-month-supplier-dashboard"
                                dateFormat="month-year"
                                value={defaultEndMonth}
                                onChange={handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} onClick={handleSearchData}>
                                {translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <div ref={refPieChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SupplierDashboard));
