var pieChart = {
	vars:{
		data:[],
		labels:[],
		w:null,
		h:null,
		color:null,
		contain:null,
		outRad: null,
		inRad: null
	},
	getPieAttr: function(p, path, contain, w, h, color, inRad){
		jQuery.getJSON(path + '.json',function(d){
			p.label = d[0];
			p.data = d[1];
			p.w = w;
			p.h = h;
			p.color = color;
			p.contain = contain;
			p.outRad = p.w / 2
			p.inRad = inRad;
			pieChart.drawChart(pieChart.vars);
		})
	},
	drawChart: function(p){
		var arc = d3.svg.arc().innerRadius(p.inRad).outerRadius(p.outRad);

		var pie = d3.layout.pie();

		var color = d3.scale.ordinal().range(p.color);

		var svg = d3.select(p.contain).append('svg').attr('width', p.w).attr('height', p.h).classed('pie', true);

		var arcs = 	svg.selectAll("g.arc").data(pie(p.data)).enter().append("g").attr("class", "arc").attr("transform", "translate(" + p.outRad + "," + p.outRad + ")");
					arcs.append("path").attr("fill", function(d, i) {return p.color[i];}).attr("d", arc);
	}
}

window.onload = function(){
	pieChart.getPieAttr(pieChart.vars, 'data/data','#pie', 300, 300, colorbrewer.Set2[3], 50);
}