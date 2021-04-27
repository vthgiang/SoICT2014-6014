import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ExportExcel } from '../../../../../common-components'
import { AuthActions } from '../../../../auth/redux/actions'
function InsurranceTab(props) {

    const [state, setState] = useState({

    })

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm , false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
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
        return date;

    }

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                socialInsuranceDetails: props.socialInsuranceDetails,
                healthInsuranceNumber: props.employee ? props.employee.healthInsuranceNumber : '',
                healthInsuranceStartDate: props.employee ? props.employee.healthInsuranceStartDate : '',
                healthInsuranceEndDate: props.employee ? props.employee.healthInsuranceEndDate : '',
                socialInsuranceNumber: props.employee ? props.employee.socialInsuranceNumber : '',
                healthInsuranceAttachment: props.employee ? props.employee.healthInsuranceAttachment : '',
            }
        })
    }, [props.id])

    const { translate } = props;

    const { id, healthInsuranceNumber, healthInsuranceStartDate, healthInsuranceEndDate, socialInsuranceNumber, socialInsuranceDetails, healthInsuranceAttachment } = state;

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(`.${path}`, fileName);
    }

    /**
     * Function chyển đổi quá trình đóng bảo hiểm thành dạng dữ liệu dùng export
     * @param {*} data : quá trình đóng bảo hiểm
     */
    const convertDataToExportData = (data) => {
        const { translate, employee } = props;

        data = data?.map((x, index) => {
            return {
                STT: index + 1,
                startDate: formatDate(x.startDate, true),
                endDate: formatDate(x.endDate, true),
                company: x.company,
                position: x.position
            }
        })
        let exportData = {
            fileName: translate('human_resource.profile.employee_info.export_bhxh'),
            dataSheets: [
                {
                    sheetName: "Sheet1",
                    sheetTitle: `${translate('human_resource.profile.employee_info.export_bhxh')}: ${employee.fullName} - ${employee.employeeNumber}`,
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: translate('human_resource.stt') },
                                { key: "startDate", value: translate('human_resource.profile.from_month_year') },
                                { key: "endDate", value: translate('human_resource.profile.to_month_year') },
                                { key: "company", value: translate('human_resource.profile.unit') },
                                { key: "position", value: translate('table.position') }
                            ],
                            data: data
                        },
                    ]
                },
            ]
        }
        return exportData
    }

    let exportData = convertDataToExportData(socialInsuranceDetails);


    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhxh')}</h4></legend>
                    {/* Mã bảo hiểm xã hội */}
                    <div className="form-group">
                        <strong>{translate('human_resource.profile.number_BHXH')}&emsp; </strong>
                        {socialInsuranceNumber}
                    </div>
                    <ExportExcel id="detail-export-bhxh" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginBottom: 10 }} />
                    <h4 className="col-md-6" style={{ paddingLeft: 0, fontSize: 16 }}>{translate('human_resource.profile.bhxh_process')}:</h4>
                    <table className="table table-striped table-bordered table-hover " style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.from_month_year')}</th>
                                <th>{translate('human_resource.profile.to_month_year')}</th>
                                <th>{translate('human_resource.profile.unit')}</th>
                                <th>{translate('table.position')}</th>
                                <th>{translate('human_resource.profile.money')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (socialInsuranceDetails && socialInsuranceDetails.length !== 0) &&
                                socialInsuranceDetails.map((x, index) => (
                                    <tr key={index}>
                                        <td>{formatDate(x.startDate, true)}</td>
                                        <td>{formatDate(x.endDate, true)}</td>
                                        <td>{x.company}</td>
                                        <td>{x.position}</td>
                                        <td>{x.money}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {(!socialInsuranceDetails || socialInsuranceDetails.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                </fieldset>
                {/* Thông tin bảo hiểm y tê */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.bhyt')}</h4></legend>
                    <div className="row">
                        {/* Mã bảo hiểm y tế */}
                        <div className="form-group col-md-4" >
                            <strong>{translate('human_resource.profile.number_BHYT')}&emsp; </strong>
                            {healthInsuranceNumber}
                        </div>
                        {/* Ngày có hiệu lực */}
                        <div className="form-group col-md-4" >
                            <strong>{translate('human_resource.profile.start_date')}&emsp; </strong>
                            {formatDate(healthInsuranceStartDate)}
                        </div>
                        {/* Ngày hết hiệu lực */}
                        <div className="form-group col-md-4" >
                            <strong>{translate('human_resource.profile.end_date_certificate')}&emsp; </strong>
                            {formatDate(healthInsuranceEndDate)}
                        </div>
                        {/* file đính kèm */}
                        <div className="form-group col-md-6" >
                            <strong>{translate('human_resource.profile.attached_files')}&emsp; </strong>
                            {
                                healthInsuranceAttachment && healthInsuranceAttachment.map((obj, index) => (
                                    <li key={index}><a href="" title="Tải xuống" onClick={(e) => requestDownloadFile(e, obj.url, obj.fileName)}>{obj.fileName}</a></li>
                                ))
                            }
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

const actions = {
    downloadFile: AuthActions.downloadFile,
}

const tabInsurrance = connect(null, actions)(withTranslate(InsurranceTab));
export { tabInsurrance as InsurranceTab };