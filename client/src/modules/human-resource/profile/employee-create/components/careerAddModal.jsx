import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, UploadFile, TreeSelect } from '../../../../../common-components';

import { EmployeeCreateValidator } from './combinedContent';
class CareerAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.formatDate(Date.now()),
            endDate: "",
            position: {},
            field: {},
            action: {},
            urlFile: "",
            fileUpload: "",
            file: "",
        }
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
        let listAction = career?.listAction.map(elm => {return { ...elm, id: elm._id } });
        let action = listAction?.find(e=> e._id === value[0]);
        
        this.setState({ action: action });
    };

    handleField = (value) => {
        let { career } = this.props;
        let listField = career?.listField.map(elm => {return { ...elm, id: elm._id } });
        let field = listField?.find(e=> e._id === value[0]);
        
        console.log('valueeeee', value, field);
        this.setState({ field: field });
    };

    handlePosition = (value) => {
        let { career } = this.props;
        let listPosition = career?.listPosition.map(elm => {return { ...elm, id: elm._id } });
        let position = listPosition?.find(e=> e._id === value[0]);
        
        this.setState({ position: position });
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

        return this.props.handleChange({ ...this.state, startDate: startDateNew, endDate: endDateNew });
    }

    render() {
        const { translate, career } = this.props;

        const { id } = this.props;

        const { field, position, action, endDate, startDate, errorOnEndDate, errorOnStartDate } = this.state;

        let listAction = [], listPosition = [], listField = [];
        listField = career?.listField.map(elm => {return { ...elm, id: elm._id } });
        listPosition = career?.listPosition.map(elm => {return { ...elm, id: elm._id } })
        // .map(i => {
        //     if(field?.id){
        //         return field.position.filter(e => e.code.indexOf(i.code));
        //     }
        // });
        console.log('listposition', listPosition);
        listAction = career?.listAction.map(elm => {return { ...elm, id: elm._id } });

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-career-${id}`} button_name={translate('modal.create')} title={translate('human_resource.profile.add_certificate')} />
                <DialogModal
                    size='50' modalID={`modal-create-career-${id}`} isLoading={false}
                    formID={`form-create-career-${id}`}
                    title={"Thêm mới công việc tương đương"}
                    func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-career-${id}`}>
                        <div className="form-group">
                            <label>Lĩnh vực công việc</label>
                            <TreeSelect data={listField} value={field?.id} handleChange={this.handleField} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Vị trí công việc</label>
                            <TreeSelect data={listPosition} value={position?.id} handleChange={this.handlePosition} mode="radioSelect" />
                        </div>
                        <div className="form-group">
                            <label>Hoạt động công việc</label>
                            <TreeSelect data={listAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" />
                        </div>
                        <div className="row">
                            {/* Ngày cấp */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnStartDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.date_issued')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date-${id}`}
                                    deleteValue={false}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            {/* Ngày hết hạn */}
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnEndDate && "has-error"}`}>
                                <label>{translate('human_resource.profile.end_date_certificate')}</label>
                                <DatePicker
                                    id={`add-end-date-${id}`}
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

const addModal = connect(mapState, null)(withTranslate(CareerAddModal));
export { addModal as CareerAddModal };
