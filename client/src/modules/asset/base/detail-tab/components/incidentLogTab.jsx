import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import { translate } from 'react-redux-multilingual/lib/utils';

function IncidentLogTab(props) {
    
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        id: null
    })

    useEffect(() => {
        props.getUser({ name: "" });
    }, [])
   

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
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

    if(prevProps.id !== props.id){
        setState({
                ...state,
                id: props.id,
                incidentLogs: props.incidentLogs,
                status: props.status
        })
        setPrevProps(props)
    }
   

    const formatType = (type) => {
        const { translate } = props;
        if (Number(type) === 1) {
            return translate('asset.general_information.damaged');
        } else if (Number(type) === 2) {
            return translate('asset.general_information.lost');
        } else {
            return '';
        }
    }
    const formatStatus = (status) => {
        const { translate } = props;

        if (status === 'ready_to_use') {
            return translate('asset.general_information.ready_use')
        }
        else if (status === 'in_use') {
            return translate('asset.general_information.using')
        }
        else if (status === 'broken') {
            return translate('asset.general_information.damaged')
        }
        else if (status === 'lost') {
            return translate('asset.general_information.lost')
        }
        else if (status === 'disposed') {
            return translate('asset.general_information.disposal')
        }
        else {
            return '';
        }
    }

    
    const { id } = props;
    const { translate, user } = props;
    const { incidentLogs, status } = state;

    var userlist = user.list;

    return (
        <div id={id} className="tab-pane">
            <div className="box-body qlcv">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('asset.general_information.incident_code')}</th>
                            <th>{translate('asset.general_information.incident_type')}</th>
                            <th>{translate('asset.general_information.reported_by')}</th>
                            <th>{translate('asset.general_information.date_incident')}</th>
                            <th>{translate('asset.general_information.content')}</th>
                            <th>{translate('asset.general_information.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(incidentLogs && incidentLogs.length !== 0) &&
                            incidentLogs.map((x, index) => (
                                <tr key={index}>
                                    <td>{x.incidentCode}</td>
                                    <td>{formatType(x.type)}</td>
                                    <td>{x.reportedBy ? (userlist.length && userlist.filter(item => item._id === x.reportedBy).pop() ? userlist.filter(item => item._id === x.reportedBy).pop().name : '') : ''}</td>
                                    <td>{x.dateOfIncident ? formatDate(x.dateOfIncident) : ''}</td>
                                    <td>{x.description}</td>
                                    <td>{formatStatus(status)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    (!incidentLogs || incidentLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
            </div>
        </div>
    );
};
function mapState(state) {
    const { user } = state;
    return { user };
};
const actionCreators = {
    getUser: UserActions.get,

};
const incidentLogTab = connect(mapState, actionCreators)(withTranslate(IncidentLogTab));
export { incidentLogTab as IncidentLogTab };