// global vars
let ai_conference = ["aaai", "ijcai", "cvpr", "eccv", "iccv", "icml", "kdd",
    "nips", "acl", "emnlp", "naacl", "sigir", "www"
];
let theory_conference = ["focs", "soda", "stoc", "crypto", "eurocrypt",
    "cav", "lics"
];
let systems_conference = ["asplos", "isca", "micro", "sigcomm", "nsdi",
    "ccs", "oakland", "usenixsec", "sigmod", "vldb", "icde", "pods",
    "dac", "iccad", "emsoft", "rtas", "rtss", "hpdc", "ics", "sc",
    "mobicom", "mobisys", "sensys", "imc", "sigmetrics", "osdi",
    "sosp", "pldi", "popl", "icfp", "oopsla", "fse", "icse", "ase", "issta"
];
let interdiscip_conference = ["ismb", "recomb", "siggraph", "siggraph-asia",
    "ec", "wine", "chi", "ubicomp", "uist", "icra", "iros", "rss", "vis", "vr"
];
let univ2logo = {
    "Carnegie Mellon University": "data/logos/1.Carnegie Mellon University.jpg",
    "University of California - San Diego": "data/logos/10.University of California - San Diego.png",
    "ETH Zurich": "data/logos/11.ETH Zurich.jpg",
    "University of Maryland - College Park": "data/logos/12.University of Maryland - College Park.png",
    "Georgia Institute of Technology": "data/logos/13.Georgia Institute of Technology.png",
    "University of Wisconsin - Madison": "data/logos/14.University of Wisconsin - Madison.png",
    "Columbia University": "data/logos/15.Columbia University.jpg",
    "National University of Singapore": "data/logos/16.National University of Singapore.png",
    "Northeastern University": "data/logos/17.Northeastern University.png",
    "University of Toronto": "data/logos/18.University of Toronto.png",
    "University of California - Los Angeles": "data/logos/19.University of California - Los Angeles.png",
    "Massachusetts Institute of Technology": "data/logos/2.Massachusetts Institute of Technology.jpg",
    "University of Pennsylvania": "data/logos/20.University of Pennsylvania.png",
    "Univ": "data/logos/3.Univ. of Illinois at Urbana-Champaign.png",
    "Stanford University": "data/logos/4.Stanford University.jpg",
    "University of California - Berkeley": "data/logos/5.University of California - Berkeley.jpg",
    "University of Washington": "data/logos/6.University of Washington.png",
    "Cornell University": "data/logos/7.Cornell University.jpg",
    "University of Michigan": "data/logos/8.University of Michigan.png",
    "Tsinghua University": "data/logos/9.Tsinghua University.png",
    "Duke University": "data/logos/Duke University.png",
    "Ecole Normale Superieure": "data/logos/Ecole Normale Superieure.png",
    "New York University": "data/logos/New York University.png",
    "NWPU": "data/logos/NWPU.jpg",
    "Pennsylvania State University": "data/logos/Pennsylvania State University.png",
    "Purdue University": "data/logos/Purdue University.jpg",
    "TU Darmstadt": "data/logos/TU Darmstadt.png",
    "Univ. of Illinois at Urbana-Champaign": "data/logos/Univ. of Illinois at Urbana-Champaign.png",
    "University of California - Santa Barbara": "data/logos/University of California - Santa Barbara.jpg",
    "University of Pittsburgh": "data/logos/University of Pittsburgh.png",
    "University of Sydney": "data/logos/University of Sydney.png",
    "University of Texas at Austin": "data/logos/University of Texas at Austin.png"
};
var begin_year_linechart = 2010,
    end_year_linechart = 2018,
    area_linechart = "AI";


