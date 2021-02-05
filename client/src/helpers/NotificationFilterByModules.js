export const NotificationFilterByModules = (arrNotification) => {
    let notifyTask = [], notifyAsset = [], notifyKPI = [], notifyDefault = [];
    
    arrNotification.forEach(obj => {
        let type;
        if (obj.associatedDataObject && obj.associatedDataObject.dataType) {
            type = parseInt(obj.associatedDataObject.dataType);
        }

        switch (type) {
            case 1:
                notifyTask = [...notifyTask, obj]
                break;
            case 2:
                notifyAsset = [...notifyAsset, obj];
                break;
            case 3:
                notifyKPI = [...notifyKPI, obj];
                break;
            default:
                notifyDefault = [...notifyDefault, obj];
                break;
        }
    })
    return { notifyTask, notifyAsset, notifyKPI, notifyDefault };
}