import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar, SelectBox, DatePicker } from "../../../../../common-components";

import { formatDate, formatToTimeZoneDate } from "../../../../../helpers/formatDate"

import { TransportManageVehicleProcess } from "./transportManageVehicleProcess"

import { TransportManageProcess } from "./transportManageProcess"

import { transportPlanActions } from "../../transport-plan/redux/actions";

import { getPlanStatus, getListPlanStatus } from "../../transportHelper/getTextFromValue"

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import './timeLine.css';

function TransportProcessMainPage(props) {

    const {translate, transportPlan} = props

    const [listPlans, setListPlans] = useState();

    const [currentTransportPlan, setCurrentTransportPlan] = useState();

    const [searchData, setSearchData] = useState(); // tham số tìm kiếm
    

    const handleShowDetailProcess = (plan) => {
        setCurrentTransportPlan(plan);
        // setCurrentVehicleRoute(route);
        window.$(`#modal-detail-process`).modal('show')
    }

    useEffect(() => {
        let queryData = {
            page: page,
            limit: perPage,
            searchData: searchData,
        }
        props.getAllTransportPlans(queryData);
    }, [])

    useEffect(() => {
        if (transportPlan && transportPlan.lists && transportPlan.lists.length !==0){
            setListPlans(transportPlan.lists);
        }
    }, [transportPlan])

    let getTableId = "process-table";

    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const [pageStatus, setPageStatus] = useState({
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })
    
    let {page, perPage, tableId} = pageStatus;
    const totalPage = transportPlan && Math.ceil(transportPlan.totalList / perPage);
    const setPage = (pageNumber) => {
        setPageStatus({
            ...pageStatus,
            page: parseInt(pageNumber)
        })
    }

    const setLimit = (number) => {
        setPageStatus({
            ...pageStatus,
            page: 1,
            perPage: parseInt(number)
        })
    }
    useEffect(() => {
        let queryData = {
            page: page,
            limit: perPage,
            searchData: searchData,
        }
        props.getAllTransportPlans(queryData);
        // props.getAllUserOfCompany();
    }, [pageStatus])

    // xử lí khi tham số search thay đổi
    const handleCodeChange = (e) => {
        const {value} = e.target;
        setSearchData({
            ...searchData,
            code: value,
        })
    }
    const handleNameChange = (e) => {
        const {value} = e.target;
        setSearchData({
            ...searchData,
            name: value,
        })
    }
    const handleStartDateChange = (value) => {
        setSearchData({
            ...searchData,
            startDate: formatToTimeZoneDate(value),
        })
    }
    const handleEndDateChange = (value) => {
        setSearchData({
            ...searchData,
            endDate: formatToTimeZoneDate(value),
        })
    }
    const handleStatusChange = (value) => {
        if (value[0] !== "0"){
            setSearchData({
                ...searchData,
                status: value[0],
            })
        }
        else {
            setSearchData({
                ...searchData,
                status: null,
            })
        }
    }

    const handleSubmitSearch = () => {
        let queryData = {
            page: page,
            limit: perPage,
            searchData: searchData,
        }
        props.getAllTransportPlans(queryData);
    }
   return (
        <div className="box-body qlcv">
            <TransportManageProcess 
                currentTransportPlan={currentTransportPlan}
            />

            <div className="form-inline">
                <div className="form-group">
                    <label className="form-control-static">{"Mã kế hoạch"}</label>
                    <input type="text" className="form-control" name="code" value={searchData?.code} onChange={handleCodeChange} placeholder={"Mã kế hoạch"} autoComplete="off" />
                </div>
                <div className="form-group">
                    <label className="form-control-static">{"Tên kế hoạch"}</label>
                    <input type="text" className="form-control" name="name" value={searchData?.name} onChange={handleNameChange} placeholder={"Tên kế hoạch"} autoComplete="off" />
                </div>
            </div>

            <div className="form-inline">
                <div className="form-group">
                    <label className="form-control-static">{"Từ ngày"}</label>
                    <DatePicker
                        id={`search-plan-startDate`}
                        value={formatDate(searchData?.startDate)}
                        onChange={handleStartDateChange}
                        disabled={false}
                    />
                </div>   
                <div className="form-group">
                    <label className="form-control-static">{"Đến ngày"}</label>
                    <DatePicker
                        id={`search-plan-endDate`}
                        value={formatDate(searchData?.endDate)}
                        onChange={handleEndDateChange}
                        disabled={false}
                    />
                </div> 
            </div>

            <div className="form-inline">    
                <div className="form-group">
                    <label className="form-control-static">{"Trạng thái"}</label>
                    <SelectBox
                        id={`search-status-plan-transport`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={searchData?.status}
                        items={[{value: "0", text: "---Trạng thái"}].concat(getListPlanStatus())}
                        onChange={handleStatusChange}
                        multiple={false}
                    />
                </div>                              
                <div className="form-group">
                    <label className="form-control-static"></label>
                    <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={handleSubmitSearch} >{translate('manage_example.search')}</button>
                </div>
            </div>

            <table id={"tableId"} className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th className="col-fixed" style={{ width: 60 }}>{"Số thứ tự"}</th>
                        <th>{"Mã kế hoạch"}</th>
                        <th>{"Tên kế hoạch"}</th>
                        <th>{"Trạng thái"}</th>
                        <th>{"Thời gian"}</th>
                        <th>{"Người giám sát"}</th>
                        <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                            <DataTableSetting
                                tableId={tableId}
                                columnArr={[
                                    // translate('manage_example.index'),
                                    // translate('manage_example.exampleName'),
                                    // translate('manage_example.description'),
                                    translate('manage_example.index'),
                                    "Mã kế hoạch",
                                    "Tên kế hoạch",
                                    "Trạng thái",
                                    "Thời gian",
                                    "Người giám sát",
                                ]}
                                setLimit={setLimit}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                (listPlans && listPlans.length !== 0) &&
                listPlans.map((x, index) => (
                        x &&
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{x.code}</td>
                            <td>{x.name}</td>
                            <td>{getPlanStatus(x.status)}</td>
                            <td>{formatDate(x.startTime)+" - "+formatDate(x.endTime)}</td>
                            <td>{x.supervisor? x.supervisor.name: ""}</td>
                            <td style={{ textAlign: "center" }}>
                                <a className="edit text-blue" 
                                    style={{ width: '5px' }} 
                                    title={"Thông tin chi tiết kế hoạch"} 
                                    onClick={() => handleShowDetailProcess(x)}
                                >
                                    <i className="material-icons">center_focus_strong
                                    </i>
                                </a>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

            {transportPlan && transportPlan.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof transportPlan.lists === 'undefined' || transportPlan.lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={transportPlan && transportPlan.lists && transportPlan.lists.length !== 0 && transportPlan.lists.length}
                    total={transportPlan && transportPlan.totalList}
                    func={setPage}
                />

        </div>
    )
}

function mapState(state) {
    const {transportPlan} = state;
    return { transportPlan }
}

const actions = {
    getAllTransportPlans: transportPlanActions.getAllTransportPlans,
}

const connectedTransportProcessMainPage = connect(mapState, actions)(withTranslate(TransportProcessMainPage));
export { connectedTransportProcessMainPage as TransportProcessMainPage };