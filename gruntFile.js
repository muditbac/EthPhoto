var path = require("path");

module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


// Configure Grunt
    grunt.initConfig({

        express: {
            all: {
                options: {
                    bases: ['dist/'],
                    port: 8080,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        watch: {
            scripts: {
                options: { livereload: true },
                files: [
                    'dist/js/*.js'
                ]
                //tasks: ['']
            },
            htmls: {
                files: ['dist/**/*.{html,js}'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['dist/**/*.css'],
                options: {
                    livereload: true
                }
            }

        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            source: {
                files: [{
                    src: [
                        'dist/js/*.js',
                        'dist/css/*.css'
                    ]
                }]
            }
        },

        useminPrepare: {
            html: 'dist/index.html',
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html']
        },

        uglify: {
            options: {
                report: 'min',
                // mangle: false
            },
            production:{
                files: {
                    'dist/js/app.js': 'dist/js/app.js'
                }
            }
        },

        jshint: {
            options: {
                ignores: ['dist/js/app.js']
            },
            all: ['gruntfile.js', 'app/js/*.js']
        },

        cssmin:{
            production:{
                files: {
                    'dist/css/app.css': 'dist/css/**/*.css'
                }
            }
        }

    });

    grunt.registerTask('production',[
        'jshint',
        'useminPrepare',
        'uglify',
        'cssmin',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('serve',[
        'express',
        'watch'
    ]);

};
