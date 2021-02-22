const AccessControllers = require("orbit-db-access-controllers");
const AccessController = require("orbit-db-access-controllers/src/access-controller-interface");
const pMapSeries = require("p-map-series");
const ensureAddress = require("./utils/ensure-ac-address");

const BCHJS = require("@psf/bch-js");
const bchjs = new BCHJS();

const TOKENID =
  "dd2fc6e47bfef7c9cfef39bd1be86b3a263a1822736a0c7a0655a758c6ea1713";

class OtherAccessController extends AccessController {
  constructor(orbitdb, options) {
    super();
    this._orbitdb = orbitdb;
    this._db = null;
    this._options = options || {};
  }

  /* Factory */
  static async create(orbitdb, options = {}) {
    const ac = new OtherAccessController(orbitdb, options);

    // console.log('orbitdb: ', orbitdb)
    console.log("create options: ", options);

    await ac.load(
      options.address || options.name || "default-access-controller"
    );

    // Add write access from options
    if (options.write && !options.address) {
      await pMapSeries(options.write, async e => ac.grant("write", e));
    }

    return ac;
  }

  async load(address) {
    if (this._db) {
      await this._db.close();
    }

    // Force '<address>/_access' naming for the database
    this._db = await this._orbitdb.keyvalue(ensureAddress(address), {
      // use ipfs controller as a immutable "root controller"
      accessController: {
        type: "ipfs",
        write: this._options.admin || [this._orbitdb.identity.id]
      },
      sync: true
    });

    this._db.events.on("ready", this._onUpdate.bind(this));
    this._db.events.on("write", this._onUpdate.bind(this));
    this._db.events.on("replicated", this._onUpdate.bind(this));

    await this._db.load();
  }

  // Returns the type of the access controller
  static get type() {
    return "othertype";
  }

  // Returns the address of the OrbitDB used as the AC
  get address() {
    return this._db.address;
  }

  // Return true if entry is allowed to be added to the database
  async canAppend(entry, identityProvider) {
    console.log("canAppend entry: ", entry);

    let validTx = false;

    const txid = entry.payload.key;

    validTx = await this._validateTx(txid);

    // // Write keys and admins keys are allowed
    // const access = new Set([...this.get('write'), ...this.get('admin')])
    // // If the ACL contains the writer's public key or it contains '*'
    // if (access.has(entry.identity.id) || access.has('*')) {
    //   const verifiedIdentity = await identityProvider.verifyIdentity(entry.identity)
    //   // Allow access if identity verifies
    //   return verifiedIdentity
    // }

    return validTx;
  }

  // Returns true if the txid burned at least 0.001 tokens.
  // Note: this uses an experimental getTxDataSlp() call in bch-js. This function
  // will change its output in the near future, which will break this prototype.
  async _validateTx(txid) {
    try {
      let isValid = false;

      const txInfo = await bchjs.RawTransactions.getTxDataSlp(txid);
      console.log(`txInfo: ${JSON.stringify(txInfo, null, 2)}`);

      if (txInfo.tokenId !== TOKENID)
        throw new Error(
          `TXID ${txid} does not involved SLP token ID ${TOKENID}`
        );

      // Sum up all the token inputs
      let inputTokenQty = 0;
      for (let i = 0; i < txInfo.vin.length; i++) {
        let tokenQty = 0;

        if (!txInfo.vin[i].tokenQty) {
          tokenQty = 0;
        } else {
          tokenQty = Number(txInfo.vin[i].tokenQty);
        }

        inputTokenQty += tokenQty;
      }
      console.log(`inputTokenQty: ${inputTokenQty}`);

      // Sum up all the token outputs
      let outputTokenQty = 0;
      for (let i = 0; i < txInfo.vout.length; i++) {
        let tokenQty = 0;

        if (!txInfo.vout[i].tokenQty) {
          tokenQty = 0;
        } else {
          tokenQty = Number(txInfo.vout[i].tokenQty);
        }

        outputTokenQty += tokenQty;
      }
      console.log(`outputTokenQty: ${outputTokenQty}`);

      const diff = inputTokenQty - outputTokenQty;
      console.log(`difference: ${diff}`);

      // If the difference is above a positive threshold, then it's a burn
      // transaction.
      if (diff > 100000) isValid = true;

      return isValid;
    } catch (err) {
      console.error("Error in _valideTx: ", err);
      return false;
    }
  }

  get capabilities() {
    if (this._db) {
      const capabilities = this._db.index;

      const toSet = e => {
        const key = e[0];
        capabilities[key] = new Set([...(capabilities[key] || []), ...e[1]]);
      };

      // Merge with the access controller of the database
      // and make sure all values are Sets
      Object.entries({
        ...capabilities,
        // Add the root access controller's 'write' access list
        // as admins on this controller
        ...{
          admin: new Set([
            ...(capabilities.admin || []),
            ...this._db.access.write
          ])
        }
      }).forEach(toSet);

      return capabilities;
    }
    return {};
  }

  get(capability) {
    return this.capabilities[capability] || new Set([]);
  }

  async close() {
    await this._db.close();
  }

  async save() {
    // return the manifest data
    return {
      address: this._db.address.toString()
    };
  }

  async grant(capability, key) {
    console.log("grant capability: ", capability);
    console.log("grant key: ", key);

    // Merge current keys with the new key
    const capabilities = new Set([
      ...(this._db.get(capability) || []),
      ...[key]
    ]);
    await this._db.put(capability, Array.from(capabilities.values()));
  }

  async revoke(capability, key) {
    const capabilities = new Set(this._db.get(capability) || []);
    capabilities.delete(key);
    if (capabilities.size > 0) {
      await this._db.put(capability, Array.from(capabilities.values()));
    } else {
      await this._db.del(capability);
    }
  }

  /* Private methods */
  _onUpdate() {
    this.emit("updated");
  }
}

module.exports = OtherAccessController;
