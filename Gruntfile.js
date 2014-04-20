// Generated on 2014-04-19 using generator-socketio 0.0.3
'use strict';
var moment = require('moment');
 
//var LIVERELOAD_PORT = 35729;
var RUNNING_PORT = 1337; // <- if you change this, you need to change in public/js/app.js and recompile
 
module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  grunt.initConfig({

  express: {
      options: {
        port:RUNNING_PORT
      },
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },

    cssmin: {
      combine: {
        files: {
          'public/css/core.css': 'public/bower_components/bootstrap.css/css/bootstrap.css'
        }
      }
    },

    less: {
      options: {
        //report:'gzip'
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          "public/css/core.css": "public/bower_components/bootstrap/less/bootstrap.less"
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/core.css': 'public/bower_components/sass-bootstrap/lib/bootstrap.scss',
        }
      }
    },    

    concat: {
      options: {
        separator: ';',
        stripBanners:true
      },
      dist: {
        src: ['public/js/app.js'],
        dest: 'public/js/concat.js',
      },
    },

    //this is currently turned off, since jquery KILLS it 
    jshint: {
      options: {
        curly: true,
        eqeqeq: false,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      files:{
        src:['public/js/concat.js', 'server.js', 'modules/**/*.js']
      } 
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          'public/js/app.min.js': ['public/js/concat.js']
        }
      }
    },

    // Watch Config
    watch: {
        files: ['views/**/*'],
        options: {
            livereload: true
        },
        scripts: {
            files: [
                'public/js/**/*.js', '!public/js/app.min.js', '!public/js/concat.js'
            ],
            tasks:['jshint'],
        },
        sass: {
            files: [
                'public/css/**/*.css',
            ],
        },
        express: {
            files:  [ 'server.js', 'modules/**/*.js', '!**/node_modules/**', '!Gruntfile.js' ],
            tasks:  [ 'express:dev' ],
            options: {
                nospawn: true // Without this option specified express won't be reloaded
            }
        },
    },

    connect: {
      all: {
        options: {
          port: RUNNING_PORT,//variable at top of this file
          // change this to '0.0.0.0' to access the server from outside
          hostname: 'localhost',

          middleware: function(connect, options) {
            return [
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              connect.static(options.base)
            ];
          }          
        }
      }
    },

    wait:{
      options: {
          delay: 1000
      },
      pause:{
        options:{
          before:function(options){
            console.log('pausing %dms before launching page', options.delay);
          },
          after : function() {
              console.log('pause end, heading to page (using default browser)');
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:' + RUNNING_PORT
      }
    }

  });
 
  grunt.registerTask('server', ['sass', 'jshint', 'express:dev', 'open', 'watch']);
  grunt.registerTask('build', ['sass', 'concat', 'jshint', 'uglify']);
  grunt.registerTask('launch', ['wait', 'open']);
  grunt.registerTask('default', ['build', 'express:dev', 'watch']);

};
