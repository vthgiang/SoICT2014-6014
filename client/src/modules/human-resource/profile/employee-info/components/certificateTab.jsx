import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../../auth/redux/actions';
import { FieldsActions } from '../../../field/redux/actions';
function CertificateTab(props) {
    const [state, setState] = useState({

    })

    useEffect(() => {
        props.getListFields()
    }, [])

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                degrees: props.degrees,
                certificates: props.certificates,
            }
        })
    }, [props.id])

    const { translate, field } = props;

    const { id, degrees, certificates } = state;
    let listFields = field.listFields;

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

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }

    // console.log('listFields', listFields)

    return (
        <div id={id} className="tab-pane">
            <div className="box-body">
                {/* Danh sách bằng cấp */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.diploma')}</h4></legend>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.name_diploma')}</th>
                                <th>{translate('human_resource.profile.diploma_issued_by')}</th>
                                <th>{translate('human_resource.profile.career_fields')}</th>
                                <th>{translate('human_resource.profile.graduation_year')}</th>
                                <th>{translate('human_resource.profile.ranking_learning')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (degrees && degrees.length !== 0) &&
                                degrees.map((x, index) => {
                                    let field = '';
                                    if (x.field) {
                                        field = listFields.find(y => y._id.toString() === x.field.toString());
                                        if (field) {
                                            field = field.name
                                        } else {
                                            field = 'DELETED'
                                        }
                                    }
                                    return (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{field}</td>
                                            <td>{x.year}</td>
                                            <td>{translate(`human_resource.profile.${x.degreeType}`)}</td>
                                            <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {
                        (!degrees || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </fieldset>
                {/* Danh sách chứng chỉ */}
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('human_resource.profile.certificate')}</h4></legend>
                    <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                        <thead>
                            <tr>
                                <th>{translate('human_resource.profile.name_certificate')}</th>
                                <th>{translate('human_resource.profile.issued_by')}</th>
                                <th>{translate('human_resource.profile.date_issued')}</th>
                                <th>{translate('human_resource.profile.end_date_certificate')}</th>
                                <th>{translate('human_resource.profile.attached_files')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                certificates && certificates.length !== 0 &&
                                certificates.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.name}</td>
                                        <td>{x.issuedBy}</td>
                                        <td>{formatDate(x.startDate)}</td>
                                        <td>{formatDate(x.endDate)}</td>
                                        <td>{!x.urlFile ? translate('human_resource.profile.no_files') :
                                            <a className='intable'
                                                style={{ cursor: "pointer" }}
                                                onClick={(e) => requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                <i className="fa fa-download"> &nbsp;Download!</i>
                                            </a>
                                        }</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {(!certificates || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                </fieldset>
            </div>
        </div>

    );
};

function mapState(state) {
    const { field } = state;
    return { field };
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
    getListFields: FieldsActions.getListFields,
};

const tabCertificate = connect(mapState, actionCreators)(withTranslate(CertificateTab));
export { tabCertificate as CertificateTab };