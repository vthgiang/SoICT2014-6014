import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { connect } from 'react-redux';
import { DatePicker, SelectBox } from '../../../../../../common-components';
import sampleData from '../../../sampleData';


class PlanInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { translate } = this.props;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.manufacturing_order_code')}</label>
                            <SelectBox
                                id="selectDSX"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "0", text: "None" },
                                    { value: "1", text: "DSX001" },
                                    { value: "2", text: "DSX002" },
                                    { value: "3", text: "DSX003" },
                                ]}
                                onChange={this.handleChangeValue}
                                value={this.state.value}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.sales_order_code')}</label>
                            <SelectBox
                                id="selectDKD"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "0", text: "None" },
                                    { value: "1", text: "DKD001" },
                                    { value: "2", text: "DKD002" },
                                    { value: "3", text: "DSKD03" },
                                ]}
                                onChange={this.handleChangeValue}
                                value={this.state.value}
                                multiple={false}
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.start_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.end_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after_1`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.approvers')}</label>
                            <SelectBox
                                id="selectNPD"
                                className="form-control select"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "0", text: "Nguoi 1" },
                                    { value: "1", text: "Nguoi 2" },
                                    { value: "2", text: "Nguoi 3" },
                                    { value: "3", text: "Nguoi 4" },
                                ]}
                                onChange={this.handleChangeValue}
                                value={this.state.value}
                                multiple={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                            <label>{translate('manufacturing.plan.description')}</label>
                            <textarea type="text" className="form-control"></textarea>
                        </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        {
                            this.state.value === "0"
                                ?
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Thêm mặt hàng sản xuất</legend>
                                    {
                                        <React.Fragment>
                                            <div className="form-group">
                                                <label>Thêm: <a style={{ cursor: "pointer" }} title='Thêm thông tin mặt hàng'><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                                    onClick={() => this.handleAddProduct()} /></a></label>
                                                <div className={`form-group`}>

                                                    <table className="table table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>STT</th>
                                                                <th>Mã mặt hàng</th>
                                                                <th>Tên mặt hàng</th>
                                                                <th>Đợn vị tính</th>
                                                                <th>Quy tắc đóng gói</th>
                                                                <th>Mô tả</th>
                                                                <th>Số lượng sản xuất</th>
                                                                <td>Hành động</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                (!products || products.length === 0)
                                                                    ?
                                                                    <tr>
                                                                        <td colSpan={8}>
                                                                            <center>Chưa thêm mặt hàng</center>
                                                                        </td>
                                                                    </tr>
                                                                    :
                                                                    products.map((product, index) => {
                                                                        return <tr key={index}>

                                                                            <td>{index + 1}</td>
                                                                            <td>
                                                                                <SelectBox
                                                                                    id={`select-product-${index}`}
                                                                                    className="form-control select2"
                                                                                    style={{ width: "100%" }}
                                                                                    value={status}
                                                                                    items={[
                                                                                        { value: index, text: "TB0001" },
                                                                                        { value: index + 1, text: "CD0002" },
                                                                                        { value: index + 2, text: "W3Q001" },
                                                                                        { value: index + 3, text: "TIF112" },
                                                                                    ]}
                                                                                    onChange={this.handleChangeStatus}
                                                                                    multiple={false}
                                                                                />
                                                                            </td>
                                                                            <td>Tiffy</td>
                                                                            <td>
                                                                                kg
                                                                         </td>
                                                                            <td>
                                                                                1hộpx10góix1kg
                                                                         </td>
                                                                            <td>Loại thuốc tốt cho sức khỏe</td>
                                                                            <td>
                                                                                <input className="form-control" type="number" placeholder="" name="quantityProduct" style={{ width: "100%" }} />
                                                                            </td>
                                                                            <td style={{ textAlign: "center" }}>
                                                                                <a className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                                                                            </td>
                                                                        </tr>
                                                                    })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </fieldset>
                                :
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Thông tin đơn sản xuất</legend>
                                    <table id="manufacturing-order-plan-table-1" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Mã mặt hàng</th>
                                                <th>Tên mặt hàng</th>
                                                <th>Đơn vị tính</th>
                                                <th>Quy tắc đóng gói</th>
                                                <th>Số lượng</th>
                                                <th>Số lượng đã lập kế hoạch</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(goods && goods.length !== 0) &&
                                                goods.map((good, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{good.good.code}</td>
                                                        <td>{good.good.name}</td>
                                                        <td>{good.good.baseUnit}</td>
                                                        <td>{good.good.packingRule}</td>
                                                        <td>{good.quantity}</td>
                                                        <td>{good.planedQuantity}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </fieldset>
                        }

                    </div>
                </div> */}
            </React.Fragment >
        );
    }
}


export default connect(null, null)(withTranslate(PlanInfoForm));