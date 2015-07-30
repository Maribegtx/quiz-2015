//Definición del modelo de Quiz
module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz', 
	{ pregunta: {
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "-> Falta pregunta."}, notContains: { args: 'Pregunta', msg: "-> Falta pregunta." }}
		},
		
	respuesta: {
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "-> Falta respuesta."}, notContains: { args: 'Respuesta', msg: "-> Falta respuesta." }},
		},
	tema: {
        type: DataTypes.STRING,
        validate: { notContains: { args: 'eltema', msg: "-> Debes seleccionar tema." } }
      }
	});
}