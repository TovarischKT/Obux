const md5 = require('md5');
const bcrypt = require('bcrypt');
const CPF = require('cpf-check');
const path = require('path');
const fs = require('fs');

const { moreThan18Years } = require('../Utils/date');

const userSchema = require('../Models/userModel');

const verify = (user, cpf, dataNasc) => {
  if (user) {
    return 'User already exists';
  }

  if (!CPF.validate(cpf)) {
    return 'CPF not valid';
  }

  if (!moreThan18Years(new Date(dataNasc))) {
    return 'You are under 18';
  }

  return false;
};

module.exports = {
  async getUser(req, res) {
    const { id } = req.params.id;

    const user = await userSchema.findOne({ id });

    return user ? res.send({ user }) : res.status(404).send({});
  },

  async createUser(req, res) {
    try {
      const {
        nome, dataNasc, telefone, email, cpf, senha, cidade, estado,
      } = req.body;

      const salt = bcrypt.genSaltSync(10);
      const encryptedCPF = md5(cpf);

      const user = await userSchema.findOne({
        $or: [
          { email },
          { cpf: encryptedCPF },
        ],
      }).select('+cpf').exec();

      const userVerify = verify(user, cpf, dataNasc);

      if (userVerify) {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', req.file.filename);
        fs.unlinkSync(filePath);
        return res.send(userVerify);
      }

      const encyptedPassword = bcrypt.hashSync(senha, salt);

      const fileName = `http://localhost:3000/files/${req.file.filename}`;
      const createdUser = await userSchema.create({
        nome,
        dataNasc,
        telefone,
        email,
        cpf: encryptedCPF,
        senha: encyptedPassword,
        cidade,
        estado,
        pfp: fileName,
      });
      return res.json(createdUser);
    } catch (e) {
      console.log(e);
      return res.status(500).send('Error');
    }
  },

  async login(req, res) {
    const { email, senha } = req.body;

    const user = await userSchema.findOne({ email }).select(['+senha']);

    if (user) {
      if (bcrypt.compareSync(senha, user.senha)) {
        user.senha = undefined;
        return res.send({ user });
      }
      return res.status(400).send('Incorrect Email or Password');
    }
    return res.send('User does not exists');
  },

};
