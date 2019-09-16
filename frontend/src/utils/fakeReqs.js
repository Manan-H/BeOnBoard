import userInfo from "./testUserInfo.json";
function wait(ms) {
    var start = Date.now(),
        now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}
const reqUserInfo = id => {
    return new Promise((res,req) => {
        wait(500);
        res(userInfo)
    })
}

export const reqPhotoUrl = obj => {
    return new Promise((res,req) => {
        wait(500);
        res("http://www.pngplay.com/wp-content/uploads/2/Color-Smoke-PNG-Free-File-Download.png")
    })
}

export default reqUserInfo