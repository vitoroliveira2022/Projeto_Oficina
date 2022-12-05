const express = require('express'); // estou chamando o express
const app = express(); // a constante 'app' está recebendo a função express e cria um copia do express 
const handlebars = require('express-handlebars'); // estou chamando o express-handlebars e passando para a const
const bodyParser = require('body-parser'); // para trabalhar com os valores digitados nos input
const Pizza = require('./models/Pizza'); // estou pegando o model de Pizza
const Cliente = require('./models/Cliente'); // estou pegando o model de Cliente
const Funcionario = require('./models/Funcionario'); // estou pegando o model de Funcionario
const Pedido = require('./models/Pedido'); // estou pegando o model de Pedido

// variaveis para armazenar cpf e senha dos usuarios (cliente ou funcionario) para verificar se estao logados
var cpfUsuario;
var senhaUsuario;
var ehCliente; // vai receber 1 se for cliente e 0 se for funcionario

// Configurações
    // Com essas duas linhas abaixo eu informo ao express que quero usar o Handlebars como template engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));// main é o template padrão da aplicação
    app.set('view engine','handlebars');
    // Para usar body-parser (serve para pegar dados de formulários)
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

// Funções
    // verifica se o usuario está logado
    function verificaLogado(){
        if(cpfUsuario === undefined){ // se n estiver logado
            return 0;
        }
        return 1; // se tiver logado
    }

   
//Rotas

    // rota inicial
    app.get('/',function(req,res){ // usando função de callback
        res.sendFile(__dirname+'/html/index.html')
    });   
        
  
// Rotas de usuario
    // leva para o login do usuario
    app.get('/usuario/login',function(req,res){
        res.render('login');
    })

    // rota que faz o login do usuario 
    app.post('/usuario/logando',async function (req,res){ //Função assincrona: só vai ser executada quando algo acontecer.
        var Cli = await Cliente.findOne({  // o await faz a função pausar até retornar o cpf 
            attributes: ['cpf','senha'] , // dados do banco que quero
            where: {
                cpf: req.body.cpfUsuario, // cpf é igual ao digitado no campo cpf
                senha: req.body.senhaUsuario
            }
        })
        var Func = await Funcionario.findOne({  // o await faz a função pausar até retornar o cpf 
            attributes: ['cpf','senha'] , // dados do banco que quero
            where: {
                cpf: req.body.cpfUsuario, // cpf é igual ao digitado no campo cpf
                senha: req.body.senhaUsuario
            }
        })
        
        if(Cli != null){
            // alimentando variaveis globais para verificar se está logado depois
            cpfUsuario = Cli.cpf;
            senhaUsuario = Cli.senha;
            ehCliente = 1;
            res.redirect('/home')
        }else if(Func != null){
            // alimentando variaveis globais para verificar se está logado depois
            cpfUsuario = Func.cpf;
            senhaUsuario = Func.senha;
            ehCliente = 0;
            res.redirect('/homeFunc')
        }else{
            res.send('Erro, não existe essa conta !');
        }
        
    })

    // rota que faz o logout do usuario
    app.get('/usuario/logout',function(req,res){
        if(cpfUsuario != undefined){
            cpfUsuario = undefined;
        }
        res.redirect('/');
    })

// Rotas de cliente

    // leva para o formulario de cadastro de cliente
    app.get('/cliente/cadastro',function(req,res){
        res.render('cadCliente');
    })

    // rota que leva para a pagina principal - Cliente
    app.get('/home',function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            res.render('home')
        }else{
            res.send('Erro, você não está logado !')
        }
        
    })

    // leva para o cliente ver seus dados 
    app.get('/cliente/dados',function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            Cliente.findOne({where: {'cpf':cpfUsuario}}).then(function(cliente){
                res.render('mostraDados',{mostrandoCliente: cliente}) // estou passando para a variavel mostrandoClientes o objeto 
                //cliente, que tem todos os dados 
            })
        }else{
            res.send('Erro, logue primeiro !');
        }
    })

    // mostra os clientes cadastrados
    app.get('/cliente/cadastrados', function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            Cliente.findAll().then(function(clientes){
                res.render('mostraCliente',{mostrandoClientes: clientes}) // estou passando para a variavel mostrandoClientes o objeto 
                //clientes com todos os clientes cadastrados (array)
            })
        }else{
            res.send('Erro, logue primeiro !');
        }

    })
        
    // cadastra os clientes
    app.post('/cliente/cadastrando',function(req,res){
        // req.body.nomeCampo eu pego o dado enviado do formulario com o name indicado
        Cliente.create({
            cpf: req.body.cpfCliente,
            nome: req.body.nomeCliente,
            senha: req.body.senhaCliente,
            logradouro: req.body.logradouroCliente,
            bairro: req.body.bairroCliente,
            cidade: req.body.cidadeCliente,
            telefone: req.body.telefoneCliente
        }).then(function(){
            res.render('msgCliCadastrado'); // se deu certo vai redirecionar para essa rota
        }).catch(function(erro){
            res.send('Houve um erro ao cadastrar o cliente: '+erro);
        })   
    })


    // rota que recebe o cpf do cliente e leva para a tela que faz a edição
    app.get('/cliente/editar/:cpf',function(req,res){
        Cliente.findOne({where: {'cpf':req.params.cpf}}).then(function(cliente){ 
            res.render('editaCliente',{mostrandoCliente: cliente}); 
        })
    });


    // rota que edita o cliente
    app.post('/cliente/editando',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Cliente.findOne({where: {'cpf':req.body.cpf}}).then(function(cliente){
                cliente.nome = req.body.nome;
                cliente.senha = req.body.senha;
                cliente.logradouro = req.body.logradouro;
                cliente.bairro = req.body.bairro;
                cliente.cidade = req.body.cidade;
                cliente.telefone = req.body.telefone;
                
                cliente.save().then(function(){
                    res.render('editadoCliente');
                })
            })
        }else{
            res.send('Erro, faça login primeiro !')
        }
    })

    // rota que deleta cliente
    app.get('/cliente/deletar/:cpf',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Cliente.destroy({where: {'cpf':req.params.cpf}}).then(function(){ 
                res.render('removidoCliente');
            })
        }else{
            res.send('Erro, faça login primeiro !');
        }
       
    })


