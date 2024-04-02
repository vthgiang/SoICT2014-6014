import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import Swal from 'sweetalert2';
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import { useEffect } from "react";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import ShipperSalaryTable from "./shipperSalaryTable";
import { TransportationCostManagementActions } from "../redux/actions";
import { ShipperActions } from "../../shipper/redux/actions";
import ShipperCostUpdateForm from "./shipperCostUpdateForm";

const ShipperCostManagement = (props) => {
    const getTableId = "table-shipper-cost-management";

    const { vehicle , translate, transportationCostManagement, shipper } = props;

    const [state, setState] = useState({
        page: 1,
        perPage: 5,
        salaryTablePage: 1,
        salaryTablePerPage: 5,
        shipperCostEdit: null,
        shipperCostId: null,
        tableId: getTableId,
        shipperCostName: "",
        shipperCost: "",
        shipperCostFormula: "",
        shipperNameToSearch: ""
    })
    const { page, perPage, costEdit, costId, shipperCostName, shipperCost, shipperCostFormula, salaryTablePerPage, shipperCostEdit, shipperNameToSearch } = state;

    useEffect(() => {
        let { perPage } = state;
        props.getAllShipperWithCondition({page: page, perPage: perPage})
        props.getFormula();
        props.getAllShipperCosts({page: page, perPage: perPage});
    }, [])
    useEffect(() => {
        setState({
            ...state,
            shipperCostFormula: transportationCostManagement?.formula?.shipper
        })
    }, [transportationCostManagement.formula])

    const handleChangeShipperNameToSearch = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            shipperNameToSearch: value
        });
    }

    const handleSubmitSearch = () => {
        props.getAllShipperWithCondition({name: shipperNameToSearch, page: 1, perPage: 5});
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });
        props.getAllShipperCosts({
            page: parseInt(pageNumber),
            perPage: perPage
        });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number)
        });
        props.getAllTransportationCost(state);
    }

    const setSalaryTablePage = (pageNumber) => {
        setState({
            ...state,
            salaryTablePage: parseInt(pageNumber)
        });

        props.getAllShipperWithCondition({page: pageNumber, perPage: state.salaryTablePerPage});
    }

    const setSalaryTablePerPage = (number) => {
        setState({
            ...state,
            salaryTablePerPage: parseInt(number)
        });
        props.getAllTransportationCost({perPage: number, page: state.salaryTablePage});
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
        window.$(`#modal-shipper-salary-table`).modal('show');
    }

    const handleShowConfirm = () => {
        let dataConfirm = {
            content: "Bạn có chắc muốn tính lương với các thông số này?",
            func: handleShowCalculatedSalaryTable,
            icon: "info"
        }
        ConfirmInitRouteNotification(dataConfirm);
    }
    const handleChangeShipperCostFormula = (e) => {
        setState({
            ...state,
            shipperCostFormula: e.target.value
        })
    }

    const handleUpdateShipperCostFormula = () => {
        props.createOrUpdateVehicleCostFormula({shipper: shipperCostFormula})
    }

    let lists = [
        {type: "Đơn giá", code: "ORDER_BONUS", name: "", cost: "25000"},
        {type: "Tỷ lệ giao hàng thành công", code: "RATE_SUCCESS", name: "≥80%", cost: "10% Tổng đơn"},
        {type: "Tỷ lệ giao hàng thành công", code: "RATE_SUCCESS", name: "≥95%", cost: "20% Tổng đơn"},
        {type: "Tỷ lệ giao hàng thành công", code: "RATE_SUCCESS", name: "≤70%", cost: "-10% Tổng đơn"},
        {type: "Đơn hàng nặng, khó thực hiện", code: "HARD_ORDER", name: ">5kg", cost: "+2000đ/kg"},
    ];
    let shipperCostList = [];
    if (transportationCostManagement?.shipperCostList.length > 0) {
        shipperCostList = transportationCostManagement?.shipperCostList.map((shipperCost) => {
            return {
                id: shipperCost._id,
                name: shipperCost.name,
                code: shipperCost.code,
                quota: shipperCost.quota,
                cost: shipperCost.cost,
            }
        })
    }

    let listShipperWithSalary = [];
    if (shipper?.lists?.length > 0) {
        listShipperWithSalary = shipper.lists.map((item) => {
            return {
                name: item.driver.fullName,
                salary: item.salary,
                employeeId: item.driver._id
            }
        })
    }

    const totalSalaryPage = Math.ceil(shipper.totalList / salaryTablePerPage);
    const totalShipperCostPage = Math.ceil(transportationCostManagement.totalShipperCostList / perPage)
    const { tableId } = state;
    return (
        <React.Fragment>

            <div className="box-body qlcv">
                {/* <ShipperSalaryTable/> */}
                <ShipperCostUpdateForm
                    shipperCostEdit ={shipperCostEdit}
                />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.cost_management.shipper_name_search')}</label>
                        <input type="text" className="form-control" name={shipperNameToSearch} onChange={handleChangeShipperNameToSearch} placeholder={translate('manage_transportation.cost_management.shipper_name_search')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={handleSubmitSearch}>{translate('manage_example.search')}</button>
                    </div>
                    {/* <div className="form-group" style={{float: "right"}}>
                        <button type="button" className="btn btn-success" title={translate('manage_transportation.cost_management.shipper_cost_add')} onClick={handleCreate}>{translate('manage_transportation.cost_management.shipper_cost_add')}</button>
                    </div> */}

                </div>

                {/* Bảng lương cứng */}
                <label htmlFor="fixed-salary" style={{marginTop: "20px"}}>Lương cứng</label>
                <table id="fixed-salary" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_transportation.cost_management.shipper_name')}</th>
                            <th>{translate('manage_transportation.cost_management.fixed_salary')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId="fixed-salary"
                                    columnArr={[
                                        translate('manage_transportation.cost_management.shipper_name'),
                                        translate('manage_transportation.cost_management.fixed_salary'),
                                    ]}
                                    setLimit={setSalaryTablePerPage}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listShipperWithSalary && listShipperWithSalary.length !== 0) &&
                            listShipperWithSalary.map((shipper, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (state.salaryTablePage - 1) * state.salaryTablePerPage}</td>
                                    <td>{shipper.name}</td>
                                    <td>{shipper.salary}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {/* <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(shipperCost._id)}><i className="material-icons">visibility</i></a> */}
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(shipperCost._id)}><i className="material-icons">edit</i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {shipper.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listShipperWithSalary === 'undefined' || listShipperWithSalary.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalSalaryPage ? totalSalaryPage : 0} currentPage={state.salaryTablePage} func={setSalaryTablePage} />

                <label htmlFor="efficiency-salary" style={{marginTop: "40px"}}>Chỉ số tính lương thưởng</label>
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_transportation.cost_management.type_shipper_cost')}</th>
                            <th>Mã chỉ số</th>
                            <th>{translate('manage_transportation.cost_management.name_shipper_cost')}</th>
                            <th>Thưởng</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(shipperCostList && shipperCostList.length !== 0) &&
                            shipperCostList.map((shipperCost, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * state.perPage}</td>
                                    <td>{shipperCost.name}</td>
                                    <td>{shipperCost.code}</td>
                                    <td>{shipperCost.quota}</td>
                                    <td>{shipperCost.cost}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(shipperCost)}><i className="material-icons">edit</i></a>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {shipper.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof shipperCostList === 'undefined' || shipperCostList.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalShipperCostPage ? totalShipperCostPage : 0}
                    currentPage={page}
                    func={setPage} />
                <hr />
                {/* Công thức tính lương nhân viên */}
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-md-8">
                        <label htmlFor="vehicle-cost-formula">Công thức tính</label>
                        <textarea className="form-control" value={shipperCostFormula} onChange={(event) => handleChangeShipperCostFormula(event)} disabled/>
                    </div>
                </div>
                {/* <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-warning" onClick={() => handleUpdateShipperCostFormula()}>Cập nhật</button>
                    </div>
                </div> */}
            </div>
        </React.Fragment>
    )

}


function mapStateToProps(state) {
    const vehicle = state.vehicle;
    const transportationCostManagement = state.transportationCostManagement;
    const shipper = state.shipper;
    return { vehicle, transportationCostManagement, shipper }
}

const mapDispatchToProps = {
    createOrUpdateVehicleCostFormula: TransportationCostManagementActions.createOrUpdateVehicleCostFormula,
    getFormula: TransportationCostManagementActions.getFormula,
    getAllShipperWithCondition: ShipperActions.getAllShipperWithCondition,
    getAllShipperCosts: TransportationCostManagementActions.getAllShipperCosts,
    createOrUpdateShipperCost: TransportationCostManagementActions.createOrUpdateShipperCost,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperCostManagement));