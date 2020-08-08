import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ModalAddExperience, ModalEditExperience } from './combinedContent';

class ExperienceTab extends Component {
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

    // Bắt sự kiện click edit kinh nghiệm làm việc
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-experience-editExperience${index}`).modal('show');
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
        })
        this.props.handleChange(name, value);
    }

    // Function kiểm tra trùng lặp thời gian làm Việc
    checkForFuplicate = (data, array) => {
        let startDate = new Date(data.startDate);
        let endDate = new Date(data.endDate);
        let checkData = true;
        // Kiểm tra trùng lặp thời gian làm Việc
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

    // Function thêm mới kinh nghiệm làm việc
    handleAddExperience = async (data) => {
        let { experiences } = this.state;
        let checkData = this.checkForFuplicate(data, experiences);
        if (checkData) {
            await this.setState({
                ...this.state,
                experiences: [...experiences, {
                    ...data
                }]
            })
            this.props.handleAddExperience(experiences, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={['Thời gian làm làm việc bị trùng lặp']}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }
    // Function chỉnh sửa kinh nghiệm làm việc
    handleEditExperience = async (data) => {
        const { experiences } = this.state;
        let checkData = this.checkForFuplicate(data, experiences);
        if (checkData) {
            experiences[data.index] = data;
            await this.setState({
                ...this.state,
                experiences: experiences
            });
            this.props.handleEditExperience(this.state.experiences, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={['Thời gian làm làm việc bị trùng lặp']}
                />,
                { containerId: 'toast-notification' }
            );
        }
    }

    // Function xoá kinh nghiệm làm việc
    delete = async (index) => {
        var { experiences } = this.state;
        var data = experiences[index];
        experiences.splice(index, 1);
        await this.setState({
            ...this.state,
            experiences: [...experiences]
        })
        this.props.handleDeleteExperience(this.state.experiences, data);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                experiences: nextProps.employee.experiences,
                professionalSkill: nextProps.employee.professionalSkill,
                foreignLanguage: nextProps.employee.foreignLanguage,
                educationalLevel: nextProps.employee.educationalLevel,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { educationalLevel, foreignLanguage, professionalSkill, experiences } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.academic_level')}</h4></legend>
                        <div className="form-group">
                            <label>{translate('manage_employee.educational_level')}<span className="text-red">&#42;</span></label>
                            <select className="form-control" name="educationalLevel" value={educationalLevel} onChange={this.handleChange}>
                                <option value="12/12">12/12</option>
                                <option value="11/12">11/12</option>
                                <option value="10/12">10/12</option>
                                <option value="9/12">9/12</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label >{translate('manage_employee.language_level')}</label>
                            <input type="text" className="form-control" name="foreignLanguage" value={foreignLanguage} onChange={this.handleChange} placeholder={translate('manage_employee.language_level')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label>{translate('manage_employee.qualification')}</label>
                            <select className="form-control" name="professionalSkill" value={professionalSkill} onChange={this.handleChange}>
                                <option value="intermediate_degree">{translate('manage_employee.intermediate_degree')}</option>
                                <option value="colleges">{translate('manage_employee.colleges')}</option>
                                <option value="university">{translate('manage_employee.university')}</option>
                                <option value="master_degree">{translate('manage_employee.master_degree')}</option>
                                <option value="phd">{translate('manage_employee.phd')}</option>
                                <option value="unavailable">{translate('manage_employee.unavailable')}</option>
                            </select>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.work_experience')}</h4></legend>
                        <ModalAddExperience handleChange={this.handleAddExperience} id={`addExperience${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.from_month_year')}</th>
                                    <th>{translate('manage_employee.to_month_year')}</th>
                                    <th>{translate('manage_employee.unit')}</th>
                                    <th>{translate('table.position')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof experiences !== 'undefined' && experiences.length !== 0) &&
                                    experiences.map((x, index) => (
                                        <tr key={index}>
                                            <td>{this.formatDate(x.startDate, true)}</td>
                                            <td>{this.formatDate(x.endDate, true)}</td>
                                            <td>{x.company}</td>
                                            <td>{x.position}</td>
                                            <td >
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_experience')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof experiences === 'undefined' || experiences.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }

                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditExperience
                        id={`editExperience${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        company={this.state.currentRow.company}
                        startDate={this.formatDate(this.state.currentRow.startDate, true)}
                        endDate={this.formatDate(this.state.currentRow.endDate, true)}
                        position={this.state.currentRow.position}
                        handleChange={this.handleEditExperience}
                    />
                }
            </div>
        );
    }
};
const experienceTab = connect(null, null)(withTranslate(ExperienceTab));
export { experienceTab as ExperienceTab };