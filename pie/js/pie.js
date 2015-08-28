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
		jQuery.getJSON('data/' + path + '.json',function(d){
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
		var xAdj, yAdj, y1, y2;
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
				            xAdj = (x/h * p.labelr);
				            yAdj = (y/h * p.labelr);
				        return "translate(" + xAdj +  ',' + yAdj +  ")"; 
				    }).attr("dy", ".35em").attr("text-anchor", function(d) {return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start'}).data(p.label).attr('fill', '#666').text(function(d, i) {return d; });
				    arcs.append('line').attr('stroke', '#666').attr("x2", function(d) {
						var c = arc.centroid(d),
				            x = c[0],
				            y = c[1],
				            // pythagorean theorem for hypotenuse
				            h = Math.sqrt(x*x + y*y);
				        return (x/h * p.labelr);}).attr("y2", function(d) {
						var c = arc.centroid(d),
				            x = c[0],
				            y = c[1],
				            // pythagorean theorem for hypotenuse
				            h = Math.sqrt(x*x + y*y);
				            var adj = (d.endAngle + d.startAngle)/2 > Math.PI ? 15 : -15;
				        return (y/h * p.labelr) + adj }).attr('y1', 0).attr('x1', 0);
		this.adjustLine();
	},
	adjustLine: function(){
		jQuery('.arc:eq(0) line').attr({
			'y1':120,
			'x1':50
		});
		jQuery('.arc:eq(1) line').attr({
			'y1':-90,
			'x1':-100
		});
		jQuery('.arc:eq(2) line').attr({
			'y1':-120,
			'x1':-43
		});
		//30 adjust on all figure out auto later
	}
}

window.onload = function(){
	pieChart.getPieAttr(pieChart.vars, 'data','#pie-chart', 300, 300, colorbrewer.Set2[3], 0);
}
