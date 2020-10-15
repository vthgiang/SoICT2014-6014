import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ApiImage, SelectBox, ErrorLabel, DateTimeConverter } from '../../../../common-components';
import { convertJsonObjectToFormData } from '../../../../helpers/jsonObjectToFormDataObjectConverter';
import { CrmCustomerActions } from '../redux/actions';
import GeneralTabInfoForm from './generalTabInfoForm';
import './customer.css'

class CrmCustomerInformation extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            defaultAvatar: '',
            customerInfomation: {}
        }
    }

    render() {
        const { translate, crm } = this.props;
        const { customerInfomation, dataStatus, customerId, defaultAvatar } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-crm-customer-info" isLoading={crm.customers.isLoading}
                    formID="form-crm-customer-info"
                    title="Thông tin chi tiết khách hàng"
                    func={this.save} size={100}
                >
                    {/* Form thêm khách hàng mới */}
                    <form id="form-crm-customer-info">
                        <div className="row">
                            <div className="col-xs-12 col-sm-5 col-md-3 col-lg-3">
                                <div style={{
                                    padding: '20px',
                                    border: '1px solid #D2D6DE',
                                    backgroundColor: 'rgb(251 251 251)',
                                    marginBottom: '20px',
                                    borderRadius: '5px',
                                }}>
                                    <div className="text-center ">
                                        {customerInfomation.avatar ?
                                            <ApiImage className="customer-avatar" src={customerInfomation.avatar} /> :
                                            <img className="customer-avatar" src="/image/crm-customer.png" />
                                        }
                                    </div>

                                    <h6 className="text-muted" style={{ textAlign: 'center' }}>Tải lên một ảnh khác...</h6>

                                    <div style={{ display: 'flex' }}>
                                        <div style={{ position: 'relative', cursor: 'pointer', margin: '0 auto' }} className="btn btn-default image-wrapper">
                                            Chọn ảnh
                                            <input type="file" name="file" onChange={this.handleUpload}
                                                style={{
                                                    opacity: 0,
                                                    position: 'absolute',
                                                    width: '100%',
                                                    top: 0,
                                                    left: 0,
                                                    padding: '5px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <hr style={{ borderTop: 'solid 1px #c3c7d0' }} />

                                    <strong><i className="fa fa-user margin-r-5" /> {translate('crm.customer.name')}</strong>
                                    <p className="text-muted">{customerInfomation.name ? customerInfomation.name : ''}</p>


                                    <strong><i className="fa fa-barcode margin-r-5" /> {translate('crm.customer.code')}</strong>
                                    <p className="text-muted">{customerInfomation.code ? customerInfomation.code : ''}</p>

                                    <strong><i className="fa fa-phone margin-r-5" /> {translate('crm.customer.mobilephoneNumber')}</strong>
                                    <p className="text-muted">{customerInfomation.mobilephoneNumber ? customerInfomation.mobilephoneNumber : ''}</p>

                                    <strong><i className="fa fa-envelope margin-r-5" /> {translate('crm.customer.email')}</strong>
                                    <p className="text-muted">{customerInfomation.email ? customerInfomation.email : ''}</p>

                                    <strong><i className="fa fa-map-marker margin-r-5" /> {translate('crm.customer.address')}</strong>
                                    <p className="text-muted">{customerInfomation.address ? customerInfomation.address : ''}</p>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                                <div className="nav-tabs-custom">
                                    <ul className="nav nav-tabs">
                                        <li className="active"><a href="#generalInfo" data-toggle="tab">Thông tin chi tiết</a></li>
                                        <li ><a href="#customer-info-history" data-toggle="tab">Lịch sử mua hàng</a></li>
                                        <li><a href="#sale" data-toggle="tab">Công nợ</a></li>
                                        <li><a href="#note" data-toggle="tab">Ghi chú</a></li>
                                    </ul>
                                    <div className="tab-content">
                                        {/* Tab thông tin chi tiết */}
                                        {
                                            customerInfomation && dataStatus === 3 &&
                                            <GeneralTabInfoForm
                                                id={"generalInfo"}
                                                customerInfomation={customerInfomation}
                                                customerId={customerId}
                                            />
                                        }


                                        {/* Tab lịch sử mua hàng */}
                                        <div className="tab-pane" id="customer-info-history">
                                            <p data-toggle="collapse" data-target="#showinfo1" aria-expanded="false" onclick="myFunction1()"><i
                                                id="js--title1" class="fas fa-angle-up mr-2"></i> Thông tin hệ điều hành</p>

                                            <div class="collapse" data-toggle="collapse " id="showinfo1">
                                                <p>mih tran</p>
                                            </div>
                                        </div>

                                        <div className="tab-pane" id="sale">
                                            Công nợ
                                             {/* id={`table-customer-liabilities-${customer._id}`} */}
                                            <table className="table table-hover table-striped table-bordered" >
                                                <thead>
                                                    <tr>
                                                        <th>Mã phiếu</th>
                                                        <th>Người tạo</th>
                                                        <th>Ngày tạo</th>
                                                        <th>Tổng công nợ</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {
                                                        liabilities.map(lia=>
                                                        <tr>
                                                            <td>{lia.code}</td>
                                                            <td>{lia.creator.name}</td>
                                                            <td>abc</td>
                                                            <td>{lia.total}</td>
                                                        </tr> )
                                                    } */}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tab-pane" id="note">
                                            Ghi chú
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>

            </React.Fragment>
        );
    }

    static getDerivedStateFromProps(props, state) {
        if (props.customerId != state.customerId) {
            props.getCustomer(props.customerId);
            return {
                dataStatus: 1,
                customerId: props.customerId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        let { dataStatus, customerInfomation } = this.state;
        if (dataStatus === this.DATA_STATUS.QUERYING && !nextProps.crm.customers.isLoading) {
            const getCustomer = nextProps.crm.customers.customerById;
            customerInfomation = { ...getCustomer };

            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
                customerInfomation,
            })
            return false
        }

        if (dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.setState({
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }

    handleUpload = (e) => {
        let { customerInfomation } = this.state;
        const file = e.target.files[0];
        if (file) {
            let fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    customerInfomation: {
                        ...customerInfomation,
                        avatar: fileLoad.result
                    }
                });
            };
        }

    }

    save = () => {
        const { customerInfomation, customerId } = this.state;
        // let formData = convertJsonObjectToFormData(customerInfomation);
        let formData = new FormData();
        console.log('customerInfomation', customerInfomation)

        formData.append('avatar', customerInfomation.avatar);
        this.props.editCustomer(customerId, formData);
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getCustomer: CrmCustomerActions.getCustomer,
    editCustomer: CrmCustomerActions.editCustomer,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerInformation));