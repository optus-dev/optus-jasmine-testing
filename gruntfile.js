/*global module*/
/**
 * Barebones gruntfile config.
 */
module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-jasmine-task");

    grunt.initConfig({

        lint: {
            all: [
                'gruntfile.js',
                'public/javascripts/app/**/*.js',
                'public/jasmine/spec/**/*.js'
            ]
        },

        jshint: {
            options: {
                browser: true,
                curly: true,
                eqnull: true,
                immed: true,
                jquery: true,
                newcap: true,
                noarg: true,
                smarttabs: true,
                sub: true,
                undef: true,
                unused: true,
                evil: true
            }
        },

        /**
         * Jasmine test suite. Relies on server.js running
         */
        jasmine: {
            all: {
                src: [ 'http://localhost:3000/jasmine/SpecRunner.html' ],
                errorReporting: true
            }
        }

    });

    grunt.registerTask('default', 'lint');
};