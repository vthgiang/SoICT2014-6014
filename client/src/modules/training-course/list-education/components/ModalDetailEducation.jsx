import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CourseActions } from '../../training-plan/redux/actions';
class ModalDetailEducation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberCourse: "",
            typeCourse: "All",
            page: 0,
            limit: 5,
        }
    }
    render() {
        var { data } = this.props;
        var { listCourse } = data;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewEducation-${data.numberEducation}`} title="Xem chi tiết chương trình đào tạo" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal modal-full fade" id={`modal-viewEducation-${data.numberEducation}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-size-75">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 style={{textAlign:"center"}} className="modal-title">Chi tiết chương trình đào tạo: {data.nameEducation + "-" + data.numberEducation}</h4>
                            </div>
                            <div className="modal-body" style={{ paddingTop: 0 }}>
                                <div className="col-md-12">
                                    <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                        <h3 className="box-title">Danh sách khoá đào tạo của chương trình đào tạo:</h3>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="fullname" >Mã khoá đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group col-md-4" style={{ paddingLeft: 0 }}>
                                            <label htmlFor="fullname" style={{ paddingTop: 5 }}>Loại đào tạo:</label>
                                        </div>
                                        <div className="form-group col-md-8" style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
                                            <input type="text" className="form-control" name="fullName" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 5 }}>
                                            <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <table id="listexample" className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th title="Mã khoá đào tạo" style={{ width: "14%" }}>Mã khoá đào tạo</th>
                                                <th style={{ width: "20%" }}>Tên khoá đào tạo</th>
                                                <th title="Thời gian bắt đầu">Bắt đầu</th>
                                                <th title="Thời gian kết thúc">Kết thúc</th>
                                                <th title="Địa điểm đào tạo">Địa điểm đào tạo</th>
                                                <th style={{ width: "20%" }}>Đơn vị đào tạo</th>
                                                <th style={{ width: "12%" }}>Loại đào tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (listCourse.length === 0 || listCourse === []) ?<tr><td colSpan={7}><center> Không có dữ liệu</center></td></tr> :
                                                    listCourse.map((x, index) => (
                                                        <tr key={index}>
                                                            <td>{x.numberCourse}</td>
                                                            <td>{x.nameCourse}</td>
                                                            <td>{x.startDate}</td>
                                                            <td>{x.endDate}</td>
                                                            <td>{x.address}</td>
                                                            <td>{x.unitCourse}</td>
                                                            <td>{x.typeCourse}</td>
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    getCourseByEducation: CourseActions.getCourseByEducation,
};

const connectedDetailEducation = connect(mapState, actionCreators)(ModalDetailEducation);
export { connectedDetailEducation as ModalDetailEducation };