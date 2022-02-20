import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ModalAddExperience, ModalEditExperience, ModalAddCareerPosition, ModalEditCareerPosition, ModalAddWorkProcess, ModalEditWorkProcess } from './combinedContent';

function ExperienceTab(props) {
    const [state, setState] = useState({

    })

    const { translate, major, careerPosition } = props;

    const { id } = props;

    const { educationalLevel, foreignLanguage, professionalSkill, experiences, careerPositions, currentRowEditCareerPosition, currentRowEditWorkProcess, workProcess, currentRow } = state;

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                careerPositions: props?.employee?.careerPositions ? props.employee.careerPositions : [],
                experiences: props.employee?.experiences ? props.employee.experiences : [],
                professionalSkill: props.employee?.degrees ? props.employee.degrees : [],
                foreignLanguage: props.employee?.foreignLanguage ? props.employee.foreignLanguage : "",
                educationalLevel: props.employee?.educationalLevel ? props.employee.educationalLevel : "",
            }
        })
    }, [props.id, props.employee?.experiences, props?.employee?.careerPositions])

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

    /**  */

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
            setState({
                ...state,
                careerPositions: [...careerPositions, {
                    ...data
                }]
            })
            props.handleAddCareerPosition([...careerPositions, data], data);
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
        window.$(`#modal-edit-work-process-${index}`).modal('show');
    }


    const handleChangleEditCareerPosition = async (data) => {
        const { translate } = props;
        let { careerPositions } = state;

        let workProcessNew = [...careerPositions];
        let checkData = checkForDuplicate(data, workProcessNew.filter((x, index) => index !== data.index));
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

    const handleAddWorkProcess = (data) => {
        const { translate } = props;
        let { workProcess } = state;

        let checkData = checkForDuplicate(data, workProcess);
        if (checkData) {
            setState({
                ...state,
                workProcess: [...workProcess, {
                    ...data
                }]
            })
            props.handleAddWorkProcess([...workProcess, data], data);
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

        const _deleteWorkProcess = (index) => {
        let { workProcess } = state;

        let data = workProcess[index];
        workProcess.splice(index, 1);
        setState({
            ...state,
            workProcess: [...workProcess]
        })
        props.handleDeleteWorkProcess([...workProcess], data);
    }

    const handleEditWorkProcess = async (value, index) => {
        await setState(state => {
            return {
                ...state,
                currentRowEditWorkProcess: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-work-process-${index}`).modal('show');
    }

    const handleChangleEditWorkProcess = async (data) => {
        const { translate } = props;
        let { workProcess } = state;

        let workProcessNew = [...workProcess];
        let checkData = checkForDuplicate(data, workProcessNew.filter((x, index) => index !== data.index));
        if (checkData) {
            workProcess[data.index] = data;
            await setState({
                ...state,
                workProcess: workProcess
            });
            props.handleEditWorkProcess(workProcess, data);
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

    if (professionalSkill) {
        professionalSkill.map(item => {
            professionalSkills = professionalSkills + professionalSkillArr.find(x => x.value == item.degreeQualification).text + " (" + major.find(y => item.major == y._id)?.name + ", " + item.issuedBy + ", " + new Date(item.year).getFullYear() + ")" + `; `
        })
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
                    {professionalSkills && <div className="form-group">
                        <strong>{translate('human_resource.profile.qualification')}&emsp; </strong>
                        {professionalSkills}
                    </div>}
                </fieldset>
                {/* Quá trình công tác */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border" ><h4 className="box-title">{translate('human_resource.profile.Working_process')}</h4></legend>
                    <ModalAddWorkProcess handleChange={handleAddWorkProcess} id={`addWorkProcess${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>{translate('table.position')}</th>
                                <th>{translate('human_resource.profile.reference_information')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workProcess && workProcess.length !== 0 &&
                                workProcess.map((x, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x?.company}</td>
                                        <td>{x?.position}</td>
                                        <td>{x?.referenceInformation}</td>
                                        <td>
                                            <a onClick={() => handleEditWorkProcess(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('human_resource.profile.edit_working_process')}><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => _deleteWorkProcess(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {
                        (!workProcess || workProcess.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }

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
                                <th>{translate('human_resource.profile.project')}</th>
                                <th>{translate('human_resource.profile.position_in_task')}</th>
                                <th>{translate('human_resource.profile.customer')}</th>
                                <th>{translate('human_resource.profile.address')}</th>
                                <th>{translate('human_resource.profile.job_description')}</th>
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
                                        <td>{x?.project}</td>
                                        <td>{x?.position}</td>
                                        <td>{x?.customer}</td>
                                        <td>{x?.address}</td>
                                        <td>{x?.jobDescription}</td>
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
                    <legend className="scheduler-border" ><h4 className="box-title">Dự án từng tham gia</h4></legend>
                    <ModalAddCareerPosition handleChange={handleAddCareerPosition} id={`addCareerPosition${id}`} />
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>Gói thầu</th>
                                <th>Vị trí công việc</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {careerPositions && careerPositions.length !== 0 &&
                                careerPositions.map((x, index) => {
                                    let position = ''
                                    console.log("carreeee", x.careerPosition, careerPosition)
                                    if (x.careerPosition) {
                                        position = careerPosition.listPosition?.find(y => y._id.toString() === x.careerPosition.toString())
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
                                        <td>{x.biddingPackageName}</td>
                                        <td>{position}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
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
                    project={currentRow.project}
                    customer={currentRow.customer}
                    address={currentRow.address}
                    jobDescription={currentRow.jobDescription}
                    handleChange={handleEditExperience}
                />
            }

            {
                // Form chỉnh sửa quá trình công tác
                currentRowEditWorkProcess &&
                <ModalEditWorkProcess
                    id={`${currentRowEditWorkProcess.index}`}
                    _id={currentRowEditWorkProcess._id}
                    index={currentRowEditWorkProcess.index}
                    company={currentRowEditWorkProcess.company}
                    startDate={formatDate(currentRowEditWorkProcess.startDate, true)}
                    endDate={formatDate(currentRowEditWorkProcess.endDate, true)}
                    position={currentRowEditWorkProcess.position}
                    referenceInformation={currentRowEditWorkProcess.referenceInformation}
                    handleChange={handleChangleEditWorkProcess}
                />
            }

            {
                // Form chỉnh sửa quá trình công tác
                currentRowEditCareerPosition &&
                <ModalEditCareerPosition
                    id={`${currentRowEditCareerPosition.index}`}
                    _id={currentRowEditCareerPosition._id}
                    index={currentRowEditCareerPosition.index}
                    company={currentRowEditCareerPosition.company}
                    startDate={formatDate(currentRowEditCareerPosition.startDate, true)}
                    endDate={formatDate(currentRowEditCareerPosition.endDate, true)}
                    position={currentRowEditCareerPosition.position}
                    referenceInformation={currentRowEditCareerPosition.referenceInformation}
                    handleChange={handleChangleEditCareerPosition}
                />
            }
        </div>
    );
};

const experienceTab = connect(null, null)(withTranslate(ExperienceTab));
export { experienceTab as ExperienceTab };