import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DeleteNotification, PaginateBar, SmartTable } from "../../../../common-components";

import { DelegationCreateForm } from "./delegationCreateForm";
import { DelegationEditForm } from "./delegationEditForm";
import { DelegationDetailInfo } from "./delegationDetailInfo";
import { DelegationImportForm } from "./delegationImortForm";

import { DelegationActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function DelegationTable(props) {
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

    const { delegation, translate } = props;
    const { delegationName, page, perPage, currentRow, curentRowDetail, tableId } = state;

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


    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    const handleDelete = (id) => {
        props.deleteDelegations({
            delegationIds: [id]
        });
        props.getDelegations({
            delegationName,
            perPage,
            page: delegation && delegation.lists && delegation.lists.length === 1 ? page - 1 : page
        });
    }

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const handleDeleteOptions = () => {
        props.deleteDelegations({
            delegationIds: selectedData
        });
    }

    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} delegation thông tin của ví dụ cần chỉnh sửa
     */
    const handleEdit = (delegation) => {
        setState({
            ...state,
            currentRow: delegation
        });
        window.$('#modal-edit-delegation-hooks').modal('show');
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
    if (delegation) {
        lists = delegation.lists
    }

    const totalPage = delegation && Math.ceil(delegation.totalList / perPage);

    return (
        <React.Fragment>
            <DelegationEditForm
                delegationID={currentRow && currentRow._id}
                delegationName={currentRow && currentRow.delegationName}
                description={currentRow && currentRow.description}
            />

            <DelegationDetailInfo
                delegationID={curentRowDetail && curentRowDetail._id}
                delegationName={curentRowDetail && curentRowDetail.delegationName}
                description={curentRowDetail && curentRowDetail.description}
            />

            <DelegationCreateForm
                page={page}
                perPage={perPage}
            />

            <DelegationImportForm
                page={page}
                perPage={perPage}
            />

            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}
                    <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_delegation.add_title')} >{translate('manage_delegation.add')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-delegation-hooks').modal('show')} title={translate('manage_delegation.add_one_delegation')}>
                                {translate('manage_delegation.add_delegation')}</a></li>
                            {/* <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-delegation-hooks').modal('show')} title={translate('manage_delegation.add_multi_delegation')}>
                                {translate('human_resource.salary.add_import')}</a></li> */}
                        </ul>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}

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
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_delegation.index'),
                        delegationName: translate('manage_delegation.delegationName'),
                        description: translate('manage_delegation.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('manage_delegation.index')}</th>,
                        delegationName: <th>{translate('manage_delegation.delegationName')}</th>,
                        description: <th>{translate('manage_delegation.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            delegationName: <td>{item?.delegationName}</td>,
                            description: <td>{item?.description}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation.detail_info_delegation')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('manage_delegation.delete')}
                                    data={{
                                        id: item._id,
                                        info: item.delegationName
                                    }}
                                    func={handleDelete}
                                />
                            </td>
                        }
                    })}
                    dataDependency={lists}
                    onSetNumberOfRowsPerpage={setLimit}
                    onSelectedRowsChange={onSelectedRowsChange}
                />

                {/* PaginateBar */}
                {delegation && delegation.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={delegation && delegation.totalList}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const delegation = state.delegation;
    return { delegation }
}

const actions = {
    getDelegations: DelegationActions.getDelegations,
    deleteDelegations: DelegationActions.deleteDelegations
}

const connectedDelegationTable = connect(mapState, actions)(withTranslate(DelegationTable));
export { connectedDelegationTable as DelegationTable };