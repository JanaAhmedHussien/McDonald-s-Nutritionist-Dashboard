document.addEventListener('DOMContentLoaded', function () {
    var chartInstance; // Variable to hold the chart instance

    getData();

    document.getElementById('HealthCategory').addEventListener('change', function () {
        getData();
    });

    function getData() {
        var selectedCategory = document.getElementById('HealthCategory').value;

        fetch(`/get-databarchart/${selectedCategory}`)
            .then(response => response.json())
            .then(data_df => {
                if (chartInstance) {
                    // Update the existing chart
                    updateChartData(chartInstance, data_df);
                } else {
                    // Create a new chart
                    chartInstance = createChart(data_df);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function createChart(data_df) {
        var root = am5.Root.new("barchartdiv");
        root.setThemes([
            am5themes_Animated.new(root),
        ]);
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            paddingLeft: 0,
            paddingRight: 1
        }));
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            minorGridEnabled: true
        });
        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });
        xRenderer.grid.template.setAll({
            location: 1
        });

        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "categories",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        var yRenderer = am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
        });

        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            renderer: yRenderer
        }));

        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "values",
            sequencedInterpolation: true,
            categoryXField: "categories",
            tooltip: am5.Tooltip.new(root, {
                labelText: "[bold]mean:{valueY}"
            })
        }));

        series.columns.template.setAll({cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0});
        series.columns.template.adapters.add("fill", function (fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        series.columns.template.adapters.add("stroke", function (stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        // Initialize chart with data
        xAxis.data.setAll(data_df);
        series.data.setAll(data_df);

        return chart;
    }

    function updateChartData(chart, data_df) {
        // Assuming the first xAxis and series are the ones to be updated
        chart.xAxes.getIndex(0).data.setAll(data_df);
        chart.series.getIndex(0).data.setAll(data_df);

        chart.appear(1000, 100);
    }
});





