import { BrowserPrint, ConvertAndSendOptions, ToFormat } from "./BrowserPrint"
import { ResponseCallback } from "./types"
import { attachOnDoneCallbacks, getApiLocation, getRequest } from "./utils"

/**
 * The connection type. Possible values are 'network', 'usb', 'bluetooth' 
 */
// export enum DeviceConnectionType {
//   Bluetooth = 'bluetooth',
//   USB = 'usb',
//   Network = 'network',
//   Driver = 'driver' // this one is not listed in the official JSDoc
// }

export type DeviceConnectionType = 'bluetooth' | 'usb' | 'network' | 'driver';

export type SendUrlOptions = {
  /**
   * The licensing key for the file conversion. Currently, only converting from a PDF file requires a licensing key
   */
  featureKey?: string

  /**
   * The format the file should be converted to. Options are zpl, cpcl, and kpl. Default value is zpl.
   */
  toFormat?: ToFormat

  /**
   * The file type of the resource to convert from. If not specified, the file extension will be used to determine file type.
   */
  fromFormat?: string
}

export type DeviceFields = {
  deviceType: string
  /**
   * not looking so unique!
   */
  uid: string
  provider: string
  /**
   * The friendly name of the device. This will be generated based on the response from discovered network printers. For USB printers, this value will be the same as the uid 
   */
  
  name: string
  connection: DeviceConnectionType
  version: number  
  manufacturer: string
}

/**
 * Represents a device. This object is passed to the client application to determine which device to communicate with.
 */
export class Device {
  // These private are not listed in jsdoc
  private _uid: string;
  private deviceType: string;
  private provider: string;
  private manufacturer: string;

  /**
   * The friendly name of the device. This will be generated based on the response from discovered network printers. For USB printers, this value will be the same as the uid 
   */
  public name: string;

  /**
   * The connection type. Possible values are 'network', 'usb', 'bluetooth'
   */
  public connection: DeviceConnectionType;

  // set by device
  public version: number;
  /**
   * The default number of times to retry on reads when no data is received. Set to 1 for bluetooth connections, otherwise 0. 
   */
  public readRetries: number;

  /**
   * A device is never instantiated directly, it is supplied by the native application.
   *
   * @param deviceJson Json describing this device
   */
  constructor(deviceJson: DeviceFields) {
    // TODO: back more properties to private (name, connection, version, readRetries)
    this._uid = deviceJson.uid;
    this.name = deviceJson.name;
    this.connection = deviceJson.connection;
    this.deviceType = deviceJson.deviceType;
    this.provider = deviceJson.provider;
    this.manufacturer = deviceJson.manufacturer;
    this.version = deviceJson.version;
    // not provided by device
    this.readRetries = ("bluetooth" === this.connection) ? 1 : 0;
  }

  public get uid(): string {
    return this._uid;
  }

  /**
   * Function that is called if the errorCallback is not included for a send operation
   */
  sendErrorCallback: ResponseCallback = () => {/* empty */ };
  /**
   * Function that is called if a finishedCallback is not included for a send operation
   */
  sendFinishedCallback: ResponseCallback = () => {/* empty */ };
  /**
   * Function that is called if an errorCallback is not included for a read operation
   */
  readErrorCallback: ResponseCallback = () => {/* empty */ };
  /**
   * Function that is called if an finishedCallback is not included for a read operation
   */
  readFinishedCallback: ResponseCallback = () => {/* empty */ };

  /**
   * Send data to the device
   * 
   * @since Client API Level 2 
   *
   * @param dataToSend The data to be sent to the device
   * @param onSuccessCallback The function that is called when sending is completed.
   * @param onErrorCallback The function that is called when an error occurs while sending.
   */
  send = (dataToSend: string, onSuccessCallback?: ResponseCallback, onErrorCallback?: ResponseCallback): void => {
    const requestToSend = getRequest("POST", getApiLocation() + "write");
    if (undefined === onSuccessCallback) {
      onSuccessCallback = this.sendFinishedCallback
    }
    if (undefined === onErrorCallback) {
      onErrorCallback = this.sendErrorCallback
    }
    attachOnDoneCallbacks(requestToSend, onSuccessCallback, onErrorCallback);
    requestToSend.send(JSON.stringify({
      device: {
        name: this.name,
        uid: this.uid,
        connection: this.connection,
        deviceType: this.deviceType,
        version: this.version,
        provider: this.provider,
        manufacturer: this.manufacturer
      },
      data: dataToSend
    }));
  }

