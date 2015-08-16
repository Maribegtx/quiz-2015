var models = require('../models/models.js');

var statistics = [];

var errors = [];
var valorAux = 0;

exports.calculate = function (req, res, next) {

	models.Quiz.count()
		.then(function (numQuizes) { // número de preguntas
			statistics[0] = {
				texto: 'Preguntas', 
				valor: numQuizes, 
				comentario: []
				};
			return models.Comment.count();
		})
		.then(function (numComments) { // número de comentarios
			statistics[1] = {
				texto: 'Comentarios totales', 
				valor: numComments, 
				comentario: []
				};
			return models.Comment.countUnpublished();
		})
		.then(function (numUnpublished) { // número de comentarios sin publicar
			if (statistics[1].valor){
				valorAux = (numUnpublished * 100 / statistics[1].valor).toFixed(2);
			} else {
				valorAux = 100;
			}
			statistics[2] = {
				texto: 'Comentarios no publicados', 
				valor: numUnpublished, 
				comentario: ' (' + valorAux + '%)'
				};
			return models.Comment.countCommentedQuizes();
		})
		.then(function (numCommented) { // número de preguntas con comentario
			if (statistics[0].valor){
				valorAux = (statistics[1].valor / statistics[0].valor).toFixed(2);
			} else {
				valorAux = 0;
			}
			statistics[3] = {
				texto: 'Media de comentarios por pregunta', 
				valor: valorAux,
				comentario: []
				};
			statistics[4] = {
				texto: 'Preguntas sin comentarios', 
				valor: (statistics[0].valor - numCommented),
				comentario: []
				};
			statistics[5] = {
				texto: 'Preguntas con comentarios', 
				valor: numCommented,
				comentario: []
				};
		})
		.catch(function (err) { errors.push(err); })
		.finally(function () {
			next();
		});
};

// GET /quizes/statistics
exports.show = function (req, res) {
  res.render('quizes/statistics', { statistics: statistics, errors: errors });
};