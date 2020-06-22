const center = require("../models/centerModel");
const org = require("../models/organizationModel");


function getCenter(id, name, adress, org_id, org_name) {
    const centrObj = {
        id: id,
        name: name,
        adress: adress,
        org_name: org_name,
        org_id: org_id
    }

    return centrObj;
}

exports.findAll = (req, res) =>{
    center.getAll((err, dataCenter) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Error ocurred while retrieving centers." });
            return false;
        }
        res.status(200).send(dataCenter);
    });
};
