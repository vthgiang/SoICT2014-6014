import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';
import { DatePicker } from '../../../../../common-components';
import { DialogModal } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

class OrganizationalUnitKpiCreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnitKpi: {
                organizationalUnit: "",
                time: "",
                // creater: localStorage.getItem("id")
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    formatDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                organizationalUnitKpi: {
                    ...state.organizationalUnitKpi,
                    time: value
                }
            }
        })
    }
    handleSubmit = async () => {
        const { translate } = this.props;

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        if(this.state.organizationalUnitKpi.time === ""){
            await this.setState(state => {
                return {
                    ...state,
                    organizationalUnitKpi: {
                        ...state.organizationalUnitKpi,
                        time: defaultTime,
                    }
                }
            })
        }

        await this.setState(state => {
            return {
                ...state,
                organizationalUnitKpi: {
                    ...state.organizationalUnitKpi,
                    organizationalUnit: this.props.organizationalUnit,
                }
            }
        })
        var { organizationalUnitKpi } = this.state;
        
        if (organizationalUnitKpi.organizationalUnit && organizationalUnitKpi.time) {            
            this.props.addKPIUnit(organizationalUnitKpi);

            window.$("#startKPIUnit").modal("hide");
        }

    }
    
    render() {
        const { organizationalUnit } = this.props;
        
        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        var defaultTime =  [month, year].join('-');

        return (
            <React.Fragment>
                <DialogModal
                    modalID="startKPIUnit" isLoading={false}
                    formID="formStartKPIUnit"
                    title={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.initialize_kpi_set')}
                    msg_success={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.success')}
                    msg_faile={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.failure')}
                    func={this.handleSubmit}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form id="formStartKPIUnit" onSubmit={() => this.handleSubmit(translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.success'))}>
                        <div className="form-group">
                            <label className="col-sm-2">{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.organizational_unit')}</label>
                            <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{organizationalUnit && organizationalUnit.name}</label>
                        </div>
                        
                        <div className="form-group">
                            <label className="col-sm-2">{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.month')}</label>
                            <DatePicker
                                id="month"      
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultTime}                            // giá trị mặc định cho datePicker    
                                onChange={this.formatDate}
                                disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        <div className="form-group">
                            <label className="col-sm-12">{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_set_modal.default_target')}</label>
                            <ul>
                                <li>Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)</li>
                                <li>Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)</li>
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
    addKPIUnit: createUnitKpiActions.addKPIUnit,
    getKPIParent: createUnitKpiActions.getKPIParent
};
const connectedOrganizationalUnitKpiCreateModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiCreateModal));
export { connectedOrganizationalUnitKpiCreateModal as OrganizationalUnitKpiCreateModal };
