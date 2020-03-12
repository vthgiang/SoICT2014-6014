import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UserActions } from "../../../super-admin-management/manage-user/redux/actions"
import { createKpiActions  } from '../redux/actions';

class ModalStartKPIPersonal extends Component {
    constructor(props) {
        super(props);
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
    componentDidMount() {
        this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
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
    //chu
    handleCreateKPIPersonal = async (event, unit) => {
        event.preventDefault();
        await this.setState(state => {
            console.log('clicked');
            return {
                ...state,
                kpipersonal: {
                    ...state.kpipersonal,
                    unit: unit,
                    approver: this.approver.value,
                    time: this.time.value
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
        const { unit, user } = this.props;
        if (user.userdepartments) userdepartments = user.userdepartments;
        // console.log(this.getCreater());
        console.log(this.state);
        return (
            <div className="modal fade" id="startKPIPersonal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">Khởi tạo KPI cá nhân</h3>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label className="col-sm-4">Đơn vị:</label>
                                    <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-9.2%" }}>{unit && unit.name}</label>
                                </div>
                                <div className="form-group" style={{ paddingTop: "32px" }}>
                                    <label className="col-sm-4" style={{ width: "27%", marginTop: "7px" }}>Tháng:</label>
                                    <div className='input-group col-sm-8 date has-feedback' style={{ width: "69.5%" }}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-sm-4" style={{ marginTop: "7px" }}>Người phê duyệt:</label>
                                    <div className={'form-group col-sm-9 has-feedback'} style={{ marginLeft: "-9%" }}>
                                        {userdepartments && <select defaultValue={userdepartments[0].userId._id} ref={input => this.approver = input} className="form-control select2" style={{ width: '100%' }}>
                                            <optgroup label={userdepartments[0].roleId.name}>
                                                 <option key={userdepartments[0].userId._id} value={userdepartments[0].userId._id}>{userdepartments[0].userId.name}</option>
                                            </optgroup>
                                            <optgroup label={userdepartments[1].roleId.name}>
                                                <option key={userdepartments[1].userId._id} value={userdepartments[1].userId._id}>{userdepartments[1].userId.name}</option>
                                            </optgroup>
                                        </select>}
                                        {/* {userdepartments && <select defaultValue={userdepartments[0].userId[0]._id} ref={input => this.approver = input} className="form-control select2" style={{ width: '100%' }}>
                                            <optgroup label={userdepartments[0].roleId.name}>
                                                {userdepartments[0].userId.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </optgroup>
                                            <optgroup label={userdepartments[1].roleId.name}>
                                                {userdepartments[1].userId.map(x => {
                                                    return <option key={x._id} value={x._id}>{x.name}</option>
                                                })}
                                            </optgroup>
                                        </select>} */}
                                    </div>
                                </div>
                                <div className="form-group" >
                                    <label className="col-sm-12">Mục tiêu mặc định:</label>
                                    <ul>
                                        <li>Hỗ trợ đồng nghiệp các vấn đề chuyên môn (Vai trò C)</li>
                                        <li>Hoàn thành nhiệm vụ phê duyệt (Vai trò A)</li>
                                    </ul>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event)=>this.handleCreateKPIPersonal(event, unit&&unit._id)}>Khởi tạo</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal">Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
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
const connectedModalStartKPIPersonal = connect(mapState, actionCreators)(ModalStartKPIPersonal);
export { connectedModalStartKPIPersonal as ModalStartKPIPersonal };
