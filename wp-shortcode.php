<?php 

function chart_shortcode($attr){
	$attr = shortcode_atts(array('type'=>null, 'data'=>null, 'contain'=>null,'width'=>450,'height'=>300, 'color'=>'BuPu', 'm'=>null,'items'=>null, 'sort'=>false, 'format'=>null, 'ticks'=>5,'padding'=>.1, 'ylabel'=>null, 'xlabel'=>null, 'title'=>null, 'subhed'=>null,'source'=>null, 'max'=>null, 'inrad'=>null, 'legend'=>null), $attr, 'chart');
	/* IF CHART NULL, ESCAPE */
	if ($attr['type'] == null || $attr['contain'] == null || $attr['data'] == null ){return;}

	/* MARGIN MAGIC */
	if ($attr['m'] == null){
		$attr['margin'] = [50,100,30,40];
	}
	else {
		$attr['margin'] = explode(',', $attr['m']);
	}

	/* ENCODE ATTR TO JSON */
	$encode = json_encode($attr);


	/* CALL CSS AND JS FOR SPECIFIC CHART */
	$output = '';
	$output .= "<script type=\"text/javascript\">var chartAttr = new Object();chartAttr = $encode;</script>";
	switch($attr['type']){
		case 'stackedbarpercent':
			$output .= '<div class="temp-charts" id="'.$attr['contain'].'"></div>';
			$output .= "<script type=\"text/javascript\">stackedColumnChart.getAttr(chartAttr.type, chartAttr.data, chartAttr.contain, chartAttr.width, chartAttr.height, chartAttr.margin, colorbrewer[chartAttr.color], chartAttr.items, chartAttr.sort, chartAttr.xlabel, chartAttr.ylabel, chartAttr.format, chartAttr.ticks, chartAttr.padding, chartAttr.title,chartAttr.subhed,chartAttr.source);</script>";
			break;
		case 'stackedbar':
			$output .= '<div class="temp-charts" id="'.$attr['contain'].'"></div>';
			$output .= "<script type=\"text/javascript\">stackedColumnChart.getAttr(chartAttr.type, chartAttr.data, chartAttr.contain, chartAttr.width, chartAttr.height, chartAttr.margin, colorbrewer[chartAttr.color], chartAttr.items, chartAttr.sort, chartAttr.xlabel, chartAttr.ylabel, chartAttr.format, chartAttr.ticks, chartAttr.padding, chartAttr.title,chartAttr.subhed,chartAttr.source);</script>";
			break;
		case 'bar':
			$output .= '<div class="temp-charts" id="'.$attr['contain'].'"></div>';
			$output .= "<script type=\"text/javascript\">barChart.getAttr(chartAttr.type, chartAttr.data, chartAttr.contain, chartAttr.width, chartAttr.height, chartAttr.margin, chartAttr.color, chartAttr.sort, chartAttr.xlabel, chartAttr.ylabel, chartAttr.format, chartAttr.ticks, chartAttr.padding, chartAttr.title,chartAttr.subhed,chartAttr.source, chartAttr.max);</script>";
			break;
		case 'pie':
			$output .= '<section data="#'.$attr['contain'].'" class="pie-contain ed-chart">';
			$output .= '<div class="pie-meta">';
			$output .= '<h2></h2>';
			$output .= '<p></p>';
			$output .= '<p><em></em></p></div>';
			$output .= '<hr class="thick" />';
			$output .= '<div class="pie-legend"></div>';
			$output .= '<div class="temp-charts" id="'.$attr['contain'].'"></div>';
			$output .= "<script type=\"text/javascript\">pieChart.getAttr(chartAttr.type, chartAttr.data, chartAttr.contain, chartAttr.width, chartAttr.height, chartAttr.margin, chartAttr.padding, chartAttr.color, chartAttr.inrad, chartAttr.title,chartAttr.subhed,chartAttr.source,chartAttr.legend);</script>";
			$output .= '</section>';
	}
	return $output;
}
add_shortcode('chart', 'chart_shortcode');

function table_shortcode($attr){
	$attr = shortcode_atts(array('data'=>null, 'contain'=>null, 'format'=>null, 'search'=>false, 'rowname'=>null, 'title'=>null, 'subhed'=>null,'source'=>null,'sort'=>'0,0', 'links'=>null), $attr, 'chart');

	/* IF CHART NULL, ESCAPE */
	if ($attr['contain'] == null || $attr['data'] == null ){return;}


	/* ENCODE ATTR TO JSON */
	$encode = json_encode($attr);


	/* CALL CSS AND JS FOR SPECIFIC CHART */
	$output = '';
	$output .= '<section class="pretty-table" data="#'.$attr['contain'].'">';
	$output .= "<script type=\"text/javascript\">var chartAttr = new Object();chartAttr = $encode;</script>";

	/* ADD META */
	$output .= '<div class="pretty-table-meta" ></div>';

	/* ADD SEARCH IF APPLICABLE */
	if ($attr['search'] === 'true'){
		$output .=  '<section id="pretty-table-search-options">';
			$output .=  '<input id="pretty-table-search" type="text" style="height:24px;" placeholder="Search Table">';
			$output .=  '<div><p class="pretty-table-button" id="execute-search">Search</p></div>';
			$output .=  '<div><p class="pretty-table-button" id="reset-search">Reset</p></div>';
		$output .=  '</section>';
	}

	$output .=  '<div id="'.$attr['contain'].'"></div></section>';
	$output .= '<script type="text/javascript">prettyTables.getAttr(chartAttr.data, chartAttr.contain, chartAttr.sort, chartAttr.search, chartAttr.title,chartAttr.subhed,chartAttr.source, chartAttr.rowname, chartAttr.format, chartAttr.links);</script>';
	
	return $output;
}
add_shortcode('table', 'table_shortcode');

?>