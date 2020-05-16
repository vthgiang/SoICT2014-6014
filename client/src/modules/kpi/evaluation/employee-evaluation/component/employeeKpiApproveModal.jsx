import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions} from '../redux/actions';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';
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
        var kpimember;
        const { kpimembers } = this.props;
        const { checkInput } = this.state;
        if (kpimembers.currentKPI) kpimember = kpimembers.currentKPI;
        if (kpimembers.kpimembers){
            console.log(kpimembers.kpimembers.kpis)
            var arrkpimember = kpimembers.kpimembers;
            arrkpimember.forEach(item => {
                var datekpi= item.date.split('-');
                var date= new Date();
                if((date.getMonth()+1)==datekpi[1] && date.getFullYear()==datekpi[2]){
                    kpimember= item;
                }
            });
        } 

        return (
            <div className="modal modal-full fade" id={"memberKPIApprove" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(this.props.id, kpimember.kpis)}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                                <h3 className="modal-title" style={{textAlign:"center"}}>Phê duyệt KPI nhân viên {kpimember && kpimember.creator.name}</h3>
                        </div>
                        <div className="box" >
                            <div className="box-body qlcv">
                                {this.state.checkWeight&&<div className="col-sm-12" style={{color: "red"}}><label>Trọng số đang không thỏa mãn!</label></div>}
                                <div className="form-inline">
                                
                                {this.state.compare ? <button className=" btn btn-success pull-right"  onClick={() => this.handleCompare()}>Tắt so sánh</button>
                                        : <button className=" btn btn-success pull-right"  onClick={() => this.handleCompare(kpimember.creator._id)}>So sánh với KPI cũ</button> }
                                        <button className=" btn btn-success pull-right"  onClick={()=>this.handleApproveKPI(kpimember._id, kpimember.kpis)}>Duyệt toàn bộ KPI</button>  
                                
                              </div>  
                              
                            {this.state.compare &&
                                <div className="col-xs-12">
                                    <div className="form-inline">
                                            <label style={{fontSize:"18px"}}>Chọn tháng so sánh:</label>
                                            <div className="form-group">
                                            <div className={'input-group col-sm-4 date has-feedback' + (checkInput ? ' has-error' : '')} >
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control pull-right" ref={input => this.time = input} defaultValue={this.formatDateBack(Date.now())} name="time" id="datepicker7" data-date-format="mm-yyyy" />
                                            
                                           
                                            {checkInput &&
                                                <div className="col-sm-10 help-block" >Thời gian tìm kiếm phải trước thời gian hiện tại và không rỗng</div>
                                            }
                                            </div>
                                            </div>
                                            <div className="form-group" >
                                            <button className="btn btn-success" onClick={() => this.searchKPIMemberByMonth(kpimember.creator._id, Date.now())}>Tìm kiếm</button>
                                        </div>
                                        
                                        {/* </div> */}
                                        
                                    </div>
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th title="STT">STT</th>
                                                <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                <th title="Mục tiêu đơn vị">Mục tiêu đơn vị</th>
                                                <th title="Mục tiêu đơn vị">Thời gian</th>
                                                <th title="Mục tiêu đơn vị">Số mục tiêu</th>
                                                <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                <th title="Trọng số">Trọng số</th>
                                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {typeof kpimember !== "undefined" ?
                                                kpimember.kpis.map((item, index) =>
                                                    <tr >
                                                        <td>{index+1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.parent.name}</td>
                                                        <td>{this.formatDate(item.date)}</td>
                                                        <td>{item.length}</td>
                                                        <td>{item.criteria}</td>
                                                        <td>{this.state.edit === item._id ? <input min="0" max="100" defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                        <td>{item.approvedPoint}</td>
                                                    </tr>
                                                ) : <tr><td colSpan={8}>Không có dữ liệu phù hợp</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>}
                            <div className="col-xs-12">
                                {this.state.compare && <div style={{marginBottom: "5px"}}>
                                    <h4 style={{display: "inline"}}><b>KPI tháng này</b></h4>
                                    {/* <button className="btn btn-success" style={{marginLeft: "80%"}}>Duyệt toàn bộ KPI</button> */}
                                </div>}
                                
                                <DataTableSetting class="pull-right" tableId="kpiApprove" tableContainerId="tree-table-container" tableWidth="1300px"
                                columnArr={[ 'Tên mục tiêu' ,'Mục tiêu đơn vị', 'Tiêu chí đánh giá' , 'Trọng số' , 'Trạng thái' , 'Hành động']} limit={this.state.perPage} setLimit={this.setLimit} hideColumnOption={true} />
                                <table id ="kpiApprove" className="table table-bordered table-striped">
                                <thead>
                                            <tr>
                                                <th title="STT">STT</th>
                                                <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                <th title="Mục tiêu đơn vị">Mục tiêu đơn vị</th>
                                                <th title="Mục tiêu đơn vị">Thời gian</th>
                                                <th title="Mục tiêu đơn vị">Số mục tiêu</th>
                                                <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                <th title="Trọng số">Trọng số</th>
                                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                            </tr>
                                        </thead>
                                    <tbody>
                                        {typeof kpimember !== "undefined" ?
                                            kpimember.kpis.map((item, index) =>
                                                <tr >
                                                        <td>{index+1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.parent.name}</td>
                                                        <td>{this.formatDate(item.date)}</td>
                                                        <td>{item.length}</td>
                                                        <td>{item.criteria}</td>
                                                        <td>{this.state.edit === item._id ? <input min="0" max="100" defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                        <td>{item.approvedPoint}</td>
                                                    </tr>
                                                ) : <tr><td colSpan={9}>Không có dữ liệu phù hợp</td></tr>
                                            }
                                    </tbody>
                                </table>
                            </div>
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