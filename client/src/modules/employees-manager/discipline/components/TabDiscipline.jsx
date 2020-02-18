import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DisciplineActions } from '../redux/actions';
import { ModalAddDiscipline } from './ModalAddDiscipline';
import { ModalEditDiscipline } from './ModalEditDiscipline';
import { ModalDeleteDiscipline } from './ModalDeleteDiscipline';
import '../../employee-manager/components/listemployee.css';
class TabDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: "",
            number: "",
            employeeNumber: "",
            department: "All",
            page: 0,
            limit: 10,
        }
        this.handleResizeColumn();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.props.getListDiscipline(this.state);
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmitSearch(event) {
        this.props.getListDiscipline(this.state);
    }
    render() {
        var listDiscipline = "";
        if (this.props.Discipline.isLoading === false) {
            listDiscipline = this.props.Discipline.listDiscipline;
        }
        return (
            <React.Fragment>
                <div id="kyluat" className="tab-pane">
                    <div className="box-body">
                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                        <div className="col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <div className="col-md-3">
                                <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <label htmlFor="employeeNumber" style={{ paddingTop: 5 }}>Mã NV:</label>
                                </div>
                                <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <input type="text" className="form-control" name="employeeNumber" onChange={this.handleChange} autoComplete="off" />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                    <label htmlFor="number" style={{ marginTop: -5 }}>Số quyết định:</label>
                                </div>
                                <input type="text" style={{ width: "66%" }} className="form-control" onChange={this.handleChange} name="number" placeholder="Số ra quyết định" autoComplete="off" />
                            </div>
                            <div className="col-md-3">
                                <div className="form-group" style={{ paddingLeft: 0 }}>
                                    <button type="submit" className="btn btn-success" onClick={this.handleSubmitSearch} title="Tìm kiếm" >Tìm kiếm</button>
                                </div>
                            </div>
                            <div className="col-md-3" style={{ paddingRight: 0 }}>
                                <div className="form-group pull-right" >
                                    <button type="button" className="btn btn-success" title="Thêm kỷ luật nhân viên" data-toggle="modal" data-target="#modal-addNewDiscipline" >Thêm kỷ luật</button>

                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <table className="table table-striped table-bordered table-resizable" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "10%" }}>Mã nhân viên</th>
                                        <th>Tên nhân viên</th>
                                        <th style={{ width: "13%" }}>Ngày có hiệu lực</th>
                                        <th style={{ width: "13%" }}>Ngày hết hiệu lực</th>
                                        <th>Số quyết định</th>
                                        <th>Đơn vị</th>
                                        <th>Chức vụ</th>
                                        <th style={{ width: "12%" }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof listDiscipline === 'undefined' || listDiscipline.length === 0) ? <tr><td colSpan={8}><center> Không có dữ liệu</center></td></tr> :
                                        listDiscipline.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.employee.employeeNumber}</td>
                                                <td>{x.employee.fullName}</td>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{x.number}</td>
                                                <td>Phòng MARKETING</td>
                                                <td>nhân viên</td>
                                                <td>
                                                    <ModalEditDiscipline data={x} />
                                                    <ModalDeleteDiscipline data={x} />
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ModalAddDiscipline />
            </React.Fragment>
        )
    };
}
function mapState(state) {
    const { Discipline } = state;
    return { Discipline };
};

const actionCreators = {
    getListDiscipline: DisciplineActions.getListDiscipline,
};

const connectedListDiscipline = connect(mapState, actionCreators)(TabDiscipline);
export { connectedListDiscipline as TabDiscipline };