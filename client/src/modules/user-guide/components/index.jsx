import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
const UserGuide = () => {
    return (
        <div style={{ maxWidth: '100%' }}>
            <iframe width="100%" height="1000" src={`https://docs.google.com/gview?url=${process.env.REACT_APP_SERVER}/upload/user-guide/QLCV_UM_v1.2.docx&embedded=true`}></iframe>
        </div>
    )
}

export default connect(null, null)(withTranslate(UserGuide));
