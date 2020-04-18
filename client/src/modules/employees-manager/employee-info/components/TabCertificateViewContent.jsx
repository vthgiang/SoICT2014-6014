import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
class TabCertificateViewContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                certificate: nextProps.certificate,
                certificateShort: nextProps.certificateShort,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { certificate, certificateShort } = this.state;
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
                                    (typeof certificate !== 'undefined' && certificate.length !== 0) &&
                                    certificate.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameCertificate}</td>
                                            <td>{x.addressCertificate}</td>
                                            <td>{x.yearCertificate}</td>
                                            <td>{translate(`manage_employee.${x.typeCertificate}`)}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof certificate === 'undefined' || certificate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
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
                                    (typeof certificateShort === 'undefined' || certificateShort.length === 0) ? <tr><td colSpan={5}><center> Không có dữ liệu</center></td></tr> :
                                        certificateShort.map((x, index) => (
                                            <tr key={index}>
                                                <td>{x.nameCertificateShort}</td>
                                                <td>{x.unit}</td>
                                                <td>{x.startDate}</td>
                                                <td>{x.endDate}</td>
                                                <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? "Chưa có file" :
                                                    <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                                </td>
                                            </tr>
                                        ))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof certificateShort === 'undefined' || this.state.certificateShort.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>

        );
    }
};
const tabCertificate = connect(null, null)(withTranslate(TabCertificateViewContent));
export { tabCertificate as TabCertificateViewContent };