import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { AssetCreateValidator } from './combinedContent';
import { UserActions } from '../../../super-admin/user/redux/actions';

class IncidentLogEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt sự kiện thay đổi mã sự cố
    handleIncidentCodeChange = (e) => {
        let {value} = e.target;
        this.validateIncidentCode(value, true);
    }
    validateIncidentCode = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateIncidentCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnIncidentCode: msg,
                    incidentCode: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi loại sự cố
    handleTypeChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            type: value
        })
    }

    /**
     * Bắt sự kiện thay đổi người báo cáo
     */
    handleReportedByChange = (value) => {
        this.setState({
            ...this.state,
            reportedBy: value[0]
        });
    }

    //Bắt sự kiện thay đổi "Thời gian phát hiện"
    handleDateOfIncidentChange = (value) => {
        this.validateDateOfIncident(value, true);
    }
    validateDateOfIncident = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateDateOfIncident(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateOfIncident: msg,
                    dateOfIncident: value,
                }
            });
        }
        return msg === undefined;
    }


    //8. Bắt sự kiện thay đổi "Nội dung sự cố"
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateIncidentDescription(value, true);
    }
    validateIncidentDescription = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateIncidentDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateIncidentCode(this.state.incidentCode, false) &&
            this.validateDateOfIncident(this.state.dateOfIncident, false) &&
            this.validateIncidentDescription(this.state.description, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        var partDateOfIncident = this.state.dateOfIncident.split('-');
        var dateOfIncident = [partDateOfIncident[2], partDateOfIncident[1], partDateOfIncident[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.handleChange({...this.state, dateOfIncident: dateOfIncident});
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                _id: nextProps._id,
                id: nextProps.id,
                index: nextProps.index,
                incidentCode: nextProps.incidentCode,
                type: nextProps.type,
                reportedBy: nextProps.reportedBy,
                dateOfIncident: nextProps.dateOfIncident,
                description: nextProps.description,
                errorOnIncidentCode: undefined,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, id, user } = this.props;
        var userlist = user.list;
        const {
            incidentCode, type, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnDescription } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-incident-${id}`} isLoading={false}
                    formID={`form-edit-incident-${id}`}
                    title="Chỉnh sửa thông tin sự cố"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-incident-${id}`}>
                    <div className="col-md-12">
                            <div className={`form-group ${errorOnIncidentCode === undefined ? "" : "has-error"}`}>
                                <label>Mã sự cố<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="incidentCode" value={incidentCode} onChange={this.handleIncidentCodeChange} autoComplete="off" placeholder="Mã sự cố" />
                                <ErrorLabel content={errorOnIncidentCode} />
                            </div>
                            <div className="form-group">
                                <label>Phân loại</label>
                                <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                    <option value="Hỏng hóc">Hỏng hóc</option>
                                    <option value="Mất">Mất</option>
                                </select>
                            </div>
                            <div className={`form-group`}>
                                <label>Người báo cáo</label>
                                <div>
                                    <div id="reportedByBox">
                                        <SelectBox
                                            id={`reportedBy${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleReportedByChange}
                                            value={reportedBy}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Thời gian phát hiện sự cố</label>
                                <DatePicker
                                    id={`edit-dateOfIncident-${id}`}
                                    value={dateOfIncident}
                                    onChange={this.handleDateOfIncidentChange}
                                />
                            </div>
                            <div className={`form-group ${errorOnDescription === undefined ? "" : "has-error"}`}>
                                <label>Nội dung<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder="Nội dung"></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var { user } = state;
    return { user };
};

const actionCreators = {
    getUser: UserActions.get,
};


const editModal = connect(mapState, actionCreators)(withTranslate(IncidentLogEditModal));
export { editModal as IncidentLogEditModal };
