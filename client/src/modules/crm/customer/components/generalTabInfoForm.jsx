import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class GeneralTabInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = { showMore: false }
    }

    static getDerivedStateFromProps(props, state) {
        const { status } = props.crm; // state redux
        let listStatus = status.list;
        const { customerId, customerInfomation, id } = props;

        if (customerId != state.customerId && customerInfomation && listStatus) {
            const statusActive = customerInfomation.status;

            listStatus.map(x => (
                statusActive.map(y => {
                    if (x._id === y._id)
                        x.active = true;
                    return x;
                })
            ))

            return {
                ...state,
                id: id,
                customerId: customerId,
                customerInfomation: customerInfomation,
                listStatus,
            }
        } else {
            return null;
        }
    }

    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    formatGender(gender) {
        const { translate } = this.props;
        gender = parseInt(gender);
        if (gender === 0)
            return translate('crm.customer.male');
        if (gender === 1)
            return translate('crm.customer.female');
    }

    handleShowMore = () => {
        this.setState({
            showMore: !this.state.showMore,
        })
    }

    render() {
        const { translate } = this.props;
        const { customerInfomation, id, listStatus, showMore } = this.state;
        let progressBarWidth;

        if (listStatus) {
            const totalItem = listStatus.length; // Lấy tổng số trạng thái
            const numberOfActiveItems = listStatus.filter(o => o.active).length; // Lấy tổng số trạng thái đã active  
            progressBarWidth = totalItem > 1 && numberOfActiveItems > 0 ? ((numberOfActiveItems - 1) / (totalItem - 1)) * 100 : 0; // tính toán width cho progressBar
        }

        return (
            <div className="tab-pane active" id={id}>
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
                                        <span>{customerInfomation.source ? customerInfomation.source : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Công ty */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.company')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.company ? customerInfomation.company : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Người dại diện */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">Người đại diện</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.represent ? customerInfomation.represent : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Ngày thành lập công ty */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.companyEstablishmentDate')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.companyEstablishmentDate ? this.formatDate(customerInfomation.companyEstablishmentDate) : ''}</span>
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

                    <div className="row">
                        {/* Giới tính */}
                        <div className="col-md-6">
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <strong className="col-sm-4">{translate('crm.customer.gender')}</strong>
                                    <div className="col-sm-8">
                                        <span>{customerInfomation.gender ? this.formatGender(customerInfomation.gender) : ''}</span>
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
                                        <span>{customerInfomation.birthDate ? this.formatDate(customerInfomation.birthDate) : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="collapse" data-toggle="collapse " id="showinfo1">
                        <div className="row">
                            {/* Địa chỉ  */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.address2')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.address2 ? customerInfomation.address2 : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Email tạm thời  */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.secondaryEmail')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.email2 ? customerInfomation.email2 : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
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
                        </div>

                        <div className="row">
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

                            {/* LinkedIn */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.linkedIn')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.linkedIn ? customerInfomation.linkedIn : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {/* Khu vực */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">{translate('crm.customer.location')}</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.website ? customerInfomation.location : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                        </div>

                        <div className="row">
                            {/* Ngày tạo khách hàng */}
                            <div className="col-md-6">
                                <div className="form-horizontal">
                                    <div className="form-group">
                                        <strong className="col-sm-4">Ngày tạo khách hàng</strong>
                                        <div className="col-sm-8">
                                            <span>{customerInfomation.createdAt ? this.formatDate(customerInfomation.createdAt) : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* button showMore */}
                    <span className="showMoreInfo" data-toggle="collapse" data-target="#showinfo1" aria-expanded="false" onClick={this.handleShowMore}>{!showMore ? 'Thông tin thêm' : 'Thu gọn'}</span>
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
        );

    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralTabInfoForm));