import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

class ModalStartKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
                time: this.formatDate(Date.now()),
                // creater: localStorage.getItem("id")
            }
        };
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        this.props.getKPIParent(localStorage.getItem('currentRole'));
    }

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});
    notifyerror = (message) => toast.error(message, {containerId: 'toast-notification'});
    notifywarning = (message) => toast.warning(message, {containerId: 'toast-notification'});

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    handleSubmit = async (event, unit) => {
        event.preventDefault();
        
        const { translate } = this.props;

        console.log('clicked');
        await this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
                    unit: unit,
                    time: this.time.value
                }
            }
        })
        var { kpiunit } = this.state;
        var parentKpi = this.props.createKpiUnit.parent;
        let flag = false;
        if(parentKpi === null){
            flag = true;
        }
        else{
            if(parentKpi.status === 1) {
                flag = true;
            }
        }

        if (!flag) {
            Swal.fire({
                title: "Bạn phải chờ đơn vị cha kích hoạt KPI tháng mới",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            })
        } else {
            Swal.fire({
                title: "Bạn có chắc chắn muốn khởi tạo KPI tháng mới",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: translate('kpi_unit_create.confirm'),
            }).then((res) => {
                if (res.value) {
                    if (kpiunit.unit && kpiunit.time) {
                        this.props.addKPIUnit(kpiunit);
        
                        this.notifysuccess(translate('kpi_unit_create.init_success'));
        
                        window.$("#startKPIUnit").modal("hide");
                    }
                    else{
                        this.notifyerror(translate('kpi_unit_create.error'));
                    }
                }
            });
        }
        
    }
    
    render() {
        console.log(this.state);
        const { unit } = this.props;

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        return (
            <div className="modal fade" id="startKPIUnit">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">{translate('kpi_unit_create.init_title')}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="col-sm-3">{translate('kpi_unit_create.unit')}:</label>
                                <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{unit && unit.name}</label>
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-2">{translate('kpi_unit_create.month')}:</label>
                                <div className='input-group col-sm-10 date has-feedback'>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" />
                                    </div>
                                    <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                </div>
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-12">{translate('kpi_unit_create.default_target')}:</label>
                                <ul>
                                    <li>Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)</li>
                                    <li>Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, unit && unit._id)}>{translate('kpi_unit_create.init')}</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal">{translate('kpi_unit_create.cancel')}</button>
                        </div>
                    </div>
                </div>
            </div>
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
