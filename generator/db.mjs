import pg from 'pg'
import fs from 'fs'

const { Pool, Client } = pg

let client
let connected = false

export async function connect(dbconf) {
	client = new Client({
		user: dbconf.user,
		password: dbconf.password,
		host: dbconf.host,
		port: dbconf.port,
		database: dbconf.dbname
	})

	try {
		await client.connect()
		connected = true
		console.log('connected to database.')
	} catch (err) {
		throw err
	}
}


export async function build(files) {
	try {
		for (var filepath of files) {
			console.log(`execute ${filepath}`)
			var buf = fs.readFileSync(filepath)
			var sql = buf.toString()
			await client.query(sql)
		}
	} catch (err) {
		throw err
	}
}

export async function disconnect() {
	if (connected) {
		await client.end()
		console.log('database disconnected.')
		connected = false
	}
}