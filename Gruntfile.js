/* global module */
/* global require */

module.exports = function(grunt) {

    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            main: {
                src: [
                    "Gruntfile.js", "src/**/*.js"
                ],
                options: {
                    jshintrc: true,
                    reporter: require("jshint-stylish")
                }
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

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-karma");

    grunt.registerTask(
        "default",
        []
    );
    grunt.registerTask(
        "travis",
        ["jshint", "karma:travis"]
    );
};