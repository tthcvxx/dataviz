function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHourlyData(days) {
    const data = [];
    for (let day = 1; day <= days; day++) {
        const hoursInDay = 24;
        const powerOnHours = getRandomInt(4, 8);
        const powerOnIndices = new Set();

        while (powerOnIndices.size < powerOnHours) {
            powerOnIndices.add(getRandomInt(0, hoursInDay - 1));
        }

        for (let hour = 0; hour < hoursInDay; hour++) {
            data.push({
                day: day,
                hour: hour,
                power: powerOnIndices.has(hour) ? 1 : 0
            });
        }
    }
    return data;
}

const data = generateHourlyData(14);

// Setup chart dimensions and margins
const margin = { top: 60, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Set up scales
const x = d3.scaleBand()
    .domain(d3.range(1, 15))
    .range([0, width])
    .paddingInner(0)
    .paddingOuter(0);

const y = d3.scaleLinear()
    .domain([0, 24])
    .range([height, 0]);

// Create the SVG container
const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)  // Extra space for title and subtitle
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text("Blackouts: A New Norm for Ukrainians");

// Add subtitle
svg.append("text")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .style("font-family", "Arial, sans-serif")
    .style("font-size", "16px")
    .style("font-style", "italic")
    .text("Managing life, work, and studies in between power outages");

// Draw the bars
data.forEach(d => {
    svg.append("rect")
        .attr("class", d.power === 1 ? "power-on" : "power-off")
        .attr("x", x(d.day))
        .attr("y", y(d.hour + 1))  // +1 to ensure the bars align correctly
        .attr("width", x.bandwidth())
        .attr("height", y(d.hour) - y(d.hour + 1));  // Ensure the height corresponds to one hour
});

// Add the x-axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => `Day ${d}`));

// Add the y-axis
svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(24).tickFormat(d => `${d}:00`));
