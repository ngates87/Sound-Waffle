var gulp = require("gulp");
var ts = require("gulp-typescript");


var tsBuildOpts = {
	//"module": "amd",
	"target": "es5",
	"noEmitOnError": true,
	"removeComments":true,
};

gulp.task("default",function(){
   
   //var srcs =["./*.ts", "./js/*.ts"];
 
  	gulp.src("./*.ts")
		.pipe(ts(tsBuildOpts))
		.pipe(gulp.dest("./"));
    
	gulp.src("./js/*.ts")
		.pipe(ts(tsBuildOpts))
		.pipe(gulp.dest("./js/"));    
});