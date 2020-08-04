import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../../env';

import { CourseActions } from '../../../../training/course/redux/actions';

class ContractTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
    componentDidMount() {
        this.props.getListCourse();
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contracts: nextProps.contracts,
                courses: nextProps.courses,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate, course } = this.props;
        const { contracts, courses } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.labor_contract')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('manage_employee.name_contract')}</th>
                                    <th >{translate('manage_employee.type_contract')}</th>
                                    <th >{translate('manage_employee.start_date')}</th>
                                    <th >{translate('manage_employee.end_date_certificate')}</th>
                                    <th >{translate('manage_employee.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof contracts !== 'undefined' && contracts.length !== 0) &&
                                    contracts.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.contractType}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{!x.urlFile ? translate('manage_employee.no_files') :
                                                <a className='intable'
                                                    href={LOCAL_SERVER_API + x.urlFile} target="_blank"
                                                    download={x.name}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof contracts === 'undefined' || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.training_process')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Mã khoá đào tạo</th>
                                    <th>{translate('manage_employee.course_name')}</th>
                                    <th>{translate('manage_employee.start_day')}</th>
                                    <th>{translate('manage_employee.end_date')}</th>
                                    <th>Địa điểm đào tạo</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(courses !== 'undefined' && courses.length !== 0) &&
                                    courses.map((x, index) => {
                                        let courseInfo = '';
                                        course.listCourses.forEach(list => {
                                            if (list._id === x.course) {
                                                courseInfo = list
                                            }
                                        });
                                        return (
                                            <tr key={index}>
                                                <td>{courseInfo.courseId}</td>
                                                <td>{courseInfo.name}</td>
                                                <td>{this.formatDate(courseInfo.startDate)}</td>
                                                <td>{this.formatDate(courseInfo.endDate)}</td>
                                                <td>{courseInfo.coursePlace}</td>
                                                <td>{x.result}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            (typeof courses === 'undefined' || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
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
    getListCourse: CourseActions.getListCourse,
};

const tabContract = connect(mapState, actionCreators)(withTranslate(ContractTab));
export { tabContract as ContractTab };