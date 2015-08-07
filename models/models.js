var path= require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/

var url =process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name= (url[6]||null);
var user= (url[2]||null);
var pwd= (url[3]||null);
var protocol= (url[1]||null);
var dialect= (url[1]||null);
var port= (url[5]||null);
var host= (url[4]||null);
var storage = process.env.DATABASE_STORAGE;


//Cargar modelo ORM
var Sequelize= require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user,pwd,{
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage, // sólo SQLite (.env)
	omitNull: true // sólo postgres

	}
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);


// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// Relación Quiz a Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;      // exportar tabla Quiz
exports.Comment = Comment // y la tabla Comment


//sequelize.sync() crea e inicializa tabla de as en DB
sequelize.sync().then(function(){
	//.then(..) ejecuta el manejador una vez creada la tabla
Quiz.count().then(function(count){
	if(count===0){//La tabla solo se inicializa si está vacía
		Quiz.create({pregunta:'Capital de Italia',
					respuesta:'Roma',
					tema: 'Otro'
				});
		Quiz.create({pregunta:'Un número: Un granjero tiene 17 vacas, todas mueren menos nueve, ¿Cuantas le quedan? ',
					respuesta:'9',
					tema: 'Otro'
				});
		Quiz.create({pregunta:'¿Puede un hombre que vive en México ser enterrado en Estados Unidos?',
					respuesta:'No',
					tema: 'Otro'
				});
		Quiz.create({pregunta:'Pueblo descrito por García Márquez en "1"00 años de soledad".',
					respuesta:'Macondo',
					tema: 'Humanidades'
				});
		Quiz.create({pregunta:'sí o No: Un vigilante nocturno muere de día, ¿Tiene derecho a cobrar una pensión?.',
					respuesta:'No',
					tema: 'Humanidades'
				})
		.then(function(){console.log('Base de datos inicializada')});

	};
});
});

