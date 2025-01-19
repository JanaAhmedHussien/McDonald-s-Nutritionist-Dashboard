document.addEventListener('DOMContentLoaded', function () {
  var chartInstance; // Variable to hold the chart instance

  getData();

  document.getElementById('HealthCategory').addEventListener('change', function () {
      getData();
  });

  function getData() {
      var selectedCategory = document.getElementById('HealthCategory').value;

      fetch(`/get-datahorizontalchart1/${selectedCategory}`)
          .then(response => response.json())
          .then(data_df => {
              if (chartInstance) {
                  // Update the existing chart
                  updateChartData2(chartInstance, data_df);
              } else {
                  // Create a new chart
                  chartInstance = createChart2(data_df);
              }
          })
          .catch(error => console.error('Error:', error));
  }
function createChart2(data_df){
    
        var root = am5.Root.new("horizontalbarchartdiv");
        var myTheme = am5.Theme.new(root);

            myTheme.rule("Grid", ["base"]).setAll({
            strokeOpacity: 0.1
            });
            root.setThemes([
                am5themes_Animated.new(root),
                myTheme
              ]);
              var chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                  panX: false,
                  panY: false,
                  wheelX: "none",
                  wheelY: "none",
                  paddingLeft: 0
                })
              );
           
              var yRenderer = am5xy.AxisRendererY.new(root, {
                minGridDistance: 30,
                minorGridEnabled: true
              });
              yRenderer.grid.template.set("location", 1);
              
              var yAxis = chart.yAxes.push(
                am5xy.CategoryAxis.new(root, {
                  maxDeviation: 0,
                  categoryField: "categories",
                  renderer: yRenderer
                })
              );
              
              var xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                  maxDeviation: 0,
                  min: 0,
                  renderer: am5xy.AxisRendererX.new(root, {
                    visible: true,
                    strokeOpacity: 0.1,
                    minGridDistance: 80
                  })
                })
              );
              
              
              var series = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                  name: "Series 1",
                  xAxis: xAxis,
                  yAxis: yAxis,
                  valueXField: "values",
                  sequencedInterpolation: true,
                  categoryYField: "categories"
                })
              );
              
              var columnTemplate = series.columns.template;
              
              columnTemplate.setAll({
                draggable: true,
                cursorOverStyle: "pointer",
                tooltipText:"[bold]mean:{values}",
                cornerRadiusBR: 10,
                cornerRadiusTR: 10,
                strokeOpacity: 0
              });
              columnTemplate.adapters.add("fill", (fill, target) => {
                return chart.get("colors").getIndex(series.columns.indexOf(target));
              });
              
              columnTemplate.adapters.add("stroke", (stroke, target) => {
                return chart.get("colors").getIndex(series.columns.indexOf(target));
              });
              
              columnTemplate.events.on("dragstop", () => {
                sortCategoryAxis();
              });
              
              // Get series item by category
              function getSeriesItem(category) {
                for (var i = 0; i < series.dataItems.length; i++) {
                  var dataItem = series.dataItems[i];
                  if (dataItem.get("categoryY") == category) {
                    return dataItem;
                  }
                }
              }
              
              
              // Axis sorting
              function sortCategoryAxis() {
                // Sort by value
                series.dataItems.sort(function (x, y) {
                  return y.get("graphics").y() - x.get("graphics").y();
                });
              
                var easing = am5.ease.out(am5.ease.cubic);
              
                // Go through each axis item
                am5.array.each(yAxis.dataItems, function (dataItem) {
                  // get corresponding series item
                  var seriesDataItem = getSeriesItem(dataItem.get("categories"));
              
                  if (seriesDataItem) {
                    // get index of series data item
                    var index = series.dataItems.indexOf(seriesDataItem);
              
                    var column = seriesDataItem.get("graphics");
              
                    // position after sorting
                    var fy =
                      yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
                      column.height() / 2;
              
                    // set index to be the same as series data item index
                    if (index != dataItem.get("index")) {
                      dataItem.set("index", index);
              
                      // current position
                      var x = column.x();
                      var y = column.y();
              
                      column.set("dy", -(fy - y));
                      column.set("dx", x);
              
                      column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
                      column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
                    } else {
                      column.animate({ key: "y", to: fy, duration: 600, easing: easing });
                      column.animate({ key: "x", to: 0, duration: 600, easing: easing });
                    }
                  }
                });
           
                yAxis.dataItems.sort(function (x, y) {
                  return x.get("index") - y.get("index");
                });
              }

              yAxis.data.setAll(data_df);
              series.data.setAll(data_df);

              return chart;
            
              
    }

    function updateChartData2(chart, data_df) {
      // Assuming the first xAxis and series are the ones to be updated
      chart.yAxes.getIndex(0).data.setAll(data_df);
      chart.series.getIndex(0).data.setAll(data_df);

      chart.appear(1000, 100);
  }
    



});