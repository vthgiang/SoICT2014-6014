import React, { Component } from 'react';
import { BillActions } from "../../redux/actions";
import { connect } from "react-redux";
import withTranslate from "react-redux-multilingual/lib/withTranslate";
import { DialogModal, SelectBox, UploadFile } from '../../../../../../common-components';

class QualityControlForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleStatusChange = (value) => {
        const status = value[0];
        this.setState({
            status: status
        });
    }

    handleContentChange = (e) => {
        const { value } = e.target;
        this.setState({
            content: value
        });
    }

    static getDerivedStateFromProps = (props, state) => {
        if (props.billId !== state.billId) {
            return {
                ...state,
                billId: props.billId,
                code: props.code,
                status: props.status,
                content: props.content
            }
        }
        return null;
    }

    save = () => {
        const userId = localStorage.getItem("userId");
        const data = {
            qualityControlStaffs: {
                staff: userId,
                status: this.state.status,
                content: this.state.content,
            }
        }
        this.props.editBill(this.state.billId, data);
    }

    render() {
        const { translate, bills } = this.props;
        const { status, content, code } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-quality-control-bill" isLoading={bills.isLoading}
                    formID="form-quality-control-bill"
                    title={translate('manage_warehouse.bill_management.quality_control_bill')}
                    msg_success={translate('manage_warehouse.bill_management.edit_successfully')}
                    msg_faile={translate('manage_warehouse.bill_management.edit_failed')}
                    func={this.save}
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
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                        </div>
                    </form>
                    <form id="form-quality-control-bill">
                        <div className="form-group">
                            <label>{translate('manage_warehouse.bill_management.description')}</label>
                            <textarea type="text" value={content} onChange={this.handleContentChange} className="form-control"></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { bills } = state;
    return { bills }
}

const mapDispatchToProps = {
    editBill: BillActions.editBill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))