import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, Errorstrong, ButtonModal } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';

class ArchiveDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.stockId !== prevState.stockId || nextProps.code !== prevState.code || nextProps.name !== prevState.name ||
    //         nextProps.status !== prevState.status || nextProps.address !== prevState.address || nextProps.goods !== prevState.goods ||
    //         nextProps.managementLocation !== prevState.managementLocation || nextProps.manageDepartment !== prevState.manageDepartment || nextProps.description !== prevState.description){
    //         return {
    //             ...prevState,
    //             stockId: nextProps.stockId,
    //             code: nextProps.code,
    //             name: nextProps.name,
    //             status: nextProps.status,
    //             address: nextProps.address,
    //             goods: nextProps.goodsManagement,
    //             managementLocation: nextProps.managementLocation,
    //             manageDepartment: nextProps.manageDepartment,
    //             description: nextProps.description,
    //         }
    //     }
    //     else {
    //         return null;
    //     }
    // }
    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-archive-bin`}
                    formID={`form-detail-archive-bin`}
                    title={translate('manage_warehouse.bin_location_management.add_title')}
                    msg_success={translate('manage_warehouse.bin_location_management.add_success')}
                    msg_faile={translate('manage_warehouse.bin_location_management.add_faile')}
                    size={75}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-archive-bin`} >
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.code')}:&emsp;</strong>
                                    ST001-B1-T1-P101
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.status')}:&emsp;</strong>
                                    Đã đầy
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.department')}:&emsp;</strong>
                                    Phòng kế hoạch
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.capacity')}:&emsp;</strong>
                                    3 khối
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.contained')}:&emsp;</strong>
                                    3 khối
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.management_location')}:&emsp;</strong>
                                    Nguyễn Văn Thắng
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.bin_location_management.description')}:&emsp;</strong>
                                    Khu lưu trữ nguyên vật liệu dùng cho sản xuất
                                </div>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_warehouse.bin_location_management.enable_good')}</legend>

                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th title={translate('manage_warehouse.bin_location_management.good')}>{translate('manage_warehouse.bin_location_management.good')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.type')}>{translate('manage_warehouse.bin_location_management.type')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.contained')}>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                                <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>{translate('manage_warehouse.bin_location_management.max_quantity')}</th>
                                            </tr>
                                        </thead>
                                        <tbody id={`good-edit-manage-by-archive`}>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>10 thùng</td>
                                                        <td>50 thùng</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Propylen Glycon</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>30 kg</td>
                                                        <td>80 kg</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>0</td>
                                                        <td>50 thùng</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Propylen Glycon</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>30 kg</td>
                                                        <td>80 kg</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Jucca Nước</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>0</td>
                                                        <td>50 thùng</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Propylen Glycon</td>
                                                        <td>Nguyên vật liệu</td>
                                                        <td>0</td>
                                                        <td>80 kg</td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(ArchiveDetailForm));