  /**
   * Send contents of url or blob to the device without any conversion. 
   *
   * @since Client API Level 4 
   * 
   * @param resource The url from which data will be retrieved, or an already loaded blob, which will be sent to the device
   * @param onSuccessCallback The function that is called when sending is completed.
   * @param onErrorCallback The function that is called when an error occurs while sending.
   */
  sendFile = (resource: string | Blob, onSuccessCallback?: ResponseCallback, onErrorCallback?: ResponseCallback) => {
    if ("string" === typeof resource) {
      const onFileLoadedCallback = (newData: string | null | undefined) => {
        this.sendFile(newData ?? '' /* coersion for Typescript */, onSuccessCallback, onErrorCallback)
      };
      BrowserPrint.loadFileFromUrl(resource /* original code shadowed this variable */, onFileLoadedCallback, onErrorCallback);
    } else {
      const requestObject = getRequest("POST", getApiLocation() + "write");
      if (requestObject) {
        requestObject.responseType = "text";
        setupOnDoneCallbacks(requestObject, onSuccessCallback, onErrorCallback);
        const formData = new FormData;
        const jsonPayload = {
          device: this// woah weird.  probably we want
        };

        formData.append("json", JSON.stringify(jsonPayload));
        formData.append("blob", resource);
        requestObject.send(formData)
      }
    }
  }

  /**
   * Read data from the device 
   * 
   * @since Client API Level 2
   * 
   * @param finishedCallback The function that is called when reading is completed, passing in the data read.
   * @param errorCallback The function that is called when an error occurs while reading, passing in the error message if there is one.
   */
  read = (finishedCallback?: ResponseCallback, errorCallback?: ResponseCallback) => {
    const requestObject = getRequest("POST", getApiLocation() + "read");
    if (undefined === finishedCallback) {
      finishedCallback = this.readFinishedCallback
    }
    if (undefined === errorCallback) {
      errorCallback = this.readErrorCallback
    }
    attachOnDoneCallbacks(requestObject, finishedCallback, errorCallback)
    requestObject.send(JSON.stringify({
      device: {
        name: this.name,
        uid: this.uid,
        connection: this.connection,
        deviceType: this.deviceType,
        version: this.version,
        provider: this.provider,
        manufacturer: this.manufacturer
      }
    }))
  }

  /**
   * Read data from the device until a specific string is received, or the read response is empty
   * 
   * @since Client API Level 2 
   *
   * @param receivedString The String that must be received before the finishedCallback is called.
   * @param finishedCallback The function that is called when reading is completed, passing in the data read.
   * @param errorCallback The function that is called when an error occurs while reading, passing in the error message if there is one.
   * @param retries The number of reads to attempt before receiving any data. Once any amount of data is received, no retries will be made. If this value is undefined, the value of the readRetries property will be used.
   * @param c ??? not listed in jsdoc
   */
  readUntilStringReceived = (receivedString: string, finishedCallback?: ResponseCallback, errorCallback?: ResponseCallback, retries?: number, c?: string) => {
    if (!c) {
      c = "";
    }
    if (undefined === retries) {
      retries = this.readRetries
    }
    finishedCallback = function (device: Device, finishedCallbackInner: ResponseCallback, e, retries: number, g: string): ResponseCallback {
      return function (c: string | undefined | null) {
        if (c && 0 !== c.length) {
          retries = 0;
        } else if (0 >= retries) {
          finishedCallbackInner(g);
          return;
        }
        c = g + (c as string);
        if ("" !== receivedString && -1 < c.indexOf(receivedString)) {
          finishedCallbackInner(c)
        } else {
          device.readUntilStringReceived(receivedString, finishedCallbackInner, e, retries - 1, c)
        }
      }
    }(this, finishedCallback ?? BrowserPrint.defaultSuccessCallback /* to not need null assertion */, errorCallback, retries, c);
    this.read(finishedCallback, errorCallback)
  }

  /**
   * Read data from the device until a read completes with no data returned. 
   * 
   * @since Client API Level 2 
   *
   * @param finishedCallback The function that is called when reading is completed, passing in the data read.
   * @param errorCallback The function that is called when an error occurs while reading, passing in the error message if there is one.
   * @param retries The number of reads to attempt before receiving any data. Once any amount of data is received, no retries will be made. If this value is undefined, the value of the readRetries property will be used.
   */
  readAllAvailable = (finishedCallback?: ResponseCallback, errorCallback?: ResponseCallback, retries?: number): void => {
    this.readUntilStringReceived("", finishedCallback, errorCallback, retries);
  }

