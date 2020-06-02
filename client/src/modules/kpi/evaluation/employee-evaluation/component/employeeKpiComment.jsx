import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    getStorage
} from '../../../../../config';

import { kpiMemberActions } from '../redux/actions';
import { LOCAL_SERVER_API } from '../../../../../env';
import Rating from 'react-rating'
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
            file:[],
            editCommentOfComment:"",
            showChildComment:"",
            showComments: false
        }
    }
handleShowComments = async (id) => {
    await this.setState(state => {
        return{
            ...state,
            showComments : !this.state.showComments
        }
    })

    
}
    render(){
        var kpimember;
        const {kpimembers} = this.props;
        console.log('commment page id' + this.props.id);
        kpimember = kpimembers && kpimembers.currentKPI;
        console.log('kpimember'+ kpimember);
        return(
            <React.Fragment>
            <div>
                {this.state.showComments ? <button class="btn btn-success pull-right" onClick={()=> this.handleShowComments()}>Ẩn bình luận</button>
                : <button class="btn btn-success pull-right" onClick={()=> this.handleShowComments()}>Hiển thị bình luận</button> }
                {/* <button class="btn btn-success pull-right" onClick={()=> this.handleShowComments()}>Hiển thị bình luận</button> */}
                {this.state.showComments &&
                    <div>
{kpimember && kpimember.comments.map(child => {
                    return <div className="col-sm-12 form-group margin-bottom-none" key={child._id} style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <div class="user-block" style={{marginBottom:"10px"}}>
                            <img class="img-circle img-bordered-sm" src={(LOCAL_SERVER_API+child.creator.avatar)} style={{ height: "40px", width: "40px" }} alt="" />
                                <span class="username">
                                    <a href="#">{child.creator.name}</a>
                                    {child.creator._id === this.state.currentUser && 
                                    <div class="btn-group dropleft pull-right">
                                        <button class="btn btn-primary-outline dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" type="button" aria-haspopup="true" aria-expanded="false" style={{ marginTop: "10px", backgroundColor: "transparent", }}  >
                                            <svg class="bi bi-three-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd" d="M3 9.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div class="dropdown-menu" id="dropdownMenu" aria-labelledby="dropdownMenuButton" style={{ borderRadius: "6px" }}>
                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }}>Sửa bình luận</button>
                                            <div class="dropdown-divider"></div>
                                            <button class="dropdown-item btn-primary-outline" type="button" style={{ background: "none", border: "none" }} >Xóa bình luận</button>
                                            <div class="dropdown-divider"></div>
                                            
                                        </div>
                                    </div>}
                                </span>
                            <span class="description">{moment(child.createdAt).fromNow()}</span>
                        </div>
                        <p style={{backgroundColor:"#f2f3f5",borderRadius:"15px",padding:"10px", wordWrap:"break-word",overflowWrap:"break-word"}}>
                            {child.content}
                        </p>
                        {/* {editComment === child._id &&
                            <React.Fragment>
                                <div style={{ width: "83%", marginLeft: "8.2%" }}>
                                    <textarea
                                        rows={this.state.rows}
                                        //value={this.state.value}
                                        className={'textarea'}
                                        onChange={this.handleChange}
                                        style={{ width: '100%', height: 65, fontSize: 13, border: '1px solid #dddddd', marginLeft: "5px", borderRadius: "18px",padding:"10px 0px 0px 10px"  }}
                                        defaultValue={child.content}
                                        ref={input => this.newContentCommentOfAction[child._id] = input}
                                    />
                                    <div className="row action-post" style={{ marginRight: "-4px", marginBottom: "10px", marginLeft: "5px" }}>
                                        <button style={{ width: "20%", marginRight: "2%" }} className="col-xs-3 btn btn-success btn-sm" onClick={(e) => this.handleSaveEditActionComment(e, child._id)}>Gửi chỉnh sửa</button>
                                        <button style={{ width: "15%" }} className="col-xs-2 btn btn-default btn-sm" onClick={(e) => this.handleEditActionComment(e)}>Hủy bỏ</button>
                                    </div>
                                </div>
                            </React.Fragment>
                        } */}
                    </div>;
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
}
const connectedComments = connect(mapState, actionComments)(withTranslate(Comments));
export { connectedComments as Comments}