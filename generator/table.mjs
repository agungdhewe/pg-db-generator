import fs from 'fs'
import path from 'path'
import chalk from 'chalk';
import { DateTime } from "luxon";
import * as field from './field.mjs'
import * as relation from './relation.mjs'

export const allowed = ['filename', 'schema', 'name', 'descr', 'fields', 'primarykeys', 'uniques', 'relations']

export async function generate(source, target) {
	console.log(`read data from ${source}`)

	var datetimeUTC = DateTime.utc();
	var datetimeLocal = datetimeUTC.toLocal();
	var gendate = datetimeLocal.toISO()

	var sqlfiles = []
	var files = fs.readdirSync(source)

	try {
		var relations = {}
		for (var filename of files) {
			if (filename.endsWith('.json')) {
				console.log(`read file ${filename}`)
				var tablefilepath = path.join(source, filename) 
				var stats = fs.statSync(tablefilepath);
				
				let table = JSON.parse(fs.readFileSync(tablefilepath, 'utf8'));
				table.filename = filename
				
				var ddlfilename = `${path.parse(filename).name}.sql`  
				var ddlfilepath = path.join(target, ddlfilename)
				var file = fs.createWriteStream(ddlfilepath)
				file.name = ddlfilename
	
				file.write(`-- ${file.name}\n`)
				file.write(`-- created: ${stats.ctime}\n`)
				file.write(`-- last modified: ${stats.mtime}\n`)
				file.write(`-- generated at: ${gendate}\n`)
				await create(table, file)
	
				relations[`${table.schema}.${table.name}`] = table.relations
				sqlfiles.push(ddlfilepath)
			}
		}


		var ddlfilename = 'relations.sql'  
		var ddlfilepath = path.join(target, ddlfilename)
		var file = fs.createWriteStream(ddlfilepath)
		file.name = ddlfilename
		file.write(`-- ${file.name}\n`)
		relation.generate(relations, file)
		sqlfiles.push(ddlfilepath)
		return sqlfiles
	} catch (err) {
		throw err
	}
}


async function create(table, file) {
	try {
		// cek property in table
		for (var prop in table) {
			if (!allowed.includes(prop)) {
				console.trace(`checking property of ${chalk.redBright(table.filename)}`)
				throw `property named '${chalk.redBright(prop)}' in file '${chalk.redBright(table.filename)}' is not allowed`
			}
		}

		// add mandatory fields
		table.fields['createby'] = {type:'varchar', length:64}
		table.fields['createdate'] = {type:'timestamp', nullable:false, default:'now()'}
		table.fields['modifyby'] = {type:'varchar', length:64}
		table.fields['modifydate'] = {type:'timestamp'}


		// get primary keys
		var fielddefs = []
		for (var fieldname of table.primarykeys) {
			table.fields[fieldname].filename = table.filename
			table.fields[fieldname].name = fieldname
			table.fields[fieldname].isprimarykey = true
			var fdef = field.create(table.fields[fieldname])
			fielddefs.push(fdef)
		}

		file.write(`create table if not exists ${table.schema}.${table.name} (\n`)
		for (var fdef of fielddefs) {
			file.write(`\t${fdef},\n`)
		}
		file.write(`\tprimary key(${table.primarykeys.join(',')})\n`)
		file.write(`);\n`)

		if (table.descr !== undefined) {
			file.write(`comment on table ${table.schema}.${table.name} is '${table.descr}';\n`)
		}
		
		var addcolumns = []
		var modifycolumns = []
		for (var fieldname in table.fields) {
			if (table.primarykeys.includes(fieldname)) {
				continue
			}

			table.fields[fieldname].filename = table.filename
			table.fields[fieldname].name = fieldname
			
			var fdefadd = field.add(table.fields[fieldname])
			var fdefmodify = field.modify(table.fields[fieldname])

			addcolumns.push(fdefadd)
			modifycolumns.push(fdefmodify)
		}


		file.write(`\n`)
		file.write(`-- add columns\n`)
		file.write(`alter table ${table.schema}.${table.name}\n`)
		file.write(addcolumns.join(',\n'))
		file.write(`\n;\n`)

		file.write(`\n`)
		file.write(`-- modify columns\n`)
		file.write(`alter table ${table.schema}.${table.name}\n`)
		file.write(modifycolumns.join(',\n'))
		file.write(`\n;\n`)
		file.write(`\n`)

		// create constraints
		for (var constraint in table.uniques) {
			var fields = table.uniques[constraint]
			var fieldname = fields.join('_')


			var sql = [
				`alter table ${table.schema}.${table.name} drop constraint if exists ${constraint};`,
				`alter table ${table.schema}.${table.name} add constraint ${constraint} unique (${fieldname});`
			]
			file.write(sql.join('\n'))
			file.write(`\n`)
		}

	} catch (err) {
		throw err
	}

}