  /**
   * Send data to the device, then read a response back 
   *
   * @since Client API Level 2 
   * 
   * @param dataToSend 
   * @param finishedCallback 
   * @param errorCallback 
   */
  sendThenRead = (dataToSend: string, finishedCallback: ResponseCallback, errorCallback: ResponseCallback) => {
    this.send(dataToSend, function (device: Device): ResponseCallback {
      return function () {
        device.read(finishedCallback, errorCallback)
      }
    }(this), errorCallback)
  };

  /**
   * Send data to the device, then read a response back until the specified string is received or all data has been read
   * 
   * @since Client API Level 2
   * 
   * @param dataToSend The data to be sent to the device
   * @param receivedString The string that must be received before the finishedCallback is called.
   * @param finishedCallback The function that is called when reading is completed.
   * @param errorCallback The function that is called when an error occurs while sending or reading data.
   * @param retries The number of reads to attempt before receiving any data. Once any amount of data is received, no retries will be made. If this value is undefined, the value of the readRetries property will be used.
   */
  sendThenReadUntilStringReceived = (dataToSend: string, receivedString: string, finishedCallback: ResponseCallback, errorCallback?: ResponseCallback, retries?: number) => {
    this.send(dataToSend, function (device: Device): () => void {
      return function () {
        device.readUntilStringReceived(receivedString, finishedCallback, errorCallback, retries)
      }
    }(this), errorCallback)
  }
  /**
   * Send data to the device, then read a response back until the specified string is received or all data has been read
   *
   * @since Client API Level 2
   * 
   * @param dataToSend The data to be sent to the device
   * @param finishedCallback The function that is called when reading is completed.
   * @param errorCallback The function that is called when an error occurs while sending or reading data.
   * @param retries The number of reads to attempt before receiving any data. Once any amount of data is received, no retries will be made. If this value is undefined, the value of the readRetries property will be used.
   */
  sendThenReadAllAvailable = (dataToSend: string, finishedCallback: ResponseCallback, errorCallback?: ResponseCallback, retries?: number) => {
    this.send(dataToSend, function (a: Device): ResponseCallback {
      return function () {
        a.readUntilStringReceived("", finishedCallback, errorCallback, retries)
      }
    }(this), errorCallback)
  }

  /**
   * Send contents of url or blob to the device. If the url points to an image file (bmp, jpg, png, tif, gif) or PDF, it will automatically be converted to a printer command language. This method is a wrapper for BrowserPrint.convert
   *
   * @since Client API Level 4 
   * 
   * @param resource The url from which data will be retrieved and be sent to the device
   * @param finishedCallback The function that is called when sending is completed.
   * @param errorCallback The function that is called when an error occurs while sending.
   * @param options Options for converting the file. 
   */
  convertAndSendFile = (resource: string | Blob, finishedCallback: ResponseCallback, errorCallback?: ResponseCallback, options?: ConvertAndSendOptions) => {
    if (!options) {
      options = {}
    }
    if (!options.action) {
      options.action = "print"
    };
    // TODO: need to delegate to browserprint - is it a static method or do we need instance?
    BrowserPrint.convert(resource, this, options, finishedCallback, errorCallback)
  }

  /**
    * Send contents of url to the device. If the url points to an image file (bmp, jpg, png, tif, gif) or PDF, it will automatically be converted to a printer command language. 
    *
    * @since Client API Level 2 
    * @deprecated This method has been deprecated as of version 3.0.0 and will be removed in the future. Please reference convertAndSendFile for a replacement method.
    * 
    * @param url The url from which data will be retrieved and be sent to the device
    * @param onSuccessCallback The function that is called when sending is completed.
    * @param onErrorCallback The function that is called when an error occurs while sending.
    * @param options Options for converting the file at the url being sent.
    */
  sendUrl = (url: string, onSuccessCallback?: ResponseCallback, onErrorCallback?: ResponseCallback, options?: SendUrlOptions): void => {
    const requestObject = getRequest("POST", getApiLocation() + "write");
    // note: was attachOnDoneCallbacks in source - looks like a bug in source as could be undefined
    setupOnDoneCallbacks(requestObject, onSuccessCallback, onErrorCallback);

    const data: Record<string, any> = {
      device: {
        name: this.name,
        uid: this.uid,
        connection: this.connection,
        deviceType: this.deviceType,
        version: this.version,
        provider: this.provider,
        manufacturer: this.manufacturer
      },
      url
    }
    if (null != options && undefined != options) {
      data.options = options
    }
    requestObject.send(JSON.stringify(data))
  }
}

function setupOnDoneCallbacks(requestObject: XMLHttpRequest, onSuccessCallback: ResponseCallback | undefined, onErrorCallback: ResponseCallback | undefined) {
  throw new Error("Function not implemented.")
}
