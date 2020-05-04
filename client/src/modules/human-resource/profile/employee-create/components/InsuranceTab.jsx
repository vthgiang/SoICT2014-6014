import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../../common-components';
import {
    ModalImportFileBHXH, SocialInsuranceAddModal,
    SocialInsuranceEditModal
} from './combinedContent';


class InsurranceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt sự kiện click edit BHXH
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-BHXH-editBHXH${index}`).modal('show');
    }


    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.props.handleChange(name, value);
    }
    // Bắt sự kiện thay đổi ngày có hiệu lực
    handleStartDateBHYTChange = (value) => {
        this.props.handleChange("healthInsuranceStartDate", value)
    }
    // Bắt sự kiện thay dổi ngày hêt hạn
    handleEndDateBHYTChange = (value) => {
        this.props.handleChange("healthInsuranceEndDate", value)
    }
    // function thêm thông tin quá trình đóng BHXH
    handleAddBHXH = async (data) => {
        var socialInsuranceDetails = this.state.socialInsuranceDetails;
        await this.setState({
            socialInsuranceDetails: [...socialInsuranceDetails, {
                ...data
            }]
        })
        this.props.handleAddBHXH(this.state.socialInsuranceDetails, data);
    }
    // function chỉnh sửa thông tin quá trình đóng BHXH
    handleEditBHXH = async (data) => {
        var socialInsuranceDetails = this.state.socialInsuranceDetails;
        socialInsuranceDetails[data.index] = data;
        await this.setState({
            socialInsuranceDetails: socialInsuranceDetails
        })
        this.props.handleEditBHXH(this.state.socialInsuranceDetails, data);
    }
    // Function bắt sự kiện xoá quá trình đóng BHXH
    delete = async (index) => {
        var socialInsuranceDetails = this.state.socialInsuranceDetails;
        var data = socialInsuranceDetails[index];
        socialInsuranceDetails.splice(index, 1);
        await this.setState({
            ...this.state,
            socialInsuranceDetails: [...socialInsuranceDetails]
        })
        this.props.handleDeleteBHXH(this.state.socialInsuranceDetails, data);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                socialInsuranceDetails: nextProps.socialInsuranceDetails,
                healthInsuranceNumber: nextProps.employee.healthInsuranceNumber,
                healthInsuranceStartDate: nextProps.employee.healthInsuranceStartDate,
                healthInsuranceEndDate: nextProps.employee.healthInsuranceEndDate,
                socialInsuranceNumber: nextProps.employee.socialInsuranceNumber,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, socialInsuranceNumber, socialInsuranceDetails } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.bhyt')}</h4></legend>
                        <div className="row">


                            <div className="form-group col-md-4">
                                <label>{translate('manage_employee.number_BHYT')}</label>
                                <input type="text" className="form-control" name="healthInsuranceNumber" value={healthInsuranceNumber} onChange={this.handleChange} placeholder={translate('manage_employee.number_BHYT')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label >{translate('manage_employee.start_date')}</label>
                                <DatePicker
                                    id={`startDateBHYT${id}`}
                                    value={healthInsuranceStartDate}
                                    onChange={this.handleStartDateBHYTChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label>{translate('manage_employee.end_date_certificate')}</label>
                                <DatePicker
                                    id={`endDateBHYT${id}`}
                                    value={healthInsuranceEndDate}
                                    onChange={this.handleEndDateBHYTChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.bhxh')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label>{translate('manage_employee.number_BHXH')}</label>
                                <input type="text" className="form-control" name="socialInsuranceNumber" value={socialInsuranceNumber} onChange={this.handleChange} placeholder={translate('manage_employee.number_BHXH')} autoComplete="off" />
                            </div>
                            <div className="col-md-12">
                                <h4 className="row col-md-6">{translate('manage_employee.bhxh_process')}:</h4>
                                <ModalImportFileBHXH index={this.state.key} />
                                <SocialInsuranceAddModal handleChange={this.handleAddBHXH} id={`addBHXH${id}`} />
                                <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
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
                                        {(typeof socialInsuranceDetails !== 'undefined' && socialInsuranceDetails.length !== 0) &&
                                            socialInsuranceDetails.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{x.startDate}</td>
                                                    <td>{x.endDate}</td>
                                                    <td>{x.company}</td>
                                                    <td>{x.position}</td>
                                                    <td>
                                                        <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_bhxh')}><i className="material-icons">edit</i></a>
                                                        <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                {
                                    (typeof socialInsuranceDetails === 'undefined' || socialInsuranceDetails === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <SocialInsuranceEditModal
                        id={`editBHXH${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        company={this.state.currentRow.company}
                        startDate={this.state.currentRow.startDate}
                        endDate={this.state.currentRow.endDate}
                        position={this.state.currentRow.position}
                        handleChange={this.handleEditBHXH}
                    />
                }
            </div >
        );
    }
};

const insurranceTab = connect(null, null)(withTranslate(InsurranceTab));
export { insurranceTab as InsurranceTab };