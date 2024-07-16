import fs from 'fs'
import path from 'path'
import chalk from 'chalk';
import { getCliArguments } from './args.mjs'
import * as db from './db.mjs'
import * as table from './table.mjs'

;(async () => {
	console.log('Generate Table')
	var args = getCliArguments()
	var cwd = process.cwd()
	var confpath = path.join(cwd, args.conf)
	var confpath = path.join(cwd, args.conf)
	var cfg = JSON.parse(fs.readFileSync(confpath, 'utf8'));
	var dbconf = cfg.database;

	var tablepath = path.join(cwd, cfg.directories.source)
	var ddlpath = path.join(cwd, cfg.directories.target)
	
	var sqlfiles = []
	try {
		await db.connect(dbconf)
		sqlfiles = await table.generate(tablepath, ddlpath)
		await db.build(sqlfiles)
		console.log(chalk.green("DONE."))
	} catch (err) {
		console.log(chalk.red("ERROR"))
		console.error(err)
	} finally {
		await db.disconnect()
	}
})();