'use strict';

var barman = require('barman'),
	Class = barman.Class;

var RegularTimeIntervalUnit = Class.create({
	constructor: function (regex, cronPattern) {
		this._regex = regex;
		this._cronPattern = cronPattern;
	},

	toCronExpressionWithValue: function (value) {
		return this._cronPattern.replace(/X/g, value + '');
	},

	parseCronExpression: function (str) {
		var parsed = str.match(this._regex);
		return (parsed) ? parseInt(parsed[1], 10) : null;
	}
});

var RegularTimeInterval = Class.create({

	constructor: function (value, unit) {
		if (value <= 0) {
			throw new RangeError('The interval length must be greater than zero');
		}
		this._value = value;
		this._unit = (typeof unit === 'string') ? RegularTimeInterval.unitNamed(unit) : unit;
	},

	value: function () {
		return this._value;
	},

	unit: function () {
		return this._unit;
	},

	toCronExpression: function () {
		return this.unit().toCronExpressionWithValue(this.value());
	}

}, {

	fromCronExpression: function (str) {
		var unit, value;
		for (var unitName in RegularTimeInterval.units) {
			unit = RegularTimeInterval.units[unitName];
			value = unit.parseCronExpression(str);
			if (value) {
				return new RegularTimeInterval(value, unit);
			}
		}

		throw new RangeError('Unsupported cron expression');
	},

	unitNamed: function unitNamed(str) {
		return RegularTimeInterval.units[str.toLowerCase()];
	},

	units: {
		seconds: new RegularTimeIntervalUnit(/0\/([1-5][0-9]|[1-9]) \* \* \* \* \? \*/, '0/X * * * * ? *'),
		minutes: new RegularTimeIntervalUnit(/0 0\/([1-5][0-9]|[1-9]) \* \* \* \? \*/, '0 0/X * * * ? *'),
		hours: new RegularTimeIntervalUnit(/0 0 0\/([1-5][0-9]|[1-9]) \* \* \? \*/, '0 0 0/X * * ? *'),
		days: new RegularTimeIntervalUnit(/0 0 0 1\/([1-5][0-9]|[1-9]) \* \? \*/, '0 0 0 1/X * ? *'),
	}
});

module.exports = RegularTimeInterval;