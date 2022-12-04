const db = require('./db') // ./ significa que está na mesma pasta
var jaCriado = 0;

const Pedido = db.sequelize.define('pedidos',{
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false, // não pode ser nulo
        autoIncrement: true,
        primaryKey: true
    },
    cpfCliente: {
        type: db.Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'clientes', // aqui é o nome da tabela no banco de dados (de acordo com a criação daqui)
            key: 'cpf'
        }
    },
    idPizza: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'pizzas', 
            key: 'id'
        }
    },
    quantidade: {
        type: db.Sequelize.INTEGER,
        allowNull: false // não pode ser nulo
    },
    status: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

if(jaCriado === 0){
    Pedido.sync(); // se usa uma vez para criar as tabelas no MySQL depois comenta ou apaga
}
jaCriado++;

module.exports = Pedido // estou exportanto para acessar de outros lugares



