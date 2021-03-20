import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, DatePicker } from '../../../../../common-components';

import { createUnitKpiActions } from '../redux/actions';

class OrganizationalUnitKpiCreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnitId: null,
            organizationalUnit: "",
            month: "",
        };
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.organizationalUnitId !== prevState.organizationalUnitId
            || nextProps.month !== prevState.month
        ) {
            return {
                ...prevState,
                organizationalUnitId: nextProps.organizationalUnitId,
                organizationalUnit: nextProps.organizationalUnit,
                month: nextProps.month
            }
        } else {
            return null;
        }
    }

    formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [month, year].join('-');
    }
    
    handleSubmit = () => {
        const { organizationalUnit, month } = this.state;

        if (organizationalUnit && month) {            
            this.props.addKPIUnit({
                organizationalUnitId: organizationalUnit.id,
                month: month
            });

            window.$("#startKPIUnit").modal("hide");
        }

    }
    
    render() {
        const { translate, createKpiUnit } = this.props; 
        const { organizationalUnit, month } = this.state;
        let parentKpi;

        if (createKpiUnit) {
            parentKpi = createKpiUnit?.parent?.kpis;
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID="startKPIUnit" isLoading={false}
                    formID="formStartKPIUnit"
                    title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                    func={this.handleSubmit}
                >
                    {/* Form khởi tạo KPI đơn vị */}
                    <form id="formStartKPIUnit" onSubmit={() => this.handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                        
                        {/* Đơn vị */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.organizational_unit')}</label>
                            <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>
                        
                        {/* Tháng */}
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.month')}</label>
                            {this.formatDate(month)}
                        </div>

                        {/* Mục tiêu mặc định */}
                        <div className="form-group">
                            <label className="col-sm-12">{translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.default_target')}</label>
                            <ul>
                                {parentKpi?.length > 0
                                    && parentKpi.filter(item => item?.type !== 0)
                                        .map(
                                            item => <li key={item?._id}>{item?.name} (5)</li>
                                        )
                                }
                            </ul>
                        </div>

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}


function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    addKPIUnit: createUnitKpiActions.addKPIUnit
};
const connectedOrganizationalUnitKpiCreateModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreateModal));
export { connectedOrganizationalUnitKpiCreateModal as OrganizationalUnitKpiCreateModal };
