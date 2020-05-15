import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import {
    getStorage
} from '../../../../../config';

class ModalCopyEmployeeKpiSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeKpiSet: {
                organizationalUnit: "",
                time: this.formatDate(Date.now()),
                creator: "" //localStorage.getItem("id")
                
            },
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
    handleSubmit = async (event, oldemployeeKpiSet) => {
        event.preventDefault();
        var id = getStorage("userId");
        employeeKpiSet.creator = id;
        await this.setState(state => {
            return {
                ...state,
                employeeKpiSet: {
                    ...state.employeeKpiSet,
                    organizationalUnit: oldemployeeKpiSet.organizationalUnit._id,
                    kpis: oldemployeeKpiSet.kpis
                }
            }
        })
        
        var { employeeKpiSet } = this.state;
        if (employeeKpiSet.organizationalUnit && employeeKpiSet.time ) {//&& employeeKpiSet.creator
            Swal.fire({
                title: "Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.handleCloseModal(oldemployeeKpiSet._id);
                }
            });
        }
    }
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    render() {
        var {employeeKpiSet} = this.props;
        return (
            <div className="modal fade" id={`copyOldKPIToNewTime${employeeKpiSet._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(employeeKpiSet._id)} aria-hidden="true">×</button>
                            <h3 className="modal-title">Thiết lập KPI tháng mới từ KPI tháng {this.formatDate(employeeKpiSet.time)}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="col-sm-5">Đơn vị:</label>
                                <label className="col-sm-8" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{employeeKpiSet && employeeKpiSet.organizationalUnit.name}</label>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2">Tháng:</label>
                                <div className='input-group col-sm-9 date has-feedback' style={{ marginLeft: "11px" }}>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" />
                                    </div>
                                    <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDate(Date.now())} name="time" id="datepicker2" data-date-format="mm-yyyy" />
                                </div>
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-12">Danh sách mục tiêu:</label>
                                <ul>
                                    {typeof employeeKpiSet !== "undefined" && employeeKpiSet.kpis.length !== 0 &&
                                        employeeKpiSet.kpis.map(item => {
                                            return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, employeeKpiSet)}>Thiết lập</button>
                            <button type="cancel" className="btn btn-primary" onClick={() => this.handleCloseModal(employeeKpiSet._id)}>Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapState(state) {
    const { overviewEmployeeKpiSet } = state;
    return { overviewEmployeeKpiSet };
}

const actionCreators = {
};
const connectedModalCopyEmployeeKpiSet = connect(mapState, actionCreators)(ModalCopyEmployeeKpiSet);
export { connectedModalCopyEmployeeKpiSet as ModalCopyEmployeeKpiSet };