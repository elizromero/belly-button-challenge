// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id.toString() === sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(info) ){
      let upperkey = key.toUpperCase();
      panel.append("h6").text(`${upperkey}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;


    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Rainbow"
      },
      text: otu_labels
    };
    let bubble_traces = [bubble_trace];

    let bubble_layout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubble_traces, bubble_layout);

    

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(x => `OTU ${x}`);

    // Build a Bar Chart
    let trace_1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.reverse(),
      type: "bar",
      marker: {
        colorscale: 'Plasma',
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),  // Full labels for hover text
      orientation: "h"
    };
    let traces = [trace_1];

    let bar_layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", traces, bar_layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      dropdown.append("option").text(name).property("value", name);
    }

    // Get the first sample from the list
    let default_name = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
