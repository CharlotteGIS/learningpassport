
//school locations loaded from csv

var markers = [];

function loadSchoolData() {
    $.get('data/schools.csv', function(data) {
        Papa.parse(data, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {
                results.data.slice(0, 50).forEach(function(school) {
                    var lat = parseFloat(school.lat);
                    var lon = parseFloat(school.lon);

                    if (!isNaN(lat) && !isNaN(lon)) {
                        var icon = L.divIcon({
                            className: 'marker-icon program-' + school.programme,
                            iconAnchor: [16, 32],
                            popupAnchor: [0, -32],
                            html: '<i class="fa-solid fa-book-open fa-2xl"></i>',
                        });

                        var marker = L.marker([lat, lon], { icon: icon }).addTo(map);
                        marker.options.country = school.country;

                        marker.bindPopup(`<strong>School Name :</strong> ${school['School name']}<br><strong> Program Type: </strong> ${school.programme}<br><a href="${school.url}" target="_blank">Visit Website</a><br><strong> Country: </strong>${school.country}`);
                        markers.push(marker);
                    } else {
                        console.warn(`Skipping invalid coordinates for school: ${school['School name']}`);
                    }
                });


            }
        });
    });
}

loadSchoolData();



// Filter function by type of program and country 

function zoomToCountry(selectedCountry) {
    // Loads the GeoJSON data for the country to get geo bounds
    $.getJSON('data/border.geojson', function(data) {
        // Data filter to get geo feature and propoerties for country 
        var selectedCountryFeature = data.features.find(function(feature) {
            return feature.properties.ADMIN === selectedCountry;
        });

        if (selectedCountryFeature) {
            // Calculates the bounds of the selected country's feature (using geojson data)
            var selectedCountryBounds = L.geoJSON(selectedCountryFeature).getBounds();

            // Zooms to the selected country
            map.fitBounds(selectedCountryBounds, { padding: [20, 20] });
        }

   
    });
}

// Filter by program type
        function filterMarkers() {
            var selectedProgramType = document.getElementById("programType").value;
            var selectedCountry = document.getElementById("country").value;


            var foundMarkers = false;

            markers.forEach(function (marker) {
                var isProgramTypeMatch = selectedProgramType === "All" || marker.options.icon.options.className.includes('program-' + selectedProgramType);
                var isCountryMatch = selectedCountry === "All" || marker.options.country === selectedCountry;
        
                if (isProgramTypeMatch && isCountryMatch) {
                    marker.addTo(map);
                    foundMarkers = true;

                } else {
                    map.removeLayer(marker);
                }
            });

            if (!foundMarkers) {
                // Displays a message when no matching location markers are found
                alert("No schools matching the selected criteria found.");
            }

        
        }
            
        
// Function for zoom 
function onCountrySelect() {
    var selectedCountry = document.getElementById("country").value;

    if (selectedCountry === "All") {
        // Zoom out to show all markers
        map.setView([0, 0], 3);     
  } else {
    // Zoom to the selected country
    zoomToCountry(selectedCountry);
}
}

//  HTML legend content for Program Status
var legendHTML = '<div id="border-legend">' +
'<div><strong>Program Status </strong></div>' +
    '<div><span class="legend-live"></span> Live</div>' +
    '<div><span class="legend-development"></span> In Development</div>' +
    '<div><span class="legend-null"></span> No Program </div>' +
    '</div>';

// Legend control for status legend
var legendControl = L.control({ position: 'bottomright' });

legendControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = legendHTML;
    return div;
};

legendControl.addTo(map);


