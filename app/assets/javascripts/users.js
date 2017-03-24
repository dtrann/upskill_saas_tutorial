/* global $, Stripe */
// Document ready
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  // Set stripe public key
  Stripe.setPublishable( $('meta[name="stripe-key"]').attr('content') );
  // When user clicks for submission button, prevent default submission behavior
  submitBtn.click(function(event) {
    event.preventDefault();
    
    // prevent button from being pressed multiple times while processing
    submitBtn.val("Processing").prop('disabled', true);
    
    // Collect the credit card fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    // Use Stripe JS library to check for errors
    var error = false;
    
    // validate card number
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert("This card number appears to be invalid");
    }
    
    // validate cvc number
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert("This CVC number appears to be invalid");
    }
    
    // validate expiration date
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert("This expiration date appears to be invalid");
    }
    
    if(error) {
      // dont send to Stripe and re-enable the button
      submitBtn.prop('disable', false).val("Sign Up");
    }
    else {
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    // Send the card info to stripe
    
    
    return false;
  });
  
  // stripe will return a card token
  function stripeResponseHandler(status, response) {
    // inject card token as hidden field
    var token = response.id;
    theForm.append($('<input type="hidden" name="user[stripe_card_token]">').val(token))
    // submit form to our rails app 
    theForm.get(0).submit();
  }
});

