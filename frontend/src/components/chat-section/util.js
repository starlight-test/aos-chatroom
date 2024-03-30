export function ULID(len = 10) {
    const r = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let str = "";
    let ms = new Date().getTime();
    if (ms < 0) ms = 0 - ms;

    while (ms) {
        let val = ms % r.length;
        str = r[val] + str;
        ms = (ms - val) / r.length;
    }
    str += '-';
    for (let i = 0; i < len; i++) {
        let idx = Math.random() * r.length | 0;
        str += r[idx];
    }
    return str;
}
