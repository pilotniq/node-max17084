i2c = require('async-i2c-bus')
Max17048 = require('./max17048');

async function printAll( bus )
{
    await bus.open();

    const max17048 = new Max17048( bus )

    console.log( "MAX 17048 status:" )

    console.log( "Cell voltage: " + await max17048.getCellVoltage() + " V" );
    
    console.log( "State of Charge: " + await max17048.getStateOfCharge() * 100 + " %" );

    console.log( "Production version: " + (await max17048.getProductionVersion()).toString(16) );
    var thresholds = await max17048.getHibernationThresholds();
    console.log( "Active Threshold: " + thresholds.activeThreshold + " V" );
    console.log( "Hibernate Treshold: " + thresholds.hibernateTreshold * 100 + " %/h" );
    var alertRange = await max17048.getAlertRange();
    console.log( "Min alert range: " + alertRange.min + " V" );
    console.log( "Max alert range: " + alertRange.max + " V" );
    console.log( "Charging rate: " + await max17048.getChargingRate() * 100 + " %/h" );
    console.log( "ID: 0x" + await max17048.getID().toString(16) );
    var vresetSync = await max17048.getVReset();
    console.log( "Battery change reset voltage: " + vresetSync.vreset + " V" );
    console.log( "Battery change reset enabled: " + vresetSync.enabled );
    var status = await max17048.getStatus();
      
    console.log( "Status: reset indicator = " + status.reset_indicator );
    console.log( "Status: voltage high = " + status.voltage_high );
    console.log( "Alert descriptors:" );
    console.log( "  voltage has been low = " + status.voltage_low );
    console.log( "  voltage has been high = " + status.voltage_reset );
    console.log( "  soc_low = " + status.soc_low );
    console.log( "Status: soc_change = " + status.soc_change );
    console.log( "Status: enable_voltage_reset_alert = " + status.enable_voltage_reset_alert );
}

const bus = i2c.Bus()

printAll( bus )