// Rotas de funcionario

    // leva para o formulario de cadastro de funcionario
    app.get('/funcionario/cadastro',function(req,res){
        var logado = verificaLogado()
        if(logado === 1){
            res.render('cadFuncionario');
        }else{
            res.send('Erro, logue primeiro !')
        }
        
    })
    

    // rota que leva para a pagina principal - Funcionario
    app.get('/homeFunc',function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            res.render('homeFunc')
        }else{
            res.send('Erro, você não está logado !')
        }
        
    })

     // mostra os funcionarios cadastrados
     app.get('/funcionario/cadastrados', function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            Funcionario.findAll().then(function(funcionarios){
                res.render('mostraFuncionarios',{mostrandoFuncionarios: funcionarios}) 
            })
        }else{
            res.send('Erro, logue primeiro !');
        }

    })
        
    // cadastra os funcionarios
    app.post('/funcionario/cadastrando',function(req,res){
        // req.body.nomeCampo eu pego o dado enviado do formulario com o name indicado
        Funcionario.create({
            cpf: req.body.cpf,
            nome: req.body.nome,
            senha: req.body.senha,
            logradouro: req.body.logradouro,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            telefone: req.body.telefone,
            cargo: req.body.cargo,
            salario: req.body.salario
        }).then(function(){
            res.render('msgFuncCadastrado'); // se deu certo vai redirecionar para essa rota
        }).catch(function(erro){
            res.send('Houve um erro ao cadastrar o funcionário: '+erro);
        })   
    })

    // rota que recebe o cpf do funcionario e leva para o formulario de edição
    app.get('/funcionario/editar/:cpf',function(req,res){
        Funcionario.findOne({where: {'cpf':req.params.cpf}}).then(function(funcionario){ 
            res.render('editaFunc',{mostrandoFuncionario: funcionario}); 
        })
    });

    // edita funcionario
        app.post('/funcionario/editando',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Funcionario.findOne({where: {'cpf':req.body.cpf}}).then(function(funcionario){ 
                funcionario.nome = req.body.nome;
                funcionario.senha = req.body.senha;
                funcionario.logradouro = req.body.logradouro;
                funcionario.bairro = req.body.bairro;
                funcionario.cidade = req.body.cidade;
                funcionario.telefone = req.body.telefone;
                funcionario.cargo = req.body.cargo;
                funcionario.salario = req.body.salario;
                    
                funcionario.save().then(function(){
                    res.render('editadoFunc');
                })
            })
        }else{
            res.send('Erro, faça login primeiro !')
        }
    })

    // rota que deleta funcionario
    app.get('/funcionario/deletar/:cpf',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Funcionario.destroy({where: {'cpf':req.params.cpf}}).then(function(){ 
                res.render('removidoFuncionario');
            })
        }else{
            res.send('Erro, faça login primeiro !');
        }
       
    })

