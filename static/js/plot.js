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
            yaxis: { title: "Number of Bacteria" },
            margin: { t: 30 }
        }

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bubble", bubbleData, bubblelayout);
    })

}

function DrawGaugeChart(sampleID) {

    console.log("DrawGaugeChart: Sample: ", sampleID);

    d3.json("static/data/samples.json").then((importedData) => {

        var data = importedData.metadata;
        var resultArray = data.filter(sampleObj => sampleObj.id == sampleID);
        var result = resultArray[0];

        console.log(result);

        var BB_Scrubs = result.wfreq;

        console.log(BB_Scrubs);
        console.log(result.wfreq);

        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: BB_Scrubs,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 1], color: "rgb(246,240,231)" },
                        { range: [1, 2], color: "rgb(241,238,222)" },
                        { range: [2, 3], color: "rgb(228,226,189)" },
                        { range: [3, 4], color: "rgb(223,228,161)" },
                        { range: [4, 5], color: "rgb(204,226,136)" },
                        { range: [5, 6], color: "rgb(169,196,125)" },
                        { range: [6, 7], color: "rgb(122,182,115)" },
                        { range: [7, 8], color: "rgb(119,176,123)" },
                        { range: [8, 9], color: "rgb(114,168,118)" }
                    ]

                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

        Plotly.newPlot('gauge', data, layout);
    });

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
    DrawGaugeChart(newSampleID)

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
        DrawGaugeChart(sample)

    });
}

Init();

