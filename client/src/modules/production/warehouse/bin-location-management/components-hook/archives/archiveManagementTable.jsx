import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar, SelectMulti } from '../../../../../../common-components';

import ArchiveDetailForm from './archiveDetailForm';
import ArchiveEditForm from './archiveEditForm';
import { BinLocationActions } from '../../redux/actions';
import { GoodActions } from '../../../../common-production/good-management/redux/actions';
import { StockActions } from '../../../../warehouse/stock-management/redux/actions';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function ArchiveManagementTable(props) {

    const tableId = "archive-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: limit,
        path: '',
        status: '',
        stock: '',
        tableId
    })

    useEffect(() => {
        let { page, limit, currentRole } = state;
        props.getChildBinLocations({ page, limit, managementLocation: currentRole });
        props.getAllGoods();
        props.getAllStocks({ managementLocation: currentRole });
    }, [])

    const handleEdit = async (binLocation) => {
        await setState({
            ...state,
            currentRow: binLocation
        });

        window.$('#modal-edit-archive-stock').modal('show');
    }

    const handleShowDetailInfo = async (binLocation) => {
        let id = binLocation._id;
        await props.getDetailBinLocation(id);
        window.$('#modal-detail-archive-bin').modal('show');
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        const data = {
            limit: state.limit,
            managementLocation: state.currentRole,
            page: page,
        };
        props.getChildBinLocations(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        const data = {
            limit: number,
            page: state.page,
            managementLocation: state.currentRole
        };
        props.getChildBinLocations(data);
    }

    const handleStockChange = (value) => {
        setState({
            ...state,
            stock: value
        })
    }

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value
        })
    }

    const handleCodeChange = async (e) => {
        let value = e.target.value;
        await setState({
            ...state,
            path: value
        })
    }

    const handleSubmitSearch = async () => {
        let data = {
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            path: state.path,
            stock: state.stock,
            status: state.status
        }

        props.getChildBinLocations(data);
    }

    const { translate, binLocations, stocks } = props;
        const { listStocks } = stocks;
        const { listPaginate, totalPages, page } = binLocations;
        const { currentRow, tableId } = state;

        return (
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bin_location_management.stock')}</label>
                        <SelectMulti
                            id={`select-multi-stock-bin_location`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('manage_warehouse.bin_location_management.choose_status'), allSelectedText: translate('manage_warehouse.bin_location_management.all_type') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listStocks.map((x, index) => { return { value: x._id, text: x.name } })}
                            onChange={handleStockChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bin_location_management.status')}</label>
                        <SelectMulti
                            id={`select-multi-status-bin_location`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('manage_warehouse.bin_location_management.choose_status'), allSelectedText: translate('manage_warehouse.bin_location_management.all_type') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={[
                                { value: '1', text: translate('manage_warehouse.bin_location_management.1.status') },
                                { value: '2', text: translate('manage_warehouse.bin_location_management.2.status') },
                                { value: '3', text: translate('manage_warehouse.bin_location_management.3.status') },
                                { value: '4', text: translate('manage_warehouse.bin_location_management.4.status') },
                                { value: '5', text: translate('manage_warehouse.bin_location_management.5.status') },
                            ]}
                            onChange={handleStatusChange}
                        />
                    </div>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_warehouse.bin_location_management.code')}</label>
                        <input type="text" className="form-control" name="code" onChange={handleCodeChange} placeholder={translate('manage_warehouse.bin_location_management.code')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label></label>
                        <button type="button" className="btn btn-success" title={translate('manage_warehouse.bin_location_management.search')} onClick={handleSubmitSearch}>{translate('manage_warehouse.good_management.search')}</button>
                    </div>
                </div>
                <ArchiveDetailForm />
                { currentRow &&
                    <ArchiveEditForm
                        binId={currentRow._id}
                        binCapacity={currentRow.capacity}
                        binContained={currentRow.contained}
                        binEnableGoods={currentRow.enableGoods}
                        binStatus={currentRow.status}
                        binUnit={currentRow.unit}
                        binParent={currentRow.parent}
                        page={state.page}
                        limit={state.limit}
                    />
                }
                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            {/* <th style={{ width: "5%" }}>{translate('manage_warehouse.bin_location_management.index')}</th> */}
                            <th>{translate('manage_warehouse.bin_location_management.code')}</th>
                            <th>{translate('manage_warehouse.bin_location_management.status')}</th>
                            <th>{translate('manage_warehouse.bin_location_management.capacity')}</th>
                            <th>{translate('manage_warehouse.bin_location_management.contained')}</th>
                            <th>{translate('manage_warehouse.bin_location_management.goods')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        // translate('manage_warehouse.bin_location_management.index'),
                                        translate('manage_warehouse.bin_location_management.code'),
                                        translate('manage_warehouse.bin_location_management.status'),
                                        translate('manage_warehouse.bin_location_management.capacity'),
                                        translate('manage_warehouse.bin_location_management.contained'),
                                        translate('manage_warehouse.bin_location_management.goods'),
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
                                    {/* <td>{index + 1}</td> */}
                                    <td>{x.path}</td>
                                    <td style={{ color: translate(`manage_warehouse.bin_location_management.${x.status}.color`) }}>{translate(`manage_warehouse.bin_location_management.${x.status}.status`)}</td>
                                    <td>{x.capacity ? x.capacity : 0} {x.unit}</td>
                                    <td>{x.contained ? x.contained : 0} {x.unit}</td>
                                    <td>{(x.enableGoods && x.enableGoods.length > 0) && x.enableGoods.map((x, i) => { return <p key={i}>{x.good.name}({x.contained}{x.good.baseUnit})</p> })}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a onClick={() => handleShowDetailInfo(x)}><i className="material-icons">view_list</i></a>
                                        <a onClick={() => handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                        {/* <DeleteNotification
                                                content={translate('manage_warehouse.category_management.delete_info')}
                                                data={{
                                                    id: x._id,
                                                    info: x.code + " - " + x.name
                                                }}
                                                func={this.props.deleteBinLocations}
                                            /> */}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {binLocations.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPages} currentPage={page} func={setPage} />
            </div>
        );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getChildBinLocations: BinLocationActions.getChildBinLocations,
    getDetailBinLocation: BinLocationActions.getDetailBinLocation,
    getAllGoods: GoodActions.getAllGoods,
    deleteBinLocations: BinLocationActions.deleteBinLocations,
    getAllStocks: StockActions.getAllStocks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ArchiveManagementTable));