import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ModalAddExperience, ModalEditExperience } from './combinedContent';

function ExperienceTab(props) {
    const [state, setState] = useState({

    })

    const { translate } = props;

    const { id } = props;

    const { educationalLevel, foreignLanguage, professionalSkill, experiences, currentRow } = state;

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                experiences: props.employee ? props.employee.experiences : [],
                professionalSkill: props.employee ? props.employee.professionalSkill : "",
                foreignLanguage: props.employee ? props.employee.foreignLanguage : "",
                educationalLevel: props.employee ? props.employee.educationalLevel : "",
            }
        })
    }, [props.id, props.employee?.experiences])

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
    const handleAddExperience = async (data) => {
        const { translate } = props;
        let { experiences } = state;

        let checkData = checkForDuplicate(data, experiences);
        if (checkData) {
            await setState({
                ...state,
                experiences: [...experiences, {
                    ...data
                }]
            })
            props.handleAddExperience([...experiences, data], data);
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

    /**
     * Function chỉnh sửa kinh nghiệm làm việc
     * @param {*} data : Dữ liệu thông tin kinh nghiệm làm việc
     */
    const handleEditExperience = async (data) => {
        const { translate } = props;
        let { experiences } = state;

        let experiencesNew = [...experiences];
        let checkData = checkForDuplicate(data, experiencesNew.filter((x, index) => index !== data.index));
        if (checkData) {
            experiences[data.index] = data;
            await setState({
                ...state,
                experiences: experiences
            });
            props.handleEditExperience(experiences, data);
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
                            <option value="bachelor">{translate('human_resource.profile.bachelor')}</option>
                            <option value="engineer">{translate('human_resource.profile.engineer')}</option>
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
                                <th>{translate('table.position')}</th>
                                <th style={{ width: '120px' }}>{translate('general.action')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences && experiences.length !== 0 &&
                                experiences.map((x, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x.company}</td>
                                        <td>{x.position}</td>
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
                    handleChange={handleEditExperience}
                />
            }
        </div>
    );
};

const experienceTab = connect(null, null)(withTranslate(ExperienceTab));
export { experienceTab as ExperienceTab };