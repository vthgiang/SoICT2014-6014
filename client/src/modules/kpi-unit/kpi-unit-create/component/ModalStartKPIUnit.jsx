import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';

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
    handleSubmit = async (event, unit) => {
        event.preventDefault();
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
        if (kpiunit.unit && kpiunit.time) {
            this.props.addKPIUnit(kpiunit);
        }
        window.$("#startKPIUnit").modal("hide");
    }
    render() {
        console.log(this.state);
        const { unit } = this.props;
        return (
            <div className="modal fade" id="startKPIUnit">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 className="modal-title">Khởi tạo KPI đơn vị</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="col-sm-2">Đơn vị:</label>
                                <label className="col-sm-10" style={{ fontWeight: "400", marginLeft: "-2.5%" }}>{unit && unit.name}</label>
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-2">Tháng:</label>
                                <div className='input-group col-sm-10 date has-feedback'>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" />
                                    </div>
                                    <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                </div>
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-12">Mục tiêu mặc định:</label>
                                <ul>
                                    <li>Liên kết giữa các thành viên trong đơn vị (Vai trò người hỗ trợ)</li>
                                    <li>Hoàn thành tốt vai trò quản lý (Vai trò người phê quyệt)</li>
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, unit && unit._id)}>Khởi tạo</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal">Hủy bỏ</button>
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
    addKPIUnit: createUnitKpiActions.addKPIUnit
};
const connectedModalStartKPIUnit = connect(mapState, actionCreators)(ModalStartKPIUnit);
export { connectedModalStartKPIUnit as ModalStartKPIUnit };
