const gulp = require("gulp");
const ts = require("gulp-typescript");
const npmDist = require('gulp-npm-dist');


function copy_npm_libs() {
	const npm_lib_execludes = [];

	return gulp.src(npmDist({ copyUnminified: false }), { base: './node_modules' })
		.pipe(gulp.dest('./libs'));
}

function build_ts() {

	const proj = ts.createProject("tsconfig.json");

	return proj.src().pipe(proj()).pipe(gulp.dest("./js"));

}

gulp.task("default", gulp.series(build_ts, copy_npm_libs));

