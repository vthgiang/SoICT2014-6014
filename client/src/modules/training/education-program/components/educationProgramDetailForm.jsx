import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectMulti } from '../../../../common-components';
import { CourseActions } from '../../course/redux/actions';
import { PaginateBarModal } from './paginateBarModal';
class EducationProgramDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // setPage = async (pageNumber) => {
    //     var page = (pageNumber - 1) * (this.state.limit);
    //     await this.setState({
    //         page: parseInt(page),
    //     });
    //     this.props.getCourseByEducation(this.state);
    // }

    handleSunmitSearch = () => {
        this.props.getCourseByEducation(this.state);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                name: nextProps.name,
                programId: nextProps.programId,
                listCourses: nextProps.listCourses,
                totalList: nextProps.totalList,
                numberCourse: "",
                typeCourse: "All",
                page: 0,
                limit: 5,
            }
        } else {
            return null;
        }
    }

    render() {
        const { education, course, translate } = this.props;
        const { _id, name, programId, listCourses, page, limit, totalList } = this.state;
        var { courseByEducation } = this.props.course;
        // if (courseByEducation._id !== undefined && courseByEducation._id === data._id) {
        //     listCourse = courseByEducation.allList
        //     totalList = courseByEducation.totalList
        // }
        var pageTotal = (totalList % limit === 0) ?
            parseInt(totalList / limit) :
            parseInt((totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-education" isLoading={education.isLoading}
                    formID="form-view-education"
                    title={`Thông tin chương trình đào tạo: ${name} - ${programId}`}
                    func={this.save}
                    hasSaveButton={false}
                    size={75}
                    maxWidth={850}
                >
                    <form className="form-group" id="form-view-education" >
                        <div className="qlcv">
                            <div className="form-inline">
                                <div className="form-group">
                                    <h4 className="box-title">Danh sách khoá đào tạo của chương trình đào tạo:</h4>
                                </div>
                            </div>
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label style={{ width: 110 }} className="form-control-static">Mã khoá đào tạo</label>
                                    <input type="text" className="form-control" name="numberCourse" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-inline" style={{ marginBottom: 10 }}>
                                <div className="form-group">
                                    <label style={{ width: 110 }} className="form-control-static">Loại đào tạo</label>
                                    <SelectMulti id={`multiSelectTypeCourse`} multiple="multiple"
                                        options={{ nonSelectedText: "Chọn loại đào tạo", allSelectedText: "Chọn tất cả loại đào tạo" }}
                                        onChange={this.handleStatusChange}
                                        items={[
                                            { value: "Đào tạo nội bộ", text: "Đào tạo nội bộ" },
                                            { value: "Đào tạo ngoài", text: "Đào tạo ngoài" },
                                        ]}
                                    >
                                    </SelectMulti>
                                    <button type="button" className="btn btn-success" onClick={this.handleSunmitSearch} title="Tìm kiếm" >Tìm kiếm</button>
                                </div>
                            </div>
                        </div>
                        <table id="course-table" className="table table-striped table-bordered table-hover" style={{ marginBottom:0 }}>
                            <thead>
                                <tr>
                                    <th title="Mã khoá đào tạo" style={{ width: "14%" }}>Mã khoá đào tạo</th>
                                    <th style={{ width: "20%" }}>Tên khoá đào tạo</th>
                                    <th title="Thời gian bắt đầu">Bắt đầu</th>
                                    <th title="Thời gian kết thúc">Kết thúc</th>
                                    <th style={{ width: "15%" }} title="Địa điểm đào tạo">Địa điểm đào tạo</th>
                                    <th style={{ width: "15%" }}>Đơn vị đào tạo</th>
                                    <th style={{ width: "120px" }}>Loại đào tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listCourses.length !== 0 && listCourses !== undefined &&
                                    listCourses.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.courseId}</td>
                                            <td>{x.name}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.coursePlace}</td>
                                            <td>{x.offeredBy}</td>
                                            <td>{x.type}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {(education.isLoading || course.isLoading) ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof listCourses === 'undefined' || listCourses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBarModal pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} _id={_id} />

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { course, education } = state;
    return { course, education };
};

const actionCreators = {
    getCourseByEducation: CourseActions.getCourseByEducation,
};

const detailForm = connect(mapState, actionCreators)(withTranslate(EducationProgramDetailForm));
export { detailForm as EducationProgramDetailForm };