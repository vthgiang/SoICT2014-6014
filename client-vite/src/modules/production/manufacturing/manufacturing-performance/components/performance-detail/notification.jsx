import React from 'react';

const Notification = () => {
    return (
        <div className="chart-wrapper" style={{ overflowY: "auto" }}>
            <span className="chart-title">Lịch sử cảnh báo</span>
            <div className="noti_list">
                <div className="noti_item">
                    <div className="noti_icon">
                        <i className='material-icons'>warning</i>
                    </div>
                    <div className="noti_wrapper">
                        <div className="noti_header">KPI vượt ngưỡng</div>
                        <div className="noti_content">Chi phí sản xuất vượt ngưỡng 300$</div>
                        <div className="noti_date">28-03-2024 13:05</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification;
