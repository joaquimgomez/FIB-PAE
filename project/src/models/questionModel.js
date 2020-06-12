const bd = require("../bd/bd");

//constructor

const question = function(question) {
    this.id = question.id;
    this.enc_id = question.enc_id;
    this.body = question.body;
    this.defined_answers = question.defined_answers;
}

question.create = (newquestion, result) => {
    bd.query("INSERT INTO Question SET ?", newquestion, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created question: ", res.insertId);
        result(null, res.insertId);
    });
};

question.getAll = result => {
    bd.query("SELECT * FROM Question", (err, res) => {
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
    bd.query('SELECT * FROM Question WHERE id = ' + questionId, (err, res) => {
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

question.findByPollId = (pollId, result) => {
    bd.query('SELECT * FROM Question WHERE enc_id = ' + pollId, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            //console.log("found questions: ", res);
            result(null, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

question.findByIdAndPollId = (pollId, id, result) => {
    bd.query('SELECT * FROM Question WHERE enc_id = ? and id = ?', [pollId, id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found questions: ", res);
            result({kind: "found"}, res);
            return;
        }
        result({kind: "not_found"}, null);
    });
}

question.updateById = (question, result) => {
    bd.query(
      "UPDATE Question SET body = ?, defined_answers = ? WHERE id = ? AND enc_id = ?",
      [question.body, question.defined_answers, question.id, question.enc_id], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        else if (res.affectedRows == 0) {
          // not found question with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        else {
            console.log("updated question: ", { id: question.id, ...question });
            result(null, { id: question.id, ...question });
            return;
        }
      });
};

question.remove = (pollId, questionId, result) => {
    bd.query("DELETE FROM Question WHERE id = ? AND enc_id = ?", [questionId, pollId], (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
    }
    else if (res.affectedRows == 0) {
        // not found question with the id
        result({kind: "not found" }, null);
        return;
    }
    else {
        console.log("deleted question with id: ", pollId);
        result(null, res);
    }
    });
};

question.removeAll = result => {
    bd.query("DELETE FROM Question", (err, res) => {
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
