export async function generate(relations, file) {
	console.log('create relations')
	try {
		for (var tablename in relations) {
			let fields = relations[tablename]
			for (var fieldname in fields) {	
				let rel = fields[fieldname]
				
				let fk = {
					name: rel.name,
					foreign_table: tablename,
					foreign_field: fieldname,
					origin_table: rel.table,
					origin_field: rel.field,
				}
				var sql = create(fk)
				file.write(sql + '\n')
				file.write('\n')
				
			}
		}
	} catch (err) {
		throw err
	}
}


function create(fk) {
	var sql = [
		`alter table ${fk.foreign_table} drop constraint if exists ${fk.name};`,
		`alter table ${fk.foreign_table} add constraint ${fk.name} foreign key (${fk.foreign_field}) references ${fk.origin_table}(${fk.origin_field});`
	]
	return sql.join('\n')
}