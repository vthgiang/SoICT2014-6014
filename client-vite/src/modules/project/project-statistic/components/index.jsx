import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

function ProjectStatisticPage(props) {
  return (
    <React.Fragment>
      <div>
        Thống kê danh sách dự án
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  return state
}

const actions = {

}

export default connect(mapState, actions)(withTranslate(ProjectStatisticPage))

