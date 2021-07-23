import { useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import "./ggdriver.css"
// link git : https://github.com/Jose-cd/React-google-drive-picker


function ModalDriver(props) {
  const [openPicker, data] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: "716399266209-fjfedph6jgq5l415flu51ophhv9qqgfr.apps.googleusercontent.com", // link hướng dẫn : https://www.youtube.com/watch?v=1y0-IfRW114
      developerKey: "AIzaSyDC_Nmb_rWTaSQbUkZSNifUKGHz1Xomvh0", // link hướng dẫn : https://www.youtube.com/watch?v=1y0-IfRW114
      viewId: "FOLDERS",
      viewMimeTypes: ["application/vnd.google-apps.document","application/vnd.google-apps.spreadsheet","application/vnd.google-apps.file"],
      disableDefaultView:false,
      setIncludeFolders: false,
      setSelectFolderEnabled: false,
      // customViews: customViews,
      // token: token
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
    });
  };

 
  useEffect(() => {
    // do anything with the selected/uploaded files
    if (data) {
      props.handleDataDriver(data.docs)
    }
  }, [data]);
  const { translate } = props;
  return (
    <React.Fragment>
      <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={handleOpenPicker}>{translate("common_component.google_driver.button")}&nbsp;&nbsp;&nbsp;&nbsp;</a>
    </React.Fragment>
  );
}

export default withTranslate(ModalDriver);