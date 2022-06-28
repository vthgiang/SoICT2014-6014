import React from 'react'
import { connect } from 'react-redux'
import { ProjectTemplateManage } from "./projectTemplate";

export const ProjectTemplateManagement = () => {
    return (
        <React.Fragment>
            <ProjectTemplateManage />
        </React.Fragment>
    )
}

export default connect(null, null)(ProjectTemplateManagement)