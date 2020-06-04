import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    getStorage
} from '../../../../../config';

import { kpiMemberActions } from '../redux/actions';
import { LOCAL_SERVER_API } from '../../../../../env';
import TextareaAutosize from 'react-textarea-autosize';
import moment from 'moment'
import Files from 'react-files'
class Comments extends Component{
    constructor(props){
        var idUser = getStorage("userId");
        super(props);
        this.state = {
            currentUser : idUser,
            comment: false,
            editComment: false,
            files:[],
            commentfiles:[],
            editCommentOfComment:"",
            showChildComment:"",
            showComments: false,
            newComment: {
                creator: idUser,
                content: "",
            },
            newCommentOfComment: {
                creator: idUser,
                content: "",
            }
        }
        this.contentComment = [];
    }
handleShowComments = async (id) => {
    await this.setState(state => {
        return{
            ...state,
            showComments : !this.state.showComments
        }
    })   
}

handleEditComment = async (id) => {

    await this.setState(state => {
        return {
            ...state,
            editComment: id
        }
    })
}
handleShowChildComment = async (id) => {
    var showChildComment = this.state.showChildComment;
    if (showChildComment === id) {
        await this.setState(state => {
            return {
                ...state,
                showChildComment: ""
            }
        })
    } else {
        await this.setState(state => {
            return {
                ...state,
                showChildComment: id
            }
        })
    }
}

//Thêm mới bình luận
addNewComment = async (e, id, index,kpiId) => {
    e.preventDefault();
    await this.setState(state => {
        return {
            ...state,
            newAction: {
                ...state.newAction,
                content: this.contentComment[index].value,
                task: kpiId,
                files: this.state.files
            }
        }
    })
    var { newComment } = this.state;
    const data = new FormData();
    data.append("kpiEmployeeId", newComment.kpiEmployeeId);
    data.append("creator", newComment.creator);
    data.append("content", newComment.content);
    newComment.files.forEach(x=>{
        data.append("files", x);
    })
    //Xóa file đã được chọn mỗi khi gửi hoạt động
    
    if(newComment.creator && newComment.content){
        
        this.props.addTaskAction(data);
        if(this.state.files){
            this.state.files.forEach(item=>{
                this.refs.filesAddAction.removeFile(item)
            })
        }
    }
    
    this.contentComment[index].value = "";
}

filesRemoveOne = (file) => {
    this.refs.filesAddAction.removeFile(file)
    }
    filesRemoveAll = () => {
    this.refs.filesAddAction.removeFiles()
    }
    requestDownloadFile = (id, fileName) => {
        this.props.downloadFile(id, fileName);
    }

