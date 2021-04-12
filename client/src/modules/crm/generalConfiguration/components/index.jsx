import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import Sortable from 'sortablejs';
import Swal from 'sweetalert2';
import { CrmStatusActions } from '../../status/redux/actions';
import CustomerStatusAddForm from './customerStatusAddForm';
import CustomerStatusEditForm from './customerStatusEditForm';
import { formatFunction } from '../../common/index';

class GeneralConfiguration extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleSortItemInTable = () => {
        const element = document.getElementById("sortItem");
        Sortable.create(element, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: function (evt) {
                window.$('#sortItem ul').each((index) => {
                    window.$(this).find('li:nth-child(1)').html(index + 1);
                });
            },
            onEnd: function (evt) {
                console.log('evt', evt);
            }
        })
    }

    static getDerivedStateFromProps(props, state) {
        const { crm } = props;
        if (crm.status && crm.status.list && crm.status.list.length > 0) {
            return {
                ...state,
                listStatus: crm.status.list,
            }
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.handleSortItemInTable();
        this.props.getStatus();
    }

    editStatus = (id, data) => {
        console.log('dgddgdgdggdg')
        this.setState({
            statusIdEdit: id,
            data,
        }, () => window.$('#modal-crm-customer-edit').modal('show'));
    }


    deleteStatus = (id) => {
        const { translate } = this.props;
        Swal.fire({
            html: "<h3>Xóa thông tin trạng thái khách hàng</h3>",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes')
        }).then((res) => {
            if (res.value) {
                this.props.deleteStatus(id);
            }
        });
    }

    render() {
        const { translate, crm } = this.props;
        const { statusIdEdit, data } = this.state;

        return (
            <React.Fragment>
                <div className="box generalConfiguration">
                    <div className="box-body qlcv">
                        {
                            statusIdEdit && <CustomerStatusEditForm statusIdEdit={statusIdEdit} data={data} />
                        }
                        <div className="description-box nav-tabs-custom">
                            <div className="tab-content">
                                <ul className="nav nav-tabs-left">
                                    <li className="active"><a href="#customer-status" data-toggle="tab" >{translate('crm.customer.status')}</a></li>
                                    <li> <a href="#customer-caretype" data-toggle="tab">{translate('crm.care.careType')}</a> </li>
                                   
                                </ul>
                            </div>
                            <div className="tab-content tab-content-right">
                                {/* Tab trạng thái khách hàng */}
                                <div id={`customer-status`} className="tab-pane active">
                                    <div className="description-box">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 class="box-title" style={{ color: 'rgb(68,68,68)' }}>Danh sách trạng thái khách hàng</h4>
                                            <CustomerStatusAddForm />
                                        </div>
                                        <ul id="sortItem" className="todo-list">
                                            {
                                                crm.status && crm.status.list && crm.status.list.length > 0 ?
                                                    crm.status.list.map((o, index) => (
                                                        <li key={index}>
                                                            <a data-toggle="collapse" href={`#collapse_${index}`}>
                                                                <span style={{ margin: '0 5px', display: 'inline-block' }}>
                                                                    {`${index + 1}.`}
                                                                </span>
                                                                <span className="text">{o.name}</span>
                                                                <div className="tools">
                                                                    <i className="fa fa-edit" onClick={() => this.editStatus(o._id, o)} title="Chỉnh sửa trạng thái"></i>
                                                                    <i className="fa fa-trash-o" onClick={() => this.deleteStatus(o._id)} title="Xóa trạng thái"></i>
                                                                </div>
                                                            </a>

                                                            <div id={`collapse_${index}`} class="collapse" >
                                                                <ul>
                                                                    <li>Người tạo: {` ${o.creator ? o.creator.name : ''}`}</li>
                                                                    <li>Mô tả: {` ${o.description}`}</li>
                                                                    <li>Ngày tạo: {` ${formatFunction.formatDate(o.createdAt)}`}</li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    )) : null
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div id={`customer-caretype`} className="tab-pane">
                                    <div className="description-box">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 class="box-title" style={{ color: 'rgb(68,68,68)' }}>Danh sách các loại hoạt động CSKH</h4>
                                            <CustomerStatusAddForm />
                                        </div>
                                        <ul id="sortItem" className="todo-list">
                                            <li>
                                                <a data-toggle="collapse" >
                                                    <span style={{ margin: '0 5px', display: 'inline-block' }}>
                                                       1. 
                                                    </span>
                                                    <span className='text'> Gọi điện thoại</span>
                                                    <div className="tools">
                                                        <i className="fa fa-edit" title="Chỉnh sửa trạng thái"></i>
                                                        <i className="fa fa-trash-o" title="Xóa trạng thái"></i>
                                                    </div>
                                                </a>
                                            </li>
                                          < li>
                                                <a data-toggle="collapse" >
                                                    <span style={{ margin: '0 5px', display: 'inline-block' }}>
                                                       2. 
                                                    </span>
                                                    <span className='text'> Nhắn tin</span>
                                                    <div className="tools">
                                                        <i className="fa fa-edit" title="Chỉnh sửa trạng thái"></i>
                                                        <i className="fa fa-trash-o" title="Xóa trạng thái"></i>
                                                    </div>
                                                </ a>
                                            </li>
                                            < li>
                                                <a data-toggle="collapse" >
                                                    <span style={{ margin: '0 5px', display: 'inline-block' }}>
                                                       3. 
                                                    </span>
                                                    <span className='text'>Hẹn gặp mặt</span>
                                                    <div className="tools">
                                                        <i className="fa fa-edit" title="Chỉnh sửa trạng thái"></i>
                                                        <i className="fa fa-trash-o" title="Xóa trạng thái"></i>
                                                    </div>
                                                </ a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getStatus: CrmStatusActions.getStatus,
    deleteStatus: CrmStatusActions.deleteStatus,
}


export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GeneralConfiguration));