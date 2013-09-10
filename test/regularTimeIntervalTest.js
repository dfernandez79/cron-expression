'use strict';

var expect = require('chai').expect,
	RegularTimeInterval = require('../lib'),
	seconds = RegularTimeInterval.units.seconds,
	minutes = RegularTimeInterval.units.minutes,
	hours = RegularTimeInterval.units.hours,
	days = RegularTimeInterval.units.days;


describe('Regular time interval', function () {

	it('represents a simple "every" expression (interval + unit)', function () {
		var model = new RegularTimeInterval(2, seconds);
		expect(model.value()).to.equal(2);
		expect(model.unit()).to.equal(seconds);
	});

	it('supports "seconds" as unit name', function () {
		expect(RegularTimeInterval.unitNamed('seconds')).to.equal(seconds);
	});

	it('supports "minutes" as unit name', function () {
		expect(RegularTimeInterval.unitNamed('minutes')).to.equal(minutes);
	});

	it('supports "hours" as unit name', function () {
		expect(RegularTimeInterval.unitNamed('hours')).to.equal(hours);
	});

	it('supports days as unit', function () {
		expect(RegularTimeInterval.unitNamed('days')).to.equal(days);
	});

	it('can be constructed using a unit name', function () {
		var model = new RegularTimeInterval(1, 'hours');
		expect(model.value()).to.equal(1);
		expect(model.unit()).to.equal(hours);
	});

	it('throws an exception when the interval is zero', function () {
		expect(function () {
			return new RegularTimeInterval(0, 'hours');
		}).to.throw(RangeError);
	});

	describe('Cron expression conversion', function () {
		var secondsInterval = new RegularTimeInterval(2, 'seconds'),
			minutesInterval = new RegularTimeInterval(3, 'minutes'),
			hoursInterval = new RegularTimeInterval(4, 'hours'),
			daysInterval = new RegularTimeInterval(5, 'days');

		describe('Conversion TO cron expression', function () {

			it('can be converted to a cron expression when the unit is seconds', function () {
				expect(secondsInterval.toCronExpression()).to.equal('0/2 * * * * ? *');
			});

			it('can be converted when the unit is minutes', function () {
				expect(minutesInterval.toCronExpression()).to.equal('0 0/3 * * * ? *');
			});

			it('can be converted when the unit is hours', function () {
				expect(hoursInterval.toCronExpression()).to.equal('0 0 0/4 * * ? *');
			});

			it('can be converted when the unit is days', function () {
				expect(daysInterval.toCronExpression()).to.equal('0 0 0 1/5 * ? *');				
			});
		});


		describe('Conversion FROM cron expression', function () {

			it('uses seconds when the cron expression is: 0/2 * * * * ? *', function () {
				var model = RegularTimeInterval.fromCronExpression('0/2 * * * * ? *');
				expect(model.value()).to.equal(2);
				expect(model.unit()).to.equal(seconds);
			});

			it('uses minutes when the cron expression is: 0 0/3 * * * ? *', function () {
				var model = RegularTimeInterval.fromCronExpression('0 0/3 * * * ? *');
				expect(model.value()).to.equal(3);
				expect(model.unit()).to.equal(minutes);
			});
			
			it('uses hours when the cron expression is: 0 0 0/4 * * ? *', function () {
				var model = RegularTimeInterval.fromCronExpression('0 0 0/4 * * ? *');
				expect(model.value()).to.equal(4);
				expect(model.unit()).to.equal(hours);
			});
			
			it('uses days when the cron expression is: 0 0 0 1/5 * ? *', function () {
				var model = RegularTimeInterval.fromCronExpression('0 0 0 1/5 * ? *');
				expect(model.value()).to.equal(5);
				expect(model.unit()).to.equal(days);
			});

			it('throws an exception when the cron expression is unsupported', function () {
				expect(function () {
					RegularTimeInterval.fromCronExpression('1 2 0 1/5 * ? *');
				}).to.throw(RangeError);
			});
		});

	});
});
