import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from 'sweetalert2';
import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar } from "../../../../common-components";
import { useEffect } from "react";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { ShipperActions } from "../../shipper/redux/actions";
import CalculatedSalaryTable from "./calculatedSalaryTable";
import moment from "moment";

const ShipperSalaryStatisticTable = (props) => {
    const getTableId = "table-shipper-salary-table";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const { shipper , translate } = props;
    const today = new Date();

    const [state, setState] = useState({
        page: 1,
        perPage: getLimit,
        shipperCostEdit: null,
        shipperCostId: null,
        tableId: getTableId,
        shipperName: "",
        shipperCost: "",

        currentYear: new Date().getFullYear(),
        month: today.getFullYear() + '-' + (today.getMonth() + 1),
        date: (today.getMonth() + 1) + '-' + today.getFullYear(),

        infoSearch: {
            month: today.getFullYear() + '-' + (today.getMonth() + 1),
            date: (today.getMonth() + 1) + '-' + today.getFullYear(),
        },
        shipperSalaryList: [],
        calculatedShippersSalary: [],
        lists: []
    })
    const { page, perPage, costEdit, costId, shipperName, shipperCost, shipperSalaryList, calculatedShippersSalary, lists } = state;


    useEffect(() => {
        let monthYear = state.infoSearch.month;
        let firstDateInMonth = new Date(monthYear + '-01');
        let lastDateInMonth = new Date(firstDateInMonth.getFullYear(), firstDateInMonth.getMonth() + 1, 0);
        props.getAllShipperSalaryByCondition({
            firstDateInMonth: moment(firstDateInMonth).format("DD-MM-YYYY"),
            lastDateInMonth: moment(lastDateInMonth).format("DD-MM-YYYY")
        });
    }, [])

    useEffect(() => {
        if (shipper.calculatedSalary) {
            setState({
                ...state,
                calculatedShippersSalary: shipper.calculatedSalary
            })
        }
    }, [shipper.calculatedSalary])

    const handleChangeShipperName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            shipperName: value
        });
    }

    const handleSubmitSearch = () => {
        let monthYear = state.infoSearch.month;
        let firstDateInMonth = new Date(monthYear + '-01');
        let lastDateInMonth = new Date(firstDateInMonth.getFullYear(), firstDateInMonth.getMonth() + 1, 0);

        props.getAllShipperSalaryByCondition({
            firstDateInMonth: moment(firstDateInMonth).format('DD-MM-YYYY'),
            lastDateInMonth: moment(lastDateInMonth).format('DD-MM-YYYY'),
            shipperName: shipperName ? shipperName : ""
        });
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getAllTransportationCost(state);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number)
        });
        props.getAllTransportationCost(state);
    }

    const handleEdit = (shipperCost) => {
        setState({
            ...state,
            shipperCostEdit: shipperCost
        });
        window.$('#modal-edit-shipper-cost').modal('show');
    }


    const ConfirmInitRouteNotification = (data) => {
        Swal.fire({
            html: `<h4"><div>${data?.content?data.content:""}</div></div></h4>`,
            icon: data?.icon?data.icon:'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Huỷ",
            confirmButtonText: "Xác nhận",
        }).then((result) => {
            if (result.isConfirmed) {
                if(data.func) data.func();
            }
        })
    }

    const handleShowCalculatedSalaryTable = () => {
        props.calculateShipperSalary({
            monthSearch: "8",
            yearSearch: "2022"
        });
        window.$('#modal-calculate-shipper-salary').modal('show');
    }

    const handleShowConfirm = () => {
        let dataConfirm = {
            content: "Bạn có chắc muốn tính lương với các thông số cài đặt ở trang bên?",
            func: handleShowCalculatedSalaryTable,
            icon: "info"
        }
        ConfirmInitRouteNotification(dataConfirm);
    }

    const handleSelectMonth = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            infoSearch: {
                ...state.infoSearch,
                month: month,
                date: value
            }
        })
    };

    useEffect(() => {
        if (shipper.shippersSalary?.salary) {
            let listSalary = shipper.shippersSalary.salary.map((shipperSalary) => {
                return {
                    shipperName: shipperSalary.shipper.name,
                    fixedSalary: shipperSalary.fixedSalary,
                    bonusSalary: shipperSalary.bonusSalary,
                    totalSalary: shipperSalary.totalSalary
                }
            })
            setState({
                ...state,
                lists: listSalary
            })
        } else {
            setState({
                ...state,
                lists: []
            })
        }
    }, [shipper.shippersSalary])

    const { tableId } = state;

    let d = new Date(),
        monthDate = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (monthDate.length < 2)
        monthDate = '0' + monthDate;
    if (day.length < 2)
        day = '0' + day;
    let defaultDate = [monthDate, year].join('-');

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <CalculatedSalaryTable
                    shipperSalaryList={calculatedShippersSalary}
                    monthYear={state.infoSearch.month}
                />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.cost_management.shipper_name_search')}</label>
                        <input type="text" className="form-control" name={shipperName} onChange={handleChangeShipperName} placeholder={translate('manage_transportation.cost_management.shipper_name_search')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('manage_transportation.cost_management.month')}</label>
                        <DatePicker
                            id="monthInShipperSalaryTable"
                            dateFormat="month-year"
                            value={defaultDate}
                            onChange={handleSelectMonth}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={handleSubmitSearch}>{translate('manage_example.search')}</button>
                    </div>
                    <div className="form-group" style={{float: "right"}}>
                        <button type="button" className="btn btn-info" title={translate('manage_transportation.cost_management.shipper_cost_add')} onClick={handleShowConfirm}>{translate('manage_transportation.cost_management.shipper_cost_calculate')}</button>
                    </div>
                </div>
                <label htmlFor="shipper-salary-statistic" style={{marginTop: "20px"}}>Bảng lương</label>
                <table id="shipper-salary-statistic" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_transportation.cost_management.shipper_name')}</th>
                            <th>{translate('manage_transportation.cost_management.fixed_salary')}</th>
                            <th>{translate('manage_transportation.cost_management.bonus_title')}</th>
                            <th>{translate('manage_transportation.cost_management.shipper_cost')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((shipper, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * state.perPage}</td>
                                    <td>{shipper.shipperName}</td>
                                    <td>{shipper.fixedSalary}</td>
                                    <td>{shipper.bonusSalary}</td>
                                    <td>{shipper.totalSalary}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {shipper.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    func={setPage}
                /> */}
            </div>
        </React.Fragment>
    )

}

function mapStateToProps(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapDispatchToProps = {
    getAllShipperWithCondition: ShipperActions.getAllShipperWithCondition,
    calculateShipperSalary: ShipperActions.calculateShipperSalary,
    getAllShipperSalaryByCondition: ShipperActions.getAllShipperSalaryByCondition
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperSalaryStatisticTable));