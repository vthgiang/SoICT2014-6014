import React, { useState, useEffect } from 'react'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import './styleDragDrop.css'
import { getDistanceAndTime } from '../../../transportHelper/getDistanceAndTimeGoong'
function SortableComponent(props) {
  const {
    transportVehicle,
    transportRequirements,
    routeOrdinal,
    callBackStateOrdinalAddress,
    callBackToSetLocationsOnMap,
    callBackAddressList
  } = props
  /**
   * [{
   * 	address: "",
   * 	addressType: "",
   * 	distance: 0,
   * 	duration: 0,
   * 	geocodeAddress: {lat: , lng: }
   * 	payload, volume
   * 	transportRequirement: {}
   * 	transportRequirementId
   * }]
   */
  const [addressList, setAddressList] = useState([])
  const [distance, setDistance] = useState([])
  const [duration, setDuration] = useState([])
  // const [transportVehicle, setTransportVehicle] = useState();
  // const [transportRequirements, setTransportRequirements] = useState();
  const [payloadVolumeInfo, setPayloadVolumeInfo] = useState([])

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  const initializeDistanceAndDuration = async (addressList) => {
    console.log(addressList, ' joafoapfjsofjasoijasiodf')
    let distanceArr = [0]
    let durationArr = [0]
    // let prePayload = [];
    // let preVolume = [];
    let listPayloadVolume = []
    let afterPayload
    let afterVolume
    if (addressList && addressList.length !== 0) {
      // tính toán khối lượng, thể tích tới điểm
      listPayloadVolume.push({
        afterPayload: Number(addressList[0].payload),
        afterVolume: Number(addressList[0].volume)
      })

      for (let i = 1; i < addressList.length; i++) {
        await sleep(500)
        setTimeout(
          await getDistanceAndTime(addressList[i - 1].geocodeAddress, addressList[i].geocodeAddress).then((value) => {
            distanceArr.push(value.distance)
            durationArr.push(value.duration)
          }),
          3000
        )
        if (Number(addressList[i].addressType) === 1) {
          afterPayload = Number(listPayloadVolume[i - 1].afterPayload) + Number(addressList[i].payload)
          afterVolume = Number(listPayloadVolume[i - 1].afterVolume) + Number(addressList[i].volume)
        } else {
          afterPayload = Number(listPayloadVolume[i - 1].afterPayload) - Number(addressList[i].payload)
          afterVolume = Number(listPayloadVolume[i - 1].afterVolume) - Number(addressList[i].volume)
        }
        let isError = false
        if (afterPayload > transportVehicle?.payload || afterVolume > transportVehicle?.volume) {
          isError = true
        }
        listPayloadVolume.push({
          afterPayload: afterPayload,
          afterVolume: afterVolume,
          isError: isError
        })
      }
      setPayloadVolumeInfo(listPayloadVolume)
      setDistance(distanceArr)
      setDuration(durationArr)
    }
  }

  useEffect(() => {
    // if (routeOrdinal && routeOrdinal.length!==0){
    // 	let addressData = [];
    // 	const FROM = "1";
    // 	routeOrdinal.map(r => {
    // 		if (String(r.type) === FROM){
    // 			addressData.push({
    // 				transportRequirement: r.transportRequirement,
    // 				transportRequirementId: r.transportRequirement?._id,
    // 				address: r.transportRequirement?.fromAddress,
    // 				geocodeAddress: r.transportRequirement?.geocode.fromAddress,
    // 				addressType: 1,
    // 				payload: r.transportRequirement?.payload,
    // 				volume: r.transportRequirement?.volume
    // 			})
    // 		}
    // 		else {
    // 			addressData.push({
    // 				transportRequirement: r.transportRequirement,
    // 				transportRequirementId: r.transportRequirement?._id,
    // 				address: r.transportRequirement?.toAddress,
    // 				geocodeAddress: r.transportRequirement?.geocode.toAddress,
    // 				addressType: 2,
    // 				payload: r.transportRequirement?.payload,
    // 				volume: r.transportRequirement?.volume
    // 			})
    // 		}
    // 	})

    // 	setAddressList(addressData);
    // 	initializeDistanceAndDuration(addressData);
    // }
    // else
    if (transportRequirements && transportRequirements.length !== 0) {
      let addressData = []
      transportRequirements.map((item, index) => {
        addressData.push(
          {
            transportRequirement: item,
            transportRequirementId: item?._id,
            address: item?.fromAddress,
            geocodeAddress: item?.geocode?.fromAddress,
            addressType: 1,
            payload: item?.payload,
            volume: item?.volume
          },
          {
            transportRequirement: item,
            transportRequirementId: item._id,
            address: item.toAddress,
            geocodeAddress: item.geocode.toAddress,
            addressType: 2,
            payload: item.payload,
            volume: item.volume
          }
        )
      })
      setAddressList(addressData)
      initializeDistanceAndDuration(addressData)
    }
  }, [transportRequirements])

  useEffect(() => {
    if (routeOrdinal && routeOrdinal.length !== 0) {
      let addressData = []
      const FROM = '1'
      routeOrdinal.map((r) => {
        if (String(r.type) === FROM) {
          addressData.push({
            transportRequirement: r.transportRequirement,
            transportRequirementId: r.transportRequirement?._id,
            address: r.transportRequirement?.fromAddress,
            geocodeAddress: r.transportRequirement?.geocode.fromAddress,
            addressType: 1,
            payload: r.transportRequirement?.payload,
            volume: r.transportRequirement?.volume
          })
        } else {
          addressData.push({
            transportRequirement: r.transportRequirement,
            transportRequirementId: r.transportRequirement?._id,
            address: r.transportRequirement?.toAddress,
            geocodeAddress: r.transportRequirement?.geocode.toAddress,
            addressType: 2,
            payload: r.transportRequirement?.payload,
            volume: r.transportRequirement?.volume
          })
        }
      })

      setAddressList(addressData)
      initializeDistanceAndDuration(addressData)
    }
  }, [routeOrdinal])

  useEffect(() => {
    if (addressList && addressList.length !== 0 && transportVehicle) {
      callBackStateOrdinalAddress(addressList, transportVehicle._id)
      callBackToSetLocationsOnMap(addressList)
      if (callBackAddressList) {
        callBackAddressList([...addressList])
      }
    }
  }, [addressList])

  useEffect(() => {
    if (addressList && addressList.length !== 0) {
      let copyAddressList = [...addressList]
      for (let i = 0; i < copyAddressList.length; i++) {
        copyAddressList[i].distance = distance[i]
        copyAddressList[i].duration = duration[i]
      }
      setAddressList(copyAddressList)
    }
  }, [duration, distance])

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    let arrayAddress = [...addressList]
    arrayAddress = arrayMove(arrayAddress, oldIndex, newIndex)
    let check = 0
    let flag = true
    let checkedArray = []
    arrayAddress.map((item, index) => {
      if (check < 0) {
        flag = false
      }
      if (item.addressType === 1) {
        checkedArray.push(item.transportRequirementId)
        check++
      } else {
        if (checkedArray.indexOf(item.transportRequirementId) > -1) {
          check--
        } else {
          flag = false
        }
      }
    })
    if (check === 0 && flag) {
      let listPayloadVolume = []
      let afterPayload
      let afterVolume
      if (arrayAddress && arrayAddress.length !== 0) {
        // tính toán khối lượng, thể tích tới điểm
        listPayloadVolume.push({
          afterPayload: Number(arrayAddress[0].payload),
          afterVolume: Number(arrayAddress[0].volume)
        })
        for (let i = 1; i < arrayAddress.length; i++) {
          if (Number(addressList[i].addressType) === 1) {
            afterPayload = Number(listPayloadVolume[i - 1].afterPayload) + Number(addressList[i].payload)
            afterVolume = Number(listPayloadVolume[i - 1].afterVolume) + Number(addressList[i].volume)
          } else {
            afterPayload = Number(listPayloadVolume[i - 1].afterPayload) - Number(addressList[i].payload)
            afterVolume = Number(listPayloadVolume[i - 1].afterVolume) - Number(addressList[i].volume)
          }
          let isError = false
          if (afterPayload > transportVehicle?.payload || afterVolume > transportVehicle?.volume) {
            isError = true
          }
          listPayloadVolume.push({
            afterPayload: afterPayload,
            afterVolume: afterVolume,
            isError: isError
          })
        }
        setPayloadVolumeInfo(listPayloadVolume)
      }

      // Nếu ban đầu ở vị trí 0 -> sau sắp xếp giá trị element kế tiếp = 0
      if (oldIndex === 0 && newIndex !== 0) {
        // Update vị trí cũ
        arrayAddress[0].distance = 0
        arrayAddress[0].duration = 0
        // Update vị trí mới
        // Update chính nó
        await getDistanceAndTime(arrayAddress[newIndex - 1].geocodeAddress, arrayAddress[newIndex - 1].geocodeAddress).then((value) => {
          arrayAddress[newIndex].distance = value.distance
          arrayAddress[newIndex].duration = value.duration
        })
        sleep(500)
        // Update sau nó
        if (newIndex < addressList.length - 1) {
          await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex + 1].geocodeAddress).then((value) => {
            arrayAddress[newIndex + 1].distance = value.distance
            arrayAddress[newIndex + 1].duration = value.duration
          })
          sleep(500)
        }
      }
      if (oldIndex === arrayAddress.length - 1 && newIndex !== oldIndex) {
        // Vị trí cũ ko cần update
        //Update vị trí mới
        //update chính nó
        if (newIndex === 0) {
          arrayAddress[0].distance = 0
          arrayAddress[0].duration = 0
        } else {
          await getDistanceAndTime(arrayAddress[newIndex - 1].geocodeAddress, arrayAddress[newIndex].geocodeAddress).then((value) => {
            arrayAddress[newIndex].distance = value.distance
            arrayAddress[newIndex].duration = value.duration
          })
          sleep(500)
        }
        // update sau nó
        await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex + 1].geocodeAddress).then((value) => {
          arrayAddress[newIndex + 1].distance = value.distance
          arrayAddress[newIndex + 1].duration = value.duration
        })
        sleep(500)
      }
      if (oldIndex < arrayAddress.length - 1 && oldIndex > 0 && newIndex !== oldIndex) {
        //update vị trí cũ
        await getDistanceAndTime(arrayAddress[oldIndex - 1].geocodeAddress, arrayAddress[oldIndex].geocodeAddress).then((value) => {
          arrayAddress[oldIndex].distance = value.distance
          arrayAddress[oldIndex].duration = value.duration
        })
        sleep(500)
        // update vị trí mới
        // update chính nó
        if (newIndex === 0) {
          arrayAddress[0].distance = 0
          arrayAddress[0].duration = 0
          // console.log("ooooooooooooooooolpsdadoo")
        } else {
          await getDistanceAndTime(arrayAddress[newIndex - 1].geocodeAddress, arrayAddress[newIndex].geocodeAddress).then((value) => {
            arrayAddress[newIndex].distance = value.distance
            arrayAddress[newIndex].duration = value.duration
          })
          sleep(500)
        }
        // update sau nó
        if (newIndex !== arrayAddress.length - 1) {
          await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex + 1].geocodeAddress).then((value) => {
            arrayAddress[newIndex + 1].distance = value.distance
            arrayAddress[newIndex + 1].duration = value.duration
          })
          sleep(500)
        }
      }
      setAddressList(arrayAddress)
    }
  }

  return <SortableList items={addressList} payloadVolumeInfo={payloadVolumeInfo} onSortEnd={onSortEnd} axis={'x'} />
}

