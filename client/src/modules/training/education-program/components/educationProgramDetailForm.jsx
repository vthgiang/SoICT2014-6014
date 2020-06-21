import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectMulti, PaginateBar, DataTableSetting } from '../../../../common-components';
import { CourseActions } from '../../course/redux/actions';
class EducationProgramDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
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

    setLimit = async (number) => {
        await this.setState({
            limit: parseInt(number),
            search: true
        });
        this.props.getListCourse(this.state);
    }

    setPage = async (pageNumber) => {
        var page = (pageNumber - 1) * (this.state.limit);
        await this.setState({
            page: parseInt(page),
            search: true
        });
        this.props.getListCourse(this.state);
    }

    handleSunmitSearch = async () => {
        await this.setState({
            search: true
        });
        this.props.getListCourse(this.state);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                name: nextProps.name,
                educationProgram: nextProps._id,
                programId: nextProps.programId,
                listCourses: nextProps.listCourses,
                totalList: nextProps.totalList,
                courseId: "",
                type: null,
                page: 0,
                limit: 5,
            }
        } else {
            return null;
        }
    }

    render() {
        const { education, course, translate } = this.props;
        var { name, programId, listCourses, page, limit, totalList, search } = this.state;
        if (search === true) {
            listCourses = course.listCourses;
            totalList = course.totalList
        }

        var pageTotal = (totalList % limit === 0) ?
            parseInt(totalList / limit) :
            parseInt((totalList / limit) + 1);
        var currentPage = parseInt((page / limit) + 1);
        console.log(pageTotal);
        console.log(currentPage);
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-education" isLoading={education.isLoading && course.isLoading}
                    formID="form-view-education"
                    title={`Thông tin chương trình đào tạo: ${name} - ${programId}`}
                    func={this.save}
                    hasSaveButton={false}
                    size={75}
                    maxWidth={900}
                >
                    <form className="form-group" id="form-view-education" >
                        <div className="qlcv">
                            <div className="form-inline" >
                                <div className="form-group">
                                    <label style={{ width: 110 }} className="form-control-static">Mã khoá đào tạo</label>
                                    <input type="text" className="form-control" name="courseId" onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="form-inline" style={{ marginBottom: 10 }}>
                                <div className="form-group">
                                    <label style={{ width: 110 }} className="form-control-static">Loại đào tạo</label>
                                    <SelectMulti id={`multiSelectTypeCourse`} multiple="multiple"
                                        options={{ nonSelectedText: "Chọn loại đào tạo", allSelectedText: "Chọn tất cả loại đào tạo" }}
                                        onChange={this.handleTypeChange}
                                        items={[
                                            { value: "internal", text: "Đào tạo nội bộ" },
                                            { value: "external", text: "Đào tạo ngoài" },
                                        ]}
                                    >
                                    </SelectMulti>
                                    <button type="button" className="btn btn-success" onClick={this.handleSunmitSearch} title="Tìm kiếm" >Tìm kiếm</button>
                                </div>
                            </div>
                        </div>
                        <DataTableSetting
                            tableId="course-table"
                            columnArr={[
                                "Mã khoá đào tạo",
                                "Tên khoá đào tạo",
                                "Bắt đầu",
                                "Kết thúc",
                                "Địa điểm đào tạo",
                                "Đơn vị đào tạo",
                                "Loại đào tạo"
                            ]}
                            limit={limit}
                            setLimit={this.setLimit}
                            hideColumnOption={true}
                        />
                        <table id="course-table" className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th title="Mã khoá đào tạo">Mã khoá đào tạo</th>
                                    <th>Tên khoá đào tạo</th>
                                    <th title="Thời gian bắt đầu">Bắt đầu</th>
                                    <th title="Thời gian kết thúc">Kết thúc</th>
                                    <th title="Địa điểm đào tạo">Địa điểm đào tạo</th>
                                    <th>Đơn vị đào tạo</th>
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
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
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
                        <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
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
    getListCourse: CourseActions.getListCourse,
};

const detailForm = connect(mapState, actionCreators)(withTranslate(EducationProgramDetailForm));
export { detailForm as EducationProgramDetailForm };