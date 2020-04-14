import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AssetCreateForm } from './AssetCreateForm';
import { AssetEditForm } from './AssetEditForm';
import { ActionColumn, DeleteNotification, PaginateBar, SelectMulti } from '../../../../common-components';

// import { AssetActions } from '../redux/actions';
class AssetManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: null,
            number: "",
            employeeNumber: "",
            unit: null,
            page: 0,
            limit: 5,
        }
    }
    componentDidMount() {
        this.props.getListAsset(this.state);
    }

    // Bắt sự kiện click chỉnh sửa thông tin khen thưởng
    handleEdit = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: value
            }
        });
        window.$('#modal-edit-asset').modal('show');
    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            unit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    // Function bắt sự kiện thay đổi mã nhân viên và số quyết định
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Function bắt sự kiện tìm kiếm 
    handleSubmitSearch = () => {
        this.props.getListAsset(this.state);
    }

    // Bắt sự kiện setting số dòng hiện thị trên một trang
    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
        });
        this.props.getListAsset(this.state);
    }

    // Bắt sự kiện chuyển trang
    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * this.state.limit;
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListAsset(this.state);
    }

    render() {
        // const { list } = this.props.department;
        const { translate, asset } = this.props;
        var listAsset = "", listPosition = [];
        // if (this.state.unit !== null) {
        //     let unit = this.state.unit;
        //     unit.forEach(u => {
        //         list.forEach(x => {
        //             if (x._id === u) {
        //                 let position = [
        //                     { _id: x.dean._id, name: x.dean.name },
        //                     { _id: x.vice_dean._id, name: x.vice_dean.name },
        //                     { _id: x.employee._id, name: x.employee.name }
        //                 ]
        //                 listPosition = listPosition.concat(position)
        //             }
        //         })
        //     })
        // }
        if (this.props.asset.isLoading === false) {
            listAsset = this.props.asset.listAsset;
        }
        var pageTotal = (this.props.asset.totalListAsset % this.state.limit === 0) ?
            parseInt(this.props.asset.totalListAsset / this.state.limit) :
            parseInt((this.props.asset.totalListAsset / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <AssetCreateForm />
                    <div className="form-group">
                        <h4 className="box-title">Danh sách tài sản: </h4>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã tài sản</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="number" className="form-control-static">Tên tài sản</label>
                            <input type="text" className="form-control" name="number" onChange={this.handleChange} placeholder={translate('page.number_decisions')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">Loại tài sản</label>
                            {/* <SelectMulti id={`multiSelectAssetType`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_unit'), allSelectedText: translate('page.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti> */}
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tình trạng</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_position'), allSelectedText: translate('page.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                            <button type="button" className="btn btn-success" onClick={this.handleSubmitSearch} title={translate('page.add_search')} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    {/* <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.staff_number')}</label>
                            <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} placeholder={translate('page.staff_number')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="number" className="form-control-static">{translate('page.number_decisions')}</label>
                            <input type="text" className="form-control" name="number" onChange={this.handleChange} placeholder={translate('page.number_decisions')} autoComplete="off" />
                            <button type="button" className="btn btn-success" onClick={this.handleSubmitSearch} title={translate('page.add_search')} >{translate('page.add_search')}</button>
                        </div>
                    </div> */}
                    <table id="asset-table" className="table table-striped table-bordered table-hover" >
                        <thead>
                            <tr>
                                <th >Mã tài sản</th>
                                <th>Tên tài sản</th>
                                <th >Loại tài sản</th>
                                <th >Ngày nhập</th>
                                <th>Người quản lý</th>
                                <th >Chức vụ</th>
                                <th >Vị trí</th>
                                <th >Tình trạng</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <ActionColumn
                                        tableId="asset-table"
                                        columnArr={[
                                            "Mã tài sản",
                                            "Tên tài sản",
                                            "Loại tài sản",
                                            "Ngày nhập",
                                            "Người quản lý",
                                            "Chức vụ",
                                            "Vị trí",
                                            "Tình trạng"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof listAsset !== 'undefined' && listAsset.length !== 0) &&
                                listAsset.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.assetNumber}</td>
                                        <td>{x.assetName}</td>
                                        <td>{x.assetType}</td>
                                        <td>{x.ngaynhap}</td>
                                        <td>{x.nguoiquanly}</td>
                                        <td>{x.chucvu}</td>
                                        <td>{x.vitri}</td>
                                        <td>{x.tinhtrang}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin tài sản"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xóa thông tin tài sản"
                                                data={{
                                                    id: x._id,
                                                    info: x.assetNumber + " - " + translate('page.number_decisions') + ": " + x.number
                                                }}
                                                func={this.props.deleteAsset}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {asset.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listAsset === 'undefined' || listAsset.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                    {
                    this.state.currentRow !== undefined &&
                    <AssetEditForm
                        _id={this.state.currentRow._id}
                        employeeNumber={this.state.currentRow.employee.employeeNumber}
                        number={this.state.currentRow.number}
                        unit={this.state.currentRow.unit}
                        startDate={this.state.currentRow.startDate}
                        type={this.state.currentRow.type}
                        reason={this.state.currentRow.reason}
                    />
                }
                </div>
            </div>
        )
    };
}
function mapState(state) {
    const { asset } = state;
    return { asset };
};

const actionCreators = {
    // getListAsset: AssetActions.getListAsset,
    // deleteAsset: AssetActions.deleteAsset,
};

const assetManager = connect(mapState, actionCreators)(withTranslate(AssetManager));
export { assetManager as AssetManager };