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
		var result = { tempo: { completed: data.tempo } };
		result.tempo.riders = data.riders.filter(function (rider) {
			return rider.tempo;
		}).sort(function (rider1, rider2) {
			return moment.duration(rider1.tempo) - moment.duration(rider2.tempo);
		});
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
			result.gc.riders = result.tempo.riders.map(function (rider, index) {
				return {
					name: rider.name,
					time: (moment.duration(rider.tempo).subtract(moment.duration(tempoBonus(index)))).format('hh:mm:ss', { trim: false })
				}
			});
		}
		return Promise.resolve(result);
	}
}