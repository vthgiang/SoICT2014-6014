import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
// import { kpiUnitActions } from '../../../../redux-actions/CombineActions';
import Swal from 'sweetalert2';
import { ErrorLabel, DatePicker } from '../../../../../common-components';
import {
    getStorage
} from '../../../../../config';

class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
                date: this.formatDate(Date.now()),
                creator: "" ,//localStorage.getItem("id")
            }
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
    handleSubmit = async (event, oldkpiunit) => {
        event.preventDefault();
        var id = getStorage("userId");
        var currentRole= getStorage("currentRole");
        // kpiunit.creator = id;
        await this.setState(state => {
            return {
                ...state,
                kpiunit: {
                    ...state.kpiunit,
                    creator: id,
                    unit: oldkpiunit.organizationalUnit._id,
                    kpis: oldkpiunit.kpis
                }
            }
        })
        var { kpiunit } = this.state;
        this.props.copyKPIUnit(currentRole, oldkpiunit.date, this.state.NewDate);
        
        if (kpiunit.unit && kpiunit.date ) {//&& kpiunit.creater
            Swal.fire({
                title: "Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            }).then((res) => {
                if (res.value) {
                    this.handleCloseModal(oldkpiunit._id);
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
        const { kpiunit } = this.props;
        return (
            <div className="modal fade" id={`copyOldKPIToNewTime${kpiunit._id}`}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"  onClick={() => this.handleCloseModal(kpiunit._id)} aria-hidden="true">×</button>
                            <h3 className="modal-title">Thiết lập KPI tháng mới từ KPI tháng {this.formatDate(kpiunit.date)}</h3>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="col-sm-4">Đơn vị:</label>
                                <label className="col-sm-9" style={{ fontWeight: "400", marginLeft: "-14.5%" }}>{kpiunit && kpiunit.organizationalUnit.name}</label>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-2">Tháng:</label>
                                <DatePicker
                                id="new_date"
                                value={NewDate}
                                onChange={this.handleNewDateChange}
                                dateFormat="month-year"
                            />
                            <ErrorLabel content={errorOnDate} />
                            </div>
                            <div className="form-group" >
                                <label className="col-sm-12">Danh sách mục tiêu:</label>
                                <ul>
                                    {typeof kpiunit !== "undefined" && kpiunit.kpis.length !== 0 &&
                                        kpiunit.kpis.map(item => {
                                            return <li key={item._id}>{item.name+" ("+item.weight+")"}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, kpiunit)}>Thiết lập</button>
                            <button type="cancel" className="btn btn-primary" onClick={()=>this.handleCloseModal(kpiunit._id)}>Hủy bỏ</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    copyKPIUnit: managerActions.copyKPIUnit
};
const connectedModalCopyKPIUnit = connect(mapState, actionCreators)(ModalCopyKPIUnit);
export { connectedModalCopyKPIUnit as ModalCopyKPIUnit };