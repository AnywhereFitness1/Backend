const db = require("../dbConfig");

module.exports = {
  find,
  findBy,
  findById,
  add,
  update,
  remove
};

function find() {
  return db("classes");
}

function findBy(username) {
  return db("classes").where({ username });
}

function findById(id) {
  return db("classes").where({ id: Number(id) });
}

function add(user) {
  return db("classes")
    .insert(user)
    .then(ids => ({ id: ids[0] }));
}

function update(id, post) {
  return db("classes")
    .where("id", Number(id))
    .update(post);
}

function remove(id) {
  return db("classes")
    .where("id", Number(id))
    .del();
}