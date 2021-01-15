import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import DocViewer from "./doc.jsx";
const UserGuide = () => {
    return (
        <React.Fragment>
            <DocViewer source={`${process.env.REACT_APP_SERVER}/upload/user-guide/asset-guide.pdf`} />

        </React.Fragment>

    )
}

export default connect(null, null)(withTranslate(UserGuide));
