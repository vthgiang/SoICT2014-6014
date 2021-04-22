import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { formatFunction } from '../../common/index';

function GeneralTabInfoForm(props) {
    const [showMore, setShowMore] = useState(false);
    const { customerId, customerInfomation, id, crm } = props;
    const { status } = crm; // state redux

    console.log(customerInfomation);
    let listStatus = [...status.list]; // Sao chép giá trị của list(Trạng thai chung của khách hàng)
    if (customerInfomation && listStatus) {
        const statusActive = customerInfomation.status.map(o => ({ _id: o._id, name: o.name, active: true })); // Danh sách trạng thái khách hàng có
        //reset ds trang thai
        listStatus.forEach(x => {
            x.active = false;
        });
        // Đưa ra danh sách cuối cùng để hiển thị
        if (statusActive.length > 0) {
            for (let index = 0; index < listStatus.length; index++) {
                let status = listStatus[index];
                if (status._id == statusActive[0]._id) {
                    status.active = true;
                    break;
                }
                status.active = true;
            }
        }


    }


    /**
     * Hàm xử lý khi click nút see more
     */
    const handleShowMore = () => {
        setShowMore(!showMore);
    }


    const { translate } = props;
    let progressBarWidth;

    if (listStatus) {
        const totalItem = listStatus.length; // Lấy tổng số trạng thái
        const numberOfActiveItems = listStatus.filter(o => o.active).length; // Lấy tổng số trạng thái đã active  
        progressBarWidth = totalItem > 1 && numberOfActiveItems > 0 ? ((numberOfActiveItems - 1) / (totalItem - 1)) * 100 : 0; // tính toán width cho progressBar
    }

    return (
        <div id={id} className="tab-pane active " >
            <div className="box-body" >
                <div className="description-box" style={{ lineHeight: 1.5 }}>
                    <h4 >Thông tin chính</h4>
                    <div className="row"  >
                        {/* Người quản lý khách hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.owner')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.owner ? customerInfomation.owner.map(o => o.name).join(', ') : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nguồn khách hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.source')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.customerSource ? customerInfomation.customerSource : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Loại khách hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.customerType')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.customerType ? formatFunction.formatCustomerType(customerInfomation.customerType, translate) : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nhóm khách hàng */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.group')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.group ? customerInfomation.group.name : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {customerInfomation.customerType == 1 ? (
                        <div className="row">
                            {/* Giới tính */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.gender')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.gender ? formatFunction.formatCustomerGender(customerInfomation.gender, translate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.birth')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.birthDate ? formatFunction.formatDate(customerInfomation.birthDate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <> <div className="row">


                            {/* Người dại diện */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.represent')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.represent ? customerInfomation.represent : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Ngày thành lập công ty */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.companyEstablishmentDate')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.companyEstablishmentDate ? formatFunction.formatDate(customerInfomation.companyEstablishmentDate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        </>)}




                    <div className="collapse" data-toggle="collapse " id="showinfo1">

                        <div className="row">
                            {/* Khu vực */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.location')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.website ? formatFunction.formatCustomerLocation(customerInfomation.location, translate) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Số điện thoại cố đinh */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.telephoneNumber')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.telephoneNumber ? customerInfomation.telephoneNumber : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="row">
                            {/* Mã số thuế */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.taxNumber')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.taxNumber ? customerInfomation.taxNumber : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Website */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.website')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.website ? customerInfomation.website : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="row">


                            {/* creator */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.creator')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.creator ? customerInfomation.creator.name : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ngày tạo khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Ngày tạo khách hàng</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.createdAt ? formatFunction.formatDate(customerInfomation.createdAt) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">


                            {/* chỉnh sửa lần cuối*/}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{"Chỉnh sửa lần cuối "}</strong>
                                        <div className="col-sm-8">
                                            <span>{formatFunction.formatDate(customerInfomation.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Người chỉnh sửa  */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Người chỉnh sửa</strong>
                                        <div className="col-sm-8">
                                            <span>{"Nguyễn Văn Danh"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* button showMore */}
                    <span className="showMoreInfo" data-toggle="collapse" data-target="#showinfo1" aria-expanded="false" onClick={handleShowMore}>{!showMore ? 'Thông tin thêm' : 'Thu gọn'}</span>
                </div>

                <div className="description-box" style={{ lineHeight: 1.5 }}>
                    <h4 >{translate('crm.customer.status')}</h4>
                    <div className="row" style={{ marginTop: '10px' }}>
                        <div className="col-md-12">
                            <div className="timeline">
                                <div className="timeline-progress" style={{ width: `${progressBarWidth}%` }}></div>
                                <div className="timeline-items">
                                    {
                                        listStatus && listStatus.length > 0 &&
                                        listStatus.map((o, index) => (
                                            <div key={index} className={`timeline-item ${o.active ? 'active' : ''}`} >
                                                <div className="timeline-contain">{o.name}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}


function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabInfoForm));