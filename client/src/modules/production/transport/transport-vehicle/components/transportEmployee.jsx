import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../../common-components";

// import { transportRequirementsActions } from "../redux/actions";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';

function TransportEmployee(props) {
    const getTableId = "table-manage-transport-requirements-hooks";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <div className="form-inline">
                <table id={"123"} className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{"STT"}</th>
                            <th>{"Loại yêu cầu"}</th>
                            <th>{"Địa chỉ bắt đầu"}</th>
                            <th>{"Địa chỉ kết thúc"}</th>
                            <th>{"Người tạo"}</th>
                            <th>{"Trạng thái"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={"1"}>
                            <td>{1}</td>
                            <td>{"Giao hàng"}</td>
                            <td>{"Thái Hà"}</td>
                            <td>{"Bách Khoa"}</td>
                            <td>{"Nguyễn Văn Danh"}</td>
                            <td>{"Chờ phê duyệt"}</td>
                            {/* <td style={{ textAlign: "center" }}>
                                <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                <DeleteNotification
                                    content={translate('manage_example.delete')}
                                    data={{
                                        id: example._id,
                                        info: example.exampleName
                                    }}
                                    func={handleDelete}
                                />
                            </td> */}
                        </tr>
                        {/* {(lists && lists.length !== 0) &&
                            lists.map((example, index) => (
                                <tr key={index}>
                                    <td>{index + 1 + (page - 1) * perPage}</td>
                                    <td>{example.exampleName}</td>
                                    <td>{example.description}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(example)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(example)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_example.delete')}
                                            data={{
                                                id: example._id,
                                                info: example.exampleName
                                            }}
                                            func={handleDelete}
                                        />
                                    </td>
                                </tr>
                            ))
                        } */}
                    </tbody>
                </table>

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
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
//     const example = state.example1;
//     return { example }
}

const actions = {
    // getExamples: transportRequirementsActions.getAllTransportRequirements,
    // deleteExample: exampleActions.deleteExample
}

const connectedTransportEmployee = connect(mapState, actions)(withTranslate(TransportEmployee));
export { connectedTransportEmployee as TransportEmployee };