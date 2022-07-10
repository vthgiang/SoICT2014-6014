
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs'
import Swal from 'sweetalert2';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function SupplierNumberDashboard(props) {

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
        barAndLineChart: false,
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

    const refBarAndLineChart = React.createRef();

    useEffect(() => {
        barAndChart();
    }, [props.dataChart])

    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            barAndLineChart: value
        })
    }

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

    const handleCustomerChange = (value) => {
        setState({
            ...state,
            customer: value[0],
        });
    };

     // Nhà cung cấp 

     const getCustomers = () => {
        const { crm, translate } = props;
        let customerArr = [];

        crm.customers.list.map((item) => {
            customerArr.push({
                value: item._id,
                text: item.name,
            });
        });
        return customerArr;
    };

    const setDataIntoArrayByMonth = (arrMonth, data) => {
        let totalData = [];
        let row = [...arrMonth];
        row = row.map(r => {
            let listData = data.filter(t => {
                let date = new Date(r)
                let endMonth = new Date(date.setMonth(date.getMonth() + 1))
                let endDate = new Date(endMonth.setDate(endMonth.getDate() - 1))
                if (new Date(r).getTime() <= new Date(t.createdAt).getTime() && new Date(t.createdAt).getTime() <= new Date(endDate)) {
                    return true;
                }
                return false;
            });
            totalData.push(listData.length);
        })
        return totalData;
    }

    const getDataForChart = () => {
        const { dataChart } = props;
        const { startMonth, endMonth } = state;
        const period = dayjs(endMonth).diff(startMonth, 'month');

        let arrMonth = [];
        for (let i = 0; i <= period; i++) {
            arrMonth = [
                ...arrMonth,
                dayjs(startMonth).add(i, 'month').format("YYYY-MM-DD"),
            ];
        }
        let title = ["x", ...arrMonth];
        let quantity = ["Số lượng"];
        if (dataChart && dataChart.length > 0) {
            quantity = quantity.concat(setDataIntoArrayByMonth(arrMonth, dataChart[0].bill));
        }
        return {
            title: title,
            quantity: quantity,
        }
    }

    // Khởi tạo BarChart bằng C3
    const barAndChart = () => {
        const dataForChart = getDataForChart();
        const { barAndLineChart } = state;
        c3.generate({
            bindto: refBarAndLineChart.current,
            data: {
                x: 'x',
                columns: [
                    dataForChart.title,
                    dataForChart.quantity,
                ],
                type: barAndLineChart ? 'bar' : '',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 70
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
                },
                isSubmit: true,
            })

        }
        // await props.getInventoryByGoodAndStock(state.infosearch);
    };

    const { translate, lots, stocks } = props;
    const { listStocks } = stocks;
    const { defaultEndMonth, defaultStartMonth, barAndLineChart, customer } = state;
    const dataCustomer = getCustomers();

    barAndChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{"Theo dõi số lượng phiếu nhập kho của mỗi nhà cung cấp"}</h3>
                    <div className="form-inline" style={{ marginTop: '10px' }}>
                        <div className="form-group">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ display: 'flex' }}>
                                <label>{"Kho"}</label>
                                <SelectMulti
                                    id={`select-multi-stock-supplier-number-dashboard`}
                                    multiple="multiple"
                                    options={{ nonSelectedText: "Tổng các kho", allSelectedText: "Tổng các kho" }}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                                    onChange={handleStockChange}
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ display: 'flex' }}>
                                <label style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "200px"}}>{"Nhà cung cấp"}</label>
                                {/* sử dụng dữ liệu của khách hàng */}
                                <SelectBox
                                    id={`select-customer-supplier-number-dashboard`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={customer}
                                    items={dataCustomer}
                                    onChange={handleCustomerChange}
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{"Từ"}</label>
                            <DatePicker
                                id="start-month-supplier-number-dashboard"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Đến"}</label>
                            <DatePicker
                                id="end-month-supplier-number-dashboard"
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
                    <div className="dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số phiếu</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Line chart</button>
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Bar chart</button>
                            </div>
                        </div>
                        <div ref={refBarAndLineChart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SupplierNumberDashboard));
