# max17048

Communicate over the i2c bus with the Maxim
[MAX17048 battery fuel gauge](https://www.maximintegrated.com/en/products/power/battery-management/MAX17048.html)
circuit to get battery charge information.
The MAX17048 integrated circuit (IC) is used on the [Geekworm UPS HAT Board](http://www.raspberrypiwiki.com/index.php/Raspi_UPS_HAT_Board) for the [Raspberry Pi](https://www.raspberrypi.org/).
This module is a thin wrapper around the IC's registers.
See the [data sheet](https://datasheets.maximintegrated.com/en/ds/MAX17048-MAX17049.pdf) for details about the
meanings of the values retrieved.

## Contents
 * [Warning](#Warning)
 * [Installation](#installation)
 * [Usage](#usage)
 * [API](#api)

## Warning
LiPo batteries can catch fire and explode if handled improperly. Ensure that you know what you are doing, and
I take no responsibility for damages caused by bugs in this code. 

## Installation
```
npm install max17048
```

### Requirements
Requires the use of the [async-i2c-bus](https://www.npmjs.com/package/async-i2c-bus) module.

## Usage
```
i2c = require('async-i2c-bus')
Max17048 = require('max17048');

async function printCellVoltage( max17048 )
{
  console.log( "Cell voltage: " + await max17048.getCellVoltage() + " V" );
}

async function main()
{
  const bus = i2c.Bus()

  await bus.open();

  var max17048 = new Max17048( bus )
  
  printCellVoltage( max17048 );
}

main()
```

## API

### max17048 = new Max17048( bus )
Pass an instance of Bus from the [async-i2c-bus](https://www.npmjs.com/package/async-i2c-bus) module.
The returned object contains the API methods below:

### async getCellVoltage()
Returns the cell voltage in volts.

### async getStateOfCharge()
Returns a value between 0 and 1, representing the charge of the battery, where 1 = fully charged and
0 = empty

### async getProductVersion()
Returns the IC production version.

### async getHibernationThresholds()
Returns a dictionary keys "activeThreshold" and "hibernationThreshold". From the data sheet:
* active threshold (volts): If at any ADC sample |OCVCELL| is greater than ActThr, the IC exits hibernate
mode.
* hibernate threshold (batery charge fraction per hour): If the absolute value of CRATE (charging rate) is less
than *hibernation threshold* for longer than 6min, the IC enters hibernate mode.

### async getAlertRange()
Returns a dictionary with keys "min" and "max", both values in volts. From the data sheet:
> The IC alerts while VCELL > VALRT.MAX (max) or VCELL < VALRT.MIN (min)

### async getChargingRate()
Returns the rate of charging (positive) or discharging (negative). The value is the fraction of the battery charge
change per hour. 1.0 would represent the battery being charged from empty to full in one hour. -0.5 would
represent the battery being discharged from full to empty in two hours (decrease of 50%/hour).

### async getID()
From the data sheet:
> *ID* is an 8-bit read-only value that is one-time programmable at the factory, which can be used as an
> identifier to distinguish multiple cell types in production.

### async getVReset()
Returns a dictionary with keys "vreset" (value in volts) and enabled (boolean). From the data sheet:
> ...a fast analog comparator and a slower digital ADC threshold to detect battery removal and reinsertion.

enabled:
> disable the analog comparator in hibernate mode to save approximately 0.5µA.

### async getStatus()
Returns a dictionary with keys and boolean values:
* *reset_indicator*: "is set when the device powers up. Any time this bit is set, the IC is not 
configured, so the model should be loaded and the bit should be cleared."
* *voltage_high*: "is set when VCELL has been above ALRT.VALRTMAX."
* *voltage_low*: "is set when VCELL has been below ALRT.VALRTMIN."
* *voltage_reset*: "is set after the device has been reset if EnVr [enable_voltage_reset_alert] is set.
* *soc_low*: "is set when SOC crosses the value in CONFIG.ATHD."
* *soc_change*: "(1% SOC change) is set when SOC changes by at least 1% if CONFIG.ALSC is set."
* *enable_voltage_reset_alert*: "when set to 1 asserts the ALRT pin when a voltage-reset event occurs under
the conditions described by the VRESET/ ID register."
