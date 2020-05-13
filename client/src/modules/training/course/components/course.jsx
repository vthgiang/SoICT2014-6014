import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CourseCreateForm, CourseDetailForm, CourseEditForm } from './combinedContent';

import { DeleteNotification, PaginateBar, DataTableSetting, SelectMulti } from '../../../../common-components';

import { UserActions } from '../../../super-admin/user/redux/actions';
import { CourseActions } from '../redux/actions';
import { EducationActions } from '../../education-program/redux/actions';
class TrainingPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseId: "",
            type: null,
            page: 0,
            limit: 5,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getListCourse(this.state);
        this.props.getAllEducation();
        this.props.getUser();
    }

    // Function bắt sự kiện chỉnh sửa chương trình đào tạo
    handleEdit = async (value) => {
        await this.setState({
            ...this.state,
            currentEditRow: value
        })
        window.$('#modal-edit-course').modal('show');
    }

    // Function bắt sự kiện xem thông tin chương trình đào tạo
    handleView = async (value) => {
        await this.setState({
            ...this.state,
            currentViewRow: value
        })
        window.$('#modal-view-course').modal('show');
    }

    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            type: value
        })
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleSunmitSearch = () => {
        this.props.getListCourse(this.state);
    }

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number)
        });
        this.props.getListCourse(this.state);
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
        });
        this.props.getListCourse(this.state);
    }

    render() {
        var { listCourses } = this.props.course;
        const { translate, course } = this.props;
        var pageTotal = (this.props.course.totalList % this.state.limit === 0) ?
            parseInt(this.props.course.totalList / this.state.limit) :
            parseInt((this.props.course.totalList / this.state.limit) + 1);
        var page = parseInt((this.state.page / this.state.limit) + 1);
        return (
            <div className="box">
                <div className="box-body qlcv">
                    <CourseCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <h4 className="box-title">Danh sách các khoá đào tạo:</h4>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label style={{ width: 110 }} className="form-control-static">Mã khoá đào tạo</label>
                            <input type="text" className="form-control" name="courseId" onChange={this.handleChange} autoComplete="off" />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label style={{ width: 110 }} className="form-control-static">Loại đào tạo</label>
                            <SelectMulti id={`multiSelectTypeCourse`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại đào tạo", allSelectedText: "Chọn tất cả loại đào tạo" }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "Đào tạo nội bộ", text: "Đào tạo nội bộ" },
                                    { value: "Đào tạo ngoài", text: "Đào tạo ngoài" },
                                ]}
                            >
                            </SelectMulti>
                            <button type="submit" className="btn btn-success" onClick={() => this.handleSunmitSearch()} title="Tìm kiếm" >Tìm kiếm</button>
                        </div>
                    </div>
                    <table id="course-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã khoá đào tạo</th>
                                <th>Tên khoá đào tạo</th>
                                <th>Bắt đầu</th>
                                <th>Kết thúc</th>
                                <th>Địa điểm đào tạo</th>
                                <th>Đơn vị đào tạo</th>
                                <th style={{ width: '120px' }}>Hành động
                                    <DataTableSetting
                                        tableId="course-table"
                                        columnArr={[
                                            "Mã khoá đào tạo",
                                            "Tên khoá đào tạo",
                                            "Bắt đầu",
                                            "Kết thúc",
                                            "Địa điểm đào tạo",
                                            "Đơn vị đào tạo"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (listCourses.length !== 0 && listCourses !== undefined) &&
                                listCourses.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.courseId}</td>
                                        <td>{x.name}</td>
                                        <td>{x.startDate}</td>
                                        <td>{x.endDate}</td>
                                        <td>{x.coursePlace}</td>
                                        <td>{x.offeredBy}</td>
                                        <td>
                                            <a onClick={() => this.handleView(x)} style={{ width: '5px' }} title="Thông tin khoá đào tạo"><i className="material-icons">view_list</i></a>
                                            <a onClick={() => this.handleEdit(x)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa khoá đào tạo"><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content="Xoá khoá đào tạo"
                                                data={{
                                                    id: x._id,
                                                    info: x.name + " - " + x.courseId
                                                }}
                                                func={this.props.deleteCourse}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {course.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof listCourses === 'undefined' || listCourses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={page} func={this.setPage} />
                </div>
                {
                    this.state.currentEditRow !== undefined &&
                    <CourseEditForm
                        _id={this.state.currentEditRow._id}
                        name={this.state.currentEditRow.name}
                        courseId={this.state.currentEditRow.courseId}
                        offeredBy={this.state.currentEditRow.offeredBy}
                        coursePlace={this.state.currentEditRow.coursePlace}
                        startDate={this.state.currentEditRow.startDate}
                        endDate={this.state.currentEditRow.endDate}
                        cost={this.state.currentEditRow.cost}
                        lecturer={this.state.currentEditRow.lecturer}
                        educationProgram={this.state.currentEditRow.educationProgram}
                        employeeCommitmentTime={this.state.currentEditRow.employeeCommitmentTime}
                        type={this.state.currentEditRow.type}
                        unit={this.state.currentEditRow.unit}
                    />
                }
                {
                    this.state.currentViewRow !== undefined &&
                    <CourseDetailForm
                        _id={this.state.currentViewRow._id}
                        name={this.state.currentViewRow.name}
                        courseId={this.state.currentViewRow.courseId}
                        offeredBy={this.state.currentViewRow.offeredBy}
                        coursePlace={this.state.currentViewRow.coursePlace}
                        startDate={this.state.currentViewRow.startDate}
                        endDate={this.state.currentViewRow.endDate}
                        cost={this.state.currentViewRow.cost}
                        lecturer={this.state.currentViewRow.lecturer}
                        educationProgram={this.state.currentViewRow.educationProgram}
                        employeeCommitmentTime={this.state.currentViewRow.employeeCommitmentTime}
                        type={this.state.currentViewRow.type}
                        // listEmployees=""
                        unit="VND"
                    />
                }

            </div>
        );
    };
};

function mapState(state) {
    const { course, education, user } = state;
    return { course, education, user };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    deleteCourse: CourseActions.deleteCourse,
    getAllEducation: EducationActions.getAll,
    getUser: UserActions.get,
};

const connectedListCourse = connect(mapState, actionCreators)(withTranslate(TrainingPlan));
export { connectedListCourse as TrainingPlan };