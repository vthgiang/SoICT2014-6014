import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectMulti, PaginateBar, DataTableSetting } from '../../../../../common-components';

import { CourseActions } from '../../../course/user/redux/actions';
const EducationProgramDetailForm = (props) => {
    const [state, setState] = useState({})

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        let d = new Date(date),
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

    /** Bắt sự kiện thay đổi mã chương trình đào tạo để tìm kiếm */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    }

    /**
     * Bắt sự kiện thay đổi loại đào tạo để tìm kiếm
     * @param {*} value : loại khoá đào tạo
     */
    const handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        setState({
            ...state,
            type: value
        })
    }

    /**
     * Function bắt sự kiện thay đổi số dòng hiện thị trên 1 trang
     * @param {*} number 
     */
    const setLimit = async (number) => {
        await setState({
            ...state,
            limit: parseInt(number),
            search: true
        });
        props.getListCourse(state);
    }

    /**
     * Function bắt sự kiện thay đổi số trang muốn xem
     * @param {*} pageNumber 
     */
    const setPage = async (pageNumber) => {
        let page = (pageNumber - 1) * (state.limit);
        await setState({
            ...state,
            page: parseInt(page),
            search: true
        });
        props.getListCourse(state);
    }

    /** Bắt sự kiện tìm kiếm */
    const handleSunmitSearch = async () => {
        console.log(state)
        await setState({
            ...state,
            search: true
        });
        props.getListCourse(state);
    }

    if (props._id !== state._id || props.programName !== state.programName) {
        setState({
            ...state,
            _id: props._id,
            programName: props.programName,
            educationProgram: props._id,
            programId: props.programId,
            listCourses: props.listCourses,
            totalList: props.totalList,
            courseId: "",
            type: null,
            page: 0,
            limit: 5,
        })
    }

    const { education, course, translate } = props;

    let { _id, programName, programId, listCourses, page, limit, totalList, search } = state;

    if (search === true) {
        listCourses = course.listCourses;
        totalList = course.totalList
    }

    let pageTotal = (totalList % limit === 0) ?
        parseInt(totalList / limit) :
        parseInt((totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-view-education${_id}`} isLoading={education.isLoading && course.isLoading}
                formID={`form-view-education${_id}`}
                title={`${translate('training.education_program.view_education_program')}: ${programName} - ${programId}`}
                hasSaveButton={false}
                size={75}
                maxWidth={900}
                hasNote={false}
            >
                <form className="form-group" id={`form-view-education${_id}`} >
                    <div className="qlcv">
                        {/* Mã khoá đào tạo */}
                        <div className="form-inline" >
                            <div className="form-group">
                                <label style={{ width: 110 }} className="form-control-static">{translate('training.course.table.course_code')}</label>
                                <input type="text" className="form-control" name="courseId" onChange={handleChange} />
                            </div>
                        </div>
                        {/* Loại đào tạo */}
                        <div className="form-inline" style={{ marginBottom: 10 }}>
                            <div className="form-group">
                                <label style={{ width: 110 }} className="form-control-static">{translate('training.course.table.course_type')}</label>
                                <SelectMulti id={`multiSelectTypeCourse`} multiple="multiple"
                                    options={{ nonSelectedText: translate('training.course.no_course_type'), allSelectedText: translate('training.course.all_course_type') }}
                                    onChange={handleTypeChange}
                                    items={[
                                        { value: "internal", text: translate('training.course.type.internal') },
                                        { value: "external", text: translate('training.course.type.external') },
                                    ]}
                                >
                                </SelectMulti>
                                <button type="button" className="btn btn-success" onClick={handleSunmitSearch}>{translate('general.search')}</button>
                            </div>
                        </div>
                    </div>
                    <DataTableSetting
                        tableId="course-table"
                        columnArr={[
                            translate('training.course.table.course_code'),
                            translate('training.course.table.course_name'),
                            translate('training.course.table.start_date'),
                            translate('training.course.table.end_date'),
                            translate('training.course.table.course_place'),
                            translate('training.course.table.offered_by'),
                            translate('training.course.table.course_type')
                        ]}
                        limit={limit}
                        setLimit={setLimit}
                        hideColumnOption={true}
                    />
                    <table id="course-table" className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>{translate('training.course.table.course_code')}</th>
                                <th>{translate('training.course.table.course_name')}</th>
                                <th title={translate('training.course.start_date')}>{translate('training.course.table.start_date')}</th>
                                <th title={translate('training.course.end_date')}>{translate('training.course.table.end_date')}</th>
                                <th title="Địa điểm đào tạo">{translate('training.course.table.course_place')}</th>
                                <th>{translate('training.course.table.offered_by')}</th>
                                <th style={{ width: "120px" }}>{translate('training.course.table.course_type')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listCourses && listCourses.length !== 0 &&
                                listCourses.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.courseId}</td>
                                        <td>{x.programName}</td>
                                        <td>{formatDate(x.startDate)}</td>
                                        <td>{formatDate(x.endDate)}</td>
                                        <td>{x.coursePlace}</td>
                                        <td>{x.offeredBy}</td>
                                        <td>{translate(`training.course.type.${x.type}`)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {(education.isLoading || course.isLoading) ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listCourses || listCourses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar id="detail-program" pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={setPage} />
                </form>
            </DialogModal>
        </React.Fragment>
    );
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