const chai = require('chai');
const assert = chai.assert;

const assertThrow = require('../helpers/assertThrow');
const tronWebBuilder = require('../helpers/tronWebBuilder');
const wait = require('../helpers/wait');
const shieldedUtils = require('../helpers/shieldedUtils');


const TronWeb = tronWebBuilder.TronWeb;

describe("Tronweb.ztron", function (){

    let tronWeb;
    let noteTxs; //notes
    const keysInfo = {};
    const shieldedAddress = 'TPcKtz5TRfP4xUZSos81RmXB9K2DBqj2iu';
    const trc20Address = 'TFUD8x3iAZ9dF7NDCGBtSjznemEomE5rP9';
    let startBlockIndex = 0, endBlockIndex = 0;
    const shieldedInfo = {
        sk: '0d768b4ab179d297da9c6bdbce61a476d2a74f6c03dc85e102762ad3b4997f84',
        ask: '971cc71faf72c38a38a0e211f335f18d450ec8ba3d1d8fabdfdda018acc50d04',
        nsk: 'a6f38ec76321287f5b1109e76fcb7077d1e0de3ccbc243acff648b2b470d2403',
        ovk: 'c0ed60956c272149c06944dd1c36813f04b1fac9828b5232b957c6fd4403ac55',
        ak: 'dc51a25220495e50637089cd6a98d9a36452a3d56f239fe38b826f8c878888d1',
        nk: '1893f19b3df3ef082a60582b4cacd30722eaa7d56e32331f7be0740d286f2bae',
        ivk: '940274c782928f3ae55f74eb1df96c5fad0e629e320ad68f49b0db76b0cedc03',
        d: '3b6e0f6dee4d147b3f0ff2',
        pkD: '58a8e1d29f8f074fd785e62f37bffe498f080ba0114a0fa1b389053ed9a8c603',
        payment_address: 'ztron18dhq7m0wf528k0c07fv23cwjn78swn7hshnz7dalleyc7zqt5qg55rapkwys20ke4rrqxramfxn'
    }


    before(async function () {
        tronWeb = tronWebBuilder.createInstance({
            fullNode: 'https://api.nileex.io/',
            solidityNode: 'https://api.nileex.io/'
        });
        // shieldedInfo = await tronWeb.ztron.getNewShieldedAddress();
    });

    describe('#constructor()', function () {

        it('should have been set a full instance in tronWeb', function () {

            assert.instanceOf(tronWeb.ztron, TronWeb.ZTron);
        });

    });

    describe('#getspendingkey', function (){
        it('should get a value', async function (){
            const spendingKeyInfo = await tronWeb.ztron.getSpendingKey();
            assert.ok(spendingKeyInfo.value);
            assert.strictEqual(spendingKeyInfo.value.length, 64);
            keysInfo.spendingKey = spendingKeyInfo.value
        })
    });

    describe("#getExpandedSpendingKey", function (){
        it('should get spending keys with the spendingKey', async function (){
            // const spendingKeyInfo = await tronWeb.ztron.getSpendingKey();
            const result  = await tronWeb.ztron.getExpandedSpendingKey(keysInfo.spendingKey);
            assert.ok(result.ask);
            assert.ok(result.nsk);
            assert.ok(result.ovk);
            assert.strictEqual(result.ask.length, 64);
            assert.strictEqual(result.nsk.length, 64);
            assert.strictEqual(result.ovk.length, 64);
            keysInfo.ask = result.ask;
            keysInfo.nsk = result.nsk;
            keysInfo.ovk = result.ovk;
        })

        it('should throw if The length of spendingKey is not equal to 64', async function (){
            const result = await tronWeb.ztron.getExpandedSpendingKey('0d1fd0aa0cca9f74eac4b542b62ec36ab84263534dae8814c69210180d3d49');
            console.log(result)
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getExpandedSpendingKey('0d1fd0aa0cca9f74eac4b542b62ec36ab84263534dae8814c69210180d3d49'),
            //     null,
            //     'the length of spendingKey\'s hex string should be 64'
            // )
        })

        it('should throw if spendingKey is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(null),
                'Invalid spendingKey provided'
            )
        })

        it('should throw if spendingKey is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(undefined),
                'Invalid spendingKey provided'
            )
        })

        it('should throw if spendingKey is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getExpandedSpendingKey(''),
                'Invalid spendingKey provided'
            )
        })

    })

    describe("#getAkFromAsk", function (){

        it('should get ak value with ask', async function (){
            const result = await tronWeb.ztron.getAkFromAsk(keysInfo.ask);
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.ak = result.value;
        })

        it('should throw if The length of ask is not equal to 64', async function (){
            const result = await tronWeb.ztron.getAkFromAsk('f1549d4a039140b07d0400cd0442be994bd16b9269b225eb75d1b6d334');
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getAkFromAsk('f1549d4a039140b07d0400cd0442be994bd16b9269b225eb75d1b6d334'),
            //     null,
            //     'the length of ask\'s hex string should be 64'
            // )
        })

        it('should throw if ask is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(null),
                'Invalid ask provided'
            )
        })

        it('should throw if ask is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(undefined),
                'Invalid ask provided'
            )
        })

        it('should throw if ask is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getAkFromAsk(''),
                'Invalid ask provided'
            )
        })
    })

    describe("#getNkFromNsk", function (){

        it('should get nk value with nsk', async function (){
            const result = await tronWeb.ztron.getNkFromNsk(keysInfo.nsk);
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.nk = result.value;
        })

        it('should throw if The length of nsk is not equal to 64', async function (){
            const result = await tronWeb.ztron.getNkFromNsk('ebaff02009978d74731bc81e08012927da1aaa6564f18d7');
            assert.ok(result.Error.indexOf('should be 64') !== -1)
            // await assertThrow(
            //     tronWeb.ztron.getNkFromNsk('ebaff02009978d74731bc81e08012927da1aaa6564f18d7'),
            //     null,
            //     'the length of nsk\'s hex string should be 64'
            // )
        })

        it('should throw if nsk is null.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(null),
                'Invalid nsk provided'
            )
        })

        it('should throw if nsk is undefined.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(undefined),
                'Invalid nsk provided'
            )
        })

        it('should throw if nsk is empty string.', async function (){
            await assertThrow(
                tronWeb.ztron.getNkFromNsk(''),
                'Invalid nsk provided'
            )
        })
    })

    describe("#getDiversifier", function (){
        it('should get a value', async function (){
            const result = await tronWeb.ztron.getDiversifier();
            assert.ok(result.d);
            keysInfo.d = result.d
        })
    })

    describe("#getIncomingViewingKey", function (){
        it('should get ivk', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, keysInfo.nk);
            assert.ok(result.ivk);
            assert.strictEqual(result.ivk.length, 64);
            keysInfo.ivk = result.ivk;
        })

        it('should throw if ak is empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getIncomingViewingKey('', keysInfo.nk),
                'Invalid ak provided'
            )
        })

        it('should throw if ak provides an irregular length', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak.slice(0, 10), keysInfo.nk);
            assert.ok(result.Error.indexOf('param length must be 32') !== -1)
        })


        it('should throw if nk is empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, ''),
                'Invalid nk provided'
            )
        })

        it('should throw if nk provides an irregular length', async function (){
            const result = await tronWeb.ztron.getIncomingViewingKey(keysInfo.ak, keysInfo.nk.slice(0, 10));
            assert.ok(result.Error.indexOf('param length must be 32') !== -1)
        })
    })

    describe("#getZenPaymentAddress", function (){
        it('should get paymentAddress', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, keysInfo.d);
            assert.ok(result.payment_address && result.pkD);
            keysInfo.pkD = result.pkD;
            keysInfo.payment_address = result.payment_address;
        })

        it('should throw if The length of ivk does not match the rules', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk.slice(0, 10), keysInfo.d);
            assert.ok(result.Error.indexOf('param length must be 32') !== -1);
        })

        it('should throw if an invalid d is passed', async function (){
            const result = await tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, '52a2416b346f416ed75049');
            assert.ok(result.Error.indexOf('d is not valid') !== -1);
        })

        it('should throw if ivk is an empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getZenPaymentAddress('', keysInfo.d),
                'Invalid ivk provided'
            )
        })

        it('should throw if d is an empty string', async function (){
            await assertThrow(
                tronWeb.ztron.getZenPaymentAddress(keysInfo.ivk, ''),
                'Invalid d provided'
            )
        })
    })

    describe("#getRcm", function (){
        it('should get rcm value', async function (){
            const result = await tronWeb.ztron.getRcm();
            assert.ok(result.value);
            assert.strictEqual(result.value.length, 64);
            keysInfo.rcm = result.value
        })
    })

    describe("#getNewShieldedAddress", function (){
        it('should get shieldedAddress value', async function () {
            const result = await tronWeb.ztron.getNewShieldedAddress();
            assert.ok(result.ask && result.sk && result.nsk && result.ovk
                && result.ak && result.nk && result.ivk && result.d && result.pkD && result.payment_address);
        })
    })

    describe("#createMintParams", function (){

        it('should get mintParams with ovk is object', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const params = {
                from_amount: '10',
                shielded_receives: {
                    note: {
                        value: 1,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                },
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk
            }

            const result = await tronWeb.ztron.createMintParams(params);
            assert.ok(result && result.trigger_contract_input);

            const address = tronWeb.defaultAddress.base58;
            //approve
            await shieldedUtils.makeAndSendTransaction(tronWeb, trc20Address, 'approve(address,uint256)', {},
                [{type: 'address', value: shieldedAddress},{type: 'uint256', value: 10}], address)
            // const approveTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
            //     tronWeb.address.toHex(trc20Address),
            //     'approve(address,uint256)',
            //     {},
            //     [{type: 'address', value: shieldedAddress},{type: 'uint256', value: 10}],
            //     tronWeb.address.toHex(address)
            // );
            // const signedApproveTransaction = await tronWeb.trx.sign(approveTransaction.transaction, tronWeb.defaultPrivateKey);
            // await tronWeb.trx.sendRawTransaction(signedApproveTransaction);

            const options = {
                shieldedParameter: result.trigger_contract_input
            }
            await shieldedUtils.makeAndSendTransaction(tronWeb, shieldedAddress, 'mint(uint256,bytes32[9],bytes32[2],bytes32[21])', options, [], address);
            // const startBlockInfo = await tronWeb.trx.getCurrentBlock()
            // const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
            //     tronWeb.address.toHex(shieldedAddress),
            //     'mint(uint256,bytes32[9],bytes32[2],bytes32[21])',
            //     options,
            //     [],
            //     tronWeb.address.toHex(address)
            // );
            //
            // // console.log(JSON.stringify(transaction , null , 4))
            //
            // const signedTransaction = await tronWeb.trx.sign(transaction.transaction, tronWeb.defaultPrivateKey);
            // await tronWeb.trx.sendRawTransaction(signedTransaction);
            const endBlockInfo = await tronWeb.trx.getCurrentBlock();
            startBlockIndex = startBlockInfo.block_header.raw_data.number;
            endBlockIndex = endBlockInfo.block_header.raw_data.number + 10;
        })

        it('should get mintParams with Expanded parameters', async function(){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const result = await tronWeb.ztron.createMintParams(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with options param', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const options = {
                visible: false,
                from_amount: '10000',
                shielded_receives: {
                    note: {
                        value: 1000,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                }
            }
            const result = await tronWeb.ztron.createMintParams(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress, options);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if avk not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const invalidOvk = 1111;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParams(invalidOvk, fromAmount, shieldedReceives, shieldedAddress),
                'Invalid ovk provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: invalidOvk
                }),
                'Invalid ovk provided'
            )
        })

        it('should throw if fromAmount not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const invalidFromAmount = 1000;
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, invalidFromAmount, shieldedReceives, shieldedAddress),
                'Invalid fromAmount provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: invalidFromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid fromAmount provided'
            )
        })

        it('should throw if shieldedReceives is an empty Object', async function (){
            const ovk = shieldedInfo.ovk;
            const shieldedReceivesEmpty = {};
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, fromAmount, shieldedReceivesEmpty, shieldedAddress),
                'Invalid shieldedReceives provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: null,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress not an address', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            const invalidAddress = shieldedAddress.slice(0, shieldedAddress.length - 3);
            await assertThrow(
                tronWeb.ztron.createMintParams(ovk, fromAmount, shieldedReceives, invalidAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParams({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: invalidAddress,
                    ovk: ovk
                }),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })
    })

    describe("#createMintParamsWithoutAsk", function (){

        it('should get mintParams with ovk is object', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const params = {
                from_amount: '1000',
                shielded_receives: {
                    note: {
                        value: 100,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                },
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk
            }

            const result = await tronWeb.ztron.createMintParamsWithoutAsk(params);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with Expanded parameters', async function(){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const result = await tronWeb.ztron.createMintParamsWithoutAsk(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should get mintParams with options param', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const options = {
                visible: false,
                from_amount: '10000',
                shielded_receives: {
                    note: {
                        value: 1000,
                        payment_address: shieldedInfo.payment_address,
                        rcm: rcmInfo.value
                    }
                }
            }
            const result = await tronWeb.ztron.createMintParamsWithoutAsk(shieldedInfo.ovk, '1000', shieldedReceives, shieldedAddress, options);
            assert.ok(result && result.trigger_contract_input);
        })

        it('should throw if avk not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const invalidOvk = 1111;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(invalidOvk, fromAmount, shieldedReceives, shieldedAddress),
                'Invalid ovk provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: invalidOvk
                }),
                'Invalid ovk provided'
            )
        })

        it('should throw if fromAmount not a string', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const invalidFromAmount = 1000;
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, invalidFromAmount, shieldedReceives, shieldedAddress),
                'Invalid fromAmount provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: invalidFromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid fromAmount provided'
            )
        })

        it('should throw if shieldedReceives is an empty Object', async function (){
            const ovk = shieldedInfo.ovk;
            const shieldedReceivesEmpty = {};
            const fromAmount = '1000';
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, fromAmount, shieldedReceivesEmpty, shieldedAddress),
                'Invalid shieldedReceives provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: null,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: ovk
                }),
                'Invalid shieldedReceives provided'
            )
        })

        it('should throw if shieldedTRC20ContractAddress not an address', async function (){
            const rcmInfo = await tronWeb.ztron.getRcm();
            const ovk = shieldedInfo.ovk;
            const shieldedReceives = {
                note: {
                    value: 100,
                    payment_address: shieldedInfo.payment_address,
                    rcm: rcmInfo.value
                }
            }
            const fromAmount = '1000';
            const invalidAddress = shieldedAddress.slice(0, shieldedAddress.length - 3);
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk(ovk, fromAmount, shieldedReceives, invalidAddress),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
            await assertThrow(
                tronWeb.ztron.createMintParamsWithoutAsk({
                    from_amount: fromAmount,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: invalidAddress,
                    ovk: ovk
                }),
                'Invalid shieldedTRC20ContractAddress address provided'
            )
        })

    })

    describe("#scanShieldedTRC20NotesByIvk", function (){
        it.only('should get shielded_spends with startBlockIndex is object', async function (){
            await wait(2)
            const params = {
                "start_block_index": 10701336 || startBlockIndex,
                "end_block_index": 10702335 || endBlockIndex,
                "shielded_TRC20_contract_address": shieldedAddress,
                "ivk": shieldedInfo.ivk,
                "ak": shieldedInfo.ak,
                "nk": shieldedInfo.nk,
                "visible": true
            }
            const options = {
                visible: true
            }
            const result = await tronWeb.ztron.scanShieldedTRC20NotesByIvk(params, options);
            assert.ok(result && result.noteTxs && result.noteTxs.length > 0);
            noteTxs = result.noteTxs
        })
    })

    describe("#createTransferParams", function (){
        let shieldedSpends;
        let shieldedReceives;
        before(async ()=>{
            const methodInstance = shieldedUtils.makeShieldedMethodInstance(tronWeb, shieldedAddress);
            const pathInfo = await methodInstance.getPath([noteTxs[0].position]).call();
            shieldedSpends = [{
                "note": noteTxs[0].note,
                "alpha": (await tronWeb.ztron.getRcm()).value,
                "root":  pathInfo[0].replace('0x', ''),
                "path":  pathInfo[1].map(v => v.replace('0x', '')).join(''),
                "pos": noteTxs[0].position
            }];
            shieldedReceives = [{
                note: {
                    value: 1,
                    payment_address: shieldedInfo.payment_address,
                    rcm: ( await tronWeb.ztron.getRcm()).value
                }
            }]
        })

        it('should get transferParams with ask is object', async function (){
            const params = {
                shielded_spends: shieldedSpends,
                shielded_receives: shieldedReceives,
                shielded_TRC20_contract_address: shieldedAddress,
                ovk: shieldedInfo.ovk,
                ask: shieldedInfo.ask,
                nsk: shieldedInfo.nsk
            }
            const result = await tronWeb.ztron.createTransferParams(params);
            assert.ok(result && result.trigger_contract_input);

            const options = {
                shieldedParameter: result.trigger_contract_input
            }
            const transactionResult = await shieldedUtils.makeAndSendTransaction(tronWeb, shieldedAddress,
                'transfer(bytes32[10][],bytes32[2][],bytes32[9][],bytes32[2],bytes32[21][])', options, [], tronWeb.defaultAddress.base58);
            assert.ok(transactionResult && transactionResult.result);
        })

        it('should get transferParams with Expanded parameters', async function(){
            const result = await tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, shieldedInfo.ovk,
                shieldedSpends, shieldedReceives, shieldedAddress, {});
            assert.ok(result && result.trigger_contract_input);
        })

        it.only('should throw if ask|nsk|ovk not a string', async function (){
            const invalidAsk = 1111;
            const invalidNsk = 1111;
            const invalidOvk = 1111;

            await assertThrow(
                tronWeb.ztron.createTransferParams(invalidAsk, shieldedInfo.nsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid ask provided'
            )
            await assertThrow(
                tronWeb.ztron.createTransferParams({
                    shielded_spends: shieldedSpends,
                    shielded_receives: shieldedReceives,
                    shielded_TRC20_contract_address: shieldedAddress,
                    ovk: shieldedInfo.ovk,
                    ask: invalidAsk,
                    nsk: shieldedInfo.nsk
                }),
                'Invalid ask provided'
            )

            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, invalidNsk, shieldedInfo.ovk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid nsk provided'
            )

            await assertThrow(
                tronWeb.ztron.createTransferParams(shieldedInfo.ask, shieldedInfo.nsk, invalidOvk,
                    shieldedSpends, shieldedReceives, shieldedAddress, {}),
                'Invalid ovk provided'
            )
        })
    })

    describe("#createTransferParamsWithoutAsk", function (){


    })

    describe("#createBurnParams", function (){


    })

    describe("#createBurnParamsWithoutAsk", function (){


    })

    describe("redjubjub tool", function (){
        it('should all passed.', function (){
            const keys = tronWeb.ztron.generate_keys();
            assert.ok(keys.sk && keys.ask && keys.nsk && keys.ovk && keys.ak && keys.nk && keys.ivk && keys.d && keys.pk_d && keys.payment_address)

            const keysBySk = tronWeb.ztron.generate_keys_by_sk(keys.sk)
            assert.ok(keysBySk.sk && keysBySk.ask && keysBySk.nsk && keysBySk.ovk && keysBySk.ak && keysBySk.nk
                && keysBySk.ivk && keysBySk.d && keysBySk.pk_d && keysBySk.payment_address)

            const keysByskd = tronWeb.ztron.generate_keys_by_sk_d(keys.sk, keysBySk.d)
            assert.ok(keysByskd.sk && keysByskd.ask && keysByskd.nsk && keysByskd.ovk && keysByskd.ak && keysByskd.nk
                && keysByskd.ivk && keysByskd.d && keysByskd.pk_d && keysByskd.payment_address)

            const rk_by_ask = tronWeb.ztron.generate_rk_by_ask(keys.ask, '2608999c3a97d005a879ecdaa16fd29ae434fb67b177c5e875b0c829e6a1db05')
            assert.ok(rk_by_ask)

            const spend_auth_sign = tronWeb.ztron.generate_spend_auth_sig(keys.ask, '2608999c3a97d005a879ecdaa16fd29ae434fb67b177c5e875b0c829e6a1db05', '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502')
            assert.ok(spend_auth_sign)

            const  verifySpendAuthSig = tronWeb.ztron.verify_spend_auth_sig(rk_by_ask, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502', spend_auth_sign)
            assert.ok(verifySpendAuthSig === true)

            const generate_pk_by_sk = tronWeb.ztron.generate_pk_by_sk(keys.ask);
            assert.ok(generate_pk_by_sk)

            const generate_binding_sig = tronWeb.ztron.generate_binding_sig(keys.ask, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502');
            assert.ok(generate_binding_sig)

            const verify_binding_sig = tronWeb.ztron.verify_binding_sig(generate_pk_by_sk, '3b78fee6e956f915ffe082284c5f18640edca9c57a5f227e5f7d7eb65ad61502', generate_binding_sig)
            assert.ok(verify_binding_sig === true)
        })
    })
})
