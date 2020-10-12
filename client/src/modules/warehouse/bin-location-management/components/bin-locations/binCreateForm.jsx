import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, ButtonModal } from '../../../../../common-components';

class BinCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { translate } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-create-bin-location`}
                    formID={`form-create-bin-location`}
                    title={translate('manage_warehouse.stock_management.add_title')}
                    msg_success={translate('manage_warehouse.stock_management.add_success')}
                    msg_faile={translate('manage_warehouse.stock_management.add_faile')}
                    size={75}
                >
                    <form id={`form-create-bin-location`} >
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.code')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleCodeChange}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.status')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleAddressChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.department')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-status-of-stock-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
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
                                    <input type="text" className="form-control" onChange={this.handleAddressChange} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.name')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleNameChange} />
                                </div>
                                <div className="form-group">
                                    <label>{translate('manage_warehouse.bin_location_management.capacity')}<span className="attention"> * </span></label>
                                    <input type="text" className="form-control" onChange={this.handleNameChange} />
                                </div>
                                <div className={`form-group`}>
                                    <label>{translate('manage_warehouse.bin_location_management.management_location')}<span className="attention"> * </span></label>
                                    <SelectBox
                                        id={`select-management-location-stock-create`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value=""
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
                                        id={`select-management-location-stock-bin-create`}
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
                                            id={`select-good-by-bin-create`}
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
                                                id={`select-type-by-bin-create`}
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
                                        <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}
export default connect(null, null)(withTranslate(BinCreateForm));