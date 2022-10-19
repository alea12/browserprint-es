import 'jsdom-global/register'
import { Device, DeviceFields } from '../src/Device'
import assert from 'assert';

describe(' > Device tests', () => {
  it('creates Device (and sets name) - Basic test', async () => {
    const realExample: DeviceFields = {
      "deviceType": "printer",
      "uid": "Zebra ZP 500 (ZPL)",
      "provider": "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
      "name": "Zebra ZP 500 (ZPL)",
      "connection": "driver",
      "version": 3,
      "manufacturer": "Zebra Technologies"
    }
    const device = new Device(realExample);
    assert.strictEqual(device.name, 'Zebra ZP 500 (ZPL)');
  });

  const getLocalDevicesAPIResponse = {
    "printer": [
      {
        "deviceType": "printer",
        "uid": "27j184501282",
        "provider": "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
        "name": "27j184501282",
        "connection": "usb",
        "version": 3,
        "manufacturer": "Zebra Technologies"
      }, {
        "deviceType": "printer",
        "uid": "Zebra ZP 500 (ZPL)",
        "provider": "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
        "name": "Zebra ZP 500 (ZPL)",
        "connection": "driver",
        "version": 3,
        "manufacturer": "Zebra Technologies"
      }]
  };

  const getApplicationConfigurationAPIResponse = {
    "application":{
      "api_level":3,
      "build_number":279,
      "version":"1.2.1.279",
      "platform":"windows"
    }
  }

// sample for device.read()
//  start of text character (STX) marks the start of the textual part of a stream
//  end of text character (ETX)
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,0
// 030,0,0,1245,000,0,0,0,000,0,0,0
// 000,0,0,0,0,2,4,0,00000000,1,000
// 1234,

})