export { SortableComponent }

const SortableList = SortableContainer(({ items, payloadVolumeInfo }) => {
  // console.log(items, " day la itemmmmmmmmmmmmmm")
  return (
    <div className={'test1'}>
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} stt={index} value={item} payloadVolumeInfo={payloadVolumeInfo[index]} />
      ))}
    </div>
  )
})

const SortableItem = SortableElement((props) => {
  let { value, index, stt, payloadVolumeInfo } = props
  const getTypeTransportRequirement = (value) => {
    if (Number(value) === 1) return 'Nhận'
    return 'Giao'
  }
  return (
    <div
      className={`address-element box box-solid ${payloadVolumeInfo?.isError ? 'element-error' : ''}`}
      style={{ margin: '10px', cursor: 'pointer' }}
    >
      <div>{'STT: ' + (stt + 1)}</div>
      <div>{'Địa chỉ: ' + value.address}</div>
      <div>{'Loai: ' + getTypeTransportRequirement(value.addressType)}</div>
      <div>{'ID: ' + value.transportRequirement?.code}</div>
      <div>{'Trọng lượng: ' + value.payload}</div>
      <div>{'Thể tích: ' + value.volume}</div>
      <div>{'Trọng lượng hàng hóa sau khi tới điểm: ' + payloadVolumeInfo?.afterPayload}</div>
      <div>{'Thể tích hàng hóa sau khi tới điểm: ' + payloadVolumeInfo?.afterVolume}</div>
      <div>{'Khoảng cách: ' + value.distance}</div>
      <div>{'Thời gian: ' + value.duration}</div>
    </div>
  )
})
