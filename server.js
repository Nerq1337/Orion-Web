const express = require("express");
const bomber = require("bomber-api");
const open = require("open");
const colors = require("colors");

const { setTimeout } = require("timers");
const { clear } = require("console");

const app = express();

const jsonParser = express.json();
const port = 3000;

function log(text) {
	console.log("[ORION]: ".rainbow + text.bold);
}

function logerr(text) {
	console.log("[ORION]: ".rainbow + text.bold.red);
}

async function start() {
	try {
		app.use(express.static("./"));

		app.post("/user", jsonParser, function (request, response) {
			validTargetNumber = request.body.target_number.replace(/[-\s()]/g, "");
			validLoops = request.body.loops.replace(/\s+/g, "");

			if (request.body.button == "start") {
				if (/^\+(375|7|380)\d{10}/.test(request.body.target_number) && !isNaN(parseFloat(validLoops))) {
					bomber.attack(validTargetNumber, validLoops);
					log(`Атака на номер ${request.body.target_number} запущена!`);
				} else {
					logerr("Ошибка! Введите корректные данные...");
				}
			} else if (request.body.button == "stop") {
				bomber.stop(validTargetNumber);
				log(`Атака на номер ${request.body.target_number} остановлена!`);
			}

			if (!request.body) return response.sendStatus(400);

			response.json(request.body);
		});

		app.get("/", function (request, response) {
			response.sendFile(__dirname + "/html/index.html");
		});

		clear();

		log("Запуск сервера...");
		setTimeout(() => {
			app.listen(port);
			setTimeout(() => {
				console.log("[ORION]: ".rainbow + `Сервер успешно запущен на порту ${port}!`.bold.green);
				setTimeout(() => {
					log("Запуск браузера...");
					setTimeout(() => {
						open(`http://localhost:${port}/`);
						console.log("[ORION]: ".rainbow + "Успех!".bold.green);
					}, 1500);
				}, 1000);
			}, 1000);
		}, 1000);
	} catch (error) {
		logerr(error);
	}
}

start();
