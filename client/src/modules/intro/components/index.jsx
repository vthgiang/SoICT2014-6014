import React from 'react';

const Introduction = (props) => {

    return (
        <div className="dx-intro">
            <div className="dx dx-header">
                <div className="dx-content">
                    <span className="dx dx-logo">DX</span>
                    <span className="dx dx-auth">
                        <a href="/login" className="dx-btn sign-in">Đăng nhập</a>
                        <a href="/login" className="dx-btn sign-up">Đăng ký</a>
                    </span>
                </div>
            </div>
            <div className="dx dx-body">
                <div className="dx-content1">
                    
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="dx-sologan">
                                Giải pháp không gian làm việc số cho doanh nghiệp
                                <ul className="dx-services">
                                    <li className="dx-service-item">
                                    <i className="fa fa-check"></i>
                                        Môi trường làm việc số thân thiện và thuận tiện cho mọi nhân viên
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Hỗ trợ lãnh đạo, quản lý các cấp theo dõi điều hành công việc thông qua hệ thống dashboard
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Đánh giá KPI linh hoạt chính xác
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Cơ chế giao việc thuận tiện, tối ưu giúp giảm bớt thời gian, số hóa toàn diện các quy trình nghiệp vụ của doanh nghiệp trên môi trường làm việc số
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Tiết kiệm chi phí đầu tư
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Dữ liệu hệ thống an toàn và bảo mật
                                    </li>
                                    <li className="dx-service-item">
                                        <i className="fa fa-check"></i>
                                        Hỗ trợ khách hàng 24/7
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <img className="dx-content1 image" src='/library/dx/images/image5.png'/>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="row dx-signup">
                                <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 dx-col">
                                    <input className="dx-signup" placeholder="Email"></input>
                                </div>
                                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 dx-col">
                                    <button className="dx-signup">Đăng ký dùng thử</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dx-content2">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                            content
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                            <img style={{width: '100%'}} src='/library/dx/images/taisan.png'/>
                        </div>
                    </div>
                    
                </div>
                <div className="dx-content3">
                    a
                </div>
                <div className="dx-content4">
                    a
                </div>
            </div>
            <div className="dx dx-footer">
                <div className="dx-footer dx-content">
                    <span>office@vnist.vn</span>
                    <span>+84 986 986 247</span>
                </div>
                <div className="dx-copyright">Bản quyền @ VNIST 2020</div>
            </div>
        </div>
    );
}

export default Introduction;