const requirements = [
    {
        value: "1",
        text: "Giao hàng",
        billType: "4",
        billGroup: "2",
    },
    {
        value: "2",
        text: "Trả hàng",
        billType: "7",
        billGroup: "3",
    },
    {
        value: "3",
        text: "Chuyển thành phẩm tới kho",
        billType: "2",
        billGroup: "1",
    },
    {
        value: "4",
        text: "Giao nguyên vật liệu",
        billType: "3",
        billGroup: "2"
    },
    {
        value: "5",
        text: "Vận chuyển",
    }
];
exports.getListTypeRequirement = () => {
    return requirements;
}
exports.getValueTypeRequirement = (billGroup, billType) => {
    let res = "5";
    if (billGroup && billType){
        requirements.map(item => {
            if (String(item.billGroup) === String(billGroup) && String(item.billType) === billType){
                res = item.value;
            }
        })
    }
    return res;
}
exports.getTypeRequirement = (value)=>{
    let res="";
    if (value && requirements){
        requirements.map(item => {
            if (item.value === String(value)){
                res = item.text;
            }
        });
    }
    if (String(value)==="5"){
        res="Vận chuyển";
    }
    return res;
}

exports.getTransportStatus = (routeOrdinal) => {
    if (routeOrdinal && routeOrdinal.transportRequirement && routeOrdinal.transportRequirement.transportStatus) {
        if (String(routeOrdinal.type) === "1"){
            if (String(routeOrdinal.transportRequirement.transportStatus.fromAddress?.status) === "1"){
                return "Đã lấy được hàng";
            }
            else {
                return "Chưa lấy được hàng";
            }
        }
        else {
            if (String(routeOrdinal.transportRequirement.transportStatus.toAddress?.status) === "1"){
                return "Đã giao hàng";
            }
            else {
                return "Chưa giao được hàng";
            }
        }
    }
    return "Chưa tiến hành";
}

const transportRequirementStatus = [
    {
        value: "1", text: "Chờ phê duyệt"
    },
    {
        value: "2", text: "Đã phê duyệt - Chờ xếp lịch"
    },
    {
        value: "3", text: "Chờ vận chuyển"
    },
    {
        value: "4", text: "Đang vận chuyển"
    },
    {
        value: "5", text: "Đã vận chuyển"
    },
    {
        value: "6", text: "Vận chuyển thất bại"
    }
]
exports.getListTransportRequirementStatus = () => {
    return transportRequirementStatus;
}
exports.getTransportRequirementStatus = (value) => {
    let res = "";
    let k = transportRequirementStatus.filter(r => String(r.value) === String(value));
    if (k && k.length!==0){
        res = k[0].text;
    }
    return res;
}

const planStatus = [
    {
        value: "1",
        text: "Cần phân công phương tiện, xếp lộ trình di chuyển"
    },
    {
        value: "2",
        text: "Sẵn sàng vận chuyển"
    },
    {
        value: "3",
        text: "Đang tiến hành vận chuyển"
    },
    {
        value: "4",
        text: "Hoàn thành"
    },
]
exports.getPlanStatus = (value) => {
    let res = "";
    let tmp = planStatus.filter(r => String(r.value)===String(value));
    if (tmp && tmp.length!==0){
        res = tmp[0].text;
    }
    return res;
}

exports.checkFinishMission = (mission) => {
    if (Number(mission.type) === 1){
        if (mission.transportRequirement?.transportStatus?.fromAddress){
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (mission.transportRequirement?.transportStatus?.toAddress){
            return true;
        }
        else {
            return false;
        }
    }

}