import React, { useState } from "react";
import { DialogModal } from "../../../../common-components";



function KPIDetailModal(props) {
  const { kpisTarget, modalId } = props
  
  
  return (
    <React.Fragment>
      <DialogModal
        modalID={modalId}
        isLoading={false}
        size={50}
        disableSubmit={true}
        hasSaveButton={false}
        hasCloseButton={false}
        hasNote={false}
        title={'Thông tin chi tiết về các chỉ tiêu KPI'}
      >
        <div className="pl-10">
          {kpisTarget.map((item, index) => (
          <div key={item._id} className="mb-4">
              <h3 className="text-2xl font-bold">{`${index + 1}. ${item?.name}`}</h3>
            <ul className="list-disc list-inside pl-2">
              <li><span className="font-semibold">Tiêu chí đánh giá: </span>{item?.criteria  || item?.type?.criteria}</li>
              <li><span className="font-semibold">Đơn vị: </span>{item?.unit || item?.type?.unit}</li>
              <li><span className="font-semibold">Tổng số giao: </span>{item?.assignValueInProject}</li>
              <li><span className="font-semibold">Cần đạt: </span>{item?.targetValueInProject}</li>
            </ul>
          </div>
        ))}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

export default KPIDetailModal