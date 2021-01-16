import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import DocViewer from "./doc.jsx";
const UserGuide = () => {
    return (
        <React.Fragment>
            {/* <DocViewer source={`${process.env.REACT_APP_SERVER}/upload/user-guide/ns3.pdf`} /> */}
            <DocViewer source={`https://www.nsnam.org/docs/release/3.18/tutorial/ns-3-tutorial.pdf`} />
        </React.Fragment>
    );
};

export default connect(null, null)(withTranslate(UserGuide));
