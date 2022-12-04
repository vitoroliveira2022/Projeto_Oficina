const db = require('./db') // ./ significa que está na mesma pasta
var jaCriado = 0;

const Cliente = db.sequelize.define('clientes',{
    cpf: {
        type: db.Sequelize.STRING,
        primaryKey: true, // será a chave primária
        allowNull: false
    },
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false, // não pode ser nulo
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    logradouro: {
        type: db.Sequelize.STRING,
        allowNull: false // não pode ser nulo
    },
    bairro: {
        type: db.Sequelize.STRING,
        allowNull: false // não pode ser nulo
    },
    cidade: {
        type: db.Sequelize.STRING,
        allowNull: false // não pode ser nulo
    },
    telefone: {
        type: db.Sequelize.STRING,
        allowNull: false // não pode ser nulo
    }
})

if(jaCriado === 0){
    Cliente.sync(); // se usa uma vez para criar as tabelas no MySQL depois comenta ou apaga
}
jaCriado++;


module.exports = Cliente // estou exportanto para acessar de outros lugares

