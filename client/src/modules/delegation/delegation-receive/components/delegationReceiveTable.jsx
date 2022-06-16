import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { PaginateBar, SmartTable, ToolTip, ConfirmNotification } from "../../../../common-components";

import { DelegationDetailInfo } from "../../delegation-list/components/delegationDetailInfo";

import { DelegationActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import dayjs from "dayjs";
import { colorfyDelegationStatus } from '../../delegation-list/components/functionHelper';


function DelegationReceiveTable(props) {
    const getTableId = "table-manage-delegation1-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    // Khởi tạo state
    const [state, setState] = useState({
        delegationName: "",
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })
    const [selectedData, setSelectedData] = useState()

    const { delegationReceive, translate } = props;
    const { delegationName, page, perPage, curentRowDetail, tableId } = state;

    useEffect(() => {
        props.getDelegations({ delegationName, page, perPage });
    }, [])



    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleChangeDelegationName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            delegationName: value
        });
    }


    /**
     * Hàm xử lý khi click nút tìm kiếm
     */
    const handleSubmitSearch = () => {
        props.getDelegations({
            delegationName,
            perPage,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
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

        props.getDelegations({
            delegationName,
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
        props.getDelegations({
            delegationName,
            perPage: parseInt(number),
            page: 1
        });
    }




    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const confirmDelegation = (id) => {
        props.confirmDelegation({
            delegationId: id,
        });
        props.getDelegations({
            delegationName,
            perPage,
            page: delegationReceive && delegationReceive.lists && delegationReceive.lists.length === 1 ? page - 1 : page
        });
    }

    const rejectDelegation = (id) => {
        props.rejectDelegation({
            delegationId: id,
            reason: window.$(`#rejectReason-${id}`).val()
        });
        props.getDelegations({
            delegationName,
            perPage,
            page: delegationReceive && delegationReceive.lists && delegationReceive.lists.length === 1 ? page - 1 : page
        });
    }



    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} delegation thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (delegation) => {
        setState({
            ...state,
            curentRowDetail: delegation,
        });
        window.$(`#modal-detail-info-delegation-hooks`).modal('show')
    }

    let lists = [];
    if (delegationReceive) {
        lists = delegationReceive.lists
    }

    const totalPage = delegationReceive && Math.ceil(delegationReceive.totalList / perPage);
    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("DD-MM-YYYY hh:mm A")
    }



    return (
        <React.Fragment>

            <DelegationDetailInfo
                delegationID={curentRowDetail && curentRowDetail._id}
                delegationName={curentRowDetail && curentRowDetail.delegationName}
                description={curentRowDetail && curentRowDetail.description}
                delegator={curentRowDetail && curentRowDetail.delegator}
                delegatee={curentRowDetail && curentRowDetail.delegatee}
                delegatePrivileges={curentRowDetail && curentRowDetail.delegatePrivileges}
                delegateType={curentRowDetail && curentRowDetail.delegateType}
                delegateRole={curentRowDetail && curentRowDetail.delegateRole}
                delegateTasks={curentRowDetail && curentRowDetail.delegateTasks}
                status={curentRowDetail && curentRowDetail.status}
                allPrivileges={curentRowDetail && curentRowDetail.allPrivileges}
                startDate={curentRowDetail && curentRowDetail.startDate}
                endDate={curentRowDetail && curentRowDetail.endDate}
                revokedDate={curentRowDetail && curentRowDetail.revokedDate}
                revokeReason={curentRowDetail && curentRowDetail.revokeReason}
                forReceive={true}
                replyStatus={curentRowDetail && curentRowDetail.replyStatus}
                declineReason={curentRowDetail && curentRowDetail.declineReason}

            />



            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}

                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_delegation.delegationName')}</label>
                        <input type="text" className="form-control" name="delegationName" onChange={handleChangeDelegationName} placeholder={translate('manage_delegation.delegationName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_delegation.search')} onClick={() => handleSubmitSearch()}>{translate('manage_delegation.search')}</button>
                    </div>
                </div>

                <SmartTable
                    disableCheckbox={true}
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_delegation.index'),
                        delegationName: translate('manage_delegation.delegationName'),
                        delegateType: translate('manage_delegation.delegateType'),
                        delegateObject: translate('manage_delegation.delegateObject'),
                        delegator: translate('manage_delegation.delegator'),
                        delegateStartDate: translate('manage_delegation.delegateStartDate'),
                        delegateEndDate: translate('manage_delegation.delegateEndDate'),
                        delegateStatus: translate('manage_delegation.delegateStatus'),
                        // description: translate('manage_delegation.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('manage_delegation.index')}</th>,
                        delegationName: <th>{translate('manage_delegation.delegationName')}</th>,
                        delegateType: <th>{translate('manage_delegation.delegateType')}</th>,
                        delegateObject: <th>{translate('manage_delegation.delegateObject')}</th>,
                        delegator: <th>{translate('manage_delegation.delegator')}</th>,
                        delegateStartDate: <th>{translate('manage_delegation.delegateStartDate')}</th>,
                        delegateEndDate: <th>{translate('manage_delegation.delegateEndDate')}</th>,
                        delegateStatus: <th>{translate('manage_delegation.delegateStatus')}</th>,
                        // description: <th>{translate('manage_delegation.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            delegationName: <td>{item?.delegationName}</td>,
                            delegateType: <td>{translate('manage_delegation.delegateType' + item?.delegateType)}</td>,
                            delegateObject: <td>{item.delegateRole ? item.delegateRole.name : (item.delegateTasks ? <ToolTip dataTooltip={item.delegateTasks.map(task => task.name)} /> : "")}</td>,
                            delegator: <td>{item?.delegator.name}</td>,
                            delegateStartDate: <td>{formatTime(item?.startDate)}</td>,
                            delegateEndDate: <td>{item.revokedDate && (item.endDate && (new Date(item.revokedDate)).getTime() < (new Date(item.endDate)).getTime()) || (item.revokedDate && !item.endDate) ? formatTime(item.revokedDate) : (item.endDate ? formatTime(item.endDate) : translate("manage_delegation.end_date_tbd"))}</td>,
                            delegateStatus: <td>{colorfyDelegationStatus(item.status, translate)} - {colorfyDelegationStatus(item.replyStatus, translate)}</td>,
                            // description: <td>{item?.description}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                {item.replyStatus == "wait_confirm" || item.replyStatus == "declined"
                                    ? <ConfirmNotification
                                        icon="success"
                                        title={translate('manage_delegation.confirm_delegation')}
                                        content={`<h4 style='color: green'><div>${translate('manage_delegation.confirm_delegation')}</div> <div>"${item.delegationName}"</div></h4>`}
                                        name="thumb_up"
                                        className="text-blue"
                                        func={() => confirmDelegation(item._id)}
                                    />
                                    : null}
                                {item.replyStatus == "wait_confirm" || item.replyStatus == "confirmed"
                                    ? <ConfirmNotification
                                        icon="error"
                                        title={translate('manage_delegation.reject_reason')}
                                        content={`<h4 style='color: red'><div>${translate('manage_delegation.reject_delegation')}</div> <div>"${item.delegationName}"</div></h4>
                                        <br> <div class="form-group">
                                            <label>${translate('manage_delegation.reject_reason')}</label>
                                            <textarea id="rejectReason-${item._id}" class="form-control" placeholder="${translate('manage_delegation.reject_reason_placeholder')}"></textarea>
                                        </div>
                                        `}
                                        name="thumb_down"
                                        className="text-red"
                                        func={() => rejectDelegation(item._id)}
                                    />
                                    : null}
                            </td>
                        }
                    })}
                    dataDependency={lists}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {/* PaginateBar */}
                {delegationReceive && delegationReceive.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={delegationReceive && delegationReceive.totalList}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { delegationReceive } = state;
    return { delegationReceive }
}

const actions = {
    getDelegations: DelegationActions.getDelegations,
    confirmDelegation: DelegationActions.confirmDelegation,
    rejectDelegation: DelegationActions.rejectDelegation,

}

const connectedDelegationReceiveTable = connect(mapState, actions)(withTranslate(DelegationReceiveTable));
export { connectedDelegationReceiveTable as DelegationReceiveTable };