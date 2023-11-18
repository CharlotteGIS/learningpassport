/// Extractions from google sheets: charts and counts

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var query = new google.visualization.Query(
    'https://docs.google.com/spreadsheets/d/1kUJ7qUf_5MkijECQ1A0il6JUNvnoJ17OJXLjbIuJ4yg/gviz/tq?range=B2:I34'
  );

  query.send(handleQueryResponse);
}

function handleQueryResponse(response) {
  if (response.isError()) {
    console.error('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();

  // Group  by region and count the number of schools
  var view = new google.visualization.DataView(data);
  var groupedData = google.visualization.data.group(
    view,
    [7], // Column index for the region column
    [{'column': 1, 'aggregation': google.visualization.data.count, 'label': 'Number of Schools','type': 'number'}]
  );

  var options = {
    title: 'Number of Schools by Region',
    hAxis: {title: 'Number of Schools'},
    vAxis: {title: 'Region'},
    bars: 'horizontal',
    colors: ['#ec008c'],
    legend: {position: 'top'},
    titleTextStyle: {textAlign: 'center', fontSize: 11},
 };

  //  Visualizes the chart 
  //var chart = new google.visualization.ColumnChart(document.getElementById('chart'));

//chart.draw(groupedData, options);

///////////////counts for display in Title /////////////////////////////////////

  // Count  the number of schools
  var school_count = data.getNumberOfRows(); 


  // For countries, get unique names for each country 
  var uniqueCountries = new Set();

  // Iteration to get the unique coutnry names
  for (var i = 0; i < data.getNumberOfRows(); i++) {
    var country = data.getValue(i, 6); // country column (index)
    uniqueCountries.add(country);
  }

  // Count the number of unique countries
  var country_count = uniqueCountries.size;

  // Display the count elements  as HTML element
  document.getElementById('country_count').innerHTML = country_count + " Countries";  
  document.getElementById('school_count').innerHTML =  school_count+ " Schools";

}