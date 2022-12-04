const db = require('./db') // ./ significa que está na mesma pasta
var jaCriado = 0;

const Pizza = db.sequelize.define('pizzas',{ // criando o model que vai representar a tabela pizza no MySQL
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false, // não pode ser nulo
        autoIncrement: true,
        primaryKey: true // será a chave primária
    },
    nome: {
        type: db.Sequelize.STRING, // tem um limite
        allowNull: false, // não pode ser nulo
    },
    ingredientes: {
        type: db.Sequelize.TEXT, // posso por quantas palavras quiser
        allowNull: false, // não pode ser nulo
    },
    preco: {
        type: db.Sequelize.FLOAT,
        allowNull: false, // não pode ser nulo
    }

});



if(jaCriado === 0){
    Pizza.sync(); // se usa uma vez para criar as tabelas no MySQL depois comenta ou apaga
}
jaCriado++;

module.exports = Pizza // estou exportanto para acessar de outros lugares

