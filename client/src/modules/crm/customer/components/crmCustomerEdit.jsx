import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, DatePicker } from '../../../../common-components';
import { CustomerActions } from '../redux/actions';

class CrmCustomerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            birth: '',
            sale: 'group'
        }
    }

    render() {
        const { translate } = this.props;
        const { customer, customerGroup } = this.props;
        const { id, name, code, phone, email, group, sale} = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-customer" isLoading={customer.isLoading}
                    formID="form-edit-customer"
                    title="Chỉnh sửa thông tin khách hàng"
                    func={this.save}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-edit-customer">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin chung</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Tên khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={name} onChange={this.handleName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã khách hàng<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={code} onChange={this.handleCode} />
                                    </div>
                                    <div className="form-group">
                                        <label>Số điện thoại<span className="attention"> * </span></label>
                                        <input type="text" className="form-control" value={phone} onChange={this.handlePhone} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nhóm khách hàng</label>
                                        <SelectBox
                                            id={`select-customer-group-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                customerGroup.list.map(g => { return { value: g._id, text: g.name} })
                                            }
                                            value={[group]}
                                            onChange={this.handleParents}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" className="form-control" value={email} onChange={this.handleName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày sinh</label>
                                        <DatePicker
                                            id="create-customer-birth"
                                            value={this.state.birth}
                                            onChange={this.handleBirth}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Giới tính</label>
                                        <SelectBox
                                            id={`select-customer-gender-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                {value: 'Nam', text: 'Nam'},
                                                {value: 'Nữ', text: 'Nữ'},
                                                {value: 'Khác', text: 'Khác'},
                                            ]}
                                            onChange={this.handleParents}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã số thuế</label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin liên hệ</legend>
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Địa chỉ</label>
                                        <input type="text" className="form-control" onChange={this.handleName} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <div className="form-group">
                                        <label>Khu vực</label>
                                        <SelectBox
                                            id={`select-customer-location-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[]}
                                            onChange={this.handleParents}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin khác</legend>
                            <div className="form-group">
                                <label>Nhân viên chăm sóc</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Mô tả</label>
                                <input type="text" className="form-control" onChange={this.handleName} />
                            </div>
                            <div className="form-group">
                                <label>Ưu đãi áp dụng</label><br/>
                                <div style={{padding: '10px', backgroundColor: '#F1F1F1', marginBottom: '5px'}}>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-${id}`} value="group" onChange={this.hanldeSaleGroup}
                                                checked={sale === "group" ? true : false} />Theo nhóm khách hàng</span>
                                    </div>
                                    <div className="radio-inline">
                                        <span>
                                            <input type="radio" name={`sale-${id}`} value="customer" onChange={this.hanldeSaleCustomer}
                                                checked={sale !== "group" ? true : false} />Theo khách hàng</span>
                                    </div>
                                </div>
                                <div id="sale-customer-option" style={{display: 'none'}}>
                                    <div className="form-group">
                                        <label>Chiết khấu (%)</label>
                                        <input type="number" className="form-control" onChange={this.handleName} />
                                    </div>
                                    <div className="form-group">
                                        <label>Hình thức thanh toán</label>
                                        <SelectBox
                                            id={`select-customer-sale-${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: 'cod', text: 'COD' },
                                                { value: 'point', text: 'Thanh toán bằng điểm' },
                                                { value: 'ck', text: 'Chuyển khoản' },
                                                { value: 'tm', text: 'Tiền mặt' },
                                                { value: 'qt', text: 'Quẹt thẻ' }
                                            ]}
                                            onChange={this.handleCustomerSale}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
    
    handleBirth = (value) => {
        this.setState({
            ...this.state,
            birth: value
        });
    }

    handleName = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
    }

    handleCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value
        });
    }

    handlePhone = (e) => {
        const { value } = e.target;
        this.setState({
            phone: value
        });
    }

    hanldeSaleGroup = (e) => {
        const {value} = e.target;
        this.setState({
            sale: value
        })
        window.$('#sale-customer-option').hide();
    }

    hanldeSaleCustomer = (e) => {
        const {value} = e.target;
        this.setState({
            sale: value
        })
        window.$('#sale-customer-option').show();
    }

    save = () => {
        return this.props.create({
            name: this.state.name,
            code: this.state.code,
            phone: this.state.phone
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                name: nextProps.name,
                code: nextProps.code,
                email: nextProps.email,
                phone: nextProps.phone,
                group: nextProps.group
            }
        } else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    const { customer, customerGroup } = state;
    return { customer, customerGroup };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerEdit));