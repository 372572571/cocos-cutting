
interface Window {
    pip_service: PipConnection;
}

interface PipConnection {
    Send: (data: any) => boolean;
}

interface ConfigJson {
    python3?: string; // python3 路径
    adb?: string; // android adb 路径
    node?: string;
    apikey?: string;
    
}