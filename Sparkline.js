var mergedConfig;
var _sparkLinetargetElement = '';
var sparkLineRedrawFlg = true;
var sparkLineAnimationArray = [];
var sparkLineFirstAnimationCounter = 0;
var _sparkLineFirstBetweenData = [];

function Sparkline(targetElement, config) {
    const defaultSparklineConfig = {
        type: 'sparkline',
        hover: 'vertical', // Can be 'none', 'vertical' or 'point'
        tooltip: {
            display: true, // Can be set to true or false
            label: true, // Can be set to true or false
            theme: 'light', // Light or dark, changes the color of the tooltip.
            prepend: null, // Character or symbol to prepend to tooltip values
            append: null, // Character or symbol to append to tooltip values
        },
        chart: {
            lineStyle: 'direct', // Can be set to 'direct', 'smooth' or 'waves'
            dotDisplay: 'hover', // Can be set to 'hover', 'none', or 'all'
            gradientFill: true, // Set to true to enable gradient fill under the line, or false to disable it.
        },
        scales: {
            y: {
                min: null, // Sets the minimum value for the y axis.
                max: null, // Sets the maximum value for the y axis.
                suggestedMin: null, // Sets a preferred minimum value for the y axis.
                suggestedMax: null, // Sets a preferred maximum value for the y axis.
            },
        },
        data: {
            labels: [], // Array of strings for x-axis data point labels
            datasets: [[]], // Array of arrays containing data points for datasets
            legends: [''], // Array of strings for dataset legends
            colors: ['#ff0000', '#7F56D9', '#9E77ED', 'B692F6', 'D6BBFB', 'E9D7FE', 'EAECF0'], // Array of strings for dataset line colors in hex color
        },
        // ... (The existing default config object)
    };

    mergedConfig = Object.assign({}, defaultSparklineConfig, config);
    _sparkLinetargetElement = targetElement;

    for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
        var _sparkLineSubFirstBetweenData = [];
        for (let jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
            _sparkLineSubFirstBetweenData.push((mergedConfig.data.datasets[idx][jdx] - (mergedConfig.scales.y.max - mergedConfig.scales.y.min) / 2 - mergedConfig.scales.y.min) / 10)
        }
        _sparkLineFirstBetweenData.push(_sparkLineSubFirstBetweenData);
    }

    sparkLineFirstAnimation();

    setTimeout(() => {
        sparkLineRedrawPerTime();
    }, 250);
    // Use the mergedConfig object in the rest of your Sparkline function
    // Add the code to create and render the sparkline using targetElement and mergedConfig
}

function sparkLineFirstAnimation() {
    sparkLineFirstAnimationCounter++;
    if (sparkLineFirstAnimationCounter < 10) {
        setTimeout(() => {
            var _sparkLineFirstData = [];
            for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                var _sparkLineSubFirstData = [];
                for (let jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
                    _sparkLineSubFirstData.push((mergedConfig.scales.y.max - mergedConfig.scales.y.min) / 2 + mergedConfig.scales.y.min + _sparkLineFirstBetweenData[idx][jdx] * sparkLineFirstAnimationCounter)
                }
                _sparkLineFirstData.push(_sparkLineSubFirstData)
            }
            mergedConfig.data.datasets = _sparkLineFirstData;
            drawCanvas()
            sparkLineFirstAnimation();
        }, 25);
    }
}

function sparkLineRedrawPerTime() {
    setTimeout(() => {
        if (sparkLineAnimationArray.length == 2) {
            sparkLineAnimationArray[0].opacity < 0.2 ? sparkLineAnimationArray[0].opacity = 0 : sparkLineAnimationArray[0].opacity = sparkLineAnimationArray[0].opacity - 0.1;
            sparkLineAnimationArray[1].opacity > 0.8 ? sparkLineAnimationArray[1].opacity = 1 : sparkLineAnimationArray[1].opacity = sparkLineAnimationArray[1].opacity + 0.1;
        }
        drawCanvas()
        sparkLineRedrawPerTime();
    }, 25);
}

