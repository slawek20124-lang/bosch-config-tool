declare module 'serialport' {
  export interface SerialPortListItem {
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    vendorId?: string;
    productId?: string;
  }

  export interface SerialPortOpenOptions {
    path: string;
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: 'none' | 'even' | 'mark' | 'odd' | 'space';
    autoOpen?: boolean;
  }

  export class SerialPort {
    static list(): Promise<SerialPortListItem[]>;

    constructor(options: SerialPortOpenOptions);

    readonly isOpen: boolean;
    open(callback?: (error?: Error | null) => void): void;
    close(callback?: (error?: Error | null) => void): void;
    write(data: string, callback?: (error?: Error | null) => void): void;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    pipe<T>(destination: T): T;
  }
}

declare module '@serialport/parser-readline' {
  export interface ReadlineParserOptions {
    delimiter?: string;
  }

  export class ReadlineParser {
    constructor(options?: ReadlineParserOptions);
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
  }
}
