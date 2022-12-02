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

I'd suggest to create a subdirectory in your users home directory (on linux):

`mkdir smart-meter-mbus-dlms`

`cd smart-meter-mbus-dlms`

Download the file "smart-meter-mbus-dlms.js" from above (Code on https://github.com/nooxnet/smart-meter-mbus-dlms)
to this directory. You can use wget or curl. Or use pico/nano and just paste the source.
You can also download it to your Windows system and use WinSCP to transfer it.

Create a subdirectory "config"

`mkdir config`

`cd config`

Copy the file "default.template.json5" there (like above).

Rename this file:

`mv default.template.json5 default.json5`

### Configure script



NPM installs:
* npm i serialport 
* npm i config
* npm i smartmeter-obis
* npm i mqtt


## Logging and Debugging

NPM for Dev
* npm i --save @types/serialport
* npm i --save-dev webpack
* npm i --save-dev webpack-node-externals
* npm i --save-dev ts-loader webpack-node-externals
* npm i --save-dev eslint typescript
* npm i --save-dev @types/config

testing:
* npm install --save-dev jest
* npm install --save-dev ts-jest
* npm install --save-dev @types/jest
* npm install --save-dev @babel/preset-typescript
* npm install --save-dev @babel/preset-env 
