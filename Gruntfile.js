// Generated on 2015-01-14 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        src: 'src',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            test: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['karma:unit']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                            dot: true,
                            src: [
                                '<%= config.dist %>/*'
                            ]
                        }]
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>/{,*/}*.js',
                'test/spec/{,*/}*.js'
            ]
        },

        uglify: {
            dist: {
                files: {
                    '<%= config.dist %>/decree.min.js': [
                        '<%= config.src %>/decree.js'
                    ]
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.registerTask('test', [
        'karma:unit'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'uglify:dist'
    ]);
};
