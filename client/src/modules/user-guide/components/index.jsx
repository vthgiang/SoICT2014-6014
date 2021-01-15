import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
const UserGuide = () => {
    const url = `https://docs.google.com/gview?url=http://www.africau.edu/images/default/sample.pdf&embedded=true`;
    const url1 = `https://docs.google.com/gview?url=${process.env.REACT_APP_SERVER}/upload/user-guide/asset-guide.pdf&embedded=true`
    return (
        <React.Fragment>
            <div style={{ maxWidth: '100%' }}>
                <iframe width="100%" height="500" className="doc" src={url1}></iframe>
            </div>
            {/* <div style={{ marginTop: '30px' }}>
                <iframe width="100%" height="500" class="doc" src={}></iframe>
            </div> */}
        </React.Fragment>

    )
}

export default connect(null, null)(withTranslate(UserGuide));
