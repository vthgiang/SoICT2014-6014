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

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
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
        const { id, translate, user } = this.props;
        const { incidentLogs } = this.state;
        var userlist = user.list;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử sự cố</h4></legend>
                        <IncidentLogAddModal handleChange={this.handleAddIncident} id={`addIncident${id}`} />
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Mã sự cố</th>
                                    <th style={{ width: "10%" }}>Phân loại</th>
                                    <th style={{ width: "10%" }}>Người báo cáo</th>
                                    <th style={{ width: "10%" }}>Ngày phát hiện</th>
                                    <th style={{ width: "10%" }}>Nội dung</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof incidentLogs !== 'undefined' && incidentLogs.length !== 0) &&
                                    incidentLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.incidentCode}</td>
                                            <td>{x.type}</td>
                                            <td>{userlist.filter(item => item._id === x.reportedBy).pop().name}</td>
                                            <td>{this.formatDate(x.dateOfIncident)}</td>
                                            <td>{x.description}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sự cố"><i
                                                    className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteIncident(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof incidentLogs === 'undefined' || incidentLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>

                </div>
                {
                    this.state.currentRow !== undefined &&
                    <IncidentLogEditModal
                        id={`editIncident${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        incidentCode={this.state.currentRow.incidentCode}
                        type={this.state.currentRow.type}
                        reportedBy={this.state.currentRow.reportedBy}
                        dateOfIncident={this.state.currentRow.dateOfIncident}
                        description={this.state.currentRow.description}
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
