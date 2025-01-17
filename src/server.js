/* global require,process,console*/

/**
 * Usage:
 * 
 * npm install minimist express
 * node app.ja
 */

import dotenv from 'dotenv'
dotenv.config({
  example: '.env'
})

global.test = "hello world";

import minimist from 'minimist'
import express, { urlencoded } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';

const options = minimist(process.argv.slice(2))
const app = express();

import pool from './utils/db.js'
global.db = pool;

import api from "./api/index.js";

// set defaults based on environment (virtual/local/public)
options.port = process.env.PORT || options.port || options.p  || 8080;
options.host = process.env.HOST || options.host || '0.0.0.0';
options.directory = options.directory || options.D || '.';

// show command line options
if(options.help || options.h){
    console.log("\nUsage: node app.js [options]\n");
    console.log("options:");
    console.log(" --help, -h            Show this message.");
    console.log(" --port, -p <number>   Specify port.");
    console.log(" --directory, -D <bundle>  Serve files from specific directory.")
}


app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true}))

app.use("/api", api)

// for docker
//app.use(express.static(__dirname + '/dist')) 

app.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}::${options.port}/`);
});


process.on('uncaughtException', err => {
  pool.end()
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node.js docs)
})

process.on("STOP", function(){
  pool.end()
  console.log("Exiting server");
  app.close();
})

process.on('SIGINT', function() {
  pool.end()
  app.close();
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  process.exit(0);
});