// data loader
{
    //if in this area, return 1
    function in_this_area(area, conf) {
        let flag = 0;
        if (area == "AI") {
            for (let i = 0; i < ai_conference.length; i++) {
                if (ai_conference[i] == conf) {
                    flag = 1;
                    return flag;
                }
            }
        } else if (area == "Theory") {
            for (let i = 0; i < theory_conference.length; i++) {
                if (theory_conference[i] == conf) {
                    flag = 1;
                    return flag;
                }
            }
        } else if (area == "Systems") {
            for (let i = 0; i < systems_conference.length; i++) {
                if (systems_conference[i] == conf) {
                    flag = 1;
                    return flag;
                }
            }
        } else if (area == "Interdisciplinary Areas") {
            for (let i = 0; i < interdiscip_conference.length; i++) {
                if (interdiscip_conference[i] == conf) {
                    flag = 1;
                    return flag;
                }
            }
        }
        return flag;
    }

    // main function
    // process csv data in area from time [starttime, endtime]
    // select top_k professors
    function read_data(area, start_time, end_time, top_k = 10,
        path = "data/generated-author-info.csv") {
        area_linechart = area;
        console.log("state changed:", begin_year_linechart, end_year_linechart, area_linechart);

        d3.select("#linechartdiv")
            .selectAll("svg")
            .remove();

        d3.csv(path)
            .then(function(csvdata) {
                let prof = [];
                //console.log(csvdata);
                let id = 0;
                for (let i = 0; i < csvdata.length; i++) {
                    let name = csvdata[i].name;
                    let univ = csvdata[i].dept;
                    let conf = csvdata[i].area;
                    let year = +csvdata[i].year; // integer
                    //console.log(name, univ, conf, year);

                    if (start_time <= year && year <= end_time && in_this_area(area, conf)) {
                        if (prof.length == 0) {
                            prof.push({
                                name: name,
                                pub: 1,
                                chosen: 0,
                                dept: univ
                            })
                        } else {
                            if (name == prof[id].name)
                                prof[id].pub++;
                            else {
                                prof.push({
                                    name: name,
                                    pub: 1,
                                    chosen: 0,
                                    dept: univ
                                })
                                id++;
                            }
                        }
                    }
                }

                //console.log(prof);

                if (id == prof.length)
                    console.log("id equals prof.length");

                let top_k_prof = [];

                for (let k = 0; k < top_k; k++) {
                    let max_pub = 0;
                    let max_id = -1;
                    for (let j = 0; j < id; j++)
                        if (prof[j].chosen == 0 && prof[j].pub > max_pub) {
                            max_pub = prof[j].pub;
                            max_id = j;
                        }
                    //console.log(max_id)
                    prof[max_id].chosen = 1;
                    top_k_prof.push(prof[max_id]);

                }

                console.log("top_profs are", top_k_prof);

                for (let k = 0; k < top_k; k++) {
                    let data_temp = [];
                    let data = [];
                    for (let year = 1970; year <= 2019; year++) {
                        data_temp.push({
                            x: year,
                            y: 0
                        });
                    }

                    for (let i = 0; i < csvdata.length; i++) {
                        //let find = 0;
                        if (csvdata[i].name == top_k_prof[k].name) {
                            let cur_year = csvdata[i].year;
                            if (cur_year > 2019)
                                cur_year = 2019;
                            data_temp[cur_year - 1970].y++;
                        }
                    }
                    //console.log("data_temp is", data_temp)
                    //console.log("data is", data)
                    data.push(data_temp);
                    main_draw(data, top_k_prof[k]);
                }
            });
    }

    /*
    // process logos of university
    function process_logo(path = "data/logos") {
        let fs = require("fs");
        fs.readdir(path, function(err, items) {
            console.log(items);
        });
    }
    */
}

