import { useEffect } from "react";
import useDrivePicker from "react-google-drive-picker";
import React, { Component } from 'react';
import "./ggdriver.css"
// eslint-disable-next-line @typescript-eslint/no-explicit-any


function ModalDriver(props) {
  const [openPicker, data] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: "716399266209-fjfedph6jgq5l415flu51ophhv9qqgfr.apps.googleusercontent.com",
      developerKey: "AIzaSyDC_Nmb_rWTaSQbUkZSNifUKGHz1Xomvh0",
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
  return (
    <React.Fragment>
      <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={handleOpenPicker}>Open Picker&nbsp;&nbsp;&nbsp;&nbsp;</a>
    </React.Fragment>
  );
}

export default ModalDriver;