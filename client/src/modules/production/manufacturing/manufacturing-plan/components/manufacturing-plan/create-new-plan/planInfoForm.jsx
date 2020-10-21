import React, { Component } from 'react';
import { ButtonModal, DatePicker, DialogModal, SelectBox, SelectMulti } from '../../../../../../../common-components';
import sampleData from '../../../../sampleData';


class PlanInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "1",
            products: [],
            estimateClick: false
        };
    }

    handleChangeStatus = (value) => {
        this.setState((state) => {
            return {
                ...state,
                status: value[0]
            }
        })
    }

    handleAddProduct = () => {
        this.setState((state) => {
            return {
                ...state,
                products: [
                    ...state.products,
                    {
                        _id: "4",
                        code: "TIF1222"
                    }
                ]

            }
        });
    }

    handleEstimateClick = (e) => {
        e.preventDefault();
        this.setState((state) => ({
            estimateClick: !state.estimateClick
        }));
    }

    render() {
        const { products, status } = this.state;
        const { manufacturingOrders } = sampleData;
        let manufacturingOrder = manufacturingOrders[0]
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>Mã kế hoạch<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label>Mã đơn sản xuất</label>
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
                                onChange={this.handleChangeViewChart}
                                value={"Không chọn"}
                                multiple={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Người tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control"></input>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>Ngày bắt đầu<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ngày dự kiến hoàn thành<span className="text-red">*</span></label>
                            <DatePicker
                                id={`maintain_after_1`}
                                // dateFormat={dateFormat}
                                // value={startValue}
                                // onChange={this.handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <input type="text" className="form-control"></input>
                        </div>
                    </div>
                </div>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Thêm mặt hàng sản xuất</legend>
                    {
                        <React.Fragment>
                            <div className="form-group">
                                <label>Thêm: <a style={{ cursor: "pointer" }} title='Thêm thông tin mặt hàng'><i className="fa fa-plus-square" style={{ color: "#00a65a", marginLeft: 5 }}
                                    onClick={() => this.handleAddProduct()} /></a></label>
                                <div className={`form-group`}>
                                    {/* Bảng thông tin chi tiết */}
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
                                                            {/* Tên trường dữ liệu */}
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <SelectBox
                                                                    id={`select-product`}
                                                                    className="form-control select2"
                                                                    style={{ width: "100%" }}
                                                                    value={status}
                                                                    items={[
                                                                        { value: '1', text: "TB0001" },
                                                                        { value: '2', text: "CD0002" },
                                                                        { value: '3', text: "W3Q001" },
                                                                        { value: '4', text: "TIF112" },
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
            </React.Fragment>
        );
    }
}

export default PlanInfoForm;