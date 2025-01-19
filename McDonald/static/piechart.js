function fetchDataAndUpdatePiechart(){
    fetch('/get-datapiechart')
    .then(response=>response.json())
    .then(data=>{
        updatePiechart(data)
    })
    .catch(error => console.error('Error:', error))
}


function updatePiechart(data_df){
         am5.ready(function(){

            var root = am5.Root.new("piechartdiv");
            root.setThemes([
                am5themes_Animated.new(root),
              ]);
            var chart = root.container.children.push( 
            am5percent.PieChart.new(root, {
                layout: root.verticalHorizontal
            }) 
            );

           

            // Create series
            var series = chart.series.push(
            am5percent.PieSeries.new(root, {
                name: "Series",
                valueField: "values",
                categoryField: "categories"
            })
            );
            series.data.setAll(data_df);

            // Add legend
            var legend = chart.children.push(am5.Legend.new(root, {
            centerY: am5.percent(50),
            y: am5.percent(100),
            layout: root.horizontalLayout
            }));

            legend.data.setAll(series.dataItems);
         }
         
         
         )
}

document.addEventListener('DOMContentLoaded', function(){
    fetchDataAndUpdatePiechart();
});