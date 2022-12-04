    // Conexão com o banco
    const Sequelize = require('sequelize'); // é como se fosse o import em Java
    const sequelize = new Sequelize('pizzaria','root','kivkat92',{
        host: 'localhost', // em qual servidor está o banco de dados
        dialect: 'mysql' // qual o tipo de SGBD
    });
    sequelize.authenticate().then(function(){ // deu certo
        console.log('Conectado com sucesso !');
    }).catch(function(erro){ // deu errado
        console.log('Falha ao se conectar: '+erro);
    });

    module.exports = {        // estou exportando os dois, um para requerer o sequelize e o outro para usar de fato
        Sequelize: Sequelize,
        sequelize: sequelize
    }