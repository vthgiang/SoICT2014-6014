import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
// import { kpiUnitActions } from '../../../../redux-actions/CombineActions';
import Swal from 'sweetalert2';
import { ErrorLabel, DatePicker, DialogModal } from '../../../../../common-components';
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
                creator: "",//localStorage.getItem("id")
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
    handleSubmit = async (oldkpiunit, listkpi, idunit) => {
        // event.preventDefault();
        var id = getStorage("userId");
        var currentRole = getStorage("currentRole");
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
        if (this.state.NewDate == undefined) {
            Swal.fire({
                title: `Chưa chọn tháng khởi tạo`,
                type: 'warning',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            var date = this.state.NewDate.split("-");
            var check = 1;
            var nowDate = new Date();

            for (let i in listkpi) {
                if (listkpi[i].organizationalUnit._id == idunit) {
                    var checkDate = listkpi[i].date.split("-");
                    if (checkDate[0] == date[1] && checkDate[1] == date[0]) {
                        check = 0;
                        break;
                    }
                }
            }
            if (check != 0) {
                if (date[1] < nowDate.getFullYear()) {
                    check = 2;
                } else if (date[1] == nowDate.getFullYear()) {
                    if (date[0] < nowDate.getMonth()) {
                        check = 2
                    }
                }
            }
            if (check == 0) {
                Swal.fire({
                    title: `Đã tồn tại KPI của tháng ${date[0]}-${date[1]} `,
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                })
            }
            if (check == 2) {
                Swal.fire({
                    title: `Tháng đã qua không thể tạo KPI`,
                    type: 'warning',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Xác nhận'
                })
            }
            if (check == 1) {
                this.props.copyKPIUnit(id, idunit, oldkpiunit.date, this.state.NewDate);
                if (kpiunit.unit && kpiunit.date) {//&& kpiunit.creater
                    Swal.fire({
                        title: "Hãy nhớ thay đổi liên kết đến mục tiêu cha để được tính KPI mới!",
                        type: 'warning',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Xác nhận'
                    });
                }
            }
        }
    }

    save = () => {
        let { listkpi, kpiunit, idunit } = this.props;
        this.handleSubmit(kpiunit, listkpi, idunit)
    }
    render() {
        const { NewDate, errorOnDate } = this.state;
        const { kpiunit, listkpi, idunit } = this.props;
        return (
            <DialogModal
                modalID={`copy-old-kpi-to-new-time-${kpiunit._id}`}
                title={`Thiết lập KPI tháng mới từ KPI tháng ${this.formatDate(kpiunit.date)}`}
                size={10}
                func={this.save}
            >
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
                                return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                            })
                        }
                    </ul>
                </div>
                {/* </div> */}
                {/* <div className="modal-footer">
                    <button className="btn btn-success" onClick={(event) => this.handleSubmit(event, kpiunit, listkpi)}>Thiết lập</button>
                    <button type="cancel" className="btn btn-primary" onClick={() => this.handleCloseModal(kpiunit._id)}>Hủy bỏ</button>
                </div> */}
            </DialogModal >
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