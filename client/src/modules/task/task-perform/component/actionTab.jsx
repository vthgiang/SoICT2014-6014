import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Swal from 'sweetalert2';
import {
    TOKEN_SECRET
} from '../../../../env';
import {
    getStorage
} from '../../../../config';
import jwt from 'jsonwebtoken';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { managerKpiActions } from "../../../kpi/employee/management/redux/actions";


class actionTab extends Component {
    constructor(props){
        const token = getStorage();
        const verified = jwt.verify(token, TOKEN_SECRET);
        var idUser = verified._id;

        super(props);
        this.state = {
            currentUser: idUser,
            selected: "taskAction",
            comment: false,
            action: false,
            editComment: "",
            editAction: "",
            startTimer: false,
            pauseTimer: false,
            showChildComment: "",
            newComment: {
                task: this.props.id,
                creator: idUser,
                parent: null,
                content: "",
                file: null,
                taskActionId: null
            },
            newAction: {
                task: this.props.id,
                creator: idUser,
                content: "",
                file: null
            },
            timer: {
                task: this.props.id,
                startTimer: "",
                stopTimer: null,
                user: idUser,
                time: 0,
            },
            resultTask: 0,
            showModal: ""
        };
        this.contentComment = [];
        this.newContentComment = [];
        this.contentAction = [];
        this.newContentAction = [];
        this.onHandleChangeFile = this.onHandleChangeFile.bind(this);
        
    }
    
