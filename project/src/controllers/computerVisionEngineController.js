const fs = require('fs');
const cv = require('opencv4nodejs');
const CVE = require('../ComputerVisionEngineModule/CVEngine.js');

exports.post = function(req, res) {
    if(req.file) {
        try {
            cv.imreadAsync('./ComputerVisionEngineModule/tmp/uploads/' + req.file.filename, (err, mat) => {
                let responsesTypes = ['text', 'text', 'text', 'icons-checkbox',
                                    'text', 'icons-checkbox', 'normal-checkbox',
                                    'normal-checkbox', 'text'];    // RECIBIR INFORMACIÓN

                // Engine creation and image resolution
                let cve = new CVE(mat, responsesTypes);
                let results = cve.run();

                // Waiting for the promises
                Promise.all(results).then(values => {
                    //res.json(req.file);
                    //console.log(values);

                    // Sending results

                    // Deleting received image
                    fs.unlinkSync('../ComputerVisionEngineModule/tmp/uploads/' + req.file.filename);
                })
            });
        } catch (error) {
            console.log(err);
            next(err);
            res.status(503).send(err);
            return;
        }
    } else {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
}
