//File: Covid19.js
var idBundesland;
var options;
var chart;
		
$(function () {   
	var table = $('#example').DataTable({
        ajax: {
            url: 'php/startTabRequest.php',
            dataSrc: ''
        },
        "columns": [
            { data: "b_idbundesland" },
            { data: "b_bundesland" },
			{ data: "b_einwohner" },
        ]
    });
	
	$('#example tbody').on( 'click', 'tr', function (){
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
			
			var celldata = table.row('.selected').data();
			idBundesland = celldata.b_idbundesland;			
			requestData(requestArrayStart);
        }
    });
	
	idBundesland = 2;
	var requestArrayStart = [
	    {"attr": "c_summefall", "param": "Summe Fall"},
        {"attr": "c_summetodesfall", "param": "Summe Todesfall"},
        {"attr": "c_summegenesung", "param": "Summe Genesung"},
		{"attr": "c_summerestinfiziert", "param": "Summe Restinfiziert"}
	];
	requestData(requestArrayStart);
});

function setOptions(){
   options = {
        chart: {
            renderTo: 'container',
            zoomType: 'x'
        },		
        title: {
                text: 'No values available!'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'kumulative Summe'
            }
        },
        legend: {
            enabled: true
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        } 
    };
};

function requestData(requestArray){
    setOptions();
    chart = new Highcharts.Chart(options);
	
	for (z = 0; z < requestArray.length; z++){
	    var attributname = requestArray[z].attr;
        var paraname = requestArray[z].param;
		
		$.getJSON('php/startChartRequest.php', {value1: idBundesland, value2: attributname},
		    (function (paraname) { //create a closure around the variable
		        return function(data) {
				    var json2array = new Array();
		
		            for (i = 0; i < data.length; i++){
		                var strParaName = Object.keys(data[i])[4];
                        json2array.push([Date.UTC(data[i].year, data[i].month, data[i].day), parseFloat(data[i][strParaName])]);
			            bundesland = data[i].c_bundesland;
                    }
		    
			        chart.setTitle({
                        text: 'COVID-19 ' + bundesland + ' (Quelle: RKI)'
                    });
			        chart.addSeries({
			            name: paraname,
                        data: json2array
                    });
				};
		    }(paraname))
		)
		.fail(function(paraname) { //create a closure around the variable
		    return function(){
			    chart.addSeries({
				    name: paraname + ': No values available!',
                    data: []
                });
			};
        }(paraname));
	};   
};
