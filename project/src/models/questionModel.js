const bd = require("../bd/bd");

//constructor

const question = function(question) {
    this.id = question.id;
    this.enc_id = question.enc_id;
    this.body = question.body;
    this.defined_answers = question.defined_answers;
}

question.create = (newquestion, result) => {
    bd.query("INSERT INTO question SET ?", newquestion, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created question: ", {id: res.insertId, ...newquestion});
        result(null, {id: res.insertId, ...newquestion});
    });
};

question.getAll = result => {
    bd.query("SELECT * FROM question", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("questions: ", res);
        result(null, res);
    });
};

question.findById = (questionId, result) => {
    bd.query('SELECT * FROM question WHERE id = ' + questionId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found question: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

question.updateById = (id, question, result) => {
    bd.query(
      "UPDATE question SET enc_id = ?, body = ?, defined_answers = ? WHERE id = ?",
      [question.name, question.adress, question.phone, question.web, id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found question with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated question: ", { id: id, ...question });
        result(null, { id: id, ...question });
      });
};

question.remove = (id, result) => {
    bd.query("DELETE FROM question WHERE id = ?", id, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    if (res.affectedRows == 0) {
        // not found question with the id
        result({ kind: "not_found" }, null);
        return;
    }

    console.log("deleted question with id: ", id);
    result(null, res);
    });
};

question.removeAll = result => {
    bd.query("DELETE FROM question", (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    console.log('deleted ' + res.affectedRows + ' questiones');
    result(null, res);
    });
};
  

module.exports = question;
