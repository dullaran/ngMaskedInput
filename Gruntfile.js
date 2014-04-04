/* global module */
/* global require */
/*jshint camelcase:false */

module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: "tmp"
        },

        jshint: {
            main: {
                src: [
                    "Gruntfile.js", "src/**/*.js", "tests/*.js"
                ],
                options: {
                    jshintrc: true,
                    reporter: require("jshint-stylish")
                }
            }
        },

        uglify: {
            minified: {
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.js"],
                    dest: "tmp/"
                }]
            },
            uncompressed: {
                options: {
                    beautify: true,
                    preserveComments: true,
                    compress: {
                        drop_console: true,
                        hoist_funs: true,
                        loops: true,
                        unused: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.js"],
                    dest: "tmp/"
                }]
            }
        },

        concat: {
            minified: {
                options: {
                },
                src: ["tmp/**/*.js"],
                dest: "releases/<%= pkg.name %>-<%= pkg.version %>.min.js"
            },
            uncompressed: {
                options: {
                },
                src: ["tmp/**/*.js"],
                dest: "releases/<%= pkg.name %>-<%= pkg.version %>.js"
            }
        },

        karma: {
            dev: {
                configFile: "karma.conf.js",
                browsers: ["PhantomJS"]
            },
            travis: {
                configFile: "karma.conf.js",
            },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerTask(
        "default",
        []
    );
    grunt.registerTask(
        "travis",
        ["jshint", "karma:travis"]
    );
    grunt.registerTask(
        "build",
        [
            "clean", "jshint", "uglify:minified", "concat:minified", "clean",
            "uglify:uncompressed", "concat:uncompressed", "karma:travis"
        ]
    );
};