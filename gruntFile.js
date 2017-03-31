var path = require("path");

module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


// Configure Grunt
    grunt.initConfig({

        express: {
            app: {
                options: {
                    bases: ['app/'],
                    port: 8000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            },
            dist: {
                options: {
                    bases: ['dist/'],
                    port: 8000,
                    hostname: "0.0.0.0",
                    livereload: false
                }
            }
        },

        watch: {
            scripts: {
                options: { livereload: true },
                files: [
                    'app/js/*.js'
                ]
                //tasks: ['']
            },
            htmls: {
                files: ['app/*.html'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['app/css/*.css'],
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

        copy: {
            generated: {
                expand: true,
                cwd: 'app/',
                src: '*.html',
                dest: 'dist/'
            },
            images: {
                expand: true,
                cwd: 'app/images/',
                src: '**',
                dest: 'dist/images/'
            },
            icons: {
                expand: true,
                cwd: 'app/components/semantic/dist/themes/default/assets/fonts/',
                src: '**',
                dest: 'dist/css/themes/default/assets/fonts/'
            },
            fotorama: {
                expand: true,
                cwd: 'app/components/fotorama/',
                src: '*.png',
                dest: 'dist/components/fotorama/'
            }
        },

        useminPrepare: {
            html: ['app/index.html', 'app/home.html'],
            options: {
                dest: 'dist'
            }
        },

        usemin: {
            html: ['dist/index.html', 'dist/home.html']
        }
    });

    grunt.registerTask('production',[
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('default',[
        'express:app',
        'watch'
    ]);

    grunt.registerTask('serve',[
        'express:dist',
        'watch'
    ]);

};
