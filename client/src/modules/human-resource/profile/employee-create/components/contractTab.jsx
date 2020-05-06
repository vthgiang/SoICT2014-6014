import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../../env';
import { ContractAddModal, ContractEditModal } from './combinedContent';

class ContractTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        const { contracts } = this.state;
        await this.setState({
            contracts: [...contracts, {
                ...data
            }]
        })
        this.props.handleAddContract(this.state.contracts, data);
    }
    // function chỉnh sửa thông tin hợp đồng lao động
    handleEditContract = async (data) => {
        const { contracts } = this.state;
        contracts[data.index] = data;
        await this.setState({
            contracts: contracts
        })
        this.props.handleEditContract(this.state.contracts, data);
    }
    // Function xoá bằng cấp
    delete = async (index) => {
        var { contracts } = this.state;
        var data = contracts[index];
        contracts.splice(index, 1);
        await this.setState({
            ...this.state,
            contracts: [...contracts]
        })
        this.props.handleDeleteContract(this.state.contracts, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                contracts: nextProps.contracts,
                courses: nextProps.courses,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { contracts, courses } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.labor_contract')}</h4></legend>
                        <ContractAddModal handleChange={this.handleAddContract} id={`addContract${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}  >
                            <thead>
                                <tr>
                                    <th >{translate('manage_employee.name_contract')}</th>
                                    <th >{translate('manage_employee.type_contract')}</th>
                                    <th >{translate('manage_employee.start_date')}</th>
                                    <th >{translate('manage_employee.end_date_certificate')}</th>
                                    <th >{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof contracts !== 'undefined' && contracts.length !== 0) &&
                                    contracts.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.contractType}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={(x._id === undefined) ? x.urlFile : `${LOCAL_SERVER_API + x.urlFile}`} target="_blank"><u>{x.file}</u></a>}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_contract')} ><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("contract", index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof contracts === 'undefined' || contracts.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                {(typeof courses !== 'undefined' && courses.length !== 0) &&
                                    courses.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{x.offeredBy}</td>
                                            <td>{x.courseType}></td>
                                            <td><input type="text" style={{ width: "100%" }} /></td>
                                            <td>{x.status}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete("course", index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof courses === 'undefined' || courses.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ContractEditModal
                        id={`editContract${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        name={this.state.currentRow.name}
                        contractType={this.state.currentRow.contractType}
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

const contractTab = connect(null, null)(withTranslate(ContractTab));
export { contractTab as ContractTab };