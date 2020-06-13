const multer = require('multer');
const upload = multer({
    dest: '../ComputerVisionEngineModule/tmp/uploads/'
});

module.exports = app => {
    const cveController = require("../controllers/computerVisionEngineController");

    app.post("/uploadImage", upload.single('photo'), cveController.post);
};