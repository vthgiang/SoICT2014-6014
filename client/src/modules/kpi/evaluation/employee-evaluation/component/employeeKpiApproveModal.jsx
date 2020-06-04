import React, { Component } from 'react';
import { connect } from 'react-redux';
import { kpiMemberActions} from '../redux/actions';
import {PaginateBar, DataTableSetting } from '../../../../../common-components';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components/index';
import moment from 'moment'

import {
    getStorage
} from '../../../../../config';
import { Comments } from './employeeKpiComment';
// import Files from 'react-files'
// import TextareaAutosize from 'react-textarea-autosize';

// import '../../../../task/task-perform/component/actionTab';
class ModalMemberApprove extends Component {
    constructor(props) {
        var idUser = getStorage("userId");
        super(props);
        this.state = {
            currentUser: idUser,
            date : this.formatDateBack(Date.now()),
            editing: false,
            edit: "",
            compare: false,
            checkInput: false,
            checkWeight: false,
            
        };
        this.newWeight = [];
    }
    // componentDidMount() {
    //     // console.log('id : ====='+this.props.id);
    //     this.props.getKPIMemberById(this.props.id);
    // }
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.props.getKPIMemberById(nextProps.id);
            return false;
        }
        return true;
    }
    handleEdit = async (id) => {
        await this.setState(state => {
            // console.log('weight 1: =================== ' + this.state.weight);

            return {
                ...state,
                editing: true,
                edit: state.edit ===id ? "" : id,
                // weight: this.state.weight
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
                    // weight: parseInt(this.newWeight[target._id].value)                
                },            
            }
        })
        // console.log('weight 2 ===================' + this.state.weight);
        // console.log('this.newWeight[target._id]'+ this.newWeight[target._id] );
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
    handleDateChange = (value) => {
        this.setState(state => {
                return {
                    ...state,
                    errorOnDate: this.validateDate(value),
                    date: value,
                }
            });
        
    }
    validateDate = (value) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Chon thang so sanh";
        }
        
        return msg;
    }
    handleCompare = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                compare: !state.compare
            }
        })
        if (id) {
				this.props.getKPIMemberByMonth(id,this.formatDateBack(Date.now()));
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
            month = '' + (d.getMonth()+1);
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
    searchKPIMemberByMonth = async (id) => {
        
        if(this.state.date === undefined || this.state.date == this.formatDateBack(Date.now()) ){    
            
            this.props.getKPIMemberByMonth(id, this.formatDateBack(Date.now()));
        }
        else { 
            this.props.getKPIMemberByMonth(id, this.state.date);
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
        // console.log('approve id'+this.props.id);
        var kpimember;
        var kpimembercmp ;
        const { kpimembers } = this.props;
        const { errorOnDate, date,currentUser} = this.state;

        if (kpimembers.currentKPI) kpimember = kpimembers.currentKPI;
        console.log('idddddddd================'+ this.props.id);
        
        // var comment = kpimembers.currentKPI.kpis;
        // console.log('comments: ========'+ comment);
        if (kpimembers.kpimembers){
            var arrkpimember = kpimembers.kpimembers;
            arrkpimember.forEach(item => {
                var datekpi= item.date.split('-');
                var date= new Date();
                if((date.getMonth()+1)===datekpi[1] && date.getFullYear()===datekpi[2]){
                    kpimember= item;
                }
            });
        } 
        if (kpimembers.kpimember) kpimembercmp  =  kpimembers.kpimember;
        // console.log('kpimembercmp'+ kpimember);
        return (
            <React.Fragment>
                <DialogModal
                modalID={`modal-approve-KPI-member`}
                // formID={`form-evaluate-task-by-${this.props.role}`}
                title={`Phê duyệt KPI nhân viên ${kpimember && kpimember.creator.name}`}
                // title={`Phê duyệt KPI nhân viên `}
                // func={this.save}
                hasSaveButton ={false}
                // disableSubmit={!this.isFormValidated()}
                size={100}
                >
            {/* <div className="modal modal-full fade" id={"memberKPIApprove" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> */}
                {/* <div className="modal-dialog-full"> */}
                    {/* <div className="modal-content"> */}
                    {/* <form action=""></form> */}
                    {/* <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(this.props.id, kpimember.kpis)}>
                            <span aria-hidden="true">×</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <h3 className="modal-title" style={{textAlign:"center"}}>Phê duyệt KPI nhân viên {kpimember && kpimember.creator.name}</h3>
                    </div> */}
                        <div className="box" >
                            <div className="box-body qlcv">
                            
                                {this.state.checkWeight&&<div className="col-sm-12" style={{color: "red"}}><label>Trọng số đang không thỏa mãn!</label></div>}
                                <div className="form-inline">
                                
                                {this.state.compare ? <button className=" btn btn-success pull-right"  onClick={() => this.handleCompare()}>Tắt so sánh</button>
                                        : <button className=" btn btn-success pull-right"  onClick={() => this.handleCompare(kpimember.creator._id)}>So sánh với KPI cũ</button> }
                                        <button className=" btn btn-success pull-right"  onClick={()=>this.handleApproveKPI(kpimember._id, kpimember.kpis)}>Duyệt toàn bộ KPI</button>  
                                
                              </div>  
                              <br/>
                            {this.state.compare &&
                                <div>
                                    <div className="form-inline">
                                            <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                                <label style={{width:"auto", fontSize:"18px"}} >Chọn tháng so sánh:</label>
                                                    <DatePicker
                                                        id="create_date"
                                                        dateFormat="month-year"
                                                        value={date}
                                                        onChange={this.handleDateChange}
                                                    />
                                                <ErrorLabel content={errorOnDate} />
                                            
                                           </div>
                                            <div className="form-group" >
                                            <button className="btn btn-success" onClick={() => this.searchKPIMemberByMonth(kpimember.creator._id)}>Tìm kiếm</button>
                                        </div>
                                    </div>
                                    <table className="table table-bordered table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th title="STT" className="col-fixed" style={{width: 50}}>STT</th>
                                                <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                <th title="Mục tiêu đơn vị">Mục tiêu đơn vị</th>
                                                {/* <th title="Thời gian">Thời gian</th> */}
                                                {/* <th title="Số mục tiêu">Số mục tiêu</th> */}
                                                <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                <th title="Trọng số">Trọng số</th>
                                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            { kpimembercmp ?
                                                kpimembercmp.kpis.map((item, index) =>
                                                    <tr >
                                                        <td>{index+1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.parent && item.parent.name }</td>
                                                        {/* <td>{this.formatDate(kpimembercmp.date)}</td> */}
                                                        {/* <td>{kpimembercmp.kpis.length}</td> */}
                                                        <td>{item.criteria}</td>
                                                        <td>{this.state.edit === item._id ? <input min="0" max="100"defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                        <td>{item.approvedPoint}</td>
                                                        
                                                    </tr>
                                                ) : <tr><td colSpan={6}>Không có dữ liệu phù hợp</td></tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                }
                            <div className="form-inline">
                                {/* {this.state.compare> */}
                                    <h4 ><b>KPI tháng này</b></h4>
                                {/* // } */}
                                
                                <DataTableSetting class="pull-right" tableId="kpiApprove" tableContainerId="tree-table-container" tableWidth="1300px"
                                columnArr={[ 'STT', 'Tên mục tiêu' ,'Mục tiêu đơn vị', 'Tiêu chí đánh giá' , 'Trọng số' , 'Kết quả đánh giá' , 'Hành động']} limit={this.state.perPage} setLimit={this.setLimit} hideColumnOption={true} />
                                <table id ="kpiApprove" className="table table-bordered table-striped table-hover">
                                <thead>
                                            <tr>
                                                <th title="STT" className="col-fixed" style={{width: 50}}>STT</th>
                                                <th title="Tên mục tiêu">Tên mục tiêu</th>
                                                <th title="Mục tiêu đơn vị">Mục tiêu đơn vị</th>
                                                {/* <th title="Thời gian">Thời gian</th> */}
                                                {/* <th title="Số mục tiêu">Số mục tiêu</th> */}
                                                <th title="Tiêu chí đánh giá">Tiêu chí đánh giá</th>
                                                <th title="Trọng số">Trọng số</th>
                                                <th title="Kết quả đánh giá">Kết quả đánh giá</th>
                                                <th title="Hành động" className="col-fixed" style={{width: 100}}>Hành động</th>

                                            </tr>
                                        </thead>
                                    <tbody>
                                        {kpimember &&
                                            kpimember.kpis.map((item, index) =>
                                                <tr >
                                                        <td>{index+1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.parent && item.parent.name}</td>
                                                        {/* <td>{this.formatDate(kpimember.date)}</td> */}
                                                        {/* <td>{kpimember.kpis.length}</td> */}
                                                        <td>{item.criteria}</td>
                                                        <td>{this.state.edit === item._id ? <input min="0" max="100"  ref={input => this.newWeight[item._id]= input}  defaultValue={item.weight} style={{ width: "60px" }} /> : item.weight}</td>
                                                        <td>{item.approvedPoint}</td>
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
                
                <Comments id={this.props.id}></Comments>
                
            </DialogModal>
        </React.Fragment>
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