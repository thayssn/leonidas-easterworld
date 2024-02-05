define(['./Ambiente'],function(ambiente) {

	var object={};

	object.interpretar=function(valor) {
		if (!valor.indexOf)
			return valor;
		var fator=1;
		if (valor.indexOf('gx')!=-1) {
			valor=valor.replace('gx','');
			fator=ambiente.fatorLargura;
		} else
		if (valor.indexOf('gy')!=-1) {
			valor=valor.replace('gy','');
			fator=ambiente.fatorAltura;
		} else {
			return valor;
		}

		return parseFloat(''+valor)*fator;
			
	}

	return object;
});