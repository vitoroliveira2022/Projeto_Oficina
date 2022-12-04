1 - No seu MYSQL cria um banco de dados chamado 'pizzaria';
2 - No arquivo db.js configure seu nome de usuario e senha para conectar com seu MySQL;
3 - Rode-o app.js com o NodeJS e use o sistema !

------------------- CRIANDO BANCO E CADASTRANDO PRIMEIRO FUNCIONÁRIO ----------------------
create database pizzaria;

use pizzaria;

insert into funcionarios values ('99999999999','Vitor Oliveira','vitor123','Avenida Sao Paulo, 44','Centro','Maracai','18988237490','Gerente',2500,'2022-11-29 21:00:00','2022-11-29 21:20:00');