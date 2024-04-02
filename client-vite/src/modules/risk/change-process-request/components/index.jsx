import React, { useEffect, useState } from 'react';
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import parse from 'html-react-parser';
import { riskResponsePlanRequestActions } from '../redux/actions'
import { AprroveChangeRequest } from './approve'
import { EditChangeRequest } from './editForm';
import { getStorage } from '../../../../config';
import { DetailRequestChange } from './detail';
import { getStatusStr } from './helper'
import dayjs from 'dayjs'
const RequestChangeTaskProcessTable = (props) => {
    const { translate, riskResponsePlanRequest, notifications } = props
    const initState = {
        name: '',
        page: 1,
        riskEdit: null,
        riskId: null,
        perPage: 10,
        tableId: 'change-request-table',
        currentRow: null,
        currentRowDetail: null,
        currentRowApprove: null,
        lists: [],
    }
    const [state, setState] = useState(initState)
    const { tableId, lists, page, perPage, currentRow, currentRowDetail, currentRowApprove } = state
    // realtime feature
    useEffect(() => {
        if (notifications.associatedData?.length != 0) {
            // console.log('new NOti', notifications.associatedData)
            if (notifications.associatedData.dataType == "change_request") {
                console.log('noti-risk')
                props.getAllRequest({ page: page, perPage: perPage })
            }
        }
    }, [props.notifications])
    useEffect(() => {
        console.log(state)
        props.getAllRequest({ page: page, perPage: perPage })
    }, [])
    useEffect(() => {
        console.log(riskResponsePlanRequest)
        if (riskResponsePlanRequest.lists.length != 0) {
            setState({
                ...state,
                lists: riskResponsePlanRequest.lists
            })
        }
    }, [riskResponsePlanRequest])
    const [show, setShow] = useState({
        showEdit: false,
        showDetail: false,
        showApprove: false
    })
    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        // getRiskResponsePlans({ page: 5, perPage: 20 })
    }
    useEffect(() => {
        window.$('#modal-approve-change-request').modal('show')
    }, [show.showApprove])
    const handleApprove = (request) => {
        setState({
            ...state,
            currentRowApprove: request
        })
        setShow({
            ...show,
            showApprove: !show.showApprove
        })
    }
    useEffect(() => {
        window.$('#modal-edit-change-request').modal('show')
    }, [show.showEdit])
    const handleEdit = (request) => {
        console.log('edit risk', request)
        setState({
            ...state,
            currentRow: request
        });
        setShow({
            ...show,
            showEdit: !show.showEdit
        })
    }
    useEffect(() => {
        window.$('#modal-detail-change-request').modal('show')
    }, [show.showDetail])
    const handleShowDetail = (request) => {
        setState({
            ...state,
            currentRowDetail: request
        })
        setShow({
            ...show,
            showDetail: !show.showDetail
        })
    }
    /**
     * Hàm xử lý khi click chuyển trang
     * @param {*} pageNumber Số trang định chuyển
     */
    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });
    }
    const handleDelete = (id) => {
        props.deleteChangeRequest(id)
    }
    const [searchData, setSearchData] = useState({
        id:'',
        status:''
    })
    useEffect(()=>{
        let {id,status} = searchData
        let data = riskResponsePlanRequest.lists
                    .filter(rp => 
                        rp.process._id.toString().toUpperCase().includes(id.toUpperCase())
                        &&rp.status.toString().toUpperCase().includes(status.toUpperCase())
                    )
        setState({
            ...state,
            lists: data
        })

       
    },[searchData])
    const handleChange = (event) => {
        let name = event.target.name
        let val = event.target.value
        if(name == 'id'){
            setSearchData({
                ...searchData,
                id:val
            })
        }
        if(name == 'status'){
            setSearchData({
                ...searchData,
                status:val
            })
        }
       
    }
    const totalPage = riskResponsePlanRequest && Math.ceil(riskResponsePlanRequest.totalList / perPage);
    console.log(totalPage)
    return (
        <React.Fragment>
            {currentRowApprove && currentRowApprove != null && <AprroveChangeRequest requestChange={currentRowApprove} process={currentRowApprove.process} ></AprroveChangeRequest>}
            {currentRowDetail && currentRowDetail != null && <DetailRequestChange requestChange={currentRowDetail} process={currentRowDetail.process}></DetailRequestChange>}
            {currentRow && currentRow != null && <EditChangeRequest requestChange={currentRow} process={currentRow.process}></EditChangeRequest>}
            <div className="box" style={{ minHeight: "450px" }}>
                <div className="box-body ">
                    <div className="box-body qlcv">
                        <div className="form-inline search">
                            <div className="form-group col-sm-6">
                
                                <input className="form-control" name = "id" type="text" placeholder={translate('manage_change_process.search_by_id')} onChange={handleChange} />
            
                            </div>
                            <div className="form-group col-sm-6">
                                {/* <label className="form-control-static col-sm-12">{translate('manage_risk.risk_management_table.status')}</label> */}
                                <select onChange={handleChange} name="status" className="form-control">
                                    <option value="">{translate('manage_change_process.status')}</option>
                                    <option value = "wait_for_approve">{translate('manage_change_process.wait_for_approve')}</option>
                                    <option value = "canceled">{translate('manage_change_process.canceled')}</option>
                                    <option value = "finished">{translate('manage_change_process.finished')}</option>
                                </select>
                            </div>
                        </div>
                        <table id={tableId} className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th className="col-fixed" style={{ width: 70 }}>{translate('manage_risk_plan.index')}</th>
                                    <th>{translate('process_analysis.request_change_process.processID')}</th>
                                    {/* <th>Nội dung</th> */}
                                    <th>{translate('process_analysis.request_change_process.request_sender')}</th>
                                    <th>{translate('process_analysis.request_change_process.approver')}</th>
                                    <th>{translate('process_analysis.request_change_process.request_date')}</th>
                                    <th>{translate('process_analysis.request_change_process.status')}</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                        <DataTableSetting
                                            tableId={tableId}
                                            columnArr={[

                                                // translate('manage_risk_plan.riskApplyName'),
                                            ]}
                                            setLimit={setLimit}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.length != 0 && lists.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * perPage}</td>
                                        <td>{item.process._id.toString().toUpperCase()}</td>
                                        {/* <td>{item.length != 0 ? parse(item.content) : 'None'}</td> */}
                                        <td>{item.sendEmployee.name}</td>

                                        <td>{item.receiveEmployees.map(e => (
                                            <p>{e.name}</p>
                                        ))}</td>
                                        <td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</td>
                                        <td>{getStatusStr(translate, item.status)}</td>
                                        <td>
                                            <div class="dropdown">
                                                <button href="#" class=" btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">{translate('process_analysis.process_list.select')}<span class="caret"></span></button>
                                                <ul class="dropdown-menu pull-right" role="menu">
                                                    <li>
                                                        <a className="edit text-green" title={translate('manage_risk_plan.detail')} onClick={() => handleShowDetail(item)}>
                                                            <i className="material-icons">visibility</i>
                                                            {translate('process_analysis.request_change_process.view_detail')}
                                                        </a>
                                                    </li>
                                                    {item.sendEmployee._id == getStorage('userId') && item.status == 'wait_for_approve' &&
                                                        <li><a className="edit text-yellow" title={translate('manage_risk_plan.edit')} onClick={() => handleEdit(item)}>
                                                            <i className="material-icons">edit</i>
                                                            {translate('process_analysis.request_change_process.edit')}
                                                        </a></li>
                                                    }
                                                    {item.receiveEmployees.map(a => a._id).includes(getStorage('userId'))
                                                        && item.status != 'finished' &&
                                                        <li><a className="edit text-blue" title={translate('manage_risk_plan.edit')} onClick={() => handleApprove(item)}>
                                                            <i className="material-icons">check</i>
                                                            {translate('process_analysis.request_change_process.approve')}
                                                        </a></li>}

                                                    {item.sendEmployee._id == getStorage('userId') && item.status == 'wait_for_approve' &&
                                                        <li>
                                                            <DeleteNotification
                                                                content={`{translate('process_analysis.request_change_process.delete_content')}`}
                                                                data={{
                                                                    id: item._id,
                                                                    info: '',
                                                                }}
                                                                func={handleDelete}
                                                            /></li>
                                                    }

                                                </ul>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        {riskResponsePlanRequest && riskResponsePlanRequest.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBar
                            pageTotal={totalPage ? totalPage : 0}
                            currentPage={page}
                            display={lists && lists.length !== 0 && lists.length}
                            total={props.riskResponsePlanRequest && props.riskResponsePlanRequest.totalList}
                            func={setPage}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
function mapState(state) {
    const { riskDistribution, riskResponsePlanRequest, notifications } = state
    // console.log(risk)
    return { riskDistribution, riskResponsePlanRequest, notifications }
}

const actions = {
    getAllRequest: riskResponsePlanRequestActions.getRiskResponsePlanRequests,
    editChangeRequest: riskResponsePlanRequestActions.editChangeRequest,
    deleteChangeRequest: riskResponsePlanRequestActions.deleteChangeRequest

}
const connectedRequestChangeTaskProcessTable = connect(mapState, actions)(withTranslate(RequestChangeTaskProcessTable));
export { connectedRequestChangeTaskProcessTable as RequestChangeTaskProcessTable };