import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { AssetCreateValidator } from '../../asset-create/components/assetCreateValidator';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { IncidentActions } from '../redux/actions';

class IncidentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Bắt sự kiện thay đổi mã sự cố
    handleIncidentCodeChange = (e) => {
        let { value } = e.target;
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
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
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

    save = () => {
        var partIncident = this.state.dateOfIncident.split('-');
        var dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;
        if (this.isFormValidated()) {
            let dataToSubmit = {
                incidentCode: this.state.incidentCode,
                type: this.state.type,
                reportedBy: !this.state.reportedBy ? this.props.user.list[0].id : this.state.reportedBy,
                dateOfIncident: dateOfIncident,
                description: this.state.description,
                status: this.state.type,
                assetId
            }
            return this.props.updateIncident(this.props._id, dataToSubmit);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                incidentCode: nextProps.incidentCode,
                type: nextProps.type,
                reportedBy: nextProps.reportedBy,
                dateOfIncident: nextProps.dateOfIncident,
                description: nextProps.description,
                errorOnIncidentCode: undefined,
                errorOnDateOfIncident: undefined,
                errorOnDescription: undefined,

            }
        } else {
            return null;
        }

    }

    render() {
        const { _id, translate, assetsManager, user, auth } = this.props;
        var userlist = user.list;
        var assetlist = assetsManager.listAssets;
        const {
            incidentCode, type, asset, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnDateOfIncident, errorOnDescription
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-incident"
                    formID="form-edit-incident"
                    title="Chỉnh sửa báo cáo sự cố tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-incident">
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
                                <label>Tài sản</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`edit-incident-asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => ({ value: x._id, text: x.code + " - " + x.assetName }))}
                                            onChange={this.handleAssetChange}
                                            value={asset._id}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group`}>
                                <label>Người báo cáo</label>
                                <div>
                                    <div id="reportedByBox">
                                        <SelectBox
                                            id={`reportedBy${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleReportedByChange}
                                            value={reportedBy}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group ${errorOnDateOfIncident === undefined ? "" : "has-error"}`}>
                                <label>Thời gian phát hiện sự cố<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-dateOfIncident-${_id}`}
                                    value={dateOfIncident}
                                    onChange={this.handleDateOfIncidentChange}
                                />
                                <ErrorLabel content={errorOnDateOfIncident} />
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
    const { assetsManager, auth, user } = state;
    return { assetsManager, auth, user };
};

const actionCreators = {
    updateIncident: IncidentActions.updateIncident,
};

const editForm = connect(mapState, actionCreators)(withTranslate(IncidentEditForm));
export { editForm as IncidentEditForm };