//const cv = require('opencv4nodejs');
const CVE = require('../ComputerVisionEngineModule/CVEngine.js');


exports.post = function(req, res, next) {
    if(req.body.file) {
        try {
            // Engine creation and image resolution
            let cve = new CVE(req.body.file, req.body.expected_data);
            let results = cve.run();

            // Waiting for the promises
            Promise.all(results).then(values => {
                // Sending results
                res.status(200).send({
                    message: values
                });
            })

        } catch (error) {
            console.log(error);
            next(error);
            res.status(503).send(error);
            return;
        }
    } else {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
}
