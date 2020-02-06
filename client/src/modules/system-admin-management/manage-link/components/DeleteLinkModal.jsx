import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { destroy } from '../redux/actions';
import Swal from 'sweetalert2';

class DeleteLinkModal extends Component {
    state = {  }

    deletePage = (pageId, pageName, pageDescription, deleteConfirm, no) => {
        Swal.fire({
            title: deleteConfirm,
            // text: pageName,
            html: 
            `
                <h4>${pageName}</h4>
                <h4>${pageDescription}</h4>
            ` ,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: no, //Không
            confirmButtonText: deleteConfirm //Xóa
        }).then((result) => {
            if (result.value) {
                this.props.deletePage(pageId) //xóa trang với tham số là Id
            }
        })
    } 

    render() { 
        const { pageInfo, translate } = this.props;
       
        return ( 
            <button
                className="btn btn-sm btn-danger"
                title={translate('delete')}
                onClick={() => this.deletePage(
                    pageInfo._id,
                    pageInfo.url,
                    pageInfo.description,
                    translate('delete'),
                    translate('question.no')
                )}
            >
                <i className="fa fa-trash"></i>
            </button>
         );
    }
}
 
const mapState = state => state;
const getState = (dispatch, props) => {
    return {
        deletePage: (id) => {
            dispatch( destroy(id));
        }
    }
}
 
export default connect(mapState, getState) (withTranslate(DeleteLinkModal));