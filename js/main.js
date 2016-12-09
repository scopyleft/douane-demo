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
  var buttonValue = button.value || button.innerText
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
var calculator = {
  init: function () {
    this._amount = 0
  },

  setAmount: function (value) {
    this._amount = value
  },

  amount: function () {
    return this._amount
  },

  amountWithVAT: function () {
    var x = this.addPercentage(this.amount(), 20)
    return x
  },

  // fees (4%) are also subject to VAT (20%)
  amountWithFees: function () {
    var subtotal = this.addPercentage(this.amount(), 4)
    return this.addPercentage(subtotal, 20)
  },

  addPercentage: function (amount, percentage) {
    return amount * (1 + (percentage / 100))
  }
}
var container = document.querySelector('#container')
var footer = document.querySelector('footer')

// Replaces {variables} by variables values.
function templatize (str, context) {
  return str.replace(/{[\w.\(\)]*}/g, function (match) {
    var varName = match.substr(1, match.length - 2)
    return context ? context[varName] : eval(varName)
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
  calculator.setAmount(parseInt(form.querySelector('[name=amount]').value, 10))
  document.location.href = calculator.amount() <= 150 ? '#tva-20' : '#tva-20-frais-4'
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
