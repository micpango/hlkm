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

function roadBonus(position) {
	if (position === 0) {
		return '00:00:20';
	} else if (position === 1) {
		return '00:00:15';
	} else if (position === 2) {
		return '00:00:10';
	} else {
		return '00:00:00';
	}
}

function sprintBonus(position) {
	if (position === 1) {
		return '00:00:15';
	} else if (position === 2) {
		return '00:00:10';
	} else if (position === 3) {
		return '00:00:05';
	} else {
		return '00:00:00';
	}
}

module.exports = {
	calculateTempo: function (data) {
		var result = _.cloneDeep(data);
		result.tempo = { completed: data.tempo.completed };
		if (result.tempo.completed) {
			result.tempo.riders = data.tempo.riders.filter(function (rider) {
				return rider.time;
			}).sort(function (rider1, rider2) {
				return moment.duration(rider1.time) - moment.duration(rider2.time);
			}).map(function (rider, index, riders) {
				rider.position = index + 1;
				if (index < 3) {
					rider.bonus = tempoBonus(index)
				}
				rider.diff = (moment.duration(rider.time)).subtract(moment.duration(riders[0].time)).format('hh:mm:ss', { trim: false });
				return rider;
			});

		}
		return Promise.resolve(result);
	},
	calculateRoad: function (data) {
		var result = _.cloneDeep(data);
		result.road = { completed: data.road.completed };
		if (result.road.completed) {
			result.road.riders = data.road.riders.filter(function (rider) {
				return rider.group;
			}).sort(function (rider1, rider2) {
				return rider1.position - rider2.position || 4;
			}).map(function (rider) {
				rider.time = data.road.groups[rider.group];
				return rider;
			}).sort(function (rider1, rider2) {
				return moment.duration(rider1.time) - moment.duration(rider2.time);		
			}).map(function (rider, index, riders) {
				if (index < 3) {
					rider.bonus = roadBonus(index);
				}
				if (rider.sprintPosition) {
					rider.sprintBonus = sprintBonus(rider.sprintPosition);
				}
				rider.diff = (moment.duration(rider.time)).subtract(moment.duration(riders[0].time)).format('hh:mm:ss', { trim: false });
				return rider;
			});
		}

		return Promise.resolve(result);
	},
	calculateGC: function (result) {
		if (result.tempo.completed) {
			result.gc = {};
			result.gc.riders = result.tempo.riders.map(function (rider, index, riders) {
				return {
					name: rider.name,
					time: (moment.duration(rider.time).subtract(moment.duration(rider.bonus))).format('hh:mm:ss', { trim: false })
				}
			});

			if (result.road.completed) {
				var roadRiders = _.groupBy(result.road.riders, function (rider) {
					return rider.name;
				});
				result.gc.riders = result.gc.riders.filter(function (rider) {
					return roadRiders[rider.name];
				}).map(function (rider) {
					var roadRider = roadRiders[rider.name][0];
					rider.time = (moment.duration(rider.time))
									.add(moment.duration(roadRider.time))
									.subtract(moment.duration(roadRider.sprintBonus))
									.subtract(moment.duration(roadRider.bonus)).format('hh:mm:ss', { trim: false });
					return rider;
				}).sort(function (rider1, rider2) {
					return moment.duration(rider1.time) - moment.duration(rider2.time);
				});
			}

			result.gc.riders = result.gc.riders.map(function (rider, index, riders) {
				rider.position = index + 1;
				rider.diff = (moment.duration(rider.time)).subtract(moment.duration(riders[0].time)).format('hh:mm:ss', { trim: false })
				return rider;	
			});
		}
		return Promise.resolve(result);
	}
}