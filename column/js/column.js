var columnChart = {
	vars:{
		label:[],
		data:[],
		w:null,
		h:null,
		m:[],
		contain:null,
		yaxisLabel:null,
		tickFormat:null,
		ticks:null,
		path:null
	},
	getAttr: function(p, path, contain, w, h, m, sort, label, tF, tick){
		p.w = w - m[1] - m[3];
		p.h = h - m[0] - m[2];
		p.m = m;
		p.path = path;
		p.contain = contain;
		p.yaxisLabel = label;
		p.tickFormat = tF;
		p.ticks = tick;
		columnChart.drawChart(columnChart.vars);
	},
	drawChart: function(p){		
		// SCALES
		var x = d3.scale.ordinal().rangeRoundBands([0, p.w], .1);
		var y = d3.scale.linear().range([p.h, 0]);

		// CHART
		var chart = d3.select(p.contain).append("svg").attr("width", p.w + p.m[3] + p.m[1]).attr("height", p.h + p.m[0] + p.m[2]).append("g").attr("transform", "translate(" + p.m[3] + "," + p.m[0] + ")");

		d3.tsv(p.path, columnChart.type, function(error, data) {

			// MAP DOMAINS
			x.domain(data.map(function(d) { return d.xaxis; }));
			y.domain([0, d3.max(data, function(d) { return d.yaxis; })]);

			// AXES
			var xAxis = d3.svg.axis().scale(x).orient("bottom");
			var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(columnChart.tickFormat(p.tickFormat)).ticks(p.ticks);
			chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + p.h + ")").call(xAxis);
			chart.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(p.yaxisLabel);

			// DRAW CHART
			chart.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function(d) { return x(d.xaxis); }).attr("width", x.rangeBand()).attr("y", function(d) { return y(d.yaxis); }).attr("height", function(d) { return p.h - y(d.yaxis); });

		});
	},
	assessor: function(d){
		d.yaxis = +d.yaxis;
		return d;
	},
	tickFormat: function(t){
		if (t === '$'){
			return d3.format('$');
		}
	}
}



