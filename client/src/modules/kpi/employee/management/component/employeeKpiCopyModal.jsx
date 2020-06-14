import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import { managerKpiActions } from '../redux/actions';
import { ErrorLabel, DatePicker } from '../../../../../common-components';
import {
    getStorage
} from '../../../../../config';


class ModalCopyKPIPersonal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpipersonal: {
                organizationalUnit: "",
                time: this.formatDate(Date.now()),
                creator: "" //localStorage.getItem("id")

            },
        };
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
    handleNewDateChange = (value) => {
        // var value = e.target.value;
        this.setState(state => {
                return {
                    ...state,
                    //errorOnDate: this.validateDate(value),
                    NewDate: value,
                }
            });
        
    }
    handleSubmit = async (event, oldkpipersonal) => {
        event.preventDefault();
        var id = getStorage("userId");
        await this.setState(state => {
            return {
                ...state,
                kpipersonal: {
                    ...state.kpipersonal,
                    organizationalUnit: oldkpipersonal.organizationalUnit._id,
                    kpis: oldkpipersonal.kpis
                }
            }
        })

        var { kpipersonal } = this.state;
        this.props.copyEmployeeKPI(id, oldkpipersonal.date, this.state.NewDate);
        if (kpipersonal.unit && kpipersonal.time) {//&& kpipersonal.creator
            Swal.fire({
                title: "Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.handleCloseModal(oldkpipersonal._id);
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
        const{NewDate, errorOnDate}= this.state;
        var { kpipersonal } = this.props;
        return (
            <div className="modal fade" id={`copyOldKPIToNewTime${kpipersonal._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(kpipersonal._id)} aria-hidden="true">×</button>
                            <h3 className="modal-title">Thiết lập KPI tháng mới từ KPI tháng {this.formatDate(kpipersonal.date)}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="col-sm-5">Đơn vị:</label>
                                <label className="col-sm-8" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpipersonal && kpipersonal.organizationalUnit.name}</label>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2">Tháng:</label>
                                <DatePicker
                                    id="new_date"
                                    value={NewDate}
                                    onChange={this.handleNewDateChange}
                                    dateFormat="month-year"
                                />
                                <div className="form-group" >
                                    <label className="col-sm-12">Danh sách mục tiêu:</label>
                                    <ul>
                                        {typeof kpipersonal !== "undefined" && kpipersonal.kpis.length !== 0 &&
                                            kpipersonal.kpis.map(item => {
                                                return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, kpipersonal)}>Thiết lập</button>
                                <button type="cancel" className="btn btn-primary" onClick={() => this.handleCloseModal(kpipersonal._id)}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapState(state) {
    const { overviewKpiPersonal} = state;
    return { overviewKpiPersonal};
}

const actionCreators = {
    copyEmployeeKPI: managerKpiActions.copyEmployeeKPI,
};
const connectedModalCopyKPIPersonal = connect(mapState, actionCreators)(ModalCopyKPIPersonal);
export { connectedModalCopyKPIPersonal as ModalCopyKPIPersonal};