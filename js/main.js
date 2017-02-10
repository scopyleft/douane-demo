/* global conf */
var gcodes = {
  'demo.droits-et-taxes.fr': 'UA-79921412-1',
  'dev.droits-et-taxes.fr': 'UA-81479036-1',
  'droits-et-taxes.fr': 'UA-45069184-4'
}
var gcode = gcodes[document.location.hostname] || ''
;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), // eslint-disable-line
m=s.getElementsByTagName(o)[0];a.async=0;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga') // eslint-disable-line
/* global ga */
ga('create', gcode, 'auto')
ga('send', 'pageview')
document.addEventListener('showpage', function (event) {
  ga('set', 'page', '/' + event.detail)
  ga('send', 'pageview')
})
document.addEventListener('buttonclick', function (event) {
  var button = event.detail
  var buttonValue = button.value || button.innerText || button.textContent
  var context = {
    product: conf.product,
    round: round,
    breadcrumb: breadcrumb.join(','),
    action: button.name,
    value: buttonValue
  }
  var trackingCode = templatize('{product}/{round}/{breadcrumb}/{action}:{value}', context)
  ga('send', 'event', 'calculator', 'click', trackingCode)
  if (!gcode && context) {
    console.debug(context)
    console.info('Value sent to GA:', trackingCode)
  }
  if ('tracking' in button.dataset) {
    breadcrumb.push(button.name + '=' + buttonValue)
  }
})

var round = 0
var breadcrumb = []
var Calculator = function () {
  this.init = function () {
    this._amount = 0
    this._shipping = 0
  }

  this.setAmount = function (value) {
    this._amount = parseInt(value, 10)
  }

  this.amount = function () {
    return this._amount
  }

  this.setShipping = function (value) {
    this._shipping = parseInt(value, 10)
  }

  this.shipping = function () {
    return this._shipping
  }

  this.amountWithVAT = function () {
    return this.addPercentage(this.amount(), 20)
  }

  this.amountWithShipping = function () {
    return this.amount() + this.shipping()
  }

  this.amountWithShippingAndVAT = function () {
    return this.addPercentage(this.amountWithShipping(), 20)
  }

  // fees are also subject to VAT (20%)
  this.amountWithFees = function (fees) {
    var subtotal = this.addPercentage(this.amount(), fees)
    return this.addPercentage(subtotal, 20)
  }

  // shipping and fees are also subject to VAT (20%)
  this.amountWithShippingAndFees = function (fees) {
    var subtotal = this.addPercentage(this.amountWithShipping(), fees)
    return this.addPercentage(subtotal, 20)
  }

  this.addPercentage = function (amount, percentage) {
    return amount * (1 + (percentage / 100))
  }
}
var calculator = new Calculator()
var container = document.querySelector('#container')
var footer = document.querySelector('footer')

// Replaces {variables} by variables values.
function templatize (str, context) {
  return str.replace(/{[\w.\+\s\(\)]*}/g, function (match) {
    var varName = match.substr(1, match.length - 2)
    try {
      return context ? context[varName] : eval(varName)
    } catch (ReferenceError) {
      document.location.hash = 'accueil'
    }
  })
}

// Returns string'ed rounded value or with a comma separated double decimal.
function formatNum (value) {
  var rounded = Math.round(value * 10) / 10
  var strValue = String(rounded)
  if (strValue.indexOf('.') < 0) {
    return strValue
  }
  var splitted = strValue.split('.')
  var decimal = splitted[1]
  return splitted[0] + ',' + decimal + (decimal.length > 1 ? '' : '0')
}

function showPage (page) {
  var source = document.querySelector('#' + page)
  var content = source.innerHTML
  content = templatize(content)
  container.innerHTML = content
  container.setAttribute('data-page', page)
  var withSatisfaction = source.hasAttribute('data-last')
  if (withSatisfaction) {
    footer.innerHTML = document.querySelector('#satisfaction').innerHTML
    footer.classList.add('satisfaction')
  } else if (footer.classList.contains('satisfaction')) {
    footer.innerHTML = ''
    footer.classList.remove('satisfaction')
  }

  var customClickEvent = document.createEvent('CustomEvent')
  ;[].forEach.call(document.querySelectorAll('a.button,button'), function (button) {
    button.addEventListener('click', function (event) {
      customClickEvent.initCustomEvent('buttonclick', true, true, button)
      document.dispatchEvent(customClickEvent)
    })
  })
  var customPageEvent = document.createEvent('CustomEvent')
  customPageEvent.initCustomEvent('showpage', true, true, page)
  document.dispatchEvent(customPageEvent)
}

function submitAmount (event) {
  event.preventDefault()
  var form = event.target
  calculator.setAmount(form.querySelector('[name=amount]').value)
  if (typeof(postSubmitAmount) !== 'undefined') postSubmitAmount(event)
  document.location.href = event.target.action
}

function start () {
  round++
  calculator.init()
  breadcrumb = []
}

var hash = document.location.hash
showPage(hash ? hash.slice(1) : 'accueil')

window.addEventListener('hashchange', function (event) {
  var hash = document.location.hash && document.location.hash.slice(1)
  hash && showPage(hash)
})
