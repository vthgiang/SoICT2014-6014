import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../common-components';
import {
    ModalImportFileBHXH, ModalAddBHXH,
    ModalEditBHXH
} from './combinedContent';


class TabInsurranceContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
        this.props.handleChange(name, value);
    }
    // Bắt sự kiện thay đổi ngày có hiệu lực
    handleStartDateBHYTChange = (value) => {
        this.props.handleChange("startDateBHYT", value)
    }
    // Bắt sự kiện thay dổi ngày hêt hạn
    handleEndDateBHYTChange = (value) => {
        this.props.handleChange("endDateBHYT", value)
    }
    // function thêm thông tin quá trình đóng BHXH
    handleAddBHXH = async (data) => {
        var BHXH = this.state.BHXH;
        await this.setState({
            BHXH: [...BHXH, {
                ...data
            }]
        })
        this.props.handleAddBHXH(this.state.BHXH);
    }
    // function chỉnh sửa thông tin quá trình đóng BHXH
    handleEditBHXH = async (data) => {
        var BHXH = this.state.BHXH;
        BHXH[data.index] = data;
        await this.setState({
            BHXH: BHXH
        })
        this.props.handleEditBHXH(this.state.BHXH);
    }
    // Function bắt sự kiện xoá quá trình đóng BHXH
    delete = async (index) => {
        var BHXH = this.state.BHXH;
        BHXH.splice(index, 1);
        await this.setState({
            ...this.state,
            experience: [...BHXH]
        })
        this.props.handleDeleteBHXH(this.state.BHXH);
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                BHXH: nextProps.BHXH,
                numberBHYT: nextProps.employee.numberBHYT,
                startDateBHYT: nextProps.employee.startDateBHYT,
                endDateBHYT: nextProps.employee.endDateBHYT,
                numberBHXH: nextProps.employee.numberBHXH,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { numberBHYT, startDateBHYT, endDateBHYT, numberBHXH, BHXH } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.bhyt')}</h4></legend>
                        <div className="row">


                            <div className="form-group col-md-4">
                                <label htmlFor="numberBHYT">{translate('manage_employee.number_BHYT')}</label>
                                <input type="text" className="form-control" name="numberBHYT" value={numberBHYT} onChange={this.handleChange} placeholder={translate('manage_employee.number_BHYT')} autoComplete="off" />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="startDateBHYT">{translate('manage_employee.start_date')}</label>
                                <DatePicker
                                    id={`startDateBHYT${id}`}
                                    value={startDateBHYT}
                                    onChange={this.handleStartDateBHYTChange}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="endDateBHYT">{translate('manage_employee.end_date_certificate')}</label>
                                <DatePicker
                                    id={`endDateBHYT${id}`}
                                    value={endDateBHYT}
                                    onChange={this.handleEndDateBHYTChange}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border" ><h4 className="box-title">{translate('manage_employee.bhxh')}</h4></legend>
                        <div className="row">
                            <div className="form-group col-md-4">
                                <label htmlFor="numberBHXH">{translate('manage_employee.number_BHXH')}</label>
                                <input type="text" className="form-control" name="numberBHXH" value={numberBHXH} onChange={this.handleChange} placeholder={translate('manage_employee.number_BHXH')} autoComplete="off" />
                            </div>
                            <div className="col-md-12">
                                <h4 className="row col-md-6">{translate('manage_employee.bhxh_process')}:</h4>
                                <ModalImportFileBHXH index={this.state.key} />
                                <ModalAddBHXH handleChange={this.handleAddBHXH} id={`addBHXH${id}`} />
                                <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                                    <thead>
                                        <tr>
                                            <th>{translate('manage_employee.from_month_year')}</th>
                                            <th>{translate('manage_employee.to_month_year')}</th>
                                            <th>{translate('manage_employee.unit')}</th>
                                            <th>{translate('table.position')}</th>
                                            <th style={{width:'120px'}}>{translate('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof BHXH !== 'undefined' && BHXH.length !== 0) &&
                                            BHXH.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{x.startDate}</td>
                                                    <td>{x.endDate}</td>
                                                    <td>{x.unit}</td>
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
                                    (typeof BHXH === 'undefined' || BHXH === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </div>
                        </div>
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditBHXH
                        id={`editBHXH${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        unit={this.state.currentRow.unit}
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

const tabInsurrance = connect(null, null)(withTranslate(TabInsurranceContent));
export { tabInsurrance as TabInsurranceContent };