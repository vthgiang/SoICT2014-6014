import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../../../common-components';
import { formatFullDate } from '../../../../../../helpers/formatDate';

function BillLogs(props) {

    const { logs, group, translate } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-logs-version-bill`}
                formID={`form-detail-logs-version-bill`}
                title={translate(`manage_warehouse.bill_management.detail_version.${group}`)}
                size={75}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-logs-version-bill`}>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{translate('manage_warehouse.bill_management.lot')}</legend>

                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th title={translate('manage_warehouse.bill_management.index')}>{translate('manage_warehouse.bill_management.index')}</th>
                                    <th title={translate('manage_warehouse.bill_management.updateror')}>{translate('manage_warehouse.bill_management.updateror')}</th>
                                    <th title="version">Version</th>
                                    <th title={translate('manage_warehouse.bill_management.createAt')}>{translate('manage_warehouse.bill_management.createAt')}</th>
                                    <th title={translate('manage_warehouse.bill_management.title')}>{translate('manage_warehouse.bill_management.title')}</th>
                                </tr>
                            </thead>
                            <tbody id={`version-bill`}>
                                {
                                    (typeof logs !== 'undefined' && logs.length > 0) ?
                                        logs.map((x, index) =>
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{x.creator ? x.creator.name : 'Creator is deleted'}</td>
                                                <td>{x.versions}</td>
                                                <td>{x.createAt ? formatFullDate(x.createAt) : ''}</td>
                                                <td>{translate(`manage_warehouse.bill_management.billType.${x.title}`)}</td>
                                            </tr>
                                        ) : <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr>
                                }
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BillLogs));