import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { useHistory } from "react-router-dom";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { PaginateBar, SmartTable, DataTableSetting, SelectBox } from "../../../../common-components";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { JourneyActions } from '../../scheduling/tracking-route/redux/actions';
import { RequestActions } from '../../../production/common-production/request-management/redux/actions'

function RouteTable(props) {
    const getTableId = "table-journeys-dashboard-page";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const history = useHistory();
    // Khởi tạo state
    const [state, setState] = useState({
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
        today: dayjs().format("YYYY-MM-DD"),
        journeyStatusSearch: ""
    })
    const [selectedData, setSelectedData] = useState()

    const { journey, translate, notifications, socket } = props;
    const { page, perPage, tableId, today, journeyStatusSearch } = state;

    useEffect(() => {
        props.getJourneysByCondition({
            date: today
        });
    }, [])
    useEffect(() => {
        socket.io.on('delivery progress', data => {
            props.refreshJourneyData(data)
        });
        return () => props.socket.io.off('delivery progress');
    }, [socket])

    useEffect(() => {
        if (notifications?.associatedData?.value) {
            if (notifications.associatedData.dataType === "realtime_tasks") {
                props.refreshJourneyData(notifications.associatedData.value);
            }
            notifications.associatedData = {}; // reset lại ...
        }
        notifications.associatedData = {}; // reset lại ...
    }, [notifications.associatedData])

    const handleSubmitSearch = () => {
        props.getExamples({
            perPage,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getExamples({
            perPage,
            page: parseInt(pageNumber)
        });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getExamples({
            perPage: parseInt(number),
            page: 1
        });
    }

    const handleShowDetailJourney = (journey) => {
        history.push({
            pathname: "transportation-journey-detail",
            search: "?id=" + journey._id,
            state: {
                journey: journey
            }
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
            date: today,
            status: journeyStatusSearch,
        });
    }

    let deliveredNumber = 0, notDeliveredNumber = 0, inProcessNumber = 0;
    let lists = [];
    if (journey) {
        lists = journey.lists;
        lists.forEach((journey) => {
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
    }
    const statusJourney = [
        { value: 0, text: `--- Lọc theo trạng thái ---` },
        { value: 1, text: "Chưa giao" },
        { value: 2, text: "Đang giao" },
        { value: 3, text: "Hoàn thành"},
    ]


    const totalPage = journey && Math.ceil(journey.totalList / perPage);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">
                                <span>Thông tin các chuyến xe</span>
                            </div>
                            <div className="form-group" style={{float: "right"}}>
                                <span style={{marginRight: "0.5em"}}><i className="fa fa-circle text-grey" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.not_delivered')} {notDeliveredNumber}</span>
                                <span style={{marginRight: "0.5em"}}><i className="fa fa-circle text-yellow" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.in_process')} {inProcessNumber}</span>
                                <span><i className="fa fa-circle text-success" style={{ fontSize: "1em", marginRight: "0.25em" }} /> {translate('manage_transportation.journey_list.delivered')} {deliveredNumber}</span>
                            </div>
                            <div className="form-inline" style={{marginTop: "15px"}}>
                                <div className="form-group">
                                    {/* <label style={{ width: "auto" }}>Chọn trạng thái</label> */}
                                    <SelectBox
                                        id="select-box-journey-dashboard"
                                        className="form-control select2"
                                        style={{ width: "70%" }}
                                        items={statusJourney}
                                        onChange={handleChangeJourneyStatusSearch}
                                        value={journeyStatusSearch}
                                        multiple={false}
                                    />
                                    <button type="button" className="btn btn-success" style={{marginTop: "13px"}} onClick={handleSearchJourneyByStatus}>Tìm kiếm</button>
                                </div>
                            </div>
                        </div>
                        <div className="box-body qlcv">
                            <table id={tableId} className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th className="col-fixed" style={{ width: 60 }}>{translate('manage_transportation.journey_list.index')}</th>
                                        <th>{translate('manage_transportation.journey_list.journey_code')}</th>
                                        <th>{translate('manage_transportation.journey_list.journey_driver_name')}</th>
                                        <th>{translate('manage_transportation.journey_list.status')}</th>
                                        <th>{translate('manage_transportation.journey_list.total_cost')}</th>
                                        <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                            <DataTableSetting
                                                tableId={tableId}
                                                columnArr={[
                                                    translate('manage_transportation.journey_list.journey_code'),
                                                    translate('manage_transportation.journey_list.journey_driver_name'),
                                                    translate('manage_transportation.journey_list.status'),
                                                    translate('manage_transportation.journey_list.total_cost')
                                                ]}
                                                setLimit={setLimit}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(lists && lists.length !== 0) &&
                                        lists.map((journey, index) => {
                                            let progressPercent = (journey.orders.filter((order) => order.status == 1 || order.status == 3).length) / (journey.orders.length);
                                            progressPercent = Math.round(progressPercent * 1000) / 10;
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + (page - 1) * state.perPage}</td>
                                                    <td>{journey.code}</td>
                                                    <td>
                                                        { journey.shippers &&
                                                            <>
                                                                {journey.shippers.map((shipper, index) => <p key={`shipper ${index}`}>{shipper.fullName}</p>)}
                                                            </>
                                                        }
                                                    </td>
                                                    <td>
                                                        <ProgressBar variant="success" now={progressPercent} label={`${progressPercent ? progressPercent : 0}%`} max={100} min={0}/>
                                                    </td>
                                                    <td>{ Math.round((journey.data.totalCost + journey.data.totalDriverSalary)*10)/10}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailJourney(journey)}><i className="material-icons">visibility</i></a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {/* PaginateBar */}
                            {journey && journey.isLoading ?
                                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                            }
                            <PaginateBar
                                pageTotal={totalPage ? totalPage : 0}
                                currentPage={page}
                                display={lists && lists.length !== 0 && lists.length}
                                total={journey && journey.totalList}
                                func={setPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

function mapState(state) {
    const journey= state.journey;
    const notifications = state.notifications;
    const socket = state.socket;
    return { journey, notifications, socket}
}

const mapDispatchToProps = {
    getJourneysByCondition: JourneyActions.getJourneysByCondition,
    refreshJourneyData: JourneyActions.refreshJourneyData,
}

const connectedRouteTable = connect(mapState, mapDispatchToProps)(withTranslate(RouteTable));
export { connectedRouteTable as RouteTable };