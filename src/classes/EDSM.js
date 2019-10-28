const remote = require('electron').remote;
const fetch = require('electron-fetch').default;
const fs = require('fs');
const root = __dirname + '\\..\\src';

class EDSM {
    constructor() {
        this.verify();
    }

    async verify() {
        if (fs.existsSync(root + '/user/edsm.json')) {
            let cmdr = JSON.parse(fs.readFileSync(root + '/user/edsm.json', 'utf-8'));
            if (cmdr.cmdr && cmdr.apikey) {
                let request = await fetch(`https://www.edsm.net/api-logs-v1/get-position?commanderName=${cmdr.cmdr}&apiKey=${cmdr.apikey}`);
                let response = await request.json().catch();
                if (response && response.msgnum === 100) {
                    this.name = cmdr.cmdr;
                    this.apikey = cmdr.apikey;
                } else {
                    this.name = undefined;
                    this.apikey = undefined;
                }
                return this;
            } else {
                this.name = undefined;
                this.apikey = undefined;
            }
        } else {
            this.name = undefined;
            this.apikey = undefined;
        }
    }
}

module.exports = EDSM;