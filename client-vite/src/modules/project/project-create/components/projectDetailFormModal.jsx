import React from "react";
import { DialogModal } from "../../../../common-components";
import { ProjectActions } from "../../projects/redux/actions";


const ProjectDetailFormModal = (props) => {
  const { translate, projectDetail, projectDetailId } = props
  
  return (
    <React.Fragment>
      <DialogModal
        modalID={`project-detail-modal-new-${projectDetailId}`}
        isLoading={false}
        formID={`project-detail-form-new-${projectDetailId}`}
        title={projectDetail ? projectDetail?.name : translate('project.project_details')}
        hasSaveButton={false}
        size={80}
      >
        Chi tiết dự án {projectDetail?._id}
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project } = state.project
  return { project }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectDetailFormModal))
