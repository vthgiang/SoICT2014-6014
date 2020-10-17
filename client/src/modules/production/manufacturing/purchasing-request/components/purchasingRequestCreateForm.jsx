import React, { Component } from 'react';
import { ButtonModal, DatePicker, DialogModal, SelectBox } from '../../../../../common-components';

class PurchasingRequestCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods: [],
            status: "1"
        };
    }
    handleDeleteGood() {

    }
    handleAddGood = () => {
        this.setState((state) => {
            return {
                ...state,
                goods: [...state.goods, {
                    code: "",
                    name: "",
                    quantity: 0,
                    baseUnit: ""
                }]
            }
        });
    }
    handleChangeStatus = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0]
            }
        })
    }
    render() {
        const { goods, status } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-purchasing-request" button_name="Thêm phiếu" title="Thêm phiếu đề nghị" />
                <DialogModal
                    modalID="modal-create-purchasing-request" isLoading={false}
                    formID="form-create-purchasing-request"
                    title="Thêm phiếu đề nghị mua hàng"
                    // msg_success={translate('manage_plan.add_success')}
                    // msg_faile={translate('manage_plan.add_fail')}
                    // func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-purchasing-request">
                        <div className="form-group">
                            <label>Mã phiếu đề nghị<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Mã kế hoạch<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Mục đích</label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Ngày nhận dự kiến<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Thông tin mặt hàng:
                                <a style={{ cursor: "pointer" }} title='Thêm thông tin mặt hàng'>
                                    <i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                        onClick={this.handleAddGood} />
                                </a>
                            </label>
                            <div className={`form-group`}>
                                {/* Bảng thông tin chi tiết */}
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã mặt hàng</th>
                                            <th>Tên mặt hàng</th>
                                            <th>Đơn vị tính</th>
                                            <th>Số lượng</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (!goods || goods.length === 0) ?
                                                <tr>
                                                    <td colSpan={5}>
                                                        <center>Chưa có dữ liệu</center>
                                                    </td>
                                                </tr>
                                                :
                                                goods.map((good, index) => {
                                                    return <tr key={index}>
                                                        {/* Tên trường dữ liệu */}
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <SelectBox
                                                                id={`select-status-stock`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                value={status}
                                                                items={[
                                                                    { value: '1', text: "penicillin" },
                                                                    { value: '2', text: "Bộ khô" },
                                                                    { value: '3', text: "Nước cất" },
                                                                    { value: '4', text: "Vỏ cây" },
                                                                ]}
                                                                onChange={this.handleChangeStatus}
                                                                multiple={false}
                                                            />
                                                        </td>
                                                        <td><input className="form-control" type="text" value={good.name} name="nameField" style={{ width: "100%" }} /></td>
                                                        <td><input className="form-control" type="text" value={good.baseUnit} name="nameField" style={{ width: "100%" }} /></td>
                                                        <td><input className="form-control" type="text" value={good.quantity} name="nameField" style={{ width: "100%" }} /></td>

                                                        {/* Hành động */}
                                                        <td style={{ textAlign: "center" }}>
                                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteGood(good)}><i className="material-icons"></i></a>
                                                        </td>
                                                    </tr>
                                                })
                                        }
                                    </tbody>
                                </table>
                            </div>
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

export default PurchasingRequestCreateForm;