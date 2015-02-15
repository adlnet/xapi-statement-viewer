require.config({
    baseUrl: 'js/lib',
    
  /*<script type="text/javascript" language="javascript" src=""></script>
  <script type="text/javascript" language="javascript" src="js/moment.min.js"></script>
  <script type="text/javascript" language="javascript" src="js/bootstrap-datetimepicker.min.js"></script>
  <script type="text/javascript" language="javascript" src="js/bootstrap-growl.min.js"></script>
  <script type="text/javascript" language="javascript" src="js/cryptojs_v3.1.2.min.js"></script>
  <script type="text/javascript" language="javascript" src="js/xapiwrapper.min.js"></script>
  <script type="text/javascript" language="javascript" src="js/scripts.js" class="init"></script>*/
    
    paths: {
        jquery: 'jquery',
        datatables: 'jquery.dataTables.min',
        cookie: 'jquery.cookie',
        dtbootstrap: 'http://cdn.datatables.net/plug-ins/f2c75b7247b/integration/bootstrap/3/dataTables.bootstrap',
        transition: 'transition',
        collapse: 'collapse',
        prettify: 'https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min',
        moment: 'moment.min',
        datetimepicker: 'bootstrap-datetimepicker.min',
        growl: 'bootstrap-growl.min',
        xapiwrapper: 'xapiwrapper.min',
    },
    shim: {
        datatables: {
            deps: ['jquery']
        },
        cookie: {
            deps: ['jquery']
        },
        dtbootstrap: {
            deps: ['datatables']
        },
        transition: {
            deps: ['dtbootstrap']
        },
        collapse: {
            deps: ['dtbootstrap']
        },
        datetimepicker: {
            deps: ['dtbootstrap', 'moment']
        },
        growl: {
            deps: ['dtbootstrap']
        }
    },
    waitSeconds: 15
});

requirejs(['../app/main']);
