import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
// import { kpiUnitActions } from '../../../../redux-actions/CombineActions';
import Swal from 'sweetalert2';
import {
    TOKEN_SECRET
} from '../../../../../env';
import {
    getStorage
} from '../../../../../config';
import jwt from 'jsonwebtoken';

class ModalCopyKPIUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiunit: {
                unit: "",
                date: this.formatDate(Date.now()),
                creator: "" //localStorage.getItem("id")
            }
        };
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
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
    handleSubmit = async (event, oldkpiunit) => {
        event.preventDefault();
        const token = getStorage();
        const verified = await jwt.verify(token, TOKEN_SECRET);
        var id = verified._id;
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
                                <div className='input-group col-sm-9 date has-feedback' style={{marginLeft: "11px"}}>
                                    <div className="input-group-addon">
                                        <i className="fa fa-calendar" />
                                    </div>
                                    <input type="text" className="form-control pull-right" ref={input => this.date = input} defaultValue={this.formatDate(Date.now())} name="date" id="datepicker2" data-date-format="mm-yyyy" />
                                </div>
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
};
const connectedModalCopyKPIUnit = connect(mapState, actionCreators)(ModalCopyKPIUnit);
export { connectedModalCopyKPIUnit as ModalCopyKPIUnit };