var antialiasing = 2;
var secPerDay = 24 * 60 * 60;
function dayStateCreator(modulo, textMultiplier) {
	return function(now) {
		var seconds = now.getTime() / 1000;
		var result = (seconds % modulo) / modulo;
		var text = Math.floor(result * textMultiplier);
		return {
			'state': result,
			'text': text.toString(),
		};
	};
}
var timeConfig = [
	{
		// Seconds
		'func': dayStateCreator(60, 60),
	}, {
		// Minutes
		'func': dayStateCreator(60 * 60, 60),
	}, {
		// Hours
		'func': dayStateCreator(secPerDay, 24),
	}, {
		// Day per Month
		'func': function(now) {
			var year = now.getYear() + 1900;
			var month = now.getMonth();
			var daysPerMonth = new Date(year, month + 1, 0).getDate();
			var secPerMonth = secPerDay * daysPerMonth;
			var firstJan = new Date(year, month, 1);
			return {
				'state': (now - firstJan) / 1000 / secPerMonth,
				'text': now.getDate(),
			};
		},
	}, {
		// Month per Year
		'func': function(now) {
			var year = now.getYear() + 1900;
			var firstJan = new Date(year, 0, 1);
			var msPerYear = new Date(year + 1, 0, 1) - firstJan;
			return {
				'state': (now - firstJan) / msPerYear,
				'text': now.getMonth() + 1,
			};
		},
	}
];

function circleColor(state) {
	var total = 360;
	var start = 230;
	var pos = state * total + start;
	var hue = pos.toString(10);
	return ["hsl(", hue, ", 100%, 60%)"].join("");
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
		width = Math.max(elem.clientWidth, 536) * antialiasing;
		height = Math.max(elem.clientHeight, 536) * antialiasing;
		elem.width = width;
		elem.height = height;
	}

	me.draw = function () {
		updateSize();
		var xCenter = Math.round(width / 2);
		var yCenter = Math.round(height / 2);
		var now = new Date();
		var lineWidth = 70;
		var outerRadius = Math.round(
			Math.min(width, height) / 2 - 1.5 * lineWidth);
		var elementsDone = 0

		timeConfig.forEach(function(config) {
			var result = config['func'](now);
			var state = result['state'];
			ctx.beginPath();
			ctx.lineWidth = lineWidth;
			var startAngle = Math.PI * 1.5;
			var endAngle = startAngle + Math.PI * 2 * state;
			var radius = outerRadius - lineWidth * elementsDone * 1.15;
			ctx.arc(xCenter, yCenter, radius, startAngle, endAngle, false);
			ctx.strokeStyle = circleColor(state);
			ctx.stroke();

			ctx.fillStyle = 'black';
			ctx.font = 'bold 38px helvetica';
			ctx.textAlign = 'left';
			ctx.fillText(result['text'], xCenter + 10, yCenter - radius + 15);

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
