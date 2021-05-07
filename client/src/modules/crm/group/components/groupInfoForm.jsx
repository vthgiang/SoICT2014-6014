import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { DialogModal } from '../../../../common-components';
import { CrmGroupActions } from '../redux/actions';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatFunction } from '../../common';

GroupInfoForm.propTypes = {

};

function GroupInfoForm(props) {

    const { groupInfoId, crm } = props
    useEffect(() => { props.getGroup(groupInfoId) }, [groupInfoId])
    const { groups } = crm;
    let groupById, numberOfUsers;
    if (groups.groupById) {
        groupById = groups.groupById.groupById
        numberOfUsers = groups.groupById.numberOfUsers
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-info-group`}
                formID={`form-info-group`}
                isLoading={groups.isLoading}
                size={75}
                // disableSubmit={true}
            >
                
                {groupById &&
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">{"Thông tin nhóm khách hàng"}
                        </legend>
                        <div style={{ padding: '0' }, { margin: '10px' }}>
                            <div className="row">
                                {/* Mã đơn hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Mã nhóm khách hàng</strong>
                                            <div className="col-sm-8">
                                                <span>{groupById.code}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tên khách hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Tên nhóm  khách hàng</strong>
                                            <div className="col-sm-8">
                                                <span>{groupById.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {/* Mã đơn hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Mô tả </strong>
                                            <div className="col-sm-8">
                                                <span>{groupById.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tên khách hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Số lượng khách hàng</strong>
                                            <div className="col-sm-8">
                                                <span>{numberOfUsers ? numberOfUsers : 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {/* Mã đơn hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Người tạo nhóm </strong>
                                            <div className="col-sm-8">
                                                <span>{groupById.creator ? groupById.creator.name : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tên khách hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Ngày tạo</strong>
                                            <div className="col-sm-8">
                                                <span>{formatFunction.formatDate(groupById.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {/* Mã đơn hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Chỉnh sửa lần cuối </strong>
                                            <div className="col-sm-8">
                                                <span>{formatFunction.formatDateTime(groupById.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tên khách hàng */}
                                <div className="col-md-6">
                                    <div className="form-horizontal">
                                        <div className="form-group">
                                            <strong className="col-sm-4">Người chỉnh sửa</strong>
                                            <div className="col-sm-8">
                                                <span>{groupById.updatedBy ? groupById.updatedBy.name : groupById.creator.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>


                    </fieldset>}
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
    getGroup: CrmGroupActions.getGroup,
    deleteGroup: CrmGroupActions.deleteGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GroupInfoForm));