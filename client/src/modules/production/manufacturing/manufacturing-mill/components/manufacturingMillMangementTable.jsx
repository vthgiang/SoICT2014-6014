import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DataTableSetting, DeleteNotification } from "../../../../../common-components";
import { connect } from 'react-redux';
import { millActions } from '../redux/actions';
import ManufacturingMillCreateForm from './manafacturingMillCreateForm';
class ManufacturingMillMangementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: '',
            name: ''
        }
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllManufacturingMills({ page, limit });
    }

    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <ManufacturingMillCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_mill.code')}</label>
                            <input type="text" className="form-control" name="code" onChange={this.handleCodeChange} placeholder="XSX200815153823" autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.manufacturing_mill.name')}</label>
                            <input type="text" className="form-control" name="name" onChange={this.handleNameChange} placeholder="Xưởng thuốc bột" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manufacturing.manufacturing_mill.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.manufacturing_mill.search')}</button>
                        </div>
                    </div>
                    {/* <table id="manufacturing-works-table" className="table table-striped table-bordered table-hover">
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
                    </table> */}
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const manufacturingMill = state.manufacturingMill
    return { manufacturingMill }
}

const mapDispatchToProps = {
    getAllManufacturingMills: millActions.getAllManufacturingMills
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillMangementTable));