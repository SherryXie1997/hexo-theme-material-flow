const apFixed = new APlayer({
    element: document.getElementById('aplayer-fixed'),
    mutex: true,
    order: 'random',
    lrcType: 3,
    fixed: true,
});
$.ajax({
    url: 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=2663347612',
    success: function (list) {
        apFixed.list.add(JSON.parse(list));
    }
});