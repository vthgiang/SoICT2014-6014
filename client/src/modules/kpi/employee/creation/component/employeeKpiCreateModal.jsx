import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../super-admin-management/users-management/redux/actions"
import { createKpiActions  } from '../redux/actions';
import { DatePicker } from '../../../../../src/common-components';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var translate='';
class ModalStartKPIPersonal extends Component {
    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            kpipersonal: {
                unit: "",
                // creater: this.getCreater(), //localStorage.getItem("id"),
                approver: "",
                time: "",
            },
            adding: false
        };
    }
    // getCreater = async () => {
    //     const token = getStorage();
    //     const verified = await jwt.verify(token, TOKEN_SECRET);
    //     var id = verified._id;
    //     return id;
    // }

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});

    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
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
                kpipersonal: {
                    ...state.kpiunit,
                    time: value
                }
            }
        })
    }

    //chu
    handleCreateKPIPersonal = async () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        if(this.state.kpipersonal.time === ""){
            await this.setState(state => {
                return {
                    ...state,
                    kpipersonal: {
                        ...state.kpiunit,
                        time: defaultTime,
                    }
                }
            })
        }

        await this.setState(state => {
            console.log('clicked');
            return {
                ...state,
                kpipersonal: {
                    ...state.kpipersonal,
                    unit: this.props.unit,
                    approver: this.approver.value,
                }
            }
        })
        var {kpipersonal} = this.state;
        if(kpipersonal.unit  && kpipersonal.time && kpipersonal.approver){//&& kpipersonal.creater
            this.props.createKPIPersonal(kpipersonal);
            window.$("#startKPIPersonal").modal("hide");
        }
    }
    
    render() {
        var userdepartments;
        const { unit, user, translate } = this.props;
        if (user.userdepartments) userdepartments = user.userdepartments;
        // console.log(this.getCreater());

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultTime =  [month, year].join('-');

        console.log(this.state);
        return (
            <React.Fragment>
                <DialogModal
                    modalID="startKPIPersonal" isLoading={false}
                    formID="formStartKPIPersonal"
                    title={translate('kpi_personal.start.initialize_kpi')}
                    msg_success={translate('kpi_personal.start.success')}
                    msg_faile={translate('kpi_unit_create.error')}
                    func={this.handleCreateKPIPersonal}
                    // disableSubmit={!this.isFormValidated()}
                >
                    <form id="formStartKPIPersonal" onSubmit={() => this.handleCreateKPIPersonal(translate('kpi_unit_create.init_success'))}>
                        <div className="form-group">
                            <label className="col-sm-3">{translate('kpi_unit_create.unit')}</label>
                            <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{unit && unit.name}</label>
                        </div>
                        
                        <div className="form-group">
                            <label className="col-sm-3">{translate('kpi_unit_create.month')}</label>
                            <DatePicker
                                id="month"      
                                dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                value={defaultTime}                 // giá trị mặc định cho datePicker    
                                onChange={this.formatDate}
                                disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                            />
                        </div>

                        <div className="form-group">
                                <label className="col-sm-3">{translate('kpi_personal.start.approver')}</label>
                                <div className="input-group col-sm-9" style={{ width: "60%" }}>
                                    {userdepartments && 
                                        <select defaultValue={userdepartments[0].userId._id} ref={input => this.approver = input} className="form-control select2">
                                            <optgroup label={userdepartments[0].roleId.name}>
                                                <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
                                            </optgroup>
                                            <optgroup label={userdepartments[1].roleId.name}>
                                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
                                            </optgroup>
                                        </select>
                                    }
                                </div>
                            </div>

                            <div className="form-group" >
                                <label className="col-sm-12">{translate('kpi_personal.start.default_target')}</label>
                                <ul>
                                    <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
                                    <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
                                </ul>
                            </div>

                    </form>
                </DialogModal>
            </React.Fragment>

            // <div className="modal fade" id="startKPIPersonal">
            //     <div className="modal-dialog">
            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
            //                 <h3 className="modal-title">{translate('kpi_personal.start.initialize_kpi')}</h3>
            //             </div>
            //             <div className="modal-body">
            //                 <form className="form-horizontal">


            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('kpi_personal.start.unit')}</label>
            //                         <p className="col-sm-9">{unit && unit.name}</p>
            //                     </div>

            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('kpi_personal.start.month')}</label>
            //                         <div className="input-group col-sm-9 date has-feedback" style={{ width: "60%" }}>
            //                             <div className="input-group-addon">
            //                                 <i className="fa fa-calendar"/>
            //                             </div>
            //                             <input type="text" className="form-control" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
            //                         </div>
            //                     </div>

            //                     <div className="form-group">
            //                         <label className="col-sm-3">{translate('kpi_personal.start.approver')}</label>
            //                         <div className="input-group col-sm-9" style={{ width: "60%" }}>
            //                             {userdepartments && 
            //                                 <select defaultValue={userdepartments[0].userId._id} ref={input => this.approver = input} className="form-control select2">
            //                                     <optgroup label={userdepartments[0].roleId.name}>
            //                                         <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
            //                                     </optgroup>
            //                                     <optgroup label={userdepartments[1].roleId.name}>
            //                                         <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
            //                                     </optgroup>
            //                                 </select>
            //                             }
            //                             {/* {userdepartments && <select defaultValue={userdepartments[0].userId[0]._id} ref={input => this.approver = input} className="form-control select2" style={{ width: '100%' }}>
            //                                 <optgroup label={userdepartments[0].roleId.name}>
            //                                     {userdepartments[0].userId.map(x => {
            //                                         return <option key={x._id} value={x._id}>{x.name}</option>
            //                                     })}
            //                                 </optgroup>
            //                                 <optgroup label={userdepartments[1].roleId.name}>
            //                                     {userdepartments[1].userId.map(x => {
            //                                         return <option key={x._id} value={x._id}>{x.name}</option>
            //                                     })}
            //                                 </optgroup>
            //                             </select>} */}
            //                         </div>
            //                     </div>
            //                     <div className="form-group" >
            //                         <label className="col-sm-12">{translate('kpi_personal.start.default_target')}</label>
            //                         <ul>
            //                             <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
            //                             <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
            //                         </ul>
            //                     </div>
            //                 </form>
            //             </div>
            //             <div className="modal-footer">
            //                 <button className="btn btn-success" onClick={(event)=>this.handleCreateKPIPersonal(event, unit&&unit._id)}>{translate('kpi_personal.start.initialize')}</button>
            //                 <button type="cancel" className="btn btn-primary" data-dismiss="modal">{translate('kpi_personal.start.cancel')}</button>
            //             </div>
            //         </div>
            //     </div>
            // </div>
        );
    }
}

function mapState(state) {
    const { user } = state;
    return { user };
}

const actionCreators = {
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,
    createKPIPersonal: createKpiActions.createKPIPersonal
};

const connectedModalStartKPIPersonal = connect( mapState, actionCreators )( withTranslate(ModalStartKPIPersonal)) ;
export { connectedModalStartKPIPersonal as ModalStartKPIPersonal };
