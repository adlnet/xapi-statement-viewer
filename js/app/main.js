define(function (require) {
  var $ = require('jquery');
  
  require(['xapiwrapper', 'datatables', 'cookie', 'transition', 'collapse', 'prettify', 'datetimepicker', 'growl'], function() {

    $(document).ready(function() {
      // Override any credentials put in the XAPIWrapper.js
      function resetConfig() {
          $("#endpoint").val("https://lrs.adlnet.gov/xapi/");
          $("#username").val("xapi-tools");
          $("#password").val("xapi-tools");
          setupConfig();
      }
      function setupConfig() {
          // get LRS credentials from user interface
          var endpoint = $("#endpoint").val();
          var user = $("#username").val();
          var password = $("#password").val();

          var conf = {
              "endpoint" : endpoint,
              "auth" : "Basic " + toBase64(user + ":" + password),
          };
          ADL.XAPIWrapper.changeConfig(conf);
      }
      
      setupConfig();

      var notificationSettings = {
        animate: {
          enter: 'animated fadeInUp',
          exit: 'animated fadeOutDown'
        },
        type: "success",
        placement: {
          from: "bottom",
          align: "right"
        },
      };

      var notificationErrorSettings = jQuery.extend(true, {}, notificationSettings);
      notificationErrorSettings.type = "danger";

      var dateTimeSettings = {
        // format: 'YYYY-MM-DDTHH:mm:ss', // ISO 8601
        showTodayButton: true,
        showClear: true
      };

      gmore = null;

      // Handle XAPIWrapper XHR Errors
      ADL.xhrRequestOnError = function(xhr, method, url, callback, callbackargs) {
          console.log(xhr);
          $.growl({ title: "Status " + xhr.status + " " + xhr.statusText + ": ", message: xhr.response }, notificationErrorSettings);
      };

      var table = $('#statement-list').DataTable({
        "columns": [
          { data: "timestamp", "defaultContent": "" },
          { data: "actor.name", "defaultContent": "" },
          { data: "verb.display.en-US", "defaultContent": "" },
          { data: "object.definition.name.en-US", "defaultContent": "" },
          { data: "object.objectType", "defaultContent": "" },
          { data: "authority.name", "defaultContent": "" },
            {
              "className":      'details-control',
              "orderable":      false,
              "data":           null,
              "defaultContent": ''
            }
          ],
          "rowCallback": function( row, data ) {
            var display = moment(data.timestamp);
            $('td:eq(0)', row).html( '<span title="' + data.timestamp + '">' + display.fromNow() + '</span>' );
            if (data.object.hasOwnProperty('name')) { $('td:eq(3)', row).html( data.object.name ); }
          },
          "order": [[0, 'desc']],
          "pageLength": 25
      });

      // Retreive statements from the LRS
      function getStatementsWithSearch(more) {
        var verbSort = $("#search-verb-sort").val();
        var verbId = $("#search-user-verb-id").val();
        var actorEmail = $("#search-actor-email").val();
        var relatedAgents = $("#search-related-agents").val();
        var activityId = $("#search-activity-id").val();
        var relatedActivities = $("#search-related-activities").val();
        var registrationId = $("#search-registration-id").val();
        var sinceDate = $("#search-statements-since-date input").val();
        var untilDate = $("#search-statements-until-date input").val();
        var limit = $("#search-limit").val();

        // Build Search
        var search = ADL.XAPIWrapper.searchParams();
        if (verbId != "") { search['verb'] = verbId; }
        if (verbSort != "") { search['ascending'] = verbSort; }
        if (actorEmail != "") { search['agent'] = JSON.stringify({ "mbox": "mailto:" + actorEmail}); }
        if (relatedAgents != "") { search['related_agents'] = relatedAgents; }
        if (activityId != "") { search['activity'] = activityId; }
        if (relatedActivities != "") { search['related_activities'] = relatedActivities; }
        if (registrationId != "") { search['registration'] = registrationId; }
        if (sinceDate != "") { search['since'] = sinceDate; }
        if (untilDate != "") { search['until'] = untilDate; }
        if (limit != "") { search['limit'] = limit; }
        //console.log(search);

        // Put together the xAPI Query
        var urlparams = new Array();
        var url = "https://lrs.adlnet.gov/xapi/statements";

        for (s in search) {
          urlparams.push(s + "=" + encodeURIComponent(search[s]));
        }
        if (urlparams.length > 0)
          url = url + "?" + urlparams.join("&");

        //console.log(url);
        $("#xapi-query").val(url);

        ADL.XAPIWrapper.getStatements(search, more, function(r) {           
            //console.log(r);
            var response = $.parseJSON(r.response);

            // update the status in the HTML
            if (r.status == 200) {
              $.growl({ title: "Status " + r.status + " " + r.statusText }, notificationSettings);
              if (response.more != "") {
                gmore = response.more;
              } else {
                gmore = null;
              }
              //console.log(gmore);
              stmts = $.parseJSON(JSON.stringify(response.statements));
              $('#statement-list').DataTable().rows.add(stmts).draw();
              prettyPrint();
            }
          });
        }

        /* Formatting function for row details - modify as you need */
        function format ( d ) {
          // `d` is the original data object for the row
          return '<div><pre class="prettyprint lang-js">'+
          JSON.stringify(d, null, 2)+
          '</pre></div>';
        }
         
        // Add event listener for opening and closing details
        $('#statement-list tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );

            if ( row.child.isShown() ) {
              // This row is already open - close it
              row.child.hide();
              tr.removeClass('shown');
            }
            else {
              // Open this row
              row.child( format(row.data()) ).show();
              tr.addClass('shown');
              PR.prettyPrint();
            }
        });

        // save panel state
        $("#query-options").on('shown.bs.collapse', function () {
          var active = $("#query-options.in").attr('id');
          $.cookie('activePanel', active);
        });
        $("#query-options").on('hidden.bs.collapse', function () {
          $.removeCookie('activePanel');
        });
        var last = $.cookie('activePanel');
        if (last != null) {
          $("#query-options.panel-collapse").removeClass('in');
          $("#" + last).addClass("in");
        }

        $(".collapser a").click(function (e) { e.preventDefault(); });

        // Populate the predefined verbs dropdown
        for (var key in ADL.verbs) {
          var $options = $("#search-predefined-verb");
          if (ADL.verbs.hasOwnProperty(key)) {
            $options.append($("<option />").val(ADL.verbs[key]['id']).text(ADL.verbs[key]['display']['en-US']));
          }
        }

        $('#search-statements-since-date').datetimepicker(dateTimeSettings);
        $('#search-statements-until-date').datetimepicker(dateTimeSettings);

        $("#search-predefined-verb").change(function() {
          var $this = $(this);
          $("#search-user-verb-id").val($this.val());
        });

        $("#get-statements-with-search").click(function(e) {
          $('#statement-list').DataTable().clear();
          getStatementsWithSearch(null);
          e.preventDefault();
        });
        
        // Populate the table
        getStatementsWithSearch(null);

        $("#more").click(function(e) {
          if (gmore != null) {
            getStatementsWithSearch(gmore);
          } else {
            $.growl({ title: "No more statments!" }, notificationErrorSettings);
          }
          e.preventDefault();
        });

        $("#reset-auth").click(function(e) {
          resetConfig();
          e.preventDefault();
        });

        $("#save-auth").click(function(e) {
          // In case the endpoint information has changed
          setupConfig();
          $('#statement-list').DataTable().clear();
          getStatementsWithSearch(null);
          e.preventDefault();
        });

    });
  });
});
