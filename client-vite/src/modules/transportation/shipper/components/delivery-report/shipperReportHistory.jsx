import moment from "moment";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DatePicker, PaginateBar } from "../../../../../common-components";
import { ShipperActions } from '../../redux/actions'

function ShipperReportHistory(props) {
    const [state, setState] = useState({
        tableId: 'shipper-task-list-table',
        page: 1,
        limit: 10,
        searchingDate: moment().format("DD-YY-YYYY"),
        searchingJourneyCode: ""
    })
    const { tableId, page, limit, searchingDate, searchingJourneyCode } = state;
    const { shipper, translate } = props;

    useEffect(() => {
        props.getTasksForShipper({status: 3})
    }, []);

    const setLimit = () => {

    }

    const setPage = () => {

    }

    const handleChangeSearchingDate = (value) => {
        setState({
            ...state,
            searchingDate: value
        })
    }

    const handleSubmitSearch = () => {
        props.getTasksForShipper({
            searchingDate: searchingDate
        })
    }

    const handleChangeJourneyCode = (event) => {
        setState({
            ...state,
            searchingJourneyCode: event.target.value
        })
    }
    let transportTasks = [];
    let employeesTaskList = shipper?.taskList?.data;

    if (employeesTaskList) {
        employeesTaskList.forEach((empTask) => {
            empTask.forEach((task) => transportTasks.push(task))
        })
    }

    var pageTotal = transportTasks.length ? transportTasks.length : 0;

    return (
        <div className="box-body qlcv">
            <div className="form-inline">
                {/* Filter theo ngày */}
                <div className="form-group">
                    <label className="form-control-static" style={{ padding: 0 }}>{translate('manage_transportation.journey_list.date_search')}</label>
                    <DatePicker
                        id="search-journey-date"
                        dateFormat="month-year-day"
                        value={searchingDate}
                        onChange={handleChangeSearchingDate}
                    />
                </div>
            </div>
            <div className="form-inline">
                {/* Tìm kiếm theo mã lộ trình*/}
                <div className="form-group">
                    <label className="form-control-static">{translate('manage_transportation.journey_list.journey_code')}</label>
                    <input type="text" className="form-control" name="journey-code" onChange={handleChangeJourneyCode} placeholder={translate('manage_transportation.journey_list.journey_code')} autoComplete="off" />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                </div>
            </div>
            <table className="table table-hover table-striped table-bordered" id={tableId} style={{ marginTop: '10px' }}>
                <thead>
                    <tr>
                        <th>{translate('manage_transportation.journey_list.journey_code')}</th>
                        <th>{translate('manage_transportation.shipper.used_vehicle')}</th>
                        <th>{translate('manage_transportation.shipper.start_time_journey')}</th>
                        <th>{translate('manage_transportation.shipper.end_time_journey')}</th>
                        <th>{translate('manage_transportation.shipper.success_order_rate')}</th>
                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                            <DataTableSetting
                                tableId={tableId}
                                columnArr={[
                                    translate('manage_transportation.journey_list.journey_code'),
                                    translate('manage_transportation.shipper.used_vehicle'),
                                    translate('manage_transportation.shipper.start_time_journey'),
                                    translate('manage_transportation.shipper.end_time_journey'),
                                    translate('manage_transportation.shipper.success_order_rate')
                                ]}
                                setLimit={setLimit}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(transportTasks) ?
                        transportTasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.journey.code}</td>
                                <td>
                                    {task.journey.vehicleName}
                                </td>
                                <td>{task.startWorkingTime}</td>
                                <td>{task.endWorkingTime}</td>
                                <td>
                                    {(task.journey.orders.filter((order) => order.status == 1).length)} / {(task.journey.orders.length)} (đơn)
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <a className="text-green" title={translate('asset.general_information.view')} ><i className="material-icons">visibility</i></a>
                                </td>
                            </tr>
                        )) : null
                    }
                </tbody>
            </table>
            {shipper.isLoading ?
                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                (!shipper.taskList) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
            }
            {/* PaginateBar */}
            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={setPage} />
        </div>
    );
}
function mapStateToProps(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapDispatchToProps = {
    getTasksForShipper: ShipperActions.getTasksForShipper
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperReportHistory))