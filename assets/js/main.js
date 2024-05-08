"use strict";

//These are some functions I use all the time.
var getUrlVars =
  getUrlVars ||
  function () {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  };

//jQuery additions
//Deserializes query strings
(function ($) {
  $.deserialize = function (query, options) {
    if (query == "") return null;
    var hash = {};
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      var k = decodeURIComponent(pair[0]);
      var isArray = false;
      if (k.substr(k.length - 2) == "[]") {
        isArray = true;
        k = k.substring(0, k.length - 2);
      }
      var v = decodeURIComponent(pair[1]);
      // If it is the first entry with this name
      if (typeof hash[k] === "undefined") {
        if (isArray)
          // not end with []. cannot use negative index as IE doesn't understand it
          hash[k] = [v];
        else hash[k] = v;
        // If subsequent entry with this name and not array
      } else if (typeof hash[k] === "string") {
        hash[k] = v; // replace it
        // If subsequent entry with this name and is array
      } else {
        hash[k].push(v);
      }
    }
    return hash;
  };
  $.fn.deserialize = function (options) {
    return $.deserialize($(this).serialize(), options);
  };
})(jQuery);

//Add $.put and $.delete functions
(function ($) {
  jQuery.each(["put", "delete"], function (i, method) {
    jQuery[method] = function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback,
      });
    };
  });
})(jQuery);

//Prototypes

//validation function
String.prototype.validateAs =
  String.prototype.validateAs ||
  function (type) {
    var re;
    if (!type) {
      return false;
    }
    if (type == "email") {
      //from jquery validate plugin
      re =
        /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    } else if (type == "mongoid" || type == "objectid") {
      //24 digit hexadecimal
      re = /^[0-9a-fA-F]{24}$/;
    } else if (type == "required") {
      re = /\S/;
    } else if (type == "integer") {
      re = /^\s*(\+|-)?\d+\s*$/;
    } else if (type == "url" || type == "FQDN") {
      //from jquery validate plugin
      re =
        /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    } else if (type == "link") {
      re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    } else if (type == "date") {
      return !/Invalid|NaN/.test(new Date(this));
    } else if (type == "domain") {
      re = /^[a-z0-9]+[a-z0-9-\.]*[a-z0-9]+\.[a-z\.]{2,5}$/;
    } else if (type == "number" || type == "numeric") {
      re = /^-?\d+\.?\d*$/;
    } else if (type == "alphanumeric") {
      re = /^[a-z0-9]+$/i;
    } else if (type == "binary") {
      re = /^[01]+$/;
    } else if (type == "hexadecimal") {
      re = /^[a-f0-9]+$/i;
    } else if (type == "creditcard") {
      re =
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    } else {
      return false;
    }
    return re.test(this);
  };

