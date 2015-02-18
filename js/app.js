require.config({
    baseUrl: 'js/lib',
    
    paths: {
        jquery: 'jquery',
        datatables: 'jquery.dataTables.min',
        cookie: 'jquery.cookie',
        dtbootstrap: 'dataTables.bootstrap',
        transition: 'transition',
        collapse: 'collapse',
        prettify: 'prettify.min',
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
    }
});

requirejs(['../app/main']);
