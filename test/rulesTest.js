var assert = require('referee').assert;
var refute = require('referee').refute;

var service = require('../src/rules.js');

describe('Rules', function () {

	describe('tempo', function () {
			
		it('lists rider by finishing time', function (done) {
			service.calculateTempo(data.tempo).done(function (result) {
				assert.equals(result.tempo.riders.length, 5);
				assert.equals(result.tempo.riders[0].name, 'rider2');
				assert.equals(result.tempo.riders[1].name, 'rider4');
				assert.equals(result.tempo.riders[2].name, 'rider5');
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
				assert.equals(result.gc.riders[0].time, '00:35:49');
				assert.equals(result.gc.riders[1].time, '00:36:09');
				assert.equals(result.gc.riders[2].time, '00:37:09');
				assert.equals(result.gc.riders[3].time, '00:37:34');
				done();	
			});
		});
	});

	/*describe('road', function () {

		it('riders get time of finishing group', function () {
			service.calculateRoadTime(roadData);
			assert.equals(roadData.riders.filter(function (rider) {
				return rider.roadTime;
			}).length, 5);
			assert.equals(roadData.riders.filter(function (result) {
				return result.name === 'rider1';
			})[0].roadTime, "01:36:12");
			assert.equals(roadData.riders.filter(function (result) {
				return result.name === 'rider2';
			})[0].roadTime, "01:32:00");
			assert.equals(roadData.riders.filter(function (result) {
				return result.name === 'rider3';
			})[0].roadTime, "01:30:40");
		});
	});*/
});

var data = {
	"tempo": {
		"completed": true,
		"riders": [
			{
				"name": "rider1",
				"tempo": "00:38:19"
			},
			{
				"name": "rider2",
				"tempo": "00:36:19"
			},
			{
				"name": "rider3",
				"tempo": "00:37:34"
			},
			{
				"name": "rider4",
				"tempo": "00:36:29"
			},
			{
				"name": "rider5",
				"tempo": "00:37:19"
			},
			{
				"name": "rider6"
			}
		]
	}
}

/*var roadData = {
	road: {
		"B": "01:30:40",
		"P": "01:32:00",
		"G": "01:36:12"
	},
	riders: [
		{
			"name": "rider1",
			"road": "G"
		},
		{
			"name": "rider2",
			"road": "P"
		},
		{
			"name": "rider3",
			"road": "B"
		},
		{
			"name": "rider4",
			"road": "B"
		},
		{
			"name": "rider5",
			"road": "P"
		},
		{
			"name": "rider6"
		}
	]
};*/