function drawCanvas() {

    //ADJUST DATASETS
    for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
        for (var jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
            if (mergedConfig.data.datasets[idx][jdx] > mergedConfig.scales.y.suggestedMax && mergedConfig.scales.y.suggestedMax) {
                mergedConfig.data.datasets[idx][jdx] = mergedConfig.scales.y.suggestedMax;
            } else if (mergedConfig.data.datasets[idx][jdx] < mergedConfig.scales.y.suggestedMin && mergedConfig.scales.y.suggestedMin) {
                mergedConfig.data.datasets[idx][jdx] = mergedConfig.scales.y.suggestedMin;
            }
        }
    }

    //IN CASE OF MIN AND MAX ARE NULL, SET MIN AND MAX
    if (!mergedConfig.scales.y.max) {
        mergedConfig.scales.y.max = mergedConfig.data.datasets[0][0];
        for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
            for (var jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
                if (mergedConfig.scales.y.max < mergedConfig.data.datasets[idx][jdx]) {
                    mergedConfig.scales.y.max = mergedConfig.data.datasets[idx][jdx]
                }
            }
        }
    }
    if (!mergedConfig.scales.y.min) {
        mergedConfig.scales.y.min = mergedConfig.data.datasets[0][0];
        for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
            for (var jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
                if (mergedConfig.scales.y.min > mergedConfig.data.datasets[idx][jdx]) {
                    mergedConfig.scales.y.min = mergedConfig.data.datasets[idx][jdx]
                }
            }
        }
    }

    //GET CANVAS UPPER LEVEL PADDING
    var sparkLineCanvasUpperLevelPaddingLeft = (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-left')).slice(0, (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-left')).length - 2);
    var sparkLineCanvasUpperLevelPaddingRight = (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-right')).slice(0, (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-right')).length - 2);
    var sparkLineCanvasUpperLevelPaddingTop = (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-top')).slice(0, (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-top')).length - 2);;
    var sparkLineCanvasUpperLevelPaddingBottom = (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-bottom')).slice(0, (window.getComputedStyle(document.getElementById(_sparkLinetargetElement).parentNode, null).getPropertyValue('padding-bottom')).length - 2);

    //SET LINE WIDTH FOR CANVAS
    var lineWidth = 1;

    //DRAW CANVAS
    var canvas = document.getElementById("sparkLineCanvas");
    canvas.width = (document.getElementById(_sparkLinetargetElement).parentNode.offsetWidth - sparkLineCanvasUpperLevelPaddingLeft - sparkLineCanvasUpperLevelPaddingRight);
    canvas.height = (document.getElementById(_sparkLinetargetElement).parentNode.offsetHeight - sparkLineCanvasUpperLevelPaddingTop - sparkLineCanvasUpperLevelPaddingBottom);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#e5e5e5';
    ctx.font = "12px Arial";
    ctx.lineWidth = lineWidth;

    //GET Y-AXIS TEXT WIDTH
    var leftPadding = 20;
    var rightPadding = 20;

    //GET X-AXIS EACH SPACE
    var labelSpace = ((canvas.width - leftPadding - rightPadding) / (mergedConfig.data.labels.length - 1));

    var sparkLineOpacityArray = [];
    var sparkLineOpacityArrayFlg = false;
    if (sparkLineAnimationArray.length == 2) {
        for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
            if ((sparkLineAnimationArray[1].event.y - 20) < ((canvas.height - 30) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][(Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace))]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 10) && (sparkLineAnimationArray[1].event.y - 20) > ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][(Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace))]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) && (sparkLineAnimationArray[1].event.x > (labelSpace * (Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace)) + leftPadding)) && (sparkLineAnimationArray[1].event.x < (labelSpace * (Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace)) + leftPadding + 10))) {
                sparkLineOpacityArray.push(true);
                sparkLineOpacityArrayFlg = true;
            } else {
                sparkLineOpacityArray.push(false);
            }
        }
    }

    //DRAW GRAPH
    for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
        if (mergedConfig.chart.lineStyle == 'direct') {
            for (var jdx = 0; jdx < mergedConfig.data.labels.length - 1; jdx++) {
                ctx.globalAlpha = 1;
                if (mergedConfig.chart.dotDisplay == 'hover' && mergedConfig.hover == 'point' && sparkLineOpacityArrayFlg) {
                    if (!sparkLineOpacityArray[idx]) {
                        ctx.globalAlpha = 0.25;
                    }
                }
                sparkLineDrawLine(ctx, labelSpace * jdx + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, labelSpace * (jdx + 1) + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx + 1]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, mergedConfig.data.colors[idx]);
                if (mergedConfig.chart.gradientFill) {
                    ctx.beginPath();
                    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    gradient.addColorStop(0, mergedConfig.data.colors[idx]);
                    gradient.addColorStop(1, sparkLineExchangeColorForm(mergedConfig.data.colors[idx], 0.1));
                    ctx.fillStyle = gradient;
                    ctx.moveTo(leftPadding + labelSpace * jdx, canvas.height - 20);
                    ctx.lineTo(labelSpace * jdx + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20);
                    ctx.lineTo(labelSpace * (jdx + 1) + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx + 1]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20);
                    ctx.lineTo(labelSpace * (jdx + 1) + leftPadding, canvas.height - 20);
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.globalAlpha = 0.1;
                    ctx.closePath();
                    ctx.fill();
                    ctx.globalCompositeOperation = 'source-over'
                }
            }
        } else {
            ctx.beginPath();

            //CONTROL DATASETS | ADD 3 ELEMENTS
            var _datasets = [
                {
                    x: leftPadding,
                    y: canvas.height - 20
                },
                {
                    x: leftPadding,
                    y: canvas.height - 20
                }
            ];
            for (var jdx = 0; jdx < mergedConfig.data.labels.length; jdx++) {
                _datasets.push({
                    x: leftPadding + labelSpace * jdx,
                    y: (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20
                });
            }
            _datasets.push({
                x: leftPadding + labelSpace * (mergedConfig.data.labels.length - 1),
                y: canvas.height - 20
            })

            //DRAW SMOOTH LINE
            ctx.moveTo(_datasets[0].x, _datasets[0].y);

            for (var i = 1; i < _datasets.length - 2; i++) {
                if (i == 1) {
                    ctx.lineTo(_datasets[i + 1].x, _datasets[i + 1].y)
                } else {
                    var xc1 = _datasets[i].x + (_datasets[i + 1].x - _datasets[i - 1].x) / 6;
                    var yc1 = _datasets[i].y + (_datasets[i + 1].y - _datasets[i - 1].y) / 6;
                    var xc2 = _datasets[i + 1].x - (_datasets[i + 2].x - _datasets[i].x) / 6;
                    var yc2 = _datasets[i + 1].y - (_datasets[i + 2].y - _datasets[i].y) / 6;
                    ctx.bezierCurveTo(xc1, yc1, xc2, yc2, _datasets[i + 1].x, _datasets[i + 1].y);
                }
            }

            ctx.lineTo(_datasets[i + 1].x, _datasets[i + 1].y);

            ctx.globalCompositeOperation = 'source-over';

            if (mergedConfig.chart.lineStyle == 'smooth') {
                ctx.strokeStyle = mergedConfig.data.colors[idx];
                ctx.stroke();
            }
            var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, mergedConfig.data.colors[idx]);
            gradient.addColorStop(1, sparkLineExchangeColorForm(mergedConfig.data.colors[idx], 0.1));
            ctx.fillStyle = gradient;
            ctx.globalCompositeOperation = 'multiply';
            if (mergedConfig.chart.lineStyle == 'waves') {
                ctx.globalAlpha = 0.2
            } else {
                ctx.globalAlpha = 0.1;
            }
            ctx.closePath();
            if (mergedConfig.chart.gradientFill || mergedConfig.chart.lineStyle == 'waves') ctx.fill();
            ctx.globalCompositeOperation = 'source-over'
            ctx.clearRect(leftPadding - 1.5, 20, 3, canvas.height - 20)
            ctx.clearRect(canvas.width - rightPadding - 1.5, 20, 3, canvas.height - 20)
        }
        ctx.clearRect(0, 0, canvas.width, 20);
        ctx.clearRect(0, canvas.height - 20, canvas.width, 20)
    }

    ctx.globalAlpha = 1;

    //DRAW DOTDISPLAY
    if (sparkLineAnimationArray.length == 2) {
        if (mergedConfig.chart.dotDisplay == 'hover') {
            if (mergedConfig.hover == 'vertical') {
                var hoverPos = ((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) % labelSpace) > (labelSpace / 2) ? Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace) + 1 : Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace);

                for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                    //DRAW HOVER SET POSITIOIN
                    if (((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20) > 20 && ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20) < (canvas.height - 20)) {
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;
                        sparkLineDrawCircle(ctx, labelSpace * hoverPos + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 9, 0, 2 * Math.PI, mergedConfig.data.colors[idx], '');
                        sparkLineDrawCircle(ctx, labelSpace * hoverPos + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 4, 0, 2 * Math.PI, mergedConfig.data.colors[idx], 'fill');
                    }
                }
            } else if (mergedConfig.hover == 'point') {
                var hoverPos = Math.floor((sparkLineAnimationArray[1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace);
                for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                    if ((sparkLineAnimationArray[1].event.y - 20) < ((canvas.height - 30) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 10) && (sparkLineAnimationArray[1].event.y - 20) > ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) && (sparkLineAnimationArray[1].event.x > (labelSpace * hoverPos + leftPadding)) && (sparkLineAnimationArray[1].event.x < (labelSpace * hoverPos + leftPadding + 10))) {
                        sparkLineDrawCircle(ctx, labelSpace * hoverPos + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 9, 0, 2 * Math.PI, mergedConfig.data.colors[idx], '');
                        sparkLineDrawCircle(ctx, labelSpace * hoverPos + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 4, 0, 2 * Math.PI, mergedConfig.data.colors[idx], 'fill');
                    }
                }
            }
        } else if (mergedConfig.chart.dotDisplay == 'all') {
            //DRAW ALL POSITION
            for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                for (var jdx = 0; jdx < mergedConfig.data.datasets[idx].length; jdx++) {
                    if (((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20) > 20 && ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20) < (canvas.height - 20)) {
                        sparkLineDrawCircle(ctx, labelSpace * jdx + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 4, 0, 2 * Math.PI, mergedConfig.data.colors[idx], 'fill')
                        sparkLineDrawCircle(ctx, labelSpace * jdx + leftPadding, (canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][jdx]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 20, 9, 0, 2 * Math.PI, mergedConfig.data.colors[idx], '');
                    }
                }
            }
        }

        for (var zdx = 0; zdx < sparkLineAnimationArray.length; zdx++) {
            var rect = canvas.getBoundingClientRect();
            var sparkLineMouseIndex = 0;
            var sparkLineMouseJndex = [];
            if (((sparkLineAnimationArray[zdx].event.clientX - rect.left - leftPadding) % labelSpace) > (labelSpace / 2)) {
                sparkLineMouseIndex = Math.floor((sparkLineAnimationArray[zdx].event.clientX - rect.left - leftPadding) / labelSpace) + 1;
            } else {
                sparkLineMouseIndex = Math.floor((sparkLineAnimationArray[zdx].event.clientX - rect.left - leftPadding) / labelSpace);
            }

            if (mergedConfig.chart.dotDisplay == 'hover' && mergedConfig.hover == 'point') {
                for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                    if ((sparkLineAnimationArray[zdx].event.y - 20) < ((canvas.height - 30) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 10) && (sparkLineAnimationArray[zdx].event.y - 20) > ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) && (sparkLineAnimationArray[zdx].event.x > (labelSpace * hoverPos + leftPadding)) && (sparkLineAnimationArray[zdx].event.x < (labelSpace * hoverPos + leftPadding + 10))) {
                        sparkLineMouseJndex.push(idx)
                    }
                }
            } else {
                for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                    sparkLineMouseJndex.push(idx)
                }
            }

            //DRAW TOOLTIP
            if (mergedConfig.tooltip.display) {
                var sparkLineToolTipTextWidth = 24;
                var sparkLineToolTipTextHeight = 24;
                var sparkLineToolTipText = [];
                var sparkLineToolTipTopPoint = canvas.height;
                for (var idx = 0; idx < sparkLineMouseJndex.length; idx++) {

                    //GET TOOLTIP TEXT AND TEXT WIDTH ADN HEIGHT
                    var subSparkLineToolTipText = '';
                    subSparkLineToolTipText += mergedConfig.data.legends[sparkLineMouseJndex[idx]] + ': ';
                    if (mergedConfig.tooltip.prepend) {
                        subSparkLineToolTipText += mergedConfig.tooltip.prepend;
                    }
                    if (mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex] >= 1000) {
                        subSparkLineToolTipText += Math.floor(mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex] / 1000) + ',' + String(mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex]).substr(-3);
                    } else {
                        subSparkLineToolTipText += mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex];
                    }
                    if (mergedConfig.tooltip.append) {
                        subSparkLineToolTipText += mergedConfig.tooltip.append;
                    }
                    if (sparkLineToolTipTextWidth < ctx.measureText(subSparkLineToolTipText).width + 38) {
                        sparkLineToolTipTextWidth = ctx.measureText(subSparkLineToolTipText).width + 38;
                    }
                    sparkLineToolTipTextHeight += 22;
                    sparkLineToolTipText.push(subSparkLineToolTipText);

                    //GET TOOLTIP TOP POINT
                    if (sparkLineToolTipTopPoint > ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) + 20 && (mergedConfig.hover != 'point' || mergedConfig.chart.dotDisplay != 'hover')) {
                        sparkLineToolTipTopPoint = ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[sparkLineMouseJndex[idx]][sparkLineMouseIndex]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) + 20
                    }
                }

                if (mergedConfig.hover == 'point' && mergedConfig.chart.dotDisplay == 'hover') {
                    var _hoverPos = Math.floor((sparkLineAnimationArray[zdx].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / labelSpace);
                    for (var idx = 0; idx < mergedConfig.data.datasets.length; idx++) {
                        if ((sparkLineAnimationArray[zdx].event.y - 20) < ((canvas.height - 30) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][_hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 10) && (sparkLineAnimationArray[zdx].event.y - 20) > ((canvas.height - 40) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][_hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min)) && (sparkLineAnimationArray[zdx].event.x > (labelSpace * _hoverPos + leftPadding)) && (sparkLineAnimationArray[zdx].event.x < (labelSpace * _hoverPos + leftPadding + 10))) {
                            sparkLineToolTipTopPoint = (canvas.height - 30) * (mergedConfig.scales.y.max - mergedConfig.data.datasets[idx][_hoverPos]) / (mergedConfig.scales.y.max - mergedConfig.scales.y.min) + 18;
                        }
                    }
                }

                //ADD HEIGHT IN CASE LABEL IS TRUE
                if (mergedConfig.tooltip.label) {
                    sparkLineToolTipTextHeight += 18;
                }

                //SET TOOLTIP BACKGROUND COLOR
                if (mergedConfig.tooltip.theme == 'dark') {
                    ctx.fillStyle = '#101828';
                } else {
                    ctx.fillStyle = '#ffffff';
                }

                //SET 0 WHEN ESCAPE LEFT
                if (sparkLineMouseIndex < 0) {
                    sparkLineMouseIndex = 0;
                }

                //SET START POINT OF TOOLTIP
                var sparkToolTipStartX = leftPadding + (labelSpace * sparkLineMouseIndex) - (sparkLineToolTipTextWidth / 2);//NORMAL CASE, SET INIT X
                var sparkToolTipStartY = sparkLineToolTipTopPoint - sparkLineToolTipTextHeight - 14;//NORMAL CASE, SET INIT Y
                var _sparkToolTipStartX = leftPadding + (labelSpace * sparkLineMouseIndex); //NORMAL CASE, SET INIT FORWARD X
                var _sparkToolTipStartY = sparkLineToolTipTopPoint - 4 //NORMAL CASE, SET INIT FORWARD Y
                var _sparkToolTipDirect = 0; //TOP 0, LEFT 1, RIGHT 2
                if (sparkLineToolTipTopPoint < sparkLineToolTipTextHeight + 12) {//ESCAPE TOP CASE
                    sparkToolTipStartY += sparkLineToolTipTextHeight + 14;
                    if (leftPadding + labelSpace * sparkLineMouseIndex < sparkLineToolTipTextWidth) {//ESCAPE LEFT CASE
                        sparkToolTipStartX += sparkLineToolTipTextWidth / 2 + 14;
                        _sparkToolTipDirect = 2;
                    } else {
                        sparkToolTipStartX += -sparkLineToolTipTextWidth / 2 - 14;
                        _sparkToolTipDirect = 1;
                    }
                } else {
                    if (leftPadding + labelSpace * sparkLineMouseIndex < sparkLineToolTipTextWidth / 2) {//ESCAPE LEFT CASE
                        sparkToolTipStartY += sparkLineToolTipTextHeight + 14;
                        sparkToolTipStartX += sparkLineToolTipTextWidth / 2 + 14;
                        _sparkToolTipDirect = 2;
                    }
                    if (canvas.width - labelSpace * sparkLineMouseIndex - leftPadding < sparkLineToolTipTextWidth / 2) {//ESCAPE RIGHT CASE
                        sparkToolTipStartY += sparkLineToolTipTextHeight + 14;
                        sparkToolTipStartX += -sparkLineToolTipTextWidth / 2 - 14;
                        _sparkToolTipDirect = 1;
                    }
                }

                //SET TOOLTIP WIDTH AND HEIGHT
                var width = sparkLineToolTipTextWidth;
                var height = sparkLineToolTipTextHeight;

                //SET TOOLTIP BORDER RADIUS
                var borderRadius = 8;

                ctx.globalAlpha = sparkLineAnimationArray[zdx].opacity

                //DRAW TOOLTIP MAIN AREA
                if (sparkLineToolTipTopPoint != canvas.height) {
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 12;
                    ctx.shadowBlur = 16;
                    ctx.shadowColor = 'rgba(16, 24, 40, 0.08)';
                    ctx.beginPath();
                    ctx.moveTo(sparkToolTipStartX + borderRadius, sparkToolTipStartY);
                    ctx.lineTo(sparkToolTipStartX + width - borderRadius, sparkToolTipStartY);
                    ctx.arcTo(sparkToolTipStartX + width, sparkToolTipStartY, sparkToolTipStartX + width, sparkToolTipStartY + borderRadius, borderRadius);
                    ctx.lineTo(sparkToolTipStartX + width, sparkToolTipStartY + height - borderRadius);
                    ctx.arcTo(
                        sparkToolTipStartX + width,
                        sparkToolTipStartY + height,
                        sparkToolTipStartX + width - borderRadius,
                        sparkToolTipStartY + height,
                        borderRadius
                    );
                    ctx.lineTo(sparkToolTipStartX + borderRadius, sparkToolTipStartY + height);
                    ctx.arcTo(sparkToolTipStartX, sparkToolTipStartY + height, sparkToolTipStartX, sparkToolTipStartY + height - borderRadius, borderRadius);
                    ctx.lineTo(sparkToolTipStartX, sparkToolTipStartY + borderRadius);
                    ctx.arcTo(sparkToolTipStartX, sparkToolTipStartY, sparkToolTipStartX + borderRadius, sparkToolTipStartY, borderRadius);
                    ctx.closePath();
                    ctx.fill();

                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 4;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(16, 24, 40, 0.03)';
                    ctx.beginPath();
                    ctx.moveTo(sparkToolTipStartX + borderRadius, sparkToolTipStartY);
                    ctx.lineTo(sparkToolTipStartX + width - borderRadius, sparkToolTipStartY);
                    ctx.arcTo(sparkToolTipStartX + width, sparkToolTipStartY, sparkToolTipStartX + width, sparkToolTipStartY + borderRadius, borderRadius);
                    ctx.lineTo(sparkToolTipStartX + width, sparkToolTipStartY + height - borderRadius);
                    ctx.arcTo(
                        sparkToolTipStartX + width,
                        sparkToolTipStartY + height,
                        sparkToolTipStartX + width - borderRadius,
                        sparkToolTipStartY + height,
                        borderRadius
                    );
                    ctx.lineTo(sparkToolTipStartX + borderRadius, sparkToolTipStartY + height);
                    ctx.arcTo(sparkToolTipStartX, sparkToolTipStartY + height, sparkToolTipStartX, sparkToolTipStartY + height - borderRadius, borderRadius);
                    ctx.lineTo(sparkToolTipStartX, sparkToolTipStartY + borderRadius);
                    ctx.arcTo(sparkToolTipStartX, sparkToolTipStartY, sparkToolTipStartX + borderRadius, sparkToolTipStartY, borderRadius);
                    ctx.closePath();
                    ctx.fill();

                    //DRAW TOOLTIP FORWARD
                    ctx.beginPath();

                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 0;

                    if (_sparkToolTipDirect == 0) {
                        ctx.moveTo(_sparkToolTipStartX, _sparkToolTipStartY - 4);
                        ctx.lineTo(_sparkToolTipStartX - 6, _sparkToolTipStartY - 10);
                        ctx.lineTo(_sparkToolTipStartX + 6, _sparkToolTipStartY - 10);
                    } else if (_sparkToolTipDirect == 1) {
                        ctx.moveTo(_sparkToolTipStartX - 8, _sparkToolTipStartY + 20);
                        ctx.lineTo(_sparkToolTipStartX - 14, _sparkToolTipStartY + 14);
                        ctx.lineTo(_sparkToolTipStartX - 14, _sparkToolTipStartY + 26);
                    } else {
                        ctx.moveTo(_sparkToolTipStartX + 8, _sparkToolTipStartY + 20);
                        ctx.lineTo(_sparkToolTipStartX + 14, _sparkToolTipStartY + 14);
                        ctx.lineTo(_sparkToolTipStartX + 14, _sparkToolTipStartY + 26);
                    }
                    ctx.closePath();
                    ctx.fill();

                    //INSERT TEXT FOR TOOLTIP
                    if (mergedConfig.tooltip.label) {
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;
                        if (mergedConfig.tooltip.theme == 'dark') {
                            ctx.fillStyle = '#ffffff';
                        } else {
                            ctx.fillStyle = '#344054';
                        }
                        ctx.font = "12px Arial";
                        ctx.fillText(mergedConfig.data.labels[sparkLineMouseIndex], sparkToolTipStartX + 12, sparkToolTipStartY + 26)
                    }

                    for (var jdx = 0; jdx < sparkLineToolTipText.length; jdx++) {
                        //DRAW COLOR CIRCLE
                        ctx.strokeStyle = mergedConfig.data.colors[sparkLineMouseJndex[jdx]];
                        ctx.lineWidth = 2;
                        ctx.fillStyle = mergedConfig.data.colors[sparkLineMouseJndex[jdx]];
                        ctx.beginPath();
                        if (mergedConfig.tooltip.label) {
                            ctx.arc(sparkToolTipStartX + 16, sparkToolTipStartY + 26 + 20 * (jdx + 1), 4, 0, 2 * Math.PI);
                        } else {
                            ctx.arc(sparkToolTipStartX + 16, sparkToolTipStartY + 26 + 20 * jdx, 4, 0, 2 * Math.PI);
                        }
                        ctx.stroke();
                        ctx.fill();

                        //ADD TEXT
                        if (mergedConfig.tooltip.theme == 'dark') {
                            ctx.fillStyle = '#ffffff';
                        } else {
                            ctx.fillStyle = '#667085';
                        }
                        if (mergedConfig.tooltip.label) {
                            ctx.font = "12px Arial";
                            ctx.fillText(sparkLineToolTipText[jdx], sparkToolTipStartX + 28, sparkToolTipStartY + 30 + 20 * (jdx + 1))
                        } else {
                            ctx.font = "12px Arial";
                            ctx.fillText(sparkLineToolTipText[jdx], sparkToolTipStartX + 28, sparkToolTipStartY + 20 * (jdx + 1))
                        }
                    }
                }
            }
        }
    }

    //MOUSE OUT EVENT
    canvas.addEventListener('mouseout', function () {
        sparkLineAnimationArray = [];
    })

    //REDRAW PER 25ms WHEN MOUSEMOVE
    canvas.addEventListener('mousemove', function (event) {
        if (sparkLineAnimationArray.length == 2) {
            if (mergedConfig.chart.dotDisplay != 'hover' || mergedConfig.hover != 'point') {
                var sparkLineCurPosAtMove = ((event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) % (labelSpace / 2)) > (labelSpace / 2) ? Math.floor((event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / (labelSpace / 2)) + 1 : Math.floor((event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / (labelSpace / 2));
                var sparkLinePrePosAtMove = ((sparkLineAnimationArray[sparkLineAnimationArray.length - 1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) % (labelSpace / 2)) > (labelSpace / 2) ? Math.floor((sparkLineAnimationArray[sparkLineAnimationArray.length - 1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / (labelSpace / 2)) + 1 : Math.floor((sparkLineAnimationArray[sparkLineAnimationArray.length - 1].event.x - leftPadding - sparkLineCanvasUpperLevelPaddingLeft) / (labelSpace / 2));
                if (sparkLineCurPosAtMove != sparkLinePrePosAtMove) {
                    sparkLineAnimationArray.push({
                        event: event,
                        opacity: 0
                    })
                    if (sparkLineAnimationArray.length == 3) {
                        sparkLineAnimationArray.shift();
                    }
                }
            } else {
                sparkLineAnimationArray.push({
                    event: event,
                    opacity: 0
                })
                if (sparkLineAnimationArray.length == 3) {
                    sparkLineAnimationArray.shift();
                }
            }
        } else {
            sparkLineAnimationArray.push({
                event: event,
                opacity: 0
            })
        }
    })
}

function sparkLineDrawLine(ctx, moveTo1, moveTo2, lineTo1, lineTo2, color) {
    ctx.beginPath();
    ctx.gradient = 0.3
    ctx.moveTo(moveTo1, moveTo2);
    ctx.lineTo(lineTo1, lineTo2);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function sparkLineDrawCircle(ctx, x, y, r, start, round, color, type) {
    ctx.beginPath();
    ctx.arc(x, y, r, start, round);
    if (type == 'fill') {
        ctx.strokeStyle = color;
    } else {
        ctx.strokeStyle = sparkLineExchangeColorForm(color, 0.1)
    }
    ctx.stroke();

    if (type == 'fill') {
        ctx.beginPath();
        ctx.fillStyle = '#ffffff'
        ctx.arc(x, y, r, start, round);
        ctx.fill();
    }
}

function sparkLineExchangeColorForm(hex, opacity) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
}