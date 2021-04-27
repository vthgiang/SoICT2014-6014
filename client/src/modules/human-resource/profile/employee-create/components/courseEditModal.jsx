import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, ButtonModal, SelectBox } from '../../../../../common-components';
import { CourseFormValidator } from '../../../../training/course/components/courseFormValidator';

function CourseEditModal(props) {

    const [state, setState] = useState({

    })

    const { listCourses } = props.course;
    const { translate, id, } = props;
    const { course, result, nameCourse } = state;

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                index: props.index,
                course: props.courseId,
                result: props.result,
                nameCourse: props.nameCourse,
            }
        })
        if (props._id) {
            setState(state => {
                return {
                    ...state,
                    _id: props._id
                }
            })
        }
    }, [props.id])

    // Bắt sự kiện thay đổi kết quả đào tạo
    const handleResultChange = (value) => {
        setState(state => {
            return {
                ...state,
                result: value[0]
            }
        });
    }

    // Bắt sự kiện thay đổi mã khoá đào tạo
    const handleCourseIdChange = (value) => {
        validateCourseId(value[0], true);
        let nameCourse = '';
        props.course.listCourses.forEach(x => {
            if (x._id === value[0]) {
                nameCourse = x.name
            }
        });
        setState(state => {
            return {
                ...state,
                nameCourse: nameCourse
            }
        })
    }

    const validateCourseId = (value, willUpdateState = true) => {
        let msg = CourseFormValidator.validateCourseId(value, props.translate);
        if (willUpdateState) {
            setState(state => {
                return {
                    ...state,
                    errorOnCourseId: msg,
                    course: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        return validateCourseId(state.course, false);
    }

    // Bắt sự kiện submit form
    const save = async () => {
        if (isFormValidated()) {
            props.handleChange(state);
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-edit-course-${id}`} isLoading={false}
                formID={`form-edit-course-${id}`}
                title='Chỉnh sửa khoá đào tạo'
                func={save}
                disableSubmit={false}
                maxWidth={500}
            >
                <form className="form-group" id={`form-edit-course-${id}`}>
                    <div className={`col-sm-12 col-xs-12 form-group`}>
                        <label>Mã khoá đào tạo<span className="text-red">*</span></label>
                        <SelectBox
                            id={`edit_courseID_course${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={course}
                            items={[...listCourses.map((u, i) => { return { value: u._id, text: u.courseId } }), { value: '', text: 'Chọn khoá đào tạo' }]}
                            onChange={handleCourseIdChange}
                            disabled={true}
                        />
                    </div>
                    <div className={`form-group col-sm-12 col-xs-12`}>
                        <label>Tên khoá đào tạo<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={nameCourse} placeholder='Tên khoá đào tạo' disabled />
                    </div>
                    <div className={`form-group col-sm-12 col-xs-12`}>
                        <label>Kết quả<span className="text-red">*</span></label>
                        <SelectBox
                            id={`edit_result_course${id}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={result}
                            items={[{ value: 'pass', text: 'Đạt' }, { value: 'failed', text: 'Không đạt' },]}
                            onChange={handleResultChange}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { course } = state;
    return { course };
};
const editModal = connect(mapState, null)(withTranslate(CourseEditModal));
export { editModal as CourseEditModal };
