import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';
import { DatePicker } from '../../../../../src/common-components';
import { ModalDialog } from '../../../../common-components';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual';

class ModalStartKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
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

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

    formatDate = async (value) => {
        await this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
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

        if(this.state.kpiunit.time === ""){
            await this.setState(state => {
                return {
                    ...state,
                    kpiunit: {
                        ...state.kpiunit,
                        time: defaultTime,
                    }
                }
            })
        }

        console.log('clicked');
        await this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
                    unit: this.props.unit,
                }
            }
        })
        var { kpiunit } = this.state;
        
        if (kpiunit.unit && kpiunit.time) {
            this.props.addKPIUnit(kpiunit);

            window.$("#startKPIUnit").modal("hide");
        }
        else{
            this.notifyerror(translate('kpi_unit_create.error'));
        }
    }
    
    render() {
        console.log(this.state);
        const { unit } = this.props;

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
                <ModalDialog
                    modalID="startKPIUnit" isLoading={false}
                    formID="formStartKPIUnit"
                    title={translate('kpi_unit_create.init_title')}
                    msg_success={translate('kpi_unit_create.init_success')}
                    msg_faile={translate('kpi_unit_create.error')}
                    func={this.handleSubmit}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form id="formStartKPIUnit" onSubmit={() => this.handleSubmit(translate('kpi_unit_create.init_success'))}>
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi_unit_create.unit')}</label>
                            <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{unit && unit.name}</label>
                        </div>
                        
                        <div className="form-group">
                            <label className="col-sm-2">{translate('kpi_unit_create.month')}</label>
                            <DatePicker
                                id="month"      
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultTime}                            // giá trị mặc định cho datePicker    
                                onChange={this.formatDate}
                                disabled={false}                     // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        <div className="form-group">
                            <label className="col-sm-12">{translate('kpi_unit_create.default_target')}</label>
                            <ul>
                                <li>Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)</li>
                                <li>Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)</li>
                            </ul>
                        </div>

                    </form>
                </ModalDialog>
            </React.Fragment>

            // <div className="modal fade" id="startKPIUnit">
            //     <div className="modal-dialog">
            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
            //                 <h3 className="modal-title">{translate('kpi_unit_create.init_title')}</h3>
            //             </div>
            //             <div className="modal-body">
            //                 <div className="form-group">
            //                     <label className="col-sm-3">{translate('kpi_unit_create.unit')}:</label>
            //                     <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{unit && unit.name}</label>
            //                 </div>


            //                 <div className="form-group" >
            //                     <label className="col-sm-2">{translate('kpi_unit_create.month')}:</label>
            //                     <div className='input-group col-sm-10 date has-feedback'>
            //                         <div className="input-group-addon">
            //                             <i className="fa fa-calendar" />
            //                         </div>
            //                         <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
            //                     </div>
            //                 </div>


            //                 <div className="form-group" >
            //                     <label className="col-sm-12">{translate('kpi_unit_create.default_target')}:</label>
            //                     <ul>
            //                         <li>Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)</li>
            //                         <li>Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)</li>
            //                     </ul>
            //                 </div>
            //             </div>
            //             <div className="modal-footer">
            //                 <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, unit && unit._id)}>{translate('kpi_unit_create.init')}</button>
            //                 <button type="cancel" className="btn btn-primary" data-dismiss="modal">{translate('kpi_unit_create.cancel')}</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
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
const connectedModalStartKPIUnit = connect(mapState, actionCreators)(withTranslate(ModalStartKPIUnit));
export { connectedModalStartKPIUnit as ModalStartKPIUnit };
