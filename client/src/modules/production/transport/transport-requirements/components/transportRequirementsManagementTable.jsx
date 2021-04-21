import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { TransportRequirementsCreateForm } from "./transportRequirementsCreateForm"
import { TransportRequirementsViewDetails } from "./transportRequirementsViewDetails"
import { TransportRequirementsEditForm } from './transportRequirementsEditForm'

import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportRequirementsManagementTable(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        perPage: getLimit,
        tableId: getTableId,
    })

    const [allTransportRequirements, setAllTransportRequirements] = useState()
    const { example, translate, transportRequirements } = props;
    const { exampleName, page, perPage, currentRow, curentRowDetail, tableId, curentTransportRequirementDetail } = state;
    
    useEffect(() => {
        props.getAllTransportRequirements({ page : 1, perPage : 100 });
    }, [])

    useEffect(() => {
        if(transportRequirements){
            if(transportRequirements.lists){
                setAllTransportRequirements(transportRequirements.lists)
            }
        }
        console.log(transportRequirements)
    }, [transportRequirements])

    /**
     * Hàm xử lý khi click xóa 1 ví dụ
     * @param {*} id của ví dụ cần xóa
     */
    const handleDelete = (id) => {
        props.deleteTransportRequirement(id);
        // props.getExamples({
        //     exampleName,
        //     perPage,
        //     page: example && example.lists && example.lists.length === 1 ? page - 1 : page
        // });
    }


    /**
     * Hàm xử lý khi click edit một ví vụ
     * @param {*} example thông tin của ví dụ cần chỉnh sửa
     */
    const handleEdit = (transportRequirement) => {
        setState({
            ...state,
            curentTransportRequirementDetail: transportRequirement,
        });
        window.$('#modal-edit-example-hooks').modal('show');
    }
    const editTransportRequirement = (requirementId, data) => {
        props.editTransportRequirement(requirementId, data);
    }

    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} example thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (transportRequirement) => {
        setState({
            ...state,
            curentTransportRequirementDetail: transportRequirement,
        });
        window.$(`#modal-detail-info-example-hooks`).modal('show')
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    const totalPage = example && Math.ceil(example.totalList / perPage);
    return (
        <React.Fragment>
            <TransportRequirementsCreateForm />
            <TransportRequirementsViewDetails
                curentTransportRequirementDetail={curentTransportRequirementDetail}
            />
            <TransportRequirementsEditForm
                curentTransportRequirementDetail={curentTransportRequirementDetail}
                editTransportRequirement={editTransportRequirement}
            />
            <div className="box-body qlcv">
                {/* <div className="form-inline"> */}
                    {/* Tìm kiếm */}
                    {/* <div className="form-group">
                        <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeExampleName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                    </div> */}
                {/* </div> */}

                {/* Danh sách các yêu cầu */}
                <table id={tableId} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{"Mã yêu cầu"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Địa chỉ nhận hàng"}</th>
                            <th>{"Địa chỉ giao hàng"}</th>
                            <th>{"Người tạo"}</th>
                            <th>{"Trạng thái"}</th>
                            <th>{"Hành động"}</th>
                            {/* <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),
                                        translate('manage_example.description'),
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {(allTransportRequirements && allTransportRequirements.length !== 0) &&
                            allTransportRequirements.map((x, index) => (
                                x &&
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{x.code}</td>
                                    <td>{x.type}</td>
                                    <td>{x.fromAddress}</td>
                                    <td>{x.toAddress}</td>
                                    <td>{x.creator ? x.creator.name : ""}</td>
                                    <td>{x.status}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} 
                                            // title={translate('manage_example.detail_info_example')} 
                                            title={'Thông tin chi tiết yêu cầu vận chuyển'}
                                            onClick={() => handleShowDetailInfo(x)}
                                        >
                                            <i className="material-icons">
                                                visibility
                                            </i>
                                        </a>
                                        <a className="edit text-yellow" 
                                            style={{ width: '5px' }} 
                                            // title={translate('manage_example.edit')} 
                                            onClick={() => handleEdit(x)}
                                        >
                                            <i className="material-icons">
                                                edit
                                            </i>
                                        </a>
                                        <DeleteNotification
                                            // content={translate('manage_example.delete')}
                                            content={"Xóa yêu cầu vận chuyển "}
                                            data={{
                                                id: x._id,
                                                info: x.code,
                                            }}
                                            func={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {/* PaginateBar */}
                {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof allTransportRequirements === 'undefined' || allTransportRequirements.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* PaginateBar */}
                {/* {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                } */}
                {/* <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    display={lists && lists.length !== 0 && lists.length}
                    total={example && example.totalList}
                    func={setPage}
                /> */}
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const {transportRequirements} = state;
    return { transportRequirements }
}

const actions = {
    getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements,
    deleteTransportRequirement: transportRequirementsActions.deleteTransportRequirement,
    editTransportRequirement: transportRequirementsActions.editTransportRequirement,
}

const connectedTransportRequirementsManagementTable = connect(mapState, actions)(withTranslate(TransportRequirementsManagementTable));
export { connectedTransportRequirementsManagementTable as TransportRequirementsManagementTable };