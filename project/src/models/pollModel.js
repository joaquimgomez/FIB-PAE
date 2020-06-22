const bd = require("../bd/bd");

//constructor

const poll = function(poll) {
    this.id = poll.id;
    this.name = poll.name;
    this.org_id = poll.org_id;
}

poll.create = (newpoll, result) => {
    bd.query("INSERT INTO Poll SET ?", newpoll, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created poll: ", res.insertId);
        result(null, res.insertId);
    });
};

poll.getAll = result => {
    bd.query("select p.id,  p.name, p.created_at, p.org_id, o.name as org_name from Poll p, Organization o where p.org_id = o.id order by created_at asc;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("polls: ", res);
        result(null, res);
    });
};

poll.findById = (pollId, result) => {
    bd.query('SELECT * FROM Poll WHERE id = ' + pollId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err,null);
            return;
        }
        if (res.length) {
            console.log("found poll: ", res[0]);
            result(err,res[0])
            return;
        }
        result({kind: "not_found"}, null);
    });
}

poll.updateById = (id, poll, result) => {
    bd.query(
      "UPDATE Poll SET name = ?, org_id = ?, last_modify = ? WHERE id = ?",
      //[poll.name, poll.adress, poll.phone, poll.web, id], (err, res) => {
      [poll.name, poll.org_id, poll.last_modify, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found poll with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated poll: ", { id: id, ...poll });
        result(null, { id: id, ...poll });
      });
};

poll.remove = (id, result) => {
    bd.query("DELETE FROM Poll WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found poll with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted poll with id: ", id);
    result(null, res);
    });
};

poll.removeAll = result => {
    bd.query("DELETE FROM Poll", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' polles');
    result(null, res);
    });
};
  

module.exports = poll;
