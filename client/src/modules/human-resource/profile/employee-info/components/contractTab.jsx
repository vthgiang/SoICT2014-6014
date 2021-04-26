import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CourseActions } from '../../../../training/course/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';

function ContractTab(props) {
    const [state, setState] = useState({

    })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
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
        return date;
    }

    useEffect(() => {
        if (state.roles && state.organizationalUnits) {
            props.getListCourse({ organizationalUnits: state.organizationalUnits, positions: state.roles });
        }
    }, [props.id])

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                contracts: props.contracts,
                courses: props.courses,
                contractType: props.employee ? props.employee.contractType : "",
                contractEndDate: props.employee ? props.employee.contractEndDate : "",
            }
        })
    }, [props.id])

    const { translate, course } = props;

    const { id, contracts, courses, contractType, contractEndDate } = state;


    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.labor_contract')}</h4></legend>
                    <div className="row">
                        {/* Ngày hết hạn hợp đồng*/}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.contract_end_date')}&emsp; </strong>
                            {formatDate(contractEndDate)}
                        </div>
                        {/* Loại hợp đồng*/}
                        <div className="form-group col-md-4">
                            <strong>{translate('human_resource.profile.type_contract')}&emsp; </strong>
                            {contractType}
                        </div>
                    </div>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                        <thead>
                            <tr>
                                <th >{translate('human_resource.profile.name_contract')}</th>
                                <th >{translate('human_resource.profile.type_contract')}</th>
                                <th >{translate('human_resource.profile.start_date')}</th>
                                <th >{translate('human_resource.profile.end_date_certificate')}</th>
                                <th >{translate('human_resource.profile.attached_files')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts && contracts.length !== 0 &&
                                contracts.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.name}</td>
                                        <td>{x.contractType}</td>
                                        <td>{formatDate(x.startDate)}</td>
                                        <td>{formatDate(x.endDate)}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {
                        (!contracts || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.training_process')}</h4></legend>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>Mã khoá đào tạo</th>
                                <th>{translate('human_resource.profile.course_name')}</th>
                                <th>{translate('human_resource.profile.start_day')}</th>
                                <th>{translate('human_resource.profile.end_date')}</th>
                                <th>Địa điểm đào tạo</th>
                                <th>Kết quả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses && courses.length !== 0 &&
                                courses.map((x, index) => {
                                    let courseInfo;
                                    course.listCourses.forEach(list => {
                                        if (list._id === x.course) {
                                            courseInfo = list
                                        }
                                    });
                                    if (courseInfo) {
                                        return (
                                            <tr key={index}>
                                                <td>{courseInfo.courseId}</td>
                                                <td>{courseInfo.name}</td>
                                                <td>{formatDate(courseInfo.startDate)}</td>
                                                <td>{formatDate(courseInfo.endDate)}</td>
                                                <td>{courseInfo.coursePlace}</td>
                                                <td>{translate(`training.course.result.${x.result}`)}</td>
                                            </tr>
                                        )
                                    } else {
                                        return null
                                    }

                                })
                            }
                        </tbody>
                    </table>
                    {
                        (!courses || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
            </div>
        </div>
    );
};

function mapState(state) {
    const { course } = state;
    return { course };
};

const actionCreators = {
    getListCourse: CourseActions.getListCourse,
    downloadFile: AuthActions.downloadFile,
};

const tabContract = connect(mapState, actionCreators)(withTranslate(ContractTab));
export { tabContract as ContractTab };