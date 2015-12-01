$(document).ready(function() {
  $('#search-term').focus();
});

$('#search-form').submit(function() {
  $('#search-result').empty();
  searchMusic('jp', 'ja_jp', $('#search-term').val());
  return false;
});

function searchMusic(country, lang, term) {
  $('.loading-spinner').css('display', 'block');
  $.ajax({
    url: 'http://itunes.apple.com/search?country=' + country + '&lang=' + lang + '&term=' + term,
    dataType: 'JSONP'
  }).done(function(data) {
    handleResults(data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    handleError(jqXHR, textStatus, errorThrown);
  }).always(function() {
    $('.loading-spinner').css('display', 'none');
  });
}

function handleResults(json) {
  var ractive = new Ractive({
    el: '#search-result',
    template: '#search-result-template',
    data: {
      results: json.results,
      getSimpleDate: function(i) {
        var result = this.get('results.' + i);
        var date = new Date(result.releaseDate);
        return date.toLocaleDateString();
      }
    },
    oncomplete: function() {
      setupCopyButton();
    }
  });
}

function setupCopyButton() {
  $('.copy-button').tooltip({
    trigger: 'manual'
  });
  var client = new ZeroClipboard($('.copy-button'));
  client.on('ready', function(readyEvent) {
    client.on('aftercopy', function(event) {
      $(event.target).tooltip('show');
      setTimeout(function() {
        $(event.target).tooltip('hide');
      }, 1500);
    });
  });

  client.on('noflash wrongflash', function() {
    ZeroClipboard.destroy()
  });
}

function handleError(jqXHR, textStatus, errorThrown) {
  var ractive = new Ractive({
    el: '#search-result',
    template: '#search-error-template',
    data: {
      message: textStatus
    }
  });
}
