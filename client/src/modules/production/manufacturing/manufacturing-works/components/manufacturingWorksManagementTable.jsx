import React, { Component } from 'react';
import sampleData from '../../sampleData';
import { DataTableSetting, DeleteNotification } from "../../../../../common-components";
import ManufacturingWorksCreateForm from './manufacturingWorksCreateForm';
class ManufacturingWorksManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { works } = sampleData;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <ManufacturingWorksCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã nhà máy</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="MW123" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Tên nhà máy</label>
                            <input type="text" className="form-control" name="worksName" onChange={this.handleChangeData} placeholder="Nhà máy CRSX" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã nhà máy</th>
                                <th>Tên nhà máy</th>
                                <th>Giám đốc</th>
                                <th>Quản Đốc</th>
                                <th>Xưởng</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Mô tả</th>
                                <th style={{ width: "120px", textAlign: "center" }}>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            "STT",
                                            "Mã nhà máy",
                                            "Tên nhà máy",
                                            "Giám đốc",
                                            "Quản Đốc",
                                            "Xưởng",
                                            "Số điện thoại",
                                            "Địa chỉ",
                                            "Trạng thái",
                                            "Mô tả"
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(works && works.length !== 0) &&
                                works.map((work, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{work.code}</td>
                                        <td>{work.name}</td>
                                        <td>{work.worksManager}</td>
                                        <td>{work.foreman}</td>
                                        <td>{work.manufacturingMills.map((mill, index) => {
                                            if (work.manufacturingMills.length !== index + 1)
                                                return `${index + 1}. ${mill.name}\n`
                                            return `${index + 1}. ${mill.name}`
                                        })}</td>
                                        <td>{work.phoneNumber}</td>
                                        <td>{work.address}</td>
                                        <td>{work.status ? "Đang hoạt động" : "Dừng hoạt động"}</td>
                                        <td>{work.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa nhà máy"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa nhà máy"
                                                data={{
                                                    id: work._id,
                                                    info: work.code + " - " + work.name
                                                }}
                                                func={this.props.deleteWork}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}

export default ManufacturingWorksManagementTable;