// Rotas de pizza

    // leva para o formulario de cadastro de pizza
    app.get('/pizza/cadastro',function(req,res){
        res.render('cadPizza'); // nessa rota vai renderizar esse arquivo handlebars
    })

    // mostra as pizzas cadastradas
    app.get('/pizza/cadastradas', function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            if(ehCliente === 1){
                Pizza.findAll().then(function(pizzas){
                    res.render('mostraPizza',{mostrandoPizzas: pizzas})  
                })
            }else if(ehCliente === 0){
                Pizza.findAll().then(function(pizzas){
                    res.render('mostraPizzaFunc',{mostrandoPizzas: pizzas})  
                })
            }
            
        }else{
            res.send('Erro, faça login primeiro !')
        }
        
    })

    // cadastra as pizzas
    app.post('/pizza/cadastrando',function(req,res){
        // req.body.nomeCampo eu pego o dado enviado do formulario com o name indicado
        Pizza.create({
            nome: req.body.nomePizza,
            ingredientes: req.body.ingredientesPizza,
            preco: req.body.precoPizza
        }).then(function(){
            res.render('msgPizzaCadastrada'); // se deu certo vai redirecionar para essa rota
        }).catch(function(erro){
            res.send('Houve um erro ao cadastrar a pizza: '+erro);
        })
        
    })

    // rota que recebe o id da pizza e leva para a tela que faz a edição
    app.get('/pizza/editar/:id',function(req,res){
        Pizza.findOne({where: {'id':req.params.id}}).then(function(pizza){ // faz uma pesquisa por id (recebo o id na função)
            res.render('editaPizza',{mostrandoPizza: pizza}); 
        })
    });
    
    
    // edita a pizza
    app.post('/pizza/editando',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Pizza.findOne({where: {'id':req.body.id}}).then(function(pizza){
                pizza.nome = req.body.nome;
                pizza.ingredientes = req.body.ingredientes;
                pizza.preco = req.body.preco;
                
                pizza.save().then(function(){
                    res.render('editadoPizza');
                })
            })
        }else{
            res.send('Erro, faça login primeiro !')
        }
    })
    
    // deleta pizza
    app.get('/pizza/deletar/:id',function(req,res){ 
        var logado = verificaLogado();
        if(logado === 1){
            Pizza.destroy({where: {'id':req.params.id}}).then(function(){ // vai deletar o pedido do id que estiver no parametro
                res.render('removidoPizza');
            })
        }else{
            res.send('Erro, faça login primeiro !')
        }

    })

// Rotas de pedido

    // leva para o formulario de cadastro de pedido
    app.get('/pedido/cadastro',function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            res.render('cadPedido');
        }else{
            res.send('Erro, faça login primeiro !')
        }
        
    })

    // mostra todos os pedidos 
    app.get('/pedido/cadastrados', function(req,res){
        var logado = verificaLogado();
        if(logado === 1){
            if(ehCliente === 1){
                Pedido.findAll({where: {'cpfCliente':cpfUsuario}}).then(function(pedidos){
                    res.render('mostraPedido',{mostrandoPedidos: pedidos})
                })
            }
            else if(ehCliente === 0){ 
                Pedido.findAll().then(function(pedidos){
                    Cliente.findAll().then(function(clientes){
                        Pizza.findAll().then(function(pizzas){
                            res.render('mostraPedidoFunc',{mostrandoPedidos: pedidos, mostrandoClientes: clientes, mostrandoPizzas: pizzas})
                        })
                    })
                })
            }
          
        }else{
            res.send('Erro, faça login primeiro !')
        }
        
    })

    // cadastra os pedidos
    app.post('/pedido/cadastrando',function(req,res){
        // req.body.nomeCampo eu pego o dado enviado do formulario com o name indicado
        Pizza.findOne({where: {'id':req.body.idPizza}}).then(function(pizza){ // pesquiso para ver se tem a pizza com o id digitado pelo cliente
            if(pizza){ // se existe a pizza com o ID que o cliente digitou
                console.log('Tem essa pizza')
                Pedido.create({
                    cpfCliente: cpfUsuario,
                    idPizza: req.body.idPizza,
                    quantidade: req.body.quantidade,
                    status: "Pendente"
                }).then(function(){
                    res.redirect('/pedido/cadastrados'); // se deu certo vai redirecionar para essa rota
                })
            }else{
                res.render('naoExistePizza')
            }
        })
    })

    // recebe o pedido
    app.get('/pedido/receber/:id',function(req,res){ 
        var logado = verificaLogado()
        if(logado === 1){
            Pedido.findOne({where: {'id':req.params.id}}).then(function(pedido){
                pedido.status = "Recebido";
                
                pedido.save().then(function(){
                    res.render('recebidoPedido');
                })
            })
        }else{
            res.send('Erro, faça login primeiro !')
        } 
    })
    
    // rota que muda status para saiu para entrega 
    app.get('/pedido/entrega/:id',function(req,res){ 
        var logado = verificaLogado()
        if(logado === 1){
            Pedido.findOne({where: {'id':req.params.id}}).then(function(pedido){
                pedido.status = "Saiu para entrega";
                pedido.save().then(function(){
                    res.render('saiuPedido')
                })

            })
        }else{
            res.send('Erro, faça login primeiro !')
        } 
    })

    // deleta pedido
    app.get('/pedido/deletar/:id',function(req,res){ 
        var logado = verificaLogado()
        if(logado === 1){
            Pedido.destroy({where: {'id':req.params.id}}).then(function(){ // vai deletar o pedido do id que estiver no parametro
                res.render('removidoPedido');
            })
        }else{
            res.send('Erro, faça login primeiro !')
        }
        
        //Pedido.destroy({where: {'id':req.params.id, 'cpfCliente':req.params.cpfClinente}}) // posso adicionar varias condições no where 
    })

app.use(express.static("css"));    

app.listen(8081,function(){ 
    console.log('Servidor rodando na porta 8081 !');
}) // informo a porta que vai rodar o servidor HTTP, tem que ser a ultima linha do codigo
