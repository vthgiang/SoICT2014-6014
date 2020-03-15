import React, { Component } from 'react';
import Swal from 'sweetalert2';

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
            html: `<h4 style="color: red"><div>${content.title}</div> <div>"${data.info}" ?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: content.btnNo,
            confirmButtonText: content.btnYes,
        }).then((result) => {
            if (result.value) {
                func(data.id) //thực hiện xóa đối tượng với id truyền vào
            }
        })
    }

    render() { 
        const { content, data, func } = this.props;
        return ( 
            <a 
                href="#abc"
                className="delete text-red" 
                title={ content.title }
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
 
export {DeleteNotification};
