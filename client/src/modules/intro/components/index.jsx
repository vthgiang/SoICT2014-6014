import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../auth/redux/actions';
import { getStorage } from '../../../config';
import { Link } from 'react-router-dom';

const Introduction = (props) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const user = getStorage('userId');
        setUser(user);  
        if(user) {
            props.refresh();
            
            const currentRole = getStorage("currentRole");
            props.getLinksOfRole(currentRole)
                .then(res=>{
                    setUser(props.auth.user._id);
                });
       }
    }, [user]);
    console.log()
    return (
        <React.Fragment>
            <header className="fixed-top p-center-h">
                <h3>DX Workspace</h3>
                <span className="dx-auth">
                    {
                        user ?
                        <Link to="/home" className="dx-workspace-button">Bắt đầu</Link> :  
                        <Link to="/login" className="dx-workspace-button">Đăng nhập</Link>
                    }
                </span>
            </header>
            <section id="dx-intro" className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Giải pháp không gian làm việc số cho doanh nghiệp</h2>
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
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image" src='/library/dx/images/image4.png' style={{borderRadius: '50%'}}/>
                    </div>
                </div>
                
            </section>
            
            <section id="dx-service" className="dx-container">
                <h3 className="text-center">Các giải pháp về quản lý trong doanh nghiệp</h3>
                <p>Chúng tôi phục vụ các công ty vừa và nhỏ trong tất cả các ngành liên quan đến công nghệ với các dịch vụ chất lượng cao được trình bày dưới đây</p>
                <div className="row p-center">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/kpi.png'/>
                            </div>
                            <div className="dx-card-body">
                                <h4>Quản lý KPI</h4>
                                <p>Tự động, khoa học và minh bạch</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/task.png'/>
                            </div>
                            <div className="dx-card-body">
                                <h4>Quản lý công việc</h4>
                                <p>Cơ chế giao việc và nhận việc tiện lợi, tiết kiệm thời gian, hỗ trợ người dùng tập trung vào công việc</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/document.png'/>
                            </div>
                            <div className="dx-card-body">
                                <h4>Quản lý tài liệu</h4>
                                <p>Hỗ trợ quản lý tập trung tài liệu, thuận tiện cho việc tra cứu</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/employee.png'/>
                            </div>
                            <div className="dx-card-body">
                                <h4>Quản lý nhân sự</h4>
                                <p>Quản lý danh sách thông tin về nhân sự trong doanh nghiệp</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div className="dx-card">
                            <div className="dx-card-header">
                                <img className="service-image" src='/library/dx/images/assets.png'/>
                            </div>
                            <div className="dx-card-body">
                                <h4>Quản lý tài sản</h4>
                                <p>Quản lý tài sản trong doanh nghiệp</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>

            <section className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Quản lý công việc</h2>
                        <p>Quản lý công việc không theo quy trình với cơ chế giao việc và nhận việc tiện lợi, tiết kiệm thời gian làm việc, hỗ trợ người dùng tập trung vào công việc. Quản lý công việc theo quy trình: Hỗ trợ người dùng nắm bắt được hiện trạng các công việc, từ đó người quản lý có những phương án tổ chức công việc phù hợp, hiệu quả, đúng lúc. Cơ chế giao việc và nhận việc được thực hiện dễ dàng, tiết kiệm thời gian. Giúp người dùng tập trung hơn trong công việc.</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mtask.png'/>
                    </div>
                </div>
                
            </section>

            <section className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mkpi.png'/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Quản lý KPI</h2>
                        <p>Quản lý KPI tự động, khoa học, minh bạch: Hệ thống cung cấp các cách tính KPI tự động, người dùng có thể tự customize công thức tính KPI tùy thuộc vào lĩnh vực của từng bộ phận/đơn vị.</p>
                    </div>
                </div>
                
            </section>

            <section className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Quản lý tài liệu</h2>
                        <p>Quản lý tài liệu là công việc lưu trữ, phân loại dữ liệu nội bộ của tổ chức, doanh nghiệp, nhằm phục vụ cho việc kinh doanh, sản xuất. Quản lý tài liệu hiệu quả sẽ giúp doanh nghiệp, tổ chức sắp xếp, tổ chức tài liệu hợp lý hơn, tiết kiệm chi phí bảo quản và thời gian tiềm kiếm.</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/mdocument.png'/>
                    </div>
                </div>
                
            </section>

            <section className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/memployee.png'/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Quản lý nhân sự</h2>
                        <p>Quản lý thông tin nhân sự trong doanh nghiệp
Các cán bộ cấp cao có thể dễ dàng theo dõi tình hình nhân sự qua các biểu đồ thống kê</p>
                    </div>
                </div>
                
            </section>

            <section className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h2 className="dx-sologan text-center">Quản lý tài sản</h2>
                        <p>Quản lý thông tin tài sản dễ dàng. Truy suất thông tin nhanh chóng. Thống kê theo dõi dưới dạng các biểu đồ linh hoạt, dễ dàng nắm bắt thông tin.</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <img className="dx-intro-image dx-card" src='/library/dx/images/masset.png'/>
                    </div>
                </div>
                
            </section>

            <section id="dx-service-signup" className="dx-container">
                
                <div className="row p-center-h">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h3 className="text-center">Đăng ký sử dụng dịch vụ</h3>
                        <ul className="dx-services">
                            <li className="dx-service-item">
                                <i className="fa fa-check"></i>
                                Miễn phí dùng thử 15 ngày
                            </li>
                            <li className="dx-service-item">
                                <i className="fa fa-check"></i>
                                Tối đa truy cập 10 user
                            </li>
                            <li className="dx-service-item">
                                <i className="fa fa-check"></i>
                                Trải nghiệm các tính năng hoàn toàn miễn phí
                            </li>
                            <li className="dx-service-item">
                                <i className="fa fa-check"></i>
                                Nâng cấp lên bản chính thức bất kì lúc nào
                            </li>   
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <form class="dx-service">
                            <input placeholder="Customer"></input>
                            <input placeholder="Email"></input>
                            <input placeholder="Phone"></input>
                            <select>
                                <option>Standard</option>
                                <option>Premium</option>
                            </select>
                            <button className="send">Gửi đăng ký</button>
                        </form>
                    </div>
                </div>
                
            </section>

            <section id="dx-location" className="dx-container">
                
                <div className="row p-center">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <div dangerouslySetInnerHTML={{ __html: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.649329143436!2d105.8440409142974!3d21.006689393908722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac760a8b09cf%3A0xd78e46d7bbefe566!2zTmfDtSAzMCBU4bqhIFF1YW5nIELhu611LCBCw6FjaCBLaG9hLCBIYWkgQsOgIFRyxrBuZywgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1603851884788!5m2!1svi!2s" width="100%" height="400" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>' }}></div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h3 className="text-center">Địa chỉ công ty</h3>
                        <ul className="dx-locations">
                            <li className="dx-location-item">
                                <i className="fa fa-map-marker"></i>
                                Địa chỉ: P901, 8C Tạ Quang Bửu, Hai Bà Trưng, Hà Nội.
                            </li>
                            <li className="dx-location-item">
                                <i className="fa fa-phone"></i>
                                +84 986 986 247
                            </li>
                            <li className="dx-location-item">
                                <i className="fa fa-envelope"></i>
                                office@vnist.vn
                            </li>
                        </ul>
                    </div>
                </div>
                
            </section>
            

            <section id="dx-contact" className="dx-container">
                
                <div className="row">
                    <h3 className="dx-contact">Liên hệ với chúng tôi</h3>
                    <p class="dx-contact">CÔNG TY CỔ PHẦN CÔNG NGHỆ AN TOÀN THÔNG TIN VÀ TRUYỀN THÔNG VIỆT NAM</p>
                    <form className="dx-contact">
                        <input placeholder="Name"></input>
                        <input placeholder="Email"></input>
                        <textarea>Your message</textarea>
                        <button className="dx-contact">Gửi</button>
                    </form>
                </div>
                
            </section>
            <section id="dx-footer" className="dx-container">
                
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">Về chúng tôi</h4>
                        <p>Giải pháp không gian làm việc số DX của công ty cổ phần an toàn thông tin VNIST</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">Quan tâm</h4>
                        <ul className="dx-footer care">
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                Công ty phát triển https://vnist.vn/
                            </li>
                            <li className="dx-footer care item p-center-h">
                                <i className="fa fa-square"></i>
                                Tìm hiểu thêm Đăng ký, Hướng dẫn sử dụng
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <h4 className="text-center text-bold">Đa phương tiện</h4>
                        <span className="p-center media">
                            <img className="dx-content1 image" src='/library/dx/images/facebook.png'/>
                            <img className="dx-content1 image" src='/library/dx/images/youtube.png'/>
                            <img className="dx-content1 image" src='/library/dx/images/twitter.png'/>
                            <img className="dx-content1 image" src='/library/dx/images/pinterest.png'/>
                            <img className="dx-content1 image" src='/library/dx/images/google-plus.png'/>
                        </span>
                    </div>
                </div>
                
            </section>
            
            <footer className="dx-footer dx-container">
                <div className="copyright">Bản quyền © 2020 VNIST - All rights reserved</div>
            </footer>
        </React.Fragment>
    );
}

function mapState(state) {
    const { auth } = state;
    return { auth };
}

const mapDispatchToProps = {
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

const connectedIntroduction = connect(mapState, mapDispatchToProps)(withTranslate(Introduction));
export { connectedIntroduction as Introduction };