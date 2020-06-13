const fs = require('fs');
//const cv = require('opencv4nodejs');
//const CVE = require('../ComputerVisionEngineModule/CVEngine.js');


exports.post = function(req, res, next) {
    if(req.body.file) {
        try {
            // Engine creation and image resolution
            console.log("Image: ", req.body.file);
            console.log("Types: ", req.body.expected_data)
            //let cve = new CVE(req.file, req.expected_data);
            // let results = cve.run();

            // // Waiting for the promises
            // Promise.all(results).then(values => {
            //     //res.json(req.file);
            //     console.log(values);

            //     // Sending results

            //     // Deleting received image
            //     //fs.unlinkSync('../ComputerVisionEngineModule/tmp/uploads/' + req.file.filename);
            // })


            //TODO
            res.status(200).send({
                message: req.body.file
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
