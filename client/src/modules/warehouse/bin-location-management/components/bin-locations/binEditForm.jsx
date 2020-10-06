import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectBox } from '../../../../../common-components';
class BinEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { translate } = this.props;
        return (
            <div id="edit-bin-location">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="C1" onChange={this.handleCodeChange}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Đã đầy" onChange={this.handleAddressChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.department')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-of-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value="Phòng kế hoạch"
                                        items={[
                                            { value: '1', text: "Phòng kế hoạch"},
                                            { value: '2', text: "Ban giám đốc"},
                                            { value: '3', text: "Phòng kinh doanh"},
                                        ]}
                                        onChange={this.handleDepartmentChange}    
                                        multiple={false}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.unit')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Khối" onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="Nhà C1" onChange={this.handleNameChange} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bin_location_management.capacity')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" value="3" onChange={this.handleNameChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.management_location')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-management-location-stock`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={'1'}
                                        items={[
                                            { value: '1', text: "Nguyễn Văn Thắng"},
                                            { value: '2', text: "Phạm Đại Tài"},
                                            { value: '3', text: "Nguyễn Anh Phương"},
                                        ]}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={true}
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.parent')}</label>
                                    <SelectBox
                                        id={`select-management-location-stock-bin`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
                                        items={[
                                            { value: '1', text: "Nhà B1"},
                                            { value: '2', text: "Nhà D5"},
                                            { value: '3', text: "Nhà C1"},
                                        ]}
                                        onChange={this.handleManagementLocationtChange}    
                                        multiple={true}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bin_location_management.description')}</label>
                                    <textarea type="text" className="form-control" value="Nơi lưu trữ kho số 1" onChange={this.handleDescriptionChange} />
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>
                                    
                                    <div className={`form-group`}>
                                        <label>{translate('manage_warehouse.good_management.good')}</label>
                                        <SelectBox
                                            id={`select-good-by-bin`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value=""
                                            items={[
                                                { value: '', text: "Chọn hàng hóa"},
                                                { value: '1', text: "ĐƯỜNG ACESULFAME K"},
                                                { value: '2', text: "ACID CITRIC MONO"},
                                                { value: '3', text: "Jucca Nước"},
                                            ]}
                                            onChange={this.handleGoodChange}
                                            multiple={false}
                                        />
                                    </div>

                                    <div className={`form-group`}>
                                        <label className="control-label">{translate('manage_warehouse.bin_location_management.type')}</label>
                                        <div>
                                            <SelectBox
                                                id={`select-type-by-bin`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                value=""
                                                items={[
                                                    { value: '', text: "Chọn kiểu hàng hóa"},
                                                    { value: '3', text: "Sản phẩm"},
                                                    { value: '1', text: "Nguyên vật liệu"},
                                                    { value: '2', text: "Công cụ dụng cụ"},
                                                    { value: '3', text: "Tài sản"},
                                                ]}
                                                onChange={this.handleGoodChange}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                    <div className={`form-group`}>
                                        <label className="control-label">{translate('manage_warehouse.bin_location_management.contained')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.contained')} onChange={this.handleMaxQuantityChange} />
                                        </div>
                                    </div>
                                    <div className={`form-group`}>
                                        <label className="control-label">{translate('manage_warehouse.bin_location_management.max_quantity')}</label>
                                        <div>
                                            <input type="number" className="form-control" placeholder={translate('manage_warehouse.good_management.max_quantity')} onChange={this.handleMaxQuantityChange} />
                                        </div>
                                    </div>

                                    <div className="pull-right" style={{marginBottom: "10px"}}>
                                        {this.state.editInfo ?
                                            <React.Fragment>
                                                <button className="btn btn-success" onClick={this.handleCancelEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                                                <button className="btn btn-success" onClick={this.handleSaveEditGood} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                                            </React.Fragment>:
                                            <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={this.handleAddGood}>{translate('task_template.add')}</button>
                                        }
                                        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>{translate('task_template.delete')}</button>
                                    </div>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.bin_location_management.good')}>{translate('manage_warehouse.bin_location_management.good')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.type')}>{translate('manage_warehouse.bin_location_management.type')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.contained')}>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>{translate('manage_warehouse.bin_location_management.max_quantity')}</th>
                                                <th>{translate('task_template.action')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-manage-by-stock`}>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>30</td>
                                                        <td>80</td>
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood()}><i className="material-icons"></i></a>
                                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood()}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>30</td>
                                                        <td>80</td>
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood()}><i className="material-icons"></i></a>
                                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood()}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>30</td>
                                                        <td>80</td>
                                                        <td>
                                                            <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => this.handleEditGood()}><i className="material-icons"></i></a>
                                                            <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => this.handleDeleteGood()}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-bin-location`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div>
        )
    }
}


export default connect(null, null)(withTranslate(BinEditForm));