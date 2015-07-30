var models=require('../models/models.js')

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId = ' + quizId)); }
    }
  ).catch(function(error)  { next(error); });
};


// GET /quizes
exports.index=function(req,res){
	models.Quiz.findAll().then(
		function(quizes){
			res.render('quizes/index.ejs', {quizes:quizes, errors:[]});
		}
	).catch(function(error){next(error);})	
};

// GET /quizes/id
exports.show=function(req,res){
	res.render('quizes/show', {quiz:req.quiz, errors:[]});
};

// GET /quizes/:id/answer
exports.answer=function(req,res){
	var resultado='Incorrecto!!';
	
	if (req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto!!';
	}
	res.render('quizes/answer', {quiz:req.quiz, respuesta: resultado, errors:[]});
};

// GET /quizes/new
exports.new=function(req,res){
	var quiz=models.Quiz.build(// Crea objeto Quiz
		{pregunta:"Pregunta", respuesta: "Respuesta", tema: "Tema"}
		);
	res.render('quizes/new', {quiz:quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res){
var quiz = models.Quiz.build( req.body.quiz );

var errors = quiz.validate();//ya qe el objeto errors no tiene then
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};	
res.render('quizes/new', {quiz: quiz, errors: errores});
} else {
quiz // save: guarda en DB campos pregunta, respuesta y tema de quiz
.save({fields: ["pregunta", "respuesta", "tema"]})
.then( function(){ res.redirect('/quizes')}) ;
}
};

// GET /quizes/:id/edit
exports.edit=function(req,res){
	var quiz=req.quiz; //autoload de instancia de quiz
	res.render('quizes/edit',{quiz:quiz, errors:[]});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;
 
  var errors =  req.quiz.validate();
 
  if (errors){
		var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
         for (var prop in errors) errores[i++]={message: errors[prop]}; 
        	res.render('quizes/edit', {quiz: req.quiz, errors: errores});
    } else {
			req.quiz     // save: guarda campos pregunta y respuesta en DB
        	.save( {fields: ["pregunta", "respuesta", "tema"]})
        	.then( function(){ res.redirect('/quizes');});
     }     
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