// draw svg
{
    // data: publications every year;
    // prof: professor info
    function main_draw(data, prof) {

        let line_color = '#02f78e',
            dot_color = '#272727';

        let margin = { top: 10, right: 300 + 80, bottom: 20, left: 40 },
            width = linechart_w - margin.left - margin.right,
            height = linechart_h - margin.top - margin.bottom;

        let x = d3.scaleLinear()
            .domain([2000, 2019])
            .range([0, width]);

        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);

        let x_copy = x.copy(),
            y_copy = y.copy();

        //x轴设置
        let xAxis = d3.axisBottom()
            .scale(x)
            .ticks(10) //调节刻度大小
            .tickSize(-height)
            .tickPadding(10);
        //.tickSubdivide(true);

        //y轴设置
        let yAxis = d3.axisLeft()
            .scale(y)
            .ticks(2)
            .tickPadding(10)
            .tickSize(-width);
        //.tickSubdivide(true);

        //缩放拖拽
        let zoom = d3.zoom()
            //.x(x)
            //.y(y)
            .scaleExtent([-10, 10]) //可缩放的范围
            .on("zoom", zoomed);

        let div = d3.select("#linechartdiv")
            .append("div")
            .attr("class", "lineChartInnerDiv");

        let svg = div.append("svg")
            .call(zoom)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // text of professor information
        let txt_dx = 40,
            txt_dy = 15,
            txt_ddy = 20;
        svg.append("text")
            .attr("class", "myProfText")
            .attr("x", width)
            .attr("y", 0)
            .attr("dx", txt_dx)
            .attr("dy", txt_dy)
            .attr("text-anchor", "start")
            .attr("font-size", 14)
            .attr("font-weight", "bold")
            .text(prof.name);
        svg.append("text")
            .attr("class", "myProfText")
            .attr("x", width)
            .attr("y", 0)
            .attr("dx", txt_dx)
            .attr("dy", txt_dy + txt_ddy)
            .attr("text-anchor", "start")
            .attr("font-size", 14)
            .text(prof.dept);
        svg.append("text")
            .attr("class", "myProfText")
            .attr("x", width)
            .attr("y", 0)
            .attr("dx", txt_dx)
            .attr("dy", txt_dy + txt_ddy * 2)
            .attr("text-anchor", "start")
            .attr("font-size", 14)
            .text(" Pubs: " + prof.pub);

        // axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "x axis")
            .append("text")
            .attr("class", "axis-label")
            .attr("y", height + 10)
            .attr("x", width)
            .text('Year');

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 15)
            .attr("x", -height / 2)
            .text('Pubs');

        // line chart
        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        let line = d3.line()
            //.interpolate("linear")
            .x(function(d) { return x(d.x); })
            .y(function(d) { return y(d.y); });

        svg.selectAll('.line')
            .data(data)
            .enter()
            .append("path")
            .attr("class", "line")
            .attr("clip-path", "url(#clip)")
            .attr('stroke', line_color)
            .attr("d", line);


        let points = svg.selectAll('.dots')
            .data(data)
            .enter()
            .append("g")
            .attr("class", "dots")
            .attr("clip-path", "url(#clip)");

        points.selectAll('.dot')
            .data(function(d, index) {
                let a = [];
                d.forEach(function(point, i) {
                    a.push({ 'index': d.id, 'point': point });
                });
                return a;
            })
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr("r", 2)
            .attr('fill', dot_color)
            .attr("transform", function(d) {
                return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
            });

        function zoomed() {
            x = d3.event.transform.rescaleX(x_copy);
            y = d3.event.transform.rescaleY(y_copy);
            xAxis.scale(x);
            yAxis.scale(y);
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);
            svg.selectAll('path.line').attr('d', line);

            points.selectAll('circle').attr("transform", function(d) {
                return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")";
            });
        }

        // 校徽图片
        let logo_sz = linechart_h - 10;
        let logo_path = univ2logo[prof.dept];
        if (logo_path == undefined)
            logo_path = "data/logos/unknown.png";
        let univ_logo = svg.append("image")
            .attr("class", "univ_logo")
            .attr("width", logo_sz)
            .attr("height", logo_sz)
            .attr("x", linechart_w - logo_sz - margin.left - 10)
            .attr("y", -margin.top + 5)
            .attr("xlink:href", logo_path);

        // 点击具体教授，更新其他视图
        div.on("click", function() {
            d3.select("#linechartdiv")
                .selectAll(".lineChartInnerDiv")
                .attr("style", "background: white;");
            d3.select(this)
                .attr("style", "background: yellow;");

            on_update_barchart(prof);
            on_update_sunburst(prof.dept, begin_year_linechart, end_year_linechart);
        });

        /*
        univ_logo.on("click", function() {
            on_update_sunburst(prof.dept, begin_year_linechart, end_year_linechart);
        });
        */

    }
}

// main
//process_logo("data/logos");
read_data("AI", 2010, 2018, 10);


// interface for other parts
{
    // 传给sunburst的参数： 大学名称，开始年份，截止年份
    function on_update_sunburst(univ, start_time, end_time) {
        console.log("update sunburst, ", univ, start_time, end_time);
        // TODO: call the sunburst update function.
        /*
        To 甘：
        几点注意事项
        1.请不要修改index.html <div class="svgContainer" id="linechartdiv">内的部分；
        2.vis1_linechart.js开头用var定义了几个全局变量，请小心不要重名。写js时全局变量请集中
        放在文件开头，尽量多使用let声明局部变量。
        3.只要在这里添加更新sunburst的函数，应当就能通过点击主视图中十个框的任意一个框，
        来刷新sunburst图。
        谢谢！ ——袁 12/27
        */
        sunburst_draw(univ, start_time, end_time);
        /*
        To 袁：
        1.我这边搭建Node服务器的方式与github上的包不同，我这边无法启动服务器来调试，可能需要您那边调试一下。在我自己搭建的临时服务器上我的代码是可以工作的。
        （我用的是npm包管理器，里面html和js的管理也与这边不同）
        2.我没有修改html文件，如果选择器没有正确地选取html中的元素或者html需要修改，可以参考37-45行
        3.我没有定义任何全局变量，所有在全文件用到的局部变量和常量都在文件开头
        4.我还没有上色，可能需要我们商量一下具体上色的方式
        谢谢！ ————甘 12/27
        */
    }

    function on_update_barchart(name) {
        console.log("update bar chart, ", name);
        drawBarChart(name);
    }
}