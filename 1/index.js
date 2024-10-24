#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
	.command('current', 'Вывести текущую дату и время в формате ISO', yargs => {
		yargs
			.option('year', {
				alias: 'y',
				type: 'boolean',
				description: 'Вывести текущий год',
			})
			.option('month', {
				alias: 'm',
				type: 'boolean',
				description: 'Вывести текущий месяц',
			})
			.option('date', {
				alias: 'd',
				type: 'boolean',
				description: 'Вывести текущую дату в календарном месяце',
			});
	})
	.command('add', 'Получение даты в будущем', yargs => {
		yargs
			.option('year', {
				alias: 'y',
				type: 'number',
				description: 'Количество лет вперёд',
			})
			.option('month', {
				alias: 'm',
				type: 'number',
				description: 'Количество месяцев вперёд',
			})
			.option('date', {
				alias: 'd',
				type: 'number',
				description: 'Количество дней вперёд',
			})
			.check(argv => {
				if (!argv.year && !argv.month && !argv.date) {
					throw new Error('Необходимо указать хотя бы одну опцию');
				}
				return true;
			});
	})
	.command('sub', 'Получение даты в прошлом', yargs => {
		yargs
			.option('year', {
				alias: 'y',
				type: 'number',
				description: 'Количество лет назад',
			})
			.option('month', {
				alias: 'm',
				type: 'number',
				description: 'Количество месяцев назад',
			})
			.option('date', {
				alias: 'd',
				type: 'number',
				description: 'Количество дней назад',
			})
			.check(argv => {
				if (!argv.year && !argv.month && !argv.date) {
					throw new Error('Необходимо указать хотя бы одну опцию');
				}
				return true;
			});
	})
	.help().argv;

const getTimeEnding = (number, unitTypes) => {
	const units = {
		y: ['год', 'года', 'лет'],
		m: ['месяц', 'месяца', 'месяцев'],
		d: ['день', 'дня', 'дней'],
	};
	const unit = units[unitTypes];
	const num = number % 100;

	if (num === 1 && number !== 11) return unit[0];
	if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num))
		return unit[1];
	return unit[2];
};

const currentCommand = () => {
	const now = new Date();
	const isoDate = now.toISOString();

	if (!argv.year && !argv.month && !argv.date) {
		console.log('Текущая дата и время в формате ISO:', isoDate);
	} else {
		if (argv.year) console.log('Текущий год:', now.getFullYear());
		if (argv.month) console.log('Текущий месяц:', now.getMonth() + 1);
		if (argv.date) console.log('Текущая дата:', now.getDate());
	}
};

const timeTravelCommands = command => {
	const now = new Date();
	const sign = command === 'add' ? 1 : -1;

	if (argv.year) now.setFullYear(now.getFullYear() + sign * argv.year);
	if (argv.month) now.setMonth(now.getMonth() + sign * argv.month);
	if (argv.date) now.setDate(now.getDate() + sign * argv.date);

	const isoDate = now.toISOString();
	const yearEnding = argv.year ? getTimeEnding(argv.year, 'y') : '';
	const monthEnding = argv.month ? getTimeEnding(argv.month, 'm') : '';
	const dayEnding = argv.date ? getTimeEnding(argv.date, 'd') : '';

	const timePhrase = [
		yearEnding ? `${argv.year} ${yearEnding}` : '',
		monthEnding ? `${argv.month} ${monthEnding}` : '',
		dayEnding ? `${argv.date} ${dayEnding}` : '',
	]
		.filter(Boolean)
		.join(' ');

	console.log(
		`Дата ${command === 'add' ? 'через' : ''} ${timePhrase} ${
			command === 'sub' ? 'назад' : ''
		}:`,
		isoDate
	);
};

if (argv._.includes('current')) currentCommand();
else if (argv._.includes('add')) timeTravelCommands('add');
else if (argv._.includes('sub')) timeTravelCommands('sub');
