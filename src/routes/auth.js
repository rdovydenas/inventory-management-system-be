const mysql = require("mysql2/promise");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { mysqlConfig, jwtSecret } = require("../config");
router.post("/login", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ error: "Insufficient data provided" });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `SELECT id, email, password FROM users WHERE email = ${mysql.escape(
        req.body.email
      )}`
    );
    con.end();

    if (data.length !== 1) {
      return res.status(400).send({ error: "Email or password has failed" });
    }

    const passwordValidity = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!passwordValidity) {
      return res.status(400).send({ error: "Email or password has failed" });
    }

    const token = jwt.sign(
      {
        id: data[0].id,
        email: data[0].email,
      },
      jwtSecret,
      { expiresIn: 50 * 50 }
    );

    return res.send({ message: "Logging in", token });
  } catch (e) {
    console.log(err);
    res.status(500).send({ err });
  }
});

router.post("/register", async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ error: "Bad data provided" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const con = await mysql.createConnection(mysqlConfig);

    const [data] = await con.execute(
      `INSERT INTO users (email, password) VALUES (${mysql.escape(
        req.body.email
      )}, '${hashedPassword}')`
    );

    con.end();

    if (data.affectedRows !== 1) {
      return res.status(500).send({ error: "Error in db" });
    }

    return res.send({ message: "Account added to database" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Email already in use" });
  }
});

module.exports = router;
