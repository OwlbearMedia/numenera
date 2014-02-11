module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      options: {
        port: 5000
      }
    },
    concat: {
      dist: {
        src: [
          'app/js/libs/jquery/jquery.min.js',
          'app/js/libs/bootstrap/bootstrap.min.js',
          'app/js/libs/masonry/masonry.pkgd.min.js',
          'app/js/libs/angular/angular.js',
          'app/js/libs/angular/angular-route.js',
          'app/js/libs/angular/angular-sanitize.min.js',
          'app/js/app.js'
        ],
        dest: 'app/js/<%= pkg.name %>.js',
      },
    },
    uglify: {
      options: {
        banner: '/*\n * <%= pkg.description %>\n * Version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n * Author: <%= pkg.author %>\n */\n'
      },
      build: {
        src: 'app/js/<%= pkg.name %>.js',
        dest: 'app/js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-express-server');
  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'express']);
};