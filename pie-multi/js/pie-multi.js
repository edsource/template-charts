var pieMulti = {
	vars:{
		data:[],
		label:[],
		m:null,
		r:null,
		color:null,
		contain:null
	},
	getPieAttr: function(p, path, contain, m, r, color, inRad){
		jQuery.getJSON(path + '.json',function(d){
			p.m = m;
			p.r = r;
			p.color = color;
			p.contain = contain;
			
			var ii = 0;

			/* PARSE JSON DATA
			=====================================*/
			for (var i = 0; i < d.length ; i++){
				if (i==0){
					p.label = d[i];
				}
				else {
					p.data[ii] = new Array();
					p.data[ii] = d[i];
					ii++;
				}
			}

			
			pieMulti.drawChart(pieMulti.vars);
		})
	},
	drawChart: function(p){
		var svg = d3.select(p.contain).selectAll("svg").data(p.data).enter().append("svg:svg").attr("width", (p.r + p.m) * 2).attr("height", (p.r + p.m) * 2).append("svg:g").attr("transform", "translate(" + (p.r + p.m) + "," + (p.r + p.m) + ")");
			svg.selectAll("path").data(d3.layout.pie()).enter().append("svg:path").attr("d", d3.svg.arc().innerRadius(100 / 2).outerRadius(p.r)).style("fill", function(d, i) { return p.color[i]; });

		pieMulti.drawContext(p);	

	},
	drawContext: function(p){
		for (var i=0; i < p.data.length; i++){
			var detach = jQuery(p.contain + '  svg:eq('+i+')').detach();
			detach.insertBefore(p.contain + ' .pie-multi:eq('+i+') .pie-multi-data');
		}
	}
}

window.onload = function(){
	pieMulti.getPieAttr(pieMulti.vars, 'data/data','#pie-multi', 10, 100, colorbrewer.Set2[3], 50);
}