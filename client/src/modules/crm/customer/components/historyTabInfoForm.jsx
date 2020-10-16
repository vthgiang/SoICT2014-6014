import React, { Component } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';


class HistoryTabInfoForm extends Component {
    constructor(props) {
        super(props);

    }

    formatDateTime(date) {
        const d = new Date(date);
        const localeTime = d.toLocaleTimeString();

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${localeTime} ${day}-${month}-${year}`;
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
                                        <time>{this.formatDateTime(o.createdAt)}</time>
                                        <p>
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