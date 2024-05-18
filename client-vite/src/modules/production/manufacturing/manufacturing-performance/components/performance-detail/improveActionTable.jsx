import React from 'react';
import IconButton from '@mui/material/IconButton';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import "./index.css"

const ImproveActionTable = (props) => {
    const { translate } = props;
    const tableId = "action-management-table";

    return (
        <div className="action_table">
            <div className="widget-header">
                <span className="action_table-title">{translate('manufacturing.performance.action_improvement')}</span>
                <IconButton sx={{ color: "#333" }}>
                    <i className="material-icons" style={{ fontWeight: "bold" }}>add</i>
                </IconButton>
            </div>
            <table id={tableId} className="table action_table-table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>{translate('manufacturing.performance.index')}</th>
                        <th>{translate('manufacturing.performance.problem')}</th>
                        <th>{translate('manufacturing.performance.root_cause')}</th>
                        <th>{translate('manufacturing.performance.action')}</th>
                        <th>{translate('manufacturing.performance.start_date')}</th>
                        <th>{translate('manufacturing.performance.responsible')}</th>
                        <th>{translate('manufacturing.quality.status')}</th>
                        <th>{translate('general.action')}</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
    )
}

export default connect(null, null)(withTranslate(ImproveActionTable));

