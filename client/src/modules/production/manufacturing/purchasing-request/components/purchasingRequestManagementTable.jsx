import React, { Component } from 'react';
import sampleData from '../../sampleData';
import { DataTableSetting, DatePicker, DeleteNotification } from "../../../../../common-components";
import PurchasingRequestDetailInfo from './purchasingRequestDetailInfo';
import PurchasingRequestCreateForm from './purchasingRequestCreateForm';
class PurchasingRequestManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handleShowDetailInfo = async (purchasingRequestId) => {
        await this.setState((state) => {
            return {
                ...state,
                purchasingRequestId: purchasingRequestId
            }
        });
        window.$(`#modal-detail-info-purchasing-request`).modal('show');
    }
    render() {
        const { purchasingRequests } = sampleData;
        return (
            <React.Fragment>
                {
                    <PurchasingRequestDetailInfo
                        purchasingRequestId={this.state.purchasingRequestId}
                    />
                }
                <div className="box-body qlcv">
                    <PurchasingRequestCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu đề nghị</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="PDN 001" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mục đích</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="Lập kế hoạch KH001" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>Ngày nhận</label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <div className="form-inline">

                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã phiếu đề nghị</th>
                                <th>Người tạo</th>
                                <th>Ngày tạo</th>
                                <th>Mục đích</th>
                                <th>Ngày dự kiến nhận hàng</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th style={{ width: "120px", textAlign: "center" }}>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            "STT",
                                            "Mã phiếu đề nghị",
                                            "Người tạo",
                                            "Ngày tạo",
                                            "Mục đích",
                                            "Ngày dự kiến nhận hàng",
                                            "Mô tả",
                                            "Trạng thái"
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(purchasingRequests && purchasingRequests.length !== 0) &&
                                purchasingRequests.map((purchasingRequest, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{purchasingRequest.code}</td>
                                        <td>{purchasingRequest.creator.name}</td>
                                        <td>{purchasingRequest.createdAt}</td>
                                        <td>{purchasingRequest.purpose}</td>
                                        <td>{purchasingRequest.intendReceiveTime}</td>
                                        <td>{purchasingRequest.description}</td>
                                        <td>{purchasingRequest.status ? "Đang được xử lý" : "Chưa được xử lý"}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title="Xem chi tiết phiếu đề nghị" onClick={() => this.handleShowDetailInfo(purchasingRequest._id)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa phiếu đề nghị"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa đơn đề nghị mua hàng"
                                                data={{
                                                    id: purchasingRequest._id,
                                                    info: purchasingRequest.code
                                                }}
                                                func={this.props.deletePurchasingRequest}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment >
        );
    }
}

export default PurchasingRequestManagementTable;