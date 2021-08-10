import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { DatePicker } from '../../../../../common-components';

import { ContractAddModal, ContractEditModal, CourseAddModal, CourseEditModal } from './combinedContent';

import { CourseActions } from '../../../../training/course/redux/actions';
import { AuthActions } from '../../../../auth/redux/actions';

function ContractTab(props) {

    const [state, setState] = useState({
        page: 0,
        limit: 100
    });

    const { translate, course } = props;
    const { id } = props;

    const { contracts, contractEndDate, contractType, courses, pageCreate, roles, currentRow, currentCourseRow } = state;

    /**
     *  Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
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

    };

    const getCurrentContract = (contracts) => {
        if (contracts && contracts.length !== 0) {
            let contract = contracts[0]
            contracts.forEach(x => {
                if (new Date(contract.startDate).getTime() < new Date(x.startDate).getTime()) {
                    contract = x
                }
            })
            return contract;
        }
        else return {};
    }

    useEffect(() => {
        const { page, limit } = state;

        if (props.organizationalUnits && props.roles) {
            props.getListCourse({ organizationalUnits: props.organizationalUnits, positions: props.roles, page, limit });
        }
    }, [props.id])

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                contracts: props.employee?.contracts ? props.employee.contracts : [],
                contractEndDate: props.employee?.contractEndDate ? props.employee.contractEndDate : '',
                contractType: props.employee?.contractType ? props.employee.contractType : '',
                courses: props.courses,
                pageCreate: props.pageCreate,
                organizationalUnits: props.organizationalUnits,
                roles: props.roles
            }
        })
    }, [props.id, props.employee?.contracts, props.courses])

    useEffect(() => {
        if (state.contracts && state.contracts?.length !== 0) {
            let contract = getCurrentContract(state.contracts);
            setState(state => {
                return {
                    ...state,
                    contractEndDate: contract?.endDate ? contract.endDate : "",
                    contractType: contract?.contractType ? contract.contractType : "",
                }
            });
            props.handleChange('contractEndDate', contract?.endDate ? contract.endDate : "");
            props.handleChange('contractType', contract?.contractType ? contract.contractType : "");
        };
    }, [contracts])

    // console.log(contractEndDate);

    /**
     * Bắt sự kiện click edit khoá học
     * @param {*} value : Dữ liệu khoá học
     * @param {*} index : Số thứ tự khoá học muốn chỉnh sửa
     */
    const handleCourseEdit = async (value, index) => {
        let courseInfo = '';
        props.course.listCourses.forEach(list => {
            if (list._id === value.course) {
                courseInfo = list
            }
        });
        await setState(state => {
            return {
                ...state,
                currentCourseRow: { ...value, index: index, courseInfo: courseInfo }
            }
        });
        window.$(`#modal-edit-course-editCourse${index}`).modal('show');
    }

    /**
     * Bắt sự kiện click edit hợp đồng
     * @param {*} value : Dữ liệu hợp đồng
     * @param {*} index : Số thứ tự hợp đồng muốn chỉnh sửa
     */
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-contract-editContract${index}`).modal('show');
    }

    /**
     * Function kiểm tra trùng lặp thời gian hợp đồng lao động
     * @param {*} data
     * @param {*} array
     */
    const checkForDuplicate = (data, array) => {
        let checkData = true;
        if (data.startDate && data.endDate) {
            let startDate = new Date(data.startDate);
            let endDate = new Date(data.endDate);
            for (let n in array) {
                let date1 = new Date(array[n].startDate);
                let date2 = new Date(array[n].endDate);
                if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
                    (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
                    checkData = false;
                    break;
                }
            }
        }
        return checkData
    }

    /**
     * Function thêm thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng muốn thêm
     */
    const handleAddContract = async (data) => {
        const { translate } = props;
        let { contracts } = state;

        let checkData = checkForDuplicate(data, contracts);
        if (checkData) {
            setState(state => {
                return {
                    ...state,
                    contracts: [...contracts, {
                        ...data
                    }]
                }
            })
            props.handleAddContract(
                [...contracts, {
                    ...data
                }], data
            );

        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_contract_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function chỉnh sửa thông tin hợp đồng lao động
     * @param {*} data : Dữ liệu thông tin hợp đồng muốn chỉnh sửa
     */
    const handleEditContract = async (data) => {
        const { translate } = props;
        let { contracts } = state;

        let contractsNew = [...contracts];
        let checkData = checkForDuplicate(data, contractsNew.filter((x, index) => index !== data.index));
        if (checkData) {
            contracts[data.index] = data;
            await setState(state => {
                return {
                    ...state,
                    contracts: contracts
                }
            })
            props.handleEditContract(contracts, data);

        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_contract_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    /**
     * Function xoá hợp đồng lao động
     * @param {*} index : Số thứ tự hợp đồng lao động muốn chỉnh sửa
     */
    const _delete = async (index) => {
        let { contracts } = state;
        let data = contracts[index];
        contracts.splice(index, 1);
        setState(state => {
            return {
                ...state,
                contracts: [...contracts]
            }
        })
        props.handleDeleteContract(
            [...contracts]
            , data);
    }


    /**
     * Function thêm thông tin khoá đào tạo
     * @param {*} data : Dữ liệu thông tin khoá đào tạo muốn thêm
     */
    const handleAddCourse = async (data) => {
        const { courses } = state;
        let check = false;
        courses.forEach(x => {
            if (x.course === data.course) {
                check = true;
            }
        })
        if (check === false) {
            await setState(state => {
                return {
                    ...state,
                    courses: [...courses, {
                        ...data
                    }]
                }
            })
            props.handleAddCourse(
                [...courses, {
                    ...data
                }], data);

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

    /**
     * Function chỉnh sửa thông tin khoá đào tạo
     * @param {*} data : Dữ liệu thông tin khoá đào tạo muốn chỉnh sửa
     */
    const handleEditCourse = async (data) => {
        const { courses } = state;
        courses[data.index] = data;
        await setState(state => {
            return {
                ...state,
                courses: courses
            }
        })
        props.handleEditCourse(courses, data);
    }

    /**
     * Function xoá thông tin khoá đào tạo
     * @param {*} index : Số thứ tự khoá đào tạo muốn chỉnh sửa
     */
    const deleteCourse = async (index) => {
        let { courses } = state;
        let data = courses[index];
        courses.splice(index, 1);
        await setState(state => {
            return {
                ...state,
                courses: [...courses]
            }
        })
        props.handleDeleteCourse(
            [...courses], data)
    }

    /**
     * function dowload file
     * @param {*} e
     * @param {*} path : Đường dẫn file
     * @param {*} fileName : Tên file dùng để lưu
     */
    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Danh sách hợp đồng lao động */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.labor_contract')}</h4></legend>
                    <div className="row">
                        {/* Ngày hết hạn hợp đồng */}
                        <div className="form-group col-md-4">
                            <label>{translate('human_resource.profile.contract_end_date')}</label>
                            <DatePicker
                                id={`contractEndDate-${id}`}
                                disabled={true}
                                value={formatDate(contractEndDate)}
                            // onChange={handleContractEndDateChange}
                            />
                        </div>
                        {/* Loại hợp đồng */}
                        <div className="form-group col-md-4">
                            <label >{translate('human_resource.profile.type_contract')}</label>
                            <input type="text" className="form-control" name="contractType" value={contractType ? contractType : ''} disabled />
                        </div>
                        <div className="form-group col-md-4 col-xs-12">
                            <ContractAddModal handleChange={handleAddContract} id={`addContract${id}`} />
                        </div>
                    </div>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                        <thead>
                            <tr>
                                <th >{translate('human_resource.profile.number_contract')}</th>
                                <th >{translate('human_resource.profile.name_contract')}</th>
                                <th >{translate('human_resource.profile.type_contract')}</th>
                                <th >{translate('human_resource.profile.start_date')}</th>
                                <th >{translate('human_resource.profile.end_date_certificate')}</th>
                                <th >{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contracts && contracts.length !== 0 &&
                                contracts.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x?.contractNumber}</td>
                                        <td>{x?.name}</td>
                                        <td>{x?.contractType}</td>
                                        <td>{formatDate(x.startDate)}</td>
                                        <td>{formatDate(x.endDate)}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                        <td>
                                            <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_contract')} ><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => _delete(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {
                        (!contracts || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>

                {/* Danh sách khoá học */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.training_process')}</h4></legend>
                    {pageCreate && <a style={{ marginBottom: '10px', marginTop: '2px' }} className="btn btn-success pull-right" title={translate('human_resource.profile.employee_management.staff_no_unit_title')} disabled >{translate('modal.create')}</a>}
                    {!pageCreate && <CourseAddModal roles={roles} handleChange={handleAddCourse} id={`addCourse${id}`} />}
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>Mã khoá đào tạo</th>
                                <th>{translate('human_resource.profile.course_name')}</th>
                                <th>{translate('human_resource.profile.start_day')}</th>
                                <th>{translate('human_resource.profile.end_date')}</th>
                                <th>Địa điểm đào tạo</th>
                                <th>Kết quả</th>
                                <th>{translate('table.action')}</th>
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
                                                <td >
                                                    <a onClick={() => handleCourseEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title='Chỉnh sửa thông tin khoá đào tạo' ><i className="material-icons">edit</i></a>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => deleteCourse(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        )
                                    } else {
                                        return null
                                    }

                                })}
                        </tbody>
                    </table>
                    {
                        (!courses || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
            </div>
            {   /** Form chỉnh sửa hợp đồng */
                currentRow &&
                <ContractEditModal
                    id={`editContract${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    contractNumber={currentRow.contractNumber}
                    name={currentRow.name}
                    contractType={currentRow.contractType}
                    startDate={formatDate(currentRow.startDate)}
                    endDate={formatDate(currentRow.endDate)}
                    file={currentRow.file}
                    urlFile={currentRow.urlFile}
                    fileUpload={currentRow.fileUpload}
                    handleChange={handleEditContract}
                />
            }
            {   /** Form chỉnh sửa khoá học */
                currentCourseRow &&
                <CourseEditModal
                    id={`editCourse${currentCourseRow.index}`}
                    _id={currentCourseRow._id}
                    index={currentCourseRow.index}
                    courseId={currentCourseRow.course}
                    result={currentCourseRow.result}
                    nameCourse={currentCourseRow.courseInfo.name}
                    handleChange={handleEditCourse}
                />
            }
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

const contractTab = connect(mapState, actionCreators)(withTranslate(ContractTab));
export { contractTab as ContractTab };
