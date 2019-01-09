/*
 * Based on Maxim Datasheet here: https://datasheets.maximintegrated.com/en/ds/MAX17048-MAX17049.pdf
 */

const i2c = require('i2c-bus');

const address = 0x36;

// TODO: make this configurable:
const i2c1 = i2c.openSync(1);

// registers
const REGISTER_VCELL = 0x02;
const REGISTER_SOC = 0x04;
const REGISTER_MODE = 0x06;
const REGISTER_VERSION = 0x08;
const REGISTER_HIBRT = 0x0a;
const REGISTER_CONFIG = 0x0c;
const REGISTER_VALRT = 0x14;
const REGISTER_CRATE = 0x16;
const REGISTER_VRESET_ID = 0x18;
const REGISTER_STATUS = 0x1A;
const REGISTER_POR = 0xFE;

function readRegisterSync( register )
{
    var swappedWord, word;
    
    swappedWord = i2c1.readWordSync( address, register );
    word = (swappedWord & 0xff) << 8 | (swappedWord >> 8);
    
    return word;
}

function makeWordSigned( word )
{
    if ((word & 0x8000) != 0)
	return word - 0x10000;
    else
	return word;
}

exports.getCellVoltageSync = function() {
    var register = readRegisterSync( REGISTER_VCELL );

    // 78.125 uV per step in this register
    return register * 0.000078125;
}

// returns a value between 0 and 1, representing the charge of the battery, where 1 = fully charged and 0 = empty
exports.getStateOfChargeSync = function() {
    var register = readRegisterSync( REGISTER_SOC );

    return register / 25600.0;
}

exports.getProductionVersionSync = function () {
    var register = readRegisterSync( REGISTER_VERSION );

    return register;
}

exports.getHibernationThresholdsSync = function () {
    var register = readRegisterSync( REGISTER_HIBRT );

    console.log( "hibernation register=" + register.toString(16) );

    var activeThreshold = (register & 0xff) * 0.00125; // 1.25 mV / unit
    var hibernateThreshold = (register >> 8) * 0.00208; // battery charge fraction per hour

    return { "activeThreshold": activeThreshold, "hibernateTreshold": hibernateThreshold };
}

exports.getAlertRangeSync = function() {
    var register = readRegisterSync( REGISTER_VALRT );

    var max = (register & 0xff) * 0.020; // 20 mV / unit
    var min = (register >> 8) * 0.020; // 20 mV / unit

    return { "min": min, "max": max };
}

// return fraction per hour (0-1)
exports.getChargingRateSync = function() {
    var register = readRegisterSync( REGISTER_CRATE );
    var crate = makeWordSigned( register );

    return crate * 0.00208;
}

exports.getIDSync = function() {
    var register = readRegisterSync( REGISTER_VRESET_ID );

    return register & 0xff;
}

exports.getVResetSync = function() {
    var register = readRegisterSync( REGISTER_VRESET_ID );
    var vreset = (register >> 9) * 0.04; // 40 mV per unit
    var enabled = (register & 0x0100) == 0;
    
    return { "vreset": vreset, "enabled": enabled };
}

exports.getStatusSync = function() {
    var register = readRegisterSync( REGISTER_VRESET_ID );
    var reset = (register & 0x0100) != 0;
    var vh = (register & 0x0200) != 0;
    var vl = (register & 0x0400) != 0;
    var vr = (register & 0x0800) != 0;
    var hd = (register & 0x1000) != 0;
    var sc = (register & 0x2000) != 0;
    var envr = (register & 0x4000) != 0;

    return { "reset_indicator": reset,
	     "voltage_high": vh,
	     "voltage_low": vl,
	     "voltage_reset": vr,
	     "soc_low": hd,
	     "soc_change": sc,
	     "enable_voltage_reset_alert": envr };
}