    render() {


        return (
            <div>
            <div className="nav-tabs-custom">
            <ul className="nav nav-tabs" style={{ borderTop: "solid", borderWidth: "thin", borderColor: "aliceblue", width: "60%" }}>
                <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">Hoạt động</a></li>
                <li><a href="#actionComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">Trao đổi</a></li>
                <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">Tài liệu</a></li>
                <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">Công việc con</a></li>
                <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">Lịch sử bấm giờ</a></li>
            </ul>
            <div className="tab-content">
                <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                    {/* Hoạt động của công việc theo mẫu */}
                    {actions &&
                        actions.map((item, index) =>
                            <div className="post clearfix" style={{ width: "50%" }} key={item._id}>
                                <div className="col-sm-11">
                                    <div className="user-block" style={{ display: "inline-block", marginBottom: "0px", textAlign: 'left', width: "100%", marginTop: "-1%", marginLeft: "15px" }}>
                                        <p>{index + 1 + ". "}{item.name}</p>
                                    </div>
                                    {/* Phê duyệt hoạt động theo mẫu */}
                                    {this.props.role === "accountable" &&
                                        <div className="action-comment" style={{ display: "inline-block" }}>
                                            <a href="#abc" title="Đạt" className="add_circle"><i className="material-icons">check_circle_outline</i></a>
                                            <a href="#abc" title="Không đạt" className="delete"><i className="material-icons">highlight_off</i></a>
                                        </div>
                                    }
                                    {/* Hành động mở bình luận của hoạt động */}
                                    <div className="action-comment" style={{ display: "inline-block", textAlign: 'left', width: "100%", marginTop: "-1%", marginLeft: "10px" }}>
                                        <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}>
                                            {showChildComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                        </a>
                                    </div>
                                </div>
                                <div className="col-sm-1">
                                    {/* Xác nhận hoàn thành hành động của người thực hiện */}
                                    {item.approve !== 1 && this.props.role === "responsible" &&
                                        <div className="action-comment" title="Xác nhận đã hoàn thành hoạt động này" style={{ display: "inline-block" }}>
                                            <i className="material-icons" style={{ color: "blue", fontWeight: "bold" }}>check</i>
                                        </div>
                                    }
                                </div>
                                <React.Fragment>
                                    {/* Hiển thị bình luận cho hoạt động của công việc theo mẫu */}
                                    {showChildComment === item._id &&
                                        <div className="comment-content-child">
                                            {
                                                actionComments.map(child => {
                                                    if (child.parent === item._id) return <div className="col-sm-12 " key={child._id} style={{ marginBottom: "10px" }}>
                                                        <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                            <img className="img-circle img-bordered-sm"
                                                                src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                style={{ height: "30px", width: "30px" }} />
                                                        </div>
                                                        <div className="col-sm-10" style={{ marginLeft: "-20%" }} >
                                                            <p style={{ marginBottom: "-4px", marginLeft: "-60px" }}>&nbsp;{child.content}</p>
                                                            {/*<a href={item.file.url} download>{item.file.name}</a>*/}
                                                            <span className="description">19:30 19-11-2020</span>
                                                            {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                                <div className="action-comment" style={{ display: "inline-block" }}>
                                                                    <a href="#abc" title="Sửa bình luận" className="edit" onClick={() => this.handleEditActionComment(child._id)}><i className="material-icons">edit</i></a>
                                                                    <a href="#abc" title="Xóa bình luận" className="delete" onClick={() => this.props.deleteActionComment(child._id)}><i className="material-icons">delete</i></a>
                                                                </div>
                                                            }
                                                        </div>
                                                        {editComment === child._id &&
                                                            <React.Fragment>
                                                                <textarea
                                                                    style={{ width: '87%', height: 50, fontSize: 13, border: '1px solid #dddddd' }}
                                                                    defaultValue={child.content}
                                                                    ref={input => this.newContentComment[child._id] = input}
                                                                />
                                                                <div className="row action-post" style={{ marginLeft: "40px", marginRight: "18px" }}>
                                                                    <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                    <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                    <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </div>;
                                                    return true;
                                                })
                                            }
                                            {/* Thêm bình luận cho hoạt động của công việc theo mẫu */}

                                            <div className="comment-child-action">
                                                <form className="form-horizontal" style={{ paddingTop: "1%" }}>
                                                    <div className="col-sm-12 margin-bottom-none">
                                                        <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                            <img className="img-circle img-bordered-sm"
                                                                //adminLTE/dist/img/user3-128x128.jpg
                                                                src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                style={{ height: "30px", width: "30px" }} />
                                                        </div>
                                                        <div className="col-sm-11" style={{ marginLeft: "9px" }} >
                                                            <textarea placeholder="Hãy nhập nội dung bình luận"
                                                                style={{ width: '100%', height: 50, fontSize: 13, border: '1px solid #dddddd' }} ref={input => this.contentComment[item._id] = input} />
                                                            <div className="row action-post" style={{ width: "107%" }}>
                                                                <input className="col-xs-7" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                <button style={{ width: "20%", marginRight: "2%", textAlign: "center" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id)}>Gửi bình luận</button>
                                                                <button style={{ width: "16%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    }
                                </React.Fragment>
                            </div>)
                    }
                    {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                        // Hiển thị hoạt động của công việc không theo mẫu
                        taskActions.map(item => {
                            // if (item.parent === null)
                            return <div className="post clearfix" style={{ textAlign: 'left', width: "40%", marginTop: "5%", marginLeft: "15px" }} key={item._id}>
                                <div className="user-block" style={{ display: "inline-block", marginBottom: "0px" }}>
                                    <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                    <span className="username">
                                        <a href="#abc">{item.creator.name}</a>
                                    </span>
                                    <p style={{ marginBottom: "4px", marginLeft: "60px" }}>&nbsp;{item.content}</p>
                                    <span className="description">19:30 19-11-2021</span>
                                </div>
                                {(item.creator._id === this.state.currentUser && this.props.role === "responsible") &&
                                    <div className="action-comment " style={{ display: "inline-block" }}>
                                        <a href="#abc" title="Sửa hành động" className="edit" onClick={() => this.handleEditAction(item._id)}><i className="material-icons">edit</i></a>
                                        <a href="#abc" title="Xóa hành động" className="delete" onClick={() => this.props.deleteTaskAction(item._id)}><i className="material-icons">delete</i></a>
                                    </div>
                                }
                                {this.props.role === "accountable" &&
                                    <div className="action-comment" style={{ display: "inline-block" }}>
                                        <a href="#abc" title="Đạt" className="add_circle"><i className="material-icons">check_circle_outline</i></a>
                                        <a href="#abc" title="Không đạt" className="delete"><i className="material-icons">highlight_off</i></a>
                                    </div>
                                }
                                <div className="comment-content" style={{ marginLeft: "8%" }}>
                                    {editAction === item._id ?
                                        <React.Fragment>
                                            {/* Chỉnh sửa nội dung hoạt động của công việc không theo mẫu */}
                                            <textarea
                                                style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd' }}
                                                defaultValue={item.content}
                                                ref={input => this.newContentAction[item._id] = input}
                                            />
                                            <div className="row action-post">
                                                <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditAction(e, item._id)}>Gửi chỉnh sửa</button>
                                                <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditAction(e)}>Hủy bỏ</button>
                                            </div>
                                        </React.Fragment> :
                                        <React.Fragment>
                                            {/* Hiển thị nội dung hoạt động cho công việc không theo mẫu */}
                                            <div className="attach-file" style={{ marginTop: "-10px" }}>
                                                {/* <a href={item.file.url} download>{item.file.name}</a> */}
                                            </div>
                                            <ul className="list-inline">
                                                <li className="pull-right">
                                                    <a href="#abc" title="Xem bình luận hoạt động này" className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}>
                                                        <i className="fa fa-comments-o margin-r-5" /> Bình luận({actionComments.filter(child => child.parent === item._id).reduce(sum => sum + 1, 0)}) &nbsp;
                                                        {showChildComment === item._id ? <i className="fa fa-angle-up" /> : <i className="fa  fa-angle-down" />}
                                                    </a>
                                                </li>
                                            </ul>
                                            {/* Hiển thị bình luận cho hoạt động không theo mẫu */}
                                            {showChildComment === item._id &&
                                                <div className="comment-content-child">
                                                    {actionComments.map(child => {
                                                        if (child.parent === item._id) return <div className="col-sm-12 form-group margin-bottom-none" key={child._id}>
                                                            <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "2%" }}>
                                                                <img className="img-circle img-bordered-sm"
                                                                    src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                    style={{ height: "30px", width: "30px" }} />
                                                            </div>
                                                            <div className="col-sm-11" style={{ marginBottom: "10px" }} >
                                                                <span className="username">
                                                                    <a href="#abc">{item.creator.name}</a>
                                                                </span>
                                                                <p style={{ marginBottom: "-2px" }}>&nbsp;{child.content}</p>
                                                                {/* <a href={child.file.url} download>{child.file.name}</a> */}
                                                                <span className="description">19:30 19-11-2019</span>
                                                                {(child.creator._id === this.state.currentUser || child.creator === this.state.currentUser) &&
                                                                    <div className="action-comment" style={{ display: "inline-block" }}>
                                                                        <a href="#abc" title="Sửa bình luận" className="edit" onClick={() => this.handleEditActionComment(child._id)}><i className="material-icons">edit</i></a>
                                                                        <a href="#abc" title="Xóa bình luận" className="delete" onClick={() => this.props.deleteActionComment(child._id)}><i className="material-icons">delete</i></a>
                                                                    </div>
                                                                }
                                                                {editComment === child._id &&
                                                                    <React.Fragment>
                                                                        <textarea
                                                                            style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px" }}
                                                                            defaultValue={child.content}
                                                                            ref={input => this.newContentComment[child._id] = input}
                                                                        />
                                                                        <div className="row action-post" style={{ marginRight: "-4px", marginBottom: "10px", marginLeft: "5px" }}>
                                                                            <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                            <button style={{ width: "15%", marginRight: "2%" }} className="col-xs-2 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                                                            <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                                                        </div>
                                                                    </React.Fragment>
                                                                }
                                                            </div>
                                                        </div>;
                                                        return true;
                                                    })
                                                    }
                                                    <div className="comment-child-action">
                                                        <form className="form-horizontal">
                                                            <div className="col-sm-12 margin-bottom-none" style={{ marginTop: "10px" }}>
                                                                <div className="col-sm-1 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                                                    <img className="img-circle img-bordered-sm"
                                                                        src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar"
                                                                        style={{ height: "30px", width: "30px" }} />
                                                                </div>
                                                                <div className="col-sm-11" >
                                                                    <textarea placeholder="Hãy nhập nội dung bình luận"
                                                                        style={{ width: '100%', height: 40, fontSize: 13, border: '1px solid #dddddd' }} ref={input => this.contentComment[item._id] = input} />
                                                                    <div className="row action-post" style={{ width: "107%" }}>
                                                                        <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />
                                                                        <button type="submit" style={{ width: "20%", marginRight: "2%", textAlign: "center" }} className="col-xs-2 col-xs-offset-7 btn btn-success btn-sm" onClick={(e) => this.submitComment(e, item._id, item._id)}>Gửi bình luận  </button>
                                                                        <button style={{ width: "16%" }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleComment}>Hủy bỏ</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            }
                                        </React.Fragment>
                                    }
                                </div>
                            </div>;
                            return true;
                        }) : null
                    }
                    {/* Thêm hoạt động cho công việc không theo mẫu */}
                    {this.props.role === "responsible" &&
                        <form className="form-horizontal" style={{ paddingTop: "2%" }}>
                            <div className="form-group margin-bottom-none">
                                <div className="col-sm-2 user-block" style={{ width: "4%", marginTop: "1%" }}>
                                    <img className="img-circle img-bordered-sm" src="http://webcoban.vn/image/cat-2.jpg" alt="user avatar" />
                                </div>
                                <div className="col-sm-8" >
                                    <textarea placeholder="Hãy nhập nội dung hoạt động"
                                        style={{ width: '60%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "-360px" }}
                                        onClick={this.handleAction} ref={input => this.contentAction[0] = input} />
                                    {action &&
                                        <div className="row action-post" style={{ width: "69.5%" }}>
                                            <input className="col-xs-8" type="file" name="file" onChange={this.onHandleChangeFile} />

                                            <button type="submit" style={{ width: "18%", marginRight: "2%", marginLeft: "-15%" }} className="col-xs-1 btn btn-success btn-sm" onClick={(e) => this.submitAction(e, null, 0)}>Thêm hoạt động</button>
                                            <button style={{ width: "13%", }} className="col-xs-2 btn btn-default btn-sm" onClick={this.handleAction}>Hủy bỏ</button>
                                        </div>}
                                </div>
                            </div>
                        </form>}
                </div>
                {/* Chuyển qua tab trao đổi */}
                <div className={selected === "actionComment" ? "active tab-pane" : "tab-pane"} id="actionComment">
                    <div>Tab trao đổi</div>
                </div>
                {/* Chuyển qua tab tài liệu */}
                <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                    {/* <div id="content"> */}
                    <input type="file" name="files[]" id="filer_input2" multiple="multiple" />
                    {/* </div> */}
                </div>
                {/* Chuyển qua tab công việc con */}
                <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">

                </div>
                {/* Chuyển qua tab Bấm giờ */}
                <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                    <ul style={{ listStyle: "none" }}>
                        {
                            logTimer &&
                            logTimer.map(item =>
                                <li className="list-log-timer" key={item._id}>
                                    <p style={{ fontSize: "15px" }}>{item.user.name} Bắt đầu: {this.format(item.start, 'H:i:s d-m-Y')} Kết thúc: {this.format(item.stopTimer, 'H:i:s d-m-Y')} Thời gian làm việc: {this.convertTime(item.time)}</p>
                                </li>)
                        }
                    </ul>
                </div>
            </div>
        </div>
            </div>
        );
    }
}

export default actionTab;

