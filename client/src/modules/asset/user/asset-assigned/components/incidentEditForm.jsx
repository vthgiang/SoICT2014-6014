import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { ManageIncidentActions } from '../../../admin/incident/redux/actions';
import { AssetCreateValidator } from '../../../base/create-tab/components/assetCreateValidator';
import ValidationHelper from '../../../../../helpers/validationHelper';
class IncidentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managedBy: this.props.managedBy ? this.props.managedBy : ''
        };
    }

    // Bắt sự kiện thay đổi mã sự cố
    handleIncidentCodeChange = (e) => {
        let { value } = e.target;
        const { translate } = this.state;

        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({
            incidentCode: value,
            errorOnIncidentCode: message,
        })
    }

    // Bắt sự kiện thay đổi loại sự cố
    handleTypeChange = (value) => {
        const { translate } = this.props;
        let { assetStatus } = this.state;
        value = value[0];

        let { message } = ValidationHelper.validateEmpty(translate, value);
        switch (value) {
            case '1':
                assetStatus = 'broken';
                this.setState({
                    type: value,
                    assetStatus,
                    errorOnIncidentType: message,
                })
                break;

            case '2':
                assetStatus = 'lost';
                this.setState({
                    type: value,
                    assetStatus,
                    errorOnIncidentType: message,
                })
                break;
            default:
                this.setState({
                    type: value,
                    assetStatus,
                    errorOnIncidentType: message,
                })

        }
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

    // Bắt sự kiện thay đổi "Thời gian phát hiện"
    handleDateOfIncidentChange = (value) => {
        const { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        this.setState({
            dateOfIncident: value,
            errorOnDateOfIncident: message,
        })
    }

    // Bắt sự kiện thay đổi "Nội dung sự cố"
    handleDescriptionChange = (e) => {
        const { translate } = this.props;
        let { value } = e.target;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        this.setState({
            description: value,
            errorOnDescription: message,
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { incidentCode, type, dateOfIncident, description } = this.state;
        const { translate } = this.props;

        if (!ValidationHelper.validateName(translate, incidentCode).status
            || !ValidationHelper.validateEmpty(translate, type).status
            || !ValidationHelper.validateEmpty(translate, dateOfIncident).status
            || !ValidationHelper.validateEmpty(translate, description).status)
            return false;
        return true;
    }

    handleStatusIncidentChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            statusIncident: value
        })
    }

    save = () => {
        let { managedBy, assetStatus } = this.state;
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
                statusIncident: this.state.statusIncident,
                assetStatus,
                assetId
            }
            return this.props.updateIncident(this.props._id, dataToSubmit, managedBy);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                assetStatus: nextProps.asset.status,
                incidentCode: nextProps.incidentCode,
                type: nextProps.type,
                reportedBy: nextProps.reportedBy,
                dateOfIncident: nextProps.dateOfIncident,
                description: nextProps.description,
                statusIncident: nextProps.statusIncident,
                errorOnIncidentCode: undefined,
                errorOnDateOfIncident: undefined,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    handleStatusAsset = (value) => {
        this.setState({
            assetStatus: value[0],
        })
    }

    render() {
        const { _id } = this.props;
        const { translate, assetsManager, user } = this.props;
        const {
            incidentCode, type, asset, assetStatus, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnIncidentType, errorOnDateOfIncident, errorOnDescription, statusIncident
        } = this.state;

        const userlist = user.list;
        let assetlist = assetsManager.listAssets;

        if (assetlist) {
            const checkExist = assetlist.some(obj => obj._id === asset._id);
            if (!checkExist) {
                assetlist = [...assetlist, asset];
            }
        }
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-edit-incident"
                    formID="form-edit-incident"
                    title={translate('asset.asset_info.edit_incident_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sự cố */}
                    <form className="form-group" id="form-edit-incident">

                        <div className="col-md-12">
                            {/* Mã sự cố */}
                            <div className={`form-group ${!errorOnIncidentCode ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.incident_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="incidentCode" value={incidentCode} onChange={this.handleIncidentCodeChange} autoComplete="off" placeholder={translate('asset.general_information.incident_code')} />
                                <ErrorLabel content={errorOnIncidentCode} />
                            </div>

                            {/* Phân loại */}
                            <div className={`form-group ${!errorOnIncidentType ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.incident_type')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`edit-type-incident-asset${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={type}
                                    items={[
                                        { value: '', text: `---${translate('asset.general_information.select_incident_type')}---` },
                                        { value: '1', text: translate('asset.general_information.damaged') },
                                        { value: '2', text: translate('asset.general_information.lost') },
                                    ]}
                                    onChange={this.handleTypeChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={errorOnIncidentType} />
                            </div>

                            {/* Trạng thái tài sản */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.asset_status')}</label>
                                <SelectBox
                                    id={`status-asset-${_id}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { value: '', text: `---${translate('asset.general_information.select_asset_status')}---` },
                                        { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                                        { value: 'in_use', text: translate('asset.general_information.using') },
                                        { value: 'broken', text: translate('asset.general_information.damaged') },
                                        { value: 'lost', text: translate('asset.general_information.lost') },
                                        { value: 'disposed', text: translate('asset.general_information.disposal') },
                                    ]}
                                    onChange={this.handleStatusAsset}
                                    value={assetStatus}
                                    multiple={false}
                                />
                            </div>

                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
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

                            {/* Người báo cáo */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.reported_by')}</label>
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

                            {/* Thời gian phát hiện sự cố */}
                            <div className={`form-group ${!errorOnDateOfIncident ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.date_incident')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-dateOfIncident-${_id}`}
                                    value={dateOfIncident}
                                    onChange={this.handleDateOfIncidentChange}
                                />
                                <ErrorLabel content={errorOnDateOfIncident} />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder={translate('asset.general_information.content')}></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>

                            {/* Trạng thái */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.status')}</label>
                                <select className="form-control" value={statusIncident} name="type" onChange={this.handleStatusIncidentChange}>
                                    <option value="1">{translate('asset.general_information.waiting')}</option>
                                    <option value="2">{translate('asset.general_information.processed')}</option>
                                </select>
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
    updateIncident: ManageIncidentActions.updateIncident,
};

const editForm = connect(mapState, actionCreators)(withTranslate(IncidentEditForm));
export { editForm as IncidentEditForm };

