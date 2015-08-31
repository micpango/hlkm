module.exports = {
	calculateRoadTime: function (data) {
		data.riders.filter(function (rider) {
			return rider.road;
		}).forEach(function (rider) {
			rider.roadTime = data.road[rider.road]
		});
	}
}