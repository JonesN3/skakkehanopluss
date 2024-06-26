import { series, src, dest } from 'gulp';
import zip from 'gulp-zip';

function bundleFirefox() {
    return src('src/common/**/*.js')
        .pipe(src('src/firefox/**/*.js'))
        .pipe(src('src/manifest.json'))
        .pipe(src('src/common/**/*.png', { encoding: false }))
        .pipe(dest('dist/firefox'))
        .pipe(zip('firefox.zip'))
        .pipe(dest('dist'))
}

function bundleChrome() {
    return src('src/common/**/*.js')
        .pipe(src('src/chrome/**/*.js'))
        .pipe(src('src/manifest.json'))
        .pipe(src('src/common/**/*.png', { encoding: false }))
        .pipe(dest('dist/chrome'))
        .pipe(zip('chrome.zip'))
        .pipe(dest('dist'))
}

const def = series(bundleFirefox, bundleChrome);
export default def
