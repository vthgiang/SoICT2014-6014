import moment from "moment";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, TreeSelect } from "../../../../../common-components";
import { JourneyActions } from '../redux/actions'

function JourneyTable(props) {
    const { journey , translate, notifications } = props;
    const tableId_constructor = "table-journey-manage";
    let history = useHistory();

    const [state, setState] = useState({
        month: null,
        page: 1,
        limit: 10,
        tableId: tableId_constructor,
        searchJourneyCode: "",
        dateToSearch: "",
        deliveredNumber: 0,
        notDeliveredNumber: 0,
        inProcessNumber: 0,
        journeyStatusSearch: "",
    });
    const { searchJourneyCode, dateToSearch, page, limit, tableId, journeyStatusSearch } = state;

    useEffect(() => {
        props.getJourneys({page: 1, perPage: 10});
    }, []);

    useEffect(() => {
        if (notifications?.associatedData?.value) {
            if (notifications.associatedData.dataType === "realtime_tasks") {
                props.refreshJourneyData(notifications.associatedData.value);
            }
            notifications.associatedData = {}; // reset lại ...
        }
        notifications.associatedData = {}; // reset lại ...
    }, [notifications.associatedData])



    // Bắt sự kiện setting số dòng hiện thị trên một trang
    const setLimit = async (number) => {
        setState(state => {
            return {
                ...state,
                limit: parseInt(number),
            }
        });
        props.getJourneys({page: state.page, perPage: number})
    }

    // Bắt sự kiện chuyển trang
    const setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * state.limit;
        setState(state => {
            return {
                ...state,
                page: parseInt(page),
            }
        });
        props.getJourneys({page: pageNumber, perPage: state.limit})
    }

    // Bắt sự kiện click xem thông tin giải pháp
    const handleDetailJourney = (journey) => {
        history.push({
            pathname: "transportation-journey-detail",
            search: "?id=" + journey._id,
            state: {
                journey: journey
            }
        })
    }

    const showConfirmDeleteJourney = (journeyId) => {
        Swal.fire({
            html: `<h4"><div>Bạn có chăc chắn muốn xoá lộ trình giao hàng này?</div></div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Huỷ",
            confirmButtonText: "Xác nhận",
        }).then((result) => {
            if (result.isConfirmed) {
                props.deleteJourney(journeyId);
            } else {

            }
        })
    }

    const handleDeleteJourney = (journeyId) => {
        showConfirmDeleteJourney(journeyId);
    }

    const handleChangeJourneyCode = (event) => {
        setState({
            ...state,
            searchJourneyCode: event.target.value
        })
    }

    const handleChangeDateToSearch = (value) => {
        setState({
            ...state,
            dateToSearch: value
        });
    }

    const handleSubmitSearch = () => {
        let reverseDateToSearch = null;
        if (dateToSearch) {
            reverseDateToSearch = dateToSearch.split('-').reverse().join('-')
        }
        props.getJourneysByCondition({
            journeyCode: searchJourneyCode,
            date: reverseDateToSearch ? reverseDateToSearch : "",
            status: journeyStatusSearch,
            page: 1,
            perPage: 10,
        })
    }
    const handleChangeJourneyStatusSearch = (value) => {
        let status;
        status = value ? value[0] : null;
        setState({
            ...state,
            journeyStatusSearch: status ? parseInt(status) : ""
        })
    }

    const handleSearchJourneyByStatus = () => {
        props.getJourneysByCondition({
            status: journeyStatusSearch,
        });
    }

    const statusJourney = [
        { value: 0, text: `--- Lọc theo trạng thái ---` },
        { value: 1, text: "Chưa giao" },
        { value: 2, text: "Đang giao" },
        { value: 3, text: "Hoàn thành" },
    ]

    let deliveredNumber = 0, notDeliveredNumber = 0, inProcessNumber = 0;
    let journeys = [];
    let pageTotal = 0;
    if (journey.lists.length > 0) {
        journeys = journey.lists;
        journeys.forEach((journey) => {
            if (journey.status == 1) {
                notDeliveredNumber += 1;
            }
            if (journey.status == 2) {
                inProcessNumber += 1;
            }
            if (journey.status == 3) {
                deliveredNumber += 1;
            }
        })
        pageTotal = journey.totalList / limit;
    }
    var currentPage = parseInt((page / limit) + 1);

    return (
        <React.Fragment>
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Filter theo ngày */}
                        <div className="form-group">
                            <label className="form-control-static" style={{ padding: 0 }}>{translate('manage_transportation.journey_list.date_search')}</label>
                            <DatePicker
                                id="search-journey-date"
                                dateFormat="month-year-day"
                                value={dateToSearch}
                                onChange={handleChangeDateToSearch}
                            />
                        </div>
                        <div className="form-group">
                            {/* <label style={{ width: "auto" }}>Chọn trạng thái</label> */}
                            <SelectBox
                                id="select-box-journey-dashboard"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={statusJourney}
                                onChange={handleChangeJourneyStatusSearch}
                                value={journeyStatusSearch}
                                multiple={false}
                            />
                            {/* <button type="button" className="btn btn-success" style={{marginTop: "13px"}} onClick={handleSearchJourneyByStatus}>Tìm kiếm</button> */}
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
                        <div className="form-group" style={{float: "right"}}>
                            <p style={{marginRight: "0.5em"}}><i className="fa fa-circle text-grey" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.not_delivered')} {notDeliveredNumber}</p>
                            <p style={{marginRight: "0.5em"}}><i className="fa fa-circle text-yellow" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.in_process')} {inProcessNumber}</p>
                            <p><i className="fa fa-circle text-success" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.delivered')} {deliveredNumber}</p>
                        </div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id={tableId} style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>{translate('manage_transportation.journey_list.journey_code')}</th>
                                <th>{translate('manage_transportation.journey_list.shippers_for_journey')}</th>
                                <th>{translate('manage_transportation.journey_list.total_cost')}</th>
                                <th>{translate('manage_transportation.journey_list.revenue')}</th>
                                {/* <th>{translate('manage_transportation.journey_list.total_distance')}</th> */}
                                <th>{translate('manage_transportation.journey_list.estimated_delivery_date')}</th>
                                <th>{translate('manage_transportation.journey_list.status')}</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('manage_transportation.journey_list.journey_code'),
                                            translate('manage_transportation.journey_list.shippers_for_journey'),
                                            translate('manage_transportation.journey_list.total_cost'),
                                            translate('manage_transportation.journey_list.revenue'),
                                            // translate('manage_transportation.journey_list.total_distance'),
                                            translate('manage_transportation.journey_list.estimated_delivery_date'),
                                            translate('manage_transportation.journey_list.status'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(journeys) ?
                                journeys.map((journey, index) => (
                                    <tr key={index}>
                                        <td>{journey.code}</td>
                                        <td>
                                            { journey.shippers &&
                                                <>
                                                    {journey.shippers.map((shipper, index) => <p key={`shipper ${index}`}>{shipper.fullName}</p>)}
                                                </>
                                            }
                                        </td>
                                        <td>{journey.data.totalCost}</td>
                                        {/* <td>{journey.data.totalDistance}</td> */}
                                        <td>{ journey.data.revenue }</td>
                                        <td>{moment(journey.estimatedDeliveryDate).format("MM-DD-YYYY")}</td>
                                        <td>
                                            { journey.status == 1 && <span className="">Chưa giao</span> }
                                            { journey.status == 2 && <span className="text-yellow">Đang giao</span> }
                                            { journey.status == 3 && <span className="text-green">Đã giao</span> }
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="text-green" title={translate('asset.general_information.view')} onClick={() => handleDetailJourney(journey)}><i className="material-icons">visibility</i></a>
                                            { journey.status == 1 &&
                                                <a className="text-red" title={translate('asset.general_information.delete')} onClick={() => handleDeleteJourney(journey._id)}><i className="material-icons">delete</i></a>
                                            }
                                        </td>
                                    </tr>
                                )) : null
                            }
                        </tbody>
                    </table>
                    {journey.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!journeys) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    {/* PaginateBar */}
                    <PaginateBar
                        pageTotal={pageTotal ? pageTotal : 0}
                        currentPage={currentPage}
                        display={journeys && journeys.length !== 0 && journeys.length}
                        total={journey ? journey.totalList : 0}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { journey, notifications } = state;

    return { journey, notifications }
}
const actions = {
    getJourneys: JourneyActions.getJourneys,
    getJourneysByCondition: JourneyActions.getJourneysByCondition,
    deleteJourney: JourneyActions.deleteJourney,
    refreshJourneyData: JourneyActions.refreshJourneyData
}

const connectedJourneyTable = connect(mapState, actions)(withTranslate(JourneyTable));
export { connectedJourneyTable as JourneyTable };