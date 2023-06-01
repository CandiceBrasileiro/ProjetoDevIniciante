# ProjetoDevIniciante

Deve-se clonar a branch backend utilizando o comando no terminal: git clone -b backend https://github.com/CandiceBrasileiro/ProjetoDevIniciante.git



Essa documentação de software é uma descrição passo a passo de como utilizar e configurar uma aplicação de chat em tempo real com back-end em Node.js, front-end em React e a biblioteca socket.io para comunicação em tempo real.

A documentação é dividida em seis etapas:

1. Clonar o projeto deve-se instalar as dependências: 

	Ao clonar o projeto utilizar npm install no cmd para instalar todas as dependências do projeto;

2. Configurar o servidor e criar o banco de dados:

	Utilizando o cmd do mongo.exe utilize a lista de comandos para criar o banco de dados usado na aplicação:
	> show dbs
	> use candice_brasileiro

	Dentro de cmd da pasta "server" utilize o comando nodemon index.js para rodar o servidor;

3. Criar usuários para o chat: 
Existem duas formas de criar usuários para utilizar o chat. A primeira forma é utilizando uma plataforma de teste de API, como o Postman. A segunda forma é utilizando o comando do MongoDB no terminal para inserir diretamente os dados do usuário no banco de dados. Também é fornecido um exemplo de comando para inserir um usuário ou mais de um usuário.

	- Utilizando plataforma de teste, em minha máquina utilizei o Postman:
	
	* através da requisição POST, utilize a rota http://localhost:8181/user
	* em "Body" => raw => selecione JSON, dentro da caixa de texto:
		{"name":"Pedro", "cpf": "30471665010", "password": "12345"}
		{"name":"Laura", "cpf": "53296875000", "password": "12345"}
		{"name":"Ana", "cpf": "31572658061", "password": "12345"}
	A cada usuário criado com sucesso, você irá visualizar status 201 com a seguinte mensagem:
{
"sucess": true,
    "message": "Novo usuário criado",
    "Cause": {
"name": "Pedro",
        "cpf": "30471665010",
        "password": "$2a$10$pGTLejhzZdWt1RqaPVdXU.6aXuvjmsdQp2NRs4O.5GQV9KDPrm.kK",
        "online": false,
        "_id": "64774302a4caf8d97ac9e1b8",
        "__v": 0
}
}
*informações do usuário criado com senha criptografada, o usuário contem um id único criado pelo próprio banco de dados e o status online como falso, esse só será alterado quando o usuário fizer login no chat. Para criação de todos usuários no Postman você receberá mensagem com status e com as informações referentes ao usuário criado.*

 	- Utilizando o cmd do mongo.exe utilize a lista de comandos:
	> show dbs
	> use candice_brasileiro
	> show collections
	db.users.insertOne({name:"Pedro", cpf: "30471665010", password:"12345"})
	A cada usuário criado com sucesso você receberá mensagem do mongo confirmando a inserção.
{
        "acknowledged" : true,
        "insertedId" : ObjectId("64774534a2d6c14f80e158d3")
}
	Também é possível instalar todos os usuários de uma vez utilizando o comando inserMany:

	db.users.insertMany([{name:"Pedro", cpf: "30471665010", password:"12345"}, {name:"Laura", cpf: "53296875000", password:"12345"}, {name:"Ana", cpf: "31572658061", password:"12345"},])

4. Executar o front-end:

	Após a criação de usuários acesse a pasta client, abra o cmd e utilize o comando npm run dev, abrirá a seguinte mensagem:

> projeto@0.0.0 dev
> vite


  VITE v4.3.8  ready in 7810 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help

5. Acessar o chat: 

	Copie o link que aparece em Local e abra em seu navegador favorito, sugiro que o mesmo link abra em duas abas. Faça login utilizando os cpfs e as senhas registradas anteriormente para ativar o login, ao longo do envio de mensagem entre os dois usuários as mensagens serão trocadas instataneamente.

6. Observações adicionais:

	Só é possível acessar o chat com usuários cadastrados e cpf válido, ao sair da tela do chat deve-se primeiro clicar no botão de logout no canto esquerdo da tela deixar o usuário offline.	
	O projeto possui outras rotas que serão listadas abaixo, essas mesmas rotas serão encontradas na pasta server -> router -> Router.js: 

router.get('/users', getUsers); // listar usuários
router.post('/user', createUser); // criar usuários
router.put('/users/:userId', updateUser); // editar usuários
router.delete('/user/:userId', deleteUser); // deletar
router.put('/login', authUser); // login
router.get('/users/online', onlineUsers); // lista de usuários online
router.put('/logout/:userId', logout); // fazer logout
