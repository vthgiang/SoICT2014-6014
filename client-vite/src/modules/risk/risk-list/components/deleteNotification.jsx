import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DeleteNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.notification = this.notification.bind(this);
    }

    notification = (
        content, //json - tiêu đề, tên các button
        data, //thông tin về đối tượng
        func //hàm thực hiện tương ứng
    ) => {
        console.log(data.risk.riskStatus=='wait_for_approve')
        if(data.risk.riskStatus!='wait_for_approve'&&data.risk.riskStatus!='finished'){
            Swal.fire({
                html: `<h4 style="color: red"><div>${this.props.translate('manage_risk.warning')}</div> <div></div></h4>`,
                icon: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                // cancelButtonColor: '#d33',
                // cancelButtonText: 'Cancel',
                confirmButtonText: this.props.translate('general.yes'),
            }).then((result) => {
                // if (result.value) {
                //     func(data.risk);
                // }
            })
        }else{
            console.log(data.risk.riskStatus)
            Swal.fire({
                html: `<h4 style="color: red"><div>${content}</div> <div>"${data.info}" ?</div></h4>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: this.props.translate('general.no'),
                confirmButtonText: this.props.translate('general.yes'),
            }).then((result) => {
                if (result.value) {
                    func(data.risk);
                }
            })
        }
        
    }

    render() { 
        const { content, data, func ,translate} = this.props;
        return ( 
            <a 
                href="#delete"
                className="delete text-red" 
                title={ content }
                onClick={() => this.notification(
                    content,
                    data,
                    func
                )} 
            >
                <i className="material-icons">delete</i>
                <span className="delete text-red" >{translate('manage_risk.delete')}</span>
            </a>
         );
    }
}
 
const mapState = state => state;
const DeleteNotificationExport = connect(mapState, null)(withTranslate(DeleteNotification));

export { DeleteNotificationExport as DeleteNotification }