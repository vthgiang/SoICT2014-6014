const express = require("express");
const router = express.Router();

const CertificateController = require("./certificate.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/', auth, CertificateController.searchCertificate);


router.post('/', auth, CertificateController.createNewCertificate);

router.patch('/:id', auth, CertificateController.editCertificate);
router.delete('/:id', auth, CertificateController.deleteCertificate);

module.exports = router;