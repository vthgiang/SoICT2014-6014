import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalAddExperience, ModalEditExperience } from './combinedContent';

class ExperienceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        this.props.handleChange(name, value);
    }

    // Function thêm mới kinh nghiệm làm việc
    handleAddExperience = async (data) => {
        await this.setState({
            ...this.state,
            experiences: [...this.state.experiences, {
                ...data
            }]
        })
        this.props.handleAddExperience(this.state.experiences);
    }
    // Function chỉnh sửa kinh nghiệm làm việc
    handleEditExperience = async (data) => {
        const { experiences } = this.state;
        experiences[data.index] = data;
        await this.setState({
            ...this.state,
            experiences: experiences
        });
        this.props.handleEditExperience(this.state.experiences);
    }
    // Function xoá kinh nghiệm làm việc
    delete = async (index) => {
        var { experiences } = this.state;
        experiences.splice(index, 1);
        await this.setState({
            ...this.state,
            experiences: [...experiences]
        })
        this.props.handleDeleteExperience(this.state.experiences);
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
                            <select className="form-control" name="cultural" value={educationalLevel} onChange={this.handleChange}>
                                <option value="12/12">12/12</option>
                                <option value="11/12">11/12</option>
                                <option value="10/12">10/12</option>
                                <option value="9/12">9/12</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="foreignLanguage ">{translate('manage_employee.language_level')}</label>
                            <input type="text" className="form-control" name="foreignLanguage" value={foreignLanguage} onChange={this.handleChange} placeholder={translate('manage_employee.language_level')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="educational ">{translate('manage_employee.qualification')}</label>
                            <select className="form-control" name="educational" value={professionalSkill} onChange={this.handleChange}>
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
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
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
                        index={this.state.currentRow.index}
                        company={this.state.currentRow.company}
                        startDate={this.state.currentRow.startDate}
                        endDate={this.state.currentRow.endDate}
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