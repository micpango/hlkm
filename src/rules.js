var _ = require('lodash');
var moment = require('moment');
require("moment-duration-format");
var Promise = require('bluebird');

function tempoBonus(position) {
	if (position === 0) {
		return '00:00:30';
	} else if (position === 1) {
		return '00:00:20';
	} else if (position === 2) {
		return '00:00:10';
	} else {
		return '00:00:00';
	}
}

module.exports = {
	calculateTempo: function (data) {
		var result = { tempo: { completed: data.completed } };
		if (result.tempo.completed) {
			result.tempo.riders = data.riders.filter(function (rider) {
				return rider.tempo;
			}).sort(function (rider1, rider2) {
				return moment.duration(rider1.tempo) - moment.duration(rider2.tempo);
			}).map(function (rider, index) {
				rider.position = index + 1;
				if (index < 3) {
					rider.bonus = tempoBonus(index)
				}
				return rider;
			});

		}
		return Promise.resolve(result);
	},
	/*calculateRoadTime: function (data) {
		data.riders.filter(function (rider) {
			return rider.road;
		}).forEach(function (rider) {
			rider.roadTime = data.road[rider.road]
		});
	},*/
	calculateGC: function (result) {
		if (result.tempo.completed) {
			result.gc = {};
			result.gc.riders = result.tempo.riders.map(function (rider, index, riders) {
				return {
					position: index + 1,
					name: rider.name,
					time: (moment.duration(rider.tempo).subtract(moment.duration(rider.bonus))).format('hh:mm:ss', { trim: false })
				}
			}).map(function (rider, index, riders) {
				rider.diff = (moment.duration(rider.time)).subtract(moment.duration(riders[0].time)).format('hh:mm:ss', { trim: false })
				return rider;
			});
		}
		return Promise.resolve(result);
	}
}