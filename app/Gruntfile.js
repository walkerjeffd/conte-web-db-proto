module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      styles: {
        options: {
          destPrefix: 'public/stylesheets/vendor'
        },
        files: {
          'bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
          'bootstrap.css.map': 'bootstrap/dist/css/bootstrap.css.map',
          'bootstrap-theme.css': 'bootstrap/dist/css/bootstrap-theme.css',
          'bootstrap-theme.css.map': 'bootstrap/dist/css/bootstrap-theme.css.map'
        }
      },
      scripts: {
        options: {
          destPrefix: 'public/javascripts/vendor'
        },
        files: {
          'jquery.js': 'jquery/dist/jquery.js',
          'bootstrap.js': 'bootstrap/dist/js/bootstrap.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-bowercopy');

};