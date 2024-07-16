import chalk from 'chalk';

export const allowed = ['filename', 'name', 'type', 'descr', 'length', 'precision', 'nullable', 'default', 'isprimarykey']


export function create(field) {
	try {
		checkFieldProperties(field)

		var fieldtype = getFieldType(field)
		var setnull = getFieldSetNull(field)
		var setdefault = getFieldSetDefault(field)

		var fielddef = `${field.name} ${fieldtype} ${setnull} ${setdefault}`
		return fielddef
	} catch (err) {
		throw err
	}
}	


export function add(field) {
	try {
		checkFieldProperties(field)

		var fieldtype = getFieldType(field)
		var setnull = getFieldSetNull(field)
		var setdefault = getFieldSetDefault(field)

		var fielddef = `\tadd column if not exists ${field.name} ${fieldtype} ${setnull} ${setdefault}`
		return fielddef
	} catch (err) {
		throw err
	}
}

export function modify(field) {
	var fieldtype = getFieldType(field)
	var setnull = getFieldSetNull(field)
	var setdefault = getFieldSetDefault(field)

	if (setdefault=='') {
		setdefault = 'drop default'
	} else {
		setdefault = `set ${setdefault}`
	}

	if (setnull=='') {
		setnull = 'drop not null'
	} else {
		setnull = `set not null`
	}

	var defs = [
		`\talter column ${field.name} type ${fieldtype}`,
		`\talter column ${field.name} ${setnull}`,
		`\talter column ${field.name} ${setdefault}`
	]

	var fielddef = defs.join(',\n')
	return fielddef
}


function getFieldType(field) {
	var fieldtype
	if (field.precision>0) {
		fieldtype = `${field.type}(${field.length},${field.precision})`
	} else if (field.length>0) {
		fieldtype = `${field.type}(${field.length})`
	} else {	
		fieldtype = field.type
	}
	return fieldtype
}

function getFieldSetNull(field) {
	var setnull
	if (field.nullable===undefined) {
		setnull = ''
	} else if (field.nullable==true) {
		setnull = ''
	} else {
		setnull = 'not null'
	}
	return setnull
}

function getFieldSetDefault(field) {
	var setdefault
	if (field.default) {
		if (field.type==='varchar') {
			setdefault = `default '${field.default}'`
		} else {
			setdefault = `default ${field.default}`
		}
	} else {
		setdefault = ''
	}
	return setdefault
}

function checkFieldProperties(field) {
	try {
		for (var prop in field) {
			if (!allowed.includes(prop)) {
				console.trace(`checking property of ${chalk.redBright(field.filename)}`)
				throw `property named '${chalk.redBright(prop)}' in 'fields' in file '${chalk.redBright(field.filename)}' is not allowed`
			}
		}
	} catch (err) {
		throw err
	}
}