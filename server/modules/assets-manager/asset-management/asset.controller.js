

const AssetService = require('./asset.service');
const {LogInfo, LogError} = require('../../../logs');
const {
    Asset,
} = require('../../../models').schema;
const multer = require('multer');
const cloudinary = require("cloudinary");
const DIRAVATAR = '../client/public/fileupload/employee-manage/avatar';
const DIRFILE = '../client/public/fileupload/employee-manage/file';
cloudinary.config({
    cloud_name: "moto-com",
    api_key: "783362328791129",
    api_secret: "oE02HK2zbJqIBWtEIGjSNI0pxWU"
});
/**
 * upload file tài liệu đính kèm
 */
const multerStorageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRFILE);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadFile = multer({
    storage: multerStorageFile,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});
exports.uploadFile = uploadFile.single("fileUpload");
string2literal = (value) => {
    var maps = {
        "NaN": NaN,
        "null": null,
        "undefined": undefined,
        "Infinity": Infinity,
        "-Infinity": -Infinity
    };
    console.log((value in maps) ? maps[value] : value);
    return ((value in maps) ? maps[value] : value);
};
/**
 *  upload Avatar
 */
const multerStorageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRAVATAR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadAvatar = multer({
    storage: multerStorageAvatar,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});
exports.uploadAvatar = uploadAvatar.single("fileUpload");
/**
 * Lấy danh sách tài sản
 */
exports.searchAssetProfiles = async (req, res) => {
    console.log('req.user.company._id', req.user.company._id);
    try {
        var allAssets = await AssetService.searchAssetProfiles(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_ASSET', req.user.company);
        res.status(200).json({success: true, messages: ["get_asset_success"], content: allAssets});
    } catch (error) {
        await LogError(req.user.email, 'GET_ASSET', req.user.company);
        res.status(400).json({success: false, messages: ["get_asset_false"], content: {error: error}});
    }
}

// Kiểm tra sự tồn tại của mã tài sản
exports.checkCode = async (req, res) => {
    try {
        var checkCode = await EmployeeService.checkAssetExisted(req.params.code, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: checkCode
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
        });
    }
}


// Tạo tài sản mới
exports.create = async (req, res) => {
    console.log('req', req);
    try {
        console.log('req', req.fields);
        new Promise(async (resolve, reject) => {
            await cloudinary.v2.uploader.upload(req.files.fileUpload.path, (error, result) => {
                if (result) {
                    resolve(result.url);
                } else if (error) {
                    console.log('error,', error);
                    reject(error);
                }
            });
        }).then(async (avatar) => {
            await new Asset({
                ...req.fields,
                person: req.fields.person === 'null' ? string2literal(req.fields.person) : req.fields.person,
                detailInfo: JSON.parse(req.fields.detailInfo),
                avatar,
                file: JSON.parse(req.fields.file)
            }).save((err, data) => {
                if (err) return res.json({success: false, err});
                res.status(200).json({
                    messages: "success",
                    content: data
                });
            });
        }).catch(err => res.status(200).json({
            messages: "fails",
            content: err
        }))
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }
}

// Cập nhật thông tin tài sản
exports.updateInfoAsset = async (req, res) => {
    try {
        var data = await AssetService.updateInfoAsset(req.params.id, req.body);
        res.status(200).json({
            messages: "success",
            content: data
        });
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }
}

// Cập nhật ảnh tài sản
exports.updateAvatar = async (req, res) => {
    try {
        const file = req.file;
        await LogInfo(req.user.email, 'UPDATE_AVATAR', req.user.company);
        res.status(200).json({success: true, messages: ["update_avatar_success"], content: {...file, path: file.path.split('fileupload')[1]}});
    } catch (error) {
        await LogError(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(400).json({success: false, messages: ["update_avatar_faile"], content: {error: error}});
    }
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo mã tài sản
exports.updateFile = async (req, res) => {
    try {
        var updateFile = await AssetService.updateFile(req.params.code, req.body, req.file.filename, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: updateFile
        });
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }
}

// delete thông tin tài sản
exports.delete = async (req, res) => {
    try {
        var infoAssetDelete = await AssetService.delete(req.params.id);
        res.status(200).json({
            messages: "success",
            content: infoAssetDelete
        });
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }
}
// upload file
exports.uploadFileAttachments = async (req, res) => {
    try {
        await cloudinary.uploader.upload(
            req.files.fileUpload.path,
            result => {
                res.status(200).send({
                    public_id: result.public_id,
                    url: result.url
                });
            },
            {
                public_id: `${Date.now()}`,
                resource_type: "auto"
            }
        );
    } catch (error) {
        res.status(400).json({
            messages: error
        });
    }
}
