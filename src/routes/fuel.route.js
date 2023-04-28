const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const fuelForm = require('../controllers/fuel.controller');
const { body, validationResult } = require('express-validator');
const { getUserUUID, getUserProfile } = require('../util/auth');
const { ForbiddenMessage } = require('../model/responses');
const { toCentralIsoFormat } = require('../util/date');

const validate = (method) => {
  switch (method) {
    case 'updateForm':
    case 'createForm': {
     return [
        body('deliveryDate', 'Delivery Date is required').exists().trim(),
        body('deliveryDate', 'Delivery Date is required').isISO8601().toDate().isAfter(toCentralIsoFormat(new Date())),
        body('gallonsRequested', 'Gallons Requested is required').exists().toFloat().isFloat({ min: 0 })
       ]   
    }
    case 'calculate':
      return [
        body('deliveryDate', 'Delivery Date is required').exists().trim(),
        body('deliveryDate', 'Delivery Date is required').isISO8601().toDate().isAfter(toCentralIsoFormat(new Date())),
      ]
  }
}

router.post('/quote/calculate', validate('calculate'), async (request, response, next) => {
  let uuid = await getUserUUID(request, response);
  let result =  await fuelForm.calcFuelPrice(uuid, gallonsRequested);
  response.json(result);
})

router.post('/quote/create', validate('createForm'), async (request, response, next) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  }

  let uuid = await getUserUUID(request, response);
  if (!uuid) return;
  let profile = await getUserProfile(request, response);
  if (!profile) return;

  let _body = request.body;

  let address = profile.address1;
  
  let data = {
    gallonsRequested: _body.gallonsRequested,
    deliveryDate: _body.deliveryDate,
    deliveryAddress: address
  }

  fuelForm.createFuelQuote(uuid, data)
    .then(data => response.json(data))
    .catch(err => next(err));
})

router.post('/quote/update/:id', validate('createForm'), async (request, response, next) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.mapped() });
  }
  
  let profile = await getUserProfile(request, response);
  if (!profile) return;

  let doc_id = request.params.id;
  if (!doc_id.startsWith(uuid)){
    response.status(403);
    response.json(new ForbiddenMessage());
    return;
  }

  let _body = request.body;

  let address = profile.address1;
  
  let data = {
    gallonsRequested: _body.gallonsRequested,
    deliveryDate: _body.deliveryDate,
    deliveryAddress: address
  }

  fuelForm.updateFuelQuote(request.params.id, data)
    .then(data => response.json(data))
    .catch(err => next(err));
})

router.get('/history', async (request, response, next) => {
  let uuid = await getUserUUID(request, response);
  if (!uuid) return;

  fuelForm.listFuelQuotes(uuid)
    .then(data => response.json(data))
    .catch(err => next(err));

})

module.exports = router;