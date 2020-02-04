import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { destroy } from '../redux/actions';
import Swal from 'sweetalert2'

class DeleteRoleNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.deleteRole = this.deleteRole.bind(this);
    }

    deleteRole = (roleId, roleName, deleteConfirm, no) => {
        Swal.fire({
            title: deleteConfirm,
            html: `<h4>${roleName}</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: no, //Không
            confirmButtonText: deleteConfirm //Xóa
        }).then((result) => {
            if (result.value) {
                this.props.destroy(roleId) //xóa user với tham số truyền vào là id của user
            }
        })
    } 

    render() { 
        const{ translate, roleId, roleName } = this.props;
        return ( 
            <button 
                className="btn btn-sm btn-danger"
                title={translate('delete')}
                onClick={() => this.deleteRole(
                    roleId,
                    roleName,
                    translate('delete'),
                    translate('question.no')
                )}
            >
                <i className="fa fa-trash"></i>
            </button>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}


const mapDispatchToProps = (dispatch, props) => {
    return{
        destroy: (id) => {
            dispatch( destroy(id) );
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(DeleteRoleNotification) );