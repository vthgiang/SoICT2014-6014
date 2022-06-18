import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DeleteNotification, PaginateBar, SmartTable } from "../../../../common-components";

import { PolicyCreateForm } from "./policyCreateForm";
import { PolicyEditForm } from "./policyEditForm";
import { PolicyDetailInfo } from "./policyDetailInfo";
import { PolicyImportForm } from "./policyImortForm";
import { AttributeActions } from '../../attribute/redux/actions';
import { PolicyActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';

function PolicyTable(props) {
    const getTableId = "table-manage-policy1-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    // Khởi tạo state
    const [state, setState] = useState({
        policyName: "",
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
        i: 0
    })
    const [selectedData, setSelectedData] = useState()

    const { policyDelegation, translate } = props;
    const { policyName, page, perPage, currentRow, curentRowDetail, tableId } = state;

    useEffect(() => {
        props.getAttribute();
    }, [])

    useEffect(() => {
        props.getPolicies({ policyName, page, perPage });
    }, [])



    const handleChangeAddRowAttribute = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleChangePolicyName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            policyName: value
        });
    }


    /**
     * Hàm xử lý khi click nút tìm kiếm
     */
    const handleSubmitSearch = () => {
        props.getPolicies({
            policyName,
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

        props.getPolicies({
            policyName,
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
        props.getPolicies({
            policyName,
            perPage: parseInt(number),
            page: 1
        });
    }


    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    const handleDelete = (id) => {
        props.deletePolicies({
            policyIds: [id]
        });
        props.getPolicies({
            policyName,
            perPage,
            page: policyDelegation && policyDelegation.lists && policyDelegation.lists.length === 1 ? page - 1 : page
        });
    }

    const onSelectedRowsChange = (value) => {
        setSelectedData(value)
    }

    const handleDeleteOptions = () => {
        props.deletePolicies({
            policyIds: selectedData
        });
    }

    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} policy thông tin của ví dụ cần chỉnh sửa
     */
    const handleEdit = (policy) => {
        setState({
            ...state,
            currentRow: policy
        });
        window.$('#modal-edit-policy-hooks').modal('show');
    }

    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} policy thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (policy) => {
        setState({
            ...state,
            curentRowDetail: policy,
        });
        window.$(`#modal-detail-info-policy-hooks`).modal('show')
    }

    let lists = [];
    if (policyDelegation) {
        lists = policyDelegation.lists
    }

    const totalPage = policyDelegation && Math.ceil(policyDelegation.totalList / perPage);

    return (
        <React.Fragment>
            <PolicyEditForm
                policyID={currentRow && currentRow._id}
                policyName={currentRow && currentRow.policyName}
                description={currentRow && currentRow.description}
                delegatorAttributes={currentRow && currentRow.delegator.delegatorAttributes}
                delegateeAttributes={currentRow && currentRow.delegatee.delegateeAttributes}
                delegatedObjectAttributes={currentRow && currentRow.delegatedObject.delegatedObjectAttributes}
                resourceAttributes={currentRow && currentRow.resource.resourceAttributes}
                delegatorRule={currentRow && currentRow.delegator.delegatorRule}
                delegatedObjectRule={currentRow && currentRow.delegatedObject.delegatedObjectRule}
                delegateeRule={currentRow && currentRow.delegatee.delegateeRule}
                resourceRule={currentRow && currentRow.resource.resourceRule}
                i={state.i}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            />

            <PolicyDetailInfo
                policyID={curentRowDetail && curentRowDetail._id}
                policyName={curentRowDetail && curentRowDetail.policyName}
                description={curentRowDetail && curentRowDetail.description}
                delegatorAttributes={curentRowDetail && curentRowDetail.delegator.delegatorAttributes}
                delegateeAttributes={curentRowDetail && curentRowDetail.delegatee.delegateeAttributes}
                delegatedObjectAttributes={curentRowDetail && curentRowDetail.delegatedObject.delegatedObjectAttributes}
                resourceAttributes={curentRowDetail && curentRowDetail.resource.resourceAttributes}
                delegatorRule={curentRowDetail && curentRowDetail.delegator.delegatorRule}
                delegatedObjectRule={curentRowDetail && curentRowDetail.delegatedObject.delegatedObjectRule}
                delegateeRule={curentRowDetail && curentRowDetail.delegatee.delegateeRule}
                resourceRule={curentRowDetail && curentRowDetail.resource.resourceRule}
                curentRowDetail={curentRowDetail}
            />

            <PolicyCreateForm
                page={page}
                perPage={perPage}
                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                i={state.i}
            />

            <PolicyImportForm
                page={page}
                perPage={perPage}
            />

            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}
                    <div className="dropdown pull-right" style={{ marginTop: "5px" }}>
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_delegation_policy.add_title')} >{translate('manage_delegation_policy.add')}</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-policy-hooks').modal('show')} title={translate('manage_delegation_policy.add_one_policy')}>
                                {translate('manage_delegation_policy.add_policy')}</a></li>
                            {/* <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-policy-hooks').modal('show')} title={translate('manage_delegation_policy.add_multi_policy')}>
                                {translate('human_resource.salary.add_import')}</a></li> */}
                        </ul>
                    </div>
                    {selectedData?.length > 0 && <button type="button" className="btn btn-danger pull-right" title={translate('general.delete_option')} onClick={() => handleDeleteOptions()}>{translate("general.delete_option")}</button>}

                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_delegation_policy.policyName')}</label>
                        <input type="text" className="form-control" name="policyName" onChange={handleChangePolicyName} placeholder={translate('manage_delegation_policy.policyName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_delegation_policy.search')} onClick={() => handleSubmitSearch()}>{translate('manage_delegation_policy.search')}</button>
                    </div>
                </div>

                <SmartTable
                    tableId={tableId}
                    columnData={{
                        index: translate('manage_delegation_policy.index'),
                        policyName: translate('manage_delegation_policy.policyName'),
                        description: translate('manage_delegation_policy.description')
                    }}
                    tableHeaderData={{
                        index: <th className="col-fixed" style={{ width: 60 }}>{translate('manage_delegation_policy.index')}</th>,
                        policyName: <th>{translate('manage_delegation_policy.policyName')}</th>,
                        description: <th>{translate('manage_delegation_policy.description')}</th>,
                        action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
                    }}
                    tableBodyData={lists?.length > 0 && lists.map((item, index) => {
                        return {
                            id: item?._id,
                            index: <td>{index + 1}</td>,
                            policyName: <td>{item?.policyName}</td>,
                            description: <td>{item?.description}</td>,
                            action: <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_delegation_policy.detail_info_policy')} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_delegation_policy.edit')} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('manage_delegation_policy.delete')}
                                    data={{
                                        id: item._id,
                                        info: item.policyName
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
                {policyDelegation && policyDelegation.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={policyDelegation && policyDelegation.totalList}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const policyDelegation = state.policyDelegation;
    return { policyDelegation }
}

const actions = {
    getPolicies: PolicyActions.getPolicies,
    deletePolicies: PolicyActions.deletePolicies,
    getAttribute: AttributeActions.getAttributes
}

const connectedPolicyTable = connect(mapState, actions)(withTranslate(PolicyTable));
export { connectedPolicyTable as PolicyTable };