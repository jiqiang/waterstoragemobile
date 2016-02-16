module.exports = function ( grunt ) {

    // Load grunt tasks automatically
    require( 'load-grunt-tasks' )( grunt );

    // Time how long tasks take. Can help when optimizing build times
    require( 'time-grunt' )( grunt );

    var srcFiles = [
        'client/www/js/*.js'
    ];
    var vendorFiles = [
        'client/www/lib/jquery-2.2.0.min.js', 'client/www/lib/ionic/js/ionic.bundle.js',
        'client/www/lib/angular-ios9-uiwebview.patch.js', 'javascript-tests/lib/angular-mocks.js'
    ];

    // Define the configuration for all the tasks
    grunt.initConfig( {
        pkg : grunt.file.readJSON( 'package.json' ),
        
        clean : [
            'build'
        ],
        
        eslint : {
            options : {
                configFile : 'eslint.json',
                format : 'checkstyle',
                outputFile : 'build/checkstyle.xml'
            },
            target : srcFiles,
        },
        
        jasmine : {
            test : {
                src : srcFiles,
                options : {
                    specs : 'javascript-tests/controllers/*Spec.js',
                    summary : 'true',
                    vendor : vendorFiles,
                    junit : {
                        path : 'build/test-reports',
                        consolidate : 'true'
                    }
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-eslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jasmine' );

    grunt.registerTask( 'test', [
        'clean', 'eslint', 'jasmine'
    ] );
};
