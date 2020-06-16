//const cv = require('opencv4nodejs');
const CVE = require('../ComputerVisionEngineModule/CVEngine.js');

function formatResults(orgResults, responsesTypes) {
    let results = new Array(responsesTypes.length);
    results.fill('', 0, responsesTypes.length);

    if (responsesTypes.length < orgResults.length) {
        results.fill('', 0, responsesTypes.length);
    } else if (responsesTypes.length > orgResults.length) {

        let orgResultsPointer = 0;
        for (let i = 0; i < responsesTypes.length; i++) {
            let inc = false;

            if (responsesTypes[i] == 'text') {
                if (orgResults[orgResultsPointer] != "Happy" || orgResults[orgResultsPointer] != "Meh" || orgResults[orgResultsPointer] != "Sad" || isNaN(orgResults[orgResults])) {
                    results[i] = orgResults[orgResultsPointer];
                    inc = !inc;
                }
            } else if (responsesTypes[i] == 'image') {
                if (orgResults[orgResultsPointer] == "Happy" || orgResults[orgResultsPointer] == "Meh" || orgResults[orgResultsPointer] == "Sad") {
                    results[i] = orgResults[orgResultsPointer];
                    inc = !inc;
                }
            } else {
                if (!isNaN(orgResults[orgResultsPointer])) {
                    results[i] = orgResults[orgResultsPointer];
                    inc = !inc;
                }
            }

            if (inc) {
                orgResultsPointer++;
            }
        }
    
    } else {
        results = orgResults.slice();
        results.forEach(function(item, i) { 
            if (item == 'None') 
                results[i] = ''; 
        });
    }

    return results;
}

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
                    message: formatResults(values, req.body.expected_data)
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
