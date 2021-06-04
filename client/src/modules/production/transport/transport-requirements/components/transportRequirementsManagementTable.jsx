import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

import { TransportRequirementsCreateForm } from "./transportRequirementsCreateForm"
import { TransportRequirementsViewDetails } from "./transportRequirementsViewDetails"
import { TransportRequirementsEditForm } from './transportRequirementsEditForm'

import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

import {getTypeRequirement, getTransportRequirementStatus} from '../../transportHelper/getTextFromValue'

function TransportRequirementsManagementTable(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const requirements = [
        {
            value: "1",
            text: "Giao hàng",
            billType: "4",
            billGroup: "2",
        },
        {
            value: "2",
            text: "Trả hàng",
            billType: "7",
            billGroup: "3",
        },
        {
            value: "3",
            text: "Chuyển thành phẩm tới kho",
            billType: "2",
            billGroup: "1",
        },
        {
            value: "4",
            text: "Giao nguyên vật liệu",
            billType: "3",
            billGroup: "2"
        },
        {
            value: "5",
            text: "Khác",
        }
    ];
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
    const handleShowApprove = (requirement) => {
        props.editTransportRequirement(requirement._id, {status: 2})
    }
    const checkApprover = (requirement) => {
        console.log(String(localStorage.getItem("userId") === String(requirement.approver?._id)), " aaaaaaaaaaaaaaaaaaaaa")
        if (String(localStorage.getItem("userId")) === String(requirement.approver?._id)){
            return 1;
        }
        else
        return 2;
    }
    /**
     * Hàm xử lý khi click xem chi tiết một ví dụ
     * @param {*} example thông tin của ví dụ cần xem
     */
    const handleShowDetailInfo = (transportRequirement) => {
        console.log(transportRequirement, " day la transportrequirement")
        setState({
            ...state,
            curentTransportRequirementDetail: transportRequirement,
        });
        window.$(`#modal-detail-info-example-hooks`).modal('show')
    }

    const setLimit = (number) => {
        setState({
            ...state,
            page: 1,
            perPage: parseInt(number)
        })
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        })
    }

    const getDisplayLength = () => {
        let res = 0;
        if (allTransportRequirements && allTransportRequirements.length!==0){
            allTransportRequirements.map((item, index) => {
                if ((index+1>(page-1)*perPage) && (index+1<=page*perPage)){
                    res++;
                }
            })
        }
        return res;
    }

    let lists = [];
    if (example) {
        lists = example.lists
    }

    // const totalPage = example && Math.ceil(example.totalList / perPage);
    const totalPage = allTransportRequirements && Math.ceil(allTransportRequirements.length / perPage);

    return (
        <React.Fragment>
            <TransportRequirementsCreateForm 
                requirements={requirements}
                key = {transportRequirements}
            />
            <TransportRequirementsViewDetails
                curentTransportRequirementDetail={curentTransportRequirementDetail}
            />
            <TransportRequirementsEditForm
                curentTransportRequirementDetail={curentTransportRequirementDetail}
                editTransportRequirement={editTransportRequirement}
            />
            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{"Mã yêu cầu"}</label>
                        <input type="text" className="form-control" name="exampleName" placeholder={"Mã yêu cầu"} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} >{translate('manage_example.search')}</button>
                    </div>
                </div>

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
                            <th>{"Người xử lí yêu cầu"}</th>
                            <th>{"Trạng thái"}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        // translate('manage_example.index'),
                                        // translate('manage_example.exampleName'),
                                        // translate('manage_example.description'),
                                        translate('manage_example.index'),
                                        "Mã yêu cầu",
                                        "Loại yêu cầu",
                                        "Địa chỉ nhận hàng",
                                        "Địa chỉ giao hàng",
                                        "Người tạo",
                                        "Trạng thái",
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(allTransportRequirements && allTransportRequirements.length !== 0) &&
                            allTransportRequirements.map((x, index) => (
                                x && (index+1>(page-1)*perPage) && (index+1<=page*perPage)
                                &&
                                <tr key={index}>
                                    {/* <td>{index + 1 + (page - 1) * perPage}</td> */}
                                    <td>{index+1}</td>
                                    <td>{x.code}</td>
                                    <td>{getTypeRequirement(x.type)}</td>
                                    <td>{x.fromAddress}</td>
                                    <td>{x.toAddress}</td>
                                    <td>{x.creator ? x.creator.name : ""}</td>
                                    <td>{x.approver ? x.approver.name: ""}</td>
                                    <td>{getTransportRequirementStatus(x.status)}</td>
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
                                        {
                                            (String(x.status)==="1")
                                            && (
                                            <a className="edit text-yellow" 
                                                style={{ width: '5px' }} 
                                                // title={translate('manage_example.edit')} 
                                                onClick={() => handleEdit(x)}
                                            >
                                                <i className="material-icons">
                                                    edit
                                                </i>
                                            </a>
                                            )
                                        }
                                        {
                                        // this.checkUserForApprove(item) === 1 && 
                                        (String(x.status)==="1"&&checkApprover(x) === 1)
                                        &&(
                                            <a
                                                onClick={() => handleShowApprove(x)}
                                                className="add text-success"
                                                style={{ width: "5px" }}
                                                title="Phê duyệt yêu cầu vận chuyển"
                                            >
                                                <i className="material-icons">check_circle_outline</i>
                                            </a>
                                        )}
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
                {transportRequirements && transportRequirements.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof allTransportRequirements === 'undefined' || allTransportRequirements.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                {/* PaginateBar */}
                {/* {example && example.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                } */}
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    // display={allTransportRequirements && allTransportRequirements.length !== 0 && allTransportRequirements.length}
                    display={getDisplayLength()}
                    // total={example && example.totalList}
                    total = {allTransportRequirements&&allTransportRequirements.length}
                    func={setPage}
                />
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