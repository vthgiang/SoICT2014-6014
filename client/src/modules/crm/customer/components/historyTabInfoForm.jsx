import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { formatFunction } from '../../common/index';

class HistoryTabInfoForm extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { statusHistories } = this.props.customerInfomation;
        const { id } = this.props;

        return (
            <div className="tab-pane" id={id}>
                <div className="description-box" >
                    <h4>Lịch sử thay đổi trạng thái khách hàng</h4>
                    <div className="timeline-container" style={{ marginTop: '15px' }}>
                        {
                            statusHistories && statusHistories.length > 0 ? statusHistories.map((o, index) => (
                                <div key={index} className="timeline-history-item">
                                    <div className="timeline-history-item-content">
                                        <time>{formatFunction.formatDateTime(o.createdAt)}</time>
                                        <p style={{ fontSize: '14px' }}>
                                            {!o.oldValue
                                                ? `${o.createdBy.name} đã tạo khách hàng với trạng thái là ${o.newValue.name}`
                                                : `${o.createdBy.name} đã chuyển trạng thái khách hàng từ ${o.oldValue.name} thành ${o.newValue.name}`
                                            }
                                        </p>
                                        <a href="facebook.com">See detail</a>
                                        <span className="circle" />
                                    </div>
                                </div>
                            ))
                                : ''
                        }
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { crm } = state;
    return crm;
}

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(HistoryTabInfoForm));