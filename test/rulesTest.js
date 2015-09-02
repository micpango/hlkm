var assert = require('referee').assert;
var refute = require('referee').refute;
var _ = require('lodash');

var service = require('../src/rules.js');

describe('Rules', function () {

	describe('tempo', function () {
			
		it('returns empty list when tempo is not completed', function (done) {
			data.tempo.completed = false;
			service.calculateTempo(data.tempo).done(function (result) {
				refute(result.tempo.riders);
				done();
			});
		});

		it('lists rider by finishing time', function (done) {
			data.tempo.completed = true;
			service.calculateTempo(data.tempo).done(function (result) {
				assert.equals(result.tempo.riders.length, 5);
				assert.equals(result.tempo.riders[0].name, 'rider2');
				assert.equals(result.tempo.riders[0].position, 1);
				assert.equals(result.tempo.riders[1].name, 'rider4');
				assert.equals(result.tempo.riders[2].name, 'rider5');
				assert.equals(result.tempo.riders[2].position, 3);
				done();
			});
		});

		it('top three gets bonus seconds', function (done) {
			data.tempo.completed = true;
			service.calculateTempo(data.tempo).done(function (result) {
				assert.equals(result.tempo.riders[0].bonus, "00:00:30");
				assert.equals(result.tempo.riders[1].bonus, "00:00:20");
				assert.equals(result.tempo.riders[2].bonus, "00:00:10");
				done();
			});
		});

		it('lists time diff from winner', function (done) {
			data.tempo.completed = true;
			service.calculateTempo(data.tempo).done(function (result) {
				assert.equals(result.tempo.riders[0].diff, "00:00:00");
				assert.equals(result.tempo.riders[1].diff, "00:00:10");
				assert.equals(result.tempo.riders[2].diff, "00:01:00");
				done();
			});
		});

		it('leaves out riders without time', function (done) {
			data.tempo.completed = true;
			service.calculateTempo(data.tempo).done(function (result) {
				refute(_.includes(result.tempo.riders.map(function (rider) { 
					return rider.name; 
				}), 'rider6'));
				done();
			});
		});

		it('only calculate gc after tempo is finished', function (done) {
			data.tempo.completed = false;
			service.calculateTempo(data.tempo).then(service.calculateGC)
			.done(function (result) {
				refute(result.gc);	
				done();
			});
		});

		it('calculates gc time based on top 3 after tempo finished', function (done) {
			data.tempo.completed = true;
			service.calculateTempo(data.tempo).then(service.calculateGC)
			.done(function (result) {
				assert.equals(result.gc.riders[0].name, 'rider2');
				assert.equals(result.gc.riders[0].position, 1);
				assert.equals(result.gc.riders[0].time, '00:35:49');
				assert.equals(result.gc.riders[0].diff, '00:00:00');
				assert.equals(result.gc.riders[1].time, '00:36:09');
				assert.equals(result.gc.riders[1].diff, '00:00:20');
				assert.equals(result.gc.riders[2].time, '00:37:09');
				assert.equals(result.gc.riders[2].position, 3);
				assert.equals(result.gc.riders[3].time, '00:37:34');
				assert.equals(result.gc.riders[3].diff, '00:01:45');
				done();	
			});
		});
	});

	describe('road', function () {

		it('returns empty list when road not completed', function (done) {
			data.road.completed = false;
			service.calculateRoad(data.road).done(function (result) {
				refute(result.road.riders);
				done();
			});
		});

		it('riders get time of finishing group', function (done) {
			data.road.completed = true;

			service.calculateRoad(data.road).done(function (result) {
				assert.equals(result.road.riders.length, 5);
				assert.equals(result.road.riders.filter(function (result) {
					return result.name === 'rider1';
				})[0].time, "01:36:12");
				assert.equals(result.road.riders.filter(function (result) {
					return result.name === 'rider2';
				})[0].time, "01:32:00");
				assert.equals(result.road.riders.filter(function (result) {
					return result.name === 'rider3';
				})[0].time, "01:30:40");
				done();
			});
		});

		it('leaves out riders without time', function (done) {
			data.road.completed = true;
			service.calculateRoad(data.road).done(function (result) {
				refute(_.includes(result.road.riders.map(function (rider) { 
					return rider.name; 
				}), 'rider7'));
				done();
			});
		});

		xit('top three');
		xit('bonus road');
		xit('bonus sprint');
		xit('gc all');
		xit('gc not all')
	});
});

var data = {
	"tempo": {
		"completed": true,
		"riders": [
			{
				"name": "rider1",
				"time": "00:38:19"
			},
			{
				"name": "rider2",
				"time": "00:36:19"
			},
			{
				"name": "rider3",
				"time": "00:37:34"
			},
			{
				"name": "rider4",
				"time": "00:36:29"
			},
			{
				"name": "rider5",
				"time": "00:37:19"
			},
			{
				"name": "rider6"
			}
		]
	},
	"road": {
		"completed": true,
		"groups": {
			"B": "01:30:40",
			"P": "01:32:00",
			"G": "01:36:12"
		},
		"riders": [
			{
				"name": "rider1",
				"group": "G"
			},
			{
				"name": "rider2",
				"group": "P"
			},
			{
				"name": "rider3",
				"group": "B"
			},
			{
				"name": "rider4",
				"group": "B"
			},
			{
				"name": "rider5",
				"group": "P"
			},
			{
				"name": "rider7"
			}
		]

	}
};
