$(function() {
	'use strict';

	var margin = {
		top: 20,
		right: 50,
		bottom: 30,
		left: 50
	};
	var width = innerWidth - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	//var parseDate = d3.time.format('%d-%b-%y').parse;
	var parseDate = d3.time.format('%Y%m%d-%H%M%S').parse;
	var formatDate = d3.time.format('%Y年%m月%d日');
	var formatTime = d3.time.format('%H時%M分');

	var tooltipShow = function(d) {
		$('#tooltip').fadeIn();
		$('#noid').text('ID: ' + d.id);
		$('#date').text(formatDate(d.date));
		$('#time').text(formatTime(d.date));
		$('#temp').text(d.temp);
		$('#humid').text(d.humid);
		$('#remove').attr('href', '/remove/' + d.id);
	};

	var tooltipHide = function(d) {
		setTimeout(function() {
			$('#tooltip').fadeOut();
		}, 5000);
	};

	var preferItem = function(d) {
		d.date = new Date(d.created_at);
		d.temp = +Number(d.temp);
		d.humid = +Number(d.hum);
	};

	//グラフの描画メソッド
	var draw = function() {
		var x = d3.time.scale().range([0, width]);

		var y = d3.scale.linear().range([height, 0]);

		var y0 = d3.scale.linear().range([height, 0]);

		var y1 = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')
			.ticks(d3.time.months, 1)
			.tickFormat(d3.time.format('%m/%d %H:%I'))
			// .tickFormat(d3.time.format('%b'))
			.ticks(10);
			// .ticks(15)
			// .tickFormat(d3.time.format('%Y/%m/%d'));

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left');

		var yAxisLeft = d3.svg.axis().scale(y0) 
			.orient('left').ticks(5)
			.tickFormat(function(d){return d + '℃';});

		var yAxisRight = d3.svg.axis().scale(y1)
			.orient('right').ticks(5)
			.tickFormat(function(d){return d + '％';});

		var line0 = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y0(d.temp); });

		var line1 = d3.svg.line()
			.x(function(d) { return x(d.date); })
			.y(function(d) { return y1(d.humid); });


		var svg = d3.select('body').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		$.ajax({
			url: '/all',
			dataType: 'json',
			success: function(data) {
				data.forEach(preferItem);

				x.domain(d3.extent(data, function(d) { return d.date; })).nice();
				y0.domain([
					d3.min(data, function(d) {
						return Math.min(d.temp);
					}),
					d3.max(data, function(d) {
						return Math.max(d.temp);
					})
				]).nice(); 
				y1.domain([
					d3.min(data, function(d) {
						return Math.min(d.humid);
					}),
					d3.max(data, function(d) {
						return Math.max(d.humid);
					})
				]).nice();

				svg.append('g')
					.attr('class', 'x axis')
					.attr('transform', 'translate(0,' + height + ')')
					.attr('fill','rgba(0, 0, 0, 0.85)')
					.call(xAxis)
					.append('text')
					.attr('transform', 'translate(-35, 20)')
					.text('Date');

				//左y軸（温度）
				svg.append('g')
					.attr('class', 'y axis')
					.attr('fill','rgba(220, 50, 50, 0.8)')
					.call(yAxis)
					.call(yAxisLeft)
				.append('text')
					.attr('transform', 'translate(50, -20) rotate(0)')
					.attr('y', 6)
					.attr('dy', '.5em')
					.attr('fill','rgba(220, 50, 50, 0.8)')
					.style('text-anchor', 'end')
					.text('温度 (℃)');

				//右y軸（湿度）
				svg.append('g')
					.attr('class', 'y axis')
					.attr('transform', 'translate(' + (width - 18) + ' ,0)')
					.attr('fill','rgba(50, 50, 200, 0.8)')
					.call(yAxis)
					.call(yAxisRight)

				.append('text')
					.attr('transform', 'translate(0, -20) rotate(0)')
					.attr('y', 6)
					.attr('dy', '.5em')
					.attr('fill','rgba(50, 50, 200, 0.8)')
					.style('text-anchor', 'end')
					.text('湿度 (％)');

				//グラフ温度
				svg.append('path')
					.datum(data)
					.attr('class', 'line0')
					.attr('d', line0)
					.attr('opacity','0')
					.transition()
					.duration(300)
					.attr('opacity','1.0');

				//グラフ湿度
				svg.append('path')
					.datum(data)
					.attr('class', 'line1')
					.attr('d', line1)
					.attr('opacity','0')
					.transition()
					.delay(300)
					.duration(300)
					.attr('opacity','1.0');

				//横方向と縦方向のグリッド間隔を自動生成
				var rangeX = d3.range(0, width - 18, 20);
				var rangeY = d3.range(0, height, 20);

				// 縦方向のグリッドを生成
				svg.selectAll('line.y')
					.data(rangeY)
					.enter()
					.append('line')
						.attr('x1', 0).attr('y1', function(d,i){return d; })
						.attr('x2', width-18).attr('y2', function(d,i){return d ;});

				// 横方向のグリッドを生成
				svg.selectAll('line.x')
					.data(rangeX)
					.enter()
					.append('line')
						.attr('x1', function(d,i){return d;}).attr('y1', 0)
						.attr('x2', function(d,i){return d;}).attr('y2', height);

				// グリッドを描画
				svg.selectAll('line')
					.attr('stroke', 'rgba(0, 0, 0, 0.2)')
					.attr('shape-rendering', 'crispEdges');


				svg.selectAll('circle.t')
					.data(data)
					.enter()
					.append('circle')
						.attr('cx', function(d, i) { return x(d.date); })
						.attr('cy', function(d, i) { return y0(d.temp); })
						.attr('r', 0)
						.attr('class', 'circle0')
						.style('fill','rgba(235, 30, 30, 0.8)')
						.on('mouseenter', tooltipShow)
						.on('mouseout', tooltipHide)
						.transition()
						.duration(1000)
						.attr('r', 6);

				svg.selectAll('circle.h')
					.data(data)
					.enter()
					.append('circle')
						.attr('cx', function(d, i) { return x(d.date); })
						.attr('cy', function(d, i) { return y1(d.humid); })
						.attr('r', 0)
						.attr('class', 'circle1')
						.style('fill','rgba(30, 30, 235, 0.8)')
						.on('mouseenter', tooltipShow)
						.on('mouseout', tooltipHide)
						.transition()
						.delay(500)
						.duration(1000)
						.attr('r', 6);
			}
			});
	};

	draw();
});
