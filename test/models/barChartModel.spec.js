/**
 * @fileoverview test bar chart model
 * @author jiung.kang@nhnent.com
 */

'use strict';

var BarChartModel = require('../../src/js/models/barChartModel.js'),
    chartConst = require('../../src/js/const.js');

describe('test bar chart model', function() {
    var userData = [
            ['Element', 'Density'],
            ['Copper', 8.94],
            ['Silver', 10.49],
            ['Gold', 19.30],
            ['Platinum', 21.45]
        ];

    describe('test method', function() {
        var barChartModel = new BarChartModel();

        it('_setData', function() {
            barChartModel._setData(userData);
            expect(barChartModel.vAxis.axisType).toEqual('label');
            expect(barChartModel.hAxis.axisType).toEqual('value');
            expect(barChartModel.plot.vTickCount).toEqual(0);
            expect(barChartModel.plot.hTickCount).toEqual(5);
            expect(barChartModel.legend.labels).toEqual(['Density']);
            expect(barChartModel.popup.data[0]).toEqual({label:'Copper', value: 8.94, legendLabel: 'Density', id: '0-0'});
        });
    });

    describe('test construct', function() {
        it('init label axis', function() {
            var options = {
                    chart: {
                        title: 'chart title',
                    },
                    hAxis: {
                        title: 'hAxis title'
                    },
                    vAxis: {
                        title: 'vAxis title',
                        min: 1,
                        format: '0.0'
                    },
                    barType: 'column'
                },
                barChartModel = new BarChartModel(userData, options);
            expect(barChartModel.title).toEqual('chart title');
            expect(barChartModel.hAxis.isLabelAxis()).toBeTruthy();
            expect(barChartModel.vAxis.scale.min).toEqual(1);
            expect(barChartModel.vAxis.labels[1]).toEqual(6.3);
            expect(barChartModel.legend.labels).toEqual(['Density']);
            expect(barChartModel.popup.data[1]).toEqual({label:'Silver', value: 10.49, legendLabel: 'Density', id: '1-0'});
        });
    });
});