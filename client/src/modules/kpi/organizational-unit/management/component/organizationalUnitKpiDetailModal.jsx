import React, { Component } from 'react';
import { connect } from 'react-redux';
import { managerActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import { DialogModal } from '../../../../../common-components/index';


class ModalDetailKPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: '5dcadf02f0343012f09c1193',
            content: ""
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                idkpiunit: nextProps.idkpiunit,
                date: nextProps.date
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getChildTarget(nextProps.idkpiunit, nextProps.date);
            return false;
        }
        return true;
    }
    componentDidMount() {

    }

    handleChangeContent = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                content: id
            }
        })
    }
    formatMonth(date) {
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
    render() {
        var currentKPI, listchildtarget;
        const { managerKpiUnit } = this.props;
        if (managerKpiUnit.childtarget) {
            // console.log("=======================")
            listchildtarget = managerKpiUnit.childtarget;
        }
        //  console.log("++++++++++++", this.props.kpiunit._id);

        return (
            <DialogModal
                modalID={`dataResultTask`}
                title={`Thông tin chi tiết kpi đơn vị tháng ${this.formatMonth(this.props.date)}`}
                hasSaveButton={false}
                size={100}
            >
                {/* Modal Body */}
                <div className="modal-body modal-body-perform-task" >

                    <div className="col-sm-3">
                        {/* <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
        <h4>Danh sách mục tiêu</h4>
    </div> */}
                        <div className="content-left-modal" id="style-1" >
                            <div className="scroll-content" style={{ borderRight: "3px solid #ddd" }}>
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="card-title" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>Danh sách mục tiêu</h3>
                                    </div>
                                    <div class="card-body p-0">
                                        <ul class="nav nav-pills flex-column">

                                            {typeof listchildtarget !== 'undefined' && listchildtarget !== null && listchildtarget.map((item, index) =>
                                                <li class="nav-item" style={{ width: "100%" }}>

                                                    <a href="#abc" onClick={() => this.handleChangeContent(item._id)} className="list-group-item" key={index}>
                                                        {item.name}
                                                        <span className="badge">{item.arrtarget.length}</span>
                                                    </a>
                                                </li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {
                            listchildtarget && listchildtarget.map(item => {
                                if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                    <div className="header-content-right" style={{ textAlign: 'left' }}>
                                        <div className="col-sm-12" style={{ fontWeight: "500", textAlign: 'center' }}>
                                            <h4>Thông tin mục tiêu</h4>
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="col-sm-2" style={{ fontWeight: "400" }}>Tiêu chí đính giá:</label>
                                            <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.name}</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="col-sm-2" style={{ fontWeight: "400" }}>Trọng số:</label>
                                            <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.weight}</label>
                                        </div>
                                        <div className="col-sm-12">
                                            <label className="col-sm-2" style={{ fontWeight: "400" }}>Kết quả thực hiện:</label>
                                            <label className="col-sm-10" style={{ fontWeight: "400" }}>{item.approvedPoint === null ? "Chưa đánh giá" : item.approvedPoint + "-" + item.automaticPoint + "-" + item.employeePoint}</label>
                                        </div>
                                    </div>
                                    <div className="body-content-right">
                                        <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                            <h4>Danh sách các mục tiêu con</h4>
                                        </div>
                                        <table id="example1" className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th style={{width:"35px"}}>STT</th>
                                                    <th>Tên mục tiêu</th>
                                                    <th style={{ width: "108px" }}>Người tạo</th>
                                                    <th>Đơn vị</th>
                                                    <th>Tiêu chí đánh giá</th>
                                                    <th>Kết quả đánh giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(typeof item !== "undefined" && item.arrtarget) ?
                                                    (item.arrtarget.map((data, index) =>

                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{data.target.name}</td>
                                                            <td>{data.creator.name}</td>
                                                            <td>{data.organizationalUnit.name}</td>
                                                            <td>{data.target.criteria}</td>
                                                            <td>{data.target.approvedPoint}</td>
                                                        </tr>)) : <tr><td colSpan={6}>Không có dữ liệu</td></tr>

                                                }

                                            </tbody>
                                        </table>
                                        <div className="footer-content-right">
                                            <button style={{ float: "right" }}>Xuất file</button>
                                        </div>
                                    </div>
                                </React.Fragment>;
                                return true;
                            })
                        }
                    </div>
                </div>
            
            </DialogModal>
            
                       

        )}
}

function mapState(state) {
    const { managerKpiUnit } = state;
    return { managerKpiUnit };
}

const actionCreators = {
    getChildTarget: managerActions.getChildTargetOfCurrentTarget
};
const connectedModalDetailKPI = connect(mapState, actionCreators)(ModalDetailKPI);
export { connectedModalDetailKPI as ModalDetailKPI };