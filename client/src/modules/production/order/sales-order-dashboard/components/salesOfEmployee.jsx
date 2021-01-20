import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../../sales-order/redux/actions";

import c3 from "c3";
import "c3/c3.css";

import { DatePicker, SelectBox, SelectMulti } from "../../../../../common-components";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate";
class SalesOfEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            organizationalUnit: "",
            currentRole: localStorage.getItem("currentRole"),
        };
    }

    componentDidMount() {
        this.barChart();
    }

    handleOrganizationChange = (value) => {
        this.setState({
            organizationalUnit: value[0],
        });
    };

    setDataBarChart = () => {
        let { organizationalUnit, type } = this.state;
        let salesForDepartmentsValue = ["Doanh số bán hàng"];
        if (this.props.salesOrders && this.props.salesOrders.salesForDepartments) {
            const { salesForDepartments } = this.props.salesOrders;
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

    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    getDepartmentOptions = () => {
        let salesForDepartments = [];
        if (this.props.salesOrders && this.props.salesOrders.salesForDepartments) {
            salesForDepartments = this.props.salesOrders.salesForDepartments.map((element) => {
                return {
                    value: element.organizationalUnit._id,
                    text: element.organizationalUnit.name,
                };
            });
        }

        return salesForDepartments;
    };

    handleTypeChange(type) {
        this.setState({
            type,
        });
    }

    // Khởi tạo PieChart bằng C3
    barChart = () => {
        let { organizationalUnit, type } = this.state;
        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let salesForDepartmentsTitle = [];
        if (this.props.salesOrders && this.props.salesOrders.salesForDepartments) {
            const { salesForDepartments } = this.props.salesOrders;
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
            bindto: this.refs.salesOfEmployee,

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

    handleStartDateChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                startDate: value,
            };
        });
    };

    handleEndDateChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                endDate: value,
            };
        });
    };

    handleSunmitSearch = () => {
        let { startDate, endDate, currentRole, status } = this.state;
        let data = {
            currentRole,
            status,
            startDate: startDate ? formatToTimeZoneDate(startDate) : "",
            endDate: endDate ? formatToTimeZoneDate(endDate) : "",
        };
        this.props.getSalesForDepartments(data);
    };

    handleStatusChange = (value) => {
        this.setState({
            status: value,
        });
    };

    render() {
        this.barChart();
        return (
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{this.state.chart === 1 ? "Doanh số bán hàng tất cả các đơn vị" : "Doanh số bán hàng từng đơn vị"}</h3>
                    <div className="form-inline">
                        {this.state.type === 2 && (
                            <div className="form-group">
                                <label style={{ width: "auto" }}>Đơn vị</label>
                                <SelectBox
                                    id="chart-select-sales-room"
                                    items={this.getDepartmentOptions()}
                                    style={{ width: "10rem" }}
                                    onChange={this.handleOrganizationChange}
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Từ</label>
                            <DatePicker
                                id="date_picker_dashboard_start_sales_of_employee"
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                disabled={false}
                            />
                        </div>

                        {/**Chọn ngày kết thúc */}
                        <div className="form-group">
                            <label style={{ width: "auto" }}>Đến</label>
                            <DatePicker
                                id="date_picker_dashboard_end_sales_of_employee"
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}
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
                                onChange={this.handleStatusChange}
                            />
                        </div> */}
                        <div className="form-group">
                            <button className="btn btn-success" onClick={() => this.handleSunmitSearch()}>
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
                                className={`btn btn-xs ${this.state.type === 2 ? "active" : "btn-danger"}`}
                                onClick={() => this.handleTypeChange(1)}
                            >
                                Xem tất cả
                            </button>
                            <button
                                type="button"
                                className={`btn btn-xs ${this.state.type === 2 ? "btn-danger" : "active"}`}
                                onClick={() => this.handleTypeChange(2)}
                            >
                                Chi tiết đơn vị
                            </button>
                        </div>
                    </div>
                    <div ref="salesOfEmployee"></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { salesOrders } = state;
    return { salesOrders };
}

const mapDispatchToProps = {
    getSalesForDepartments: SalesOrderActions.getSalesForDepartments,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOfEmployee));
