const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    data_nasc: {
        type: String,
        required: true
    },
    telefone: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpf: {
        type: String,
        required: true,
        max: 14,
        select: true,
        unique: true
    },
    senha: {
        type: String,
        required: true,
        select: false
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        required: true,
        type: String,
        max: 2
    }
});

module.exports = mongoose.model('User', userSchema);
