import React, { Component } from 'react';
import './timekeeping.css';
import { ModalImportTimekeeping } from './ModalImportTimekeeping';

class Timekeeping extends Component {
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-info">
                            {/* <div className="box-header with-border">
                                    <h3 class="box-title">Bảng lương nhân viên</h3>
                                    <button type="submit" className="btn btn-success pull-right" id="" title="Thêm mới bảng lương">Thêm bảng lương</button>
                                </div> */}

                            {/* /.box-header */}
                            <div className="box-body">
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Đơn vị:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-group" style={{ height: 32, width: "100%" }}>
                                                <option value="các đơn vị">-- Tất cả --</option>
                                                <optgroup label="MARKETING & NCPT sản phẩm">
                                                    <option value="Phòng MARKETING">Phòng MARKETING</option>
                                                    <option value="Phòng nghiên cứu phát triển sản phẩm">Phòng nghiên cứu phát triển sản phẩm</option>
                                                </optgroup>
                                                <optgroup label="Quản trị nhân sự">
                                                    <option value="Phòng hành chính - quản trị">Phòng hành chính - quản trị</option>
                                                    <option value="Tổ hỗ trợ">Tổ hỗ trợ</option>
                                                </optgroup>
                                                <optgroup label="Tài chính - kế toán">
                                                    <option>Phòng kế toàn doanh nghiệp</option>
                                                    <option>Phòng kế toàn ADMIN</option>
                                                </optgroup>
                                                <optgroup label="Nhà máy sản xuất">
                                                    <option>Phòng công nghệ phát triển sản phẩm</option>
                                                    <option>Văn phòng xưởng</option>
                                                    <option>Phòng đảm bảo chất lượng</option>
                                                    <option>Phòng kiểm tra chất lượng</option>
                                                    <option>Phòng kế hoạch vật tư</option>
                                                    <option>Xưởng thuốc bột GMP</option>
                                                    <option>Xưởng thuốc nước GMP</option>
                                                    <option>Xưởng thực phẩm chức năng</option>
                                                </optgroup>
                                                <option value="Phòng kinh doanh VIAVET">Phòng kinh doanh VIAVET</option>
                                                <option value="Phòng kinh doanh SANFOVET">Phòng kinh doanh SANFOVET</option>
                                                <option value="">Ban kinh doanh dự án</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Chức vụ:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <select className="form-group" defaultValue="1" style={{ height: 32, width: "99%" }}>
                                                <option value="1">--Tất cả--</option>
                                                <option value="2">Nhân viên</option>
                                                <option value="4">Trưởng phòng</option>
                                                <option value="5">Phó phòng</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Mã NV:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="employeeNumber" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Tháng:</label>
                                        </div>
                                        <input type="text" style={{ width: "66%" }} className="form-control" name="month" id="datepicker2" data-date-format="mm-yyyy" />

                                    </div>
                                    <div className="form-group col-md-3" style={{ paddingRight: 0 }}>
                                        <button type="submit" className="btn btn-success" title="Tìm kiếm">Tìm kiếm</button>
                                    </div>
                                    <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <div className="form-group col-md-6" style={{ paddingLeft: 15 }}>
                                            <label>Ký hiệu: &emsp; &emsp; </label><i style={{ color: "#08b30e", fontSize: 19 }} className="glyphicon glyphicon-ok"></i><span> -- Có đi làm </span>
                                            &emsp;&emsp;&emsp;<i style={{ color: "red", fontSize: 19 }} className="glyphicon glyphicon-remove"></i><span> -- Nghỉ làm</span>
                                        </div>
                                        <div className="form-group" style={{ paddingRight: 0 }}>
                                            <button type="button" className="btn btn-primary pull-right dropdown-toggle" data-toggle="dropdown" aria-expanded="true" title="Chấm công nhân viên" >Chấm công</button>
                                            <ul className="dropdown-menu pull-right">
                                                <li><a href="#abc" data-toggle="modal" data-target="#modal-importFileTimekeeping">Import file Excel</a></li>
                                                <li><a href="#abc">Chấm bằng tay</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-md-4" style={{ padding: 0 }}>
                                        <table className="keeping table table-bordered">
                                            <thead>
                                                <tr style={{ height: 42 }}>
                                                    <th >Mã nhân viên</th>
                                                    <th style={{ width: "55%" }}>Tên nhân viên</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ paddingTop: 20 }}>2015053</td>
                                                    <td style={{ paddingTop: 20 }}>Nguyen khanh linh</td>

                                                </tr>
                                                <tr>
                                                    <td style={{ paddingTop: 20 }}>20150698</td>
                                                    <td style={{ paddingTop: 20 }}>Nguyen van hung </td>
                                                </tr>
                                            </tbody>

                                        </table>
                                    </div>
                                    <div className="timekeeping col-md-8" style={{ padding: 0 }}>
                                        <table className="timekeeping table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>1</th>
                                                    <th>2</th>
                                                    <th>3</th>
                                                    <th>4</th>
                                                    <th>5</th>
                                                    <th>6</th>
                                                    <th>7</th>
                                                    <th>8</th>
                                                    <th>9</th>
                                                    <th>10</th>
                                                    <th>11</th>
                                                    <th>12</th>
                                                    <th>13</th>
                                                    <th>14</th>
                                                    <th>15</th>
                                                    <th>16</th>
                                                    <th>17</th>
                                                    <th>18</th>
                                                    <th>19</th>
                                                    <th>20</th>
                                                    <th>21</th>
                                                    <th>22</th>
                                                    <th>23</th>
                                                    <th>24</th>
                                                    <th>25</th>
                                                    <th>26</th>
                                                    <th>27</th>
                                                    <th>28</th>
                                                    <th>29</th>
                                                    <th>30</th>
                                                    <th style={{ width: 45 }}>31</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                </tr>
                                                <tr>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                </tr>

                                                <tr>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                </tr>
                                                <tr>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "red" }} className="glyphicon glyphicon-remove"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                    <td><i style={{ color: "#08b30e" }} className="glyphicon glyphicon-ok"></i></td>
                                                </tr>

                                            </tbody>

                                        </table>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <ModalImportTimekeeping />
            </React.Fragment>
        );
    }
}

export { Timekeeping };