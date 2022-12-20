# smart-meter-mbus-dlms 

This tool can be used to read out the energy meter Kaifa MA309M as used by some Austrian electricity provider.
The data is read out via the M-Bus customer interface of the smart meter.
It can transfer the data via MQTT e.g. to your smart home hub. 
The tool is written in TypeScript and the generated JavaScript file runs within NodeJS.
I use it to read the data of my smart meter from Salzburg Netz (Salzburg AG). But it should also work with the 
following smart meters.

### Smart meter tested:

- Salzburg Netz (Salzburg AG)

### Smart meters probably working but not tested:

- Tinetz (TIWAG)
- Stadtwerke Schwaz
- Innsbrucker Kommunalbetriebe Aktiengesellschaft
- Vorarlberger Energienetze GmbH
- NÖ Netz (EVN Gruppe) (seems to be a slightly different format)

See "Logging and Debugging" below if you have troubles reading your smart meter.

## Prerequisites

You need a USB to M-Bus adapter and a device (e.g. a SBC - single board computer) where you can plug in the adapter and run the 
script with Node. I bought my adapter (ZTSHBK USB-zu-M-BUS-Slave-Modul Master-Slave) at amazon.de,
but it's currently not available there. It seems like the same product is available on eBay from 
China or directly from e.g. Aliexpress.

I use a Raspberry PI 3 where I plugged in the M-Bus Adapter and run the script.

You need a RJ12 or RJ11 plug to plug into the customer interface (Kundenschnittstelle) of the smart meter. 
Connect the center two wires to the M-Bus adapter. Your electricity provider should provide a document about the 
customer interface with more details.

To read out the data you need a decryption key. I could download it from the online portal of the smart meter
from my electricity provider Salzburg NETZ. There I could also activate the customer interface. It was
not activated by default.

The tool can output the data on the console, but usually you want to forward the data via MQTT to your smart home hub
where you can store the data in a database and create some visualizations. 

## Installation

### NodeJS & NPM

First you need to install node and npm on your system. I use a Raspberry Pi 3. Search the web for details 
for your system.

### Download script

I just installed it in the users home directory of my RaspberryPi.

