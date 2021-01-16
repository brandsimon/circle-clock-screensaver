var antialiasing = 2;
function dayStateCreator(modulo) {
	return function(seconds) {
		return (seconds % modulo) / modulo;
	};
}
var timeConfig = [
	{
		'func': dayStateCreator(60),
	}, {
		'func': dayStateCreator(60 * 60),
	}, {
		'func': dayStateCreator(24 * 60 * 60),
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
		setTimeout(loop, 40);
	}
	loop();
}
window.addEventListener('load', main);
