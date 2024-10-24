#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const secretNumber = Math.floor(Math.random() * 101);

console.log('Загадано число в диапазоне от 0 до 100');

const lessMore = () => {
	rl.question('', input => {
		const userNumber = Number(input);

		if (!userNumber) {
			console.log('Пожалуйста, введите корректное число.');
			lessMore();
			return;
		}

		if (userNumber < secretNumber) {
			console.log('Больше');
			lessMore();
		} else if (userNumber > secretNumber) {
			console.log('Меньше');
			lessMore();
		} else {
			console.log(`Отгадано число ${secretNumber}`);
			rl.close();
		}
	});
};

lessMore();
