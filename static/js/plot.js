function DrawBarGraph(sampleID) {

    console.log("DrawBarGraph: Sample: ", sampleID);

    d3.json("static/data/samples.json").then((importedData) => {

        var data = importedData.samples;
        var resultArray = data.filter(sampleObj => sampleObj.id == sampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // Trace1 for the Bar Data
        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
            name: "OTU",
            type: "bar",
            orientation: "h"
        }
        // data
        var chartData = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
            title: "Top 10 Bacterial Specimens",
            margin: { t: 30, l: 150 }
        }

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", chartData, layout);
    })

}

function DrawBubbleChart(sampleID) {

    console.log("DrawBubbleChart: Sample: ", sampleID);

    d3.json("static/data/samples.json").then((importedData) => {

        var data = importedData.samples;
        var resultArray = data.filter(sampleObj => sampleObj.id == sampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;


        // Trace2 for the Bubble Data
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
        // data
        var bubbleData = [trace2];

        // Apply the group bar mode to the layout
        var bubblelayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        }

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bubble", bubbleData, bubblelayout);
    })

}

function ShowMetaData(sampleID) {

    console.log("ShowMetaData: Sample: ", sampleID);

    d3.json("static/data/samples.json").then((importedData) => {

        var metadata = importedData.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            PANEL.append("h6").text(textToShow);
        });
    });
}

function optionChanged(newSampleID) {

    console.log("Dropdown changed to: ", newSampleID);

    ShowMetaData(newSampleID);
    DrawBarGraph(newSampleID);
    DrawBubbleChart(newSampleID);

}

function Init() {

    console.log("Initializing Screen");

    // Populate the Dropdown with all sample ID's
    var selector = d3.select("#selDataset");

    d3.json("static/data/samples.json").then((SampleData) => {
        // console.log(importedData);
        var SampleName = SampleData.names;

        SampleName.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var sample = SampleName[0];

        ShowMetaData(sample);
        DrawBarGraph(sample);
        DrawBubbleChart(sample);

    });
}

Init();

