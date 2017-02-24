tui.util.defineNamespace("fedoc.content", {});
fedoc.content["helpers_calculator.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview calculator.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\n/*eslint no-magic-numbers: [1, {ignore: [-1, 0, 1, 2, 10, 20, 6, 0.1]}]*/\n\nvar chartConst = require('../const');\n\n/**\n * Calculator.\n * @module calculator\n */\nvar calculator = {\n    /**\n     * Calculate limit from chart min, max data.\n     *  - http://peltiertech.com/how-excel-calculates-automatic-chart-axis-limits/\n     * @memberOf module:calculator\n     * @param {number} min min minimum value of user data\n     * @param {number} max max maximum value of user data\n     * @param {number} tickCount tick count\n     * @returns {{min: number, max: number}} limit axis limit\n     */\n    calculateLimit: function(min, max) {\n        var saveMin = 0,\n            limit = {},\n            iodValue; // increase or decrease value;\n\n        if (min &lt; 0) {\n            saveMin = min;\n            max -= min;\n            min = 0;\n        }\n\n        iodValue = (max - min) / 20;\n        limit.max = max + iodValue + saveMin;\n\n        if (max / 6 > min) {\n            limit.min = 0 + saveMin;\n        } else {\n            limit.min = min - iodValue + saveMin;\n        }\n        return limit;\n    },\n\n    /**\n     * Normalize number.\n     * @memberOf module:calculator\n     * @param {number} value target value\n     * @returns {number} normalized number\n     */\n    normalizeAxisNumber: function(value) {\n        var standard = 0,\n            flag = 1,\n            normalized, mod;\n\n        if (value === 0) {\n            return value;\n        } else if (value &lt; 0) {\n            flag = -1;\n        }\n\n        value *= flag;\n\n        tui.util.forEachArray(chartConst.AXIS_STANDARD_MULTIPLE_NUMS, function(num) {\n            if (value &lt; num) {\n                if (num > 1) {\n                    standard = num;\n                }\n                return false;\n            } else if (num === chartConst.AXIS_LAST_STANDARD_MULTIPLE_NUM) {\n                standard = num;\n            }\n\n            return true;\n        });\n\n        if (standard &lt; 1) {\n            normalized = this.normalizeAxisNumber(value * 10) * 0.1;\n        } else {\n            mod = tui.util.mod(value, standard);\n            normalized = tui.util.addition(value, (mod > 0 ? standard - mod : 0));\n        }\n\n        normalized *= flag;\n\n        return normalized;\n    },\n\n    /**\n     * Make tick positions of pixel type.\n     * @memberOf module:calculator\n     * @param {number} size area width or height\n     * @param {number} count tick count\n     * @param {?number} additionalPosition additional position\n     * @returns {Array.&lt;number>} positions\n     */\n    makeTickPixelPositions: function(size, count, additionalPosition) {\n        var positions = [],\n            pxLimit, pxStep;\n\n        additionalPosition = additionalPosition || 0;\n\n        if (count > 0) {\n            pxLimit = {min: 0, max: size - 1};\n            pxStep = this.calculateStepFromLimit(pxLimit, count);\n            positions = tui.util.map(tui.util.range(0, size, pxStep), function(position) {\n                return Math.round(position + additionalPosition);\n            });\n            positions[positions.length - 1] = Math.round(size - 1 + additionalPosition);\n        }\n\n        return positions;\n    },\n\n    /**\n     * Make labels from limit.\n     * @memberOf module:calculator\n     * @param {{min: number, max: number}} limit axis limit\n     * @param {number} step step between max and min\n     * @returns {string[]} labels\n     * @private\n     */\n    makeLabelsFromLimit: function(limit, step) {\n        var multipleNum = tui.util.findMultipleNum(step);\n        var min = Math.round(limit.min * multipleNum);\n        var max = Math.round(limit.max * multipleNum);\n        var labels = tui.util.range(min, max + 1, step * multipleNum);\n\n        return tui.util.map(labels, function(label) {\n            return label / multipleNum;\n        });\n    },\n\n    /**\n     * Calculate step from limit.\n     * @memberOf module:calculator\n     * @param {{min: number, max: number}} limit axis limit\n     * @param {number} count value count\n     * @returns {number} step\n     */\n    calculateStepFromLimit: function(limit, count) {\n        return (limit.max - limit.min) / (count - 1);\n    },\n\n    /**\n     * Calculate adjacent.\n     * @param {number} degree degree\n     * @param {number} hypotenuse hypotenuse\n     * @returns {number} adjacent\n     *\n     *   H : Hypotenuse\n     *   A : Adjacent\n     *   O : Opposite\n     *   D : Degree\n     *\n     *        /|\n     *       / |\n     *    H /  | O\n     *     /   |\n     *    /\\ D |\n     *    -----\n     *       A\n     */\n    calculateAdjacent: function(degree, hypotenuse) {\n        return Math.cos(degree * chartConst.RAD) * hypotenuse;\n    },\n\n    /**\n     * Calculate opposite.\n     * @param {number} degree degree\n     * @param {number} hypotenuse hypotenuse\n     * @returns {number} opposite\n     */\n    calculateOpposite: function(degree, hypotenuse) {\n        return Math.sin(degree * chartConst.RAD) * hypotenuse;\n    },\n\n    /**\n     * Sum plus values.\n     * @param {Array.&lt;number>} values values\n     * @returns {number} sum\n     */\n    sumPlusValues: function(values) {\n        var plusValues = tui.util.filter(values, function(value) {\n            return value > 0;\n        });\n        return tui.util.sum(plusValues);\n    },\n\n    /**\n     * Sum minus values.\n     * @param {Array.&lt;number>} values values\n     * @returns {number} sum\n     */\n    sumMinusValues: function(values) {\n        var minusValues = tui.util.filter(values, function(value) {\n            return value &lt; 0;\n        });\n        return tui.util.sum(minusValues);\n    },\n\n    /**\n     * Make percentage value.\n     * @param {number} value - value\n     * @param {number} totalValue - total value\n     * @returns {number}\n     */\n    makePercentageValue: function(value, totalValue) {\n        return value / totalValue * 100;\n    }\n};\n\nmodule.exports = calculator;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"