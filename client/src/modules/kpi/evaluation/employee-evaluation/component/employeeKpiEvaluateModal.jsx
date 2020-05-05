import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions } from '../redux/actions';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
 
class ModalMemberEvaluate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit:"",
            content: "",
            name:"",
            description:"",
            point:0,
            status:0
        };
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
 
            window.$("table thead tr th").mousedown(function (e) {
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
    handleChangeContent = async (id) => {
        // this.props.getTaskById(id);
        await this.setState(state => {
            this.props.getTaskById(id);
            return {
                ...state,
                content: id
            }
        });
        // console.log(this.state);
 
    }
 
    handleSetPointKPI = async(id_kpi, id_target, input) =>{
        //event.preventDefault();
        var point = {point: input};
        this.props.setPointKPI( id_kpi, id_target, point)
        // await this.setState({
        //     editing: true,
        //     this.props.setPointKPI( id_kpi, id_target, point)
        // })
    }
 
    handleCloseModal = async (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    render() {
        var list;
        var myTask=[];
        const { kpimembers } = this.props;
        if(typeof kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;
        
        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }
 
        return (
            <div className="modal modal-full fade" id={"memberEvaluate" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header" style={{ textAlign: "center", background: "#605ca8", color: "white" }}>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(this.props.id)}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel">Thông tin chi tiết kpi nhân viên {this.props.name}</h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <div className="left-modal">
                                <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
                                    <h4>Danh sách mục tiêu</h4>
                                </div>
                                <div className="content-left-modal" id="style-1" style={{ width: "24.5%" }}>
                                    <div className="scroll-content" style={{ borderRight: "3px solid #ddd" }}>
                                        {list && list.map((item, index) =>
                                            <a href="#abc" style={{ color: "black" }} onClick={() => this.handleChangeContent(item._id)} className="list-group-item" key={index}>
                                                {item.name}&nbsp;
                                                <small style={{ float: "right", textDecoration: "underline", color: "blue" }}>(9 công việc - 0 điểm)</small>
                                                {/* <span className="badge">{15 + index}</span> */}
                                            </a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="right-modal">
                                {
                                    list && list.map(item => {
                                        if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                            <div className="qlcv">
                                                <h4>Thông tin mục tiêu</h4>
                                                    <div className="col-sm-12">
                                                        <label style={{width: "150px"}}>Tiêu chí đính giá:</label>
                                                        <label >{item.criteria}</label>
                                                    </div>
                                                
                                                    <div className="col-sm-12">
                                                        <label style={{width: "150px"}}>Hệ thống đánh giá:</label>
                                                        <label >{item.systempoint === null ? 0 : item.systempoint}{item.weight}</label>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <label style={{width: "150px"}}>Tự đánh giá:</label>
                                                        <label >{item.mypoint === null ? 0 : item.mypoint}{item.weight}</label>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <label style={{width: "150px"}}>Trọng số:</label>
                                                        <label style={{display: "inline" }}>{item.weight}</label>
                                                    </div>
                                                    <div className="form-inline">
                                                        <label style={{width: "150px"}}>Quản lý đánh giá:</label>
                                                        <input type="number" min="0" max={item.weight} className="form-control" ref={input => this.approvepoint = input} defaultValue="0" name="value" style={{width:"50px"}} />
                                                    </div>
                                                    <div className="form-inline">
                                                        <button className="btn btn-success pull-right" onClick={()=> this.handleSetPointKPI(this.props.id ,item._id, this.approvepoint.value)}>Lưu</button>
                                                    </div>
                                             </div>
                                            <div className="body-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Danh sách các công việc</h4>
                                                </div>
                                                <table id="example1" className="table table-hover table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th title ="STT" style={{ width: "20px" }}>Stt</th>
                                                            <th title="Tên công việc">Tên công việc</th>
                                                            <th title="Đơn vị">Đơn vị</th>
                                                            <th title="Mô tả công việc">Mô tả công việc</th>
                                                            <th title="Trạng thái">Trạng thái</th>
                                                            <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
 
                                                        (typeof kpimembers.tasks !== "undefined" &&  kpimembers.tasks )?
                                                            (kpimembers.tasks.map((itemTask,index) =>
 
                                                                <tr key ={index}>
                                                                    <td>{index+1}</td>
                                                                    <td>{itemTask.name}</td>                                                                   
                                                                    <td>{itemTask.organizationalUnit.name}</td>
                                                                    <td>{itemTask.description}</td>
                                                                    <td>{itemTask.status}</td>
                                                                    <td>{itemTask.point === -1 ? 'Chưa đánh giá' : itemTask.point}</td>
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
                    </div>
                </div>
            </div>
        );
    }
}
 
function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}
 
const actionCreators = {
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getTaskById: kpiMemberActions.getTaskById,
    setPointKPI : kpiMemberActions.setPointKPI
};
const connectedModalMemberEvaluate = connect(mapState, actionCreators)(ModalMemberEvaluate);
export { connectedModalMemberEvaluate as ModalMemberEvaluate };