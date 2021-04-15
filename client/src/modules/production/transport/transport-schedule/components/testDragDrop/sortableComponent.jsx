import React, {useState, useEffect} from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import './styleDragDrop.css';
import { getDistanceAndTime } from '../../../transportHelper/getDistanceAndTimeGoong'
function SortableComponent(props) {

	const {transportRequirements, transportVehicle, callBackStateOrdinalAddress} = props

	const [addressList, setAddressList] = useState([]);
	const [distance, setDistance] = useState([]);
	const [duration, setDuration] = useState([]);

	const initializeDistanceAndDuration = async (addressList) => {
		let distanceArr = [0];
		let durationArr = [0];
		if (addressList && addressList.length !==0){
			for (let i=1;i<addressList.length;i++){
				setTimeout(
				await getDistanceAndTime(addressList[i-1].geocodeAddress, addressList[i].geocodeAddress)
				.then(value => {
					distanceArr.push(value.distance);
					durationArr.push(value.duration);
				}), 3000)
			}
			setDistance(distanceArr);
			setDuration(durationArr);
		}
	}

	useEffect(() => {
		if (transportRequirements && transportRequirements.length !==0){
			let addressData = [];
			transportRequirements.map((item, index) => {
				addressData.push({
					transportRequirement: item,
					transportRequirementId: item._id,
					address: item.fromAddress,
					geocodeAddress: item.geocode.fromAddress,
					addressType: 1,
					payload: item.payload,
					volume: item.volume
				},
				{
					transportRequirement: item,
					transportRequirementId: item._id,
					address: item.toAddress,
					geocodeAddress: item.geocode.toAddress,
					addressType: 2,
					payload: item.payload,
					volume: item.volume
				})
			})
			setAddressList(addressData);
			initializeDistanceAndDuration(addressData);
		}
	}, [transportRequirements])

	useEffect(() => {
		callBackStateOrdinalAddress(addressList, transportVehicle._id);
	}, [addressList])

	useEffect(() => {
		if (addressList && addressList.length !==0 ){
			let copyAddressList = [...addressList];
			for (let i=0;i<copyAddressList.length;i++){
				copyAddressList[i].distance = distance[i];
				copyAddressList[i].duration = duration[i];
			}
			setAddressList(copyAddressList);
		}
	}, [duration, distance])


	const onSortEnd = async ({oldIndex, newIndex}) => {
		let arrayAddress = [...addressList];
		console.log(oldIndex, " ",newIndex)
		arrayAddress = arrayMove(arrayAddress, oldIndex, newIndex);
		let check = 0;
		let flag = true;
		let checkedArray = [];
		arrayAddress.map((item, index) => {
			if (check < 0){
				flag=false;
			}
			if (item.addressType === 1){
				checkedArray.push(item.transportRequirementId);
				check++;
			}
			else{
				if (checkedArray.indexOf(item.transportRequirementId) > -1){
					check--;
				}
				else {
					flag=false;
				}
			};
		})
		if (check ===0 && flag){
			// Nếu ban đầu ở vị trí 0 -> sau sắp xếp giá trị element kế tiếp = 0
			if (oldIndex===0 && newIndex !==0){
				// Update vị trí cũ
				arrayAddress[0].distance=0;
				arrayAddress[0].duration=0;
				// Update vị trí mới
				// Update chính nó
				await getDistanceAndTime(arrayAddress[newIndex-1].geocodeAddress, arrayAddress[newIndex-1].geocodeAddress)
					.then(
						value => {
							arrayAddress[newIndex].distance = value.distance;
							arrayAddress[newIndex].duration = value.duration;
						}
					)
				
				// Update sau nó
				if (newIndex<addressList.length - 1){
					await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex+1].geocodeAddress)
						.then(
							value => {
								arrayAddress[newIndex+1].distance = value.distance;
								arrayAddress[newIndex+1].duration = value.duration;
							}
						)
				}

			}
			if (oldIndex === arrayAddress.length - 1 && newIndex !==  oldIndex){
				// Vị trí cũ ko cần update
				//Update vị trí mới
				//update chính nó
				if (newIndex === 0){
					arrayAddress[0].distance=0;
					arrayAddress[0].duration=0;
				}
				else {
					await getDistanceAndTime(arrayAddress[newIndex-1].geocodeAddress, arrayAddress[newIndex].geocodeAddress)
					.then(
						value => {
							arrayAddress[newIndex].distance = value.distance;
							arrayAddress[newIndex].duration = value.duration;
						}
					)
				}
				// update sau nó
				await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex+1].geocodeAddress)
				.then(
					value => {
						arrayAddress[newIndex+1].distance = value.distance;
						arrayAddress[newIndex+1].duration = value.duration;
					}
				)
			}
			if (oldIndex < (arrayAddress.length - 1) && oldIndex > 0 && newIndex !== oldIndex){
				//update vị trí cũ
				await getDistanceAndTime(arrayAddress[oldIndex-1].geocodeAddress, arrayAddress[oldIndex].geocodeAddress)
				.then(
					value => {
						arrayAddress[oldIndex].distance = value.distance;
						arrayAddress[oldIndex].duration = value.duration;
					}
				)			
				// update vị trí mới
				// update chính nó
				if (newIndex === 0 ){
					arrayAddress[oldIndex].distance = 0;
					arrayAddress[oldIndex].duration = 0;
				}
				else{
					console.log(arrayAddress[newIndex-1].address);
					console.log(arrayAddress[newIndex].address)
					await getDistanceAndTime(arrayAddress[newIndex-1].geocodeAddress, arrayAddress[newIndex].geocodeAddress)
					.then(
						value => {
							arrayAddress[newIndex].distance = value.distance;
							arrayAddress[newIndex].duration = value.duration;
						}
					)
				}	
				// update sau nó
				if (newIndex !==arrayAddress.length - 1){
					await getDistanceAndTime(arrayAddress[newIndex].geocodeAddress, arrayAddress[newIndex+1].geocodeAddress)
					.then(
						value => {
							arrayAddress[newIndex+1].distance = value.distance;
							arrayAddress[newIndex+1].duration = value.duration;
						}
					)
				}
				
			}
			setAddressList(arrayAddress);
		}
	};

	return (<SortableList 
				items={addressList} 
				onSortEnd={onSortEnd} 
				axis={"x"} 
			/> );

}

export {SortableComponent}

const SortableList = SortableContainer(({items}) => {
  return (
    <div className={"test1"}>
      {items.map((item, index) => (
		<SortableItem 
			key={`item-${index}`} 
			index={index} 
			value={item} 
		/>
      ))}
    </div>
  );
});

const SortableItem = SortableElement(({value}) =>
    <div class="address-element" style={{margin: "10px", cursor: "pointer"}}>
		<div>
			{"Địa chỉ: "+ value.address}
		</div>		
		<div>
			{"Loai: "+ value.addressType}
		</div>
		<div>
			{"id: "+ value.transportRequirementId}
		</div>
		<div>
			{"Khoảng cách: "+value.distance}
		</div>
		<div>
			{"Thời gian: " + value.duration}
		</div>
	</div>

);