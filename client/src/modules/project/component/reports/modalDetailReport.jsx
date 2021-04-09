import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components'

const ModalDetailReport = (props) => {
    const { projectDetailId, projectDetail, translate } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-detail-report-${projectDetailId}`} isLoading={false}
                formID={`form-show-detail-report-${projectDetailId}`}
                title={translate('project.report.title')}
                hasSave={false}
                size={100}
            >
                Đây là modal report dự án
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalDetailReport));
