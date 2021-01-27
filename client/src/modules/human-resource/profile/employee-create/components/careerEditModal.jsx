import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, TreeSelect, SelectBox } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
class CareerEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    /**
     * Function format ngày hiện tại thành dạnh mm-yyyy
     * @param {*} date : Ngày muốn format
     */
    formatDate = (date) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [day, month, year].join('-');
        }
        return date;
    }

    handleAction = (value) => {
        let { career } = this.props;
        let listAction = career?.listAction.map(elm => { return { ...elm, id: elm._id } });

        let action = listAction?.filter(e => value.indexOf(e._id) !== -1);

        console.log('action', action);
        this.setState({ action: action });
    };

    handleField = (value) => {
        let { career } = this.props;
        let listField = career?.listField.map(elm => { return { ...elm, id: elm._id } });
        let field = listField?.find(e => e._id === value[0]);

        console.log('valueeeee', value, field);
        this.setState({ field: field });
    };

    handlePosition = (value) => {
        let { career } = this.props;
        let listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        let position = listPosition?.find(e => e._id === value[0]);

        let pkg = position.package;
        this.setState({ position: position });
    };

    handleChangePackage = (e) => {
        let { value } = e.target;
        this.setState({ package: value });
    };

    /** Bắt sự kiện thay đổi file đính kèm */
    handleChangeFile = (value) => {
        if (value.length !== 0) {
            this.setState({
                file: value[0].fileName,
                urlFile: value[0].urlFile,
                fileUpload: value[0].fileUpload

            })
        } else {
            this.setState({
                file: "",
                urlFile: "",
                fileUpload: ""
            })
        }
    }

    /**
     * Bắt sự kiện thay đổi ngày cấp
     * @param {*} value : Ngày cấp
     */
    handleStartDateChange = (value) => {
        const { translate } = this.props;
        let { errorOnEndDate, endDate } = this.state;

        let errorOnStartDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partEndDate = endDate.split('-');
        let d = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'));

        if (date.getTime() > d.getTime()) {
            errorOnStartDate = translate('human_resource.profile.start_date_before_end_date');
        } else {
            errorOnEndDate = undefined;
        }

        console.log('start', value);
        this.setState({
            startDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /**
     * Bắt sự kiện thay đổi ngày hết hạn
     * @param {*} value : Ngày hết hạn
     */
    handleEndDateChange = (value) => {
        const { translate } = this.props;
        let { startDate, errorOnStartDate } = this.state;

        let errorOnEndDate;
        let partValue = value.split('-');
        let date = new Date([partValue[2], partValue[1], partValue[0]].join('-'));

        let partStartDate = startDate.split('-');
        let d = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'));

        if (d.getTime() > date.getTime()) {
            errorOnEndDate = translate('human_resource.profile.end_date_after_start_date');
        } else {
            errorOnStartDate = undefined;
        }

        console.log('end', value);
        this.setState({
            endDate: value,
            errorOnStartDate: errorOnStartDate,
            errorOnEndDate: errorOnEndDate
        })
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    isFormValidated = () => {
        const { name, issuedBy, startDate, endDate } = this.state;
        let result //  = this.validateNameCertificate(name, false) && this.validateIssuedByCertificate(issuedBy, false);
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        if (endDate) {
            let partEnd = endDate.split('-');
            let endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
            if (new Date(startDateNew).getTime() <= new Date(endDateNew).getTime()) {
                return result;
            } else return false;
        } else {
            return result;
        }
    }

    /** Bắt sự kiện submit form */
    save = async () => {
        const { startDate, endDate } = this.state;
        let partStart = startDate.split('-');
        let startDateNew = [partStart[2], partStart[1], partStart[0]].join('-');
        let endDateNew = null;
        if (endDate) {
            let partEnd = endDate.split('-');
            endDateNew = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        };

        // let data = this.state;
        // let career = {
        //     careerFieldName: data.field?.name,
        //     careerFieldCode: data.field?.code,
        //     careerPositionName: data.position?.name,
        //     careerPositionCode: data.position?.code,
        //     careerActionName: data.action?.name,
        //     careerActionCode: data.action?.code,
        //     startDate: startDateNew, 
        //     endDate: endDateNew,
        //     file: data.file,
        //     urlFile: data.urlFile,
        //     fileUpload: data.fileUpload,
        // }
        // return this.props.handleChange(career);
        console.log("---", this.state);
        return this.props.handleChange({ ...this.state, startDate: startDateNew, endDate: endDateNew });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            console.log('nextProps', nextProps);
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                package: nextProps.package,
                position: nextProps.position,
                action: nextProps.action,
                field: nextProps.field,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                file: nextProps.file,
                urlFile: nextProps.urlFile,
                fileUpload: nextProps.fileUpload,
                errorOnName: undefined,
                errorOnUnit: undefined,
                errorOnStartDate: undefined,
                errorOnEndDate: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, career } = this.props;

        const { id } = this.props;

        const { field, position, action, endDate, startDate, errorOnName, errorOnUnit, errorOnEndDate, errorOnStartDate } = this.state;

        let listAction = [], listPosition = [], listField = [];
        listAction = career?.listAction.filter(e => e.isLabel !== 1).map(elm => { return { ...elm, id: elm._id } });
        listPosition = career?.listPosition.map(elm => { return { ...elm, id: elm._id } });
        listField = career?.listField.map(elm => { return { ...elm, id: elm._id } });

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-career-${id}`} isLoading={false}
                    formID={`form-edit-career-${id}`}
                    title={"Chỉnh sửa công việc tương đương"}
                    func={this.save}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-career-${id}`}>
                        <div className="form-group">
                            <label>Lĩnh vực công việc</label>
                            <TreeSelect data={listField} value={field?._id} handleChange={this.handleField} mode="radioSelect" />
                        </div>
                        {/* <div className="form-group">
                            <label>Gói thầu: </label> {this.state.package ? this.state.package : "Chưa có"}
                        </div> */}
                        <div className="form-group">
                            <label>Gói thầu</label> 
                            {/* {this.state.package ? this.state.package : "Chưa có"} */}
                            <input type="text" className="form-control" name="package" value={this.state.package} onChange={this.handleChangePackage} />
                        </div>
                        <div className="form-group">
                            <label>Vị trí công việc</label>
                            <TreeSelect data={listPosition} value={position?._id} handleChange={this.handlePosition} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Hoạt động công việc</label>
                            {/* <TreeSelect data={listAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" /> */}
                            <SelectBox
                                id={`edit-career-action-select-${id}`}
                                lassName="form-control select2"
                                style={{ width: "100%" }}
                                items={listAction.map(x => {
                                    return { text: x.name, value: x._id }
                                })}
                                options={{ placeholder: "Chọn hoạt động công việc" }}
                                onChange={this.handleAction}
                                value={action?.map(e => e?._id)}
                                multiple={true}
                            />
                        </div>
                        <div className="row">
                            {/* Ngày cấp */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>Ngày bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Ngày hết hạn */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>ngày kết thúc</label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    deleteValue={true}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </div>
                        {/* File đính kèm */}
                        <div className="form-group">
                            <label htmlFor="file">{translate('human_resource.profile.attached_files')}</label>
                            <UploadFile onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { career } = state;
    return { career };
}

const addModal = connect(mapState, null)(withTranslate(CareerEditModal));
export { addModal as CareerEditModal };
