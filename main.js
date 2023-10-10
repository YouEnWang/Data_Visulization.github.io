// // 期中報告
// 已確認資料無空值

// deal with empty value
const parseNA = string => (string === 'NA' ? undefined : string);

// 數字處理
// Sales的單位是million
function type(d){
    return{
        Rank: +d.Rank, 
        Name: parseNA(d.Name), 
        Platform: parseNA(d.Platform), 
        Year: +d.Year,
        Genre: parseNA(d.Genre), 
        Publisher: parseNA(d.Publisher), 
        NA_Sales: +d.NA_Sales, 
        EU_Sales: +d.EU_Sales, 
        JP_Sales: +d.JP_Sales, 
        Other_Sales: +d.Other_Sales, 
        Global_Sales: +d.Global_Sales
    }
}

// Data selection
// 主要選擇2010 ~ 2020之間的資料
function filterData(data){
    return data.filter(
        d => {
            return(
                d.Year >= 2010 && d.Year <= 2020 &&
                d.Name &&
                d.Platform &&
                d.Genre &&
                d.NA_Sales > 0 &&
                d.EU_Sales > 0 &&
                d.JP_Sales > 0 &&
                d.Other_Sales > 0 &&
                d.Global_Sales > 0
            );
        }
    );
}

// 依照遊戲類型(Genre)進行分類
// 將各類型的NA_Sales, EU_Sales, JP_Sales, Other_Sales, Global_Sales分別加總
function prepareData(data, state){
    console.log(data, state);
    if (state == 0){
        const dataMap = d3.rollup(
            data,
            v => d3.sum(v, leaf => leaf.NA_Sales),
            d => d.Genre
        );

        const dataArray = Array.from(dataMap, d => ({Genre:d[0], NA_Sales:d[1]}));
        return dataArray;
    }
    else if (state == 1){
        const dataMap1 = d3.rollup(
            data,
            v => d3.sum(v, leaf => leaf.EU_Sales),
            d => d.Genre
        );

        const dataArray1 = Array.from(dataMap1, d => ({Genre:d[0], EU_Sales:d[1]}));
        return dataArray1;
    }
    else if (state == 2){
        const dataMap2 = d3.rollup(
            data,
            v => d3.sum(v, leaf => leaf.JP_Sales),
            d => d.Genre
        );

        const dataArray2 = Array.from(dataMap2, d => ({Genre:d[0], JP_Sales:d[1]}));
        return dataArray2;
    }
    else if (state == 3){
        const dataMap3 = d3.rollup(
            data,
            v => d3.sum(v, leaf => leaf.Other_Sales),
            d => d.Genre
        );

        const dataArray3 = Array.from(dataMap3, d => ({Genre:d[0], Other_Sales:d[1]}));
        return dataArray3;
    }
    else{
        const dataMap4 = d3.rollup(
            data,
            v => d3.sum(v, leaf => leaf.Global_Sales),
            d => d.Genre
        );

        const dataArray4 = Array.from(dataMap4, d => ({Genre:d[0], Global_Sales:d[1]}));
        return dataArray4;
    }

    // 嘗試把rollup後的資料彙整在一起，但下段程式不太可行
    // const combineData = new Array(...dataMap, ...dataMap1, ...dataMap2, ...dataMap3, ...dataMap4);
    // const dataArray = Array.from(combineData, d => ({Genre:d[0][0], NA_Sales:d[0][1], EU_Sales:d[1][1], JP_Sales:d[2][1], Other_Sales:d[3][1], Global_Sales:d[4][1]}));
    
    // return [dataArray, dataArray1, dataArray2, dataArray3, dataArray4];
    
}


// 刻度顯示
function formatTicks(d){
    return (d3.format('~s')(d) + 'mil')
}

