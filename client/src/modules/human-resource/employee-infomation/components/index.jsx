import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";


function EmployeeInfomation(props) {
    return (
        <div><p>Trang thông tin nhân viên</p></div>
    )
}
function mapState(state) {
    const { auth, role } = state;

    return { auth, role }
}

const mapDispatchToProps = {
}



export default connect(mapState, mapDispatchToProps)(withTranslate(EmployeeInfomation));