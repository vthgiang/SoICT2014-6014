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
        text: "Khác",
    }
];
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