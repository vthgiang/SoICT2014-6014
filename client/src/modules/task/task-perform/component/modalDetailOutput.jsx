import React, { Component, useState, useEffect } from 'react';
import { ContentMaker, DialogModal } from '../../../../common-components';


function OutputDetail(props) {
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-output`}
                title={"Chi tiết tập tin"}
                formID={`detail-output`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className='col-xs-12 flex'>
                    <div className='col-xs-8'>
                        {/* <iframe src="/modules/task/task-perform/component/VanBanGoc_01.2019.TT-BNV.pdf" width="100%" height="500px" /> */}
                        <embed src="https://vinasupport.com/my_pdf_file.pdf" width="100%" height="500" type="application/pdf"></embed>
                    </div>
                    <div className='col-xs-4'>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>Người thực hiện: </strong>
                            <span>Bùi Thống Danh</span>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>Mô tả: </strong>
                            <span>Giấy phép kinh doanh đăng ký năm 2018</span>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>Ngày tạo: </strong>
                            <span>18:05 19-05-2022</span>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>Ngày cập nhật: </strong>
                            <span>07:00 20-05-2022</span>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                            <strong>Trao đổi:</strong>
                            <div style={{ marginBottom: "5px" }}>
                                <img className="user-img-level2"
                                    src={(process.env.REACT_APP_SERVER)} alt="user avatar"
                                />
                                <ContentMaker
                                    idQuill={`add-comment-action`}
                                    imageDropAndPasteQuill={false}
                                    inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                // onFilesChange={(files) => onCommentFilesChange(files, item._id)}
                                // onFilesError={onFilesError}
                                // files={newCommentOfAction[`${item._id}`]?.files}
                                // text={newCommentOfAction[`${item._id}`]?.descriptionDefault}
                                // placeholder={translate("task.task_perform.enter_comment_action")}
                                // submitButtonText={translate("task.task_perform.create_comment_action")}
                                // onTextChange={(value, imgs) => handleChangleCommentOfTaskActions(value, item)}
                                // onSubmit={(e) => { submitComment(item._id, task._id) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal >
        </React.Fragment >
    );
}

export default OutputDetail;