Download the latest release archive "smart-meter-mbus-dlms.vx.y.z.tar.gz" from the Releases section of GitHub.
(https://github.com/nooxnet/smart-meter-mbus-dlms).
You can use wget or curl. 

`wget https://github.com/nooxnet/smart-meter-mbus-dlms/releases/download/v1.0.1/smart-meter-mbus-dlms-vx.y.z.tar.gz`

You can also download it to your Windows system and use WinSCP to transfer it.

Alternatively you can download the files smart-meter-mbus-dlms.js and config/default.template.json5 form the 
sources, but you have to rename default.template.json5 to default.json5. The config file must be in the 
config/ directory.

Unpack the files (replace the version numbers):

`tar -xzf smart-meter-mbus-dlms-vx.y.z.tar.gz`

Switch to the script directory:

`cd smart-meter-mbus-dlms`

### Configure script

First you have to determine the USB-Port where your M-Bus USB adapter ist connected to.

List USB ports:

`lsusb`

List USB devices:

`ls -l /dev/ttyUSB*`

List USB devices by id or path:

`ls -l /dev/serial/by-id/*`

`ls -l /dev/serial/by-path/*`

Open the config file:

`nano ./config/default.json5`

Set the serial port to your configuration. You can use /dev/ttyUSBx or the links from /dev/serial/by-id/ 
or /dev/serial/by-path/. 

You also have to set the decryption key. You should get this key from your electricity provider.
My provider provides an online portal for the smart meter where I could download my decryption key.

You can go through the rest of the config file. In the initial configuration MQTT is deactivated and
only the first APDU (application protocol data unit) is read. So one data package. Then the script stops. 
The OBIS values are logged to the console. This is ideal for initial testing.

### Install missing node modules

You need the following node modules. Most likely they are not yet installed on your system. 

- `npm i serialport` 
- `npm i config`
- `npm i smartmeter-obis` 
- `npm i mqtt`

## Execute script  

`node smart-meter-mbus-dlms.js`

If everything went fine, and you see a list of the OBIS values you can go on to configure MQTT.
If you start the script just when the smart meter is sending data the data might be incomplete.
A warning message might appear. This is no problem. The script waits until the next data
arrives and reads the next complete data package.

## Logging and debugging

There are quite some standards and layers involved to extract the OBIS values from the raw data.
For each layer logging is available. 

If you do not get the desired data when you execute the script you can start to activate logging
in the debug section of the config file. Best is to start from the top (serial port) to set the
desired logging to true.

When you have problems with the script you can use these logging outputs to post in a GitHub issue. 
I have tests where I can analyze these logging outputs.

You can also use the tools from [Gurux](https://www.gurux.fi/) (e.g. GuruX DLMS Director for .NET) 
to analyze those logging outputs.

## MQTT

Check the "mqtt" section in the config file, configure the data of your MQTT broker and enable MQTT. 
I'd suggest to set "testMode" to true. So nothing is published
yet to the MQTT broker, but you can see what would have been published.

You can then play around with the MQTT settings. If everything is fine disable "testMode".

## Create a service for the script

Before you create a service I'd suggest to disable all logging. So in the "debug" section of the 
config file set everything to false. Also note that "maxBytes", "maxTelegrams" and "maxApplicationDataUnits"
must all be set to 0. Else the script would stop prematurely.

To create a service I followed the steps from here:
- https://natancabral.medium.com/run-node-js-service-with-systemd-on-linux-42cfdf0ad7b2
- https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service/29042953#29042953

`cd /etc/systemd/system/`

Check your node location (see ExecStart= in the script below)

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

[Install]
WantedBy=multi-user.target
````

Enable the service on boot:

`sudo systemctl enable smartmeter.service`

Start/restart/status:

- `sudo systemctl start smartmeter.service`
- `sudo systemctl restart smartmeter.service`
- `sudo systemctl status smartmeter.service`
- `sudo systemctl stop smartmeter.service`

Verify:
- `journalctl -u smartmeter.service`
- `tail -n 50 /var/log/syslog`

If you make any config changes, restart the service:

`sudo systemctl restart smartmeter.service`

## Read duration

In noticed that the data arrives at my smart home hub (ioBroker) about two to three seconds after the 
readout time as delivered within the data package of the smart meter. I enabled time logging and saw that 
the first bytes arrived about 650 ms after that time. I'm not sure if this is a delay or maybe a slightly 
wrong time in either the smart meter or my Raspberry Pi. Receiving of the first telegram is completed about 
1200 ms later. The second another 600 ms later. This seems reasonable considering the baud rate of 2400.
Everything else (including MQTT publish) lasts for about 50 ms. So a total of 2500 ms.

## Implementation details

There are quite some standards and protocols involved to read out the data of these smart meters. 
I found implementations in Python, C, .NET, Java etc. but I found none in NodeJS/JavaScript.

As I use ioBroker as my smart home hub with a lot of NodeJS scripts I wanted to stay there - maybe parts
of the script can be integrated into ioBroker in the future.

### Reading the M-Bus telegrams and APDUs.

Reading the APDU (Application Protocol Data Units) from the raw serial port data is very well documented
in the documentation of the electricity providers.

For the data link layer I use the `TelegramReader` class to get single M-Bus telegrams. The data for a 
single APDU may be split up in multiple M-Bus telegrams. The smart meters mentioned above usually use two
M-Bus telegrams for one APDU. So on the transport layer level I use the `MultiTelegramReader` class to
read the APDUs. Some parts of the encrypted DLMS/COSEM data is already decoded here.

### Decrypting the encrypted APDU payload

Although the "Salzburg Netz" documentation says that the encryption is "AES128-CBC" it's most likely
"AES-GCM". "AES-CBC" does not work and the documentation of the other electricity providers state "AES-GCM".

"AES-GCM" usually uses an auth tag. But the smart meters do not use an auth tag when encrypting the message.
I saw code where a 12 byte auth tag with all "0x00" is used. But some libraries (like crypto from NodeJS)
do not accept this. Actually it does decrypt the message, but fails at the call of `final()` where it does some
additional checking if the message is valid. 

In a discussion about the same problem with a Java library I read that "AES-GCM" without auth tag is basically
"AES-CTR". With a slightly modified IV (initialization vector) the message can be decrypted using "AES-CTR".

### Reading the ASN.1 APDU

ASN.1 is a data type declaration notation. It describes the hierarchical structure of the APDU payload
with various data types. There are encoding rules which define how a data type is encoded as series of bytes.

The DLMS User Association website provides the ASN.1 definition for DLMS/COSEM (`COSEMpdu_GB83.asn`). There
are also some excerpts of the documentations available for free. Full documentations are not freely available.

I chose a more general approach to read the ASN.1 APDU payload. I wrote a tool which transcribes the ASN.1
definition file into TypeScript objects.

I then use these objects to read the APDU (see `cosem-data-reader.ts`). The DLMS/COSEM ASN.1 definitions are
very broad and support a lot more data types than the smart meter uses to encode the data. So I have mostly 
only implemented the data types and encoding variants which are actually used by the smart meter. 

### Extracting the OBIS values

As already mentioned the DLMS/COSEM definition is very broad. So I extract the relevant OBIS values hard coded
from the DLMS/COSEM result (see `cosem-obis-data-processor.ts`). I write the data into a simpler (less nested) 
JSON object. But a debug log is available which produces pretty much the same XML result
as other tools (like Gurux) do.

