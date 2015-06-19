var pieChart = {
	vars:{
		data:[],
		label:[],
		w:null,
		h:null,
		r:null,
		labelr:null,
		color:null,
		contain:null,
		outRad: null,
		inRad: null
	},
	getPieAttr: function(p, path, contain, w, h, color, inRad){
		jQuery.getJSON(path + '.json',function(d){
			p.label = d[2];
			p.data = d[1];
			p.w = w;
			p.h = h;
			p.r = Math.min(w, h) / 2;
			p.labelr = p.r + 30;
			p.color = color;
			p.contain = contain;
			p.outRad = p.w / 2
			p.inRad = inRad;

			pieChart.drawChart(pieChart.vars);
		})
	},
	drawChart: function(p){
		var arc = d3.svg.arc().innerRadius(p.inRad).outerRadius(p.outRad);
		var pie = d3.layout.pie().sort(null);

		var color = d3.scale.ordinal().range(p.color);

		var svg = d3.select(p.contain).append('svg').attr('width', p.w).attr('height', p.h).classed('pie', true);

		var arcs = 	svg.selectAll("g.arc").data(pie(p.data)).enter().append("g").attr("class", "arc").attr("transform", "translate(" + p.outRad + "," + p.outRad + ")");
					arcs.append("path").attr("fill", function(d, i) {return p.color[i];}).attr("d", arc);
					arcs.append("svg:text").attr("transform", function(d) {
						var c = arc.centroid(d),
				            x = c[0],
				            y = c[1],
				            // pythagorean theorem for hypotenuse
				            h = Math.sqrt(x*x + y*y);
				        return "translate(" + (x/h * p.labelr) +  ',' + (y/h * p.labelr) +  ")"; 
				    })
				    .attr("dy", ".35em")
				    .attr("text-anchor", function(d) {return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";})
				    .data(p.label).attr('fill', '#666').text(function(d, i) {return d; });
	}
}

