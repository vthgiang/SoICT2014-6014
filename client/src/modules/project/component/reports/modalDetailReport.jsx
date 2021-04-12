import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, Gantt } from '../../../../common-components'

const ModalDetailReport = (props) => {
    const { projectDetailId, projectDetail, translate } = props;
    const dataCalendar = {
        countAllTask: { delay: 1, intime: 0, notAchived: 0 },
        lineAllTask: 1
    }
    const [currentZoom, setCurrentZoom] = useState( translate('system_admin.system_setting.backup.date'));
    const taskStatus = ["inprocess"];
    const dataTask = {
        data: []
    };
    const handleZoomChange = (zoom) => {
        setCurrentZoom(zoom);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-detail-report-${projectDetailId}`} isLoading={false}
                formID={`form-show-detail-report-${projectDetailId}`}
                title={translate('project.report.title')}
                hasSave={false}
                size={100}
            >
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Báo cáo chi phí</legend>
                </fieldset>

                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Báo cáo tiến độ</legend>
                    <Gantt
                        ganttData={dataTask}
                        zoom={currentZoom}
                        status={taskStatus}
                        count={dataCalendar.countAllTask}
                        line={dataCalendar.lineAllTask}
                        onZoomChange={handleZoomChange}
                    />
                </fieldset>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalDetailReport));
