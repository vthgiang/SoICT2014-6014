import React, { Component } from 'react';
import { DatePicker, DialogModal, SelectBox, ButtonModal } from '../../../../../common-components'

class SalesOrderCreateForm extends Component {
    constructor(props) {
        super(props);

        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;

        if (day.length < 2)
            day = '0' + day;

        this.INFO_SEARCH = {
            incidentDateAfter: year + '-' + (month - 3),
            incidentDateBefore: [year, month].join('-'),
        }

        this.state = {
            description: "",
            stock: "",
            responsible: "",
            goods: [],
            returnRule: "",
            serviceLevelAgreement: "",
            partner: "",
            type: "quotation",
            returnRuleOfGood: "",
            serviceLevelAgreementOfGood: "",
            nameOfGood: "", 
            baseUnitOfGood: "",
            priceOfGood: null,
            quantityOfGood: null,
            incidentDateAfter: this.INFO_SEARCH.incidentDateAfter,
            incidentDateBefore: this.INFO_SEARCH.incidentDateBefore,
        }
    }

    handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateAfter = month;
    }

    handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        this.INFO_SEARCH.incidentDateBefore = month;
    }

    handleTypeChange = (value) => {

        this.setState({
            ...this.state,
            type: value[0]
        })
    }
    
    isGoodsValidated = () => {

    }

    render() {
        let {description, stock, responsible, goods, returnRule, serviceLevelAgreement, partner,
            returnRuleOfGood, serviceLevelAgreementOfGood, nameOfGood, baseUnitOfGood, priceOfGood, quantityOfGood, year } = this.state;
            
            let { incidentDateAfter, incidentDateBefore } = this.INFO_SEARCH;

            let dateFormat = year == "true" ? "year" : "month-year";
            let startValue = year == "true" ? incidentDateAfter.slice(0, 4) : incidentDateAfter.slice(5, 7) + ' - ' + incidentDateAfter.slice(0, 4);

        return (
            <React.Fragment>
        <ButtonModal modalID={`modal-create-sales-order`} button_name={'Thêm mới đơn hàng'} title={'Thêm mới đơn mua NVL'} />
        <DialogModal
          modalID={`modal-create-sales-order`} isLoading={false}
          formID={`form-create-sales-order`}
          title={'Thêm mới đơn hàng'}
          msg_success={'Thêm mới thành công'}
          msg_faile={'Thêm mới không thành công'}
          // disableSubmit={!this.isFormValidated()}
          func={this.save}
          size='100'
        >
          <form id={`form-create-sales-order`} >
            <div className="row row-equal-height" style={{ marginTop: -25 }}>
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10 }}>
                
              <div className="form-group">
                  <label>Loại đơn hàng<span className="attention"> * </span></label>
                  <SelectBox
                    id={`select-type-sales-order`}
                    className="form-control select2"
                    style={{ width: "100%" }}
                    value={partner}
                    items={[
                      { value: 'quotation', text: 'Đơn báo giá'},
                      { value: 'sales', text: 'Đơn hàng kinh doanh'}
                    ]}
                    onChange={this.handleTypeChange}
                    multiple={false}
                  />
                </div>

                <div className="form-group">
                  <label>Trạng thái<span className="attention"> * </span></label>
                  <SelectBox
                    id={`select-status-sales-order`}
                    className="form-control select2"
                    style={{ width: "100%" }}
                    value={partner}
                    items={[
                      { value: 'Báo giá đến khách hàng', text: 'Báo giá đến khách hàng'},
                      { value: 'Chờ phê duyệt', text: 'Chờ phê duyệt'},
                      { value: 'Đã phê duyệt', text: 'Đã phê duyệt'},
                      { value: 'Đang sản xuất', text: 'Đang sản xuất'},
                      { value: 'Đang giao hàng', text: 'Đang giao hàng'},
                      { value: 'Đã hoàn thành', text: 'Đã hoàn thành'},
                      { value: 'Hủy đơn', text: 'Hủy đơn'},
                    ]}
                    onChange={this.handlePartnerChange}
                    multiple={false}
                  />
                </div>
                
                {
                this.state.type==='sales' ? 
                (<div className="form-group">
                    <label>Ngày giao hàng</label>
                    <DatePicker
                        id="incident_after"
                        dateFormat={dateFormat}
                        value={startValue}
                        onChange={this.handleChangeDateAfter}
                        disabled={false}
                    />
                </div>) :
                (<div className="form-group">
                    <label>Ngày báo giá có hiệu lực</label>
                    <DatePicker
                        id="incident_after"
                        dateFormat={dateFormat}
                        value={startValue}
                        onChange={this.handleChangeDateBefore}
                        disabled={false}
                    />
                </div>)}

                {
                this.state.type==='sales' ? 
                (<div className="form-group">
                    <label>Hạn chót giao hàng</label>
                    <DatePicker
                        id="incident_after"
                        dateFormat={dateFormat}
                        value={startValue}
                        onChange={this.handleChangeDateBefore}
                        disabled={false}
                    />
                </div>) :
                (<div className="form-group">
                    <label>Ngày báo giá hết hiệu lực</label>
                    <DatePicker
                        id="incident_after"
                        dateFormat={dateFormat}
                        value={startValue}
                        onChange={this.handleChangeDateBefore}
                        disabled={false}
                    />
                </div>)}

              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6" style={{ padding: 10 }}>
              <div className="form-group">
                  <label>Khách hàng<span className="attention"> * </span></label>
                  <SelectBox
                    id={`select-customer-sales-order`}
                    className="form-control select2"
                    style={{ width: "100%" }}
                    value={partner}
                    items={[
                      { value: 'Nguyễn Văn A - 0123405045', text: 'Nguyễn Văn A - 0123405045'},
                      { value: 'Nguyễn văn B - 0235456354', text: 'Nguyễn văn B - 0235456354'},
                      { value: 'Nguyễn Văn c - 0123405045', text: 'Nguyễn Văn C - 0123405045'},
                      { value: 'Nguyễn văn D - 0235456356', text: 'Nguyễn văn D - 0235456356'},
                      { value: 'Nguyễn Văn E - 0123405047', text: 'Nguyễn Văn E - 0123405047'},
                      { value: 'Nguyễn văn F - 0235456358', text: 'Nguyễn văn F - 0235456358'},
                    ]}
                    onChange={this.handlePartnerChange}
                    multiple={false}
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại <span className="attention"> </span></label>
                  <input type="number" className="form-control" value={description} onChange={this.handleCodeChange}/>
                </div>
                <div className="form-group">
                  <label>Địa chỉ<span className="attention"> </span></label>
                  <input type="text" className="form-control" value={returnRule} onChange={this.handleCodeChange}/>
                </div>
              </div>

              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border" style={{ padding: 10 }}>
                  <legend className="scheduler-border">Các mặt hàng</legend>
                  <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{ padding: 10 }}>
                    <div className="form-group">
                      <label>Sản phẩm<span className="attention"> * </span></label>
                      <SelectBox
                        id={`select-nameOfGood-material-purchase-order`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={nameOfGood}
                        items={[
                          { value: 'Oxytetracyclin, HCL', text: 'Oxytetracyclin, HCL'},
                          { value: 'Vitamin D3', text: 'Vitamin D3'},
                          { value: 'Vitamin K3', text: 'Vitamin K3'},
                          { value: 'Vitamin B2', text: 'Vitamin B2'},
                          { value: 'L – Lysine', text: 'L – Lysine'},
                          { value: 'DL – Methionin', text: 'DL – Methionin'},
                          { value: 'Vitamin B6', text: 'Vitamin B6'},
                          { value: 'Vitamin A', text: 'Vitamin A'},
                        ]}
                        onChange={this.handleNameOfGoodChange}
                        multiple={false}
                      />
                    </div>
                    <div className="form-group">
                      <label>Đơn vị tính<span className="attention"> * </span></label>
                      <input type="text" className="form-control" placeholder="ví dụ: Hộp" value={baseUnitOfGood} onChange={this.handleBaseUnitOfGoodChange} />
                    </div>
                    <div className="form-group">
                      <label>Giá<span className="attention"> * </span></label>
                      <input type="number" className="form-control" placeholder="Nhập vào một số" value={priceOfGood} onChange={this.handlePriceOfGoodChange} />
                    </div>
                    <div className="form-group">
                      <label>Số lượng<span className="attention"> * </span></label>
                      <input type="number" className="form-control" placeholder="Nhập vào một số" value={quantityOfGood} onChange={this.handleQuantityOfGoodChange} />
                    </div>
                  </div>
                    
                  <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{ padding: 10 }}>
                    <div className="form-group">
                      <label>Quy tắc đổi trả đối với mặt hàng này<span className="attention"> * </span></label>
                      <textarea type="text" className="form-control" value={returnRuleOfGood} onChange={this.handleReturnRuleOfGoodChange}/>
                    </div>
                    <div className="form-group">
                      <label>Cam kết chất lượng đối với mặt hàng này<span className="attention"> </span></label>
                      <textarea type="text" className="form-control" value={serviceLevelAgreementOfGood} onChange={this.handleServiceLevelAgreementOfGoodChange}/>
                    </div>
                    <div className="form-group">
                      <label>Khuyến mãi<span className="attention"> </span></label>
                      <textarea type="text" className="form-control" value={serviceLevelAgreementOfGood} onChange={this.handleServiceLevelAgreementOfGoodChange}/>
                    </div>
                    <div className="form-group">
                      <label>Thuế<span className="attention"> </span></label>
                      <textarea type="text" className="form-control" value={serviceLevelAgreementOfGood} onChange={this.handleServiceLevelAgreementOfGoodChange}/>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className={"pull-right"} style={{ padding: 10 }}>
                      <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!this.isGoodsValidated()} onClick={this.handleAddGood} >Thêm mới</button>
                      <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearGood}>Xóa trắng</button>
                    </div>
                    </div>
                  {/* Hiển thị bảng */}
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th title={'Tên nguyên vật liệu'}>Tên nguyên vật liệu</th>
                        <th title={'Giá (vnđ)'}>Giá (vnđ)</th>
                        <th title={'Số lượng'}>Số lượng</th>
                        <th title={'Đơn vị tính'}>Đơn vị tính</th>
                        <th title={'Quy tắc đổi trả'}>Quy tắc đổi trả</th>
                        <th title={'Cam kết chất lượng'}>Cam kết chất lượng</th>
                        <th title={'Hành động'}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody id={`good-edit-manage-by-stock`}>
                      {
                        (goods.length === 0) ? <tr><td colSpan={6}><center>{'Chưa có thông tin hàng nhập'}</center></td></tr> :
                        goods.map((item, index) =>
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{this.format_curency(item.price)}</td>
                            <td>{this.format_curency(item.quantity)}</td>
                            <td>{item.baseUnit}</td>
                            <td>{item.returnRule}</td>
                            <td>{item.serviceLevelAgreement}</td>
                            <td>
                              <a className="edit text-yellow">
                                <i className="material-icons">edit</i>
                              </a>
                              <a className="edit text-red">
                                <i className="material-icons">delete</i>
                              </a>
                            </td>
                          </tr>
                        )
                      }
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

export default SalesOrderCreateForm;