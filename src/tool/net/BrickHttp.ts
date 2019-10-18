export enum HTTP_METHOD {
    POST = 'POST',
    GET = 'GET',
}

/**
 * 依赖接口
 *
 * @interface IOC_Http
 */
interface IOC_Http {
    timeout: number; // 超时时间
    baseURL: string; // 基础地址
    headers: { [key: string]: string }; // 头信息
    post: <T>(url: string, params?: { [key: string]: any }) => Promise<T>;
    get: <T>(url: string, params?: {}) => Promise<T>;
}

/**
 * http依赖
 *
 * @class HttpRely http 依赖
 * @implements {IOC_Http}
 */
class HttpRely implements IOC_Http {
    public timeout: number = 10000; // 超时时间
    public baseURL: string; // 基础地址
    public headers: { [key: string]: string } = { 'content-type': 'application/json' }

    constructor(baseUrl: string, headers?: { [key: string]: string }, timeout?: number) {
        for (let i in headers) {
            this.headers[i] = headers[i];
        }
        if (timeout) { this.timeout = timeout; }
        // 基础url
        this.baseURL = baseUrl;
    }

    post<T>(url: string, params?: { [key: string]: any }): Promise<T> {
        if (this.baseURL) { url = `${this.baseURL}${url}`; }
        return this.send(url, HTTP_METHOD.POST, params);
    }

    get<T>(url: string, data: {}): Promise<T> {
        if (this.baseURL) { url = `${this.baseURL}${url}`; }
        return this.send(url, HTTP_METHOD.GET, data);
    }

    /**
     * 发送
     *
     * @private
     * @template T 类型
     * @param {string} url 请求的url
     * @param {HTTP_METHOD} method 请求的类型
     * @param {{ [key: string]: any }} params 发送的请求参数
     * @returns {Promise<T>} 返回promise
     * @memberof HttpRely
     */
    private send<T>(url: string, method: HTTP_METHOD, params?: { [key: string]: any }): Promise<T> {
        return new Promise((resolve, reject) => {
            // 创建对象
            let xhr = new XMLHttpRequest();
            // 请求超时时间
            xhr.timeout = this.timeout;
            // 设置状态回调
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    let response: any = xhr.responseText;
                    try {
                        response = JSON.parse(response);
                        // 判断是否解析成功,如果还是字符串在解析一次
                        if (typeof response === 'string') {
                            response = JSON.parse(response);
                        }
                        resolve(response);
                    } catch (error) {
                        // 可能数据是空的json解析报错
                        // console.warn(error)
                    }
                }
                if (xhr.readyState === 4 && (xhr.status !== 200)) {
                    let response: any = xhr.responseText;
                    reject(response);
                }
            };
            switch (method) {
                // 设置请求信息
                case HTTP_METHOD.POST:
                    xhr.open(method, url, true);
                    this.setHeaders(xhr);
                    xhr.send(JSON.stringify(params));
                    break;
                case HTTP_METHOD.GET:
                    let temp: string = this.getParams(params);
                    xhr.open(method, url + temp, true);
                    this.setHeaders(xhr);
                    xhr.send();
                    break;
                default:
                    throw new Error(' Request type error .');
            }
        })
    }

    /**
     * 把key val数据解析成 url参数
     *
     * @private
     * @param {{ [key: string]: any }} params 需要解析的对象
     * @returns {string}
     * @memberof HttpRely
     */
    private getParams(params: { [key: string]: any }): string {
        let temp: string = '?'
        for (let index in params) {
            if (temp === '?') {
                temp = `${temp}${index}=${params[index]}`;
            } else {
                temp = `${temp}&${index}=${params[index]}`;
            }
        }
        return temp;
    }

    /**
     * 设置头信息
     *
     * @private
     * @param {XMLHttpRequest} xhr
     * @memberof HttpRely
     */
    private setHeaders(xhr: XMLHttpRequest) {
        for (let index in this.headers) {
            console.log(index, this.headers[index])
            xhr.setRequestHeader(index, this.headers[index]);
        }
    }

}

/**
 * http 请求实例
 *
 * @export
 * @class Http
 */
export class BrickHttp {

    /**
     * 依赖
     *
     * @private
     * @type {IOC_Http}
     * @memberof Http
     */
    private http: IOC_Http

    /**
     * 构建依赖
     * Creates an instance of Http.
     * @param {string} baseUrl // 基础url 例如 https://www.github.com
     * @param {{ [key: string]: string }} [headers] // 请求头信息
     * @param {number} [timeout]
     * @memberof Http
     */
    constructor(baseUrl: string, headers?: { [key: string]: string }, timeout?: number) {
        this.http = new HttpRely(baseUrl, headers, timeout);
    }

    /**
     * 发送get请求
     *
     * @template T
     * @param {string} url
     * @param {{}} [params]
     * @returns {Promise<T>}
     * @memberof Http
     */
    public get<T>(url: string, params?: {}): Promise<T> {
        return this.http.get<T>(url, params);
    }

    /**
     * 发送post请求
     *
     * @template T
     * @param {string} url
     * @param {{}} [params]
     * @returns {Promise<T>}
     * @memberof Http
     */
    public post<T>(url: string, params?: {}): Promise<T> {
        return this.http.post(url, params);
    }

    /**
     * 尝试从服务器中获取 ArrayBuffer 类型的数据
     *
     * @static
     * @param {string} url
     * @param {(data: ArrayBuffer) => void} call
     * @memberof Http
     */
    public static GetFileByArrayBuffer(url: string, call: (data: ArrayBuffer) => void) {
        let xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    xhr.responseType = 'arraybuffer';
                    call && call(xhr.response);
                } else {
                    call && call(xhr.response);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
}