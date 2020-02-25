import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog } from '../../../../common-components';

class DepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() { 
        const { translate, parentId } = this.props;
        return ( 
            <React.Fragment>
                <ModalDialog
                    size="75"
                    modalID={`form-edit-department-${parentId}`}
                    formID={`form-edit-department-${parentId}`}
                    title={translate('manage_department.info')}
                    msg_success={translate('manage_department.edit_success')}
                    msg_faile={translate('manage_department.edit_faile')}
                    func={this.save}
                >
                    <form  id={`form-edit-department-${parentId}`}>
                        Edit form
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}

const mapState = state => state;
const getState = {}
export default connect(mapState, getState) (withTranslate(DepartmentEditForm)); 
