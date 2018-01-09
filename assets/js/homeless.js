// GenMap begins on line 312
// GenTable begins on line 523
// GenPanelTwo begins on line 964
//
//
// Spinner loading controls
/*function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

function openTab2(evt, tab2Name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tab2Name).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen2").click();

var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn1");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
*/
var opts = {
  lines: 9, // The number of lines to draw
  length: 16, // The length of each line
  width: 6.5, // The line thickness
  radius: 14, // The radius of the inner circle
  color: '#EE3124', // #rgb or #rrggbb or array of colors
  speed: 1.9, // Rounds per second
  trail: 40, // Afterglow percentage
  className: 'spinner' // The CSS class to assign to the spinner
}

var target_panel1 = document.getElementById('container');
var target_panel2 = document.getElementById('container2_1');
var target_panel3 = document.getElementById('container2_2');
var target_panel4 = document.getElementById('container2_3');
var target_panel5 = document.getElementById('container2_4');
//var target_panel3 = document.getElementById('container3');

var spinner_panel1 = new Spinner(opts).spin(target_panel1);
var spinner_panel2 = new Spinner(opts).spin(target_panel2);
//var spinner_panel3 = new Spinner(opts).spin(target_panel3);

d3.json('/data-lab-data/2017_CoC_Grantee_Areas_2.json', function(us) {
  d3.json('/data-lab-data/us-states.json', function(json) {
    d3.json('/data-lab-data/coc-pop-type.json', function(data) {
      /**return{
        total_homeless: +data.total_homeless
      }**/
      d3.csv('/data-lab-data/State_crosswalk.csv', function(states) {
        d3.csv('/data-lab-data/CFDACOCAward.csv', function(bar_chrt) {
          d3.csv('/data-lab-data/pop-award.csv', function(d) {
            return {
              total_homeless: +d.total_homeless,
              value: +d.value
            }
          }, function(scatter_data) {
            d3.json('/data-lab-data/coc-pop-type.json', function(table_data) {
              d3.csv('/data-lab-data/coc_by_value.csv', function(map_data) {

                //console.log('bar_chrt: ', bar_chrt);

                d3.select('#container2_1').append('div').attr('id', 'p2_1')
                d3.select('#container2_2').append('div').attr('id', 'p2_2')
                d3.select('#container2_3').append('div').attr('id', 'p2_3')
                d3.select('#container2_4').append('div').attr('id', 'p2_4')
                d3.select('#p2_1').append('div').attr('id', 'panel_map')
                d3.select('#p2_3').append('div').attr('id', 'panel_matrix')
                d3.select('#p2_2').append('div').attr('id', 'panel_coc')
                d3.select('#p2_4').append('div').attr('id', 'panel_info')
                d3.select('#container2_3').append('div').attr('id', 'p2_3_legend_title')
                d3.select('#container2_3').append('div').attr('id', 'p2_3_legend')

                var abs_width = 1024,
                  abs_height = 575,
                  margin = {
                    top: 100,
                    right: 50,
                    bottom: 15,
                    left: 100
                  },
                  panel_2_width = abs_width - margin.left - margin.right,
                  panel_2_height = abs_height - margin.top - margin.bottom,
                  matrix_width = abs_width / 1.85 - margin.left - margin.right,
                  matrix_height = abs_height - margin.top - margin.bottom,
                  map_width = panel_2_width - matrix_width - margin.left - margin.right,
                  map_height = panel_2_height / 3,
                  info_width = panel_2_width - matrix_width - margin.left - margin.right,
                  info_height = panel_2_height / 3,
                  centered = null;

                var p2_1_map_svg = d3.select('#panel_map')
                  .append('svg')
                  .attr('id', 'p2_1_map')
                  .attr('width', map_width + margin.left + margin.right + 40)
                  .attr('height', map_height + margin.top + margin.bottom + 25);

                var info_panel = d3.select('#panel_info')
                  .attr('width', info_width + margin.left + margin.right)
                  .attr('height', info_height + margin.top + margin.bottom);

                var coc_panel = d3.select('#panel_coc')
                  .attr('width', info_width + margin.left + margin.right)
                  .attr('height', info_height + margin.top + margin.bottom);

                var p2_matrix_svg = d3.select('#panel_matrix').append('svg')
                  /*.attr('width', matrix_width + margin.left + margin.right)
                  .attr('height', matrix_height + margin.top + margin.bottom)*/
                  .attr('width', map_width + margin.left + margin.right + 50)
                  .attr('height', map_height + margin.top + margin.bottom + 40)
                  .style('margin-left', -margin.left / 2.5 + 'px')
                  .attr('transform', 'translate(' + 40 + ',' + 10 + ')');

                var p2_tip = d3.tip()
                  .attr('class', 'homeless-analysis d3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return '<b>' + d.properties.coc_number + ': ' + d.properties.COCNAME + '</b>' + '<br>' +
                      'Federal Funding: ' + getDollarValue(d) + '<br>' +
                      'Total Homeless: ' + getValue(d) + '<br>' +
                      'Sheltered Homeless: ' + getSheltered(d) + '<br>' +
                      'Unsheltered Homeless: ' + getUnsheltered(d) + '<br>' +
                      'Homeless Veterans: ' + getVets(d);
                  });

                var p2_3_bar_tip = d3.tip()
                  .attr('class', 'homeless-analysis d3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return getCFDA_value(d);
                  });

                var p2_1_projection = d3.geo.albersUsa()
                  .translate([map_width / 1.2, map_height / 1]) // translate to center of screen
                  .scale([575]); // scale things down so see entire US

                // Define path generator
                var p2_1_path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
                  .projection(p2_1_projection); // tell path generator to use albersUsa projection

                var m = p2_1_map_svg.append('g');

                data.forEach(function(d) {
                  d.total_homeless = +d.total_homeless
                  d.unsheltered = +d.unsheltered_homeless
                  d.sheltered = +d.sheltered_homeless
                  d.vets = +d.homeless_veterans
                });

                bar_chrt.forEach(function(d) {
                  d.fed_funding = +d.fed_funding;
                });

                map_data.forEach(function(d) {
                  d.fed_funding = +d.fed_funding;
                });

                bar_chrt = bar_chrt.sort(function(x, y) {
                  return d3.descending(x.fed_funding, y.fed_funding);
                });

                // Initialize visualization
                GenMap()
                GenPanelTwo()
                //GenScatter()

                // Radio button control Panel 1
                $(document).ready(function() {
                  $('input[type="radio"]').on('change', function() {
                    var selectedValue = $('input[name="radio"]:checked').val();

                    if (selectedValue === 'Map') {
                      d3.selectAll('#viz_container').remove()
                      d3.selectAll('#counties_mini').remove()
                      //d3.select('#p2_legend').remove()

                      GenMap()
                      GenPanelTwo()
                      //GenScatter();

                    } else if (selectedValue === 'Table') {
                      d3.selectAll('#viz_container').remove()
                      d3.selectAll('#legend').remove()
                      d3.selectAll('#legend_title').remove()
                      d3.selectAll('#counties_mini').remove()
                      GenTable()
                      GenPanelTwo()
                      //GenScatter()
                    }
                  })
                })

                // **************************************************************

                var formatNumber = d3.format('$,.0f');
                var OtherformatNumber = d3.format(',');

                function getColor(d) {
                  for (var i = 0; i < data.length; i++) {
                    if (d.properties.coc_number === data[i].coc_number) {
                      if (data[i].total_homeless <= 100) {
                        return ('#F3E0C4');
                      } else if (data[i].total_homeless <= 200) {
                        return ('#EAD8BD');
                      } else if (data[i].total_homeless <= 300) {
                        return ('#E2D0B6');
                      } else if (data[i].total_homeless <= 500) {
                        return ('#DAC8AF');
                      } else if (data[i].total_homeless <= 700) {
                        return ('#D1C0A8');
                      } else if (data[i].total_homeless <= 1000) {
                        return ('#C9B9A1');
                      } else if (data[i].total_homeless <= 1500) {
                        return ('#C1B19B');
                      } else if (data[i].total_homeless <= 2000) {
                        return ('#B9AA94');
                      } else if (data[i].total_homeless <= 2500) {
                        return ('#B1A28E');
                      } else if (data[i].total_homeless <= 3000) {
                        return ('#A99B87');
                      } else if (data[i].total_homeless <= 3500) {
                        return ('#998C7A');
                      } else if (data[i].total_homeless <= 4000) {
                        return ('#897E6D');
                      } else if (data[i].total_homeless <= 5000) {
                        return ('#827767');
                      } else if (data[i].total_homeless <= 6000) {
                        return ('#73695B');
                      } else if (data[i].total_homeless <= 7000) {
                        return ('#645C4F');
                      } else if (data[i].total_homeless <= 8000) {
                        return ('#564E43');
                      } else if (data[i].total_homeless <= 12000) {
                        return ('#413B33');
                      } else {
                        return ('#211D18')
                      }
                    }
                  }
                }

                function getValue(d) {
                  for (var i = 0; i < data.length; i++) {
                    if (d.properties.coc_number === data[i].coc_number) {
                      return OtherformatNumber(data[i].total_homeless);
                    }
                  }
                }

                function getSheltered(d) {
                  for (var i = 0; i < data.length; i++) {
                    if (d.properties.coc_number === data[i].coc_number) {
                      return OtherformatNumber(data[i].sheltered_homeless);
                    }
                  }
                }

                function getUnsheltered(d) {
                  for (var i = 0; i < data.length; i++) {
                    if (d.properties.coc_number === data[i].coc_number) {
                      return OtherformatNumber(data[i].unsheltered_homeless);
                    }
                  }
                }

                function getVets(d) {
                  for (var i = 0; i < data.length; i++) {
                    if (d.properties.coc_number === data[i].coc_number) {
                      return OtherformatNumber(data[i].homeless_veterans);
                    }
                  }
                }

                function getState(d) {
                  for (var i = 0; i < states.length; i++) {
                    if (d.properties.stusab === states[i].Abbrv) {
                      return states[i].State;
                    }
                  }
                }

                function getDollarValue(d) {
                  for (var i = 0; i < map_data.length; i++) {
                    if (d.properties.coc_number === map_data[i].COC_Number) {
                      return formatNumber(map_data[i].amount);
                    }
                  }
                }

                function getCFDA_value(d) {
                  //console.log('CFDA value: ',d);
                  return 'Funding Amount: ' + formatNumber(d.fed_funding);
                }

                //*************************************************************

                function GenMap() {
                  spinner_panel1.stop();

                  d3.select('#container').append('div').attr('id', 'legend_title');
                  d3.select('#container').append('div').attr('id', 'legend');
                  d3.select('#container').append('div').attr('id', 'viz_container');

                  var width = 1000,
                    height = 600,
                    centered = null;

                  // D3 Projection
                  var projection = d3.geo.albersUsa()
                    .translate([width / 2, height / 2]) // translate to center of screen
                    .scale([1200]); // scale things down so see entire US ---1455

                  // Define path generator
                  var path = d3.geo.path() // path generator that will convert GeoJSON to SVG paths
                    .projection(projection); // tell path generator to use albersUsa projection

                  var div = d3.select('#viz_container')
                    .append('div')
                    .attr('id', 'map_container')
                    .attr('width', width)
                    .attr('height', height);

                  var map_svg = d3.select('#map_container')
                    .append('svg')
                    .attr('id', 'svg')
                    .attr('width', '950px')
                    .attr('height', '575px');

                  var tip = d3.tip()
                    .attr('class', 'homeless-analysis d3-tip')
                    .offset([-10, -10])
                    .html(function(d) {
                      return '<b>' + d.properties.coc_number + ': ' + d.properties.COCNAME + '</b>' + '<br>' +
                        'Federal Funding: ' + getDollarValue(d) + '<br>' +
                        'Total Homeless: ' + getValue(d) + '<br>' +
                        'Sheltered Homeless: ' + getSheltered(d) + '<br>' +
                        'Unsheltered Homeless: ' + getUnsheltered(d) + '<br>' +
                        'Homeless Veterans: ' + getVets(d);
                    });

                  map_svg.call(tip)

                  var legend_title = d3.select('#legend_title')
                    .append('div')
                    .attr('class', 'legend_title')
                    .attr('height', '15px')
                    .attr('width', '950px')
                    .html('<h5>Contiuum of Care Area Homeless Population</h5>')
                    .style('text-anchor', 'middle');

                  var legend = d3.select('#legend')
                    .append('div')
                    .attr('width', '950px')
                    .attr('height', '100px')
                    .attr('padding', '50px 0 0 50px');


                  var color = ['#F3E0C4', '#EAD8BD', '#E2D0B6', '#DAC8AF', '#D1C0A8',
                    '#C9B9A1', '#C1B19B', '#B9AA94', '#B1A28E', '#A99B87', '#998C7A',
                    '#897E6D', '#827767', '#73695B', '#645C4F', '#564E43', '#413B33',
                    '#342F28', '#211D18'
                  ]

                  var legend_key_values = ['< 100', '100-200', '200-300', '300-500', '500-700', '700-1k', '1k-1.5k',
                    '1.5k-2k', '2k-2.5k', '2.5k-3k', '3k-3.5k', '3.5k-4k', '4k-5k',
                    '5k-6k', '6k-7k', '7k-8k', '8k-15k', '16k-30k', '> 30k'
                  ];

                  for (var i = 0; i < 19; i++) {

                    var z = legend.append('div')
                      .attr('id', 'legend_key');

                    var key = z.append('div')
                      .attr('id', 'key')
                      .style('position', 'relative')
                      .append('svg')
                      .attr('height', '40px')
                      .attr('width', '53px')
                      .append('rect')
                      .attr('x', 10)
                      .attr('y', 10)
                      .attr('height', 30)
                      .attr('width', 30)
                      .style('fill', function(d) {
                        return color[i];
                      });


                    z.append('div')
                      .attr('id', 'key_value')
                      .style('position', 'relative')
                      .style('color', 'blue')
                      .html('<p>' + legend_key_values[i] + '</p>');
                  }

                  var g = map_svg.append('g')
                    .attr('class', 'counties')
                    .selectAll('path')
                    .data(us.features)
                    .enter().append('path')
                    .attr('class', 'coc')
                    .attr('data-coc', function(d) {
                      return d.properties.coc_number;
                    })
                    .attr('data-state', function(d) {
                      return d.properties.state;
                    })
                    .attr('data-name', function(d) {
                      return d.properties.name;
                    })
                    .attr('d', path)
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide)
                    .on('dblclick', clicked)
                    .on("click", function(d) {
                      BarChart(d);
                      createCoCTable(d);
                      createCFDATableHover(d);
                      p2_1_clicked_p1(d);
                    })
                    .style('fill', getColor);

                  function clicked(d) {
                    var x, y, k;

                    ////console.log('Panel 1 clicked, d: ',d);

                    for (var i = 0; i < states.length; i++) {
                      if (d.properties.STUSAB == states[i].Abbrv) {
                        for (var h = 0; h < json.features.length; h++) {
                          if (states[i].State == json.features[h].properties.NAME) {
                            var n = json.features[h]
                            console.log('clicked n: ',n);
                            if (n && centered !== n) {
                              var centroid = path.centroid(n)
                              x = centroid[0]
                              y = centroid[1]

                              ////console.log('d: ',d.properties.NAME);
                              if (n.properties.NAME === 'Florida') {
                                k = 4.0
                              } else if (n.properties.NAME === 'Michigan') {
                                k = 4.5
                              } else if (n.properties.NAME === 'Idaho') {
                                k = 3
                              } else if (n.properties.NAME === 'Alaska') {
                                k = 4.0
                              } else if (n.properties.NAME === 'Hawaii') {
                                k = 6.5
                              } else if (n.properties.NAME === 'New Jersey') {
                                k = 12
                              } else if (n.properties.NAME === 'Illinois') {
                                k = 4.75
                              } else if (n.properties.NAME === 'Nevada') {
                                k = 3
                              } else if (n.properties.NAME === 'Maryland') {
                                k = 14
                              } else if (n.properties.CENSUSAREA <= 8000) {
                                k = 17.0
                              } else if (n.properties.CENSUSAREA > 8000 && n.properties.CENSUSAREA <= 10000) {
                                k = 11.25
                              } else if (n.properties.CENSUSAREA > 10000 && n.properties.CENSUSAREA <= 15000) {
                                k = 11.0
                              } else if (n.properties.CENSUSAREA > 15000 && n.properties.CENSUSAREA <= 30000) {
                                k = 9.0
                              } else if (n.properties.CENSUSAREA > 30000 && n.properties.CENSUSAREA <= 50000) {
                                k = 6.6
                              } else if (n.properties.CENSUSAREA > 50000 && n.properties.CENSUSAREA <= 70000) {
                                k = 6.05
                              } else if (n.properties.CENSUSAREA > 70000 && n.properties.CENSUSAREA <= 90000) {
                                k = 4.75
                              } else if (n.properties.CENSUSAREA > 90000 && n.properties.CENSUSAREA <= 110000) {
                                k = 5.25
                              } else if (n.properties.CENSUSAREA > 110000 && n.properties.CENSUSAREA <= 130000) {
                                k = 3.0
                              } else if (n.properties.CENSUSAREA > 130000 && n.properties.CENSUSAREA <= 150000) {
                                k = 2.75
                              } else {
                                k = 2.2
                              };
                              centered = n;

                            } else {
                              x = width / 2;
                              y = height / 2;
                              k = 1;
                              centered = null;

                            }

                            g.selectAll('path')
                              .classed('active', centered && function(d) {
                                return d === centered;
                              });

                            g.transition()
                              .duration(750)
                              .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
                              .style('stroke-width', .25 / k + 'px');
                          }
                        }
                      }
                    }
                  }
                } //end of GenMap()

                function GenTable() {

                  ////console.log('table data: ', table_data)

                  table_data.forEach(function(d) {
                    d.total_homeless = +d.total_homeless
                    d.chronically_homeless = +d.chronically_homeless
                    d.sheltered_homeless = +d.sheltered_homeless
                    d.unsheltered_homeless = +d.unsheltered_homeless
                    d.homeless_individuals = +d.homeless_individuals
                    d.homeless_veterans = +d.homeless_veterans
                    d.homeless_people_in_families = +d.homeless_people_in_families
                    d.homeless_unaccompanied_youth = +d.homeless_unaccompanied_youth
                  });

                  var column_names = ['CoC Number', 'CoC Name', 'Total Homeless', 'Sheltered Homeless', 'Unsheltered Homeless', 'Chronically Homeless', 'Homeless Veterans', 'Homeless Individuals', 'Homeless People in Families', 'Homeless Unaccompanied Youth (Under 25)'];

                  var clicks = {
                    coc_number: 0,
                    coc_name: 0,
                    total_homeless: 0,
                    chronically_homeless: 0,
                    sheltered_homeless: 0,
                    unsheltered_homeless: 0,
                    homeless_veterans: 0,
                    homeless_individuals: 0,
                    homeless_people_in_families: 0,
                    homeless_unaccompanied_youth: 0
                  };

                  d3.select('#container')
                    .attr('height', '700px')
                    .attr('width', '1024px');

                  d3.select('#container').append('div')
                    .attr('id', 'viz_container')
                    .attr('height', '700px')
                    .attr('width', '1000px');

                  d3.select('#viz_container').append('h3')
                    .attr('id', 'title')
                    .style('text-align', 'center')
                    .text('Continuum of Care 2016 Homeless Population')

                  d3.select('#viz_container').append('div')
                    .attr('class', 'SearchBar')
                    .append('p')
                    .attr('class', 'SearchBar')
                    .text('Search By CoC Name:');

                  d3.select('.SearchBar')
                    .append('input')
                    .attr('class', 'SearchBar')
                    .attr('id', 'search')
                    .attr('type', 'text')
                    .attr('placeholder', 'Search...')
                    .style('font-family', 'inherit')
                    .style('font-size', '16');

                  d3.select('#viz_container').append('div')
                    .attr('id', 'table_container')
                    .attr('width', '950px')
                    .attr('height', '575px');

                  var table = d3.select('#table_container').append('table').attr('id', 'tab');
                  table.append('thead').append('tr');

                  var headers = table.select('tr').selectAll('th')
                    .data(column_names)
                    .enter()
                    .append('th')
                    .text(function(d) {
                      return d;
                    });

                  var rows, row_entries, row_entries_no_anchor, row_entries_with_anchor;

                  // draw table body with rows
                  table.append('tbody')

                  // data bind
                  rows = table.select('tbody').selectAll('tr')
                    .data(table_data, function(d) {
                      return d.coc_number;
                    });

                  // enter the rows
                  rows.enter()
                    .append('tr')

                  // enter td's in each row
                  row_entries = rows.selectAll('td')
                    .data(function(d) {
                      var arr = [];
                      for (var k in d) {
                        if (d.hasOwnProperty(k)) {
                          arr.push(d[k]);
                        }
                      }
                      return [arr[0], arr[1], arr[2], arr[3], arr[4], arr[7], arr[8], arr[5], arr[6], arr[9]];
                    })
                    .enter()
                    .append('td')

                  // draw row entries with no anchor
                  row_entries_no_anchor = row_entries.filter(function(d) {
                    return (/https?:\/\//.test(d) == false)
                  })
                  row_entries_no_anchor.text(function(d) {
                    return d;
                  })

                  // draw row entries with anchor
                  row_entries_with_anchor = row_entries.filter(function(d) {
                    return (/https?:\/\//.test(d) == true)
                  })
                  row_entries_with_anchor
                    .append('a')
                    .attr('href', function(d) {
                      return d;
                    })
                    .attr('target', '_blank')
                    .text(function(d) {
                      return d;
                    })

                  /**  search functionality **/
                  d3.select('#search')
                    .on('keyup', function() { // filter according to key pressed
                      var searched_data = table_data,
                        text = this.value.trim();

                      var searchResults = searched_data.map(function(r) {
                        var regex = new RegExp('^' + text, 'i');
                        if (regex.test(r.coc_name)) { // if there are any results
                          return regex.exec(r.coc_name)[0]; // return them to searchResults
                        }
                      })

                      // filter blank entries from searchResults
                      searchResults = searchResults.filter(function(r) {
                        return r != undefined;
                      })

                      // filter dataset with searchResults
                      searched_data = searchResults.map(function(r) {
                        return table_data.filter(function(p) {
                          return p.coc_name.indexOf(r) != -1;
                        })
                      })

                      // flatten array
                      searched_data = [].concat.apply([], searched_data)

                      // data bind with new data
                      rows = table.select('tbody').selectAll('tr')
                        .data(searched_data, function(d) {
                          return d.coc_number;
                        })
                        .attr('class', 'panel_1_table');

                      // enter the rows
                      rows.enter()
                        .append('tr');

                      // enter td's in each row
                      row_entries = rows.selectAll('td')
                        .data(function(d) {
                          var arr = [];
                          for (var k in d) {
                            if (d.hasOwnProperty(k)) {
                              arr.push(d[k]);
                            }
                          }
                          return [arr[0], arr[1], arr[2], arr[3], arr[4], arr[7], arr[8], arr[5], arr[6], arr[9]];
                        })
                        .enter()
                        .append('td')

                      // draw row entries with no anchor
                      row_entries_no_anchor = row_entries.filter(function(d) {
                        return (/https?:\/\//.test(d) == false)
                      })
                      row_entries_no_anchor.text(function(d) {
                        return d;
                      })

                      // draw row entries with anchor
                      row_entries_with_anchor = row_entries.filter(function(d) {
                        return (/https?:\/\//.test(d) == true)
                      })
                      row_entries_with_anchor
                        .append('a')
                        .attr('href', function(d) {
                          return d;
                        })
                        .attr('target', '_blank')
                        .text(function(d) {
                          return d;
                        })

                      // exit
                      rows.exit().remove();
                    })

                  /**  sort functionality **/
                  headers.on('click', function(d) {
                    if (d == 'CoC Number') {
                      clicks.coc_number++
                        if (clicks.coc_number % 2 == 0) {
                          rows.sort(function(a, b) {
                            return a.coc_number.localeCompare(b.coc_number);
                          })
                        } else
                      if (clicks.coc_number % 2 !== 0) {
                        rows.sort(function(a, b) {
                          return b.coc_number.localeCompare(a.coc_number);
                        })
                      }
                    }

                    if (d == 'CoC Name') {
                      clicks.coc_name++
                        if (clicks.coc_name % 2 == 0) {
                          rows.sort(function(a, b) {
                            return a.coc_name.localeCompare(b.coc_name);
                          })
                        } else
                      if (clicks.coc_name % 2 !== 0) {
                        rows.sort(function(a, b) {
                          return b.coc_name.localeCompare(a.coc_name);
                        })
                      }
                    }

                    if (d == 'Total Homeless') {
                      clicks.total_homeless++;
                      //console.log('rows.total_homeless: ', rows.total_homeless)
                      if (clicks.total_homeless % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.total_homeless < +b.total_homeless) {
                            return -1;
                          } else if (+a.total_homeless > +b.total_homeless) {
                            return 1;
                          } else {
                            return 0;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.total_homeless % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+b.total_homeless > +a.total_homeless) {
                            return 1;
                          } else if (+b.total_homeless < +a.total_homeless) {
                            return -1;
                          } else {
                            return 0;
                          }
                        });
                      }
                    }

                    if (d == 'Chronically Homeless') {
                      clicks.chronically_homeless++;
                      // even number of clicks
                      if (clicks.chronically_homeless % 2 == 0) {
                        // sort ascending: alphabetically
                        rows.sort(function(a, b) {
                          if (a.chronically_homeless < b.chronically_homeless) {
                            return -1;
                          } else if (a.chronically_homeless > b.chronically_homeless) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.chronically_homeless % 2 !== 0) {
                        // sort descending: alphabetically
                        rows.sort(function(a, b) {
                          if (a.chronically_homeless < b.chronically_homeless) {
                            return 1;
                          } else if (a.chronically_homeless > b.chronically_homeless) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Sheltered Homeless') {
                      clicks.sheltered_homeless++;
                      // even number of clicks
                      if (clicks.sheltered_homeless % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.sheltered_homeless < +b.sheltered_homeless) {
                            return -1;
                          } else if (+a.sheltered_homeless > +b.sheltered_homeless) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.sheltered_homeless % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.sheltered_homeless < +b.sheltered_homeless) {
                            return 1;
                          } else if (+a.sheltered_homeless > +b.sheltered_homeless) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Unsheltered Homeless') {
                      clicks.unsheltered_homeless++;
                      // even number of clicks
                      if (clicks.unsheltered_homeless % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.unsheltered_homeless < +b.unsheltered_homeless) {
                            return -1;
                          } else if (+a.unsheltered_homeless > +b.unsheltered_homeless) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.unsheltered_homeless % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.unsheltered_homeless < +b.unsheltered_homeless) {
                            return 1;
                          } else if (+a.unsheltered_homeless > +b.unsheltered_homeless) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Homeless Veterans') {
                      clicks.homeless_veterans++;
                      // even number of clicks
                      if (clicks.homeless_veterans % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_veterans < +b.homeless_veterans) {
                            return -1;
                          } else if (+a.homeless_veterans > +b.homeless_veterans) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.homeless_veterans % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_veterans < +b.homeless_veterans) {
                            return 1;
                          } else if (+a.homeless_veterans > +b.homeless_veterans) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Homeless Individuals') {
                      clicks.homeless_individuals++;
                      // even number of clicks
                      if (clicks.homeless_individuals % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_individuals < +b.homeless_individuals) {
                            return -1;
                          } else if (+a.homeless_individuals > +b.homeless_individuals) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.homeless_individuals % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_individuals < +b.homeless_individuals) {
                            return 1;
                          } else if (+a.homeless_individuals > +b.homeless_individuals) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Homeless People in Families') {
                      clicks.homeless_people_in_families++;
                      // even number of clicks
                      if (clicks.homeless_people_in_families % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_people_in_families < +b.homeless_people_in_families) {
                            return -1;
                          } else if (+a.homeless_people_in_families > +b.homeless_people_in_families) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.homeless_people_in_families % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_people_in_families < +b.homeless_people_in_families) {
                            return 1;
                          } else if (+a.homeless_people_in_families > +b.homeless_people_in_families) {
                            return -1;
                          }
                        });
                      }
                    }
                    if (d == 'Homeless Unaccompanied Youth (Under 25)') {
                      clicks.homeless_unaccompanied_youth++;
                      // even number of clicks
                      if (clicks.homeless_unaccompanied_youth % 2 == 0) {
                        // sort ascending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_unaccompanied_youth < +b.homeless_unaccompanied_youth) {
                            return -1;
                          } else if (+a.homeless_unaccompanied_youth > +b.homeless_unaccompanied_youth) {
                            return 1;
                          }
                        });
                        // odd number of clicks
                      } else if (clicks.homeless_unaccompanied_youth % 2 !== 0) {
                        // sort descending: numerically
                        rows.sort(function(a, b) {
                          if (+a.homeless_unaccompanied_youth < +b.homeless_unaccompanied_youth) {
                            return 1;
                          } else if (+a.homeless_unaccompanied_youth > +b.homeless_unaccompanied_youth) {
                            return -1;
                          }
                        });
                      }
                    }
                  }) // end of click listeners

                  //Scrollable body, frozen headers
                  document.getElementById('table_container').addEventListener('scroll', function() {
                    var translate = 'translate(0,' + this.scrollTop + 'px)';
                    this.querySelector('thead').style.transform = translate;
                  });
                } // end of GenTable()

                function GenPanelTwo() {

                  spinner_panel2.stop();

                  p2_1_map_svg.call(p2_tip)

                  // Initialize Panel 2 info
                  for (var y = 0; y < us.features.length; y++) {
                    if (us.features[y].properties.coc_number == 'CA-600') {
                      var la = us.features[y];
                      BarChart(la);
                      createCFDATableHover(la);
                      createCoCTable(la);
                    }
                  }

                  //MAP
                  var centered = null;

                  //var OnMouseOver = 'BarChart; tip.show'

                  m.selectAll('p2_1_path')
                    .data(us.features)
                    .enter().append('path')
                    .attr('d', p2_1_path)
                    .attr('id', 'counties_mini')
                    .attr('data-coc', function(d) {
                      return d.properties.coc_number;
                    })
                    .attr('data-state', function(d) {
                      return d.properties.state;
                    })
                    .attr('data-name', function(d) {
                      return d.properties.name;
                    })
                    .attr('d', p2_1_path)
                    .on('click', function(d) {
                      BarChart(d);
                      createCoCTable(d);
                      createCFDATableHover(d);
                    })
                    .style('fill', p2_getColor)
                    .on('dblclick', p2_1_clicked)
                    .on('mouseover', p2_tip.show)
                    .on('mouseout', p2_tip.hide);

                  function p2_getColor(d) {
                    for (var i = 0; i < map_data.length; i++) {
                      if (d.properties.coc_number === map_data[i].COC_Number) {
                        if (map_data[i].amount <= 500000) {
                          return ('#F2DFC3');
                        } else if (map_data[i].amount <= 1500000) {
                          return ('#EAD8B6');
                        } else if (map_data[i].amount <= 2500000) {
                          return ('#E2D1A9');
                        } else if (map_data[i].amount <= 5000000) {
                          return ('#DACA9D');
                        } else if (map_data[i].amount <= 7500000) {
                          return ('#D1C490');
                        } else if (map_data[i].amount <= 10000000) {
                          return ('#C9BE85');
                        } else if (map_data[i].amount <= 20000000) {
                          return ('#C1B97A');
                        } else if (map_data[i].amount <= 30000000) {
                          return ('#B0B46F');
                        } else if (map_data[i].amount <= 40000000) {
                          return ('#989F52');
                        } else if (map_data[i].amount <= 50000000) {
                          return ('#7F8F41');
                        } else if (map_data[i].amount <= 60000000) {
                          return ('#73863A');
                        } else if (map_data[i].amount <= 70000000) {
                          return ('#5C762C');
                        } else if (map_data[i].amount <= 80000000) {
                          return ('#466520');
                        } else if (map_data[i].amount <= 90000000) {
                          return ('#325416');
                        } else if (map_data[i].amount <= 100000000) {
                          return ('#20440D');
                        } else if (map_data[i].amount <= 150000000) {
                          return ('#0C2B04');
                        } else if (map_data[i].amount <= 200000000) {
                          return ('#041A01');
                        } else {
                          return ('#000A000')
                        }
                      }
                    }
                  }
                } // end of GenPanelTwo
                function p2_1_clicked(d) {
                  var x, y, k;

                  //console.log('Panel 2 clicked, d: ',d);

                  for (var i = 0; i < states.length; i++) {
                    if (d.properties.STUSAB == states[i].Abbrv) {
                      for (var h = 0; h < json.features.length; h++) {
                        if (states[i].State == json.features[h].properties.NAME) {
                          var n = json.features[h]
                          //console.log('clicked n: ',n);
                          if (n && centered !== n) {
                            var centroid = p2_1_path.centroid(n)
                            x = centroid[0]
                            y = centroid[1]

                            console.log('area: ', n.properties);
                            if (n.properties.NAME === 'Florida') {
                              k = 4.0
                            } else if (n.properties.NAME === 'Michigan') {
                              k = 5
                            } else if (n.properties.NAME === 'Idaho') {
                              k = 3
                            } else if (n.properties.NAME === 'Alaska') {
                              k = 5.0
                            } else if (n.properties.NAME === 'Hawaii') {
                              k = 6.5
                            } else if (n.properties.NAME === 'New Jersey') {
                              k = 12
                            } else if (n.properties.NAME === 'Illinois') {
                              k = 5
                            } else if (n.properties.NAME === 'Nevada') {
                              k = 3.5
                            } else if (n.properties.NAME === 'Maryland') {
                              k = 14
                            } else if (n.properties.CENSUSAREA <= 8000) {
                              k = 17.0
                            } else if (n.properties.CENSUSAREA > 8000 && n.properties.CENSUSAREA <= 10000) {
                              k = 11.25
                            } else if (n.properties.CENSUSAREA > 10000 && n.properties.CENSUSAREA <= 15000) {
                              k = 11.0
                            } else if (n.properties.CENSUSAREA > 15000 && n.properties.CENSUSAREA <= 30000) {
                              k = 9.0
                            } else if (n.properties.CENSUSAREA > 30000 && n.properties.CENSUSAREA <= 50000) {
                              k = 6.6
                            } else if (n.properties.CENSUSAREA > 50000 && n.properties.CENSUSAREA <= 70000) {
                              k = 6.05
                            } else if (n.properties.CENSUSAREA > 70000 && n.properties.CENSUSAREA <= 90000) {
                              k = 5.5
                            } else if (n.properties.CENSUSAREA > 90000 && n.properties.CENSUSAREA <= 110000) {
                              k = 5.25
                            } else if (n.properties.CENSUSAREA > 110000 && n.properties.CENSUSAREA <= 130000) {
                              k = 3.0
                            } else if (n.properties.CENSUSAREA > 130000 && n.properties.CENSUSAREA <= 150000) {
                              k = 2.75
                            } else {
                              k = 2.55
                            };
                            centered = n;

                          } else {
                            x = map_width / 1.35;
                            y = map_height / 1.1;
                            k = 1;
                            centered = null;

                          }

                          m.selectAll('p2_1_path')
                            .classed('active', centered && function(d) {
                              return d === centered;
                            });

                          m.transition()
                            .duration(750)
                            .attr('transform', 'translate(' + map_width / 1.35 + ',' + map_height / 1.1 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
                            .style('stroke-width', .15 / k + 'px');
                        }
                      }
                    }
                  }
                }

                function p2_1_clicked_p1(d) {
                  var x, y, k;
                  //console.log('Panel 2 clicked, d: ',d);

                  for (var i = 0; i < states.length; i++) {
                    if (d.properties.STUSAB == states[i].Abbrv) {
                      for (var h = 0; h < json.features.length; h++) {
                        if (states[i].State == json.features[h].properties.NAME) {
                          var n = json.features[h]
                          var centroid = p2_1_path.centroid(n)
                          x = centroid[0]
                          y = centroid[1]

                          if (n.properties.NAME === 'Florida') {
                            k = 4.0
                          } else if (n.properties.NAME === 'Michigan') {
                            k = 5
                          } else if (n.properties.NAME === 'Idaho') {
                            k = 3
                          } else if (n.properties.NAME === 'Alaska') {
                            k = 5.0
                          } else if (n.properties.NAME === 'Hawaii') {
                            k = 6.5
                          } else if (n.properties.NAME === 'New Jersey') {
                            k = 12
                          } else if (n.properties.NAME === 'Illinois') {
                            k = 5
                          } else if (n.properties.NAME === 'Nevada') {
                            k = 3.5
                          } else if (n.properties.NAME === 'Maryland') {
                            k = 14
                          } else if (n.properties.CENSUSAREA <= 8000) {
                            k = 17.0
                          } else if (n.properties.CENSUSAREA > 8000 && n.properties.CENSUSAREA <= 10000) {
                            k = 11.25
                          } else if (n.properties.CENSUSAREA > 10000 && n.properties.CENSUSAREA <= 15000) {
                            k = 11.0
                          } else if (n.properties.CENSUSAREA > 15000 && n.properties.CENSUSAREA <= 30000) {
                            k = 9.0
                          } else if (n.properties.CENSUSAREA > 30000 && n.properties.CENSUSAREA <= 50000) {
                            k = 6.6
                          } else if (n.properties.CENSUSAREA > 50000 && n.properties.CENSUSAREA <= 70000) {
                            k = 6.05
                          } else if (n.properties.CENSUSAREA > 70000 && n.properties.CENSUSAREA <= 90000) {
                            k = 5.5
                          } else if (n.properties.CENSUSAREA > 90000 && n.properties.CENSUSAREA <= 110000) {
                            k = 5.25
                          } else if (n.properties.CENSUSAREA > 110000 && n.properties.CENSUSAREA <= 130000) {
                            k = 3.0
                          } else if (n.properties.CENSUSAREA > 130000 && n.properties.CENSUSAREA <= 150000) {
                            k = 2.75
                          } else {
                            k = 2.55
                          };
                          centered = n;

                          m.selectAll('p2_1_path')
                            .classed('active', centered && function(d) {
                              return d === centered;
                            });

                          m.transition()
                            .duration(750)
                            .attr('transform', 'translate(' + map_width / 1.35 + ',' + map_height / 1.1 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
                            .style('stroke-width', .15 / k + 'px');
                        }
                      }
                    }
                  }
                }

                function createCoCTable(d) {
                  $('#panel_coc').empty();
                  coc_panel.append('div')
                    .attr('id', 'coc_info')
                    .attr('height', info_height + margin.top + margin.bottom)
                    .attr('width', info_width + margin.left + margin.right)
                    .html('<h1 class="panel_title">' + d.properties.COCNAME + '</h1>' +
                      '<h3 class="panel_desc">' + d.properties.CONTACT_TY +
                      '<br />' + '</h3>' + '<p class="panel_text">' + d.properties.FIRST_NAME + ' ' +
                      d.properties.LAST_NAME + '<br />' + d.properties.TITLE + '<br /><br />' + 'Email: ' +
                      d.properties.EMAIL_ADDR + '<br />' + 'Phone: ' + d.properties.PRIMARY_PH + '</p>');
                }

                function createCFDATableHover(d) {
                  //console.log('cfdaTable d: ', d)
                  $('#panel_info').empty();

                  var coc = d.properties.coc_number;
                  //console.log('coc: ',coc)
                  function filter_cocNum_cfda(bar_chrt) {
                    return bar_chrt.coc_number == coc;
                  }

                  var initial = bar_chrt.filter(filter_cocNum_cfda);
                  var initial_coc_poss = initial.filter(filter_cfdaAmount)
                  //console.log('initial: ',initial);

                  info_panel.append('div')
                    .attr('id', 'cfda_info_header')
                    .attr('height', info_height + margin.top + margin.bottom)
                    .attr('width', info_width + margin.left + margin.right + 60)
                    .html('<table class ="icon">' + '<th class="head_val">CFDA</th>' +
                      '<th class="head_name">Program Title</th>' + '</table>')

                  for (var i = 0; i < initial_coc_poss.length; i++) {
                    info_panel.append('div')
                      .attr('id', 'cfda_info')
                      //.attr('height', info_height + margin.top + margin.bottom)
                      //.attr('width', info_width + margin.left + margin.right+60)
                      .style('margin-bottom', '2px')
                      .html('<table class ="icon">' +
                        '<tr>' + '<td class="val">' + initial_coc_poss[i].cfda_number + '</td>' +
                        '<td class="name" title="Click to visit program website">' + '<a href=' +
                        initial_coc_poss[i].CFDA_website + '>' + initial_coc_poss[i].program_title +
                        '</a>' + '</td>' + '</tr>' + '</table>')
                  }
                }

                function filter_cfdaAmount(x) {
                  return x.fed_funding > 0;
                }

                function BarChart(d) {

                  d3.select('#panel_matrix > svg').remove()

                  var p2_3_matrix_svg = d3.select('#panel_matrix').append('svg')
                    /*.attr('width', matrix_width + margin.left + margin.right)
                    .attr('height', matrix_height + margin.top + margin.bottom)*/
                    .attr('width', map_width + margin.left + margin.right + 50)
                    .attr('height', map_height + margin.top + margin.bottom + 40)
                    .style('margin-left', -margin.left / 2.5 + 'px')
                    .attr('transform', 'translate(' + 40 + ',' + 10 + ')');

                  p2_3_matrix_svg.call(p2_3_bar_tip);

                  function filter_cocNum_barChart(bar_chrt) {
                    return bar_chrt.coc_number == d.properties.coc_number;
                  }

                  var initial = bar_chrt.filter(filter_cocNum_barChart);
                  var initial_bar = initial.filter(filter_cfdaAmount);
                  var formatNumber = d3.format('$,');

                  var axisMargin = 5,
                    x_width = 470,
                    barHeight = 18,
                    barPadding = 5,
                    bar, scale, p2_xAxis, labelWidth = 0;

                  max = d3.max(initial_bar, function(d) {
                    return d.fed_funding;
                  });

                  bar = p2_3_matrix_svg.selectAll('g')
                    .data(initial_bar)
                    .enter()
                    .append('g');

                  bar.attr('class', 'bar')
                    .attr('cx', 0)
                    .style('fill', function(d) {
                      if (d.category == 'Housing') {
                        return '#7B4C66'
                      } else if (d.category == 'Food') {
                        return '#CC5500'
                      } else if (d.category == 'Health') {
                        return '#297B84'
                      } /*else if (d.category == 'Research') {
                        return '#A08E39'
                      }*/ else if (d.category == 'Education') {
                        return '#A08E39'
                      } else if (d.category == 'Support Services') {
                        return '#A9B2C3'
                      } else if (d.category == 'Employment') {
                        return '#006A4E'
                      }
                    })
                    .attr('transform', function(d, i) {
                      return 'translate(0,' + (i * (barHeight + barPadding)) + ')';
                    })
                    .on('mouseover', p2_3_bar_tip.show)
                    .on('mouseout', p2_3_bar_tip.hide);

                  bar.append('text')
                    .attr('class', 'label')
                    .attr('x', 15)
                    .attr('y', barHeight / 2)
                    .attr('dy', '.35em') //vertical align middle
                    .text(function(d) {
                      return d.cfda_number;
                    }).each(function() {
                      labelWidth = 50;
                    });

                  scale = d3.scale.linear()
                    .domain([0, max])
                    .range([0, x_width - labelWidth]);

                  p2_xAxis = d3.svg.axis()
                    //.orient('bottom')
                    .scale(scale)
                    .tickSize(-p2_matrix_svg[0][0].attributes[1].nodeValue + axisMargin)
                    .tickFormat(function(d) {
                      return formatNumber(d);
                    });

                  yAxis = d3.svg.axis()
                    .orient('left');

                  bar.append('rect')
                    .attr('transform', 'translate(' + labelWidth + ',0)')
                    .attr('margin-left', 5)
                    //.attr('rx','30')
                    .attr('height', barHeight)
                    .attr('width', function(d) {
                      return scale(d.fed_funding);
                    });

                  p2_3_matrix_svg.insert('g', ':first-child')
                    .attr('class', 'axisHorizontal')
                    .attr('transform', 'translate(' + labelWidth + ',' + 255 + ')')
                    .call(p2_xAxis)
                    .selectAll('text')
                    .attr('y', 10)
                    .attr('x', 0)
                    .attr('dy', '.35em')
                    .attr('transform', 'rotate(-35)')
                    .style('font-size', '12')
                    .style('text-anchor', 'end');

                  p2_3_matrix_svg.insert('g', ':first-child')
                    .classed('y axis', true)
                    .call(yAxis)
                    .append('text')
                    .classed('p2_label', true)
                    .attr('transform', 'rotate(-90)')
                    .attr('x', -8)
                    .attr('y', -1.05)
                    .attr('dy', '.71em')
                    .style('text-anchor', 'end')
                    .text('Federal Programs Covering Homelessness');
                }
                var cfda_legend_title = d3.select('#p2_3_legend_title')
                  .append('div')
                  .attr('class', 'p2_3_legend_title')
                  .attr('width', map_width + margin.left + margin.right)
                  .html('<h5>CFDA Program Category</h5>')
                  .style('text-anchor', 'center');

                var cfda_legend = d3.select('#p2_3_legend')
                  .append('div')
                  .attr('width', map_width + margin.left + margin.right)
                  .attr('padding', '50px 0 0 50px');

                /*var cfda_color = ['#7B4C66', '#C98845', '#CC5500', '#297B84', '#4A8D5B', '#759043',
                  '#A08E39', '#4A6C87', '#A9B2C3', '#006A4E'
                ]

                var cfda_legend_key_values = ['Housing', 'Housing & Education', 'Services', 'Health',
                  'Support Services', 'Housing & Services', 'Health & Housing', 'Education & Services',
                  'Housing & Research', 'Employment'
                ];*/
                var cfda_color = ['#7B4C66', '#CC5500', '#297B84', '#4A6C87', '#006A4E',
                   '#A9B2C3', /*'#A08E39'*/
                ]

                var cfda_legend_key_values = ['Housing', 'Food', 'Health', 'Education',
                  'Employment', 'Support Services', /*'Research'*/
                ];

                for (var i = 0; i < 7; i++) {

                  var l = cfda_legend.append('div')
                    .attr('id', 'p2_3_legend_key');

                  var cfda_key = l.append('div')
                    .attr('id', 'p2_3_key')
                    .style('position', 'relative')
                    .append('svg')
                    .attr('height', '40px')
                    .attr('width', '53px')
                    .append('rect')
                    .attr('x', 7)
                    .attr('y', 7)
                    .attr('height', 30)
                    .attr('width', 30)
                    .style('fill', function(d) {
                      return cfda_color[i];
                    });

                  l.append('div')
                    .attr('id', 'p2_3_key_value')
                    .style('position', 'relative')
                    .style('color', 'blue')
                    .html('<p>' + cfda_legend_key_values[i] + '</p>');
                }
              })
            })
          })
        })
      })
    })
  })
})
