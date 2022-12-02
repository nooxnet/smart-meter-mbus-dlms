# smart-meter-mdbus-dlms 

This tool can be used to read out the energy meter Kaifa MA309M as used by some Austrian electricity provider.
It can transfer the data via MQTT e.g. to your smart home hub. 
I use it to read the data of my smart meter from Salzburg Netz (Salzburg AG). But it should also work with the 
following smart meters.

### Smart meter tested:

- Salzburg Netz (Salzburg AG)

### Smart meters probably working but not tested (see chapter "Logging & Debugging" below):

- Tinetz (TIWAG)
- Stadtwerke Schwaz
- Innsbrucker Kommunalbetriebe Aktiengesellschaft
- Vorarlberger Energienetze GmbH
- NÖ Netz (EVN Gruppe) (seems to be a slightly different format)

The tool is written in TypeScript and the generated Javascript file runs within NodeJS.

## Prerequisites

You need an USB to MBus adapter and a computer where you can plug in the device and run the script with Node.
I bought my adapter (ZTSHBK USB-zu-MBUS-Slave-Modul Master-Slave) at amazon.de but it's currently not 
available there. It seems like the same product is available on eBay from China or directly from e.g. Aliexpress.

I use a Raspberry PI 3 where I plugged in the MBus Adapter and run the script.

You need a RJ12 or RJ11 plug to plug into the customer interface (Kundenschnittstelle) of the smart meter. 
Connect the center two wires to the MBus adapter. Your electricity provider should provide a document about the 
customer interface with more details.

To read out the data you need a decryption key. I could download it from the online portal of the smart meter
from my electricity provider Salzburg NETZ. There I could also activate the customer interface. It was
not activated by default.

The tool can output the data on the console, but usually you want to forward the data via MQTT to your smart home hub
where you can store the data in a database and create some visualizations. 

## Installation

### NodeJS & NPM

First you need to install node and npm on your system. I used a Raspberry Pi 3. Search the web for details 
for your system.

### Download Script

I just installed it in the users home directory of my RaspberryPi.

Download the latest release archive "smart-meter-mbus-dlms.vx.y.z.tar.gz" from Github Releases
(https://github.com/nooxnet/smart-meter-mbus-dlms).
You can use wget or curl. 
You can also download it to your Windows system and use WinSCP to transfer it.

Alternatively you can download the file smart-meter-mbus-dlms.js and config/default.template.json5 but
you have to rename default.template.json5 to default.json5.

Unpack the files:

`tar -xzf smart-meter-mbus-dlms.vx.y.z.tar.gz`

Switch to the script directory:

`cd smart-meter-mbus-dlms`

### Configure script

First you have to determine the USB-Port where your MBus USB adapter ist connected to.

List USB ports:

`lsusb`

List USB devices:

`ls -l /dev/ttyUSB*`

List USB by id or serial:

`ls -l /dev/serial/by-id/*`

`ls -l /dev/serial/by-path/*`

Open the config file:

`nano ./config/default.json5`

Set the serial port to your configuration. You can use /dev/ttyUSBx or the links from /dev/serial/by-id/ 
or /dev/serial/by-path/. 

You also have to set the decryption key. You should get this key from your electricity provider.
My provider provides an online portal for the smart meter where I could download my decryption key.

You can go through the rest of the config file. In the initial configuration MQTT is deactivated and
only the first APDU (application protocol data unit) is read. So one data package. The OBIS values
are logged to the console. This is ideal for initial testing.

### Install missing Node Modules

You need the following node modules. Most likely they are not yet installed on your system. 

- npm i serialport 
- npm i config 
- npm i smartmeter-obis 
- npm i mqtt

## Execute Script  

`node smart-meter-mbus-dlms.js`

If everything went fine, and you see a list of the OBIS values you can go on to configure MQTT.
If you start the script just when the smart meter sends data the data might be incomplete.
A warning message might appear. This is no problem. The script waits another 5 seconds and 
should read the next complete data package.

## Logging and Debugging

There are quite some standards and layers involved to extract the OBIS values from the raw data.
For each layer logging is available. 

If you do not get the desired data when you execute the script you can start to active logging
in the debug section of the config file. Best is to start from the top (serial port) to set the
desired logging to true.

You can use these logging outputs to post in a Github issue. I have tests where I can analyze these
logging outputs.

## MQTT

Check the "mqtt" section in the config file, configure the date of your MQTT broker and enable mqtt. 
I'd suggest to set "testMode" to true. So nothing is published
yet to the MQTT broker, but you can see what would have been published.

You can then play around with the MQTT settings. If everything is fine disable "testMode".

## Create a Service for the Script

Before you create a service I'd suggest to disable all logging. So in the "debug" section of the 
config file set everything to false. Also note that "maxBytes", "maxTelegrams" and "maxApplicationDataUnits"
must be all set to 0. Else the script would prematurely stop.

To create a service I followed those links:
- https://natancabral.medium.com/run-node-js-service-with-systemd-on-linux-42cfdf0ad7b2
- https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953

`cd /etc/systemd/system/`

Check your node location

`whereis node`

Create the service file:

`sudo nano smartmeter.service`

add and adapt to your needs:

````
[Unit]
Description=Smart Meter MBus DLMS Reader

[Service]

ExecStart=/usr/bin/node /home/pi/smart-meter-mbus-dlms/smart-meter-mbus-dlms.js
# ExecStart=/usr/bin/sudo /usr/bin/node /home/myserver/server.js
# ExecStart=/usr/local/bin/node /var/www/project/myserver/server.js

# Options Stop and Restart
# ExecStop=
# ExecReload=
# Required on some systems
WorkingDirectory=/home/pi/smart-meter-mbus-dlms/
# Restart service after 10 seconds if node service crashes
RestartSec=10
Restart=always
# Restart=on-failure
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=smart-meter-mbus-dlms
# #### please, not root users
# RHEL/Fedora uses 'nobody'
#User=nouser
# Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
#Group=nogroup
# variables
Environment=PATH=/usr/bin:/usr/local/bin
# Environment=NODE_ENV=production
# Environment=NODE_PORT=3001
# Environment="SECRET=pGNqduRFkB4K9C2vijOmUDa2kPtUhArN"
# Environment="ANOTHER_SECRET=JP8YLOc2bsNlrGuD6LVTq7L36obpjzxd"

[Install]
WantedBy=multi-user.target
````

Enable the service on boot:

`sudo systemctl enable smartmeter.service`

Start/restart/status:

- `sudo systemctl start smartmeter.service`
- `sudo systemctl restart smartmeter.service`
- `sudo systemctl status smartmeter.service`

Verify:
- `journalctl -u smartmeter.service`
- `tail -n 50 /var/log/syslog`

If you make any config changes, restart the service:

`sudo systemctl restart smartmeter.service`

## Implementation details
