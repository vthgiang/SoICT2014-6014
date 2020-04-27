import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddContract, ModalEditContract,
} from './combinedContent';

class TabContractContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
        const { contract } = this.state;
        await this.setState({
            contract: [...contract, {
                ...data
            }]
        })
        this.props.handleAddContract(this.state.contract);
    }
    // function chỉnh sửa thông tin hợp đồng lao động
    handleEditContract = async (data) => {
        const { contract } = this.state;
        contract[data.index] = data;
        await this.setState({
            contract: contract
        })
        this.props.handleEditContract(this.state.contract);
    }
    // Function xoá bằng cấp
    delete = async (index) => {
        var { contract } = this.state;
        contract.splice(index, 1);
        await this.setState({
            ...this.state,
            contract: [...contract]
        })
        this.props.handleDeleteContract(this.state.contract)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contract: nextProps.contract,
                course: nextProps.course,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { contract, course } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.labor_contract')}</h4></legend>
                        <ModalAddContract handleChange={this.handleAddContract} id={`addContract${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('manage_employee.name_contract')}</th>
                                    <th >{translate('manage_employee.type_contract')}</th>
                                    <th >{translate('manage_employee.start_date')}</th>
                                    <th >{translate('manage_employee.end_date_certificate')}</th>
                                    <th >{translate('manage_employee.attached_files')}</th>
                                    <th style={{width:'120px'}}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof contract !== 'undefined' && contract.length !== 0) &&
                                    contract.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameContract}</td>
                                            <td>{x.typeContract}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_contract')} ><i className="material-icons">edit</i></a>
                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("contract", index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof contract === 'undefined' || contract.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.training_process')}</h4></legend>
                        <button style={{ marginBottom: 5 }} type="submit" className="btn btn-success pull-right" title="Thêm mới quá trình đào tạo" onClick={this.handleAddNew}>{translate('modal.create')}</button>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.course_name')}</th>
                                    <th>{translate('manage_employee.start_day')}</th>
                                    <th>{translate('manage_employee.end_date')}</th>
                                    <th>{translate('manage_employee.diploma_issued_by')}</th>
                                    <th>{translate('manage_employee.type_education')}</th>
                                    <th>{translate('manage_employee.cost')}</th>
                                    {/* <th style={{ width: '12%' }}>Thời gian cam kết</th> */}
                                    <th>{translate('table.status')}</th>
                                    <th>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof course !== 'undefined' && course.length !== 0) &&
                                    course.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameCourse}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.unit}</td>
                                            <td>{x.typeCourse}></td>
                                            <td><input type="text" style={{ width: "100%" }} /></td>
                                            <td>{x.status}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("course", index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof course === 'undefined' || course.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditContract
                        id={`editContract${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        nameContract={this.state.currentRow.nameContract}
                        typeContract={this.state.currentRow.typeContract}
                        startDate={this.state.currentRow.startDate}
                        endDate={this.state.currentRow.endDate}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditContract}
                    />
                }
            </div>
        );
    }
};

const tabContract = connect(null, null)(withTranslate(TabContractContent));
export { tabContract as TabContractContent };