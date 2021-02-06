import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';

import parse from 'html-react-parser';

class DetailOfEmployeeKpiDialogModal extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    formatStatus = (status) => {
        const { translate } = this.props;

        if (status === 0) {
            return "Yêu cầu làm lại";
        } else if (status === 1) {
            return "Đã kích hoạt";
        } else if (status === 2) {
            return "Đã kết thúc";
        } else {
            return "Chưa phê duyệt";
        } 
    }

    render() {
        const { translate } = this.props;
        const { listEmployeeKpi } = this.props;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-employee-kpi-detail" 
                    title={translate('kpi.organizational_unit.statistics.detail_employee_kpi')}
                    size="75"
                    hasNote={false}
                    hasSaveButton={false}
                >
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')} style={{ width: "40px" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.target_name')}</th>
                                <th title={translate('kpi.organizational_unit.management.over_view.creator')}>{translate('kpi.organizational_unit.management.over_view.creator')}</th>
                                <th title={translate('kpi.organizational_unit.statistics.email')}>{translate('kpi.organizational_unit.statistics.email')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.evaluation_criteria')}</th>
                                <th title={translate('general.status')}>{translate('general.status')}</th>
                                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')} style={{ textAlign: "left" }}>{translate('kpi.organizational_unit.create_organizational_unit_kpi_set.weight')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                listEmployeeKpi && listEmployeeKpi.length !== 0 ?
                                    listEmployeeKpi.map((item, index) =>
                                        <tr key={item._id}>
                                            <td>{index + 1}</td>
                                            <td title={item.name}>{item.name}</td>
                                            <td title={item.creatorInfo.name && item.creatorInfo.name.length !== 0 && item.creatorInfo.name[0]}>
                                                {item.creatorInfo.name && item.creatorInfo.name.length !== 0 && item.creatorInfo.name[0]}
                                            </td>
                                            <td title={item.creatorInfo.email && item.creatorInfo.email.length !== 0 && item.creatorInfo.email[0]}>
                                                {item.creatorInfo.email && item.creatorInfo.email.length !== 0 && item.creatorInfo.email[0]}
                                            </td>
                                            <td title={parse(item.criteria)}>{parse(item.criteria)}</td>
                                            <td title={item.status}>{this.formatStatus(item.status)}</td>
                                            <td title={item.weight} style={{ textAlign: "left" }}>{item.weight}</td>
                                        </tr>
                                    )
                                    : <tr>
                                        <td colspan="7">{translate('kpi.organizational_unit.kpi_organizational_unit_manager.no_data')}</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </DialogModal>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailOfEmployeeKpiDialogModal = connect(mapState, actions)(withTranslate(DetailOfEmployeeKpiDialogModal));
export { connectDetailOfEmployeeKpiDialogModal as DetailOfEmployeeKpiDialogModal }