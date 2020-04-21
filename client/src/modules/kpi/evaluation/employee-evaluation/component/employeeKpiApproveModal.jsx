import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions} from '../redux/actions';

class ModalMemberApprove extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            edit: "",
            compare: false,
            checkInput: false,
            checkWeight: false
        };
        this.newWeight = [];
    }
    componentDidMount() {
        this.props.getKPIMemberById(this.props.id);
    }
    componentDidUpdate() {
        this.handleResizeColumn();
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }
    handleEdit = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editing: true,
                edit: state.edit ===id ? "" : id
            }
        })
    }
    handleSaveEdit = async (target) => {
        await this.setState(state=>{
            return{
                ...state,
                newTarget: {
                    ...target,
                    weight: parseInt(this.newWeight[target._id].value)
                },
            }
        })
        const {newTarget} = this.state;
        if(this.newWeight[target._id].value!==""){
            this.props.editTarget(target._id, newTarget);
            await this.setState(state=>{
                return{
                    ...state,
                    edit: "",
                    checkWeight: false,
                    editing: true
                }
            })
        }
    }
    handleCompare = async (id) => {
        let script = document.createElement('script');
        script.src = '../lib/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        await this.setState(state => {
            return {
                ...state,
                compare: !state.compare
            }
        })
        if (id) {
            this.props.getKPIMemberByMonth(id, this.time.value);
        }
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
    formatDateBack(date) {
        var d = new Date(date), month, day, year;
        if(d.getMonth()===0){
            month = '' + 12;
            day = '' + d.getDate();
            year = d.getFullYear()-1;
        } else{
            month = '' + d.getMonth();
            day = '' + d.getDate();
            year = d.getFullYear();
        }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    handleCloseModal = async (id, listTarget) => {
        var totalWeight = listTarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        if(totalWeight!==100&&this.state.editing){
            await this.setState(state => {
                return{
                    ...state,
                    checkWeight: true
                }
            })
        } else {
            var element = document.getElementsByTagName("BODY")[0];
            element.classList.remove("modal-open");
            var modal = document.getElementById(`memberKPIApprove${id}`);
            modal.classList.remove("in");
            modal.style = "display: none;";
        }
    }
    checkStatusTarget = (status) => {
        if (status === null) {
            return "Chưa phê duyệt";
        } else if (status === 0) {
            return "Yêu cầu chỉnh sửa";
        } else if (status === 1) {
            return "Đã kích hoạt";
        } else if (status === 2) {
            return "Đã kết thúc"
        }
    }
    searchKPIMemberByMonth = async (id, currentTime) => {
        await this.setState(state=>{
            return{
                ...state,
                checkInput: false
            }
        })
        var searchtime = this.time.value.split("-");
        var time = new Date(searchtime[1], searchtime[0], 0);
        if ((Date.parse(time) >= currentTime) || this.time.value==="") {
            await this.setState(state => {
                return {
                    ...state,
                    checkInput: true
                }
            })
        } else {
            this.props.getKPIMemberByMonth(id, this.time.value);
        }
    }
    handleEditStatusTarget = (event, id, status) => {
        event.preventDefault();
        if(id){
            this.props.editStatusTarget(id, status);
        }
    }
    handleApproveKPI = async (id, listTarget) => {
        
        var totalWeight = listTarget.map(item => parseInt(item.weight)).reduce((sum, number) => sum + number, 0);
        
        if(totalWeight!==100){
            await this.setState(state => {
                return{
            
                    ...state,
                    checkWeight: true
                }
            })
        } else {
            this.props.approveKPIMember(id);
        }
    }
    render() {
        var kpimember, kpimember;
        const { kpimembers } = this.props;
        const { checkInput } = this.state;
        if (kpimembers.currentKPI) kpimember = kpimembers.currentKPI;
        if (kpimembers.kpimember) kpimember = kpimembers.kpimember;
        return (
            <div className="modal modal-full fade" id={"memberKPIApprove" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(this.props.id, kpimember.listtarget)}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <div className="col-sm-6">
                                <h3 className="modal-title" id="myModalLabel">Phê duyệt KPI nhân viên {kpimember && kpimember.creater.name}</h3>
                            </div>
                            <div className="col-sm-5" style={{ marginTop: "-5px", marginLeft: "7%" }}>
                                {this.state.compare ? <button className="col-sm-3 btn btn-success" style={{marginLeft:"48%"}} onClick={() => this.handleCompare()}>Tắt so sánh</button>
                                    : <button className="col-sm-3 btn btn-success" style={{ marginLeft: "48%" }} onClick={() => this.handleCompare(kpimember.creater._id)}>So sánh với KPI cũ</button>}
                                <button className="col-sm-3 btn btn-success" style={{ marginLeft: "10px" }} onClick={()=>this.handleApproveKPI(kpimember._id, kpimember.listtarget)}>Duyệt toàn bộ KPI</button>
                            </div>
                        </div>
                        <div className="modal-body modal-body-perform-task" >
                            <div className="col-xs-12" style={{ marginLeft: "-30px" }}>
                                {this.state.checkWeight&&<div className="col-sm-12" style={{color: "red"}}><label>Trọng số đang không thỏa mãn!</label></div>}
                                <div className="col-xs-12">
                                    <label className="col-sm-2"><b>Người thực hiện:</b></label>
                                    <label className="col-sm-10">{kpimember && kpimember.creater.name}</label>
                                </div>
                                <div className="col-xs-12">
                                    <label className="col-sm-2"><b>Thời gian:</b></label>
                                    <label className="col-sm-10">{kpimember && this.formatDate(kpimember.time)}</label>
                                </div>
                                <div className="col-xs-12" style={{ marginBottom: "10px" }}>
                                    <label className="col-sm-2">Số mục tiêu:</label>
                                    <label className="col-sm-2">{kpimember && kpimember.listtarget.length}</label>
                                    {/* {!this.state.compare && <button className="btn btn-success" style={{position: "absolute", right: "-2%", marginTop: "-1%"}}>Duyệt toàn bộ KPI</button>} */}
                                </div>
                            </div>
                            {this.state.compare &&
                                <div className="col-xs-12">
                                    <div className="col-xs-12" style={{ marginLeft: "-30px" }}>
                                        <div className="col-xs-4">
                                            <label className="col-xs-4" style={{ marginLeft: "-15px" }}>KPI tháng:</label>
                                            <div className={'input-group col-sm-4 date has-feedback' + (checkInput ? ' has-error' : '')} style={{ display: "inline-table", marginLeft: "5px", marginTop: "-8px", width: "55%" }}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDateBack(Date.now())} name="time" id="datepicker7" data-date-format="mm-yyyy" />
                                            </div>
                                            {checkInput &&
                                                <div className="col-sm-10 help-block" style={{marginLeft: "-14px", color: "red"}}>Thời gian tìm kiếm phải trước thời gian hiện tại và không rỗng</div>
                                            }
                                        </div>
                                        <div className="col-xs-4" style={{ marginTop: "-8px", marginLeft: "-5%" }}>
                                            <button className="btn btn-success" onClick={() => this.searchKPIMemberByMonth(kpimember.creater._id, Date.now())}>Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th title="Tên mục tiêu" style={{ width: "280px" }}>Tên mục tiêu</th>
                                                <th title="Mục tiêu đơn vị" style={{ width: "316px" }}>Mục tiêu đơn vị</th>
                                                <th title="Tiêu chí đánh giá" style={{ width: "373px" }}>Tiêu chí đánh giá</th>
                                                <th title="Trọng số" style={{ width: "173px" }}>Trọng số</th>
                                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {typeof kpimember !== "undefined" ?
                                                kpimember.listtarget.map(item =>
                                                    <tr key={item._id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.parent.name}</td>
                                                        <td>{item.criteria}</td>
                                                        <td>{this.state.edit === item._id ? <input min="0" max="100" defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                        <td>{item.approverpoint}</td>
                                                    </tr>
                                                ) : <tr><td colSpan={5}>Không có dữ liệu phù hợp</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>}
                            <div className="col-xs-12">
                                {this.state.compare && <div style={{marginBottom: "5px"}}>
                                    <h4 style={{display: "inline"}}><b>KPI tháng này</b></h4>
                                    {/* <button className="btn btn-success" style={{marginLeft: "80%"}}>Duyệt toàn bộ KPI</button> */}
                                </div>}
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th title="Tên mục tiêu" style={{ width: "252px" }}>Tên mục tiêu</th>
                                            <th title="Mục tiêu đơn vị" style={{ width: "281px" }}>Mục tiêu đơn vị</th>
                                            <th title="Tiêu chí đánh giá" style={{ width: "336px" }}>Tiêu chí đánh giá</th>
                                            <th title="Trọng số" style={{ width: "71px" }}>Trọng số</th>
                                            <th title="Trạng thái" style={{ width: "95px" }}>Trạng thái</th>
                                            <th title="Hành động" style={{ width: "107px" }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {typeof kpimember !== "undefined" &&
                                            kpimember.listtarget.map(item =>
                                                <tr key={item._id}>
                                                    <td>{item.name}</td>
                                                    <td>{item.parent.name}</td>
                                                    <td>{item.criteria}</td>
                                                    <td>{this.state.edit === item._id ? <input min="0" max="100" ref={input => this.newWeight[item._id] = input} defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                    <td>{this.checkStatusTarget(item.status)}</td>
                                                    <td>
                                                        {this.state.edit === item._id?<a href="#edit" className="approve" title="Lưu kết quả" onClick={() => this.handleSaveEdit(item)}><i className="material-icons">save</i></a>
                                                        :<a href="#edit" className="edit" title="Chỉnh sửa mục tiêu này" onClick={() => this.handleEdit(item._id)}><i className="material-icons">edit</i></a>}
                                                        <a href="#edit" className="add_circle" title="Đạt" onClick={(event)=>this.handleEditStatusTarget(event, item._id, 1)}><i className="material-icons">check_circle</i></a>
                                                        <a href="#abc" className="delete" title="Không đạt" onClick={(event)=>this.handleEditStatusTarget(event, item._id, 0)}><i className="material-icons">cancel</i></a>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getKPIMemberByMonth: kpiMemberActions.getKPIMemberByMonth,
    editStatusTarget: kpiMemberActions.editStatusTarget,
    approveKPIMember: kpiMemberActions.approveKPIMember,
    editTarget: kpiMemberActions.editTargetKPIMember
};
const connectedModalMemberApprove = connect(mapState, actionCreators)(ModalMemberApprove);
export { connectedModalMemberApprove as ModalMemberApprove };