const db = require('./db') // ./ significa que está na mesma pasta
var jaCriado = 0;

const Funcionario = db.sequelize.define('funcionarios',{
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
    },
    cargo: {
        type: db.Sequelize.STRING,
        allowNull: false // não pode ser nulo
    },
    salario: {
        type: db.Sequelize.FLOAT,
        allowNull: false // não pode ser nulo
    }
})

if(jaCriado === 0){
    Funcionario.sync(); // se usa uma vez para criar as tabelas no MySQL depois comenta ou apaga
}
jaCriado++;

module.exports = Funcionario // estou exportanto para acessar de outros lugares
