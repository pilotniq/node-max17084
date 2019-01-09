max17048 = require('./max17048');

console.log( "MAX 17048 status:" );

console.log( "Cell voltage: " + max17048.getCellVoltageSync() + " V" );
console.log( "State of Charge: " + max17048.getStateOfChargeSync() * 100 + " %" );
console.log( "Production version: " + max17048.getProductionVersionSync().toString(16) );
var thresholds = max17048.getHibernationThresholdsSync();
console.log( "Active Threshold: " + thresholds.activeThreshold + " V" );
console.log( "Hibernate Treshold: " + thresholds.hibernateTreshold * 100 + " %/h" );
var alertRange = max17048.getAlertRangeSync();
console.log( "Min alert range: " + alertRange.min + " V" );
console.log( "Max alert range: " + alertRange.max + " V" );
console.log( "Charging rate: " + max17048.getChargingRateSync() * 100 + " %/h" );
console.log( "ID: 0x" + max17048.getIDSync().toString(16) );
var vresetSync = max17048.getVResetSync();
console.log( "Battery change reset voltage: " + vresetSync.vreset + " V" );
console.log( "Battery change reset enabled: " + vresetSync.enabled );
var status = max17048.getStatusSync();

console.log( "Status: reset indicator = " + status.reset_indicator );
console.log( "Status: voltage high = " + status.voltage_high );
console.log( "Status: voltage low = " + status.voltage_low );
console.log( "Status: voltage reset = " + status.voltage_reset );
console.log( "Status: soc_low = " + status.soc_low );
console.log( "Status: soc_change = " + status.soc_change );
console.log( "Status: enable_voltage_reset_alert = " + status.enable_voltage_reset_alert );

