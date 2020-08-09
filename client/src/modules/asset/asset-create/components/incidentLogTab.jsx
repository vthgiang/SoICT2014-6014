import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { IncidentLogAddModal, IncidentLogEditModal } from './combinedContent';

class IncidentLogTab extends Component {
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

        if (month.length < 2) {
            month = '0' + month;
        }
            
        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-incident-editIncident${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    handleAddIncident = async (data) => {
        const { incidentLogs } = this.state;
        await this.setState({
            incidentLogs: [...incidentLogs, {
                ...data
            }]
        })
        this.props.handleAddIncident(this.state.incidentLogs, data)
    }

    // Function chỉnh sửa thông tin phiếu
    handleEditIncident = async (data) => {
        const { incidentLogs } = this.state;
        incidentLogs[data.index] = data;
        await this.setState({
            incidentLogs: incidentLogs,
        })
        this.props.handleEditIncident(this.state.incidentLogs, data)
    }

    // Function bắt sự kiện xoá thông tin phiếu
    handleDeleteIncident = async (index) => {
        var { incidentLogs } = this.state;
        var data = incidentLogs[index];
        incidentLogs.splice(index, 1);
        await this.setState({
            ...this.state,
            incidentLogs: [...incidentLogs]
        })
        this.props.handleDeleteIncident(this.state.incidentLogs, data)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                incidentLogs: nextProps.incidentLogs,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { incidentLogs, currentRow } = this.state;

        var userlist = user.list;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử sự cố */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử sự cố</h4></legend>

                        {/* Form thêm thông tin sự cố */}
                        <IncidentLogAddModal handleChange={this.handleAddIncident} id={`addIncident${id}`} />

                        {/* Bảng thông tin sự cố */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Mã sự cố</th>
                                    <th style={{ width: "10%" }}>Phân loại</th>
                                    <th style={{ width: "10%" }}>Người báo cáo</th>
                                    <th style={{ width: "10%" }}>Ngày phát hiện</th>
                                    <th style={{ width: "10%" }}>Nội dung</th>
                                    <th style={{ width: "10%" }}>Trạng thái</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(incidentLogs && incidentLogs.length !== 0) &&
                                    incidentLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.incidentCode}</td>
                                            <td>{x.type}</td>
                                            <td>{x.reportedBy ? (userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : 'User is deleted') : ''}</td>
                                            <td>{x.dateOfIncident ? this.formatDate(x.dateOfIncident): ''}</td>
                                            <td>{x.description}</td>
                                            <td>{x.statusIncident}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sự cố"><i
                                                    className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteIncident(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (!incidentLogs || incidentLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>

                {/* Form chỉnh sửa thông tin sự cố */}
                {
                    currentRow &&
                    <IncidentLogEditModal
                        id={`editIncident${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        incidentCode={currentRow.incidentCode}
                        type={currentRow.type}
                        reportedBy={currentRow.reportedBy}
                        dateOfIncident={this.formatDate(currentRow.dateOfIncident)}
                        description={currentRow.description}
                        statusIncident={currentRow.statusIncident}
                        handleChange={this.handleEditIncident}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { user } = state;
    return { user };
};

const incidentLogTab = connect(mapState, null)(withTranslate(IncidentLogTab));

export { incidentLogTab as IncidentLogTab };
