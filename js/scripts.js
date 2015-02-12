var conf = {
  "endpoint" : "https://lrs.adlnet.gov/xapi/",
  "auth" : "Basic " + toBase64("xapi-tools" + ":" + "xapi-tools"),
};
ADL.XAPIWrapper.changeConfig(conf);

gmore = null;
function getStatements(more) {
  ADL.XAPIWrapper.getStatements(null, more, function(r) {
    //console.log(r);
    var response = $.parseJSON(r.response);

    // update the status in the HTML
    if (r.status == 200) {
      gmore = response.more;
      stmts = $.parseJSON(JSON.stringify(response.statements));
      $('#example').DataTable().rows.add(stmts).draw().nodes().to$();
      prettyPrint();
    }
  });
}
getStatements(null);

/* Formatting function for row details - modify as you need */
function format ( d ) {
  // `d` is the original data object for the row
  return '<div><pre class="prettyprint lang-js">'+
  JSON.stringify(d, null, 2)+
  '</pre></div>';
}

function addData() {
	getStatements(gmore);
}

$(document).ready(function() {
  var table = $('#example').DataTable({
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
    },
      "order": [[0, 'desc']],
      "pageLength": 25
  });
   
  // Add event listener for opening and closing details
  $('#example tbody').on('click', 'td.details-control', function () {
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
});
