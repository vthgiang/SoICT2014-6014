import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../../env';
class CertificateTab extends Component {
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
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                degrees: nextProps.degrees,
                certificates: nextProps.certificates,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { degrees, certificates } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.diploma')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.name_diploma')}</th>
                                    <th>{translate('manage_employee.diploma_issued_by')}</th>
                                    <th>{translate('manage_employee.graduation_year')}</th>
                                    <th>{translate('manage_employee.ranking_learning')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof degrees !== 'undefined' && degrees.length !== 0) &&
                                    degrees.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{x.year}</td>
                                            <td>{translate(`manage_employee.${x.degreeType}`)}</td>
                                            <td>{(typeof x.urlFile === 'undefined' || x.urlFile === 0) ? translate('manage_employee.no_files') :
                                                <a className='intable'
                                                    href={LOCAL_SERVER_API + x.urlFile} target="_blank"
                                                    download={x.name}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof degrees === 'undefined' || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.certificate')}</h4></legend>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.name_certificate')}</th>
                                    <th>{translate('manage_employee.issued_by')}</th>
                                    <th>{translate('manage_employee.date_issued')}</th>
                                    <th>{translate('manage_employee.end_date_certificate')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (typeof certificates === 'undefined' || certificates.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                        certificates.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.name}</td>
                                                <td>{x.issuedBy}</td>
                                                <td>{this.formatDate(x.startDate)}</td>
                                                <td>{this.formatDate(x.endDate)}</td>
                                                <td>{(typeof x.urlFile === 'undefined' || x.urlFile === 0) ? translate('manage_employee.no_files') :
                                                    <a className='intable'
                                                        href={LOCAL_SERVER_API + x.urlFile} target="_blank"
                                                        download={x.name}>
                                                        <i className="fa fa-download"> &nbsp;Download!</i>
                                                    </a>
                                                }</td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof certificates === 'undefined' || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>

        );
    }
};
const tabCertificate = connect(null, null)(withTranslate(CertificateTab));
export { tabCertificate as CertificateTab };