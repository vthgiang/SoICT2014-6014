import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDetailCourse } from './ModalDetailCourse';
import { ModalEditCourse } from './ModalEditCourse';
import { ModalAddCourse } from './ModalAddCourse';
import { CourseActions } from '../redux/actions';
import { ActionColumn } from '../../../../common-components/src/ActionColumn';
import { PaginateBar } from '../../../../common-components/src/PaginateBar';
import { DeleteNotification } from '../../../../common-components';

class ListCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            limit: 5,
        };
        this.setLimit = this.setLimit.bind(this);

    }
    componentDidMount() {
        this.props.getListCourse(this.state);
    }

    setLimit = async (number) => {
        await this.setState({ limit: parseInt(number) });
        this.props.getListCourse(this.state);
        window.$(`#setting-table`).collapse("hide");
    }

    render() {
        var lists = this.props.course.listCourse;
        const { translate } = this.props;
        console.log(lists);
        return (
            <React.Fragment>
                <div className="row">
                    <div className="box box-info">
                        <div className="box-body">
                            <div className="col-md-12">
                                <div className="box-header col-md-12" style={{ paddingLeft: 0 }}>
                                    <h3 className="box-title">Danh sách chương trình đào tạo bắt buộc:</h3>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <label style={{ paddingTop: 5 }}>Đơn vị:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-control">
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
                                        <label style={{ paddingTop: 5 }}>Chức vụ:</label>
                                    </div>
                                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <select className="form-control">
                                            <option>--Tất cả--</option>
                                            <option>Trưởng phòng</option>
                                            <option>Phó trưởng phòng</option>
                                            <option>Nhân viên</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                                        <button type="submit" className="btn btn-success" title="Tìm kiếm" >Tìm kiếm</button>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ paddingRight: 0 }}>
                                    <button type="submit" style={{ marginBottom: 15 }} className="btn btn-success pull-right" data-toggle="modal" data-target="#modal-addCourse">Thêm chương trình đào tạo</button>
                                </div>
                                <table className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tên chương trình đào tạo</th>
                                            <th>Mã chương trình</th>
                                            <th>Áp dụng cho đơn vị</th>
                                            <th>Áp dụng cho chức vụ</th>
                                            <th style={{ width: '120px', textAlign: 'center' }}>
                                                <ActionColumn
                                                    columnName="Hành động"
                                                    hideColumn={false}
                                                    setLimit={this.setLimit}
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof lists === 'undefined' || lists.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                            lists.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{x.nameEducation}</td>
                                                    <td>{x.numberEducation}</td>
                                                    <td>{(typeof x.unitEducation === 'undefined' || x.unitEducation.length === 0) ? "" :
                                                        x.unitEducation.map(y => y + ", ")}
                                                    </td>
                                                    <td>{(typeof x.positionEducation === 'undefined' || x.positionEducation.length === 0) ? "" :
                                                        x.positionEducation.map(y => y + ", ")}
                                                    </td>
                                                    <td>
                                                        <ModalDetailCourse data={x} />
                                                        <ModalEditCourse data={x} />
                                                        <DeleteNotification
                                                            content={{
                                                                title: "Xoá chương trình đào tạo",
                                                                btnNo: translate('confirm.no'),
                                                                btnYes: translate('confirm.yes'),
                                                            }}
                                                            data={{
                                                                id: x.numberEducation,
                                                                info: x.nameEducation + " - " + x.numberEducation
                                                            }}
                                                            func={this.props.deleteCourse}
                                                        />
                                                    </td>
                                                </tr>))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {/* /.box-body */}

                        </div>
                    </div>
                    {/* /.col */}
                </div>
                <ModalAddCourse />
            </React.Fragment >
        );
    };
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    deleteCourse: CourseActions.deleteCourse,
};

const connectedListCourse = connect(mapState, actionCreators)(withTranslate(ListCourse));
export { connectedListCourse as ListCourse };