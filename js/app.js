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
        notify: 'bootstrap-notify.min',
        xapiwrapper: 'xapiwrapper.min',
        //store: 'store+json2.min',
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
        notify: {
            deps: ['dtbootstrap']
        }
    }
});

requirejs(['../app/main']);
