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
  return db("users");
}

function findBy(username) {
  return db("users").where({ username });
}

function findById(id) {
  return db("users").where({ id: Number(id) });
}

function add(user) {
  return db("users")
    .insert(user)
    .then(ids => ({ id: ids[0] }));
}

function update(id, post) {
  return db("users")
    .where("id", Number(id))
    .update(post);
}

function remove(id) {
  return db("users")
    .where("id", Number(id))
    .del();
}
