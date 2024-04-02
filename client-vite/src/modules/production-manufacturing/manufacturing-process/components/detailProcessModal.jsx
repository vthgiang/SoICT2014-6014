import React, { useState, useEffect } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import { DialogModal } from "../../../../common-components";

const DetailProcessModal = (props) => {

}

const connectDetailProcessModal = connect()(withTranslate(DetailProcessModal));
export { connectDetailProcessModal as DetailProcessModal }