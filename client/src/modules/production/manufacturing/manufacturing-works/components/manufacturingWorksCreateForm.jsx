import React, { Component } from 'react';
import { ButtonModal, DialogModal } from '../../../../../common-components';

class ManufacturingWorksCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-works" button_name="Thêm nhà máy" title="Thêm nhà máy" />
                <DialogModal
                    modalID="modal-create-works" isLoading={false}
                    formID="form-create-works"
                    title="Thêm nhà máy sản xuất"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-works">
                        <div className="form-group">
                            <label>Mã nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Tên nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Giám đốc nhà máy<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Quản đốc<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Xưởng sản xuất<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Địa chỉ<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Trạng thái<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <input type="text" className="form-control"></input>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

export default ManufacturingWorksCreateForm;