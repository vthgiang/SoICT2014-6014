import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../../sales-order/redux/actions";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox, SelectMulti } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";

//Doanh số bán hàng từng đơn vị
function SalesOfEmployee(props) {

    const amountPieChart = React.createRef()
    const salesOfEmployee = React.createRef()

    const [state, setState] = useState({
        type: 1,
        organizationalUnit: "",
        currentRole: localStorage.getItem("currentRole"),
    })

    useEffect(() => {
        barChart();
    })

    const handleOrganizationChange = (value) => {
        setState({
            ...state,
            organizationalUnit: value[0],
        });
    };

    const setDataBarChart = () => {
        let { organizationalUnit, type } = state;
        let salesForDepartmentsValue = ["Doanh số bán hàng"];
        if (props.salesOrders && props.salesOrders.salesForDepartments) {
            const { salesForDepartments } = props.salesOrders;
            if (type === 1) {
                for (let index = 0; index < salesForDepartments.length; index++) {
                    let totalMoney = 0; //Tổng tiền của phòng
                    for (let indexUser = 0; indexUser < salesForDepartments[index].users.length; indexUser++) {
                        totalMoney += salesForDepartments[index].users[indexUser].sales;
                    }
                    salesForDepartmentsValue.push(totalMoney);
                }
            } else if (type === 2 && organizationalUnit !== "") {
                for (let index = 0; index < salesForDepartments.length; index++) {
                    if (salesForDepartments[index].organizationalUnit._id === organizationalUnit) {
                        for (let indexUser = 0; indexUser < salesForDepartments[index].users.length; indexUser++) {
                            salesForDepartmentsValue.push(salesForDepartments[index].users[indexUser].sales);
                        }
                    }
                }
            }
        }

        let dataBarChart = {
            columns: [salesForDepartmentsValue],
            type: "bar",
        };
        return dataBarChart;
    };

    function removePreviousChart() {
        const chart = salesOfEmployee.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const getDepartmentOptions = () => {
        let salesForDepartments = [];
        if (props.salesOrders && props.salesOrders.salesForDepartments) {
            salesForDepartments = props.salesOrders.salesForDepartments.map((element) => {
                return {
                    value: element.organizationalUnit._id,
                    text: element.organizationalUnit.name,
                };
            });
        }

        return salesForDepartments;
    };

    function handleTypeChange(type) {
        setState({
            ...state,
            type,
        });
    }

    // Khởi tạo PieChart bằng C3
    const barChart = () => {
        let { organizationalUnit, type } = state;
        let dataBarChart = setDataBarChart();
        removePreviousChart();
        let salesForDepartmentsTitle = [];
        if (props.salesOrders && props.salesOrders.salesForDepartments) {
            const { salesForDepartments } = props.salesOrders;
            if (type === 1) {
                for (let index = 0; index < salesForDepartments.length; index++) {
                    salesForDepartmentsTitle.push(salesForDepartments[index].organizationalUnit.name);
                }
            } else if (type === 2 && organizationalUnit !== "") {
                for (let index = 0; index < salesForDepartments.length; index++) {
                    if (salesForDepartments[index].organizationalUnit._id === organizationalUnit) {
                        for (let indexUser = 0; indexUser < salesForDepartments[index].users.length; indexUser++) {
                            salesForDepartmentsTitle.push(salesForDepartments[index].users[indexUser].user.name);
                        }
                    }
                }
            }
        }

        let chart = c3.generate({
            bindto: salesOfEmployee.current,

            data: dataBarChart,

            bar: {
                width: {
                    ratio: 0.5, // this makes bar width 50% of length between ticks
                },
                // or
                //width: 100 // this makes bar width 100px
            },
            axis: {
                y: {
                    label: {
                        text: "Đơn vị tiền",
                        position: "outer-middle",
                    },
                },
                x: {
                    type: "category",
                    categories: salesForDepartmentsTitle && salesForDepartmentsTitle.length ? salesForDepartmentsTitle : [],
                },
            },

            tooltip: {
                format: {
                    title: function (d) {
                        return d;
                    },
                    value: function (value) {
                        return value;
                    },
                },
            },

            legend: {
                show: true,
            },
        });
    };

    const handleStartDateChange = (value) => {
        setState((state) => {
            return {
                ...state,
                startDate: value,
            };
        });
    };

    const handleEndDateChange = (value) => {
        setState((state) => {
            return {
                ...state,
                endDate: value,
            };
        });
    };

    const handleSunmitSearch = () => {
        let { startDate, endDate, currentRole, status } = state;
        let data = {
            currentRole,
            status,
            startDate: startDate ? formatToTimeZoneDate(startDate) : "",
            endDate: endDate ? formatToTimeZoneDate(endDate) : "",
        };
        props.getSalesForDepartments(data);
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value,
        });
    };

    return (
        <div className="box">
            <div className="box-header with-border">
                <i className="fa fa-bar-chart-o" />
                <h3 className="box-title">{state.chart === 1 ? "Doanh số bán hàng tất cả các đơn vị" : "Doanh số bán hàng từng đơn vị"}</h3>
                <div className="form-inline">
                    {state.type === 2 && (
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đơn vị</label>
                            <SelectBox
                                id="chart-select-sales-room"
                                items={getDepartmentOptions()}
                                style={{ width: "10rem" }}
                                onChange={handleOrganizationChange}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Từ</label>
                        <DatePicker
                            id="date_picker_dashboard_start_sales_of_employee"
                            value={state.startDate}
                            onChange={handleStartDateChange}
                            disabled={false}
                        />
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>Đến</label>
                        <DatePicker
                            id="date_picker_dashboard_end_sales_of_employee"
                            value={state.endDate}
                            onChange={handleEndDateChange}
                            disabled={false}
                        />
                    </div>
                    {/* <div className="form-group">
                            <label className="form-control-static">Trạng thái đơn</label>
                            <SelectMulti
                                id={`selectMulti-dasboard-filter-status-sales-order`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    {
                                        value: 1,
                                        text: "Chờ phê duyệt",
                                    },
                                    {
                                        value: 2,
                                        text: "Đã phê duyệt",
                                    },
                                    {
                                        value: 3,
                                        text: "Yêu cầu sản xuất",
                                    },
                                    {
                                        value: 4,
                                        text: "Đã lập kế hoạch sản xuất",
                                    },
                                    {
                                        value: 5,
                                        text: "Đã yêu cầu nhập kho",
                                    },
                                    {
                                        value: 6,
                                        text: "Đang giao hàng",
                                    },
                                    {
                                        value: 7,
                                        text: "Đã giao hàng",
                                    },
                                    {
                                        value: 8,
                                        text: "Hủy đơn",
                                    },
                                ]}
                                multiple="multiple"
                                options={{ nonSelectedText: "Chọn trạng thái đơn", allSelectedText: "Đã chọn tất cả" }}
                                onChange={handleStatusChange}
                            />
                        </div> */}
                    <div className="form-group">
                        <button className="btn btn-success" onClick={() => handleSunmitSearch()}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <div className="box-tools pull-right">
                    <div
                        className="btn-group pull-rigth"
                        style={{
                            position: "absolute",
                            right: "5px",
                            top: "5px",
                        }}
                    >
                        <button
                            type="button"
                            className={`btn btn-xs ${state.type === 2 ? "active" : "btn-danger"}`}
                            onClick={() => handleTypeChange(1)}
                        >
                            Xem tất cả
                        </button>
                        <button
                            type="button"
                            className={`btn btn-xs ${state.type === 2 ? "btn-danger" : "active"}`}
                            onClick={() => handleTypeChange(2)}
                        >
                            Chi tiết đơn vị
                        </button>
                    </div>
                </div>
                <div ref={salesOfEmployee} id="salesOfEmployee"></div>
            </div>
        </div>
    );
}


function mapStateToProps(state) {
    const { salesOrders } = state;
    return { salesOrders };
}

const mapDispatchToProps = {
    getSalesForDepartments: SalesOrderActions.getSalesForDepartments,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOfEmployee));
