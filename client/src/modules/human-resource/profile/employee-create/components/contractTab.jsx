import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../../env';
import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ContractAddModal, ContractEditModal, CourseAddModal, CourseEditModal } from './combinedContent';

import { CourseActions } from '../../../../training/course/redux/actions';

class ContractTab extends Component {
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
    componentDidMount() {
        this.props.getListCourse({ organizationalUnits: this.state.organizationalUnits, positions: this.state.roles });
    }
    handleCourseEdit = async (value, index) => {
        let courseInfo = '';
        this.props.course.listCourses.forEach(list => {
            if (list._id === value.course) {
                courseInfo = list
            }
        });
        await this.setState(state => {
            return {
                ...state,
                currentCourseRow: { ...value, index: index, courseInfo: courseInfo }
            }
        });
        window.$(`#modal-edit-course-editCourse${index}`).modal('show');
    }
    // Bắt sự kiện click edit bằng cấp
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-contract-editContract${index}`).modal('show');
    }


    // function thêm thông tin hợp đồng lao động
    handleAddContract = async (data) => {
        const { contracts } = this.state;
        await this.setState({
            contracts: [...contracts, {
                ...data
            }]
        })
        this.props.handleAddContract(this.state.contracts, data);
    }
    // function chỉnh sửa thông tin hợp đồng lao động
    handleEditContract = async (data) => {
        const { contracts } = this.state;
        contracts[data.index] = data;
        await this.setState({
            contracts: contracts
        })
        this.props.handleEditContract(this.state.contracts, data);
    }
    // Function xoá hợp đồng lao động
    delete = async (index) => {
        var { contracts } = this.state;
        var data = contracts[index];
        contracts.splice(index, 1);
        await this.setState({
            ...this.state,
            contracts: [...contracts]
        })
        this.props.handleDeleteContract(this.state.contracts, data)
    }


    // function thêm thông tin khoá đào tạo
    handleAddCourse = async (data) => {
        const { courses } = this.state;
        let check = false;
        courses.forEach(x => {
            if (x.course === data.course) {
                check = true;
            }
        })
        console.log(data);
        if (check === false) {
            await this.setState({
                courses: [...courses, {
                    ...data
                }]
            })
            this.props.handleAddCourse(this.state.courses, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={['Khoá đào tạo đã tồn tại']}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }
    // function chỉnh sửa thông tin khoá đào tạo
    handleEditCourse = async (data) => {
        const { courses } = this.state;
        courses[data.index] = data;
        await this.setState({
            courses: courses
        })
        this.props.handleEditCourse(this.state.courses, data);
    }
    // Function xoá thông tin khoá đào tạo
    deleteCourse = async (index) => {
        var { courses } = this.state;
        var data = courses[index];
        courses.splice(index, 1);
        await this.setState({
            ...this.state,
            courses: [...courses]
        })
        this.props.handleDeleteCourse(this.state.courses, data)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            this.props.getListCourse({ organizationalUnits: nextProps.organizationalUnits, positions: nextProps.roles });
        }
        return true
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contracts: nextProps.contracts,
                courses: nextProps.courses,
                pageCreate: nextProps.pageCreate,
                organizationalUnits: nextProps.organizationalUnits,
                roles: nextProps.roles
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate, course, } = this.props;
        const { contracts, courses, pageCreate } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.labor_contract')}</h4></legend>
                        <ContractAddModal handleChange={this.handleAddContract} id={`addContract${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('manage_employee.name_contract')}</th>
                                    <th >{translate('manage_employee.type_contract')}</th>
                                    <th >{translate('manage_employee.start_date')}</th>
                                    <th >{translate('manage_employee.end_date_certificate')}</th>
                                    <th >{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
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
                                            <td>{(typeof x.urlFile === 'undefined' || x.urlFile.length === 0) ? translate('manage_employee.no_files') :
                                                <a className='intable' target={x._id === undefined ? '_self' : '_blank'}
                                                    href={(x._id === undefined) ? x.urlFile : `${LOCAL_SERVER_API + x.urlFile}`}
                                                    download={x.name}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_contract')} ><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof contracts === 'undefined' || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.training_process')}</h4></legend>
                        {pageCreate && <a style={{ marginBottom: '10px', marginTop: '2px' }} className="btn btn-success pull-right" title='Do nhân viên chưa thuộc đơn vị nào' data-toggle="modal" data-backdrop="static" href='' disabled >{translate('modal.create')}</a>}
                        {!pageCreate && <CourseAddModal handleChange={this.handleAddCourse} id={`addCourse${id}`} />}
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Mã khoá đào tạo</th>
                                    <th>{translate('manage_employee.course_name')}</th>
                                    <th>{translate('manage_employee.start_day')}</th>
                                    <th>{translate('manage_employee.end_date')}</th>
                                    <th>Địa điểm đào tạo</th>
                                    <th>Kết quả</th>
                                    <th>{translate('table.action')}</th>
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
                                                <td >
                                                    <a onClick={() => this.handleCourseEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title='Chỉnh sửa thông tin khoá đào tạo' ><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteCourse(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        {
                            (typeof courses === 'undefined' || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ContractEditModal
                        id={`editContract${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        name={this.state.currentRow.name}
                        contractType={this.state.currentRow.contractType}
                        startDate={this.formatDate(this.state.currentRow.startDate)}
                        endDate={this.formatDate(this.state.currentRow.endDate)}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditContract}
                    />
                }
                {
                    this.state.currentCourseRow !== undefined &&
                    <CourseEditModal
                        id={`editCourse${this.state.currentCourseRow.index}`}
                        _id={this.state.currentCourseRow._id}
                        index={this.state.currentCourseRow.index}
                        courseId={this.state.currentCourseRow.course}
                        result={this.state.currentCourseRow.result}
                        nameCourse={this.state.currentCourseRow.courseInfo.name}
                        handleChange={this.handleEditCourse}
                    />
                }
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

const contractTab = connect(mapState, actionCreators)(withTranslate(ContractTab));
export { contractTab as ContractTab };