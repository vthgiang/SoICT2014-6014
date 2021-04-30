import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatFunction } from '../../common/index';

function HistoryOfStateTransitionsTabInfoForm  (props) {
    

        const { id, customerInfomation } = props;
        const { statusHistories } = customerInfomation;
        const[detailStatus, setDetailStatus] = useState(new Array(statusHistories.length).fill(false));
        function handleSeeDetail (index){
               const newDetailStatus = [...detailStatus];
               newDetailStatus[index] = !newDetailStatus[index];
               setDetailStatus(newDetailStatus);
        }
        return (
            <div className="tab-pane" id={id}>
                <div className="description-box" >
                    <h4>Lịch sử thay đổi trạng thái khách hàng</h4>
                    <div className="histories-timeline-container" style={{ marginTop: '15px' }}>
                        {
                            statusHistories && statusHistories.length > 0 ? statusHistories.map((o, index) => (
                                <div key={index} className="histories-timeline-item">
                                    <div className="histories-timeline-item__content">
                                        <time>{formatFunction.formatDateTime(o.createdAt)}</time>
                                        <p style={{ fontSize: '14px' }}>
                                            {(o.oldValue._id === o.newValue._id)
                                                ? (<div>
                                                    <strong>{o.createdBy.name}</strong> đã tạo khách hàng với trạng thái là  <strong>{o.newValue.name}</strong>
                                                    </div>
                                                    )

                                                :(  <div>
                                                     <strong>{o.createdBy.name}</strong> đã chuyển trạng thái khách hàng từ <strong>{o.oldValue.name}</strong> thành <strong>{o.newValue.name}</strong>
                                                     </div>
                                                     )
                                            }
                                        </p>
                                        {detailStatus[index] && (
                                        <div >
                                            <p  style={{ fontSize: '14px' }}> <strong>Nội dung thay đổi : </strong>
                                            {o.description}</p>
                                        </div>
                                        )}
                                        <p  style={{ fontSize: '14px' }} className='pointer' onClick ={()=>handleSeeDetail(index)}>{detailStatus[index]==false ? '>> xem chi tiết': '<< đóng'}</p>
                                       
                                        <span className="circle" />
                                    </div>
                                </div>
                            ))
                                : ''
                        }
                    </div>
                </div>
            </div>
        );
    
}

export default connect(null, null)(withTranslate(HistoryOfStateTransitionsTabInfoForm));