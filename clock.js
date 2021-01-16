var antialiasing = 2;
var secPerDay = 24 * 60 * 60;
function dayStateCreator(modulo) {
	return function(seconds) {
		return (seconds % modulo) / modulo;
	};
}
var timeConfig = [
	{
		// Seconds
		'func': dayStateCreator(60),
	}, {
		// Minutes
		'func': dayStateCreator(60 * 60),
	}, {
		// Hours
		'func': dayStateCreator(secPerDay),
	}, {
		// Day per Month
		'func': function() {
			var now = new Date();
			var year = now.getYear() + 1900;
			var month = now.getMonth();
			var daysPerMonth = new Date(year, month + 1, 0).getDate();
			var secPerMonth = secPerDay * daysPerMonth;
			return (now - new Date(year, month, 1)) / 1000 / secPerMonth;
		},
	}, {
		// Month per Year
		'func': function() {
			var now = new Date();
			var year = now.getYear() + 1900;
			var firstJan = new Date(year, 0, 1);
			var msPerYear = new Date(year + 1, 0, 1) - firstJan;
			return (now - firstJan) / msPerYear;
		},
	}
];

function circleColor(state) {
	var total = 260;
	var start = 230;
	var pos = state * total + start;
	var hue = pos.toString(10);
	return ["hsl(", hue, ", 60%, 60%)"].join("");
}
function drawCircle(ctx, fill) {
}

function Clock() {
	var me = this;
	var elem = document.getElementById("canvas-clock");
	var ctx = elem.getContext("2d");
	var width = undefined;
	var height = undefined;

	function updateSize() {
		width = elem.clientWidth * antialiasing;
		height = elem.clientHeight * antialiasing;
		elem.width = width;
		elem.height = height;
	}

	me.draw = function () {
		updateSize();
		var xCenter = Math.round(width / 2);
		var yCenter = Math.round(height / 2);
		var seconds = Date.now() / 1000;
		var lineWidth = 80;
		var outerRadius = Math.round(
			Math.min(width, height) / 2 - 1.5 * lineWidth);
		var elementsDone = 0

		timeConfig.forEach(function(config) {
			var state = config['func'](seconds);
			ctx.beginPath();
			ctx.lineWidth = lineWidth;
			var startAngle = Math.PI * 1.5;
			var endAngle = startAngle + Math.PI * 2 * state;
			var radius = outerRadius - lineWidth * elementsDone * 1.3;
			ctx.arc(xCenter, yCenter, radius, startAngle, endAngle, false);
			ctx.strokeStyle = circleColor(state);
			ctx.stroke();
			elementsDone = elementsDone + 1;
		});
	};

	return me;
}
function main() {
	var clock = new Clock();
	function loop() {
		clock.draw();
		window.requestAnimationFrame(loop);
	}
	loop();
}
window.addEventListener('load', main);
