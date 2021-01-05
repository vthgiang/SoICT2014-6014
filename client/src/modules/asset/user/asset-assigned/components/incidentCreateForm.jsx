import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';

import { UserActions } from '../../../../super-admin/user/redux/actions';
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions';
import { IncidentActions } from '../redux/actions';
import { generateCode } from "../../../../../helpers/generateCode";

class IncidentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateOfIncident: this.formatDate(Date.now()), // Ngày phát hiện
        };
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

    // Bắt sự kiện thay đổi mã sự cố
    handleIncidentCodeChange = (e) => {
        const { translate } = this.props;
        const { value } = e.target;

        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({
            incidentCode: value,
            errorOnIncidentCode: message,
        })
    }

    // Bắt sự kiện thay đổi loại sự cố
    handleTypeChange = (e) => {
        const { translate } = this.props;
        const { value } = e.target;
        let { assetStatus } = this.state;

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

    handleStatusAsset = (value) => {
        this.setState({
            assetStatus: value[0],
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
        const { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        this.setState({
            dateOfIncident: value,
            errorOnDateOfIncident: message,
        })
    }

    //8. Bắt sự kiện thay đổi "Nội dung sự cố"
    handleDescriptionChange = (e) => {
        const { translate } = this.props;
        const { value } = e.target;

        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({
            description: value,
            errorOnDescription: message,
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        const { type, dateOfIncident, description } = this.state;
        const { translate } = this.props;

        if (!ValidationHelper.validateEmpty(translate, type).status
            || !ValidationHelper.validateEmpty(translate, dateOfIncident).status
            || !ValidationHelper.validateEmpty(translate, description).status)
            return false;
        return true;
    }

    // Bắt sự kiện submit form
    save = () => {
        const { incidentCode, type, description, assetStatus } = this.state;
        let { dateOfIncident } = this.state;

        const partIncident = dateOfIncident.split('-');
        dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-');
        const assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;

        if (this.isFormValidated()) {
            let dataToSubmit = {
                incidentCode: incidentCode,
                type: type,
                reportedBy: this.props.auth.user._id,
                dateOfIncident: dateOfIncident,
                description: description,
                statusIncident: 1,
                assetStatus: assetStatus,
                assetId
            }

            return this.props.createIncident(assetId, dataToSubmit).then(({ response }) => {
                if (response.data.success) {
                    this.props.getAllAsset({
                        code: "",
                        assetName: "",
                        month: null,
                        status: "",
                        page: 0,
                        // limit: 5,
                    });
                }
            });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            const { status } = nextProps.asset;
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                assetStatus: status,
                type: "",
            }
        } else {
            return null;
        }
    }

    regenerateCode = () => {
        let code = generateCode("IC");
        this.setState((state) => ({
            ...state,
            incidentCode: code,
        }));
    }

    componentDidMount = () => {
        // Mỗi khi modal mở, cần sinh lại code
        window.$(`#modal-create-assetcrash`).on('shown.bs.modal', this.regenerateCode);
    }

    componentWillUnmount = () => {
        // Unsuscribe event
        window.$(`#modal-create-assetcrash`).unbind('shown.bs.modal', this.regenerateCode)
    }


    render() {
        const { _id } = this.props;
        const { translate, assetsManager, user, auth } = this.props;
        const { incidentCode, type, assetStatus, asset, reportedBy, dateOfIncident, description, errorOnIncidentCode, errorOnIncidentType, errorOnDateOfIncident, errorOnDescription } = this.state;

        var userlist = user.list;
        var assetlist = assetsManager.listAssets;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-create-assetcrash"
                    formID="form-create-assetcrash"
                    title={translate('asset.incident.report_incident')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm thông tin sự cố */}
                    <form className="form-group" id="form-create-assetcrash">

                        <div className="col-md-12">
                            {/* Mã sự cố */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.incident_code')}</label>
                                <input type="text" className="form-control" name="incidentCode" value={incidentCode ? incidentCode : ""} onChange={this.handleIncidentCodeChange} autoComplete="off" placeholder={translate('asset.general_information.incident_code')} />
                            </div>

                            {/* Phân loại */}
                            <div className={`form-group ${!errorOnIncidentType ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.type')}<span className="text-red">*</span></label>
                                <select className="form-control" value={type ? type : ""} name="type" onChange={this.handleTypeChange}>
                                    <option value="">{`---${translate('asset.general_information.select_incident_type')}---`} </option>
                                    <option value="1">{translate('asset.general_information.damaged')}</option>
                                    <option value="2">{translate('asset.general_information.lost')}</option>
                                </select>
                                <ErrorLabel content={errorOnIncidentType} />
                            </div>

                            {/* Trạng thái tài sản */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.asset_status')}</label>
                                <SelectBox
                                    id={`status-asset-${type}`}
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
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`add-incident-asset${_id}`}
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
                                            value={auth.user._id}
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
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { assetsManager, user, auth } = state;
    return { assetsManager, user, auth };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    createIncident: IncidentActions.createIncident,
};

const createForm = connect(mapState, actionCreators)(withTranslate(IncidentCreateForm));
export { createForm as IncidentCreateForm };