//various string functions
String.prototype.toTitleCase =
  String.prototype.toTitleCase ||
  function () {
    return this.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

String.prototype.trim =
  String.prototype.trim ||
  function () {
    return this.replace(/^\s+|\s+$/, "");
  };

String.prototype.nl2br =
  String.prototype.nl2br ||
  function () {
    return this.replace(/(\r\n|\r|\n)/g, "<br />");
  };
String.prototype.br2nl =
  String.prototype.br2nl ||
  function () {
    return this.replace(/<br \/>|<br\/>/g, "\n");
  };
String.prototype.stripTags =
  String.prototype.stripTags ||
  function () {
    return this.replace(/<\S[^>]*>/g, "");
  };
var statesNamesAndAbbreviations = [
  { name: "Alabama", abbrev: "AL" },
  { name: "Alaska", abbrev: "AK" },
  { name: "Arizona", abbrev: "AZ" },
  { name: "Arkansas", abbrev: "AR" },
  { name: "California", abbrev: "CA" },
  { name: "Colorado", abbrev: "CO" },
  { name: "Connecticut", abbrev: "CT" },
  { name: "Delaware", abbrev: "DE" },
  { name: "District of Columbia", abbrev: "DC" },
  { name: "Florida", abbrev: "FL" },
  { name: "Georgia", abbrev: "GA" },
  { name: "Hawaii", abbrev: "HI" },
  { name: "Idaho", abbrev: "ID" },
  { name: "Illinois", abbrev: "IL" },
  { name: "Indiana", abbrev: "IN" },
  { name: "Iowa", abbrev: "IA" },
  { name: "Kansas", abbrev: "KS" },
  { name: "Kentucky", abbrev: "KY" },
  { name: "Louisiana", abbrev: "LA" },
  { name: "Maine", abbrev: "ME" },
  { name: "Maryland", abbrev: "MD" },
  { name: "Massachusetts", abbrev: "MA" },
  { name: "Michigan", abbrev: "MI" },
  { name: "Minnesota", abbrev: "MN" },
  { name: "Mississippi", abbrev: "MS" },
  { name: "Missouri", abbrev: "MO" },
  { name: "Montana", abbrev: "MT" },
  { name: "Nebraska", abbrev: "NE" },
  { name: "Nevada", abbrev: "NV" },
  { name: "New Hampshire", abbrev: "NH" },
  { name: "New Jersey", abbrev: "NJ" },
  { name: "New Mexico", abbrev: "NM" },
  { name: "New York", abbrev: "NY" },
  { name: "North Carolina", abbrev: "NC" },
  { name: "North Dakota", abbrev: "ND" },
  { name: "Ohio", abbrev: "OH" },
  { name: "Oklahoma", abbrev: "OK" },
  { name: "Oregon", abbrev: "OR" },
  { name: "Pennsylvania", abbrev: "PA" },
  { name: "Rhode Island", abbrev: "RI" },
  { name: "South Carolina", abbrev: "SC" },
  { name: "South Dakota", abbrev: "SD" },
  { name: "Tennessee", abbrev: "TN" },
  { name: "Texas", abbrev: "TX" },
  { name: "Utah", abbrev: "UT" },
  { name: "Vermont", abbrev: "VT" },
  { name: "Virginia", abbrev: "VA" },
  { name: "Washington", abbrev: "WA" },
  { name: "West Virginia", abbrev: "WV" },
  { name: "Wisconsin", abbrev: "WI" },
  { name: "Wyoming", abbrev: "WY" },
];
function getStateName(abbr) {
  if (typeof abbr === "undefined" || !abbr) {
    return false;
  } else
    return _.find(statesNamesAndAbbreviations, function (st) {
      return st.abbrev.toLowerCase() == abbr.toLowerCase();
    }).name;
}
function getStateAbbr(state) {
  if (typeof state === "undefined" || !state) {
    return false;
  } else
    return _.find(statesNamesAndAbbreviations, function (st) {
      return st.name.toLowerCase() == state.toLowerCase();
    }).abbrev;
}
$(function () {
  var updateChart = function updateChart() {
    $.getJSON(window.location.origin + ":3000/fetchData", function (rawData) {
      var data = rawData;
      var dataRows = [];
      var i = 4;
      var newData = {};
      _.each(data, function (entry) {
        newData.college = entry[0];
        newData.state = entry[1];
        newData.name = entry[2];

        var num = Number(entry[3].replace(/[^0-9\.]+/g, ""));
        console.log(num);
        newData.total = num;
        newData.totalFormatted = entry[3];

        dataRows.push(newData);
        newData = {};
      });

      dataRows.shift();
      dataRows = _.sortBy(dataRows, "total").reverse();
      var highNum = _.max(_.map(dataRows, "total")) * 1.5;
      $("#bar-graph").empty();
      _.each(dataRows, function (row) {
        $("#bar-graph").append(
          '\
          <div class="row donation-entry">\
            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-6 name-of-group">' +
            row.college +
            '\
            </div>\
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 state-logo">\
              <img src="assets/images/' +
            getStateName(row.state).split(" ").join("") +
            '.png" alt="' +
            row.state +
            '" class="img"/>\
            </div>\
            <div class="col-lg-8 col-md-8 col-sm-7 col-xs-4">\
              <div class="elbar hidden-xs" style="background-color: red;" data-width="' +
            100 * (row.total / highNum) +
            '%">\
              </div>\
              <div class="formatted-total-wrap">\
                <span class="formatted-total">' +
            row.totalFormatted +
            "</span>\
              </div>\
            </div>\
          </div>\
        "
        );
      });
      setTimeout(function () {
        $(".elbar").each(function () {
          var width = $(this).data("width");
          $(this).css({
            width: width,
          });
        });
      }, 400);
    });
  };
  updateChart();
  //setInterval(updateChart, 10000);
});
