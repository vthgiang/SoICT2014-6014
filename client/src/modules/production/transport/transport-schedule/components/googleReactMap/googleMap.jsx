import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";



function GoogleReactMap(props) {

    return (
        <React.Fragment>
            <div className="box-body qlcv">
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {
}

const connectedGoogleReactMap = connect(mapState, actions)(withTranslate(GoogleReactMap));
export { connectedGoogleReactMap as GoogleReactMap };