import React, { useState, useEffect } from 'react';
import { BillActions } from "../../redux/actions";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal, SelectBox, UploadFile } from '../../../../../../common-components';

function QualityControlForm(props) {
    const [state, setState] = useState({

    })

    const handleStatusChange = (value) => {
        const status = value[0];
        setState({
            ...state,
            status: status
        });
    }

    const handleContentChange = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            content: value
        });
    }

    if (props.billId !== state.billId) {
        setState({
            ...state,
            billId: props.billId,
            code: props.code,
            status: props.status,
            content: props.content
        })
    }

    const save = () => {
        const userId = localStorage.getItem("userId");
        const data = {
            qualityControlStaffs: {
                staff: userId,
                status: state.status,
                content: state.content,
            }
        }
        props.editBill(state.billId, data);
    }

    const { translate, bills } = props;
    const { status, content, code } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-quality-control-bill" isLoading={bills.isLoading}
                formID="form-quality-control-bill"
                title={translate('manage_warehouse.bill_management.quality_control_bill')}
                msg_success={translate('manage_warehouse.bill_management.edit_successfully')}
                msg_failure={translate('manage_warehouse.bill_management.edit_failed')}
                func={save}
                // disableSubmit={!this.isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-quality-control-bill">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.code')}<span className="text-red">*</span></label>
                        <input type="text" value={code} className="form-control" disabled={true}></input>
                    </div>
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.status')}<span className="text-red">*</span></label>
                        <SelectBox
                            id={`select-quality-control-status-bill`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={status}
                            items={[{
                                value: 1, text: translate('manufacturing.command.qc_status.1.content')
                            }, {
                                value: 2, text: translate('manufacturing.command.qc_status.2.content')
                            }, {
                                value: 3, text: translate('manufacturing.command.qc_status.3.content')
                            }]}
                            onChange={handleStatusChange}
                            multiple={false}
                        />
                    </div>
                </form>
                <form id="form-quality-control-bill">
                    <div className="form-group">
                        <label>{translate('manage_warehouse.bill_management.description')}</label>
                        <textarea type="text" value={content} onChange={handleContentChange} className="form-control"></textarea>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {
    editBill: BillActions.editBill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))
