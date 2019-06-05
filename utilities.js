function d3svg(width,height,builder) {
    var document = new JSDOM("<html><body></body></html>");
    var svg = d3.select(document.window.document.body).append('svg');
    builder(svg);
    return $$.svg(`<svg width=${width} height=${height}>` + svg.html() + "</svg>");
}

function d3bar(data, xlabel, ylabel) {
    return d3svg(640,320,(svg) => {
        svg.append('rect').attr('width', 640).attr('height', 320).attr('fill', '#2F4A6D');
        const margin = 40;
        const height = 320 - 2 * margin;
        const width = 640 - 2 * margin;
        const vmax = data.map((s) => s.value * 1.1).reduce(function(a, b) { return Math.max(a, b); });
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, vmax]);
        const xScale = d3.scaleBand().range([0, width]).domain(data.map((s) => s.label)).padding(0.2);
        const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
        chart.append('g').attr('color','#fff').call(d3.axisLeft(yScale));
        chart.append('g').attr('color','#fff').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
        chart.selectAll().data(data).enter()
            .append('rect')
            .attr('fill', '#80cbc4')
            .attr('x', (s) => xScale(s.label))
            .attr('y', (s) => yScale(s.value))
            .attr('height', (s) => height - yScale(s.value))
            .attr('width', xScale.bandwidth());
        if (ylabel) {
            svg.append('text').attr('x', -(height / 2) - margin)
                .attr('y', margin / 2.4)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('fill', '#fff')
                .text(ylabel);
        }
        if (xlabel) {
            svg.append('text')
                .attr('x', width / 2 + margin)
                .attr('y', height + 2 * margin - 10)
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .text(xlabel);            
        }
    });
}

function d3plot(data, xlabel, ylabel) {
    return d3svg(640,320,(svg) => {
        svg.append('rect').attr('width', 640).attr('height', 320).attr('fill', '#2F4A6D');
        const margin = 40;
        const height = 320 - 2 * margin;
        const width = 640 - 2 * margin;
        const xmin = data.map((s) => s.x).reduce(function(a, b) { return Math.min(a, b); });
        const xmax = data.map((s) => s.x * 1.1).reduce(function(a, b) { return Math.max(a, b); });
        const vmax = data.map((s) => s.y * 1.1).reduce(function(a, b) { return Math.max(a, b); });
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, vmax]);
        const xScale = d3.scaleLinear().range([0,width]).domain([xmin, xmax]);
        const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
        const yAxisLoc = xScale(Math.max(0.0, xmin));
        chart.append('g').attr('color','#fff').attr('transform', `translate(${yAxisLoc},0)`).call(d3.axisLeft(yScale));
        chart.append('g').attr('color','#fff').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
        chart.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return xScale(d.x); } )
              .attr("cy", function (d) { return yScale(d.y); } )
              .attr("r", 4)
              .style("fill", function (d) { return (d.color) ? d.color : '#80cbc4'; } )
        if (ylabel) {
            svg.append('text').attr('x', -(height / 2) - margin)
                .attr('y', margin / 2.4)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('fill', '#fff')
                .text(ylabel);
        }
        if (xlabel) {
            svg.append('text')
                .attr('x', width / 2 + margin)
                .attr('y', height + 2 * margin - 10)
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .text(xlabel);            
        }
    });
}

function d3fit(data, xlabel, ylabel, model) {
    return d3svg(640,320,(svg) => {
        svg.append('rect').attr('width', 640).attr('height', 320).attr('fill', '#2F4A6D');
        const margin = 40;
        const height = 320 - 2 * margin;
        const width = 640 - 2 * margin;
        const xmax = data.map((s) => s.x * 1.1).reduce(function(a, b) { return Math.max(a, b); });
        const vmax = data.map((s) => s.y * 1.1).reduce(function(a, b) { return Math.max(a, b); });
        const yScale = d3.scaleLinear().range([height, 0]).domain([0, vmax]);
        const xScale = d3.scaleLinear().range([0,width]).domain([0, xmax]);
        const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
        chart.append('g').attr('color','#fff').call(d3.axisLeft(yScale));
        chart.append('g').attr('color','#fff').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
        chart.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return xScale(d.x); } )
              .attr("cy", function (d) { return yScale(d.y); } )
              .attr("r", 4)
              .style("fill", function (d) { return (d.color) ? d.color : '#80cbc4'; } )
        chart.append("path")
            .datum(_.range(0,xmax,xmax/10.0))
            .attr("stroke", "#fff")
            .attr("d", d3.line().x(x => xScale(x)).y(d => yScale(model(d))));
        if (ylabel) {
            svg.append('text').attr('x', -(height / 2) - margin)
                .attr('y', margin / 2.4)
                .attr('transform', 'rotate(-90)')
                .attr('text-anchor', 'middle')
                .attr('fill', '#fff')
                .text(ylabel);
        }
        if (xlabel) {
            svg.append('text')
                .attr('x', width / 2 + margin)
                .attr('y', height + 2 * margin - 10)
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')
                .text(xlabel);            
        }
    });
}

function d3decision(f, xrange, yrange, colors, points) {
    return d3svg(640,320,(svg) => {
        svg.append('rect').attr('width', 640).attr('height', 320).attr('fill', '#2F4A6D');
        const res = 50;
        const margin = 40;
        const height = 320 - 2 * margin;
        const width = 640 - 2 * margin;
        const yScale = d3.scaleLinear().range([height, 0]).domain(yrange);
        const xScale = d3.scaleLinear().range([0, width]).domain(xrange);
        const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
        const dx = (xrange[1]-xrange[0])/res;
        const dy = (yrange[1]-yrange[0])/res;
        var data = [];
        for (var x of _.range(xrange[0], xrange[1], dx)) {
            for (var y of _.range(yrange[0], yrange[1], dy))
                data.push([x, y, colors[f(x,y)]]);
        }
        chart.append('g').attr('color','#fff').call(d3.axisLeft(yScale));
        chart.append('g').attr('color','#fff').attr('transform', `translate(0, ${height})`).call(d3.axisBottom(xScale));
        chart.selectAll().data(data).enter()
            .append('rect')
            .attr('fill', d => d[2]).attr('fill-opacity', '0.5')
            .attr('x', d => xScale(d[0]) + 1)
            .attr('y', d => yScale(d[1]) - height/res - 1)
            .attr('height', height/res)
            .attr('width', width/res);
        if (points) {
            chart.append('g')
                .selectAll("dot")
                .data(points)
                .enter()
                .append("circle")
                  .attr("cx", function (d) { return xScale(d.x); } )
                  .attr("cy", function (d) { return yScale(d.y); } )
                  .attr("r", 4)
                  .style("fill", function (d) { return (d.color) ? d.color : '#80cbc4'; } )            
        }
    });
}

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function project(data, x, y) {
    return data.map(o => { return {x: o[x], y: o[y]}; });
}

module.exports = {d3svg, d3bar, d3plot, d3fit, d3decision, argMax, project};
