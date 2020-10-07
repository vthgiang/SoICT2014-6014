import React, { Component } from 'react';
import sampleData from '../../sampleData';
import { DataTableSetting, DeleteNotification } from "../../../../../common-components";
import ManufacturingMillCreateForm from './manafacturingMillCreateForm';
class ManufacturingMillMangementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { mills } = sampleData;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <ManufacturingMillCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã xưởng</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleChangeData} placeholder="XSX 001" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Tên xưởng</label>
                            <input type="text" className="form-control" name="worksName" onChange={this.handleChangeData} placeholder="Xưởng thuốc bột" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title="Tìm kiếm" onClick={this.handleSubmitSearch}>Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã xưởng</th>
                                <th>Tên xưởng</th>
                                <th>Nhà máy</th>
                                <th>Mô tả</th>
                                <th style={{ width: "120px", textAlign: "center" }}>Hành động
                                    <DataTableSetting
                                        tableId="manufacturing-works-table"
                                        columnArr={[
                                            "STT",
                                            "Mã xưởng",
                                            "Tên xưởng",
                                            "Nhà máy",
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
                            {(mills && mills.length !== 0) &&
                                mills.map((mill, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{mill.code}</td>
                                        <td>{mill.name}</td>
                                        <td>{mill.manufacturingWorks.name}</td>
                                        <td>{mill.description}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title="Sửa xưởng sản xuất"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa xưởng"
                                                data={{
                                                    id: mill._id,
                                                    info: mill.code + " - " + mill.name
                                                }}
                                                func={this.props.deleteMill}
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

export default ManufacturingMillMangementTable;