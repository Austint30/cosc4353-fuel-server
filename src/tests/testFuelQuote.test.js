const assert = require('assert');

require('../services/firebase.service');

const { createFuelQuote, updateFuelQuote, deleteFuelQuote, listFuelQuotes, getFuelQuote } = require('../controllers/fuel.controller');
const { updateUser, deleteUser } = require('../controllers/user.controller');

describe('Test create/list/update/delete fuel quotes', () => {

    let uuid = 'TestFuelQuoteUnitTest';

    let quoteObj;

    it('Create test user for fuel quote testing', async () => {
        let data = {
            fullName: 'Walter White',
            address1: '308 Negra Arroyo Lane',
            address2: '308 Negra Arroyo Lane',
            city: 'Albuquerque',
            state: 'NM',
            zip: '87104'
        }
        await updateUser(uuid, data);
    })

    it('Create fuel quote', async () => {
        let data = {
            gallonsRequested: 3,
            deliveryDate: new Date().toISOString().split('T')[0],
            deliveryAddress: 'Test address'
        }
        quoteObj = await createFuelQuote(uuid, data);
        assert(!!quoteObj, 'quoteObj variable did not get filled with data!');
    })

    it('Check if new fuel quote is listed', async () => {
        let list = await listFuelQuotes(uuid);
        let found = list.find(quote => quote.id === quoteObj.id);
        assert(!!found, 'Fuel quote not found in list of quotes!');
    })

    it('Update fuel quote gallons to 4', async () => {
        let data = {
            gallonsRequested: 4, // Change to 4
            deliveryDate: quoteObj.deliveryDate,
            deliveryAddress: quoteObj.deliveryAddress
        }
        quoteObj = await updateFuelQuote(quoteObj.id, data);
    })

    it('Check if fuel quote was updated to 4 gallons', async () => {
        let obj = await getFuelQuote(quoteObj.id);
        console.log('Received fuel quote obj\n', obj);
        assert(obj.gallonsRequested === 4, 'Fuel quote price was not updated to 4!');
    })

    it('Delete fuel quote', async () => {
        await deleteFuelQuote(quoteObj.id);
    })

    it('Check if fuel quote is deleted', async () => {
        let quote = await getFuelQuote(uuid);
        assert(quote === undefined, 'Fuel quote still exists when it should have been deleted.');
    })

    it('Delete test user', async () => {
        await deleteUser(uuid);
    })
})