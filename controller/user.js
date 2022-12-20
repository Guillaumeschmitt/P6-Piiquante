const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.signup = (req, res, next) => {
  // "hash" = crypter le mdp, 10 (salt) correspond au nombre d'execution de l'algorytme de Hashage en nbr de tour
  bcrypt
    .hash(req.body.password, 10)
    // On créé un nouvel utilisateur avec le mdp crypté et son mail
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "L'utilisateur a bien été créé !" })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: " L'utilisateur n'a pas été trouvé !" });
      }
      // La fonction "compare" permet de comparer le mdp saisi avec le hash de la base de données
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrecte !" });
          }
          res.status(200).json({
            userId: user._id,
            // La fonction "sign" permet de chiffrer un nouveau token
            token: jwt.sign(
              // Identifiant utilisateur (payload)
              { userId: user._id },
              // Clé secrete pour l'encodage (+ longue et aléatoire pour la production)
              process.env.RANDOM_TOKEN_SECRET,
              // Configuration de l'expiration du token au bout de 24h
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