    render(){
        var kpimember;
        const {kpimembers} = this.props;
        const { editComment, showChildComment, currentUser } = this.state;
        console.log('commment page id' + this.props.id);
        kpimember = kpimembers && kpimembers.currentKPI;
        // console.log('kpimember'+ kpimember);
        return(
            <React.Fragment>
            <div>
                {this.state.showComments ? <button class="btn btn-success pull-right" onClick={()=> this.handleShowComments()}>Ẩn bình luận</button>
                : <button class="btn btn-success pull-right" onClick={()=> this.handleShowComments()}>Hiển thị bình luận</button> }
                {this.state.showComments &&
                    <div style={{width:"50%"}}>
                        <br/>
                        <br/>
                        <React.Fragment>
                            
                                {/* <img className="user-img-level1" src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar" /> */}
                                <div className="text-input-level1">
                                    <TextareaAutosize
                                        placeholder="Hãy nhập nội dung bình luận"
                                        useCacheForDOMMeasurements
                                        minRows={3}
                                        maxRows={20}
                                        ref={input => this.contentComment[0] = input} />
                                </div>
                                
                                <div className="tool-level1">
                                    <div style={{textAlign: "right"}}>
                                        <a href="#" className="link-black text-sm" >Thêm hoạt động</a>
                                    </div>
                                    
                                    <Files
                                        ref='filesAddAction'
                                        className='files-dropzone-list'
                                        onChange={this.onFilesChange}
                                        onError={this.onFilesError}
                                        multiple
                                        maxFiles={10}
                                        maxFileSize={10000000}
                                        minFileSize={0}
                                        clickable={false}>  
                                        <div className='files-list'>
                                            <a href="#" className="pull-right" title="Đính kèm file" onClick={(e) => this.refs.filesAddAction.openFileChooser()}>
                                                <i class="material-icons">attach_file</i>
                                            </a>
                                            <span>Drop files here</span>
                                            
                                        </div> 
                                    </Files>
                                    
                                </div>
                            </React.Fragment>
                    {kpimember && kpimember.comments.map(item => {
                    return <div className="col-sm-12 form-group margin-bottom-none" key={item._id} style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <div class="user-block" style={{marginBottom:"10px"}}>
                            <img class="img-circle img-bordered-sm" src={(LOCAL_SERVER_API+item.creator.avatar)} style={{ height: "40px", width: "40px" }} alt="" />
                            {/* <img className="user-img-level1" src={(LOCAL_SERVER_API+"/upload/avatars/none.jpeg")} alt="User Image" /> */}
                                <span class="username">
                                    <a href="#">{item.creator.name}</a>
                                    {item.creator._id === this.state.currentUser && 
                                    <div class="btn-group dropleft pull-right">
                                        <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                            <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                            <button class="dropdown-item btn-primary-outline" type="button" onClick={() => this.handleEditComment(item._id)} style={{ background: "none", border: "none" }} >Sửa bình luận</button>
                                            <div class="dropdown-divider"></div>
                                            <button class="dropdown-item btn-primary-outline" type="button" onClick={() => this.props.deleteComment(item._id, kpimember._id)} style={{ background: "none", border: "none" }} >Xóa bình luận</button>
                                            <div class="dropdown-divider"></div>
                                            
                                        </div>
                                    </div>}
                                </span>
                            <span class="description">{moment(item.createdAt).fromNow()}</span>
                        </div>
                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                            {item.content}
                        </p>
                        {/* {showChildComment && */}
                            <div>
                                {item.comments.map(child => {
                                    return <div  key={child._id}>
                                        <img className="user-img-level2" src={(LOCAL_SERVER_API+child.creator.avatar)} alt="User Image" />
                                        
                                        {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                        <div>
                                            <p className="content-level2">
                                                <a href="#">{child.creator.name} </a>
                                                {child.content}
                                                {child.creator._id === currentUser && 
                                                <div className="btn-group dropleft pull-right">
                                                    <button className="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" >
                                                        <svg className="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <div className="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item btn-primary-outline" type="button" >Sửa bình luận</button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item btn-primary-outline" type="button"  >Xóa bình luận</button>
                                                        <div className="dropdown-divider"></div>
                                                        
                                                    </div>
                                                </div>}
                                            </p>
                                            {/* <div className="tool-level2">
                                                <span className="text-sm">{moment(child.createdAt).fromNow()}</span>
                                            </div> */}
                                            <ul className="list-inline tool-level2">
                                                    <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                    {child.files.length> 0 &&
                                                    <React.Fragment>
                                                    <li style={{display:"inline-table"}}>
                                                    <div><b>File đính kèm:</b></div></li>
                                                    <li style={{display:"inline-table"}}>
                                                    {child.files.map(elem => {
                                                        return <div><a href="#" onClick={()=>this.requestDownloadFile('123456', "a")}> {elem.name} </a></div>
                                                    })}
                                                    </li></React.Fragment>}
                                            </ul>
                                        </div>
                                        }
                                        
                                        {/*Chỉnh sửa nội dung bình luận của hoạt động */}
                                        {
                                            <div>
                                                <div className="text-input-level2">
                                                    <textarea
                                                        rows={this.state.rows}
                                                        placeholder={'Enter your text here...'}
                                                        className={'textarea'}
                                                        onChange={this.handleChange}
                                                        defaultValue={child.content}
                                                        ref={input => this.newContentCommentOfAction[child._id] = input}
                                                    />
                                                </div>
                                                <ul className="list-inline tool-level2 pull-right">
                                                    <li><a href="#" className="link-black text-sm" >Gửi chỉnh sửa </a></li>
                                                    <li><a href="#" className="link-black text-sm" >Hủy bỏ</a></li>
                                                </ul>
                                                <div className="tool-level2">
                                                </div>
                                            </div>
                                        }
                                    </div>;
                                    return true;
                                })
                                }
                                {/*Thêm bình luận cho hoạt động */}
                                <div>
                                    <img className="user-img-level2"
                                        // src={(LOCAL_SERVER_API+auth.user.avatar)} alt="user avatar"
                                    />
                                    <div className="text-input-level2">
                                        <textarea placeholder="Hãy nhập nội dung bình luận" id="textarea-action-comment"  />    
                                    </div>
                                    <div className="tool-level2">
                                        <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.submitComment(e, item._id, item._id, kpimember._id)}>Gửi bình luận</a>
                                        <Files
                                            ref='filesAddAction1'
                                            className='files-dropzone-list'
                                            onChange={this.onCommentFilesChange}
                                            onError={this.onFilesError}
                                            multiple
                                            maxFiles={10}
                                            maxFileSize={10000000}
                                            minFileSize={0}
                                            clickable={false}>  
                                            <a href="#" className="link-black text-sm pull-right" onClick={(e) => this.refs.filesAddAction1.openFileChooser()}>Uploadfile &nbsp; &nbsp; </a>
                                        </Files>
                                    </div>
                                    <ul>{this.state.commentfiles.map((file) =>
                                        <li className='files-list-item' key={file.id}>
                                            <div className='files-list-item-preview'>
                                            {file.preview.type === 'image' ?  
                                            <React.Fragment>
                                                <img className='files-list-item-preview-image'src={file.preview.url} />
                                            </React.Fragment>    
                                            : 
                                            <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                                <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.filesAddAction1.removeFile(file)}}><i className="fa fa-times"></i></a>
                                            </div>
                                            <div className='files-list-item-content'>
                                                <div className='files-list-item-content-item files-list-item-content-item-comment-1'>{file.name}</div>
                                                <div className='files-list-item-content-item files-list-item-content-item-comment-2'>{file.sizeReadable}</div>
                                            </div>
                                        </li>)}
                                    </ul>
                                </div>
                            </div>
                            
                            
                    </div>
                    // return true;
                })
                }
                
                    </div>
                    
                }
                
            </div>
            </React.Fragment>
        );
    }

}
    


function mapState(state){
    const { kpimembers } = state;
    return { kpimembers };
}
const actionComments = {
    getAllComments: kpiMemberActions.getAllComments,
    deleteComment: kpiMemberActions.deleteComment,
}
const connectedComments = connect(mapState, actionComments)(withTranslate(Comments));
export { connectedComments as Comments}