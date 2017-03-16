var path = require("path");

module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //require('load-grunt-tasks')(grunt);

// Configure Grunt
    grunt.initConfig({


        deploy: {
          contracts: ["app/contracts/**/*.sol"],
          dest: "embark_client.js"
        },
        // connect: {
        //     livereload: {
        //         options: {
        //             port: 9000,
        //             hostname: 'localhost',
        //             middleware: function (connect) {
        //                 return [
        //                     function(req, res, next) {
        //                         res.setHeader('Access-Control-Allow-Origin', '*');
        //                         res.setHeader('Access-Control-Allow-Methods', '*');
        //                         next();
        //                     },
        //                 ];
        //             }
        //         }
        //     }
        // },

// Grunt express - our webserver
// https://github.com/blai/grunt-express
        express: {
            all: {
                options: {
                    bases: ['app/'],
                    port: 8080,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }

        },


// grunt-watch will monitor the projects files
// https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            scripts: {
                options: { livereload: true },
                files: [
                    'app/js/*.js'
                ]
                //tasks: ['']
            },
            htmls: {
                files: ['app/**/*.{html,js}'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['app/**/*.css'],
                options: {
                    livereload: true
                }
            },

        },


// grunt-open will open your browser at the project's URL
// https://www.npmjs.org/package/grunt-open
        // open: {
        //     all: {
        //         path: 'http://localhost:8080/',
        //         app: 'google-chrome'
        //     }
        // },

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

        copy: {
            generated: {
                src: 'app/index.html',
                dest: 'dist/index.html'
            }
            // templates: {
            //     cwd:'app/app/',
            //     src: '**/*.html',
            //     dest: 'dist/app/',
            //     expand: true
            // }
        },

        useminPrepare: {
            html: 'app/index.html',
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
                mangle: false
            },
            production:{
                files: {
                    'dist/js/app.js': 'dist/js/app.js'
                }
            }
        },

        jshint: {
            options: {
                ignores: ['app/js/app.js']
            },
            all: ['gruntfile.js', 'app/**/*.js']
        },

        cssmin:{
            production:{
                files: {
                    'dist/css/app.css': 'app/css/**/*.css'
                }
            }
        },

        concat: {
            production: {
                files:{
                    'dist/js/app.js': ['app/js/app.js', 'app/js/*.js']
                }
            }
        }


    });

    // grunt.event.on('watch', function(action, filepath, target) {

    //     var sassConfig = grunt.config( "sass" );        
    //     sassConfig.runtime.files[0].src = path.relative("app/css/scss/",filepath);
    //     grunt.config("sass", sassConfig);

    //     // http://stackoverflow.com/questions/18900772/grunt-watch-compile-only-one-file-not-all Refer this for more details
    //     console.log(action+":"+target);
    // });

// Creates the `server` task
    grunt.registerTask('production',[
        'jshint',
        'copy:generated',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'filerev',
        'usemin',
    ]);

    grunt.registerTask('default', [
        'express',  
        'deploy_contracts',
        'watch'

    ]);



};