// 繪製svg
function setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, state){
    console.log(state);
    const svg_width = 600;
    const svg_height = 500;
    const chart_margin = {top:80,right:40,bottom:40,left:80};
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);
    const this_svg = d3.select('.bar-chart-container').append('svg')
                       .attr('width', svg_width).attr('height',svg_height)
                       .append('g')
                       .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);
    
    if (state == 0){
        // Scale
        const xMax = d3.max(Data_NA, d=>d.NA_Sales);
        const xScale = d3.scaleLinear([0,xMax],[0, chart_width]);

        // 垂直空間的分配 - 平均分布給各種類
        const yScale = d3.scaleBand()
                         .domain(Data_NA.map(d => d.Genre))
                         .rangeRound([0, chart_height])
                         .paddingInner(0.25);
        
        //Draw bars
        const bars = this_svg.selectAll('.bar')
                             .data(Data_NA)
                             .enter()
                             .append('rect')
                             .attr('class','bar')
                             .attr('x',0)
                             .attr('y',d=>yScale(d.Genre))
                             .attr('width',d=>xScale(d.NA_Sales))
                             .attr('height',yScale.bandwidth())
                             .style('fill', 'dodgerblue')

        // Draw header
        const header = this_svg.append('g').attr('class','bar-header')
            .attr('transform',`translate(0,${-chart_margin.top/2})`)
            .append('text');
        header.append('tspan').text('Total sales by genre in North America');
        header.append('tspan').text('Years:2010 - 2020')
              .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');

        // 設定tickSize
        const xAxis = d3.axisTop(xScale)
                        .tickFormat(formatTicks)
                        .tickSizeInner(-chart_height)
                        .tickSizeOuter(0);
        const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickSize(0);
        const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);
        yAxisDraw.selectAll('text').attr('dx','-0.6em');
    }                   
    else if (state == 1){
        // Scale
        const xMax = d3.max(Data_EU, d=>d.EU_Sales);
        const xScale = d3.scaleLinear([0,xMax],[0, chart_width]);

        // 垂直空間的分配 - 平均分布給各種類
        const yScale = d3.scaleBand()
                         .domain(Data_EU.map(d => d.Genre))
                         .rangeRound([0, chart_height])
                         .paddingInner(0.25);
        
        //Draw bars
        const bars = this_svg.selectAll('.bar')
                             .data(Data_EU)
                             .enter()
                             .append('rect')
                             .attr('class','bar')
                             .attr('x',0)
                             .attr('y',d=>yScale(d.Genre))
                             .attr('width',d=>xScale(d.EU_Sales))
                             .attr('height',yScale.bandwidth())
                             .style('fill', 'lightgreen')

        // Draw header
        const header = this_svg.append('g').attr('class','bar-header')
            .attr('transform',`translate(0,${-chart_margin.top/2})`)
            .append('text');
        header.append('tspan').text('Total sales by genre in Europe');
        header.append('tspan').text('Years:2010 - 2020')
              .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');
        
        // 設定tickSize
        const xAxis = d3.axisTop(xScale)
                        .tickFormat(formatTicks)
                        .tickSizeInner(-chart_height)
                        .tickSizeOuter(0);
        const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickSize(0);
        const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);
        yAxisDraw.selectAll('text').attr('dx','-0.6em');
    }
    else if (state == 2){
        // Scale
        const xMax = d3.max(Data_JP, d=>d.JP_Sales);
        const xScale = d3.scaleLinear([0,xMax],[0, chart_width]);

        // 垂直空間的分配 - 平均分布給各種類
        const yScale = d3.scaleBand()
                         .domain(Data_JP.map(d => d.Genre))
                         .rangeRound([0, chart_height])
                         .paddingInner(0.25);
        
        //Draw bars
        const bars = this_svg.selectAll('.bar')
                             .data(Data_JP)
                             .enter()
                             .append('rect')
                             .attr('class','bar')
                             .attr('x',0)
                             .attr('y',d=>yScale(d.Genre))
                             .attr('width',d=>xScale(d.JP_Sales))
                             .attr('height',yScale.bandwidth())
                             .style('fill', 'orange')

        // Draw header
        const header = this_svg.append('g').attr('class','bar-header')
            .attr('transform',`translate(0,${-chart_margin.top/2})`)
            .append('text');
        header.append('tspan').text('Total sales by genre in Japan');
        header.append('tspan').text('Years:2010 - 2020')
              .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');

        // 設定tickSize
        const xAxis = d3.axisTop(xScale)
                        .tickFormat(formatTicks)
                        .tickSizeInner(-chart_height)
                        .tickSizeOuter(0);
        const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickSize(0);
        const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);
        yAxisDraw.selectAll('text').attr('dx','-0.6em');
    }
    else if (state == 3){
        // Scale
        const xMax = d3.max(Data_Other, d=>d.Other_Sales);
        const xScale = d3.scaleLinear([0,xMax],[0, chart_width]);

        // 垂直空間的分配 - 平均分布給各種類
        const yScale = d3.scaleBand()
                         .domain(Data_Other.map(d => d.Genre))
                         .rangeRound([0, chart_height])
                         .paddingInner(0.25);
        
        //Draw bars
        const bars = this_svg.selectAll('.bar')
                             .data(Data_Other)
                             .enter()
                             .append('rect')
                             .attr('class','bar')
                             .attr('x',0)
                             .attr('y',d=>yScale(d.Genre))
                             .attr('width',d=>xScale(d.Other_Sales))
                             .attr('height',yScale.bandwidth())
                             .style('fill', 'salmon')

        // Draw header
        const header = this_svg.append('g').attr('class','bar-header')
            .attr('transform',`translate(0,${-chart_margin.top/2})`)
            .append('text');
        header.append('tspan').text('Total sales by genre in the rest of the world');
        header.append('tspan').text('Years:2010 - 2020')
              .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');
        
        // 設定tickSize
        const xAxis = d3.axisTop(xScale)
                        .tickFormat(formatTicks)
                        .tickSizeInner(-chart_height)
                        .tickSizeOuter(0);
        const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickSize(0);
        const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);
        yAxisDraw.selectAll('text').attr('dx','-0.6em');
    }
    else{
        // Scale
        const xMax = d3.max(Data_Global, d=>d.Global_Sales);
        const xScale = d3.scaleLinear([0,xMax],[0, chart_width]);

        // 垂直空間的分配 - 平均分布給各種類
        const yScale = d3.scaleBand()
                         .domain(Data_Global.map(d => d.Genre))
                         .rangeRound([0, chart_height])
                         .paddingInner(0.25);
        
        //Draw bars
        const bars = this_svg.selectAll('.bar')
                             .data(Data_Global)
                             .enter()
                             .append('rect')
                             .attr('class','bar')
                             .attr('x',0)
                             .attr('y',d=>yScale(d.Genre))
                             .attr('width',d=>xScale(d.Global_Sales))
                             .attr('height',yScale.bandwidth())
                             .style('fill', 'maroon')

        // Draw header
        const header = this_svg.append('g').attr('class','bar-header')
            .attr('transform',`translate(0,${-chart_margin.top/2})`)
            .append('text');
        header.append('tspan').text('Total sales by genre in worldwide');
        header.append('tspan').text('Years:2010 - 2020')
              .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');

        // 設定tickSize
        const xAxis = d3.axisTop(xScale)
                        .tickFormat(formatTicks)
                        .tickSizeInner(-chart_height)
                        .tickSizeOuter(0);
        const xAxisDraw = this_svg.append('g').attr('class','x axis').call(xAxis);

        const yAxis = d3.axisLeft(yScale).tickSize(0);
        const yAxisDraw = this_svg.append('g').attr('class','y axis').call(yAxis);
        yAxisDraw.selectAll('text').attr('dx','-0.6em');
    }
}

