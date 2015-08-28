var stackedColumnChart = {
	vars:{
		label:[],
		data:[],
		w:null,
		h:null,
		m:{},
		contain:null,
		yaxisLabel:null,
		tickFormat:null,
		ticks:null,
		path:null,
		color:null,
		padding:null,
		sort:false
	},
	getAttr: function(p, path, contain, w, h, m, color, sort, label, tF, tick, pad){
		p.w = w// - m[1] - m[3];
		p.h = h// - m[0] - m[2];
		p.m = {
			top:m[0],
			right:m[1],
			bottom:m[2],
			left:m[3]
		};
		p.path = path;
		p.contain = contain;
		p.yaxisLabel = label;
		p.tickFormat = tF;
		p.ticks = tick;
		p.color = color;
		p.padding = pad;
		p.sort = sort;
		stackedColumnChart.drawChart(stackedColumnChart.vars);
	},
	drawChart: function(p){

		/* SCALE
		==========================*/
		var xScale = d3.scale.ordinal().rangeRoundBands([0, p.w - 30], p.padding);
		var yScale = d3.scale.linear().rangeRound([p.h, 0]);

		/* COLOR
		==========================*/
		var color = d3.scale.ordinal().range(p.color);

		/* AXES
		==========================*/
		var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
		var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(p.tick).tickFormat(d3.format(p.tickFormat));

		/* CHART
		==========================*/
		var chart = d3.select('#stacked-chart').append('svg').attr('width', p.w).attr('height', p.h)
					.append('g').attr('transform', 'translate('+ p.m.left +','+ p.m.top + ')');

		/* DATA AND DRAW
		===============================================================================*/
		d3.csv(p.path + '.csv', function(error, data){
			if (error) throw error;

			color.domain(d3.keys(data[0]).filter(function(key){ return key !== 'xlabel'}));
			
			/* MAPS Y POS FOR SEGMENTS
			====================================*/
			data.forEach(function(d){
				var y0 = 0;
				d.seg = color.domain().map(function(name){ return {name:name, y0:y0, y1: y0 += +d[name]}; })
				d.seg.forEach(function(d) {d.y0 /= y0; d.y1 /= y0;});
			})

			/* SORT
			====================================*/
			if (p.sort == true){data.sort(function(a,b) {return b.seg[0].y1 - a.seg[0].y1;})}

			/* MAP X COLUMNS
			====================================*/
			xScale.domain(data.map(function(d){ return d.xlabel;}));

			/* DRAW AXES
			====================================*/
			chart.append('g').attr('class', 'xaxis').attr('transform', 'translate(0,' + p.h + ')').call(xAxis);
			chart.append('g').attr('class', 'yaxis').call(yAxis);

			/* TOOLTIP
			====================================*/
			var tip = d3.tip().html(function(d) { 
				jQuery('.n').addClass('d3-tip');
				if (p.tickFormat == '.0%'){
					return (d.name + '<br><br>' + Math.round((d.y1 - d.y0)*100) + '%');
				}
				
			});
			chart.call(tip)

			/* DRAW COLUMNS
			====================================*/
			var items = chart.selectAll('.xitem').data(data).enter()
						.append('g').attr('class','xitem').attr('transform', function(d){return 'translate(' + xScale(d.xlabel) + ',0)';});

			items.selectAll('rect').data(function(d) {return d.seg;}).enter().append('rect')
				.attr('width', xScale.rangeBand()).attr('y', function(d) {return yScale(d.y1);}).attr('height', function(d) {return yScale(d.y0) - yScale(d.y1); }).style('fill', function(d){return color(d.name);})
				.on('mouseover', tip.show).on('mouseout', tip.hide);


			/* ADJUST SVG
			====================================*/
			jQuery('#stacked-chart svg').attr('height', p.h+(p.m.top * 2));
			var svgg = jQuery('#stacked-chart svg').attr('height')

			

		})

	}
}

window.onload = function(){
	stackedColumnChart.getAttr(stackedColumnChart.vars, 'data/data', '#stacked-contain', 960, 500, [50,100,30,40], colorbrewer.Accent[4], false, 'in billions of dollars', '.0%', 10, .1);
}