import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../../common-components';

import { toast } from 'react-toastify';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';

import { ModalImportFileBHXH, SocialInsuranceAddModal, SocialInsuranceEditModal } from './combinedContent';


class InsurranceTab extends Component {
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
        let { errorOnHealthInsuranceEndDate, healthInsuranceEndDate } = this.state;
        let errorOnHealthInsuranceStartDate = undefined;
        if (value) {
            let partValue = value.split('-');
            let startDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(startDate);
            if (healthInsuranceEndDate) {
                let endDate = healthInsuranceEndDate.split('-');
                endDate = [endDate[2], endDate[1], endDate[0]].join('-');
                let d = new Date(endDate);
                if (date.getTime() >= d.getTime()) {
                    errorOnHealthInsuranceStartDate = "Thời gian bắt đầu phải trước thời gian kết thúc";
                }
            }
        }
        this.setState({
            healthInsuranceStartDate: value,
            errorOnHealthInsuranceStartDate: errorOnHealthInsuranceStartDate,
            errorOnHealthInsuranceEndDate: errorOnHealthInsuranceEndDate === 'Ngày có hiệu lực chưa được nhập' ? undefined : errorOnHealthInsuranceEndDate
        })
        this.props.handleChange("healthInsuranceStartDate", value)

    }
    // Bắt sự kiện thay dổi ngày hêt hạn
    handleEndDateBHYTChange = (value) => {
        let { healthInsuranceStartDate } = this.state;
        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');
            let date = new Date(endDate);
            if (healthInsuranceStartDate) {
                let startDate = healthInsuranceStartDate.split('-');
                startDate = [startDate[2], startDate[1], startDate[0]].join('-');
                let d = new Date(startDate);
                if (d.getTime() >= date.getTime()) {
                    this.setState({
                        healthInsuranceEndDate: value,
                        errorOnHealthInsuranceEndDate: "Thời gian kết thúc phải sau thời gian bắt đầu",
                    })
                } else {
                    this.setState({
                        healthInsuranceEndDate: value,
                        errorOnHealthInsuranceStartDate: undefined,
                        errorOnHealthInsuranceEndDate: undefined,
                    })
                    this.props.handleChange("healthInsuranceEndDate", value)
                }
            } else {
                this.setState({
                    healthInsuranceEndDate: value,
                    errorOnHealthInsuranceEndDate: "Ngày có hiệu lực chưa được nhập",
                })
            }
        }


    }
    // function thêm thông tin quá trình đóng BHXH
    handleAddBHXH = async (data) => {
        let { socialInsuranceDetails } = this.state;
        let startDate = new Date(data.startDate);
        let endDate = new Date(data.endDate);
        let checkData = true;
        // Kiểm tra trùng lặp quá trình đống bảo hiểm xã hộihội
        for (let n in socialInsuranceDetails) {
            let date1 = new Date(socialInsuranceDetails[n].startDate);
            let date2 = new Date(socialInsuranceDetails[n].endDate);
            if (date1.getTime() === startDate.getTime() || (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
                (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())) {
                checkData = false;
                break;
            }
        }
        if (checkData) {
            await this.setState({
                socialInsuranceDetails: [...socialInsuranceDetails, {
                    ...data
                }]
            })
            this.props.handleAddBHXH(this.state.socialInsuranceDetails, data);
        } else {
            toast.error(
                <ServerResponseAlert
                    type='error'
                    title={'general.error'}
                    content={['Quá trình đóng bảo hiểm bị trùng lặp']}
                />,
                { containerId: 'toast-notification' }
            );
        }
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
        const { healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, errorOnHealthInsuranceStartDate,
            socialInsuranceNumber, socialInsuranceDetails, errorOnHealthInsuranceEndDate } = this.state;
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
                            <div className={`form-group col-md-4 ${errorOnHealthInsuranceStartDate === undefined ? "" : "has-error"}`}>
                                <label >{translate('manage_employee.start_date')}</label>
                                <DatePicker
                                    id={`startDateBHYT${id}`}
                                    value={healthInsuranceStartDate !== undefined ? this.formatDate(healthInsuranceStartDate) : undefined}
                                    onChange={this.handleStartDateBHYTChange}
                                />
                                <ErrorLabel content={errorOnHealthInsuranceStartDate} />
                            </div>
                            <div className={`form-group col-md-4 ${errorOnHealthInsuranceEndDate === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.end_date_certificate')}</label>
                                <DatePicker
                                    id={`endDateBHYT${id}`}
                                    value={healthInsuranceEndDate !== undefined ? this.formatDate(healthInsuranceEndDate) : undefined}
                                    onChange={this.handleEndDateBHYTChange}
                                />
                                <ErrorLabel content={errorOnHealthInsuranceEndDate} />
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
                                        {socialInsuranceDetails && socialInsuranceDetails.length !== 0 &&
                                            socialInsuranceDetails.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{this.formatDate(x.startDate, true)}</td>
                                                    <td>{this.formatDate(x.endDate, true)}</td>
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
                                    (!socialInsuranceDetails || socialInsuranceDetails.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <SocialInsuranceEditModal
                        id={`editBHXH${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        company={this.state.currentRow.company}
                        startDate={this.formatDate(this.state.currentRow.startDate, true)}
                        endDate={this.formatDate(this.state.currentRow.endDate, true)}
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