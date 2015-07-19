//Definición del modelo de Quiz
module.exports=function(sequielize, DataTypes){
	return sequielize.define('Quiz',
	{pregunta: DataTypes.STRING,
	respuesta: DataTypes.STRING,
});
}