// Main
function operate(games){
    const gameFilter = filterData(games);
    // Data分類以及sorting
    const Data_NA = prepareData(gameFilter, 0).sort(
        (a, b) => {
            return d3.descending(a.NA_Sales, b.NA_Sales);
        }
    );
    const Data_EU = prepareData(gameFilter, 1).sort(
        (a, b) => {
            return d3.descending(a.EU_Sales, b.EU_Sales);
        }
    );
    const Data_JP = prepareData(gameFilter, 2).sort(
        (a, b) => {
            return d3.descending(a.JP_Sales, b.JP_Sales);
        }
    );
    const Data_Other = prepareData(gameFilter, 3).sort(
        (a, b) => {
            return d3.descending(a.Other_Sales, b.Other_Sales);
        }
    );
    const Data_Global = prepareData(gameFilter, 4).sort(
        (a, b) => {
            return d3.descending(a.Global_Sales, b.Global_Sales);
        }
    );

    // console.log(Data_NA);
    // console.log(Data_EU);
    // console.log(Data_JP);
    // console.log(Data_Other);
    // console.log(Data_Global);
    // debugger;
    const state = 0;
    setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, state);
    setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, 1);
    setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, 2);
    setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, 3);
    setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, 4);
    
    
    // // 偵測按鍵
    // d3.select('body').on('keydown', function(){
    //     const keyCode = Event.keyCode;

    //     // 更新圖表資料
    //     if (keyCode === 39) { // 方向鍵右
    //         // 先清空畫布
    //         d3.select('svg').selectAll("*").remove();
    //         state = 1;
    //         // 更新圖表
    //         setupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, state);
    //     } 
    //     else if (keyCode === 37) { // 方向鍵左
    //         if (state != 0){
    //             // 先清空畫布
    //             d3.select('svg').selectAll("*").remove();
    //             state = 2;
    //             // 更新圖表
    //             etupCanvas(Data_NA, Data_EU, Data_JP, Data_Other, Data_Global, state);
    //         }
    //         else{
    //             state = state;
    //         }
    //     } 
    // });
    

    // console.log(Data);
    // setupCanvas(Data);
    


}

// Load Data
d3.csv('data/vgsales.csv', type).then(
    res => {
        operate(res);
        // console.log(res);
        // debugger;    // 要觀察區域變數時，可用debugger進行中斷
    }
);