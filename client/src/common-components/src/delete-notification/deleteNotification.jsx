import React, { Component } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import '../modal/node_modules/react-toastify/dist/ReactToastify.css';
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
        Swal.fire({
            html: `<h4 style="color: red"><div>${content}</div> <div>"${data.info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: this.props.translate('confirm.no'),
            confirmButtonText: this.props.translate('confirm.yes'),
        }).then((result) => {
            if (result.value) {
                const handleFunction = func(data.id);
                if(handleFunction !== undefined){
                    handleFunction
                        .then(res => toast.success(res.message, {containerId: 'toast-notification'}))
                        .catch(err => toast.error(err.response.data.message, {containerId: 'toast-notification'}))
                }
            }
        })
    }

    render() { 
        const { content, data, func } = this.props;
        return ( 
            <a 
                href="#abc"
                className="delete text-red" 
                title={ content }
                onClick={() => this.notification(
                    content,
                    data,
                    func
                )} 
            >
                <i className="material-icons">delete</i>
            </a>
         );
    }
}
 
const mapState = state => state;
const DeleteNotificationExport = connect(mapState, null)(withTranslate(DeleteNotification));

export { DeleteNotificationExport as DeleteNotification }
