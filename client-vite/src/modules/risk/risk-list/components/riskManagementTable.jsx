import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import dayjs from "dayjs";
import { DeleteNotification } from './deleteNotification'
import { DataTableSetting, PaginateBar } from "../../../../common-components";

import { RiskCreateForm } from "./createRiskForm";
import { EditRiskForm } from "./editRiskForm";
import { RiskDetailInfo } from "./riskDetailInfo";
// import { RiskImportForm } from "./riskImportForm";
import { getRankingColor, normalizeDescription } from '../../riskHelper'

import { riskActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { getStorage } from '../../../../config';
import { AprroveRiskForm } from "./showApproveModal";
import { RiskDistributionActions } from "../../risk-dash-board/redux/actions";
import { getRankingStr } from "../../risk-response-plan/components/helper";
import parse from 'html-react-parser'

function RiskManagementTable(props) {
    const getTableId = "table-manage-risk";
    const defaultConfig = { limit: 6 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;
    const { risk, translate } = props;
    const [user, setUser] = useState(getStorage("useId"))


    // Khởi tạo state
    const [state, setState] = useState({
        riskName: "",
        page: 1,
        riskEdit: null,
        riskId: null,
        perPage: 10,
        tableId: getTableId,
        currentRow: null,
        curentRowDetail: null,
        currentRowApprove: null,
        lists: [],
        nameSearch: '',
        roleSearch: '',
        statusSearch:'',
        rankingSearch:undefined
    })

    const {
        rankingSearch,
        lists,
        riskName,
        page,
        perPage,
        riskEdit,
        riskId,
        tableId,
        currentRow,
        curentRowDetail,
        currentRowApprove,
        nameSearch,
        roleSearch,
        statusSearch
    } = state;
    useEffect(() => {
        setUser(getStorage("userId"))
        let { riskName, perPage, user } = state;
        props.getRisks({ type: 'getByUser', riskName, page, perPage });
    }, [])
    const { notifications } = props
    useEffect(() => {
        if (notifications.associatedData?.length != 0) {
            // console.log('new NOti', notifications.associatedData)
            if (notifications.associatedData.dataType == "realtime_risks") {
                console.log('noti-risk')
                props.getRisks({ type: 'getByUser', riskName, page, perPage });
            }
        }
        if (notifications.associatedData?.length != 0) {
            // console.log('new NOti', notifications.associatedData)
            if (notifications.associatedData.dataType == "realtime_close_task_process") {
                console.log('close')
                // props.getRisks({ type: 'getByUser', riskName, page, perPage });
                props.updateProb()
            }
        }
    }, [notifications.associatedData])
    useEffect(() => {
        if (risk.lists) {
            setState({
                ...state,
                lists: risk.lists
            })
        }
    }, [props.risk.lists])


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e
     */
    const handleChangeRiskName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            riskName: value
        });
    }

    useEffect(() => {
        console.log([roleSearch,nameSearch,statusSearch])
        setState({
            ...state,
            lists: props.risk.lists.filter(r => r[roleSearch]?r[roleSearch].map(a => a._id).includes(getStorage('userId'))
                && r.riskName.toLowerCase().includes(nameSearch.toLowerCase())&&r.riskStatus.includes(statusSearch):
                r.riskName.toLowerCase().includes(nameSearch.toLowerCase())&&r.riskStatus.includes(statusSearch))
        })


    }, [nameSearch, roleSearch,statusSearch])
    /**
     * Hàm xử lý khi click nút tìm kiếm
     */
    const handleSubmitSearch = (event) => {
        let eventName = event.target.name
        let eventValue = event.target.value
        console.log(eventName)
        console.log(eventValue)

        if(eventName == "status"){
            setState({
                ...state,
                statusSearch:eventValue
            })

        }
        if (eventName == "role") {
            setState({
                ...state,
                roleSearch:eventValue
            })

        }
        if (eventName == "name") {
            setState({
                ...state,
                nameSearch: eventValue
                // lists:props.risk.lists.filter(r=>r.riskName.toLowerCase().includes(eventValue.toLowerCase()))
            })
        }
        if(eventName == "ranking"){
            setState({
                ...state,
                rankingSearch: parseInt(eventValue)
                // lists:props.risk.lists.filter(r=>r.riskName.toLowerCase().includes(eventValue.toLowerCase()))
            })
        }
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

        props.getRisks({
            type: 'getByUser',
            riskName,
            perPage,
            page: parseInt(pageNumber)
        });
    }


    /**
     * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
     * @param {*} number số bản ghi sẽ hiển thị
     */
    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getRisks({
            type: 'getByUser',
            riskName,
            perPage: parseInt(number),
            page: 1
        });
    }


    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    const handleDelete = (risk) => {
        if(risk.riskStatus=='wait_for_approve'||risk.riskStatus =='finished'||risk.riskStatus=='wait_for_approval'){
            props.deleteRisk(risk._id);
            // props.getRisks({
            //     type: 'getByUser',
            //     riskName,
            //     perPage,
            //     page: risk && risk.lists && risk.lists.length === 1 ? page - 1 : page
            // });
        }

    }

    const getRiskStatus = (status) => {
        let icon = "fa fa-check-circle";
        let color ="#088A08"
        if (status == "wait_for_approve" || status == "inprocess") {
            color  = '#AEB404'
            icon = "fa fa-spinner"
        }
        if (status == "finished") icon = "fa fa-check-circle"
        if(status == "request_to_close") {
            color = "#0080FF"
            icon = "fa fa-arrow-circle-up"
        }
        return <div style={{color:color}}> <div className="row"><i className={icon}  /></div><div><p className="row">{translate("manage_risk." + status)}</p></div></div>
    }
    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} example thông tin của ví dụ cần {translate('manage_risk.risk_management_table.edit')}
     */
    const [show, setShow] = useState({
        showDetail: false,
        showEdit: false,
        showCreate: false,
        showApprove:false
    })
    const handleEdit = (risk) => {
        console.log('edit risk', risk)
        setState({
            ...state,
            currentRow: risk
        });
        setShow({
            ...show,
            showEdit: !show.showEdit
        })


    }
    useEffect(() => {
        if (currentRow != null) {
            window.$('#modal-edit-risk').modal('show');
        }
    }, [show.showEdit])


    /**
     * Hàm xử lý khi click {translate('manage_risk.risk_management_table.view_deatail')} một ví dụ
     * @param {*} example thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (risk) => {
        setState({
            ...state,
            curentRowDetail: risk,
        });
        setShow({
            ...show,
            showDetail: !show.showDetail
        })

    }
    useEffect(() => {
        window.$(`#modal-detail-info-example-hooks`).modal('show')
    }, [show.showDetail])
    const handleApprove = (risk) => {
        console.log('showApprove user', user)
        setState({
            ...state,
            currentRowApprove: risk,
        })
        setShow({
            ...show,
            showApprove:!show.showApprove
        })
        window.$(`#modal-show-approve`).modal('show')
    }
    useEffect(() => {
        window.$(`#modal-show-approve`).modal('show')
    }, [show.showApprove])
    const handleRequestCloseRisk = (risk) =>{
        console.log(risk)
        props.requestCloseRisk(risk)
    }

    const totalPage = risk && Math.ceil(risk.totalList / perPage);

    return (
        <React.Fragment>
            {currentRowApprove!=null&&<AprroveRiskForm
                approveRisk={currentRowApprove && currentRowApprove}
                page={page}
                perPage={perPage}
            />}

            <RiskCreateForm
                page={page}
                perPage={perPage}
            />
            {currentRow != null && <EditRiskForm
                riskID={currentRow && currentRow._id}
                riskData={currentRow && currentRow}
            />}
            {curentRowDetail && curentRowDetail != null && <RiskDetailInfo

                riskInfo={curentRowDetail}
            />}
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" onClick={() => window.$('#modal-create-example-hooks').modal('show')} className="btn btn-success " >{translate('manage_risk.add')}</button>

                    </div>
                    {/* Button thêm mới */}
                    <form className="col-sm-8">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('manage_risk.search')}</legend>


                            {/* Tìm kiếm theo tên */}
                            <div className="form-group col-sm-4">
                                <label className="form-control-static">{translate('manage_risk.riskName')}</label>
                                <input type="text" className="form-control" name="name" onChange={handleSubmitSearch} placeholder={translate('manage_risk.riskName')} autoComplete="off" />
                            </div>
                            {/*  Tìm kiếm theo vai trò */}
                            <div className="form-group col-sm-4">
                                <label className="form-control-static col-sm-12">{translate('manage_risk.risk_management_table.role')}</label>
                                <select onChange={handleSubmitSearch} name="role" className="form-control">
                                    <option value="">{translate('manage_risk.risk_management_table.all')}</option>
                                    <option value = "responsibleEmployees">{translate('manage_risk.risk_management_table.creator')}</option>
                                    <option value = "accountableEmployees">{translate('manage_risk.risk_management_table.aprrovalEmployee')}</option>
                                </select>
                            </div>
                             {/*  Tìm kiếm theo trạng thái */}
                             <div className="form-group col-sm-4">

                                <label className="form-control-static">{translate('manage_risk.risk_management_table.status')}</label>
                                <select onChange={handleSubmitSearch} name="status" className="form-control">
                                    <option value="">{translate('manage_risk.risk_management_table.all')}</option>
                                    <option value="wait_for_approve">{translate('manage_risk.risk_management_table.wait_for_approval')}</option>
                                    <option value="inprocess">{translate('manage_risk.risk_management_table.processed')}</option>
                                    <option value="request_to_close">{translate('manage_risk.risk_management_table.request_to_close')}</option>
                                    <option value="finished">{translate('manage_risk.risk_management_table.finised')}</option>
                                </select>
                            </div>
                        </fieldset>
                    </form>

                    {/* <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_risk.search')} onClick={() => handleSubmitSearch()}>{translate('manage_risk.search')}</button>
                    </div> */}
                </div>

                {/* Danh sách các ví dụ */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 70 }}>{translate('manage_risk.index')}</th>
                            <th className="col-fixed" style={{ width: 120 }}>ID</th>
                            <th>{translate('manage_risk.riskName')}</th>
                            <th className="col-fixed" style={{ width: 180 }}>{translate('manage_risk.risk_management_table.level')}</th>
                            <th className="col-fixed" style={{ width: 150 }}>{translate('manage_risk.description')}</th>
                            {/* <th>{translate('manage_risk.raised_date')}</th> */}
                            <th className="col-fixed" style={{ width: 150 }}>{translate('manage_risk.occurrence_date')}</th>
                            <th className="col-fixed" style={{ width: 120 }}>{translate('manage_risk.risk_status')}</th>
                            <th className="col-fixed" style={{ width: 100, textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_risk.index'),
                                        translate('manage_risk.riskName'),
                                        translate('manage_risk.description'),
                                        // translate('manage_risk.raised_date'),
                                        translate('manage_risk.occurrence_date')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(lists && lists.length !== 0) &&
                            lists.map((risk, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{'#'+risk._id.toString().toUpperCase()}</td>
                                    <td>{risk.riskName}</td>
                                    <td style={{color:getRankingColor(risk.ranking)}}>{getRankingStr(translate,risk.ranking)}</td>
                                    <td>{risk.description.length !== 0 ? parse(risk.description) : 'None'}</td>
                                    {/* <td>{dayjs(risk.raisedDate).format('DD/MM/YYYY HH:mm:ss')}</td> */}
                                    <td>{dayjs(risk.occurrenceDate).format('DD/MM/YYYY HH:mm:ss')}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {getRiskStatus(risk.riskStatus)}
                                    </td>

                                    <td>
                                        <div className="dropdown">
                                            <button href="#" className=" btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">{translate('process_analysis.process_list.select')}<span className="caret"></span></button>
                                            <ul className="dropdown-menu pull-right" role="menu">
                                                <li><a className="edit text-green" title={translate('manage_risk.detail_info_risk')} onClick={() => handleShowDetailInfo(risk)}><i className="material-icons">visibility</i>{translate('manage_risk.risk_management_table.view_detail')}</a></li>

                                                <li>{
                                                    risk.accountableEmployees.map(a => a._id).includes(getStorage('userId'))
                                                    && risk.riskStatus != 'finished' &&
                                                    <a className="edit text-blue" onClick={() => handleApprove(risk)}><i className="material-icons">check</i>{translate('manage_risk.risk_management_table.approve')}</a>}</li>
                                                <li>{
                                                    risk.responsibleEmployees.map(a => a._id).includes(getStorage('userId'))
                                                    && risk.riskStatus != 'finished' &&
                                                    <a className="edit text-yellow" title={translate('manage_risk.edit')} onClick={() => handleEdit(risk)}><i className="material-icons">edit</i>{translate('manage_risk.risk_management_table.edit')}</a>}</li>
                                                <li>{
                                                    risk.responsibleEmployees.map(a => a._id).includes(getStorage('userId'))
                                                    && risk.riskStatus != 'finished' &&
                                                    <a className="edit text-blue" onClick={() => handleRequestCloseRisk(risk)}><i className="material-icons">arrow_upward</i>{translate('manage_risk.risk_management_table.request_to_close')}</a>}</li>
                                                <li className="divider"></li>
                                                <li>
                                                    <DeleteNotification
                                                        content={translate('manage_risk.delete')}
                                                        data={{
                                                            risk: risk,
                                                            info: risk.riskName,

                                                        }}
                                                        func={handleDelete}
                                                    /></li>
                                            </ul>
                                        </div>

                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {/* PaginateBar */}
                {risk && risk.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={risk && risk.totalList}
                    func={setPage}
                />
            </div>

        </React.Fragment>
    )
}

function mapState(state) {
    const { risk, notifications } = state;
    // console.log('map state')
    // console.log(risk)
    return { risk, notifications }
}

const actions = {
    getRisks: riskActions.getRisks,
    deleteRisk: riskActions.deleteRisk,
    updateProb: RiskDistributionActions.updateProb,
    requestCloseRisk: riskActions.requestCloseRisk
}

const connectedRiskManagementTable = connect(mapState, actions)(withTranslate(RiskManagementTable));
export { connectedRiskManagementTable as RiskManagementTable };