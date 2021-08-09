import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectMulti, PaginateBar, DataTableSetting } from '../../../../../common-components';

import { CourseActions } from '../../../course/user/redux/actions';
const EducationProgramDetailForm = (props) => {
    const [state, setState] = useState({})


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

    if (props._id !== state._id || props.programName !== state.programName) {
        setState({
            ...state,
            _id: props._id,
            programName: props.programName,
            educationProgram: props._id,
            programId: props.programId,
            listCourses: props.listCourses,
            totalList: props.totalList,
            detail: props.detail,
            courseId: "",
            type: null,
            page: 0,
            limit: 5,
        })
    }

    const { education, course, translate, data} = props;

    let { _id, programName, programId, listCourses, page, limit, totalList, search, detail } = state;

    if (search === true) {
        listCourses = course.listCourses;
        totalList = course.totalList
    }

    let pageTotal = (totalList % limit === 0) ?
        parseInt(totalList / limit) :
        parseInt((totalList / limit) + 1);
    let currentPage = parseInt((page / limit) + 1);
    console.log(props)
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-view-education${_id}`} isLoading={education.isLoading && course.isLoading}
                formID={`form-view-education${_id}`}
                title={`${translate('training.education_program.view_education_program')}`}
                hasSaveButton={false}
                size={75}
                maxWidth={900}
                hasNote={false}
            >
                <form className="form-group" id={`form-view-education${_id}`} >
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
                    <div>{translate('training.education_program.education_program_name')}: {programName}</div>
                    <div>{translate('training.education_program.education_program_code')}: {programId}</div>
                    <div>{translate('training.education_program.detail')}: {detail}</div>
                    <div>{translate('training.education_program.table.total_courses')}: {data.totalList}</div>
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