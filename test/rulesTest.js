var assert = require('referee').assert;

var service = require('../src/rules.js');

describe('Rules', function () {

	describe('road', function () {

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
	});
});

var roadData = {
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
};