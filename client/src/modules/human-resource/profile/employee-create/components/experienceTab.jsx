import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import { DatePicker, SelectBox } from '../../../../../common-components';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';
import { AuthActions } from '../../../../auth/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';

import { ModalAddExperience, ModalEditExperience, ModalAddCareerPosition, ModalEditCareerPosition, ModalAddWorkProcess, ModalEditWorkProcess } from './combinedContent';

function ExperienceTab(props) {
    const [state, setState] = useState({

    })

    const { translate, major, career } = props;

    const listPosition = career.listPosition
    // console.log("xxxxxxxxxxx", listPosition)

    const { id } = props;

    const { educationalLevel, foreignLanguage, professionalSkill, experiences, careerPositions, currentRowEditCareerPosition, biddingPackagePersonalStatus, biddingPackageEndDate, currentRow } = state;

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                careerPositions: props?.employee?.careerPositions ? props.employee.careerPositions : [],
                workProcess: props?.employee?.workProcess ? props.employee.workProcess : [],
                experiences: props.employee?.experiences ? props.employee.experiences : [],
                professionalSkill: props.employee?.professionalSkill ? props.employee.professionalSkill : "",
                foreignLanguage: props.employee?.foreignLanguage ? props.employee.foreignLanguage : "",
                educationalLevel: props.employee?.educationalLevel ? props.employee.educationalLevel : "",
                biddingPackagePersonalStatus: props.employee?.biddingPackagePersonalStatus ? Number(props.employee?.biddingPackagePersonalStatus) : 3,
                biddingPackageEndDate: formatDate(props.employee?.biddingPackageEndDate ? props.employee?.biddingPackageEndDate : '')
            }
        })
    }, [props.id, props.employee?.experiences, props?.employee?.careerPositions])

    useEffect(() => {
        props.getListCareerPosition({ name: '', page: 0, limit: 1000 });
    }, [])


    /**
     * Function format dữ liệu Date thành string
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
    }

    /**
     * Bắt sự kiện click edit kinh nghiệm làm việc
     * @param {*} value : Kinh nghiệm làm việc cần chỉnh sửa
     * @param {*} index : Số thứ tự kinh nghiệm làm việc cần chỉnh sửa
     */
    const handleEdit = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-experience-editExperience${index}`).modal('show');
    }

    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        })
        props.handleChange(name, value);
    }

    
    /**
     * Funtion bắt sự kiện thay đổi trạng thái làm việc
     * @param {*} value : Trạng thái làm việc
     */
    const handleChangeStatus = (value) => {
        setState(state => {
            return {
                ...state,
                biddingPackagePersonalStatus: Number(value[0])
            }
        })
        props.handleChange('biddingPackagePersonalStatus', Number(value[0]))
    }
    /**
     * Funtion bắt sự kiện thay đổi trạng thái làm việc
     * @param {*} value : Trạng thái làm việc
     */
    const handleBiddingPackageEndDate = (value) => {

        setState(state => {
            return {
                ...state,
                biddingPackageEndDate: value
            }
        })
        props.handleChange('biddingPackageEndDate', value)
    }

    /**
     * Function kiểm tra trùng lặp thời gian làm Việc
     * @param {*} data : Dữ liệu kinh nghiệm làm việc muốn thêm, chỉnh sửa
     * @param {*} array : Danh sách kinh nghiệm làm việc
     */
    const checkForDuplicate = (data, array) => {
        let startDate = new Date(data.startDate);
        let endDate = new Date(data.endDate);
        let checkData = true;
        for (let n in array) {
            let date1 = new Date(array[n].startDate);
            let date2 = new Date(array[n].endDate);
            if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
                (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
                checkData = false;
                break;
            }
        }
        return checkData
    }

    /**
     * Function thêm mới kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     */
    const handleAddExperience = (data) => {
        let { experiences } = state;
        props.handleAddExperience([...experiences, data], data);

        setState({
            ...state,
            experiences: [...experiences, data]
        })
    }

    /**
     * Function chỉnh sửa kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     */
    const handleEditExperience = async (data) => {
        let { experiences } = state;
        experiences[data.index] = data;

        props.handleEditExperience(experiences, data);

        setState({
            ...state,
            experiences: experiences
        });
    }

    /**
     * Function xoá kinh nghiệm làm việc
     * @param {*} index : Số thứ tự kinh nghiệm làm việc muốn xoá
     */
    const _delete = async (index) => {
        let { experiences } = state;

        let data = experiences[index];
        experiences.splice(index, 1);
        await setState({
            ...state,
            experiences: [...experiences]
        })
        props.handleDeleteExperience([...experiences], data);
    }



    const handleAddCareerPosition = (data) => {
        const { translate } = props;
        let { careerPositions } = state;

        let checkData = checkForDuplicate(data, careerPositions);
        if (checkData) {
            props.handleAddCareerPosition([...careerPositions, data], data);
            setState({
                ...state,
                careerPositions: [...careerPositions, {
                    ...data
                }]
            })
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_experience_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    const _deleteCareerPosition = (index) => {
        let { careerPositions } = state;

        let data = careerPositions[index];
        careerPositions.splice(index, 1);
        setState({
            ...state,
            careerPositions: [...careerPositions]
        })
        props.handleDeleteCareerPosition([...careerPositions], data);
    }

    const handleEditCareerPosition = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRowEditCareerPosition: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-career-position-editCareer${index}`).modal('show');
    }


    const handleChangleEditCareerPosition = async (data) => {
        const { translate } = props;
        let { careerPositions } = state;

        let careerPositionsNew = [...careerPositions];
        let checkData = checkForDuplicate(data, careerPositionsNew.filter((x, index) => index !== data.index));
        if (checkData) {
            careerPositions[data.index] = data;
            await setState({
                ...state,
                careerPositions: careerPositions
            });
            props.handleEditCareerPosition(careerPositions, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={[translate('human_resource.profile.time_experience_duplicate')]}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    let professionalSkills= '';

    let professionalSkillArr = [
        { value: null, text: "Chọn trình độ" },
        { value: 1, text: "Trình độ phổ thông" },
        { value: 2, text: "Trung cấp" },
        { value: 3, text: "Cao đẳng" },
        { value: 4, text: "Đại học / Cử nhân" },
        { value: 5, text: "Kỹ sư" },
        { value: 6, text: "Thạc sĩ" },
        { value: 7, text: "Tiến sĩ" },
        { value: 8, text: "Giáo sư" },
        { value: 0, text: "Không có" },
    ];

    let biddingStatus = {
        1: "Chưa tham gia gói thầu",
        2: "Chờ kết quả dự thầu",
        3: "Đang tham gia gói thầu"
    }

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Trình độ học vấn*/}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.academic_level')}</h4></legend>
                    {/* Trình độ văn hoá */}
                    {/* <div className="form-group">
                            <label>{translate('human_resource.profile.educational_level')}<span className="text-red">&#42;</span></label>
                            <select className="form-control" name="educationalLevel" value={educationalLevel} onChange={handleChange}>
                                <option value="12/12">12/12</option>
                                <option value="11/12">11/12</option>
                                <option value="10/12">10/12</option>
                                <option value="9/12">9/12</option>
                            </select>
                        </div> */}
                    <div className="form-group">
                        <label >{translate('human_resource.profile.educational_level')}</label>
                        <input type="text" className="form-control" name="educationalLevel" value={educationalLevel ? educationalLevel : ''} onChange={handleChange}
                            placeholder={translate('human_resource.profile.educational_level')} autoComplete="off" />
                    </div>

                    {/* Trình độ ngoại ngữ */}
                    <div className="form-group">
                        <label >{translate('human_resource.profile.language_level')}</label>
                        <input type="text" className="form-control" name="foreignLanguage" value={foreignLanguage ? foreignLanguage : ''} onChange={handleChange} placeholder={translate('human_resource.profile.language_level')} autoComplete="off" />
                    </div>

                    {/* Trình độ chuyên môn */}
                    <div className="form-group">
                        <label>{translate('human_resource.profile.qualification')}</label>
                        <select className="form-control" name="professionalSkill" value={professionalSkill} onChange={handleChange}>
                            <option value="intermediate_degree">{translate('human_resource.profile.intermediate_degree')}</option>
                            <option value="colleges">{translate('human_resource.profile.colleges')}</option>
                            <option value="university">{translate('human_resource.profile.university')}</option>
                            <option value="master_degree">{translate('human_resource.profile.master_degree')}</option>
                            <option value="phd">{translate('human_resource.profile.phd')}</option>
                            <option value="unavailable">{translate('human_resource.profile.unavailable')}</option>
                        </select>
                    </div>
                </fieldset>

                {/* Kinh nghiệm làm việc */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.work_experience')}</h4></legend>
                    <ModalAddExperience handleChange={handleAddExperience} id={`addExperience${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>{translate('human_resource.profile.position_in_task')}</th>
                                <th>{translate('human_resource.profile.job_description')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences && experiences.length !== 0 &&
                                experiences.map((x, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x?.company}</td>
                                        <td>{x?.position}</td>
                                        <td>{x?.jobDescription}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.company)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                        <td>
                                            <a onClick={() => handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_experience')}><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => _delete(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {
                        (!experiences || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                </fieldset>
                
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.project_experience')}</h4></legend>
                    <div className="row">
                        <div className="form-group col-lg-6 col-md-6 col-ms-12 col-xs-12">
                            <label >{translate('human_resource.profile.project_participation_status')}</label>
                            <SelectBox
                                id={`status${id}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={biddingPackagePersonalStatus}
                                items={[
                                    { value: 1, text: "Chưa tham gia" },
                                    { value: 2, text: "Chờ kết quả" },
                                    { value: 3, text: "Đã tham gia" },
                                ]}
                                onChange={handleChangeStatus}
                            />
                        </div>
                        {/* Ngày kết thúc gói thầu */}
                        { biddingPackagePersonalStatus === 3 && <div className={`form-group col-lg-4 col-md-4 col-ms-12 col-xs-12`}>
                            <label >{translate('human_resource.profile.project_end_date')}</label>
                            <DatePicker
                                id={`endBiddingPackage${id}`}
                                value={biddingPackageEndDate}
                                onChange={handleBiddingPackageEndDate}
                            />
                        </div>}
                    </div>
                    <ModalAddCareerPosition 
                        handleChange={handleAddCareerPosition} 
                        id={`addCareerPosition${id}`} 
                    />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>{translate('human_resource.profile.project')}</th>
                                <th>{translate('human_resource.profile.project_employee_position')}</th>
                                <th>{translate('human_resource.profile.project_professional_or_managerment')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {careerPositions && careerPositions.length !== 0 &&
                                careerPositions.map((x, index) => {
                                    let position = ''
                                    if (x.careerPosition) {
                                        position = listPosition?.find(y => y._id.toString() === x.careerPosition.toString())
                                        if (position) {
                                            position = position.name
                                        } else {
                                            position = 'DELETED'
                                        }
                                    }
                                    return (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x.company}</td>
                                        <td>{x?.project}</td>
                                        <td>{position}</td>
                                        <td>{x?.professionalExperience}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.project)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                        <td>
                                            <a onClick={() => handleEditCareerPosition(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_working_process')}><i className="material-icons">edit</i></a>
                                            {!x.biddingPackage && <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => _deleteCareerPosition(index)}><i className="material-icons"></i></a>}
                                        </td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                    {
                        (!careerPositions || careerPositions.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

                </fieldset>
            </div>
            {   /** Form chỉnh sửa kinh nghiệm làm việc*/
                currentRow &&
                <ModalEditExperience
                    id={`editExperience${currentRow.index}`}
                    _id={currentRow._id}
                    index={currentRow.index}
                    company={currentRow.company}
                    startDate={formatDate(currentRow.startDate, true)}
                    endDate={formatDate(currentRow.endDate, true)}
                    position={currentRow.position}
                    file={currentRow.file}
                    urlFile={currentRow.urlFile}
                    fileUpload={currentRow.fileUpload}
                    jobDescription={currentRow.jobDescription}
                    handleChange={handleEditExperience}
                />
            }

            {
                // Form chỉnh sửa quá trình công tác
                currentRowEditCareerPosition &&
                <ModalEditCareerPosition
                    id={`editCareer${currentRowEditCareerPosition.index}`}
                    _id={currentRowEditCareerPosition._id}
                    index={currentRowEditCareerPosition.index}
                    company={currentRowEditCareerPosition.company}
                    listPosition={listPosition}
                    startDate={formatDate(currentRowEditCareerPosition.startDate, true)}
                    endDate={formatDate(currentRowEditCareerPosition.endDate, true)}
                    project={currentRowEditCareerPosition.project}
                    careerPosition={currentRowEditCareerPosition.careerPosition}
                    file={currentRowEditCareerPosition.file}
                    urlFile={currentRowEditCareerPosition.urlFile}
                    fileUpload={currentRowEditCareerPosition.fileUpload}
                    professionalExperience={currentRowEditCareerPosition.professionalExperience}
                    handleChange={handleChangleEditCareerPosition}
                />
            }
        </div>
    );
};

function mapState(state) {
    const { career } = state;
    return { career };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
};

const experienceTab = connect(mapState, actionCreators)(withTranslate(ExperienceTab));
export { experienceTab as ExperienceTab };