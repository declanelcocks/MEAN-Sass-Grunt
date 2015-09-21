module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // ========================
    // Clean ==================
    // ========================
    clean: {
      tmp: {
        src: 'public/.tmp/**/*'
      },
      dist: {
        src: 'public/dist/**/*'
      }
    },

    // ========================
    // Styles =================
    // ========================
    // Convert SASS to CSS
    sass: {
      dist: {
        files: {
          'public/dist/css/main.css': 'public/src/styles/main.scss'
        }
      }
    },

    // Minify CSS
    cssmin: {
      target: {
        files: {
          'public/dist/css/main.css': ['public/dist/css/main.css']
        }
      }
    },

    // PostCSS - Autoprefixer & pixrem
    postcss: {
      options: {
        map: true,
        processors: [
          require('pixrem')(), // Fallback for rem units
          require('autoprefixer')({browsers: '> 5%'})
        ]
      },
      files: {
        src: 'public/dist/css/**/*.css'
      }
    },

    // ========================
    // HTML ===================
    // ========================
    html2js: {
      options: {
        base: 'public',
        module: 'app.templates',
        singleModule: true,
        useStrict: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        src: ['public/src/scripts/**/*.html'],
        dest: 'public/.tmp/ng.templates.js'
      }
    },

    // ========================
    // Scripts ================
    // ========================
    // JSHint
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      files: ['public/src/scripts/**/*.js']
    },

    // ngAnnotate - Annotate all the Angular files
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          'public/.tmp/ng.js': ['public/src/scripts/app.js', 'public/src/scripts/app.routes.js'],
          'public/.tmp/ng.annotate.templates.js': ['public/.tmp/ng.templates.js'],
          'public/.tmp/ng.scripts.js': ['public/src/scripts/**/*.js']
        }
      }
    },

    // Concatenate all scripts together
    concat: {
      ng: {
        src: ['public/.tmp/ng.js', 'public/.tmp/ng.annotate.templates.js', 'public/.tmp/ng.scripts.js'],
        dest: 'public/.tmp/ng.concat.js'
      },
      vendor: {
        src: ['public/src/vendor/angular/angular.js', 'public/src/vendor/angular/**/*.js', 'public/src/vendor/**/*.js'],
        dest: 'public/.tmp/vendor.concat.js'
      },
      build: {
        src: ['public/.tmp/vendor.concat.js', 'public/.tmp/ng.concat.js'],
        dest: 'public/dist/js/build.js'
      }
    },

    // Minify the JS
    uglify: {
      build: {
        files: {
          'public/dist/js/build.js' : ['public/dist/js/build.js']
        }
      }
    },

    // ========================
    // Watch Tasks ============
    // ========================
    watch: {
      devStyles: {
        files: ['public/src/styles/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      devScripts: {
        files: ['public/src/scripts/**/*'],
        tasks: ['html2js:main', 'newer:jshint', 'ngAnnotate', 'concat:ng', 'concat:build']
      }
    },

    concurrent: {
      dev: {
        tasks: ['watch:devStyles', 'watch:devScripts'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  /*
   * Default Task
   */
  grunt.registerTask('default', [
    'clean:tmp', 'clean:dist',
    'sass',
    'postcss',
    'cssmin',
    'html2js:main',
    'jshint',
    'ngAnnotate',
    'concat:ng', 'concat:vendor', 'concat:build',
    'clean:tmp',
    'uglify',
  ]);

  /* 
   * Development Task
   * - Convert SASS files to CSS
   * - Apply PostCSS for prefixes
   * - Watch the SASS files in 'src/styles'
   * - Lint the JS (not in vendor folder)
   * - Annotate the AngularJS files
   * - Concat all scripts together (vendor + AngularJS)
   * - Watch for changes in 'src/scripts'
   */
  grunt.registerTask('dev', [
    'clean:tmp', 'clean:dist',
    'sass',
    'postcss',
    'html2js:main',
    'jshint',
    'ngAnnotate',
    'concat:ng', 'concat:vendor', 'concat:build',
    'concurrent:dev'
  ]);

  /*
   * Build Task
   * Includes the same tasks as the dev task, but:
   * - Includes uglify and cssmin
   * - Doesn't watch for any changes
   */
  grunt.registerTask('build', [
    'clean:tmp', 'clean:dist',
    'sass',
    'postcss',
    'cssmin',
    'html2js:main',
    'jshint',
    'ngAnnotate',
    'concat:ng', 'concat:vendor', 'concat:build',
    'clean:tmp',
    'uglify',
  ]);
};