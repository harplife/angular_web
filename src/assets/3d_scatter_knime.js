// Load Plotly - Requires jQuery (tick Dependencies above)

// The columns containing the data to display
var colSelectionX = knimeDataTable.getColumn(0);
var colSelectionY = knimeDataTable.getColumn(1);
var colSelectionZ = knimeDataTable.getColumn(2);

var colours = knimeDataTable.getRowColors();
var textSelection = knimeDataTable.getColumn(4);

var columns = knimeDataTable.getColumnNames();


// Properties
var markerSize = 6;

 $(document.body).append('<div id="config" class="container">'
               + '<form name="configForm">'
 			+ '<b>Marker size: </b><input type="number" min="2" max="20" step="1" value="6" id="markerSize"/>'
 			+ '<b>ID: </b><select id="idColumnSelector"></select>'
 			+ '<b>X: </b><select id="xSelector"></select>'
 			+ '<b>Y: </b><select id="ySelector"></select>'
 			+ '<b>Z: </b><select id="zSelector"></select>'
 			+ '</form>'
 			+ '</div>');


var xColSel = document.getElementById("xSelector");
addOptionToSelectBox(xColSel, columns);

var yColSel = document.getElementById("ySelector");
addOptionToSelectBox(yColSel, columns);

var zColSel = document.getElementById("zSelector");
addOptionToSelectBox(zColSel, columns);

var idColSel = document.getElementById("idColumnSelector");
addOptionToSelectBox(idColSel, columns);

function addOptionToSelectBox(selectBox, columnNames)
{
	for (var i = 0; i < columnNames.length; i++) {
		var option = document.createElement("option");
		option.text = columnNames[i];
		selectBox.add(option);
	}
}

function getMarker(markerSize, colours)
{
	var marker = {
             size: markerSize,
             color: colours,
             line: {
             	width: 0.5},
             	opacity: 1
       }
     return marker;
}


function indexOfColumnName(name) {
	var columnNames = knimeDataTable.getColumnNames();

	var index;

	for (var i = 0; i < columnNames.length; i++)
	{
		if(name === columnNames[i]) {
			index = i;
			break;
		}
	}

	return index;
}

var layout = {
    title: '3D Scatter Plot',
    font: {
        size: 12
    }
};

// Only returning a single trace
// Could provide a group column to add multiple traces?
// If done this was specific traces can be disabled interactively
function getData()
{
	return [{

	    type: 'scatter3d',

	    // Set the X, Y and Z values to the selected columns
	    x: colSelectionX,
	    y: colSelectionY,
	    z: colSelectionZ,
	    text: textSelection,

	    mode: 'markers',
		marker: getMarker(markerSize, colours),
	}];
}


// Create a resizable plotyly 3D scatter graph

require(['Plotly'], function (Plotly) {
	(
		function() {
			var d3 = Plotly.d3;

			var WIDTH_IN_PERCENT_OF_PARENT = 80,
			    HEIGHT_IN_PERCENT_OF_PARENT = 80;

			var gd3 = d3.select('body')
			    .append('div')
			    .style({
			        width: WIDTH_IN_PERCENT_OF_PARENT + '%',
			        'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

			        height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
			        'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
			    });

			var gd = gd3.node();

			// TODO: too much copy and paste, refactor!

			// Handle marker size change
			var markerSizerActivitity = document.getElementById("markerSize");
			markerSizerActivitity.addEventListener("change", function() {
				console.log(markerSizerActivitity.value);
			    	var newSize = markerSizerActivitity.value;
			    	var update = getMarker(newSize, colours);
			    	Plotly.restyle(gd, {marker: update});
			});

			// Handle X change
			var xSelectorActivity = document.getElementById("xSelector");
			xSelectorActivity.addEventListener("change", function() {
				console.log(xSelectorActivity.value);
				var index = indexOfColumnName(xSelectorActivity.value);
				console.log(index);
				colSelectionX = knimeDataTable.getColumn(index);

				var data = getData();
				Plotly.newPlot(gd, data, layout);
			});


			// Handle Y change
			var ySelectorActivity = document.getElementById("ySelector");
			ySelectorActivity.addEventListener("change", function() {
				console.log(xSelectorActivity.value);
				var index = indexOfColumnName(ySelectorActivity.value);
				console.log(index);
				colSelectionY = knimeDataTable.getColumn(index);

				var data = getData();
				Plotly.newPlot(gd, data, layout);
			});


			// Handle Z change
			var zSelectorActivity = document.getElementById("zSelector");
			zSelectorActivity.addEventListener("change", function() {
				console.log(zSelectorActivity.value);
				var index = indexOfColumnName(zSelectorActivity.value);
				console.log(index);
				colSelectionZ = knimeDataTable.getColumn(index);

				var data = getData();
				Plotly.newPlot(gd, data, layout);
			});

			// Handle ID change
			var idSelectorActivity = document.getElementById("idColumnSelector");
			idSelectorActivity.addEventListener("change", function() {
				console.log(zSelectorActivity.value);
				var index = indexOfColumnName(idSelectorActivity.value);
				console.log(index);
				textSelection = knimeDataTable.getColumn(index);

				var data = getData();
				Plotly.newPlot(gd, data, layout);
			});

			var data = getData();

			Plotly.plot(gd, data, layout);

			window.onresize = function() {
			    Plotly.Plots.resize(gd);
			};
		}
	)();
});
