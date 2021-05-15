import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { StockActions } from '../redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import StockCreateForm from './stockCreateForm';
import StockEditForm from './stockEditForm';
import StockDetailForm from './stockDetailForm';
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function StockManagementTable(props) {
    const tableId = "stock-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: limit,
        code: '',
        name: '',
        status: '',
        tableId
    })

    useEffect(() => {
        let { page, limit, currentRole } = state;
        props.getAllDepartments();
        props.getAllRoles();
        props.getAllGoods();
        props.getAllStocks({ managementLocation: currentRole });
        props.getAllStocks({ page, limit, managementLocation: currentRole });
    }, [])

    const setPage = (page) => {
        setState({ page });
        const data = {
            limit: state.limit,
            page: page,
            managementLocation: state.currentRole
        };
        props.getAllStocks(data);
    }

    const setLimit = (number) => {
        setState({ limit: number });
        const data = {
            limit: number,
            page: state.page,
            managementLocation: state.currentRole
        };
        props.getAllStocks(data);
    }

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const handleEdit = async (stock) => {
        await setState({
            ...state,
            currentRow: stock
        });

        window.$('#modal-edit-stock').modal('show');
    }

    const handleCodeChange = async (e) => {
        let value = e.target.value;
        setState({
            ...state,
            code: value.trim()
        })
    }

    const handleNameChange = async (e) => {
        let value = e.target.value;
        setState({
            ...state,
            name: value.trim()
        })
    }

    const handleStatusChange = async (value) => {
        setState({
            ...state,
            status: value
        })
    }

    const handleSubmitSearch = async () => {
        let data = {
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            code: state.code,
            name: state.name,
            status: state.status
        }

        props.getAllStocks(data);
    }

    const handleShowDetailInfo = async (stock) => {
        let id = stock._id;
        props.getStock(id);
        await setState({
            ...state,
            currentRow: stock
        })
        window.$('#modal-detail-stock').modal('show');
    }

    const { stocks, translate } = props;
    const { listPaginate, totalPages, page } = stocks;
    // const { tableId } = state;

    return (
        <div className="box">
            <div className="box-body qlcv">
                <StockCreateForm />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.stock_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('manage_warehouse.stock_management.code')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.stock_management.name')}</label>
                        <input type="text" className="form-control" name="name" onChange={handleNameChange} placeholder={translate('manage_warehouse.stock_management.name')} autoComplete="off" />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.stock_management.status')}</label>
                        <SelectMulti
                            id={`select-multi-status-stock`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('manage_warehouse.stock_management.choose_status'), allSelectedText: translate('manage_warehouse.stock_management.all_type') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.stock_management.1.status') },
                                { value: '2', text: translate('manage_warehouse.stock_management.2.status') },
                                { value: '3', text: translate('manage_warehouse.stock_management.3.status') },
                                { value: '4', text: translate('manage_warehouse.stock_management.4.status') },
                            ]}
                            onChange={handleStatusChange}
                        />
                    </div>
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.stock_management.search')} onClick={handleSubmitSearch}>{translate('manage_warehouse.good_management.search')}</button>
                    </div>
                </div>

                {
                    state.currentRow &&
                    <StockEditForm
                        stockId={state.currentRow._id}
                        code={state.currentRow.code}
                        name={state.currentRow.name}
                        status={state.currentRow.status}
                        address={state.currentRow.address}
                        manageDepartment={state.currentRow.manageDepartment}
                        managementLocation={state.currentRow.managementLocation}
                        goodsManagement={state.currentRow.goods}
                        description={state.currentRow.description}
                    />
                }

                {
                    state.currentRow &&
                    <StockDetailForm
                        stockId={state.currentRow._id}
                        code={state.currentRow.code}
                        name={state.currentRow.name}
                        status={state.currentRow.status}
                        address={state.currentRow.address}
                        manageDepartment={state.currentRow.manageDepartment}
                        managementLocation={state.currentRow.managementLocation}
                        goodsManagement={state.currentRow.goods}
                        description={state.currentRow.description}
                    />
                }

                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>{translate('manage_warehouse.stock_management.index')}</th>
                            <th>{translate('manage_warehouse.stock_management.code')}</th>
                            <th>{translate('manage_warehouse.stock_management.name')}</th>
                            <th>{translate('manage_warehouse.stock_management.status')}</th>
                            <th>{translate('manage_warehouse.stock_management.address')}</th>
                            <th>{translate('manage_warehouse.stock_management.description')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_warehouse.stock_management.index'),
                                        translate('manage_warehouse.stock_management.code'),
                                        translate('manage_warehouse.stock_management.name'),
                                        translate('manage_warehouse.stock_management.status'),
                                        translate('manage_warehouse.stock_management.address'),
                                        translate('manage_warehouse.stock_management.description')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                            listPaginate.map((x, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td style={{ color: translate(`manage_warehouse.stock_management.${x.status}.color`) }}>{translate(`manage_warehouse.stock_management.${x.status}.status`)}</td>
                                    <td>{x.address}</td>
                                    <td>{x.description}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => handleShowDetailInfo(x)}><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                        {/* <DeleteNotification
                                                content={translate('manage_warehouse.stock_management.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name
                                                }}
                                                func={this.props.deleteStock}
                                            /> */}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {stocks.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPages} currentPage={page} func={setPage} />
            </div>
        </div>
    );
}


function mapStateToProps(state) {
    const { stocks } = state;
    return { stocks };
}

const mapDispatchToProps = {
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
    getAllGoods: GoodActions.getAllGoods,
    getAllStocks: StockActions.getAllStocks,
    deleteStock: StockActions.deleteStock,
    getStock: StockActions.getStock
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockManagementTable));